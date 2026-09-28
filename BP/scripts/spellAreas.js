import {world, system, Scoreboard, ItemStack, EntityHealthComponent, BlockVolume, BlockVolumeBase, BlockPermutation, MolangVariableMap, MoonPhase, GameRules, Block, Entity, Player} from "@minecraft/server";
import {generateUniqueId} from "./curses.js";
import {getDistance} from "./leynexii.js";
import {diceRoll, essenceCheck, hatchFromEgg} from "./occultMagick.js";
import {allPlayersCasting} from "./spellDraw.js";
import {nounCastFunctions, verbCastFunctions, spellCastTypes, spellFormulas, isProtected, attachCustomEffect, triggerEruption, triggerVSFX} from "./faeSpells.js";
import {Vector3} from "./VectorMath/index.js";
import {visuals} from "./particleFunc.js";
import {normalizeVector} from "./spellProjectiles.js";
import {applySpellDamage} from "./spellDamage.js";

function isFlammable(block) {
  let flame = false;
  if (!block.above(1).isAir && !block.above(1).isLiquid) {
    flame = true;
  }
  if (!block.below(1).isAir && !block.below(1).isLiquid) {
    flame = true;
  }
  if (!block.west(1).isAir && !block.west(1).isLiquid) {
    flame = true;
  }
  if (!block.east(1).isAir && !block.east(1).isLiquid) {
    flame = true;
  }
  if (!block.north(1).isAir && !block.north(1).isLiquid) {
    flame = true;
  }
  if (!block.south(1).isAir && !block.south(1).isLiquid) {
    flame = true;
  }
  
  return flame;
}

export const AREA_SPELLS = new Map();
function areaLoopCheck() {
  let loop = system.runInterval(() => {
    if (AREA_SPELLS.size > 0) {
      for (let [key, bubble] of AREA_SPELLS) {
        if (!bubble.dimension.isChunkLoaded(bubble.location)) {
          bubble.duration--;
          continue;
        }
        
        if (bubble.spell.noun == "Bubble") {
          if (bubble.duration == 0) {
            AREA_SPELLS.delete(key);
            continue;
          }
          
          
          let entities = bubble.dimension.getEntities({
            location: bubble.location,
            maxDistance: bubble.maxDist,
            minDistance: bubble.minDist
          });
          
          if (bubble.duration % bubble.interval == 0) {
            visuals[bubble.spell.style.aesthetic](bubble.dimension, bubble.location, bubble.spell);
            nounCastFunctions.Bubble.onSustained(entities, bubble.spell);
          }
        }
        if (bubble.spell.noun == "Cube") {
          if (bubble.duration == 0) {
            AREA_SPELLS.delete(key);
            continue;
          }
          
          let entities = bubble.dimension.getEntities({
            location: bubble.boundingBox.from,
            volume: bubble.spell.noun_params.cubeArea
          });
          
          if (bubble.duration % bubble.interval == 0) {
            visuals[bubble.spell.style.aesthetic](bubble.dimension, bubble.location, bubble.spell);
            nounCastFunctions.Bubble.onSustained(entities, bubble.spell);
          }
        }
        
        bubble.duration--;
      }
    } else {
      system.clearRun(loop);
      console.warn("loop closed!!")
    }
  }, 1);
}

function* runCubeArea(cubeId, cubeCorners, runs) {
  if (AREA_SPELLS[cubeId] == undefined) {
    return;
  }
  let allVectors = [];
  for (let x = cubeCorners.from.x; x < cubeCorners.to.x; x++) {
    for (let y = cubeCorners.from.y; y < cubeCorners.to.y+1; y++) {
      for (let z = cubeCorners.from.z; z < cubeCorners.to.z; z++) {
        allVectors.push({
          x: x,
          y: y,
          z: z
        })
        yield;
      }
    }
  }
  //console.warn(JSON.stringify(allVectors))
  
  let areaInfo = AREA_SPELLS[cubeId];
  if (areaInfo == undefined) {
    return;
  }
  
  let dim = world.getDimension(areaInfo.dimension);
  /*
  for (let i of allVectors) {
    i = {
      x: i.x + 0.5,
      y: i.y + 0.5,
      z: i.z + 0.5
    }
    dim.spawnParticle("minecraft:basic_flame_particle", i);
  }
  */
  /*
  if (runs % 20 == 0) {
    console.warn("Current Cube Run: "+runs)
  }
  */
  for (let verb of areaInfo.spellInfo.verbs) {
    if (runs % 20 == 0 && verb.verbName == "Growth") {
      let validBlocks = allVectors.filter((b) => {
        if (!dim.isChunkLoaded(b)) {
          return;
        }
        let block = dim.getBlock(b);
        let states = block.permutation.getAllStates();
        if (states.growth != undefined) {
          return b;
        }
        if (states.age != undefined) {
          return b;
        }
      });
      
      let selectedVec = validBlocks[Math.floor(validBlocks.length * Math.random())];
      if (selectedVec != undefined) {
        let selectedBlock = dim.getBlock(selectedVec);
        
        let growthCrops = {
          "minecraft:wheat": 7,
          "minecraft:beetroot": 7,
          "minecraft:carrots": 7,
          "minecraft:potatoes": 7,
          "minecraft:melon_stems": 7,
          "minecraft:pumpkin_stems": 7,
          "minecraft:sweet_berry_bush": 3
        };
        let ageCrops = {
          "minecraft:nether_warts": 3
        }
            
        if (Object.keys(growthCrops).includes(selectedBlock.typeId)) {
          let maxGrowthStage = growthCrops[selectedBlock.typeId];
          let allStates = selectedBlock.permutation.getAllStates();
          let growthStage = allStates["growth"];
          if (growthStage < maxGrowthStage) {
            allStates["growth"] = growthStage + 1;
            selectedBlock.setPermutation(BlockPermutation.resolve(selectedBlock.typeId, allStates));
          }
        }
        
        if (Object.keys(ageCrops).includes(selectedBlock.typeId)) {
          let maxGrowthStage = ageCrops[selectedBlock.typeId];
          let allStates = selectedBlock.permutation.getAllStates();
          let growthStage = allStates["age"];
          if (growthStage < maxGrowthStage) {
            allStates["age"] = growthStage + 1;
            selectedBlock.setPermutation(BlockPermutation.resolve(selectedBlock.typeId, allStates));
          }
        }
      }
    }
    if (runs % 20 == 0 && verb.verbName == "Ignite") {
      let validBlocks = allVectors.filter((b) => {
        if (!dim.isChunkLoaded(b)) {
          return;
        }
        let block = dim.getBlock(b);
        let states = block.permutation.getAllStates();
        if (states.lit == false) {
          return b;
        }
        if (states.extinguished == true) {
          return b;
        }
      });
      
      let selectedVec = validBlocks[Math.floor(validBlocks.length * Math.random())];
      if (selectedVec != undefined) {
        let selectedBlock = dim.getBlock(selectedVec);
        let allStates = selectedBlock.permutation.getAllStates();
        if (allStates.lit == false) {
          allStates.lit = true;
          selectedBlock.setPermutation(BlockPermutation.resolve(selectedBlock.typeId, allStates));
          continue;
        }
        if (allStates.extinguished == true) {
          allStates.extinguished = false;
          selectedBlock.setPermutation(BlockPermutation.resolve(selectedBlock.typeId, allStates));
          continue;
        }
        
        if (selectedBlock.isAir) {
          if (isFlammable(selectedBlock)) {
            selectedBlock.setType("minecraft:fire");
          }
        }
      }
    }
    if (runs % 1 == 0 && verb.verbName == "Dig") {
      let validBlocks = allVectors.filter((b) => {
        if (!dim.isChunkLoaded(b)) {
          return;
        }
        let block = dim.getBlock(b);
        
        if (block.hasTag("minecraft:is_pickaxe_item_destructible")) {
          return b;
        }
        if (block.hasTag("minecraft:is_shovel_item_destructible")) {
          return b;
        }
      });
      
      let selectedVec = validBlocks[Math.floor(validBlocks.length * Math.random())];
      if (selectedVec != undefined) {
        let selectedBlock = dim.getBlock(selectedVec);
        
        let valid = true;
        let lootMngr = world.getLootTableManager();
        
        if (selectedBlock.hasTag("minecraft:stone_tier_destructible") && verb.power < 1) {
          valid = false;
        }
        if (selectedBlock.hasTag("minecraft:iron_tier_destructible") && verb.power < 2) {
          valid = false;
        }
        if (selectedBlock.hasTag("minecraft:diamond_tier_destructible") && verb.power < 3) {
          valid = false;
        }
        
        if (valid) {
          let tool;
          if (selectedBlock.hasTag("minecraft:is_shovel_item_destructible")) {
            tool = new ItemStack("minecraft:netherite_shovel", 1);
          }
          if (selectedBlock.hasTag("minecraft:is_pickaxe_item_destructible")) {
            tool = new ItemStack("minecraft:netherite_pickaxe", 1);
          }
          
          let loot = lootMngr.generateLootFromBlock(selectedBlock, tool);
          selectedBlock.setType("minecraft:air");
          if (loot != undefined) {
            for (let i of loot) {
              dim.spawnItem(i, selectedBlock.center());
            }
          }
        }
      }
    }
    if (runs % 10 == 0 && verb.verbName == "Resonate") {
      let validBlocks = allVectors.filter((b) => {
        if (!dim.isChunkLoaded(b)) {
          return;
        }
        let block = dim.getBlock(b);
        
        if (block.typeId.includes("glass")) {
          return b;
        }
      });
      
      let selectedVec = validBlocks[Math.floor(validBlocks.length * Math.random())];
      
      // Only begin breaking blocks when resonance is at its peak.
      let dmgRange = 7 - verb.quakeStrength;
      if (dmgRange < 1) {
        dmgRange = 1;
      }
      let currentRunInSecs = Math.floor(runs/20);
      
      if (currentRunInSecs >= dmgRange && selectedVec != undefined) {
        let selectedBlock = dim.getBlock(selectedVec);
        
        if (diceRoll(1, 20, true) <= 15) {
          selectedBlock.setType("minecraft:air");
        }
      }
    }
  }
  
  if (areaInfo != undefined) {
    return system.runJob(runCubeArea(cubeId, cubeCorners, runs + 1));
  }
}

export function createAreaEffect(dim, loc, spell) {
  let bubbleName = `bwArea-${generateUniqueId(10)}:${Math.floor(loc.x)}_${Math.floor(loc.y)}_${Math.floor(loc.z)}_${dim.id}`;
  
  loc = { x: loc.x + 0.5, y: loc.y + 0.5, z: loc.z + 0.5 }
  spell.centralPoint = loc;
  if (spell.noun == "Bubble") {
    let hollow = 0;
    if (spell.noun_params.hollow) {
      hollow = spell.noun_params.range - 0.65;
    }
    
    if (spell.noun_params.duration == 0) {
      let entities = dim.getEntities({
        location: loc,
        maxDistance: spell.noun_params.range,
        minDistance: hollow
      });
      
      visuals[spell.style.aesthetic](dim, loc, spell);
      nounCastFunctions.Bubble.onSustained(entities, spell);
    } else 
    if (spell.noun_params.duration > 0) {
      let bubbleObj = {
        "dimension": dim,
        "location": loc,
        "duration": spell.noun_params.duration * 20,
        "maxDist": spell.noun_params.range,
        "minDist": hollow,
        "spell": JSON.parse(JSON.stringify(spell))
      };
      
      visuals[spell.style.aesthetic](dim, loc, spell);
      
      switch (spell.verb.verbName) {
        case "Gust": {
          bubbleObj.interval = 1;
          break;
        }
        case "Surge": {
          bubbleObj.interval = 1;
          break;
        }
        default: {
          bubbleObj.interval = 20;
          break;
        }
      }
      
      if (AREA_SPELLS.size == 0) {
        areaLoopCheck();
      }
      AREA_SPELLS.set(bubbleName, bubbleObj);
    }
  }
  if (spell.noun == "Cube") {
    let currentLoc = Vector3.add(loc, spell.noun_params.offset);
    spell.centralPoint = currentLoc;
    
    let boundingBox = {
      from: {
        x: Math.floor(currentLoc.x) - Math.floor(spell.noun_params.cubeArea.x/2),
        y: Math.floor(currentLoc.y),
        z: Math.floor(currentLoc.z) - Math.floor(spell.noun_params.cubeArea.z/2)
      },
      to: {
        x: Math.floor(currentLoc.x) + Math.floor(spell.noun_params.cubeArea.x/2),
        y: Math.floor(currentLoc.y) + spell.noun_params.cubeArea.y,
        z: Math.floor(currentLoc.z) + Math.floor(spell.noun_params.cubeArea.x/2)
      }
    }
    
    if (spell.noun_params.duration == 0) {
      visuals[spell.style.aesthetic](dim, loc, spell);
      nounCastFunctions.Cube.onInstant(dim, boundingBox, spell);
    } else 
    if (spell.noun_params.duration > 0) {
      let cubeObj = {
        "dimension": dim,
        "location": loc,
        "duration": spell.noun_params.duration * 20,
        "boundingBox": boundingBox,
        "spell": JSON.parse(JSON.stringify(spell))
      };
      
      visuals[spell.style.aesthetic](dim, loc, spell);
      
      switch (spell.verb.verbName) {
        case "Gust": {
          cubeObj.interval = 1;
          break;
        }
        case "Surge": {
          cubeObj.interval = 1;
          break;
        }
        default: {
          cubeObj.interval = 20;
          break;
        }
      }
      
      if (AREA_SPELLS.size == 0) {
        areaLoopCheck();
      }
      AREA_SPELLS.set(bubbleName, cubeObj);
    }
  }
};