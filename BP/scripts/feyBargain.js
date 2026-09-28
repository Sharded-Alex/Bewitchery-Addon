/* jshint maxerr: 10000 */
import {world, system, ItemStack, BlockPermutation, Dimension, EntityItemComponent, EffectTypes, MolangVariableMap} from "@minecraft/server";
import {ActionFormData, ActionFormResponse, MessageFormData, ModalFormData} from "@minecraft/server-ui";
import {Vector3, Random} from "./VectorMath/index.js";
import {randomize, getFaeFamily, hasFaery, findFaery, addFaery} from "./castRitual.js";
import {diceRoll} from "./occultMagick.js";
import {poisons, hasFamiliar, getPresentFamiliarPowers} from "./familiars.js";

// FAERIE GAMES
export const FAE_GAMES = {
  "joyful_frolick": {
    "name": "Its Joyful Frolick",
    "hexPool": [
      "ocean_hold",
      "hellish_attraction",
      "sympathy",
      "obliquity",
      "leadweight",
      "sympathy",
      "copper_soul"
    ],
    "amountOfDays": 3,
    // Briefly describes what the game is
    "description": function (d, l, g) {
      let localization; 
      try {
        let e = d.spawnEntity(g.target, l);
        localization = e.localizationKey;
        e.remove();
      } catch (err) {
        // Err caught
        localization = "Undefined";
      }
      
      let txt = {
        "rawtext": []
      }
      txt.rawtext = [
        {
          text: `§d[!]§r §cIt§r frolicks as a(n) §g`
        },
        {
          translate: localization
        },
        {
          text: "§r, and you must retrieve It if you wish to win this game. Always remember: It favors the victim."
        }
      ]
      return txt;
    }
  },
  "who_is_here": {
    "name": "Who is Here",
    "portals": [
      "minecraft:wooden_door",
      "minecraft:trapdoor",
      "minecraft:spruce_door",
      "minecraft:jungle_door",
      "minecraft:dark_oak_door",
      "minecraft:pale_oak_door",
      "minecraft:cherry_door",
      "minecraft:mangrove_door"
    ],
    "amountOfDays": 5,
    // Briefly describes what the game is
    "description": function (d, l, g) {
      let localization; 
      let doorType = "door";
      if (g.portal.includes("trapdoor")) {
        doorType = "trapdoor";
      }
      console.warn(g.portal)
      try {
        let b = new ItemStack(g.portal, 1);
        localization = b.localizationKey;
      } catch (err) {
        // Err caught
        localization = "Undefined";
      }
      
      let txt = {
        "rawtext": []
      }
      txt.rawtext = [
        {
          text: `§d[!]§r A guest known only as Mr Who is coming to visit, and you must be the one to open the ${doorType}. Be warned, he prefers §g`
        },
        {
          translate: localization
        },
        {
          text: "s§r and cannot find those ones who dwell in brightness."
        }
      ]
      return txt;
    }
  },
  "helpful_gardener": {
    "name": "Helpful Gardener",
    "seedPool": [
      "minecraft:wheat_seeds",
      "minecraft:beetroot_seeds",
      "minecraft:carrot",
      "minecraft:potato"
    ],
    "amountOfDays": 3,
    "description": function (d, l, g) {
      let seedLocalization; 
      let cropLocalization;
      try {
        let i = new ItemStack(g.seedType, 1);
        let b = BlockPermutation.resolve(g.cropType, {});
        seedLocalization = i.localizationKey;
        cropLocalization = b.localizationKey;
      } catch (err) {
        // Err caught
        seedLocalization = "Undefined";
        cropLocalization = "Undefined";
      }
      
      let txt = {
        "rawtext": []
      }
      txt.rawtext = [
        {
          text: `§d[!]§r If you wish to help, plant §g`
        },
        {
          translate: seedLocalization
        },
        {
          text: "§r and harvest §g"
        },
        {
          translate: cropLocalization
        },
        {
          text: "§r. Understand that your help is appreciated."
        },
      ]
      return txt;
    }
  },
  "flower_picking": {
    "name": "Flower Picking",
    "flowerPool": [
      "minecraft:dandelion",
      "minecraft:cornflower",
      "minecraft:blue_orchid",
      "minecraft:poppy",
      "minecraft:oxeye_daisy",
      "minecraft:lily_of_the_valley",
      "minecraft:sunflower",
      "minecraft:lilac",
      "minecraft:wildflowers",
      "minecraft:pink_petals",
      "minecraft:cactus_flower",
      "minecraft:rose_bush",
      "minecraft:allium",
      "minecraft:tulips",
      "minecraft:peony",
      "minecraft:wither_rose",
      "minecraft:eyeblossoms"
    ],
    "amountOfDays": 3,
    "description": function (d, l, g) {
      let txt = {
        "rawtext": []
      }
      txt.rawtext = [
        {
          text: `§d[!]§r The flowers you seek to collect, these small hints will reveal:\n§a`
        },
        {
          text: `${g.riddle}§r`
        }
      ]
      return txt;
    }
  }
}
const KNOCK_SOUNDS = {
  ".": {
    "sound": "who.knock",
    "params": {
      "pitch": 0.8,
      "volume": 2.25
    },
    "delay": 40
  }, // Short Knock
  "_": {
    "sound": "who.knock",
    "params": {
      "pitch": 0.8,
      "volume": 2.25
    },
    "delay": 60
  }, // Long Knock
  
  "+": {
    "sound": "mob.allay.idle",
    "params": {
      "pitch": 1.78,
      "volume": 1.0
    },
    "delay": 40
  }, // Fae Chuckle
  "-": {
    "sound": "mob.zombie.wood",
    "params": {
      "pitch": 1.0,
      "volume": 10
    },
    "delay": 10
  }, // Door Bash #1
  "#": {
    "sound": "mob.zombie.wood",
    "params": {
      "pitch": 0.6,
      "volume": 1.35
    },
    "delay": 40
  }, // Door Bash #2
  "$": {
    "sound": "mob.zombie.wood",
    "params": {
      "pitch": 0.35,
      "volume": 1.35
    },
    "delay": 40
  }, // Low Ahh Door Bash
  "*": {
    "sound": "hit.copper",
    "params": {
      "pitch": 0.9
    },
    "delay": 40
  } // Filler
}
const maximumLesserFae = 5;
const defaultGames = [
  // "joyful_frolick",
  // "chill_campfire",
  // "who_is_here",
  // "helpful_gardener",
  "flower_picking"
];
function getWagerMonsters(trickValue) {
  let finalArr = [
    "minecraft:zombie",
    "minecraft:skeleton",
    "minecraft:drowned",
    "minecraft:spider",
    "minecraft:wolf"
  ];
  if (trickValue == undefined) {
    trickValue = 0;
  }
  if (trickValue > 2) {
    finalArr.push("minecraft:evocation_illager");
    finalArr.push("minecraft:pillager");
    finalArr.push("minecraft:ravager");
    finalArr.push("minecraft:witch");
  }
  if (trickValue > 5) {
    finalArr.push("minecraft:bogged");
    finalArr.push("minecraft:husk");
    finalArr.push("minecraft:parched");
    finalArr.push("minecraft:stray");
    finalArr.push("minecraft:breeze");
    finalArr.push("minecraft:witch");
    finalArr.push("minecraft:slime");
  }
  if (trickValue > 8) {
    finalArr.push("minecraft:hoglin");
    finalArr.push("minecraft:zombie_hoglin");
    finalArr.push("minecraft:blaze");
    finalArr.push("minecraft:phantom");
    finalArr.push("minecraft:piglin");
    finalArr.push("minecraft:piglin_brute");
    finalArr.push("minecraft:wither_skeleton");
  }
  if (trickValue >= 9) {
    finalArr = finalArr.slice(4);
  }
  return finalArr;
}
function getDarkPerils(trickValue) {
  let finalArr = [
    [10, "who"]
  ];
  if (trickValue == undefined) {
    trickValue = 0;
  }
  if (trickValue >= 0) {
    // A disc track playing entity that soothes the listening player to death if the track it plays continues to its end. It is assumed that it is Sianach.
    finalArr.push([20, "the_singer"]);
    // The snatcher pulls something from the door opener's inventory. It can be anything, so long as it is not bound there. It is assumed that these are Brownies.
    finalArr.push([20, "the_snatcher"]);
  }
  if (trickValue >= 3) {
    finalArr[0][0] = 8;
    // A primed creeper pops up in the doorway. A small prank of Equinn's most likely.
    finalArr.push([20, "the_surprise"]);
  }
  if (trickValue >= 6) {
    finalArr[0][0] = 6;
    // The Wyld Hunt has turned its gaze towards this portal into Night. You will be hunted if you do not run.
    finalArr.push([35, "a_hunt"]);
  }
  if (trickValue >= 8) {
    finalArr[0][0] = 5;
    // The Wylder Hunt has turned its gaze towards this portal into Night. You will be hunted if you do not run.
    finalArr[4][0] = 25;
    finalArr[4][1] = "a_great_hunt";
  }
  return finalArr;
}
const SEED_TO_CROPS = {
  "minecraft:wheat_seeds": "minecraft:wheat",
  "minecraft:beetroot_seeds": "minecraft:beetroot",
  "minecraft:carrot": "minecraft:carrots",
  "minecraft:potato": "minecraft:potatoes"
}
const CROP_GROWTH = {
  "minecraft:wheat": {
    "state": "growth",
    "value": 7
  },
  "minecraft:beetroot": {
    "state": "growth",
    "value": 7
  },
  "minecraft:carrots": {
    "state": "growth",
    "value": 7
  },
  "minecraft:potatoes": {
    "state": "growth",
    "value": 7
  }
}
const ARRAY_FLOWERS = {
  "minecraft:tulips": [
    "minecraft:red_tulip",
    "minecraft:orange_tulip",
    "minecraft:pink_tulip",
    "minecraft:white_tulip"
  ],
  "minecraft:eyeblossoms": [
    "minecraft:closed_eyeblossom",
    "minecraft:open_eyeblossom"
  ]
}
const ALL_VALID_FLOWERS = [
  "minecraft:dandelion",
  "minecraft:cornflower",
  "minecraft:blue_orchid",
  "minecraft:poppy",
  "minecraft:oxeye_daisy",
  "minecraft:lily_of_the_valley",
  "minecraft:sunflower",
  "minecraft:lilac",
  "minecraft:wildflowers",
  "minecraft:rose_bush",
  "minecraft:allium",
  "minecraft:peony",
  "minecraft:wither_rose",
  "minecraft:red_tulip",
  "minecraft:orange_tulip",
  "minecraft:pink_tulip",
  "minecraft:white_tulip",
  "minecraft:closed_eyeblossom",
  "minecraft:open_eyeblossom"
]
const FLOWER_LINES = {
  "minecraft:dandelion": [
    "Grab the common wind weed"
  ],
  "minecraft:sunflower": [
    "Pick the sun from a field of gold"
  ],
  "minecraft:rose_bush": [
    "Stick your finger upon the thorns of love told"
  ],
  "minecraft:cornflower": [
    "Pick the petals of the flower named blue seed"
  ],
  "minecraft:eyeblossoms": [
    "Hunt in the woods so pale, and find a blossom that watches"
  ],
  "minecraft:lily_of_the_valley": [
    "Walk through the valleys low and high, to pick a flower bent by wind"
  ],
  "minecraft:tulips": [
    "Pluck the flower of variety; it comes in shades of pink and white, yet also orange and red"
  ],
  "minecraft:lilac": [
    "Collect a flower who's scent is calming with its violet hue; a flower that is about as tall as you"
  ],
  "minecraft:wildflowers": [
    "Drops of yellow among the bundles of white, pick these flowers from the meadows",
    "Pick the ones that frolick in the wild in dresses of yellow and white"
  ],
}

function createKnockPassword(v) {
  let passCode = "";
  let symbols = [
    ".",
    "_"
  ];
  
  for (let i = 0; i < v; i++) {
    let s = pickFromArrPool(symbols);
    passCode = passCode.concat(s);
  }
  
  return passCode;
}
function createKnock(v, passKey, chance, time = undefined) {
  let passCode = "";
  let symbols = [
    ".",
    "_",
    "+",
    "-",
    "#",
    "$",
    "*"
  ];
  
  if (diceRoll(1, 100, true) <= chance) {
    return passKey;
  }
  for (let i = 0; i < v; i++) {
    let s = pickFromArrPool(symbols);
    passCode = passCode.concat(s);
  }
  
  return passCode;
}
export async function playKnock(witch, knock, divined = false) {
  let c = knock.split("").length;
  console.warn("Pattern: ");
  for (let k of knock.split("")) {
    c--;
    let knockObj = KNOCK_SOUNDS[k];
    if (divined) {
      knockObj.sound = "step.stone";
      knockObj.params = {
        volume: 1.2
      };
    }
    console.warn(k);
    
    witch.playSound(knockObj.sound, knockObj.params);
    await system.waitTicks(knockObj.delay);
  }
}

export async function gameOfWho(witch, game) {
  let knock = createKnock(5, game.passCode, 30);
  await playKnock(witch, knock);
  
  witch.sendMessage("§4[?]§r Who is at the Door?");
  
  if (game.passCode != knock) {
    game.currentGuest = "the_singer"// randomize(game.possibleGuests);
  } else {
    game.currentGuest = "who";
  }
  
  // Set Knock Game Value
  if (witch.getDynamicProperty("bw:faeryGame")) {
    let newGame = JSON.parse(witch.getDynamicProperty("bw:faeryGame"));
    console.warn(newGame.timer+" seconds")
    newGame.currentGuest = game.currentGuest;
    newGame.doorState = "closed";
    witch.setDynamicProperty("bw:faeryGame", JSON.stringify(newGame))
  }
}

function spawnGardenPest(player, wager, block) {
  if (wager.planted < wager.harvested || wager.planted == 0) {
    if (diceRoll(1, 20, true) < 9) {
      let pest = "minecraft:silverfish";
      
      let pestEnt = block.dimension.spawnEntity(pest, block.center());
      pestEnt.nameTag = `§aGarden Pest§r (${player.name})`;
      
      // Who they are attached to
      pestEnt.setDynamicProperty("bw:gardener", player.id);
    }
  }
}

// Push in game string, return game object;
function createWager(string, faeryId) {
  let obj = {};
  let baseGame = FAE_GAMES[string];
  if (baseGame != undefined) {
    obj.gameId = string;
    obj.gameName = baseGame.name;
    obj.faeryId = faeryId;
    obj.currentDay = 0;
    obj.finishDay = baseGame.amountOfDays;
  } else {
    obj = "null";
  }
  return obj;
}

// Randomly pick a value from a pool
function pickFromArrPool(arr) {
  return arr[Math.floor(arr.length * Math.random())];
}
// Specifically for the Flower Picking game
function pickFlowers(arr) {
  let finalArr = [];
  for (let i = 0; i < 9; i++) {
    let ind = Math.floor(arr.length * Math.random());
    let v = arr[ind];
    finalArr.push(v);
    
    arr = arr.filter((e) => {
      if (e != v) {
        return e;
      }
    })
  }
  
  return finalArr;
}
function createFlowerRiddle(arr, trickiness) {
  let str = ``;
  let i = 0;
  for (let a of arr) {
    let line = FLOWER_LINES[a];
    if (line != undefined) {
      let l = line[Math.floor(Math.random() * line.length)];
      
      // TODO Change line to ??? randomly based on trickiness
      str = str.concat(`${l}`);
    } else {
      str = str.concat(`Flower (${a})`);
    }
    
    if (arr.length - 1 > i) {
      str = str.concat(",\n");
    }
    i++;
  }
  
  return str;
}

// Fully set-up the game;
function createGame(witch, gInfo) {
  let faerie = findFaery(gInfo.faeryId);
  
  gInfo.currentDay = world.getDay();
  gInfo.finishDay = world.getDay()+gInfo.finishDay;
  if (gInfo.gameId == "joyful_frolick") {
    let gameData = FAE_GAMES[gInfo.gameId];
    let monsterTypes = getWagerMonsters(faerie.trickiness);
    gInfo.target = pickFromArrPool(monsterTypes);
    gInfo.it = false;
    witch.sendMessage(gameData.description(witch.dimension, witch.location, gInfo));
  }
  if (gInfo.gameId == "helpful_gardener") {
    let gameData = FAE_GAMES[gInfo.gameId];
    gInfo.seedType = pickFromArrPool(gameData.seedPool);
    gInfo.cropType = SEED_TO_CROPS[gInfo.seedType];
    gInfo.planted = 9;
    gInfo.harvested = 9;
    gInfo.difficulty = faerie.trickiness;
    witch.sendMessage(gameData.description(witch.dimension, witch.location, gInfo));
  }
  if (gInfo.gameId == "flower_picking") {
    let gameData = FAE_GAMES[gInfo.gameId];
    gInfo.flowerArray = pickFlowers(gameData.flowerPool);
    gInfo.riddle = createFlowerRiddle(gInfo.flowerArray, faerie.trickiness);
    
    gInfo.currentIndex = 0;
    gInfo.lenience = false;
    
    witch.sendMessage(gameData.description(witch.dimension, witch.location, gInfo));
  }
  if (gInfo.gameId == "who_is_here") {
    let gameData = FAE_GAMES[gInfo.gameId];
    gInfo.portal = pickFromArrPool(gameData.portals);
    gInfo.possibleGuests = getDarkPerils(faerie.trickiness);
    gInfo.timer = Math.floor(Math.random() * 40) + Math.ceil(Math.random() * 3) * 10;
    gInfo.steps = 0;
    gInfo.passCode = createKnockPassword(5);
    playKnock(witch, gInfo.passCode, true)
    
    if (witch.dimension.getLightLevel(witch.location) > 6) {
      gInfo.delayed = true;
      witch.setDynamicProperty("bw:gameDelay", "low_light");
      witch.sendMessage("§c[+]§r Move to a dark location to begin.");
    } else {
      witch.sendMessage(gameData.description(witch.dimension, witch.location, gInfo));
    }
  }
  
  witch.setDynamicProperty("bw:faeryGame", JSON.stringify(gInfo));
}
// Revamping this ENTIRE thing to be more streamlined and neat.
export function requestStartingGame(player, faery) {
  // If Faerie is underined
  if (faery == "undefined" || faery == undefined) {
    return player.sendMessage("§c[!]§r You send out a call. Unfortunately, the Fae pay you no mind.");
  }
  
  // Check if the player has met all the qualifications to play this game.
  if (!hasFaery(player, faery)) {
    let faeFamily = getFaeFamily(player);
    if (faeFamily.lessers >= maximumLesserFae) {
      return player.sendMessage(`§c[!]§r Your Lesser Faerie council already has ${maximumLesserFae} members. You are not allowed any more.`);
    }
  } else {
    return player.sendMessage("§c[!]§r The Faerie who answers sees that you have another of its kind among your party. Naturally, it leaves in respect.");
  }
  
  let game = createWager(defaultGames[Math.floor(defaultGames.length * Math.random())], faery.id);
  
  if (game != "null") {
    player.sendMessage(`§a[?]§r §g${faery.name}§r wagers their aid for something of yours in the Faery Game, §a${game.gameName}§r. A drink of honey accepts the wager; a drink of water denies it.`);
    player.setDynamicProperty("bw:wagerRequest", JSON.stringify(game));
  } else {
    console.warn("No game exists by the provided string.");
  }
} 


const valuables = [
  "takeSecrets",//✓
  "itemUse", //✓
  "silence", // ✓
  "takeEffect", //✓
  "breakBlocks" //✓
]

export function lostWager(witch) {
  witch.sendMessage(`§c[!]§r You've hopefully lost Secrets. Otherwise, you might have lost something important...`);
}

/** Faerie Game: It's Joyful Frolick
 * - You must have It by the end of the game.
 * - If you die under any circumstance, you lose.
 * - A random hostile mob is chosen and it has a chance to give you It if it hits you.
 * - Hitting anything else while having It will cause you to lose It.
 */

world.afterEvents.itemCompleteUse.subscribe(event => {
  let item = event.itemStack;
  let player = event.source;
  
  if (item != undefined) {
    // Wager Check
    // The Fae will wait until a wager is accepted or declined before doing anything
    if (player.getDynamicProperty("bw:wagerRequest") != undefined) {
      let gameDetails = JSON.parse(player.getDynamicProperty("bw:wagerRequest"));
      // Faerie who offered the wager.
      let fae = findFaery(gameDetails.faeryId);
      
      // Honey accepts the peril
      if (item.typeId == "minecraft:honey_bottle") {
        player.sendMessage(`§a[!]§r You've accepted the wager of §g${fae.name}§r!`)
        createGame(player, gameDetails);
        player.setDynamicProperty("bw:wagerRequest", undefined);
      }
      
      // A drink of water declines it
      if (item.typeId == "minecraft:potion") {
        player.sendMessage(`§c[!]§r You've denied the wager of §g${fae.name}§r.`);
        player.setDynamicProperty("bw:wagerRequest", undefined);
      }
    }
    
    // REMOVE LATER
    if (player.getDynamicProperty("bw:faeryGame") != undefined) {
      let faeryWager = JSON.parse(player.getDynamicProperty("bw:faeryGame"));
      if (item.typeId == "minecraft:honey_bottle") {
        
        if (faeryWager.gameId == "flower_picking") {
          if (!faeryWager.lenience) {
            faeryWager.lenience = true;
            player.setDynamicProperty("bw:faeryGame", JSON.stringify(faeryWager));
            player.sendMessage("§6[!]§r You drink the honey, and you soon feel yourself being judged by kinder eyes.");
            player.playSound("fire.extinguish");
          }
        }
      }
      if (item.typeId == "minecraft:milk_bucket") {
        player.setDynamicProperty("bw:faeryGame", undefined);
        console.warn("Fae Game removed");
      }
    }
  }
});

world.beforeEvents.itemUse.subscribe(event => {
  let item = event.itemStack;
  let player = event.source;
  
  if (item != undefined) {
    
    if (item.typeId == "minecraft:stick") {
      requestStartingGame(player, findFaery("chlorophae"))
    }
    /*
    if (player.getDynamicProperty(`bwFaePossess:itemUse`)) {
      player.setDynamicProperty(`bwFaePossess:itemUse`, undefined);
      let itemFound = player.getDynamicProperty(`bwFaePossess:itemUse_${item.typeId}`);
      if (itemFound != undefined) {
        player.setDynamicProperty(`bwFaePossess:itemUse_${item.typeId}`, itemFound+1);
      } else {
        player.setDynamicProperty(`bwFaePossess:itemUse_${item.typeId}`, 1);
      }
      system.run(() => {
        player.playSound("mob.allay.idle")
        player.sendMessage(`§gYou hear the chortles of Faeries as they reach forward and pull your essence bare. The Fae have taken their prize.§r`);
      })
    }
    
    if (player.getDynamicProperty(`bwFaePossess:itemUse_${item.typeId}`) != undefined) {
      event.cancel = true;
    }
    */
  }
});

world.beforeEvents.playerBreakBlock.subscribe(event => {
  let item = event.itemStack;
  let block = event.block;
  let player = event.player;
  
  if (player?.getDynamicProperty("bw:faeryGame") != undefined) {
    let faeryWager = JSON.parse(player.getDynamicProperty("bw:faeryGame"));
    if (faeryWager.gameId == "helpful_gardener") {
      let growth = CROP_GROWTH[faeryWager.cropType];
      if (block.typeId == faeryWager.cropType && block.permutation.getState(growth.state) == growth.value) {
        // Cancel Break
        // Summon Pest
        // Replace block with air
        event.cancel = true;
        system.run(() => {
          block.setType("minecraft:air");
          spawnGardenPest(player, faeryWager, block);
        })
      }
    }
  }
  
  if (player.getDynamicProperty(`bwFaePossess:breakBlocks`)) {
    player.setDynamicProperty(`bwFaePossess:breakBlocks`, undefined);
    let blockFound = player.getDynamicProperty(`bwFaePossess:breakBlocks_${block.typeId}`);
    if (blockFound != undefined) {
      player.setDynamicProperty(`bwFaePossess:breakBlocks_${block.typeId}`, blockFound+1);
    } else {
      player.setDynamicProperty(`bwFaePossess:breakBlocks_${block.typeId}`, 1);
    }
    system.run(() => {
      player.playSound("mob.allay.idle")
      player.sendMessage(`§gYou hear the chortles of Faeries as they reach forward and pull your essence bare. The Fae have taken their prize.§r`);
    })
  }
  
  if (player.getDynamicProperty(`bwFaePossess:breakBlocks_${block.typeId}`) != undefined) {
    event.cancel = true;
  }
});

world.afterEvents.effectAdd.subscribe(event => {
  if (event.effect == undefined) {
    return;
  }
  let effect = event.effect?.typeId;
  let player = event.entity;
  
  if (!player?.isValid) {
    return;
  }
  if (player.getDynamicProperty(`bwFaePossess:takeEffect`)) {
    player.setDynamicProperty(`bwFaePossess:takeEffect`, undefined);
    let effectFound = player.getDynamicProperty(`bwFaePossess:takeEffect_${effect}`);
    if (effectFound != undefined) {
      player.setDynamicProperty(`bwFaePossess:takeEffect_${effect}`, effectFound+1);
    } else {
      player.setDynamicProperty(`bwFaePossess:takeEffect_${effect}`, 1);
    }
    player.playSound("mob.allay.idle")
    player.sendMessage(`§gYou hear the chortles of Faeries as they reach forward and pull your essence bare. The Fae have taken their prize.§r`);
  }
  
  if (player.getDynamicProperty(`bwFaePossess:takeEffect_${effect}`) != undefined) {
    player.removeEffect(effect);
    return;
  }
  
  if (hasFamiliar(player)) {
    let powers = getPresentFamiliarPowers(player, true);
    if (powers.includes("Poison Resistance")) {
      if (poisons.includes(effect)) {
        player.removeEffect(effect);
      }
    }
  }
});

/*
world.beforeEvents.chatSend.subscribe(e => {
  let player = e.sender;
  let msg = e.message;
  
  if (player.getGameMode() != "creative" && player.getDynamicProperty(`bwFaePossess:silence`) != undefined) {
    e.cancel = true;
  }
});
*/

// Its Joyful Frolick
world.afterEvents.entityHitEntity.subscribe(e => {
  let entity = e.hitEntity;
  let player = e.damagingEntity;
  
  if (player?.typeId == "minecraft:player" && player.getDynamicProperty("bw:faeryGame") != undefined) {
    let faeryWager = JSON.parse(player.getDynamicProperty("bw:faeryGame"));
    if (faeryWager.gameId == "joyful_frolick") {
      if (faeryWager.it) {
        faeryWager.it = false;
        player.setDynamicProperty("bw:faeryGame", JSON.stringify(faeryWager));
        player.sendMessage("§c[!]§r You've lost It. It has returned to Its original mob.");
        player.playSound("fire.extinguish");
      }
    }
  }
  
  if (entity?.typeId == "minecraft:player" && entity.getDynamicProperty("bw:faeryGame") != undefined) {
    let faeryWager = JSON.parse(entity.getDynamicProperty("bw:faeryGame"));
    if (faeryWager.gameId == "joyful_frolick") {
      let trueGame = FAE_GAMES[faeryWager.gameId];
      if (player?.typeId == faeryWager.target && !faeryWager.it) {
        if (diceRoll(1, 100, true) < 46) {
          faeryWager.it = true;
          entity.setDynamicProperty("bw:faeryGame", JSON.stringify(faeryWager));
          entity.sendMessage("§a[!]§r You've become It!");
          let hex = pickFromArrPool(trueGame.hexPool);
          ritualHexTarget(entity, hex, entity, 3);
          entity.playSound("random.levelup");
        }
      }
    }
  }
});

function checkDoorOpen(block) {
  let states = block.permutation.getAllStates();
  if (states.open_bit == undefined) {
    return false;
  } else {
    if (states.upper_block_bit == true) {
      if (block.below(1).permutation.getState("open_bit") == true) {
        return true;
      }
    } else
    if (states.upper_block_bit == false) {
      if (states.open_bit == true) {
        return true;
      }
    }
    
    if (states.upside_down_bit == true) {
      if (states.open_bit == true) {
        return true;
      }
    } else
    if (states.upside_down_bit == false) {
      if (states.open_bit == true) {
        return true;
      }
    }
  }
  return false;
}
// Who is Here
world.afterEvents.playerInteractWithBlock.subscribe(e => {
  const item = e.itemStack;
  const player = e.player;
  const playerInv = player.getComponent('inventory').container;
  const block = e.block;
  
  if (player?.getDynamicProperty("bw:faeryGame")) {
    let faeryWager = JSON.parse(player.getDynamicProperty("bw:faeryGame"));
    
    if (faeryWager.gameId == "who_is_here") {
      // Check if the game is delayed
      if (faeryWager.delayed == undefined) {
        let isOpen = checkDoorOpen(block);
        if (isOpen) {
          // If magical aspect of the door is already opened
          /*
          if (faeryWager.doorState == "opened") {
            console.warn("The door was already metaphysically open")
            return;
          }
          */
          // This is Who
          if (faeryWager.currentGuest == "who") {
            console.warn("GRRL. IT'S WHO!!");
            return;
          }
          // This isn't Who
          // Singer mechanics
          if (faeryWager.currentGuest == "the_singer") {
            // Dice Roll (DC 9)
            if (diceRoll(1, 20, true) >= 9) {
              // Track Selections
              let tracks = [
                "record.11",
                "record.13",
                "record.5",
                "record.precipe",
                "record.far",
                "record.tear",
                "record.otherside"
              ];
              // Stop Music
              player.stopMusic();
              for (let t of tracks) {
                player.stopSound(t);
              }
              // Play Creepier Tracks
              player.playSound(pickFromArrPool(tracks));
            } else {
              // SCREAM
              player.playSound("mob.ghast.scream", {
                pitch: 1.0,
                volume: 6.0
              });
              player.applyDamage(19, {cause: "override"});
            }
            let fW = player.getDynamicProperty("bw:faeryGame")
            if (fW) {
              fW = JSON.parse(fW);
              fW.doorState = "opened";
              player.setDynamicProperty("bw:faeryGame", JSON.stringify(fW));
            }
          }
          // Hunger mechanic
          if (faeryWager.currentGuest == "the_hunger") {
            // Blood Lust
            let fW = player.getDynamicProperty("bw:faeryGame")
            if (fW) {
              fW = JSON.parse(fW);
              fW.doorState = "opened";
              player.setDynamicProperty("bw:faeryGame", JSON.stringify(fW));
            }
          }
          
          if (faeryWager.portal == block.typeId) {
            player.sendMessage("The correct door is open now...")
          } else {
            player.sendMessage("The incorrect door was opened.")
          }
        }
      }
    }
  }
});

// Helpful Gardener
world.afterEvents.itemStartUseOn.subscribe(event => {
  let item = event.itemStack;
  let block = event.block;
  let player = event.source;
  
  if (item != undefined && block != undefined) {
    if (player?.getDynamicProperty("bw:faeryGame") != undefined) {
      let faeryWager = JSON.parse(player.getDynamicProperty("bw:faeryGame"));
      if (faeryWager.gameId == "helpful_gardener") {
        if (item.typeId == faeryWager.seedType) {
          if (faeryWager.planted > 1) {
            faeryWager.planted = faeryWager.planted - 1;
            player.setDynamicProperty("bw:faeryGame", JSON.stringify(faeryWager));
            player.sendMessage(`§a[!]§r A seed was planted. Only ${faeryWager.planted} left to go!`);
            player.playSound("random.levelup");
          } else
          if (faeryWager.planted == 1) {
            faeryWager.planted = faeryWager.planted - 1;
            player.setDynamicProperty("bw:faeryGame", JSON.stringify(faeryWager));
            player.sendMessage(`§a[!]§r Your seed quota has been met for now.`);
            player.playSound("random.levelup");
          }
        }
      }
    }
  }
});

world.afterEvents.entityDie.subscribe(event => {
  const player = event.damageSource?.damagingEntity;
  const deceased = event.deadEntity;
  
  if (deceased?.isValid) {
    if (deceased.getDynamicProperty("bw:gardener")) {
      let gamer = world.getEntity(deceased.getDynamicProperty("bw:gardener"));
      
      if (gamer?.getDynamicProperty("bw:faeryGame") && gamer.id == player?.id) {
        let faeryWager = JSON.parse(gamer.getDynamicProperty("bw:faeryGame"));
        if (faeryWager.gameId == "helpful_gardener") {
          if (faeryWager.planted < faeryWager.harvested) {
            faeryWager.harvested = faeryWager.harvested - 1;
            let growth = CROP_GROWTH[faeryWager.cropType];
            
            let growthObj = {}
            growthObj[growth.state] = growth.value;
            
            let loot = world.getLootTableManager().generateLootFromBlockPermutation(BlockPermutation.resolve(faeryWager.cropType, growthObj));
            
            for (let l of loot) {
              player.dimension.spawnItem(l, deceased.location);
            }
            
            gamer.sendMessage("§a[!]§r A Pest has been exterminated. A harvest has been made.");
            gamer.setDynamicProperty("bw:faeryGame", JSON.stringify(faeryWager));
            player.playSound("mob.vex.death", {pitch: 0.8});
          }
          
          if (faeryWager.planted == 0 && faeryWager.harvested == 0) {
            let faery = findFaery(faeryWager.faeryId);
            gamer.playSound("random.levelup");
            gamer.sendMessage(`§a[!]§r You won your wager against §g${faery.name}§r! Maybe it was not fairly, but it certainly was squarely.`);
            addFaery(gamer, faery);
            gamer.setDynamicProperty("bw:faeryGame", undefined);
            return;
          }
        }
      }
    }
  }
});

// Flower Picking
world.afterEvents.entityItemPickup.subscribe(event => {
  const player = event.entity;
  const item = event.items[0];
  
  if (player?.isValid) {
    if (player.getDynamicProperty("bw:faeryGame") != undefined) {
      let faeryWager = JSON.parse(player.getDynamicProperty("bw:faeryGame"));
      if (faeryWager.gameId == "flower_picking") {
        let broken = false;
        
        if (ALL_VALID_FLOWERS.includes(item.typeId)) {
          let i = faeryWager.currentIndex;
          let flower = faeryWager.flowerArray[i];
          
          if (flower == item.typeId || (ARRAY_FLOWERS[flower] != undefined && ARRAY_FLOWERS[flower].includes(item.typeId))) {
            faeryWager.currentIndex = faeryWager.currentIndex + 1;
            
            player.sendMessage(`§a[!]§r Flower #${faeryWager.currentIndex} has been collected!`);
            
            player.playSound("random.levelup");
          } else {
            player.sendMessage(`§c[!]§r An incorrect flower was collected.`);
            player.playSound("random.anvil_land");
            
            broken = true;
          }
        }
        
        
        if (faeryWager.currentIndex == 9) {
          let faery = findFaery(faeryWager.faeryId);
          player.playSound("random.levelup");
          player.sendMessage(`§a[!]§r You won your wager against §g${faery.name}§r! Maybe it was not fairly, but it certainly was squarely.`);
          addFaery(player, faery);
          player.setDynamicProperty("bw:faeryGame", undefined);
          return;
        }
        
        if (broken) {
          if (!faeryWager.lenience) {
            player.sendMessage(`As mandated, you must begin again.`);
            faeryWager.currentIndex = 0;
          } else {
            player.sendMessage(`A honey drink has lightened the consequence, and so your progress is preserved.`);
            faeryWager.lenience = false;
          }
        }
        player.setDynamicProperty("bw:faeryGame", JSON.stringify(faeryWager));
      }
    }
  }
});

// If the player dies, sometimes the game ends.
world.afterEvents.playerSpawn.subscribe(death => {
  let player = death.player;
  
  if (!death.initialSpawn && player?.getDynamicProperty("bw:faeryGame") != undefined) {
    let faeryWager = JSON.parse(player.getDynamicProperty("bw:faeryGame"));
    if (faeryWager.gameId == "joyful_frolick") {
      player.sendMessage(`§c[!]§r You've died. You've lost. Now, you must uphold your Bargain.`);
      lostWager(player);
      player.setDynamicProperty("bw:faeryGame", undefined);
    }
  }
});


// If the player joins and the days are not the same, the Fae will shift the days in the name of fairness (it is unfair but you started it).
world.afterEvents.playerJoin.subscribe(j => {
  let player = j.player;
  
  if (player?.getDynamicProperty("bw:faeryGame") != undefined) {
    let faeryWager = JSON.parse(player.getDynamicProperty("bw:faeryGame"));
    if (faeryWager.currentDay != world.getDay()) {
      // Get Day Difference
      let dayDiff = faeryWager.finishDay - faeryWager.currentDay;
      // Reset Days to match current day scheme
      faeryWager.currentDay = world.getDay();
      faeryWager.finishDay = world.getDay() + dayDiff;
      // Set Faerie Game time
      player.setDynamicProperty("bw:faeryGame", JSON.stringify(faeryWager));
    }
  }
});