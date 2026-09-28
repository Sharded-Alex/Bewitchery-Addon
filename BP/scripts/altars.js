/* jshint maxerr: 10000 */
import { world, system, ItemStack, Player, BlockFluidContainerComponent, GameMode, FluidType, MolangVariableMap } from "@minecraft/server";
import { randomize } from "./castRitual.js";
import { herbDistil } from "./potionCrafting.js";
import { validCandles, diceRoll } from "./occultMagick.js";
import { findCustomReagent } from "./consumePotion.js";
import { lesserFae, greaterFae, medianFae, convertFaeName } from "./lesserFaerie.js";
import { Vector3, Random } from "./VectorMath/index.js";
import { triggerDwarvoneStructure } from "./faerieAbilities.js";
import { getFaery, hasFaery, getFaeries, findFaery, addFaery, addFaeryTrust, greaterOpposition, updateOfferedFaerie } from "./castRitual.js";

// Secrets about the Fae
const lesserSecrets = [
  {
    "regarding": undefined,
    "txt": `Spell Glyphs are fragments of our aspects symbolized.`
  },
  {
    "regarding": undefined,
    "txt": `Spell Weaving is an elaborate ritual only documented through writing. However, it is truly magical when performed properly.`
  },

  {
    "regarding": undefined,
    "txt": `The Self Spell Glyph goes like this: DoLe -> DoRi -> UpRi -> UpLe -> UpRi.`
  },
  {
    "regarding": undefined,
    "txt": `The Bubble Spell Glyph goes like this: DoRi -> DoLe -> DoRi -> DoLe -> UpLe -> UpRi.`
  },
  {
    "regarding": undefined,
    "txt": `The Touch Spell Glyph goes like this: DoRi -> DoLe -> DoRi -> DoLe -> DoRi.`
  },
  {
    "regarding": undefined,
    "txt": `The Bolt Spell Glyph goes like this: UpLe -> DoLe -> UpLe -> DoLe -> DoRi -> UpRi.`
  },
  {
    "regarding": undefined,
    "txt": `The Missile Spell Glyph goes like this: DoLe -> UpLe -> DoLe -> UpLe -> UpRi -> DoRi.`
  },

  {
    "regarding": undefined,
    "txt": `Severing Bonds with us can go well, but it might be a spit in the face to those above us.`
  },
  {
    "regarding": undefined,
    "txt": `There are three levels of Faeries: Lesser, Median and Greater in that same order.`
  },
  {
    "regarding": undefined,
    "txt": `Scrying needs an Amethyst Nugget to see the secrets in other places.`
  },
  {
    "regarding": undefined,
    "txt": `There are whispers of ancient hexes scattered in books across the deserts. Currently, it is simply rumours.`
  },
  {
    "regarding": undefined,
    "txt": `A blazing campfire is what us Lessers do like\nBut candles and altars are loved by those up high.\nA candle of 1 tells a Median hi,\nA candle of more draws Greater sights.`
  },
  {
    "regarding": undefined,
    "txt": `The aspects on a Wand reduce spell costs. I'm sure this works for rituals as well.`
  },

  // Dryas
  {
    "regarding": "dryas",
    "txt": `The altar of the {...} may be built with a Green Candle and Saplings.`
  },
  {
    "regarding": "dryas",
    "txt": `The {...} accept anything compostable so that they may return it to the land.`
  },
  {
    "regarding": "dryas",
    "txt": `The {...} are enemies of lumberjacks, and there are many stories of these individuals being afflicted with the deadliest of diseases.`
  },
  {
    "regarding": "dryas",
    "txt": `The {...} are very involved in the lives of the Witches that make contact with them. Take care in your actions against them.`
  },

  // Vitalia
  {
    "regarding": "vitalia",
    "txt": `The altar of the {...} may be built with a Yellow Candle and Gold.`
  },
  {
    "regarding": "vitalia",
    "txt": `The {...} is humble but make a large fuss over gold. As a result, it is the offering you must carry when seeking their attention.`
  },
  {
    "regarding": "vitalia",
    "txt": `The {...} is a peace loving Median Faerie, but they have a strong dislike for the undead.`
  },
  {
    "regarding": "vitalia",
    "txt": `The {...} have a strong sense of justice, and those of their kin that harm innocents usually have a hard time stirring healing and benevolent powers.`
  },

  // Brownie
  {
    "regarding": "brownie",
    "txt": `The altar of the {...} may be built with a Orange Candle and Cake.`
  },
  {
    "regarding": "brownie",
    "txt": `Milk and honey and cake and cookies, that is what the {...} adores. Gold and amethyst, diamonds and emeralds; the {...} dislike them as much as iron.`
  },
  {
    "regarding": "brownie",
    "txt": `The {...} is the relaxed kind, though those who intentionally wrong them have their belongings shift and stir.`
  },
  {
    "regarding": "brownie",
    "txt": `The {...}'s blessings are some of the best! A good night's rest under their hand is very likely to get rid of Fatigue.`
  },

  // Dwarvone
  {
    "regarding": "dwarvone",
    "txt": `The altar of the {...} may be built with a Gray Candle and Stone/Deepslate.`
  },
  {
    "regarding": "dwarvone",
    "txt": `The {...} is quite content with what he has, but offerings of amethyst, gold, redstone dust and emeralds are always welcome within his treasury.`
  },
  {
    "regarding": "dwarvone",
    "txt": `The {...} does not concern himself with actions. Only through offerings can you gain his Trust.`
  },
  {
    "regarding": "dwarvone",
    "txt": `The {...} gives his witches power through terracotta. It might not be much now but his will could always change.`
  },

  // Genis
  {
    "regarding": "genis",
    "txt": `Under the cover of night, Conceal's shadow lengthens even without the touch of light.\n§a[This is a Correspondence!]§r`
  },
  // Chlorophae
  {
    "regarding": "chlorophae",
    "txt": `Under Father Sun, our magical Growth is more effective. But as we lie in Mother Moon's embrace, its power wanes along with our conciousness. \n§a[This is a Correspondence!]§r`
  },
  // Aerial
  {
    "regarding": "aerial",
    "txt": `Storms and lightning we dance within, so Bubble and Gust expand in width.\n§a[This is a Correspondence!]§r`
  },
  // Avistrum
  {
    "regarding": "avistrum",
    "txt": `Obviously Shock's effectiveness increases in Thunderstorms. I'd have thought it was obvious.\n§a[This is a Correspondence!]§r`
  },
  // Iceling
  {
    "regarding": "iceling",
    "txt": `Under Mother Moon, Frost becomes just a bit more powerful. Specifically, where damage and the chance of slowing are concerned.\n§a[This is a Correspondence!]§r`
  },
  {
    "regarding": "iceling",
    "txt": `When Mother Moon fully shows her face, Frost gains much power.\n§a[This is a Correspondence!]§r`
  },
  // Wildfyre
  {
    "regarding": "wildfyre",
    "txt": `Under my Lord's Sun, Ignite is naturally stronger.\n§a[This is a Correspondence!]§r`
  },
  {
    "regarding": "wildfyre",
    "txt": `When the weather is clear, Ignite is best. When the weather is stormy, Ignite sputters just a bit.\n§a[This is a Correspondence!]§r`
  },

];
const medianSecrets = [
  // Titania
  {
    "regarding": "titania",
    "txt": `The altar of the {...} may be built with Lime Candles and nature-esque blocks.`
  },
  {
    "regarding": "titania",
    "txt": `The {...} adores resin clumps and the seeds of ancient times.`
  },
  // Dryas
  {
    "regarding": "dryas",
    "txt": `At 50%% Trust, I will grant you Speed II whenever an offering is made. This will surely aid you on your journeys.`
  },
  {
    "regarding": "dryas",
    "txt": `At 20%% Trust and higher, those that attack my Witch is afflicted with deadly poisons. The more trust there is between us, the more potent this poison becomes.`
  },
  {
    "regarding": "dryas",
    "txt": `At 75%% Trust, when conjuring Apples through §4Apple§r, you may chance upon a §gGolden Apple§r. Naturally, there is a low chance of this happening.`
  },
  {
    "regarding": "dryas",
    "txt": `As the Trust between us grows, the §4Apple§r spell conjures apples more frequently. This is my blessing to you.`
  },
  // Vitalia
  {
    "regarding": "vitalia",
    "txt": `At 60%% Trust and higher, I may feel charitable enough to pay off some of your Faerie Debts when an offering is made to me. Through me, we are humble servants of the Spring Mother so it is only natural.`
  },
  // Hebaya
  {
    "regarding": "hebaya",
    "txt": `The altar of the {...} may be built with Purple Candles and Blackstone/Obsidian blocks.`
  },
  {
    "regarding": "hebaya",
    "txt": `The {...} likes to recieve amethyst shards, nether stars, raw orbos and echo shards.`
  },
  // Brownie
  {
    "regarding": "brownie",
    "txt": `At 70%% Trust and higher, I will ensure you recieve a good night's rest (when you have luxury to get one). Fatigue will vanish and negative effects will fade into Nowhere, leaving you healthy and refreshed!`
  },
  {
    "regarding": "brownie",
    "txt": `At 35%% Trust and higher, if you have a Wand, your hearth, your home, can never be lost. Simply by charging, you will see my helpful trail, and, at the end, the place you call your spawn awaits.`
  },
  // Oberon
  {
    "regarding": "oberon",
    "txt": `The altar of the {...} may be built with Orange Candles and Sunflowers.`
  },
  {
    "regarding": "oberon",
    "txt": `The {...} is an enjoyer of honey bottles, apples and bread. A humble offering to the humble Summer.`
  },
  // Dwarvone
  {
    "regarding": "dwarvone",
    "txt": `At 35%% Trust and higher, an offering to me will give you Haste. May your mining be fruitful, young one.`
  },
  {
    "regarding": "dwarvone",
    "txt": `At 60%% Trust and higher, you may draw upon my arts to use Terracotta Magick. You may have already seen them in my whispers. Do understand that these require Terracotta and Natural Ash.`
  },
];
const greaterSecrets = [
  // Titania
  {
    "regarding": "titania",
    "txt": `Mystic Condensation carries a special significance for my Witches. Along with §dRaw Orbos§r, §dOrbos Honeycombs§r may follow.`
  },
  {
    "regarding": "titania",
    "txt": `There is a method within Primal Alchemy & You that creates an Orbic substance that rids the drinker of Fatigue.`
  },
  {
    "regarding": "titania",
    "txt": `By looking at plant-life, flowers, grass, etc while absorbing Orbos, Orbos may be pulled from them. Much like a bee searching a plant for nectar.`
  },
  // Hebaya
  // Candle Infusion
  // Not Done
  {
    "regarding": "hebaya",
    "txt": `Wax is a kind of correspondence to you, my alchemist. With a lit candle's presence at the four immediate corners of the Cauldron, you may pull on their chromatic influences to increase the durations of certain potion effects at the time of bottling.`
  },
  // Alchemical Dreams
  {
    "regarding": "hebaya",
    "txt": `While I do not hold dominion over Dreams (that is the work of Lady Moon), I do offer dream advice to my witches that need aid in the appraisal of reagents. Simply hold unto the item before you sleep. By the time you wake in the morning, you will recieve a paper with the Primary Effects it holds.\n\nSimply ensure that either the item is an official reagent or one that has birthed mystical effects while within the Cauldron.`
  },
  // Candle Substitution
  {
    "regarding": "hebaya",
    "txt": `A neat little perk of being a witch under my patronage is the ability to substitute white chalk inscribed runic slates with lit candles. I always expect colorful ceremonial spaces from my witches. Do not disappoint me.`
  },
  // Oberon
  // Put these in the ritual book
  {
    "regarding": "oberon",
    "txt": `My child, there are ways to bind your woven spells into a trinket; something that can be used as to your advantage in battles. After all, no one expects a Shear to conjure a lightning bolt!\n§a[Check the Ceremonialis Adeptus. There may be a new ritual there...]§r`,
    "addTag": "bw:oberon_trinkets"
  },
  {
    "regarding": "oberon",
    "txt": `All weapons are a conduit. All things with durability are weapons. Here is a little ceremonial trick to bind spells to these weapons, both by creation and by situation.\n§a[Check the Ceremonialis Adeptus. There may be a new ritual there...]§r`,
    "addTag": "bw:oberon_weapons"
  },
  {
    "regarding": "oberon",
    "txt": `Armors are meant to protect. Some spells are also meant to protect. When combined, they could become a powerful force. Here is a ritual that may help you.\n§a[Check the Ceremonialis Adeptus. There may be a new ritual there...]§r`,
    "addTag": "bw:oberon_armor"
  },
  {
    "regarding": "oberon",
    "txt": `Strange Potions are a strange kind of liquor, but it is Faerie Liquor. All Faerie Liquor is within my dominion and I do like mine well fermented. Let me teach you a little secret...\n§a[Check the Ceremonialis Adeptus. There may be a new ritual there...]§r`,
    "addTag": "bw:oberon_barrel"
  },
];

function tellLesserSecret(court, fae) {
  let medians = [];
  let validSecrets = [];
  for (let med of Object.values(medianFae)) {
    if (med.minorCourt == court) {
      medians.push(med);
    }
  }
  let medianChosen = medians[Math.floor(Math.random() * medians.length)];

  for (let secret of lesserSecrets) {
    if (secret.regarding == undefined || secret.regarding == medianChosen?.id || secret.regarding == fae) {
      validSecrets.push(secret);
    }
  }

  let chosenTxt = validSecrets[Math.floor(Random.Range(0, validSecrets.length))].txt;

  if (medianChosen != undefined) {
    let chosenTitle = medianChosen.titles[Math.floor(Math.random() * medianChosen.titles.length)];

    chosenTxt = chosenTxt.replaceAll("{...}", `${medianChosen.theme}${chosenTitle}§r`);
  }

  return chosenTxt;
}
function tellMedianSecret(court, fae) {
  let greater = undefined;
  let validSecrets = [];
  for (let f of Object.values(greaterFae)) {
    if (f.name == court) {
      greater = f;
    }
  }

  for (let secret of medianSecrets) {
    if (secret.regarding == undefined || secret.regarding == greater?.id || secret.regarding == fae) {
      validSecrets.push(secret);
    }
  }

  let chosenTxt = validSecrets[Math.floor(Random.Range(0, validSecrets.length))].txt;

  if (greater != undefined) {
    let chosenTitle = greater.titles[Math.floor(Math.random() * greater.titles.length)];

    chosenTxt = chosenTxt.replaceAll("{...}", `${greater.nameColor}${chosenTitle}§r`);
  }

  return chosenTxt;
}

function tellGreaterSecret(witch, fae) {
  let greater = undefined;
  let validSecrets = [];
  for (let f of Object.values(greaterFae)) {
    if (f.id == fae) {
      greater = f;
    }
  }

  for (let secret of greaterSecrets) {
    if (secret.regarding == undefined || secret.regarding == greater.id) {
      validSecrets.push(secret);
    }
  }

  let chosenStuffs = validSecrets[Math.floor(Random.Range(0, validSecrets.length))];
  let chosenTxt = chosenStuffs.txt;

  if (greater != undefined) {
    let chosenTitle = greater.titles[Math.floor(Math.random() * greater.titles.length)];


    chosenTxt = chosenTxt.replaceAll("{...}", `${greater.nameColor}${chosenTitle}§r`);

  }

  if (chosenStuffs.addTag != undefined) {
    witch.addTag(chosenStuffs.addTag);
  }
  return chosenTxt;
}

function payOffFaeDebt(player) {
  let faePosessions = player.getDynamicPropertyIds().filter(x => x.startsWith("bwPossess:"));
  if (faePosessions.length > 0) {
    for (let possession of faePosessions) {
      let property = player.getDynamicProperty(possession);
      if (property > 1) {
        player.setDynamicProperty(possession, undefined);
      } else {
        player.setDynamicProperty(possession, property - 1);
      }
    }
    player.sendMessage("Some (if not all) of the Faerie Debts that bind you have been repaid.")
  } else {
    return;
  }
}

export function verifyLesser(witch, fae) {
  let witchFae = witch.getDynamicProperty("bw:lessers");
  if (witchFae != undefined) {
    witchFae = JSON.parse(witchFae);
  } else {
    witchFae = [];
  }

  if (witchFae.includes(fae)) {
    return true;
  } else {
    return false;
  }
}
export function verifyMedian(witch, median) {
  let witchMedians = witch.getDynamicProperty("bw:medians");
  if (witchMedians != undefined) {
    witchMedians = JSON.parse(witchMedians);
  } else {
    witchMedians = [];
  }

  if (witchMedians.includes(median)) {
    return true;
  } else {
    return false;
  }
}
export function verifyPatron(witch, patron) {
  let witchPatrons = witch.getDynamicProperty("bw:patrons");
  if (witchPatrons != undefined) {
    witchPatrons = JSON.parse(witchPatrons);
  } else {
    witchPatrons = [];
  }

  if (witchPatrons.includes(patron)) {
    return true;
  } else {
    return false;
  }
}

export function doCourtCheck(witch, candleAmount, faerie) {
  let noConflict = true;
  let patronList = getFaeries(witch).filter((e) => {
    if (e.rank == "greater") {
      return e;
    }
  });

  if (candleAmount == 0) {
    let faeList = getFaeries(witch).filter((e) => {
      if (e.rank == "median") {
        return e;
      }
    });

    let faerieSuperior = greaterFae[convertFaeName(medianFae[faerie].minorCourt)];
    if (faeList.length > 0) {
      if (faerieSuperior != undefined) {
        let mediator = false;
        medFaeLoop: for (let f of faeList) {
          let superior = convertFaeName(medianFae[f.id].minorCourt);

          if (greaterOpposition(witch, superior)) {
            noConflict = false;
          }
        }
      }
    }
  } else {
    let greaterFae = greaterFae[faerie];

    if (greaterOpposition(witch, greaterFae)) {
      noConflict = false;
    }
  }
  return noConflict;
}

async function checkAltar(location, dimension, fae) {
  let rulingFaerie = {};
  // Add the contesting fae to an object
  for (let f of fae) {
    rulingFaerie[f] = 0;
  };
  if (fae != undefined && fae.length > 0) {
    let newlocation = Vector3.subtract(location, {
      x: 1,
      y: 1,
      z: 1
    });
    for (let fae of Object.keys(rulingFaerie)) {
      for (let x = newlocation.x; x < location.x + 2; x++) {
        for (let y = newlocation.y; y < location.y + 2; y++) {
          for (let z = newlocation.z; z < location.z + 2; z++) {
            let currentBlock = dimension.getBlock({ x: x, y: y, z: z });
            // currentBlock.dimension.spawnParticle("minecraft:basic_flame_particle", currentBlock.center())
            let faery = medianFae[fae];
            if (faery == undefined) {
              faery = greaterFae[fae];
            }
            for (let color of faery.sacredColor) {
              if (currentBlock.typeId.includes(color)) {
                rulingFaerie[fae] = rulingFaerie[fae] + 1;
              }
            }
            if (faery.altarBlocks.includes(currentBlock.typeId)) {
              rulingFaerie[fae] = rulingFaerie[fae] + 1;
            }
          }
        }
      }
    }
  }

  if (Object.keys(rulingFaerie).length > 0) {
    let sortedList = [];
    for (let [key, value] of Object.entries(rulingFaerie)) {
      sortedList.push([key, value]);
    }

    sortedList = sortedList.sort((a, b) => {
      return b[1] - a[1]
    });
    return sortedList[0][0];
  } else {
    return undefined;
  }
}


// Make this time sensitive for those the Faerie do not favor.
async function seeCandleCenter(candleType, candleAmount) {
  let potentialFae = [];

  if (candleAmount == 0) {
    for (let [fae, behavior] of Object.entries(medianFae)) {
      for (let color of behavior.sacredColor) {
        if (candleType.includes(color) && !potentialFae.includes(behavior.id)) {
          potentialFae.push(behavior.id);
        }
      }
    }
  } else {
    for (let [fae, behavior] of Object.entries(greaterFae)) {
      for (let color of behavior.sacredColor) {
        if (candleType.includes(color) && !potentialFae.includes(behavior.id)) {
          potentialFae.push(behavior.id);
        }
      }
    }
  }
  return potentialFae;
}

function savorOffering(reagentType, reagentAmount, faery) {
  if (reagentAmount > 16) {
    reagentAmount = 16;
  }
  let gatheredTrust = 0;
  let reagent = herbDistil(reagentType);
  if (reagent != null) {
    if (reagent.modify == undefined) {
      let spectrum = [];
      Object.values(reagent.primaryEffects).forEach((e) => {
        spectrum.push(e.effect);
      });
      for (let e of spectrum) {
        if (faery.offerings.likedTastes.includes(e)) {
          gatheredTrust = gatheredTrust + faery.baseTrustIncrease * reagentAmount;
        }

        if (faery.offerings.dislikedTastes.includes(e)) {
          gatheredTrust = gatheredTrust - faery.baseTrustIncrease * reagentAmount;
        }
      }
    } else {
      return "null";
    }
  } else {
    return "null";
  }

  console.warn("Trust: " + gatheredTrust);
  return gatheredTrust;

}

function augmentByTime(num, timeRange) {
  let moddedNum = num;
  if (timeRange.start > timeRange.end) {
    if (world.getTimeOfDay() >= timeRange.start || world.getTimeOfDay() <= timeRange.end) {
      moddedNum = Number(Number(moddedNum * 3).toFixed(1));
    }
  } else {
    if (world.getTimeOfDay() >= timeRange.start && world.getTimeOfDay() <= timeRange.end) {
      moddedNum = Number(Number(moddedNum * 3).toFixed(1));
    }
  }
  return moddedNum;
}

system.beforeEvents.startup.subscribe(spellEvent => {
  spellEvent.itemComponentRegistry.registerCustomComponent('bw:offering_dust', {
    onUseOn: async e => {
      let player = e.source;
      let block = e.block;
      const playerInv = player.getComponent('minecraft:inventory').container;
      let offering = block.dimension.getEntitiesAtBlockLocation(block.center()).filter(e => {
        if (e.getComponent("minecraft:item")) {
          return e;
        }
      })[0];
      let offeredItem;
      if (offering != undefined) {
        offeredItem = offering.getComponent("minecraft:item").itemStack;
      }
      let item = e.itemStack;

      if (validCandles.includes(block?.typeId) && block?.permutation?.getState("lit")) {

        // Get Faerie from the Altar
        let foundFaerie = await checkAltar(block.location, block.dimension, await seeCandleCenter(block.typeId, block.permutation.getState("candles")));

        // If no faerie is found, return
        if (foundFaerie == undefined) {
          return;
        }

        // Get Faerie Info
        let faeryInfo = medianFae[foundFaerie];
        if (faeryInfo == undefined) {
          faeryInfo = greaterFae[foundFaerie];
        }

        let title = faeryInfo.titles[Math.floor(faeryInfo.titles.length * Math.random())];
        let offereeData = {};

        // Check if Faerie is apart of team;
        if (!hasFaery(player, faeryInfo)) {
          // Check Faerie Subordinates
          let subs = faeryInfo.subFaeries;
          let isRecommended = false;
          let isAllowed = false;
          for (let sub of subs) {
            let subFae = findFaery(sub);
            if (subFae != undefined && hasFaery(player, subFae)) {
              subFae = getFaery(player, subFae);
              if (!isRecommended) {
                if (faeryInfo.standing == "median" && subFae.trust == 100) {
                  isRecommended = true;
                }

                if (faeryInfo.standing == "greater" && subFae.trust >= 80) {
                  isRecommended = true;
                }
              }
            }
          }

          if (isRecommended) {
            let hasRival = false;
            let compatible = doCourtCheck(player, block.permutation.getState("candles"), foundFaerie);

            // Check Compatibility
            // Check Rivals

            if (faeryInfo.standing == "median") {
              for (let r of faeryInfo.relations) {
                if (!r.isLiked) {
                  hasRival = true;
                  break;
                }
              }

              if (!hasRival && !compatible) {
                if (diceRoll(1, 100, true) == 5) {
                  isAllowed = true;
                }
              }

              if (hasRival && compatible) {
                if (diceRoll(1, 100, true) <= 35) {
                  isAllowed = true;
                }
              }

              if (!hasRival && compatible) {
                isAllowed = true;
              }
            }

            if (faeryInfo.standing == "greater") {
              if (compatible) {
                isAllowed = true;
              }
            }
          } else {
            player.sendMessage(`§c[-]§r There is a method to your madness; however, none of the necessary Faeries have vouched for you. Your attempt is futile, for now.`);
            return;
          }

          if (!isAllowed) {
            // There are despised Faeries among the player's Family
            player.sendMessage(`§c[-]§r If your attempt has reached this Faerie, it cannot or will not answer. Perhaps you have connections they despise (or MUST despise) among your Family.`);
            return;
          } else {
            // The Faerie answer
            player.playSound("beacon.power", {
              pitch: 0.3
            });
            player.playSound("mob.allay.idle", {
              pitch: 1.8
            });
            player.sendMessage(`§a[-]§r You have caught the interest of a powerful Faerie. ${faeryInfo.theme}The ${title}§r has spared you a thought. You would be wise to use it well.`);
            addFaery(player, faeryInfo);
            faeryInfo.responses.pleased(player, block);
            return;
          }
        } else {
          offereeData = getFaery(player, faeryInfo);
        }

        // If no item offering, nothing happens.
        if (offering == undefined || offeredItem == undefined) {
          return;
        }


        // Process Reagent to Fae Tastes
        // This will give a trust value;
        findCustomReagent(offeredItem);
        let offeringTaste = savorOffering(offeredItem.typeId, offeredItem.amount, faeryInfo);

        if (offeringTaste != "null") {
          let currentDay = world.getDay();
          if (offereeData.lastOffering != "") {
            if (currentDay == offereeData.lastOffering) {
              return player.sendMessage(`§c[!]§r An offering has already been made to this Faerie today.`)
            }
          }

          if (faeryInfo.standing == "median") {
            let thisOffer = offereeData.lastOffer;

            if (thisOffer == offeredItem.typeId) {
              // Allay Laughing
              player.playSound("mob.allay.idle", {
                pitch: 0.15
              });
              player.sendMessage("§d[!]§r You get the impression that this offering is being viewed as... stale.");
              faeryInfo.responses.unsure(player, block);
            } else
              if (offeringTaste > 1.0) {
                // Accepted Offering Sounds
                player.playSound("mob.allay.idle", {
                  pitch: 0.3 + Math.random()
                });
                player.playSound("mob.allay.idle", {
                  pitch: 0.3 + Math.random()
                });
                player.playSound("mob.allay.idle", {
                  pitch: 0.3 + Math.random()
                });

                if (diceRoll(1, 20, true) > 16) {
                  thisOffer = offeredItem.typeId;
                } else {
                  thisOffer = "";
                }
                faeryInfo.responses.pleased(player, block);

                // Offering Effects
                let playerFae = getFaery(player, faeryInfo);
                faeryInfo.offeringEffects(player, block, playerFae.trust);
              } else
                if (offeringTaste < -1.0) {
                  // Insert Sound
                  // Vex Wailing
                  if (faeryInfo.punishments) {
                    faeryInfo.punishments[Math.floor(Math.random() * faeryInfo.punishments.length)](player);
                  }

                  thisOffer = offeredItem.typeId;
                  faeryInfo.responses.displeased(player, block);
                } else {
                  // Insert Sound
                  if (diceRoll(1, 20, true) > 10) {
                    thisOffer = offeredItem.typeId;
                  } else {
                    thisOffer = "";
                  }
                  faeryInfo.responses.unsure(player, block);
                }

            // 
            // Offering vanishes into smoke.
            block.dimension.spawnParticle("rituals:smokeDisappear", offering.location);
            offering.kill();

            // Use offering dust
            if (item.amount > 1) {
              item.amount--;
            } else {
              item = undefined;
            }

            // Increase Fae Trust
            addFaeryTrust(player, faeryInfo, offeringTaste);
            updateOfferedFaerie(player, faeryInfo, currentDay, thisOffer);
          }

          // Include Greater Fae too

          // Use Dist
          player.getComponent("inventory").container.setItem(player.selectedSlotIndex, item);
        }

      }
    }
  });

  spellEvent.itemComponentRegistry.registerCustomComponent('bw:dwarvone_dust', {
    onUseOn: e => {
      let player = e.source;
      let block = e.block;

      if (block.typeId == "minecraft:hardened_clay" || block.typeId.includes("terracotta")) {

        let medianFaeries = player.getDynamicProperty("bw:medians");
        if (medianFaeries != undefined) {
          medianFaeries = JSON.parse(medianFaeries)
        } else {
          medianFaeries = []
        }
        let patronFaeries = player.getDynamicProperty("bw:patrons");
        if (patronFaeries != undefined) {
          patronFaeries = JSON.parse(patronFaeries)
        } else {
          patronFaeries = []
        }

        // All Medians & Greater Patrons boons at varying levels of trust.
        let allFae = medianFaeries.concat(patronFaeries);

        if (allFae.includes("dwarvone")) {
          try {
            let faerie = JSON.parse(player.getDynamicProperty(`bw:dwarvone`));
            let trustLevels = faerie.trust;

            if (trustLevels >= 60) {
              triggerDwarvoneStructure(player, block)
            }
          } catch (e) {
            return;
          }
        }
        if (item.amount > 1) {
          item.amount--
        } else {
          item = undefined;
        }
        player.getComponent("inventory").container.setItem(player.selectedSlotIndex, item);
      }
    }
  });

  spellEvent.itemComponentRegistry.registerCustomComponent('bw:lesser_fae_offering', {
    onUseOn: e => {
      const player = e.source;
      const block = e.block;
      const dim = player.dimension;
      const heldItem = e.itemStack;

      if (block?.typeId == "minecraft:campfire") {
        // Find Reagent
        let foundReagent = undefined;
        let foundReagentName = undefined;
        // Store items to vanish in style later
        let itemEnts = [];
        // Store item amount
        let itemAmt = 0;
        dim.getEntities({ location: block.center(), maxDistance: 3, type: "minecraft:item", closest: 1 }).forEach((e) => {
          let i = e.getComponent("minecraft:item").itemStack;
          if (foundReagent != undefined) {
            if (foundReagentName == i.typeId) {
              itemEnts.push(e);
              itemAmt = itemAmt + i.amount;
            }
            return;
          }
          findCustomReagent(i);
          let reagent = herbDistil(i.typeId);
          if (reagent != null) {
            if (reagent.modify == undefined) {
              foundReagent = reagent;
              foundReagentName = i.typeId;
              itemEnts.push(e);
              itemAmt = itemAmt + i.amount;
            }
          }
        });

        if (itemAmt > 8) {
          itemAmt = 8;
        }

        // Get Fae in the Grimoire
        let spiritEntry = heldItem.getDynamicProperty("bw:attunedFaerie");
        if (spiritEntry != undefined) {
          spiritEntry = findFaery(spiritEntry);
        }

        if (foundReagent != undefined && spiritEntry != undefined) {
          // Ensure the offerer knows the offeree
          if (spiritEntry.standing == "lesser" && hasFaery(player, spiritEntry)) {
            // Get Faerie Trust Info
            let playerFae = getFaery(player, spiritEntry);
            // Get reagent taste
            let offeringTaste = savorOffering(foundReagentName, itemAmt, spiritEntry);
            let likedFae = [];
            let dislikedFae = [];
            // If taste is not undefined
            if (offeringTaste != "null") {
              let thisOffer = playerFae.lastOffer;
              let msgs = spiritEntry.responses;
              let currentDay = world.getDay();
              if (playerFae.lastOffering != "") {
                if (currentDay == playerFae.lastOffering) {
                  return player.sendMessage(`§c[!]§r An offering has already been made to this Faerie today.`)
                }
              }

              // Increase by x1.5 if at the correct time
              offeringTaste = augmentByTime(offeringTaste, spiritEntry.favoredHours);
              // Items get vanished
              itemEnts.forEach((e) => {
                if (e.isValid) {
                  dim.spawnParticle("rituals:smokeDisappear", e.location);
                  e.remove();
                }
              })

              // Offerings are processed
              console.warn(thisOffer)
              console.warn(foundReagentName)
              if (thisOffer == foundReagentName) {
                // Allay Laughing
                player.playSound("mob.allay.idle", {
                  pitch: 0.15
                });
                player.sendMessage(spiritEntry.theme + msgs.unsure.msg + "§r")
                player.sendMessage("(#) You get the impression that this offering is being viewed as... stale.");
                offeringTaste = 0.0;
              } else
                // Liked
                if (offeringTaste > 1.0) {
                  if (diceRoll(1, 20, true) < 16) {
                    thisOffer = foundReagentName;
                  } else {
                    thisOffer = "";
                  }
                  player.sendMessage(spiritEntry.theme + msgs.pleased.msg + "§r");
                  if (msgs.pleased.consequence != undefined) {
                    let faeAct = randomize(msgs.pleased.consequence);
                    faeAct(player);
                  }
                } else
                  // Disliked
                  if (offeringTaste < -1.0) {
                    player.sendMessage(spiritEntry.theme + msgs.displeased.msg + "§r")
                    thisOffer = foundReagentName;
                    if (msgs.displeased.consequence != undefined) {
                      let faeAct = randomize(msgs.displeased.consequence);
                      faeAct(player);
                    }
                  } else {
                    if (diceRoll(1, 20, true) < 10) {
                      thisOffer = foundReagentName;
                    } else {
                      thisOffer = "";
                    }
                    player.sendMessage(spiritEntry.theme + msgs.unsure.msg + "§r")
                    if (msgs.unsure.consequence != undefined) {
                      let faeAct = randomize(msgs.unsure.consequence);
                      faeAct(player);
                    }
                  } // Unsure

              // Change Fae Trust
              addFaeryTrust(player, spiritEntry, offeringTaste);
              // Update Offering stuff
              updateOfferedFaerie(player, spiritEntry, currentDay, thisOffer);

              // Rivalries
              // Add a chance
              if (spiritEntry.relations) {
                for (let f of spiritEntry.relations) {
                  let relatedFae = findFaery(f.faerie);

                  if (relatedFae == undefined) {
                    continue;
                  }

                  if (f.isLiked) {
                    if (hasFaery(player, relatedFae)) {
                      likedFae.push(relatedFae)
                    }
                  } else {
                    if (hasFaery(player, relatedFae)) {
                      dislikedFae.push(relatedFaerie)
                    }
                  }
                }
              }
            }

            if (likedFae.length > 0) {
              player.sendMessage("§d[!!!]§r A few of this Faerie's acquaintances have opinions on this offering...");
              for (let entry of likedFae) {
                addFaeryTrust(player, entry, (offeringTaste / 2));
              }
            }

            if (dislikedFae.length > 0) {
              player.sendMessage("§d[!!!]§r A few of this Faerie's rivals have opinions on this offering...");
              for (let entry of dislikedFae) {
                addFaeryTrust(player, entry, (offeringTaste / 2) * -1);
              }
            }
          }
        }
      }
    }
  });

  spellEvent.itemComponentRegistry.registerCustomComponent('bw:trigger_alchemy', {
    onUseOn: e => {
      let player = e.source;
      let item = e.itemStack;
      let block = e.block;

      let centerCoord = {
        x: Math.floor(block.center().x),
        y: Math.floor(block.center().y),
        z: Math.floor(block.center().z)
      }
      if (block.typeId == "minecraft:cauldron") {

        if (world.getDynamicProperty(`bwPotion:${centerCoord.x}_${centerCoord.y}_${centerCoord.z}_${block.dimension.id}`) == undefined) {
          let maximumCapacity = 6;
          if (player.hasTag("bw:witch_initiate")) {
            maximumCapacity = 15;
          }
          if (verifyPatron(player, "hebaya")) {
            maximumCapacity = 21;
          }


          let str = `bwPotion:${centerCoord.x}_${centerCoord.y}_${centerCoord.z}_${block.dimension.id}`;
          world.setDynamicProperty(str, JSON.stringify({
            "location": centerCoord,
            "dimension": block.dimension.id,
            "brewTime": 0,
            "capacity": 0,
            "maxCapacity": maximumCapacity,
            "contents": {},
            "elements": {},
            "secondary": undefined
          }));

          block.dimension.spawnParticle("bw:absorb_earth_essence", block.center());
          if (item.amount > 0) {
            item.amount -= 1;
          } else {
            item = undefined;
          }

          player.getComponent("minecraft:inventory").container.setItem(player.selectedSlotIndex, item);
        }
      }
    }
  });
});

const validModes = [
  "Survival",
  "Adventure",
  "Hardcore"
];

world.afterEvents.playerBreakBlock.subscribe(e => {
  let player = e.player;
  let blockPerm = e.brokenBlockPermutation;

  if (player instanceof Player && !validModes.includes(player.getGameMode())) {
    return;
  }

  // Get both medians and patrons and combine their arrays
  let medianFaeries = player?.getDynamicProperty("bw:medians");
  if (medianFaeries != undefined) {
    medianFaeries = JSON.parse(medianFaeries)
  } else {
    medianFaeries = []
  }
  let patronFaeries = player?.getDynamicProperty("bw:patrons");
  if (patronFaeries != undefined) {
    patronFaeries = JSON.parse(patronFaeries)
  } else {
    patronFaeries = []
  }

  // All Medians & Greater Patrons are here.
  let allFae = medianFaeries.concat(patronFaeries);

  for (let fae of allFae) {
    let selectedFaerie = JSON.parse(player.getDynamicProperty(`bw:${fae}`));
    let selectedFaerieInfo;

    if (selectedFaerie.type == "median") {
      selectedFaerieInfo = medianFae[fae]
    }
    if (selectedFaerie.type == "greater") {
      selectedFaerieInfo = greaterFae[fae];
    }

    let actions = selectedFaerieInfo.actions?.onPlayerBreak;
    if (actions != undefined) {
      for (let action of actions) {
        if (action.blocks.includes(blockPerm.type.id)) {
          let bonus = 0;

          if (selectedFaerie.trust > 0) {
            bonus = Math.floor(selectedFaerie.trust / 10) * 2;
          } else {
            bonus = -Math.floor(Math.abs(selectedFaerie.trust) / 10) * 2;
          }

          let dailyLimit = action.dailyLimit;
          if (typeof dailyLimit != "number") {
            dailyLimit = dailyLimit(selectedFaerie.trust);
          }

          if (dailyLimit > 0 && (player.getDynamicProperty(action.actionId) == undefined || player.getDynamicProperty(action.actionId) < dailyLimit)) {
            let num = player.getDynamicProperty(action.actionId);
            if (num == undefined) {
              num = 0;
            }
            if (player.getDynamicProperty(`${action.actionId}_date`) != world.getDay()) {
              player.setDynamicProperty(action.actionId, 1);
              player.setDynamicProperty(`${action.actionId}_date`, world.getDay());
            } else {
              player.setDynamicProperty(action.actionId, num + 1);
            }
          } else {
            // If trust gained should be negative, deduct and punish accordingly
            if (action.trustGain < 0) {
              if (dailyLimit > 0 && player.getDynamicProperty(`${action.actionId}_date`) != world.getDay()) {
                player.setDynamicProperty(action.actionId, undefined);
                player.setDynamicProperty(`${action.actionId}_date`, undefined);
              } else {
                let g = diceRoll(1, 100, true) + bonus
                if (g <= action.punishmentSave) {
                  selectedFaerieInfo.punishments[Math.floor(Math.random() * selectedFaerieInfo.punishments.length)](player);
                }
                selectedFaerie.trust = Math.round(selectedFaerie.trust + action.trustGain);
                // Faerie redefinition
                player.setDynamicProperty(`bw:${fae}`, JSON.stringify(selectedFaerie));
              }
            } else {
              if (diceRoll(1, 100, true) + bonus <= action.trustSave) {
                selectedFaerie.trust = Math.round(selectedFaerie.trust + action.trustGain);
                // Faerie redefinition
                player.setDynamicProperty(`bw:${fae}`, JSON.stringify(selectedFaerie));
              }
            }
          }

          if (selectedFaerie.trust > 100) {
            selectedFaerie.trust = 100;
            player.setDynamicProperty(`bw:${fae}`, JSON.stringify(selectedFaerie));
          }
          if (selectedFaerie.trust < -100) {
            selectedFaerie.trust = -100;
            player.setDynamicProperty(`bw:${fae}`, JSON.stringify(selectedFaerie));
          }
        }
      }
    } else {
      continue;
    }
  }
});

world.afterEvents.playerPlaceBlock.subscribe(e => {
  let player = e.player;
  let block = e.block;

  if (player instanceof Player && !validModes.includes(player.getGameMode())) {
    return;
  }

  // Get both medians and patrons and combine their arrays
  let medianFaeries = player?.getDynamicProperty("bw:medians");
  if (medianFaeries != undefined) {
    medianFaeries = JSON.parse(medianFaeries)
  } else {
    medianFaeries = []
  }
  let patronFaeries = player?.getDynamicProperty("bw:patrons");
  if (patronFaeries != undefined) {
    patronFaeries = JSON.parse(patronFaeries)
  } else {
    patronFaeries = []
  }

  // All Medians & Greater Patrons are here.
  let allFae = medianFaeries.concat(patronFaeries);

  for (let fae of allFae) {
    let selectedFaerie = JSON.parse(player.getDynamicProperty(`bw:${fae}`));
    let selectedFaerieInfo;

    if (selectedFaerie.type == "median") {
      selectedFaerieInfo = medianFae[fae]
    }
    if (selectedFaerie.type == "greater") {
      selectedFaerieInfo = greaterFae[fae];
    }

    let actions = selectedFaerieInfo.actions?.onPlayerPlace;
    if (actions != undefined) {
      for (let action of actions) {
        if (action.blocks.includes(block.typeId)) {
          let bonus = 0;

          if (selectedFaerie.trust > 0) {
            bonus = Math.floor(selectedFaerie.trust / 10) * 2;
          } else {
            bonus = Math.floor(Math.abs(selectedFaerie.trust) / 10) * 2;
          }
          let dailyLimit = action.dailyLimit;
          if (typeof dailyLimit != "number") {
            dailyLimit = dailyLimit(selectedFaerie.trust);
          }

          if (dailyLimit > 0 && (player.getDynamicProperty(action.actionId) == undefined || player.getDynamicProperty(action.actionId) < dailyLimit)) {
            let num = player.getDynamicProperty(action.actionId);
            if (num == undefined) {
              num = 0;
            }
            if (player.getDynamicProperty(`${action.actionId}_date`) != world.getDay()) {
              player.setDynamicProperty(action.actionId, 1);
              player.setDynamicProperty(`${action.actionId}_date`, world.getDay());
            } else {
              player.setDynamicProperty(action.actionId, num + 1);
            }
          } else {
            // If trust gained should be negative, deduct and punish accordingly
            if (action.trustGain < 0) {
              if (dailyLimit > 0 && player.getDynamicProperty(`${action.actionId}_date`) != world.getDay()) {
                player.setDynamicProperty(action.actionId, undefined);
                player.setDynamicProperty(`${action.actionId}_date`, undefined);
              } else {
                if (diceRoll(1, 100, true) + bonus <= action.punishmentSave) {
                  selectedFaerieInfo.punishments[Math.floor(Math.random() * selectedFaerieInfo.punishments.length)](player);
                }
                selectedFaerie.trust = Math.round(selectedFaerie.trust + action.trustGain);
                // Faerie redefinition
                player.setDynamicProperty(`bw:${fae}`, JSON.stringify(selectedFaerie));
              }
            } else {
              let g = diceRoll(1, 100, true) + bonus
              if (g <= action.trustSave) {
                selectedFaerie.trust = Math.round(selectedFaerie.trust + action.trustGain);
                // Faerie redefinition
                player.setDynamicProperty(`bw:${fae}`, JSON.stringify(selectedFaerie));
              }
            }
          }
          if (selectedFaerie.trust > 100) {
            selectedFaerie.trust = 100;
            player.setDynamicProperty(`bw:${fae}`, JSON.stringify(selectedFaerie));
          }
          if (selectedFaerie.trust < -100) {
            selectedFaerie.trust = -100;
            player.setDynamicProperty(`bw:${fae}`, JSON.stringify(selectedFaerie));
          }
        }
      }
    } else {
      continue;
    }
  }
});

world.afterEvents.itemStartUseOn.subscribe(e => {
  let player = e.source;
  let item = e.itemStack;

  if (player instanceof Player && !validModes.includes(player.getGameMode())) {
    return;
  }

  // Get both medians and patrons and combine their arrays
  let medianFaeries = player?.getDynamicProperty("bw:medians");
  if (medianFaeries != undefined) {
    medianFaeries = JSON.parse(medianFaeries)
  } else {
    medianFaeries = []
  }
  let patronFaeries = player?.getDynamicProperty("bw:patrons");
  if (patronFaeries != undefined) {
    patronFaeries = JSON.parse(patronFaeries)
  } else {
    patronFaeries = []
  }

  // All Medians & Greater Patrons are here.
  let allFae = medianFaeries.concat(patronFaeries);

  for (let fae of allFae) {
    let selectedFaerie = JSON.parse(player.getDynamicProperty(`bw:${fae}`));
    let selectedFaerieInfo;

    if (selectedFaerie.type == "median") {
      selectedFaerieInfo = medianFae[fae]
    }
    if (selectedFaerie.type == "greater") {
      selectedFaerieInfo = greaterFae[fae];
    }

    let actions = selectedFaerieInfo.actions?.onUseOn;
    if (actions != undefined) {
      for (let action of actions) {
        if (action.items.includes(item.typeId)) {
          let bonus = 0;

          if (selectedFaerie.trust > 0) {
            bonus = Math.floor(selectedFaerie.trust / 10) * 2;
          } else {
            bonus = Math.floor(Math.abs(selectedFaerie.trust) / 10) * 2;
          }
          let dailyLimit = action.dailyLimit;
          if (typeof dailyLimit != "number") {
            dailyLimit = dailyLimit(selectedFaerie.trust);
          }

          if (dailyLimit > 0 && (player.getDynamicProperty(action.actionId) == undefined || player.getDynamicProperty(action.actionId) < dailyLimit)) {
            let num = player.getDynamicProperty(action.actionId);
            if (num == undefined) {
              num = 0;
            }
            if (player.getDynamicProperty(`${action.actionId}_date`) != world.getDay()) {
              player.setDynamicProperty(action.actionId, 1);
              player.setDynamicProperty(`${action.actionId}_date`, world.getDay());
            } else {
              player.setDynamicProperty(action.actionId, num + 1);
            }
          } else {
            // If trust gained should be negative, deduct and punish accordingly
            if (action.trustGain < 0) {
              if (dailyLimit > 0 && player.getDynamicProperty(`${action.actionId}_date`) != world.getDay()) {
                player.setDynamicProperty(action.actionId, undefined);
                player.setDynamicProperty(`${action.actionId}_date`, undefined);
              } else {
                if (diceRoll(1, 100, true) + bonus <= action.punishmentSave) {
                  selectedFaerieInfo.punishments[Math.floor(Math.random() * selectedFaerieInfo.punishments.length)](player);
                }
                selectedFaerie.trust = Math.round(selectedFaerie.trust + action.trustGain);
                // Faerie redefinition
                player.setDynamicProperty(`bw:${fae}`, JSON.stringify(selectedFaerie));
              }
            } else {
              if (diceRoll(1, 100, true) + bonus <= action.trustSave) {
                selectedFaerie.trust = Math.round(selectedFaerie.trust + action.trustGain);
                // Faerie redefinition
                player.setDynamicProperty(`bw:${fae}`, JSON.stringify(selectedFaerie));
              }
            }
          }
          if (selectedFaerie.trust > 100) {
            selectedFaerie.trust = 100;
            player.setDynamicProperty(`bw:${fae}`, JSON.stringify(selectedFaerie));
          }
          if (selectedFaerie.trust < -100) {
            selectedFaerie.trust = -100;
            player.setDynamicProperty(`bw:${fae}`, JSON.stringify(selectedFaerie));
          }
        }
      }
    } else {
      continue;
    }
  }
});

world.afterEvents.entityHitEntity.subscribe(e => {
  let entity = e.hitEntity;
  let player = e.damagingEntity;

  if (player instanceof Player && !validModes.includes(player.getGameMode())) {
    return;
  }

  // Get both medians and patrons and combine their arrays
  let medianFaeries = player?.getDynamicProperty("bw:medians");
  if (medianFaeries != undefined) {
    medianFaeries = JSON.parse(medianFaeries)
  } else {
    medianFaeries = []
  }
  let patronFaeries = player?.getDynamicProperty("bw:patrons");
  if (patronFaeries != undefined) {
    patronFaeries = JSON.parse(patronFaeries)
  } else {
    patronFaeries = []
  }

  // All Medians & Greater Patrons are here.
  let allFae = medianFaeries.concat(patronFaeries);

  for (let fae of allFae) {
    let selectedFaerie = JSON.parse(player.getDynamicProperty(`bw:${fae}`));
    let selectedFaerieInfo;

    if (selectedFaerie.type == "median") {
      selectedFaerieInfo = medianFae[fae]
    }
    if (selectedFaerie.type == "greater") {
      selectedFaerieInfo = greaterFae[fae];
    }

    let actions = selectedFaerieInfo.actions?.onHitEntity;
    if (actions != undefined) {
      for (let action of actions) {
        let included = false;
        if (action.types != undefined) {
          if (action.types.includes(entity.typeId)) {
            included = true;
          }
        }
        if (action.family != undefined) {
          let families = entity.getComponent("minecraft:type_family");
          if (families) {
            let familyCount = 0;
            for (let f of action.family) {
              if (families.hasTypeFamily(f)) {
                familyCount++;
              }
            }
            if (familyCount == action.family.length) {
              included = true;
            }
          }
        }
        if (action.excludeFamily != undefined) {
          let families = entity.getComponent("minecraft:type_family");
          if (families) {
            let familyCount = 0;
            for (let f of action.excludeFamily) {
              if (!families.hasTypeFamily(f)) {
                familyCount++;
              }
            }
            if (familyCount == action.excludeFamily.length) {
              included = true;
            }
          }
        }


        if (included) {
          let bonus = 0;

          if (selectedFaerie.trust > 0) {
            bonus = Math.floor(selectedFaerie.trust / 10) * 2;
          } else {
            bonus = Math.floor(Math.abs(selectedFaerie.trust) / 10) * 2;
          }
          let dailyLimit = action.dailyLimit;
          if (typeof dailyLimit != "number") {
            dailyLimit = dailyLimit(selectedFaerie.trust);
          }

          if (dailyLimit > 0 && (player.getDynamicProperty(action.actionId) == undefined || player.getDynamicProperty(action.actionId) < dailyLimit)) {
            let num = player.getDynamicProperty(action.actionId);
            if (num == undefined) {
              num = 0;
            }
            if (player.getDynamicProperty(`${action.actionId}_date`) != world.getDay()) {
              player.setDynamicProperty(action.actionId, 1);
              player.setDynamicProperty(`${action.actionId}_date`, world.getDay());
            } else {
              player.setDynamicProperty(action.actionId, num + 1);
            }
          } else {
            // If trust gained should be negative, deduct and punish accordingly
            if (action.trustGain < 0) {
              if (dailyLimit > 0 && player.getDynamicProperty(`${action.actionId}_date`) != world.getDay()) {
                player.setDynamicProperty(action.actionId, undefined);
                player.setDynamicProperty(`${action.actionId}_date`, undefined);
              } else {
                if (diceRoll(1, 100, true) + bonus <= action.punishmentSave) {
                  selectedFaerieInfo.punishments[Math.floor(Math.random() * selectedFaerieInfo.punishments.length)](player);
                }
                selectedFaerie.trust = Math.round(selectedFaerie.trust + action.trustGain);
                // Faerie redefinition
                player.setDynamicProperty(`bw:${fae}`, JSON.stringify(selectedFaerie));
              }
            } else {
              let g = diceRoll(1, 100, true) + bonus;
              if (g <= action.trustSave) {
                selectedFaerie.trust = Math.round(selectedFaerie.trust + action.trustGain);
                // Faerie redefinition
                player.setDynamicProperty(`bw:${fae}`, JSON.stringify(selectedFaerie));
              }
            }
          }
          if (selectedFaerie.trust > 100) {
            selectedFaerie.trust = 100;
            player.setDynamicProperty(`bw:${fae}`, JSON.stringify(selectedFaerie));
          }
          if (selectedFaerie.trust < -100) {
            selectedFaerie.trust = -100;
            player.setDynamicProperty(`bw:${fae}`, JSON.stringify(selectedFaerie));
          }
        }
      }
    } else {
      continue;
    }
  }
});

// Function designed to increase or decrease Trust based on tags on the spell used.
export function faeSpellTagDetection(player, spellTags) {
  if (player instanceof Player && !validModes.includes(player.getGameMode())) {
    return;
  }

  // Get both medians and patrons and combine their arrays
  let medianFaeries = player?.getDynamicProperty("bw:medians");
  if (medianFaeries != undefined) {
    medianFaeries = JSON.parse(medianFaeries)
  } else {
    medianFaeries = []
  }
  let patronFaeries = player?.getDynamicProperty("bw:patrons");
  if (patronFaeries != undefined) {
    patronFaeries = JSON.parse(patronFaeries)
  } else {
    patronFaeries = []
  }

  // All Medians & Greater Patrons are here.
  let allFae = medianFaeries.concat(patronFaeries);

  for (let fae of allFae) {
    let selectedFaerie = JSON.parse(player.getDynamicProperty(`bw:${fae}`));
    let selectedFaerieInfo;

    if (selectedFaerie.type == "median") {
      selectedFaerieInfo = medianFae[fae]
    }
    if (selectedFaerie.type == "greater") {
      selectedFaerieInfo = greaterFae[fae];
    }

    let actions = selectedFaerieInfo.actions?.onSpellTag;
    if (actions != undefined) {
      for (let action of actions) {
        let includes = false;
        for (let tag of spellTags) {
          if (action.tags.includes(tag)) {
            includes = true;
          }
        }
        if (includes) {
          let bonus = 0;

          if (selectedFaerie.trust > 0) {
            bonus = Math.floor(selectedFaerie.trust / 10) * 2;
          } else {
            bonus = -Math.floor(Math.abs(selectedFaerie.trust) / 10) * 2;
          }

          let dailyLimit = action.dailyLimit;
          if (typeof dailyLimit != "number") {
            dailyLimit = dailyLimit(selectedFaerie.trust);
          }

          if (dailyLimit > 0 && (player.getDynamicProperty(action.actionId) == undefined || player.getDynamicProperty(action.actionId) < dailyLimit)) {
            let num = player.getDynamicProperty(action.actionId);
            if (num == undefined) {
              num = 0;
            }
            if (player.getDynamicProperty(`${action.actionId}_date`) != world.getDay()) {
              player.setDynamicProperty(action.actionId, 1);
              player.setDynamicProperty(`${action.actionId}_date`, world.getDay());
            } else {
              player.setDynamicProperty(action.actionId, num + 1);
            }
          } else {
            // If trust gained should be negative, deduct and punish accordingly
            if (action.trustGain < 0) {
              if (dailyLimit > 0 && player.getDynamicProperty(`${action.actionId}_date`) != world.getDay()) {
                player.setDynamicProperty(action.actionId, undefined);
                player.setDynamicProperty(`${action.actionId}_date`, undefined);
              } else {
                if (diceRoll(1, 100, true) + bonus <= action.punishmentSave) {
                  selectedFaerieInfo.punishments[Math.floor(Math.random() * selectedFaerieInfo.punishments.length)](player);
                }
                selectedFaerie.trust = Math.round(selectedFaerie.trust + action.trustGain);
                // Faerie redefinition
                player.setDynamicProperty(`bw:${fae}`, JSON.stringify(selectedFaerie));
              }
            } else {
              if (diceRoll(1, 100, true) + bonus <= action.trustSave) {
                selectedFaerie.trust = Math.round(selectedFaerie.trust + action.trustGain);
                // Faerie redefinition
                player.setDynamicProperty(`bw:${fae}`, JSON.stringify(selectedFaerie));
              }
            }
          }
          if (selectedFaerie.trust > 100) {
            selectedFaerie.trust = 100;
            player.setDynamicProperty(`bw:${fae}`, JSON.stringify(selectedFaerie));
          }
          if (selectedFaerie.trust < -100) {
            selectedFaerie.trust = -100;
            player.setDynamicProperty(`bw:${fae}`, JSON.stringify(selectedFaerie));
          }
        }
      }
    } else {
      continue;
    }
  }
}