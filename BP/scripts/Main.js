/* jshint maxerr: 10000 */
import { world, Entity, MolangVariableMap, system, ItemStack, BlockPermutation, EntitySkinIdComponent, DimensionTypes } from "@minecraft/server";
import { randomizeEffectList, herbList } from "./herbList";
import "./potionCrafting.js";
import "./consumePotion.js";
import "./blockComp.js";
import "./ritualData.js";
import "./runicCircles.js";
import { candlePos, detectCandles } from "./castRitual.js";
import "./getTaglock.js";
import "./curses.js";
import "./correspondences.js";
import "./altars.js";
import "./spellDraw.js";
import "./spellInfo.js";
import "./spellDamage.js";
import "./spellEffects.js";
import "./divination.js";
import "./wandLore.js";
import "./localize.js";
import "./leynexii.js";
import "./wardArrays.js";
import { luckRoll } from "./occultMagick.js";
import { addFamiliarToRegistry, familiarRegistry } from "./familiars.js";
import "./sacrificialMagick.js";
import { information } from "./bookInfo";
import "./bookScript";
import "./witchLibrary";
import "./faerieRings";
import "./faerieAbilities";
import "./SleepWorldEvent";
import { Vector3, Random } from "./VectorMath/index.js";
import "./lesserFaerie.js";
import "./example-2.js";
import "./spellProjectiles.js";

// Catalogue all spell projectiles;
export const PROJECTILES = {};


function createSecondaryEffect() {
  let types = [
    "amplifier",
    "extender",
    "nullifier",
    "corruptor"
  ]
  let typeChosen = types[Math.floor(Math.random() * types.length)];

  if (typeChosen == "extender") {
    let duration = Math.ceil(Random.Range(1, 9));
    return {
      type: typeChosen,
      increaseAmount: duration * 10
    }
  } else {
    return {
      type: typeChosen
    }
  }
}

export function loadReagent(herbName, herb) {
  let resistancePulls = world.getDynamicProperty("bw:resistancePulls");
  if (resistancePulls == undefined) {
    resistancePulls = 0;
  }
  let rangeMax = herb.primaryEffects.maxRange;
  let divisions = herb.primaryEffects.effectLoad;
  let qoutient = Math.round(rangeMax / divisions);
  let chosenEffects = {};
  let chosenArr = [];
  for (let e = 0; e < divisions; e++) {
    let revisedList = randomizeEffectList.filter((e) => {
      if (!chosenArr.includes(e.effect)) {
        if (e.effect == "resistance" && resistancePulls < 3) {
          resistancePulls = resistancePulls + 1;
          return e;
        } else
          if (e.effect != "resistance") {
            return e;
          }
      }
    });
    let chosen = revisedList[Math.round(Random.Range(0, revisedList.length - 1))];
    chosenArr.push(chosen.effect);
    chosenEffects[qoutient * e] = chosen;
  }
  world.setDynamicProperty(`bw_reagent:${herbName}`, JSON.stringify(chosenEffects));
  world.setDynamicProperty(`bw:resistancePulls`, resistancePulls);
}

export function createReagent(herb) {
  let elementPool = [
    "Solar",
    "Lunar",
    "Earth",
    "Ender",
    "Sky"
  ]
  let ingredient = {
    "name": "CUSTOM REAGENT",
    "baseValue": Math.floor(Random.Range(-50, 50)),
    "element": elementPool[Math.floor(Random.Range(0, elementPool.length))],
    "rgb": [Math.random(), Math.random(), Math.random()],
    "primaryEffects": undefined,
    "secondaryEffects": createSecondaryEffect()
  }

  let resistancePulls = world.getDynamicProperty("bw:resistancePulls");
  if (resistancePulls == undefined) {
    resistancePulls = 0;
  }
  let rangeMax = 150;
  let divisions = 3;
  let qoutient = Math.round(rangeMax / divisions);
  let chosenEffects = {};
  let chosenArr = [];
  for (let e = 0; e < divisions; e++) {
    let revisedList = randomizeEffectList.filter((e) => {
      if (!chosenArr.includes(e.effect)) {
        if (e.effect == "resistance" && resistancePulls < 3) {
          resistancePulls = resistancePulls + 1;
          return e;
        } else
          if (e.effect != "resistance") {
            return e;
          }
      }
    });
    let chosen = revisedList[Math.round(Random.Range(0, revisedList.length - 1))];
    chosenArr.push(chosen.effect);
    chosenEffects[qoutient * e] = chosen;
  }
  ingredient.primaryEffects = chosenEffects;
  world.setDynamicProperty(`bw_customIngredient:${herb}`, JSON.stringify(ingredient));
  world.setDynamicProperty(`bw_reagent:${herb}`, JSON.stringify(chosenEffects));
  world.setDynamicProperty(`bw:resistancePulls`, resistancePulls);
}

world.afterEvents.worldLoad.subscribe(registerPotion => {
  let randomizedReagents = world.getDynamicProperty("bw:initializeReagents");
  if (randomizedReagents == undefined) {
    let resistancePulls = world.getDynamicProperty("bw:resistancePulls");
    if (resistancePulls == undefined) {
      resistancePulls = 0;
    }
    for (let [herb, info] of Object.entries(herbList)) {
      let rangeMax = info.primaryEffects.maxRange;
      let divisions = info.primaryEffects.effectLoad;
      let qoutient = Math.round(rangeMax / divisions);
      let chosenEffects = {};
      let chosenArr = [];
      for (let e = 0; e < divisions; e++) {
        let revisedList = randomizeEffectList.filter((e) => {
          if (!chosenArr.includes(e.effect)) {
            if (e.effect == "resistance" && resistancePulls < 3) {
              resistancePulls = resistancePulls + 1;
              return e;
            } else
              if (e.effect != "resistance") {
                return e;
              }
          }
        });
        let chosen = revisedList[Math.round(Random.Range(0, revisedList.length - 1))];
        chosenArr.push(chosen.effect);
        chosenEffects[qoutient * e] = chosen;
      }
      world.setDynamicProperty(`bw_reagent:${herb}`, JSON.stringify(chosenEffects));
      world.setDynamicProperty(`bw:resistancePulls`, resistancePulls);
    }
    world.setDynamicProperty(`bw:initializeReagents`, true);
  } else {
    console.warn("Bewitchery Reagents already Initialized!");
  }

  let fProps = world.getDynamicPropertyIds().filter(f => f.startsWith(`bw:isFamiliar_`));
  for (let p of fProps) {
    let entitySoul = p.split("_")[1];
    let entity;
    for (let d of DimensionTypes.getAll()) {
      let e = world.getDimension(d.typeId).getEntities().filter(ent => ent.getDynamicProperty("bw:originalSoul") == entitySoul)[0];
      if (e != undefined) {
        entity = e;
        break;
      }
    }

    if (entity != undefined) {
      addFamiliarToRegistry(entity, p);
    }
  }

  world.getAllPlayers().forEach((e) => {
    if (!familiarRegistry.has(e.id)) {
      familiarRegistry.set(e.id, new Map());
    }
  })
});

world.afterEvents.playerLeave.subscribe(({ playerId }) => {
  // Remove player familiars from registry
  familiarRegistry.delete(playerId);
});

function calculateMagnitude(Vx, Vy, Vz) {
  return Math.sqrt(Vx ** 2 + Vy ** 2 + Vz ** 2);
}

function randomValue(max, min) {
  return Math.random() * (max - min) + min;
}

system.afterEvents.scriptEventReceive.subscribe(e => {
  const id = e.id;
  const block = e.sourceBlock;
  const player = e.sourceEntity;

  if (id == "bw:fatigueMechanic") {
    let desiredAmt = 1000;
    if (player.getDynamicProperty("bw:fatigueInt") == undefined || player.getDynamicProperty("bw:fatigueInt") != desiredAmt) {
      player.setDynamicProperty("bw:fatigueInt", 1000);
    }

    let percentage = Math.round((world.scoreboard.getObjective("bw:Fatigue")?.getScore(player.scoreboardIdentity) / player.getDynamicProperty("bw:fatigueInt")) * 100);
    if (percentage >= 85) {
      player.addEffect("weakness", 60, { showParticles: false });
      player.addEffect("slowness", 60, { showParticles: false });
    }
    if (percentage >= 100) {
      player.runCommand(`camera @s[type=player] fade time 0.5 0 0.5 color 3 5 0`);
      if (luckRoll(5)) {
        player.playSound("portal.portal");
      }
      if (luckRoll(35)) {
        player.spawnParticle("bw:wylde_soul_particle", Vector3.add(player.getHeadLocation(), player.getViewDirection()));
        player.playSound("mob.ghast.scream");
      }
    }
    if (percentage >= 130) {
      player.runCommand(`tellraw @s {\"rawtext\": [{\"text\": \"§4The Wylde mutters to you its secrets, and your mind and body collapses into endless magick.§r\"}]}`);
      player.runCommand(`scoreboard players set @s bw:Fatigue 0`);
      player.runCommand(`scoreboard players set @s bw:oEnergy 0`);
      player.runCommand(`scoreboard players set @s bw:fatgTimer 0`);
      player.kill();
    }
  }

  if (id == "bw:giveBack") {
    player.setDynamicProperty("bwFaeValuable:breakBlocks", undefined)
    player.setDynamicProperty("bwFaeValuable:use", undefined)
    player.setDynamicProperty("bwFaeValuable:sleep", undefined)
  }
});