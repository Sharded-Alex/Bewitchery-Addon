import {capitalize, cores} from "wandLore.js";

function documentCores() {
  let str = "";
  for (let core of Object.values(cores)) {
    str = str + `§l${core.name}§r\n`;
    for (let [tag, amount] of Object.entries(core.aspects)) {
      str = str + `- §o${capitalize(tag)} (${amount}%)§r\n`;
    }
    str = str + "\n";
  }
  return str;
}

export const mystica_fundamenta = {
  "introduction": {
    "obfuscated": {
      "tagException": [
        "bw:witch_initiate"
      ]
    },
    "title": "Mystica Fundamenta",
    "body": "If you're looking to escape the claws of mystical study and plan to trod the path of ignorant magic, close this book. It will do you no good. Bewitchery is not a practice that caters to those who do not wish to study it, though it is an art you can slowly get the hang of.\n\nSeeing as you are still reading, I will assume that you have decided to learn as I have decided to teach. Let us begin our first lessons in the art of Bewitchery and the study of the /-Wylde/_.\n\n",
    "buttons": [
      {
        "buttonName": "Stages of the Witch",
        "buttonIcon": "textures/items/blaze_powder",
        "onClick": [
          {
            "type": "openForm",
            "form": "stages.frontPage"
          }
        ]
      },
      {
        "buttonName": "Tools",
        "buttonIcon": "textures/items/tools/wands/oak_wand",
        "onClick": [
          {
            "type": "openForm",
            "form": "tools.frontPage"
          }
        ]
      },
      {
        "buttonName": "Mystical Energies",
        "buttonIcon": "textures/items/essence/raw_orbos",
        "onClick": [
          {
            "type": "openForm",
            "form": "mysticEnergies.frontPage"
          }
        ]
      },
      {
        "buttonName": "What's Next?",
        "buttonIcon": "textures/items/bottles/strange_potion",
        "onClick": [
          {
            "type": "openForm",
            "form": "whatsNext?"
          }
        ]
      }
    ]
  },
  
  "stages.frontPage": {
    "title": "Stages of the Witch",
    "body": "No witch begins powerful, though there are many that can begin experienced. The nature of this art requires growth from all its practitioners, a kind that behaves differently for each individual.\n\nHowever, it can be split into three (3) stages. I will refer to them as the Mundane, the Mystic and the Master. Others consider these stages to be called the Body, the Mind, and the Spirit. Certain covens even know them as the Maiden, the Mother, and the Crone.\n\nYou are free to use any of these or create your own because they all refer to the same thing in this scenario.\n\n",
    "buttons": [
      {
        "buttonName": "The Mundane",
        "buttonIcon": "textures/items/iron_ingot",
        "onClick": [
          {
            "type": "openForm",
            "form": "stages.mundane"
          }
        ]
      },
      {
        "buttonName": "The Mystic",
        "buttonIcon": "textures/items/amethyst_shard",
        "onClick": [
          {
            "type": "openForm",
            "form": "stages.mystic"
          }
        ]
      },
      {
        "buttonName": "The Master",
        "buttonIcon": "textures/items/diamond",
        "onClick": [
          {
            "type": "openForm",
            "form": "stages.master"
          }
        ]
      },
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "introduction"
          }
        ]
      }
    ]
  },
  "stages.mundane": {
    "title": "The Mundane",
    "body": [
      `All witches begin Mundane. However, to believe Mundane Witches are not dangerous is a common but deadly misconception. Not all Mundanes strive for the higher Mystic Arts. Some individuals are content with perfecting the fundamentals and understanding the dangers.\n`,
      `The Mundane Witch strives to excel in Alchemy, Transmutation, Abjuration and Ceremony, which are all greater powers than most mundane individuals have. More prideful Mystics and Masters may look down on them for a lack of ability with Orbos and Faerie powers but most understand that there is power in the witch who has brewed the same potion 1000 times.\n`,
      `Some witches aim to move past the Mundane, however. This usually becomes a goal when they feel they are ready to move forward, and so, they strive to perform the §dRite of Mystic Ascension§r with one goal in mind: to become a Mystic.\n`
    ],
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "stages.frontPage"
          }
        ]
      }
    ]
  },
  "stages.mystic": {
    "title": "The Mystic",
    "body": [
      "The Mystic Witch has touched the cosmos and, in turn, have been touched by it. Frankly, most could say it means very little. There are a few Mystics that would disagree.\n",
      "It is at this stage that the witch can gather and utilize Orbos, a magical energy used in spells and rituals. With that ability, the mechanisms of Spellcraft become clearer (it should be noted that the Fae hold considerable influence over it; why wouldn't we?).\n",
      "Still, many witches just use this stage as a necessary bridge to \"mastery\". There is no such thing, really, but it makes those that dance to the tune of our silly games feel a little better about the pacts they force themselves to abide by or break out of necessity and frustration. Yes, I speak of the Master Witch."
    ],
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "stages.frontPage"
          }
        ]
      }
    ]
  },
  "stages.master": {
    "title": "The Master",
    "body": [
      "The Master is devoted. They have dared to reach past the cosmos by ritual and touch the Fae. It is common sense, then, that they make their offerings to us, uphold a few of our tenets and play our games occasionally. That is not to say we are Witch-gods; no, never. It is just the same as offering support to a friend, loving words to a partner and rent to the strange being that is the lord of land; arguably transactional (some more than others) but usually beneficial to one's peace of mind.\n",
      "It is certainly beneficial on the witch's side. The most minor of our ranks grant small boons and spell methods while the grandest of us teach other ways to make the most of the fundamentals they are sure to have learned by this point. Add the fact that the ability to safely leave these Pacts is §ousually§r available, and it is a fair trade. Somewhat."
    ],
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "stages.frontPage"
          }
        ]
      }
    ]
  },
  
  "tools.frontPage": {
    "title": "Tools",
    "body": "You are nothing without your tools. It sounds harsh but most do not have inherent talents that make it possible to work much magic without tools, herbs, or materials in general. As such, you will need to be aware of the various tools you will slowly become familiar with.\n\n",
    "buttons": [
      {
        "buttonName": "Trees to Dust",
        "buttonIcon": "textures/items/dusts/natural_ash",
        "onClick": [
          {
            "type": "openForm",
            "form": "tools.ash"
          }
        ]
      },
      {
        "buttonName": "Dusts & Crafts",
        "buttonIcon": "textures/blocks/witch_table/witch_table_side",
        "onClick": [
          {
            "type": "openForm",
            "form": "tools.dusts"
          }
        ]
      },
      {
        "buttonName": "Sticks & Stones",
        "buttonIcon": "textures/items/wands/birch_wand",
        "onClick": [
          {
            "type": "openForm",
            "form": "tools.wands"
          }
        ]
      },
      {
        "buttonName": "The Athame",
        "buttonIcon": "textures/items/tools/athame",
        "onClick": [
          {
            "type": "openForm",
            "form": "tools.athame"
          }
        ]
      },
      {
        "buttonName": "Clay Totems",
        "buttonIcon": "textures/items/tools/clay_totem",
        "onClick": [
          {
            "type": "openForm",
            "form": "tools.clay_totem"
          }
        ]
      },
      {
        "buttonName": "Defying Gravity",
        "buttonIcon": "textures/items/tools/broom",
        "onClick": [
          {
            "type": "openForm",
            "form": "tools.broom"
          }
        ]
      },
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "introduction"
          }
        ]
      }
    ]
  },
  "tools.ash": {
    "title": "Trees to Dust",
    "body": "Natural ash is the true beginning item of Bewitchery. It has extraordinary transmutative properties and can be used to perform a variety of necessary transmutations. It is created by cooking Saplings in a Furnace.\n\nBy sprinkling it on certain blocks, they may change or trigger certain mystical interactions. The ones relevant to this book are the following:\n(-) Crafting Tables become Witch Workbenches.\n\n(-) Saplings become their corresponding Wands.\n\n(-) Mystic Alchemy and Primal Alchemy both begin by using Natural Ash on a filled Cauldron while it is above the correct kind of heat.\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "tools.frontPage"
          }
        ]
      }
    ]
  },
  "tools.dusts": {
    "title": "Dusts & Crafts",
    "body": "The Witch Workbench is simply a mystical crafting table responsible for creating various dusts and other ceremonial items that can be handy later on for various aspects of Bewitchery.\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "tools.frontPage"
          }
        ]
      }
    ]
  },
  "tools.wands": {
    "title": "Sticks & Stones",
    "body": "Wands are a necessary tool even for Mundane Witches, and there are a variety of factors that count towards the perfect Wand(s) for a Witch and their practice. NO WAND IS A BAD WAND. Certain Wands created under certain circumstances are simply not meant for certain Witches. For more information, see the book §aIntegrated Wandlore§r.\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "tools.frontPage"
          }
        ]
      }
    ]
  },
  "tools.athame": {
    "title": "The Athame",
    "body": "The athame is an important ceremonial tool used to gather Blood from a hit creature or you yourself [usually, this is not their purpose]. This is called Taglocking and you simply need empty Glass Bottles in your inventory for it to work.\n\nTo get the blood of other creatures, sneak hit them. To get your own blood, use the Athame like you would a bow. Hitting creatures while standing will just damage them. This specific function is useful when killing creatures as a ritual sacrifice.\n\nNB: Certain creatures cannot have their Blood collected. Additionally, witches (and those wary of them) are known for taking measures to drastically decrease the chance of collecting their Blood.\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "tools.frontPage"
          }
        ]
      }
    ]
  },
  "tools.clay_totem": {
    "title": "Clay Totems",
    "body": "Clay totems are little clay items used to trap a single potion effect by hitting a mob. It (the effect) can be reapplied to the same creature or something else by hitting them with the now Attuned Clay Totem.\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "tools.frontPage"
          }
        ]
      }
    ]
  },
  "tools.broom": {
    "title": "Defying Gravity",
    "body": "Brooms are mystical vehicles that allow flight. There is nothing much else to say about them except that looking to the western skies while riding them is iconic.\n\nThey cannot be crafted, but you may ritually construct them by using the §dEnchanting of the Broom§r ceremony found in the §aCodex Ritualis§r book.\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "tools.frontPage"
          }
        ]
      }
    ]
  },
  
  "mysticEnergies.frontPage": {
    "title": "Mystical Energies",
    "body": "You must be aware of two energies when travelling down this path. They are Orbos and Fatigue.\n\nOrbos is the energy used to cast Bewitchery spells and can be used in rituals. Where its metaphysical variation is not used, its physical version (Raw Orbos) is often seen. While Mystic and above Witches can exercise some amount of influence over it through intent, Mundane Witches are forced to either ignore things that require §dnon-physical§r Orbos or, in the case of ceremonies, utilize ambience.\n\nOrbos is never passively generated by the Witch; it is gathered, and only Mystic and Master Witches have unlocked the secrets of its harvesting. When a Witch is at the Mystic or Master stage, they can gather it by using their Wand to gather it at specific times (around Midnight, around Noon, and all night during Full & New Moons).\n\nFatigue, on the other hand, is the weight the use of Orbos has on the Witch. The more Orbos used, the closer to the Wylde the Witch is usually pulled, ultimately leading to their demise. This is what Fatigue represents. It can be alleviated simply by being patient as it slowly decreases or by sleeping.\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "introduction"
          }
        ]
      }
    ]
  },
  // NOT DONE
  "mysticEnergies.orbos": {
    "title": "Orbos",
    "body": [
      "Orbos is an important energy that can be used to perform rituals and spells, though its metaphysical variant is mostly used to power the latter. Unfortunately, it can usually only be gathered by Mystic and Master Witches at special times and can only be utilized by them when that energy is internalized.\n",
      "Thankfully, Raw Orbos generally sees more use outside of that and some of these uses are fairly Mundane. This is why Mundane Witches can establish Wards and formulate Quintessence (mystical subjects not discussed in this book) but not effectively cast spells, which tends to rely on gathered Orbos.\n",
    ],
    "buttons": [
      {
        "buttonName": "Gathering Orbos",
        "buttonIcon": "textures/items/dusts/natural_ash",
        "onClick": [
          {
            "type": "openForm",
            "form": "mysticEnergies.orbos_gathering"
          }
        ]
      },
      {
        "buttonName": "Attracting Orbos",
        "buttonIcon": "textures/items/dusts/natural_ash",
        "onClick": [
          {
            "type": "openForm",
            "form": "mysticEnergies.orbos_attraction"
          }
        ]
      },
      {
        "buttonName": "Acquiring Raw Orbos",
        "buttonIcon": "textures/items/dusts/natural_ash",
        "onClick": [
          {
            "type": "openForm",
            "form": "mysticEnergies.raw_orbos"
          }
        ]
      },
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "introduction"
          }
        ]
      }
    ]
  },
  "mysticEnergies.fatigue": {
    "title": "Fatigue",
    "body": "You must be aware of two energies when travelling down this path. They are Orbos and Fatigue.\n\nOrbos is the energy used to cast Bewitchery spells and can be used in rituals. Where its metaphysical variation is not used, its physical version (Raw Orbos) is often seen. While Mystic and above Witches can exercise some amount of influence over it through intent, Mundane Witches are forced to either ignore things that require §dnon-physical§r Orbos or, in the case of ceremonies, utilize ambience.\n\nOrbos is never passively generated by the Witch; it is gathered, and only Mystic and Master Witches have unlocked the secrets of its harvesting. When a Witch is at the Mystic or Master stage, they can gather it by using their Wand to gather it at specific times (around Midnight, around Noon, and all night during Full & New Moons).\n\nFatigue, on the other hand, is the weight the use of Orbos has on the Witch. The more Orbos used, the closer to the Wylde the Witch is usually pulled, ultimately leading to their demise. This is what Fatigue represents. It can be alleviated simply by being patient as it slowly decreases or by sleeping.\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "introduction"
          }
        ]
      }
    ]
  },
  
  "whatsNext?": {
    "title": "What's Next?",
    "body": "Seeing as you've reached this far, it seems you are interested in the Bewitching Art.\n\nThis book simply covered general progression, the general tools of the Witch and the energies involved when at Mystic and higher stages. Now you may be asking what's next?\n\nNaturally, we will move on to Bewitched Alchemy, where cooking is magic, fire is fuel and the cauldron is a force of change. Your journey continues within the pages of §aPotens Alchimia§r.\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "introduction"
          }
        ]
      }
    ]
  }
}

export const wandlore = {
  "introduction": {
    "title": "Integrated Wandlore",
    "body": [
      `A large amount of the enchantments a witch weaves stem from the Wand. Rituals are performed through their directions, and many witches perform their spells through their glyphic instructions.\n`,
      `In this tome, you will learn the parts that make up the wand, their importance and why you may need multiple.\n`,
      ``,
     ],
    "buttons": [
      {
        "buttonName": "Wand Basics",
        "buttonIcon": "textures/items/stick",
        "onClick": [
          {
            "type": "openForm",
            "form": "wand.frontPage"
          }
        ]
      },
      {
        "buttonName": "Wand Woods",
        "buttonIcon": "textures/blocks/sapling_oak",
        "onClick": [
          {
            "type": "openForm",
            "form": "wand.woods"
          }
        ]
      },
      {
        "buttonName": "Wand Cores",
        "buttonIcon": "textures/items/blaze_powder",
        "onClick": [
          {
            "type": "openForm",
            "form": "wand.cores"
          }
        ]
      },
    ]
  },
  
  "wand.frontPage": {
    "title": "Wand Basics",
    "body": [
      `All Wands require §aWood§r. Many (but not all) Witches provide a §aCore§r. Together, they create a wand that affects your spells and rituals in small ways.\n`,
      `Wandlore is not mystical on its own, but witchcraft tends to be an accumulative art. All things add up to create powerful results, and the same is true of Wands. When used to perform rituals and cast spells, they can §areduce cost in orbos and fatigue§r, but only §cif the energies§r (which I will call §daspects§r) §cin the wand align with the spell/ritual§r.\n`,
      `Additionally, when weaving spells, the aspects of a Wand will serve as Correspondences that might help or harm the effects of the spell being weaved. Many witches believe it is not important, but let me warn you: it can be.\n\n`,
      `§lCreating Wands§r`,
      `Creating a Wand is simple. Place the sapling, use Natural Ash on it and you're done! If you want it to have a Core, throw EXACTLY 1 of the item at the same position the sapling is in, and then use Natural Ash on it (the sapling).`
    ],
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "introduction"
          }
        ]
      }
    ]
  },
  "wand.woods": {
    "title": "Wand Woods",
    "body": [
      `Saplings serve as the Woods of a Wand. Most saplings can be used for this purpose, and each type has its own aspect as well.\n§d`,
      `Oak Sapling > Weather`,
      `Birch Sapling > Abjuration`,
      `Acacia Sapling > Fire`,
      `Dark Oak Sapling > Malice`,
      `Jungle Sapling > Plant`,
      `Spruce Sapling > Mineral\n\n`
    ],
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "introduction"
          }
        ]
      }
    ]
  },
  "wand.cores": {
    "title": "Wand Cores",
    "body": [
      `Wand cores are optional additions to a wand (at creation) that stacks on more aspects. A wand can only ever have either 0 or 1 Cores.\n`,
      `${documentCores()}`
    ],
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "introduction"
          }
        ]
      }
    ]
  }
}