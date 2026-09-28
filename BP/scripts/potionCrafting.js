/* jshint maxerr: 10000 */
import { world, system, ItemStack, BlockPermutation, MolangVariableMap } from "@minecraft/server";
import { ActionFormData, ActionFormResponse, MessageFormData, ModalFormData } from "@minecraft/server-ui";
import { candleInfusion, randomizeEffectList, herbList, modifierList } from "./herbList";
import { potionEffects } from "./consumePotion";
import { loadReagent } from "./Main.js";
import { Vector3 } from "./VectorMath/index.js";

function scalePower(start, end, value) {
  let mean = Math.round((Number(start) + Number(end)) / 2);
  let h = end - mean;
  let m = 2;
  let n = value - mean;
  let amplifier = Math.round((h - Math.abs(n)) / h * m) // Thanks, Java <33
  if (amplifier == 0) {
    amplifier = undefined
  }
  return amplifier;
}

export const corruptList = [
  {
    "effect": "minecraft:regeneration",
    "corrupted": "minecraft:poison"
  },
  {
    "effect": "minecraft:instant_health",
    "corrupted": "minecraft:instant_damage"
  },
  {
    "effect": "minecraft:instant_damage",
    "corrupted": "minecraft:instant_health"
  },
  {
    "effect": "minecraft:night_vision",
    "corrupted": "minecraft:blindness"
  },
  {
    "effect": "minecraft:blindness",
    "corrupted": "minecraft:invisibility"
  },
  {
    "effect": "minecraft:strength",
    "corrupted": "minecraft:weakness"
  },
  {
    "effect": "minecraft:speed",
    "corrupted": "minecraft:slowness"
  },
  {
    "effect": "minecraft:invisibility",
    "corrupted": "minecraft:darkness"
  },
  {
    "effect": "minecraft:weakness",
    "corrupted": "minecraft:strength"
  },
  {
    "effect": "minecraft:haste",
    "corrupted": "minecraft:mining_fatigue"
  },
  {
    "effect": "minecraft:levitation",
    "corrupted": "minecraft:slow_falling"
  },
];

export function romanize(num) {
  if (num == undefined) {
    num = 1;
  } else {
    num = num + 1;
  }
  let roman = {
    M: 1000,
    CM: 900,
    D: 500,
    CD: 400,
    C: 100,
    XC: 90,
    L: 50,
    XL: 40,
    X: 10,
    IX: 9,
    V: 5,
    IV: 4,
    I: 1
  };
  let str = '';

  for (let i of Object.keys(roman)) {
    let q = Math.floor(num / roman[i]);
    num -= q * roman[i];
    str += i.repeat(q);
  }

  return str;
}

export function capitalize(commonWord) {
  let numOfLetters = commonWord.length;
  let word = "";
  for (let i = 0; i < numOfLetters; i++) {
    if (i == 0) {
      word += commonWord[i].toUpperCase();
    } else {
      word += commonWord[i];
    }
  }
  return word;
}
export function getHerbId(herbName) {
  let herbID = null;
  for (let herb of herbList) {
    if (herbName == herb.typeId) {
      herbID = herb.id;
    }
  }
  return herbID;
}

export function corruptEffect(effectName) {
  for (let obj of corruptList) {
    if (obj.effect == effectName) {
      return obj.corrupted;
    }
  }
}

export function isEffectValid(herbID, effectName) {
  let isValid = false;
  for (let herb of herbList) {
    if (herbID == herb.id) {
      for (let effect of herb.aidEffects.aidWith.effect) {
        if (effectName == effect) {
          isValid = true;
        }
      }
    }
  }
  return isValid;
}

export function getPotionTime(number) {
  let seconds = number / 60 - Math.floor(number / 60);
  let minutes = Math.floor(number / 60);

  let timeSec = Math.round(seconds * 60 / 1);
  if (String(timeSec).length == 1) {
    timeSec = "0" + `${timeSec}`;
  }
  return `(${minutes}:${timeSec})`;
}

export function idToName(id) {
  let name = "Undefined Effect";
  for (let e of randomizeEffectList) {
    if (id == e.effect || id == e.name) {
      name = e.name;
      break;
    }
  }
  return name;
}
export function potionToLore(effectList, secondary) {
  let lore = [];
  if (secondary == undefined) {
    secondary = "None";
  }
  if (secondary != "None") {
    lore.push(`§6Secondary Influence: ${secondary.name}§r`)
  } else {
    lore.push(`§6Secondary Influence: ${secondary}§r`)
  }

  for (let [k, e] of Object.entries(effectList)) {
    lore.push(`§r${idToName(k)} ${romanize(e.amplifier)} ${getPotionTime(e.duration)}§r`);
  }
  return lore;
}

/**
* @param {{ [s: string]: any; } | ArrayLike<any>} contents
* @param {string} secondaryEffect
*/
export function herbsToLore(contents, secondaryEffect, cauldron = undefined) {
  let lore = [];
  let potionLore = [];
  let secondary = "None";
  if (secondaryEffect != undefined) {
    secondary = secondaryEffect
  }
  if (secondary != "None") {
    lore.push(`§6Secondary Influence: ${secondary.name}§r`)
    potionLore.push(`§6Secondary Influence: ${secondary.name}§r`)
  } else {
    lore.push(`§6Secondary Influence: ${secondary}§r`)
    potionLore.push(`§6Secondary Influence: ${secondary}§r`)
  }

  for (let [key, value] of Object.entries(contents)) {
    let distilled = herbDistil(key);
    let primaryRange = Object.keys(distilled.primaryEffects);
    let primaryValues = Object.values(distilled.primaryEffects);
    let max = primaryRange[1] * primaryRange.length;
    let effect = "";
    let duration = 0;
    let amplifier = undefined;

    for (let i = 1; i <= primaryRange.length; i++) {
      if (value > max) {
        effect = "Poison";
        duration = getPotionTime(15);
        amplifier = romanize(undefined);
        break;
      }
      if (value < 0) {
        effect = "Weakness";
        duration = getPotionTime(15);
        amplifier = romanize(undefined);
        break;
      }

      if (i != primaryRange.length) {
        if (value >= primaryRange[i - 1] && value < primaryRange[i]) {
          let chosenFX = primaryValues[i - 1];
          effect = chosenFX.name;

          duration = getPotionTime(chosenFX.duration);
          amplifier = romanize(scalePower(primaryRange[i - 1], primaryRange[i], value));
        }
      } else {
        if (value >= primaryRange[i - 1] && value <= max) {
          let chosenFX = primaryValues[i - 1];
          effect = chosenFX.name;

          duration = getPotionTime(chosenFX.duration);
          amplifier = romanize(scalePower(primaryRange[i - 1], max, value));
        }
      }
    }

    let itemStack = new ItemStack(key, 1);

    let rawMessage = {
      rawtext: [
        {
          translate: itemStack.localizationKey
        },
        {
          text: ` (${Math.round(100 * (value / max))}%%) §g[${effect} ${amplifier} ${duration}]§r`
        }
      ]
    }
    lore.push(rawMessage);
    if (effect != "Effect") {
      potionLore.push(`§r${effect} ${amplifier} ${duration}§r`);
    }
  }
  return [lore, potionLore];
}

export function herbsToElements(contents, crystalAmt) {
  let primalCrystals = new Map();
  let num = 0;
  for (let [herbKey, herbValue] of Object.entries(contents)) {
    if (num >= crystalAmt) {
      break;
    }

    let herb = herbList[herbKey];
    if (herb == undefined) {
      if (world.getDynamicProperty(`bw_customIngredient:${herbKey}`)) {
        herb = JSON.parse(world.getDynamicProperty(`bw_customIngredient:${herbKey}`));
      } else {
        continue;
      }
    }

    let potenceNum = Math.max(1, Math.min(Math.abs(Math.floor((herbValue / 150) * 100 / 20)), 5));
    num = num + potenceNum;

    if (num > crystalAmt) {
      potenceNum = potenceNum + (crystalAmt - num);
      num = crystalAmt;
    }

    // Add the crystal numbers to the Map
    switch (herb?.element) {
      case "Solar": {
        const currCrystals = primalCrystals.get('bw:solar_imbued_quartz');
        if (currCrystals == undefined) {
          primalCrystals.set('bw:solar_imbued_quartz', potenceNum);
        } else {
          primalCrystals.set('bw:solar_imbued_quartz', currCrystals + potenceNum);
        }
        break;
      }
      case "Lunar": {
        const currCrystals = primalCrystals.get('bw:lunar_imbued_quartz');
        if (currCrystals == undefined) {
          primalCrystals.set('bw:lunar_imbued_quartz', potenceNum);
        } else {
          primalCrystals.set('bw:lunar_imbued_quartz', currCrystals + potenceNum);
        }
        break;
      }
      case "Sky": {
        const currCrystals = primalCrystals.get('bw:sky_imbued_quartz');
        if (currCrystals == undefined) {
          primalCrystals.set('bw:sky_imbued_quartz', potenceNum);
        } else {
          primalCrystals.set('bw:sky_imbued_quartz', currCrystals + potenceNum);
        }
        break;
      }
      case "Earth": {
        const currCrystals = primalCrystals.get('bw:earth_imbued_quartz');
        if (currCrystals == undefined) {
          primalCrystals.set('bw:earth_imbued_quartz', potenceNum);
        } else {
          primalCrystals.set('bw:earth_imbued_quartz', currCrystals + potenceNum);
        }
        break;
      }
      case "Ender": {
        const currCrystals = primalCrystals.get('bw:ender_imbued_quartz');
        if (currCrystals == undefined) {
          primalCrystals.set('bw:ender_imbued_quartz', potenceNum);
        } else {
          primalCrystals.set('bw:ender_imbued_quartz', currCrystals + potenceNum);
        }
        break;
      }
    }
  }
  return [primalCrystals, crystalAmt - num];
}

export function bottlePotion(potContents, secondaryEffect, cauldron, candleInfused) {
  let effectList = {};
  let secondary = secondaryEffect;
  // Create a candle object for Candle Infusion (HEBAYA)
  let candleObj = {}
  let infusedPos = [
    {
      x: 1,
      y: 0,
      z: 1
    },
    {
      x: -1,
      y: 0,
      z: 1
    },
    {
      x: -1,
      y: 0,
      z: -1
    },
    {
      x: 1,
      y: 0,
      z: -1
    }
  ]
  for (let vec of infusedPos) {
    let candles = cauldron.dimension.getBlock(Vector3.add(cauldron.location, vec));

    if (Object.keys(candleInfusion).includes(candles.typeId)) {
      if (!candleObj[candles.typeId]) {
        candleObj[candles.typeId] = Number(candles.permutation.getState("candles")) + 1;
      } else {
        candleObj[candles.typeId] = candleObj[candles.typeId] + (Number(candles.permutation.getState("candles")) + 1);
      }
      let molang = new MolangVariableMap();
      let color = {
        red: 0.2 + Math.random(),
        green: 0.15 + Math.random(),
        blue: 0.2 + Math.random()
      }
      molang.setColorRGB("variable.color", color);

      candles.dimension.spawnParticle("bw:evoker_spell", candles.center(), molang);
    }
  }


  for (let [key, value] of Object.entries(potContents)) {
    let distilled = herbDistil(key);
    let primaryRange = Object.keys(distilled.primaryEffects);
    let primaryValues = Object.values(distilled.primaryEffects);
    let reagent = distilled.name;
    let max = primaryRange[1] * primaryRange.length;
    let potEffect = {};


    for (let i = 1; i <= primaryRange.length; i++) {
      // CHANGE THIS. Below 0%, there is no effect and it behaves like a mundane potion. This reagent is effectively neutralized.

      // If potency is over maximum, become fatally poisonous.
      if (value < 0) {
        potEffect.effect = "minecraft:weakness";
        potEffect.duration = 15;
        potEffect.amplifier = undefined;
        break;
      }
      if (value > max) {
        potEffect.effect = "minecraft:fatal_poison";
        potEffect.duration = 20;
        potEffect.amplifier = undefined;
        break;
      }

      // if i isnt the LAST potency range value in the range list.
      if (i != primaryRange.length) {
        if (value >= primaryRange[i - 1] && value < primaryRange[i]) {
          let chosenFX = primaryValues[i - 1];
          potEffect.effect = chosenFX.effect;
          potEffect.duration = chosenFX.duration;
          potEffect.unstackable = chosenFX.unstackable;
          potEffect.amplifier = scalePower(primaryRange[i - 1], primaryRange[i], value);
        }
      } else {
        if (value >= primaryRange[i - 1] && value <= max) {
          let chosenFX = primaryValues[i - 1];
          potEffect.effect = chosenFX.effect;
          potEffect.duration = chosenFX.duration;
          potEffect.unstackable = chosenFX.unstackable;
          potEffect.amplifier = scalePower(primaryRange[i - 1], max, value);
        }
      }
    }
    if (effectList[potEffect.effect] != undefined) {
      if (effectList[potEffect.effect].unstackable == undefined || !effectList[potEffect.effect].unstackable) {
        effectList[potEffect.effect].duration += potEffect.duration;
      }
      if (effectList[potEffect.effect].amplifier < potEffect.amplifier || (effectList[potEffect.effect].amplifier == undefined && potEffect.amplifier != undefined)) {
        effectList[potEffect.effect].amplifier = potEffect.amplifier;
      }
    } else {
      effectList[potEffect.effect] = {};
      effectList[potEffect.effect].duration = potEffect.duration;
      effectList[potEffect.effect].amplifier = potEffect.amplifier;
      if (candleInfused) {
        for (let c of Object.keys(candleObj)) {
          if (candleInfusion[c].includes(potEffect.effect)) {
            effectList[potEffect.effect].duration += (10 * candleObj[c]);
          }
        }
      }
    }
  }
  if (secondary != undefined && secondary != "None") {
    let effectNameList = [];
    for (let efcts of randomizeEffectList) {
      if (efcts.name == secondary.affects) {
        effectNameList.push(efcts.effect);
      }
    }

    if (secondary.with.type == "amplifier") {
      for (let e of effectNameList) {
        if (Object.keys(effectList).includes(e)) {
          if (effectList[e].amplifier == 0 || effectList[e].amplifier == undefined) {
            effectList[e].amplifier = 1
          } else {
            effectList[e].amplifier += 1
          }
        }
      }
    }
    if (secondary.with.type == "extender") {
      for (let e of effectNameList) {
        if (Object.keys(effectList).includes(e)) {
          effectList[e].duration += secondary.with.increaseAmount;
        }
      }
    }
    if (secondary.with.type == "corruptor") {
      for (let e of effectNameList) {
        if (Object.keys(effectList).includes(e)) {
          if (corruptEffect(e) != undefined) {
            effectList[corruptEffect(e)] = effectList[e];
            effectList[e] = undefined;
          }
        }
      }
    }
    if (secondary.with.type == "nullifier") {
      for (let e of effectNameList) {
        if (Object.keys(effectList).includes(e)) {
          effectList[e] = undefined;
        }
      }
    }
  }
  return effectList;
}

export function getDistilledEffect(alcSpectrum, potency) {
  let potEffect = undefined;
  let range = Object.keys(alcSpectrum);
  let values = Object.values(alcSpectrum);

  let spectrumLength = range.length;
  for (let count = 1; count <= range.length; count++) {
    if (count != spectrumLength) {
      if (potency >= range[count - 1] && potency < range[count]) {
        let chosenFX = values[count - 1];
        potEffect = chosenFX.effect;
      }
    }
  }

  if (potency > 150) {
    potEffect = "Wither"
  }
  if (potency < 0) {
    potEffect = "Weakness"
  }

  for (let potion of potionEffects) {
    if (potion.effect == potEffect) {
      potEffect = potion.name;
      break;
    }
  }

  return potEffect;
}

export function herbDistil(item) {
  let ingredient = herbList[item];
  let modifier = modifierList[item];
  if (ingredient != undefined) {
    let effect = world.getDynamicProperty(`bw_reagent:${item}`)
    if (effect != undefined) {
      ingredient.primaryEffects = JSON.parse(effect);
      return ingredient;
    } else {
      loadReagent(item, ingredient);
      effect = world.getDynamicProperty(`bw_reagent:${item}`);

      ingredient.primaryEffects = JSON.parse(effect);
      return ingredient;
    }
  } else
    if (modifier != undefined) {
      return modifier;
    }

  if (ingredient == undefined && modifier == undefined) {
    let customReagent = world.getDynamicProperty(`bw_customIngredient:${item}`);
    if (customReagent != undefined) {
      return JSON.parse(customReagent);
    }
  }
}