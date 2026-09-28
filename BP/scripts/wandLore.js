import {world, MoonPhase, system, ItemStack, ItemLockMode} from "@minecraft/server";
import {isFamiliar, addFamiliarToRegistry, isPlayerFamiliar, dismissFamiliar, returnFamiliar, createFamiliarAbilities, applyTraits} from "./familiars.js";
import {getFace} from "./wardArrays.js";
import {Vector3, Random} from "./VectorMath/index.js";

export let allAspects = {
  "spring": "§aSpring§r",
  "summer": "§6Summer§r",
  "autumn": "§nAutumn§r",
  "winter": "§bWinter§r",
  
  "nocturnal": "§bNocturnal§r",
  "diurnal": "§6Diurnal§r",
  
  "enchantment": "§dEnchantment§r",
  "evocation": "§cEvocation§r",
  "divination": "§8Divination§r",
  "conjuration": "§5Conjuration§r",
  "abjuration": "§eAbjuration§r",
  "transmutation": "§6Transmutation§r",
  
  "malefic": "§4Malefic§r",
  "blessing": "§eBlessing§r",
  "water": "§sWater§r",
  "fire": "§cFire§r",
  "mineral": "§iMineral§r",
  "occult": "§dOccult§r",
  "weather": "§8Weather§r",
  "life": "§aLife§r",
  "spirit": "§bSpirit§r",
  "mental": "§dMental§r"
}
function generateUniqueId (length) {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    id += characters[randomIndex];
  }
  return id;
}
export function capitalize(phrase) {
  let word = "";
  for (let i = 0; i < phrase.length; i++) {
    if (i == 0) {
      word += phrase[i].toUpperCase();
    } else {
      word += phrase[i];
    }
  }
  return word;
}
export function getAspectName(str) {
  if (allAspects[str] != undefined) {
    return allAspects[str];
  } else {
    return capitalize(str);
  }
}


function craftWand(loc, dim, creator, concepts, wood, focusName = undefined, focusType = undefined) {
  let wand = new ItemStack(`bw:${wood}_wand`, 1);
  
  let lores = [];
  if (Object.keys(concepts).length == 0) {
    lores.push(`§rCore: None§r`);
  } else {
    // Rework this to read Cost Increases as well
    if (focusType != undefined) {
      lores.push(`§rCore: ${focusName}§r`);
    }
    
    for (let [key, value] of Object.entries(concepts)) {
      if (value != 0) {
        if (value > 0) {
          lores.push(`§r${value}% ${getAspectName(key)} Cost Decrease§r`);
        } else {
          lores.push(`§r${Math.abs(value)}% ${getAspectName(key)} Cost Increase§r`);
        }
      }
    }
  }
  wand.setDynamicProperty(`bw:wandTags`, JSON.stringify(concepts));
  wand.setLore(lores);
  if (focusType != undefined) {
    wand.setDynamicProperty(`bw:wandCore`, focusType);
  }
  wand.setDynamicProperty("bw:wand_id", `${generateUniqueId(14)}`);
  wand.setDynamicProperty("bw:wand_owner", creator);
  
  world.getDimension(dim).spawnItem(wand, loc);
}

// Brooms
const allBrooms = {
  "bw:default_broom": "bw:normal_broom_item",
  "bw:oak_broom": "bw:normal_broom_item"
}
// Wand Woods
let saplings = {
  "minecraft:oak_sapling": {
    "base": "oak",
    "aspects": {
      "spring": 10,
      "summer": 10,
      "autumn": 10,
      "winter": 10
    }
  },
  "minecraft:dark_oak_sapling": {
    "base": "dark_oak",
    "aspects": {
      "malefic": 30,
      "evocation": 10
    }
  },
  "minecraft:birch_sapling": {
    "base": "birch",
    "aspects": {
      "abjuration": 20,
      "enchantment": 15,
      "life": 10
    }
  },
  "minecraft:jungle_sapling": {
    "base": "jungle",
    "aspects": {
      "abjuration": -25,
      "evocation": 25,
      "malefic": 25,
      "life": 10
    }
  },
  "minecraft:acacia_sapling": {
    "base": "acacia",
    "aspects": {
      "water": -30,
      "summer": 10,
      "fire": 15,
      "evocation": 15
    }
  },
  "minecraft:spruce_sapling": {
    "base": "spruce",
    "aspects": {
      "emmission": 15,
      "burst": 15,
      "winter": 10,
      "evocation": 10
    }
  }
}
// Wand Cores
export const cores = {
  "minecraft:armadillo_scute": {
    "name": "Armadillo Scute",
    "type": "minecraft:armadillo_scute",
    "aspects": {
      "mineral": 10,
      "abjuration": 10
    }
  },
  "minecraft:blaze_powder": {
    "name": "Blaze Powder",
    "type": "minecraft:blaze_powder",
    "aspects": {
      "fire": 10,
      "evocation": 10
    }
  },
  "bw:blood_bottle": {
    "name": "Bottle O' Blood",
    "type": "bw:blood_bottle",
    "aspects": {
      "life": 10,
      "malefic": 10
    }
  }, // *
  "minecraft:bone": {
    "name": "Bone",
    "type": "minecraft:bone",
    "aspects": {
      "autumn": 10,
      "life": 10,
      "malefic": 10
    }
  },
  "minecraft:brain_coral": {
    "name": "Brain Coral",
    "type": "minecraft:brain_coral",
    "aspects": {
      "mental": 10,
      "water": 10
    }
  },
  "minecraft:bubble_coral": {
    "name": "Bubble Coral",
    "type": "minecraft:bubble_coral",
    "aspects": {
      "abjuration": 10,
      "water": 10
    }
  },
  "minecraft:fire_coral": {
    "name": "Fire Coral",
    "type": "minecraft:fire_coral",
    "aspects": {
      "water": 10,
      "fire": 10
    }
  },
  "minecraft:horn_coral": {
    "name": "Horn Coral",
    "type": "minecraft:horn_coral",
    "aspects": {
      "water": 10,
      "evocation": 10
    }
  },
  "minecraft:tube_coral": {
    "name": "Tube Coral",
    "type": "minecraft:tube_coral",
    "aspects": {
      "water": 10,
      "utility": 10
    }
  },
  "minecraft:dead_coral": {
    "name": "Dead Coral",
    "type": "minecraft:dead_coral",
    "aspects": {
      "autumn": 10,
      "spirit": 10
    }
  },
  "minecraft:ender_pearl": {
    "name": "Ender Pearl",
    "type": "minecraft:ender_pearl",
    "aspects": {
      "nocturnal": 10,
      "conjuration": 10
    }
  },
  "minecraft:feather": {
    "name": "Feather",
    "type": "minecraft:feather",
    "aspects": {
      "enchantment": 10,
      "weather": 10
    }
  },
  "minecraft:ghast_tear": {
    "name": "Ghast Tear",
    "type": "minecraft:ghast_tear",
    "aspects": {
      "abjuration": 10,
      "fire": 10,
      "spirit": 10
    }
  },
  "minecraft:ink_sac": {
    "name": "Ink Sac",
    "type": "minecraft:ink_sac",
    "aspects": {
      "binding": 10,
      "malefic": 10
    }
  },
  "minecraft:glow_ink_sac": {
    "name": "Glowing Ink Sac",
    "type": "minecraft:glow_ink_sac",
    "aspects": {
      "celestial": 10,
      "water": 10
    }
  },
  "minecraft:goat_horn": {
    "name": "Goat Horn",
    "type": "minecraft:goat_horn",
    "aspects": {
      "weather": 10,
      "life": 10,
      "mineral": 10
    }
  },
  "minecraft:magma_cream": {
    "name": "Magma Cream",
    "type": "minecraft:magma_cream",
    "aspects": {
      "fire": 10,
      "diurnal": 10
    }
  },
  "minecraft:nautilus_shell": {
    "name": "Nautilus Shell",
    "type": "minecraft:nautilus_shell",
    "aspects": {
      "water": 10,
      "abjuration": 10
    }
  },
  "minecraft:rabbit_foot": {
    "name": "Rabbit Foot",
    "type": "minecraft:rabbit_foot",
    "aspects": {
      "blessing": 10,
      "spring": 10
    }
  },
  "minecraft:rotten_flesh": {
    "name": "Rotten Flesh",
    "type": "minecraft:rotten_flesh",
    "aspects": {
      "malefic": 10,
      "autumn": 10
    }
  },
  "minecraft:sculk_catalyst": {
    "name": "Sculk Catalyst",
    "type": "minecraft:sculk_catalyst",
    "aspects": {
      "transmutation": 10,
      "autumn": 10
    }
  },
  "minecraft:turtle_scute": {
    "name": "Turtle Scute",
    "type": "minecraft:turtle_scute",
    "aspects": {
      "abjuration": 10,
      "life": 10,
      "water": 10
    }
  },
  "minecraft:shulker_shell": {
    "name": "Shulker Shell",
    "type": "minecraft:shulker_shell",
    "aspects": {
      "abjuration": 10,
      "enchantment": 10
    }
  }, // *
  "minecraft:slime_ball": {
    "name": "Slime Ball",
    "type": "minecraft:slime_ball",
    "aspects": {
      "binding": 10,
      "occult": 10
    }
  }, // *
  "minecraft:string": {
    "name": "String",
    "type": "minecraft:string",
    "aspects": {
      "binding": 10,
      "utility": 10,
      "mental": 10
    }
  }, // *
  "minecraft:dragon_breath": {
    "name": "Dragon's Breath",
    "type": "minecraft:dragon_breath",
    "aspects": {
      "binding": 10,
      "celestial": 10
    }
  }, // *
  "minecraft:spider_eye": {
    "name": "Spider Eye",
    "type": "minecraft:spider_eye",
    "aspects": {
      "malefic": 10,
      "divination": 10,
      "occult": 10
    }
  }
}

const WandLore = {
  onUseOn(event) {
    let player = event.source
    let block = event.usedOnBlockPermutation;
    
    if (Object.keys(saplings).includes(block.type.id)) {
      let aspects = saplings[block.type.id].aspects;
      
      let item = player.dimension.getEntitiesAtBlockLocation(event.block.location)[0];
      let focus = item?.getComponent("item").itemStack;
      if (focus == undefined) {
        craftWand(event.block.location, player.dimension.id, player.id, aspects, saplings[block.type.id].base);
        event.block.dimension.spawnParticle("minecraft:crop_growth_emitter", event.block.center());
        event.block.setType("minecraft:air");
      } else {
        if (cores[focus.typeId] != undefined && focus.amount == 1) {
          for (let [k, v] of Object.entries(cores[focus.typeId].aspects)) {
            aspects[k] = v;
          }
          craftWand(event.block.location, player.dimension.id, player.id, aspects, saplings[block.type.id].base, cores[focus.typeId].name, cores[focus.typeId].type);
          event.block.dimension.spawnParticle("minecraft:crop_growth_emitter", event.block.center());
          item.remove()
          event.block.setType("minecraft:air");
        } else {
          player.sendMessage("§cEither this is not a valid core OR you threw down more than 1 of the item.§r");
          return;
        }
      }
    }
  }
};
const RideBroom = {
  onUse(event) {
    const item = event.itemStack;
    const player = event.source;
    
    let rBroom = [
      "bw:default_broom",
      "bw:oak_broom"
    ];
    let chosen = rBroom[Math.floor(Math.random() * rBroom.length)];
    
    let damageAmt = item.getDynamicProperty("bw:broomDmg");
    if (damageAmt == undefined) {
      damageAmt = 10;
    }
    
    let dur = item.getComponent("minecraft:durability");
    if (dur == undefined) {
      return;
    }
    
    if (dur.damage + damageAmt < (dur.maxDurability - damageAmt)) {
      let broom = world.getDimension(player.dimension.id).spawnEntity(rBroom[0], player.location);
      
      let dye = item.getComponent("minecraft:dyeable");
      if (dye != undefined) {
        if (dye?.color == undefined) {
          dye = {
            red: 0.65,
            green: 0.65,
            blue: 0.65
          };
        } else {
          dye = dye.color;
        }
      } else {
        dye = {
          red: 0.65,
          green: 0.65,
          blue: 0.65
        }
      }
      
      broom.getComponent("minecraft:rideable").addRider(player);
      broom.setDynamicProperty("bwBroom:owner", player.id);
      
      broom.setProperty("bw:red_color", dye.red);
      broom.setProperty("bw:blue_color", dye.blue);
      broom.setProperty("bw:green_color", dye.green);
      broom.setProperty("bw:durability", dur.damage + damageAmt);
      broom.setProperty("bw:dmg", damageAmt);
      
      system.run(() => {
        broom.getComponent("minecraft:tameable")?.tame(player);
        player.getComponent("inventory").container.setItem(player.selectedSlotIndex, undefined);
      })
    }
  }
}
const FamiliarTrinket = {
  onUse(event) {
    const item = event.itemStack;
    const player = event.source;
    let inv = player.getComponent("inventory").container;
    let slot = player.selectedSlotIndex;
    
    if (slot == undefined) {
      return;
    }
    
    let spirit = item.getDynamicProperty("bw:savedFamiliar");
    if (!spirit) {
      let seenEntity = player.getEntitiesFromViewDirection(
        { 
          "ignoreBlockCollision": false, 
          "includeLiquidBlocks": false, 
          "includePassableBlocks": false,
          "maxDistance": 7
        }
      )[0];
      
      if (seenEntity != undefined) {
        // Bind new Familiar
        if (item.getDynamicProperty("spriteWithin")) {
          if (isFamiliar(seenEntity.entity)) {
            player.sendMessage("§c[!]§r This creature is already a Familiar.");
            inv.setItem(slot, item);
            return;
          }
          
          let spriteType = item.getDynamicProperty("spriteWithin");
          let idOwner = item.getDynamicProperty("spriteConjurer");
          if (seenEntity.entity.typeId == spriteType && player.id == idOwner) {
            let trueSoul = generateUniqueId(13);
            // Save general and important familiar info to World
            // They can also draw in Orbos
            // Mood is a spectrum from foul to excellent
            // - Using a brush while looking at the familiar brushes them.
            // - Feeding them their healing foods should also help.
            // - A familiar in a foul mood does not use any of its player assisting abilities.
            // - A familiar in a foul mood does not allow their witch to draw Orbos from them, and does not help with rituals.
            // - Occasionally, foul mood particles will rise from them.
            let obj = {
              "identity": trueSoul,
              "mood": 20,
              "lastLocation": seenEntity.entity.location,
              "lastDimension": seenEntity.entity.dimension.id,
              
              "owner": player.id,
              "spriteType": seenEntity.entity.typeId,
              "traits": {},
              "dismissed": false
            }
            obj.traits = createFamiliarAbilities(seenEntity.entity);
            
            let foods = ["bw:raw_orbos"];
            let feedable = seenEntity.entity.getComponent("minecraft:healable");
            if (feedable) {
              let feed = feedable.getFeedItems();
              if (feed.length > 0) {
                feed.forEach((e) => {
                  let i = e.item;
                  if (!i.includes(":")) {
                    i = `minecraft:${i}`;
                  }
                  if (!foods.includes(i)) {
                    foods.push(i);
                  }
                });
              }
            }
            
            if (foods.length > 0) {
              obj.eatables = foods;
            }
            
            if (obj.eatables?.length > 0) {
              let r = Math.floor(obj.eatables.length * Math.random());
              
              obj.favoriteFood = obj.eatables[r];
            }
            
            obj.moodTraits = applyTraits();
            
            world.setDynamicProperty(`bw:isFamiliar_${trueSoul}_${player.id}`, JSON.stringify(obj));
            seenEntity.entity.setDynamicProperty("bw:originalSoul", trueSoul);
            
            // Register familiar in familiar Registry
            addFamiliarToRegistry(seenEntity.entity, `bw:isFamiliar_${trueSoul}_${player.id}`);
            item.setDynamicProperty("spriteWithin", undefined);
            item.setDynamicProperty("spriteConjurer", undefined);
            
            if (seenEntity.entity.getComponent("minecraft:tameable")) {
              let c = seenEntity.entity.getComponent("minecraft:tameable").tame(player);
            }
            inv.setItem(slot, item);
          }
        }
      }
    }
    
  },
  hitEntity(event) {
    console.log(event);
    /*
    const item = event.itemStack;
    const player = event.source;
    const entity = event.hitEntity;
    let inv = player.getComponent("inventory").container;
    let slot = player.selectedSlotIndex;
    
    if (slot == undefined) {
      return;
    }
    */
    
  },
  onUseOn(event) {
    const item = event.itemStack;
    const block = event.block;
    const player = event.source;
    let inv = player.getComponent("inventory").container;
    let slot = player.selectedSlotIndex;
    
    if (slot == undefined) {
      return;
    }
    
    let spirit = item.getDynamicProperty("bw:savedFamiliar");
    if (spirit) {
      if (player.isSneaking) {
        let face = getFace(event.blockFace);
        let hitBlk = Vector3.add(face, block.center());
        
        let familiarProperty = `bw:isFamiliar_${spirit}_${player.id}`;
        
        // The owner hasn't used this trinket or the Familiar no longer exists.
        if (!world.getDynamicProperty(familiarProperty)) {
          player.sendMessage(`§c[!]§r No Familiar of yours is bound to this Trinket.`);
          return;
        }
        
        let familiarSpirit = JSON.parse(world.getDynamicProperty(familiarProperty));
        
        if (item.getDynamicProperty("bw:captureID") != familiarSpirit.dismissCode) {
          if (familiarSpirit.dismissCode == undefined) {
            player.sendMessage(`§c[!]§r Your Familiar is not bound to §aany§r Trinket. It was summoned into the world, and has not returned to its pocket of the Wylde.`);
          } else
          if (familiarSpirit.dismissCode == "deceased") {
            player.sendMessage(`§c[!]§r Your Familiar was killed somehow. Fortunately, no Familiar truly dies. It may be resurrected through Ceremony.`);
          } else {
            player.sendMessage(`§c[!]§r This Trinket is no longer a valid portal to your Familiar. You must either find and use the correct Trinket or summon it through Ceremony.`);
          }
          
          item.setDynamicProperty("bw:savedFamiliar", undefined);
          item.setDynamicProperty("bw:captureID", undefined);
          item.setLore([]);
          inv.setItem(slot, item);
          return;
        }
        
        let structureName = `familiarBox:${spirit}_${player.id}`;
        
        world.structureManager.place(structureName, player.dimension, hitBlk, {includeBlocks: false, includeEntities: true, waterlogged: true});
        item.setDynamicProperty("bw:savedFamiliar", undefined);
        item.setDynamicProperty("bw:captureID", undefined);
        item.setLore([]);
        returnFamiliar(familiarProperty);
        
        inv.setItem(slot, item);
      }
    }
  }
}

system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("bw:wandWood", WandLore);
  itemComponentRegistry.registerCustomComponent("bw:wand_personality", {});
  itemComponentRegistry.registerCustomComponent("bw:wand_visuals", {});
  itemComponentRegistry.registerCustomComponent("bw:readable_book", {});
  itemComponentRegistry.registerCustomComponent("bw:rideBroom", RideBroom);
  itemComponentRegistry.registerCustomComponent("bw:familiar_container", FamiliarTrinket);
});

world.afterEvents.dataDrivenEntityTrigger.subscribe(b => {
  let broom = b.entity;
  let broomEvent = b.eventId;
  
  if (Object.keys(allBrooms).includes(broom?.typeId)) {
    // Insert Code
    if (broomEvent == "bw:become_broom") {
      let broomItem = new ItemStack(allBrooms[broom?.typeId], 1);
      
      broomItem.getComponent("minecraft:dyeable").color = {
        red: broom.getProperty("bw:red_color"),
        green: broom.getProperty("bw:green_color"),
        blue: broom.getProperty("bw:blue_color")
      }
      
      broomItem.getComponent("minecraft:durability").damage = broom.getProperty("bw:durability");
      
      broomItem.setDynamicProperty("bw:broomDmg", broom.getProperty("bw:dmg"));
      broom.dimension.spawnItem(broomItem, broom.location);
      broom.remove();
    }
  }
  
});