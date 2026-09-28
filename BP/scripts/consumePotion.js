/* jshint maxerr: 10000 */
import { world, system, ItemStack, BlockFluidContainerComponent, FluidType, MolangVariableMap, Player } from "@minecraft/server";
import { corruptList, getHerbId, corruptEffect, isEffectValid, getPotionTime, herbsToLore, potionToLore, herbsToElements, bottlePotion, herbDistil, getDistilledEffect } from "./potionCrafting.js";
import { validCandles, diceRoll, essenceCheck } from "./occultMagick.js";
import { capitalize } from "./wandLore.js";
import { attachCustomEffect } from "./faeSpells.js";
import { hasFamiliar, getPresentFamiliarPowers } from "./familiars.js";
import { Vector3, Random } from "./VectorMath/index.js";
import { verifyPatron } from "./altars.js";
import { useItem } from "./blockComp.js";
import { createReagent } from "./Main.js";
import { applySpellDamage } from "./spellDamage.js";

export const customSpellEffects = {
  "bwDuration:photosynthesis": (entity, params) => {
    if (!entity?.isValid) {
      return
    }
    let power = params.amplifier;
    if (power > 1) {
      power = 1;
    }

    let skyLight = entity.dimension.getSkyLightLevel(entity.location);
    let time = world.getTimeOfDay();

    if (skyLight >= 13 && time >= 1000 && time <= 11000) {
      let regen = entity.getEffect("minecraft:regeneration");
      if (regen == undefined) {
        entity.addEffect("minecraft:regeneration", 15 * 20, { amplifier: power == 0 ? undefined : power, showParticles: false });
      } else {
        if (regen.duration < 10 * 20 && regen.amplifier <= power) {
          entity.addEffect("minecraft:regeneration", 15 * 20, { amplifier: power == 0 ? undefined : power, showParticles: false });
        }
      }
    }

    let burning = entity.getComponent("minecraft:onfire");
    if (burning) {
      params.timer = params.timer - 3;
      entity.setDynamicProperty("bwDuration:photosynthesis", JSON.stringify(params));
      entity.setOnFire(2, true);
    }
  },
  "bwDuration:thorns": (entity, params) => {
    if (!entity?.isValid) {
      return
    }
    let power = params.amplifier;
    if (power > 4) {
      power = 4;
    }

    if (params.inversed) {
      let dmg = power + 1;
      if (!entity.getDynamicProperty("bwDuration:stone_skin")) {
        applySpellDamage(entity, dmg, "piercing", 0);
      }

      let slow = entity.getEffect("minecraft:slowness");
      if (slow == undefined) {
        entity.addEffect("minecraft:slowness", 15 * 20, { amplifier: power + 1, showParticles: false });
      } else {
        if (slow.duration < 10 * 20 && slow.amplifier <= power) {
          entity.addEffect("minecraft:slowness", 15 * 20, { amplifier: power + 1, showParticles: false });
        }
      }
    }

    let burning = entity.getComponent("minecraft:onfire");
    if (burning) {
      params.timer = params.timer - 3;
      entity.setDynamicProperty("bwDuration:thorns", JSON.stringify(params));
      entity.setOnFire(2, true);
    }
  },
  "bwDuration:bounty_of_the_forest": (entity, params) => {
    if (!entity?.isValid) {
      return
    }

    let burning = entity.getComponent("minecraft:onfire");
    if (burning) {
      params.timer = params.timer - 3;
      entity.setDynamicProperty("bwDuration:bounty_of_the_forest", JSON.stringify(params));
    }
  },
  "bwDuration:conceal": (entity, params) => {
    if (!entity?.isValid) {
      return
    }
    let power = params.amplifier;
    if (power > 1) {
      power = 1;
    }

    entity.addEffect("minecraft:invisibility", 40, { amplifier: undefined, showParticles: false });
  },
  "bwDuration:sparkles": (entity, params) => {
    if (!entity?.isValid) {
      return
    }

    let molang = new MolangVariableMap();
    let color = {
      red: 0.2 + Math.random(),
      green: 0.15 + Math.random(),
      blue: 0.2 + Math.random()
    }
    molang.setColorRGB("variable.color", color);

    entity.spawnParticle("bw:evoker_spell", entity.location, molang);
  },
  "bwDuration:stone_skin": (entity, params) => {
    if (!entity?.isValid) {
      return
    }
    let power = params.amplifier;
    if (power > 1) {
      power = 1;
    }

    if (params.inversed) {
      entity.addEffect("minecraft:slowness", 45, { showParticles: false, amplifier: 89 });
      entity.addEffect("minecraft:resistance", 45, { showParticles: false, amplifier: 89 });
    }
  },
  "bwDuration:bleed": (entity, params) => {
    if (!entity?.isValid) {
      return
    }
    let power = params.amplifier;
    if (power > 1) {
      power = 1;
    }

    applySpellDamage(entity, 1, "internal", 0);
  },
  "bwDuration:trader_boon": (entity, params) => {
    if (!entity?.isValid) {
      return
    }
    let power = params.amplifier;
    if (power > 8) {
      power = 8;
    }
    if (power == 0) {
      power = undefined;
    }

    entity.addEffect("minecraft:village_hero", 40, { amplifier: power });
  },
  "bwDuration:magickal_absorption": (entity, params) => {
    if (!entity?.isValid) {
      return
    }
    let power = params.amplifier;
    if (power > 9) {
      power = 9;
    }

    if (!params.inversed) {
      return;
    }
    let orbos = world.scoreboard.getObjective("bw:oEnergy");

    let orbosBleed = (power + 1) * 45;
    if (orbos.getScore(entity) >= orbosBleed) {
      orbos.addScore(entity, -orbosBleed);
    } else {
      return;
    }

    let entities = entity.dimension.getEntities({ location: entity.location, maxDistance: 3 });

    if (entities.length > 0) {
      let div = Math.ceil(orbosBleed / entities.length);

      for (let e of entities) {
        let effect = e.getDynamicProperty("bwDuration:magickal_absorption");
        if (!effect) {
          orbos.addScore(e, div);
        }
      }
    }
  },
  "bwDuration:speed_swim": (entity, params) => {
    if (!entity?.isValid) {
      return
    }
    let spd = params.amplifier;

    let movement = entity.getComponent("minecraft:underwater_movement");
    if (movement == undefined) {
      entity.setDynamicProperty("bwDuration:speed_swim", undefined);
      return;
    }

    let newSpd = movement.defaultValue + spd;

    if (params.timer > 1) {
      if (movement.currentValue != newSpd) {
        movement.setCurrentValue(newSpd);
      }
    } else
      if (params.timer == 1) {
        movement.setCurrentValue(movement.defaultValue);
      }
  },
  "bwDuration:debauched_frenzy": (entity, params) => {
    if (!entity?.isValid) {
      return
    }
    let effectPower = params.amplifier;
    if (effectPower > 4) {
      effectPower = 4;
    }

    let entityHealth = entity.getComponent("minecraft:health");
    if (entityHealth?.currentValue > 0) {
      let health = entityHealth?.currentValue;
      let maxHealth = entityHealth?.effectiveMax;
      let percentage = Math.round((health / maxHealth) * 100);

      let strengthPowerArr = [
        [20, 2 + Math.floor(effectPower / 2)],
        [40, 1 + Math.floor(effectPower / 2)],
        [100, undefined]
      ]

      for (let power of strengthPowerArr) {
        if (percentage <= power[0]) {
          entity.addEffect("minecraft:strength", 40, { amplifier: power[0] });
          if (power[1]) {
            entity.addEffect("minecraft:nausea", 40, { amplifier: 1 });
            entity.camera.fade({ fadeColor: { red: 0.517, blue: 0.074, green: 0.098 }, fadeTime: { fadeInTime: 0.5, fadeOutTime: 0.5, holdTime: 0 } });
          }
        }
      }
    }
  },
  "bwDuration:food_chain": (entity, params) => {
    if (!entity?.isValid) {
      return;
    }
    let power = params.amplifier;
    if (power > 3) {
      power = 3;
    }

    if (params.inversed) {
      let predatorEntities = [
        "minecraft:wolf",
        "minecraft:polar_bear",
        "minecraft:zombie",
        "minecraft:husk",
        "minecraft:drowned",
        "minecraft:skeleton",
        "minecraft:stray",
        "minecraft:bogged",
        "minecraft:wither_skeleton"
      ];
      let predators = entity.dimension.getEntities({ location: entity.location, maxDistance: 10 }).filter((e) => {
        if (predatorEntities.includes(e.typeId)) {
          return e;
        }
      });

      for (let predator of predators) {
        if (!predator?.isValid) {
          continue;
        }
        if (predator.id == entity.id) {
          continue;
        }

        let affectedObj = {
          timer: 10,
          vanishOnDeath: true
        }
        let id = "bwDuration:prey_poke";
        if (predator.getDynamicProperty(id) == undefined) {
          predator.applyDamage(0.00107, { cause: "entityAttack", damagingEntity: entity });
          predator.setDynamicProperty(id, JSON.stringify(affectedObj));
        }
      }
    } else {
      entity.addEffect("minecraft:strength", 15 * 20);
      entity.addEffect("minecraft:speed", 15 * 20);
    }
  },
  "bwDuration:dehydrated": (entity, params) => {
    if (!entity?.isValid) {
      return
    }
    let power = params.amplifier;
    if (power > 1) {
      power = 1;
    }

    entity.addEffect("minecraft:mining_fatigue", 40, { amplifier: 3, showParticles: false });
    entity.addEffect("minecraft:slowness", 40, { amplifier: 2, showParticles: false });
    entity.addEffect("minecraft:weakness", 40, { amplifier: 3, showParticles: false });
  },
  "bwDuration:illuminate": (entity, params) => {
    if (!entity?.isValid) {
      return
    }

    let f = (dim, pos) => {
      try {
        if (dim.isChunkLoaded(pos)) {
          let blk = dim.getBlock(pos);
          if (blk.isAir || blk.isLiquid) {
            return blk;
          }
        }
      } catch (e) {
        return true;
      }
      return false;
    }

    let block = f(entity.dimension, entity.location);
    if (!block) {
      block = f(entity.dimension, entity.getHeadLocation());
      if (!block) {
        block = f(entity.dimension, Vector3.add(entity.getHeadLocation(), Vector3.up()));
        if (!block) {
          return;
        }
      }
    }

    block.setType("minecraft:light_block_10");
    system.runTimeout(() => {
      if (block.typeId == "minecraft:light_block_10") {
        block.setType("minecraft:air");
      }
    }, 40)
  },
  // Who Game: Nosferat
  "bwDuration:blood_lust": (entity, params) => {
    if (!entity?.isValid) {
      return;
    }
    let power = params.amplifier;
    if (power > 4) {
      power = 4;
    }

    let hunger = entity.getComponent("minecraft:player.hunger");

    if (hunger) {
      if (hunger.currentValue > hunger.effectiveMin) {
        if (params.sated == 0) {
          e.camera.fade({ fadeColor: { red: 0.45, green: 0.1, blue: 0.15 }, fadeTime: { fadeInTime: 0.5, fadeOutTime: 0.5, holdTime: 0 } });
          hunger.setCurrentValue(hunger.currentValue - 1);
        } else {
          // CON Save
          if (diceRoll(1, 20, true) < 12) {
            params.sated = params.sated - 1;
            entity.setDynamicProperty("bwDuration:blood_lust", JSON.stringify(params));
          }
        }
      }
    }
  }
}

// Items that should NOT and should be custom reagents if detected 
let invalidCustomReagents = [
  "minecraft:potion",
  "bw:strange_potion",
  "bw:raw_orbos"
]
let validCustomReagents = [
  "bumble:chamomile_bundle",
  "bumble:lavender_bundle",
  "bumble:mint_bundle",
  "bumble:fermented_grapes",
  "bumble:aloe_leaf",

  // Bums Flowers
  "bumble:dafodil_white_item",
  "bumble:dafodil_yellow_item",
  "bumble:hyacinth_blue_item",
  "bumble:hyacinth_white_item",
  "bumble:hyacinth_pink_item",
  "bumble:hyacinth_purple_item",
  "bumble:gold_rose_item",
  "bumble:iris_item",
  "bumble:lupines_blue_item",
  "bumble:lupines_pink_item",
  "bumble:morning_glory_pink_item",
  "bumble:mums_orange_item",
  "bumble:mums_red_item",
  "bumble:mums_white_item",
  "bumble:mums_yellow_item",
  "bumble:pansies_purple_item",
  "bumble:small_rose_item",
  "bumble:snapdragons_item"
]

// All Trasmutation Recipes
const transmutationRecipes = [
  // Saplings
  {
    "itemsRequired": [
      {
        "type": "minecraft:oak_sapling",
        "amount": 1
      },
      {
        "type": "minecraft:birch_sapling",
        "amount": 1
      },
      {
        "type": "minecraft:spruce_sapling",
        "amount": 1
      },
      {
        "type": "minecraft:jungle_sapling",
        "amount": 1
      },
      {
        "type": "minecraft:acacia_sapling",
        "amount": 1
      },
      {
        "type": "minecraft:dark_oak_sapling",
        "amount": 1
      },
      {
        "type": "minecraft:cherry_sapling",
        "amount": 1
      },
      {
        "type": "minecraft:mangrove_propagule",
        "amount": 1
      },
      {
        "type": "minecraft:pale_oak_sapling",
        "amount": 1
      }
    ],
    "targetNumber": 1,
    "energies": {
      "earth": 3
    },
    "brewTime": 3,
    "outputType": "randomize",
    "outputItems": [
      {
        "type": "minecraft:oak_sapling",
        "amount": 1
      },
      {
        "type": "minecraft:birch_sapling",
        "amount": 1
      },
      {
        "type": "minecraft:spruce_sapling",
        "amount": 1
      },
      {
        "type": "minecraft:jungle_sapling",
        "amount": 1
      },
      {
        "type": "minecraft:acacia_sapling",
        "amount": 1
      },
      {
        "type": "minecraft:dark_oak_sapling",
        "amount": 1
      },
      {
        "type": "minecraft:cherry_sapling",
        "amount": 1
      },
      {
        "type": "minecraft:mangrove_propagule",
        "amount": 1
      },
      {
        "type": "minecraft:pale_oak_sapling",
        "amount": 1
      }
    ]
  },
  // Bonemeal
  {
    "itemsRequired": [
      {
        "type": "minecraft:wheat",
        "amount": 3
      },
      {
        "type": "minecraft:beetroot",
        "amount": 3
      },
      {
        "type": "minecraft:carrot",
        "amount": 3
      },
      {
        "type": "minecraft:potato",
        "amount": 3
      },
      {
        "type": "minecraft:poisonous_potato",
        "amount": 3
      }
    ],
    "targetNumber": 1,
    "energies": {
      "earth": 3
    },
    "brewTime": 4,
    "outputType": "sequence",
    "outputItems": [
      {
        "type": "minecraft:bone_meal",
        "amount": 1
      }
    ]
  },
  // Sculk Catalyst
  {
    "itemsRequired": [
      {
        "necessary": true,
        "type": "minecraft:bone",
        "amount": 4
      },
      {
        "necessary": true,
        "type": "minecraft:echo_shard",
        "amount": 1
      }
    ],
    "targetNumber": 2,
    "energies": {
      "earth": 200,
      "ender": 120,
      "lunar": 60
    },
    "brewTime": 8,
    "outputType": "sequence",
    "outputItems": [
      {
        "type": "minecraft:sculk_catalyst",
        "amount": 1
      }
    ]
  },
  // Ink
  {
    "itemsRequired": [
      {
        "necessary": true,
        "type": "minecraft:glow_ink_sac",
        "amount": 1
      }
    ],
    "targetNumber": 1,
    "energies": {
      "earth": 5
    },
    "brewTime": 3,
    "outputType": "sequence",
    "outputItems": [
      {
        "type": "minecraft:ink_sac",
        "amount": 1
      }
    ]
  },
  // Glowing Ink
  {
    "itemsRequired": [
      {
        "necessary": true,
        "type": "minecraft:ink_sac",
        "amount": 1
      }
    ],
    "targetNumber": 1,
    "energies": {
      "lunar": 5
    },
    "brewTime": 3,
    "outputType": "sequence",
    "outputItems": [
      {
        "type": "minecraft:glow_ink_sac",
        "amount": 1
      }
    ]
  },
  // Infused Pumpkin
  {
    "itemsRequired": [
      {
        "necessary": true,
        "type": "minecraft:pumpkin_seeds",
        "amount": 1
      },
      {
        "necessary": true,
        "type": "minecraft:bone_meal",
        "amount": 2
      },
      {
        "necessary": true,
        "type": "bw:natural_ash",
        "amount": 2
      }
    ],
    "targetNumber": 3,
    "energies": {
      "earth": 30,
      "lunar": 15
    },
    "brewTime": 5,
    "outputType": "sequence",
    "outputItems": [
      {
        "type": "bw:infused_pumpkin",
        "amount": 1
      }
    ]
  },
  // Budding Amethyst
  {
    "itemsRequired": [
      {
        "necessary": true,
        "type": "minecraft:amethyst_shard",
        "amount": 8
      },
      {
        "necessary": true,
        "type": "minecraft:bone_meal",
        "amount": 1
      }
    ],
    "targetNumber": 2,
    "energies": {
      "earth": 240,
      "lunar": 40,
      "solar": 40
    },
    "brewTime": 10,
    "outputType": "sequence",
    "outputItems": [
      {
        "type": "minecraft:budding_amethyst",
        "amount": 1
      }
    ]
  },
  // Pointed Dripstone
  {
    "itemsRequired": [
      {
        "necessary": true,
        "type": "minecraft:stick",
        "amount": 1
      },
      {
        "necessary": true,
        "type": "minecraft:dripstone_block",
        "amount": 1
      }
    ],
    "targetNumber": 2,
    "energies": {
      "earth": 60,
      "sky": 30
    },
    "brewTime": 6,
    "outputType": "sequence",
    "outputItems": [
      {
        "type": "minecraft:pointed_dripstone",
        "amount": 4
      }
    ]
  },
  // Breeze Rod
  {
    "itemsRequired": [
      {
        "necessary": true,
        "type": "minecraft:stick",
        "amount": 1
      },
      {
        "necessary": true,
        "type": "minecraft:phantom_membrane",
        "amount": 2
      },
      {
        "necessary": true,
        "type": "minecraft:feather",
        "amount": 1
      }
    ],
    "targetNumber": 3,
    "energies": {
      "earth": 20,
      "sky": 320
    },
    "brewTime": 6,
    "outputType": "sequence",
    "outputItems": [
      {
        "type": "minecraft:breeze_rod",
        "amount": 1
      }
    ]
  },
  // Blaze Rod
  {
    "itemsRequired": [
      {
        "necessary": true,
        "type": "minecraft:stick",
        "amount": 1
      },
      {
        "necessary": true,
        "type": "bw:coal_dust",
        "amount": 4
      },
      {
        "necessary": true,
        "type": "minecraft:gunpowder",
        "amount": 2
      }
    ],
    "targetNumber": 3,
    "energies": {
      "earth": 20,
      "solar": 320
    },
    "brewTime": 6,
    "outputType": "sequence",
    "outputItems": [
      {
        "type": "minecraft:blaze_rod",
        "amount": 1
      }
    ]
  },
  // Shulker Shell
  {
    "itemsRequired": [
      {
        "necessary": true,
        "type": "bw:natural_ash",
        "amount": 1
      },
      {
        "type": "minecraft:turtle_scute",
        "amount": 1
      },
      {
        "type": "minecraft:armadillo_scute",
        "amount": 1
      }
    ],
    "targetNumber": 2,
    "energies": {
      "ender": 120
    },
    "brewTime": 4,
    "outputType": "sequence",
    "outputItems": [
      {
        "type": "minecraft:shulker_shell",
        "amount": 1
      }
    ]
  },
  // Turtle Scute / Armadillo Scute
  {
    "itemsRequired": [
      {
        "necessary": true,
        "type": "minecraft:shulker_shell",
        "amount": 1
      }
    ],
    "targetNumber": 1,
    "energies": {
      "earth": 60,
      "lunar": 60
    },
    "brewTime": 4,
    "outputType": "randomize",
    "outputItems": [
      {
        "type": "minecraft:turtle_scute",
        "amount": 1
      },
      {
        "type": "minecraft:armadillo_scute",
        "amount": 1
      }
    ]
  },
  // Trident
  {
    "itemsRequired": [
      {
        "necessary": true,
        "type": "minecraft:iron_spear",
        "amount": 1
      },
      {
        "necessary": true,
        "type": "minecraft:prismarine_shard",
        "amount": 3
      }
    ],
    "targetNumber": 2,
    "energies": {
      "sky": 120,
      "lunar": 240
    },
    "brewTime": 8,
    "outputType": "sequence",
    "outputItems": [
      {
        "type": "minecraft:trident",
        "amount": 1
      }
    ]
  },
  // Sea Lantern
  {
    "itemsRequired": [
      {
        "necessary": true,
        "type": "minecraft:glowstone",
        "amount": 1
      }
    ],
    "targetNumber": 1,
    "energies": {
      "lunar": 60
    },
    "brewTime": 4,
    "outputType": "sequence",
    "outputItems": [
      {
        "type": "minecraft:sea_lantern",
        "amount": 1
      }
    ]
  },
  // Glowstone Dust
  {
    "itemsRequired": [
      {
        "necessary": true,
        "type": "minecraft:blaze_powder",
        "amount": 2
      },
      {
        "type": "minecraft:stone",
        "amount": 1
      },
      {
        "type": "minecraft:granite",
        "amount": 1
      },
      {
        "type": "minecraft:andesite",
        "amount": 1
      },
      {
        "type": "minecraft:diorite",
        "amount": 1
      }
    ],
    "targetNumber": 2,
    "energies": {
      "solar": 30
    },
    "brewTime": 5,
    "outputType": "sequence",
    "outputItems": [
      {
        "type": "minecraft:glowstone_dust",
        "amount": 4
      }
    ]
  },
  // Crying Obsidian
  {
    "itemsRequired": [
      {
        "necessary": true,
        "type": "minecraft:obsidian",
        "amount": 1
      },
      {
        "necessary": true,
        "type": "bw:amethyst_dust",
        "amount": 1
      }
    ],
    "targetNumber": 2,
    "energies": {
      "ender": 120
    },
    "brewTime": 6,
    "outputType": "sequence",
    "outputItems": [
      {
        "type": "minecraft:crying_obsidian",
        "amount": 1
      }
    ]
  },
  // Ender Pearl
  {
    "itemsRequired": [
      {
        "necessary": true,
        "type": "minecraft:obsidian",
        "amount": 1
      },
      {
        "necessary": true,
        "type": "minecraft:slime_ball",
        "amount": 2
      },
      {
        "necessary": true,
        "type": "minecraft:chorus_fruit",
        "amount": 2
      }
    ],
    "targetNumber": 3,
    "energies": {
      "ender": 70
    },
    "brewTime": 6,
    "outputType": "sequence",
    "outputItems": [
      {
        "type": "minecraft:ender_pearl",
        "amount": 2
      }
    ]
  },
  // Cactus
  {
    "itemsRequired": [
      {
        "necessary": true,
        "type": "minecraft:sand",
        "amount": 1
      },
      {
        "necessary": true,
        "type": "minecraft:wheat_seeds",
        "amount": 2
      }
    ],
    "targetNumber": 2,
    "energies": {
      "solar": 10,
      "earth": 10
    },
    "brewTime": 3,
    "outputType": "sequence",
    "outputItems": [
      {
        "type": "minecraft:cactus",
        "amount": 2
      }
    ]
  },
  // Seeds
  {
    "itemsRequired": [
      {
        "type": "minecraft:wheat_seeds",
        "amount": 1
      },
      {
        "type": "minecraft:melon_seeds",
        "amount": 1
      },
      {
        "type": "minecraft:pumpkin_seeds",
        "amount": 1
      },
      {
        "type": "minecraft:cocoa_beans",
        "amount": 1
      },
      {
        "type": "minecraft:beetroot_seeds",
        "amount": 1
      }
    ],
    "targetNumber": 1,
    "energies": {
      "solar": 5,
      "earth": 5
    },
    "brewTime": 2,
    "outputType": "randomize",
    "outputItems": [
      {
        "type": "minecraft:wheat_seeds",
        "amount": 1
      },
      {
        "type": "minecraft:melon_seeds",
        "amount": 1
      },
      {
        "type": "minecraft:pumpkin_seeds",
        "amount": 1
      },
      {
        "type": "minecraft:cocoa_beans",
        "amount": 1
      },
      {
        "type": "minecraft:beetroot_seeds",
        "amount": 1
      }
    ]
  },
  // Raw Iron
  {
    "itemsRequired": [
      {
        "necessary": true,
        "type": "minecraft:raw_copper",
        "amount": 2
      }
    ],
    "targetNumber": 1,
    "energies": {
      "earth": 15
    },
    "brewTime": 8,
    "outputType": "sequence",
    "outputItems": [
      {
        "type": "minecraft:raw_iron",
        "amount": 1
      }
    ]
  },
  // Raw Gold
  {
    "itemsRequired": [
      {
        "necessary": true,
        "type": "minecraft:raw_iron",
        "amount": 2
      }
    ],
    "targetNumber": 1,
    "energies": {
      "earth": 15,
      "solar": 15
    },
    "brewTime": 8,
    "outputType": "sequence",
    "outputItems": [
      {
        "type": "minecraft:raw_gold",
        "amount": 1
      }
    ]
  },
  // Diamonds
  {
    "itemsRequired": [
      {
        "type": "minecraft:coal",
        "amount": 16
      },
      {
        "type": "minecraft:charcoal",
        "amount": 32
      }
    ],
    "targetNumber": 1,
    "energies": {
      "earth": 600
    },
    "brewTime": 12,
    "outputType": "sequence",
    "outputItems": [
      {
        "type": "minecraft:diamond",
        "amount": 1
      }
    ]
  },
  // Amethyst Nugget
  {
    "itemsRequired": [
      {
        "necessary": true,
        "type": "minecraft:empty_map",
        "amount": 1
      },
      {
        "necessary": true,
        "type": "minecraft:amethyst_shard",
        "amount": 1
      }
    ],
    "targetNumber": 2,
    "energies": {
      "earth": 40
    },
    "brewTime": 5,
    "outputType": "sequence",
    "outputItems": [
      {
        "type": "bw:amethyst_nugget",
        "amount": 4
      }
    ]
  },
  // Crystals
  {
    "itemsRequired": [
      {
        "type": "minecraft:quartz",
        "amount": 1
      },
      {
        "type": "minecraft:amethyst_shard",
        "amount": 1
      }
    ],
    "targetNumber": 1,
    "energies": {
      "earth": 70
    },
    "brewTime": 6,
    "outputType": "randomize",
    "outputItems": [
      {
        "type": "minecraft:quartz",
        "amount": 1
      },
      {
        "type": "minecraft:amethyst_shard",
        "amount": 1
      }
    ]
  },
  // Flint
  {
    "itemsRequired": [
      {
        "type": "minecraft:gravel",
        "amount": 1
      }
    ],
    "targetNumber": 1,
    "energies": {
      "earth": 50,
      "sky": 10
    },
    "brewTime": 3,
    "outputType": "sequence",
    "outputItems": [
      {
        "type": "minecraft:flint",
        "amount": 1
      }
    ]
  },
  // Golden Apple
  {
    "itemsRequired": [
      {
        "necessary": true,
        "type": "minecraft:apple",
        "amount": 1
      },
      {
        "necessary": true,
        "type": "minecraft:gold_nugget",
        "amount": 8
      }
    ],
    "targetNumber": 2,
    "energies": {
      "solar": 120
    },
    "brewTime": 6,
    "outputType": "sequence",
    "outputItems": [
      {
        "type": "minecraft:golden_apple",
        "amount": 1
      }
    ]
  },
  // Enchanted Golden Apple
  {
    "itemsRequired": [
      {
        "necessary": true,
        "type": "minecraft:apple",
        "amount": 1
      },
      {
        "necessary": true,
        "type": "minecraft:gold_ingot",
        "amount": 8
      }
    ],
    "targetNumber": 2,
    "energies": {
      "solar": 300
    },
    "brewTime": 6,
    "outputType": "sequence",
    "outputItems": [
      {
        "type": "minecraft:enchanted_golden_apple",
        "amount": 1
      }
    ]
  },
  // Orbic Honey Bottle
  {
    "itemsRequired": [
      {
        "necessary": true,
        "type": "minecraft:glass_bottle",
        "amount": 1
      },
      {
        "necessary": true,
        "type": "bw:honey_orbos",
        "amount": 3
      }
    ],
    "targetNumber": 2,
    "energies": {
      "solar": 120,
      "earth": 60
    },
    "brewTime": 5,
    "outputType": "sequence",
    "outputItems": [
      {
        "type": "bw:honey_orbos_bottle",
        "amount": 1
      }
    ]
  },
  // Honeycombs & Raw Orbos
  {
    "itemsRequired": [
      {
        "necessary": true,
        "type": "bw:honey_orbos",
        "amount": 1
      }
    ],
    "targetNumber": 1,
    "energies": {
      "earth": 10
    },
    "brewTime": 2,
    "outputType": "sequence",
    "outputItems": [
      {
        "type": "minecraft:honeycomb",
        "amount": 1
      },
      {
        "type": "bw:raw_orbos",
        "amount": 1
      }
    ]
  },
  // Raw Orbos (From Essences)
  {
    "itemsRequired": [
      {
        "type": "bw:essence",
        "amount": 1
      },
      {
        "type": "bw:anti_essence",
        "amount": 1
      },
    ],
    "targetNumber": 1,
    "energies": {
      "ender": 10
    },
    "brewTime": 4,
    "outputType": "sequence",
    "outputItems": [
      {
        "type": "bw:raw_orbos",
        "amount": 1
      }
    ]
  },
  // Raw Orbos (From Quintessence)
  {
    "itemsRequired": [
      {
        "type": "bw:pure_quintessence",
        "amount": 1
      },
      {
        "type": "bw:mixed_quintessence",
        "amount": 1
      },
    ],
    "targetNumber": 1,
    "energies": {
      "ender": 10
    },
    "brewTime": 6,
    "outputType": "sequence",
    "outputItems": [
      {
        "type": "bw:raw_orbos",
        "amount": 5
      }
    ]
  },
  // Blood Essences
  {
    "itemsRequired": [
      {
        "necessary": true,
        "type": "bw:blood_vial",
        "amount": 1
      }
    ],
    "targetNumber": 1,
    "energies": {
      "sky": 30,
      "earth": 30,
      "lunar": 30,
      "solar": 30,
      "ender": 30,
    },
    "brewTime": 5,
    "outputType": "blood_essence",
    "outputItems": "essence"
  },
  // Paper
  {
    "itemsRequired": [
      {
        "necessary": true,
        "type": "bw:natural_ash",
        "amount": 1
      },
      {
        "type": "minecraft:sugar_cane",
        "amount": 1
      },
      {
        "type": "minecraft:bamboo",
        "amount": 1
      }
    ],
    "targetNumber": 2,
    "energies": {
      "solar": 5,
      "sky": 5
    },
    "brewTime": 4,
    "outputType": "sequence",
    "outputItems": [
      {
        "type": "minecraft:paper",
        "amount": 1
      }
    ]
  },
  // Leather
  {
    "itemsRequired": [
      {
        "necessary": true,
        "type": "minecraft:rotten_flesh",
        "amount": 3
      },
      {
        "necessary": true,
        "type": "bw:natural_ash",
        "amount": 1
      }
    ],
    "targetNumber": 1,
    "energies": {
      "solar": 10
    },
    "brewTime": 3,
    "outputType": "sequence",
    "outputItems": [
      {
        "type": "minecraft:leather",
        "amount": 1
      }
    ]
  }
]


const essenceTypes = [
  "Ego",
  "Species",
  "Familia",
  "Coventus",
  "Aquis",
  "Ignis",
  "Volante",
  "Vitalus",
  "Esuritio"
];
export const essenceInputs = {
  "Ego": "string",
  "Species": "string",
  "Familia": "string",
  "Coventus": "string",
  "Aquis": "bool",
  "Ignis": "bool",
  "Volante": "bool",
  "Vitalus": "int",
  "Esuritio": "int"
};
// Essence Craft
function gatherEssentia(bloodStr, dim, loc) {
  let parsedBlood = JSON.parse(bloodStr);
  let spawned = false;
  let targetEntity = world.getEntity(parsedBlood.id);
  let essences = {
    "Species": parsedBlood.type
  }

  if (targetEntity == undefined) {
    if (parsedBlood.type != "minecraft:player") {
      targetEntity = dim.spawnEntity(parsedBlood.type, loc);
      spawned = true;
    } else {
      targetEntity = world.getEntity(parsedBlood.id);

      // No mob, no player
      if (targetEntity == undefined) {
        return essences;
      } else {
        essences["Ego"] = targetEntity.name;
      }
    }
  }

  // Essence of Name
  if (essences["Ego"] == undefined) {
    if (targetEntity.nameTag != undefined && targetEntity.nameTag != "") {
      essences["Ego"] = targetEntity.nameTag;
    }
  }

  // Essence of Family/Relation, Familia
  if (targetEntity.getComponent("minecraft:type_family")) {
    let fam = targetEntity.getComponent("minecraft:type_family");
    let foundFamilies = [];
    // Double check this function
    for (let f of fam.getTypeFamilies()) {
      if (diceRoll(1, 20) > 12) {
        foundFamilies.push(f);
      }
    }
    essences["Familia"] = foundFamilies;
  }

  // Essence of Coven
  if (targetEntity.getDynamicProperty("bw:coven")) {
    if (diceRoll(1, 20) > 14) {
      essences["Coventus"] = targetEntity.getDynamicProperty("bw:coven");
    }
  }

  // Essences of Breathable Essences
  if (targetEntity.getComponent("minecraft:breathable")) {
    let breathable = targetEntity.getComponent("minecraft:breathable");

    if (breathable.breathesWater && !breathable.breathesAir) {
      if (diceRoll(1, 20) > 14) {
        essences["Aquis"] = true;
      }
    }
  }

  // Essence of Fire Immune Creatures
  if (targetEntity.getComponent("minecraft:fire_immune")) {
    if (diceRoll(1, 20) > 12) {
      essences["Ignis"] = true;
    }
  }

  // Essence of Flight, Hover, Glide
  if (targetEntity.getComponent("minecraft:movement.hover") || targetEntity.getComponent("minecraft:movement.fly") || targetEntity.getComponent("minecraft:movement.glide")) {
    if (diceRoll(1, 20) > 12) {
      essences["Volante"] = true;
    }
  }

  // Essence of Health
  if (targetEntity.getComponent("minecraft:health")) {
    let health = targetEntity.getComponent("minecraft:health").currentValue;
    if (diceRoll(1, 20) > 14) {
      essences["Vitalus"] = Math.floor(health);
    }
  }

  // Essence of Hunger
  if (targetEntity.getComponent("minecraft:player.hunger")) {
    let hunger = targetEntity.getComponent("minecraft:player.hunger").currentValue;
    if (diceRoll(1, 20) > 14) {
      essences["Esuritio"] = Math.floor(hunger);
    }
  }

  // Despawn spawned Entity
  if (spawned && targetEntity.isValid) {
    targetEntity.remove();
  }

  return essences;
}

// Combine Essences
export function combineEssences(block, inv) {
  // Determines what the final item will be
  let finalItem = "bw:pure_quintessence";
  // Determines the dynamic property called "bw:quintessence";
  let quint = {};
  // Make a translator function to read Quintessence Objects.
  let essencesFound = [];
  let essenceCount = 0;

  for (let i = 0; i < inv.size; i++) {
    let item = inv.getItem(i);

    if (item == undefined) {
      continue;
    }

    if (item.typeId == "bw:essence") {
      if (essenceCount > 7) {
        continue;
      }

      let lore = item.getLore();
      if (lore.length >= 2) {
        let parsedType = lore[0].split(": ")[1];
        let parsedValue = lore[1].split(": ")[1];

        if (essenceTypes.includes(parsedType)) {
          let input = essenceInputs[parsedType];

          switch (input) {
            case "string": {
              if (quint[parsedType] == undefined) {
                quint[parsedType] = [parsedValue];
              } else {
                quint[parsedType].push(parsedValue);
              }
              break;
            }
            case "int": {
              let num = Number(parsedValue);
              if (!isNaN(num) && (quint[parsedType] == undefined || Math.abs(quint[parsedType]) < num)) {
                quint[parsedType] = num;
              }
              break;
            }
            case "bool": {
              quint[parsedType] = true;
              break;
            }
          }
        }
        essencesFound.push(i);
        essenceCount++;
      }
    }
    if (item.typeId == "bw:anti_essence") {
      if (essenceCount > 7) {
        continue;
      }
      let lore = item.getLore();
      if (lore.length >= 2) {
        let parsedType = lore[0].split(": ")[1];
        let parsedValue = lore[1].split(": ")[1];

        if (essenceTypes.includes(parsedType)) {
          let input = essenceInputs[parsedType];

          switch (input) {
            case "string": {
              if (quint[parsedType] == undefined) {
                quint[parsedType] = ["$" + parsedValue];
              } else {
                quint[parsedType].push("$" + parsedValue);
              }
              break;
            }
            case "int": {
              let num = Number(parsedValue);
              if (!isNaN(num) && (quint[parsedType] == undefined || Math.abs(quint[parsedType]) < num)) {
                quint[parsedType] = -num;
              }
              break;
            }
            case "bool": {
              quint[parsedType] = false;
              break;
            }
          }
        }
        essencesFound.push(i);
        essenceCount++;
      }
    }
    if (item.typeId == "bw:pure_quintessence") {
      if (quint.quintessences != undefined && quint.quintessences.length >= 3) {
        continue;
      }

      if (item.getDynamicProperty("bw:quintessence")) {
        // Change quint type
        if (finalItem == "bw:pure_quintessence") {
          finalItem = "bw:mixed_quintessence";
        }

        if (quint.quintessences == undefined) {
          quint.quintessences = [];
        }

        if (quint.quintessences.length < 3) {
          quint.quintessences.push(JSON.parse(item.getDynamicProperty("bw:quintessence")));
          essencesFound.push(i);
        }
      }
    }
  }

  if (essencesFound.length > 0) {
    for (let ess of essencesFound) {
      let essItem = inv.getItem(ess);
      inv.setItem(ess, useItem(essItem));
    }

    let quintItem = new ItemStack(finalItem, 1);
    quintItem.setDynamicProperty("bw:quintessence", JSON.stringify(quint));
    quintItem.setLore(["§r§bTiny bits of the soul linger within this ephemeral item..."]);
    if (inv.emptySlotsCount > 0) {
      inv.addItem(quintItem);
    } else {
      block.above(1).dimension.spawnItem(quintItem, block.center());
    }
  }
}


export function findCustomReagent(item) {
  if (item == undefined) {
    return;
  }
  if (!invalidCustomReagents.includes(item.typeId) && (item.getComponent("minecraft:food") || validCustomReagents.includes(item.typeId) || item.hasTag("minecraft:is_food"))) {
    if (world.getDynamicProperty(`bw_customIngredient:${item.typeId}`) == undefined) {
      createReagent(item.typeId);
    } else {
      let reagent = JSON.parse(world.getDynamicProperty(`bw_customIngredient:${item.typeId}`));
      if (reagent.secondaryEffects == undefined) {
        createReagent(item.typeId);
      }
    }
  }
}

// Add Heat to it
function getHeat(block) {
  let temporaryHeat = [
    "minecraft:campfire"
  ];
  let permanentHeat = [
    "minecraft:magma",
    "minecraft:lava",
    "minecraft:fire",
    "minecraft:flowing_lava"
  ];
  let temporarySpiritualHeat = [
    "minecraft:soul_campfire"
  ];
  let permanentSpiritualHeat = [
    "minecraft:soul_fire"
  ];

  if (temporaryHeat.includes(block.typeId)) {
    if (!block.permutation.getState("extinguished")) {
      return "potionHeat"
    }
  }
  if (temporarySpiritualHeat.includes(block.typeId)) {
    if (!block.permutation.getState("extinguished")) {
      return "transmuteHeat"
    }
  }
  if (permanentHeat.includes(block.typeId)) {
    return "potionHeat"
  }
  if (permanentSpiritualHeat.includes(block.typeId)) {
    return "transmuteHeat"
  }

  return false;
}
// Check Cauldron every second
system.runInterval(() => {
  let allProperties = world.getDynamicPropertyIds();
  let revisedCauldrons = [];
  for (let p of allProperties) {
    if (p.startsWith("bwPotion:")) {
      revisedCauldrons.push(p);
    }
  }
  for (let cauldron of revisedCauldrons) {
    let enchantedCauldron = world.getDynamicProperty(cauldron);

    if (enchantedCauldron == undefined) {
      continue;
    } else {
      enchantedCauldron = JSON.parse(world.getDynamicProperty(cauldron));
    }

    let dimension = world.getDimension(enchantedCauldron.dimension);

    if (!dimension.isChunkLoaded(enchantedCauldron.location)) {
      continue;
    }

    world.setDynamicProperty(cauldron, JSON.stringify(enchantedCauldron));

    let blockCauldron = world.getDimension(enchantedCauldron.dimension).getBlock(enchantedCauldron.location);
    let heatSource = blockCauldron?.below(1);

    if (blockCauldron.typeId == "minecraft:cauldron") {
      let setCauldron = blockCauldron.getComponent(BlockFluidContainerComponent.componentId);
      enchantedCauldron.heated = getHeat(heatSource);
      if (enchantedCauldron.heated) {
        // Pot must be filled to a certain degree
        if (setCauldron.fillLevel > 0 && setCauldron.getFluidType() == FluidType.Water) {
          blockCauldron.dimension.playSound("liquid.water", enchantedCauldron.location, { pitch: Random.Range(0.1, 0.45), volume: 0.9 });
          let mol = new MolangVariableMap();
          let particleColor = {
            red: 0.22,
            green: 0.365,
            blue: 0.776
          }
          if (setCauldron.fluidColor.red == 0 && setCauldron.fluidColor.blue == 0 && setCauldron.fluidColor.green == 0) {
            mol.setColorRGB("variable.color", {
              red: 0.22,
              green: 0.365,
              blue: 0.776
            });
          } else {
            mol.setColorRGB("variable.color", setCauldron.fluidColor);
            particleColor = setCauldron.fluidColor;
          }

          let multiplier = enchantedCauldron.brewTime;
          if (enchantedCauldron.brewTime > 4) {
            multiplier = 4
          } else {
            if (isNaN(enchantedCauldron.brewTime)) {
              multiplier = 1
            }
          }
          mol.setFloat("variable.boil_rate", 7 * multiplier);

          let height = Math.ceil(setCauldron.fillLevel / 2) * 0.317;
          if (height == 0) {
            height = 0.317;
          }
          mol.setVector3("variable.water_height", {
            x: 0.5,
            y: height,
            z: 0.5
          });

          // Damage non-item creatures in the pot
          // Do bubble particles if not portal cauldron
          if (enchantedCauldron.portal == undefined) {
            blockCauldron.dimension.getEntities({ location: blockCauldron.center(), excludeTypes: ["minecraft:item"], maxDistance: 0.45 }).forEach((e) => {
              e.applyDamage(2, { cause: "fire" });
            });
            blockCauldron.dimension.spawnParticle("bw:cauldron_bubble", enchantedCauldron.location, mol);
          } else {
            if (enchantedCauldron.heated == "potionHeat") {
              let ents = blockCauldron.dimension.getEntities({ location: blockCauldron.center(), maxDistance: 0.45 });
              cauldronTeleport(ents, cauldron, enchantedCauldron, particleColor);
            }
            blockCauldron.dimension.spawnParticle("bw:basic_cauldron_portal_particle", enchantedCauldron.location, mol);
          }

          // There are ingredients in here
          if (Object.keys(enchantedCauldron.contents).length > 0) {
            blockCauldron.dimension.spawnParticle("bw:basic_cauldron_particle", blockCauldron.above().bottomCenter(), mol);
          }

          if (enchantedCauldron.brewTime == 0 && enchantedCauldron.portal == undefined) {
            if (enchantedCauldron.heated == "potionHeat") {
              if (world.getDynamicProperty(`herb_${cauldron}`) == undefined) {
                let items = blockCauldron.dimension.getEntities({ location: blockCauldron.center(), includeType: "minecraft:item", maxDistance: 0.45 });
                if (items.length > 0) {
                  enchantedCauldron = brewItemEntity(items[0], blockCauldron, cauldron, enchantedCauldron);
                }
              } else {
                brewIngredients(JSON.parse(world.getDynamicProperty(`herb_${cauldron}`)), blockCauldron, cauldron, enchantedCauldron);
                continue;
              }
            }

            if (enchantedCauldron.heated == "transmuteHeat") {
              if (enchantedCauldron.capacity == 0) {
                if (world.getDynamicProperty(`transmute_${cauldron}`) == undefined) {
                  let items = blockCauldron.dimension.getEntities({ location: blockCauldron.center(), includeType: "minecraft:item", maxDistance: 0.45 });
                  if (items.length > 0) {
                    enchantedCauldron = brewCrystalEntity(items[0], blockCauldron, enchantedCauldron);
                  }
                } else {
                  brewTransmutation(JSON.parse(world.getDynamicProperty(`transmute_${cauldron}`)), blockCauldron, cauldron, enchantedCauldron);
                  continue;
                }
              } else
                if (enchantedCauldron.capacity > 0) {
                  enchantedCauldron.capacity = 0;
                  enchantedCauldron.contents = {};
                  enchantedCauldron.secondary = undefined;
                  enchantedCauldron.brewTime = 0;
                  enchantedCauldron.elements = {};
                  setCauldron.fluidColor = {
                    "red": 0,
                    "blue": 0,
                    "green": 0,
                    "alpha": 0
                  }
                }
            }
          }
        }

        // Cauldron brew and witch pot bubble!
        if (enchantedCauldron.brewTime > 0) {
          enchantedCauldron.brewTime = enchantedCauldron.brewTime - 1;
          blockCauldron.dimension.playSound("block.lava.ambient", enchantedCauldron.location, { pitch: Random.Range(0.8, 1.4), volume: 0.9 });
        }

        // Increase Distillation
        // If more than 1 reagent, cancel Distillation.
        if (enchantedCauldron.brewTime == 0 && Object.keys(enchantedCauldron.contents).length == 1 && (enchantedCauldron.distilTime == undefined || enchantedCauldron.distilTime < 15)) {
          if (enchantedCauldron.distilTime == undefined) {
            enchantedCauldron.distilTime = 1;
          } else {
            enchantedCauldron.distilTime = enchantedCauldron.distilTime + 1;
          }
        } else
          if (enchantedCauldron.brewTime > 0 || Object.keys(enchantedCauldron.contents).length > 1) {
            enchantedCauldron.distilTime = undefined;
          }

        if (enchantedCauldron.distilTime >= 15) {
          let mol = new MolangVariableMap();
          mol.setColorRGB("variable.color", setCauldron.fluidColor);
          blockCauldron.dimension.spawnParticle("bw:distilled_cauldron_particle", blockCauldron.above().bottomCenter(), mol);
        }
      }
      if (!enchantedCauldron.heated) {
        enchantedCauldron.distilTime = undefined;
      }
      world.setDynamicProperty(cauldron, JSON.stringify(enchantedCauldron));
    } else {
      world.setDynamicProperty(cauldron, undefined);
      world.setDynamicProperty("herb_" + cauldron, undefined);
      world.setDynamicProperty("transmute_" + cauldron, undefined);
      continue;
    }
  }
}, 20);

export const potionEffects = [
  {
    "name": "Absorption",
    "effect": "minecraft:absorption",
    "type": "positive"
  },
  {
    "name": "Blindness",
    "effect": "minecraft:blindness",
    "type": "negative"
  },
  {
    "name": "Conduit Power",
    "effect": "minecraft:conduit_power",
    "type": "positive"
  },
  {
    "name": "Darkness",
    "effect": "minecraft:darkness",
    "type": "negative"
  },
  {
    "name": "Fatal Poison",
    "effect": "minecraft:fatal_poison",
    "type": "negative"
  },
  {
    "name": "Fire Resistance",
    "effect": "minecraft:fire_resistance",
    "type": "positive"
  },
  {
    "name": "Haste",
    "effect": "minecraft:haste",
    "type": "positive"
  },
  {
    "name": "Health Boost",
    "effect": "minecraft:health_boost",
    "type": "positive"
  },
  {
    "name": "Hunger",
    "effect": "minecraft:hunger",
    "type": "negative"
  },
  {
    "name": "Instant Damage",
    "effect": "minecraft:instant_damage",
    "type": "negative"
  },
  {
    "name": "Instant Health",
    "effect": "minecraft:instant_health",
    "type": "positive"
  },
  {
    "name": "Invisibility",
    "effect": "minecraft:invisibility",
    "type": "positive"
  },
  {
    "name": "Jump Boost",
    "effect": "minecraft:jump_boost",
    "type": "positive"
  },
  {
    "name": "Levitation",
    "effect": "minecraft:levitation",
    "type": "neutral"
  },
  {
    "name": "Mining Fatigue",
    "effect": "minecraft:mining_fatigue",
    "type": "negative"
  },
  {
    "name": "Nausea",
    "effect": "minecraft:nausea",
    "type": "negative"
  },
  {
    "name": "Night Vision",
    "effect": "minecraft:night_vision",
    "type": "positive"
  },
  {
    "name": "Poison",
    "effect": "minecraft:poison",
    "type": "negative"
  },
  {
    "name": "Resistance",
    "effect": "minecraft:resistance",
    "type": "positive"
  },
  {
    "name": "Regeneration",
    "effect": "minecraft:regeneration",
    "type": "positive"
  },
  {
    "name": "Saturation",
    "effect": "minecraft:saturation",
    "type": "positive"
  },
  {
    "name": "Slowness",
    "effect": "minecraft:slowness",
    "type": "negative"
  },
  {
    "name": "Slow Falling",
    "effect": "minecraft:slow_falling",
    "type": "positive"
  },
  {
    "name": "Speed",
    "effect": "minecraft:speed",
    "type": "positive"
  },
  {
    "name": "Strength",
    "effect": "minecraft:strength",
    "type": "positive"
  },
  {
    "name": "Water Breathing",
    "effect": "minecraft:water_breathing",
    "type": "positive"
  },
  {
    "name": "Weakness",
    "effect": "minecraft:weakness",
    "type": "negative"
  },
  {
    "name": "Wither",
    "effect": "minecraft:wither",
    "type": "negative"
  },
];


function cauldronTeleport(entities, cauldronStr, cauldronData, color) {
  let endPos = cauldronData.portal;
  let startCauldron = world.getDimension(cauldronData.dimension).getBlock(cauldronData.location);

  let cauldronInfo = startCauldron.getComponent(BlockFluidContainerComponent.componentId);

  if (cauldronInfo.fillLevel == 0) {
    return;
  }
  if (entities.length == 0) {
    return;
  }

  // Get destination cauldron and try to extract a name if one exists;
  let connectedCauldron = `bwPotion:${endPos.x}_${endPos.y}_${endPos.z}_${cauldronData.dimension}`;
  let dest = world.getDynamicProperty(connectedCauldron);
  let destName;
  if (dest != undefined) {
    dest = JSON.parse(dest);
    if (dest.portalName != undefined) {
      destName = dest.portalName;
    }
  }

  let tpd = 0;
  // Loop through entities
  for (let e of entities) {
    // Filter out what can jump and what can't with Quintessence
    if (cauldronData.filter != undefined) {
      if (!essenceCheck(e, cauldronData.filter)) {
        continue;
      }
    }
    // If an entity was just telezorped, no teleport-y
    if (e.isValid && e.getDynamicProperty("bwDuration:cauldronSickness")) {
      continue;
    }
    if (e instanceof Player) {
      // Add color flashbang for players
      e.camera.fade({ fadeColor: color, fadeTime: { fadeInTime: 0.5, fadeOutTime: 0.5, holdTime: 0 } });
      if (destName != undefined) {
        e.sendMessage("§d(+)§r You've safely arrived at " + destName + ".");
      }
    }
    // Teleported entities get tagged with a custom effect
    attachCustomEffect(e, {
      "id": "bwDuration:cauldronSickness",
      "name": "Cauldron Sickness",
      "duration": 5,
      "amplifier": 0,
      "stackable": false
    }, true);
    // Teleport to the destination
    e.teleport({
      x: endPos.x + 0.5,
      y: endPos.y + 0.5,
      z: endPos.z + 0.5
    });
    tpd++;
  }

  // Add Color to particle and cause it to erupt;
  if (tpd > 0) {
    let molang = new MolangVariableMap();
    molang.setColorRGB("variable.color", color);
    startCauldron.dimension.spawnParticle("bw:cauldron_apparate", startCauldron.center(), molang);

    // Empty cauldron based on telezorped creatures
    if (diceRoll(1, 20, true) >= 12) {
      cauldronInfo.fillLevel = cauldronInfo.fillLevel - 1;
    }
  }
};

export function getEffectInfo(type, data) {
  let list = [];
  for (let effect of potionEffects) {
    if (effect.type == type) {
      list.push(effect[data]);
    }
  }
  return list
}

function translateEffect(effectName) {
  for (let pEffect of potionEffects) {
    if (pEffect.name == effectName) {
      return pEffect.effect;
    }
  }
}

function convertToTime(string) {
  let timeArray = string.split(':');
  return (Number(timeArray[0]) * 60) + Number(timeArray[1]);
}

function recipeCheck(items, recipe) {
  let check = 0;
  let fullRecipeLength = recipe.itemsRequired.length;
  let itemSize = items.size;
  let necessaryLength = 0;

  for (let i of recipe.itemsRequired) {
    if (i.necessary) {
      necessaryLength++;
    }

    let storedItem = items.get(i.type);
    if (storedItem != undefined && storedItem >= i.amount) {
      check++;
    }
  }


  if (check > 0 && check >= necessaryLength && check <= fullRecipeLength) {
    if (itemSize > fullRecipeLength) {
      return false;
    }

    if (check >= recipe.targetNumber) {
      return true;
    } else {
      return false;
    }
  }
  return false;
}

function getTransmutes(items, energies) {
  const itemMap = new Map();
  for (let item of items) {
    if (!itemMap.get(item.typeId)) {
      itemMap.set(item.typeId, item.amount);
    } else {
      itemMap.set(item.typeId, itemMap.get(item.typeId) + item.amount);
    }
  }
  let recipes = [];
  for (let recipe of transmutationRecipes) {
    let valid = recipeCheck(itemMap, recipe);

    if (valid) {
      let usable = true
      for (let [k, v] of Object.entries(recipe.energies)) {
        if (usable) {
          if (energies[k] == undefined || energies[k] < v) {
            usable = false;
          }
        }
      }
      if (usable) {
        recipes.push(recipe);
      }
    }
  }
  return [recipes, itemMap];
}

function brewCrystalEntity(item, block, cauldronInfo) {
  if (item != undefined) {
    let crystal = item.getComponent("item")?.itemStack;
    if (crystal == undefined) {
      return cauldronInfo;
    }

    let primalCrystals = {
      "bw:solar_imbued_quartz": {
        "solar": 30
      },
      "bw:lunar_imbued_quartz": {
        "lunar": 30
      },
      "bw:ender_imbued_quartz": {
        "ender": 30
      },
      "bw:sky_imbued_quartz": {
        "sky": 30
      },
      "bw:earth_imbued_quartz": {
        "earth": 30
      }
    };

    if (Object.keys(primalCrystals).includes(crystal.typeId)) {
      let primalEnergy = Object.entries(primalCrystals[crystal.typeId]);
      let presentEnergy = cauldronInfo.elements[primalEnergy[0][0]];
      if (presentEnergy == undefined) {
        presentEnergy = 0
      }
      cauldronInfo.elements[primalEnergy[0][0]] = presentEnergy + primalEnergy[0][1] * crystal.amount;
    } else {
      return cauldronInfo;
    }

    let cauldron = block.getComponent(BlockFluidContainerComponent.componentId);

    let color = [];

    for (let [element, value] of Object.entries(cauldronInfo.elements)) {
      if (value != undefined && value > 0) {
        if (element == "solar") {
          color.push([0.988, 0.686, 0.055]);
        }
        if (element == "lunar") {
          color.push([0.835, 0.965, 0.969]);
        }
        if (element == "earth") {
          color.push([0.153, 0.788, 0.133]);
        }
        if (element == "sky") {
          color.push([0.522, 0.58, 0.612]);
        }
        if (element == "ender") {
          color.push([0.525, 0.192, 0.729]);
        }
      }
    }

    let sums = [0, 0, 0];
    for (let i = 0; i < color.length; i++) {
      sums[0] += Math.round((color[i][0] * 255));
      sums[1] += Math.round((color[i][1] * 255));
      sums[2] += Math.round((color[i][2] * 255));
    }
    let divided = [
      sums[0] * (1 / color.length),
      sums[1] * (1 / color.length),
      sums[2] * (1 / color.length)
    ];
    cauldron.fluidColor = {
      red: divided[0] / 255,
      green: divided[1] / 255,
      blue: divided[2] / 255,
      alpha: 1
    }

    block.dimension.playSound("random.potion.brewed", block.center());
    item.remove();
    return cauldronInfo;
  }
}

function brewItemEntity(item, block, cauldronName, cauldronInfo) {
  if (item != undefined) {
    if (item.getComponent("minecraft:item")?.itemStack.amount > 1) {
      return cauldronInfo;
    }

    findCustomReagent(item.getComponent("minecraft:item")?.itemStack);

    let herb = herbDistil(item.getComponent("minecraft:item")?.itemStack.typeId);

    if (herb == null) {
      return cauldronInfo;
    }

    let cauldron = block.getComponent(BlockFluidContainerComponent.componentId);
    let waterLevel = Math.ceil(cauldron.fillLevel / 2);

    let cap = (cauldronInfo.maxCapacity / 3) * waterLevel;
    if (cauldronInfo.maxCapacity == undefined) {
      cauldronInfo.maxCapacity = 6;
    }

    if (cauldronInfo.capacity >= cap) {
      return cauldronInfo;
    }

    if (herb.modify != undefined) {
      if (cauldronInfo.capacity == 0) {
        return cauldronInfo;
      } else {
        cauldronInfo.capacity = cauldronInfo.capacity + 1;
      }
    } else {
      cauldronInfo.capacity = cauldronInfo.capacity + 1;
    }

    block.dimension.playSound("cauldron.adddye", block.center());
    herb.itemName = item.getComponent("minecraft:item").itemStack.typeId;
    if (item.getComponent("minecraft:item").itemStack.getDynamicProperty("bw:phial_content") != undefined) {
      herb.secondary = JSON.parse(item.getComponent("minecraft:item").itemStack.getDynamicProperty("bw:phial_content"));
    }
    world.setDynamicProperty(`herb_${cauldronName}`, JSON.stringify(herb));
    cauldronInfo.brewTime = 5 + Math.floor(Math.random() * 5);
    item.remove();
    return cauldronInfo;
  }
}

function brewIngredients(herb, block, cauldronName, cauldronInfo) {
  let cauldron = block.getComponent(BlockFluidContainerComponent.componentId);
  let secondaryEffect = herb.secondary;
  let name = herb.itemName;
  herb = herbDistil(herb.itemName);
  herb.itemName = name;

  if (herb.modify != undefined) {
    for (let [herbName, potency] of Object.entries(cauldronInfo.contents)) {
      cauldronInfo.contents[herbName] = herb.modify(potency)
    }
  } else {
    if (name == "bw:filled_phial") {
      if (secondaryEffect != undefined) {
        cauldronInfo.secondary = secondaryEffect
      }
    } else {
      if (cauldronInfo.capacity == 0) {
        if (cauldronInfo.contents[herb.itemName] == undefined) {
          cauldronInfo.contents[herb.itemName] = herb.baseValue
        } else {
          cauldronInfo.contents[herb.itemName] += herb.baseValue;
        }
      } else {
        if (cauldronInfo.contents[herb.itemName] == undefined) {
          for (let [herbName, potency] of Object.entries(cauldronInfo.contents)) {
            cauldronInfo.contents[herbName] += herb.baseValue;
          }
          cauldronInfo.contents[herb.itemName] = herb.baseValue;
        } else {
          for (let [herbName, potency] of Object.entries(cauldronInfo.contents)) {
            cauldronInfo.contents[herbName] += herb.baseValue;
          }
        }
      }
    }
  }

  let currentPotColor = [cauldron.fluidColor.red, cauldron.fluidColor.green, cauldron.fluidColor.blue];
  let color = [currentPotColor, herb.rgb];
  let sums = [0, 0, 0];
  for (let i = 0; i < color.length; i++) {
    sums[0] += Math.round((color[i][0] * 255));
    sums[1] += Math.round((color[i][1] * 255));
    sums[2] += Math.round((color[i][2] * 255));
  }
  let divided = [
    sums[0] * (1 / color.length),
    sums[1] * (1 / color.length),
    sums[2] * (1 / color.length)
  ];
  cauldron.fluidColor = {
    red: divided[0] / 255,
    green: divided[1] / 255,
    blue: divided[2] / 255,
    alpha: 1
  }
  block.dimension.playSound("random.potion.brewed", cauldronInfo.location, { pitch: 1 });

  world.setDynamicProperty("herb_" + cauldronName, undefined);
  world.setDynamicProperty(cauldronName, JSON.stringify(cauldronInfo));
}

function brewTransmutation(newItem, block, cauldronName, cauldronInfo) {
  let cauldron = block.getComponent(BlockFluidContainerComponent.componentId);
  if (Array.isArray(newItem)) {
    // These recipes drop these items in order. Able to drop multiple items for absolute sure.
    if (newItem[0].type == "sequence") {
      for (let v of newItem[0].values) {
        let item = new ItemStack(v.type, 1);
        let stackSize = item.maxAmount;

        let maximumItems = v.amount * newItem[1];
        let stacks = Math.floor(maximumItems / stackSize);

        for (let stack = stacks; stack >= 0; stack--) {
          if (stack > 0) {
            item.amount = stackSize;
          } else {
            let leftovers = maximumItems - (stacks * stackSize);
            if (leftovers > 0) {
              item.amount = leftovers;
            } else {
              item = undefined;
            }
          }

          if (item) {
            block.dimension.spawnItem(item, block.above().center());
          }
        }
      }
    }
    // These recipes drop these items randomly.
    if (newItem[0].type == "randomize") {
      let randomValue = newItem[0].values[Math.floor(Math.random() * newItem[0].values.length)];

      let item = new ItemStack(randomValue.type, 1);
      let stackSize = item.maxAmount;

      let maximumItems = randomValue.amount * newItem[1];
      let stacks = Math.floor(maximumItems / stackSize);

      for (let stack = stacks; stack >= 0; stack--) {
        if (stack > 0) {
          item.amount = stackSize;
        } else {
          let leftovers = maximumItems - (stacks * stackSize);
          if (leftovers > 0) {
            item.amount = leftovers;
          } else {
            item = undefined;
          }
        }

        if (item) {
          block.dimension.spawnItem(item, block.above().center());
        }
      }
    }
  } else {
    let essences = newItem;
    let essenceItem = "bw:essence";
    let reverseEssenceItem = "bw:anti_essence";

    for (let key of Object.keys(essences)) {
      let essence = essences[key];
      if (Array.isArray(essence)) {
        // For things like Familia
        for (let e of essence) {
          if (diceRoll(1, 20, true) > 10) {
            let item = new ItemStack(essenceItem, 1);

            switch (typeof e) {
              case "boolean": {
                item.setLore([
                  `§r§aEssence Type: ${key}`,
                  `§r§aValue: ${e}`
                ]);
                break;
              }
              case "number": {
                item.setLore([
                  `§r§aEssence Type: ${key}`,
                  `§r§aValue: ${e}`
                ]);
                break;
              }
              case "string": {
                item.setLore([
                  `§r§aEssence Type: ${key}`,
                  `§r§aValue: ${e}`
                ]);
                break;
              }
            }

            block.dimension.spawnItem(item, block.above().center());
          } else {
            let item = new ItemStack(reverseEssenceItem, 1);

            switch (typeof e) {
              case "boolean": {
                item.setLore([
                  `§r§cEssence Type: ${key}`,
                  `§r§cValue: ${!e}`
                ]);
                break;
              }
              case "number": {
                item.setLore([
                  `§r§cEssence Type: ${key}`,
                  `§r§cValue: ${e}`
                ]);
                break;
              }
              case "string": {
                item.setLore([
                  `§r§cEssence Type: ${key}`,
                  `§r§cValue: ${e}`
                ]);
                break;
              }
            }

            block.dimension.spawnItem(item, block.above().center());
          }
        }
      } else {
        if (diceRoll(1, 20, true) > 10) {
          let item = new ItemStack(essenceItem, 1);

          switch (typeof essence) {
            case "boolean": {
              item.setLore([
                `§r§aEssence Type: ${key}`,
                `§r§aValue: ${essence}`
              ]);
              break;
            }
            case "number": {
              item.setLore([
                `§r§aEssence Type: ${key}`,
                `§r§aValue: ${essence}`
              ]);
              break;
            }
            case "string": {
              item.setLore([
                `§r§aEssence Type: ${key}`,
                `§r§aValue: ${essence}`
              ]);
              break;
            }
          }

          block.dimension.spawnItem(item, block.above().center());
        } else {
          let item = new ItemStack(reverseEssenceItem, 1);

          switch (typeof essence) {
            case "boolean": {
              item.setLore([
                `§r§cEssence Type: ${key}`,
                `§r§cValue: ${!essence}`
              ]);
              break;
            }
            case "number": {
              item.setLore([
                `§r§cEssence Type: ${key}`,
                `§r§cValue: ${essence}`
              ]);
              break;
            }
            case "string": {
              item.setLore([
                `§r§cEssence Type: ${key}`,
                `§r§cValue: ${essence}`
              ]);
              break;
            }
          }

          block.dimension.spawnItem(item, block.above().center());
        }
      }
    }
  }

  let color = [[0, 0, 0]];

  for (let [element, value] of Object.entries(cauldronInfo.elements)) {
    if (value != undefined && value > 0) {
      if (element == "solar") {
        color.push([0.988, 0.686, 0.055]);
      }
      if (element == "lunar") {
        color.push([0.835, 0.965, 0.969]);
      }
      if (element == "earth") {
        color.push([0.153, 0.788, 0.133]);
      }
      if (element == "sky") {
        color.push([0.522, 0.58, 0.612]);
      }
      if (element == "ender") {
        color.push([0.525, 0.192, 0.729]);
      }
    }
  }
  let sums = [0, 0, 0];
  for (let i = 0; i < color.length; i++) {
    sums[0] += Math.round((color[i][0] * 255));
    sums[1] += Math.round((color[i][1] * 255));
    sums[2] += Math.round((color[i][2] * 255));
  }
  let divided = [
    sums[0] * (1 / color.length),
    sums[1] * (1 / color.length),
    sums[2] * (1 / color.length)
  ];
  let colorResult = {
    red: divided[0] / 255,
    green: divided[1] / 255,
    blue: divided[2] / 255,
    alpha: 1
  };

  if (colorResult.red == 0 && colorResult.blue == 0 && colorResult.green == 0) {
    cauldron.fluidColor = {
      red: 0.22,
      green: 0.365,
      blue: 0.776,
      alpha: 1
    }
  } else {
    cauldron.fluidColor = {
      red: divided[0] / 255,
      green: divided[1] / 255,
      blue: divided[2] / 255,
      alpha: 1
    }
  }

  block.dimension.playSound("random.potion.brewed", cauldronInfo.location, { pitch: 1 });

  world.setDynamicProperty("transmute_" + cauldronName, undefined);
  world.setDynamicProperty(cauldronName, JSON.stringify(cauldronInfo));
}

async function checkContent(block, str) {
  if (block.isValid) {
    system.waitTicks(5);
    let cauldron = block.getComponent(BlockFluidContainerComponent.componentId);

    if (cauldron.fillLevel == 0) {
      world.setDynamicProperty(str, undefined);
      world.setDynamicProperty("herb_" + str, undefined);
      world.setDynamicProperty("transmute_" + str, undefined);
    }
  }
}

world.afterEvents.itemCompleteUse.subscribe(drink => {
  let player = drink.source;
  let item = drink.itemStack;

  if (item != undefined && item.typeId == "bw:strange_potion" && item.getDynamicProperty("bw:potion") != undefined) {
    let potionLore = JSON.parse(item.getDynamicProperty("bw:potion"));

    let uses = item.getDynamicProperty("bw:potionCharges");
    let filter = item.getDynamicProperty("bw:potion_filter");
    let emptyPotion = new ItemStack("minecraft:glass_bottle", 1);

    if (filter) {
      filter = JSON.parse(filter);
      if (!essenceCheck(player, filter)) {
        return;
      }
    }

    if (uses > 0) {
      for (let [effectName, effectValues] of Object.entries(potionLore)) {
        if (effectValues.duration == 0) {
          effectValues.duration = 0.1
        } else {
          if (item.getDynamicProperty("bw:fermented") != undefined) {
            let ferment = item.getDynamicProperty("bw:fermented");

            effectValues.duration += Math.floor((ferment / 2) * 5);
          }
        }

        if (item.getDynamicProperty("bw:fermented") != undefined) {
          let ferment = item.getDynamicProperty("bw:fermented");

          let amp = Math.floor((ferment / 10) * 0.2);

          if (effectValues.amplifier == undefined) {
            if (amp > 0) {
              effectValues.amplifier = amp
            }
          } else {
            effectValues.amplifier += amp;
          }
        }

        if (effectValues.duration > 0) {
          player.addEffect(effectName, effectValues.duration * 20, { showParticles: true, amplifier: effectValues.amplifier })
        }
      }

      let arr = item.getLore();
      if (arr[arr.length - 1].includes("Ferment")) {
        arr[arr.length - 2] = `§r§d${uses - 1}/5 Uses§r`;
      } else {
        arr[arr.length - 1] = `§r§d${uses - 1}/5 Uses§r`;
      }
      item.setLore(arr);
      item.setDynamicProperty("bw:potionCharges", uses - 1);
      player.getComponent('inventory').container.setItem(player.selectedSlotIndex, item);
    }
    if (uses == 1) {
      player.getComponent('inventory').container.setItem(player.selectedSlotIndex, undefined);
      if (player.getComponent('inventory').container.emptySlotsCount > 0) {
        player.getComponent('inventory').container.addItem(emptyPotion);
      } else {
        world.getDimension(player.dimension.id).spawnItem(emptyPotion, player.location);
      }
    }
  }

  if (item != undefined && item.typeId == "bw:honey_orbos_bottle") {
    let fatigue = world.scoreboard?.getObjective("bw:Fatigue");

    if (fatigue?.getScore(player) != undefined) {
      fatigue.setScore(player, 0);
      if (item.amount > 1) {
        item.amount--;
      } else {
        item = undefined;
      }
      player.getComponent("inventory").container.setItem(player.selectedSlotIndex, item);
    }
  }

  /*
  if (player.isSneaking && item != undefined && item.typeId == "minecraft:potion") {
    world.getDynamicPropertyIds().forEach((property) => {
      if (property.startsWith("bw_reagent:")) {
        world.setDynamicProperty(property, undefined);
      }
    })
    world.setDynamicProperty(`bw:initializeReagents`, undefined);
    console.warn("Successfully GONE!")
  }
  */
});

world.afterEvents.entityHitEntity.subscribe(e => {
  let entity = e.hitEntity;
  let player = e.damagingEntity;

  if (player?.typeId != "minecraft:player") {
    return;
  }

  let item = player.getComponent('inventory').container.getItem(player.selectedSlotIndex);

  if (item != undefined && item.typeId == "bw:strange_potion") {
    if (entity == undefined && !entity?.isValid()) {
      return;
    }
    let potionLore = JSON.parse(item.getDynamicProperty("bw:potion"));

    let uses = item.getDynamicProperty("bw:potionCharges");
    let filter = item.getDynamicProperty("bw:potion_filter");
    let emptyPotion = new ItemStack("minecraft:glass_bottle", 1);

    if (filter) {
      filter = JSON.parse(filter);
      if (!essenceCheck(entity, filter)) {
        return;
      }
    }

    if (uses > 0) {
      for (let [effectName, effectValues] of Object.entries(potionLore)) {
        if (effectValues.duration == 0) {
          effectValues.duration = 0.1
        } else {
          if (item.getDynamicProperty("bw:fermented") != undefined) {
            let ferment = item.getDynamicProperty("bw:fermented");

            effectValues.duration += Math.floor((ferment / 2) * 5);
          }
        }

        if (item.getDynamicProperty("bw:fermented") != undefined) {
          let ferment = item.getDynamicProperty("bw:fermented");

          let amp = Math.floor((ferment / 10) * 0.2);

          if (effectValues.amplifier == undefined) {
            if (amp > 0) {
              effectValues.amplifier = amp
            }
          } else {
            effectValues.amplifier += amp;
          }
        }

        entity.addEffect(effectName, effectValues.duration * 20, { showParticles: true, amplifier: effectValues.amplifier })
      }

      let arr = item.getLore();
      arr[arr.length - 1] = `§r§d${uses - 1}/5 Uses§r`;
      item.setLore(arr);
      item.setDynamicProperty("bw:potionCharges", uses - 1);
      player.getComponent('inventory').container.setItem(player.selectedSlotIndex, item);
    }
    if (uses == 1) {
      player.getComponent('inventory').container.setItem(player.selectedSlotIndex, undefined);
      if (player.getComponent('inventory').container.emptySlotsCount > 0) {
        player.getComponent('inventory').container.addItem(emptyPotion);
      } else {
        world.getDimension(player.dimension.id).spawnItem(emptyPotion, player.location);
      }
    }
  }
});

world.afterEvents.itemUse.subscribe(e => {
  const item = e.itemStack;
  const player = e.source;

  // Throw Potion
  if (item != undefined && item.typeId == "bw:strange_potion_flask" && item.getDynamicProperty("bwProj:potion") != undefined) {
    let potionLore = JSON.parse(item.getDynamicProperty("bwProj:potion"));
    let uses = item.getDynamicProperty("bw:potionCharges");

    if (uses > 0) {
      let forward = Vector3.add(player.getHeadLocation(), player.getViewDirection());
      let potion = world.getDimension(player.dimension.id).spawnEntity("bw:flask_projectile", forward);
      potion.setDynamicProperty("bwProj:potion", item.getDynamicProperty("bwProj:potion"));
      potion.setDynamicProperty("bwProj:potion_filter", item.getDynamicProperty("bwProj:potion_filter"));
      potion.setDynamicProperty("bwProj:fermented", item.getDynamicProperty("bw:fermented"));
      potion.setDynamicProperty("bwProj:potionColor", item.getDynamicProperty("bwProj:potionColor"));
      let potProj = potion.getComponent("minecraft:projectile");
      potProj.shoot(player.getViewDirection());

      let arr = item.getLore();
      if (arr[arr.length - 1].includes("Ferment")) {
        arr[arr.length - 2] = `§r§d${uses - 1}/5 Uses§r`;
      } else {
        arr[arr.length - 1] = `§r§d${uses - 1}/5 Uses§r`;
      }
      item.setLore(arr);
      item.setDynamicProperty("bw:potionCharges", uses - 1);
      player.getComponent('inventory').container.setItem(player.selectedSlotIndex, item);
    }
    if (uses == 1) {
      player.getComponent('inventory').container.setItem(player.selectedSlotIndex, undefined);
    }
  }
});

// Brewing Mechanics
world.beforeEvents.playerInteractWithBlock.subscribe(e => {
  const item = e.itemStack;
  const player = e.player;
  const playerInv = player.getComponent('inventory').container;
  const block = e.block;

  // console.warn(JSON.stringify(block.getComponent("minecraft:record_player")));
  // console.warn(JSON.stringify(block.getComponent("minecraft:inventory")));

  let goodContainers = [
    "minecraft:glass_bottle",
    "bw:glass_flask"
  ]
  let gasContainers = [
    "bw:glass_phial"
  ]
  let badContainers = [
    "minecraft:bucket"
  ]
  let inundators = [
    "minecraft:water_bucket",
    "minecraft:powder_snow_bucket",
    "minecraft:milk_bucket",
    "minecraft:lava_bucket",
    "minecraft:potion"
  ]

  if (block != undefined && item != undefined && block.typeId == "minecraft:cauldron") {
    let cauldron = block.getComponent(BlockFluidContainerComponent.componentId);
    let centerCoord = {
      x: Math.floor(block.center().x),
      y: Math.floor(block.center().y),
      z: Math.floor(block.center().z)
    }
    let str = `bwPotion:${centerCoord.x}_${centerCoord.y}_${centerCoord.z}_${block.dimension.id}`;
    if (world.getDynamicProperty(str)) {
      let foundCauldron = world.getDynamicProperty(str);
      if (foundCauldron == undefined) {
        return;
      } else {
        foundCauldron = JSON.parse(foundCauldron)
      }
      if (badContainers.includes(item.typeId)) {
        e.cancel = true;
        return;
      }
      if (goodContainers.includes(item.typeId)) {
        system.run(() => {
          if (cauldron.fillLevel == 0 || cauldron.getFluidType() != FluidType.Water) {
            return;
          }
          if (item.typeId == "minecraft:glass_bottle") {
            if (foundCauldron.capacity == 0) {
              player.sendMessage(`§c[!]§r There is no reagent in this cauldron.`);
              return;
            }

            let potion = new ItemStack("bw:strange_potion", 1);
            // let hebbyInfluence = verifyPatron(player, "hebaya");
            let potionAttr = bottlePotion(foundCauldron.contents, foundCauldron.secondary, block, /*hebbyInfluence*/ true);

            // Frog Brewing Buff
            if (player?.isValid && hasFamiliar(player)) {
              let powers = getPresentFamiliarPowers(player, true);
              if (powers.includes("Potence")) {
                if (diceRoll(1, 20, true) >= 8) {
                  let cs = Object.keys(potionAttr);
                  let c = cs[Math.floor(cs.length * Math.random())];

                  if (potionAttr[c].amplifier == undefined) {
                    potionAttr[c].amplifier = 0;
                  }

                  potionAttr[c].amplifier = potionAttr[c].amplifier + 1;
                }
              }
            }

            let effectArray = potionToLore(potionAttr, foundCauldron.secondary);

            effectArray.push("§r§d5/5 Uses§r");
            potion.setLore(effectArray);
            potion.getComponent("dyeable").color = cauldron.fluidColor;

            potion.setDynamicProperty("bw:potion", JSON.stringify(potionAttr));
            if (foundCauldron.filter != undefined) {
              potion.setDynamicProperty("bw:potion_filter", JSON.stringify(foundCauldron.filter));
            }
            potion.setDynamicProperty("bw:potionCharges", 5)
            world.getDimension(player.dimension.id).spawnItem(potion, player.location);
            if (item.amount == 1) {
              playerInv.setItem(player.selectedSlotIndex, undefined);
            } else
              if (item.amount > 1) {
                item.amount = item.amount - 1
                playerInv.setItem(player.selectedSlotIndex, item);
              }
          }

          if (item.typeId == "bw:glass_flask") {
            if (foundCauldron.capacity == 0) {
              player.sendMessage(`§c[!]§r There is no reagent in this cauldron.`);
              return;
            }

            let potion = new ItemStack("bw:strange_potion_flask", 1);
            // let hebbyInfluence = verifyPatron(player, "hebaya");
            let potionAttr = bottlePotion(foundCauldron.contents, foundCauldron.secondary, block, /*hebbyInfluence*/ true);

            // Frog Brewing Buff
            if (player?.isValid && hasFamiliar(player)) {
              let powers = getPresentFamiliarPowers(player, true);
              if (powers.includes("Potence")) {
                if (diceRoll(1, 20, true) >= 8) {
                  let cs = Object.keys(potionAttr);
                  let c = cs[Math.floor(cs.length * Math.random())];

                  potionAttr[c].amplifier = potionAttr[c].amplifier + 1;
                }
              }
            }

            let effectArray = potionToLore(potionAttr, foundCauldron.secondary);
            effectArray.push("§r§d5/5 Uses§r");
            potion.setLore(effectArray);

            potion.setDynamicProperty("bwProj:potion", JSON.stringify(potionAttr))
            if (foundCauldron.filter != undefined) {
              potion.setDynamicProperty("bwProj:potion_filter", JSON.stringify(foundCauldron.filter));
            }

            potion.getComponent("dyeable").color = cauldron.fluidColor;
            potion.setDynamicProperty("bwProj:potionColor", JSON.stringify(cauldron.fluidColor));
            potion.setDynamicProperty("bw:potionCharges", 5)
            world.getDimension(player.dimension.id).spawnItem(potion, player.location);
            if (item.amount == 1) {
              playerInv.setItem(player.selectedSlotIndex, undefined);
            } else
              if (item.amount > 1) {
                item.amount = item.amount - 1
                playerInv.setItem(player.selectedSlotIndex, item);
              }
          }

          cauldron.fillLevel = 0;
          world.setDynamicProperty(str, undefined);
          world.setDynamicProperty("herb_" + str, undefined);
          block.dimension.playSound("cauldron.takewater", block.center());
        });
        e.cancel = true;
        return;
      }
      if (gasContainers.includes(item.typeId)) {
        system.run(() => {
          if (cauldron.fillLevel == 0 || cauldron.getFluidType() != FluidType.Water) {
            return;
          }
          if (item.typeId == "bw:glass_phial") {
            if (Object.keys(foundCauldron.contents).length == 0) {
              player.sendMessage(`§c[!]§r There is no reagent in this cauldron.`);
              return;
            }
            if (Object.keys(foundCauldron.contents).length > 1) {
              player.sendMessage(`§c[!]§r There are too many reagents in this cauldron to properly gather a Distillation.`);
              return;
            }
            if (Object.keys(foundCauldron.contents).length == 1) {
              if (foundCauldron.distilTime == undefined || foundCauldron.distilTime < 15) {
                player.sendMessage(`§c[!]§r This reagent hasn't properly simmered enough to be gathered as a Distillation. Wait for the large smoke.`);
                return;
              }
            }

            let phial = new ItemStack("bw:filled_phial", 1);

            let key = Object.keys(foundCauldron.contents);
            let potency = foundCauldron.contents[key];

            let herb = herbDistil(key);

            let affectedEffect = getDistilledEffect(herb.primaryEffects, potency);
            let secondaryEffect = herb.secondaryEffects;

            let distillation = {
              "name": `${affectedEffect} ${capitalize(secondaryEffect.type)}`,
              "affects": affectedEffect,
              "with": secondaryEffect
            }

            phial.setDynamicProperty("bw:phial_content", JSON.stringify(distillation));
            phial.getComponent("dyeable").color = cauldron.fluidColor;

            let lore = [
              `§6Distilled Reagent§r`,
              `${capitalize(secondaryEffect.type)} of ${affectedEffect}`
            ]
            phial.setLore(lore);
            phial.getComponent("dyeable").color = cauldron.fluidColor;


            world.getDimension(player.dimension.id).spawnItem(phial, player.location);
            if (item.amount == 1) {
              playerInv.setItem(player.selectedSlotIndex, undefined);
            } else
              if (item.amount > 1) {
                item.amount = item.amount - 1
                playerInv.setItem(player.selectedSlotIndex, item);
              }
          }


          cauldron.fillLevel = 0;
          world.setDynamicProperty(str, undefined);
          world.setDynamicProperty("herb_" + str, undefined);
          block.dimension.playSound("cauldron.takewater", block.center());
        });
        e.cancel = true;
        return;
      }

      if (inundators.includes(item.typeId)) {
        checkContent(block, str);
      }
    }
  }
});


world.afterEvents.playerInteractWithBlock.subscribe(e => {
  const item = e.itemStack;
  const player = e.player;
  const playerInv = player.getComponent('inventory').container;
  const block = e.block;

  if (block?.typeId == "minecraft:cauldron") {
    let centerCoord = {
      x: Math.floor(block.center().x),
      y: Math.floor(block.center().y),
      z: Math.floor(block.center().z)
    }

    if (world.getDynamicProperty(`bwPotion:${centerCoord.x}_${centerCoord.y}_${centerCoord.z}_${block.dimension.id}`) != undefined) {
      let str = `bwPotion:${centerCoord.x}_${centerCoord.y}_${centerCoord.z}_${block.dimension.id}`;
      let foundCauldron = world.getDynamicProperty(str);

      // Look for cauldron data
      if (foundCauldron == undefined) {
        return;
      } else {
        foundCauldron = JSON.parse(foundCauldron)
      }

      // Process Reagents
      findCustomReagent(item);
      let herb = herbDistil(item.typeId);
      let cauldron = block.getComponent(BlockFluidContainerComponent.componentId);


      if (herb != null) {
        if (foundCauldron.portal != undefined) {
          return;
        }
        if (foundCauldron.brewTime > 0) {
          player.sendMessage("§c[!]§r A reagent is currently being brewed. Wait until it is done before adding another.");
          return;
        }

        if (foundCauldron.brewTime == 0 && cauldron.fillLevel > 0 && cauldron.getFluidType() == FluidType.Water && foundCauldron.heated == "potionHeat") {
          let cap = (foundCauldron.maxCapacity / 3) * (Math.ceil(cauldron.fillLevel / 2));

          if (foundCauldron.capacity >= cap) {
            if (foundCauldron.capacity > 0) {
              player.sendMessage("§c[!]§r Your Cauldron boils and bubbles, but it has reached its full capacity. If its not already full, maybe it needs more water?");
            }
            return;
          }


          if (herb.modify != undefined) {
            if (foundCauldron.capacity == 0) {
              player.sendMessage("§c[!]§r You cannot modify a brew with no reagent in it.");
              return;
            } else {
              foundCauldron.capacity = foundCauldron.capacity + 1;
            }
          } else {
            foundCauldron.capacity = foundCauldron.capacity + 1;
          }

          block.dimension.playSound("cauldron.adddye", block.center());
          foundCauldron.brewTime = 4 + Math.floor(Math.random() * 5);
          herb.itemName = item.typeId;
          world.setDynamicProperty(`herb_${str}`, JSON.stringify(herb));
          world.setDynamicProperty(str, JSON.stringify(foundCauldron))

          if (item.amount > 1) {
            item.amount = item.amount - 1;
            playerInv.setItem(player.selectedSlotIndex, item);
          } else {
            playerInv.setItem(player.selectedSlotIndex, undefined);
          }
        }
      }

      // PORTALS & PORTAL NAMING!!
      // If cauldron is empty of reagents, not currently brewing anything, filled to a level greater than 0, filled with water and recieving heat from normal sources, do thing.
      if (foundCauldron.capacity == 0 && foundCauldron.brewTime == 0 && cauldron.fillLevel > 0 && cauldron.getFluidType() == FluidType.Water && foundCauldron.heated == "potionHeat") {

        // Set Portal Up. Simple as that!
        if (item.getDynamicProperty("bw:savedLocation")) {
          foundCauldron.portal = JSON.parse(item.getDynamicProperty("bw:savedLocation"));
          world.setDynamicProperty(str, JSON.stringify(foundCauldron));
          player.sendMessage("§a[#]§r A portal has been formed here...");

          playerInv.setItem(player.selectedSlotIndex, undefined);
        }

        // Add name to the Portal
        if (foundCauldron.portal != undefined) {
          if (item.typeId == "minecraft:name_tag") {
            let n = item.nameTag;
            if (n != undefined) {
              foundCauldron.portalName = n;
              player.sendMessage("§a[#]§r The Cauldron Portal has been named " + n + ".");

              world.setDynamicProperty(str, JSON.stringify(foundCauldron));
            }
          }
        }
      }

      // TRANSMUTATION!!
      if (foundCauldron.brewTime == 0 && cauldron.fillLevel > 0 && cauldron.getFluidType() == FluidType.Water && foundCauldron.heated == "transmuteHeat" && item.hasTag("bw:castingWand") && !player.isSneaking) {
        let transmuteItems = block.dimension.getEntities({ location: block.center(), includeType: "minecraft:item", maxDistance: 0.45, closest: 5 });

        if (transmuteItems != undefined) {
          let primalItemStack = [];
          transmuteItems.forEach(i => {
            return primalItemStack.push(i.getComponent("item").itemStack);
          });

          let potentialOutput = getTransmutes(primalItemStack, foundCauldron.elements);
          if (potentialOutput[0].length > 0) {
            let chosen = potentialOutput[0][0];

            if (chosen.outputItems != "essence") {
              let chosenItem = {
                type: chosen.outputType,
                values: chosen.outputItems
              };

              let amountTransmuted = 0;
              let potentialTransmuted = 0;
              let notEnough = false;
              while (!notEnough) {
                let transmuted = false;
                let necessaryStuff = 0;
                let validItemNum = 0;
                chosen.itemsRequired.forEach((e) => {
                  if (e.necessary) {
                    necessaryStuff = necessaryStuff + 1;
                  }

                  let mappedItemAmount = potentialOutput[1].get(e.type);

                  if (mappedItemAmount && mappedItemAmount >= e.amount) {
                    potentialOutput[1].set(e.type, mappedItemAmount - e.amount);
                    validItemNum = validItemNum + 1;
                    if (e.necessary) {
                      necessaryStuff = necessaryStuff - 1;
                    }
                  }
                });

                if (validItemNum >= chosen.targetNumber && necessaryStuff == 0) {
                  potentialTransmuted = potentialTransmuted + 1 + (validItemNum - chosen.targetNumber);
                  transmuted = true;
                }
                if (!transmuted) {
                  notEnough = true;
                }
              }

              if (potentialTransmuted > 0) {
                for (let p = 1; p <= potentialTransmuted; p++) {
                  let bool = true;
                  for (let [k, v] of Object.entries(chosen.energies)) {
                    if (foundCauldron.elements[k] >= v) {
                      foundCauldron.elements[k] = foundCauldron.elements[k] - [v];
                    } else {
                      bool = false;
                    }
                  }
                  if (bool) {
                    amountTransmuted = amountTransmuted + 1;
                  } else {
                    break;
                  }
                }
              }

              if (amountTransmuted == 0) {
                return;
              }

              for (let pI of transmuteItems) {
                if (pI.isValid) {
                  pI.remove()
                }
              }

              let chosenItemStack = [chosenItem, amountTransmuted];
              console.warn(JSON.stringify(chosenItemStack));

              block.dimension.playSound("cauldron.adddye", block.center());
              foundCauldron.brewTime = chosen.brewTime;
              world.setDynamicProperty(`transmute_${str}`, JSON.stringify(chosenItemStack));
              world.setDynamicProperty(str, JSON.stringify(foundCauldron));
            } else {
              transmuteItems = transmuteItems[0];
              primalItemStack = primalItemStack[0];
              let essenceList = {};
              if (primalItemStack.getDynamicProperty("bw:blood") != undefined) {
                let bool = true;
                for (let [k, v] of Object.entries(chosen.energies)) {
                  if (foundCauldron.elements[k] >= v) {
                    foundCauldron.elements[k] = foundCauldron.elements[k] - [v];
                  } else {
                    bool = false;
                  }
                }

                if (bool) {
                  essenceList = gatherEssentia(primalItemStack.getDynamicProperty("bw:blood"), block.dimension, block.location);
                  transmuteItems.remove();
                } else {
                  return;
                }
              }

              block.dimension.playSound("cauldron.adddye", block.center());
              foundCauldron.brewTime = chosen.brewTime;
              world.setDynamicProperty(`transmute_${str}`, JSON.stringify(essenceList));
              world.setDynamicProperty(str, JSON.stringify(foundCauldron));
            }
          }
        }
      }

      // Taste Test Potion
      if (cauldron.fillLevel > 0 && cauldron.getFluidType() == FluidType.Water && item.typeId == "bw:spoon") {
        if (foundCauldron.capacity == 0) {
          player.sendMessage(`§c[!]§r There is no reagent in this cauldron to taste.`);
          return;
        }
        let potionArray = herbsToLore(foundCauldron.contents, foundCauldron.secondary)[0];
        player.sendMessage(`\nThis potion tastes like:\n`)
        for (let msg of potionArray) {
          player.sendMessage(msg)
        }
        if (foundCauldron.brewTime > 0) {
          player.sendMessage(`Remaining Brew Time: ${foundCauldron.brewTime} second(s)!`)
        }
      }

      // Add Quintessence to Potion
      if (foundCauldron.brewTime == 0 && cauldron.fillLevel > 0 && cauldron.getFluidType() == FluidType.Water && foundCauldron.heated == "potionHeat" && item?.getDynamicProperty('bw:quintessence')) {
        let quint = JSON.parse(item?.getDynamicProperty('bw:quintessence'));
        if (!Array.isArray(quint)) {
          quint = [quint];
        }

        foundCauldron.filter = quint;
        player.sendMessage(`§c[!]§r Quintessence was stirred into the potion...`);
        block.dimension.playSound("cauldron.adddye", block.center());
        world.setDynamicProperty(str, JSON.stringify(foundCauldron));
      }

      // Test for Primal Energies/Test for portal to elsewhere.
      if (cauldron.fillLevel > 0 && cauldron.getFluidType() == FluidType.Water && item.hasTag("bw:castingWand") && player.isSneaking) {
        if (foundCauldron.heated == "transmuteHeat") {
          let energies = {
            "solar": 0,
            "lunar": 0,
            "earth": 0,
            "sky": 0,
            "ender": 0
          }
          for (let [e, v] of Object.entries(foundCauldron.elements)) {
            energies[e] = v;
          }

          player.sendMessage(`Primal Contents\n§6Solar | ${energies.solar}§r\n§bLunar | ${energies.lunar}§r\n§2Earth | ${energies.earth}§r\n§7Sky | ${energies.sky}§r\n§uEnder | ${energies.ender}§r`);
        }

        if (foundCauldron.portal != undefined) {
          let beginPos = foundCauldron.portal;
          let destinationName;
          let connectedCauldron = `bwPotion:${beginPos.x}_${beginPos.y}_${beginPos.z}_${foundCauldron.dimension}`;

          if (world.getDynamicProperty(connectedCauldron)) {
            let c = JSON.parse(world.getDynamicProperty(connectedCauldron));

            if (c.portalName != undefined) {
              destinationName = c.portalName;
            }
          }

          if (destinationName == undefined) {
            destinationName = `(${beginPos.x}, ${beginPos.y}, ${beginPos.z})`;
          }
          player.sendMessage(`§d[#]§r This cauldron portal is connected to §g${destinationName}§r.`);
        }
      }

      // Crystallization
      if (cauldron.fillLevel > 0 && cauldron.getFluidType() == FluidType.Water && (item.typeId == "minecraft:quartz" || item.typeId == "minecraft:amethyst_shard")) {
        if (foundCauldron.capacity == 0) {
          player.sendMessage(`§c[!]§r There is no reagent in this cauldron to crystallize.`);
          return;
        }

        if (foundCauldron.brewTime > 0) {
          player.sendMessage("§c[!]§r A reagent is currently being brewed. Wait until it is done before attempting Crystallization.");
          return;
        }
        if (foundCauldron.brewTime == 0) {
          block.dimension.playSound("random.potion.brewed", block.center(), { pitch: 0.3 });
          block.dimension.playSound("hit.amethyst_cluster", block.center(), { pitch: 1.5 });

          let elementArray = herbsToElements(foundCauldron.contents, item.amount);

          // Spawn Primal Crystals based on elementArray output
          for (const [c, a] of elementArray[0]) {
            let crystal = new ItemStack(c, a);
            block.dimension.spawnItem(crystal, block.above().bottomCenter());
          }

          cauldron.fillLevel = 0;
          world.setDynamicProperty(str, undefined);
          world.setDynamicProperty("herb_" + str, undefined);
          if (elementArray[1] > 0) {
            item.amount = elementArray[1];
            playerInv.setItem(player.selectedSlotIndex, item);
          } else {
            playerInv.setItem(player.selectedSlotIndex, undefined);
          }
        }
      }

    }
  }
});