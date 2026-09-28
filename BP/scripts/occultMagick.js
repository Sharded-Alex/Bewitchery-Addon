import {world, MoonPhase, BlockPermutation, Entity, Player, Block, EntityHealthComponent, BlockTypes, BlockVolume, BlockVolumeBase, MolangVariableMap, system, ItemStack, ItemLockMode, ItemTypes, CommandPermissionLevel, CustomCommandParamType} from "@minecraft/server";
import {ActionFormData, MessageFormData, ModalFormData} from "@minecraft/server-ui";
import {wands} from "./blockComp.js";
import {getDistance} from "./leynexii.js";
import {hasFaery, findFaery, getFaery, addFaery, removeFaery, addFaeryTrust, ritualHexTarget, cleanseTarget} from "./castRitual.js";
import {spawnMagicCircle, deductOrbos, getSourceFromSpell} from "./spellDraw.js";
import {createEntityHitLightning} from "./lightning.js";
import {circleBres, faerieSpells, spellFormulas, spellCastTypes, nounCastFunctions, inSpellCosts, attachCustomEffect, baseNounOrbos, baseNounFatigue, baseVerbOrbos, baseVerbFatigue, spellNounList, spellVerbList, spellAestheticList, getSpellPieces, getAestheticPieces} from "./faeSpells.js";
import {faeries, lesserFae, medianFae, greaterFae} from "./lesserFaerie.js";
import {Vector3, Random} from "./VectorMath/index.js";
import {localizeVec, localizePos} from "./localize.js";
import {capitalize} from "./wandLore.js";
import { wardingDusts, checkSwitch, jackEat, getFace } from "./wardArrays.js";
import {titaniaPlants, isInRain} from "./curses.js";
import {verifyPatron} from "./altars.js";
import {createBolt, calcVectorOffset} from "./spellProjectiles.js";
import {createAreaEffect} from "./spellAreas.js";
import {spellRead, spellOnomastics} from "./spellInfo.js";
import {visuals} from "./particleFunc.js";
import {familiarRegistry, getTrueFamiliars, hasFamiliar, isFamiliar, addFamiliarToRegistry, isPlayerFamiliar, dismissFamiliar, returnFamiliar} from "./familiars.js";
import {getItem, removeItem} from "./getTaglock.js";


export async function hatchFromEgg (originBlk, caster) => {
  let entityName = undefined;
  let id = undefined;
  let inv = undefined;
  let source = getSourceFromSpell(caster);
  
  if (source != undefined) {
    if (caster.type == "entity") {
      let equipment = source.getComponent("minecraft:equippable");
      let offhand = equipment?.getEquipment("Offhand");
      if (offhand) {
        if (offhand.getDynamicProperty("bw:blood")) {
          let blood = JSON.parse(offhand.getDynamicProperty("bw:blood"));
          entityName = blood.type;
          id = blood.id;
          
          if (source.getComponent("minecraft:inventory")) {
            inv = source.getComponent("minecraft:inventory");
          }
        }
      }
    }
    if (caster.type == "jack") {
      let jackOWard = world.getDynamicProperty(caster.sourceID);
    
      if (jackOWard != undefined) {
        jackOWard = JSON.parse(jackOWard);
        let dim = world.getDimension(jackOWard.dimension);
        
        if (jackOWard.effect == "bw:amethyst_dust") {
          let lecternPos = {
            x: jackOWard.params[1].x,
            y: jackOWard.params[1].y - 1,
            z: jackOWard.params[1].z
          };
          
          if (dim.isChunkLoaded(lecternPos)) {
            let storageBlk = dim.getBlock(lecternPos);
            
            let equipment = storageBlk.getComponent("minecraft:inventory");
            let offhand = equipment?.container?.getItem(0);
            if (offhand) {
              if (offhand.getDynamicProperty("bw:blood")) {
                let blood = JSON.parse(offhand.getDynamicProperty("bw:blood"));
                entityName = blood.type;
                id = blood.id;
                
                inv = equipment;
              }
            }
          }
        }
      }
    }
  }
  
  if (entityName && inv != undefined) {
    let foundItem = getItem(inv.container, ["minecraft:egg", "minecraft:brown_egg", "minecraft:blue_egg"], true);
    if (!foundItem) {
      return;
    }
    
    if (entityName == "minecraft:player") {
      let player = world.getEntity(id);
      if (player != undefined) {
        if (originBlk.dimension.id == player.dimension.id) {
          player.teleport(originBlk.center());
          
          removeItem(inv.container, ["minecraft:egg", "minecraft:brown_egg", "minecraft:blue_egg"], true);
          originBlk.dimension.playSound("random.explode", originBlk.center());
        }
      }
    } else {
      let chick = originBlk.dimension.spawnEntity(entityName, originBlk.center());
      try {
        chick.triggerEvent("minecraft:entity_born");
        removeItem(inv.container, ["minecraft:egg", "minecraft:brown_egg", "minecraft:blue_egg"], true);
        originBlk.dimension.playSound("random.explode", originBlk.center());
      } catch (e) {
        chick.remove();
      }
    }
  }
}

export let validCandles = [
  "minecraft:candle",
  "minecraft:white_candle",
  "minecraft:black_candle",
  "minecraft:green_candle",
  "minecraft:lime_candle",
  "minecraft:yellow_candle",
  "minecraft:orange_candle",
  "minecraft:red_candle",
  "minecraft:blue_candle",
  "minecraft:light_blue_candle",
  "minecraft:pink_candle",
  "minecraft:purple_candle",
  "minecraft:magenta_candle",
  "minecraft:brown_candle",
  "minecraft:cyan_candle",
  "minecraft:gray_candle",
  "minecraft:light_gray_candle"
];
let shrooms = [
  "minecraft:brown_mushroom",
  "minecraft:red_mushroom"
]
let hearths = [
  "minecraft:campfire",
  "minecraft:lit_furnace"
]
let dimensions = [
  "minecraft:overworld", 
  "minecraft:nether", 
  "minecraft:the_end"
]
// Honey Block filling
let honeyContainers = [
  "minecraft:beehive",
  "minecraft:bee_nest"
]

async function determineCost(contents) {
  let cost = {
    "occultEnergy": 0,
    "fatigue": 0,
    "tags": [],
    "cooldown": 0
  };
  
  if (inSpellCosts[contents.noun]) {
    let spellBitCost = inSpellCosts[contents.noun];
    let baseNO = baseNounOrbos;
    let baseNF = baseNounFatigue;
    
    cost.occultEnergy += Math.ceil(baseNO * spellBitCost.orbos);
    cost.fatigue += Math.ceil(baseNF * spellBitCost.fatigue);
    cost.cooldown += spellBitCost.cooldown;
    
    for (let t of spellBitCost.tags) {
      if (!cost.tags.includes(t)) {
        cost.tags.push(t);
      }
    }
    
    if (contents.nested_noun) {
      let nestedBitCost = inSpellCosts[contents.nested_noun.noun];
      
      if (nestedBitCost != undefined) {
        cost.occultEnergy += Math.ceil(baseNO * nestedBitCost.orbos);
        cost.fatigue += Math.ceil(baseNF * nestedBitCost.fatigue);
        cost.cooldown += nestedBitCost.cooldown;
        
        for (let t of nestedBitCost.tags) {
          if (!cost.tags.includes(t)) {
            cost.tags.push(t);
          }
        }
      }
    }
  }
  if (inSpellCosts[contents.verb.verbName]) {
    let spellBitCost = inSpellCosts[contents.verb.verbName];
    let baseVO = baseVerbOrbos;
    let baseVF = baseVerbFatigue;
    
    cost.occultEnergy += Math.ceil(baseVO * spellBitCost.orbos);
    cost.fatigue += Math.ceil(baseVF * spellBitCost.fatigue);
    cost.cooldown += spellBitCost.cooldown;
    
    for (let t of spellBitCost.tags) {
      if (!cost.tags.includes(t)) {
        cost.tags.push(t);
      }
    }
  }
  
  if (cost.occultEnergy < 0) {
    cost.occultEnergy = 0;
  }
  if (cost.fatigue < 0) {
    cost.fatigue = 0;
  }
  if (cost.cooldown < 0.1) {
    cost.cooldown = 0.1;
  }
  console.warn(JSON.stringify(cost));
  return cost;
}

function triggerDelayedExplosion(dim, loc, del) {
  let i = 0;
  let loop = system.Interval(() => {
    if (i == 0) {
      dim.playSound("mob.creeper.hiss", loc)
    }
    if (i < del) {
      dim.spawnParticle("minecraft:green_flame_particle", loc);
    }
    if (i == del) {
      dim.createExplosion(loc, 1.5, {breaksBlocks: false, allowUnderwater: true, causesFire: false});
      system.clearRun(loop);
      return;
    }
    i++;
  }, 20)
}

export function* breakBlockInArea(breakArr, area, location, dimension) {
  location = {
    x: location.x - Math.floor(area/2),
    y: location.y - Math.floor(area/2),
    z: location.z - Math.floor(area/2)
  }
  area = new Vector3(area, area, area);
  for (let x = location.x; x < location.x + area.x; x++) {
    for (let y = location.y; y < location.y + area.y; y++) {
      for (let z = location.z; z < location.z + area.z; z++) {
        let currentBlock = dimension.getBlock({x: x, y: y, z: z});
        if (breakArr.includes(currentBlock.typeId)) {
          dimension.runCommand(`setblock ${x} ${y} ${z} air destroy`);
        }
      }
    }
  }
}

export function pickFromWeightedArr(options) {
  var i;
  let weights = [options[0].weight];
  
  for (i = 1; i < options.length; i++) {
    weights[i] = options[i].weight + weights[i - 1];
  }
  
  let randomVal = Math.random() * weights[weights.length - 1];
  
  for (i = 0; i < weights.length; i++) {
    if (weights[i] >= randomVal) {
      break;
    }
  }
  
  if (i == options.length) {
    i = i - 1;
  }
  
  return options[i].result;
}
const grassWeights = [
  {
    "weight": 120,
    "result": "minecraft:short_grass"
  },
  {
    "weight": 110,
    "result": "minecraft:fern"
  },
  {
    "weight": 10,
    "result": "minecraft:poppy"
  },
  {
    "weight": 10,
    "result": "minecraft:cornflower"
  },
  {
    "weight": 7,
    "result": "minecraft:blue_orchid"
  },
  {
    "weight": 7,
    "result": "minecraft:allium"
  },
  {
    "weight": 5,
    "result": "minecraft:azure_bluet"
  },
  {
    "weight": 8,
    "result": "minecraft:red_tulip"
  },
  {
    "weight": 8,
    "result": "minecraft:white_tulip"
  },
  {
    "weight": 8,
    "result": "minecraft:pink_tulip"
  },
  {
    "weight": 8,
    "result": "minecraft:orange_tulip"
  },
  {
    "weight": 10,
    "result": "minecraft:oxeye_daisy"
  },
  {
    "weight": 10,
    "result": "minecraft:dandelion"
  },
  {
    "weight": 1,
    "result": "empty"
  }
];
const seagrassWeights = [
  {
    "weight": 3,
    "result": "minecraft:seagrass"
  },
  {
    "weight": 2,
    "result": "minecraft:air"
  }
];
const shroomWeights = [
  {
    "weight": 180,
    "result": "empty"
  },
  {
    "weight": 3,
    "result": "minecraft:red_mushroom"
  },
  {
    "weight": 3,
    "result": "minecraft:brown_mushroom"
  }
];

export function growFlora(block, spell) {
  if (!block.isValid) {
    return;
  };
  
  floraPropogate(block, spell.verb.power+1, spell);
}

async function floraPropogate(b, n, spell) {
  await system.waitTicks(5);
  if (n == 0) {
    return;
  }
  if (!b.isValid) {
    return;
  };
  
  // If Air/Liquid, search the block below and continue. Otherwise, return
  if (b.isAir || b.isLiquid) {
    if (b.below(1) != undefined) {
      return floraPropogate(b.below(1), n - 1);
    } else {
      return;
    }
  }
  
  let validated = false;
  let aB = b.above(1);
  
  
  if (aB.isAir) {
    let grassLand = [
      "minecraft:grass_block"
    ]
    let shroomLand = [
      "minecraft:podzol",
      "minecraft:mycelium"
    ]
    
    if (grassLand.includes(b.typeId)) {
      let selectFlora = pickFromWeightedArr(grassWeights);
      if (selectFlora != "empty") {
        aB.setType(selectFlora);
      }
    }
    
    if (shroomLand.includes(b.typeId)) {
      let selectFlora = pickFromWeightedArr(shroomWeights);
      if (selectFlora != "empty") {
        aB.setType(selectFlora);
      }
    }
    
    validated = true;
  }
  
  if (aB.isLiquid) {
    let seaGrassLand = [
      "minecraft:dirt",
      "minecraft:coarse_dirt",
      "minecraft:sand",
      "minecraft:gravel"
    ];
    if (seaGrassLand.includes(b.typeId)) {
      let selectFlora = pickFromWeightedArr(seagrassWeights);
      if (selectFlora != "empty") {
        aB.setType(selectFlora);
      }
    }
    validated = true;
  }
  
  let farmLand = [
    "minecraft:farmland",
    "minecraft:soul_sand"
  ]
  if (farmLand.includes(b.typeId)) {
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
      "minecraft:nether_wart": 3
    };
    
    if (Object.keys(growthCrops).includes(aB.typeId)) {
      let maxGrowthStage = growthCrops[aB.typeId];
      let allStates = aB.permutation.getAllStates();
      let growthStage = allStates["growth"];
      
      if (growthStage < maxGrowthStage) {
        allStates["growth"] = growthStage + spell.verb.power + 1;
        
        if (allStates["growth"] > maxGrowthStage) {
          allStates["growth"] = maxGrowthStage
        }
        aB.setPermutation(BlockPermutation.resolve(aB.typeId, allStates));
      }
    }
    
    if (Object.keys(ageCrops).includes(aB.typeId)) {
      let maxGrowthStage = ageCrops[aB.typeId];
      let allStates = aB.permutation.getAllStates();
      let growthStage = allStates["age"];
      if (growthStage < maxGrowthStage) {
        allStates["age"] = growthStage + spell.verb.power + 1;
        
        if (allStates["age"] > maxGrowthStage) {
          allStates["age"] = maxGrowthStage
        }
        aB.setPermutation(BlockPermutation.resolve(aB.typeId, allStates));
      }
    }
    
    validated = true;
  }
  
  if (validated) {
    let offsets = [
      new Vector3(1, 0, 0),
      new Vector3(-1, 0, 0),
      new Vector3(0, 0, 1),
      new Vector3(0, 0, -1)
    ];
    
    for (let o of offsets) {
      try {
        let oB = b.offset(o);
        if (oB != undefined) {
          let aB = oB.above(1);
    
          if (aB.isAir || aB.isLiquid) {
            floraPropogate(oB, n - 1);
          } else {
            floraPropogate(aB, n - 1);
          }
          continue;
        }
      } catch (e) {
        console.warn(e)
        continue;
      }
    }
  } else {
    floraPropogate(b.below(1), n - 1);
  }
}

export function forceSurge(pos, entities, power, inversed) {
  for (let entity of entities) {
    let entityPos = entity.location;
    let pushDir = Vector3.subtract(entityPos, pos);
    if (Vector3.magnitude(pushDir) > 1.0) {
      pushDir = Vector3.normalize(pushDir);
    }
    
    if (inversed) {
      pushDir = Vector3.scale(pushDir, -1);
    }
    pushDir.y = pushDir.y/2;
    
    if (entity.getComponent("projectile")) {
      entity.clearVelocity();
      entity.applyImpulse(Vector3.scale(pushDir, power));
    } else {
      try {
        entity.applyImpulse(Vector3.scale(pushDir, power));
      } catch (err) {
        entity.applyKnockback(Vector3.scale(pushDir, power), pushDir.y*power);
      }
    }
  }
}

// Draw Line
export function Bresenham3D(x1, y1, z1, x2, y2, z2, distance) {
    let ListOfPoints = [];
    ListOfPoints.push({
      "x": x1,
      "y": y1,
      "z": z1
    });
    let dx = Math.abs(x2 - x1);
    let dy = Math.abs(y2 - y1);
    let dz = Math.abs(z2 - z1);
    let xs;
    let ys;
    let zs;
    if (x2 > x1) {
        xs = 1;
    } else {
        xs = -1;
    }
    if (y2 > y1) {
        ys = 1;
    } else {
        ys = -1;
    }
    if (z2 > z1) {
        zs = 1;
    } else {
        zs = -1;
    }
    // Driving axis is X-axis"
    if (dx >= dy && dx >= dz) {
        let p1 = 2 * dy - dx;
        let p2 = 2 * dz - dx;
        for (let n = 0; n < distance; n++) {
          if (x1 != x2) {
              x1 += xs;
              if (p1 >= 0) {
                  y1 += ys;
                  p1 -= 2 * dx;
              }
              if (p2 >= 0) {
                  z1 += zs;
                  p2 -= 2 * dx;
              }
              p1 += 2 * dy;
              p2 += 2 * dz;
              ListOfPoints.push({
                "x": x1,
                "y": y1,
                "z": z1
              });
          }
        }
    
    // Driving axis is Y-axis"
    } else if (dy >= dx && dy >= dz) {
        let p1 = 2 * dx - dy;
        let p2 = 2 * dz - dy;
        for (let n = 0; n < distance; n++) {
          if (y1 != y2) {
              y1 += ys;
              if (p1 >= 0) {
                  x1 += xs;
                  p1 -= 2 * dy;
              }
              if (p2 >= 0) {
                  z1 += zs;
                  p2 -= 2 * dy;
              }
              p1 += 2 * dx;
              p2 += 2 * dz;
              ListOfPoints.push({
                "x": x1,
                "y": y1,
                "z": z1
              });
          }
        }
    
    // Driving axis is Z-axis"
    } else {
        let p1 = 2 * dy - dz;
        let p2 = 2 * dx - dz;
        for (let n = 0; n < distance; n++) {
          if (z1 != z2) {
              z1 += zs;
              if (p1 >= 0) {
                  y1 += ys;
                  p1 -= 2 * dz;
              }
              if (p2 >= 0) {
                  x1 += xs;
                  p2 -= 2 * dz;
              }
              p1 += 2 * dy;
              p2 += 2 * dx;
              ListOfPoints.push({
                "x": x1,
                "y": y1,
                "z": z1
              });
          }
        }
    }
    return ListOfPoints;
}
export function betterBresenham3D(startVec, endVec, distance) {
    let ListOfPoints = [];
    ListOfPoints.push({
      "x": startVec.x,
      "y": startVec.y,
      "z": startVec.z
    });
    let dx = Math.abs(endVec.x - startVec.x);
    let dy = Math.abs(endVec.y - startVec.y);
    let dz = Math.abs(endVec.z - startVec.z);
    let xSign;
    let ySign;
    let zSign;
    if (endVec.x > startVec.x) {
        xSign = 1;
    } else {
        xSign = -1;
    }
    if (endVec.y > startVec.y) {
        ySign = 1;
    } else {
        ySign = -1;
    }
    if (endVec.z > startVec.z) {
        zSign = 1;
    } else {
        zSign = -1;
    }
    // Driving axis is X-axis"
    if (dx >= dy && dx >= dz) {
        let p1 = 2 * dy - dx;
        let p2 = 2 * dz - dx;
        for (let n = 0; n < distance; n++) {
          if (startVec.x != endVec.x) {
              startVec.x += xSign;
              if (p1 >= 0) {
                  startVec.y += ySign;
                  p1 -= 2 * dx;
              }
              if (p2 >= 0) {
                  startVec.z += zSign;
                  p2 -= 2 * dx;
              }
              p1 += 2 * dy;
              p2 += 2 * dz;
              ListOfPoints.push({
                "x": startVec.x,
                "y": startVec.y,
                "z": startVec.z
              });
          }
        }
    
    // Driving axis is Y-axis"
    } else if (dy >= dx && dy >= dz) {
        let p1 = 2 * dx - dy;
        let p2 = 2 * dz - dy;
        for (let n = 0; n < distance; n++) {
          if (startVec.y != endVec.y) {
              startVec.y += ySign;
              if (p1 >= 0) {
                  startVec.x += xSign;
                  p1 -= 2 * dy;
              }
              if (p2 >= 0) {
                  startVec.z += zSign;
                  p2 -= 2 * dy;
              }
              p1 += 2 * dx;
              p2 += 2 * dz;
              ListOfPoints.push({
                "x": startVec.x,
                "y": startVec.y,
                "z": startVec.z
              });
          }
        }
    
    // Driving axis is Z-axis"
    } else {
        let p1 = 2 * dy - dz;
        let p2 = 2 * dx - dz;
        for (let n = 0; n < distance; n++) {
          if (startVec.z != endVec.z) {
              startVec.z += zSign;
              if (p1 >= 0) {
                  startVec.y += ySign;
                  p1 -= 2 * dz;
              }
              if (p2 >= 0) {
                  startVec.x += xSign;
                  p2 -= 2 * dz;
              }
              p1 += 2 * dy;
              p2 += 2 * dx;
              ListOfPoints.push({
                "x": startVec.x,
                "y": startVec.y,
                "z": startVec.z
              });
          }
        }
    }
    return ListOfPoints;
}

// Raising Blocks as a Wall
export function* raiseWall(dimension, block, facingDir, blockFaceDir, height, width, validBlocks) {
  // Get the direction being faced AND the current block face selected.
  // The facingDir tells what general direction along x and z to face.
  // The blockFaceDir tells which direction the wall should be raised in. This raising can happen vertically and horizontally.
  
  // At each position, set the found valid block to the corresponding height AS LONG AS IT IS AIR OR LIQUID then repeat going downwards, simulating the earth rising up.
  
  //
  let startVec;
  
  if (blockFaceDir.y != 0) {
    startVec = Vector3.add(block.center(), localizeVec(facingDir, new Vector3(-width, 0, 0)));
  } else {
    startVec = Vector3.add(block.center(), localizeVec(blockFaceDir, new Vector3(-width, 0, 0)));
  }  startVec = {
    x: Math.floor(startVec.x),
    y: Math.floor(startVec.y),
    z: Math.floor(startVec.z)
  }
  
  let xM = (2*Math.floor(block.center().x)) - startVec.x;
  let yM = block.location.y;
  let zM = (2*Math.floor(block.center().z)) - startVec.z;
  
  let endVec = new Vector3(Math.floor(xM), Math.floor(yM), Math.floor(zM));
  
  let vectorLine = Bresenham3D(startVec.x, startVec.y, startVec.z, endVec.x, endVec.y, endVec.z, 2*width+1);
  
  wallLoop: for (let vec of vectorLine) {
    let foundHeight = height;
    // Vector3.up() was here
    let potBlock = dimension.getBlockFromRay(Vector3.add(vec, blockFaceDir), blockFaceDir, {maxDistance: height-1});
    if (potBlock != undefined) {
      foundHeight = Math.abs(Math.floor(potBlock.block.location.y) - Math.floor(vec.y));
    }
    
    for (let i = 0; i < foundHeight; i++) {
      // Choose axis to alter
      let chosenAxis;
      let sign;
      for (let [k, v] of Object.entries(blockFaceDir)) {
        if (v > 0) {
          sign = "+"
          chosenAxis = `${k}`;
        }
        if (v < 0) {
          sign = "-"
          chosenAxis = `${k}`;
        }
      }
      let locationFound = {};
      for (let a of ["x", "y", "z"]) {
        if (a == chosenAxis) {
          if (sign == "+") {
            locationFound[a] = Math.floor(vec[a] - i);
          } else 
          if (sign == "-") {
            locationFound[a] = Math.floor(vec[a] + i);
          }
        } else {
          locationFound[a] = Math.floor(vec[a]);
        }
      }
      let currentBlock = dimension.getBlock(locationFound);
      // currentBlock.above(foundHeight) was here
      let blockAtHeight = dimension.getBlock(Vector3.add(locationFound, Vector3.scale(blockFaceDir, foundHeight)));
      if (validBlocks.includes(currentBlock?.typeId)) {
        if (blockAtHeight.isAir || blockAtHeight.isLiquid) {
          let perm = blockAtHeight.permutation;
          blockAtHeight.setPermutation(currentBlock.permutation);
          currentBlock.setPermutation(perm);
          
          yield;
        }
      } else {
        continue wallLoop;
      }
    }
  }
  
}

function spawnRawOrbos(dim, loc, amt, params = undefined) {
  let spawnAmount = Math.floor(Math.random() * amt/30);
  let min = 0;
  let max = spawnAmount;
  if (params != undefined) {
    if (params.min != undefined) {
      min = params.min;
    }
    if (params.max != undefined) {
      max = params.max;
    }
  }
  
  // Randomize
  spawnAmount = min + Math.floor(Math.random() * (max/3));
  
  let rO = new ItemStack("bw:raw_orbos", spawnAmount);
  
  dim.spawnItem(rO, loc);
}

export const jackBlocks = [
  "bw:infused_pumpkin",
  "bw:sigiled_pumpkin",
  "bw:jackoward"
]

system.runInterval(() => {
  let allProperties = world.getDynamicPropertyIds();
  // All the various things to keep track of... ;-;
  let revisedCircles = [];
  let revisedNexii = [];
  let sacs = [];
  let sprites = [];
  for (let p of allProperties) {
    if (p.startsWith("mysticCircleAltar:")) {
      revisedCircles.push(p);
    }
    if (p.startsWith("orbicNexus:")) {
      revisedNexii.push(p);
    }
    if (p.startsWith("bw:deathTaint")) {
      sacs.push(p);
    }
    if (p.startsWith("sprigganSprite:")) {
      sprites.push(p);
    }
  }
  
  for (let circle of revisedCircles) {
    let mysticCircle = world.getDynamicProperty(circle);
    if (mysticCircle == undefined) {
      continue;
    } else {
      mysticCircle = JSON.parse(world.getDynamicProperty(circle))
    }
    
    let dim = world.getDimension(mysticCircle.dimension);
    if (dim.isChunkLoaded(mysticCircle.location)) {
      try {
        dim.getBlock(mysticCircle.location).above(1);
      } catch (e) {
        continue;
      }
      
      if (!isSpellAltar(mysticCircle.location, mysticCircle.dimension)) {
        world.setDynamicProperty(circle, undefined);
        continue;
      }
      
      // Do particle anims with sounds
      visuals.mystic_circle(dim, Vector3.add(mysticCircle.location, new Vector3(0.5, 1.15, 0.5)), mysticCircle.spellContents);
    }
  }
  
  for (let nexus of revisedNexii) {
    let maxOrbos = 2000;
    let orbosStored = world.getDynamicProperty(nexus);
    if (orbosStored == undefined) {
      continue;
    }
    
    let dissectedStr = nexus.slice(11).split("_");
    let dim = world.getDimension(dissectedStr.pop());
    
    let loc = new Vector3(+dissectedStr[0], +dissectedStr[1], +dissectedStr[2]);
    
    if (dim.isChunkLoaded(loc)) {
      let amethystBlock = dim.getBlock(loc);
      let blockArr = [];
      blockArr.push(amethystBlock.above(1));
      blockArr.push(amethystBlock.below(1));
      blockArr.push(amethystBlock.below(2));
      
      
      if (blockArr[1]?.typeId == "minecraft:calcite" && blockArr[2]?.typeId == "minecraft:calcite") {
        let amethystIndicator = [
          "minecraft:air",
          "minecraft:small_amethyst_bud",
          "minecraft:medium_amethyst_bud",
          "minecraft:large_amethyst_bud",
          "minecraft:amethyst_cluster"
        ]
        
        if (amethystBlock.typeId != "minecraft:amethyst_block") {
          world.setDynamicProperty(nexus, undefined);
          console.warn("broken")
          continue;
        }
        
        if (amethystIndicator.includes(blockArr[0].typeId)) {
          if (blockArr[0].isAir && orbosStored > 500) {
            // Spawn Raw Orbos
            spawnRawOrbos(dim, blockArr[0].center(), orbosStored, {"min": 1});
            // Reset Orbos
            orbosStored = 1;
            world.setDynamicProperty(nexus, 1);
          }
          
          let growthStage = Math.ceil(orbosStored/500);
          if (orbosStored < maxOrbos) {
            let time = world.getTimeOfDay();
            if (time >= 11001 && time <= 23001) {
              let moonPurity = 8 + (4 - world.getMoonPhase()) % 8;
              
              if (orbosStored + moonPurity < maxOrbos) {
                orbosStored = orbosStored + moonPurity;
              } else {
                orbosStored = maxOrbos;
              }
              growthStage = Math.ceil(orbosStored/500) - 1;
              
              world.setDynamicProperty(nexus, orbosStored)
            }
          }
          dim.setBlockType(blockArr[0].location, BlockTypes.get(amethystIndicator[growthStage]));
        } else {
          world.setDynamicProperty(nexus, undefined);
          continue;
        }
      } else {
        world.setDynamicProperty(nexus, undefined);
        continue;
      }
      
      dim.playSound("beacon.power", loc, {pitch: 0.3, volume: 0.15});
    } else {
      if (orbosStored < maxOrbos) {
        let time = world.getTimeOfDay();
        let growthStage = Math.ceil(orbosStored/500) - 1;
        if (time >= 11001 && time <= 23001) {
          let moonPurity = 8 + (4 - world.getMoonPhase()) % 8;
          
          if (orbosStored + moonPurity < maxOrbos) {
            orbosStored = orbosStored + moonPurity;
          } else {
            orbosStored = maxOrbos;
          }
          growthStage = Math.ceil(orbosStored/500) - 1;
          
          world.setDynamicProperty(nexus, orbosStored)
        }
      }
    }
  }
  
  for (let sac of sacs) {
    let sacrificialEnergy = JSON.parse(world.getDynamicProperty(sac));
    
    if (sacrificialEnergy.time > 1) {
      sacrificialEnergy.time--;
      world.setDynamicProperty(sac, JSON.stringify(sacrificialEnergy));
    } else {
      world.setDynamicProperty(sac, undefined);
    }
  }
  
  for (let sprite of sprites) {
    let famSprite = JSON.parse(world.getDynamicProperty(sprite));
    
    const dimension = world.getDimension(famSprite.dimension);
    
    if (famSprite.lifeTime > 1) {
      famSprite.lifeTime--;
      world.setDynamicProperty(sprite, JSON.stringify(famSprite));
    } else {
      world.setDynamicProperty(sprite, undefined);
      return;
    }
    
    if (dimension.isChunkLoaded(famSprite.location)) {
      // Food mechanics for the unquelled
      if (!famSprite.isQuelled) {
        let quellChance;
        // Particles
        // Blackish gray smoke of DOOM and DESPAIIIIR
        dimension.spawnParticle("bw:spriggan_irritated_particle", famSprite.location);
        // Sounds
        // Blaze and vex sounds that've been warped beyond recognition
        dimension.playSound("mob.blaze.breathe", famSprite.location, {pitch: 0.45})
        dimension.playSound("mob.vex.ambient", famSprite.location, {pitch: 0.75})
        if (diceRoll(1, 100, true) < 6) {
          dimension.playSound("mob.ghast.scream", famSprite.location, {pitch: Math.min(Math.random()+0.15, 0.6)})
        }
        
        let justAte = false;
        // Nom Nom Nom?
        if (famSprite.eatingTime == 5) {
          let itemEntity = dimension.getEntities({closest: 1, type: "minecraft:item", location: famSprite.location, maxDistance: 2.5})[0];
          
          if (itemEntity != undefined) {
            let item = itemEntity.getComponent("minecraft:item").itemStack;
            if (famSprite.tamingItems.includes(item.typeId) || item.typeId == "bw:raw_orbos") {
              // Use up items
              if (item.amount > 1) {
                item.amount--;
              } else {
                item = undefined;
              }
              
              let worked = false;
              if (item.typeId == "bw:raw_orbos") {
                if (diceRoll(1, 20, true) < 6) {
                  quellChance = 0.11000000;
                  worked = true;
                }
              } else {
                worked = true;
              }
              
              if (worked) {
                famSprite.eatingTime = 4;
                if (item != undefined) {
                  let spawnedItem = dimension.spawnItem(item, itemEntity.location);
                  spawnedItem.clearVelocity();
                }
                itemEntity.remove();
              }
            }
          }
        }
        
        // Chomp Chomp Chomp!
        if (famSprite.eatingTime < 5) {
          // Eating sounds
          dimension.playSound("random.eat", famSprite.location, {pitch:Math.min(Math.random()+0.2, 0.45), volume: 2});
          // Finished eating
          if (famSprite.eatingTime == 0) {
            let randomNumber = Math.random();
            
            if (!quellChance) {
              quellChance = famSprite.quellChance;
            } 
            
            if (randomNumber <= quellChance) {
              famSprite.isQuelled = true;
              famSprite.color = {
                red: 0.5+Math.random(),
                green: 0.3+Math.random(),
                blue: 0.3+Math.random()
              }
              console.warn("Quelled Spriggan aspect!");
            }
            famSprite.eatingTime = 5;
            justAte = true;
          } else {
            famSprite.eatingTime = famSprite.eatingTime - 1;
          }
        }
        
        // Sophisticated Spell Throwing
        // Double check if the spirit is still angy
        if (!famSprite.isQuelled && !justAte && famSprite.eatingTime == 5) {
          let target = world.getEntity(famSprite.target);
          // Target must be in the vicinity for the spirit to remain in the realm. Rather, it must understand that the source of its irritation is nearby.
          if (target && target.isValid) {
            if (target.dimension.id != famSprite.dimension) {
              world.setDynamicProperty(sprite, undefined);
              return;
            }
            
            if (!inRange(target.location, famSprite.location, 15.5)) {
              world.setDynamicProperty(sprite, undefined);
              return;
            }
            
            let targetDir = Vector3.normalize(Vector3.subtract(target.getAABB().center, famSprite.location));
            let attackType = "none";
            
            if (famSprite.lifeTime > 80) {
              attackType = "bolt_barrage";
            } else {
              attackType = "point_explosion";
            }
            
            
            if (famSprite.shotTime == famSprite.shotInterval) {
              if (attackType == "bolt_barrage") {
                let arr = dimension.spawnEntity("minecraft:arrow", famSprite.location);
                let arrProperty = arr.getComponent("minecraft:projectile");
                arrProperty.gravity = 0;
                // Fire Arrow
                arrProperty.shoot(Vector3.scale(targetDir, 2.5), {uncertainty: 0.1})
                // Bolts
              }
              
              if (attackType == "point_explosion") {
                // Explode
                triggerDelayedExplosion(dimension, target.getAABB().center, 2);
              }
              famSprite.shotTime = 0;
            } else {
              if (famSprite.shotTime < famSprite.shotInterval) {
                famSprite.shotTime = famSprite.shotTime + 1;
              }
            }
          }
        }
      } else {
        // Particles
        let mol = new MolangVariableMap();
        mol.setColorRGB("variable.color", famSprite.color);
        dimension.spawnParticle("bw:spriggan_calm_particle", famSprite.location, mol);
        // Sounds
        dimension.playSound("mob.allay.idle", famSprite.location, {pitch: Math.min(0.1+Math.random(), 0.4), volume: 3})
        if (diceRoll(1, 100, true) < 4) {
          dimension.playSound("note.chime", famSprite.location, {pitch: Math.min(Math.random()+0.2, 0.6), })
        }
        
        // Bind Sprite to Totem
        let itemEntity = dimension.getEntities({closest: 1, type: "minecraft:item", location: famSprite.location, maxDistance: 2.5})[0];
          
        if (itemEntity != undefined) {
          let item = itemEntity.getComponent("minecraft:item").itemStack;
          
          let successful = false;
          if (item.getComponent("bw:familiar_container")) {
            if (!item.getDynamicProperty("bw:savedFamiliar")) {
              item.setDynamicProperty("spriteWithin", famSprite.sprigganType)
              item.setDynamicProperty("spriteConjurer", famSprite.target);
              successful = true;
            }
          }
          
          if (successful) {
            // Respawn Totem
            let spawnedItem = dimension.spawnItem(item, famSprite.location);
            spawnedItem.clearVelocity();
            // Kill Item
            itemEntity.remove();
            // Kill Sprite Data
            world.setDynamicProperty(sprite, undefined);
            return;
          }
        }
        
        // Shorten Life Time currently
        /*
        if (famSprite.lifeTime > 10) {
          famSprite.lifeTime = 10;
        }
        */
      }
      
      world.setDynamicProperty(sprite, JSON.stringify(famSprite));
    } else {
      continue;
    }
    
  }
}, 20);

// OPTIMIZE THIS SHIT
function isSpellAltar(block, dim) => {
  let dimension = world.getDimension(dim);
  
  if (dimension.getBlock(block)?.typeId == "minecraft:amethyst_block") {
    return true;
  } else {
    return false;
  }
}
function isOrbicPillar(block, dim) => {
  let dimension = world.getDimension(dim);
  let vectors = [
    [new Vector3(0, 0, 0), "minecraft:amethyst_block"],
    [new Vector3(0, -1, 0), "minecraft:calcite"],
    [new Vector3(0, -2, 0), "minecraft:calcite"]
  ];
  let numOfBlocks = 0;
  
  for (let pos of vectors) {
    let vecPos = Vector3.add(block, pos[0]);
    if (dimension.getBlock(vecPos)?.typeId == pos[1]) {
      numOfBlocks++;
    }
  }
  
  if (numOfBlocks == 3) {
    return true;
  } else {
    return false;
  }
  
}
export function inRange(block1, block2, range) {
  let diffVec = Vector3.subtract(block1, block2);
  if (Math.abs(diffVec.x) > range) {
    return false;
  }
  if (Math.abs(diffVec.y) > range) {
    return false;
  }
  if (Math.abs(diffVec.z) > range) {
    return false;
  }
  
  return true;
}

export function findMysticCircleName(circle, dimension) {
  let circleName = `${circle.location.x}_${circle.location.y}_${circle.location.z}_${dimension}`;
  let foundCircle = `mysticCircleAltar:${circleName}`;
  return foundCircle;
}
export async function detectMysticCircle(target, conflictCheck, size = 0) {
  let allCircles = world.getDynamicPropertyIds().filter(r => r.startsWith("mysticCircleAltar:"));
  
  for (let circle of allCircles) {
    let mysticCircle = world.getDynamicProperty(circle);
    if (mysticCircle == undefined) {
      continue;
    } else {
      mysticCircle = JSON.parse(world.getDynamicProperty(circle))
    }
    
    let distance = inRange(mysticCircle.location, target.location, 3);
    
    if (distance) {
      return mysticCircle;
    } else {
      continue;
    }
  }
  return false
}

export async function openMysticCircle(player) {
  let blockAtPos = player.dimension.getBlock(player.location).below(1);
  let witchLoc = player.dimension.getBlock(player.location).center();
  let witchDim = player.dimension.id;
  let foundType = undefined;
  
  let altarName = `mysticCircleAltar:${Math.floor(blockAtPos.location.x)}_${Math.floor(blockAtPos.location.y)}_${Math.floor(blockAtPos.location.z)}_${witchDim}`;
  
  if (isSpellAltar(blockAtPos.location, witchDim)) {
    let spellMatrix = {
      "location": {
        x: Math.floor(blockAtPos.location.x),
        y: Math.floor(blockAtPos.location.y),
        z: Math.floor(blockAtPos.location.z)
      },
      "dimension": witchDim,
      "capacity": 0,
      "maxCapacity": 10,
      "spellContents": {
        "style": {
          "aesthetic": "sparkles",
          "colors": []
        }
      }
    }
    
    player.dimension.playSound("beacon.activate", spellMatrix.location, {pitch: 0.65});
    world.setDynamicProperty(altarName, JSON.stringify(spellMatrix));
  }
}
export async function closeMysticCircle(player) {
  const amethystIndicator = [
    "minecraft:small_amethyst_bud",
    "minecraft:medium_amethyst_bud",
    "minecraft:large_amethyst_bud",
    "minecraft:amethyst_cluster"
  ]
  let foundAltar = await detectMysticCircle(player, false);
  
  if (foundAltar != false) {
    let dimension = world.getDimension(foundAltar.dimension);
    let altarBlock = dimension.getBlock(foundAltar.location);
    
    let contents = foundAltar.spellContents;
    // Close ritual!
    if (contents.noun != undefined && contents.verb != undefined) {
      let stages = amethystIndicator.length;
      let currentStage = 0;
      let storedBlock = null;
      
      while (currentStage < stages) {
        let aboveBlock = altarBlock.above(1);
        if (aboveBlock.isAir || aboveBlock.isLiquid || aboveBlock.hasTag("bw:spellCreationCompatible")) {
          if (currentStage == 0) {
            if (aboveBlock.hasTag("bw:spellCreationCompatible")) {
              storedBlock = aboveBlock.permutation;
            }
            
            aboveBlock.setType(amethystIndicator[currentStage]);
            currentStage++;
          } else {
            let removeCircle = findMysticCircleName(foundAltar, dimension.id);
            world.setDynamicProperty(removeCircle, undefined);
            
            if (storedBlock != null) {
              aboveBlock.setPermutation(storedBlock);
            }
            player.sendMessage(`§c[!]§r The ritual was stopped during the glyphbook's crystallization. It fails to manifest into reality.`);
            break;
          }
        } else
        if (amethystIndicator.includes(aboveBlock.typeId)) {
          aboveBlock.setType(amethystIndicator[currentStage]);
          currentStage++;
        }
        await system.waitTicks(20);
      }
      
      if (storedBlock != null) {
        altarBlock.above(1).setPermutation(storedBlock);
        storedBlock = null;
      } else {
        altarBlock.above(1).setType("minecraft:air");
      }
      dimension.spawnParticle("bw:craft_spell_particle", altarBlock.above(1).center());
      
      dimension.playSound("random.totem", foundAltar.location, {
        pitch: 1.5
      });
      let spellBook = new ItemStack("bw:glyph_book", 1);
      
      let spellObj = JSON.parse(JSON.stringify(contents));
      spellObj.cost = await determineCost(contents);
      
      spellBook.setDynamicProperty("bw:mysticSpell", JSON.stringify(spellObj));
      
      spellBook.nameTag = `§r${contents.noun}`;
      if (contents.nested_noun) {
        spellBook.nameTag = spellBook.nameTag.concat(` -> ${contents.nested_noun.noun}`);
      }
      spellBook.nameTag = spellBook.nameTag.concat(` -> ${contents.verb.verbName}`);
      
      dimension.spawnItem(spellBook, dimension.getBlock(foundAltar.location).above().location);
    } else {
      dimension.playSound("beacon.deactivate", foundAltar.location, {
        pitch: 1.5
      });
    }
    
    let removeCircle = findMysticCircleName(foundAltar, dimension.id);
    world.setDynamicProperty(removeCircle, undefined);
  } else {
    player.sendMessage(`§c[!]§r You are not within range of a Mystic Circle to be able to deactivate it.`)
  }
}

/*
// Spell Object
{
  "noun": "NOUN STRING",
  "noun_params": { NOUN OBJECT },
  // Undefined if no Nested Noun
  "nested_noun": {
    "noun": "NOUN STRING",
    "noun_params": { NOUN OBJECT }
  },
  "verb": {
    "verbName": "VERB STRING",
    // Other Parameters
  },
  "style": { PARTICLE STUFFS }
}

Nested Nouns are cast based primarily on how the original Noun works.
*/
function nomNomSpellItems(allItems, block) {
  // EAT the items;
  for (let indI of allItems) {
    if (indI[0].isValid) {
      let l = indI[0].location;
      indI[0].remove();
      if (indI[2] != "destroyed") {
        let e = block.dimension.spawnItem(indI[1], l);
        e.teleport(l);
      }
    }
  }
}

const candlePos = [
  [1, 3],
  [0, 3],
  [-1, 3],
  [-2, 2],
  [-3, 1],
  [-3, 0],
  [-3, -1],
  [-2, -2],
  [-1, -3],
  [0, -3],
  [1, -3],
  [2, -2],
  [3, -1],
  [3, 0],
  [3, 1],
  [2, 2]
];

function augmentSpellPiece(piece, params, loc, dim) {
  // Candle Blocks
  let candleObj = {};
  // Individual Candles
  let candleBundleObj = {};
  // Base weight
  let baseWeight = piece.weight;
  
  // Check Candles and Document Them
  for (let arr of candlePos) {
    let location = {
      x: loc.x + arr[0],
      y: loc.y,
      z: loc.z + arr[1]
    }
    
    let blk = dim.getBlock(location);
    if (validCandles.includes(blk.typeId)) {
      let perm = blk.permutation.getAllStates();
      
      if (perm.lit) {
        if (candleObj[blk.typeId] == undefined) {
          candleObj[blk.typeId] = 1;
        } else {
          candleObj[blk.typeId] = candleObj[blk.typeId] + 1;
        }
        
        if (candleBundleObj[blk.typeId] == undefined) {
          candleBundleObj[blk.typeId] = (perm.candles+1);
        } else {
          candleBundleObj[blk.typeId] = candleBundleObj[blk.typeId] + (perm.candles+1);
        }
      }
    }
  }
  
  if (piece.candleModifiers != undefined) {
    for (let candle of piece.candleModifiers) {
      let totalCandles = 0;
      if (candle.isBlock) {
        if (candleObj[candle.type]) {
          totalCandles = candleObj[candle.type];
        }
      } else {
        if (candleBundleObj[candle.type]) {
          totalCandles = candleBundleObj[candle.type];
        }
      }
      
      if (totalCandles == 0) {
        continue;
      }
      
      if (totalCandles >= candle.amount) {
        for (let [k, v] of Object.entries(candle.augments)) {
          if (k == "inverseVerb") {
            if (params.inversion) {
              let inversed = JSON.parse(JSON.stringify(params.inversion));
              inversed.inversion = params;
              
              params = inversed;
            }
            
            if (!candle.weight) {
              baseWeight = baseWeight + 1;
            } else {
              baseWeight = baseWeight + candle.weight;
            }
          }
          
          if (typeof params[k] == "number") {
            let mult = Math.floor(totalCandles/candle.amount);
            
            let val = v * mult;
            params[k] = params[k] + val;
            
            if (candle.limits != undefined && candle.limits[k]) {
              if (candle.limits[k].min != undefined && candle.limits[k].min > params[k]) {
                params[k] = candle.limits[k].min
              }
              
              if (candle.limits[k].max != undefined && candle.limits[k].max < params[k]) {
                params[k] = candle.limits[k].max
              }
            }
            
            if (!candle.weight) {
              baseWeight = baseWeight + mult;
            } else {
              baseWeight = baseWeight + (candle.weight * mult);
            }
          }
          if (typeof params[k] == "boolean") {
            if (v != params[k]) {
              if (!candle.weight) {
                baseWeight = baseWeight + 1;
              } else {
                baseWeight = baseWeight + candle.weight;
              }
            }
            params[k] = v;
          }
          if (typeof params[k] == "object") {
            for (let [pK, pV] of Object.entries(candle.augments[k])) {
              if (typeof params[k][pK] == "number") {
                let mult = Math.floor(totalCandles/candle.amount);
                let val = pV * mult;
                params[k][pK] = params[k][pK] + val;
                
                if (candle.limits != undefined && candle.limits[k] != undefined && candle.limits[k][pK]) {
                  if (candle.limits[k][pK].min != undefined && candle.limits[k][pK].min > params[k][pK]) {
                    params[k][pK] = candle.limits[k][pK].min
                  }
                  
                  if (candle.limits[k][pK].max != undefined && candle.limits[k][pK].max < params[k][pK]) {
                    params[k][pK] = candle.limits[k][pK].max
                  }
                }
                
                if (!candle.weight) {
                  baseWeight = baseWeight + mult;
                } else {
                  baseWeight = baseWeight + (candle.weight * mult);
                }
              }
              
              if (typeof params[k][pK] == "boolean") {
                if (pV != params[k][pK]) {
                  if (!candle.weight) {
                    baseWeight = baseWeight + 1;
                  } else {
                    baseWeight = baseWeight + candle.weight;
                  }
                }
                params[k][pK] = pV;
              }
            }
          }
        }
      }
    }
  }
  
  return [params, baseWeight];
}

export async function runSpellCreation(entity) {
  let foundAltar = await detectMysticCircle(entity, false);
  if (!foundAltar) {
    if (entity instanceof Player) {
      entity.sendMessage(`§c[!]§r You are not in the bounds of a Mystic Altar to perform this glyph.`);
    }
    return;
  }
  
  if (foundAltar.drawInArcana != undefined) {
    entity.sendMessage(`§c[!]§r This Mystic Altar is still drawing in the Orbos necessary to cement the spell piece into reality. Wait until the sparkles are no longer §cred§r.`)
    return;
  }
  
  // Get block
  let block = world.getDimension(foundAltar.dimension).getBlock(foundAltar.location);
  let id = `mysticCircleAltar:${foundAltar.location.x}_${foundAltar.location.y}_${foundAltar.location.z}_${foundAltar.dimension}`;
  
  let hasNoun = false;
  let isNested = false;
  let hasVerb = false;
  
  if (foundAltar.spellContents.noun) {
    hasNoun = true;
    if (foundAltar.spellContents.nested_noun) {
      isNested = true;
    }
    
    if (foundAltar.spellContents.verb) {
      hasVerb = true;
    }
  }
  
  let result = getSpellPieces(block, entity);
  let spellPiece = result[0];
  let items = result[1];
  
  if (spellPiece == undefined) {
    entity.sendMessage(`§c[!]§r You are trying to weave in a spell piece that simply does not exist.`);
    return;
  }
  
  if (!hasNoun) {
    if (Object.keys(spellNounList).includes(spellPiece)) {
      const pattern = spellNounList[spellPiece];
      foundAltar.spellContents.noun = spellPiece;
      foundAltar.spellContents.noun_params = JSON.parse(JSON.stringify(pattern.parameters));
      
      // Candles
      let augmented = augmentSpellPiece(pattern, foundAltar.spellContents.noun_params, block.above(1).center(), block.dimension);
      
      foundAltar.spellContents.noun_params = augmented[0];
      
      // Correspondences
      // These likely should be a function
      // Eat the items that need to be eaten.
      nomNomSpellItems(items, block);
      
      // Add capacity and if its more than a certain amount, explode.
      if (foundAltar.capacity + augmented[1] <= foundAltar.maxCapacity) {
        foundAltar.capacity = foundAltar.capacity + augmented[1];
        block.dimension.spawnParticle("bw:mystic_circle_add_noun", Vector3.add(foundAltar.location, new Vector3(0.5, 1.15, 0.5)));
        entity.sendMessage(`§a[+]§r §d${spellPiece}§r has been weaved into your Mystic Circle, becoming its base Pattern.`);
      } else {
        block.dimension.createExplosion(block.center(), 3);
        foundAltar = undefined;
        entity.sendMessage(`§c[!!!]§r Your Mystic Circle destabilizes and explodes! The weight of the spell in creation surpassed the Circle's maximum capacity.`);
      }
    } else {
      entity.sendMessage(`§c[!]§r §d${spellPiece}§r (the spell piece you are trying to weave) is not a Pattern. This Mystic Circle requires a Pattern.`);
      return;
    }
    world.setDynamicProperty(id, JSON.stringify(foundAltar));
    return;
  }
  
  if (!isNested && !hasVerb) {
    if (Object.keys(spellNounList).includes(spellPiece)) {
      let pattern = spellNounList[foundAltar.spellContents.noun];
      
      if (foundAltar.spellContents.noun == spellPiece) {
        entity.sendMessage(`§c[!]§r §g${spellPiece}§r cannot be a Sub-Pattern of itself. Try another Pattern that is compatible with it (if any exists).`);
        return;
      }
      
      if (pattern.incompatibleNouns?.includes(spellPiece)) {
        entity.sendMessage(`§c[!]§r §d${spellPiece}§r is not a compatible Sub-Pattern of §g${foundAltar.spellContents.noun}§r. Try another Pattern that is compatible with §g${foundAltar.spellContents.noun}§r (if any exists).`);
        return;
      }
      
      pattern = spellNounList[spellPiece];
      
      foundAltar.spellContents.nested_noun = {};
      foundAltar.spellContents.nested_noun.noun = spellPiece;
      foundAltar.spellContents.nested_noun.noun_params = JSON.parse(JSON.stringify(pattern.parameters));
      
      // Candles
      let augmented = augmentSpellPiece(pattern, foundAltar.spellContents.nested_noun.noun_params, block.above(1).center(), block.dimension);
      
      foundAltar.spellContents.nested_noun.noun_params = augmented[0];
      // Correspondences
      // These likely should be a function
      // Eat the items that need to be eaten.
      nomNomSpellItems(items, block);
      
      // Add capacity and if its more than a certain amount, explode.
      if (foundAltar.capacity + augmented[1] <= foundAltar.maxCapacity) {
        foundAltar.capacity = foundAltar.capacity + augmented[1];
        block.dimension.spawnParticle("bw:mystic_circle_add_noun", Vector3.add(foundAltar.location, new Vector3(0.5, 1.15, 0.5)));
        entity.sendMessage(`§a[+]§r §d${spellPiece}§r has been weaved into your Mystic Circle to aid §g${foundAltar.spellContents.noun}§r, becoming its Sub-Pattern.`);
      } else {
        block.dimension.createExplosion(block.center(), 3);
        foundAltar = undefined;
        entity.sendMessage(`§c[!!!]§r Your Mystic Circle destabilizes and explodes! The weight of the spell in creation surpassed the Circle's maximum capacity.`);
      }
      
      world.setDynamicProperty(id, JSON.stringify(foundAltar));
      return;
    }
  }
  
  if (!hasVerb) {
    if (Object.keys(spellVerbList).includes(spellPiece)) {
      let power = spellVerbList[spellPiece];
      
      let activeNoun = foundAltar.spellContents.noun;
      if (foundAltar.spellContents.nested_noun) {
        activeNoun = foundAltar.spellContents.nested_noun.noun;
      }
      
      if (power.incompatibleNouns?.includes(activeNoun)) {
        entity.sendMessage(`§c[!]§r §d${spellPiece}§r is not compatible with the Pattern §g${activeNoun}§r.`);
        return;
      }
      
      foundAltar.spellContents.verb = JSON.parse(JSON.stringify(power.parameters));
      
      // There might be times when player input might be necessary
      if (power.creatorSourcedParamEdit != undefined) {
        foundAltar.spellContents.verb = power.creatorSourcedParamEdit(entity, foundAltar.spellContents.verb);
      }
      
      // Candles
      let augmented = augmentSpellPiece(power, foundAltar.spellContents.verb, block.above(1).center(), block.dimension);
      
      foundAltar.spellContents.verb = augmented[0];
      // Correspondences
      // These likely should be a function
      // Eat the items that need to be eaten.
      nomNomSpellItems(items, block);
      
      // Add capacity and if its more than a certain amount, explode.
      if (foundAltar.capacity + augmented[1] <= foundAltar.maxCapacity) {
        foundAltar.capacity = foundAltar.capacity + augmented[1];
        block.dimension.spawnParticle("bw:mystic_circle_add_verb", Vector3.add(foundAltar.location, new Vector3(0.5, 1.15, 0.5)));
        entity.sendMessage(`§a[+]§r §d${spellPiece}§r has been weaved into your Mystic Circle, becoming its Power.`);
      } else {
        console.warn(`BOOM (${foundAltar.capacity + augmented[1]})`)
        block.dimension.createExplosion(block.center(), 3);
        foundAltar = undefined;
        entity.sendMessage(`§c[!!!]§r Your Mystic Circle destabilizes and explodes! The weight of the spell in creation surpassed the Circle's maximum capacity.`);
      }
      
      world.setDynamicProperty(id, JSON.stringify(foundAltar));
      return;
    }
  }
  
  if (hasNoun && hasVerb) {
    entity.sendMessage(`§g[!]§r This Mystic Circle already contains a §dPattern§r and a §dPower§r. Now, you must either §aClose§r it or §cEmpty§r it.`);
    return;
  }
  
  world.setDynamicProperty(id, JSON.stringify(foundAltar));
}

export async function decorateSpell(entity) {
  let foundAltar = await detectMysticCircle(entity, false);
  if (!foundAltar) {
    if (entity instanceof Player) {
      entity.sendMessage(`§c[!]§r You are not in the bounds of a Mystic Altar to perform this glyph.`);
    }
    return;
  }
  
  let block = world.getDimension(foundAltar.dimension).getBlock(foundAltar.location);
  let id = `mysticCircleAltar:${foundAltar.location.x}_${foundAltar.location.y}_${foundAltar.location.z}_${foundAltar.dimension}`;
  
  let result = getAestheticPieces(block, entity);
  let particlePiece = result[0];
  let items = result[1];
  
  if (particlePiece == undefined) {
    entity.sendMessage(`§c[!]§r You are trying to weave in a spell piece that simply does not exist.`);
    return;
  }
  
  const ptcl = spellAestheticList[particlePiece].parameters;
  
  let particleDefined = JSON.parse(JSON.stringify(foundAltar.spellContents.style));
  
  if (ptcl.type == "overwrite") {
    for (let v of ptcl.values) {
      particleDefined[v[0]] = v[1];
    }
    // Eat the items that need to be eaten.
    nomNomSpellItems(items, block);
  }
  
  if (ptcl.type == "color") {
    let searchVol = new BlockVolume(block.offset(new Vector3(2, 0, 2)), block.offset(new Vector3(-2, 1, -2)));
    
    for (let sBlock of searchVol.getBlockLocationIterator()) {
      let cauldron = block.dimension.getBlock(sBlock);
      
      if (cauldron.getComponent("minecraft:fluid_container")) {
        let cauld = cauldron.getComponent("minecraft:fluid_container");
        
        let isColorless = false;
        if (cauld.fluidColor.red == 0 && cauld.fluidColor.blue == 0 && cauld.fluidColor.green == 0 && cauld.fluidColor.alpha == 0) {
          isColorless = true;
        }
        
        if (cauld.getFluidType() == "Water" && !isColorless) {
          if (particleDefined.colors.length < 2) {
            particleDefined.colors.push( {
              "red": cauld.fluidColor.red,
              "green": cauld.fluidColor.green,
              "blue": cauld.fluidColor.blue
            });
          } else {
            particleDefined.colors.shift();
            particleDefined.colors.push( {
              "red": cauld.fluidColor.red,
              "green": cauld.fluidColor.green,
              "blue": cauld.fluidColor.blue
            });
          }
          
          cauld.fluidColor = {
            red: 0,
            blue: 0,
            green: 0,
            alpha: 0
          };
          cauldron.dimension.spawnParticle("bw:craft_spell_particle", cauldron.center());
          // Eat the items that need to be eaten.
          nomNomSpellItems(items, block);
          break;
        }
      }
    }
  }
  
  foundAltar.spellContents.style = particleDefined;
  world.setDynamicProperty(id, JSON.stringify(foundAltar));
}

export async function seeMysticCircle(player) {
  let foundCircle = await detectMysticCircle(player, false);
  
  if (foundCircle != true && foundCircle != undefined) {
    let str = "";
    if (foundCircle.noun != undefined) {
      str = str.concat(spellRead("noun", foundCircle)+"\n\n");
    }
    if (foundCircle.verb != undefined) {
      str = str.concat(spellRead("verb", foundCircle));
    }
    if (foundCircle.colors != undefined) {
      let colors = foundCircle.colors;
      let extraTxt = "\n\n";
      if (colors.length == 1) {
        extraTxt = extraTxt + `This Spell Glyph is somewhat tinted by the mystical powers of Color. Where §lpossible§r, it will be ${colors[0]}.`
      }
      if (colors.length == 2) {
        extraTxt = extraTxt + `This Spell Glyph is somewhat tinted by the mystical powers of Color. Where §lpossible§r, it will be ${colors[0]}§r and ${colors[1]}§r.`
      }
      str = str + extraTxt;
    }
    
    let form = new ActionFormData();
    form.title(`Spell in Mystic Circle`);
    form.body(str);
    form.button("Close");
    form.show(player).then(r => {
      return;
    })
    // player.sendMessage(`Glyphs in Mystic Circle:\n${str}`);
  } else {
    player.sendMessage(`§c[!]§r You are not in the bounds of a Mystic Circle to be able to cast a Noun Glyph properly.`)
  }
}

function isVerbPresent(arr, verb) {
  let present = false;
  
  for (let a of arr) {
    if (a.verbName == verb.verbName) {
      present = true;
    }
  }
  
  return present;
}
export function getOrbicNexii(location, dimension, r = 7) {
  let orbicNexii = world.getDynamicPropertyIds().filter((f) => {
    if (f.startsWith("orbicNexus:")) {
      return f;
    }
  });
  
  let closebyNexus = [];
  
  for (let nexus of orbicNexii) {
    let dissectedStr = nexus.slice(11).split("_");
    let dim = world.getDimension(dissectedStr.pop());
    
    let loc = new Vector3(+dissectedStr[0], +dissectedStr[1], +dissectedStr[2]);
    
    if (dim.id == dimension) {
      if (inRange(loc, location, r)) {
        closebyNexus.push(nexus);
      }
    }
  }
  return closebyNexus;
}

// If true, entity was deemed to have matched the conditions
// If false, some amount of this entity's data was deemed to be not enough.
export function essenceCheck(entity, filters) {
  if (filters == undefined) {
    return true;
  }
  
  // Necessary checks to be true: 1
  let totalChecks = 0;
  
  // Start filtering based on new Filter Array
  // Type: Object{}
  for (let filter of filters) {
    if (filter.quintessences != undefined) {
      // Q1 checks
      // These are confirmed to be on the creature before anything else
      let quintChecks = 0;
      for (let quint of filter.quintessences) {
        // ALL parameters in these needs to be met
        if (allFilterCheck(entity, quint)) {
          quintChecks = quintChecks + 1;
        }
      }
      // If all checks were successful, the amount added should be that total;
      totalChecks = totalChecks + quintChecks;
      // If this returns more than 0, the filter should return true;
    }
    
    if (anyFilterCheck(entity, filter)) {
      totalChecks = totalChecks + 1;
    }
  }
  
  if (totalChecks > 0) {
    return true;
  } else {
    return false;
  }
}

// Any of these parameters may be present for it to be true
function anyFilterCheck(entity, filter) {
  // All filter keys become checks that need to be filled.
  let filterChecks = 0;
  
  for (let [k, v] of Object.entries(filter)) {
    if (k == "quintessences") {
      continue;
    }
    // All uninversed versions
    let vE = [];
    // All inversed versions
    let iV = [];
    
    // If its an array
    if (Array.isArray(v)) {
      // Un-"$"-ed types
      vE = v.filter(i => !i.startsWith("$"));
      // "$"-ed types
      v.filter(i => i.startsWith("$")).forEach((e) => {
        iV.push(e.slice(1));
      });
    }
    
    // Checks entity name
    if (k == "Ego") {
      if (entity instanceof Player) {
        if (vE.includes(entity.name)) {
          filterChecks = filterChecks + 1;
        }
        if (iV.length > 0) {
          if (!iV?.includes(entity.name)) {
            filterChecks = filterChecks + 1;
          }
        }
      } else {
        if (vE.includes(entity.nameTag)) {
          filterChecks = filterChecks + 1;
        }
        if (iV.length > 0) {
          if (!iV?.includes(entity.nameTag)) {
            filterChecks = filterChecks + 1;
          }
        }
      }
    }
    
    // Checks entity type
    if (k == "Species") {
      if (vE.includes(entity.typeId)) {
        filterChecks = filterChecks + 1;
      }
      if (iV.length > 0) {
        if (!iV?.includes(entity.typeId)) {
          filterChecks = filterChecks + 1;
        }
      }
    }
    
    // Checks entity families
    if (k == "Familia") {
      let families = entity.getComponent("minecraft:type_family");
      if (families) {
        // Entities that have one of the stated families are selected
        for (let f of vE) {
          if (families.hasTypeFamily(f)) {
            filterChecks = filterChecks + 1;
          }
        }
        
        // Entities that do NOT have one of the stated families are selected
        if (iV.length > 0) {
          for (let f of iV) {
            if (!families.hasTypeFamily(f)) {
              filterChecks = filterChecks + 1;
            }
          }
        }
      }
    }
    
    // Checks entity coven
    if (k == "Coventus") {
      let coven = entity.getDynamicProperty("bw:coven");
      
      if (coven != undefined && vE.includes(coven)) {
        filterChecks = filterChecks + 1;
      }
      if (iV.length > 0) {
        if (coven == undefined || !iV?.includes(coven)) {
          filterChecks = filterChecks + 1;
        }
      }
    }
    
    // Check if in water (Bool)
    if (k == "Aquis") {
      if (v) {
        if (entity.isInWater) {
          filterChecks = filterChecks+1;
        }
      } else {
        if (!entity.isInWater) {
          filterChecks = filterChecks+1;
        }
      }
    }
    
    // Check if in/on fire (Bool)
    if (k == "Ignis") {
      if (v) {
        if (entity.getComponent("minecraft:on_fire")) {
          filterChecks = filterChecks+1;
        }
      } else {
        if (!entity.getComponent("minecraft:on_fire")) {
          filterChecks = filterChecks+1;
        }
      }
    }
    
    // Check if is falling, gliding or flying
    if (k == "Volante") {
      if (v) {
        if (entity?.isFalling || entity?.isFlying || entity?.isGliding) {
          filterChecks = filterChecks+1;
        }
      } else {
        if (!entity?.isFalling && !entity?.isFlying && !entity?.isGliding) {
          filterChecks = filterChecks+1;
        }
      }
    }
    
    // Check health
    if (k == "Vitalus") {
      let health = entity.getComponent("minecraft:health");
      if (v > 0) {
        if (health?.currentValue >= v) {
          filterChecks = filterChecks+1;
        }
      } else {
        if (health == undefined || health.currentValue <= Math.abs(v)) {
          filterChecks = filterChecks+1;
        }
      }
    }
    
    // Check hunger
    if (k == "Esuritio") {
      let hunger = entity.getComponent("minecraft:player.hunger");
      if (v > 0) {
        if (hunger?.currentValue >= v) {
          filterChecks = filterChecks+1;
        }
      } else {
        if (hunger == undefined || hunger.currentValue <= Math.abs(v)) {
          filterChecks = filterChecks+1;
        }
      }
    }
  }
  
  if (filterChecks > 0) {
    return true;
  } else {
    return false;
  }
}
// All parameters must be present for it to be true
function allFilterCheck(entity, filter) {
  // All filter keys become checks that need to be filled.
  let filterChecks = Object.keys(filter).length;
  
  for (let [k, v] of Object.entries(filter)) {
    // All uninversed versions
    let vE = [];
    // All inversed versions
    let iV = [];
    
    // If its an array
    if (Array.isArray(v)) {
      // Un-"$"-ed types
      vE = v.filter(i => !i.startsWith("$"));
      // "$"-ed types
      v.filter(i => i.startsWith("$")).forEach((e) => {
        iV.push(e.slice(1));
      });
    }
    
    // Checks entity name
    if (k == "Ego") {
      let fullTotal = vE.length + iV.length;
      
      if (entity instanceof Player) {
        for (let v of vE) {
          if (v == entity.name) {
            fullTotal = fullTotal - 1;
          }
        }
        for (let v of iV) {
          if (v != entity.name) {
            fullTotal = fullTotal - 1;
          }
        }
      } else {
        for (let v of vE) {
          if (v == entity.nameTag) {
            fullTotal = fullTotal - 1;
          }
        }
        for (let v of iV) {
          if (v != entity.nameTag) {
            fullTotal = fullTotal - 1;
          }
        }
      }
      
      if (fullTotal == 0) {
        filterChecks = filterChecks - 1;
      }
    }
    
    // Checks entity types
    if (k == "Species") {
      let fullTotal = vE.length + iV.length;
      
      for (let v of vE) {
        if (v == entity.typeId) {
          fullTotal = fullTotal - 1;
        }
      }
      for (let v of iV) {
        if (v != entity.typeId) {
          fullTotal = fullTotal - 1;
        }
      }
      
      if (fullTotal == 0) {
        filterChecks = filterChecks - 1;
      }
    }
    
    // Checks entity families
    if (k == "Familia") {
      let families = entity.getComponent("minecraft:type_family");
      
      let fullTotal = vE.length + iV.length;
      if (families) {
        for (let f of vE) {
          if (families.hasTypeFamily(f)) {
            fullTotal = fullTotal - 1;
          }
        }
        for (let f of iV) {
          if (!families.hasTypeFamily(f)) {
            fullTotal = fullTotal - 1;
          }
        }
      }
      
      if (fullTotal == 0) {
        filterChecks = filterChecks - 1;
      }
    }
    
    // Checks entity coven
    if (k == "Coventus") {
      let fullTotal = vE.length + iV.length;
      let coven = entity.getDynamicProperty("bw:coven");
      
      for (let v of vE) {
        if (coven != undefined && v == coven) {
          fullTotal = fullTotal - 1;
        }
      }
      for (let v of iV) {
        if (coven == undefined || v != coven) {
          fullTotal = fullTotal - 1;
        }
      }
      
      if (fullTotal == 0) {
        filterChecks = filterChecks - 1;
      }
    }
    
    // Check if in water (Bool)
    if (k == "Aquis") {
      let fullTotal = 1;
      if (v) {
        if (entity.isInWater) {
          fullTotal = fullTotal - 1;
        }
      } else {
        if (!entity.isInWater) {
          fullTotal = fullTotal - 1;
        }
      }
      
      if (fullTotal == 0) {
        filterChecks = filterChecks - 1;
      }
    }
    
    // Check if they're in/on fire
    if (k == "Ignis") {
      let fullTotal = 1;
      if (v) {
        if (entity.getComponent("minecraft:on_fire")) {
          fullTotal = fullTotal - 1;
        }
      } else {
        if (!entity.getComponent("minecraft:on_fire")) {
          fullTotal = fullTotal - 1;
        }
      }
      
      if (fullTotal == 0) {
        filterChecks = filterChecks - 1;
      }
    }
    
    // Check if falling, flying, gliding
    if (k == "Volante") {
      let fullTotal = 1;
      if (v) {
        if (entity?.isFalling || entity?.isFlying || entity?.isGliding) {
          fullTotal = fullTotal - 1;
        }
      } else {
        if (!entity?.isFalling && !entity?.isFlying && !entity?.isGliding) {
          fullTotal = fullTotal - 1;
        }
      }
      
      if (fullTotal == 0) {
        filterChecks = filterChecks - 1;
      }
    }
    
    // Check health
    if (k == "Vitalus") {
      let fullTotal = 1;
      let health = entity.getComponent("minecraft:health");
      if (v > 0) {
        if (health?.currentValue >= v) {
          fullTotal = fullTotal - 1;
        }
      } else {
        if (health == undefined || health.currentValue <= Math.abs(v)) {
          fullTotal = fullTotal - 1;
        }
      }
      
      if (fullTotal == 0) {
        filterChecks = filterChecks - 1;
      }
    }
    
    // Check hunger
    if (k == "Esuritio") {
      let fullTotal = 1;
      let hunger = entity.getComponent("minecraft:player.hunger");
      if (v > 0) {
        if (hunger?.currentValue >= v) {
          fullTotal = fullTotal - 1;
        }
      } else {
        if (hunger == undefined || hunger.currentValue <= Math.abs(v)) {
          fullTotal = fullTotal - 1;
        }
      }
      
      if (fullTotal == 0) {
        filterChecks = filterChecks - 1;
      }
    }
  }
  
  if (filterChecks == 0) {
    return true;
  } else {
    return false;
  }
}



export function castBWSpell(spell, spellItem, source, useOrbos = true) {
  let success = false;
  let obstructed = false;
  // Check for Wards first
  let wards = world.getDynamicPropertyIds().filter((e) => {
    if (e.startsWith("pumpkinWard:")) {
      return e;
    }
  });
  
  for (let w of wards) {
    if (!world.getDynamicProperty(w)) {
      continue;
    }
    let ward = JSON.parse(world.getDynamicProperty(w));
    
    try {
      if (ward.dimension != source.dimension.id) {
        continue;
      }
      if (!source.dimension.isChunkLoaded(ward.position)) {
        continue;
      }
    } catch (err) {
      continue;
    }
    
    if (ward.asleep) {
      continue;
    }
    if (inRange(source.location, ward.position, 32) && source instanceof Entity) {
      let eatResult = jackEat(ward, w);
      if (eatResult) {
        ward = eatResult;
      } else {
        continue;
      }
      
      if (ward.trigger == "spell_use") {
        if (ward.condition != undefined) {
          if (ward.conditionType == "item") {
            let equipped = source.getComponent("minecraft:equippable")?.getEquipment("Mainhand");
            if (ward.condition != equipped?.typeId) {
              continue;
            }
          }
        }
        if (!checkSwitch(ward.switch, source.dimension)) {
          continue;
        }
        
        if (!essenceCheck(source, ward.filter)) {
          continue;
        }
        let effectFunc = wardingDusts[ward.effect].effect;
        
        let result = effectFunc(source, ward.params);
        
        if (result != undefined && obstructed == false) {
          obstructed = result;
        }
      }
    }
  }
  
  // A Spell Canceling Ward caught this 
  if (obstructed) {
    source.sendMessage(`§c[!]§r Your spell has been blocked.`);
    return success;
  }
  
  // Consider the caster of the spell
  // A spell can originate from an entity OR a Jack o' Ward variant.
  let castingSource = {};
  if (source instanceof Entity) {
    if (source?.isValid) {
      castingSource = {
        type: "entity",
        sourceID: source.id
      }
    }
  } else
  if (source instanceof Block) {
    if (source?.isValid) {
      castingSource = {
        type: "jack",
        sourceID: `pumpkinWard:${Math.floor(source.x)}_${Math.floor(source.y)}_${Math.floor(source.z)}_${source.dimension.id}`
      }
    }
  }
  spell.castingSource = JSON.parse(JSON.stringify(castingSource));
  
  // Personality Insert
  if (spellItem?.getComponent("bw:wand_personality")) {
    spell.wand = spellItem.getComponent("bw:wand_personality")?.customComponentParameters?.params;
  }
  
  // Wand Personality
  if (spell.wand?.augmentDamage != undefined) {
    // Damage Augmentation
    // Check if spell has the correct tags first
    let appliedTags = 0;
    if (spell.wand.augmentDamage.aspects_affected) {
      for (let a of spell.wand.augmentDamage.aspects_affected) {
        if (spell.cost.tags.includes(a)) {
          appliedTags++;
        }
      }
    } else {
      appliedTags = 1;
    }
    
    if (appliedTags > 0) {
      let health = player.getComponent("minecraft:health");
      if (health) {
        let min = 0;
        let max = health.effectiveMax;
        
        if (spell.wand.augmentDamage.aboveHealthPercent) {
          min = health.effectiveMax * (spell.wand.augmentDamage.aboveHealthPercent/100);
        }
        if (spell.wand.augmentDamage.belowHealthPercent) {
          max = health.effectiveMax * (spell.wand.augmentDamage.belowHealthPercent/100);
        }
        
        if (health.currentValue >= min && health.currentValue <= max) {
          // The common key name for spell damage dealing
          if (spell.verb.dealDamage != undefined) {
            spell.verb.dealDamage.damage = spell.verb.dealDamage.damage * spell.wand.augmentDamage.vengeantMultiplier;
          }
        }
      }
    }
  }
  
  // Core Based Modifications
  let core = spellItem?.getDynamicProperty("bw:wandCore");
  if (core != undefined) {
    if (core == "minecraft:string") {
      if (spell.verb.duration) {
        spell.verb.duration += 5;
      }
      if (spell.verb.custom_potion_effect.duration) {
        spell.verb.custom_potion_effect.duration += 5;
      }
    }
  }
  
  // Go through and cast the Patterns
  if (spell.noun == "Self") {
    // A spell can be set to not use Orbos
    // A spell can also originate from a block, in the case of Jacks;
    let enoughOrbos = useOrbos ? deductOrbos(spell.castingSource, spellItem, spell.cost) : true;
    // Orbos has been paid
    if (enoughOrbos) {
      // References an object full of functions trying to cast a variety of things.
      // Dimension, spell information;
      nounCastFunctions[spell.noun].default(source.dimension, spell);
      success = true;
    }
  }
  if (spell.noun == "Ward") {
    // The caster must be an entity if this is the primary Pattern.
    if (source instanceof Entity) {
      // A spell can be set to not use Orbos
      // A spell can also originate from a block, in the case of Jacks;
      let enoughOrbos = useOrbos ? deductOrbos(spell.castingSource, spellItem, spell.cost) : true;
      // Orbos has been paid
      if (enoughOrbos) {
        // References an object full of functions trying to cast a variety of things.
        // Dimension, spell information;
        nounCastFunctions[spell.noun].onCast([source], spell);
        success = true;
      }
    }
  }
  if (spell.noun == "Sight") {
    let enoughOrbos = useOrbos ? deductOrbos(spell.castingSource, spellItem, spell.cost, false) : true;
    // Orbos is checked
    if (enoughOrbos) {
      nounCastFunctions[spell.noun].default(source.dimension, spell, spellItem, useOrbos);
      success = true;
    }
  }
  if (spell.noun == "Bolt") {
    let enoughOrbos = useOrbos ? deductOrbos(spell.castingSource, spellItem, spell.cost) : true;
    // Orbos has been paid
    if (enoughOrbos) {
      nounCastFunctions[spell.noun].onShoot(source.dimension, spell);
      success = true;
    }
  }
  if (spell.noun == "Bubble") {
    let enoughOrbos = useOrbos ? deductOrbos(spell.castingSource, spellItem, spell.cost) : true;
    // Orbos has been paid
    if (enoughOrbos) {
      nounCastFunctions[spell.noun].onCreate(source.dimension, spell);
      success = true;
    }
  }
  if (spell.noun == "Cube") {
    let enoughOrbos = useOrbos ? deductOrbos(spell.castingSource, spellItem, spell.cost) : true;
    // Orbos has been paid
    if (enoughOrbos) {
      nounCastFunctions[spell.noun].onCreate(source.dimension, spell);
      success = true;
    }
  }
  
  // Go through and cast based on Noun
  /*
  if (spell.type == "Self") {
    let enoughOrbos = useOrbos ? deductOrbos(player, spellItem, spell.cost) : true;
    if (enoughOrbos) {
      spellCastTypes[spell.type](player.dimension, spell.noun, spell.verbs, player);
      success = true;
    }
  }
  if (spell.type == "Sight") {
    let nounStats = spell.noun;
    let targetThing = player.getEntitiesFromViewDirection({ "ignoreBlockCollision": nounStats.astral, "includeLiquidBlocks": !nounStats.waterproof, "includePassableBlocks": nounStats.sensitive, "maxDistance": nounStats.sightRange});
    
    if (targetThing.length > 0) {
      let arr = [];
      for (let i = 0; i < nounStats.targetAmount; i++) {
        if (targetThing[i] != undefined) {
          let selectEntity = targetThing[i].entity;
          
          let time = selectEntity.getDynamicProperty("bw:spellCooldown");
          if (time == undefined) {
            time = 0;
          }
          if (time > 0 && time <= 3) {
            console.warn("PARRIED!")
            continue;
          }
          
          arr.push(selectEntity);
        }
      }
      targetThing = arr;
    }
    
    if (targetThing?.length > 0) {
      let enoughOrbos = useOrbos ? deductOrbos(player, spellItem, spell.cost) : true;
      if (enoughOrbos) {
        spellCastTypes[spell.type](player.dimension, spell.noun, spell.verbs, targetThing);
        success = true;
      }
    }
  }
  if (spell.type == "Bolt") {
    let enoughOrbos = useOrbos ? deductOrbos(player, spellItem, spell.cost) : true;
    if (enoughOrbos) {
      let info = {
        noun: spell.noun,
        verbs: spell.verbs
      }
      createBolt(player, info, spell.cost.tags);
      success = true;
    }
  }
  if (spell.type == "Bubble" || spell.type == "Cube") {
    let enoughOrbos = useOrbos ? deductOrbos(player, spellItem, spell.cost) : true;
    
    if (enoughOrbos) {
      let info = {
        noun: spell.noun,
        verbs: spell.verbs
      };
      createAreaEffect(player.dimension.id, player.location, spell.type, info, player.id);
      success = true;
    }
  }
  if (spell.type == "Ward") {
    let enoughOrbos = useOrbos ? deductOrbos(player, spellItem, spell.cost) : true;
    
    if (enoughOrbos) {
      spellCastTypes[spell.type](player.dimension, spell.noun, spell.verbs, player);
      success = true;
    }
  }
  */
  return success;
}

system.beforeEvents.startup.subscribe(spellEvent => {
  spellEvent.itemComponentRegistry.registerCustomComponent('bw:use_spell_item', {
    onUse: e => {
      let player = e.source;
      let spellItem = e.itemStack;
      
      let spell = spellItem.getDynamicProperty("bw:mysticSpell");
      
      if (spell != undefined) {
        spell = JSON.parse(spell);
        // Tired of Fatigue rn
        spell.cost.fatigue = 0;
        
        let spellSucceeded = castBWSpell(spell, spellItem, player);
        
        if (spellSucceeded) {
          player.dimension.playSound("mob.evocation_illager.cast_spell", player.location);
        }
      }
    }
  });
  
  spellEvent.itemComponentRegistry.registerCustomComponent('bw:wand_touch', {
    /*
    onHitEntity: e => {
      let player = e.attackingEntity;
      let target = e.hitEntity;
      let spellItem = e.itemStack;
      
      if (!e.hadEffect) {
        return;
      }
      
      let spellIndex = spellItem.getDynamicProperty("bw:lastGlyph");
      let spell = undefined;
      if (spellIndex != undefined) {
        spell = spellItem.getDynamicProperty(`bwWandGlyph:${spellIndex}`);
      }
      
      if (spell != undefined) {
        spell = JSON.parse(spell);
        
        switch (spell.noun.type) {
          case "Touch": {
            let enoughOrbos = deductOrbos(player, spellItem, spell.cost);
            if (!enoughOrbos) {
              break;
            }
            
            castOnTouch(player, target, true, spell.verb);
            target.dimension.playSound(spell.verb.sound.name, target.location, spell.verb.sound.parameters);
            break;
          }
        }
      }
      
    },
    onUseOn: e => {
      let player = e.source;
      let target = e.block;
      let spellItem = e.itemStack;
      
      let spellIndex = spellItem.getDynamicProperty("bw:lastGlyph");
      let spell = undefined;
      if (spellIndex != undefined) {
        spell = spellItem.getDynamicProperty(`bwWandGlyph:${spellIndex}`);
      }
      
      if (spell != undefined) {
        spell = JSON.parse(spell);
        
        spell.verb.faceDir = getFace(e.blockFace);
        
        switch (spell.noun.type) {
          case "Touch": {
            let enoughOrbos = deductOrbos(player, spellItem, spell.cost);
            if (!enoughOrbos) {
              break;
            }
            
            castOnTouch(player, target, false, spell.verb);
            target.dimension.playSound(spell.verb.sound.name, target.location, spell.verb.sound.parameters);
            break;
          }
        }
      }
    }
    */
  });
  
  spellEvent.itemComponentRegistry.registerCustomComponent('bw:bind_spells', {
    onUseOn: e => {
      let player = e.source;
      let target = e.block;
      let wand = e.itemStack;
      
      if (target.getComponent("inventory")) {
        let inv = target.getComponent("inventory").container;
        let spellObj = {};

        
        for (let i = 0; i < 8; i++) {
          let item = inv.getItem(i);
          if (item?.typeId == "bw:glyph_book" && item.getDynamicProperty("bw:mysticSpell")) {
            let mysticSpell = JSON.parse(item.getDynamicProperty("bw:mysticSpell"));
            
            mysticSpell.name = item.nameTag;
            spellObj[`bwWandSlot_${i}`] = JSON.stringify(mysticSpell);
          }
        }
        for (let [k, v] of Object.entries(spellObj)) {
          wand.setDynamicProperty(k, v);
        }
        
        let lore = wand.getLore();
        if (lore == undefined) {
          lore = [];
        }
        if (lore[0] != "§r§6Spells are bound to this Wand.") {
          lore = ["§r§6Spells are bound to this Wand."].concat(lore);
        }
        wand.setLore(lore);
        player.getComponent("inventory").container.setItem(player.selectedSlotIndex, wand);
      }
    }
  });
  
  spellEvent.itemComponentRegistry.registerCustomComponent('bw:nexus_creator', {
    onUseOn: e => {
      let player = e.source;
      let touchedBlk = e.block;
      let wand = e.itemStack;
      
      if (touchedBlk.typeId == "minecraft:amethyst_block") {
        let nexusName = `orbicNexus:${Math.floor(touchedBlk.location.x)}_${Math.floor(touchedBlk.location.y)}_${Math.floor(touchedBlk.location.z)}_${touchedBlk.dimension.id}`;
        let mysticAltarName = `mysticCircleAltar:${Math.floor(touchedBlk.location.x)}_${Math.floor(touchedBlk.location.y)}_${Math.floor(touchedBlk.location.z)}_${touchedBlk.dimension.id}`;
        
        if (world.getDynamicProperty(nexusName) == undefined && isOrbicPillar(touchedBlk.location, touchedBlk.dimension.id)) {
          world.setDynamicProperty(nexusName, 0);
          player.sendMessage(`§d[+]§r An Orbic Nexus has been created at §c${Math.floor(touchedBlk.location.x)}§r §g${Math.floor(touchedBlk.location.y)}§r §1${Math.floor(touchedBlk.location.z)}§r.`)
        } else
        if (world.getDynamicProperty(nexusName) != undefined) {
          player.sendMessage(`§d[#]§r Orbos Stored: ${world.getDynamicProperty(nexusName)}`);
        }
        
        if (world.getDynamicProperty(mysticAltarName)) {
          let altar = world.getDynamicProperty(mysticAltarName);
          
          player.sendMessage(altar);
        }
      }
    }
  });
  
  // All Commands
  // Enum of all the Faerie
  spellEvent.customCommandRegistry.registerEnum("bw:fae", Object.values(faeries));
  spellEvent.customCommandRegistry.registerEnum("bw:familiar_options", ["summon", "remove"]);
  
  let hexes = [
    "ocean_grasp",
    "hellish_attraction",
    "brittle_bones",
    "copper_soul",
    "death",
    "ineptitude",
    "enderman_hex",
    "creeper_hex",
    "entombment",
    "sympathy",
    "leadweight",
    "obliquity"
  ]
  spellEvent.customCommandRegistry.registerEnum("bw:hexes", hexes);
  spellEvent.customCommandRegistry.registerEnum("bw:trust_params", ["add", "set", "remove"]);
  // /addfae [entity] [faerie]
  spellEvent.customCommandRegistry.registerCommand({
    name: "bw:addfae",
    description: "Adds a faerie to a player's Fae Family.",
    permissionLevel: CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [
      {
        name: "entity",
        type: CustomCommandParamType.EntitySelector
      },
      {
        name: "bw:fae",
        type: CustomCommandParamType.Enum
      }
    ]
  }, (command, ...results) => {
    system.run(() => {
      let players = results[0];
      let fae = results[1];
      
      let success = false;
      let faerie = findFaery(fae);
      if (faerie) {
        for (let player of players) {
          if (player instanceof Player) {
            if (!hasFaery(player, faerie)) {
              addFaery(player, faerie, true);
              if (!success) {
                success = true;
              }
            }
          }
        }
      }
      if (command.sourceType == "Entity") {
        if (command.sourceEntity instanceof Player) {
          if (success) {
            command.sourceEntity.sendMessage("The command was §asuccessful§r. The Faerie was added.");
          } else {
            command.sourceEntity.sendMessage("The command was §cunsuccessful§r.");
          }
        }
      }
    });
  });
  // /removefae [entity] [faerie]
  spellEvent.customCommandRegistry.registerCommand({
    name: "bw:removefae",
    description: "Removes a faerie from a player's Fae Family.",
    permissionLevel: CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [
      {
        name: "entity",
        type: CustomCommandParamType.EntitySelector
      },
      {
        name: "bw:fae",
        type: CustomCommandParamType.Enum
      }
    ]
  }, (command, ...results) => {
    system.run(() => {
      let players = results[0];
      let fae = results[1];
      
      let success = false;
      let faerie = findFaery(fae);
      if (faerie) {
        for (let player of players) {
          if (player instanceof Player) {
            if (hasFaery(player, faerie)) {
              removeFaery(player, faerie);
              if (!success) {
                success = true;
              }
            }
          }
        }
      }
      if (command.sourceType == "Entity") {
        if (command.sourceEntity instanceof Player) {
          if (success) {
            command.sourceEntity.sendMessage("The command was §asuccessful§r. The Faerie was removed.");
          } else {
            command.sourceEntity.sendMessage("The command was §cunsuccessful§r.");
          }
        }
      }
    });
  });
  // /faetrust [entity] [faerie] [trust]
  spellEvent.customCommandRegistry.registerCommand({
    name: "bw:faetrust",
    description: "Manipulates trust to a faerie to a player's Fae Family.",
    permissionLevel: CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [
      {
        name: "entity",
        type: CustomCommandParamType.EntitySelector
      },
      {
        name: "bw:fae",
        type: CustomCommandParamType.Enum
      },
      {
        name: "amount",
        type: CustomCommandParamType.Float
      }
    ]
  }, (command, ...results) => {
    system.run(() => {
      let players = results[0];
      let fae = results[1];
      let amt = results[2];
      
      let success = false;
      let faerie = findFaery(fae);
      if (faerie) {
        for (let player of players) {
          if (player instanceof Player) {
            if (hasFaery(player, faerie)) {
              addFaeryTrust(player, faerie, amt);
              if (!success) {
                success = true;
              }
            }
          }
        }
      }
      if (command.sourceType == "Entity") {
        if (command.sourceEntity instanceof Player) {
          if (success) {
            command.sourceEntity.sendMessage("The command was §asuccessful§r. The Faerie's Trust was modified.");
          } else {
            command.sourceEntity.sendMessage("The command was §cunsuccessful§r.");
          }
        }
      }
    });
  });
  // /familiar [enum]
  spellEvent.customCommandRegistry.registerCommand({
    name: "bw:familiar",
    description: "Summon, remove and dismiss familiars.",
    permissionLevel: CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [
      {
        name: "bw:familiar_options",
        type: CustomCommandParamType.Enum
      }
    ]
  }, (command, ...results) => {
    system.run(() => {
      let commandType = results[0];
      
      if (command.sourceType != "Entity") {
        return;
      }
      
      if (command.sourceEntity instanceof Player) {
        let plr = command.sourceEntity
        if (!hasFamiliar(plr)) {
          return plr.sendMessage("§cYou have no familiar for this command to affect.§r")
        }
        let familiar = getTrueFamiliars(plr)[0];
        
        if (commandType == "summon") {
          let identifier = `bw:isFamiliar_${familiar.identity}_${plr.id}`;
          
          // Summon if alive
          // If not, reconstruct
          let entity = world.getDimension(familiar.lastDimension).getEntities({location: familiar.lastLocation, maxDistance: 10}).filter((e) => {
            if (isPlayerFamiliar(plr, e)) {
              return e;
            }
          })[0]
          
          if (entity != undefined) {
            entity.teleport(plr.location, {dimension: plr.dimension});
          } else {
            let structureName = `familiarBox:${familiar.identity}_${plr.id}`;
          
            if (world.structureManager.get(structureName) != undefined) {
              world.structureManager.place(structureName, plr.dimension, plr.location, {includeBlocks: false, includeEntities: true, waterlogged: true});
              
              plr.playSound("mob.evocation_illager.cast_spell",{pitch: 2.8});
              
              familiar.isDead = false;
              familiar.dismissed = false;
              if (familiar.dismissCode) {
                delete familiar.dismissCode;
              }
              world.setDynamicProperty(identifier, JSON.stringify(familiar));
            }
          }
        }
        if (commandType == "remove") {
          let identifier = `${familiar.identity}_${plr.id}`;
          
          world.setDynamicProperty(`bw:isFamiliar_${identifier}`, undefined);
          
          let structureName = `familiarBox:${identifier}`;
          if (world.structureManager.get(structureName) != undefined) {
            world.structureManager.delete(structureName);
          }
          
          let ownerMap = familiarRegistry.get(plr.id);
          ownerMap.delete(familiar.identity);
          familiarRegistry.set(plr.id, ownerMap);
          
          plr.sendMessage("Your familiar has been removed.");
        }
      }
    });
  });
  // /hex [entity] [hex_enum]
  spellEvent.customCommandRegistry.registerCommand({
    name: "bw:hex",
    description: "Lays a hex on an entity.",
    permissionLevel: CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [
      {
        name: "entity",
        type: CustomCommandParamType.EntitySelector
      },
      {
        name: "bw:hexes",
        type: CustomCommandParamType.Enum
      }
    ],
    optionalParameters: [
      {
        name: "amplifier",
        type: CustomCommandParamType.Integer
      }
    ]
  }, (command, ...results) => {
    system.run(() => {
      let entities = results[0];
      let hex = results[1];
      let amplifier = results[2];
      
      for (let entity of entities) {
        if (amplifier == undefined) {
          amplifier = 0;
        }
        ritualHexTarget(entity, hex, entity, 3);
      }
    });
  });
  // /cleansehex [entity]
  spellEvent.customCommandRegistry.registerCommand({
    name: "bw:cleansehex",
    description: "Cleanses all hexes from an entity.",
    permissionLevel: CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [
      {
        name: "entity",
        type: CustomCommandParamType.EntitySelector
      }
    ]
  }, (command, ...results) => {
    system.run(() => {
      let entities = results[0];
      
      for (let entity of entities) {
        cleanseTarget(entity, "greater", entity, 1000);
      }
    });
  });
});

system.run(() => {
  world.getPlayers().forEach(p => {
    // Loop through all these and then substitute please.
    p.setDynamicProperty("bw:lessers", undefined);
    p.setDynamicProperty("bw:medians", undefined);
    p.setDynamicProperty("bw:patrons", undefined);
  })
})

export function luckRoll(int) {
  let chance = Math.random() * 100;
  if (chance < int) {
    return true;
  } else {
    false;
  }
}

export function diceRoll(die, sides, straight = false) {
  let value = 0;
  for (;die > 0; die--) {
    let rollValue = 1 + (sides-1) * Math.random();
    rollValue = Math.round(rollValue)
    
    if (!straight) {
      if (rollValue == 1) {
        return value;
      };
      if (rollValue == sides) {
        die++;
      }
    }
    value += rollValue;
  }
  return value;
}

export function getWandTags(wand) {
  let tags = [];
  if (wand?.getDynamicProperty("bw:wandTags") == undefined) {
    return tags;
  }
  let wandTags = JSON.parse(wand.getDynamicProperty("bw:wandTags"));
  
  return Object.keys(wandTags);
}
export function getWandStats(wand) {
  let tags = [];
  if (wand?.getDynamicProperty("bw:wandTags") == undefined) {
    return tags;
  }
  let wandTags = JSON.parse(wand.getDynamicProperty("bw:wandTags"));
  
  return wandTags;
}

export function gatherCelestialOrbos(item, player, num) {
  if (num % 20 != 0) {
    return;
  }
  if (!player.hasTag("bw:witch_initiate")) {
    return;
  }
  
  let orbos = world.scoreboard.getObjective("bw:oEnergy");
  
  let gatheredOrbos = 0;
  
  if (item.hasComponent("bw:mystic_wand") || wands.includes(item.typeId)) {
    if (item.typeId == "bw:ritual_scroll" || item.typeId == "minecraft:stick") {
      return;
    }
    
    if (player.getDynamicProperty("bwHex:ineptitude") != undefined) {
      return;
    }
    
    // Wand tags
    const wandTags = getWandStats(item);
    
    // Get the Fae
    // let brownie = findFaery("brownie");
    let titania = findFaery("titania");
    
    /*
    if (hasFaery(player, brownie)) {
      brownie = getFaery(player, brownie);
      if (brownie.trust >= 35) {
        let molang = new MolangVariableMap();
        let playerVec = player.location;
        let spawnPoint = player.getSpawnPoint();
        spawnPoint.dimension = undefined;
        let spawnDirVector = Vector3.subtract(spawnPoint, playerVec);
        if ((spawnDirVector.x < 1 && spawnDirVector.x > 0) || (spawnDirVector.x > -1 && spawnDirVector.x < 0)) {
          spawnDirVector.x = 0;
        }
        if ((spawnDirVector.z < 1 && spawnDirVector.z > 0) || (spawnDirVector.z > -1 && spawnDirVector.z < 0)) {
          spawnDirVector.z = 0;
        }
        
        let leyLength = Vector3.magnitude(spawnDirVector);
        if (leyLength >= 10) {
          leyLength = 1;
        } else {
          leyLength = leyLength/10;
        }
        
        molang.setSpeedAndDirection("variable.spd", leyLength, spawnDirVector);
        
        player.spawnParticle("bw:ley_trail", player.location, molang);
      }
    }
    */
    
    if (world.getMoonPhase() == MoonPhase.FullMoon) {
      if (world.getTimeOfDay() > 13000) {
        let tag = wandTags["celestial"];
        if (tag == undefined) {
          tag = 0;
        }
        
        gatheredOrbos += Math.round(5 + (5 * (tag/100)));
      }
    }
    if (world.getMoonPhase() == MoonPhase.NewMoon) {
      if (world.getTimeOfDay() > 13000) {
        let tag = wandTags["celestial"];
        if (tag == undefined) {
          tag = 0;
        }
        
        gatheredOrbos += Math.round(3 + (3 * (tag/100)));
      }
    }
    
    if (world.getTimeOfDay() >= 5000 && world.getTimeOfDay() <= 7000) {
      let bonus = 0;
      let tags = [
        wandTags["fire"],
        wandTags["celestial"]
      ];
      for (let tag of tags) {
        if (tag == undefined) {
          tag = 0;
        }
        bonus = bonus + tag;
      }
      
      gatheredOrbos += Math.round(6 + (6 * (bonus/100)));
      
      // Photosynthesis Extra Absorption
      if (player?.getDynamicProperty("bwDuration:photosynthesis")) {
        let efct = JSON.parse(player.getDynamicProperty("bwDuration:photosynthesis"));
        
        gatheredOrbos += 2*(efct.amplifier+1);
      }
    }
    
    if (world.getTimeOfDay() >= 17000 && world.getTimeOfDay() <= 19000) {
      let bonus = 0;
      let tags = [
        wandTags["water"],
        wandTags["celestial"]
      ];
      for (let tag of tags) {
        if (tag == undefined) {
          tag = 0;
        }
        bonus = bonus + tag;
      }
      
      gatheredOrbos += Math.round(6 + (6 * (bonus/100)));
    }
    
    // Titania, Plant Orbos absorb
    if (hasFaery(player, titania)) {
      let nBlock = player.getBlockFromViewDirection({includePassableBlocks: true, maxDistance: 5});
      if (seenBlock?.block?.typeId != undefined && titaniaPlants.includes(seenBlock?.block.typeId)) {
        gatheredOrbos += 1;
      }
    }
    
    // Magickal Absorption
    if (player?.getDynamicProperty("bwDuration:magickal_absorption")) {
      let efct = JSON.parse(player.getDynamicProperty("bwDuration:magickal_absorption"));
      if (!efct.inversed) {
        gatheredOrbos = gatheredOrbos + gatheredOrbos * ((efct.amplifier * 50 + 50)/100);
      }
    }
    
    let nexusBlock = player.getBlockFromViewDirection({maxDistance: 10});
    if (nexusBlock?.block.typeId != undefined) {
      nexusBlock = nexusBlock.block;
      let nexusName = `orbicNexus:${Math.floor(nexusBlock.location.x)}_${Math.floor(nexusBlock.location.y)}_${Math.floor(nexusBlock.location.z)}_${nexusBlock.dimension.id}`;
      
      if (world.getDynamicProperty(nexusName)) {
        let orbosStored = world.getDynamicProperty(nexusName);
        if (orbosStored >= 150) {
          world.setDynamicProperty(nexusName, orbosStored - 150);
          gatheredOrbos += 150;
          
          let molang = new MolangVariableMap();
          molang.setColorRGB("variable.color", {
            red: Math.random(),
            green: Math.random(),
            blue: Math.random()
          });
          player.spawnParticle("bw:nexus_absorb", nexusBlock.center(), molang);
        }
      }
    }
    
    if (gatheredOrbos > 0) {
      player.spawnParticle("bw:charging_orbos_particle", player.getHeadLocation());
      player.playSound("chime.amethyst_block", {
        volume: 0.45,
        pitch: 0.3+Math.random()
      });
      // Orbos goes into Pool
      orbos.addScore(player, gatheredOrbos);
    }
  }
}

export const magicalItem = {
  "minecraft:enchanted_golden_apple": 100,
  "minecraft:golden_apple": 85,
  "minecraft:golden_carrot": 45,
  "minecraft:glow_berries": 20,
  "minecraft:rotten_flesh": -20,
  "minecraft:spider_eye": -30
};

world.afterEvents.entityDie.subscribe(event => {
  const player = event.damageSource.damagingEntity;
  let orbos = world.scoreboard.getObjective("bw:oEnergy");
  const deceased = event.deadEntity;
  
  if (player == undefined || !player?.isValid || player.typeId != "minecraft:player") {
    return;
  }
  
  const weapon = player.getComponent("inventory").container.getItem(player.selectedSlotIndex)
  
  // Do sacrifice
  if (weapon != undefined && weapon.typeId == "bw:athame") {
    let deadHealth = deceased.getComponent("minecraft:health");
    let defaultHealth = deadHealth.defaultValue;
    
    let taint = 5 * defaultHealth;
    const sacrificeProperty = `bw:deathTaint_${Math.floor(player.location.x)}_${Math.floor(player.location.y)}_${Math.floor(player.location.z)}_${player.dimension.id}`;
    
    if (!world.getDynamicProperty(sacrificeProperty)) {
      let obj = {
        energy: taint,
        time: 120
      }
      world.setDynamicProperty(sacrificeProperty, JSON.stringify(obj));
    } else {
      let obj = JSON.parse(world.getDynamicProperty(sacrificeProperty));
      obj.energy = obj.energy + taint;
      obj.timer = 120;
      world.setDynamicProperty(sacrificeProperty, JSON.stringify(obj));
    }
  }
});

world.afterEvents.itemCompleteUse.subscribe(event => {
  let item = event.itemStack;
  let orbos = world.scoreboard.getObjective("bw:oEnergy");
  let player = event.source;
  
  for (let [key, value] of Object.entries(magicalItem)) {
    if (key == item.typeId) {
      orbos.addScore(player, value);
      player.onScreenDisplay.setActionBar(`§d[Orbos| ${orbos?.getScore(player.scoreboardIdentity)}]`);
    }
  }
  
  if (item != undefined && item.typeId == "minecraft:apple" && player.getDynamicProperty("bwDuration:bountyOfForest") != undefined) {
    let bountyBuff = JSON.parse(player.getDynamicProperty("bwDuration:bountyOfForest"));
    let randomChance = Math.round(100*Math.random());
    
    if (randomChance <= bountyBuff.chance) {
      player.addEffect("absorption", 1.25*60*20, {
        showParticles: true,
        amplifier: 1
      });
      player.addEffect("rgeneration", 0.75*60*20, {
        showParticles: true
      });
    }
  }
});

// Add Quintessence to Mystic Circle
world.afterEvents.itemUse.subscribe(async (event) => {
  let item = event.itemStack;
  let player = event.source;
  
  if (item?.getDynamicProperty("bw:quintessence")) {
    let foundAltar = await detectMysticCircle(player, false);
    if (!foundAltar) {
      return;
    }
    
    let id = `mysticCircleAltar:${foundAltar.location.x}_${foundAltar.location.y}_${foundAltar.location.z}_${foundAltar.dimension}`;
    
    
    if (foundAltar.spellContents.verb != undefined) {
      let quintArray = [JSON.parse(item.getDynamicProperty("bw:quintessence"))];
      foundAltar.spellContents.verb.filters = quintArray;
      
      player.dimension.spawnParticle("bw:mystic_circle_add_filter", Vector3.add(foundAltar.location, new Vector3(0.5, 1.15, 0.5)));
      player.sendMessage(`§d[!]§r Quintessence has been added to the Mystic Circle, filtering ${foundAltar.spellContents.verb.verbName}.`);
      world.setDynamicProperty(id, JSON.stringify(foundAltar));
    }
  }
});