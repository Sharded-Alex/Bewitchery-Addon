import {world, MoonPhase, BlockPermutation, EntityHealthComponent, MolangVariableMap, EffectTypes, system, ItemStack, ItemLockMode, DimensionTypes} from "@minecraft/server";
import {wands, useItem} from "./blockComp.js";
import {getDistance} from "./leynexii.js";
import {checkPhaseAlignment, getTimeAlignment} from "./castRitual.js";
import {getFace} from "./wardArrays.js";
import {getEntityFromBlood} from "./getTaglock.js";
import {diceRoll, inRange} from "./occultMagick.js";
import {generateUniqueId} from "./curses.js";
import {Vector3, Random} from "./VectorMath/index.js";
import {applySpellDamage} from "./spellDamage.js";
import {addHunger} from "./spellEffects.js";

export const poisons = [
  "minecraft:poison",
  "minecraft:fatal_poison"
]
const flowers = [
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
  "minecraft:closed_eyeblossom",
  "minecraft:open_eyeblossom"
]
const negativeEffects = [
  "minecraft:slowness",
  "minecraft:weakness",
  "minecraft:blindness",
  "minecraft:nausea",
  "minecraft:oozing",
  "minecraft:weaving"
]

// A list of ALL Familiar abilities
export const abilityList = {
  "Spiritual Awareness": {
    "description": "§d[+]§r §g(Summoned)§r This familiar will hiss and meow when their witch is the target of malicious rituals. Occasionally, they will attack the malicious energy sent by the ritual and drive it away."
  },
  "Potence": {
    "description": "§d[+]§r §g(Summoned/Trinketed)§r When their witch bottles a Strange Potion, this familiar occasionally increases the power of one of its effects."
  },
  "Poison Resistance": {
    "description": "§d[+]§r §g(Summoned/Trinketed)§r This familiar protects both themself and their witch from poisons."
  },
  "Rejuvenation": {
    "description": "§d[+]§r §g(Summoned)§r This familiar provides their witch with a rejuvenating and healing effect when they are closeby."
  },
  "Gills": {
    "description": "§d[+]§r §g(Summoned/Trinketed)§r This familiar grants their witch the ability to breathe underwater."
  },
  "Swim": {
    "description": "§d[+]§r §g(Summoned/Trinketed)§r This familiar grants their witch movement underwater akin to Depth Strider III. Naturally, the witch must be submerged."
  },
  "Shock": {
    "description": "§d[+]§r §g(Summoned/Trinketed)§r This familiar shocks whatever dares to harm their witch. Usually, for 1 Shock Damage."
  },
  "Echolocation": {
    "description": "§d[+]§r §g(Summoned/Trinketed)§r This familiar allows their Witch to pick up the vibrations of grounded and moving or swimming creatures."
  },
  "Ink": {
    "description": "§d[+]§r §g(Summoned/Trinketed)§r When their witch is attacked, this familiar conjures a mystical ink cloud that slows down surrounding mobs. Strangely, the witch themself cannot see this ink cloud."
  },
  "Shell": {
    "description": "§d[+]§r §g(Summoned/Trinketed)§r This familiar grants their witch the blessing of minor Resistance."
  },
  "Flower Eater": {
    "description": "§d[+]§r §g(Summoned/Trinketed)§r This familiar allows their witch to \"consume\" flowers when they are broken. This replenishes hunger, but only works when the witch is hungry."
  },
  "Sting": {
    "description": "§d[+]§r §g(Summoned/Trinketed)§r This familiar allows their witch to occasionally sting and poison the entities they hit."
  },
  "Drift": {
    "description": "§d[+]§r §g(Summoned/Trinketed)§r This familiar allows the brooms of their witch to fly just a bit faster."
  },
  "Wake Swimming": {
    "description": "§d[+]§r §g(Summoned/Trinketed)§r This familiar assists their witch in increasing their swimming speed when swimming in shallow waters."
  },
  "Glide": {
    "description": "§d[+]§r §g(Summoned/Trinketed)§r This familiar allows their witch to subtly resist gravity, slowing their fall."
  },
  "Dark Vision": {
    "description": "§d[+]§r §g(Summoned/Trinketed)§r This familiar teaches their witch how to adjust their eyes to the dark. This technique gives them Night Vision when in sufficiently dark places."
  },
  "Steal": {
    "description": "§d[+]§r §g(Summoned/Trinketed)§r This familiar teaches their witch how to swipe items from an attacked creature's inventory. Of course, this only works occasionally."
  },
  "Mimic": {
    "description": "§d[+]§r §g(Summoned)§r This familiar may cast a spell it has been taught. [W.I.P]"
  },
  "Pack": {
    "description": "§d[+]§r §g(Summoned)§r This familiar shares any potion effect it picks up with its witch, like a true pack does. If the witch drinks Milk, the cleansing effect extends to the familiar as well."
  },
  "Tracking": {
    "description": "§d[+]§r §g(Trinketed)§r This familiar allows their witch to drink blood and pick up a temporary scent, leading them in the direction of the blood's owner (if they still exist/are loaded)"
  },
  "Camouflage": {
    "description": "§d[+]§r §g(Summoned/Trinketed)§r This familiar allows their witch to fade into obscurity if they are moving §overy§r slowly, moving none at all or sneaking."
  },
  "Shed": {
    "description": "§d[+]§r §g(Trinketed)§r This familiar allows their witch to shed the effects of vanilla debuffs every so often and the same goes for the physical familiar. Rarely, a hex might be shed as well."
  }
}

// Trait List
// {
//    Heliophile
//    Heliophobe
//    Selenophile
//    Selenophobe
//    Nyctophile
//    Nyctophobe
//    Dendrophile
//    Dendrophobe
//    Anthophile
//    Anthophobe
//    Acrophile
//    Acrophobe
// }
const traitList = {
  // Celestial Likings & Dislikes
  "Heliophile": {
    "description": "This familiar spirit loves being in sunlight. They appreciate sunset and sunrise equally.",
    "opposite": "Heliophobe"
  },
  "Heliophobe": {
    "description": "This familiar spirit hates sunlight. They appreciate sunset and sunrise equally.",
    "opposite": "Heliophile"
  },
  "Selenophile": {
    "description": "This familiar spirit loves being in moonlight.",
    "opposite": "Selenophobe"
  },
  "Selenophobe": {
    "description": "This familiar spirit hates being in moonlight.",
    "opposite": "Selenophile"
  },
  
  "": {
    "description": "",
    "opposite": ""
  },
}

// Trait Min & Times
const traitTimes = {
  "Heliophile": +15,
  "Heliophobe": -10,
  "Selenophile": +30,
  "Selenophobe": -10,
  "Nyctophile": +20,
  "Nyctophobe": -25,
  "Dendrophile": +15,
  "Dendrophobe": -5,
  "Anthophile": +35,
  "Anthophobe": -10,
  "Acrophile": +30,
  "Acrophobe": -25,
}

// Universal Trait List
const universalTraitPools = new Map([
  [
    "Heliophile", ["Heliophobe"]
  ],
  [
    "Heliophobe", ["Heliophile"]
  ],
  [
    "Selenophile", ["Selenophobe"]
  ],
  [
    "Selenophobe", ["Selenophile"]
  ],
  [
    "Nyctophile", ["Nyctophobe"]
  ],
  [
    "Nyctophobe", ["Nyctophile"]
  ],
  [
    "Dendrophile", ["Dendrophobe"]
  ],
  [
    "Dendrophobe", ["Dendrophile"]
  ],
  [
    "Acrophile", ["Acrophobe"]
  ],
  [
    "Acrophobe", ["Acrophile"]
  ],
  [
    "Anthophile", ["Anthophobe"]
  ],
  [
    "Anthophobe", ["Anthophile"]
  ]
]);
const celestialTraits = [
  "Heliophile",
  "Heliophobe",
  "Selenophile",
  "Selenophobe",
  "Nyctophile",
  "Nyctophobe"
];
const biomeTraits = [
  "Dendrophobe",
  "Dendrophile",
  "Anthophobe",
  "Anthophile"
]
const heightTraits = [
  "Acrophobe",
  "Acrophile"
]
const validForestBiomes = [
  "minecraft:forest",
  "minecraft:forest_hills",
  "minecraft:flower_forest",
  "minecraft:birch_forest",
  "minecraft:birch_forest_hills",
  "minecraft:birch_forest_mutated",
  "minecraft:birch_forest_hills_mutated",
  "minecraft:grove",
  "minecraft:cherry_grove",
  
  "minecraft:roofed_forest",
  "minecraft:roofed_forest_mutated"
]
const validMeadowBiomes = [
  "minecraft:meadow",
  "minecraft:flower_forest",
  "minecraft:grove",
  "minecraft:cherry_grove"
]

// Applies traits to the familiar based on sub families and randomly
export function applyTraits() {
  let allTraits = new Map(universalTraitPools.entries());
  let traitsChosen = {};
  
  for (let c = 0; Object.keys(traitsChosen).length < 3; c++) {
    // iterator
    let i = Math.floor(allTraits.size * Math.random());
    let traits = [];
    allTraits.forEach((v, k) => {
      traits.push(k);
    });
    
    // selected index
    let selected = traits[i];
    
    let opposites = allTraits.get(selected);
    console.warn(JSON.stringify([selected, opposites]))
    for (let o of opposites) {
      allTraits.delete(o);
    }
    
    traitsChosen[selected] = traitTimes[selected];
    allTraits.delete(selected);
  }
  
  console.warn(Object.keys(traitsChosen));
  return traitsChosen;
}


// An object array of mob families;
const familiarFamilies = [
  // Amphibian
  {
    "familyGroup": [
      "frog",
      "tadpole",
      "axolotl"
    ],
    "genus": "Amphibian"
  },
  // Aquatic
  {
    "familyGroup": [
      "fish",
      "otter",
      "eel",
      "dolphin",
      "squid",
      "octopus",
      "cephalod",
      "crustacean",
      "crab",
      "shrimp"
    ],
    "genus": "Aquatic"
  },
  // Arthropod
  {
    "familyGroup": [
      "arthropod",
      "spider",
      "cavespider",
      "bee",
      "scorpion"
    ],
    "genus": "Arthropod"
  },
  // Avian
  {
    "familyGroup": [
      "waterfowl",
      
      "bird",
      "poultry",
      "chicken",
      
      "owl",
      
      "crow",
      "raven",
      
      "parrot"
    ],
    "genus": "Avian"
  },
  // Canine
  {
    "familyGroup": [
      "wolf",
      "dog",
      "fox"
    ],
    "genus": "Canine"
  },
  // Feline
  {
    "familyGroup": [
      "cat",
      "small_cat",
      "big_cat",
      "ocelot"
    ],
    "genus": "Feline"
  },
  // Lepus
  {
    "familyGroup": [
      "rabbit",
      "hare"
    ],
    "genus": "Lepus"
  },
  // Reptile
  {
    "familyGroup": [
      "snake",
      "lizard",
      "reptile",
      "chameleon",
      "turtle",
      "tortoise"
    ],
    "genus": "Reptile"
  },
]

// An object containing all supported Subfamilies of that Family set
// DISCLAIMER:  I know these are the wrong terms. I'm a programmer, not a ZOOLOGIST!! And Minecraft doesn't have most of these stuff built in anyway.
const genusAbilities = {
  "Amphibian": {
    "familyAbility": "Potence",
    "additionalAbilities": [
      {
        "subFamilies": [
          "frog",
          "tadpole"
        ],
        "ability": "Poison Resistance"
      },
      {
        "subFamilies": [
          "axolotl"
        ],
        "ability": "Rejuvenation"
      }
    ]
  },
  "Aquatic": {
    "familyAbility": "Gills",
    "additionalAbilities": [
      {
        "subFamilies": [
          "fish",
          "otter"
        ],
        "ability": "Swim"
      },
      {
        "subFamilies": [
          "eel"
        ],
        "ability": "Shock"
      },
      {
        "subFamilies": [
          "dolphin"
        ],
        "ability": "Echolocation"
      },
      {
        "subFamilies": [
          "squid",
          "octopus",
          "cephalod"
        ],
        "ability": "Ink"
      },
      {
        "subFamilies": [
          "crustacean",
          "crab",
          "shrimp"
        ],
        "ability": "Shell"
      }
    ]
  },
  "Arthropod": {
    "familyAbility": "Wall Crawler",
    "additionalAbilities": [
      {
        "subFamilies": [
          "bee"
        ],
        "ability": "Flower Eater"
      },
      {
        "subFamilies": [
          "cavespider",
          "scorpion"
        ],
        "ability": "Sting"
      },
      {
        "subFamilies": [
          "spider"
        ],
        "ability": "Webber"
      }
    ]
  },
  "Avian": {
    "familyAbility": "Drift",
    "additionalAbilities": [
      {
        "subFamilies": [
          "waterfowl"
        ],
        "ability": "Wake Swimming"
      },
      {
        "subFamilies": [
          "bird",
          "chicken",
          "poultry"
        ],
        "ability": "Glide"
      },
      {
        "subFamilies": [
          "crow",
          "raven"
        ],
        "ability": "Steal"
      },
      {
        "subFamilies": [
          "owl"
        ],
        "ability": "Dark Vision"
      },
      {
        "subFamilies": [
          "parrot"
        ],
        "ability": "Mimic"
      }
    ]
  },
  "Canine": {
    "familyAbility": "Pack",
    "additionalAbilities": [
      {
        "subFamilies": [
          "wolf",
          "dog"
        ],
        "ability": "Tracking"
      },
      {
        "subFamilies": [
          "fox"
        ],
        "ability": "Steal"
      },
      {
        "subFamilies": [
          "tanaki"
        ],
        "ability": "Trickster's Mend"
      }
    ]
  },
  "Feline": {
    "familyAbility": "Spiritual Awareness",
    "additionalAbilities": [
      {
        "subFamilies": [
          "cat",
          "small_cat",
          "large_cat",
          "ocelot"
        ],
        "ability": "Dark Vision"
      }
    ]
  },
  "Lepus": {
    "familyAbility": "Carrot Sprint",
    "additionalAbilities": []
  },
  "Reptile": {
    "familyAbility": "Shed",
    "additionalAbilities": [
      {
        "subFamilies": [
          "snake"
        ],
        "ability": "Lunge"
      },
      {
        "subFamilies": [
          "lizard",
          "chameleon"
        ],
        "ability": "Camouflage"
      },
      {
        "subFamilies": [
          "turtle",
          "tortoise"
        ],
        "ability": "Shell"
      }
    ]
  },
}

// Familiar Abilities
// This function puts familiar abilities into a neat object to be attached to the familiar's property.
export function createFamiliarAbilities(entity) {
  let abilityObj = {
    "genusAbility": "None",
    "subfamilyAbilities": []
  }
  let family = entity.getComponent("minecraft:type_family");
  if (family) {
    let allFams = family.getTypeFamilies();
    
    let mostCompatible;
    let lastMatch = 0;
    for (let gen of familiarFamilies) {
      let match = 0;
      for (let i of gen.familyGroup) {
        if (allFams.includes(i)) {
          match++;
        }
      }
      
      if (match > lastMatch) {
        mostCompatible = gen.genus;
        lastMatch = match;
      }
    }
    
    if (mostCompatible != undefined) {
      // Set Genus Family Ability
      let familiarStats = genusAbilities[mostCompatible];
      // Set genusAbility to the Family Ability
      abilityObj.genusAbility = familiarStats.familyAbility;
      
      // For additionalAbilities, loop through them and then based on the families shared, push the ability into the Familiar's ability pool.
      abilityLoop: for (let addition of familiarStats.additionalAbilities) {
        // Check if this creature belongs to a specific subfamily of this genus
        for (let i of addition.subFamilies) {
          if (allFams.includes(i)) {
            if (!abilityObj.subfamilyAbilities.includes(addition.ability)) {
              abilityObj.subfamilyAbilities.push(addition.ability);
            }
            continue abilityLoop;
          }
        }
      }
      
    }
  }
  
  return abilityObj;
}

// Familiar Functions
export function hasFamiliar(player) {
  if (familiarRegistry.has(player?.id)) {
    let familiars = familiarRegistry.get(player.id).size;
    if (familiars > 0) {
      return true;
    }
  }
  let props = world.getDynamicPropertyIds().filter(f => f.startsWith("bw:isFamiliar_") && f.endsWith(`_${player.id}`));
  
  if (props.length > 0) {
    return true;
  }
  return false;
}
export function isPlayerFamiliar(player, entity) {
  let trueSoul = entity.getDynamicProperty("bw:originalSoul");
  if (trueSoul) {
    let property = `bw:isFamiliar_${trueSoul}_${player.id}`;
    if (world.getDynamicProperty(property)) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
export function isFamiliar(entity) {
  let trueSoul = entity.getDynamicProperty("bw:originalSoul");
  if (trueSoul) {
    let ids = world.getDynamicPropertyIds().filter(x => x.startsWith(`bw:isFamiliar_${trueSoul}_`))[0];
    
    if (ids != undefined) {
      let arr = ids.split("_");
      arr = arr.slice(1);
      // [trueSoul, playerId]
      return arr;
    }
  }
  return false;
}
export function dismissFamiliar(player, entity) {
  let trueSoul = entity.getDynamicProperty("bw:originalSoul");
  
  let id = player?.id;
  if (id == undefined) {
    id = player;
  }
  // True Soul detection
  if (trueSoul) {
    let property = `bw:isFamiliar_${trueSoul}_${id}`;
    // Checks if the property exists before anything else
    if (world.getDynamicProperty(property)) {
      // Parse dynamic property
      let familiar = JSON.parse(world.getDynamicProperty(property));
      // Reset all Traits
      for (let t of Object.keys(familiar.moodTraits)) {
        familiar.moodTraits[t] = traitTimes[t];
      }
      // Set the familiar as dismissed
      familiar.dismissed = true;
      // Reset dynamic property;
      world.setDynamicProperty(property, JSON.stringify(familiar));
      
      // Remove this familiar from the registry, its tidier to do that;
      let ownerMap = familiarRegistry.get(familiar.owner);
      ownerMap.delete(trueSoul);
      familiarRegistry.set(familiar.owner, ownerMap);
      // Remove Entity
      entity.remove();
    }
  }
}
export async function returnFamiliar(propName) {
  // Checks if the property exists before anything else
  if (world.getDynamicProperty(propName)) {
    // Parse dynamic property
    let familiar = JSON.parse(world.getDynamicProperty(propName));
    // Set the familiar as dismissed
    familiar.dismissed = false;
    // Delete dismiss code
    if (familiar.dismissCode) {
      delete familiar.dismissCode;
    }
    // Reset dynamic property;
    world.setDynamicProperty(propName, JSON.stringify(familiar));
    
    // Attempt to re-add the familiar to the familiar registry;
    let entitySoul = propName.split("_")[1];
    let entity;
    for (let d of DimensionTypes.getAll()) {
      let e = world.getDimension(d.typeId).getEntities().filter(ent => ent.getDynamicProperty("bw:originalSoul") == entitySoul)[0];
      if (e != undefined) {
        entity = e;
        break;
      }
    }
    // await system.waitTicks(20);
    if (entity != undefined) {
      addFamiliarToRegistry(entity, propName);
    } else {
      console.warn("Familiar could not be readded to the registry. It isn't loaded, therefore it might not even be in the Familiar Realms.")
    }
  }
}

export function getTrueFamiliars(player) {
  let properties = world.getDynamicPropertyIds().filter(f => f.startsWith("bw:isFamiliar_") && f.endsWith(`_${player.id}`));
  let arr = [];
  for (let p of properties) {
    if (world.getDynamicProperty(p)) {
      arr.push(JSON.parse(world.getDynamicProperty(p)))
    }
  }
  return arr;
}
export function getPresentFamiliarPowers(player, trinketsValid = false) {
  if (!familiarRegistry.has(player.id)) {
    return [];
  }
  
  let ownerMap = familiarRegistry.get(player.id);
  
  let powerArr = [];
  for (let [key, values] of ownerMap) {
    let familiar = JSON.parse(world.getDynamicProperty(values.familiarId));
    if (values.entity == undefined || !values.entity.isValid) {
      continue;
    }
    if (familiar.mood < 3) {
      continue;
    }
    if (inRange(values.entity.location, player.location, 16)) {
      if (!powerArr.includes(familiar.traits.genusAbility)) {
        powerArr.push(familiar.traits.genusAbility)
      }
      for (let pwr of familiar.traits.subfamilyAbilities) {
        if (!powerArr.includes(pwr)) {
          powerArr.push(pwr);
        }
      }
    }
  }
  if (trinketsValid) {
    let trinketIds = getTalismanSpirits(player.getComponent("minecraft:inventory")?.container);
    for (let id of trinketIds) {
      let spiritProp = `bw:isFamiliar_${id}_${player.id}`;
      let familiar = JSON.parse(world.getDynamicProperty(spiritProp));
      
      if (familiar.mood < 3) {
        continue;
      }
      
      if (!powerArr.includes(familiar.traits.genusAbility)) {
        powerArr.push(familiar.traits.genusAbility)
      }
      for (let pwr of familiar.traits.subfamilyAbilities) {
        if (!powerArr.includes(pwr)) {
          powerArr.push(pwr);
        }
      }
    }
  }
  
  return powerArr;
}
export function getFamiliarPowers(entity, player) {
  let powerArr = [];
  let trueSoul = entity.getDynamicProperty("bw:originalSoul");
  if (trueSoul) {
    let property = `bw:isFamiliar_${trueSoul}_${player.id}`;
    if (world.getDynamicProperty(property)) {
      let familiar = JSON.parse(world.getDynamicProperty(property));
      
      if (!powerArr.includes(familiar.traits.genusAbility)) {
        powerArr.push(familiar.traits.genusAbility)
      }
      for (let pwr of familiar.traits.subfamilyAbilities) {
        if (!powerArr.includes(pwr)) {
          powerArr.push(pwr);
        }
      }
    }
  }
  return powerArr;
}

function greaterHasEffect(entity, effect, amplifier, duration) {
  if (!entity?.isValid) {
    return false;
  }
  let gottenEffect = entity.getEffect(effect);
  if (gottenEffect != undefined) {
    if (gottenEffect.amplifier == undefined || gottenEffect.amplifier <= amplifier) {
      if (gottenEffect.duration <= duration) {
        return true;
      }
    }
    return false;
  }
  return true;
}

function getTalismanSpirits(inv) {
  let arr = [];
  if (inv == undefined) {
    return arr;
  }
  for (let i = 0; i < inv.size; i++) {
    let item = inv.getItem(i);
    if (item == undefined) {
      continue;
    }
    if (item.hasComponent("bw:familiar_container")) {
      let spiritTrueSoul = item.getDynamicProperty("bw:savedFamiliar");
      if (spiritTrueSoul != undefined) {
        arr.push(spiritTrueSoul);
      }
    }
  }
  return arr;
}

/** FAMILIAR SYSTEM
 * Bewitchery's familiar system does not create new entities. Instead, it buffs the player and the creature most times in mystical ways.
 * This system also allows players to find different ways of taking care of their Familiars, allowing them to keep their Trust in their Witch.
 * If a variety actions are constantly done by a Familiar's Witch, this can breed into behavioral traits that will present itself when dealing with magical issues or when performing usually normal activities.
 * 
 * This system works based on reading a variety of vanilla traits present within a creature and assigning abilities and potential behavorial effects based on that.
 * This is to make sure most mobs creatures can be transformed into Familiars with an array of abilities.
 * 
 * Tameable creatures are best, but a fairly passive or nuetral creature may also work as a Familiar because of this. Hostile Familiars are frowned upon, and Player Familiars come from an agreement between two parties.
 * 
 * Some Familiars are able to visit the Wylde, travel and carry back fairly mundane discoveries. This tends to be done when they are called into their Trinkets. Certain abilities stem from being placed and recalled from the Trinkets as a result.
 * 
 * (Later)
 * Additionally, Tamed Familiars can communicate with the Tamed Familiar of another Witch through sent Books and Lecterns, provided the Familiar is valid. All Familiars tend to know each other, even if Player Familiars would swear up and down that they don't.
 * 
 */
 
// Familiars are saved to the World
// However, this keeps track of familiar positions.

export const familiarRegistry = new Map();
// Familiars work externally to their Witch.
// On loading the familiar, they should be tracked in the familiar registry.
// Constantly save their last location as a dynamic property when loaded.
export function addFamiliarToRegistry(entity, property) {
  let familiar = JSON.parse(world.getDynamicProperty(property));
  let trueSoul = entity.getDynamicProperty("bw:originalSoul");
  
  let familiarObj = {
    id: trueSoul,
    entity: entity,
    familiarId: property
  }
  let familiarMap = new Map();
  if (!familiarRegistry.has(familiar.owner)) {
    familiarMap.set(trueSoul, familiarObj);
    familiarRegistry.set(familiar.owner, familiarMap);
  } else {
    let currentMap = familiarRegistry.get(familiar.owner);
    if (!currentMap.has(trueSoul)) {
      currentMap.set(trueSoul, familiarObj);
      familiarRegistry.set(familiar.owner, currentMap);
    }
  }
}

world.afterEvents.entityLoad.subscribe( ({ entity }) => {
  // Is this a familiar?
  let trueSoul = entity.getDynamicProperty("bw:originalSoul");
  
  let property = world.getDynamicPropertyIds().filter(d => d.startsWith(`bw:isFamiliar_${trueSoul}_`))[0];
  if (property != undefined) {
    // If it is, register the familiar with its owner's id.
    addFamiliarToRegistry(entity, property);
    return;
  } else {
    entity.setDynamicProperty("bw:originalSoul", undefined)
  }
});

world.afterEvents.entityHitEntity.subscribe(e => {
  let victim = e.hitEntity;
  let entity = e.damagingEntity;
  
  if (entity?.isValid && hasFamiliar(entity)) {
    let powers = getPresentFamiliarPowers(entity, true);
    if (powers.includes("Steal")) {
      let stealChance = diceRoll(1, 20, true);
      if (victim.isValid) {
        if (victim.hasComponent("minecraft:inventory")) {
          let inv = victim.getComponent("minecraft:inventory"). container;
          let chosenSlot = Math.floor(inv.size * Math.random());
          
          let item = inv.getItem(chosenSlot);
          if (item != undefined) {
            if (stealChance >= 12) {
              inv.setItem(chosenSlot, undefined);
              entity.dimension.spawnItem(item, entity.location)
            }
          }
        }
      }
    }
    
    if (powers.includes("Sting")) {
      if (entity.hasComponent("minecraft:inventory")) {
        let inv = entity.getComponent("minecraft:inventory"). container;
        let item = inv.getItem(entity.selectedSlotIndex);
        if (item == undefined) {
          if (diceRoll(1, 4, true) == 3) {
            victim.addEffect("minecraft:poison", 300);
          }
        }
      }
    }
  }
  
  if (victim?.isValid && hasFamiliar(victim)) {
    let powers = getPresentFamiliarPowers(victim, true);
    
    if (powers.includes("Shock")) {
      applySpellDamage(entity, 1, "shock", 0, victim);
    }
    if (powers.includes("Ink")) {
      let surEntities = victim.dimension.getEntities({location: victim.getAABB().center, maxDistance: 3});
      let mol = new MolangVariableMap();
      mol.setFloat("variable.particlecount", 21);
      mol.setFloat("variable.size_x", 3);
      mol.setFloat("variable.size_y", 3);
      mol.setFloat("variable.size_z", 3);
      mol.setFloat("variable.particlesize", 1.4);
      mol.setFloat("variable.is_outside_water", 0.1);
      mol.setColorRGB("variable.color", {
        "red": 0,
        "green": 0,
        "blue": 0
      })
      
      // Player specific ink
      world.getPlayers().forEach(p => {
        if (p.dimension.id == victim.dimension.id) {
          if (victim.id != p.id) {
            p.spawnParticle("bw:familiar_ink", p.location, mol);
          }
        }
      });
      // Slow surrounding creatures
      for (let s of surEntities) {
        if (s.id == victim.id) {
          continue;
        }
        s.addEffect("minecraft:slowness", 300, {amplifier: 1});
      }
    }
  }
});

world.beforeEvents.playerBreakBlock.subscribe(e => {
  let player = e.player;
  let block = e.block;
  
  if (player?.isValid && hasFamiliar(player)) {
    let powers = getPresentFamiliarPowers(player, true);
    
    if (powers.includes("Flower Eater")) {
      let mainHand = player.getComponent("minecraft:equippable")?.getEquipment("Mainhand");
      
      if (flowers.includes(block.typeId) && mainHand == undefined) {
        let isFed = false;
        system.run(() => {
          isFed = addHunger(player, 1);
          if (isFed) {
            block.setType("minecraft:air");
          }
        });
        if (isFed) {
          e.cancel = true;
        }
      }
    }
  }
});

// Seal Familiar Inside Familiar Trinket;
world.afterEvents.itemUse.subscribe(cast => {
  let player = cast.source;
  let item = cast.itemStack;
  let inv = player.getComponent("inventory").container;
  let slot = player.selectedSlotIndex;
  
  if (item != undefined && item.typeId == "bw:blood_vial") {
    let bloodInfo = item.getDynamicProperty("bw:blood");
    if (bloodInfo) {
      bloodInfo = JSON.parse(bloodInfo);
    } else {
      return;
    }
    
    let seenEntity = player.getEntitiesFromViewDirection(
      { 
        "ignoreBlockCollision": false, 
        "includeLiquidBlocks": false, 
        "includePassableBlocks": false,
        "maxDistance": 7
      }
    )[0];
    if (seenEntity != undefined && isPlayerFamiliar(player, seenEntity.entity)) {
      let powers = getFamiliarPowers(seenEntity.entity, player);
      
      if (powers.includes("Tracking")) {
        // Track Creature based on blood info
        let trackingEntity = getEntityFromBlood(seenEntity.entity.dimension.id, bloodInfo.id)[0];
        console.warn(trackingEntity?.id)
        if (trackingEntity?.isValid) {
          // Direction to head in
          let dir = Vector3.subtract(trackingEntity.location, seenEntity.entity.location);
          dir.y = 0;
          dir = Vector3.normalize(dir);
          
          // Move entity in that direction
          seenEntity.entity.applyImpulse(dir);
          // Look in the direction
          seenEntity.entity.lookAt(trackingEntity.location);
        }
      }
    }
  }
  
  // Enchant Jack
  if (item != undefined && item.typeId == "minecraft:enchanted_book") {
    let enchant = item.getComponent("minecraft:enchantable")?.getEnchantments()[0];
    let block = player.getBlockFromViewDirection({ "includeLiquidBlocks": false, "includePassableBlocks": false,"maxDistance": 7})?.block;
    
    
    if (enchant && block) {
      let formedJackName = `pumpkinWard:${Math.floor(block.x)}_${Math.floor(block.y)}_${Math.floor(block.z)}_${block.dimension.id}`;
      if (world.getDynamicProperty(formedJackName)) {
        let jack = JSON.parse(world.getDynamicProperty(formedJackName));
        
        if (!jack.shields || jack.shields < 10) {
          if (enchant.type.id.includes("protection")) {
            if (jack.shields == undefined) {
              jack.shields = 0;
            }
            
            jack.shields = jack.shields + enchant.level;
            if (jack.shields > 10) {
              jack.shields = 10;
            }
            inv.setItem(slot, useItem(item));
            player.sendMessage(`§6[!]§r An enchanted shield has been placed on this Jack o' Ward. It now has Shield ${jack.shields}.`);
            // Particles & Sounds
            block.dimension.spawnParticle("bw:jack_dust_final", block.center());
            block.dimension.playSound("mob.evocation_illager.cast_spell", block.location);
            // Set Jack
            world.setDynamicProperty(formedJackName, JSON.stringify(jack));
          }
        }
      }
    }
  }
  
  /*
  if (item != undefined && item.typeId == "minecraft:gold_ingot") {
    world.getDynamicPropertyIds().filter(d => d.startsWith(`bw:isFamiliar_`)).forEach((e) => {
      world.setDynamicProperty(e, undefined);
      console.warn(e)
    });
    
    world.structureManager.getWorldStructureIds().filter(f => f.startsWith("familiarBox:")).forEach((d) => {
      console.warn(d)
      world.structureManager.delete(d);
    });
  }
  */
});

// Familiar Brushing
world.afterEvents.itemStopUse.subscribe(async (cast) => {
  let player = cast.source;
  let item = cast.itemStack;
  let useTime = cast.useDuration;
  let inv = player.getComponent("inventory").container;
  let slot = player.selectedSlotIndex;
  
  if (useTime > 0) {
    return;
  }
  // Get Familiar
  if (item?.typeId == "minecraft:brush") {
    let seenEntity = player.getEntitiesFromViewDirection(
        { 
        "ignoreBlockCollision": false, 
        "includeLiquidBlocks": false, 
        "includePassableBlocks": false,
        "maxDistance": 5
      }
    )[0];
    // Is there an entity?
    if (seenEntity != undefined) {
      // Is entity Familiar?
      if (isPlayerFamiliar(player, seenEntity.entity)) {
        // Get Familiar
        let familiarInfo = isFamiliar(seenEntity.entity);
        let familiar;
        if (familiarInfo) {
          let famName = `bw:isFamiliar_${familiarInfo[0]}_${familiarInfo[1]}`;
          if (world.getDynamicProperty(famName)) {
            familiarInfo = famName;
            familiar = JSON.parse(world.getDynamicProperty(famName));
          }
        }
        
        // Familiar was found
        if (familiar != undefined) {
          // Raise Mood
          if (familiar.mood < 20) {
            // Increase Mood
            familiar.mood = familiar.mood + 3;
            let name = seenEntity.entity.nameTag;
            if (!name) {
              name = "Familiar"
            }
            if (familiar.mood > 20) {
              familiar.mood = 20;
            }
            player.sendMessage(`§a[!]§r ${name}'s mood has improved! (+3)`)
            // Set Mood Value
            world.setDynamicProperty(familiarInfo, JSON.stringify(familiar));
          }
          // Play Brush Sound
          player.dimension.playSound("brush.generic", seenEntity.entity.location);
          // Consume durability/break brush
          
        }
      }
    }
  }
  
});
// Familiar Feeding
world.beforeEvents.playerInteractWithEntity.subscribe(ev => {
  let player = ev.player;
  let target = ev.target;
  let item = ev.itemStack;
  
  if (item == undefined) {
    return;
  }
  
  let consumeItem = true;

  // Is entity Familiar?
  if (isPlayerFamiliar(player, target)) {
    // Get Familiar
    let familiarInfo = isFamiliar(target);
    let familiar;
    if (familiarInfo) {
      let famName = `bw:isFamiliar_${familiarInfo[0]}_${familiarInfo[1]}`;
      if (world.getDynamicProperty(famName)) {
        familiarInfo = famName;
        familiar = JSON.parse(world.getDynamicProperty(famName));
      }
    }
    
    // Familiar was found & they can be fed
    if (familiar != undefined && familiar.eatables?.includes(item.typeId)) {
      // Get appropriate food mood
      let feedAmt = 4;
      if (familiar.favoriteFood == item.typeId) {
        feedAmt += 2;
      }
      // Raise Mood
      if (familiar.mood < 20) {
        system.run(() => {
          let bonus = familiar.moodBonus;
          if (bonus == undefined) {
            bonus = 0;
          }
          
          familiar.mood = familiar.mood + feedAmt + bonus;
          let name = target.nameTag;
          if (!name) {
            name = "Familiar"
          }
          player.sendMessage(`§a[!]§r ${name}'s mood has improved! (+${feedAmt + bonus})`);
          // Reset to 20 if overs exist
          if (familiar.mood > 20) {
            familiar.mood = 20
          }
          // Set Mood Value
          world.setDynamicProperty(familiarInfo, JSON.stringify(familiar));
          
          // Consume Item
          if (consumeItem) {
            let inv = player.getComponent("minecraft:inventory").container;
            inv.setItem(player.selectedSlotIndex, useItem(item));
            
            // Particles & Sounds
          }
        })
        ev.cancel = true;
      }
    }
  }
});

system.runInterval(() => {
  for (let [owner, familiars] of familiarRegistry) {
    let player = world.getPlayers().filter(e => e.id == owner)[0];
    
    if (player == undefined) {
      continue;
    }
    if (familiars.length == 0) {
      continue;
    }
    
    let block = player.dimension.getBlock(player.location);
    let inv = player.getComponent("minecraft:inventory")?.container;
    let allTalismanSpirits = [];
    
    let movementBonus = new Map();
    let waterMovement = new Map();
    
    if (inv) {
      allTalismanSpirits = getTalismanSpirits(inv);
    }
    
    let ownerMap = familiarRegistry.get(owner);
    let updatedMap = new Map();
    // Copy Owner Map to Updated Map
    ownerMap.forEach((v, k) => {
      updatedMap.set(k, v);
    })
    
    // Create psuedo-familiars for the familiarRegistry.
    // This ensures that they don't need to be manually found and removed in the main familiar list if the trinket is dropped, etc.
    for (let spirit of allTalismanSpirits) {
      let createdId = `bw:isFamiliar_${spirit}_${owner}`;
      if (world.getDynamicProperty(createdId)) {
        let talismanObj = {
          id: spirit,
          familiarId: createdId
        }
        updatedMap.set(spirit, talismanObj);
      }
    }
    
    // Loop through created familiar Map
    for (let [k, familiar] of updatedMap) {
      let entityLoaded = true;
      if (familiar.entity == undefined || !familiar.entity?.isValid) {
        entityLoaded = false;
      }
      let inFamiliarRange = false;
      let inTrinket = false;
      
      if (entityLoaded) {
        let dis = inRange(familiar.entity.location, player.location, 16);
        if (dis) {
          inFamiliarRange = true;
        }
      }
      if (allTalismanSpirits.includes(familiar.id)) {
        inTrinket = true;
      }
      
      // Natural Regeneration
      // All familiars naturally regenerate. They're a 1 in 6 chance of this happening
      // This uses the health parameter.
      if (entityLoaded) {
        let health = familiar.entity?.getComponent("minecraft:health");
        if (Math.round(health.currentValue) < health.defaultValue) {
          if (diceRoll(1, 6, true) == 1) {
            health.setCurrentValue(Math.floor(health.currentValue+1));
          }
        }
      }
      
      // Familiar World D. Property
      let worldFamiliar = world.getDynamicProperty(familiar.familiarId);
      if (worldFamiliar == undefined) {
        // Remove this familiar;
        // It doesn't exist in the world as a familiar;
        // The "id" here is the familiar's true soul
        if (ownerMap.has(familiar.id)) {
          ownerMap.delete(familiar.id);
          familiarRegistry.set(owner, ownerMap);
          console.warn(`${familiar.id} was removed as there was no property to support it;`);
        }
        continue;
      }
      worldFamiliar = JSON.parse(worldFamiliar);
      
      let aspects = worldFamiliar.traits;
      
      if (worldFamiliar.mood > 1) {
        let init = worldFamiliar.mood;
        // Decrease Mood based on Traits present
        // Traits determine what conditions your Familiar likes and dislikes.
        // Each trait has its distinct values that increase abd decrease the mood threshold. Phobias decrease it and Philias increase it when their conditions are met.
        // Traits do not apply when inside a trinket. It is the FAMILIAR that dislikes these things, not the witch.
        if (entityLoaded) {
          let keys = Object.keys(worldFamiliar.moodTraits);
          
          if (worldFamiliar.mood > 0) {
            let moodTimerGoal = 60;
            // Slowly work through each trait, decrementing, removing mood and resetting when necessary.
            keyLoop: for (let t of keys) {
              if (celestialTraits.includes(t)) {
                let time = getTimeAlignment(familiar.entity);
                let naturalLight = familiar.entity.dimension.getSkyLightLevel(familiar.entity.location);
                let currentLight = familiar.entity.dimension.getLightLevel(familiar.entity.location);
                
                if (t == "Heliophile") {
                  if (time != "night" && naturalLight > 6) {
                    moodTimerGoal = moodTimerGoal + traitTimes[t];
                  }
                }
                if (t == "Heliophobe") {
                  if (time != "night" && naturalLight > 6) {
                    moodTimerGoal = moodTimerGoal + traitTimes[t];
                  }
                }
                
                if (t == "Selenophile") {
                  if (time == "night" && naturalLight > 3) {
                    moodTimerGoal = moodTimerGoal + traitTimes[t];
                  }
                }
                if (t == "Selenophobe") {
                  if (time == "night" && naturalLight > 3) {
                    moodTimerGoal = moodTimerGoal + traitTimes[t];
                  }
                }
                
                if (t == "Nyctophile") {
                  if (currentLight < 5) {
                    moodTimerGoal = moodTimerGoal + traitTimes[t];
                  }
                }
                if (t == "Nyctophobe") {
                  if (currentLight < 5) {
                    moodTimerGoal = moodTimerGoal + traitTimes[t];
                  }
                }
              }
              if (biomeTraits.includes(t)) {
                let biome = familiar.entity.dimension.getBiome(familiar.entity.location).id;
                
                if (t == "Dendrophobe") {
                  if (validForestBiomes.includes(biome)) {
                    moodTimerGoal = moodTimerGoal + traitTimes[t];
                  }
                }
                if (t == "Dendrophile") {
                  if (validForestBiomes.includes(biome)) {
                    moodTimerGoal = moodTimerGoal + traitTimes[t];
                  }
                }
                if (t == "Anthophobe") {
                  if (validMeadowBiomes.includes(biome)) {
                    moodTimerGoal = moodTimerGoal + traitTimes[t];
                  }
                }
                if (t == "Anthophile") {
                  if (validMeadowBiomes.includes(biome)) {
                    moodTimerGoal = moodTimerGoal + traitTimes[t];
                  }
                }
              }
              if (heightTraits.includes(t)) {
                let entityY = Math.floor(familiar.entity.location.y);
                let currentHighest = 0;
                try {
                  let belowBlock = Vector3.subtract(familiar.entity.location, new Vector3(0, 2, 0));
                  let xzPos = {
                    x: Math.floor(belowBlock.x),
                    z: Math.floor(belowBlock.z)
                  }
                  let yHeight = belowBlock.y;
                  currentHighest = Math.floor(familiar.entity.dimension.getTopmostBlock(xzPos, yHeight).y);
                } catch (e) {}
                
                let trueHeight = entityY - currentHighest;
                
                if (t == "Acrophobe") {
                  if (trueHeight >= 5) {
                    moodTimerGoal = moodTimerGoal + traitTimes[t];
                  }
                }
                if (t == "Acrophile") {
                  if (trueHeight >= 5) {
                    moodTimerGoal = moodTimerGoal + traitTimes[t];
                  }
                }
              }
              // ###
            }
            
            // Reset timer if undefined or equal/above moodTimerGoal
            if (worldFamiliar.moodTimer == undefined || worldFamiliar.moodTimer >= moodTimerGoal) {
              worldFamiliar.mood--;
              worldFamiliar.moodTimer = 0;
            } else {
              worldFamiliar.moodTimer++;
            }
            
            world.setDynamicProperty(familiar.familiarId, JSON.stringify(worldFamiliar));
            
          }
        }
        
        if (init != worldFamiliar.mood) {
          player.sendMessage(`Familiar Mood decreased by ${init - worldFamiliar.mood} (currently ${worldFamiliar.mood})`);
        }
      }
      
      // Periodically update familiar location and dimension
      if (!worldFamiliar.dismissed) {
        if (entityLoaded) {
          worldFamiliar.lastLocation = {
            x: Math.floor(familiar.entity.location.x) + 0.5,
            y: Math.floor(familiar.entity.location.y) + 0.5,
            z: Math.floor(familiar.entity.location.z) + 0.5
          }
          if (familiar.entity.dimension.id != worldFamiliar.lastDimension) {
            worldFamiliar.lastDimension = familiar.entity.dimension.id;
          }
          world.setDynamicProperty(familiar.familiarId, JSON.stringify(worldFamiliar));
        }
      }
      
      // If Mood is lower than 3, familiars won't help.
      
      // Abilities
      // {
      if (aspects.genusAbility == "Dark Vision" || aspects.subfamilyAbilities.includes("Dark Vision")) {
        if (inFamiliarRange || inTrinket) {
          // If in low light, gain night vision;
          if (player.dimension.getLightLevel(player.location) <= 5) {
            if (greaterHasEffect(player, "minecraft:night_vision", 0, 230)) {
              player.addEffect("minecraft:night_vision", 300, {showParticles: false})
            }
          }
        }
      }
      
      if (aspects.genusAbility == "Glide" || aspects.subfamilyAbilities.includes("Glide")) {
        if (inFamiliarRange || inTrinket) {
          if (greaterHasEffect(player, "minecraft:slow_falling", 0, 80)) {
            player.addEffect("minecraft:slow_falling", 100, {showParticles: false})
          }
        }
      }
      
      if (aspects.genusAbility == "Shell" || aspects.subfamilyAbilities.includes("Shell")) {
        if (inFamiliarRange || inTrinket) {
          if (greaterHasEffect(player, "minecraft:resistance", 0, 80)) {
            player.addEffect("minecraft:resistance", 100, {showParticles: false})
          }
        }
      }
      
      if (aspects.genusAbility == "Pack" || aspects.subfamilyAbilities.includes("Pack")) {
        if (inFamiliarRange) {
          // Give effect to owner
          let effects = familiar.entity.getEffects();
          for (let effect of effects) {
            // If valid and diration is greater that 10, try to share the effect if the player doesn't already have it.
            // It is NOT perfect sharing.
            if (!effect.isValid) {
              continue;
            }
            
            if (greaterHasEffect(player, effect.typeId, effect.amplifier, 220)) {
              player?.addEffect(effect.typeId, effect.duration, {amplifier: effect.amplifier});
            }
          }
        }
      }
      
      if (aspects.genusAbility == "Rejuvenation" || aspects.subfamilyAbilities.includes("Rejuvenation")) {
        if (inFamiliarRange) {
          // Slowly heal player below 75%
          let health = player.getComponent("minecraft:health");
          if (health) {
            let percent = Math.floor((health.currentValue/health.defaultValue) * 100);
            
            if (percent < 75) {
              if (greaterHasEffect(player, "minecraft:regeneration", 0, 100)) {
                player.addEffect("minecraft:regeneration", 200, {showParticles: false})
              }
            }
          }
        }
      }
      
      if (aspects.genusAbility == "Wake Swimming" || aspects.subfamilyAbilities.includes("Wake Swimming")) {
        if (inFamiliarRange || inTrinket) {
          let surface = block.above(3);
          
          if (player.isInWater) {
            if (!surface.isLiquid && surface.isAir) {
              if (!waterMovement.has("Wake Swimming") || waterMovement.get("Wake Swimming") == 0.00) {
                waterMovement.set("Wake Swimming", 0.04);
              }
            } else {
              waterMovement.set("Wake Swimming", 0.00);
            }
          }
        }
      }
      
      if (aspects.genusAbility == "Gills" || aspects.subfamilyAbilities.includes("Gills")) {
        if (inFamiliarRange || inTrinket) {
          let water = player?.dimension?.getBlock(player.getHeadLocation())?.isLiquid;
          
          if (player.isInWater && water) {
            if (greaterHasEffect(player, "minecraft:water_breathing", 0, 80)) {
              player.addEffect("minecraft:water_breathing", 100, {showParticles: false})
            }
          }
        }
      }
      
      if (aspects.genusAbility == "Echolocation" || aspects.subfamilyAbilities.includes("Echolocation")) {
        if (inFamiliarRange || inTrinket) {
          let playerPos = player.getAABB().center;
          let entityRadius = player.dimension.getEntities({location: playerPos, maxDistance: 16});
          
          for (let e of entityRadius) {
            if (e.id == player.id) {
              continue;
            }
            if (entityLoaded && familiar.entity.id == e.id) {
              continue;
            }
            
            let mov = Vector3.magnitude(e.getVelocity());
            if (!e.isSneaking && mov > 0) {
              // Insert true effect
              player.playSound("random.explode");
              console.warn("Sensed Entity: "+e.typeId+" at speed value "+mov)
            }
          }
        }
      }
      
      if (aspects.genusAbility == "Camouflage" || aspects.subfamilyAbilities.includes("Camouflage")) {
        if (inFamiliarRange || inTrinket) {
          let mov = Vector3.magnitude(player.getVelocity());
          if (player.isSneaking || mov < 0.0003) {
            if (greaterHasEffect(player, "minecraft:invisibility", 0, 80)) {
              player.addEffect("minecraft:invisibility", 100, {showParticles: false})
            }
            if (entityLoaded) {
              if (greaterHasEffect(familiar.entity, "minecraft:invisibility", 0, 80)) {
                familiar.entity.addEffect("minecraft:invisibility", 100, {showParticles: false})
              }
            }
          }
        }
      }
      
      if (aspects.genusAbility == "Shed" || aspects.subfamilyAbilities.includes("Shed")) {
        if (inFamiliarRange || inTrinket) {
          let roll = diceRoll(1, 20, true);
          
          if (roll >= 16) {
            for (let n of negativeEffects) {
              if (player?.getEffect(n)) {
                player.removeEffect(n);
              }
              
              if (entityLoaded) {
                if (familiar.entity.getEffect(n)) {
                  familiar.entity.removeEffect(n);
                }
              }
            }
          }
          // Remove a Hex if it rolls 20
          if (roll == 20) {
            let playerHexes = player.getDynamicProperty("bw:hexPool");
            if (playerHexes != undefined) {
              playerHexes = JSON.parse(playerHexes);
              if (playerHexes.length > 0) {
                let hex = playerHexes.shift();
                player.setDynamicProperty(hex, undefined);
              }
            }
            
            if (entityLoaded) {
              let entityHexes = familiar.entity.getDynamicProperty("bw:hexPool");
              if (entityHexes != undefined) {
                entityHexes = JSON.parse(entityHexes);
                if (entityHexes.length > 0) {
                  let hex = entityHexes.shift();
                  familiar.entity.setDynamicProperty(hex, undefined);
                }
              }
              
            }
          }
        }
      }
      
      // There are other abilities that need direct access to various sections of code, so they will not be documented here, however, they will be referenced.
      // Spiritual Awareness
      // Pack
      // Tracking
      // Steal
      // Sting
      // Flower Eater
      // Potence
      // Poison Resistance
      // Rejuvenation
      // Glide
      // Gill
      // Wake Swimming
      // Shock
      // Echolocation
      // Camouflage
      // Shell
      // Shed
      // Dark Vision
      // Mimic*
      
      // }
    }
    // Water movement stuffs
    if (waterMovement.size > 0) {
      let spd = 0;
      waterMovement.forEach((v, k) => {
        spd = spd + v;
      });
      let obj = {
        "timer": 2,
        "amplifier": spd,
        "vanishOnDeath": true
      }
      
      player.setDynamicProperty("bwDuration:speed_swim", JSON.stringify(obj));
    }
  }
}, 20);