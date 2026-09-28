/* jshint maxerr: 10000 */
import {world, system, ItemStack, ItemLockMode, BlockTypes, EffectTypes, MolangVariableMap, Player, Entity, Block} from "@minecraft/server";
import {ActionFormData, ActionFormResponse, ModalFormData} from "@minecraft/server-ui";
import { randomize, candlePos, detectCandles, checkTimeAlignment, checkPhaseAlignment, checkWeatherAlignment, getFaery, hasFaery, getFaeries, findFaery, addFaery, addFaeryTrust, greaterOpposition, updateOfferedFaerie } from "./castRitual.js";
import {wands} from "./blockComp.js";
import { lesserFae, medianFae, greaterFae, convertFaeName, faerieSpellList, faerieEntryButtons} from "./lesserFaerie.js";
import {Vector3, Random} from "./VectorMath/index.js";
import { lostWager, FAE_GAMES, gameOfWho} from "./feyBargain.js";
import { faeSpellArray } from "./faeSpells.js";
import {capitalize} from "./wandLore.js";
import {applySpellDamage} from "./spellDamage.js";
import { diceRoll } from "./occultMagick.js";
import { customSpellEffects } from "./consumePotion.js";
import { verifyFaePrivelege } from "./spellDraw.js";
import { idToName } from "./potionCrafting.js";

const localHexFunctions = {
  "famine_hex": function* (block, params) => {
    let area = params.range;
    
    let nearbyEntities = block.dimension.getEntities().filter((e) => {
      let distance = Vector3.distance(e.location, block.location);
      if (distance <= area) {
        return e;
      }
    });
    for (let entity of nearbyEntities) {
      if (entity.getComponent("minecraft:player.hunger") != undefined) {
        let hunger = entity.getComponent("minecraft:player.hunger");
        
        if (hunger.currentValue > hunger.effectiveMin) {
          if (diceRoll(1, 100, true) < 11) {
            hunger.setCurrentValue(hunger.currentValue - 1);
          }
        }
      } else {
        continue;
      }
    }
    
    let loc = Vector3.subtract(block.location, new Vector3(Math.ceil(area/2), Math.ceil(area/2), Math.ceil(area/2)));
    
    for (let x = loc.x; x < loc.x + area; x++) {
      for (let y = loc.y; y < loc.y + area; y++) {
        for (let z = loc.z; z < loc.z + area; z++) {
          try {
            let currPos = {
              x: x,
              y: y,
              z: z
            }
            let foundBlock = block.dimension.getBlock(currPos);
            
            if (foundBlock?.isAir) {
              continue;
            }
            
            if (foundBlock?.typeId == "minecraft:farmland") {
              let aboveBlock = foundBlock.above(1);
              if (diceRoll(1, 10, true) > 6) {
                if (!aboveBlock?.isAir && !aboveBlock?.isLiquid) {
                  if (diceRoll(1, 100, true) < 16) {
                    aboveBlock?.setType("minecraft:deadbush");
                  }
                }
              } else {
                if (diceRoll(1, 100, true) < 16) {
                  if (diceRoll(1, 2, true) == 1) {
                    foundBlock?.setType("minecraft:coarse_dirt");
                  } else {
                    foundBlock?.setType("minecraft:mycelium");
                  }
                }
              }
            }
          } catch (err) {
            //console.warn(err);
          }
          yield;
        }
        yield;
      }
      yield;
    }
    
    
  },
  "drought_hex": function* (block, params) => {
    let area = params.range;
    
    let loc = Vector3.subtract(block.location, new Vector3(Math.ceil(area/2), Math.ceil(area/2), Math.ceil(area/2)));
    
    for (let x = loc.x; x < loc.x + area; x++) {
      for (let y = loc.y; y < loc.y + area; y++) {
        for (let z = loc.z; z < loc.z + area; z++) {
          try {
            let currPos = {
              x: x,
              y: y,
              z: z
            }
            let foundBlock = block.dimension.getBlock(currPos);
            if (foundBlock?.isAir) {
              continue;
            }
            
            let dirts = [
              "minecraft:grass_block",
              "minecraft:podzol_block",
              "minecraft:mycelium_block",
              "minecraft:dirt_with_roots"
            ];
            let saplings = [
              "minecraft:oak_sapling",
              "minecraft:pale_oak_sapling",
              "minecraft:dark_oak_sapling",
              "minecraft:spruce_sapling",
              "minecraft:birch_sapling",
              "minecraft:cherry_sapling",
              "minecraft:jungle_sapling",
              "minecraft:acacia_sapling"
            ];
            let grasses = [
              "minecraft:short_grass",
              "minecraft:fern",
              "minecraft:bush",
              "minecraft:sweet_berry_bush"
            ];
            let tallgrasses = [
              "minecraft:tall_grass",
              "minecraft:large_fern"
            ];
            let water = [
              "minecraft:water",
              "minecraft:flowing_water"
            ];
            
            if (water.includes(foundBlock?.typeId)) {
              if (diceRoll(1, 100, true) < 45) {
                foundBlock.setType("minecraft:air");
              }
            }
            if (dirts.includes(foundBlock?.typeId)) {
              if (diceRoll(1, 100, true) < 16) {
                foundBlock.setType("minecraft:coarse_dirt");
              }
            }
            if (saplings.includes(foundBlock?.typeId)) {
              if (diceRoll(1, 100, true) < 16) {
                foundBlock.setType("minecraft:deadbush");
              }
            }
            if (grasses.includes(foundBlock?.typeId)) {
              if (diceRoll(1, 100, true) < 16) {
                foundBlock.setType("minecraft:short_dry_grass");
              }
            }
            if (tallgrasses.includes(foundBlock?.typeId)) {
              let checkTall = foundBlock.permutation.getState("upper_block_bit");
              
              if (checkTall != undefined && checkTall == false) {
                if (diceRoll(1, 100, true) < 16) {
                  foundBlock.setType("minecraft:tall_dry_grass");
                }
              }
            }
            
            let deadPlant = BlockTypes.get("dead_"+foundBlock?.typeId);
            if (deadPlant != undefined) {
              if (diceRoll(1, 100, true) < 16) {
                foundBlock.setType(deadPlant.id);
              }
            }
          } catch (err) {
          }
          yield;
        }
        yield;
      }
      yield;
    }
  },
  "malignant_heat_hex": function* (block, params) => {
    let area = params.range;
    let nearbyEntities = block.dimension.getEntities().filter((e) => {
      let distance = Vector3.distance(e.location, block.location);
      if (distance < area) {
        return e;
      }
    });
    
    for (let entity of nearbyEntities) {
      if (entity.getComponent("minecraft:onfire") == undefined) {
        if (diceRoll(1, 100, true) < 10) {
          entity.setOnFire(10, true);
        }
      } else {
        if (diceRoll(1, 100, true) < 5) {
          entity.dimension.createExplosion(entity.location, 3, {causesFire: false, breaksBlocks: false, allowUnderwater: true});
        }
        
      }
    }
  },
  "chilling_hex": function* (block, params) => {
    let area = params.range;
    
    let loc = Vector3.subtract(block.location, new Vector3(Math.ceil(area/2), Math.ceil(area/2), Math.ceil(area/2)));
    
    for (let x = loc.x; x < loc.x + area; x++) {
      for (let y = loc.y; y < loc.y + area; y++) {
        for (let z = loc.z; z < loc.z + area; z++) {
          try {
            let currPos = {
              x: x,
              y: y,
              z: z
            }
            let foundBlock = block.dimension.getBlock(currPos);
            if (foundBlock?.isAir) {
              continue;
            }
            
            let waters = [
              "minecraft:water",
              "minecraft:flowing_water"
            ];
            
            if (waters.includes(foundBlock?.typeId)) {
              let aboveBlock = foundBlock?.above(1);
              if (aboveBlock != undefined) {
                if (aboveBlock.isAir) {
                  foundBlock.setType("minecraft:ice");
                }
              }
            }
            
            if (!foundBlock.isAir && !foundBlock.isLiquid && foundBlock.typeId != "minecraft:snow_layer" && foundBlock.typeId != "minecraft:ice") {
              let aboveBlock = foundBlock?.above(1);
              if (aboveBlock != undefined) {
                if (diceRoll(1, 100, true) < 16 && aboveBlock.typeId != "minecraft:snow_layer") {
                  if (aboveBlock.isAir) {
                    aboveBlock.setType("minecraft:snow_layer");
                  }
                }
                
                if (diceRoll(1, 100, true) < 5 && aboveBlock.typeId == "minecraft:snow_layer") {
                  let perms = aboveBlock.permutation.getAllStates();
                  if (perms["layers"] != undefined && perms["layers"] < 7) {
                    perms["layers"] = perms["layers"] + 1;
                    aboveBlock.setPermutation(BlockPermutation.resolve("minecraft:snow_layer", perms));
                  } else 
                  if (perms["layers"] != undefined && perms["layers"] == 7) {
                    aboveBlock.setType("minecraft:snow");
                  }
                }
                
              }
            }
          } catch (err) {
            //console.warn(err);
          }
          yield;
        }
        yield;
      }
      yield;
    }
  },
  "quaking": function* (block, params) => {
    let area = params.range;
    let nearbyEntities = block.dimension.getEntities().filter((e) => {
      let distance = Vector3.distance(e.location, block.location);
      if (distance < area) {
        return e;
      }
    });
    
    for (let entity of nearbyEntities) {
      if (entity.isOnGround) {
        if (entity instanceof Player) {
          entity.runCommand("camerashake add @s 0.25 2 rotational")
          entity.playSound("step.gravel", {pitch:0.08, volume:1.8});
          
          let eSlots = entity.getComponent("minecraft:equippable");
          if (eSlots != undefined) {
            let mainhand = eSlots.getEquipment("Mainhand");
            
            if (mainhand != undefined) {
              if (diceRoll(1, 100, true) < 31) {
                let droppedItem = entity.dimension.spawnItem(mainhand, entity.location);
                let view = entity.getViewDirection();
                view.y = 0;
                droppedItem?.applyImpulse(Vector3.scale(view, 1));
                eSlots.setEquipment("Mainhand", undefined);
              }
            }
          }
          
        }
        entity.applyImpulse({
          x: Math.random()*2 - 1,
          y: 0.2+Math.random()*1,
          z: Math.random()*2 - 1
        });
      }
    }
  },
}

let sculk = [
  "minecraft:sculk",
  "minecraft:sculk_vein",
  "minecraft:sculk_catalyst",
  "minecraft:sculk_sensor",
  "minecraft:calibrated_sculk_sensor",
  "minecraft:sculk_screamer"
];

export function generateUniqueId (length) {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    id += characters[randomIndex];
  }
  return id;
}

function pryingEyeEffect(witch, target) {
  if (target instanceof Entity) {
    if (target.getEffects().length > 0 || target.getDynamicPropertyIds().includes(x => x.startsWith("bwDuration:"))) {
      
      let molang = new MolangVariableMap();
      let color = {
        red: 0.2+Math.random(),
        green: 0.15+Math.random(),
        blue: 0.2+Math.random()
      }
      molang.setColorRGB("variable.color", color);
      
      witch.spawnParticle("bw:evoker_spell", target.location, molang);
    }
    if (target.getDynamicProperty("bw:cursePool") != undefined && target.getDynamicProperty("bw:cursePool") != "{}") {
      
      let molang = new MolangVariableMap();
      let color = {
        red: 0.3,
        green: 0,
        blue: 0.7,
        alpha: 0.6
      }
      molang.setColorRGBA("variable.color", color);
      
      witch.spawnParticle("bw:hexed_soul_particle", target.location, molang);
    }
    if (target.hasTag("bw:witch")) {
      let molang = new MolangVariableMap();
      let color = {
        red: 0.6,
        green: 0,
        blue: 0.65,
        alpha: 1
      }
      molang.setColorRGBA("variable.color", color);
      
      witch.spawnParticle("bw:witch_emitter_particle", target.location, molang);
    }
    if (target.hasTag("bw:magus")) {
      
      let molang = new MolangVariableMap();
      let color = {
        red: 0.9,
        green: 0.9,
        blue: 1,
        alpha: 1
      }
      molang.setColorRGBA("variable.color", color);
      
      witch.spawnParticle("bw:magus_emitter_particle", target.location, molang);
    }
    if (target.typeId == "minecraft:warden") {
      witch.playSound("mob.warden.angry", {pitch: 0.5+Math.random(), volume: 0.8+Math.random()});
      witch.applyDamage(2, {cause: "void"});
      witch.addEffect("minecraft:darkness", Math.round(0.5*60*20));
      witch.addEffect("minecraft:blindness", Math.round(0.5*60*20));
    }
  }
  if (target instanceof Block) {
    let centerCoord = {
      x: Math.floor(target.center().x),
      y: Math.floor(target.center().y),
      z: Math.floor(target.center().z)
    }
    if (world.getDynamicProperty(`bwPotion:${centerCoord.x}_${centerCoord.y}_${centerCoord.z}_${target.dimension.id}`)) {
      
      let molang = new MolangVariableMap();
      let color = {
        red: 0.2+Math.random(),
        green: 0.15+Math.random(),
        blue: 0.2+Math.random()
      }
      molang.setColorRGB("variable.color", color);
      
      witch.spawnParticle("bw:evoker_spell", target.bottomCenter(), molang);
    }
    
    // Sculk
    if (sculk.includes(target.typeId)) {
      witch.playSound("mob.warden.angry", {pitch: 0.5+Math.random(), volume: 0.8+Math.random()});
      witch.applyDamage(2, {cause: "void"});
      witch.addEffect("minecraft:darkness", Math.round(0.5*60*20));
      witch.addEffect("minecraft:blindness", Math.round(0.5*60*20));
    }
    
  }
}

function randomizeInventory(witch) {
  let inv = witch.getComponent("minecraft:inventory").container;
  
  let s1 = Math.floor(inv.size*Math.random());
  let s2 = Math.floor(inv.size*Math.random());
  
  if (diceRoll(1, 4) > 2 && inv.getItem(witch.selectedSlotIndex) != undefined) {
    s1 = witch.selectedSlotIndex;
  }
  
  let item = inv.getItem(s1);
  let item2 = inv.getItem(s2);
  
  inv.setItem(s1, item2)
  inv.setItem(s2, item)
}

function openFaerieBook(witch, tome) {
  // Actual Book Contents
  let book = new ActionFormData();
  let name = tome.nameTag;
  if (name == undefined) {
    name = "Faerie Grimoire";
  }
  book.title(name);
  book.body(`Within this tome lies an index of the Fae that have some level of a relationship with you. By reading their entry, you imbue this book with their energies, which might assist in the completion of certain rituals.\n\n`);
  
  let allFae = getFaeries(witch);
  
  if (allFae.length > 0) {
    for (let fae of allFae) {
      let faerie = faerieEntryButtons[fae.id];
      if (faerie != undefined) {
        book.button(faerie[0], faerie[1]);
      }
    }
  } else {
    return witch.sendMessage(`There are no faeries recorded in this book.`)
  }
  book.show(witch).then(r => {
    if (r.canceled || allFae[r.selection]== undefined) {
      return;
    }
    let selectedFaerie = allFae[r.selection].id;
    let inv = witch.getComponent("minecraft:inventory").container;
    
    whisperSpirit(witch, allFae[r.selection]);
    tome.setDynamicProperty("bw:attunedFaerie", selectedFaerie);
    inv.setItem(witch.selectedSlotIndex, tome);
  });
}

export function isInRain(target) {
  let overworld = world.getDimension("minecraft:overworld");
  
  let isRaining = false;
  const wthr = world.getDynamicProperty("bw:weather");
  if (wthr == "Rain" || wthr == "Thunder") {
    isRaining = true;
  }
  
  if (overworld.id != target.dimension.id) {
    return false;
  }
  let topMostBlock = overworld.getTopmostBlock({x: target.location.x, z: target.location.z});
  if (!topMostBlock) {
    return false;
  }
  let isStandingInRain = target.location.y > topMostBlock.y;
  
  if (isRaining && isStandingInRain) {
    return true;
  } else {
    return false;
  }
}

// Titania Plants to inflict poison
export const titaniaPlants = [
  "minecraft:poppy",
  "minecraft:blue_orchid",
  "minecraft:allium",
  "minecraft:azure_bluet",
  "minecraft:red_tulip",
  "minecraft:orange_tulip",
  "minecraft:white_tulip",
  "minecraft:pink_tulip",
  "minecraft:oxeye_daisy",
  "minecraft:cornflower",
  "minecraft:lily_of_the_valley",
  "minecraft:dandelion",
  "minecraft:sunflower",
  "minecraft:lilac",
  "minecraft:rose_bush",
  "minecraft:peony",
  "minecraft:wither_rose",
  "minecraft:flowering_azalea",
  "minecraft:azalea_leaves_flowered",
  "minecraft:mangrove_propugale",
  "minecraft:closed_eyeblossom",
  "minecraft:open_eyeblossom",
  "minecraft:vine",
  "minecraft:cave_vines",
  "minecraft:cave_vines_body_with_berries",
  "minecraft:cave_vines_head_with_berries",
  "minecraft:pale_hanging_moss",
  "minecraft:small_dripleaf_block",
  "minecraft:big_dripleaf",
  "minecraft:spore_blossom",
  "minecraft:grass_block",
  "minecraft:short_grass",
  "minecraft:tall_grass",
  "minecraft:fern",
  "minecraft:large_fern",
  "minecraft:moss_block",
  "minecraft:moss_carpet",
  "minecraft:pale_moss_carpet",
  "minecraft:pale_moss_block",
  "minecraft:oak_sapling",
  "minecraft:spruce_sapling",
  "minecraft:birch_sapling",
  "minecraft:jungle_sapling",
  "minecraft:acacia_sapling",
  "minecraft:dark_oak_sapling",
  "minecraft:pale_oak_sapling",
  "minecraft:cherry_sapling"
]

// Do WeatherChange Event to cycle through the weather.
let beds = [
  "minecraft:bed"
];
function randomValue(max, min) {
  return Math.random() * (max - min) + min;
}

function whisperSpirit(player, spirit) {
  let faerieInfo = findFaery(spirit.id);
  
  // All Common Variables
  // Only defined once here for neatness
  let majorFaerieCourt = faerieInfo.majorCourt;
  let likedTastes = "";
  if (faerieInfo.offerings.likedTastes.length > 0) {
    for (let t of faerieInfo.offerings.likedTastes) {
      likedTastes = likedTastes.concat(`\n (+) ${idToName(t)}`);
    }
  } else {
    likedTastes = " None";
  }
  
  let dislikedTastes = "";
  if (faerieInfo.offerings.dislikedTastes.length > 0) {
    for (let t of faerieInfo.offerings.dislikedTastes) {
      dislikedTastes = dislikedTastes.concat(`\n (-) ${idToName(t)}`);
    }
  } else {
    dislikedTastes = " None";
  }
  let color = faerieInfo.theme;
  
  // Define Form and its Name
  const faeForm = new ActionFormData();
  faeForm.title(faerieInfo.name);
  
  // Lesser Fae
  if (spirit.rank == "lesser") {
    let minorFaerieCourt = faerieInfo.minorCourt;
    if (minorFaerieCourt == undefined) {
      minorFaerieCourt = "None";
    }
    
    faeForm.body(`${color}Faerie§r: ${faerieInfo.name}\n${color}Pactee§r: ${player.name}\n${color}Fae Trust§r: ${spirit.trust}%%\n\n${color}Wylde Court§r: ${majorFaerieCourt}\n${color}Faerie Court§r: ${minorFaerieCourt}\n${color}Favored Hours§r: ${faerieInfo.favoredHours.start} - ${faerieInfo.favoredHours.end}\n\n${color}Liked Tastes§r:${likedTastes}\n${color}Disliked Offerings§r:${dislikedTastes}\n`);
  }
  // Median Fae
  if (spirit.rank == "median") {
    let minorFaerieCourt = faerieInfo.minorCourt;
    let domain = faerieInfo.sphereOfInfluence;
    let favoredColors = faerieInfo.sacredColorInfo;
    let altarBlocks = faerieInfo.altarBlockInfo;
    let titles = JSON.stringify(faerieInfo.titles).replaceAll('"', '').replaceAll("[", "").replaceAll("]", "").replaceAll(",", ", ");
    
    faeForm.body(`${color}Faerie§r: ${faerieInfo.name}\n${color}Pactee§r: ${player.name}\n${color}Fae Trust§r: ${spirit.trust}%%\n\n${color}Wylde Court§r: ${majorFaerieCourt}\n${color}Faerie Court§r: ${minorFaerieCourt}\n\n${color}Fae Titles§r: ${titles}\n${color}Domain§r: ${domain}\n${color}Sacred Color(s)§r: ${favoredColors}\n${color}Altar Blocks§r: ${altarBlocks}\n\n${color}Liked Tastes§r:${likedTastes}\n${color}Disliked Offerings§r:${dislikedTastes}\n`);
  }
  // Greater Fae
  if (spirit.rank == "greater") {
    let domain = faerieInfo.sphereOfInfluence;
    let favoredColors = faerieInfo.sacredColorInfo;
    let altarBlocks = faerieInfo.altarBlockInfo;
    let titles = JSON.stringify(faerieInfo.titles).replaceAll('"', '').replaceAll("[", "").replaceAll("]", "").replaceAll(",", ", ");
    
    faeForm.body(`${color}Faerie§r: ${faerieInfo.name}\n${color}Pactee§r: ${player.name}\n${color}Fae Trust§r: ${spirit.trust}%%\n\n${color}Wylde Court§r: ${majorFaerieCourt}\n\n${color}Fae Titles§r: ${titles}\n${color}Domain§r: ${domain}\n${color}Sacred Color(s)§r: ${favoredColors}\n${color}Altar Blocks§r: ${altarBlocks}\n\n${color}Liked Tastes§r:${likedTastes}\n${color}Disliked Offerings§r:${dislikedTastes}\n`);
  }
  
  // Form showing.
  // Only defined once.
  faeForm.divider();
  faeForm.button("[X] Close");
  faeForm.show(player).then(r => {
    return;
  });
}

function gleanSpells(faery, player, color) {
  let str = color+"Available Spells:§r\n";
  let spellArray = faerieSpellList[faery];
  for (let spell of spellArray) {
    if (verifyFaePrivelege(spell, player)) {
      let sequence;
      for (let [key, value] of Object.entries(faeSpellArray)) {
        if (value == spell) {
          sequence = key.replaceAll('[', '').replaceAll(']', '').replaceAll(",", " -> ").replaceAll('"', '');
        }
      }
      str = str.concat(`${color}${spell}§r ${sequence}\n\n`);
    }
  }
  return str
}

const hexEffects = {
  "bwHex:ocean_hold": (entity, hex) => {
    if (!entity?.isValid) {
      return;
    }
    
    if (entity.isInWater) {
      entity.applyImpulse({
        x: 0,
        y: -(2+hex.power),
        z: 0
      });
    }
  },
  "bwHex:hellish_attraction": (entity, hex) => {
    if (!entity?.isValid) {
      return;
    }
    
    if (hex.params.nextEvent == 0) {
      entity.setOnFire(5, true);
    }
  },
  "bwHex:copper_soul": (entity, hex) => {
    if (!entity?.isValid) {
      return;
    }
    
    if (isInRain(entity)) {
      if (hex.params.nextEvent == 0) {
        for (let l = 0; l < 1+hex.power; l++) {
          entity.dimension.spawnEntity("minecraft:lightning_bolt", entity.location);
        }
      }
    }
  },
  "bwHex:enderman_hex": (entity, hex) => {
    if (!entity?.isValid) {
      return;
    }
    
    if (hex.params.nextEvent == 0) {
      let v = (hex.power+1);
      let position = {
        x: entity.location.x + randomValue(-v*10, v*10),
        y: entity.location.y + randomValue(-v*2, v*2),
        z: entity.location.z + randomValue(-v*10, v*10)
      };
      entity.tryTeleport(position, {checkForBlocks:true});
    }
  },
  "bwHex:creeper_hex": (entity, hex) => {
    if (!entity?.isValid) {
      return;
    }
    
    let validEntities = []
    entity.dimension.getEntities({location:entity.location, maxDistance: 4}).forEach((e) => {
      if (e.id == entity.id) {
        return;
      }
      let family = e.getComponent("minecraft:type_family");
      if (family != undefined) {
        if (family.hasTypeFamily("cat")) {
          return validEntities.push(e);
        }
        if (family.hasTypeFamily("ocelot")) {
          return validEntities.push(e);
        }
        if (family.hasTypeFamily("player")) {
          return validEntities.push(e);
        }
      }
    })
    
    if (validEntities.length > 1) {
      if (entity instanceof Player) {
        entity.playSound("mob.creeper.hiss");
      }
      
      let chance = 5 * (1+hex.power);
      let v = Math.round(Math.random() * 100);
      if (v <= chance) {
        entity.dimension.createExplosion(entity.getAABB().center, 3+hex.power, {breaksBlocks: false, causesFire: false, allowUnderwater: true});
        
        entity.setDynamicProperty("bwHex:creeper_hex", undefined);
      }
    }
  },
  "bwHex:leadweight": (entity, hex) => {
    if (!entity?.isValid) {
      return;
    }
    
    let equip = entity.getComponent("equippable");
    let amplifier = 0;
    if (equip) {
      let armorArray = [
        equip.getEquipment("Head"),
        equip.getEquipment("Chest"),
        equip.getEquipment("Legs"),
        equip.getEquipment("Feet")
      ].filter(a => a != undefined);
      amplifier += armorArray.length;
    }
    if (amplifier == 0) {
      amplifier = undefined;
    }
    entity.addEffect("minecraft:slowness", 20*5, {amplifier: amplifier});
    
    // At and After Power V, start dealing blunt damage
    if (hex.power >= 4) {
      applySpellDamage(victim, hex.power - 4, "blunt", 0);
    }
  },
  "bwHex:death": (entity, hex) => {
    if (!entity?.isValid) {
      return;
    }
    
    if (hex.duration <= 1) {
      if (entity instanceof Player) {
        if (entity.getGameMode() == "survival" || entity.getGameMode() == "adventure") {
          entity.sendMessage("§5[-]§r Malefic power wells up and bursts inside you. Unfortunately, it was almost meant to be fatal.");
          entity.setDynamicProperty("bwHex:death", undefined);
          entity.kill();
        } else {
          hex.duration = 3;
          entity.setDynamicProperty("bwHex:death", JSON.stringify(hex));
        }
      } else {
        entity.kill();
      }
    }
  },
  "bwHex:entombment": (entity, hex) => {
    if (!entity?.isValid) {
      return;
    }
    
    let height = entity.dimension.heightRange;
    if (entity.isOnGround && entity.location.y < height.max) {
      if (hex.params.nextEvent == 0) {
        for (let l = 0; l < 1+hex.power; l++) {
          for (let y = Math.floor(entity.location.y - 1); y > height.min; y--) {
            let testBlock = entity.dimension.getBlock({
              x: entity.location.x,
              y: y,
              z: entity.location.z
            });
            
            if (!testBlock.isAir && !testBlock.isLiquid) {
              continue;
            }
            
            try {
              let safeBlock = testBlock.dimension.getBlockBelow(testBlock.location, {includeLiquidBlocks: false, includePassableBlocks: false});
              
              entity.teleport(Vector3.add(safeBlock.location, Vector3.up()));
              break;
            } catch (e) {
              console.warn("hex failed!");
            }
          }
        }
      }
    }
  },
  // bwHex:brittle_bones;
}

export function hexArea(hex, pos, dim, attr) {
  let taintHex = {
    taint_type: hex,
    position: pos,
    dimension: dim,
    attributes: attr
  }
  let idChosen = "taintHex:"+generateUniqueId(10);
  world.setDynamicProperty(idChosen, JSON.stringify(taintHex));
}
// Deals with the timer of taints
function* resolveTaintHex() {
  let taintHexes = world.getDynamicPropertyIds().filter((p) => {
    if (p.startsWith("taintHex:")) {
      return p;
    }
  });
  
  for (let t of taintHexes) {
    let taint = JSON.parse(world.getDynamicProperty(t));
    
    try {
      let blockAtPos = world.getDimension(taint.dimension)?.getBlock(taint.position);
      
      if (blockAtPos != undefined) {
        system.runJob(localHexFunctions[taint.taint_type](blockAtPos, taint.attributes));
      }
      
      taint.attributes.duration = taint.attributes.duration - 5;
      if (taint?.attributes?.duration == undefined || taint?.attributes?.duration < 0) {
        taint = undefined;
      }
      
      if (taint != undefined) {
        world.setDynamicProperty(t, JSON.stringify(taint));
      } else {
        world.setDynamicProperty(t, undefined);
      }
    } catch (e) {
      console.warn("TAINT ISSUE: "+e);
      continue;
    }
  }
  yield;
}

system.runInterval(() => {
  if (world.getDynamicProperty("bw:weather") == undefined) {
    world.setDynamicProperty("bw:weather", "Clear");
  }
  let dimension = [
    "minecraft:overworld",
    "minecraft:nether",
    "minecraft:the_end"
  ];
  for (let dim of dimension) {
    // Run Hexes
    world.getDimension(dim).getEntities().forEach((entity) => {
      let allProperties = entity.getDynamicPropertyIds();
      let revisedHexes = [];
      for (let p of allProperties) {
        if (p.startsWith("bwHex:")) {
          revisedHexes.push(p);
        }
      }
      
      for (let hex of revisedHexes) {
        let parsed = JSON.parse(entity.getDynamicProperty(hex));
        if (hexEffects[hex] != undefined) {
          hexEffects[hex](entity, parsed);
        }
        
        if (parsed.params?.nextEvent != undefined) {
          if (parsed.params.nextEvent > 0) {
            parsed.params.nextEvent--;
            entity.setDynamicProperty(hex, JSON.stringify(parsed));
          } else {
            parsed.params.nextEvent = randomize(parsed.params.timeArray);
            entity.setDynamicProperty(hex, JSON.stringify(parsed));
          }
        }
        if (parsed.duration != undefined) {
          if (parsed.duration > 1) {
            parsed.duration--;
            entity.setDynamicProperty(hex, JSON.stringify(parsed));
          } else {
            entity.setDynamicProperty(hex, undefined);
            
            if (entity.getDynamicProperty("bw:hexPool")) {
              let hexPool = JSON.parse(hexPool);
              if (hexPool.includes(hex)) {
                hexPool = hexPool.filter(h => h != hex);
              }
              entity.setDynamicProperty("bw:hexPool", JSON.stringify(hexPool));
            }
          }
        }
      }
    });
    // Run Duration Functions
    world.getDimension(dim).getEntities().forEach((entity) => {
      let allProperties = entity.getDynamicPropertyIds();
      let revisedEffects = [];
      for (let p of allProperties) {
        if (p.startsWith("bwDuration:")) {
          revisedEffects.push(p);
        }
      }
      
      for (let duration of revisedEffects) {
        let parsed = JSON.parse(entity.getDynamicProperty(duration));
        if (customSpellEffects[duration] != undefined) {
          customSpellEffects[duration](entity, parsed);
        }
        
        if (entity.typeId == "minecraft:player") {
          //entity.sendMessage(`${parsed.name}-> (${parsed.timer})`)
        }
        if (parsed.timer != undefined) {
          if (parsed.timer > 1) {
            parsed.timer--;
            entity.setDynamicProperty(duration, JSON.stringify(parsed));
          } else {
            if (entity instanceof Player) {
              if (parsed.endMsg != undefined) {
                entity.sendMessage(parsed.endMsg);
              }
            }
            entity.setDynamicProperty(duration, undefined);
          }
        } 
        
        if (parsed.dayTimer != undefined) {
          let dayAmount = Math.abs(parsed.dayCast - world.getDay())
          if (dayAmount > 0 && dayAmount <= 7) {
            if (checkPhaseAlignment(entity, [parsed.phase])) {
              if (checkTimeAlignment(entity, [parsed.time])) {
                if (entity.typeId == "minecraft:player") {
                  entity.sendMessage(parsed.endMsg);
                }
                entity.setDynamicProperty(duration, undefined);
              }
            }
          } else {
            if (entity.typeId == "minecraft:player") {
              entity.sendMessage(parsed.endMsg);
            }
            entity.setDynamicProperty(duration, undefined);
          }
        }
        /*
        if (parsed.timer > 1) {
          parsed.timer--;
          entity.setDynamicProperty(duration, JSON.stringify(parsed));
          if (parsed.damageOverTime != undefined) {
            let DoT = parsed.damageOverTime;
            entity.applyDamage(DoT.damageAmount, {cause: DoT.cause});
          }
          if (duration == "bwDuration:brambles") {
            if (parsed.inversed) {
              entity.dimension.getEntities({location: entity.location, maxDistance: 3}).forEach(i => {
                i.addEffect("minecraft:slowness", 200, {showParticles: false});
                i.applyDamage(1, {cause: "thorns"});
              });
            }
          }
          if (duration == "bwDuration:prying_eyes") {
            let seenThing = entity?.getEntitiesFromViewDirection()[0]?.entity;
            if (seenThing == undefined) {
              seenThing = entity?.getBlockFromViewDirection()?.block;
            }
            
            if (seenThing != undefined) {
              pryingEyeEffect(entity, seenThing);
            }
          }
          if (duration == "bwDuration:stoneSkin") {
            if (parsed.inversed) {
              entity.addEffect("minecraft:slowness", 60, {showParticles: false, amplifier: 89});
            }
          }
          if (duration == "bwDuration:living_inventory") {
            if (diceRoll(1, 20, true) <= parsed.diceSave) {
              randomizeInventory(entity)
            }
            if (parsed.inversed) {
              entity.addEffect("minecraft:slowness", 60, {showParticles: false, amplifier: 89});
            }
          }
          if (duration == "bwDuration:bulward") {
            if (entity.getDynamicProperty("bw:bulward_damage") === undefined && !parsed.firstRunComplete) {
              let entityHealth = entity.getComponent("minecraft:health");
              entity.setDynamicProperty("bw:bulward_damage", 20*(parsed.amplifier+1));
              if (entity.getDynamicProperty("bw:bulward_savedDamage") === undefined) {
                entity.setDynamicProperty("bw:bulward_savedDamage", entityHealth.currentValue);
              }
            }
            if (entity.getDynamicProperty("bw:bulward_projectiles") === undefined) {
              entity.setDynamicProperty("bw:bulward_projectiles", 20*(parsed.amplifier+1));
            }
          }
        } else {
          if (entity.typeId == "minecraft:player") {
            entity.sendMessage(parsed.endMsg);
          }
          if (duration == "bwDuration:titanianTamed") {
            if (entity.dimension.getBlock(entity.location).isAir) {
              entity.dimension.setBlockType(entity.location, titaniaPlants[Math.ceil(titaniaPlants.length*Math.random())]);
            }
            if (entity.typeId == "minecraft:player") {
              entity.kill();
            } else {
              entity.remove();
            }
            continue;
          }
          if (duration == "bwDuration:stoneSkin") {
            entity.removeEffect("minecraft:slowness");
          }
          if (duration == "bwDuration:bulward") {
            let entityHealth = entity.getComponent("minecraft:health");
            entity.setDynamicProperty("bw:bulward_damage", undefined);
            if (entity.getDynamicProperty("bw:bulward_savedDamage") != undefined) {
              entityHealth?.setCurrentValue(entity.getDynamicProperty("bw:bulward_savedDamage"));
            }
            entity.setDynamicProperty("bw:bulward_savedDamage", undefined);
            entity.setDynamicProperty("bw:bulward_projectiles", undefined);
            entity.removeEffect("minecraft:health_boost");
          }
          entity.setDynamicProperty(duration, undefined);
        }
        
        if (duration == "bwDuration:titania_hexed") {
          let block = entity.dimension.getBlock(entity.location);
          let blockBelow = block.below();
          let poisonEffect = entity.getEffect("minecraft:fatal_poison");
          let slowEffect = entity.getEffect("minecraft:slowness");
    
          if (titaniaPlants.includes(blockBelow.typeId) || titaniaPlants.includes(block.typeId)) {
            if (poisonEffect == undefined || (poisonEffect != undefined && poisonEffect.duration <= 200)) {
              entity.addEffect("minecraft:fatal_poison", 310)
            }
            if (slowEffect == undefined || (slowEffect != undefined && slowEffect.duration <= 200) || (slowEffect.amplifier == undefined || slowEffect.amplifier < 2)) {
              entity.addEffect("minecraft:slowness", 310, {amplifier: 2})
            }
          }
        }
        if (duration == "bwDuration:titania_blessed") {
          let block = entity.dimension.getBlock(entity.location);
          let blockBelow = block.below();
          let healthBoostEffect = entity.getEffect("minecraft:health_boost");
          let regenEffect = entity.getEffect("minecraft:regeneration");
    
          if (titaniaPlants.includes(blockBelow.typeId) || titaniaPlants.includes(block.typeId)) {
            if (regenEffect == undefined || (regenEffect != undefined && regenEffect.duration <= 200)) {
              entity.addEffect("minecraft:regeneration", 310)
            }
            if (healthBoostEffect == undefined || (healthBoostEffect != undefined && healthBoostEffect.duration <= 200) || (healthBoostEffect.amplifier == undefined || healthBoostEffect.amplifier < 4)) {
              entity.addEffect("minecraft:health_boost", 310, {amplifier: 4});
            }
          }
        }
        if (duration == "bwDuration:debauched_frenzy") {
          let entityHealth = entity.getComponent("minecraft:health");
          if (entityHealth?.currentValue > 0) {
            let strengthEffect = entity.getEffect("minecraft:strength");
            let nauseaEffect = entity.getEffect("minecraft:nausea");
            let health = entityHealth?.currentValue;
            let maxHealth = entityHealth?.effectiveMax;
            let percentage = Math.round((health/maxHealth)*100);
            
            let strengthPowerArr = [
              [20, 2],
              [40, 1],
              [100, undefined]
            ]
            
            for (let power of strengthPowerArr) {
              if (percentage <= power[0]) {
                if (strengthEffect == undefined || (strengthEffect?.duration <= 200)) {
                  entity.addEffect("minecraft:strength", 310, {amplifier: power[0]});
                }
                if (power[1]) {
                  if (nauseaEffect == undefined || (nauseaEffect?.duration <= 200)) {
                    entity.addEffect("minecraft:nausea", 310, {amplifier: 1});
                  }
                  entity.camera.fade({fadeColor: {red:0.517, blue:0.074, green:0.098}, fadeTime: {fadeInTime: 0.5, fadeOutTime: 0.5, holdTime: 0}});
                }
              }
            }
          }
        }
        */
      }
    });
    // Pulse Custom Effect
    world.getDimension(dim).getEntities().forEach((entity) => {
      if (!entity?.isValid) {
        return;
      }
      let heartBeat = entity.getDynamicProperty("bw:heart_pulse");
      if (heartBeat) {
        heartBeat = JSON.parse(heartBeat);
      } else {
        return;
      }
      
      let runEffect = false;
      if (heartBeat.timer != undefined) {
        if (heartBeat.timer > 1) {
          heartBeat.timer--;
          entity.setDynamicProperty("bw:heart_pulse", JSON.stringify(heartBeat));
          runEffect = true;
        } else {
          if (heartBeat.currentRate > 0) {
            heartBeat.currentRate--;
          } else
          if (heartBeat.currentRate < 0) {
            heartBeat.currentRate++;
          }
          
          if (heartBeat.currentRate !== 0) {
            entity.setDynamicProperty("bw:heart_pulse", JSON.stringify(heartBeat));
            runEffect = true;
          } else 
          if (heartBeat.currentRate == 0) {
            entity.setDynamicProperty("bw:heart_pulse", undefined);
            return;
          }
        }
      }
      
      if (runEffect) {
        if (heartBeat.currentRate == 3) {
          entity.applyDamage(1, {cause: "none"});
          entity.addEffect("minecraft:nausea", 5*20, {amplifier: 8, showParticles: false});
          if (entity instanceof Player) {
            entity.playSound("mob.warden.heartbeat", {
              pitch: 2.4
            })
          }
        }
        if (heartBeat.currentRate == 2) {
          if (entity instanceof Player) {
            entity.camera.fade({fadeColor: {"red": 0, "blue": 0, "green": 0}, fadeTime: {fadeInTime: 0.5, fadeOutTime: 0.5, holdTime: 0}});
            entity.playSound("mob.warden.heartbeat", {
              pitch: 1.9
            })
          }
          entity.addEffect("minecraft:speed", 5*20, {amplifier: 1});
        }
        if (heartBeat.currentRate == 1) {
          entity.addEffect("minecraft:speed", 5*20, {amplifier: undefined, showParticles: false});
          entity.addEffect("minecraft:haste", 5*20, {amplifier: undefined, showParticles: false});
          if (entity instanceof Player) {
            entity.playSound("mob.warden.heartbeat", {
              pitch: 1.5
            })
          }
        }
        if (heartBeat.currentRate == -1) {
          if (entity instanceof Player) {
            let saturation = entity.getComponent("minecraft:player.saturation");
            saturation.resetToMaxValue();
            entity.playSound("mob.warden.heartbeat", {
              pitch: 0.8
            })
          }
        }
        if (heartBeat.currentRate == -2) {
          entity.addEffect("minecraft:slowness", 5*20, {showParticles: false});
          entity.addEffect("minecraft:mining_fatigue", 5*20, {showParticles: false});
          entity.addEffect("minecraft:nausea", 5*20, {showParticles: false});
          
          if (entity instanceof Player) {
            entity.playSound("mob.warden.heartbeat", {
              pitch: 0.34
            })
          }
        }
        if (heartBeat.currentRate == -3) {
          entity.addEffect("minecraft:slowness", 5*20, {amplifier: 2, showParticles: false});
          entity.addEffect("minecraft:mining_fatigue", 5*20, {amplifier: 2, showParticles: false});
          entity.addEffect("minecraft:nausea", 5*20, {amplifier: 2, showParticles: false});
          
          if (entity instanceof Player) {
            entity.playSound("mob.warden.heartbeat", {
              pitch: 0.1
            })
          }
        }
      }
      
    });
    // Run Ward Effects
    world.getDimension(dim).getEntities().forEach((entity) => {
      let allProperties = entity.getDynamicPropertyIds();
      let revisedWards = [];
      for (let p of allProperties) {
        if (p.startsWith("bwWard:")) {
          revisedWards.push(p);
        }
      }
      
      for (let ward of revisedWards) {
        let parsedWard = JSON.parse(entity.getDynamicProperty(ward));
        
        /*
        if (customSpellEffects[duration] != undefined) {
          customSpellEffects[duration](entity, parsed);
        }
        */
        
        if (parsedWard.timer != undefined) {
          if (parsedWard.timer > 1) {
            parsedWard.timer--;
            entity.setDynamicProperty(ward, JSON.stringify(parsedWard));
          } else {
            if (entity instanceof Player) {
              entity.sendMessage(`§c[!]§r Your Ward against §a${parsedWard.verb}§r falls away.`);
            }
            entity.setDynamicProperty(ward, undefined);
          }
        } 
      }
    });
    
    // Fae Game Time
    world.getDimension(dim).getPlayers().forEach((gamer) => {
      if (gamer.getDynamicProperty("bw:faeryGame") != undefined) {
        let faeGame = JSON.parse(gamer.getDynamicProperty("bw:faeryGame"));
        if (faeGame.delayed) {
          let game = FAE_GAMES[faeGame.gameId];
          let condition = gamer.getDynamicProperty("bw:gameDelay");
          if (condition == "low_light") {
            if (gamer.dimension.getLightLevel(gamer.location) <= 6) {
              faeGame.delayed = undefined;
              gamer.setDynamicProperty("bw:gameDelay", undefined);
              gamer.sendMessage(game.description(gamer.dimension, gamer.location, faeGame));
            }
          }
          
          gamer.setDynamicProperty("bw:faeryGame", JSON.stringify(faeGame));
          return;
        }
        
        let faery = findFaery(faeGame.faeryId);
        let dayDiff = faeGame.finishDay - faeGame.currentDay;
        if (dayDiff <= 0) {
          if (dayDiff < 0 || dayDiff == 0) {
            if (faeGame.gameId == "joyful_frolick") {
              if (faeGame.it) {
                gamer.playSound("random.levelup");
                gamer.sendMessage(`§a[!]§r You won your wager against §g${faery.name}§r! Maybe it was not fairly, but it certainly was squarely.`);
                addFaery(gamer, faery);
                gamer.setDynamicProperty("bw:faeryGame", undefined);
                return;
              } else {
                gamer.sendMessage(`§c[!]§r You lost your wager against §g${faery.name}§r!`);
                lostWager(gamer);
                gamer.setDynamicProperty("bw:faeryGame", undefined);
                return;
              }
            }
            if (faeGame.gameId == "helpful_gardener") {
              if (faeGame.planted == 0 && faeGame.harvested == 0) {
                gamer.playSound("random.levelup");
                gamer.sendMessage(`§a[!]§r You won your wager against §g${faery.name}§r! Maybe it was not fairly, but it certainly was squarely.`);
                addFaery(gamer, faery);
                gamer.setDynamicProperty("bw:faeryGame", undefined);
                return;
              } else {
                gamer.sendMessage(`§c[!]§r You lost your wager against §g${faery.name}§r!`);
                lostWager(gamer);
                gamer.setDynamicProperty("bw:faeryGame", undefined);
                return;
              }
            }
            if (faeGame.gameId == "flower_picking") {
              gamer.sendMessage(`§c[!]§r You lost your wager against §g${faery.name}§r!`);
              lostWager(gamer);
              gamer.setDynamicProperty("bw:faeryGame", undefined);
              return;
            }
            // Who is Here
          }
        } else {
          // Overwrite date
          faeGame.currentDay = world.getDay();
          gamer.setDynamicProperty("bw:faeryGame", JSON.stringify(faeGame));
        }
        
        // Constantly run this code.
        if (faeGame.gameId == "who_is_here") {
          if (gamer.getDynamicProperty("bw:gameDelay")) {
            return;
          }
          
          // Trigger Walk Away
          if (gamer.dimension.getLightLevel(gamer.location) > 6) {
            if (faeGame.steps > 10) {
              gamer.sendMessage(`§c[!]§r Who can find those shrouded in the darkness. Who cannot see those illuminated by the light. You've lost your wager against §g${faery.name}§r!`);
              lostWager(gamer);
              gamer.setDynamicProperty("bw:faeryGame", undefined);
              return;
            } else {
              gamer.playSound("step.stone", {
                volume: 1 * (faeGame.steps/10)
              });
            }
            faeGame.steps = faeGame.steps + 1;
          } else {
            // Trigger Walk Back
            if (faeGame.steps > 0) {
              gamer.playSound("step.stone", {
                volume: 1 * (faeGame.steps/10)
              });;
              faeGame.steps = faeGame.steps - 1;
            }
          }
          
          // Timer hits 0
          if (faeGame.timer == 0) {
            // Trigger Game Mechanisms
            gameOfWho(gamer, faeGame);
            // Reset Knock Game Timer
            faeGame.timer = 40 + Math.ceil(Math.random() * 4) * 10;
          } else {
            // Slowly reduce timer
            faeGame.timer = faeGame.timer - 1;
            // Auditory Illusions
          }
          
          // Set Game
          gamer.setDynamicProperty("bw:faeryGame", JSON.stringify(faeGame));
        }
      }
    });
  }
}, 20);

system.runInterval(() => {
  system.runJob(resolveTaintHex());
}, 100);

world.afterEvents.weatherChange.subscribe(wthr => {
  let dim = wthr.dimension;
  
  world.setDynamicProperty("bw:weather", wthr.newWeather);
});

world.beforeEvents.playerInteractWithBlock.subscribe(e => {
  const item = e.itemStack;
  const player = e.player;
  const block = e.block;
  
  if (player.getDynamicProperty("bw:cursePool") && beds.includes(block.typeId)) {
    let insomnia = JSON.parse(player.getDynamicProperty("bw:cursePool"))?.insomnia;
    if (insomnia) {
      e.cancel = true;
      player.sendMessage("§cNo monster disturbs your sleep, but Night watches you closely. You cannot rest.§r")
    }
  }
});

// Transmuting stuff
world.afterEvents.playerInteractWithBlock.subscribe(e => {
  const item = e.itemStack;
  const player = e.player;
  const block = e.block;
  
  if (block != undefined && item != undefined && block.typeId == "minecraft:crafting_table" && item.typeId == "bw:natural_ash") {
    block.dimension.runCommand(`particle bw:absorb_earth_essence ${block.location.x} ${block.location.y + 0.5} ${block.location.z}`);
    system.runTimeout(transmute => {
      block.dimension.runCommand(`particle bw:energy_burst ${block.location.x} ${block.location.y + 0.5} ${block.location.z}`);
      block.dimension.runCommand(`setblock ${block.location.x} ${block.location.y} ${block.location.z} bw:witch_bench replace`);
      block.dimension.runCommand(`execute positioned ${block.location.x} ${block.location.y} ${block.location.z} run playsound cauldron.explode @a[r=6] ~~~ 1`);
    }, 2*20);
    
    if (item.amount > 1) {
      item.amount--
    } else {
      item = undefined;
    }
    player.getComponent("inventory").container.setItem(player.selectedSlotIndex, item);
  }
  
  if (block?.typeId == "minecraft:barrel") {
    let loc = {
      x: Math.floor(block.location.x),
      y: Math.floor(block.location.y),
      z: Math.floor(block.location.z)
    };
    let ferment_loc = `bw:barrel_enchanted_${loc.x}_${loc.y}_${loc.z}`;
    if (world.getDynamicProperty(ferment_loc) != undefined) {
      let dayEnchanted = world.getDynamicProperty(ferment_loc);
      let inventory = block.getComponent("minecraft:inventory").container;
      for (let i = 0; i < inventory.size; i++) {
        let slot = inventory.getItem(i);
        if (slot?.getDynamicProperty("bw:potion")) {
          let dayTaken;
          if (slot.getDynamicProperty("bw:fermented") != undefined) {
            dayTaken = slot.getDynamicProperty("bw:fermented")+Math.abs(world.getDay() - dayEnchanted);
          } else {
            dayTaken = Math.abs(world.getDay() - dayEnchanted);
          }
          
          slot.setDynamicProperty("bw:fermented", dayTaken);
          
          let lore = slot.getLore();
          if (lore[lore.length - 1].includes("Fermented")) {
            lore[lore.length - 1] = `§r§bFermented for ${dayTaken} Day(s)§r`;
            slot.setLore(lore);
          } else {
            slot.setLore(slot.getLore().concat([`§r§bFermented for ${dayTaken} Day(s)§r`]))
          }
          inventory.setItem(i, slot);
        }
      }
      world.setDynamicProperty(ferment_loc, undefined)
    }
  }
});

world.afterEvents.entityHurt.subscribe(e => {
  let damage = e.damage;
  let damageSource = e.damageSource.cause;
  let damager = e.damageSource.damagingEntity;
  let victim = e.hurtEntity;
  
  if (victim.isValid && victim?.getDynamicProperty("bwHex:brittle_bones") != undefined) {
    let boneHex = JSON.parse(victim.getDynamicProperty("bwHex:brittle_bones"));
    
    if (boneHex != undefined) {
      if (damageSource == "entityAttack" || damageSource == "fall") {
        let dmgPerc = 0.25;
        if (boneHex.power > 1) {
          dmgPerc = dmgPerc * boneHex.power;
        }
        
        let additionalDamage = damage*dmgPerc;
        applySpellDamage(victim, additionalDamage, "blunt", 0);
      }
    }
  }
  
  if (damager?.isValid && damager?.getDynamicProperty("bwHex:sympathy") != undefined) {
    let sympathyHex = JSON.parse(damager.getDynamicProperty("bwHex:sympathy"));
    
    let perc = 15 + (sympathyHex.power * 15);
    if (perc > 100) {
      perc = 100;
    }
    applySpellDamage(damager, damage/perc, "occult", 0);
  }
});

world.afterEvents.itemUse.subscribe(e => {
  const item = e.itemStack;
  const player = e.source;
  
  // Tell the Time
  if (item != undefined && item.typeId == "minecraft:clock") {
    player.sendMessage(`The time is now: ${world.getTimeOfDay()}`);
  }
  
  // Tell Faerie Attributes
  if (item != undefined && item.typeId == "bw:faerie_grimoire") {
    // let owner = item.getDynamicProperty("bw:bookOwner");
    /*if (owner != player.id) {
      player.sendMessage("§c[!]§r You do not own this Faerie Grimoire.");
      return;
    }*/
    
    if (!player.isSneaking) {
      openFaerieBook(player, item);
    } else {
      if (item.getDynamicProperty("bw:attunedFaerie")) {
        player.sendMessage(`§a[+]§r The bookmark is currently set to ${capitalize(item.getDynamicProperty("bw:attunedFaerie"))}'s page`);
      } else {
        player.sendMessage(`§c[-]§r The bookmark is currently not on any page.`);
      }
    }
  }
});

// REVISIT
world.afterEvents.entityDie.subscribe(event => {
  const deceased = event.deadEntity;
  if (deceased != undefined) {
    try {
      if (deceased.typeId == "minecraft:player") {
        let player = world.getPlayers().filter((e) => {
          if (e.id == deceased.id) {
            return e;
          }
        })[0];
        let allProperties = player.getDynamicPropertyIds();
        let revisedEffects = [];
        for (let p of allProperties) {
          if (p.startsWith("bwDuration:")) {
            revisedEffects.push(p);
          }
        }
        
        for (let dur of revisedEffects) {
          player.setDynamicProperty(dur, undefined);
        }
        player.setDynamicProperty("bw:heart_pulse", undefined);
      }
    } catch (e) {
      return;
    }
  }
});