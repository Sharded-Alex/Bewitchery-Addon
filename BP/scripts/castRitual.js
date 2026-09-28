/* jshint maxerr: 10000 */
import {world, system, ItemStack, Entity, BlockPermutation, Dimension, EntityItemComponent, MolangVariableMap} from "@minecraft/server";
import {ActionFormData, ActionFormResponse, MessageFormData, ModalFormData} from "@minecraft/server-ui";
import { circles } from "./runicCircles";
import { correspondences } from "./correspondences.js";
import { ceremonies } from "./ritualData";
import { removeItem } from "./getTaglock.js";
import { lesserFae, medianFae, greaterFae, solarFaeArray, lunarFaeArray, twilightFaeArray, convertFaeName } from "./lesserFaerie.js";
import { diceRoll, validCandles } from "./occultMagick.js";
import { getPresentFamiliarPowers } from "./familiars.js";
import { useItem } from "./blockComp.js";
import {Vector3} from "./VectorMath/index.js";

// Familiar Ritual Binds
// Create Sprite
export function createSprigganSprite(dim, pos, blood, targetId) {
  let sprigganSprite = {
    "tamingItems": [],
    "orbos": 1000,
    "location": pos,
    "dimension": dim.id,
    "target": targetId,
    "sprigganType": blood.type,
    "eatingTime": 5,
    "quellChance": 0,
    "isQuelled": false,
    "lifeTime": 180, // in seconds
    "shotInterval": 3,
    "shotTime": 1
  }
  if (dim.isChunkLoaded(pos)) {
    let entity = dim.spawnEntity(blood.type, pos);
    
    let tame = entity.getComponent("minecraft:tameable");
    if (tame) {
      tame.getTameItems.forEach((t) => {
        sprigganSprite.tamingItems.push(t.typeId);
      })
      sprigganSprite.quellChance = tame.probability;
    }
    
    world.setDynamicProperty(`sprigganSprite:${Math.floor(pos.x)}_${Math.floor(pos.y)}_${Math.floor(pos.z)}_${dim.id}`, JSON.stringify(sprigganSprite));
    
    entity.remove();
  }
}

export const candlePos = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
  [1, 1],
  [-1, 1],
  [-1, -1],
  [1, -1]
];

function vfxSleep(time, soundName = undefined, soundValue = undefined, block = undefined) {
  return new Promise(function (resolve) {
    let lifeCheck = system.runInterval(() => {
      if (soundName != undefined) {
        block.dimension.playSound(soundName, block.location, soundValue);
      }
    }, 20);
    system.runTimeout(()=>{
      resolve(system.clearRun(lifeCheck));
    }, Math.round(time*20));
  });
  
  return new Promise(resolve => system.runTimeout(resolve, Math.round(time*20)));
}

export function detectCandles(block) {
  let candles = {
    "wax_candle": 0,
    "green_candle": 0,
    "lime_candle": 0,
    "yellow_candle": 0,
    "orange_candle": 0,
    "white_candle": 0,
    "red_candle": 0,
    "blue_candle": 0,
    "light_blue_candle": 0,
    "purple_candle": 0,
    "magenta_candle": 0
  };
  for (let pos of candlePos) {
    let candleBlock = block.dimension.getBlock({x: block.location.x + pos[0], y: block.location.y, z: block.location.z + pos[1]});
    if (candleBlock != undefined && candleBlock.typeId == "minecraft:candle" && candleBlock.permutation.getState("lit") == true) {
      candles.wax_candle += 1;
    }
    if (candleBlock != undefined && candleBlock.typeId == "minecraft:green_candle" && candleBlock.permutation.getState("lit") == true) {
      candles.green_candle += 1;
    }
    if (candleBlock != undefined && candleBlock.typeId == "minecraft:lime_candle" && candleBlock.permutation.getState("lit") == true) {
      candles.lime_candle += 1;
    }
    if (candleBlock != undefined && candleBlock.typeId == "minecraft:yellow_candle" && candleBlock.permutation.getState("lit") == true) {
      candles.yellow_candle += 1;
    }
    if (candleBlock != undefined && candleBlock.typeId == "minecraft:orange_candle" && candleBlock.permutation.getState("lit") == true) {
      candles.orange_candle += 1;
    }
    if (candleBlock != undefined && candleBlock.typeId == "minecraft:white_candle" && candleBlock.permutation.getState("lit") == true) {
      candles.white_candle += 1;
    }
    if (candleBlock != undefined && candleBlock.typeId == "minecraft:red_candle" && candleBlock.permutation.getState("lit") == true) {
      candles.red_candle += 1;
    }
    if (candleBlock != undefined && candleBlock.typeId == "minecraft:blue_candle" && candleBlock.permutation.getState("lit") == true) {
      candles.blue_candle += 1;
    }
    if (candleBlock != undefined && candleBlock.typeId == "minecraft:light_blue_candle" && candleBlock.permutation.getState("lit") == true) {
      candles.light_blue_candle += 1;
    }
    if (candleBlock != undefined && candleBlock.typeId == "minecraft:purple_candle" && candleBlock.permutation.getState("lit") == true) {
      candles.purple_candle += 1;
    }
    if (candleBlock != undefined && candleBlock.typeId == "minecraft:magenta_candle" && candleBlock.permutation.getState("lit") == true) {
      candles.magenta_candle += 1;
    }
  }
  return candles;
}

function containsObj(obj, list) {
  for (let i = 0; i < list.length; i++) {
    if (JSON.stringify(list[i]) === JSON.stringify(obj)) {
      return true;
    }
  }
  return false;
}

export function randomize(array) {
  const total = array.reduce((n, addData) => n + addData[0], 0);
  const pickValue = Math.random()*total;
  let weight = 0;
  for (let i = 0; i < array.length; i++) {
    weight += array[i][0];
    if (pickValue <= weight)
    return array[i][1];
  }
}

function candleInfluence(array, candles) {
  let newArray = array;
  for (let spirit of newArray) {
    if (spirit[1] == null) {
      continue;
    }
    
    if (spirit[1].court == "Solar") {
      spirit[0] += candles.orange_candle > 0 ? candles.orange_candle * 5 : 0; 
    }
    if (spirit[1].court == "Lunar") {
      spirit[0] += candles.white_candle > 0 ? candles.white_candle * 5 : 0;
    }
    if (spirit[1].court == "Twilight") {
      spirit[0] += candles.purple_candle > 0 ? candles.purple_candle * 5 : 0;
    }
    
    if (spirit[1].likedCandle == "lime") {
      spirit[0] += candles.lime_candle > 0 ? candles.lime_candle * 5 : 0;
    }
    if (spirit[1].likedCandle == "cyan") {
      spirit[0] += candles.cyan_candle > 0 ? candles.cyan_candle * 5 : 0;
    }
    if (spirit[1].likedCandle == "orange") {
      spirit[0] += candles.orange_candle > 0 ? candles.orange_candle * 5 : 0;
    }
    if (spirit[1].likedCandle == "light_blue") {
      spirit[0] += candles.light_blue_candle > 0 ? candles.light_blue_candle * 5 : 0;
    }
    if (spirit[1].likedCandle == "magenta") {
      spirit[0] += candles.magenta_candle > 0 ? candles.magenta_candle * 5 : 0;
    }
    if (spirit[1].likedCandle == "wax") {
      spirit[0] += candles.wax_candle > 0 ? candles.wax_candle * 5 : 0;
    }
    if (spirit[1].likedCandle == "red") {
      spirit[0] += candles.red_candle > 0 ? candles.red_candle * 5 : 0;
    }
  }
  
  return newArray;
}

export function applyHex(e, hex, duration, power, params, s) {
  let hexes = e.getDynamicProperty("bw:hexPool");
  if (hexes == undefined) {
    hexes = [];
  } else {
    hexes = JSON.parse(e.getDynamicProperty("bw:hexPool"));
  }
  
  if (!hexes.includes(hex)) {
    let hexInfo = {
      duration: duration,
      params: params,
      power: power,
      sender: s
    }
    
    e.setDynamicProperty(hex, JSON.stringify(hexInfo));
    hexes.push(hex);
  }
  
  e.setDynamicProperty("bw:hexPool", JSON.stringify(hexes))
}

export function cleanseTarget(entity, type, player, magnitude = 0) {
  // Malefic pools
  // {
  // Hexes
  let hexes = entity.getDynamicProperty("bw:hexPool");
  if (hexes == undefined) {
    hexes = [];
  } else {
    hexes = JSON.parse(entity.getDynamicProperty("bw:hexPool"));
  }
  
  // Curses
  let curses = entity.getDynamicProperty("bw:cursePool");
  if (curses == undefined) {
    curses = [];
  } else {
    curses = JSON.parse(entity.getDynamicProperty("bw:cursePool"));
  }
  // }
  
  /*
  if (entity.getDynamicProperty("bw:faeryGame") != undefined) {
    let game = JSON.parse(entity.getDynamicProperty("bw:faeryGame"));
    if (game.game == "tag") {
      if (luckRoll(game.unfairness)) {
        entity.sendMessage(`§c[!?]§r You feel Orbos rise and rise... until it drops right back down to nothing! §g${game.faery}§r has interrupted your Cleansing!`);
        return;
      }
    }
  }
  */
  
  let hexRelief = 0;
  let curseRelief = 0;
  
  let clearEffects = false;
  let removeHex = false;
  let reflectHex = false;
  // let identifyCurse = false;
  
  if (type == "lesser") {
    clearEffects = true;
    hexRelief = 40;
    removeHex = true;
  }
  if (type == "greater") {
    clearEffects = true;
    hexRelief = 80;
    removeHex = true;
    // identifyCurse = true;
  }
  if (type == "reflection") {
    reflectHex = true;
  }
  
  if (clearEffects) {
    entity.runCommand('effect @s clear');
  }
  
  if (removeHex) {
    if (magnitude > 0) {
      hexRelief = hexRelief + 10 * magnitude;
    }
    
    hexRelief = hexRelief/100;
    
    let newHexList = [];
    for (let hex of hexes) {
      let hexInfo = entity.getDynamicProperty(hex);
      
      if (hexInfo != undefined) {
        hexInfo = JSON.parse(hexInfo);
        if (hexInfo.power == null) {
          hexInfo.power = 0;
        }
        if (hexInfo.power <= magnitude + 1) {
          if (hexRelief >= 1 || Math.random() < hexRelief) {
            entity.setDynamicProperty(hex, undefined);
          } else {
            newHexList.push(hex);
          }
        } else {
          let diff = (hexInfo.power * 10)/100;
          hexRelief = Math.max(0, hexRelief - diff);
          
          if (hexRelief >= 1 || Math.random() < hexRelief) {
            entity.setDynamicProperty(hex, undefined);
          } else {
            newHexList.push(hex);
          }
        }
      }
    }
    entity.setDynamicProperty("bw:hexPool", JSON.stringify(newHexList));
  }
  
  if (reflectHex) {
    let reflectPower = magnitude + 1;
    
    let offline = 0;
    let seperateDimensions = 0;
    let tooPowerful = 0;
    
    let newHexList = [];
    for (let hex of hexes) {
      let hexInfo = entity.getDynamicProperty(hex);
      
      if (hexInfo != undefined) {
        hexInfo = JSON.parse(hexInfo);
        if (hexInfo.power == null) {
          hexInfo.power = 0
        }
        
        let sender = undefined;
        if (hexInfo.sender != player.id) {
          let existingSender = world.getEntity(hexInfo.sender);
          
          if (existingSender == undefined) {
            offline++;
            newHexList.push(hex);
            continue;
          } else {
            if (existingSender.dimension.id != player.dimension.id) {
              seperateDimensions++;
              newHexList.push(hex);
              continue;
            }
            sender = existingSender;
          }
        }
        
        if (sender != undefined) {
          if (hexInfo.power <= reflectPower) {
            applyHex(sender, hex, hexInfo.duration, hexInfo.power, hexInfo.params, player.id);
            entity.getDynamicProperty(hex, undefined);
          } else {
            tooPowerful++;
            newHexList.push(hex);
            continue;
          }
        }
      }
    }
    entity.setDynamicProperty("bw:hexPool", JSON.stringify(newHexList));
    
    if (offline > 0) {
      player.sendMessage(`§c[!]§r A few hexes (§c${offline}§r) have senders that are currently offline.`);
    }
    if (seperateDimensions > 0) {
      player.sendMessage(`§c[!]§r A few hexes (§c${seperateDimensions}§r) have senders that are not on the same plane of existence.`);
    }
    if (tooPowerful > 0) {
      player.sendMessage(`§c[!]§r A few hexes (§c${seperateDimensions}§r) are simply too powerful to be reflected by this ritual's level of ambience. More §epure§r ambience is required to match their power.`);
    }
  }
}

export function ritualHexTarget(entity, type, player, magnitude) {
  if (!entity?.isValid) {
    return;
  }
  
  let hexPool = [];
  if (entity.getDynamicProperty("bw:hexPool") == undefined) {
    entity.setDynamicProperty("bw:hexPool", "[]");
  } else {
    hexPool = JSON.parse(entity.getDynamicProperty("bw:hexPool"));
  }
  
  const trueType = "bwHex:"+type;
  if (type == "ocean_hold") {
    applyHex(entity, trueType, 8400, magnitude, {}, player.id);
    if (!hexPool.includes(trueType)) {
      hexPool.push(trueType);
    }
  }
  if (type == "hellish_attraction") {
    let hexObj = {
      "timeArray": [
        [25, 3],
        [25, 6],
        [50, 15]
      ]
    }
    hexObj.nextEvent = randomize(hexObj.timeArray);
    
    applyHex(entity, trueType, 8400, magnitude, hexObj, player.id);
    if (!hexPool.includes(trueType)) {
      hexPool.push(trueType);
    }
  }
  if (type == "copper_soul") {
    let hexObj = {
      "timeArray": [
        [25, 3],
        [25, 6],
        [50, 15]
      ]
    }
    hexObj.nextEvent = randomize(hexObj.timeArray);
    
    applyHex(entity, trueType, 8400, magnitude, hexObj, player.id);
    if (!hexPool.includes(trueType)) {
      hexPool.push(trueType);
    }
  }
  if (type == "enderman_hex") {
    let hexObj = {
      "timeArray": [
        [25, 10],
        [25, 15],
        [50, 30]
      ]
    }
    hexObj.nextEvent = randomize(hexObj.timeArray);
    
    applyHex(entity, trueType, 8400, magnitude, hexObj, player.id);
    if (!hexPool.includes(trueType)) {
      hexPool.push(trueType);
    }
  }
  if (type == "entombment") {
    let hexObj = {
      "timeArray": [
        [25, 10],
        [25, 15],
        [50, 30]
      ]
    }
    hexObj.nextEvent = randomize(hexObj.timeArray);
    
    applyHex(entity, trueType, 8400, magnitude, hexObj, player.id);
    if (!hexPool.includes(trueType)) {
      hexPool.push(trueType);
    }
  }
  if (type == "creeper_hex") {
    let hexObj = {};
    
    applyHex(entity, trueType, 8400, magnitude, hexObj, player.id);
    if (!hexPool.includes(trueType)) {
      hexPool.push(trueType);
    }
  }
  if (type == "death") {
    let shaveOffTime = magnitude * 1200;
    
    if (shaveOffTime > 7200) {
      shaveOffTime = 7200;
    }
    
    applyHex(entity, trueType, 8400 - shaveOffTime, magnitude, {}, player.id);
    if (!hexPool.includes(trueType)) {
      hexPool.push(trueType);
    }
  }
  
  if (type == "brittle_bones") {
    applyHex(entity, trueType, 8400, magnitude, {}, player.id);
    if (!hexPool.includes(trueType)) {
      hexPool.push(trueType);
    }
  }
  if (type == "insomnia") {
    applyHex(entity, trueType, 8400, magnitude, {}, player.id);
    if (!hexPool.includes(trueType)) {
      hexPool.push(trueType);
    }
  }
  if (type == "obliquity") {
    applyHex(entity, trueType, 8400, magnitude, {}, player.id);
    if (!hexPool.includes(trueType)) {
      hexPool.push(trueType);
    }
  }
  if (type == "sympathy") {
    applyHex(entity, trueType, 8400, magnitude, {}, player.id);
    if (!hexPool.includes(trueType)) {
      hexPool.push(trueType);
    }
  }
  if (type == "leadweight") {
    applyHex(entity, trueType, 8400, magnitude, {}, player.id);
    if (!hexPool.includes(trueType)) {
      hexPool.push(trueType);
    }
  }
  if (type == "ineptitude") {
    applyHex(entity, trueType, 8400, magnitude, {}, player.id);
    if (!hexPool.includes(trueType)) {
      hexPool.push(trueType);
    }
  }
  if (type == "instability") {
    applyHex(entity, trueType, 8400, magnitude, {}, player.id);
    if (!hexPool.includes(trueType)) {
      hexPool.push(trueType);
    }
  }
  if (type == "antimateriality") {
    applyHex(entity, trueType, 8400, magnitude, {}, player.id);
    if (!hexPool.includes(trueType)) {
      hexPool.push(trueType);
    }
  }
}

// FAE FUNCTIONS
export function hasFaery(player, faery) {
  let propertyName = `${player.id}:${faery.standing}(${faery.id})`;
  
  if (player?.getDynamicProperty(propertyName)) {
    return true;
  } else {
    return false;
  }
}
export function getFaery(player, faery) {
  let propertyName = `${player.id}:${faery.standing}(${faery.id})`;
  
  return JSON.parse(player.getDynamicProperty(propertyName));
}
export function getFaeries(player) {
  let arr = [];
  player.getDynamicPropertyIds().forEach((i) => {
    if (i.startsWith(`${player.id}:lesser`)) {
      arr.push(JSON.parse(player.getDynamicProperty(i)));
    }
    if (i.startsWith(`${player.id}:median`)) {
      arr.push(JSON.parse(player.getDynamicProperty(i)));
    }
    if (i.startsWith(`${player.id}:greater`)) {
      arr.push(JSON.parse(player.getDynamicProperty(i)));
    }
  });
  
  return arr;
}
export function greaterOpposition(player, rival) {
  let isTrue = false;
  for (let f of getFaeries(player)) {
    if (f.rank == "greater") {
      let info = greaterFae[f.id];
      for (let r of info.relations) {
        if (r.faeryId == rival && r.relation == "despised") {
          if (!hasFaery(r.mediator)) {
            isTrue = false;
            break;
          }
        }
      }
    }
  }
  
  return isTrue;
}
export function findFaery(faerieId) {
  let fae;
  if (lesserFae[faerieId] != undefined) {
    fae = lesserFae[faerieId];
  } else
  if (medianFae[faerieId] != undefined) {
    fae = medianFae[faerieId];
  } else
  if (greaterFae[faerieId] != undefined) {
    fae = greaterFae[faerieId];
  }
  
  return fae;
}
export function addFaeryTrust(player, faery, amt) {
  let propertyName = `${player.id}:${faery.standing}(${faery.id})`;
  
  if (player.getDynamicProperty(propertyName)) {
    let fae = JSON.parse(player.getDynamicProperty(propertyName));
    let trustValue = Number((fae.trust + amt).toFixed(1));
    
    
    if (trustValue > 100.0) {
      trustValue = 100.0;
    } else 
    if (trustValue < -100.0) {
      trustValue = -100.0;
    }
    
    if (isNaN(trustValue)) {
      console.warn(trustValue+" WTF?")
      trustValue = 0;
    }
    fae.trust = trustValue;
    player.setDynamicProperty(propertyName, JSON.stringify(fae));
  }
}
export function updateOfferedFaerie(player, faery, dayOffered, offeredItem) {
  let propertyName = `${player.id}:${faery.standing}(${faery.id})`;
  
  if (player.getDynamicProperty(propertyName)) {
    let fae = JSON.parse(player.getDynamicProperty(propertyName));
    fae.lastOffer = offeredItem;
    fae.lastOffering = dayOffered;
    player.setDynamicProperty(propertyName, JSON.stringify(fae));
  }
}

export function getFaeFamily(player) {
  let familyTree = {
    total: 0,
    lessers: 0,
    medians: 0,
    greaters: 0
  };
  player.getDynamicPropertyIds().forEach((i) => {
    if (i.startsWith(`${player.id}:lesser`)) {
      familyTree.lessers = familyTree.lessers + 1;
    }
    if (i.startsWith(`${player.id}:median`)) {
      familyTree.medians = familyTree.medians + 1;
    }
    if (i.startsWith(`${player.id}:greater`)) {
      familyTree.greaters = familyTree.greaters + 1;
    }
  });
  familyTree.total = familyTree.lessers + familyTree.medians + familyTree.greaters;
  
  return familyTree;
}
export function addFaery(player, faery, command = false) {
  let propertyName = `${player.id}:${faery.standing}(${faery.id})`;
  // "{ID NUMBER}:lesser(genis)";
  // "{ID NUMBER}:median(dryas)";
  // "{ID NUMBER}:greater(titania)";
  // Object that stores the following:
  // => Fae Trust
  // => Last Time Offered (Date)
  // => Last Offering
  // |---------------------|
  // |--[ Lesser Only ]--|
  // - Fae True Name
  
  let faeryObj = {
    "id": faery.id,
    "rank": faery.standing,
    "trust": faery.baseInterest,
    "lastOffer": "",
    "lastOffering": ""
  }
  
  if (faery.standing == "lesser") {
    if (player.getDynamicProperty(propertyName)) {
      return player.sendMessage("§d[!]§r A Lesser Faerie of this kind is already apart of your Family.");
    }
    
    let faeFamily = getFaeFamily(player);
    if (command || faeFamily.lessers < 5) {
      player.setDynamicProperty(propertyName, JSON.stringify(faeryObj));
      player.sendMessage(faery.responses.chosen);
    } else {
      return player.sendMessage("§c[!]§r You cannot take on any more Lesser Faerie.");
    }
  }
  if (faery.standing == "median") {
    if (player.getDynamicProperty(propertyName)) {
      return player.sendMessage("§d[!]§r This Faerie is already a part of your Family.");
    }
    
    player.setDynamicProperty(propertyName, JSON.stringify(faeryObj));
  }
  if (faery.standing == "greater") {
    if (player.getDynamicProperty(propertyName)) {
      return player.sendMessage("§d[!]§r This Faerie is already a Patron of your Family.");
    }
    
    if (command || faeFamily.lessers < 3) {
      player.setDynamicProperty(propertyName, JSON.stringify(faeryObj));
    } else {
      return player.sendMessage("§c[!]§r You are already influenced by too many Greater Faeries.");
    }
  }
}
export function removeFaery(player, faery) {
  // Remove Faerie Influence
  let propertyName = `${player.id}:${faery.standing}(${faery.id})`;
  
  player.setDynamicProperty(propertyName, undefined);
}


export function greaterFaePunishment(player, faery) {
  let punishments = [];
  
  for (let f of Object.values(lesserFae)) {
    if (f.minorCourt == faery.name) {
      let punish = f.responses?.displeased?.consequence;
      if (punish != undefined) {
        if (punish.length == 1) {
          punishments.push(punish[0][1]);
        } else 
        if (punish.length > 1) {
          for (let p = 0; p < punish.length; p++) {
            if (p < punish.length-1) {
              punishments.push(punish[p][1]);
            }
          }
        }
      }
    } else {
      continue;
    }
  }
  
  for (let f of Object.values(medianFae)) {
    if (f.minorCourt == faery.name) {
      if (f.punishments) {
        for (let p of f.punishments) {
          punishments.push(p);
        }
      }
    } else {
      continue;
    }
  }
  
  punishments[Math.floor((punishments.length*Math.random()))](player);
}

export function* detectBlockInArea(blocks, area, location, dimension) {
  for (let x = location.x; x < location.x + area.x; x++) {
    for (let y = location.y; y > location.y - area.y; y--) {
      for (let z = location.z; z < location.z + area.z; z++) {
        let currentBlock = dimension.getBlock({x: x, y: y, z: z});
        for (let blockInfo of blocks) {
          if (currentBlock != undefined && blockInfo.block == currentBlock.typeId) {
            let particle = new MolangVariableMap();
            particle.setColorRGB('variable.color', {red: blockInfo.rgba.r, green: blockInfo.rgba.g, blue: blockInfo.rgba.b, alpha: blockInfo.rgba.a});
            dimension.spawnParticle("bw:oreParticle", {x: x, y: location.y, z: z}, particle);
            yield;
          }
        }
      }
    }
  }
}

// {
const weather = {
  "clear": "Clear",
  "rainy": "Rain",
  "thunderstorm": "Thunder"
}
export function checkWeatherAlignment(witch, array) {
  if (array.includes(world.getDynamicProperty("bw:weather"))) {
    return true;
  } else {
    return false;
  }
}
export function gatherWeatherAlignment(witch, obj) {
  let endValue = 0;
  for (let [key, value] of Object.keys(obj)) {
    if (witch.dimension.id == "minecraft:overworld") {
      if (world.getDynamicProperty("bw:weather") == key) {
        endValue += value;
      }
    } else {
      if (key == "clear") {
        endValue += value;
      }
    }
  }
  return endValue;
}
export function getWeatherAlignment(witch) {
  let dimension = witch.dimension;
  if (dimension == undefined) {
    dimension = witch;
  }
  for (let [key, value] of Object.entries(weather)) {
    if (dimension.id == "minecraft:overworld" && world.getDynamicProperty("bw:weather") == value) {
      return key;
    } else {
      return "clear";
    }
  }
}

const moonPhases = {
  "full_moon": 0,
  "waning_gibbous": 1,
  "first_quarter": 2,
  "waning_crescent": 3,
  "new_moon": 4,
  "waxing_crescent": 5,
  "last_quarter": 6,
  "waxing_gibbous": 7
}
export function checkPhaseAlignment(witch, array) {
  let bool = false;
  for (let phase of array) {
    if (world.getMoonPhase() == moonPhases[phase]) {
      bool = true;
    }
  }
  return bool;
}
export function gatherPhaseAlignment(witch, obj) {
  let endValue = 0;
  for (let [key, value] of Object.keys(obj)) {
    if (world.getMoonPhase() == moonPhases[key]) {
      endValue += value;
    }
  }
  return endValue;
}
export function getPhaseAlignment() {
  for (let [key, value] of Object.entries(moonPhases)) {
    if (world.getMoonPhase() == value) {
      return key;
    }
  }
}

const timeOfDay = {
  "dawn": [
    {
      addDay: {},
      min: 23000,
      max: 23999
    },
    {
      min: 0,
      max: 999
    }
  ],
  "day": [
    {
      min: 1000,
      max: 10999
    }
  ],
  "dusk": [
    {
      min: 11000,
      max: 12999
    }
  ],
  "night": [
    {
      min: 13000,
      max: 22999
    }
  ] 
}
export function checkTimeAlignment(witch, array) {
  let bool = false;
  
  if (witch.dimension.id == "minecraft:overworld") {
    for (let time of array) {
      for (let foundTime of timeOfDay[time]) {
        if (foundTime.min <= world.getTimeOfDay() && foundTime.max >= world.getTimeOfDay()) {
          bool = true;
        }
      }
    }
  }
  if (array.includes("undeterminable")) {
    bool = true;
  }
  return bool;
}
export function gatherTimeAlignment(witch, obj) {
  let endValue = 0;
  
  if (witch.dimension.id == "minecraft:overworld") {
    for (let key of Object.keys(obj)) {
      for (let foundTime of timeOfDay[key]) {
        if (foundTime.min <= world.getTimeOfDay() && foundTime.max >= world.getTimeOfDay()) {
          endValue += obj[key];
        }
      }
    }
  }
  
  if (obj.undeterminable != undefined) {
    endValue += obj.undeterminable;
  }
  
  return endValue;
}
export function getTimeAlignment(witch) {
  let dimension = witch.dimension;
  if (dimension == undefined) {
    dimension = witch;
  }
  if (dimension.id == "minecraft:overworld") {
    for (let [key, value] of Object.entries(timeOfDay)) {
      for (let foundTime of value) {
        if (foundTime.min <= world.getTimeOfDay() && foundTime.max >= world.getTimeOfDay()) {
          return key;
        }
      }
    }
  } else {
    return "undeterminable"
  }
  
}

let altitudes = {
  "minecraft:overworld": {
    "upper_realm": {
      "min": 126
    },
    "mid_realm": {
      "min": 62,
      "max": 125
    },
    "lower_realm": {
      "max": 61
    }
  }
}
export function checkAltitudeAlignment(witch, array) {
  let bool = false;
  
  if (altitudes[witch?.dimension?.id]) {
    let dim = altitudes[witch?.dimension?.id];
    let y = Math.floor(witch.location.y);
    for (let [k, v] of Object.entries(dim)) {
      let c = 0;
      if (dim[k].min == undefined || dim[k].min <= y) {
        c = c + 1;
      }
      if (dim[k].max == undefined || dim[k].max >= y) {
        c = c + 1;
      }
      if (c == 2) {
        bool = true;
      }
    }
  }
  
  if (array.includes("strange")) {
    bool = true;
  }
  return bool;
}
export function getAltitudeAlignment(dimension, location) {
  if (altitudes[dimension.id]) {
    let dim = altitudes[dimension.id];
    let y = Math.floor(location.y);
    for (let [k, v] of Object.entries(dim)) {
      let c = 0;
      if (dim[k].min == undefined || dim[k].min <= y) {
        c = c + 1;
      }
      if (dim[k].max == undefined || dim[k].max >= y) {
        c = c + 1;
      }
      if (c == 2) {
        return k;
      }
    }
  }
  
  return "strange";
}
// }

export async function useCorrespondence(witch, spellBit) {
  let temporalValue = correspondences.temporal[getTimeAlignment(witch)];
  let atmosphericValue = correspondences.atmospheric[getWeatherAlignment(witch)];
  let lunarValue = correspondences.lunar[getPhaseAlignment()];
  
  if (temporalValue != undefined && temporalValue[spellBit.type]) {
    temporalValue = temporalValue[spellBit.type];
    if (temporalValue != undefined) {
      for (let [key, value] of Object.entries(temporalValue)) {
        if (typeof value === "object") {
          if (spellBit[key] == undefined) {
            continue;
          }
          let loopTracker = value;
          for (let [i, e] of Object.entries(loopTracker)) {
            if (!Array.isArray(spellBit[key])) {
              if (typeof e == "string") {
                let sign = e[0];
                let original = e;
                e = Number(e.slice(1));
                switch (sign) {
                  case "+" : {
                    if (spellBit[key][i] != undefined) {
                      spellBit[key][i] = spellBit[key][i]+e;
                    }
                    break;
                  }
                  case "-" : {
                    if (spellBit[key][i] != undefined) {
                      spellBit[key][i] = spellBit[key][i]-e;
                    }
                    break;
                  }
                  case "/" : {
                    if (spellBit[key][i] != undefined) {
                      spellBit[key][i] = spellBit[key][i]/e;
                    }
                    break;
                  }
                  case "*" : {
                    if (spellBit[key][i] != undefined) {
                      spellBit[key][i] = spellBit[key][i]*e;
                    }
                    break;
                  }
                  default: {
                    spellBit[key][i] = original;
                    break;
                  }
                }
                if (typeof spellBit[key][i] == "number") {
                  if (spellBit[key][i] < 0) {
                    spellBit[key][i] = 0;
                  }
                  spellBit[key][i] = Math.floor(spellBit[key][i]);
                }
              }
            } else {
              for (let aVal = 0; aVal < spellBit[key].length; aVal++) {
                if (typeof e == "string") {
                  let sign = e[0];
                  let original = e;
                  e = Number(e.slice(1));
                  switch (sign) {
                    case "+" : {
                      if (spellBit[key][aVal][i] != undefined) {
                        spellBit[key][aVal][i] = spellBit[key][aVal][i]+e;
                      }
                      break;
                    }
                    case "-" : {
                      if (spellBit[key][aVal][i] != undefined) {
                        spellBit[key][aVal][i] = spellBit[key][aVal][i]-e;
                      }
                      break;
                    }
                    case "/" : {
                      if (spellBit[key][aVal][i] != undefined) {
                        spellBit[key][aVal][i] = spellBit[key][aVal][i]/e;
                      }
                      break;
                    }
                    case "*" : {
                      if (spellBit[key][aVal][i] != undefined) {
                        spellBit[key][aVal][i] = spellBit[key][aVal][i]*e;
                      }
                      break;
                    }
                    default: {
                      spellBit[key][aVal][i] = original;
                      break;
                    }
                  }
                  if (typeof spellBit[key][aVal][i] == "number") {
                    if (spellBit[key][aVal][i] < 0) {
                      spellBit[key][aVal][i] = 0;
                    }
                    spellBit[key][aVal][i] = Math.floor(spellBit[key][aVal][i]);
                  }
                }
                
              }
            }
          }
        } else {
          if (typeof value == "string") {
            let sign = value[0];
            let original = value;
            value = Number(value.slice(1));
            switch (sign) {
              case "+" : {
                if (spellBit[key] != undefined) {
                  spellBit[key] = spellBit[key]+value;
                }
                break;
              }
              case "-" : {
                if (spellBit[key] != undefined) {
                  spellBit[key] = spellBit[key]-value;
                }
                break;
              }
              case "/" : {
                if (spellBit[key] != undefined) {
                  spellBit[key] = spellBit[key]/value;
                }
                break;
              }
              case "*" : {
                if (spellBit[key] != undefined) {
                  spellBit[key] = spellBit[key]*value;
                }
                break;
              }
              default : {
                spellBit[key] = original;
                break;
              }
            }
            if (typeof spellBit[key] == "number") {
              if (spellBit[key] < 0) {
                spellBit[key] = 0;
              }
              spellBit[key] = Math.floor(spellBit[key]);
            }
          }
        }
      }
    }
  }
  if (atmosphericValue != undefined) {
    atmosphericValue = atmosphericValue[spellBit.type];
    if (atmosphericValue != undefined) {
      for (let [key, value] of Object.entries(atmosphericValue)) {
        if (typeof value === "object") {
          if (spellBit[key] == undefined) {
            continue;
          }
          let loopTracker = value;
          for (let [i, e] of Object.entries(loopTracker)) {
            if (!Array.isArray(spellBit[key])) {
              if (typeof e == "string") {
                let sign = e[0];
                let original = e;
                e = Number(e.slice(1));
                switch (sign) {
                  case "+" : {
                    if (spellBit[key][i] != undefined) {
                      spellBit[key][i] = spellBit[key][i]+e;
                    }
                    break;
                  }
                  case "-" : {
                    if (spellBit[key][i] != undefined) {
                      spellBit[key][i] = spellBit[key][i]-e;
                    }
                    break;
                  }
                  case "/" : {
                    if (spellBit[key][i] != undefined) {
                      spellBit[key][i] = spellBit[key][i]/e;
                    }
                    break;
                  }
                  case "*" : {
                    if (spellBit[key][i] != undefined) {
                      spellBit[key][i] = spellBit[key][i]*e;
                    }
                    break;
                  }
                  default: {
                    spellBit[key][i] = original;
                    break;
                  }
                }
                if (typeof spellBit[key][i] == "number") {
                  if (spellBit[key][i] < 0) {
                    spellBit[key][i] = 0;
                  }
                  spellBit[key][i] = Math.floor(spellBit[key][i]);
                }
              }
            } else {
              for (let aVal = 0; aVal < spellBit[key].length; aVal++) {
                if (typeof e == "string") {
                  let sign = e[0];
                  let original = e;
                  e = Number(e.slice(1));
                  switch (sign) {
                    case "+" : {
                      if (spellBit[key][aVal][i] != undefined) {
                        spellBit[key][aVal][i] = spellBit[key][aVal][i]+e;
                      }
                      break;
                    }
                    case "-" : {
                      if (spellBit[key][aVal][i] != undefined) {
                        spellBit[key][aVal][i] = spellBit[key][aVal][i]-e;
                      }
                      break;
                    }
                    case "/" : {
                      if (spellBit[key][aVal][i] != undefined) {
                        spellBit[key][aVal][i] = spellBit[key][aVal][i]/e;
                      }
                      break;
                    }
                    case "*" : {
                      if (spellBit[key][aVal][i] != undefined) {
                        spellBit[key][aVal][i] = spellBit[key][aVal][i]*e;
                      }
                      break;
                    }
                    default: {
                      spellBit[key][aVal][i] = original;
                      break;
                    }
                  }
                  if (typeof spellBit[key][aVal][i] == "number") {
                    if (spellBit[key][aVal][i] < 0) {
                      spellBit[key][aVal][i] = 0;
                    }
                    spellBit[key][aVal][i] = Math.floor(spellBit[key][aVal][i]);
                  }
                }
                
              }
            }
          }
        } else {
          if (typeof value == "string") {
            let sign = value[0];
            let original = value;
            value = Number(value.slice(1));
            switch (sign) {
              case "+" : {
                if (spellBit[key] != undefined) {
                  spellBit[key] = spellBit[key]+value;
                }
                break;
              }
              case "-" : {
                if (spellBit[key] != undefined) {
                  spellBit[key] = spellBit[key]-value;
                }
                break;
              }
              case "/" : {
                if (spellBit[key] != undefined) {
                  spellBit[key] = spellBit[key]/value;
                }
                break;
              }
              case "*" : {
                if (spellBit[key] != undefined) {
                  spellBit[key] = spellBit[key]*value;
                }
                break;
              }
              default : {
                spellBit[key] = original;
                break;
              }
            }
            if (typeof spellBit[key] == "number") {
              if (spellBit[key] < 0) {
                spellBit[key] = 0;
              }
              spellBit[key] = Math.floor(spellBit[key]);
            }
          }
        }
      }
    }
  }
  if (lunarValue != undefined) {
    lunarValue = lunarValue[spellBit.type];
    if (lunarValue != undefined) {
      for (let [key, value] of Object.entries(lunarValue)) {
        if (typeof value === "object") {
          if (spellBit[key] == undefined) {
            continue;
          }
          let loopTracker = value;
          for (let [i, e] of Object.entries(loopTracker)) {
            if (!Array.isArray(spellBit[key])) {
              if (typeof e == "string") {
                let sign = e[0];
                let original = e;
                e = Number(e.slice(1));
                switch (sign) {
                  case "+" : {
                    if (spellBit[key][i] != undefined) {
                      spellBit[key][i] = spellBit[key][i]+e;
                    }
                    break;
                  }
                  case "-" : {
                    if (spellBit[key][i] != undefined) {
                      spellBit[key][i] = spellBit[key][i]-e;
                    }
                    break;
                  }
                  case "/" : {
                    if (spellBit[key][i] != undefined) {
                      spellBit[key][i] = spellBit[key][i]/e;
                    }
                    break;
                  }
                  case "*" : {
                    if (spellBit[key][i] != undefined) {
                      spellBit[key][i] = spellBit[key][i]*e;
                    }
                    break;
                  }
                  default: {
                    spellBit[key][i] = original;
                    break;
                  }
                }
                if (typeof spellBit[key][i] == "number") {
                  if (spellBit[key][i] < 0) {
                    spellBit[key][i] = 0;
                  }
                  spellBit[key][i] = Math.floor(spellBit[key][i]);
                }
              }
            } else {
              for (let aVal = 0; aVal < spellBit[key].length; aVal++) {
                if (typeof e == "string") {
                  let sign = e[0];
                  let original = e;
                  e = Number(e.slice(1));
                  switch (sign) {
                    case "+" : {
                      if (spellBit[key][aVal][i] != undefined) {
                        spellBit[key][aVal][i] = spellBit[key][aVal][i]+e;
                      }
                      break;
                    }
                    case "-" : {
                      if (spellBit[key][aVal][i] != undefined) {
                        spellBit[key][aVal][i] = spellBit[key][aVal][i]-e;
                      }
                      break;
                    }
                    case "/" : {
                      if (spellBit[key][aVal][i] != undefined) {
                        spellBit[key][aVal][i] = spellBit[key][aVal][i]/e;
                      }
                      break;
                    }
                    case "*" : {
                      if (spellBit[key][aVal][i] != undefined) {
                        spellBit[key][aVal][i] = spellBit[key][aVal][i]*e;
                      }
                      break;
                    }
                    default: {
                      spellBit[key][aVal][i] = original;
                      break;
                    }
                  }
                  if (typeof spellBit[key][aVal][i] == "number") {
                    if (spellBit[key][aVal][i] < 0) {
                      spellBit[key][aVal][i] = 0;
                    }
                    spellBit[key][aVal][i] = Math.floor(spellBit[key][aVal][i]);
                  }
                }
                
              }
            }
          }
        } else {
          if (typeof value == "string") {
            let sign = value[0];
            let original = value;
            value = Number(value.slice(1));
            switch (sign) {
              case "+" : {
                if (spellBit[key] != undefined) {
                  spellBit[key] = spellBit[key]+value;
                }
                break;
              }
              case "-" : {
                if (spellBit[key] != undefined) {
                  spellBit[key] = spellBit[key]-value;
                }
                break;
              }
              case "/" : {
                if (spellBit[key] != undefined) {
                  spellBit[key] = spellBit[key]/value;
                }
                break;
              }
              case "*" : {
                if (spellBit[key] != undefined) {
                  spellBit[key] = spellBit[key]*value;
                }
                break;
              }
              default : {
                spellBit[key] = original;
                break;
              }
            }
            if (typeof spellBit[key] == "number") {
              if (spellBit[key] < 0) {
                spellBit[key] = 0;
              }
              spellBit[key] = Math.floor(spellBit[key]);
            }
          }
        }
      }
    }
  }
  return spellBit;
}

/*
export function checkRituals(items, block, location, player) {
  let playerItem = player.getComponent("inventory").container.getItem(player.selectedSlotIndex);
  let validSet = false;
  let validCircle = true;
  let circleType = null;
  let mundaneFriendly = false;
  let effects = null;
  let anyItemFound = undefined;
  let rItems = [];
  let properties = {};
  let names = {};
  let usedScroll = false;
  
  for (let ceremony of ceremonies) {
    if (ceremony.itemArray.length == items.length) {
      let requirements = ceremony.itemArray;
      let itemsOffered = [];
      // Check for each item in order, including any indication that a ritual might have multiple options (by string stated names, by object stated tags, by object stated components) for certain items.
      for (let r = 0; r < requirements.length; r++) {
        let reagentItem = requirements[r];
        for (let i of items) {
          // Check if this reagent can be substituted (It's an array).
          if (Array.isArray(reagentItem)) {
            // If this array directly includes the item name, it can just be added to the final array.
            if (reagentItem.includes(i.typeId)) {
              itemsOffered.push(i.typeId);
            } else {
              // If not, then check if there are properties that can validate this item.
              for (let obj of reagentItem) {
                if (typeof obj == "object") {
                  let component = obj.componentType;
                  let tag = obj.tag;
                  if (component != undefined) {
                    if (i.getComponent(component)) {
                      itemsOffered.push(i.typeId);
                      properties[obj.id] = i;
                      continue;
                    }
                  }
                  if (tag != undefined) {
                    if (i.hasTag(tag)) {
                      itemsOffered.push(i.typeId);
                      properties[obj.id] = i;
                      continue;
                    }
                  }
                }
              }
            }
          } else {
            if (reagentItem == i.typeId) {
              itemsOffered.push(i.typeId);
            } else
            if (requirements.includes("ANY") && !requirements.includes(i.typeId)) {
              anyItemFound = i;
            }
          }
        }
      }
      
      if (requirements.length == itemsOffered.length || (requirements.includes("ANY") && requirements.length == itemsOffered.length+1)) {
        validSet = true;
        circleType = ceremony.validCircle;
        effects = ceremony;
        
        let ritualItems = block.dimension.getEntities({location: block.location, maxDistance: 3, type: "minecraft:item"});
        for (let i = 0; i < items.length; i++) {
          if (ritualItems[i].getComponent("item").itemStack.typeId == items[i].typeId) {
            if (ceremony.specialProperties != undefined) {
              if (Object.keys(ceremony.specialProperties).includes(items[i].typeId)) {
                let specialProp = ceremony.specialProperties[items[i].typeId];
                
                if (ritualItems[i].getComponent("item").itemStack.maxAmount > 1) {
                  names[items[i].typeId] = ritualItems[i].getComponent("item").itemStack.nameTag;
                } else {
                  properties[items[i].typeId] = ritualItems[i].getComponent("item").itemStack.getDynamicProperty(specialProp);
                  names[items[i].typeId] = ritualItems[i].getComponent("item").itemStack.nameTag;
                }
              }
            }
            
            if (ceremony.keptItems != undefined) {
              if (!ceremony.keptItems.includes(ritualItems[i].getComponent("item").itemStack.typeId)) {
                rItems.push(ritualItems[i]);
              }
            }
            if (ceremony.keptItems == undefined) {
              rItems.push(ritualItems[i]);
            }
            if (anyItemFound != undefined) {
              properties.itemFound = anyItemFound
            }
          }
        }
      }
    }
    if (validSet && circleType != null) {
      // Checks if uninitiated friendly
      if (ceremony.traineeFriendly == true) {
        mundaneFriendly = true;
      }
      if (playerItem.typeId != "bw:ritual_scroll") {
        for (let circle of circles) {
          if (circle.circleName == circleType) {
            circleLoop: for (let slate of circle.slatePositions) {
              if (!block.dimension.getBlock({x:location.x + slate.x, y:location.y, z:location.z + slate.z}).hasTag("bw:white_slate")) {
                
                if (!hasFaery(player.getDynamicProperty("bw:patrons"), player.getDynamicProperty(`bw:hebaya`))) {
                  validCircle = false;
                  break circleLoop;
                } else {
                  let hebbyCandle = block.dimension.getBlock({x:location.x + slate.x, y:location.x, z:location.z + slate.z});
                  if (!validCandles.includes(hebbyCandle.typeId) || !hebbyCandle.permutation.getState("lit")) {
                    validCircle = false;
                    break circleLoop;
                  }
                }
              }
            }
          }
        }
      } else {
        validCircle = true;
        usedScroll = true;
        break;
      }
    }
  }
  if (!mundaneFriendly) {
    if (!player.hasTag("bw:witch_initiate")) {
      player.sendMessage(`§c[!]§r You do not hold the authority necessary to perform this rite.`)
      return;
    }
  }
  if (!validCircle) {
    player.sendMessage("§c[!]§r Something is wrong with the formation used for this Rite.")
    return;
  }
  if (validCircle && effects != null) {
    // Check if alignment is correct;
    if (effects.requirements != undefined) {
      if (effects.requirements.weather != undefined) {
        if (!checkWeatherAlignment(player, effects.requirements.weather)) {
          player.sendMessage("§c[!]§r The weather is not suitable for this kind of working.")
          return;
        }
      }
      if (effects.requirements.moonPhase != undefined) {
        if (!checkPhaseAlignment(player, effects.requirements.moonPhase)) {
          player.sendMessage("§c[!]§r The Phase of the Moon is not suitable for this kind of working.")
          return;
        }
      }
      if (effects.requirements.timeOfDay != undefined) {
        if (!checkTimeAlignment(player, effects.requirements.timeOfDay)) {
          player.sendMessage("§c[!]§r The Time of Day is not suitable for this kind of working.")
          return;
        }
        
      }
    }
    
    
    player.sendMessage(`Casting the ritual: ${effects.id}`);
    for (let item of rItems) {
      world.getDimension(item.dimension.id).spawnParticle("rituals:smokeDisappear", item.location);
      let newItem = item.getComponent("minecraft:item").itemStack;
      if (newItem.amount > 1) {
        newItem.amount--;
      } else {
        newItem = undefined;
      }
      if (newItem != undefined) {
        world.getDimension(item.dimension.id).spawnItem(newItem, item.location);
      }
      item.kill();
    }
  }
  if (usedScroll) {
    removeItem(player.getComponent("inventory").container, "bw:ritual_scroll");
  }
  return [effects, names, properties];
}
*/

// Takes (items, block, wand)
export function checkRituals(items, block, wand, faerieInfluence = []) {
  if (wand == undefined) {
    return null;
  }
  
  let location = block.location;
  let chosenCeremony = null;
  let chosenCeremonyPattern = null;
  let chosenCeremonyIndex = null;
  let correctCirclePresent = false;
  let ceremonyInfo = {
    names: {},
    properties: {}
  }
  
  // Loop through all ceremonies
  // Break if a match is found
  cereLoop: for (let c = 0; c < ceremonies.length; c++) {
    let ceremony = ceremonies[c];
    // Get all items with an inventory
    // Pull all items from them and put in array (bundles are ignored)
    // All items without an inventory are added anyway.
    let requirements = ceremony.itemArray;
    let itemArray = [];
    for (let nItem of items) {
      let itemInv = nItem.getComponent("minecraft:inventory");
      
      if (itemInv == undefined) {
        itemArray.push(nItem);
      } else {
        itemInv = itemInv.container;
        for (let i = 0; i < itemInv.size; i++) {
          let gItem = itemInv.getItem(i);
          if (gItem != undefined) {
            itemArray.push(gItem);
          }
        }
      }
    }
    
    let properties = {};
    let names = {};
    let anyItem;
    
    // A sum of all met requirements
    let allChecks = 0;
    
    // Check for each item in order, including any indication that a ritual might have multiple options (by string stated names, by object stated tags, by object stated components) for certain items.
    for (let r = 0; r < requirements.length; r++) {
      let reagentItem = requirements[r];
      for (let i of itemArray) {
        // Check if this reagent can be substituted (It's an array).
        if (Array.isArray(reagentItem)) {
          // If this array directly includes the item name, it can just be added to the final array.
          if (reagentItem.includes(i.typeId)) {
            allChecks = allChecks + 1;
          } else {
            // If not, then check if there are properties that can validate this item.
            for (let obj of reagentItem) {
              if (typeof obj == "object") {
                let component = obj.componentType;
                let tag = obj.tag;
                if (component != undefined) {
                  if (i.getComponent(component)) {
                    allChecks = allChecks + 1;
                    properties[obj.id] = i;
                    continue;
                  }
                }
                if (tag != undefined) {
                  if (i.hasTag(tag)) {
                    allChecks = allChecks + 1;
                    properties[obj.id] = i;
                    continue;
                  }
                }
              }
            }
          }
        } else {
          if (reagentItem == i.typeId) {
            allChecks = allChecks + 1;
          } else
          if (requirements.includes("ANY") && !requirements.includes(i.typeId)) {
            anyItem = i;
          }
        }
      }
    }
    
    // Items are checked and confirmed
    // Ritual index is STORED for return
    if (itemArray.length == allChecks || (requirements.includes("ANY") && anyItem != undefined && itemArray.length == allChecks+1)) {
      chosenCeremonyPattern = ceremony.validCircle;
      chosenCeremony = ceremony;
      chosenCeremonyIndex = c;
      
      for (let i = 0; i < itemArray.length; i++) {
        let ite = itemArray[i];
        if (ceremony.specialProperties != undefined) {
          if (Object.keys(ceremony.specialProperties).includes(ite.typeId)) {
            let specialProp = ceremony.specialProperties[ite.typeId];
            
            if (ite.maxAmount > 1) {
              names[ite.typeId] = ite.nameTag;
            } else {
              if (ite.getDynamicProperty(specialProp) != undefined) {
                properties[ite.typeId] = ite.getDynamicProperty(specialProp);
              }
              names[ite.typeId] = ite.nameTag;
            }
          }
        }
      }
      if (anyItem != undefined) {
        properties.itemFound = anyItem;
      }
      ceremonyInfo.properties = properties;
      ceremonyInfo.names = names;
      break cereLoop;
    }
  }
  
  // Find pattern
  if (chosenCeremonyPattern != null) {
    if (wand.typeId != "bw:ritual_scroll") {
      // Loop through all Formations;
      formationLoop: for (let circle of circles) {
        // Lock in on the Formation with the correct name.
        if (circle.circleName == chosenCeremonyPattern) {
          let slateAmt = circle.slatePositions.length;
          let slateCheck = 0;
          
          circleLoop: for (let slate of circle.slatePositions) {
            // Where the slate should be
            let currPos = {
              x:location.x + slate.x,
              y:location.y,
              z:location.z + slate.z
            }
            
            if (block.dimension.isChunkLoaded(currPos)) {
              let slateBlk = block.dimension.getBlock(currPos);
              
              // Basic slated block
              if (slateBlk.hasTag("bw:white_slate")) {
                slateCheck++;
                continue circleLoop;
              }
              // Custom ritual blocks
              if (slateBlk.getComponent("bw:ritual_block") != undefined) {
                slateCheck++;
                continue circleLoop;
              }
              
              // Faerie Influence
              for (let fae of faerieInfluence) {
                if (fae.id == "hebaya") {
                  if (validCandles.includes(slateBlk.typeId) && slateBlk.permutation.getState("lit")) {
                    slateCheck++;
                    continue circleLoop;
                  }
                }
              }
            }
          }
          
          if (slateAmt == slateCheck) {
            correctCirclePresent = true;
            break formationLoop;
          }
        }
        continue;
      }
    } else {
      // Set Circle Formation to true
      correctCirclePresent = "scroll";
    }
  }
  
  // Pattern found
  if (correctCirclePresent) {
    console.warn(`${chosenCeremonyPattern}: ${correctCirclePresent}\nRitual Found and Executed: ${chosenCeremony.id}`);
    return [
      chosenCeremonyIndex, // Ceremony Index
      chosenCeremony, // Ceremony
      ceremonyInfo // Ceremony Info
    ]
  } else {
    console.warn(`No formation was discovered. This ritual resonates with the §d${chosenCeremonyPattern}§r.`)
    return null;
  }
}

function checkRitualItems(itemArray, block) {
  let c = 0;
  let unexpectedElement = 0;
  for (let ite of itemArray) {
    let found = false;
    let iE = block.dimension.getEntities({location: block.location, maxDistance: 3, type: "minecraft:item"});
    
    for (let e of iE) {
      let itemStack = e.getComponent("minecraft:item").itemStack;
      let itemBundle = itemStack.getComponent("minecraft:inventory")?.container;
      
      if (itemBundle) {
        for (let i = 0; i < itemBundle.size; i++) {
          let gItem = itemBundle.getItem(i);
          if (gItem != undefined) {
            if (gItem.typeId == ite.typeId) {
              c++;
              found = true;
              continue;
              //itemBundle.setItem(i, useItem(gItem));
            }
          }
        }
      } else {
        if (itemStack.typeId == ite.typeId) {
          c++;
          found = true;
          continue;
        }
      }
    }
    if (!found) {
      unexpectedElement++;
    }
  }
  
  if (c == itemArray.length && unexpectedElement == 0) {
    return true;
  } else {
    return false;
  }
}
function deleteRitualItems(itemArray, block) {
  for (let ite of itemArray) {
    let iE = block.dimension.getEntities({location: block.location, maxDistance: 3, type: "minecraft:item"});
    
    entityLoop: for (let e of iE) {
      let itemStack = e.getComponent("minecraft:item").itemStack;
      let itemBundle = itemStack.getComponent("minecraft:inventory")?.container;
      
      block.dimension.spawnParticle("rituals:smokeDisappear", e.location);
      
      if (itemBundle) {
        for (let i = 0; i < itemBundle.size; i++) {
          let gItem = itemBundle.getItem(i);
          if (gItem != undefined) {
            if (gItem.typeId == ite.typeId) {
              itemBundle.setItem(i, useItem(gItem));
              let bund = block.dimension.spawnItem(itemStack, e.location);
              bund.clearVelocity();
              e.kill();
              break entityLoop;
            }
          }
        }
      }
      
      if (itemStack.typeId == ite.typeId) {
        let newItem = itemStack;
        if (newItem.amount > 1) {
          newItem.amount--;
        } else {
          newItem = undefined;
        }
        if (newItem != undefined) {
          let i = block.dimension.spawnItem(newItem, e.location);
          i.clearVelocity();
        }
        e.kill();
        break entityLoop;
      }
    }
  }
}

// Eat ritual items
export async function useRitualItems(ritualIndex, block) {
  let ritualUsed = ceremonies[ritualIndex];
  // Define items and entities
  let items = [];
  let entities = block.dimension.getEntities({location: block.location, maxDistance: 3, type: "minecraft:item"});
  for (let entity of entities) {
    items.push(entity.getComponent("item").itemStack);
  }
  
  let requirements = ritualUsed.itemArray;
  let itemArray = [];
  for (let n = 0; n < items.length; n++) {
    let nItem = items[n];
    let itemInv = nItem.getComponent("minecraft:inventory");
    
    if (itemInv == undefined) {
      itemArray.push(nItem);
    } else {
      itemInv = itemInv.container;
      for (let i = 0; i < itemInv.size; i++) {
        let gItem = itemInv.getItem(i);
        if (gItem != undefined) {
          itemArray.push(gItem);
        }
      }
    }
  }
  
  let anyItem;
  
  // A sum of all met requirements
  let allChecks = 0;
  
  // Check for each item in order, including any indication that a ritual might have multiple options (by string stated names, by object stated tags, by object stated components) for certain items.
  for (let r = 0; r < requirements.length; r++) {
    let reagentItem = requirements[r];
    for (let i of itemArray) {
      // Check if this reagent can be substituted (It's an array).
      if (Array.isArray(reagentItem)) {
        // If this array directly includes the item name, it can just be added to the final array.
        if (reagentItem.includes(i.typeId)) {
          allChecks = allChecks + 1;
        } else {
          // If not, then check if there are properties that can validate this item.
          for (let obj of reagentItem) {
            if (typeof obj == "object") {
              let component = obj.componentType;
              let tag = obj.tag;
              if (component != undefined) {
                if (i.getComponent(component)) {
                  allChecks = allChecks + 1;
                  continue;
                }
              }
              if (tag != undefined) {
                if (i.hasTag(tag)) {
                  allChecks = allChecks + 1;
                  continue;
                }
              }
            }
          }
        }
      } else {
        if (reagentItem == i.typeId) {
          allChecks = allChecks + 1;
        } else
        if (requirements.includes("ANY") && !requirements.includes(i.typeId)) {
          anyItem = i;
        }
      }
    }
  }
  
  // Items are checked and confirmed
  // Items are destroyed
  if (itemArray.length == allChecks || (requirements.includes("ANY") && anyItem != undefined && itemArray.length == allChecks+1)) {
    
    if (checkRitualItems(itemArray, block)) {
      deleteRitualItems(itemArray, block);
      return true
    }
  }
  
  return false
}

export async function castRitual(ceremony, riteInfo, block, player) {
  let obliqueHex = player.getDynamicProperty("bwHex:obliquity");
  
  let dimension = player.dimension;
  /*
  for (let stages of ceremony.vfx) {
    if (stages.particle != undefined) {
      dimension.spawnParticle(stages.particle, Vector3.add(block.location, stages.particleOffset));
    }
    
    if (stages.sound != undefined) {
      dimension.playSound(stages.sound, block.location, stages.soundValues);
      if (stages.playDuringDelay == undefined) {
        await vfxSleep(stages.delayAfterParticleInSeconds);
      } else {
        await vfxSleep(stages.delayAfterParticleInSeconds, stages.sound, stages.soundValues, block);
      }
    } else {
      await vfxSleep(stages.delayAfterParticleInSeconds);
    }
  }
  */
  if (obliqueHex) {
    obliqueHex = JSON.parse(obliqueHex);
    if (obliqueHex) {
      let diceCheck = 10 + (1 * obliqueHex.power);
      
      if (diceCheck > 90) {
        diceCheck = 90;
      }
      
      if (diceRoll(1, 100, true) <= diceCheck) {
        player.sendMessage("§c[!]§r The focus of the energies shifts slightly. Not too much but just enough to throw your ceremony off, and so it fails.");
        block.dimension.playSound("beacon.deactivate", block.location, {volume: 2.5});
        return;
      }
    }
  }
  
  let alignment = {
    names: riteInfo.names,
    properties: riteInfo.properties,
    influence: riteInfo.correspondences,
    ambience: riteInfo.ambient,
    boostValue: 0
  };
  
  if (ceremony.alignment != undefined) {
    if (ceremony.alignment.weather != undefined) {
      alignment.boostValue += gatherWeatherAlignment(player, ceremony.alignment.weather);
    }
    if (ceremony.alignment.moonPhase != undefined) {
      alignment.boostValue += gatherPhaseAlignment(player, ceremony.alignment.moonPhase);
    }
    if (ceremony.alignment.timeOfDay != undefined) {
      alignment.boostValue += gatherTimeAlignment(player, ceremony.alignment.timeOfDay);
    }
  }
  
  if (alignment.properties["bw:blood_vial"] != undefined) {
    let blood = JSON.parse(alignment.properties["bw:blood_vial"]);
    
    let target = world.getEntity(blood.id);
    
    if (target != undefined && !Array.isArray(target)) {
      let familiarPowers = getPresentFamiliarPowers(target);
      
      if (familiarPowers.includes("Spiritual Awareness")) {
        if (ceremony.cost.tags.includes("malefic")) {
          // Hex Hissing
          target.sendMessage("§5[?]§r \"Hiss Hiss\"");
          target.playSound("mob.cat.hiss");
          // Reflexive Reflection
          if (diceRoll(1, 4, true) == 1) {
            alignment.properties["bw:blood_vial"] = JSON.stringify({
              type: player.typeId,
              name: player.name,
              id: player.id
            });
          }
        }
      }
      
    }
  }
  
  ceremony.ritualEffects(player, block, alignment);
}