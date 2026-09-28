export const caeremonium = {
  "introduction": {
    "title": "Caeremonium",
    "body": "Alchemy relies on the Cauldron to be its vessel of change and transformation. Ceremonies are different. In this book, you will learn the way of the Ceremonialist. The World is your stage, and you are responsible for the props you lay upon it. Your power is your own, but only through the instrument that is the world beneath your feet, above your head and around your body. Enough speaking in paper thin riddles; let us begin our trek into Ceremonial Magick.\n\n",
    "buttons": [
      {
        "buttonName": "Ritual Slates",
        "buttonIcon": "textures/book_icons/rune_celestia",
        "onClick": [
          {
            "type": "openForm",
            "form": "slates.frontPage"
          }
        ]
      },
      {
        "buttonName": "Runic Formations",
        "buttonIcon": "textures/book_icons/urrican_pattern",
        "onClick": [
          {
            "type": "openForm",
            "form": "formation.frontPage"
          }
        ]
      },
      {
        "buttonName": "Requirements",
        "buttonIcon": "textures/items/iron_ingot",
        "onClick": [
          {
            "type": "openForm",
            "form": "requirements"
          }
        ]
      },
      {
        "buttonName": "Alignments",
        "buttonIcon": "textures/items/gold_ingot",
        "onClick": [
          {
            "type": "openForm",
            "form": "alignments"
          }
        ]
      },
      {
        "buttonName": "Ceremonial Scrolls",
        "buttonIcon": "textures/items/scrolls/ender_inscribed_scroll",
        "onClick": [
          {
            "type": "openForm",
            "form": "ceremonyScrolls"
          }
        ]
      },
      {
        "buttonName": "What's Next?",
        "buttonIcon": "textures/items/honeycomb",
        "onClick": [
          {
            "type": "openForm",
            "form": "whatsNext?"
          }
        ]
      }
    ]
  },
  
  "slates.frontPage": {
    "title": "Ritual Slates",
    "body": "Ritual slates are blocks that can be crafted in the Witch's Workbench. They can be inscribed with Chalk Powder to form symbols on them, which can be changed by using a Wand and erased using Wool. Slates marked with Red Chalk Powder are the centerpiece of any ceremony, where all the ritual items must be thrown and where the ritual itself is activated. Slates marked with White Chalk Powder are found around the centerpiece, forming mystical formations that determine the kind of rituals that is being performed. These are called Runic Formations.\n\nActivating slates marked with red chalk is quite simple. With the ritual items on or surrounding the slate in a 3x3 area, interact with it using either a Wand or a Ceremonial Scroll. You only ever need one (1) of each ritual item. If you have the Orbos (or experience, if you are a Mundane witch), the ritual should begin. Be aware that there are other conditions that may need to be met.\n\n",
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
  
  "formation.frontPage": {
    "title": "Runic Formations",
    "body": "Runic formations are the patterns that white marked ritual slates (and for my Witches, Lit Candles) should form when performing different rituals. Each formation represents a different kind of power, which is used to allow the ceremony to function. Because of this, witches rooted in the Old Ways and tradition will find it difficult to move them around. That is not to say there are not ways to perform ceremonies in a compact manner though. Below are the various Runic Formations I have allowed Witches to make use of.\n\n",
    "buttons": [
      {
        "buttonName": "Spiral of Urrican",
        "buttonIcon": "textures/items/chalk/white_chalk",
        "onClick": [
          {
            "type": "openForm",
            "form": "formation.urrican"
          }
        ]
      },
      {
        "buttonName": "Crest of Transmutation",
        "buttonIcon": "textures/items/chalk/white_chalk",
        "onClick": [
          {
            "type": "openForm",
            "form": "formation.transmutation"
          }
        ]
      },
      {
        "buttonName": "Circle of Duality",
        "buttonIcon": "textures/items/chalk/white_chalk",
        "onClick": [
          {
            "type": "openForm",
            "form": "formation.duality"
          }
        ]
      },
      {
        "buttonName": "Star of Nathe",
        "buttonIcon": "textures/items/chalk/white_chalk",
        "onClick": [
          {
            "type": "openForm",
            "form": "formation.conjure"
          }
        ]
      },
      {
        "buttonName": "Mark of Hebaya",
        "buttonIcon": "textures/items/chalk/white_chalk",
        "onClick": [
          {
            "type": "openForm",
            "form": "formation.enchantment"
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
  "formation.urrican": {
    "title": "Spiral of Urrican",
    "body": "\n\n\n                \n\n\n\n\nThe simplest runic formation and the \"least powerful\" according to some of the Witches that I keep frequent contact with. It can be used to exercise some amount of power over the skies, and it is mainly used to conjure and banish storms and unwanted weather patterns.\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "formation.frontPage"
          }
        ]
      }
    ]
  },
  "formation.transmutation": {
    "title": "Crest of Transmutation",
    "body": "\n\n\n                \n\n\n\n\nThe runic formation that pulls on the land to change the properties of items/blocks. It is always used in various kinds of ritualistic transmutations, though most things of this nature are left to Alchemy.\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "formation.frontPage"
          }
        ]
      }
    ]
  },
  "formation.duality": {
    "title": "Circle of Duality",
    "body": "\n\n\n                \n\n\n\n\nThis runic formation focuses on the balance between negative and positive, good and bad, dark and light. It can be used to cleanse and curse, which causes it to be one of the most used runic formations. It is simultaneously the most life saving and the most deadly.\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "formation.frontPage"
          }
        ]
      }
    ]
  },
  "formation.conjure": {
    "title": "Star of Nathe",
    "body": "\n\n\n                \n\n\n\n\nA runic formation that is likely the most visually magickal. It is used for the summoning of entities and the traveling of creatures across vast distances in the blink of an eye. It also may be used to bridge dimensions, both the reachable and the unreachable.\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "formation.frontPage"
          }
        ]
      }
    ]
  },
  "formation.enchantment": {
    "title": "Mark of Hebaya",
    "body": "\n\n\n                \n\n\n\n\nA mystical mark belonging to me that I have shaped into a runic formation. It is used to bind and enchant. It likely has the most rituals attached to it. It makes sense, as I am a self empowered Patron of Witches.\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "formation.frontPage"
          }
        ]
      }
    ]
  },
  
  "requirements": {
    "title": "Requirements",
    "body": "Requirements are conditions the environment of a ceremony MUST meet in order for it to function successfully. As of the conception of this book, they may be temporal, atmospheric and/or lunar.\n\n",
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
  "alignments": {
    "title": "Alignments",
    "body": "Alignments are practically more forgiving requirements. They do not prevent a ritual from functioning; instead, when these conditions are met, the rite is empowered in some way. Not many rituals have Alignments, however, so it can usually be safely ignored.\n\n",
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
  
  "ceremonyScrolls": {
    "title": "Ceremonial Scrolls",
    "body": "Ceremonial Scrolls are mystical parchments crafted from Raw Orbos that naturally represent Fae energies bound to paper. This allows them the unique property of being able to serve as both a Runic Formation AND a Wand to activate centerpiece Ritual Slates. Naturally, the Witch still needs to meet all the other conditions for the ceremony to truly function, and the bonuses Wands provide will not be taken into account.\n\n",
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
    "body": "Like Potens Alchimia, this book does not contain ceremonies to be practiced. Luckily, you have two (2) supplementary books you can turn to for help in that regard, Everyday Rites & Rituals (Mundane Witch friendly) and Ceremonialis Adeptus (Mundane Witch UNfriendly). There are whispers about a third, hidden away within the temples of the deserts, presumably hiding away deadly and deliciously annoying little hexes. I will give you a hint; the rumors are true.\n\nIn regards to the next step of your journey, it is quite simple. You will need to perform the Rite of Faerie Commune and win yourself a Faerie Game. Yes, to continue, you will need to become a Master Witch. To move forward, you must be recognized by the Fae.\n\n",
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