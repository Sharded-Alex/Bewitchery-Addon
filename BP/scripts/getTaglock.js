import {world, system, ItemStack, BlockPermutation, EntityHealthComponent} from "@minecraft/server";
import {Vector3, Random} from "./VectorMath/index.js";
import {generateUniqueId} from "./curses.js";
import {diceRoll} from "./occultMagick.js";
import {addFamiliarToRegistry, createFamiliarAbilities} from "./familiars.js";

// getBottle
export function getItem(inventory, itemName, deep = false) {
  for (let i = 0; i < inventory.size; i++) {
    let itemInSlot = inventory.getItem(i);
    if (itemInSlot != undefined) {
      if (itemInSlot.typeId == itemName || (Array.isArray(itemName) && itemName.includes(itemInSlot.typeId))) {
        return true;
      }
      
      let isBundle = itemInSlot.getComponent("minecraft:inventory");
      if (isBundle && deep) {
        for (let bI = 0; bI < isBundle.size; bI++) {
          let bundleItem = isBundle.getItem(bI);
          if (bundleItem.typeId == itemName || (Array.isArray(itemName) && itemName.includes(bundleItem.typeId))) {
            return true;
          }
        }
      }
    }
  }
  return false;
}
// removeBottle
export function removeItem(inventory, itemName, deep = false) {
  for (let i = 0; i < inventory.size; i++) {
    let itemInSlot = inventory.getItem(i);
    
    if (itemInSlot != undefined) {
      
      if (itemInSlot.typeId == itemName || (Array.isArray(itemName) && itemName.includes(itemInSlot.typeId))) {
        if (itemInSlot.amount == 1) {
          inventory.setItem(i, undefined);
        } else
        if (itemInSlot.amount > 1) {
          itemInSlot.amount = itemInSlot.amount - 1;
          inventory.setItem(i, itemInSlot);
        }
        return;
      }
      
      let isBundle = itemInSlot.getComponent("minecraft:inventory");
      if (isBundle && deep) {
        for (let bI = 0; bI < isBundle.size; bI++) {
          let bundleItem = isBundle.getItem(bI);
          if (bundleItem.typeId == itemName || (Array.isArray(itemName) && itemName.includes(bundleItem.typeId))) {
            if (bundleItem.amount == 1) {
              isBundle.setItem(i, undefined);
            } else
            if (bundleItem.amount > 1) {
              bundleItem.amount = bundleItem.amount - 1;
              isBundle.setItem(i, bundleItem);
            }
            return;
          }
        }
      }
    }
  }
}
// findBottle
export function findItem(inventory, itemName, deep = false) {
  for (let i = 0; i < inventory.size; i++) {
    if (inventory.getItem(i) != undefined && inventory.getItem(i).typeId == itemName) {
      return inventory.getItem(i);
    }
    
    let itemInSlot = inventory.getItem(i);
    
    if (itemInSlot != undefined) {
      
      if (itemInSlot.typeId == itemName || (Array.isArray(itemName) && itemName.includes(itemInSlot.typeId))) {
        return itemInSlot;
      }
      
      let isBundle = itemInSlot.getComponent("minecraft:inventory");
      if (isBundle && deep) {
        for (let bI = 0; bI < isBundle.size; bI++) {
          let bundleItem = isBundle.getItem(bI);
          if (bundleItem.typeId == itemName || (Array.isArray(itemName) && itemName.includes(bundleItem.typeId))) {
            return bundleItem;
          }
        }
      }
    }
  }
}

export function getEntityFromBlood(dimension, id) {
  let entity = [];
  let dim = world.getDimension(dimension);
  dim.getEntities().forEach(e => {
    if (e.id == id) {
      entity.push(e);
    }
  });
  return entity;
}


world.afterEvents.entityHitEntity.subscribe(async (e) => {
  let entity = e.hitEntity;
  let player = e.damagingEntity;
  
  if (player.typeId == "minecraft:player") {
    // Get items
    const inv = player.getComponent("inventory").container;
    const item = inv.getItem(player.selectedSlotIndex);
    
    if (item != undefined && item.typeId == "bw:athame" && getItem(inv, "minecraft:glass_bottle")) {
      // If mob has over 100 health, no blood can be gathered
      let entityHealth = entity.getComponent("minecraft:health");
      if (entityHealth.effectiveMax > 100) {
        return;
      }
      
      if (entity.getDynamicProperty("bwDuration:protection_malice") != undefined) {
        return;
      }
      if (entity.getDynamicProperty("bwDuration:conceal") != undefined) {
        let concealment = JSON.parse(entity.getDynamicProperty("bwDuration:conceal"));
        if (diceRoll(1, 20, true) <= 5 + (concealment.amplifier*5)) {
          return;
        }
      }
      
      if (entity.typeId != "minecraft:player" && entity.isValid) {
        let info = {
          "type": entity.typeId,
          "name": entity.nameTag,
          "id": entity.id
        };
        let lore = [
          `§4Type: ${info.type}§r`,
          `§4Name: ${info.nameTag}§r`, 
          `§4ID: ${info.id}`
        ];
        let blood = new ItemStack("bw:blood_vial", 1);
        removeItem(inv, "minecraft:glass_bottle");
        blood.setLore(lore);
        blood.setDynamicProperty("bw:blood", JSON.stringify(info));
        if (inv.emptySlotsCount > 0) {
          inv.addItem(blood);
        } else {
          world.getDimension(player.dimension.id).spawnItem(blood, player.location);
        }
      }
      
      if (entity.typeId == "minecraft:player" && entity.isValid) {
        let info = {
          "type": entity.typeId,
          "name": entity.name,
          "id": entity.id
        };
        let lore = [
          `§4Type: ${info.type}§r`,
          `§4Name: ${info.name}§r`, 
          `§4ID: ${info.id}`
        ];
        let blood = new ItemStack("bw:blood_vial", 1);
        removeItem(inv, "minecraft:glass_bottle");
        blood.setLore(lore);
        blood.setDynamicProperty("bw:blood", JSON.stringify(info));
        if (inv.emptySlotsCount > 0) {
          inv.addItem(blood);
        } else {
          world.getDimension(player.dimension.id).spawnItem(blood, player.location);
        }
      }
    }
    
    if (item != undefined && item.typeId == "bw:clay_totem") {
      let effectTotem = new ItemStack("bw:filled_clay_totem", 1);
      let effects = entity.getEffects();
      let chosenEffects;
      if (effects.length > 1) {
        chosenEffects = effects[Math.round(Random.Range(0, effects.length-1))];
      } else
      if (effects.length == 1) {
        chosenEffects = effects[0];
      } else {
        return;
      }
      let effectObj = {
        "potionEffectId": chosenEffects.typeId,
        "potionAmplifier": chosenEffects.amplifier,
        "potionDuration": chosenEffects.duration
      };
      effectTotem.setDynamicProperty("bw:potionEffect", JSON.stringify(effectObj));
      effectTotem.setLore([`§gCaptured Effect: ${chosenEffects.displayName}`]);
      entity.removeEffect(chosenEffects.typeId);
      inv.setItem(player.selectedSlotIndex, undefined);
      world.getDimension(player.dimension.id).spawnItem(effectTotem, player.location);
    }
    
    if (item != undefined && item.typeId == "bw:filled_clay_totem") {
      let normalTotem = new ItemStack("bw:clay_totem", 1);
      let effect;
      if (item.getDynamicProperty("bw:potionEffect") != undefined) {
        effect = JSON.parse(item.getDynamicProperty("bw:potionEffect"));
      } else {
        return;
      }
      if (effect.potionAmplifier != undefined) {
        entity.addEffect(effect.potionEffectId, effect.potionDuration, {amplifier: effect.potionAmplifier});
      } else {
        entity.addEffect(effect.potionEffectId, effect.potionDuration);
      }
      inv.setItem(player.selectedSlotIndex, undefined);
      world.getDimension(player.dimension.id).spawnItem(normalTotem, player.location);
    }
  }
});

world.afterEvents.entityHealthChanged.subscribe(e => {
  const player = e.entity;
  const newHealth = e.newValue;
  const oldHealth = e.oldValue;
  if (!player.isValid) {
    return
  }
  let offhand = player?.getComponent("equippable")?.getEquipment("Offhand");
  if (oldHealth <= 0 && newHealth >= 1) {
    let transport = player.getDynamicProperty("bw:boundLocation");
    if (transport != undefined) {
      transport = JSON.parse(transport);
      if (transport.type == "spawnPoint") {
        let spawn = player.getSpawnPoint();
        player.teleport({x:spawn.x, y:spawn.y, z:spawn.z}, {dimension: spawn.dimension});
      }
      if (transport.type == "enderBound") {
        player.teleport({x:transport.loc.x, y:transport.loc.y, z:transport.loc.z}, {dimension: world.getDimension(transport.dimension)});
      }
      
      player.setDynamicProperty("bw:boundLocation", undefined)
    }
  }
})

world.afterEvents.itemUse.subscribe(cast => {
  let player = cast.source;
  let item = cast.itemStack;
  let inv = player.getComponent("inventory").container;
  
  if (item != undefined && item.typeId == "bw:athame" && getItem(inv, "minecraft:glass_bottle")) {
    player.applyDamage(4, {cause: "override"});
    let info = {
      "type": player.typeId,
      "name": player.name,
      "id": player.id,
      "trueSelf": player
    };
    let lore = [
      `§4Type: ${info.typeId}§r`,
      `§4Name: ${info.name}§r`, 
      `§4ID: ${info.id}`
    ];
    let blood = new ItemStack("bw:blood_vial", 1);
    removeItem(inv, "minecraft:glass_bottle");
    blood.setLore(lore);
    blood.setDynamicProperty("bw:blood", JSON.stringify(info));
    if (inv.emptySlotsCount > 0) {
      inv.addItem(blood);
    } else {
      world.getDimension(player.dimension.id).spawnItem(blood, player.location);
    }
  }
});