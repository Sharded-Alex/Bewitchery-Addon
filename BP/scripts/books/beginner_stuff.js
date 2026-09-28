import { getAspectName } from "wandLore.js";

// Lotus Selryn
export const mundane_fundamentals = {
  "intro": {
    "title": "Mundane Fundamentals",
    "body": [
      "There is magic in these realms. It's not exactly surprising when we consider the illagers and their summoning abilities, the potions we can brew using the powdered remains of a blaze's rod and the portals that connect the Overworld to the other dimensions. Magic exists everywhere and we have found many ways to use the little we have access to.",
      "",
      "This book series, which I am calling §oA Study of the Bewitching Arts§r, is a collection of basic instruction I have collated about a strangely esoteric form of witchcraft. At the time of writing this, I am a Master Witch of the Sculken Bone coven and have pacted with quite a few Faeries, which took extensive study, trial and error on my part.",
      "",
      "This book begins this series and looks at the absolute fundamentals of stepping into the Craft. I will try to explain things when they pop up but do look out for any supplementary books I recommend for further reading."
    ],
    "buttons": [
      {
        "buttonName": "Mundane Magick",
        "buttonIcon": "textures/items/stick",
        "onClick": [
          {
            "type": "openForm",
            "form": "basic.mundane"
          }
        ]
      },
      {
        "buttonName": "Mystic Ashes",
        "buttonIcon": "textures/items/dusts/natural_ash",
        "onClick": [
          {
            "type": "openForm",
            "form": "basic.ashes"
          }
        ]
      },
      {
        "buttonName": "Witches & Crafts",
        "buttonIcon": "textures/blocks/witch_table/witch_table_side",
        "onClick": [
          {
            "type": "openForm",
            "form": "basic.workbench"
          }
        ]
      },
      {
        "buttonName": "Ritual Blades",
        "buttonIcon": "textures/items/tools/witch_athame",
        "onClick": [
          {
            "type": "openForm",
            "form": "basic.athame"
          }
        ]
      },
      {
        "buttonName": "Clay Effigies",
        "buttonIcon": "textures/items/tools/clay_totem",
        "onClick": [
          {
            "type": "openForm",
            "form": "basic.clay_totems"
          }
        ]
      },
      {
        "buttonName": "Amethyst Crystal Nuggets",
        "buttonIcon": "textures/items/essence/amethyst_nugget",
        "onClick": [
          {
            "type": "openForm",
            "form": "basic.nuggets"
          }
        ]
      },
      {
        "buttonName": "Brooms",
        "buttonIcon": "textures/items/tools/broom",
        "onClick": [
          {
            "type": "openForm",
            "form": "basic.brooms"
          }
        ]
      },
      {
        "buttonName": "Wandlore",
        "buttonIcon": "textures/items/tools/wands/oak_wand",
        "onClick": [
          {
            "type": "openForm",
            "form": "basic.wands"
          }
        ]
      },
      {
        "buttonName": "Squares of Glass",
        "buttonIcon": "textures/blocks/glass_white",
        "onClick": [
          {
            "type": "openForm",
            "form": "basic.divination"
          }
        ]
      },
      {
        "buttonName": "Next Steps",
        "buttonIcon": "textures/items/bottles/strange_potion",
        "onClick": [
          {
            "type": "openForm",
            "form": "basic.next_steps"
          }
        ]
      }
    ]
  },
  
  "basic.mundane": {
    "title": "Mundane Magick",
    "body": [
      "We witches, which is what we practitioners of the Bewitching Arts call ourselves, begin our journeys mundane. There are no fireballs, no freak callings of lightning. We do not call on the gods and goddesses and have them invite their wrath on others at our whims. We begin mundane, but it would be wrong to say that we are §ocompletely§r so. After all, there is magic even the mundane can pull off, with enough know-how.",
      "",
      "Many of the initial workings you'll find across this series are accessible to Mundane Witches. A lot of mystical workings draw power from mundane things and mundane processes often create mystical results, so it is a good idea to take them seriously."
    ],
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "intro"
          }
        ]
      }
    ]
  },
  "basic.ashes": {
    "title": "Mystic Ashes",
    "body": [
      "Many (not all) magical processes use §dthe ashes of burnt saplings§r to 'prepare' the instruments being used or to cause some occult change in a thing. I honestly couldn't tell you how it works but I do know this ash is called §aNatural Ash§r.",
      "",
      "Sprinkling natural ash on certain blocks changes them enough for magical use. Otherwise, it can be used in certain rituals and as a necessary component of offering oblations to the Fae. You will slowly encounter each of these uses as you read."
    ],
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "intro"
          }
        ]
      }
    ]
  },
  "basic.workbench": {
    "title": "Witches & Crafts",
    "body": [
      "The Witch's Workbench is used to craft dusts and whatever other tools and materials a witch might not craft normally. Witches rarely waste away over this workbench however. Many of us seem to grow out of it eventually as we learn more, but it is a nice block to have around.",
      "",
      "This crafting block is not crafted though. It is transmuted, by §dsneaking and sprinkling natural ash on a regular crafting station§r."
    ],
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "intro"
          }
        ]
      }
    ]
  },
  "basic.athame": {
    "title": "Ritual Blades",
    "body": [
      "Iron is a strange metal now that I know what I do. The fact that §dthe athame is crafted from an iron ingot and a stick§r in the §dWitch's Workbench§r is odd or perhaps it is intentional. Nevertheless, it is an important tool for gathering §cBlood§r (if empty bottles are being carried around as well for the blood to be gathered in).",
      "",
      "Blood is an important resource for a witch. Some rituals use it to point out who or what it should affect. Other more advanced witches use Primal Alchemy to break the stuff down into its most base Essences, which they then ritually bind together to allow some amount of control around who and what their spells, potions, portals, etc. affect.",
      "",
      "There is no officially recognized 'blood magick', but there are many magicks a witch can do that involves blood and its mystical byproducts."
    ],
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "intro"
          }
        ]
      }
    ]
  },
  "basic.clay_totems": {
    "title": "Clay Effigies",
    "body": [
      "The Witch's Workbench can also be used to craft Clay Totems. These little clay idols are used for capturing potion effects that have a duration of AT LEAST 30 seconds. This is done by hitting the entity while holding the Clay Totem. Once it has taken an effect, it becomes an §aAttuned Clay Totem§r.",
      "",
      "When attuned, hitting a creature with the totem will transfer the stored potion effect to them. That is not the major purpose of these totems though. Attuned Clay Totems are the main component of certain spells and rituals."
    ],
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "intro"
          }
        ]
      }
    ]
  },
  "basic.nuggets": {
    "title": "Amethyst Crystal Nuggets",
    "body": [
      "§dAmethyst Nuggets§r are about as important as Blood for certain rituals and magical workings. Their entire existence is for the storage of location, whether that may be position or dimension. Unfortunately, they don't stack. ",
      "",
      "Locations can be stored in an amethyst nugget simply by §dstanding and using the item§r. This §dsaves the user's current location§r. If the user §dsneaks and uses the item§r, it §dtries to save the location being locked at§r. This ease of use makes them handy. §dTo erase a location, simply stick it in a crafting table and recraft it§r.",
      "",
      "Amethyst Nuggets are crafted using Primal Alchemy (more on this in the next volume) so they technically count as rare items, though they are one of the simpler recipes."
    ],
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "intro"
          }
        ]
      }
    ]
  },
  "basic.brooms": {
    "title": "Brooms",
    "body": [
      "Sticks with hay at the end imbued with the primal force of Sky. That is my working definition of a broom. They are fairly handy magickal tools, able to precisely and speedily fly you to your destination. There's not much else to say about them. My High Priestess has a bad habit of dropping eggs and Egg spells from the safety of her birch broom. As silly as that sounds, she has razed rival covens like that. Titanian Witches are unexpectedly terrifying creatures when crossed, much like their Fae Matron.",
      "",
      "These devices are crafted via ritual. The specifics are not within the scope of this volume, but the specific ceremony is the §dEnchanting of the Broom§r ritual. Very self-explanatory. Do ensure to carefully take note of the conditions required when you do find and make use of the broom creation ritual."
    ],
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "intro"
          }
        ]
      }
    ]
  },
  "basic.wands": {
    "title": "Wandlore",
    "body": [
      "As stereotypical as it is, a witch requires a wand for some of their work. While more advanced witches can use them to cast spells through glyphs and intent, mundane witches simply use them to activate rituals, complete certain alchemy recipes and to activate any mystical constructs that require a special touch.",
      "",
      "Wands are simple things to create. §dSimply sprinkle natural ash on a placed sapling§r and it should transmute itself into a wand. A Wand with a Core is done in the same way, but the item that will serve as the Core should be thrown IN the sapling block before the natural ash is sprinkled.",
      "",
      "It is true that certain Cores allow a wand to do things most others can't. With that being said, most witches watch for the decreases and increases their wands give to the rituals and spells that they share Aspects. Aspects are things like §dEnchantment§r, §4Malefic§r and §dOccult§r; little 'tags' that describe that bit of magic. Any good magical text contains the associated Aspects of the rituals and spells inside it so figuring them out shouldn't be a large issue.",
      "",
      "For a more extensive look at the Aspects associated with each Wand Wood and Wand Core, try browsing §oA Study of Wandcraft§r by Guhlinda North."
    ],
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "intro"
          }
        ]
      }
    ]
  },
  "basic.divination": {
    "title": "Squares of Glass",
    "body": [
      "A beginner's introduction to divination lies in the refracted world of the §aCrystal Ball§r. Crafted in the Witch's Workbench, a mundane person can divine a variety things using Primal Crystals (more on this in the next volume) and other trinkets and powders. That is what divination is there for: to tell.",
      "",
      "Please be warned that knowledge of the future is not within the power of the Crystal Ball. It changes, twists and squirms around too much to grasp anything of value.",
      "",
      "For a complete look into what items can reveal what information, a look into §oThe Art of Divination§r by Elpha B. Agryn should be enough."
    ],
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "intro"
          }
        ]
      }
    ]
  },
  "basic.next_steps": {
    "title": "Next Steps",
    "body": [
      "As you can tell, there are a variety of items that a witch is likely to use often, most of which have seemingly minor or defined magical effects of their own.",
      "",
      "However, this barely scratches the surface of this style of magic.",
      "",
      "In the next volume, we will be covering Alchemy. Knowing your way around the Brewing Stand may or may not help here. Bewitched Alchemy is a science that has the potential to morph and change and discovery, research and documentation are all skills a budding alchemist will learn.",
      "",
      "I hope to see you in the pages of §oAlchemical Basics§r."
    ],
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "intro"
          }
        ]
      }
    ]
  }
}
// Wandlore
export const wands_book = {
  "intro": {
    "title": "A Study of Wandcraft",
    "body": [
      "Wands aren't just sticks used to channel magic. No, they are so much §omore§r. They are the saplings that have warped their form to be an instrument of direction, souls that have bent their intent to a single purpose. They draw upon the influence of their Core (for the ones that have such a thing) and direct their energies to aid the witch who wields them to the best of their ability.",
      "",
      "In fact, each wand wood had its own personality that bleeds into the finished wand. Its influence may be subtle, forceful, or so passive you may never truly notice but it IS there. Your wand is not simply a tool; it is also somewhat §oalive§r and you would do well to remember that, no matter how many you end up creating for your many mystical endeavors."
    ],
    "buttons": [
      {
        "buttonName": "Quasi-life",
        "buttonIcon": "textures/items/tools/wands/oak_wand",
        "onClick": [
          {
            "type": "openForm",
            "form": "wand.quasilife"
          }
        ]
      },
      {
        "buttonName": "Wand Saplings",
        "buttonIcon": "textures/blocks/sapling_oak",
        "onClick": [
          {
            "type": "openForm",
            "form": "wand.saplings"
          }
        ]
      },
      {
        "buttonName": "Wand Cores",
        "buttonIcon": "textures/items/spider_eye",
        "onClick": [
          {
            "type": "openForm",
            "form": "wand.cores"
          }
        ]
      },
      {
        "buttonName": "Wand Creation",
        "buttonIcon": "textures/items/dusts/natural_ash",
        "onClick": [
          {
            "type": "openForm",
            "form": "wand.creation"
          }
        ]
      }
    ]
  },
  
  "wand.quasilife": {
    "title": "Quasi-life",
    "body": [
      "Wands have a form of quasi-life that allows them to have some amount of autonomy when it comes to magic. This doesn't mean your Birch Wand is going to hop out of your hand and whack zombies in your defense. Faeries, no! What it §odoes§r mean though, is that different Wand Woods might suit different witches for different things.",
      "",
      "I've taken the time to note down the Wand Personalities by Wood below:",
      "",
      "§aAcacia§r - Aggressively §dloyal§r wands that injure anyone that isn't their creator. They are darlings otherwise.",
      "",
      "§aBirch§r - §dHelpful§r wands that impulsively cast spells on their own when their user is casting as a way to try and aid them. These spells are always Self spells that cost 100 Orbos and less.",
      "",
      "§aCherry§r - Pretty but fairly §dvengeful§r little things. They hate to see their users suffer, so when they are low on health, these wands provide a 100%% damage boost on Evocation damaging spells. Cherry is sometimes called the 'mama bear' wand wood.",
      "",
      "§aJungle§r - They make for reliable and §dvigilant§r wands. I am unsure if this is as a result of their home biome but these wands cut spell charge time by 50%% (if they can).",
      "",
      "§aSpruce§r - Stoic but flashy and §dflambouyant§r wands that some witches dislike and others adore. These wands randomly change the aesthetics of the spells cast with them, though they keep their colors."
    ],
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "intro"
          }
        ]
      }
    ]
  },
  "wand.saplings": {
    "title": "Wand Saplings",
    "body": [
      "Aside from 'personalities' though, the sapling chosen for a wand also attunes it to certain Aspects of witchcraft. This determines what kinds of magic it helps to reduce or increase the costs of. Below, I've noted down the woods and their aspects for easy reference.",
      "",
      `§a§lOak§r- ${getAspectName("spring")}, ${getAspectName("summer")}, ${getAspectName("autumn")}, ${getAspectName("winter")}`,
      "",
      `§a§lDark Oak§r - ${getAspectName("malefic")}, ${getAspectName("evocation")}`,
      "",
      `§a§lBirch§r - ${getAspectName("abjuration")}, ${getAspectName("enchantment")}, ${getAspectName("life")}`,
      "",
      `§a§lJungle§r - ${getAspectName("abjuration")}, ${getAspectName("evocation")}, ${getAspectName("malefic")}, ${getAspectName("life")}`,
      "",
      `§a§lAcacia§r - ${getAspectName("water")}, ${getAspectName("summer")}, ${getAspectName("fire")}, ${getAspectName("evocation")}`,
      "",
      `§a§lSpruce§r - ${getAspectName("emission")}, ${getAspectName("burst")}, ${getAspectName("winter")}, ${getAspectName("evocation")}`,
      ""
    ],
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "intro"
          }
        ]
      }
    ]
  },
  "wand.cores": {
    "title": "Wand Cores",
    "body": [
      "The other aspect of Wandcraft lies in Cores. Cores are assisting materials that add to or introduce new aspects to a wand wood, making wands more effective. Additionally, some Cores carry special benefits, ones that are mostly useful for spellcasting witches. Below, I have taken the time to catalogue all the ones I have discovered so far:",
      "",
      `§a§lArmadillo Scute§r`,
      `- ${getAspectName("mineral")}`,
      `- ${getAspectName("abjuration")}`,
      "",
      `§a§lBlaze Powder§r`,
      `- ${getAspectName("fire")}`,
      `- ${getAspectName("evocation")}`,
      "",
      `§a§lBottle O' Blood§r`,
      `- ${getAspectName("life")}`,
      `- ${getAspectName("malefic")}`,
      "§oPlaceholder§r",
      "",
      `§a§lBone§r`,
      `- ${getAspectName("autumn")}`,
      `- ${getAspectName("life")}`,
      `- ${getAspectName("malefic")}`,
      "",
      `§a§lBrain Coral§r`,
      `- ${getAspectName("mental")}`,
      `- ${getAspectName("water")}`,
      "",
      `§a§lBubble Coral§r`,
      `- ${getAspectName("abjuration")}`,
      `- ${getAspectName("water")}`,
      "",
      `§a§lFire Coral§r`,
      `- ${getAspectName("fire")}`,
      `- ${getAspectName("water")}`,
      "",
      `§a§lHorn Coral§r`,
      `- ${getAspectName("evocation")}`,
      `- ${getAspectName("water")}`,
      "",
      `§a§lTube Coral§r`,
      `- ${getAspectName("utility")}`,
      `- ${getAspectName("water")}`,
      "",
      `§a§lDead Coral§r`,
      `- ${getAspectName("autumn")}`,
      `- ${getAspectName("spirit")}`,
      "",
      `§a§lEnder Pearl§r`,
      `- ${getAspectName("nocturnal")}`,
      `- ${getAspectName("conjuration")}`,
      "",
      `§a§lFeather§r`,
      `- ${getAspectName("enchantment")}`,
      `- ${getAspectName("weather")}`,
      "",
      `§a§lGhast Tear§r`,
      `- ${getAspectName("abjuration")}`,
      `- ${getAspectName("fire")}`,
      `- ${getAspectName("spirit")}`,
      "",
      `§a§lInk Sac§r`,
      `- ${getAspectName("binding")}`,
      `- ${getAspectName("malefic")}`,
      "",
      `§a§lGlowing Ink Sac§r`,
      `- ${getAspectName("celestial")}`,
      `- ${getAspectName("water")}`,
      "",
      `§a§lGoat Horn§r`,
      `- ${getAspectName("weather")}`,
      `- ${getAspectName("life")}`,
      `- ${getAspectName("mineral")}`,
      "",
      `§a§lMagma Cream§r`,
      `- ${getAspectName("fire")}`,
      `- ${getAspectName("diurnal")}`,
      "",
      `§a§lNautilus Shell§r`,
      `- ${getAspectName("water")}`,
      `- ${getAspectName("abjuration")}`,
      "",
      `§a§lRabbit Foot§r`,
      `- ${getAspectName("blessing")}`,
      `- ${getAspectName("spring")}`,
      "",
      `§a§lRotten Flesh§r`,
      `- ${getAspectName("malefic")}`,
      `- ${getAspectName("autumn")}`,
      "",
      `§a§lSculk Catalyst§r`,
      `- ${getAspectName("transmutation")}`,
      `- ${getAspectName("autumn")}`,
      "",
      `§a§lTurtle Scute§r`,
      `- ${getAspectName("abjuration")}`,
      `- ${getAspectName("life")}`,
      `- ${getAspectName("water")}`,
      "",
      `§a§lShulker Shell§r`,
      `- ${getAspectName("abjuration")}`,
      `- ${getAspectName("enchantment")}`,
      "",
      `§a§lSlime Ball§r`,
      `- ${getAspectName("binding")}`,
      `- ${getAspectName("occult")}`,
      "",
      `§a§lString§r`,
      `- ${getAspectName("binding")}`,
      `- ${getAspectName("utility")}`,
      `- ${getAspectName("mental")}`,
      "",
      `§a§lDragon's Breath§r`,
      `- ${getAspectName("binding")}`,
      `- ${getAspectName("celestial")}`,
      "",
      `§a§lSpider Eye§r`,
      `- ${getAspectName("malefic")}`,
      `- ${getAspectName("divination")}`,
      `- ${getAspectName("occult")}`,
      ""
    ],
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "intro"
          }
        ]
      }
    ]
  },
  "wand.creation": {
    "title": "Wand Creation",
    "body": [
      "Most witches understand that wands are simple creations. Just a sprinkle of natural ash on a sapling will create a stick just magical enough to use. Throw a recognized core into this sapling before the natural ash sprinkle, and you have a wand with a core.",
      "No one is quite sure §owhy§r this works only that it does. I speculate that natural ash allows certain materials to connect to another dimension; one that resonates with the correct magickal energies for the craft. Naturally, this is in the realms of Mystic Witchcraft."
    ],
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "intro"
          }
        ]
      }
    ]
  }
}
// Divination
export const divination_book = {
  "intro": {
    "title": "The Art of Divination",
    "body": [
      "§oDivination is the art of knowing through mystical means.§r",
      "",
      "This tome will not describe how to read the future. It will not reveal the past. Divination, for a witch of the Bewitched Arts, is a way of discerning §opresent§r information through items and instruments about certain things or phenomena.",
      "",
      "Any means of uncovering information through magic is considered divination. With that being said, all the forms of divination within this book uses the §dCrystal Ball§r. Interacting with this block while using certain items will yield different results, which will be recorded accordingly."
    ],
    "buttons": [
      {
        "buttonName": "Basic Evaluation",
        "onClick": [
          {
            "type": "openForm",
            "form": "divine.self"
          }
        ]
      },
      {
        "buttonName": "Hex Detection",
        "buttonIcon": "textures/items/dusts/coal_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "divine.hex"
          }
        ]
      },
      {
        "buttonName": "Faerie Secrets",
        "buttonIcon": "textures/items/honeycomb",
        "onClick": [
          {
            "type": "openForm",
            "form": "divine.secrets"
          }
        ]
      },
      {
        "buttonName": "Coven Membership",
        "buttonIcon": "textures/items/copper_chain",
        "onClick": [
          {
            "type": "openForm",
            "form": "divine.coven"
          }
        ]
      },
      {
        "buttonName": "Scrying",
        "buttonIcon": "textures/items/essence/amethyst_nugget",
        "onClick": [
          {
            "type": "openForm",
            "form": "divine.scrying"
          }
        ]
      },
      {
        "buttonName": "Moon Phases",
        "buttonIcon": "textures/items/essence/water_opal",
        "onClick": [
          {
            "type": "openForm",
            "form": "divine.moon_phase"
          }
        ]
      },
      {
        "buttonName": "Fae Games",
        "buttonIcon": "textures/items/dusts/natural_ash",
        "onClick": [
          {
            "type": "openForm",
            "form": "divine.games"
          }
        ]
      },
      {
        "buttonName": "Quintessence",
        "buttonIcon": "textures/items/essence/pure_quint",
        "onClick": [
          {
            "type": "openForm",
            "form": "divine.quint"
          }
        ]
      },
      {
        "buttonName": "Familiars",
        "buttonIcon": "textures/items/talismans/fae_charm",
        "onClick": [
          {
            "type": "openForm",
            "form": "divine.familiar"
          }
        ]
      },
    ]
  },
  
  "divine.self": {
    "title": "Basic Evaluation",
    "body": [
      "Just by caressing the Ball with their bare hands, a witch can get a read on how much Orbos they have stored and how much Fatigue they've accumulated.",
      "",
      "This information could be gathered just as simply by standing and using a wand but sometimes, a crystal ball approach is necessary."
    ],
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "intro"
          }
        ]
      }
    ]
  },
  "divine.hex": {
    "title": "Hex Detection",
    "body": [
      "Witches are infamous for their hexes and witches of the Bewitched Arts are no different. They are usually insidious in application but Coal Dust on a Crystal Ball can discern these malicious little maladies with some success. The only complaint is that it does not identify the hex the victim is under but that doesn't matter. No hex is comfortable and any should be cleansed as soon as possible.",
      ""
    ],
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "intro"
          }
        ]
      }
    ]
  },
  "divine.secrets": {
    "title": "Faerie Secrets",
    "body": [
      "Using Honeycomb on the Crystal Ball allows the diviner to get a feel of how many Secrets they have. These serve as a type of currency among the Fae. Now, the matter of how to spend the stuff is another matter entirely.",
      ""
    ],
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "intro"
          }
        ]
      }
    ]
  },
  "divine.coven": {
    "title": "Coven Membership",
    "body": [
      "A Copper Chain used on the Crystal Ball reveals the diviner's coven, if they are apart of such a society.",
      ""
    ],
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "intro"
          }
        ]
      }
    ]
  },
  "divine.moon_phase": {
    "title": "Moon Phases",
    "body": [
      "A Lunar Crystal used on the Crystal Ball allows the diviner to glean the state of Seres, Lady Moon. As it is known, Lady Moon is many faced and each of her Faces hold meaning. From this, the current moon phase can be understood.",
      ""
    ],
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "intro"
          }
        ]
      }
    ]
  },
  "divine.games": {
    "title": "Fae Games",
    "body": [
      "Natural Ash used on the Crystal Ball allows the diviner to determine what Faerie Game they have chosen to take part in. The Fae are tricky but not malicious (usually) so a riddle pointing at what to do usually accompanies the objective of this Game.",
      ""
    ],
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "intro"
          }
        ]
      }
    ]
  },
  "divine.quint": {
    "title": "Quintessence",
    "body": [
      "Items with Quintessence infused into them when used on the Crystal Ball allows the diviner to observe what is actually IN said Quintessence, if anything. Actually reading it requires a bit of common sense and color association, however.",
      ""
    ],
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "intro"
          }
        ]
      }
    ]
  },
  "divine.familiar": {
    "title": "Familiars",
    "body": [
      "Familiar Trinkets when used on the Crystal Ball allow the diviner to observe the Familiar inside the Trinket as long as it is theirs. This provides helpful information about their natures, potential abilities and current mood levels.",
      ""
    ],
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "intro"
          }
        ]
      }
    ]
  },
  "divine.scrying": {
    "title": "Scrying",
    "body": [
      "Amethyst Nuggets bound to locations, when used on the Crystal Ball, allow the diviner to observe that bound location. In the spectral state that this 'observation' happens, the diviner may move around but cannot move further than 15 blocks from the location being used as a tether, else the scrying ends prematurely.",
      "",
      "§cIn certain Hardcore settings§r, this does not hold true. Instead, the diviner tries to get a read on the entities around and about that location.",
      "",
      "N.B.: Scrying is a feat of mystic magic so naturally, it uses §dOrbos§r. Mundane Witches, who do not have access to this energy, will find that it does not work. Additionally, magically triggered Jack o' Wards are able to detect the initial spectral jump to a location within their area of influence.",
      ""
    ],
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "intro"
          }
        ]
      }
    ]
  }
}