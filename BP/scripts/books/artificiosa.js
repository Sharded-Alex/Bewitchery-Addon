export const mystica_artificiosa = {
  "introduction": {
    "obfuscated": {
      "tagException": [
        "bw:witch_initiate"
      ]
    },
    "title": "Mystica Artificiosa",
    "body": "I will give you no illusions that Spell Weaving is easy. There is a reason it is the last official tome in the Hebayan Walkthrough of Witchcraft. It is complex, not complicated though (the opinions of /-Equinn/_ are irrelevant), and once you understand its moving parts, you will understand why you needed to have progressed as far as you have. Your journey is approaching its close, and power and my pride in you lies in wait at the end.\n\n",
    "buttons": [
      {
        "buttonName": "Casting Glyphs",
        "buttonIcon": "textures/items/wands/dark_oak_wand",
        "onClick": [
          {
            "type": "openForm",
            "form": "castingGlyphs"
          }
        ]
      },
      {
        "buttonName": "General Glyphs",
        "buttonIcon": "textures/items/xp_bottle",
        "onClick": [
          {
            "type": "openForm",
            "form": "generalGlyphs"
          }
        ]
      },
      {
        "buttonName": "Spell Weaving",
        "buttonIcon": "textures/items/string",
        "onClick": [
          {
            "type": "openForm",
            "form": "spellWeaving"
          }
        ]
      },
      {
        "buttonName": "Glyph Books & Wand Binding",
        "buttonIcon": "textures/items/wands/oak_wand",
        "onClick": [
          {
            "type": "openForm",
            "form": "glyphBooks"
          }
        ]
      },
      {
        "buttonName": "The End",
        "buttonIcon": "textures/items/essence/raw_orbos",
        "onClick": [
          {
            "type": "openForm",
            "form": "theEnd"
          }
        ]
      }
    ]
  },
  
  "castingGlyphs": {
    "title": "Casting Glyphs",
    "body": "Saying that glyphs are fragments of Faerie power is true, but it is more accurate to say that they are §asymbols§r that invoke fragments of Faerie power with the Faerie who offered the glyph's blessing. This means that if you do not meet some criteria to use a glyph offered by a Faerie, no matter how accurately you draw it, it will not do anything. It will remain just that; a symbol.\n\nI used the word \"draw\" and I truly do mean that. Drawing glyphs is something that every witch is capable of. While most glyphs are governed by specific Faeries who require a certain amount of Trust to be usable or are only usable inside a Mystic Circle, there are a few that are needed to even begin Spell Weaving. As a result, I believe it is necessary to explain how glyphs are drawn.\n\nYou simply need to hold your Wand, sneak and use it like you would a bow. This will cause you to see a little sparkle effect and this is good. At this stage, it is important that you view your perspective as a compass. By looking around, you will see little directions pop into your mind in the form of Glyph Notation:\n\n(-) UpRi (Upwards and to the Right)\n\n(-) UpLe (Upwards and to the Left)\n\n(-) DoRi (Downwards and to the Right)\n\n(-) DoLe (Downwards and to the Left)\n\nGlyphs in the book, and various other sources, will have their patterns recorded in Glyph Notation so it is best to practice using your Wand to draw nonsensical glyphs in order to gain a feel for it. You have my word that it is fun and quite witchy, even if I do say so myself.\n\n",
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
  
  "generalGlyphs": {
    "title": "General Glyphs",
    "body": "While the majority of glyphs require explicit pacts with the Fae, there are a few that do not. No, these glyphs are not much different from the rest. Yes, I was in charge of devising this wonderfully interactive and dynamic system of spellcraft. Perhaps, I may have went a bit overboard. Regardless, we are here now and you are learning it.\n\n§aMystic Compression§r\nPattern: §oDoRi - UpRi - UpLe - UpRi - DoRi§r\nA Glyph that compresses the Orbos a Witch currently has into a mystical substance called Raw Orbos. Raw Orbos can be used to create Ceremonial Scrolls and may be required in certain ceremonies as a ritual item.\n\n§aOpening the Wylde Gate§r\nPattern: §oUpRi - DoRi - DoLe - UpLe - DoRi§r\nA Glyph opens a Mystic Circle, a sacred space designed for the crafting of spells. It requires the casting Witch to be standing in the very center of a circle of candles either 3x3, 5x5, or 7x7 blocks large. The large the circle chosen is, the more powerful the Mystic Circle will be.\n\n§aClosing the Wylde Gate§r\nPattern: §oUpRi - DoRi - DoLe - UpLe - DoLe§r\nA Glyph closes a Mystic Circle, causing it to either finish the spell being created or convert the singular spell piece inside it into Raw Orbos. It can be drawn anywhere inside the Mystic Circle area.\n\n§aObserving the Wylde Gate§r\nPattern: §oUpRi - DoRi - DoLe - UpLe - DoLe - DoRi§r\nA Glyph that observes the state of the Mystic Circle, returning the information in a spoken format. It naturally tells you the effects of each part of the spell, which is how you will discern what each Spell Glyph that makes it up does (more on this later).\n\n",
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
  
  "spellWeaving": {
    "title": "Spell Weaving",
    "body": "In reality, Spell Weaving is a large scale ritual that is completely different from normal ceremonies because of how dynamic it is. Some Witches weave in solitude, relying only on themselves and the connections they themselves have built with the Fae, while there are others who combine their resources, choosing to weave together and create spells they would never have the glyphs for otherwise. I will not say that there is no wrong way to weave, but I will say that as long as you get the result you want, the style of weaving does not matter.\n\nI wrote a breakdown of each aspect of Spell Weaving around five (5) centuries ago, but unfortunately, the art of spellcrafting has almost been completely eradicated up to present day. I suppose no one appreciated the little hexed exams that I put in that edition of the Mystica Artificiosa. Now though, I believe I have the perfect way of imparting this knowledge unto you, {playerName}. The mystery of Spell Weaving can be unraveled by following these steps:\n\n",
    "buttons": [
      {
        "buttonName": "Consecration",
        "buttonIcon": "textures/items/paper",
        "onClick": [
          {
            "type": "openForm",
            "form": "spellWeaving.consecration"
          }
        ]
      },
      {
        "buttonName": "Incorporation",
        "buttonIcon": "textures/items/paper",
        "onClick": [
          {
            "type": "openForm",
            "form": "spellWeaving.incorporation"
          }
        ]
      },
      {
        "buttonName": "Augmentation",
        "buttonIcon": "textures/items/paper",
        "onClick": [
          {
            "type": "openForm",
            "form": "spellWeaving.augmentation"
          }
        ]
      },
      {
        "buttonName": "Observation",
        "buttonIcon": "textures/items/paper",
        "onClick": [
          {
            "type": "openForm",
            "form": "spellWeaving.observation"
          }
        ]
      },
      {
        "buttonName": "Conclusion",
        "buttonIcon": "textures/items/paper",
        "onClick": [
          {
            "type": "openForm",
            "form": "spellWeaving.conclusion"
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
  "spellWeaving.consecration": {
    "title": "Consecration",
    "body": "You will first need to create a Mystic Circle (see §aOpening the Wylde Gate§r under §aGeneral Glyphs§r). This sacred space is the \"crafting table\" of spells, though this is a crafting done through items, energies, the environment and movement.\n\nThe size of the Mystic Circle has a direct influence on how many Spell Modifiers you will be allowed. This may not sound like much, but you will understand its importance when you get there.\n\nMystic Circles also cannot be created too close to each other. The Opening of the Wylde Gate glyph will fail if this is attempted. Another trait of the Mystic Circle is that it does not vanish unless the candle circle is broken or the Mystic Circle is closed.\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "spellWeaving"
          }
        ]
      }
    ]
  },
  "spellWeaving.incorporation": {
    "title": "Incorporation",
    "body": "This is the aspect where the Spell Glyphs you have recieved through your various Faerie Pacts will come in handy (check their Faerie Grimoire entry). Among them, there are Noun Glyphs and Verb Glyphs. While their names are self explanatory, I will still explain what they are.\n\nNoun Glyphs shape a spell, making it manifest a certain way. For example, the Spell Glyph known as \"Self\" will cause the spell to target the casting Witch. Verb Glyphs, on the other hand, determine the effects of the spell. For example, the Spell Glyph known as \"Ignite\" would set the victim of the spell on fire in some way.\n\nA Mystic Circle may only have one of each kind of Glyph. Drawing another Noun Glyph would overwrite the previous Noun Glyph if one existed. This overwriting effect also extends to the Augmentation step.\n\nWithin this step, Correspondences also play a large part. Where and when you are incorporating Spell Glyphs into your Mystic Circle fundamentally matters so keeping track of the time of day, current weather conditions, dimension, moon phase, day of the Witches' Week, etc. is important for Spell Weaving. For example, common sense should tell you that drawing the Ignite Spell Glyph in the rain will lower its effectiveness. It is best to wait for a clear day before you incorporate it into your Mystic Circle. \n\nThe Correspondences that influence various Glyphs can be learned from the Faeries themselves when Secrets are being given.\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "spellWeaving"
          }
        ]
      }
    ]
  },
  "spellWeaving.augmentation": {
    "title": "Augmentation",
    "body": "Generally, this step is optional and after the Mystic Circle has a Noun Glyph and a Verb Glyph, the Circle can be closed and you have a proper spell. However, much of the customization truly happens here.\n\nSpell Modifiers are items that, when used inside the Mystic Circle, enhance and/or change aspects of the Spell Glyph that immediately came before it. Not all Modifiers affect all Spell Glyphs though. Some only realistically affect some Noun Glyphs, while others can only be used with certain Verb Glyphs that have a common attribute. Regardless, when Spell Modifiers are used, they may count towards the Modifier Limit of the Mystic Circle.\n\nWhen the Modifier Limit is reached, no other Spell Modifier may be used in the Mystic Circle and this cannot be reversed. The Circle will either need to be destroyed or closed and because of this, it is best to plan out what Modifications you wish to apply to your spell BEFORE even beginning the process so there is less of a chance for error.\n\nIt should be noted that cosmetic and generally minor changes to Glyphs will not count towards the Modifier Limit, so while planning is recommended, it will not cost you anything to change your Missile of Painful Death spell from a Blue color to a mix of Pink and Black.\n\nA list of all Spell Modifiers can easily be found in \"Spell Modifiers for Masters\".\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "spellWeaving"
          }
        ]
      }
    ]
  },
  "spellWeaving.observation": {
    "title": "Observation",
    "body": "This step is optional as well, but it is good practice. The Observing the Wylde Gate spell is a good way of keeping excellent track of what your spell does. Observation and Augmentation are steps that are generally repeated mutiple times until the Witch feels satisfied.\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "spellWeaving"
          }
        ]
      }
    ]
  },
  "spellWeaving.conclusion": {
    "title": "Conclusion",
    "body": "Once you are satisfied with the spell you have Weaved (or even if you're not), you may come to the Conclusion by performing the Closing of the Wylde Gate glyph. This will cause the candles to extinguish themselves and, at the very end of this process, a Glyph Book will be formed at the center.\n\nThe Glyph Book may be used to unleash the spell inside at the cost of Orbos & Fatigue for Mystic and Master Witches. Mundane Witches use their experience points instead. Keep in mind, this remains true for MOST instances where a spell is cast. Be careful of their constant use in this form though. There is always a 1%% chance of the Glyph Book losing its magic and becoming a normal Book.\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "spellWeaving"
          }
        ]
      }
    ]
  },
  
  "glyphBooks": {
    "title": "Glyph Books & Wand Binding",
    "body": "Wands are conductors of Faerie magic, so naturally they can use spells crafted from your hands as well. It simply takes a little symbolic trickery. Simply hold your Glyph Tome in your offhand and draw a Glyph with more than one (1) stroke but less than five (5). When this is done, there will be a nice little chime sound (courtesy of the Vitalia), and a quick look at your Glyph Book will show you the Pattern you just drew.\n\nThis Glyph Book is now able to be bound to a Wand as a specialized Glyph unique ONLY to that item. To do this, simply place the Glyph Book in a container (chest, barrel, shulker boxes) and sneak interact with it using the Wand you want the spells to be bound to. You can bind a maximum of nine (9) spells this way, although, everytime you do this, you overwrite all current spells on the Wand.\n\nBecause of this, if you are a lover of glyph casting spells, it is more efficient to keep your spells safe, secure and documented. Glyph Books can be dyed using a Cauldron for color coding and are able to be stored in Chiseled Bookshelves, so libraries of Glyph Books are completely on the table.\n\n",
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
  
  "theEnd": {
    "obfuscation": {
      "patronException": [
        "hebaya"
      ]
    },
    "title": "The End",
    "body": "You have done it. You have arrived at the end of this honestly exhausting journey, learning of the various tools, brewing potions of the most inane effects, calling up magic through ceremonies, consorting with the fae, and finally, creating your own spells and sigils and casting them. I am proud of you and you should be as well.\n\nA note should be made here: this is the end of §othis§r journey but not necessarily the end of yours. There are a myriad of other aspects to witchcraft, which you will need to look for yourself. If it is your will, you may look into the privacy infringing art of Scrying, or search the world with mischief and malice in your heart for the various ceremonial hexes that hide in the depths of the sands. You could follow the paths of the Fae and learn methods to aid your Bewitched Art in ways the Mundane and the Mystic could never hope to replicate, perhaps even chancing upon whole new aspects of the Craft. You might also find that the solitary witch is a lonely witch and seek to find power in Covenhood.\n\nThe possibilities are not endless, but there are a great many of them. With this, I leave you for now, young Witch. May your new journey be a spirited one. Blessed be.\n\n#-Since you are a Hebayan Witch, this farewell does not apply to you. I still expect frequent Offerings at my Altar.#_\n\n",
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