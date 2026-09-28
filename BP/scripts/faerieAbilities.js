/* jshint maxerr: 10000 */
import {world, system, ItemStack, Player, BlockFluidContainerComponent, FluidType, MolangVariableMap} from "@minecraft/server";

import {validCandles, diceRoll} from "./occultMagick.js";
import { hasFaery } from "./castRitual.js";
import { greaterFae, medianFae, convertFaeName } from "./lesserFaerie.js";
import {deductOrbos} from "./spellDraw.js";
import {localizeVec, localizePos} from "./localize.js";
import {Vector3, Random} from "./VectorMath/index.js";
import {potionEffects} from "./consumePotion.js";
import {verifyPatron} from "./altars.js";
import { SleepWorldEvent } from './SleepWorldEvent.js';

const dwarvoneStructures = {
  "dowseOre": [
    {
      x: 0,
      y: 0,
      z: 0
    },
    {
      x: 0,
      y: 1,
      z: 0
    },
    {
      x: 0,
      y: 2,
      z: 0
    },
    {
      x: 0,
      y: 2,
      z: 1
    },
    {
      x: 0,
      y: 2,
      z: -1
    }
  ],
  /*"dowseBlock": [
    ]*/
}
const dwarvoneEffects = {
  "dowseOre": function* (player, block) => {
    let oreMax = 0;
    let newlocation = Vector3.subtract(block.location, {
      x: 15,
      y: 15,
      z: 15
    });
    for (let x = newlocation.x; x < block.location.x + 15; x++) {
      for (let y = newlocation.y; y <  block.location.y + 15; y++) {
        for (let z = newlocation.z; z < block.location.z + 15; z++) {
          let currentBlock = block.dimension.getBlock({x: x, y: y, z: z});
          if (currentBlock.typeId.includes("_ore")) {
            if (oreMax < 10) {
              if (oreMax == 0) {
                player.sendMessage(`§gYou feel a subtle trembling as the land lays bare to you its bounty.§r`);
                player.runCommand("camerashake add @p 0.25 3 positional");
              }
              oreMax++;
              block.dimension.playSound("block.sniffer_egg.hatch", currentBlock.location);
              player.sendMessage({rawtext: [{text: "You feel "}, {translate: currentBlock.localizationKey}, {text: ` present at ${Math.floor(currentBlock.location.x)}, y(?), ${Math.floor(currentBlock.location.z)}`}]});
            } else {
              return;
            }
          }
          yield;
        }
      }
    }
  },
  /*"dowseBlock": [
    ]*/
}

export function triggerDwarvoneStructure(player, block) {
  let facingDir = new Vector3(player.getViewDirection().x, 0, player.getViewDirection().z)
  let found = undefined;
  for (let [k, v] of Object.entries(dwarvoneStructures)) {
    let blockCount = 0;
    for (let vec of v) {
      let pos = Vector3.add(block.location, vec);
      let seenBlock = block.dimension.getBlock(pos);
      if (seenBlock.typeId == "minecraft:hardened_clay" || seenBlock.typeId.includes("terracotta")) {
        blockCount++;
      }
    }
    if (blockCount == v.length) {
      found = k;
      break;
    }
  }
  
  if (found) {
    for (let vec of dwarvoneStructures[found]) {
      let pos = Vector3.add(block.location, vec);
      let seenBlock = block.dimension.getBlock(pos);
      if (seenBlock.typeId == "minecraft:hardened_clay" || seenBlock.typeId.includes("terracotta")) {
        seenBlock.setType("minecraft:air");
        block.dimension.playSound("block.mangrove_roots.break", seenBlock.location)
        block.dimension.playSound("block.sniffer_egg.hatch", seenBlock.location)
      }
    }
    system.runJob(dwarvoneEffects[found](player, block));
  }
}

world.afterEvents.entityHitEntity.subscribe(e => {
  let player = e.hitEntity;
  let entity = e.damagingEntity;
  if (!player.isValid || !entity.isValid) {
    return;
  }
  let armorInv = player?.getComponent("minecraft:equippable");
  let weaponInv = entity?.getComponent("minecraft:inventory")?.container;
  
  let medianFaeries = player?.getDynamicProperty("bw:medians");
  if (medianFaeries != undefined) {
    medianFaeries = JSON.parse(medianFaeries)
  } else {
    medianFaeries = []
  }
  let patronFaeries = player?.getDynamicProperty("bw:patrons");
  if (patronFaeries != undefined) {
    patronFaeries = JSON.parse(patronFaeries)
  } else {
    patronFaeries = []
  }
  
  // All Medians & Greater Patrons boons at varying levels of trust.
  let allFae = medianFaeries.concat(patronFaeries);
  
  for (let fae of allFae) {
    try {
      let faerie = JSON.parse(player.getDynamicProperty(`bw:${fae}`));
      let trustLevels = faerie.trust;
      
      if (faerie.id == "dryas") {
        if (trustLevels >= 20) {
          let amp = Math.floor(trustLevels/40);
          if (amp == 0) {
            amp = undefined;
          }
          entity.addEffect("minecraft:fatal_poison", 20*20, {amplifier: amp});
        }
      }
    } catch (e) {
      return;
    }
  }
  
  /*
  if (player instanceof Player && player.isValid) {
    if (armorInv != undefined) {
      let armorArray = [
        armorInv.getEquipment("Head"),
        armorInv.getEquipment("Chest"),
        armorInv.getEquipment("Legs"),
        armorInv.getEquipment("Feet")
      ];
      let armorSlots = [
        "Head",
        "Chest",
        "Legs",
        "Feet"
      ];
      for (let a = 0; a < armorArray.length; a++) {
        if (armorArray[a] == undefined) {
          continue;
        }
        let dur = armorArray[a].getComponent("durability");
        let spell = armorArray[a].getDynamicProperty("bw:imbued_armor_spell");
        if (spell) {
          spell = JSON.parse(spell);
        }
        if (dur && spell) {
          let spellCastChance = 10;
          if (diceRoll(1, 10, true) <= spellCastChance) {
            switch (spell.noun.type) {
              case "Self": {
                if (dur.maxDurability <= dur.damage+spell.cost.fatigue) {
                  armorArray[a] = undefined;
                  armorInv.setEquipment(armorSlots[a], armorArray[a]);
                } else {
                  dur.damage = dur.damage+spell.cost.fatigue
                }
                
                castOnSelf(player, true, spell.verb);
                player.dimension.playSound(spell.verb.sound.name, player.location, spell.verb.sound.parameters);
                break;
              }
              case "Bubble": {
                if (dur.maxDurability <= dur.damage+spell.cost.fatigue) {
                  armorArray[a] = undefined;
                  armorInv.setEquipment(armorSlots[a], armorArray[a]);
                } else {
                  dur.damage = dur.damage+spell.cost.fatigue
                }
                
                let radius = {
                  minRadius: spell.noun.minRadius,
                  maxRadius: spell.noun.radius
                }
                castInBubble(player, true, radius, spell.verb, spell.noun.duration);
                player.dimension.playSound(spell.verb.sound.name, player.location, spell.verb.sound.parameters);
                break;
              }
              case "Touch": {
                if (dur.maxDurability <= dur.damage+spell.cost.fatigue) {
                  armorArray[a] = undefined;
                  armorInv.setEquipment(armorSlots[a], armorArray[a]);
                } else {
                  dur.damage = dur.damage+spell.cost.fatigue
                }
                
                castOnTouch(player, entity, true, spell.verb);
                entity.dimension.playSound(spell.verb.sound.name, entity.location, spell.verb.sound.parameters);
                break;
              }
            }
          }
        }
        armorInv.setEquipment(armorSlots[a], armorArray[a])
      }
    }
  }
  
  if (entity instanceof Player && entity.isValid) {
    if (weaponInv != undefined) {
      let spelledItem = weaponInv?.getItem(entity.selectedSlotIndex);
      
      let dur = spelledItem?.getComponent("durability");
      let spell = spelledItem?.getDynamicProperty("bw:imbued_weapon_spell");
      if (spell) {
        spell = JSON.parse(spell);
      }
      if (dur && spell) {
        let spellCastChance = 10;
        if (diceRoll(1, 10, true) <= spellCastChance) {
          switch (spell.noun.type) {
            case "Touch": {
              if (dur.maxDurability <= dur.damage+spell.cost.fatigue) {
                spelledItem = undefined;
                weaponInv.setItem(player.selectedSlotIndex, spelledItem);
              } else {
                dur.damage = dur.damage+spell.cost.fatigue
              }
              
              castOnTouch(entity, player, true, spell.verb);
              player.dimension.playSound(spell.verb.sound.name, player.location, spell.verb.sound.parameters);
              break;
            }
          }
        }
      }
      weaponInv.setItem(entity.selectedSlotIndex, spelledItem)
    }
  }
  */
});

world.afterEvents.playerBreakBlock.subscribe(e => {
  let player = e.player;
  let blockPerm = e.brokenBlockPermutation;
  
  let medianFaeries = player?.getDynamicProperty("bw:medians");
  if (medianFaeries != undefined) {
    medianFaeries = JSON.parse(medianFaeries)
  } else {
    medianFaeries = []
  }
  let patronFaeries = player?.getDynamicProperty("bw:patrons");
  if (patronFaeries != undefined) {
    patronFaeries = JSON.parse(patronFaeries)
  } else {
    patronFaeries = []
  }
  
  // All Medians & Greater Patrons boons at varying levels of trust.
  let allFae = medianFaeries.concat(patronFaeries);
  
  for (let fae of allFae) {
    try {
      let faerie = JSON.parse(player.getDynamicProperty(`bw:${fae}`));
      let trustLevels = faerie.trust;
      
      if (faerie.id == "dwarvone") {
        if (trustLevels >= 45) {
          let sands = [
            "minecraft:sand",
            "minecraft:red_sand",
            "minecraft:gravel"
          ];
          if (sands.includes(blockPerm.type.id)) {
            if (diceRoll(1, 6, true) < 3) {
              player.runCommand(`loot spawn ${e.block.location.x} ${e.block.location.y} ${e.block.location.z} loot \"entities/desert_pyramid_brushable_block\"`);
            }
          }
        }
      }
    } catch (e) {
      return;
    }
  }
});

world.afterEvents.itemUse.subscribe(cast => {
  let player = cast.source;
  let spelledItem = cast.itemStack;
  let inv = player.getComponent("inventory").container;
  
  /*
  if (player instanceof Player && player.isValid) {
    let dur = spelledItem.getComponent("durability");
    let spell = spelledItem.getDynamicProperty("bw:imbued_item_spell");
    if (spell) {
      spell = JSON.parse(spell);
    }
    if (dur && spell) {
      switch (spell.noun.type) {
        case "Self": {
          if (dur.maxDurability <= dur.damage+spell.cost.fatigue) {
            spelledItem = undefined;
            inv.setItem(player.selectedSlotIndex, spelledItem);
          } else {
            dur.damage = dur.damage+spell.cost.fatigue
          }
          
          castOnSelf(player, true, spell.verb);
          player.dimension.playSound(spell.verb.sound.name, player.location, spell.verb.sound.parameters);
          break;
        }
        case "Bubble": {
          if (dur.maxDurability <= dur.damage+spell.cost.fatigue) {
            spelledItem = undefined;
            inv.setItem(player.selectedSlotIndex, spelledItem);
          } else {
            dur.damage = dur.damage+spell.cost.fatigue
          }
          
          let radius = {
            minRadius: spell.noun.minRadius,
            maxRadius: spell.noun.radius
          }
          castInBubble(player, true, radius, spell.verb, spell.noun.duration);
          player.dimension.playSound(spell.verb.sound.name, player.location, spell.verb.sound.parameters);
          break;
        }
        case "Bolt": {
          if (dur.maxDurability <= dur.damage+spell.cost.fatigue) {
            spelledItem = undefined;
            inv.setItem(player.selectedSlotIndex, spelledItem);
          } else {
            dur.damage = dur.damage+spell.cost.fatigue
          }
          
          castAsBolt(player, true, spell.noun, spell.verb);
          player.dimension.playSound(spell.verb.sound.missile_sound, player.location, spell.verb.sound.missile_parameters);
          break;
        }
        case "Missile": {
          if (dur.maxDurability <= dur.damage+spell.cost.fatigue) {
            spelledItem = undefined;
            inv.setItem(player.selectedSlotIndex, spelledItem);
          } else {
            dur.damage = dur.damage+spell.cost.fatigue
          }
          
          castAsMissile(player, true, spell.noun, spell.verb);
          player.dimension.playSound(spell.verb.sound.missile_sound, player.location, spell.verb.sound.missile_parameters);
          break;
        }
      }
      if (inv.getItem(player.selectedSlotIndex) != undefined || inv.getItem(player.selectedSlotIndex) == spelledItem) {
        inv.setItem(player.selectedSlotIndex, spelledItem);
      }
    }
  }
  */
});

// onSleep
SleepWorldEvent.onSleep.subscribe((data) => {
    const { sleptPlayers, worldInfo } = data;
    
    for (let player of sleptPlayers) {
      if (hasFaery(player.getDynamicProperty("bw:medians"), player.getDynamicProperty("bw:brownie"))) {
        let trust = JSON.parse(player.getDynamicProperty("bw:brownie")).trust;
        if (trust >= 70) {
          let fatg = world.scoreboard.getObjective("bw:Fatigue")?.getScore(player);
          if (fatg != undefined) {
            world.scoreboard.getObjective("bw:Fatigue")?.setScore(player, 0);
          }
          let effects = player.getEffects();
          for (let efx of effects) {
            for (let e of potionEffects) {
              if (e.effect == efx.typeId && e.type == "negative") {
                player.removeEffect(efx.typeId);
              }
            }
          }
        }
      }
      
      if (verifyPatron(player, "hebaya")) {
        greaterFae.hebaya.requests["bw:natural_ash"](player, greaterFae.hebaya);
      }
    }
});