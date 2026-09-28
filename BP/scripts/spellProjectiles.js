import {world, Entity, MolangVariableMap, system, ItemStack, BlockPermutation, EntitySkinIdComponent} from "@minecraft/server";
import {getDistance} from "./leynexii.js";
import {visuals} from "./particleFunc.js";
import {allPlayersCasting} from "./spellDraw.js";
import {getFace, quadSplit} from "./wardArrays.js";
import {essenceCheck} from "./occultMagick.js";
import {nounCastFunctions, spellCastTypes, spellFormulas, triggerVSFX} from "./faeSpells.js";
import {createAreaEffect} from "./spellAreas.js";
import {applySpellDamage} from "./spellDamage.js";
import {Vector3} from "./VectorMath/index.js";

export function calculateAngle(v1, v2) {
  const dot = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
  const mag1 =  Math.sqrt(v1.x * v1.x + v1.y * v1.y + v1.z * v1.z);
  const mag2 =  Math.sqrt(v2.x * v2.x + v2.y * v2.y + v2.z * v2.z);
  return Math.acos(dot / (mag1 * mag2)) * (180 / Math.PI);
}

/**
 * Gets the magnitude if a Vector. Here because I can't be bothered to import Vector3 thingie right now.
 * @param {Vector3} vector - the Vector to get the magnitude of.
 * @returns {Number} - The magnitude in question.
*/
export function magnitude(vector) {
    return Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
};

/**
 * Normalizes the vector provided abd increases its size by "size" value.
 * @param {Vector3} vec - The 3D vector to normalize.
 * @param {number} size - The scaling factor to apply to the normalized vector.
 * @returns {Vector3} The normalized and scaled vector.
 */
 export function normalizeVector(vec, size) {
   let length = Math.hypot(vec.x, vec.y, vec.z);
   return {
     x: size * (vec.x/length),
     y: size * (vec.y/length),
     z: size * (vec.z/length)
   }
 }
 // Scale Vector
 export function scaleVector(vec, size) {
   return {
     x: size * vec.x,
     y: size * vec.y,
     z: size * vec.z
   }
 }
 
/**
 * Finds a location based on their view direction and the scaling factors from the players current position, the same as ^^^ in commands.
 * @param {object} player - The player object to base the view direction and starting position on.
 * @param {number} xf - The scaling factor for the x direction.
 * @param {number} yf - The scaling factor for the y direction.
 * @param {number} zf - The scaling factor for the z direction.
 * @returns {x: number, y: number, z: number} The transformed location.
 * CREDITS TO GLITCH'S AVATAR ADDON, GO CHECK IT OUT!!!
 */
export function calcVectorOffset (player, xf, yf, zf, d = player.getViewDirection(), l = player.location) {
    let m = Math.hypot(d.x, d.z);
    let xx = normalizeVector({
        x: d.z,
        y: 0,
        z: -d.x
    }, xf);
    let yy = normalizeVector({
        x: (d.x / m) * -d.y,
        y: m,
        z: (d.z / m) * -d.y
    }, yf);
    let zz = normalizeVector(d, zf);

    return {
        x: l.x + xx.x + yy.x + zz.x,
        y: l.y + xx.y + yy.y + zz.y,
        z: l.z + xx.z + yy.z + zz.z
    };
}


export function reflect(vel, norm) {
  const normal = normalizeVector(norm, 1);
  const dot = Vector3.dot(vel, normal);
  
  return Vector3.subtract(vel, Vector3.scale(normal, 2 * dot));
}

// Bolts are projectiles of magical energy.
// Features
// - Configurable Lifetimes
// - Bolt Particle Modularity
// - Bolt Burst Particles
// - Bolt Particle Color Changing (tog.)
// - Bolt Traveling Sounds
// - Bolt Collision Sounds
// - Unnatural Bolt Movement
// - Bolt on Bolt Collision
// - Witch Bolt Parrying
export function createBolt(dim, spawnLoc, boltDir, spell, owner = undefined) {
  let spellBolt = dim.spawnEntity("bw:spell_missile", spawnLoc);
  
  spellBolt.setProperty("bw:lifetime", spell.noun_params.lifetime);
  spellBolt.setDynamicProperty("bw:spellSaved", JSON.stringify(spell));
  let spellProjInfo = spellBolt.getComponent("minecraft:projectile");
  
  // Gravity Values should be ±0.01 and ±0.001;
  spellProjInfo.gravity = spell.noun_params.gravity;
  if (owner) {
    let o = world.getEntity(owner);
    if (o) {
      spellProjInfo.owner = o;
    }
  }
  
  spellProjInfo.shoot(boltDir);
}

world.afterEvents.projectileHitBlock.subscribe(async (e) => {
  let dimension = e.dimension;
  let missile = e.projectile;
  const caster = e.source;
  const block = e.getBlockHit().block;
  const face = e.getBlockHit().face;
  
  if (!missile?.isValid) {
    return;
  }
  
  let spell = missile.getDynamicProperty("bw:spellSaved");
  if (spell) {
    spell = JSON.parse(spell);
    
    let blockTarg = block;
    if (spell.noun_params.face_sensitive) {
      let faceVec = getFace(face);
      blockTarg = blockTarg.offset(faceVec);
    }
    
    nounCastFunctions["Bolt"].onCollide(blockTarg, "blockTarget", spell);
    visuals[spell.style.aesthetic](dimension, blockTarg.center(), spell);
    
    if (missile) {
      system.waitTicks(6);
      missile.remove()
    }
  }
  
});

world.afterEvents.projectileHitEntity.subscribe(async (e) => {
  let dimension = e.dimension;
  let missile = e.projectile;
  const caster = e.source;
  const entity = e.getEntityHit().entity;
  
  if (!missile?.isValid) {
    return;
  }
  
  let spell = missile.getDynamicProperty("bw:spellSaved");
  if (spell) {
    spell = JSON.parse(spell);
    
    nounCastFunctions["Bolt"].onCollide(entity, "entityTarget", spell);
    visuals[spell.style.aesthetic](dimension, entity.getAABB().center, spell);
    
    let checkCooldown = entity.getDynamicProperty("bw:boltParryCooldown");
    if (checkCooldown != undefined) {
      let timeElapsed = Math.abs((checkCooldown - Date.now())/1000);
      if (timeElapsed < 3) {
        console.warn(`Reset Parry Timer!! (${timeElapsed}s)`)
        entity.setDynamicProperty("bw:boltParryCooldown", Date.now());
      }
    }
    
    if (missile) {
      system.waitTicks(6);
      missile.remove()
    }
  }
});

world.afterEvents.dataDrivenEntityTrigger.subscribe(b => {
  let spellBolt = b.entity;
  let particleEvent = b.eventId;
  
  if (spellBolt?.isValid && particleEvent == "bw:projectile_count_down") {
    let spell = spellBolt.getDynamicProperty("bw:spellSaved");
    if (spell == undefined) {
      return;
    } else {
      spell = JSON.parse(spell);
    }
    
    if (spell?.style?.aesthetic) {
      visuals[spell.style.aesthetic](spellBolt.dimension, spellBolt.getAABB().center, spell, "trail");
    }
  }
  
  if (spellBolt?.isValid && particleEvent == "bw:kill_self") {
    let spell = spellBolt.getDynamicProperty("bw:spellSaved");
    if (spell == undefined) {
      return;
    } else {
      spell = JSON.parse(spell);
    }
    
    if (spell.noun_params.detonate) {
      let blockTarg = spellBolt.dimension.getBlock(spellBolt.getAABB().center);
      
      nounCastFunctions["Bolt"].onCollide(blockTarg, "blockTarget", spell);
      visuals[spell.style.aesthetic](spellBolt.dimension, blockTarg.center(), spell);
    }
    
    if (spellBolt?.isValid) {
      spellBolt.remove()
    }
  }
}, {
  eventTypes: [ "bw:projectile_count_down", "bw:kill_self" ]
});

/*
system.runInterval(() => {
  let dummySpellCasters = world.getDimension("minecraft:overworld").getEntities({tags: ["bw:spell_slinger"]});
  
  let info = {
    noun: spellFormulas[4].nounStats,
    verbs: [
      spellFormulas[14].baseStats
    ]
  }
  
  dummySpellCasters.forEach(e => spellCastTypes.Bubble(e.dimension, info.noun, info.verbs, e.location));
}, 40);
*/