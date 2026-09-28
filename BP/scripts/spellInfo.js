import { potionEffects } from "./consumePotion";
import { romanize, getPotionTime } from "./potionCrafting";

const generics = {
  noun: [
    "Enchantment of ",
    "Whispers of ",
    "Tome of ",
    "Fae ",
    "Invocation of ",
    "Spell "
  ],
  prefixPhrase: [
    "Evocation of ",
    "Invoked ",
    "Whispered ",
    "Cozy Spell of ",
    "Angered Spell of ",
    "Giggling ",
    "Minor Spell of ",
    "Major Spell of ",
    "Dweomer of ",
    "Bewitched "
  ]
};
const namingSpellList = {
  "Conceal": {
    adjective: [
      "Obscuring",
      "Vanishing",
      "Poofing"
    ],
    connective: [
      "Obfuscation",
      "Concealment",
      "Invisibility",
      "Camouflage"
    ]
  },
  "Ignite": {
    adjective: [
      "Burning",
      "Immolation",
      "Incadescence"
    ],
    connective: [
      "Flame",
      "Kindling"
    ],
  },
  "Wyrd": {
    adjective: [
      "Faeharm",
      "Wyrd Mystics",
      "Magic"
    ],
    connective: [
      "Wyrd Arts",
      "Mysticism",
      "Archaic Magic",
      "True Magic"
    ],
  },
  "Heal": {
    adjective: [
      "Health"
    ],
    connective: [
      "Healing"
    ],
  },
  "Detoxify": {
    adjective: [
      "Detoxifying"
    ],
    connective: [
      "Detox",
      "Cleansing",
      "Effect Erasure"
    ],
  },
  "Evoke": {
    adjective: [
      "Effects"
    ],
    connective: [
      "Applied Effects",
      "Evoked Alchemy"
    ],
  },
  "Gust": {
    adjective: [
      "Breeziness",
      "Gust"
    ],
    connective: [
      "Breeze",
      "Wind",
      "Gust",
      "Whooshiness"
    ],
  }
}

export function spellOnomastics(noun, verb) {
  let txt = "";
  let type = {
    "noun": "adjective",
    "prefixPhrase": "connective"
  };
  let typeChosen = Object.keys(type)[Math.floor(Object.keys(type).length * Math.random())];
  let complimentary = type[typeChosen];
  
  txt = txt + generics[typeChosen][Math.floor(Math.random()*generics[typeChosen].length)];
  
  if (namingSpellList[verb] != undefined) {
    txt = txt + namingSpellList[verb][complimentary][Math.floor(Math.random()*namingSpellList[verb][complimentary].length)];
  } else {
    txt = txt + verb;
  }
  
  return txt;
}

const observedSpellList = {
  "Self": {
    spellText: "§l§cSelf§r - Causes the spell to only affect the casting Witch. /imbuedSpell?",
    parameters: {
      imbued: {
        replace: "/imbuedSpell?",
        replaceWith: (bool) => {
          if (!bool) {
            return "This spell has been primed to trigger instantly after its glyph has been drawn.";
          } else {
            return "";
          }
        }
      }
    }
  },
  "Bubble": {
    spellText: "§l§cBubble§r - Causes the spell to affect an area around the casting Witch. Currently, this area extends out to /radius? blocks./minRadius?/duration? /imbuedSpell?",
    parameters: {
      imbued: {
        replace: "/imbuedSpell?",
        replaceWith: (bool) => {
          if (!bool) {
            return "This spell has been primed to trigger instantly after its glyph is been drawn."
          } else {
            return ""
          }
        }
      },
      radius: {
        replace: "/radius?",
        replaceWith: (num) => {
          return `${num}`;
        }
      },
      minRadius: {
        replace: "/minRadius?",
        replaceWith: (num) => {
          if (num == 0) {
            return ""
          }
          if (num > 0) {
            return ` However, creatures within a ${num} block radius will not be affected. `;
          }
        }
      },
      duration: {
        replace: "/duration?",
        replaceWith: (num) => {
          if (num == 1) {
            return ""
          }
          if (num > 1) {
            return ` This Bubble also seems to have a duration of ${num} seconds.`;
          }
        }
      }
    }
  },
  "Touch": {
    spellText: "§l§cTouch§r - Causes the spell to affect the creature OR block hit by the casting Witch. Verb Glyphs tend to have a different effect when cast as Touch spells.",
    parameters: {}
  },
  "Bolt": {
    spellText: "§l§cBolt§r - Shoots a bolt of energy containing a spell effect. Any block or creature hit is treated as if they've been hit by the Touch variation of the spell. /imbuedSpell?/bouncing?/splitMagic?/gravity?/homing?",
    parameters: {
      imbued: {
        replace: "/imbuedSpell?",
        replaceWith: (bool) => {
          if (!bool) {
            return "This spell has been primed to trigger instantly after its glyph has been drawn.";
          } else {
            return "";
          }
        }
      },
      bouncing: {
        replace: "/bouncing?",
        replaceWith: (num) => {
          if (num == 0) {
            return "";
          } else 
          if (num > 0) {
            return `\n\nThis Bolt has the unique ability to bounce off blocks up to ${num} time(s).`;
          }
        }
      },
      split_magic: {
        replace: "/splitMagic?",
        replaceWith: (num) => {
          if (num == 0) {
            return "";
          } else 
          if (num > 0) {
            return `\n\nThis Bolt will split into ${num} projectiles on collision.`;
          }
        }
      },
      gravity: {
        replace: "/gravity?",
        replaceWith: (num) => {
          let sign = Math.sign(num);
          if (num == 0.00) {
            return "\n\nThis Bolt has no concept of gravity.";
          } else 
          if (num > 0.00) {
            if (sign == 1) {
              return `\n\nThis Bolt has a gravity of ${num}. It will slowly move downwards.`;
            }
            if (sign == -1) {
              return `\n\nThis Bolt has a gravity of ${num}. It will slowly move upwards.`;
            }
          }
        }
      },
      homing: {
        replace: "/homing?",
        replaceWith: (bool) => {
          if (bool) {
            return "\n\nThis Bolt will home in on the nearest creature within 8 blocks. As a result, it is not ideal in large groups of allies.";
          } else {
            return "";
          }
        }
      },
    }
  },
  "Missile": {
    spellText: "§l§cMissile§r - Shoots a missile of energy containing a spell effect. On collision, the effect is cast over an area. Currently, this area extends out to /radius? blocks./minRadius?/duration?/bouncing?/splitMagic?/gravity?/homing?",
    parameters: {
      imbued: {
        replace: "/imbuedSpell?",
        replaceWith: (bool) => {
          if (!bool) {
            return "This spell has been primed to trigger instantly after its glyph has been drawn.";
          } else {
            return "";
          }
        }
      },
      bouncing: {
        replace: "/bouncing?",
        replaceWith: (num) => {
          if (num == 0) {
            return "";
          } else 
          if (num > 0) {
            return `\n\nThis Missile has the unique ability to bounce off blocks up to ${num} time(s).`;
          }
        }
      },
      split_magic: {
        replace: "/splitMagic?",
        replaceWith: (num) => {
          if (num == 0) {
            return "";
          } else 
          if (num > 0) {
            return `\n\nThis Missile will split into ${num} projectiles on collision.`;
          }
        }
      },
      gravity: {
        replace: "/gravity?",
        replaceWith: (num) => {
          let sign = Math.sign(num);
          if (num == 0.00) {
            return "\n\nThis Missile has no concept of gravity.";
          } else 
          if (num > 0.00) {
            if (sign == 1) {
              return `\n\nThis Missile has a gravity of ${num}. It will slowly move downwards.`;
            }
            if (sign == -1) {
              return `\n\nThis Missile has a gravity of ${num}. It will slowly move upwards.`;
            }
          }
        }
      },
      homing: {
        replace: "/homing?",
        replaceWith: (bool) => {
          if (bool) {
            return "\n\nThis Missile will home in on the nearest creature within 8 blocks. As a result, it is not ideal in large groups of allies.";
          } else {
            return "";
          }
        }
      },
      radius: {
        replace: "/radius?",
        replaceWith: (num) => {
          return `${num}`;
        }
      },
      minRadius: {
        replace: "/minRadius?",
        replaceWith: (num) => {
          if (num == 0) {
            return ""
          }
          if (num > 0) {
            return ` However, creatures within a ${num} block radius will not be affected. `;
          }
        }
      },
      duration: {
        replace: "/duration?",
        replaceWith: (num) => {
          if (num == 1) {
            return ""
          }
          if (num > 1) {
            return ` Additionally, the Bubble conjured from this Missile seems to have a duration of ${num} seconds.`;
          }
        }
      }
    }
  },
  
  "Conceal": {
    spellText: "§l§7Conceal§r - Shrouds the victim in occult mist. This provides them with /potionEffect? and /customPotionEffect?.\n\n(*) Concealment prevents the entity from being percieved by taglocking and magus sensing (related to §dArs Arcana§r).",
    parameters: {
      potion_effect: {
        replace: "/potionEffect?",
        replaceWith: (array) => {
          return `Invisibility for ${array[0].duration} seconds`;
        }
      },
      custom_potion_effect: {
        replace: "/customPotionEffect?",
        replaceWith: (obj) => {
          return `${obj.name} for ${obj.duration} seconds`;
        }
      }
    }
  },
  "Ignite": {
    spellText: "§l§cIgnite§r - Pulls on the Wylde to conjure potentially dangerous sparks of fire. Creatures caught in the conflagration are set on fire for /fireDuration? seconds and have a /fireDamageChance?.\n\nWhen performed as a Touch spell and used on general blocks, Ignite will light the block on fire. Depending on the block, this can become a simple utility.",
    parameters: {
      setOnFire: {
        replace: "/fireDuration?",
        replaceWith: (obj) => {
          return `${obj.duration}`
        }
      },
      damage: {
        replace: "/fireDamageChance?",
        replaceWith: (obj) => {
          return `${Math.floor((20-obj.diceSave+1)/20*100)}%% of being dealt ${obj.damageAmount} Fire Damage`
        }
      }
    }
  },
  "Wyrd": {
    spellText: "§l§9Wyrd§r - Wild mystic power gathered into deadly force. Creatures touched by it take /magicDamage? Magic Damage.",
    parameters: {
      damage: {
        replace: "/magicDamage?",
        replaceWith: (obj) => {
          return `${obj.damageAmount}`
        }
      }
    }
  },
  "Heal": {
    spellText: "§l§eHeal§r - Powerful regenerative magick that heals the creature touched by it, no matter what they are. It heals /healAmount? damage.",
    parameters: {
      restoreHealth: {
        replace: "/healAmount?",
        replaceWith: (obj) => {
          return `${obj.healAmount}`
        }
      }
    }
  },
  "Detoxify": {
    spellText: "§l§aDetoxify§r - Cleansing energy that completely erases a potion effect's influence. /potionEffect?",
    parameters: {
      nullify_effect: {
        replace: "/potionEffect?",
        replaceWith: (obj) => {
          if (obj == undefined) {
            return ""
          } else {
            let effectName;
            let effectType;
            potionEffects.forEach(e => {
              if (e.effect == obj.id) {
                effectName = e.name;
                effectType = e.type;
              }
            });
            return `It removes the ${effectType} effect of ${effectName}.`
          }
        }
      }
    }
  },
  "Evoke": {
    spellText: "§l§aEvoke§r - Pulls on the power of Alchemy to force a creature to gain the potion effect evoked. /potionEffect?",
    parameters: {
      potion_effect: {
        replace: "/potionEffect?",
        replaceWith: (obj) => {
          if (obj == undefined) {
            return ""
          } else {
            if (obj.length > 1) {
              let txt = `This version of the spell evokes `;
              
              let previous;
              for (let efx of obj) {
                let effectName;
                let effectDur;
                let effectAmp;
                potionEffects.forEach(e => {
                  if (e.effect == obj.id) {
                    effectName = e.name;
                    effectAmp = romanize(obj.amplifier);
                    effectDur = getPotionTime(obj.duration);
                  }
                });
                if (previous == undefined) {
                  previous = effectName;
                  txt = txt+` ${effectName} ${effectAmp} ${effectDur}`;
                } else {
                  if (previous == effectName) {
                    txt = txt+".";
                  } else {
                    txt = txt+` & ${effectName} ${effectAmp} ${effectDur}.`;
                  }
                }
              }
              return txt;
            } else {
              let txt = `This version of the spell evokes ${obj[0].name} ${romanize(obj[0].amplifier)} ${getPotionTime(obj[0].duration)}.`;
              return txt;
            }
          }
        }
      }
    }
  },
  "Gust": {
    spellText: "§l§8Gust§r - Powerful winds are conjured, pulling in creatures or forcing them back from the casting Witch. /gustSpell?",
    parameters: {
      gust: {
        replace: "/gustSpell?",
        replaceWith: (obj) => {
          if (obj.inversed) {
            return `This variant pulls in creatures with a power of ${obj.power}.\n\nIn Bubble-type spells, they are pulled towards the opposite direction the casting Witch looked in when the spell was performed.`
          } else {
            return `This variant pushes away creatures with a power of ${obj.power}.\n\nIn Bubble-type spells, they are pushed towards the direction the casting Witch looked in when the spell was performed.`
          }
        }
      }
    }
  },
  "Shock": {
    spellText: "§l§eShock§r - Conjures electric sparks, dealing /shockDMG?.",
    parameters: {
      lightningStrike: {
        replace: "/shockDMG?",
        replaceWith: (obj) => {
          return `${obj.damageAmount} Lightning Damage. Additionally, there is a ${Math.floor((20-obj.diceSave+1)/20*100)}%% of striking affected creatures with lightning. This becomes a 100%% chance when the target is a block.\n\nIf the creature is in water or in rain, damage is increased by 50%%`
        }
      }
    }
  },
  "Growth": {
    spellText: "§l§2Growth§r - Infuses plants with Spring magicks. /growChance?",
    parameters: {
      growth: {
        replace: "/growChance?",
        replaceWith: (obj) => {
          return `There is a ${Math.floor((20-obj.diceSave+1)/20*100)}%% chance that the valid plant will grow by 1 stage.`
        }
      }
    }
  },
  "Thorns": {
    spellText: "§l§2Thorns§r - Grants a creature the constitution of thorns. Strangely, they are two major variants. /thorned?",
    parameters: {
      custom_potion_effect: {
        replace: "/thorned?",
        replaceWith: (obj) => {
          if (obj.inversed) {
            return `For this variant, the presence of the affected creature becomes thorny and harmful, damaging them and all creatures in a 3 block radius for ${obj.damage} Thorns Damage. This effect lasts for ${obj.duration} seconds.`;
          } else {
            return `For this variant, the skin of the affected creature may damage a melee attacker for ${obj.damage} Thorns Damage. This effect lasts for ${obj.duration} seconds.`;
          }
        }
      }
    }
  },
  "Apple": {
    spellText: "§l§4Apple§r - Summons the mystical influences surrounding the apple fruit. /appleEffect?\n\nAs a Touch spell, touching leaves will have a chance to turn them into Apples. A certain Faerie's trust may annoint them with a golden hue.",
    parameters: {
      custom_potion_effect: {
        replace: "/appleEffect?",
        replaceWith: (obj) => {
          if (obj.inversed) {
            return `Affected creatures eating apples have a ${Math.floor((20-obj.diceSave+1)/20*100)}%% chance to be poisoned terribly. This enchantment lasts for ${obj.duration} seconds.`;
          } else {
            return `Affected creatures eating apples have a ${Math.floor((20-obj.diceSave+1)/20*100)}%% chance to gain some positive effects. This enchantment lasts for ${obj.duration} seconds.`;
          }
        }
      }
    }
  },
  "Frenzy": {
    spellText: "§l§6Frenzy§r - Embodies the drunken, violent and reckless nature of the Summer Fae when they revel in Summer's Dew. /frenzyEffect?",
    parameters: {
      custom_potion_effect: {
        replace: "/frenzyEffect?",
        replaceWith: (obj) => {
          return `This effect lasts for ${obj.duration} seconds.\n\nThe more injured the Frenzied creature is, the harder they hit. However, when they are below half their health, they have a much greater chance to Bleed out. To be specific, a ${Math.floor((20-obj.diceSave+1)/20*100)}%% chance.`;
        }
      }
    }
  },
  "Surge": {
    spellText: "§l§9Surge§r - Conjures a powerful repelling/attracting force. This force is always conjured around an epicenter however, so experimentation may be necessary./surge?",
    parameters: {
      surge: {
        replace: "/surge?",
        replaceWith: (obj) => {
          if (obj.inversed) {
            return `\n\nThis variant pulls in creatures towards its epicenter with a power of ${obj.power}.`;
          } else {
            return `\n\nThis variant pushes away creatures from its epicenter with a power of ${obj.power}.`;
          }
        }
      }
    }
  },
  "Buzz": {
    spellText: "§l§gBuzz§r - Calls on Titanian sources to enhance the benefits of consuming Honey. For /honeyDur? seconds, the substance fully restores health in addition to hunger.\n\nWhen Touch is its Noun, interacting with a Bee Nest or Beehive has a /honify?%% chance to bring it one step closer to being filled.",
    parameters: {
      custom_potion_effect: {
        replace: "/honeyDur?",
        replaceWith: (obj) => {
          return `${obj.duration}`;
        }
      },
      honify: {
        replace: "/honify?",
        replaceWith: (obj) => {
          return `${Math.floor((20-obj.diceSave+1)/20*100)}`;
        }
      }
    }
  },
  "Egg": {
    spellText: "§l§hEgg§r - Pulls on the concepts of birth and fertility held by the Spring Goddess (a believed epithet of Titania). When a creature is blessed by Egg, they will recieve a random blessing of sorts. This may be maximum health, maximum hunger bars, or something else along those lines.\n\nWhen Touch is its Noun, interacting with a Block will conjure a baby chicken. If a Blood Vial is in the offhand, it will attempt to conjure the baby variant of the creature that owns the blood (provided they aren't a player).\n\nFor Players however, the act of rebirth is accompanied by travel. As a result, Touch variants of Egg carry the aspect of teleportation for Players.",
    parameters: {}
  },
  "Stone": {
    spellText: "§l§8Stone§r - /stoneEffect?\n\nThe Touch variation \"raises\" a Wall of earthen materials that has /wallWidth?.",
    parameters: {
      custom_potion_effect: {
        replace: "/stoneEffect?",
        replaceWith: (obj) => {
          if (!obj.inversed) {
            return `Calls upon earthen powers to harden the skin and allow the affected creature to be resistant to entity attacks. However, pickaxes deal more damage as a result. This effect lasts for ${obj.duration} seconds.`
          } else {
            return `Calls upon earthen powers to harden the skin and allow the affected creature to be resistant to entity attacks. However, pickaxes deal more damage as a result and this variation of the spell leaves the creature rooted to the floor. This effect lasts for ${obj.duration} seconds.`
          }
        }
      },
      raiseBlocks: {
        replace: "/wallWidth?",
        replaceWith: (obj) => {
          return `a width of ${obj.width*2+1} blocks and a height of ${obj.height} blocks.`;
        }
      }
    }
  },
  "Dig": {
    spellText: "§l§8Dig§r - Infuses earthen materials with a destructive force, causing them to shatter and drop. When considering area, the Bubble shape is used to affect it.",
    parameters: {}
  },
  "Hearth": {
    spellText: "§l§cHearth§r - Comes with a magic that smells like home. When used on creatures, they gain /hearthEffect?.\n\nWhen used as a Touch spell on lit campfires, it conjures an area that grants powerful Resistance and Saturation to ALL creatures within range. If the caster leaves the /hearthRad? block radius, they will be afflicted with Hearth Sickness. This effect prevents a creature from benefiting from Hearth spells.",
    parameters: {
      potion_effect: {
        replace: "/hearthEffect?",
        replaceWith: (obj) => {
          return `Absorption (${obj[0].duration} seconds) and Resistance (${obj[1].duration} seconds).`
        }
      },
      hearthRadius: {
        replace: "/hearthRad?",
        replaceWith: (obj) => {
          return `${obj.radius}`
        }
      }
    }
  },
  "Mend": {
    spellText: "§l§gMend§r - Binds together and heals the wounds of items that hurt just as creatures do. That is, it mends items by /mendPow? durability.",
    parameters: {
      mend: {
        replace: "/mendPow?",
        replaceWith: (obj) => {
          return `${obj.mendPower}`
        }
      },
      hearthRadius: {
        replace: "/hearthRad?",
        replaceWith: (obj) => {
          return `${obj.radius}`
        }
      }
    }
  },
  "Frost": {
    spellText: "§l§bFrost§r - Conjures up frost from the Courts of Winter, damaging creatures with /frostDmg? Freezing Damage. Additionally, there is /frostChance?",
    parameters: {
      damage: {
        replace: "/frostDmg?",
        replaceWith: (obj) => {
          return `${obj.damageAmount}`
        }
      },
      potion_effect: {
        replace: "/frostChance?",
        replaceWith: (obj) => {
          return `a ${Math.floor((20-obj[0].diceSave+1)/20*100)}%% chance for them to recieve Slowness ${romanize(obj[0].amplifier)} for ${obj[0].duration} seconds.`
        }
      }
    }
  },
  "Bulward": {
    spellText: "§l§dBulward§r - Cloaks the affected creature in powerful protective magics for /bulwardTime?",
    parameters: {
      custom_potion_effect: {
        replace: "/bulwardTime?",
        replaceWith: (obj) => {
          return ` ${obj.duration} seconds. In most cases, it serves as a second health for a time. This variation is able to absorb ${(obj.amplifier+1)*20} damage before either the duration is up or the amount of total damage taken exceeds this number.`
        }
      }
    }
  }
};

export function spellRead(pieceType, circle) {
  circle = addMods(circle, circle.nounMod, circle.verbMod);
  let spellPiece = circle[pieceType];
  let glyphFound = observedSpellList[spellPiece.type];
  
  if (glyphFound) {
    let txt = glyphFound.spellText;
    for (let [param, value] of Object.entries(glyphFound.parameters)) {
      let glyphValue = spellPiece[param];
      let functionResult = value.replaceWith(glyphValue);
      txt = txt.replaceAll(value.replace, functionResult);
    }
    return txt;
  } else {
    return `No mystical observation could be made of §l${spellPiece.type}§r. Its true nature is hidden from you.`;
  }
}

function addMods(foundCircle, nounModifications, verbModifications) {
  if (nounModifications != undefined) {
    for (let [k, v] of Object.entries(nounModifications)) {
      if (foundCircle.noun[k] != undefined && typeof v == "number") {
        if (foundCircle.noun[k] != undefined) {
          foundCircle.noun[k] = foundCircle.noun[k] + v;
        }
      } 
      if (foundCircle.noun[k] != undefined && typeof v != "number") {
        foundCircle.noun[k] = v;
      }
    }
  }
  
  if (verbModifications != undefined) {
    for (let [k, v] of Object.entries(verbModifications)) {
      for (let [key, value] of Object.entries(foundCircle.verb)) {
        if (!Array.isArray(value)) {
          if (foundCircle.verb[key][k] != undefined && typeof v == "number") {
            foundCircle.verb[key][k] = foundCircle.verb[key][k] + v;
          }
          if (foundCircle.verb[key][k] != undefined && typeof v != "number") {
            foundCircle.verb[key][k] = v;
          }
        } else {
          for (let aVal = 0; aVal < value.length; aVal++) {
            if (foundCircle.verb[key][aVal][k] != undefined && typeof v == "number") {
              foundCircle.verb[key][aVal][k] = foundCircle.verb[key][aVal][k] + v;
            }
            if (foundCircle.verb[key][aVal][k] != undefined && typeof v != "number") {
              foundCircle.verb[key][aVal][k] = v;
            }
          }
        }
      }
    }
  }
  return foundCircle;
}