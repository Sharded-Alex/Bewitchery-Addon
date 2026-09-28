/**
* @param typeId - The item's typeId
* @param mainEffects - The main effects that this ingredient provides when brewed.
* @param aidEffects - How this ingredient affects the main effects of a potion.
* @param effect - The type of effects that this reagent's Aid/Secondary effect affects.
* @param increaseAmount - Tells how much the specific effect's duration is increased by.
*/
import { capitalize } from "./wandLore.js";
import { loadReagent } from "./Main.js";
import { getPotionTime } from "./potionCrafting.js";

export const candleInfusion = {
  "minecraft:light_blue_candle": [
    "minecraft:speed",
    "minecraft:slow_falling"
  ],
  "minecraft:light_gray_candle": [
    "minecraft:slowness",
    "minecraft:weakness",
    "minecraft:resistance"
  ],
  "minecraft:yellow_candle": [
    "minecraft:haste",
    "minecraft:saturation",
    "minecraft:absorption"
  ],
  "minecraft:gray_candle": [
    "minecraft:mining_fatigue"
  ],
  "minecraft:green_candle": [
    "minecraft:poison",
    "minecraft:fatal_poison"
  ],
  "minecraft:red_candle": [
    "minecraft:strength"
  ],
  "minecraft:pink_candle": [
    "minecraft:health_boost"
  ],
  "minecraft:lime_candle": [
    "minecraft:jump_boost",
    "minecraft:nausea"
  ],
  "minecraft:orange_candle": [
    "minecraft:fire_resistance"
  ],
  "minecraft:cyan_candle": [
    "minecraft:water_breathing",
    "minecraft:conduit_power"
  ],
  "minecraft:white_candle": [
    "minecraft:invisibility"
  ],
  "minecraft:black_candle": [
    "minecraft:blindness",
    "minecraft:darkness",
    "minecraft:wither"
  ],
  "minecraft:blue_candle": [
    "minecraft:night_vision"
  ],
  "minecraft:brown_candle": [
    "minecraft:hunger"
  ]
}

export const randomizeEffectList = [
  {
    "name": "Absorption",
    "effect": "minecraft:absorption",
    "duration": 45
  },
  {
    "name": "Blindness",
    "effect": "minecraft:blindness",
    "duration": 20
  },
  {
    "name": "Poison",
    "effect": "minecraft:poison",
    "duration": 15
  },
  {
    "name": "Poison§x",
    "effect": "minecraft:fatal_poison",
    "duration": 15
  },
  {
    "name": "Wither",
    "effect": "minecraft:wither",
    "duration": 15
  },
  {
    "name": "Conduit Power",
    "effect": "minecraft:conduit_power",
    "duration": 45
  },
  {
    "name": "Darkness",
    "effect": "minecraft:darkness",
    "duration": 30
  },
  {
    "name": "Fire Resistance",
    "effect": "minecraft:fire_resistance",
    "duration": 45
  },
  {
    "name": "Haste",
    "effect": "minecraft:haste",
    "duration": 30
  },
  {
    "name": "Health Boost",
    "effect": "minecraft:health_boost",
    "duration": 45
  },
  {
    "name": "Hunger",
    "effect": "minecraft:hunger",
    "duration": 30
  },
  {
    "name": "Instant Damage",
    "effect": "minecraft:instant_damage",
    "duration": 0,
    "unstackable": true
  },
  {
    "name": "Instant Health",
    "effect": "minecraft:instant_health",
    "duration": 0,
    "unstackable": true
  },
  {
    "name": "Invisibility",
    "effect": "minecraft:invisibility",
    "duration": 30
  },
  {
    "name": "Jump Boost",
    "effect": "minecraft:jump_boost",
    "duration": 30
  },
  {
    "name": "Levitation",
    "effect": "minecraft:levitation",
    "duration": 15
  },

  {
    "name": "Wind Charged",
    "effect": "minecraft:wind_charged",
    "duration": 45
  },
  {
    "name": "Infested",
    "effect": "minecraft:infested",
    "duration": 45
  },
  {
    "name": "Weaving",
    "effect": "minecraft:weaving",
    "duration": 45
  },
  {
    "name": "Oozing",
    "effect": "minecraft:oozing",
    "duration": 45
  },

  {
    "name": "Mining Fatigue",
    "effect": "minecraft:mining_fatigue",
    "duration": 30
  },
  {
    "name": "Nausea",
    "effect": "minecraft:nausea",
    "duration": 30
  },
  {
    "name": "Night Vision",
    "effect": "minecraft:night_vision",
    "duration": 45
  },
  {
    "name": "Regeneration",
    "effect": "minecraft:regeneration",
    "duration": 30
  },
  {
    "name": "Saturation",
    "effect": "minecraft:saturation",
    "duration": 0,
    "unstackable": true
  },
  {
    "name": "Slowness",
    "effect": "minecraft:slowness",
    "duration": 30
  },
  {
    "name": "Slow Falling",
    "effect": "minecraft:slow_falling",
    "duration": 45
  },
  {
    "name": "Speed",
    "effect": "minecraft:speed",
    "duration": 30
  },
  {
    "name": "Strength",
    "effect": "minecraft:strength",
    "duration": 30
  },
  {
    "name": "Water Breathing",
    "effect": "minecraft:water_breathing",
    "duration": 45
  },
  {
    "name": "Weakness",
    "effect": "minecraft:weakness",
    "duration": 30
  },

  {
    "name": "Resistance",
    "effect": "minecraft:resistance",
    "duration": 30
  },
];

export const herbList = {
  "minecraft:dandelion": {
    "name": "Dandelion",
    "baseValue": 2,
    "element": "Sky",
    "rgb": [0.98, 0.965, 0.18],
    "primaryEffects": {
      "maxRange": 150,
      "effectLoad": 3
    },
    "secondaryEffects": {
      "type": "amplifier"
    }
  },
  "minecraft:poppy": {
    "name": "Poppy",
    "baseValue": 7,
    "element": "Solar",
    "rgb": [0.941, 0.082, 0.208],
    "primaryEffects": {
      "maxRange": 150,
      "effectLoad": 3
    },
    "secondaryEffects": {
      "type": "extender",
      "increaseAmount": 60
    }
  },
  "minecraft:blue_orchid": {
    "name": "Blue Orchid",
    "baseValue": 40,
    "element": "Lunar",
    "rgb": [0.318, 0.549, 0.851],
    "primaryEffects": {
      "maxRange": 150,
      "effectLoad": 3
    },
    "secondaryEffects": {
      "type": "nullifier"
    }
  },
  "minecraft:cornflower": {
    "name": "Cornflower",
    "baseValue": 15,
    "element": "Sky",
    "rgb": [0.078, 0.443, 0.949],
    "primaryEffects": {
      "maxRange": 150,
      "effectLoad": 3
    },
    "secondaryEffects": {
      "type": "extender",
      "increaseAmount": 90
    }
  },
  "minecraft:oxeye_daisy": {
    "name": "Oxeye Daisy",
    "baseValue": 15,
    "element": "Solar",
    "rgb": [0.933, 0.941, 0.741],
    "primaryEffects": {
      "maxRange": 150,
      "effectLoad": 5
    },
    "secondaryEffects": {
      "type": "amplifier"
    }
  },
  "minecraft:allium": {
    "name": "Allium",
    "baseValue": 35,
    "element": "Solar",
    "rgb": [0.992, 0.419, 1],
    "primaryEffects": {
      "maxRange": 150,
      "effectLoad": 3
    },
    "secondaryEffects": {
      "type": "amplifier"
    }
  },
  "minecraft:lily_of_the_valley": {
    "name": "Lily of the Valley",
    "baseValue": 65,
    "element": "Ender",
    "rgb": [0.949, 0.945, 0.949],
    "primaryEffects": {
      "maxRange": 150,
      "effectLoad": 5
    },
    "secondaryEffects": {
      "type": "amplifier"
    }
  },
  "minecraft:red_tulip": {
    "name": "Red Tulip",
    "baseValue": 60,
    "element": "Sky",
    "rgb": [0.921, 0.066, 0.137],
    "primaryEffects": {
      "maxRange": 150,
      "effectLoad": 3
    },
    "secondaryEffects": {
      "type": "extender",
      "increaseAmount": 45
    }
  },
  "minecraft:orange_tulip": {
    "name": "Orange Tulip",
    "baseValue": 60,
    "element": "Sky",
    "rgb": [0.921, 0.066, 0.137],
    "primaryEffects": {
      "maxRange": 150,
      "effectLoad": 3
    },
    "secondaryEffects": {
      "type": "extender",
      "increaseAmount": 45
    }
  },
  "minecraft:pink_tulip": {
    "name": "Pink Tulip",
    "baseValue": 60,
    "element": "Sky",
    "rgb": [0.921, 0.066, 0.137],
    "primaryEffects": {
      "maxRange": 150,
      "effectLoad": 3
    },
    "secondaryEffects": {
      "type": "extender",
      "increaseAmount": 45
    }
  },
  "minecraft:white_tulip": {
    "name": "White Tulip",
    "baseValue": 60,
    "element": "Sky",
    "rgb": [0.921, 0.066, 0.137],
    "primaryEffects": {
      "maxRange": 150,
      "effectLoad": 3
    },
    "secondaryEffects": {
      "type": "extender",
      "increaseAmount": 45
    }
  },
  "minecraft:azure_bluet": {
    "name": "Azure Bluet",
    "baseValue": 20,
    "element": "Earth",
    "rgb": [0.921, 0.066, 0.137],
    "primaryEffects": {
      "maxRange": 150,
      "effectLoad": 2
    },
    "secondaryEffects": {
      "type": "corruptor"
    }
  },
  "minecraft:wither_rose": {
    "name": "Wither Rose",
    "baseValue": -35,
    "element": "Ender",
    "rgb": [0.22, 0.176, 0.176],
    "primaryEffects": {
      "maxRange": 90,
      "effectLoad": 3
    },
    "secondaryEffects": {
      "type": "extender",
      "increaseAmount": 15
    }
  },
  "minecraft:fermented_spider_eye": {
    "name": "Fermented Spider Eye",
    "baseValue": -20,
    "element": "Ender",
    "rgb": [0.388, 0.012, 0.122],
    "primaryEffects": {
      "maxRange": 120,
      "effectLoad": 5
    },
    "secondaryEffects": {
      "type": "corruptor"
    }
  },
  "minecraft:feather": {
    "name": "Feather",
    "baseValue": 8,
    "element": "Sky",
    "rgb": [0.996, 1, 0.961],
    "primaryEffects": {
      "maxRange": 150,
      "effectLoad": 3
    },
    "secondaryEffects": {
      "type": "amplifier"
    }
  },
  "minecraft:phantom_membrane": {
    "name": "Phantom Membrane",
    "baseValue": 20,
    "element": "Sky",
    "rgb": [0.89, 0.87, 0.89],
    "primaryEffects": {
      "maxRange": 150,
      "effectLoad": 3
    },
    "secondaryEffects": {
      "type": "extender",
      "increaseAmount": 80
    }
  },
  "minecraft:gold_ingot": {
    "name": "Gold Ingot",
    "baseValue": 40,
    "element": "Earth",
    "rgb": [0.969, 0.753, 0.055],
    "primaryEffects": {
      "maxRange": 150,
      "effectLoad": 5
    },
    "secondaryEffects": {
      "type": "corruptor"
    }
  },
  "minecraft:iron_ingot": {
    "name": "Iron Ingot",
    "baseValue": 70,
    "element": "Earth",
    "rgb": [0.659, 0.659, 0.659],
    "primaryEffects": {
      "maxRange": 150,
      "effectLoad": 3
    },
    "secondaryEffects": {
      "type": "extender",
      "increaseAmount": 60
    }
  },
  "minecraft:turtle_scute": {
    "name": "Turtle Scute",
    "baseValue": 10,
    "element": "Lunar",
    "rgb": [0.11, 0.80, 0.32],
    "primaryEffects": {
      "maxRange": 150,
      "effectLoad": 3
    },
    "secondaryEffects": {
      "type": "amplifier"
    }
  },
  "minecraft:armadillo_scute": {
    "name": "Armadillo Scute",
    "baseValue": 15,
    "element": "Earth",
    "rgb": [0.46, 0.35, 0.203],
    "primaryEffects": {
      "maxRange": 150,
      "effectLoad": 3
    },
    "secondaryEffects": {
      "type": "nullifier"
    }
  },
  "minecraft:prismarine_crystals": {
    "name": "Prismarine Crystals",
    "baseValue": 40,
    "element": "Lunar",
    "rgb": [0.145, 0.58, 0.506],
    "primaryEffects": {
      "maxRange": 150,
      "effectLoad": 3
    },
    "secondaryEffects": {
      "type": "corruptor"
    }
  },
  "minecraft:nautilus_shell": {
    "name": "Nautilus Shell",
    "baseValue": 40,
    "element": "Lunar",
    "rgb": [0.941, 0.831, 0.627],
    "primaryEffects": {
      "maxRange": 150,
      "effectLoad": 3
    },
    "secondaryEffects": {
      "type": "nullifier"
    }
  },
  "minecraft:ghast_tear": {
    "name": "Ghast Tear",
    "baseValue": 45,
    "element": "Solar",
    "rgb": [0.933, 0.841, 0.791],
    "primaryEffects": {
      "maxRange": 150,
      "effectLoad": 5
    },
    "secondaryEffects": {
      "type": "corruptor"
    }
  },
  "minecraft:echo_shard": {
    "name": "Echo Shard",
    "baseValue": -40,
    "element": "Ender",
    "rgb": [0.039, 0.353, 0.225],
    "primaryEffects": {
      "maxRange": 150,
      "effectLoad": 5
    },
    "secondaryEffects": {
      "type": "amplifier"
    }
  },
  "minecraft:magma_cream": {
    "name": "Magma Cream",
    "baseValue": 24,
    "element": "Solar",
    "rgb": [0.949, 0.475, 0.047],
    "primaryEffects": {
      "maxRange": 150,
      "effectLoad": 3
    },
    "secondaryEffects": {
      "type": "extender",
      "increaseAmount": 75
    }
  },
  "minecraft:resin_clump": {
    "name": "Resin Clump",
    "baseValue": 55,
    "element": "Lunar",
    "rgb": [0.925, 0.447, 0.078],
    "primaryEffects": {
      "maxRange": 150,
      "effectLoad": 5
    },
    "secondaryEffects": {
      "type": "extender",
      "increaseAmount": 120
    }
  },
  "bw:filled_phial": {
    "name": "Phial of Distilled Gas",
    "baseValue": 0,
    "element": "",
    "rgb": [0.5, 0.5, 0.5],
    "primaryEffects": {},
    "secondaryEffects": {}
  },
}

export const modifierList = {
  "bw:coal_dust": {
    "name": "Coal Dust",
    "modify": (reagent) => {
      return Math.round(reagent * 2);
    },
    "rgb": [0.176, 0.176, 0.176]
  }, // Double
  "bw:amethyst_dust": {
    "name": "Amethyst Dust",
    "modify": (reagent) => {
      return Math.round(reagent * 3);
    },
    "rgb": [0.624, 0.251, 0.859]
  }, // Triple
  "bw:dandelion_dust": {
    "name": "Crushed Dandelion",
    "modify": (reagent) => {
      return reagent - 15;
    },
    "rgb": [0.98, 0.965, 0.18]
  }, // -10%
  "bw:poppy_dust": {
    "name": "Crushed Poppy",
    "modify": (reagent) => {
      return reagent - 45;
    },
    "rgb": [0.941, 0.082, 0.208],
  }, // -30%
  "bw:blue_orchid_dust": {
    "name": "Crushed Blue Orchid",
    "modify": (reagent) => {
      return reagent + 15;
    },
    "rgb": [0.318, 0.549, 0.851],
  }, // +10%
  "bw:cornflower_dust": {
    "name": "Crushed Cornflower",
    "modify": (reagent) => {
      return reagent + 45;
    },
    "rgb": [0.078, 0.443, 0.949],
  }, // +30%
  "bw:oxeye_daisy_dust": {
    "name": "Crushed Oxeye Daisy",
    "modify": (reagent) => {
      return Math.round(reagent / 2);
    },
    "rgb": [0.078, 0.443, 0.949],
  }, // Bisect
  "bw:emerald_dust": {
    "name": "Emerald Dust",
    "modify": (reagent) => {
      return Math.round(reagent / 3);
    },
    "rgb": [0.078, 0.443, 0.949],
  }, // Trisect
}

function bulletStringArray(array) {
  let str = "";
  for (let arr of array) {
    str += `(-) ${arr}\n`
  }
  return str;
}

export function herbToString(herb) {
  let reagent = herbList[herb];
  let entry = `§aBase Potency:§r ${reagent.baseValue}%%\n§aPrimal Element§r: ${reagent.element}\n§aSecondary Effect Type:§r ${capitalize(reagent.secondaryEffects.type)}\n`;
  if (reagent.secondaryEffects.type == "extender") {
    entry += `§aExtend Amount:§r ${getPotionTime(reagent.secondaryEffects.increaseAmount)}\n`;
  }
  return entry;
}