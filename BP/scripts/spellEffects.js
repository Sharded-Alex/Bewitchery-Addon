import {world, system, Player, ItemStack} from "@minecraft/server";
import {diceRoll} from "./occultMagick.js";
import {getItem, removeItem} from "./getTaglock.js";
import {titaniaPlants} from "./curses.js";
import {getNewDamageType, applySpellDamage} from "./spellDamage.js";
import {getSourceFromSpell} from "./spellDraw.js";
import {Vector3} from "./VectorMath/index.js";
import {calculateAngle, reflect} from "./spellProjectiles.js";
import {potionEffects} from "./consumePotion.js";
import {isFamiliar, getPresentFamiliarPowers, dismissFamiliar} from "./familiars.js";

export function getCastingInv(info, target) {
  let source = getSourceFromSpell(info);
  if (info.type == "entity") {
    let entity = world.getEntity(info.sourceID);
    
    if (entity != undefined) {
      if (target.dimension.id == entity.dimension.id) {
        let inv = entity.getComponent("minecraft:inventory");
        if (inv != undefined) {
          return inv;
        }
      }
    }
  }
  if (info.type == "jack") {
    let jackOWard = world.getDynamicProperty(info.sourceID);
    
    if (jackOWard != undefined) {
      jackOWard = JSON.parse(jackOWard);
      
      if (jackOWard.effect == "bw:amethyst_dust") {
        let lecternPos = {
          x: jackOWard.params[1].x,
          y: jackOWard.params[1].y - 1,
          z: jackOWard.params[1].z
        };
        
        if (target.dimension.isChunkLoaded(lecternPos)) {
          let storageBlk = target.dimension.getBlock(lecternPos);
          
          let inv = storageBlk.getComponent("minecraft:inventory");
          if (inv != undefined) {
            return inv;
          }
        }
      }
    }
  }
  
  return false;
}

export function addHunger(player, amount) {
  let hunger = player?.hasComponent("minecraft:player.hunger");
  if (hunger) {
    let currValue = hunger.currentValue;
    if (currValue == hunger.effectiveMax) {
      return false;
    }
    
    let newVal = currValue + amount;
    if (newVal <= hunger.effectiveMax) {
      hunger.setCurrentValue(newVal);
    } else {
      hunger.setCurrentValue(hunger.effectiveMax);
    }
    return true;
  } else {
    return false;
  }
}

world.afterEvents.itemCompleteUse.subscribe(event => {
  let item = event.itemStack;
  let orbos = world.scoreboard.getObjective("bw:oEnergy");
  let player = event.source;
  
  if (item != undefined && item.typeId == "minecraft:milk_bucket") {
    let allProperties = player.getDynamicPropertyIds();
      let revisedEffects = [];
    for (let p of allProperties) {
      if (p.startsWith("bwDuration:")) {
        let effect = JSON.parse(player.getDynamicProperty(p));
        if (effect.vanishOnDeath != undefined && !effect.vanishOnDeath) {
          player.setDynamicProperty(p, undefined);
        }
      }
    }
    
  }
  
  if (player.isValid && player.getDynamicProperty("bwDuration:honey_blessed") != undefined) {
    let honeyBlessingObj = JSON.parse(player.getDynamicProperty("bwDuration:honey_blessed"));
    
    if (item?.typeId == "minecraft:honey_bottle") {
      let entityHealth = player.getComponent("minecraft:health");
      entityHealth.setCurrentValue(entityHealth?.effectiveMax);
    }
  }
  
  if (player.isValid && player.getDynamicProperty("bwDuration:bounty_of_the_forest") != undefined) {
    let appleObj = JSON.parse(player.getDynamicProperty("bwDuration:bounty_of_the_forest"));
    
    if (item?.typeId == "minecraft:apple") {
      if (!appleObj.inversed) {
        player.addEffect("absorption", (appleObj.amplifier+1)*15*20, {
          showParticles: true,
          amplifier: 1
        });
        player.addEffect("regeneration", (appleObj.amplifier+1)*15*20, {
          showParticles: true
        });
      } else {
          player.removeEffect("minecraft:absorption");
          player.removeEffect("minecraft:regeneration");
          player.addEffect("minecraft:poison", (appleObj.amplifier+1)*15*20, {
            showParticles: true
          });
          player.addEffect("minecraft:nausea", (appleObj.amplifier+1)*15*20, {
            amplifier: 2,
            showParticles: true
          });
        
      }
    }
  }
  
  if (item != undefined && item.typeId == "bw:raw_orbos") {
    let orbos = world.scoreboard.getObjective("bw:oEnergy");
    orbos.addScore(player, 30);
    player.onScreenDisplay.setActionBar(`§d[Orbos| ${orbos?.getScore(player)}]`);
  }
  
  let powers = getPresentFamiliarPowers(player, true);
  if (true || powers.includes("Carrot Sprint")) {
    let carrots = [
      "minecraft:carrot",
      "minecraft:golden_carrot"
    ];
    
    if (carrots.includes(item.typeId)) {
      player.addEffect("minecraft:speed", 200, {amplifier: 1, showParticles: false});
      addHunger(player, 1);
    }
  }
  /*
  if (item != undefined && item.typeId == "minecraft:apple") {
    player.sendMessage(`Titania seeks vengeance against you.`)
    let obj = {
      timer: 60,
      endMsg: `§a[!]§r Titania opens her arms to you once more.`,
      vanishOnDeath: false
    }
    player.setDynamicProperty("bwDuration:titania_hexed", JSON.stringify(obj));
    console.warn(player.getDynamicProperty("bwDuration:titania_hexed"))
  }
  */
});

world.afterEvents.entityHitEntity.subscribe(e => {
  let entity = e.hitEntity;
  let player = e.damagingEntity;
  
  if (entity?.isValid && entity.getDynamicProperty("bwDuration:thorns") != undefined) {
    let thornsObj = JSON.parse(entity.getDynamicProperty("bwDuration:thorns"));
    if (player.isValid) {
      let dist = Vector3.distance(player.getAABB().center, entity.getAABB().center);
      if (dist <= 3) {
        if (!thornsObj.inversed && !player.getDynamicProperty("bwDuration:stone_skin")) {
          let power = thornsObj.amplifier;
          if (power > 4) {
            power = 4;
          }
          
          applySpellDamage(entity, 1+power, "piercing", 0);
        }
      }
    }
  }
  
  if (entity?.isValid && entity.getDynamicProperty("bwDuration:food_chain") != undefined) {
    let preyObj = JSON.parse(entity.getDynamicProperty("bwDuration:food_chain"));
    if (player.isValid) {
      let predatorObj = player.getDynamicProperty("bwDuration:food_chain");
      if (predatorObj != undefined) {
        predatorObj = JSON.parse(predatorObj);
      }
      
      if (preyObj?.inversed && predatorObj?.inversed == false) {
        entity.applyDamage(2*(preyObj.amplifier+1), {cause:"entityAttack", damagingEntity: player});
      }
    }
  }
  
  if (entity.isValid && entity.getDynamicProperty("bwDuration:titania_protected") != undefined) {
    let forestProtection = JSON.parse(entity.getDynamicProperty("bwDuration:titania_protected"));
    if (player.isValid && entity instanceof Player) {
      
      let wolves = entity.dimension.getEntities({includeFamilies: ["wolf"], location: entity.location, maxDistance: 12});
      
      for (let wolf of wolves) {
        if (wolf.getComponent("tameable") != undefined) {
          if (!wolf.getComponent("tameable").isTamed) {
            wolf.getComponent("tameable").tame(entity);
            let obj = {
              timer: 30,
              endMsg: ``,
              vanishOnDeath: true
            }
            wolf.setDynamicProperty("bwDuration:titanianTamed", JSON.stringify(obj));
          }
        }
      }
      
    }
  }
  
  if (player.isValid && player.getDynamicProperty("bwDuration:hebayanCombat") != undefined) {
    let hebayanCombat = JSON.parse(player.getDynamicProperty("bwDuration:hebayanCombat"));
    
    if (entity.isValid) {
      let effects = player.getEffects();
      let fx;
      
      for (let effect of effects) {
        if (effect == undefined) {
          continue;
        }
        for (let e of potionEffects) {
          if (e.effect == effect.typeId && e.type == "negative") {
            fx = effect;
          }
        }
      }
      if (fx != undefined) {
        entity.addEffect(fx.typeId, fx.duration, {amplifier: fx.amplifier});
        player.removeEffect(fx.typeId);
      }
    }
  }
});

world.beforeEvents.effectAdd.subscribe(event => {
  let effect = event.effectType;
  let player = event.entity;
  let orbos = world.scoreboard.getObjective("bw:oEnergy");
  
  let effectObj;
  if (player.isValid && (player.getDynamicProperty("bwDuration:negativeImmunity") != undefined || player.getDynamicProperty("bwDuration:protection_malice") != undefined)) {
    for (let e of potionEffects) {
      if (e.name == effect && e.type == "negative") {
        event.cancel = true;
      }
    }
  }
  
  
  if (player.isValid && player.getDynamicProperty("bwDuration:regen_immunity") != undefined) {
    for (let e of potionEffects) {
      if (e.name == "minecraft:regeneration") {
        event.cancel = true;
      }
    }
  }
  if (player.isValid && player.getDynamicProperty("bwDuration:healthBoost_immunity") != undefined) {
    for (let e of potionEffects) {
      if (e.name == "minecraft:health_boost") {
        event.cancel = true;
      }
    }
  }
});

// Edit damage stuffs
// Familiar death dismissal
world.beforeEvents.entityHurt.subscribe(e => {
  let dmg = e.damage;
  let entity = e.hurtEntity;
  let dmgCause = e.damageSource.cause;
  let attacker = e.damageSource.damagingEntity;
  let attackingProjectile = e.damageSource.damagingEntity;
  
  if (dmg == 0.00107) {
    // This is likely inflammatory
    console.warn("Inflammatory!")
    e.cancel;
    return;
  }
  
  // Subtract some of the damage
  if (entity.isValid && entity.getDynamicProperty("bwDuration:stone_skin") != undefined) {
    let stoneSkinObj = JSON.parse(entity.getDynamicProperty("bwDuration:stone_skin"));
    
    if (entityHealth && dmgCause == "entityAttack") {
      if (attacker || attackingProjectile) {
        let hasPickaxe = false;
        if (attacker) {
          let equippable = attacker.getComponent("minecraft:equippable");
          if (equippable) {
            if (equippable.getEquipment("Mainhand")?.hasTag("minecraft:is_pickaxe")) {
              hasPickaxe = true;
            }
          }
        }
        
        if (hasPickaxe) {
          if (dmg == 0) {
            dmg = 2;
          } else {
            dmg = dmg*1.5;
          }
        } else {
          dmg = dmg*0.5;
        }
      }
    }
  }
  
  if (entity.isValid && entity.getDynamicProperty("bwDuration:debauched_frenzy") != undefined) {
    let frenzyObj = JSON.parse(entity.getDynamicProperty("bwDuration:debauched_frenzy"));
    let entityHealth = entity.getComponent("minecraft:health");
    
    let health = entityHealth?.currentValue;
    let maxHealth = entityHealth?.effectiveMax;
    let percentage = Math.round((health/maxHealth)*100);
    
    if (percentage <= 40 && (dmgCause == "entityAttack" || dmgCause == "projectile")) {
      if (diceRoll(1, 20, true) >= frenzyObj.diceSave) {
        if (!entity.getDynamicProperty("bwDuration:bleed")) {
          if (entity.typeId == "minecraft:player") {
            entity.sendMessage(`§c[!]§r Your body bleeds its lifeblood, draining you of life.`)
          }
          let obj = {
            timer: 5,
            endMsg: "§a[!]§r Your bleeding ceases.",
            vanishOnDeath: true
          }
          entity.setDynamicProperty("bwDuration:bleed", JSON.stringify(obj))
        }
      }
    }
  }
  
  if (entity?.isValid && entity.getDynamicProperty("bwDuration:eggshell_protection") != undefined) {
    let eggShellObj = JSON.parse(entity.getDynamicProperty("bwDuration:eggshell_protection"));
    
    let damageType = getNewDamageType(dmgCause);
    
    const eggWardedDamage = [
      "blunt",
      "burn",
      "shock",
      "occult"
    ]
    
    if (eggWardedDamage.includes(damageType)) {
      let dmgReduced = eggShellObj.amplifier+1;
      
      let inventory = getCastingInv(eggShellObj.caster, entity);
      
      if (inventory) {
        let foundItem = getItem(inventory.container, ["minecraft:egg", "minecraft:brown_egg", "minecraft:blue_egg"], true);
        
        if (foundItem) {
          system.run(() => {
            removeItem(inventory.container, ["minecraft:egg", "minecraft:brown_egg", "minecraft:blue_egg"], true);
            entity.dimension.playSound("random.explode", entity.location);
          })
          
          dmg = dmg - dmgReduced;
          if (dmg < 0) {
            e.cancel;
            return;
          }
        }
      }
    }
  }
  
  if (entity?.isValid && isFamiliar(entity)) {
    let famInfo = isFamiliar(entity);
    let entityHealth = entity.getComponent("minecraft:health");
    
    // If holding trinket, trap/get familiar;
    let equipped = attacker?.getComponent("minecraft:equippable");
    let itemHeld = equipped?.getEquipment("Mainhand");
    if (itemHeld != undefined) {
      if (itemHeld.getComponent("bw:familiar_container")) {
        let spirit = item.getDynamicProperty("bw:savedFamiliar");
        
        if (!spirit) {
          if (isPlayerFamiliar(attacker, entity)) {
            e.cancel = true;
            let fam = entity;
            let trueSoul = fam.getDynamicProperty("bw:originalSoul")
            let hRange = fam.dimension.heightRange;
            let pos = {
              x: Math.floor(fam.location.x)+0.5,
              y: hRange.min + 2 + 0.5,
              z: Math.floor(fam.location.z) + 0.5
            }
            fam.teleport(pos);
            let structureName = `familiarBox:${trueSoul}_${player.id}`;
            // Checks if the structure already exist. If it does, delete it.
            if (world.structureManager.get(structureName) != undefined) {
              world.structureManager.delete(structureName);
            }
            world.structureManager.createFromWorld(structureName, fam.dimension, pos, pos, {includeBlocks: false, includeEntities: true, saveMode: "World"});
            
            // Give the familiar a dismissal codes so trinket duplicates are impossible.
            // If the familiar was summoned, this is naturally become undefined. No trinket can then summon the Familiar.
            let captureID = `${fam.id}-${generateUniqueId(13)}`;
            
            let familiarSpirit = JSON.parse(world.getDynamicProperty(`bw:isFamiliar_${trueSoul}_${attacker.id}`));
            familiarSpirit.dismissCode = captureID;
            
            if (familiarSpirit.spriteType == undefined) {
              familiarSpirit.spriteType = fam.typeId
            }
            world.setDynamicProperty(`bw:isFamiliar_${trueSoul}_${attacker.id}`, JSON.stringify(familiarSpirit));
            
            itemHeld.setDynamicProperty("bw:savedFamiliar", trueSoul);
            itemHeld.setDynamicProperty("bw:captureID", captureID);
            
            let loreStr = [];
            
            if (fam.nameTag) {
              loreStr.push(`§rName: ${fam.nameTag}`);
            }
            if (familiarSpirit.mood) {
              loreStr.push(`§rMood: ${familiarSpirit.mood}`);
            }
            if (attacker.name) {
              loreStr.push(`§rOwner: ${attacker.name}`);
            }
            if (familiarSpirit.lore != undefined) {
              loreStr.push(` `);
              loreStr.push(`§r${familiarSpirit.lore}§r`);
            }
            
            itemHeld.setLore(loreStr);
            
            dismissFamiliar(attacker, fam);
            equipped.setItem("Mainhand", itemHeld);
            return;
          }
        }
      }
    }
    
    // Entity is dying
    if (Math.ceil(entityHealth.currentValue) <= Math.floor(dmg)) {
      e.cancel = true;
      system.run(() => {
        let hRange = entity.dimension.heightRange;
        let pos = {
          x: Math.floor(entity.location.x)+0.5,
          y: hRange.min + 2 + 0.5,
          z: Math.floor(entity.location.z) + 0.5
        }
        entity.teleport(pos);
        let structureName = `familiarBox:${famInfo[0]}_${famInfo[1]}`;
        // Checks if the structure already exist. If it does, delete it.
        if (world.structureManager.get(structureName) != undefined) {
          world.structureManager.delete(structureName);
        }
        world.structureManager.createFromWorld(structureName, entity.dimension, pos, pos, {includeBlocks: false, includeEntities: true, saveMode: "World"});
        
        
        let familiarSpirit = JSON.parse(world.getDynamicProperty(`bw:isFamiliar_${famInfo[0]}_${famInfo[1]}`));
        familiarSpirit.dismissCode = "deceased";
        familiarSpirit.isDead = true;
        world.setDynamicProperty(`bw:isFamiliar_${famInfo[0]}_${famInfo[1]}`, JSON.stringify(familiarSpirit));
        // Dismiss Familiar
        dismissFamiliar(famInfo[1], entity);
      });
    }
  }
});

/*
// Base direction vector
let baseDirX = 1;
let baseDirY = 0;

// Spread parameters
let maxSpreadAngle = 0.26; // Approx 15 degrees in radians

// 1. Generate random angle deviation 
let angleOffset = (Math.random() - 0.5) * maxSpreadAngle; 

// 2. Apply rotation to the base vector using trig
let randomDirX = baseDirX * Math.cos(angleOffset) - baseDirY * Math.sin(angleOffset);
let randomDirY = baseDirX * Math.sin(angleOffset) + baseDirY * Math.cos(angleOffset);

// 3. Scale by desired projectile speed
let speed = 10;
let projectileVelocity = {
  x: randomDirX * speed,
  y: randomDirY * speed
};

*/

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}
function toDegrees(radians) {
  return radians / (Math.PI / 180);
}

export function parryBolt(entity, player, bombardable = false) {
  let pLoc = player.getHeadLocation();
  let viewDir = player.getViewDirection();
  let proj = entity.getComponent("minecraft:projectile");
  // If the to-be parrier is the owner, return
  if (proj.owner?.id == player.id) {
    return;
  }
  
  let spell = entity?.getDynamicProperty("bw:spellSaved");
  if (spell) {
    spell = JSON.parse(spell);
  }
  const eLoc = entity.getAABB().center;
  const toEntityVec = {
    x: eLoc.x - pLoc.x,
    y: eLoc.y - pLoc.y,
    z: eLoc.z - pLoc.z
  };
  const distance = Vector3.magnitude(toEntityVec);
  
  const angle = calculateAngle(viewDir, toEntityVec);
  if (angle >= -45 && angle <= 45) {
    // If more than 2.5 blocks away from the parrier but still in range to be detectable, it's a failed parry
    if (distance > 2.5) {
      if (!bombardable) {
        player.setDynamicProperty("bw:boltParryCooldown", Date.now());
        console.warn("Tried parrying too early!!")
      }
      return;
    }
    
    // Get bolt velocity
    let moveVec = entity.getVelocity();
    // Clear the bolt's velocity
    entity.clearVelocity();
    
    // Spread parameters
    let maxSpreadAngle = bombardable ? toRadians(10) : toRadians(5);
    
    // Generate random angle deviation
    let angleOffset = (Math.random() - 0.5) * maxSpreadAngle; 
    
    // Use the stored velocity, but extend it by 0.1. This ensures that it is sped up each time it is successfully parried.
    let projSpeed = Vector3.magnitude(moveVec) + 0.1;
    let reflection = Vector3.normalize(reflect(moveVec, toEntityVec));
    
    let testVec = reflection;
    
    let newVec = {
      x: viewDir.x * projSpeed,
      y: viewDir.y * projSpeed,
      z: viewDir.z * projSpeed
    }
    
    // Change owner to parrier
    proj.owner = player;
    
    // Apply newVec to the entity
    entity.applyImpulse(newVec);
    console.warn("Parried!!")
  } else {
    if (!bombardable) {
      console.warn("Whizzed out of parrying cone of detection!");
    }
  }
}
// Swing Parry Bolt
world.afterEvents.playerSwingStart.subscribe(e => {
  let item = e.heldItemStack;
  let player = e.player;
  let swingCause = e.swingSource;
  
  // Witch has to be attacking
  if (swingCause == "Attack") {
    let checkCooldown = player.getDynamicProperty("bw:boltParryCooldown");
    if (checkCooldown != undefined) {
      let timeElapsed = Math.abs((checkCooldown - Date.now())/1000);
      if (timeElapsed < 3) {
        console.warn(`Remaining Time on Cooldown: ${timeElapsed.toFixed(1)}s`)
        return;
      } else {
        player.setDynamicProperty("bw:boltParryCooldown", undefined);
      }
    }
    
    let bolts = player.dimension.getEntities({ location: player.getHeadLocation(), maxDistance: 3.0, families: ["spell_bolt"], closest: 1 });
    
    if (bolts.length == 0 && bolts[0]?.getComponent("minecraft:projectile")) {
      return;
    }
    
    
    bolts.forEach(e => parryBolt(e, player));
  }
});