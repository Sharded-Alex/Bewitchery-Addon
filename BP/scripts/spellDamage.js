import {world, system, Player, ItemStack} from "@minecraft/server";
import {diceRoll} from "./occultMagick.js";
import {titaniaPlants} from "./curses.js";
import {potionEffects} from "./consumePotion.js";

const DAMAGE_TYPES = {
  "internal": [],
  "blunt": [
    "entityAttack",
    "explosion",
    "kinetic"
  ],
  "soak": [
    "drowning",
    "suffocation"
  ],
  "burn": [
    "fire",
    "fire_tick",
    "lava",
    "magma"
  ],
  "occult": [
    "magic",
    "void"
  ],
  "slice": [
    "entityAttack"
  ],
  "pierce": [
    "projectile"
  ],
  "shock": [
    "lightning"
  ]
}

export function getNewDamageType(type) {
  for (let [k, v] of Object.entries(DAMAGE_TYPES)) {
    if (v.includes(type)) {
      return k;
    }
  }
  return "unknown"
}

const damageImmune = [
    "minecraft:item",
    "minecraft:xp_orb",
    "minecraft:painting",
    "minecraft:leash_knot",
    "minecraft:armor_stand",
];

// Bewitchery Magick Damage System
/**
 * (#) Damage types: Blunt, Soak, Burn, Occult, Slice, Pierce, Shock
 * 
 * Damage increases based on environmental and magickal factors. This allows for spells to be more effective.
 */
export function applySpellDamage(victim, damage, damageType, igniteTime = 0, attacker = undefined) {
  // Get Base Damage that is supposed to be dealt
  let dmg = damage;
  // This damage is unblockable if it is considered mystical. Most mystical damage will be.
  let dmgCause = "override";
  
  
  // Synergies
  // Damage increases and decreases based on environmental factors.
  // Percentage increases are to be used.
  
  // Damage from magical water sources.
  if (damageType == "soak") {
    if (victim.hasComponent("minecraft:onfire")) {
      // Steam Burns
      dmg += dmg * 0.15;
      victim.extinguishFire(true);
    }
  }
  if (damageType == "burn") {
    if (victim.hasComponent("minecraft:onfire")) {
      // Prolong burning
      igniteTime = 3;
      // When burn damage is applied to a burning entity, the damage is aggravated based on how long the fire takes to put out naturally.
      let onFireMultiplier = 0;
      onFireMultiplier = Math.floor(victim.getComponent("minecraft:onfire").onFireTicksRemaining/20)/10;
      
      dmg += dmg * onFireMultiplier;
    }
  }
  if (damageType == "shock") {
    if (victim.hasComponent("minecraft:onfire")) {
      let fireTimeLeft = Math.floor(victim.getComponent("minecraft:onfire").onFireTicksRemaining/20);
      // Small Fiery Explosion
      if (fireTimeLeft > 5) {
        victim.dimension.createExplosion(victim.location, 1, {
          causesFire: true,
          breaksBlocks: false
        })
      }
    }
    if (victim.isInWater) {
      dmg += dmg * 0.35;
    }
  }
  if (damageType == "blunt") {}
  
  // Resistances
  
  // Determines whether this entity is actually damagable
  let damagable = !damageImmune.includes(victim.typeId);
  
  // Deal the appropriate damage
  if (damagable) {
    victim.applyDamage(dmg, {cause: dmgCause});
    // Set victim on fire
    if (igniteTime != undefined && igniteTime > 0) {
      victim.setOnFire(igniteTime, true);
    }
  }
  
  // console.warn(`Damages Dealt (${damageType}): ${damage} (Base) | ${dmg} (Actual)`);
}