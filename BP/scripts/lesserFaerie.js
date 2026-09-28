import {world, Entity, MolangVariableMap, system, ItemStack, BlockPermutation, EntitySkinIdComponent} from "@minecraft/server";
import {getEntityFromBlood} from "./getTaglock.js";
import {titaniaPlants} from "./curses.js";
import {verifyPatron} from "./altars.js";
import { corruptList, getHerbId, corruptEffect, isEffectValid, getPotionTime, herbsToLore, herbsToElements, bottlePotion, herbDistil } from "./potionCrafting.js";
import { loadReagent } from "./Main.js";
import { greaterFaePunishment } from "./castRitual.js";
import { herbList } from "./herbList.js";

export const faerieEntryButtons = {
  "genis": ["Genis", "textures/items/dusts/natural_ash"],
  "chlorophae": ["Chlorophae", "textures/items/wheat_seeds"],
  "floralil": ["Floralil", "textures/blocks/flower_rose"],
  "spriggan": ["Spriggan", "textures/items/egg"],
  "cordia": ["Cordia", "textures/blocks/heart_pottery_pattern"],
  "magmaroc": ["Magmaroc", "textures/blocks/magma"],
  "qua'vibres": ["Qua'Vibres", "textures/items/villagebell"],
  "bulafoa": ["Bulafoa", "textures/ui/conduit_power_effect"],
  "corrosyne": ["Qua'Vibres", "textures/ui/poison_effect"],
  "xet'rov": ["Xet'rov", "textures/blocks/flow_pottery_pattern"],
  "aje_hermos": ["Aje Hermos", "textures/items/emerald"],
  "solkra": ["Solkra", "textures/blocks/sponge"],
  "kalorai": ["Kalorai", "textures/items/flint_and_steel"],
  "quillwyn": ["Quillwyn", "textures/items/feather"],
  "iceling": ["Iceling", "textures/items/snowball"],
  "alkares": ["Alkares", "textures/items/gold_sword"],
  
  // Median Fae (ids are common nouns)
  "aerial": ["Aerial", "textures/items/wind_charge"],
  "wildfyre": ["Wildfyre", "textures/items/blaze_powder"],
  "dryas": ["Dryas", "textures/blocks/sapling_oak"],
  "vitalia": ["Vitalia", "textures/items/gold_ingot"],
  "dwarvone": ["Dwarvone", "textures/blocks/glazed_terracotta_yellow"],
  "brownie": ["Brownie", "textures/items/cake"],
  
  // Greater Fae (ids are common nouns)
  "hebaya": ["Hebaya", "textures/items/cauldron"],
  "titania": ["Titania", "textures/items/honeycomb"],
  "oberon": ["Oberon", "textures/blocks/barrel_top"],
  "efyrin": ["Efyrin", "textures/blocks/raw_gold_block"],
}

export const faeries = {
  "Genis": "genis",
  "Chlorophae": "chlorophae",
  "Floralil": "floralil",
  "Spriggan": "spriggan",
  "Cordia": "cordia",
  "Magmaroc": "magmaroc",
  "Qua'Vibres": "qua'vibres",
  "Bulafoa": "bulafoa",
  "Corrosyne": "corrosyne",
  "Xet'rov": "xet'rov",
  "Aje Hermos": "aje_hermos",
  "Solkra": "solkra",
  "Kalorai": "kalorai",
  
  "Dryas": "dryas",
  "Vitalia": "vitalia",
  "Dwarvone": "dwarvone",
  // "Brownie": "brownie",
  
  "Titania": "titania",
  // "Hebaya": "hebaya",
  "Oberon": "oberon",
  "Efyrin": "efyrin"
}

export const faerieSpellList = {
  "genis": ["Conceal", "Channel"],
  "chlorophae": ["Growth"],
  "aerial": ["Gust"],
  "avistrum": ["Shock"],
  "quillwyn": ["Conceal"], // Insight
  "iceling": ["Frost"],
  "alkares": ["Bulward"],
  "wildfyre": ["Ignite"],
  "dryas": ["Thorns", "Apple"],
  "vitalia": ["Heal", "Detoxify"],
  "dwarvone": ["Stone", "Dig"],
  "brownie": ["Mend", "Hearth"],
  "hebaya": ["Evoke", "Wyrd"],
  "titania": ["Egg", "Buzz"],
  "oberon": ["Frenzy", "Surge"],
}

export function convertFaeName(name) {
  if (faeries[name] == undefined) {
    return name;
  }
  return faeries[name];
}

export const lesserFae = {
  "undefined": "undefined",
  "genis": {
    "id": "genis",
    "standing": "lesser",
    "name": "Genis",
    "majorCourt": "None",
    "theme": "§r",
    "baseInterest": 5,
    "baseTrustIncrease": 0.65,
    "trickiness": 1,
    "secretWager": 1,
    "games": [
      [100, "tag"]
    ],
    "favoredHours": {
      "start": 6000,
      "end": 8000
    },
    "offerings": {
      "likedTastes": [
        "minecraft:regeneration",
        "minecraft:speed",
        "minecraft:haste"
      ],
      "dislikedTastes": [
        "minecraft:slowness",
        "minecraft:poison",
        "minecraft:wither"
      ]
    },
    "responses": {
      "chosen": "Genis is here. It seems it has always been here, waiting for you.",
      "depart": "Genis nods; it understands. It leaves your service and returns to the Wylde.",
      "pleased": {
        "msg": "Genis nods, pleased."
      },
      "displeased": {
        "msg": "Genis accepts; though, it is not pleased with its offering."
      },
      "unsure": {
        "msg": "Genis is unsure of what to make of this, but it will accept it regardless."
      }
    }
  },
  
  "chlorophae": {
    "id": "chlorophae",
    "standing": "lesser",
    "name": "Chlorophae",
    "majorCourt": "Solar",
    "minorCourt": "Titania",
    "theme": "§a",
    "baseInterest": 35,
    "baseTrustIncrease": 0.7,
    "trickiness": 1,
    "secretWager": 2,
    "games": [
      [100, "tag"]
    ],
    "offerings": {
      "likedTastes": [
        "minecraft:instant_health",
        "minecraft:regeneration",
        "minecraft:health_boost"
      ],
      "dislikedTastes": [
        "minecraft:poison",
        "minecraft:wither"
      ]
    },
    "favoredHours": {
      "start": 5000,
      "end": 7000
    },
    "responses": {
      "chosen": "A happy Chlorophae answers your call.",
      "depart": "Chlorophae understands, and you feel its influence disappear back into nowhere...",
      "pleased": {
        "msg": "Chlorophae bounces up and down happily."
      },
      "displeased": {
        "msg": "Chlorophae clearly dislikes this, but it decides to not cause trouble."
      },
      "unsure": {
        "msg": "Chlorophae is unsure what to do with this. It accepts it anyway."
      }
    },
    "relations": [
      {
        "isLiked": true,
        "faerie": "floralil"
      },
      {
        "isLiked": false,
        "faerie": "corrosyne"
      }
    ]
  },
  "floralil": {
    "id": "floralil",
    "standing": "lesser",
    "name": "Floralil",
    "majorCourt": "Solar",
    "minorCourt": "Titania",
    "theme": "§c",
    "baseInterest": 30,
    "baseTrustIncrease": 0.68,
    "trickiness": 2,
    "secretWager": 2,
    "games": [
      [100, "tag"]
    ],
    "offerings": {
      "likedTastes": [
        "minecraft:haste",
        "minecraft:fire_protection",
        "minecraft:instant_health",
        "minecraft:regeneration",
        "minecraft:health_boost"
      ],
      "dislikedTastes": [
        "minecraft:poison",
        "minecraft:wither"
      ]
    },
    "favoredHours": {
      "start": 4000,
      "end": 6000
    },
    "responses": {
      "chosen": "There is a giggle, then the aroma of poppies. Floralil has answered.",
      "depart": "There is a dandelion scent in the air, then nothing. Floralil has left.",
      "pleased": {
        "msg": "You envision sunflowers in the plains in seas of floral gold and brown."
      },
      "displeased": {
        "msg": "Strange... there is the scent of lilies in the air, with a hint of wither rose."
      },
      "unsure": {
        "msg": "There is a confused assortment of smells, all floral, but none compliment each other. Perhaps this expresses confusion?"
      }
    },
    "relations": [
      {
        "isLiked": true,
        "faerie": "chlorophae"
      },
      {
        "isLiked": false,
        "faerie": "corrosyne"
      }
    ]
  },
  "spriggan": {
    "id": "spriggan",
    "standing": "lesser",
    "name": "Spriggan",
    "majorCourt": "Solar",
    "minorCourt": "Titania",
    "theme": "§q",
    "baseInterest": 15,
    "baseTrustIncrease": 0.65,
    "trickiness": 4,
    "secretWager": 3,
    "games": [
      [100, "tag"]
    ],
    "offerings": {
      "likedTastes": [
        "minecraft:haste",
        "minecraft:instant_health",
        "minecraft:regeneration",
        "minecraft:speed"
      ],
      "dislikedTastes": [
        "minecraft:slowness",
        "minecraft:fatal_poison",
        "minecraft:poison",
        "minecraft:wither"
      ]
    },
    "favoredHours": {
      "start": 4000,
      "end": 8000
    },
    "responses": {
      "chosen": "Spriggan has found you.",
      "depart": "There is nothing left for Spriggan here, and so it leaves. However, you understand that it still stalks within the Woods you must not see.",
      "pleased": {
        "msg": "The happy yip of the fox, the excited bark of the wolf. These are the feelings that make themselves known to you."
      },
      "displeased": {
        "msg": "A rumbling deep within the wolf, the sharp eyes of an avian hunter, the pressure of something immense hidden below. These are the feelings that make themselves known to you."
      },
      "unsure": {
        "msg": "A strange turn of the wolf's head, the bored meow of a cat, the uninterested hopping of the frog. These are the feelings that make themselves known to you."
      }
    },
    "relations": []
  },
  "cordia": {
    "id": "cordia",
    "standing": "lesser",
    "name": "Cordia",
    "majorCourt": "Solar",
    "minorCourt": "Titania",
    "theme": "§4",
    "baseInterest": 10,
    "baseTrustIncrease": 0.45,
    "trickiness": 6,
    "secretWager": 3,
    "games": [
      [100, "tag"]
    ],
    "offerings": {
      "likedTastes": [
        "minecraft:haste",
        "minecraft:instant_health",
        "minecraft:regeneration",
        "minecraft:speed",
        "minecraft:slowness"
      ],
      "dislikedTastes": [
        "minecraft:fatal_poison",
        "minecraft:weakness",
        "minecraft:poison",
        "minecraft:wither"
      ]
    },
    "favoredHours": {
      "start": 7000,
      "end": 9000
    },
    "responses": {
      "chosen": "There is a pulsing. Cordia has answered.",
      "depart": "The pulsing has stopped. Cordia has left.",
      "pleased": {
        "msg": "Pulses, beats, find their way into your surroundings. There is pattern and excitement in their sound."
      },
      "displeased": {
        "msg": "There are discordant beats from everywhere all at once and it thrums through you with aggression."
      },
      "unsure": {
        "msg": "There are small subtle beats, mild pulsation. There is no excitement but there is also no rage."
      }
    },
    "relations": [
      {
        "isLiked": true,
        "faerie": "qua'vibres"
      }
    ]
  },
  
  "magmaroc": {
    "id": "magmaroc",
    "standing": "lesser",
    "name": "Magmaroc",
    "majorCourt": "Solar",
    "minorCourt": "Oberon",
    "theme": "§n",
    "baseInterest": 15,
    "baseTrustIncrease": 0.7,
    "trickiness": 3,
    "secretWager": 3,
    "games": [
      [100, "tag"]
    ],
    "offerings": {
      "likedTastes": [
        "minecraft:fire_resistance",
        "minecraft:haste",
        "minecraft:slowness"
      ],
      "dislikedTastes": [
        "minecraft:mining_fatigue",
        "minecraft:weakness"
      ]
    },
    "favoredHours": {
      "start": 3000,
      "end": 5000
    },
    "responses": {
      "chosen": "A heat can be felt from below your feet and then it cools. Magmaroc has decided it will pact with you.",
      "depart": "The pact has been broken and Magmaroc sinks back into its Median's domain.",
      "pleased": {
        "msg": "The sound of popping magma greets your ears. Magmaroc is happy."
      },
      "displeased": {
        "msg": "The sound of bubbling magma greets your ears. Magmaroc isn't very happy."
      },
      "unsure": {
        "msg": "There is a sense that Magmaroc doesn't understand what the intent was."
      }
    },
    "relations": [
      {
        "isLiked": true,
        "faerie": "bulafoa"
      }
    ]
  },
  "qua'vibres": {
    "id": "qua'vibres",
    "standing": "lesser",
    "name": "Qua'Vibres",
    "majorCourt": "Solar",
    "minorCourt": "Oberon",
    "theme": "§8",
    "baseInterest": 3,
    "baseTrustIncrease": 0.65,
    "trickiness": 5,
    "secretWager": 3,
    "games": [
      [100, "tag"]
    ],
    "offerings": {
      "likedTastes": [
        "minecraft:haste",
        "minecraft:speed"
      ],
      "dislikedTastes": [
        "minecraft:slowness",
        "minecraft:mining_fatigue"
      ]
    },
    "favoredHours": {
      "start": 6000,
      "end": 8000
    },
    "responses": {
      "chosen": "A ringing occurs and, from its vibrations, you understand that Qua'Vibres has decided to take a place in your Family.",
      "depart": "The ringing fades. With it, Qua'Vibres moves further and further away until both are gone. There is simply silence.",
      "pleased": {
        "msg": "A high pitched ringing emits from below."
      },
      "displeased": {
        "msg": "A deep low humming can be heard from below."
      },
      "unsure": {
        "msg": "There is seemingly silence, but there is something there. You simply cannot make it out well."
      }
    },
    "relations": [
      {
        "isLiked": true,
        "faerie": "cordia"
      }
    ]
  },
  "bulafoa": {
    "id": "bulafoa",
    "standing": "lesser",
    "name": "Bulafoa",
    "majorCourt": "Solar",
    "minorCourt": "Oberon",
    "theme": "§3",
    "baseInterest": 10,
    "baseTrustIncrease": 0.7,
    "trickiness": 6,
    "secretWager": 3,
    "games": [
      [100, "tag"]
    ],
    "offerings": {
      "likedTastes": [
        "minecraft:water_breathing",
        "minecraft:conduit_power",
        "minecraft:speed"
      ],
      "dislikedTastes": [
        "minecraft:slowness",
        "minecraft:mining_fatigue"
      ]
    },
    "favoredHours": {
      "start": 5000,
      "end": 7000
    },
    "responses": {
      "chosen": "The cosmic waves crash into you and Bulafoa has decided to join your Family.",
      "depart": "The cosmic waves recede and it takes Bulafoa with it.",
      "pleased": {
        "msg": "A series of soft multicolored bubbles give you a sense of pleasant calm."
      },
      "displeased": {
        "msg": "Bulafoa decides to not give a response."
      },
      "unsure": {
        "msg": "You only find plain bubbles."
      }
    },
    "relations": [
      {
        "isLiked": true,
        "faerie": "magmaroc"
      },
      {
        "isLiked": false,
        "faerie": "solkra"
      }
    ]
  },
  "corrosyne": {
    "id": "corrosyne",
    "standing": "lesser",
    "name": "Corrosyne",
    "majorCourt": "Solar",
    "minorCourt": "Oberon",
    "theme": "§n",
    "baseInterest": 5,
    "baseTrustIncrease": 0.5,
    "trickiness": 6,
    "secretWager": 3,
    "games": [
      [100, "tag"]
    ],
    "offerings": {
      "likedTastes": [
        "minecraft:poison",
        "minecraft:fatal_poison",
        "minecraft:resistance",
        "minecraft:wither"
      ],
      "dislikedTastes": [
        "minecraft:regeneration",
        "minecraft:absorption",
        "minecraft:health_boost"
      ]
    },
    "favoredHours": {
      "start": 6000,
      "end": 8000
    },
    "responses": {
      "chosen": "Corrosyne rises from the cosmic seas and there is a strange burn to it.",
      "depart": "Corrosyne sinks back into the cosmic seas.",
      "pleased": {
        "msg": "Corrosyne's acid is fairly mild today."
      },
      "displeased": {
        "msg": "Corrosyne's acid rises to dangerously potent levels."
      },
      "unsure": {
        "msg": "Corrosyne ignores you, though you can tell it appreciates the thought."
      }
    },
    "relations": [
      {
        "isLiked": false,
        "faerie": "chlorophae"
      },
      {
        "isLiked": false,
        "faerie": "floralil"
      }
    ]
  },
  
  "xet'rov": {
    "id": "xet'rov",
    "standing": "lesser",
    "name": "Xet'rov",
    "majorCourt": "Solar",
    "minorCourt": "Efyrin",
    "theme": "§7",
    "baseInterest": 27,
    "baseTrustIncrease": 0.68,
    "trickiness": 8,
    "secretWager": 5,
    "games": [
      [100, "tag"]
    ],
    "offerings": {
      "likedTastes": [
        "minecraft:wind_charged",
        "minecraft:speed",
        "minecraft:haste",
        "minecraft:slow_falling"
      ],
      "dislikedTastes": [
        "minecraft:resistance",
        "minecraft:slowness",
        "minecraft:mining_fatigue"
      ]
    },
    "favoredHours": {
      "start": 5000,
      "end": 7000
    },
    "responses": {
      "chosen": "A Faerie after Lord Time's own heart has graced you with its majesty. Xet'rov laughs in pure joy.",
      "depart": "Just as all things, Xet'rov must go. It bids you a happy farewell.",
      "pleased": {
        "msg": "Joy is a wheel and Xet'rov is the force that turns it. There is the absolute sense that it is pleased."
      },
      "displeased": {
        "msg": "The air is stirred and tugged into a minor whirl. Perhaps that might not have been the loveliest of offerings."
      },
      "unsure": {
        "msg": "Xet'rov wonders what lies between your ears but is polite enough to assume it is enough. The offering however... it decides to not decide."
      }
    },
    "relations": []
  },
  "aje_hermos": {
    "id": "aje_hermos",
    "standing": "lesser",
    "name": "Aje Hermos",
    "majorCourt": "Solar",
    "minorCourt": "Efyrin",
    "theme": "§p",
    "baseInterest": 27,
    "baseTrustIncrease": 0.58,
    "trickiness": 9,
    "secretWager": 4,
    "games": [
      [100, "tag"]
    ],
    "offerings": {
      "likedTastes": [
        "minecraft:regeneration",
        "minecraft:health_boost",
        "minecraft:absorption",
        "minecraft:resistance",
        "minecraft:speed",
        "minecraft:haste"
      ],
      "dislikedTastes": [
        "minecraft:poison",
        "minecraft:fatal_poison",
        "minecraft:slowness",
        "minecraft:mining_fatigue"
      ]
    },
    "favoredHours": {
      "start": 5000,
      "end": 7000
    },
    "responses": {
      "chosen": "Aje Hermos joins your Family willingly. A trade is a trade after all.",
      "depart": "Aje Hermos leaves. Its time is up, or perhaps it was yours.",
      "pleased": {
        "msg": "A fair trade has transpired. Aje Hermos is pleased."
      },
      "displeased": {
        "msg": "Aje Hermos is not happy, but a trade is a trade."
      },
      "unsure": {
        "msg": "This trade is... something. Aje Hermos is unsure what to feel about it."
      }
    },
    "relations": []
  },
  "solkra": {
    "id": "solkra",
    "standing": "lesser",
    "name": "Solkra",
    "majorCourt": "Solar",
    "minorCourt": "Efyrin",
    "theme": "§c",
    "baseInterest": 15,
    "baseTrustIncrease": 0.6,
    "trickiness": 4,
    "secretWager": 2,
    "games": [
      [100, "tag"]
    ],
    "offerings": {
      "likedTastes": [
        "minecraft:water_breathing",
        "minecraft:conduit_power",
        "minecraft:fire_resistance"
      ],
      "dislikedTastes": [
        "minecraft:poison",
        "minecraft:fatal_poison",
        "minecraft:slowness",
        "minecraft:mining_fatigue"
      ]
    },
    "favoredHours": {
      "start": 5000,
      "end": 7000
    },
    "responses": {
      "chosen": "Solkra decides to join your Family.",
      "depart": "Solkra leaves your Family.",
      "pleased": {
        "msg": "You get the sense Solkra likes this offering."
      },
      "displeased": {
        "msg": "You are suddenly reminded of a desert. There are very many bones."
      },
      "unsure": {
        "msg": "Solkra doesn't mind this offering."
      }
    },
    "relations": [
      {
        "isLiked": false,
        "faerie": "bulafoa"
      }
    ]
  },
  "kalorai": {
    "id": "kalorai",
    "standing": "lesser",
    "name": "Kalorai",
    "majorCourt": "Solar",
    "minorCourt": "Efyrin",
    "theme": "§c",
    "baseInterest": 30,
    "baseTrustIncrease": 0.7,
    "trickiness": 2,
    "secretWager": 2,
    "games": [
      [100, "tag"]
    ],
    "offerings": {
      "likedTastes": [
        "minecraft:regeneration",
        "minecraft:instant_health",
        "minecraft:haste"
      ],
      "dislikedTastes": [
        "minecraft:weakness",
        "minecraft:fire_resistance",
        "minecraft:slowness",
        "minecraft:mining_fatigue"
      ]
    },
    "favoredHours": {
      "start": 5000,
      "end": 7000
    },
    "responses": {
      "chosen": "The Kalorae leave one of their numbers in your company.",
      "depart": "Kalorai rejoins its siblings in their Median's domain.",
      "pleased": {
        "msg": "There is a gentle warmness in the air."
      },
      "displeased": {
        "msg": "The air burns."
      },
      "unsure": {
        "msg": "There is... nothing? You suppose that Kalorai does not care much about this offering."
      }
    },
    "relations": []
  }
}

export const medianFae = {
  "dryas": {
    "id": "dryas",
    "standing": "median",
    "name": "Dryas",
    "majorCourt": "Solar",
    "minorCourt": "Titania",
    "theme": "§2",
    "baseInterest": 5,
    "baseTrustIncrease": 0.3,
    "resonance": 4,
    "titles": ["Guardian of the Forest", "Fruit Bearer"],
    "subFaeries": [
      "chlorophae",
      "floralil"
    ],
    "relations": [
      {
        "isLiked": false,
        "faerie": "vitalia"
      }
    ],
    // sacredColor can also include names found in blocks, eg. "deepslate", "prismarine".
    "sacredColor": [
      "green"
    ],
    "sacredColorInfo": "Green",
    "altarBlocks": [
      // All Saplings
      "minecraft:oak_sapling",
      "minecraft:spruce_sapling",
      "minecraft:birch_sapling",
      "minecraft:jungle_sapling",
      "minecraft:acacia_sapling",
      "minecraft:dark_oak_sapling",
      "minecraft:pale_oak_sapling",
      "minecraft:cherry_sapling",
      "minecraft:flowering_azalea",
      "minecraft:azalea_leaves_flowered",
      "minecraft:mangrove_propugale",
      
      // All Vines
      "minecraft:vine",
      "minecraft:cave_vines",
      "minecraft:cave_vines_body_with_berries",
      "minecraft:cave_vines_head_with_berries",
      "minecraft:hanging_moss",
      "minecraft:pale_hanging_moss"
    ],
    "altarBlockInfo": "Saplings and Vines",
    "offerings": {
      "likedTastes": [
        "minecraft:speed",
        "minecraft:haste"
      ],
      "dislikedTastes": [
        "minecraft:poison"
      ]
    },
    "sphereOfInfluence": "Forests",
    "actions": {
      "onPlayerBreak": [
        {
          "actionId": "dryas:saplingBreak",
          "blocks": [
            "minecraft:oak_sapling",
            "minecraft:spruce_sapling",
            "minecraft:birch_sapling",
            "minecraft:jungle_sapling",
            "minecraft:acacia_sapling",
            "minecraft:dark_oak_sapling",
            "minecraft:pale_oak_sapling",
            "minecraft:cherry_sapling",
            "minecraft:flowering_azalea",
            "minecraft:mangrove_propugale"
          ],
          "dailyLimit": 0,
          "punishmentSave": 35,
          "trustGain": -0.5
        },
        {
          "actionId": "dryas:logBreak",
          "blocks": [
            "minecraft:oak_log",
            "minecraft:spruce_log",
            "minecraft:birch_log",
            "minecraft:jungle_log",
            "minecraft:acacia_log",
            "minecraft:dark_oak_log",
            "minecraft:pale_oak_log",
            "minecraft:cherry_log",
            "minecraft:mangrove_log"
          ],
          "dailyLimit": (trust) => {
            let limit = 20*Math.ceil(trust/10);
            if (limit < 0) {
              limit = 20;
            }
            return limit;
          },
          "punishmentSave": 60,
          "trustGain": -0.2
        }
      ],
      "onPlayerPlace": [
        {
          "actionId": "dryas:saplingPlace",
          "blocks": [
            "minecraft:oak_sapling",
            "minecraft:spruce_sapling",
            "minecraft:birch_sapling",
            "minecraft:jungle_sapling",
            "minecraft:acacia_sapling",
            "minecraft:dark_oak_sapling",
            "minecraft:pale_oak_sapling",
            "minecraft:cherry_sapling",
            "minecraft:flowering_azalea",
            "minecraft:mangrove_propugale"
          ],
          "dailyLimit": 0,
          "trustSave": 45,
          "trustGain": 0.5
        }
      ],
      "onUseOn": [
        {
          "actionId": "dryas:fireHazard",
          "items": [
            "minecraft:fire_charge",
            "minecraft:flint_and_steel"
          ],
          "dailyLimit": 0,
          "punishmentSave": 75,
          "trustGain": -2.5
        }
      ],
      "onSpellTag": [
        {
          "actionId": "dryas:fireSpellDislike",
          "tags": [
            "fire"
          ],
          "dailyLimit": 0,
          "punishmentSave": 35,
          "trustGain": -0.2
        },
        {
          "actionId": "dryas:plantSpellLike",
          "tags": [
            "plant"
          ],
          "dailyLimit": 0,
          "trustSave": 35,
          "trustGain": +0.2
        }
      ],
    },
    // Blessings
    // Thorny Aid
    // Forest Speed
    // Apple (Golden)
    "punishments": [
      (witch) => {
        let amp = Math.floor(Math.random() * 4);
        if (amp == 0) {
          amp = undefined;
        }
        witch.addEffect("minecraft:fatal_poison", 20*20, {amplifier: amp});
      }, // Fatal Poison
      (witch) => {
        let silverFishAmount = 4+Math.floor(Math.random() * 4);
        
        for (let s = 0; s < silverFishAmount; s++) {
          let entity = witch.dimension.spawnEntity("minecraft:silverfish", witch.location);
          entity.applyDamage(1, {cause: "entityAttack", damagingEntity: witch})
        }
      } // Silver Infestation
    ],
    // Some Median+ Faeries grant blessings when they "trust" the Witch enough and an offering is made.
    "offeringEffects": (witch, candle, trust) => {
      
    },
    // Median & Greater responses cannot be in words. They must come through signs (particles) and sounds.
    "responses": {
      "pleased": (candle, witch) => {},
      "displeased": (candle, witch) => {},
      "unsure": (candle, witch) => {}
    }
  },
  "vitalia": {
    "id": "vitalia",
    "standing": "median",
    "name": "Vitalia",
    "majorCourt": "Solar",
    "minorCourt": "Titania",
    "theme": "§g",
    "baseInterest": 10,
    "baseTrustIncrease": 0.35,
    "resonance": 4,
    "titles": ["Benevolent Lord", "Benevolent Lady", "Gentle One"],
    "subFaeries": [
      "spriggan",
      "cordia"
    ],
    "relations": [
      {
        "isLiked": false,
        "faerie": "dryas"
      }
    ],
    "sacredColor": [
      "yellow",
      "gold"
    ],
    "sacredColorInfo": "Yellow",
    "altarBlocks": [],
    "altarBlockInfo": "Gold. Pure Gold.",
    "offerings": {
      "likedTastes": [
        "minecraft:regeneration",
        "minecraft:health_boost"
      ],
      "dislikedTastes": [
        "minecraft:fatal_poison",
        "minecraft:poison",
        "minecraft:wither"
      ]
    },
    "sphereOfInfluence": "Vitality",
    "actions": {
      "onHitEntity": [
        {
          "actionId": "vitalia:hit_monster",
          "family": [
            "monster"
          ],
          "dailyLimit": 0,
          "trustSave": 70,
          "trustGain": +0.2
        },
        {
          "actionId": "vitalia:hit_non_monster",
          "excludeFamily": [
            "monster"
          ],
          "dailyLimit": 0,
          "punishmentSave": 80,
          "trustGain": -0.2
        }
      ],
      "onSpellTag": [
        {
          "actionId": "vitalia:maliceSpellDislike",
          "tags": [
            "malice"
          ],
          "dailyLimit": 0,
          "punishmentSave": 50,
          "trustGain": -2
        },
        {
          "actionId": "vitalia:supportSpellLike",
          "tags": [
            "support",
            "abjuration"
          ],
          "dailyLimit": 0,
          "trustSave": 80,
          "trustGain": +1
        }
      ],
    },
    // Blessings
    // Thorny Aid
    // Forest Speed
    // Apple (Golden)
    "punishments": [
      (witch) => {
        let title = medianFae["vitalia"].titles[Math.floor(medianFae["vitalia"].titles.length*Math.random())];
        if (witch.getDynamicProperty(`bwDuration:regen_immunity`) == undefined) {
          witch.sendMessage(`§6[!]§r §6The ${title}§r looks at you, saddened. It pulls from you its blessing of regeneration.`);
              
          let obj = {
            timer: 5*60,
            endMsg: `§a[!]§r §6The ${title}§r permits their blessing of regeneration on you once more.`,
            vanishOnDeath: false
          }
          witch.setDynamicProperty(`bwDuration:regen_immunity`, JSON.stringify(obj));
          witch.removeEffect("minecraft:regeneration")
        }
      }, // Regen Immunity
      (witch) => {
        let title = medianFae["vitalia"].titles[Math.floor(medianFae["vitalia"].titles.length*Math.random())];
        if (witch.getDynamicProperty(`bwDuration:healthBoost_immunity`) == undefined) {
          witch.sendMessage(`§6[!]§r §6The ${title}§r looks at you, disheartened. It pulls from you its blessing of health boost.`);
              
          let obj = {
            timer: 5*60,
            endMsg: `§a[!]§r §6The ${title}§r permits their blessing of health boost on you once more.`,
            vanishOnDeath: false
          }
          witch.setDynamicProperty(`bwDuration:healthBoost_immunity`, JSON.stringify(obj));
          
          witch.removeEffect("minecraft:health_boost")
        }
      } // Health Boost Immunity
    ],
    "offeringEffects": (witch, candle, trust) => {
      
    },
    "responses": {
      "pleased": (candle, witch) => {},
      "displeased": (candle, witch) => {},
      "unsure": (candle, witch) => {}
    }
  },
  "dwarvone": {
    "id": "dwarvone",
    "standing": "median",
    "name": "Dwarvone",
    "majorCourt": "Solar",
    "minorCourt": "Oberon",
    "theme": "§8",
    "baseInterest": 0,
    "baseTrustIncrease": 0.2,
    "resonance": 5,
    "titles": ["Clay Master", "Divine Stonemason", "Stone Shaper"],
    "subFaeries": [
      "magmaroc",
      "qua'vibres"
    ],
    "relations": [],
    // sacredColor can also include names found in blocks, eg. "deepslate", "prismarine".
    "sacredColor": [
      "gray",
      "deepslate",
      "stone",
      "andesite",
      "granite",
      "diorite"
    ],
    "sacredColorInfo": "Gray",
    "altarBlocks": [],
    "altarBlockInfo": "Stone and its variants, Deepslate and its variants.",
    "offerings": {
      "likedTastes": [
        "minecraft:haste",
        "minecraft:slowness",
        "minecraft:mining_fatigue"
      ],
      "dislikedTastes": [
        "minecraft:speed",
        "minecraft:poison",
        "minecraft:weakness"
      ]
    },
    "sphereOfInfluence": "The Stoney Underneath",
    "lenient": true,
    "actions": {},
    "punishments": [],
    // Blessings
    // Gravel Goodies
    "offeringEffects": (witch, candle, trust) => {
      
    },
    "responses": {
      "pleased": (candle, witch) => {},
      "displeased": (candle, witch) => {},
      "unsure": (candle, witch) => {}
    }
  },
  /*
  "brownie": {
    "id": "brownie",
    "standing": "median",
    "name": "Brownie",
    "majorCourt": "Twilight",
    "minorCourt": "Hebaya",
    "theme": "§6",
    "baseInterest": 0.4,
    "baseTrustIncrease": 4,
    "resonance": 4,
    "titles": ["Keeper of the Hearth", "Sanctuary Guardian"],
    "subFaeries": [
      "quillwyn",
      "wikandel"
    ],
    "relations": [],
    // sacredColor can also include names found in blocks, eg. "deepslate", "prismarine".
    "sacredColor": [
      "orange",
      "cake"
    ],
    "sacredColorInfo": "Orange",
    "altarBlocks": [],
    "altarBlockInfo": "Cake. It doesn't truly matter what kind. Simply Cake.",
    "offerings": {
      "likedTastes": [
        "minecraft:regeneration",
        "minecraft:instant_health",
        "minecraft:speed"
      ],
      "dislikedTastes": [
        "minecraft:slowness",
        "minecraft:wither",
        "minecraft:fatal_poison",
        "minecraft:poison",
        "minecraft:weakness"
      ]
    },
    "sphereOfInfluence": "Home",
    "actions": {},
    // Blessings
    // Gravel Goodies
    "punishments": [
      (witch) => {
        let title = medianFae["brownie"].titles[Math.floor(medianFae["brownie"].titles.length*Math.random())];
        if (witch.getDynamicProperty(`bwDuration:living_inventory`) == undefined) {
          witch.sendMessage(`§6[!]§r §6The ${title}§r glances at you disgruntled, as if you've just tracked mud into their home. It mutters a minor hex, one only the Brownies know.`);
              
          let obj = {
            timer: 5*60,
            endMsg: `§a[!]§r §6The ${title}§r permits your inventory to calm itself.`,
            diceSave: 8,
            vanishOnDeath: false
          }
          witch.setDynamicProperty(`bwDuration:living_inventory`, JSON.stringify(obj));
        }
      } // Cluttered Inventory
    ],
    "offeringEffects": (witch, candle, trust) => {
      
    },
    "responses": {
      "pleased": (candle, witch) => {},
      "displeased": (candle, witch) => {},
      "unsure": (candle, witch) => {}
    }
  }
  */
}

export const greaterFae = {
  "titania": {
    "id": "titania",
    "theme": "§a",
    "standing": "greater",
    "name": "Titania",
    "titles": ["Spring Mother", "Lady of the Garden", "Queen of Flowers"],
    "court": "Solar",
    "medians": ["dryas", "vitalia"],
    "baseInterest": 0,
    "baseTrustIncrease": 0.15,
    "offerings": {
      "likedTastes": [
        "minecraft:regeneration",
        "minecraft:instant_health",
        "minecraft:health_boost",
        "minecraft:absorption",
        "minecraft:saturation"
      ],
      "dislikedTastes": [
        "minecraft:wither",
        "minecraft:fatal_poison",
        "minecraft:poison",
        "minecraft:weakness",
        "minecraft:slowness"
      ]
    },
    "relations": [
      {
        "faeryId": "mab",
        "relation": "despised",
        "mediator": "ailill"
      }
    ],
    "sacredColor": [
      "lime",
      "green"
    ],
    "sacredColorInfo": "Lime & Green",
    "sacredMob": [
      "minecraft:chicken",
      "minecraft:bee"
    ],
    "altarBlocks": [
      "minecraft:poppy",
      "minecraft:blue_orchid",
      "minecraft:allium",
      "minecraft:azure_bluet",
      "minecraft:red_tulip",
      "minecraft:orange_tulip",
      "minecraft:white_tulip",
      "minecraft:pink_tulip",
      "minecraft:oxeye_daisy",
      "minecraft:cornflower",
      "minecraft:lily_of_the_valley",
      "minecraft:dandelion",
      "minecraft:sunflower",
      "minecraft:lilac",
      "minecraft:rose_bush",
      "minecraft:peony",
      "minecraft:wither_rose",
      "minecraft:flowering_azalea",
      "minecraft:azalea_leaves_flowered",
      "minecraft:mangrove_propugale",
      "minecraft:closed_eyeblossom",
      "minecraft:open_eyeblossom",
      "minecraft:vine",
      "minecraft:cave_vines",
      "minecraft:cave_vines_body_with_berries",
      "minecraft:cave_vines_head_with_berries",
      "minecraft:hanging_moss",
      "minecraft:pale_hanging_moss",
      "minecraft:small_dripleaf_block",
      "minecraft:big_dripleaf",
      "minecraft:spore_blossom",
      "minecraft:grass_block",
      "minecraft:short_grass",
      "minecraft:fern",
      "minecraft:tall_grass",
      "minecraft:large_fern",
      "minecraft:moss_block",
      "minecraft:moss_carpet",
      "minecraft:pale_moss_carpet",
      "minecraft:pale_moss_block",
      "minecraft:oak_sapling",
      "minecraft:spruce_sapling",
      "minecraft:birch_sapling",
      "minecraft:jungle_sapling",
      "minecraft:acacia_sapling",
      "minecraft:dark_oak_sapling",
      "minecraft:pale_oak_sapling",
      "minecraft:cherry_sapling"
    ],
    "altarBlockInfo": "Flowers, Grass, Vines.",
    "sphereOfInfluence": "Springtime, Fertility",
    "actions": {},
    "punishments": [],
    "requests": {
      "minecraft:wooden_axe": (witch, faeBeing, item) => {
        let hexes = witch.getDynamicProperty("bw:cursePool");
        if (hexes == undefined || hexes == "{}") {
          witch.sendMessage(`§c[!]§r There is no hex that plagues you.`)
          return;
        } else {
          hexes = JSON.parse(hexes);
        }
        
        let hexers = [];
        Object.entries(hexes).forEach((k, v) => {
          if (v.sender != witch.id) {
            hexers.push(v.sender);
          }
        });
        
        let chosen = hexers[Math.floor(hexers.length*Math.random())];
        
        chosen = witch.dimension.getPlayers().filter((player) => {
          if (player.id == chosen) {
            return player;
          }
        })[0];
        
        if (chosen != undefined) {
          chosen.sendMessage(`${faeBeing.theme}${faeBeing.name}§r seeks vengeance against you in the name of ${faeBeing.theme}${witch.name}§r.`);
          let obj = {
            timer: 3600,
            endMsg: `§a[!]§r ${faeBeing.theme}${faeBeing.name}§r opens her arms to you once more.`,
            vanishOnDeath: false
          }
          chosen.setDynamicProperty("bwDuration:titania_hexed", JSON.stringify(obj));
        }
      },
      "minecraft:resin_clump": (witch, faeBeing, item) => {
        witch.sendMessage(`${faeBeing.theme}${faeBeing.name}§r grants you her blessing.`)
        let obj = {
          timer: 3600,
          endMsg: `§a[!]§r You feel the blessing of ${faeBeing.theme}${faeBeing.name}§r fade into somewhere unseen.`,
          vanishOnDeath: false
        }
        witch.setDynamicProperty("bwDuration:titania_blessed", JSON.stringify(obj));
      },
      "minecraft:bone": (witch, faeBeing, item) => {
        witch.sendMessage(`${faeBeing.theme}${faeBeing.name}§r grants you her protection.`)
        let obj = {
          timer: 3600,
          endMsg: `§a[!]§r You feel the protection of ${faeBeing.theme}${faeBeing.name}§r fade into somewhere unseen.`,
          vanishOnDeath: false
        }
        witch.setDynamicProperty("bwDuration:titania_protected", JSON.stringify(obj));
      },
      "bw:blood_vial": (witch, faeBeing, item) => {
        let blood = item.getDynamicProperty("bw:blood");
        if (blood != undefined) {
          blood = JSON.parse(blood);
        } else {
          witch.sendMessage(`§c[!]§r No creature can be gleaned from this unknown blood.`)
          return;
        }
        
        let foundEntity = getEntityFromBlood(["overworld"], blood.id)[0];
        
        if (foundEntity != undefined) {
          let block = foundEntity.dimension.getBlock(foundEntity.location);
          let blockBelow = block.below();
    
          if (titaniaPlants.includes(blockBelow.typeId) || titaniaPlants.includes(block.typeId)) {
            let info = `The one you seek `;
            if (foundEntity.nameTag == "" || foundEntity.nameTag == undefined) {
              info = info + `(§2${foundEntity.typeId}§r)`
            } else {
              info = info + `(§2${foundEntity.nameTag}§r)`
            }
            info = info + ` seems to be in the general vicinity of ${Math.ceil(foundEntity.location.x)}, y(?), ${Math.ceil(foundEntity.location.z)}.`;
            witch.sendMessage(`${faeBeing.theme}${faeBeing.name}§r listens casually to her garden. This is what she has discovered:\n\n${info}`);
          } else {
            witch.sendMessage(`This entity is not within ${faeBeing.theme}${faeBeing.name}'s§r domain to find.`);
          }
        }
      }
    }
  },
  /*
  "hebaya": {
    "id": "hebaya",
    "theme": "§u",
    "name": "Hebaya",
    "titles": ["Alchemist Adept", "Lady of Wax", "Mistress of Maladies"],
    "court": "Twilight",
    "medians": ["brownie"],
    "offerings": {
      "likedTastes": [
        "minecraft:wither",
        "minecraft:instant_damage",
        "minecraft:fatal_poison"
      ],
      "dislikedTastes": []
    },
    "baseInterest": 8,
    "baseTrustIncrease": 0.19,
    "sacredColor": [
      "obsidian",
      "purple",
      "black",
      "candle"
    ],
    "sacredColorInfo": "Purple & Black",
    "sacredMob": [
      "minecraft:cat",
      "minecraft:ocelot"
    ],
    "altarBlocks": [
      "minecraft:obsidian",
      "minecraft:crying_obsidian"
    ],
    "altarBlockInfo": "Obsidian, even its Crying variant. In fact, most things obsidian satisfy me. Its magical properties are simply wonderful. Candles as well; I §oadore§r candles.",
    "sphereOfInfluence": "Alchemy, Witchcraft, Wax",
    "relations": [],
    "punishments": [],
    "requests": {
      "minecraft:fermented_spider_eye": (witch, faeBeing) => {
        witch.sendMessage(`An absolute and oppressive force settles over you. ${faeBeing.theme}${faeBeing.name}§r has granted you her protection.`)
        let obj = {
          timer: 3600,
          endMsg: `§a[!]§r You feel  ${faeBeing.theme}${faeBeing.name}'s§r gaze vanish. You are somewhat vulnerable once more.`,
          vanishOnDeath: false
        }
        witch.setDynamicProperty("bwDuration:negativeImmunity", JSON.stringify(obj));
      },
      "minecraft:gold_sword": (witch, faeBeing) => {
        let hexes = witch.getDynamicProperty("bw:cursePool");
        if (hexes == undefined || hexes == "{}") {
          witch.sendMessage(`§c[!]§r There is no hex that plagues you.`)
          return;
        } else {
          hexes = JSON.parse(hexes);
        }
        
        let hexers = [];
        Object.entries(hexes).forEach((k, v) => {
          if (v.sender != witch.id) {
            hexers.push(v.sender);
          }
        });
        
        let chosen = hexers[Math.floor(hexers.length*Math.random())];
        
        chosen = witch.dimension.getPlayers().filter((player) => {
          if (player.id == chosen) {
            return player;
          }
        })[0];
        
        if (chosen != undefined) {
          chosen.setDynamicProperty("bw:cursePool", JSON.stringify(hexes));
          chosen.sendMessage(`${faeBeing.theme}${faeBeing.name}§r seeks vengeance against you in the name of ${faeBeing.theme}${witch.name}§r.`);
        }
      },
      "bw:strange_potion": (witch, faeBeing) => {
        witch.sendMessage(`Your hits are now reinforced with your negativity.`)
        let obj = {
          timer: 3600,
          endMsg: `§a[!]§r Your hits return to normal, if that was what they were before.  ${faeBeing.theme}${faeBeing.name}'s§r blessing has faded.`,
          vanishOnDeath: false
        }
        witch.setDynamicProperty("bwDuration:hebayanCombat", JSON.stringify(obj));
      },
      "bw:natural_ash": (witch, faeBeing) => {
        let heldItem = witch.getComponent("inventory").container.getItem(witch.selectedSlotIndex);
        let reagent = herbDistil(heldItem.typeId);
        if (reagent == null) {
          witch.sendMessage(`${faeBeing.theme}There is no alchemical property within this item that aligns with my system of witchcraft.§r`);
        } else {
          if (reagent.modify != undefined) {
            witch.sendMessage(`${faeBeing.theme}This item is an alchemical modifier. It cannot have a primary effect.§r`);
            return;
          }
          let primaryEffects = reagent.primaryEffects;
          let item = new ItemStack("minecraft:paper", 1);
          let strArr = [];
          for (let [k, v] of Object.entries(primaryEffects)) {
            strArr.push(`§r${faeBeing.theme}- ${v.name} (${Math.floor((Number(k)/150)*100)}\%)`);
          }
          item.setLore(strArr);
          witch.dimension.spawnItem(item, witch.location);
          witch.sendMessage({rawtext: [{text: "§uYou dream about "}, {translate: heldItem.localizationKey}, {text: " and what its primary effects are...§r"}]});
        }
      },
      "bw:blood_vial": (witch, faeBeing, item) => {
        let blood = item.getDynamicProperty("bw:blood");
        if (blood != undefined) {
          blood = JSON.parse(blood);
        } else {
          witch.sendMessage(`§c[!]§r No creature can be gleaned from this unknown blood.`)
          return;
        }
        
        let foundEntity = getEntityFromBlood(["overworld", "nether", "the_end"], blood.id)[0];
        
        if (foundEntity != undefined) {
          let block = foundEntity.dimension.getBlock(foundEntity.location);
          let blockBelow = block.below();
          let hexes = witch.getDynamicProperty("bw:cursePool");
          
          if (foundEntity.getEffects().length > 0 || (hexes != undefined && hexes != "{}")) {
            let info = `The one you seek `;
            if (foundEntity.nameTag == "" || foundEntity.nameTag == undefined) {
              info = info + `(§d${foundEntity.typeId}§r)`
            } else {
              info = info + `(§d${foundEntity.nameTag}§r)`
            }
            info = info + ` seems to be in the general vicinity of ${Math.ceil(foundEntity.location.x)}, y(?), ${Math.ceil(foundEntity.location.z)} `;
            if (foundEntity.dimension.id == witch.dimension.id) {
              info = info + "in the same dimension as you."
            } else {
              info = info + "in another dimension."
            }
            witch.sendMessage(`${faeBeing.theme}${faeBeing.name}§r spreads her influence across the dimensions and relays to you her findings:\n\n${info}`);
          } else {
            witch.sendMessage(`This entity is not within ${faeBeing.theme}${faeBeing.name}'s§r domain to find.`);
          }
        }
      }
    }
  },
  */
  "oberon": {
    "id": "oberon",
    "theme": "§6",
    "name": "Oberon",
    "standing": "greater",
    "titles": ["Lord Summer", "Lord of Summer Wine", "Father of Moods"],
    "court": "Solar",
    "medians": ["dwarvone"],
    "offerings": {
      "likedTastes": [
        "minecraft:nausea",
        "minecraft:strength",
        "minecraft:speed",
        "minecraft:poison",
        "minecraft:levitation",
        "minecraft:slow_falling"
      ],
      "dislikedTastes": [
        "minecraft:slowness",
        "minecraft:wither",
        "minecraft:fatal_poison",
        "minecraft:weakness"
      ]
    },
    "baseInterest": 1,
    "baseTrustIncrease": 0.15,
    "sacredColor": [
      "orange",
      "lime",
      "yellow"
    ],
    "sacredColorInfo": "Orange, Yellow & Lime",
    "sacredMob": [
      "minecraft:frog",
      "minecraft:ocelot"
    ],
    "altarBlocks": [
      "minecraft:sunflower",
      "minecraft:brewing_stand"
    ],
    "altarBlockInfo": "Sunflowers and brewing stands",
    "sphereOfInfluence": "Summer, Weather, Fermentation",
    "relations": [
      {
        "faeryId": "mab",
        "relation": "tolerant"
      },
      {
        "faeryId": "ailill",
        "relation": "despised"
      }
    ],
    "punishments": []
  }
}

export const solarFaeArray = [
  [20, "undefined"],
  [80, "chlorophae"],
  [70, "dryas"],
  [80, "vitalia"],
  [60, "aerial"],
  [40, "avistrum"],
  [60, "wildfyre"]
]
export const lunarFaeArray = [
  [20, "undefined"],
  [50, "iceling"]
]
export const twilightFaeArray = [
  [20, "undefined"],
  [60, "quillwyn"],
  [60, "alkares"]
]