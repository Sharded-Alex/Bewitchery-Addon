/* jshint maxerr: 10000 */
import {world, Entity, MolangVariableMap, system, ItemStack, EffectTypes, BlockPermutation} from "@minecraft/server";
import {ActionFormData, ActionFormResponse, MessageFormData, ModalFormData} from "@minecraft/server-ui";
import {Vector3, Random} from "./VectorMath/index.js";
import {generateUniqueId} from "curses.js";
import {diceRoll, validCandles, getOrbicNexii, jackBlocks, inRange, essenceCheck, castBWSpell} from "occultMagick.js";
import {spellCastTypes, attachCustomEffect} from "./faeSpells.js";
import {applySpellDamage} from "./spellDamage.js";
import {corrToStrings, jackBlastEntity, breakJackShield, getWardCorrespondence, isCorrValid, getJackDays} from "./blockComp.js";

function capitalize(str) {
  // Handle empty or non-string inputs gracefully
  if (!str || typeof str !== 'string') {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getWardsInRegion(dim, loc, area, type = undefined) {
  let wardBlockArray = [];

  for (let x = loc.x - area; x < loc.x + area; x++) {
    for (let y = loc.y - area; y < loc.y + area; y++) {
      for (let z = loc.z - area; z < loc.x + area; z++) {
        let vec = new Vector3(x, y, z);
        if (!dim.isChunkLoaded(vec)) {
          continue;
        }

        let block = dim.getBlock(vec);
        let blockProps = block.getComponent("minecraft:dynamic_properties");
        if (!blockProps) {
          continue;
        }

        if (blockProps.get("bw:ward_info")) {
          if (type != undefined) {
            let wardInfo = JSON.parse(blockProps.get("bw:ward_info"));
            if (wardInfo.trigger == type) {
              wardBlockArray.push(block);
              continue;
            }
          } else {
            wardBlockArray.push(block);
            continue;
          }
        }
      }
    }
  }

  console.warn(`Wards Found: ${wardBlockArray.length}`);
  return wardBlockArray;
}

export function isJack(block) {
  let name = `pumpkinWard:${Math.floor(block.x)}_${Math.floor(block.y)}_${Math.floor(block.z)}_${block.dimension.id}`;
  
  if (world.getDynamicProperty(name)) {
    return name;
  } else {
    return false;
  }
}

export function quadSplit(str) {
  let arr = [];
  let s = 0;
  for (let n = 0; n < str.length; n++) {
    if (arr.length < 3) {
      if (str[n] != "_") {
        continue;
      } else {
        arr.push(str.substring(s, n));
        n++;
        s = n;
      }
    } else {
      arr.push(str.substring(s));
      break;
    }
  }
  
  return arr;
}

export function getFace(dir) {
  dir = capitalize(dir);
  switch (dir) {
    case "Up": {
      return new Vector3(0, 1, 0)
    }
    case "Down": {
      return new Vector3(0, -1, 0)
    }
    case "North": {
      return new Vector3(0, 0, -1)
    }
    case "South": {
      return new Vector3(0, 0, 1)
    }
    case "East": {
      return new Vector3(1, 0, 0)
    }
    case "West": {
      return new Vector3(-1, 0, 0)
    }
  }
}

export function checkSwitch(switchPos, dimension) {
  if (switchPos == undefined) {
    return true;
  }
  
  try {
    if (dimension.isChunkLoaded(switchPos)) {
      let blk = dimension.getBlock(switchPos);
      if (blk != undefined) {
        if (validCandles.includes(blk.typeId)) {
          if (blk.permutation.getState("lit")) {
            return true;
          } else {
            return false;
          }
        } else {
          return false
        }
      }
    }
  } catch (err) {
    return true;
  }
}

export function drawOrbosFromNexii(nexii, cost) {
  if (cost == undefined) {
    cost = 0;
  }
  let currentCost = cost;
  let drawFrom = [
    // [nexus, amount]
  ];
  for (let nexus of nexii) {
    // If no more orbos necessary, break out of loop;
    if (currentCost == 0) {
      break;
    }
    let power = world.getDynamicProperty(nexus);
    let costDeduction = 0;
    if (power != undefined && currentCost > 0) {
      if (currentCost - power >= 0) {
        currentCost = currentCost - power;
        costDeduction = power;
      } else {
        costDeduction = currentCost;
        currentCost = 0;
      }
      
      drawFrom.push([nexus, power - costDeduction]);
    }
  }
  
  if (currentCost == 0) {
    for (let n of drawFrom) {
      console.warn(n);
      world.setDynamicProperty(n[0], n[1]);
    }
    return true;
  } else {
    return false;
  }
}

export function jackEat(ward, wName) {
  let days = getJackDays(ward.lastFed);
  let unsatisfied = false;
  let originalAmt = ward.storedOrbos;
  let deduction = 0;
  let deducted = false;
  if (days >= 8) {
    let cycles = Math.floor(days/8);
    deduction = ward.storedOrbos - (cycles * 100);
    deducted = true;
    ward.lastFed = world.getDay();
    
    if (deduction < 0) {
      ward.unfed = true;
      unsatisfied = true;
    }
  }
  
  system.run(() => {
    if (!world.getDynamicProperty(wName)) {
      return false;
    }
    
    if (!deducted) {
      return false;
    }
    
    let posArr = quadSplit(wName.slice(12));
    let pos = {
      x: posArr[0] * 1,
      y: posArr[1] * 1,
      z: posArr[2] * 1
    }
    let dim = world.getDimension(posArr[3]);
    
    // If block doesn't exist, return false;
    let block = dim.getBlock(pos);
    if (block == undefined) {
      return false;
    }
    
    
    // Get component
    let wardComponent = block.getComponent("bw:warding_magick")?.customComponentParameters?.params;
    if (!wardComponent) {
      return false;
    }
    
    // If Jack is unfed and unsatisfied
    if (unsatisfied) {
      // Set activated ward to its deactivated variant;
      let states = block.permutation.getAllStates();
      states[wardComponent.fed_state] = false;
      if (block.typeId == wardComponent.active_variant) {
        try {
          block.setPermutation(BlockPermutation.resolve(wardComponent.inactive_variant, states));
        } catch (err) {
          console.warn("Ward block is defined incorrectly somewhere.")
        }
      }
    } else {
      // Jack is satiated;
      if (ward.unfed) {
        let states = block.permutation.getAllStates();
        states[wardComponent.fed_state] = true;
        if (block.typeId == wardComponent.inactive_variant) {
          try {
            block.setPermutation(BlockPermutation.resolve(wardComponent.active_variant, states));
          } catch (err) {
            console.warn("Ward block is defined incorrectly somewhere.")
          }
        }
      }
      delete ward.unfed;
    }
    
    // Ensure Orbos Values align
    let currentJackOrbos = JSON.parse(world.getDynamicProperty(wName)).storedOrbos;
    if (originalAmt != currentJackOrbos) {
      ward.storedOrbos = currentJackOrbos;
    }
    
    ward.storedOrbos = ward.storedOrbos - deduction;
    
    world.setDynamicProperty(wName, JSON.stringify(ward));
  });
  
  return ward;
}

export function readJack(jack, witch) {
  let str = {rawtext: []};
  str.rawtext.push({"text": `§6Central Ward Point: §c${jack.position.x}§r, §a${jack.position.y}§r, §b${jack.position.z}§r\n`});
  str.rawtext.push({"text": `§6Dimension: §a${jack.dimension}§r\n`});
  
  // Effects
  if (jack.effect == "bw:blue_orchid_dust") {
    str.rawtext.push({"text": `§6Effect:§r §aTransfiguration§r - The target is transfigured into the type of creature the provided blood belonged to. For this to work however, the target must have §cless than 3 hearts of health below or equal health to§r that creature's maximum health.\n`});
    str.rawtext.push({"text": `§6Blood Provided:§r §4${jack.params[0]}§r\n`});
  }
  if (jack.effect == "bw:cornflower_dust") {
    str.rawtext.push({"text": `§6Effect:§r §aLightning Strike§r - The target is blasted by a lightning bolt.\n`});
  }
  if (jack.effect == "bw:dandelion_dust") {
    str.rawtext.push({"text": `§6Effect:§r §aReveal§r - The target is cleansed of obfuscating effects like invisibility and concealment. A little sparkle is added to them as well.\n`});
  }
  if (jack.effect == "bw:oxeye_daisy_dust") {
    str.rawtext.push({"text": `§6Effect:§r §aMinor Alchemy§r - A defined potion effect is applied to the target.\n`});
    if (jack.params[0] != undefined) {
      let potion = EffectTypes.get(jack.params[0].potionEffectId);
      
      if (potion != undefined) {
        str.rawtext.push({"text": `§6Applied Effect:§r §a${potion.getName()}§r\n`});
      }
    }
  }
  if (jack.effect == "bw:poppy_dust") {
    str.rawtext.push({"text": `§6Effect:§r §aTaglocking§r - There is a chance that the target's blood is snatched. It is sent to a specified location WITHIN the Jack's influence, which should be an inventory.\n`});
    str.rawtext.push({"text": `§6Blood Inventory:§r §4${jack.params[1].x}, ${jack.params[1].y}, ${jack.params[1].z}§r\n`});
  }
  if (jack.effect == "bw:crushed_fern") {
    str.rawtext.push({"text": `§6Effect:§r §aDespawning§r - Target monsters with 20 health and below are despawned.\n`});
  }
  if (jack.effect == "bw:coal_dust") {
    str.rawtext.push({"text": `§6Effect:§r §aHarm§r - The target is assaulted with 2 §doccult§r damage.\n`});
  }
  if (jack.effect == "bw:obsidian_dust") {
    str.rawtext.push({"text": `§6Effect:§r §aWarp§r - The target is magickally relocated to a defined position WITHIN the Jack's influence.\n`});
    str.rawtext.push({"text": `§6Destination:§r §d${jack.params[1].x}, ${jack.params[1].y}, ${jack.params[1].z}§r\n`});
  }
  if (jack.effect == "bw:emerald_dust") {
    if (jack.params[0] == undefined || jack.params[0] == "") {
      str.rawtext.push({"text": `§6Effect:§r §aCanceling§r - The target (preferably a Player) is prevented from fully performing the associated §6trigger§r.\n`});
    } else {
      str.rawtext.push({"text": `§6Effect:§r §aMessage§r - The target (preferably a Player) is told this message: "${jack.params[0]}".\n`});
    }
  }
  if (jack.effect == "bw:amethyst_dust") {
    str.rawtext.push({"text": `§6Effect:§r §aInvoke Spell§r - The Jack o' Ward performs a §bspell§r, sourced by a Lectern at a defined position WITHIN the Jack's influence. Note that the Jack o' Ward is considered the caster.\n`});
    str.rawtext.push({"text": `§6Lectern Position:§r §a${jack.params[1].x}, ${jack.params[1].y}, ${jack.params[1].z}§r\n`});
  }
  
  // Triggers
  if (jack.trigger == "on_attack") {
    str.rawtext.push({"text": `§6Trigger:§r §aWhen Attacking§r\n`});
  }
  if (jack.trigger == "on_attacked") {
    str.rawtext.push({"text": `§6Trigger:§r §aWhen Attacked§r\n`});
  }
  if (jack.trigger == "pressure_press") {
    str.rawtext.push({"text": `§6Trigger:§r §aOn Pressing Pressure Plate§r\n`});
  }
  if (jack.trigger == "lever_pull") {
    str.rawtext.push({"text": `§6Trigger:§r §aOn Lever Pull§r\n`});
  }
  if (jack.trigger == "button_press") {
    str.rawtext.push({"text": `§6Trigger:§r §aOn Button Press§r\n`});
  }
  if (jack.trigger == "tripwire") {
    str.rawtext.push({"text": `§6Trigger:§r §aOn Tripwire Trip§r\n`});
  }
  if (jack.trigger == "block_place") {
    str.rawtext.push({"text": `§6Trigger:§r §aOn Block Placing§r\n`});
  }
  if (jack.trigger == "block_break") {
    str.rawtext.push({"text": `§6Trigger:§r §aOn Block Breaking§r\n`});
  }
  if (jack.trigger == "redstone_trigger_jack") {
    str.rawtext.push({"text": `§6Trigger:§r §aOn Redstone Triggered§r\n`});
  }
  if (jack.trigger == "chest_interact") {
    str.rawtext.push({"text": `§6Trigger:§r §aOn Block Inventory Interaction§r\n`});
  }
  if (jack.trigger == "spell_use") {
    str.rawtext.push({"text": `§6Trigger:§r §aOn Spell Cast§r\n`});
  }
  
  if (jack.switch != undefined) {
    str.rawtext.push({"text": `§6Candle Toggle Position:§r §a${jack.switch.x}, ${jack.switch.y}, ${jack.switch.z}§r\n`});
  }
  if (jack.condition != undefined) {
    if (jack.conditionType == "block") {
      let blk = BlockPermutation.resolve(jack.condition, {});
      let itemVers = blk.getItemStack(1).localizationKey;
      str.rawtext.push({"text": `§6Condition Block:§r §a\n`});
      str.rawtext.push({"translate": itemVers});
      str.rawtext.push({"text": `§r\n`});
    }
    if (jack.conditionType == "item") {
      let itm = new ItemStack(jack.condition, 1);
      str.rawtext.push({"text": `§6Condition Item:§r §a\n`});
      str.rawtext.push({"translate": `${itm.localizationKey}`});
      str.rawtext.push({"text": `§r\n`});
    }
  }
  if (jack.shields != undefined) {
    str.rawtext.push({"text": `§6Shield Value: ${jack.shields}\n`});
  }
  if (jack.encryption != undefined) {
    str.rawtext.push({"text": `§6This Jack o' Ward is §dencrypted§6 under the influences of ${corrToStrings(jack.encryption)}\n`});
  }
  str.rawtext.push({"text": `\n§6Stored Orbos:§r §d${jack.storedOrbos}§r (roughly §dx${Math.floor(jack.storedOrbos/30)} Raw Orbos§r)\n`});
  
  const formData = new ActionFormData();
  formData.title("Jack o' Ward Info");
  formData.body(str);
  
  formData.show(witch).then(display => {
    if (display.canceled) {
      return;
    }
  })
  
  return str;
}

export const wardingDusts = {
  "bw:blue_orchid_dust": {
    "color": {
      "red": 50/255,
      "green": 133/255,
      "blue": 148/255
    },
    "cost": 0, // Cost in Raw Orbos to Upkeep
    "effect": (entity, params) => {
      if (!entity?.isValid) {
        return;
      }
      
      if (entity.typeId == "minecraft:player") {
        return;
      }
      
      let entityHealth = entity.getComponent("minecraft:health");
      if (entityHealth != undefined) {
        if (params[1] == undefined) {
          return;
        }
        
        let potentialEntHealth = params[1];

        let healthDiff = Math.round(potentialEntHealth - entityHealth.currentValue);
        
        if (healthDiff >= 0 && healthDiff <= 6) {
          entity.remove();
        } else {
          potentialEnt.remove();
        }
      }
    },
    "parameter": (block) => {
      let itemEntities = block.dimension.getEntitiesAtBlockLocation(block.location);
      let items = [];
      itemEntities.forEach(e => {
        if (e.getComponent("minecraft:item")) {
          items.push(e);
        }
      })
      
      let arr = [];
      
      for (let i = 0; i < items.length; i++) {
        let item = items[i].getComponent("minecraft:item").itemStack;
        if (item?.getDynamicProperty("bw:blood")) {
          let blood = JSON.parse(item.getDynamicProperty("bw:blood"));
          arr.push(blood.type);

          let potentialEnt = block.dimension.spawnEntity(blood.type, block.location);

          if (potentialEnt.getComponent("minecraft:health")) {
            arr.push(potentialEnt.getComponent("minecraft:health").effectiveMax);
          }

          potentialEnt.remove();
          break;
        }
      }
      return arr;
    },
    "paramsAmt": 2,
    "trigger": "on_attack"
  },
  "bw:cornflower_dust": {
    "color": {
      "red": 21/255,
      "green": 127/255,
      "blue": 157/255
    },
    "cost": 0, // Cost in Raw Orbos to Upkeep
    "effect": (entity, params) => {
      if (!entity?.isValid) {
        return;
      }
      
      entity.dimension.spawnEntity("minecraft:lightning_bolt", entity.location);
    },
    "trigger": "on_attacked"
  },
  "bw:dandelion_dust": {
    "color": {
      "red": 217/255,
      "green": 217/255,
      "blue": 55/255
    },
    "cost": 0, // Cost in Raw Orbos to Upkeep
    "effect": (entity, params) => {
      if (!entity?.isValid) {
        return;
      }
      
      let sparkles = {
        "id": "bwDuration:sparkles",
        "name": "Revealing Sparks",
        "duration": 60,
        "amplifier": 1,
        "stackable": true,
        "sticky": true
      }
      
      if (entity.getDynamicProperty("bwDuration:conceal")) {
        entity.setDynamicProperty("bwDuration:conceal", undefined);
      }
      
      if (entity.getEffect("minecraft:invisibility")) {
        entity.removeEffect("minecraft:invisibility");
      }
      
      if (!entity.getDynamicProperty("bwDuration:sparkles")) {
        attachCustomEffect(entity, sparkles);
      }
    },
    "trigger": "pressure_press"
  },
  "bw:oxeye_daisy_dust": {
    "color": {
      "red": 179/255,
      "green": 179/255,
      "blue": 150/255
    },
    "cost": 0, // Cost in Raw Orbos to Upkeep
    "effect": (entity, params) => {
      if (!entity?.isValid) {
        return;
      }
      
      if (params[0] != undefined) {
        let potionEffect = params[0];
        if (!entity.getEffect(potionEffect.potionEffectId)) {
          entity.addEffect(potionEffect.potionEffectId, potionEffect.potionDuration);
        } else {
          return;
        }
      }
    },
    "parameter": (block) => {
      let itemEntities = block.dimension.getEntitiesAtBlockLocation(block.location);
      let items = [];
      itemEntities.forEach(e => {
        if (e.getComponent("minecraft:item")) {
          items.push(e);
        }
      })
      
      let arr = [];
      for (let i = 0; i < items.length; i++) {
        let item = items[i].getComponent("minecraft:item").itemStack;
        
        if (item?.typeId == "bw:filled_clay_totem" && item.getDynamicProperty("bw:potionEffect")) {
          let potion = JSON.parse(item.getDynamicProperty("bw:potionEffect"));
          arr.push(potion);
          break;
        }
      }
      return arr;
    },
    "paramsAmt": 1,
    "trigger": "lever_pull"
  },
  "bw:poppy_dust": {
    "color": {
      "red": 193/255,
      "green": 76/255,
      "blue": 76/255
    },
    "cost": 0, // Cost in Raw Orbos to Upkeep
    "effect": (entity, params) => {
      if (!entity?.isValid) {
        return;
      }
      
      if (params[1] != undefined) {
        if (inRange(params[0], params[1], 32)) {
          let entityHealth = entity.getComponent("minecraft:health");
          if (entityHealth.effectiveMax > 100) {
            return;
          }
          if (entity.getDynamicProperty("bwDuration:protection_malice") != undefined) {
            return;
          }
          
          if (diceRoll(1, 20, true) < 16) {
            return;
          }
          
          if (!entity.dimension.isChunkLoaded(params[1])) {
            return;
          }
          let block = entity.dimension.getBlock(params[1]);
          if (block.getComponent("minecraft:inventory")) {
            let blockInv = block.getComponent("minecraft:inventory").container;
            
            if (blockInv.emptySlotsCount > 0) {
              let blood = new ItemStack("bw:blood_vial", 1);
              if (entity.typeId != "minecraft:player") {
                let info = {
                  "type": entity.typeId,
                  "name": entity.nameTag,
                  "id": entity.id,
                  "trueSelf": entity
                };
                let lore = [
                  `§4Type: ${info.type}§r`,
                  `§4Name: ${info.name}§r`, 
                  `§4ID: ${info.id}`
                ];
                blood.setLore(lore);
                blood.setDynamicProperty("bw:blood", JSON.stringify(info));
              } else {
                let info = {
                  "type": entity.typeId,
                  "name": entity.name,
                  "id": entity.id,
                  "trueSelf": entity
                };
                let lore = [
                  `§4Type: ${info.type}§r`,
                  `§4Name: ${info.name}§r`, 
                  `§4ID: ${info.id}`
                ];
                blood.setLore(lore);
                blood.setDynamicProperty("bw:blood", JSON.stringify(info));
              }
              
              blockInv.addItem(blood);
            }
          }
        }
      }
    },
    "parameter": (block) => {
      let itemEntities = block.dimension.getEntitiesAtBlockLocation(block.location);
      let items = [];
      itemEntities.forEach(e => {
        if (e.getComponent("minecraft:item")) {
          items.push(e);
        }
      })
      
      let arr = [];
      arr.push(block.location);
      for (let i = 0; i < items.length; i++) {
        let item = items[i].getComponent("minecraft:item").itemStack;
        
        if (item?.getDynamicProperty("bw:savedLocation")) {
          let pos = JSON.parse(item.getDynamicProperty("bw:savedLocation"));
          arr.push(pos);
          break;
        }
      }
      
      return arr;
    },
    "paramsAmt": 2,
    "trigger": "button_press"
  },
  "bw:crushed_fern": {
    "color": {
      "red": 45/255,
      "green": 126/255,
      "blue": 10/255
    },
    "cost": 0, // Cost in Raw Orbos to Upkeep
    "effect": (entity, params) => {
      if (!entity?.isValid) {
        return;
      }
      
      if (entity.typeId == "minecraft:player") {
        return;
      }
      
      let families = entity.getComponent("minecraft:type_family");
      if (families != undefined) {
        families = families.getTypeFamilies();
      } else {
        families = [];
      }
      
      let entityHealth = entity.getComponent("minecraft:health");
      if (entityHealth) {
        if (families.includes("monster")) {
          if (entityHealth.currentValue <= 20) {
            entity.remove();
          }
        }
      }
    },
    "trigger": "tripwire"
  },
  "minecraft:redstone": {
    "color": {
      "red": 20/255,
      "green": 20/255,
      "blue": 20/255
    },
    "cost": 0, // Cost in Raw Orbos to Upkeep
    "effect": (entity, params) => {
      if (!entity?.isValid) {
        return;
      }
      
      console.warn("REDSTONE EFFECT-EU!!!!!");
    },
    "trigger": "redstone_trigger_jack"
  },
  "bw:coal_dust": {
    "color": {
      "red": 20/255,
      "green": 20/255,
      "blue": 20/255
    },
    "cost": 0, // Cost in Raw Orbos to Upkeep
    "effect": (entity, params) => {
      if (!entity?.isValid) {
        return;
      }
      
      applySpellDamage(entity, 2, "occult", 0);
    },
    "trigger": "block_place"
  },
  "bw:obsidian_dust": {
    "color": {
      "red": 55/255,
      "green": 43/255,
      "blue": 80/255
    },
    "cost": 0, // Cost in Raw Orbos to Upkeep
    "effect": (entity, params) => {
      if (!entity?.isValid) {
        return;
      }
      
      if (params[1] != undefined) {
        if (inRange(params[0], params[1], 32)) {
          if (entity.typeId != "minecraft:player") {
            entity.tryTeleport(params[1], {keepVelocity: true});
          } else {
            entity.tryTeleport(params[1]);
          }
        }
      }
    },
    "parameter": (block) => {
      let itemEntities = block.dimension.getEntitiesAtBlockLocation(block.location);
      let items = [];
      itemEntities.forEach(e => {
        if (e.getComponent("minecraft:item")) {
          items.push(e);
        }
      })
      
      let arr = [];
      arr.push(block.below(1).location);
      for (let i = 0; i < items.length; i++) {
        let item = items[i].getComponent("minecraft:item").itemStack;
        
        if (item?.getDynamicProperty("bw:savedLocation")) {
          let pos = JSON.parse(item.getDynamicProperty("bw:savedLocation"));
          arr.push(pos);
          break;
        }
      }
      
      return arr;
    },
    "paramsAmt": 2,
    "trigger": "chest_interact"
  },
  "bw:emerald_dust": {
    "color": {
      "red": 55/255,
      "green": 175/255,
      "blue": 25/255
    },
    "cost": 0, // Cost in Raw Orbos to Upkeep
    "effect": (entity, params) => {
      if (!entity?.isValid) {
        return;
      }
      
      if (params[0] != undefined) {
        if (params[0] == "") {
          return true;
        }
        if (entity instanceof Player) {
          entity.sendMessage(params[0]);
        }
        return false;
      }
      return true;
    },
    "parameter": (block) => {
      let itemEntities = block.dimension.getEntitiesAtBlockLocation(block.location);
      let items = [];
      itemEntities.forEach(e => {
        if (e.getComponent("minecraft:item")) {
          items.push(e);
        }
      })
      
      let arr = [];
      
      for (let i = 0; i < items.length; i++) {
        let item = items[i].getComponent("minecraft:item").itemStack;
        if (item?.getComponent("minecraft:book")) {
          let book = item.getComponent("minecraft:book");
          let str = book.getPageContent(0);
          if (str != undefined) {
            arr.push(str);
          }
          break;
        }
      }
      return arr;
    },
    "paramsAmt": 0,
    "trigger": "block_break"
  },
  "bw:amethyst_dust": {
    "color": {
      "red": 125/255,
      "green": 78/255,
      "blue": 151/255
    },
    "cost": 0, // Cost in Raw Orbos to Upkeep
    "effect": (entity, params) => {
      if (!entity.isValid) {
        return;
      }
      
      if (params[1] != undefined) {
        if (inRange(params[0], params[1], 32)) {
          let jack = entity.dimension.getBlock(params[0]);
          let lectern = entity.dimension.getBlock(params[1]);
          // Lectern
          if (lectern?.typeId == "minecraft:lectern") {
            let con = lectern.getComponent("minecraft:inventory")?.container;
            
            let spell = con?.getItem(0)?.getDynamicProperty("bw:mysticSpell");
            if (spell != undefined) {
              spell = JSON.parse(spell);
              
              castBWSpell(spell, undefined, jack);
            }
          }
        }
      }
    },
    "parameter": (block) => {
      let itemEntities = block.dimension.getEntitiesAtBlockLocation(block.location);
      let items = [];
      itemEntities.forEach(e => {
        if (e.getComponent("minecraft:item")) {
          items.push(e);
        }
      })
      
      let arr = [];
      arr.push(block.below(1).location);
      for (let i = 0; i < items.length; i++) {
        let item = items[i].getComponent("minecraft:item").itemStack;
        
        if (item?.getDynamicProperty("bw:savedLocation")) {
          let pos = JSON.parse(item.getDynamicProperty("bw:savedLocation"));
          arr.push(pos);
          break;
        }
      }
      
      return arr;
    },
    "paramsAmt": 2,
    "trigger": "spell_use"
  }
}

// API Calls
// On Attack / On Attacked
world.afterEvents.entityHitEntity.subscribe(e => {
  let entity = e.hitEntity;
  let player = e.damagingEntity;
  let wards = world.getDynamicPropertyIds().filter((e) => {
    if (e.startsWith("pumpkinWard:")) {
      return e;
    }
  });
  
  if (player?.isValid) {
    for (let w of wards) {
      if (!world.getDynamicProperty(w)) {
        continue;
      }
      
      let ward = JSON.parse(world.getDynamicProperty(w));
      
      try {
        if (ward.dimension != player.dimension.id) {
          continue;
        }
        if (!player.dimension.isChunkLoaded(ward.position)) {
          continue;
        }
      } catch (err) {
        continue;
      }
      
      if (ward.asleep) {
        continue;
      }
      if (inRange(player.location, ward.position, 32)) {
        // Jack takes a nom nom
        let eatResult = jackEat(ward, w);
        if (eatResult) {
          ward = eatResult;
        } else {
          continue;
        }
        
        if (ward.trigger == "on_attack") {
          if (ward.condition != undefined && ward.conditionType == "item") {
            let equipped = entity?.getComponent("minecraft:equippable")?.getEquipment("Mainhand");
            if (ward.condition != equipped?.typeId) {
              continue;
            }
          }
          if (!checkSwitch(ward.switch, player.dimension)) {
            continue;
          }
          if (!essenceCheck(player, ward.filter)) {
            continue;
          }
          let effectFunc = wardingDusts[ward.effect].effect;
          
          effectFunc(player, ward.params);
        }
      }
    }
  }
  
  if (entity?.isValid) {
    for (let w of wards) {
      if (!world.getDynamicProperty(w)) {
        continue;
      }
      
      let ward = JSON.parse(world.getDynamicProperty(w));
      
      try {
        if (ward.dimension != entity.dimension.id) {
          continue;
        }
        if (!entity.dimension.isChunkLoaded(ward.position)) {
          continue;
        }
      } catch (err) {
        continue;
      }
      
      if (ward.asleep) {
        continue;
      }
      if (Math.round(Vector3.distance(entity.location, ward.position)) <= 32) {
        let eatResult = jackEat(ward, w);
        if (eatResult) {
          ward = eatResult;
        } else {
          continue;
        }
        
        
        if (ward.trigger == "on_attacked") {
          if (ward.condition != undefined && ward.conditionType == "item") {
            let equipped = player?.getComponent("minecraft:equippable")?.getEquipment("Mainhand");
            if (ward.condition != equipped?.typeId) {
              continue;
            }
          }
          if (!checkSwitch(ward.switch, entity.dimension)) {
            continue;
          }
          if (!essenceCheck(entity, ward.filter)) {
            continue;
          }
          let effectFunc = wardingDusts[ward.effect].effect;
          
          effectFunc(entity, ward.params);
        }
      }
    }
  }
});

// Plate Push [Updated]
world.afterEvents.pressurePlatePush.subscribe(e => {
  let player = e.source;

  if (!player?.isValid) {
    return;
  }

  let regionalWards = getWardsInRegion(block.dimension, block.location, 32, "pressure_press");

  // If the breaking block is a Ward, this makes sure it interacts with its shields.
  if (regionalWards.length > 0) {
    breakDownWard = true;
  }
  
  // Loops through each ward of the appropriate trigger found
  for (let wardBlock of regionalWards) {
    let wardDP = wardBlock.getComponent("minecraft:dynamic_properties");
    let ward = JSON.parse(wardDP.get("bw:ward_info"));

    if (wardBlock.permutation.getState("bw:is_asleep")) {
      continue;
    }

    if (ward.condition != undefined) {
      if (ward.conditionType == "block") {
        if (ward.condition != block.typeId) {
          continue;
        }
      }
    }
    
    if (!checkSwitch(ward.switch, player.dimension)) {
      continue;
    }
    if (!essenceCheck(player, ward.filter)) {
      continue;
    }
    let effectFunc = wardingDusts[ward.effect].effect;
    
    effectFunc(player, ward.params);
  }
});

// Button Push
world.afterEvents.buttonPush.subscribe(e => {
  let player = e.source;
  
  let wards = world.getDynamicPropertyIds().filter((e) => {
    if (e.startsWith("pumpkinWard:")) {
      return e;
    }
  });
  
  if (player?.isValid) {
    for (let w of wards) {
      if (!world.getDynamicProperty(w)) {
        continue;
      }
      let ward = JSON.parse(world.getDynamicProperty(w));
      
      try {
        if (ward.dimension != player.dimension.id) {
          continue;
        }
        if (!player.dimension.isChunkLoaded(ward.position)) {
          continue;
        }
      } catch (err) {
        continue;
      }
      
      if (ward.asleep) {
        continue;
      }
      if (inRange(player.location, ward.position, 32)) {
        let eatResult = jackEat(ward, w);
        if (eatResult) {
          ward = eatResult;
        } else {
          continue;
        }
        
        if (ward.trigger == "button_press") {
          if (ward.condition != undefined) {
            if (ward.conditionType == "block") {
              if (ward.condition != e.block.typeId) {
                continue;
              }
            }
            if (ward.conditionType == "item") {
              let equipped = player.getComponent("minecraft:equippable")?.getEquipment("Mainhand");
              if (ward.condition != equipped?.typeId) {
                continue;
              }
            }
          }
          if (!checkSwitch(ward.switch, player.dimension)) {
            continue;
          }
          if (!essenceCheck(player, ward.filter)) {
            continue;
          }
          let effectFunc = wardingDusts[ward.effect].effect;
          
          effectFunc(player, ward.params);
        }
      }
    }
  }
});

// Lever Pull
world.afterEvents.leverAction.subscribe(e => {
  let player = e.player;
  
  let wards = world.getDynamicPropertyIds().filter((e) => {
    if (e.startsWith("pumpkinWard:")) {
      return e;
    }
  });
  if (player?.isValid && e.isPowered) {
    for (let w of wards) {
      if (!world.getDynamicProperty(w)) {
        continue;
      }
      let ward = JSON.parse(world.getDynamicProperty(w));
      
      try {
        if (ward.dimension != player.dimension.id) {
          continue;
        }
        if (!player.dimension.isChunkLoaded(ward.position)) {
          continue;
        }
      } catch (err) {
        continue;
      }
      
      if (ward.asleep) {
        continue;
      }
      
      if (inRange(player.location, ward.position, 32)) {
        let eatResult = jackEat(ward, w);
        if (eatResult) {
          ward = eatResult;
        } else {
          continue;
        }
        
        if (ward.trigger == "lever_pull") {
          if (ward.condition != undefined && ward.conditionType == "item") {
            let equipped = player.getComponent("minecraft:equippable")?.getEquipment("Mainhand");
            if (ward.condition != equipped?.typeId) {
              continue;
            }
          }
          if (!checkSwitch(ward.switch, player.dimension)) {
            continue;
          }
          if (!essenceCheck(player, ward.filter)) {
            continue;
          }
          let effectFunc = wardingDusts[ward.effect].effect;
          
          effectFunc(player, ward.params);
        }
      }
    }
  }
});

// Tripwire Trip
world.afterEvents.tripWireTrip.subscribe(e => {
  let players = e.sources;
  
  let wards = world.getDynamicPropertyIds().filter((e) => {
    if (e.startsWith("pumpkinWard:")) {
      return e;
    }
  });
  
  for (let p = 0; p < players.length; p++) {
    let player = players[p];
    if (player?.isValid) {
      for (let w of wards) {
        if (!world.getDynamicProperty(w)) {
          continue;
        }
        let ward = JSON.parse(world.getDynamicProperty(w));
        
        try {
          if (ward.dimension != player.dimension.id) {
            continue;
          }
          if (!player.dimension.isChunkLoaded(ward.position)) {
            continue;
          }
        } catch (err) {
          continue;
        }
        
        if (ward.asleep) {
          continue;
        }
        
        if (inRange(player.location, ward.position, 32)) {
          let eatResult = jackEat(ward, w);
          if (eatResult) {
            ward = eatResult;
          } else {
            continue;
          }
          
          if (ward.trigger == "tripwire") {
            if (ward.condition != undefined && ward.conditionType == "item") {
              let equipped = player.getComponent("minecraft:equippable")?.getEquipment("Mainhand");
              if (ward.condition != equipped?.typeId) {
                continue;
              }
            }
            if (!checkSwitch(ward.switch, player.dimension)) {
              continue;
            }
            
            let check = essenceCheck(player, ward.filter);
            if (!check) {
              continue;
            }
            let effectFunc = wardingDusts[ward.effect].effect;
            
            effectFunc(player, ward.params);
          }
        }
      }
    }
  }
});

// Break Block (Before) [Updated]
// Also controls Jack breaking
world.beforeEvents.playerBreakBlock.subscribe(e => {
  let player = e.player;
  let block = e.block;
  let blockDP = block.getComponent("minecraft:dynamic_properties");
  let tool = e.itemStack;
  let obstructed = false;
  let breakDownWard = false;
  let isBlockShieldWard = false;

  if (!player?.isValid) {
    return;
  }
  
  let regionalWards = getWardsInRegion(block.dimension, block.location, 32, "block_break");

  // If the breaking block is a Ward, this makes sure it interacts with its shields.
  if (regionalWards.length > 0) {
    breakDownWard = true;
  }
  
  // Loops through each ward of the appropriate trigger found
  for (let wardBlock of regionalWards) {
    let wardDP = wardBlock.getComponent("minecraft:dynamic_properties");
    let ward = JSON.parse(wardDP.get("bw:ward_info"));

    if (wardBlock.permutation.getState("bw:is_asleep")) {
      continue;
    }

    if (ward.condition != undefined) {
      if (ward.conditionType == "block") {
        if (ward.condition != block.typeId) {
          continue;
        }
      }
      if (ward.conditionType == "item") {
        let equipped = player.getComponent("minecraft:equippable")?.getEquipment("Mainhand");
        if (ward.condition != equipped?.typeId) {
          continue;
        }
      }
    }
    
    if (!checkSwitch(ward.switch, player.dimension)) {
      continue;
    }
    if (!essenceCheck(player, ward.filter)) {
      continue;
    }
    let effectFunc = wardingDusts[ward.effect].effect;
    
    let result;
    try {
      result = effectFunc(player, ward.params);
    } catch (err) {
      system.run(() => {
        result = effectFunc(player, ward.params);
      })
    }

    if (result != undefined && obstructed == false) {
      obstructed = result;
    }

    // If the block is the same as the ward block, continue and try to break down this ward.
    if (block.x == wardBlock.x && block.y == wardBlock.y && block.z == wardBlock.z && obstructed) {
      isBlockShieldWard = true;
    }
  }

  e.cancel = obstructed;

  
  if (breakDownWard) {
    if (obstructed && !isBlockShieldWard) {
      return;
    }

    let jackShields = blockDP?.get("bw:ward_shields");
    let enchantPow = 0;

    if (tool?.getComponent("minecraft:enchantable")?.getEnchantment("sharpness")) {
      enchantPow = tool?.getComponent("minecraft:enchantable")?.getEnchantment("sharpness").level;
    }
    
    system.run(() => {
      if (jackShields != undefined) {
        blockDP.set("bw:ward_shields", breakJackShield(jackShields, enchantPow, block.dimension, block.location));
      }

      if (blockDP.get("bw:ward_shields") == -1) {
        player.sendMessage(`§6[!]§r You have broken this Jack's consecrated home with some magical sharpness.`);
        blockDP.set("bw:ward_shields", undefined);
        blockDP.set("bw:ward_info", undefined);
        blockDP.set("bw:ward_owner", undefined);
        blockDP.set("bw:ward_orbos", undefined);
        obstructed = false;
      }
    })
    e.cancel = obstructed;
  }
});

// Interact With Chest (Before)
world.beforeEvents.playerInteractWithBlock.subscribe(e => {
  const item = e.itemStack;
  const player = e.player;
  const block = e.block;
  let obstructed = false;
  
  let wards = world.getDynamicPropertyIds().filter((e) => {
    if (e.startsWith("pumpkinWard:")) {
      return e;
    }
  });
  
  if (block.getComponent("minecraft:inventory")) {
    
    for (let w of wards) {
      if (!world.getDynamicProperty(w)) {
        continue;
      }
      let ward = JSON.parse(world.getDynamicProperty(w));
      
      try {
        if (ward.dimension != player.dimension.id) {
          continue;
        }
        if (!player.dimension.isChunkLoaded(ward.position)) {
          continue;
        }
      } catch (err) {
        continue;
      }
      
      if (ward.asleep) {
        continue;
      }
      if (inRange(player.location, ward.position, 32)) {
        let eatResult = jackEat(ward, w);
        if (eatResult) {
          ward = eatResult;
        } else {
          continue;
        }
        
        if (ward.trigger == "chest_interact") {
          if (ward.condition != undefined) {
            if (ward.conditionType == "block") {
              if (ward.condition != e.block.typeId) {
                continue;
              }
            }
            if (ward.conditionType == "item") {
              let equipped = player.getComponent("minecraft:equippable")?.getEquipment("Mainhand");
              if (ward.condition != equipped?.typeId) {
                continue;
              }
            }
          }
          if (!checkSwitch(ward.switch, player.dimension)) {
            continue;
          }
          if (!essenceCheck(player, ward.filter)) {
            continue;
          }
          let effectFunc = wardingDusts[ward.effect].effect;
          
          let result;
          try {
            result = effectFunc(player, ward.params);
          } catch (err) {
            system.run(() => {
              result = effectFunc(player, ward.params);
            })
          }
          
          if (result != undefined && obstructed == false) {
            obstructed = result;
          }
        }
      }
    }
    
    if (obstructed) {
      e.cancel = obstructed;
      return;
    }
    
    // Force Spell into and out of the Lectern
    if (block.typeId == "minecraft:lectern") {
      system.run(() => {
        let container = block.getComponent("minecraft:inventory").container;
        
        if (container.emptySlotsCount > 0 && item != undefined) {
          if (item.typeId == "bw:glyph_book") {
            container.setItem(0, item);
            player.getComponent("minecraft:inventory").container.setItem(player.selectedSlotIndex, undefined);
            e.cancel = true;
            return;
          }
        }
        
        if (container.emptySlotsCount == 0 && item == undefined) {
          let lecternItem = container.getItem(0);
          if (lecternItem.typeId == "bw:glyph_book") {
            container.setItem(0, undefined);
            player.getComponent("minecraft:inventory").container.setItem(player.selectedSlotIndex, lecternItem);
            e.cancel = true;
            return;
          }
        }
      });
    }
  }
});

// Place Block
world.afterEvents.playerPlaceBlock.subscribe(e => {
  let player = e.player;
  let block = e.block;
  let obstructed = false;
  
  let wards = world.getDynamicPropertyIds().filter((e) => {
    if (e.startsWith("pumpkinWard:")) {
      return e;
    }
  });
  
  if (player?.isValid) {
    for (let w of wards) {
      if (!world.getDynamicProperty(w)) {
        continue;
      }
      let ward = JSON.parse(world.getDynamicProperty(w));
      
      try {
        if (ward.dimension != player.dimension.id) {
          continue;
        }
        if (!player.dimension.isChunkLoaded(ward.position)) {
          continue;
        }
      } catch (err) {
        continue;
      }
      
      if (ward.asleep) {
        continue;
      }
      if (inRange(player.location, ward.position, 32)) {
        let eatResult = jackEat(ward, w);
        if (eatResult) {
          ward = eatResult;
        } else {
          continue;
        }
        
        if (ward.trigger == "block_place") {
          if (ward.condition != undefined) {
            if (ward.condition != block.typeId) {
              continue;
            }
          }
          if (!checkSwitch(ward.switch, player.dimension)) {
            continue;
          }
          if (!essenceCheck(player, ward.filter)) {
            continue;
          }
          let effectFunc = wardingDusts[ward.effect].effect;
          
          let result = effectFunc(player, ward.params);
          
          if (result != undefined && obstructed == false) {
            obstructed = result;
          }
        }
      }
    }
    
    if (obstructed) {
      let blockItem = block.getItemStack(1, true);
      block.dimension.spawnItem(blockItem, block.center());
      block.setType("minecraft:air");
    }
  }
});