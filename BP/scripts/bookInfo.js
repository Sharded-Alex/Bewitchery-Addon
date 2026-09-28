export const information = {
  "mainPage": {
    "title": "Ars Occulta",
    "obfuscated": {
      "tagException": ["lore:theWitch"]
    },
    "body": "I will begin by saying this. If you are not one §ato adventure, to collect, to experiment§r, close this tome and return it to where you found it. Better yet, burn it. I would not want a book I have written to have suffered the fate of being looked upon by such dull eyes, and so I request that you put it out of its misery.\n\nIf you are any, or all, of these however, welcome! Welcome to the §lArs Occulta§r, the Hidden Art! I hope your read is a good one. It will teach you many things about witchcraft, some useful, some not, but all, in some way, mystical.\n\nYour local Wood Witch,\n/-Hebaya/_\n\n",
    "buttons": [
      {
        "buttonName": "Tools of the Witch",
        "buttonIcon": "textures/items/tools/mortar_and_pestle",
        "onClick": [
          {
            "type": "openForm",
            "form": "tools.frontPage"
          }
        ]
      },
      {
        "buttonName": "Archaic Alchemy",
        "buttonIcon": "textures/items/blaze_powder",
        "onClick": [
          {
            "type": "openForm",
            "form": "alchemy.frontPage"
          }
        ]
      },
      {
        "buttonName": "Occult Ceremonies",
        "buttonIcon": "textures/ui/portalBg",
        "onClick": [
          {
            "type": "openForm",
            "form": "ceremony.frontPage"
          }
        ]
      },
      {
        "buttonName": "Mystical Maladies",
        "buttonIcon": "textures/items/bottles/blood_bottle",
        "onClick": [
          {
            "type": "openForm",
            "form": "curses.list"
          }
        ]
      },
      {
        "buttonName": "Divination",
        "buttonIcon": "textures/blocks/glass",
        "onClick": [
          {
            "type": "openForm",
            "form": "divination.frontPage"
          }
        ]
      }
    ]
  },
  
  "tools.frontPage": {
    "title": "Tools of the Witch",
    "body": "As powerful as mortal witches may be, they are quite powerless without their tools. In some cases, these are the instruments that refine their various materials into ones suitable for the Craft. In other cases, they are the tools upon which they draw power to perform great feats, like flight.\n\nBelow are the various tools of the Witch. This does not cover ALL tools. More specific articles of magickal power can be found in their appropriate chapters.\n\n",
    "buttons": [
      {
        "buttonName": "Witch's Workbench",
        "buttonIcon": "textures/blocks/witch_table/witch_table_side",
        "onClick": [
          {
            "type": "openForm",
            "form": "tools.workbench"
          }
        ]
      },
      {
        "buttonName": "Athame",
        "buttonIcon": "textures/items/tools/witch_athame",
        "onClick": [
          {
            "type": "openForm",
            "form": "tools.athame"
          }
        ]
      },
      {
        "buttonName": "Mortar & Pestle",
        "buttonIcon": "textures/items/tools/mortar_and_pestle",
        "onClick": [
          {
            "type": "openForm",
            "form": "tools.mortarPestle"
          }
        ]
      },
      {
        "buttonName": "Wands",
        "buttonIcon": "textures/items/tools/wands/oak_wand",
        "onClick": [
          {
            "type": "openForm",
            "form": "tools.wands"
          }
        ]
      },
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "mainPage"
          }
        ]
      }
    ]
  },
  "tools.workbench": {
    "title": "Witch's Workbench",
    "body": "Workbenches are used to crsft and refine, and the Witch's Workbench is no different. On it, you may craft various §apowders§r and other items necessary for magickal workings.\n\n\"Crafting\" a Witch's Workbench isn't hard. Simply gather some §anatural ash§r (smelting a few saplings should be enough), and use it on a Crafting Table. After a few seconds, it should change form.\n\nGranted, it never had to be that way, but a witch should look mystical and magickal, not like those research obsessed academics of arcana.\n\n",
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
    "title": "Athame",
    "body": "Athames are ceremonial knives used for magickal purposes. They can be enchanted and they deal a little bit of damage.\n\nWith a glass bottle in the inventory, they will §acollect the blood of most entities, provided they do not exceed 100 health, by just hitting them§r. This blood can be used later on in various rituals. If the athame is used while a glass bottle is in the inventory, §athe witch's blood will be collected instead§r.\n\nBesides that, killing the undead with an athame has a chance to increase §aa witch's Occult Energy§r. You will know more about this aspect of magick later.\n\n",
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
  "tools.mortarPestle": {
    "title": "Mortar & Pestle",
    "body": "A simple item used to crush flowers and minerals in the Witch's Workbench. I suggest you keep it handy. It is best to have it and not need it than the opposite.\n\n",
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
    "title": "Wands",
    "body": "Using §anatural ash§r on saplings will create wands. Wands of different woods find themselves to have different properties and help cut down the costs of Ceremonial Magick. §aCores§r do the same, empowering the wand wood. To create a §aWand§r with a §aCore§r, simply throw a valid Core on the same block as the sapling and use §2natural ash§r on the sapling.\n\nWhen a wand shares Aspects with a ritual or spell, its cost is reduced. For every Aspect shared, 15% is shaved off, rounded to the nearest 5 or 0.\n\nBelow is a list of Cores and Woods useful in Wandlore.\n\n",
    "buttons": [
      {
        "buttonName": "Woods",
        "buttonIcon": "textures/blocks/sapling_oak",
        "onClick": [
          {
            "type": "openForm",
            "form": "tools.wands.woods"
          }
        ]
      },
      {
        "buttonName": "Cores",
        "buttonIcon": "textures/items/blaze_powder",
        "onClick": [
          {
            "type": "openForm",
            "form": "tools.wands.cores"
          }
        ]
      },
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
  "tools.wands.woods": {
    "title": "Woods",
    "body": "Oak Saplings §2(Weather)§r\nBirch Saplings §2(Abjuration)§r\nAcacia Saplings §2(Fire)§r\nDark Oak Saplings §2(Malice)§r\nJungle Saplings §2(Plant)§r\nSpruce Saplings §2(Mineral)§r",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "tools.wands"
          }
        ]
      }
    ]
  },
  "tools.wands.cores": {
    "title": "Cores",
    "body": "Armadillo Scale §2(Abjuration, Mineral)§r\nBlaze Powder §2(Fire, Evocation)§r\nBone §2(Malice, Esoteric)§r\nEnder Pearl §2(Conjuration, Esoteric)§r\nFeather §2(Weather, Utility)§r\nGhast Tear §2(Abjuration, Evocation)§r\nGoat Horn §2(Plant, Mineral)§r\nMagma Cream §2(Mineral, Fire)§r\nNautilus Shell §2(Water, Abjuration)§r\nRabbit Foot §2(Support, Utility)§r\nRotten Flesh §2(Malice, Evocation)§r\nScute §2(Abjuration, Water)§r\nShulker Shell §2(Evocation, Abjuration)§r\nSlimeball §2(Transmutation, Utility)§r\nSpider Eye §2(Malice, Psychic)§r\nString §2(Binding, Esoteric)§r\nFire Coral §2(Fire, Water)§r\nBubble Coral §2(Abjuration, Water)§r\nTube Coral §2(Conjuration, Water)§r\nHorn Coral §2(Evocation, Water)§r\nBrain Coral §2(Divination, Water)§r\nDead Coral §2(Malice, Water)§r\nSculk Catalyst §2(Plant, Transmutation)§r\nInk Sac §2(Malice, Binding)§r\nGlowing Ink Sac §2(Malice, Abjuration)§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "tools.wands"
          }
        ]
      }
    ]
  },
  
  "alchemy.frontPage": {
    "title": "Archaic Alchemy",
    "body": "A witch is many things, and an alchemist is normally one of them. If you are not, that is fine as well, but you at least should know the fundamentals.\n\nA witch's potion (or a §aStrange Potion§r) is not the same as one brewed within a Brewing Stand. They are generally §clast for less time§r, but §athey can be much more potent and have a variety of effects§r. They are also quite §acustomizable§r if you know what you're doing.\n\nThis chapter will instruct you on all you need to know when it comes to §aarchiac alchemy§r.\n\n",
    "buttons": [
      {
        "buttonName": "Witching Pot",
        "buttonIcon": "textures/blocks/cauldron_side",
        "onClick": [
          {
            "type": "openForm",
            "form": "alchemy.cauldron"
          }
        ]
      },
      {
        "buttonName": "Strange Potion",
        "buttonIcon": "textures/items/bottles/strange_potion",
        "onClick": [
          {
            "type": "openForm",
            "form": "alchemy.strangePotion"
          }
        ]
      },
      {
        "buttonName": "Reagents",
        "buttonIcon": "textures/items/slimeball",
        "onClick": [
          {
            "type": "openForm",
            "form": "alchemy.reagents"
          }
        ]
      },
      {
        "buttonName": "Brewing",
        "buttonIcon": "textures/items/tools/wood_spoon",
        "onClick": [
          {
            "type": "openForm",
            "form": "alchemy.brewing"
          }
        ]
      },
      {
        "buttonName": "Crystallization",
        "buttonIcon": "textures/items/essence/earth_gem",
        "onClick": [
          {
            "type": "openForm",
            "form": "alchemy.crystals"
          }
        ]
      },
      {
        "buttonName": "Known Reagents",
        "buttonIcon": "textures/items/dusts/poppy_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.list"
          }
        ]
      },
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "mainPage"
          }
        ]
      }
    ]
  },
  "alchemy.cauldron": {
    "title": "Witching Pot",
    "body": "When performing normal potion crafting, a layman might use the brewing stand. However, the witch tends to use the §awitching pot§r. It is \"crafted\" by sprinkling some §anatural ash on a cauldron§r. After a little waiting, the cauldron should take on its new form.\n\nIt can then be filled with a bucket of water, and emptied with an empty bucket. §aAll alchemy begins with a full witching pot§r; that much should be common sense. The draught within the mystical pot will also change colors depending on the ingredients used.\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "alchemy.frontPage"
          }
        ]
      }
    ]
  },
  "alchemy.strangePotion": {
    "title": "Strange Potion",
    "body": "A potion §acan be collected from a witching pot using a glass bottle§r. When this is done, it will produce a §astrange potion§r. These \"strange\" brews can produce more than one effect in alot of cases, and can be consumed multiple times before the bottle is empty.\n\nAnother unique feature of strange potions is the ability to apply its effects to a hit target. Simply hold the potion and clobber the victim. I find it great fun. In a way, this makes up a little bit for being unable to make spalsh variants. §cIt will likely stay that way.§r\n\nThere is also a splash variant that requires a Glass Flask to obtain. These follow most of the rules of regular potions, although they have 5 uses strangely enough.\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "alchemy.frontPage"
          }
        ]
      }
    ]
  },
  "alchemy.reagents": {
    "title": "Reagents",
    "body": "If a full witching pot is an empty canvas, reagents are what turn it into a colorful masterpiece. However, there are quite a few reagents that exist and they all can have various effects on a brewing potion. This section aims to explain these different §aaspects§r of reagents.\n\n",
    "buttons": [
      {
        "buttonName": "Primary Effects",
        "buttonIcon": "",
        "onClick": [
          {
            "type": "openForm",
            "form": "alchemy.reagents.primary"
          }
        ]
      },
      {
        "buttonName": "Secondary Effects",
        "buttonIcon": "",
        "onClick": [
          {
            "type": "openForm",
            "form": "alchemy.reagents.secondary"
          }
        ]
      },
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "alchemy.frontPage"
          }
        ]
      }
    ]
  },
  "alchemy.reagents.primary": {
    "title": "Primary Effects",
    "body": "When a reagent is added to the witching pot, it becomes apart of the potion and is taken into \n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "alchemy.reagents"
          }
        ]
      }
    ]
  },
  "alchemy.reagents.secondary": {
    "title": "Secondary Effects",
    "body": "After the first reagent goes into the witching pot, all other reagents will use their §asecondary effect§r to alter its primary effects. This secondary effect affects certain potion effects within the witching pot, and these are considered §aValid Effects§r.\n\nThere are 4 types of secondary effects:\n§lAmplifiers§r §aincrease the power of Valid Effects up to a maximum of III.§r\n§lExtenders§r §aincrease the durations of Valid Effects.§r\n§lCorruptors§r §areverse Valid Effects and change them into others.§r\n§lNullifiers§r §acompletely remove Valid Effects from the witching pot altogether.§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "alchemy.reagents"
          }
        ]
      }
    ]
  },
  "alchemy.brewing": {
    "title": "Brewing",
    "body": "Brewing is a §agame of potency§r. How potent a reagent is controls the effects a §dStrange Potion§r gives. Thankfully, every ingredient affects the potency of all the reagents inside it, so increasing and decreasing\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "alchemy.frontPage"
          }
        ]
      }
    ]
  },
  "alchemy.crystals": {
    "title": "Crystallization",
    "body": "Each ingredient is connected to one of the 5 primal elements in some way. When added to a witching pot, these elements can be extracted and crystallized.\n\nThe 5 Primal Energies are Solar, Lunar, Earth, Sky, and Ender. Each ingredient added to the pot will add its element as well. Their elements generally correspond with where and from what they were collected, though not always.\n\nExtracting these energies needs either Quartz or Amethyst Shards. Simply interact with the Pot with one in hand and the potion will evaporate and turn into Primal Crystals.\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "alchemy.frontPage"
          }
        ]
      }
    ]
  },
  
  "ceremony.frontPage": {
    "title": "Occult Ceremonies",
    "body": "Ceremonies are another important part of a witch's power. They subtly influence the world and create some kind of change. There are a few things you do have to understand though. This section explains them.\n\n",
    "buttons": [
      {
        "buttonName": "Ritual Slates",
        "buttonIcon": "textures/book_icons/rune_celestia",
        "onClick": [
          {
            "type": "openForm",
            "form": "ceremony.slates"
          }
        ]
      },
      {
        "buttonName": "Candles",
        "buttonIcon": "textures/items/candles/candle",
        "onClick": [
          {
            "type": "openForm",
            "form": "ceremony.candles"
          }
        ]
      },
      {
        "buttonName": "Runic Formations",
        "buttonIcon": "textures/book_icons/urrican_pattern",
        "onClick": [
          {
            "type": "openForm",
            "form": "ceremony.formations"
          }
        ]
      },
      {
        "buttonName": "Ceremony-Bound Scrolls",
        "buttonIcon": "textures/items/scrolls/earth_inscribed_scroll",
        "onClick": [
          {
            "type": "openForm",
            "form": "ceremony.scrolls"
          }
        ]
      },
      {
        "buttonName": "Orbos",
        "buttonIcon": "textures/book_icons/primal_orb",
        "onClick": [
          {
            "type": "openForm",
            "form": "ceremony.orbos"
          }
        ]
      },
      {
        "buttonName": "Fatigue",
        "buttonIcon": "textures/book_icons/fatigue_poison",
        "onClick": [
          {
            "type": "openForm",
            "form": "ceremony.fatigue"
          }
        ]
      },
      {
        "buttonName": "Ceremonies",
        "buttonIcon": "textures/book_icons/urrican_pattern",
        "onClick": [
          {
            "type": "openForm",
            "form": "rituals.list"
          }
        ]
      },
      {
        "buttonName": "Wards",
        "buttonIcon": "textures/ui/resistance_effect",
        "onClick": [
          {
            "type": "openForm",
            "form": "wards.frontPage"
          }
        ]
      },
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "mainPage"
          }
        ]
      }
    ]
  },
  "ceremony.slates": {
    "title": "Ritual Slates",
    "body": "Ritual slates are blocks that can be crafted in the Witch's Workbench. They can be inscribed with §aChalk Powder§r and these inscriptions can be erased using §aWool§r. A witch can also change the white chalk inscriptions using a §aWand§r.\n\nA ritual slate marked with §cred chalk powder§r §arepresents the center of a ceremony§r. The slates marked with white form §amystical patterns§r around this \"center\" slate that §adetermine the kind of rituals that can be performed in the space§r. These patterns are considered §aRunic Formations§r.\n\nBeginning (activating) any ceremony requires the player to interact with the center slate using a wand or stick while all the ritual items are dropped within a 3x3 area of it. §aYou will only §oever§r§a need 1 of each item§r; dropping more than one is unnecessary waste.\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "ceremony.frontPage"
          }
        ]
      }
    ]
  },
  "ceremony.candles": {
    "title": "Candles",
    "body": "Candles are optional additions to a ceremony. They are normally used to increase their area of effect and the influence of their powers (where possible). Not all ceremonies make use candles, and different candles can do different things in different ceremonies.\n\nThey are generally placed in the 8 blocks immediately around the central ritual slate. The more spaces that has a candle, the more powerful the ritual that uses them will be. Rest easy however, they are again optional and all ceremonies that might use them will state so, along with the color required.\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "ceremony.frontPage"
          }
        ]
      }
    ]
  },
  "ceremony.formations": {
    "title": "Ritual Formations",
    "body": "Runic formations are essential for a ceremony, in most cases. That can make them a bit difficult to move around, but there will be more on that later. Here are the various runic formations that exist.\n\n",
    "buttons": [
      {
        "buttonName": "Spiral of Urrican",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "ceremony.formations.urrican"
          }
        ]
      },
      {
        "buttonName": "Crest of Transmutation",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "ceremony.formations.transmutation"
          }
        ]
      },
      {
        "buttonName": "Circle of Duality",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "ceremony.formations.duality"
          }
        ]
      },
      {
        "buttonName": "Star of Nathe",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "ceremony.formations.conjure"
          }
        ]
      },
      {
        "buttonName": "Mark of Hebaya",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "ceremony.formations.enchantment"
          }
        ]
      },
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "ceremony.frontPage"
          }
        ]
      }
    ]
  },
  "ceremony.formations.urrican": {
    "title": "Spiral of Urrican",
    "body": "\n\n\n                \n\n\n\n\nThe simplest formation that is able to exercise some power over the skies. It is often used to conjure and banish storms.\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "ceremony.formations"
          }
        ]
      }
    ]
  },
  "ceremony.formations.transmutation": {
    "title": "Crest of Transmutation",
    "body": "\n\n\n                \n\n\n\n\nA formation that pulls on the land to change the properties of the targeted item/block(s). It can also be used to dowse for the minerals and liquids of the earth.\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "ceremony.formations"
          }
        ]
      }
    ]
  },
  "ceremony.formations.duality": {
    "title": "Circle of Duality",
    "body": "\n\n\n                \n\n\n\n\nThis runic circle focuses on the powers of \"light\" and \"dark\" in the magickal sense. It is said that this circle can both cleanse and curse, though most don't remember the rituals.\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "ceremony.formations"
          }
        ]
      }
    ]
  },
  "ceremony.formations.conjure": {
    "title": "Star of Nathe",
    "body": "\n\n\n                \n\n\n\n\nThis formation is one of the more famous runic circles. It is used to summon entities and travel vast distances in the blink of an eye.\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "ceremony.formations"
          }
        ]
      }
    ]
  },
  "ceremony.formations.enchantment": {
    "title": "Mark of Hebaya",
    "body": "\n\n\n                \n\n\n\n\nA runic circle named after the Hag of the Night and Witch of the Wylde. Despite this, this circle deals with enchantment and witch bonds.\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "ceremony.formations"
          }
        ]
      }
    ]
  },
  "ceremony.scrolls": {
    "title": "Ceremony-Bound Scrolls",
    "body": "Even the most practiced witch wishes to move about with their rites, and that is where scrolls can help.\n\nBy naming a §aBlank Scroll§r the name of a formation, you can then interact with that runic formation in the world (if it is set-up correctly) to seal its ceremony casting powers in the scroll. The names can be found in the previously read §aRitual Formations§r section.\n\nCeremony-Bound Scrolls can be used up to 6 times. All that a witch needs is a central slate (ritual slate inscribed with red chalk), the ritual materials and any other needed blocks, entity etc. Then, instead of using a wand, the scroll is used to activate the ritual. The ritual will trigger if the right ritual formation is bound to the scroll.\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "ceremony.formations"
          }
        ]
      }
    ]
  },
  "ceremony.orbos": {
    "title": "Orbos",
    "body": "§aOrbos§r is the energy used by witches to employ ceremonies. This energy is not natural to you, so you must gather it from natural sources. A few ways are by:\n- §aeating mystical foods (§gGolden Apples§a, §gGlowberries§a, §gGolden Carrots§a, etc).\n- §aKilling undead with an athame.§r\n- §aUsing a wand to channel the energies of the New/Full Moon into yourself.§r\n\nSimply holding a wand is enough for you to get a feel for how much Orbos you've absorbed.\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "ceremony.frontPage"
          }
        ]
      }
    ]
  },
  "ceremony.fatigue": {
    "title": "Fatigue",
    "body": "While using Orbos seems completely harmless, it is §onot§r. Every time a large burst of this occult energy is used, some level of §aFatigue§r comes along with it. If a witch pushes too far past the limits of their Fatigue, they will perish. Fortunately, accumulated Fatigue §adecreases over time§r and §adecreases even faster when the player is sleeping§r.\n\n§lChecking Fatigue§r\nFatigue has no numeric value a witch can look at. Instead, they must watch out for the telling signs of high fatigue.\n\nFirstly, the player becomes weaker and slower. If they keep pushing themselves further, it starts to affect their perception of their environment. Their vision starts blinking and they may be prone to otherworldly noises and phantasms. This serves as an important indicator that performing ceremonies during this time can be dangerous. If all these signs are ignored, §cthe Wylde will consume the witch§r, along with all the Orbos they have collected.\n\n§lCeremonies & Fatigue§r\nPerforming ceremonies accumulates fatigue. The amount cannot truly be determined but a rough estimate is noted down on each ceremony entry.\n§2Low§r => under 30% is accumulated.\n§6Mid§r => 30-49% is accumulated.\n§cHigh§r => 50% and over is accumulated.\n\nAs stated before, §aif a witch surpasses 130% of their fatigue, they will simply perish§r.\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "ceremony.frontPage"
          }
        ]
      }
    ]
  },
  
  "reagents.list": {
    "title": "Reagents",
    "body": "",
    "buttons": [
      {
        "buttonName": "Crushed Dandelion",
        "buttonIcon": "textures/items/dusts/dandelion_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.list.dandelionDust"
          }
        ]
      },
      {
        "buttonName": "Crushed Poppy",
        "buttonIcon": "textures/items/dusts/poppy_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.list.poppyDust"
          }
        ]
      },
      {
        "buttonName": "Crushed Blue Orchid",
        "buttonIcon": "textures/items/dusts/azure_bluet_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.list.blueOrchidDust"
          }
        ]
      },
      {
        "buttonName": "Fermented Spider Eye",
        "buttonIcon": "textures/items/spider_eye_fermented",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.list.spiderEye"
          }
        ]
      },
      {
        "buttonName": "Crushed Cornflower",
        "buttonIcon": "textures/items/dusts/cornflower_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.list.cornflowerDust"
          }
        ]
      },
      {
        "buttonName": "Crushed Oxeye Daisy",
        "buttonIcon": "textures/items/dusts/oxeye_daisy_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.list.oxeyeDaisyDust"
          }
        ]
      },
      {
        "buttonName": "Wither Rose",
        "buttonIcon": "textures/blocks/flower_wither_rose",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.list.witherRose"
          }
        ]
      },
      {
        "buttonName": "Coal Dust",
        "buttonIcon": "textures/items/dusts/coal_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.list.coalDust"
          }
        ]
      },
      {
        "buttonName": "Feather",
        "buttonIcon": "textures/items/feather",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.list.feather"
          }
        ]
      },
      {
        "buttonName": "Phantom Membrane",
        "buttonIcon": "textures/items/phantom_membrane",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.list.phantomMembrane"
          }
        ]
      },
      {
        "buttonName": "Gold Ingot",
        "buttonIcon": "textures/items/gold_ingot",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.list.goldIngot"
          }
        ]
      },
      {
        "buttonName": "Iron Ingot",
        "buttonIcon": "textures/items/iron_ingot",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.list.ironIngot"
          }
        ]
      },
      {
        "buttonName": "Scute",
        "buttonIcon": "textures/items/turtle_shell_piece",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.list.scute"
          }
        ]
      },
      {
        "buttonName": "Prismarine Crystals",
        "buttonIcon": "textures/items/prismarine_crystals",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.list.prismarineCrystals"
          }
        ]
      },
      {
        "buttonName": "Nautilus Shell",
        "buttonIcon": "textures/items/nautilus",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.list.nautilusShell"
          }
        ]
      },
      {
        "buttonName": "Ghast Tear",
        "buttonIcon": "textures/items/ghast_tear",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.list.ghastTear"
          }
        ]
      },
      {
        "buttonName": "Echo Shard",
        "buttonIcon": "textures/items/echo_shard",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.list.echoShard"
          }
        ]
      },
      {
        "buttonName": "Amethyst Dust",
        "buttonIcon": "textures/items/dusts/ender_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.list.amethystDust"
          }
        ]
      },
      {
        "buttonName": "Magma Cream",
        "buttonIcon": "textures/items/magma_cream",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.list.magmaCream"
          }
        ]
      },
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "alchemy.frontPage"
          }
        ]
      }
    ]
  },
  "reagents.list.dandelionDust": {
    "title": "Crushed Dandelion",
    "body": "§dReagent:§r Crushed Dandelion\n§dPrimal Element:§r §7Sky§r\n§a(+) Saturation I (0:02)§r\n§a(+) Speed I (1:00)§r\n\n§dSecondary Effect Type:§r Amplifier\n§dValid Effects:§r Speed, Haste, Levitation\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.list"
          }
        ]
      }
    ]
  },
  "reagents.list.poppyDust": {
    "title": "Crushed Poppy",
    "body": "§dReagent:§r Crushed Poppy\n§dPrimal Element:§r §6Solar§r\n§a(+) Night Vision I (1:00)§r\n§c(-) Nausea II (0:30)§r\n§a(+) Regeneration I (0:30)§r\n\n§dSecondary Effect Type:§r Extender (1:00)\n§dValid Effects:§r Absorption, Regeneration, Nausea\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.list"
          }
        ]
      }
    ]
  },
  "reagents.list.blueOrchidDust": {
    "title": "Crushed Blue Orchid",
    "body": "§dReagent:§r Crushed Blue Orchid\n§dPrimal Element:§r §bLunar§r\n§a(+) Saturation II (0:03)§r\n§c(-) Slowness II (0:45)§r\n§e(×) Levitation I (0:10)§r\n\n§dSecondary Effect Type:§r Nullifier\n§dValid Effects:§r Slowness, Weakness\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.list"
          }
        ]
      }
    ]
  },
  "reagents.list.spiderEye": {
    "title": "Fermented Spider Eye",
    "body": "§dReagent:§r Fermented Spider Eye\n§dPrimal Element:§r §5Ender§r\n§c(-) Poison II (0:30)§r\n§c(-) Weakness II (0:30)§r\n\n§dSecondary Effect Type:§r Corruptor\n§dValid Effects:§r Regeneration, Instant Health, Strength, Haste, Levitation\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.list"
          }
        ]
      }
    ]
  },
  "reagents.list.cornflowerDust": {
    "title": "Crushed Cornflower",
    "body": "§dReagent:§r Crushed Cornflower\n§dPrimal Element:§r §7Sky§r\n§a(+) Jump Boost II (1:00)§r\n§c(-) Weakness I (1:00)§r\n§a(+) Slow Falling I (1:00)§r\n\n§dSecondary Effect Type:§r Extender (1:30)\n§dValid Effects:§r Weakness, Slow Falling, Slowness, Mining Fatigue\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.list"
          }
        ]
      }
    ]
  },
  "reagents.list.oxeyeDaisyDust": {
    "title": "Crushed Oxeye Daisy",
    "body": "§dReagent:§r Crushed Oxeye Daisy\n§dPrimal Element:§r §6Solar§r\n§a(+) Regeneration I (0:50)§r\n§c(-) Weakness II (0:40)§r\n\n§dSecondary Effect Type:§r Amplifier\n§dValid Effects:§r Regeneration, Instant Health, Slowness, Weakness\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.list"
          }
        ]
      }
    ]
  },
  "reagents.list.witherRose": {
    "title": "Wither Rose",
    "body": "§dReagent:§r Wither Rose\n§dPrimal Element:§r §5Ender§r\n§c(-) Wither II (0:15)§r\n§c(-) Instant Damage I (0:01)§r\n\n§dSecondary Effect Type:§r Extender (0:15)\n§dValid Effects:§r Wither, Poison\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.list"
          }
        ]
      }
    ]
  },
  "reagents.list.coalDust": {
    "title": "Coal Dust",
    "body": "§dReagent:§r Coal Dust\n§dPrimal Element:§r §2Earth§r\n§c(-) Blindness I (0:45)§r\n§c(-) Darkness I (0:30)§r\n\n§dSecondary Effect Type:§r Nullifier\n§dValid Effects:§r Wither, Poison\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.list"
          }
        ]
      }
    ]
  },
  "reagents.list.feather": {
    "title": "Feather",
    "body": "§dReagent:§r Feather\n§dPrimal Element:§r §7Sky§r\n§a(+) Slow Falling I (1:30)§r\n§e(×) Levitation I (0:20)§r\n§c(-) Slowness I (1:30)§r\n\n§dSecondary Effect Type:§r Amplifier\n§dValid Effects:§r Jump Boost, Levitation, Slowness\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.list"
          }
        ]
      }
    ]
  },
  "reagents.list.phantomMembrane": {
    "title": "Phantom Membrane",
    "body": "§dReagent:§r Phantom Membrane\n§dPrimal Element:§r §7Sky§r\n§a(+) Slow Falling I (1:30)§r\n§a(+) Night Vision I (1:30)§r\n§c(-) Poison I (0:30)§r\n\n§dSecondary Effect Type:§r Extender (0:45)\n§dValid Effects:§r Slow Falling, Jump Boost\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.list"
          }
        ]
      }
    ]
  },
  "reagents.list.goldIngot": {
    "title": "Gold Ingot",
    "body": "§dReagent:§r Gold Ingot\n§dPrimal Element:§r §2Earth§r\n§a(+) Absorption I (1:00)§r\n§a(+) Resistance I (1:00)§r\n§c(-) Slowness II (1:45)§r\n\n§dSecondary Effect Type:§r Corruptor\n§dValid Effects:§r Weakness, Poison, Slowness\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.list"
          }
        ]
      }
    ]
  },
  "reagents.list.ironIngot": {
    "title": "Iron Ingot",
    "body": "§dReagent:§r Gold Ingot\n§dPrimal Element:§r §2Earth§r\n§a(+) Resistance I (0:30)§r\n§a(+) Strength I (0:40)§r\n§c(-) Slowness II (1:00)§r\n\n§dSecondary Effect Type:§r Extender (1:00)\n§dValid Effects:§r Resistance, Strength, Slowness\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.list"
          }
        ]
      }
    ]
  },
  "reagents.list.scute": {
    "title": "Scute",
    "body": "§dReagent:§r Scute\n§dPrimal Element:§r §bLunar§r\n§a(+) Water Breathing I (1:30)§r\n§a(+) Speed I (1:30)§r\n\n§dSecondary Effect Type:§r Amplifier\n§dValid Effects:§r Resistance, Absorption, Slowness\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.list"
          }
        ]
      }
    ]
  },
  "reagents.list.prismarineCrystals": {
    "title": "Prismarine Crystals",
    "body": "§dReagent:§r Prismarine Crystals\n§dPrimal Element:§r §bLunar§r\n§a(+) Conduit Power I (1:15)§r\n§c(-) Mining Fatigue I (1:15)§r\n\n§dSecondary Effect Type:§r Corruptor\n§dValid Effects:§r Haste, Speed, Instant Health, Regeneration\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.list"
          }
        ]
      }
    ]
  },
  "reagents.list.nautilusShell": {
    "title": "Nautilus Shell",
    "body": "§dReagent:§r Nautilus Shell\n§dPrimal Element:§r §bLunar§r\n§a(+) Water Breathing I (1:00)§r\n§a(+) Speed I (0:45)§r\n§a(+) Health Boost I (1:00)§r\n\n§dSecondary Effect Type:§r Nullifier\n§dValid Effects:§r Mining Fatigue, Wither, Absorption\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.list"
          }
        ]
      }
    ]
  },
  "reagents.list.ghastTear": {
    "title": "Ghast Tear",
    "body": "§dReagent:§r Ghast Tear\n§dPrimal Element:§r §6Solar§r\n§a(+) Regeneration II (1:00)§r\n§a(+) Health Boost II (0:45)§r\n§a(+) Instant Health I (0:01)§r\n\n§dSecondary Effect Type:§r Corruptor\n§dValid Effects:§r Mining Fatigue, Wither, Slowness, Instant Damage, Weakness\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.list"
          }
        ]
      }
    ]
  },
  "reagents.list.echoShard": {
    "title": "Echo Shard",
    "body": "§dReagent:§r Echo Shard\n§dPrimal Element:§r §5Ender§r\n§c(-) Darkness I (1:30)§r\n§c(-) Weakness II (0:45)§r\n\n§dSecondary Effect Type:§r Amplifier\n§dValid Effects:§r Weakness, Blindness, Darkness\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.list"
          }
        ]
      }
    ]
  },
  "reagents.list.amethystDust": {
    "title": "Amethyst Dust",
    "body": "§dReagent:§r Amethyst Dust\n§dPrimal Element:§r §5Ender§r\n§a(+) Haste II (1:00)§r\n§c(-) Slowness I (0:45)§r\n\n§dSecondary Effect Type:§r Amplifier\n§dValid Effects:§r Mining Fatigue, Speed, Jump Boost\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.list"
          }
        ]
      }
    ]
  },
  "reagents.list.magmaCream": {
    "title": "Magma Cream",
    "body": "§dReagent:§r Magma Cream\n§dPrimal Element:§r §6Solar§r\n§a(+) Fire Resistance I (1:00)§r\n§c(-) Weakness II (0:45)§r\n\n§dSecondary Effect Type:§r Extender (1:15)\n§dValid Effects:§r Fire Resistance, Resistance, Slowness\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.list"
          }
        ]
      }
    ]
  },
  
  "rituals.list": {
    "title": "Ceremonies",
    "body": "",
    "buttons": [
      {
        "buttonName": "Blessing of Rain",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "rituals.list.summonRain"
          }
        ]
      },
      {
        "buttonName": "Clearing of the Clouds",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "rituals.list.banishRain"
          }
        ]
      },
      {
        "buttonName": "Howling of the Aerials",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "rituals.list.summonThunder"
          }
        ]
      },
      {
        "buttonName": "Lesser Rite of Cleansing",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "rituals.list.lesserCleanse"
          }
        ]
      },
      {
        "buttonName": "Greater Rite of Cleansing",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "rituals.list.greaterCleanse"
          }
        ]
      },
      {
        "buttonName": "Rite of Malicious Reflection",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "rituals.list.reflection"
          }
        ]
      },
      {
        "buttonName": "Call Through The End",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "rituals.list.endCall"
          }
        ]
      },
      {
        "buttonName": "Conjuring By The Spacial Crossroads",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "rituals.list.summonCreature"
          }
        ]
      },
      {
        "buttonName": "Call of the Wild",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "rituals.list.wildCall"
          }
        ]
      },
      {
        "buttonName": "Rite of Traveling",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "rituals.list.travelRite"
          }
        ]
      },
      {
        "buttonName": "Rite of Faerie Commune",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "rituals.list.faeConjure"
          }
        ]
      },
      {
        "buttonName": "Severing of Fae Bonds",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "rituals.list.faeBanish"
          }
        ]
      },
      {
        "buttonName": "Equin's Heralding of Autumn",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "rituals.list.autumnHerald"
          }
        ]
      },
      {
        "buttonName": "Mineral Exchange Ritual",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "rituals.list.mineralExchange"
          }
        ]
      },
      {
        "buttonName": "Rite of Droughts",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "rituals.list.droughtRite"
          }
        ]
      },
      {
        "buttonName": "Rite of Dowsing",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "rituals.list.dowsingRite"
          }
        ]
      },
      {
        "buttonName": "Rite of Warding",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "rituals.list.wardingRite"
          }
        ]
      },
      {
        "buttonName": "Enchant",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "rituals.list.enchant"
          }
        ]
      },
      {
        "buttonName": "Enchanting of the Broom",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "rituals.list.broomEnchant"
          }
        ]
      },
      {
        "buttonName": "Shifting of the Hourglass: Solar Shift",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "rituals.list.solarShift"
          }
        ]
      },
      {
        "buttonName": "Shifting of the Hourglass: Lunar Shift",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "rituals.list.lunarShift"
          }
        ]
      },
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "ceremony.frontPage"
          }
        ]
      }
    ]
  },
  "rituals.list.summonRain": {
    "title": "Blessing of Rain",
    "body": "§aRitual Items:§r Crushed Cornflower, Crushed Fern, Sky Crystal, Lunar Crystal & Water Bottle\n§aFormation:§r Spiral of Urrican\n§aOrbos Cost:§r 50\n§aFatigue:§r §2Low§r\n§aRitual Type:§r Weather, Water, Conjuration\n\n§oA rite designed to call down pouring rain by requesting aid from the Aerials.§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "rituals.list"
          }
        ]
      }
    ]
  },
  "rituals.list.banishRain": {
    "title": "Clearing of the Clouds",
    "body": "§aRitual Items:§r Crushed Oxeye Daisy, Crushed Fern, Sky Crystal, Solar Crystal & Sunflower\n§aFormation:§r Spiral of Urrican\n§aOrbos Cost:§r 35\n§aFatigue:§r §2Low§r\n§aRitual Type:§r Weather, Conjuration\n\n§oA ceremony that banishes rain and thunderstorms.§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "rituals.list"
          }
        ]
      }
    ]
  },
  "rituals.list.summonThunder": {
    "title": "Howling of the Aerials",
    "body": "§aRitual Items:§r Copper Ingot, Crushed Fern, Sky Crystal, Crushed Dandelion & Crushed Cornflower\n§aFormation:§r Spiral of Urrican\n§aOrbos Cost:§r 50\n§aFatigue:§r §2Low§r\n§aRitual Type:§r Weather, Fire, Water, Conjuration\n\n§oA powerful rite that incites anger and rage in the surrounding Aerials, causing a large thunderstorm to take form.§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "rituals.list"
          }
        ]
      }
    ]
  },
  "rituals.list.lesserCleanse": {
    "title": "Lesser Rite of Cleansing",
    "body": "§aRitual Items:§r Crushed Oxeye Daisy, Bottle O' Blood (Target), Solar Crystal & Milk Bucket\n§aFormation:§r Circle of Duality\n§aOrbos Cost:§r 60\n§aFatigue:§r §2Low§r\n§aRitual Type:§r Esoteric, Abjuration\n\n§oA minor rite used to banish hexes and curses. It also removes any potion effects on the target of the ritual (defined by the Blood provided). However, it is not a fool-proof method. Maladies are stickier than you think.§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "rituals.list"
          }
        ]
      }
    ]
  },
  "rituals.list.greaterCleanse": {
    "title": "Greater Rite of Cleansing",
    "body": "§aRitual Items:§r Glowstone Dust, Diamond, Bottle O' Blood (Target), Solar Crystal & Milk Bucket\n§aFormation:§r Circle of Duality\n§aOrbos Cost:§r 80\n§aFatigue:§r §6Mid§r\n§aRitual Type:§r Esoteric, Abjuration\n\n§oA major rite used to banish hexes and curses. It removes any potion effects on the one who performed the ritual. Hexes are almost always dispelled when using this rite, but curses can still be a challenge.§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "rituals.list"
          }
        ]
      }
    ]
  },
  "rituals.list.reflection": {
    "title": "Rite of Malicious Reflection",
    "body": "§aRitual Items:§r Bottle O' Blood (Target), Lunar Crystal & Glass Pane\n§aFormation:§r Circle of Duality\n§aOrbos Cost:§r 800\n§aFatigue:§r §6Mid§r\n§aRitual Type:§r Esoteric, Abjuration\n\n§oA major rite used to reflect hexes and early-stage curses. They are returned to their sender and removed from the target when successful.§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "rituals.list"
          }
        ]
      }
    ]
  },
  "rituals.list.endCall": {
    "title": "Call Through The End",
    "body": "§aRitual Items:§r Ender Pearl, Amethyst Shard, Bottle O' Blood (Target) & Ender Crystal\n§aFormation:§r Star of Nathe\n§aOrbos Cost:§r 200\n§aFatigue:§r §6Mid§r\n§aRitual Type:§r Esoteric, Conjuration\n\n§oA ceremony designed to conjure the target (defined by Blood) into the circle. The target must be valid (alive, loaded, etc) for this rite to work. The ender pearl is used as a focus and is therefore not consumed when the rite is being performed.§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "rituals.list"
          }
        ]
      }
    ]
  },
  "rituals.list.summonCreature": {
    "title": "Conjuring By The Spatial Crossroads",
    "body": "§aRitual Items:§r Ender Pearl, Diamond, Bottle O' Blood (Target) & Ender Crystal\n§aFormation:§r Star of Nathe\n§aOrbos Cost:§r 1000\n§aFatigue:§r §cHigh§r\n§aRitual Type:§r Esoteric, Conjuration\n\n§oA powerful ceremony that creates a new being from the taglock of the old. This does not work on players, but there have been known to be Witches that have used this rite to sew chaos and conjure what should not be.§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "rituals.list"
          }
        ]
      }
    ]
  },
  "rituals.list.wildCall": {
    "title": "Call of the Wild",
    "body": "§aRitual Items:§r Wheat, Wheat Seeds, Beetroot & Ender Crystal\n§aFormation:§r Star of Nathe\n§aOrbos Cost:§r 100\n§aFatigue:§r §2Low§r\n§aRitual Type:§r Esoteric, Conjuration\n\n§oA minor druidic ceremony that conjures all the mobs in a 100 block radius into the ritual area.§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "rituals.list"
          }
        ]
      }
    ]
  },
  "rituals.list.travelRite": {
    "title": "Rite of Traveling",
    "body": "§aRitual Items:§r Ender Pearl & Ender Crystal\n§aFormation:§r Star of Nathe\n§aOrbos Cost:§r 200\n§aFatigue:§r §6Mid§r\n§aRitual Type:§r Esoteric, Conjuration\n\n§oA somewhat common rite used to travel to the location named on the Ender Pearl. The Ender Pearl must be named the coordinates of the location the casting witch wants to go.\n\nAfter this, anybody that will be traveling goes into the center of the ritual area to be transported to the location stated.§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "rituals.list"
          }
        ]
      }
    ]
  },
  "rituals.list.faeConjure": {
    "title": "Rite of Faerie Commune",
    "body": "§aRitual Items:§r Bread, Honey Bottle & Apple\n§aFormation:§r Star of Nathe\n§aOrbos Cost:§r 800\n§aFatigue:§r §6High§r\n§aRitual Type:§r Binding, Celestial, Conjuration\n\n§oA ceremony designed to call forth the Fae. Any Faerie that deigns to answer forms a Pact with the Witch that performed the Commune. The Faeries that consider answering this call varies based on the time of the day, and no Greater Faerie will pay this binding ceremony any mind.\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "rituals.list"
          }
        ]
      }
    ]
  },
  "rituals.list.faeBanish": {
    "title": "Severing of Fae Bonds",
    "body": "§aRitual Items:§r Spirit Totem, Obsidian Dust & Sword\n§aFormation:§r Star of Nathe\n§aOrbos Cost:§r 800\n§aFatigue:§r §6High§r\n§aRitual Type:§r Esoteric, Celestial, Abjuration\n\n§oA ceremony designed to sever the pact a casting Witch has made with the Faerie that gave the Spirit Totem. This ceremony doesn't cause any ill effects to befall them after the pact is severed.\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "rituals.list"
          }
        ]
      }
    ]
  },
  "rituals.list.autumnHerald": {
    "title": "Equin's Heralding of Autumn",
    "body": "§aRitual Items:§r Bone Meal, Crushed Fern, Earth Crystal & Rotten Flesh\n§aFormation:§r Crest of Transmutation\n§aOrbos Cost:§r 150\n§aFatigue:§r §2Low§r\n§aCandle Type:§r Green Candles\n§aRitual Type:§r Transmutation, Plant\n\n§oA ceremony that calls upon the Chlorophae, spirits of gardens and growing plants. Plants within the range will grow instantly on ritual completion.§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "rituals.list"
          }
        ]
      }
    ]
  },
  "rituals.list.mineralExchange": {
    "title": "Mineral Exchange Ritual",
    "body": "§aRitual Items:§r Natural Ash, Earth Crystal & Honey Bottle\n§aFormation:§r Crest of Transmutation\n§aOrbos Cost:§r 300\n§aFatigue:§r §2Low§r\n§aCandle Type:§r Yellow Candles\n§aRitual Type:§r Transmutation, Mineral\n\n§oA ceremony that changes blocks of ore and mineral in range into a higher material's ore, eg. a block of raw copper would become iron ore, a block of raw iron would become gold ore, etc.§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "rituals.list"
          }
        ]
      }
    ]
  },
  "rituals.list.droughtRite": {
    "title": "Rite of Droughts",
    "body": "§aRitual Items:§r Sand, Solar Crystal & Coal Dust\n§aFormation:§r Crest of Transmutation\n§aOrbos Cost:§r 150\n§aFatigue:§r §2Low§r\n§aCandle Type:§r Yellow Candles\n§aRitual Type:§r Transmutation, Fire\n\n§oA ritual erases water in an area. It actually destroys water so be careful.§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "rituals.list"
          }
        ]
      }
    ]
  },
  "rituals.list.dowsingRite": {
    "title": "Rite of Dowsing",
    "body": "§aRitual Items:§r Natural Ash, Crushed Dandelion, Earth Crystal & Coal Dust\n§aFormation:§r Crest of Transmutation\n§aOrbos Cost:§r 150\n§aFatigue:§r §2Low§r\n§aRitual Type:§r Divination, Mineral\n\n§oA ritual that searches for ore in a small area. When ore is found, a particle display will happen above the block on the same y level that the ritual was performed. As a result, it is recommended to perform this ritual in a large flat area.§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "rituals.list"
          }
        ]
      }
    ]
  },
  "rituals.list.wardingRite": {
    "title": "Rite of Dowsing",
    "body": "§aRitual Items:§r Redstone, Iron Ingot, Gold Ingot, Earth Crystal & Quartz\n§aFormation:§r Crest of Transmutation\n§aOrbos Cost:§r 600\n§aFatigue:§r §6Mid§r\n§aCandle Type:§r Red Candles\n§aRitual Type:§r Abjuration, Transmutation, Mineral\n\n§oA complex rite that is set up to influence the entities over an area magickally. It is the only rite that requires a chest under the center slate, and is a continuous ritual. It is generally performed for the sake of protection but with how modular this ritual is, it can accomplish other things as well.\n\nThe Art of Warding is a complex topic that cannot fit in here. For more information on how to properly set one up, find the entry called §aWarding§r§o.§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "rituals.list"
          }
        ]
      }
    ]
  },
  "rituals.list.enchant": {
    "title": "Enchant",
    "body": "§aRitual Items:§r Book, Lapis Lazuli & Lunar Crystal\n§aFormation:§r Mark of Hebaya\n§aOrbos Cost:§r 500\n§aFatigue:§r §6Mid§r\n§aRitual Type:§r Esoteric, Binding\n\n§oA major rite that allows a random enchanted book to be conjured. What this book contains cannot be predicted.§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "rituals.list"
          }
        ]
      }
    ]
  },
  "rituals.list.broomEnchant": {
    "title": "Enchanting of the Broom",
    "body": "§aRitual Items:§r Wheat, Stick & Sky Crystal\n§aFormation:§r Mark of Hebaya\n§aOrbos Cost:§r 400\n§aFatigue:§r §6Mid§r\n§aRitual Type:§r Esoteric, Binding\n\n§oA minor rite that uses the provided materials to create a §aNormal Broom§r§o. The Broom can be made to rise/fall by looking up/down while holding down the jump button.§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "rituals.list"
          }
        ]
      }
    ]
  },
  "rituals.list.solarShift": {
    "title": "Shifting of the Hourglass: Solar Shift",
    "body": "§aRitual Items:§r Crushed Poppy, Sunflower, Natural Ash, Sand & Solar Crystal\n§aFormation:§r Mark of Hebaya\n§aOrbos Cost:§r 500\n§aFatigue:§r §6Mid§r\n§aRitual Type:§r Esoteric, Celestial\n\n§oA major ceremony that changes the natural time and sets the world to its dawn.§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "rituals.list"
          }
        ]
      }
    ]
  },
  "rituals.list.lunarShift": {
    "title": "Shifting of the Hourglass: Lunar Shift",
    "body": "§aRitual Items:§r Crushed Poppy, Sunflower, Natural Ash, Sand & Lunar Crystal\n§aFormation:§r Mark of Hebaya\n§aOrbos Cost:§r 500\n§aFatigue:§r §6Mid§r\n§aRitual Type:§r Esoteric, Celestial\n\n§oA major ceremony that changes the natural time and sets the world to its dusk.§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "rituals.list"
          }
        ]
      }
    ]
  },
  
  "curses.list": {
    "title": "Mystical Maladies",
    "body": "A witch is a weaver of magick, a dancer within the song of otherworldly power, an orator of arcane will. However, we (or should I say, you) do not have much power when it comes to combatative magicks [yet].\n\nAlthough this is true, when we want to cause prolonged harm or annoyance, there is no better solution than our magick. That is where the power of Hexes and Curses come truly shines after all. I, the Mistress of Maledictions, will guide you in the arts of the baneful, the destructive §oand§r the annoying.\n\n",
    "buttons": [
      {
        "buttonName": "Hexing Rite of Sinking",
        "buttonIcon": "textures/items/dusts/coal_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "curses.list.sinking"
          }
        ]
      },
      {
        "buttonName": "Hexing Rite of Ignition",
        "buttonIcon": "textures/items/dusts/coal_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "curses.list.ignition"
          }
        ]
      },
      {
        "buttonName": "Hexing Rite of the Copper Soul",
        "buttonIcon": "textures/items/dusts/coal_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "curses.list.lightning"
          }
        ]
      },
      {
        "buttonName": "Hexing Rite of Brittle Bones",
        "buttonIcon": "textures/items/dusts/coal_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "curses.list.brittle"
          }
        ]
      },
      {
        "buttonName": "Hexing Rite of Insomnia",
        "buttonIcon": "textures/items/dusts/coal_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "curses.list.insomnia"
          }
        ]
      },
      {
        "buttonName": "Hexing Rite of the Enderman",
        "buttonIcon": "textures/items/dusts/coal_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "curses.list.enderman"
          }
        ]
      },
      {
        "buttonName": "Hexing Rite of the Creeper",
        "buttonIcon": "textures/items/dusts/coal_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "curses.list.creeper"
          }
        ]
      },
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "mainPage"
          }
        ]
      }
    ]
  },
  "curses.list.sinking": {
    "title": "Hexing Rite of Sinking",
    "body": "§aRitual Items:§r Nautilus Shell, Prismarine Crystals, Seagrass, & Bottle O' Blood (Target)\n§aFormation:§r Circle of Duality\n§aOrbos Cost:§r 800\n§aFatigue:§r §2Low§r\n§aRitual Type:§r Malice, Water\n\n§oA cursing ceremony that binds itself to the owner of the blood provided. The victim sinks uncontrollably when they come in contact with water and lava.\n\nLike most hexes, this effect can persist for up to 3 days if nothing is done to rectify it.§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "curses.list"
          }
        ]
      }
    ]
  },
  "curses.list.ignition": {
    "title": "Hexing Rite of Ignition",
    "body": "§aRitual Items:§r Blaze Powder, Fire Charge & Bottle O' Blood (Target)\n§aFormation:§r Circle of Duality\n§aOrbos Cost:§r 1000\n§aFatigue:§r §2Low§r\n§aRitual Type:§r Malice, Fire\n\n§oA cursing ceremony that binds itself to the owner of the blood provided. The victim bursts into flames at random intervals over the span of 3 days.\n\nLike most hexes, this effect can persist for up to 3 days if nothing is done to rectify it.§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "curses.list"
          }
        ]
      }
    ]
  },
  "curses.list.lightning": {
    "title": "Hexing Rite of the Copper Soul",
    "body": "§aRitual Items:§r Copper Ingot, Sky Crystal & Bottle O' Blood (Target)\n§aFormation:§r Circle of Duality\n§aOrbos Cost:§r 800\n§aFatigue:§r §2Low§r\n§aRitual Type:§r Malice, Fire\n\n§oA cursing ceremony that binds itself to the owner of the blood provided. The victim gains an unnatural affinity with lightning strikes during rainy weathers.\n\nLike most hexes, this effect can persist for up to 3 days if nothing is done to rectify it.§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "curses.list"
          }
        ]
      }
    ]
  },
  "curses.list.brittle": {
    "title": "Hexing Rite of Brittle Bones",
    "body": "§aRitual Items:§r Bone, Brick & Bottle O' Blood (Target)\n§aFormation:§r Circle of Duality\n§aOrbos Cost:§r 1000\n§aFatigue:§r §2Low§r\n§aRitual Type:§r Malice, Earth\n\n§oA cursing ceremony that binds itself to the owner of the blood provided. The victim becomes extremely susceptible to the attacks of entities, taking additional magical damage from these kinds of attacks.\n\nUnlike most hexes, this effect can persist for up to 1 and a half days if nothing is done to rectify it.§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "curses.list"
          }
        ]
      }
    ]
  },
  "curses.list.insomnia": {
    "title": "Hexing Rite of Insomnia",
    "body": "§aRitual Items:§r Phantom Membrane, Glowing Ink Sac & Bottle O' Blood (Target)\n§aFormation:§r Circle of Duality\n§aOrbos Cost:§r 1200\n§aFatigue:§r §6Mid§r\n§aRitual Type:§r Malice, Esoteric\n\n§oA cursing ceremony that binds itself to the owner of the blood provided. The victim becomes unable to sleep. This might carry unpleasant consequences.\n\nUnlike most hexes, this effect can persist for up to 5 days if nothing is done to rectify it.§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "curses.list"
          }
        ]
      }
    ]
  },
  "curses.list.enderman": {
    "title": "Hexing Rite of the Enderman",
    "body": "§aRitual Items:§r Warped Fungus, Chorus Fruit & Bottle O' Blood (Target)\n§aFormation:§r Circle of Duality\n§aOrbos Cost:§r 900\n§aFatigue:§r §6Mid§r\n§aRitual Type:§r Malice, Esoteric\n\n§oA cursing ceremony that binds itself to the owner of the blood provided. The victim teleports to some random point at random intervals over the span of 3 days.\n\nLike most hexes, this effect can persist for up to 3 days if nothing is done to rectify it.§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "curses.list"
          }
        ]
      }
    ]
  },
  "curses.list.creeper": {
    "title": "Hexing Rite of the Creeper",
    "body": "§aRitual Items:§r Gunpowder, Sand & Bottle O' Blood (Target)\n§aFormation:§r Circle of Duality\n§aOrbos Cost:§r 1200\n§aFatigue:§r §6Mid§r\n§aRitual Type:§r Malice, Fire\n\n§oA cursing ceremony that binds itself to the owner of the blood provided. The victim is forced to be afraid of contact with cats and other players. If they are not careful, their fate will be similar to an ignited Creeper.\n\nLike most hexes, this effect can persist for up to 3 days if nothing is done to rectify it.§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "curses.list"
          }
        ]
      }
    ]
  },
  
  "wards.frontPage": {
    "title": "Wards",
    "body": "You've already seen the Rite of Warding ceremony previously, but it is a little more complex than §ojust§r what is written there.\n\nA ward is nothing §awithout the Chest beneath it§r. It acts as the brain of the ward, and defines its targets and what effects to cast over them.\n\nIn the chest, the syntax of any \"ward spell\" is the relevant §aAmethyst Nuggets§r (which define the targets of a Ward) and the §aWard Item§r (which defines what happens to these defined targets). Multiple of these can be set up in a single chest for complex wards.\n\nBelow, what these are and other important information will be discussed.\n\nAnother thing to note: A ward's effect can be paused by using §aNatural Ash§r on the central slate. It can then be resumed by doing the same thing.\n\n",
    "buttons": [
      {
        "buttonName": "Amethyst Nugget",
        "buttonIcon": "textures/items/essence/amethyst_nugget",
        "onClick": [
          {
            "type": "openForm",
            "form": "wards.nuggets"
          }
        ]
      },
      {
        "buttonName": "Ward Items",
        "buttonIcon": "textures/items/gold_sword",
        "onClick": [
          {
            "type": "openForm",
            "form": "wards.effects"
          }
        ]
      },
      {
        "buttonName": "Ward Size/Boundary",
        "buttonIcon": "textures/items/candles/red_candle",
        "onClick": [
          {
            "type": "openForm",
            "form": "wards.boundary"
          }
        ]
      },
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "ceremony.frontPage"
          }
        ]
      }
    ]
  },
  "wards.nuggets": {
    "title": "Amethyst Nuggets",
    "body": "When amethyst clusters are broken with a iron pickaxe, they can drop §aamethyst nuggets§r. These unstackable items can be used to store information necessary for wards to §afilter out their targets§r. An amethyst nugget can ONLY store one kind of information at a time.\n\nWhen multiple amethyst nuggets are put in front of a Ward Item, their information combines into something the Ward Item can use. As a result, if the collective information cannot apply to any entity, that ward spell will not trigger.\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "ceremony.frontPage"
          }
        ]
      }
    ]
  },
  "wards.effects": {
    "title": "Ward Items",
    "body": "Ward Items are mundane items that have been influenced with magick to provide an AoE effect within a Ward. Without any §aamethyst nuggets§r to direct their power, they affect all entities within a 5 block radius of the central ritual slate. The Ward Items are as follows:-\n\nBlaze Powder => Burn\nPhantom Membrane => Levitate\n(*) Ender Pearl => Teleport\nPrismarine Shard => Mining Fatigue\nCrushed Poppy => Nauseate\nInk Sac => Blind\nFeather => Reflect\nSlime Ball => Slow\nFermented Spider Eye => Weaken\n(**) Redstone Dust => Alarm\nGolden Sword => Inflict Harm\n\n(*) - §oThe name of the Ender Pearl must be a location within the ward's boundaries.§r\n(**) - §oThe name of the Redstone Dust must be the location of a candle [any color] within the ward's boundaries.§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "wards.frontPage"
          }
        ]
      }
    ]
  },
  "wards.boundary": {
    "title": "Ward Size/Boundary",
    "body": "A ward's maximum size is controlled by the amount of red candle blocks around it. This can simply be checked by tapping the central slate using a wand or stick.\n\nThis is important to know so you can determine how large or small you want your ward spells to be. It pays off to know how much space you have to work with.\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "wards.frontPage"
          }
        ]
      }
    ]
  },
  
  "lore.frontPage": {
    "title": "Whispers of the Wylde",
    "body": "Here the lores of the Wylde lie hidden from sights of those who know not how to look...\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "mainPage"
          }
        ]
      }
    ]
  },
  
  "divination.frontPage": {
    "title": "Divination",
    "body": "An important tool of any witch's workspace is the Crystal Ball. It will show you various secrets and allow you to glean information not nornally known otherwise. Thankfully, it is pretty easy to use.\n\nInteract with the Ball while holding §aSpider's Eye§r to glean some event that will happen in the future. There is no way to know when the foreseen event will come to pass, but another prophecy cannot be recieved until it does. They tend to be recieved in riddle-like words.\n\nIts other purpose is the ability to gauge the amount of Orbos and Fatigue lost/gained. Simply interact with the Ball using Natural Ash.\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "mainPage"
          }
        ]
      }
    ]
  },
}