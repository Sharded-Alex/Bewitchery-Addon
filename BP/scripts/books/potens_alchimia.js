export const potens_alchimia = {
  "introduction": {
    "title": "Potens Alchimia",
    "body": "Alchemy, the art of creation and transformation. It takes one thing, breaking it down, slowly nudging it into the question mark that is the mystical \"something else\". In some cases, it may become something... more. Natural Alchemy is quite a fun adventure, where the Nether is your gate and experimentation is dead but I tend to like the subtler, more unknown mystical science that is Mystic Alchemy. Alternatively, there is usefulness in the straightforward process of Primal Alchemy, the change of an item by cause of the five (5) primal energies. In this book, I will cover the latter two; Mystic Alchemy & Primal Alchemy. However, there are a variety of things they have in common.\n\n",
    "buttons": [
      {
        "buttonName": "The Prepared Cauldron",
        "buttonIcon": "textures/items/cauldron",
        "onClick": [
          {
            "type": "openForm",
            "form": "cauldron.frontPage"
          }
        ]
      },
      {
        "buttonName": "Chef's Divination",
        "buttonIcon": "textures/items/tools/wood_spoon",
        "onClick": [
          {
            "type": "openForm",
            "form": "div.frontPage"
          }
        ]
      },
      {
        "buttonName": "Mystic Alchemy",
        "buttonIcon": "textures/items/campfire",
        "onClick": [
          {
            "type": "openForm",
            "form": "mysticAlchemy.frontPage"
          }
        ]
      },
      {
        "buttonName": "Primal Alchemy",
        "buttonIcon": "textures/items/soul_campfire",
        "onClick": [
          {
            "type": "openForm",
            "form": "primalAlchemy.frontPage"
          }
        ]
      },
      {
        "buttonName": "Other Books",
        "buttonIcon": "textures/items/book_writable",
        "onClick": [
          {
            "type": "openForm",
            "form": "otherBooks.frontPage"
          }
        ]
      },
      {
        "buttonName": "What's Next?",
        "buttonIcon": "textures/items/chalk/white_chalk",
        "onClick": [
          {
            "type": "openForm",
            "form": "whatsNext?"
          }
        ]
      }
    ]
  },
  
  "cauldron.frontPage": {
    "title": "The Prepared Cauldron",
    "body": "There has never been a Witch to date that has never used their cauldron. If there is, do write to me. They are in dire need of either re-education or extermination. However, I digress. This metallic instrument of change is where all Bewitched Alchemy takes place. However, it cannot function only by itself. There are still more steps.\n\nHeat is the agent of change. Within and without it, a myriad of processes may occur. In this case, its presence is necessary. Fire, magma blocks, lava, lit furnaces, and campfires can all provide the necessary heat the cauldron requires when below it. Alternatively, there is such a thing as spiritual heat, which is provided by soul fire and soul campfires when they are below the Cauldron.\n\nWater is the fundamental catalyst of all Alchemy and this is no different for these alternate forms of it. Essentially, ensure that the cauldron is not empty. For Mystic Alchemy, the amount of water in the Cauldron determines how many ingredients you are allowed to use. For Primal Alchemy, the Cauldron needs to be full.\n\nFinally, Natural Ash is used on the Cauldron. You should already know the effects of this substance so I will not elaborate.\n\nIf all conditions are met, there will be a lovely boiling sound and bubbles will rise softly. That is the sign of a prepared cauldron.\n\n",
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
  
  "div.frontPage": {
    "title": "Chef's Divination",
    "body": "Discerning the contents of a Cauldron can be tricky; however, it is not something to fear when you've stepped unto the path of the Bewitched Art. When approaching this issue, there are two solutions split across the two kinds of Alchemy.\n\nIn Mystic Alchemy, you can discern a reagent, its potency and the potion effect it is adding to the pot (more on these later) by interacting with the Cauldron using the Tasting Spoon.\n\nIn Primal Alchemy, the general amount of each primal energy in the pot can be percieved by sneak interacting with the Cauldron using a Wand.\n\n",
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
  
  "mysticAlchemy.frontPage": {
    "title": "Mystic Alchemy",
    "body": "Mystic Alchemy has only one goal; the Strange Potion. This potion type can hold quite a few different potion effects and is able to be used up to five (5) times, whether through drinking or by using it to hit another creature to transfer the effects to them, and is collected from the Cauldron using a Glass Bottle. With Glass Flasks, a Splash variant can be collected, which may also be used five (5) times.\n\nHow do you create one of these mystical potions, you might ask? The short answer is, you throw things into the pot and constantly taste it until you get your favored result. The long answer is detailed below.\n\n",
    "buttons": [
      {
        "buttonName": "Reagents & Modifiers",
        "buttonIcon": "textures/items/ghast_tear",
        "onClick": [
          {
            "type": "openForm",
            "form": "mysticAlchemy.ingredients"
          }
        ]
      },
      {
        "buttonName": "Potency",
        "buttonIcon": "textures/items/xp_bottle",
        "onClick": [
          {
            "type": "openForm",
            "form": "mysticAlchemy.potency"
          }
        ]
      },
      {
        "buttonName": "Distillation",
        "buttonIcon": "textures/items/bottles/glass_phial",
        "onClick": [
          {
            "type": "openForm",
            "form": "mysticAlchemy.distillation"
          }
        ]
      },
      {
        "buttonName": "Crystallization",
        "buttonIcon": "textures/items/essence/storm_quartz",
        "onClick": [
          {
            "type": "openForm",
            "form": "mysticAlchemy.crystallization"
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
  "mysticAlchemy.ingredients": {
    "title": "Reagents & Modifiers",
    "body": "Alchemy requires ingredients and Mystic Alchemy is the best example of this. Ingredients in this form of alchemy is split into two types, Reagents and Modifiers. Reagents are any valid items that add some kind of potion effect to the Cauldron when added to it along with a Potency. They are the most important type of ingredient and come with Primary Effects and a Secondary Effect. Note, all modded foods and a few specially included items from bums_Crops are also valid reagents.\n\nThe Primary Effects of a reagent determines its Alchemical Spectrum, a sophisticated way of describing the set of potion effects that this reagent COULD add to the potion. Each reagent gains random Primary Effects at the beginning of every new world, and it is usually required of you to figure out what Primary Effect is attached to what Potency range by yourself. However, I've included a little glyph that may help with your alchemical research.\n\nThe Secondary Effect of a reagent is much easier to understand and dictates what a Distillation made from it will potentially do. They only apply to the potion if added to the Cauldron as a Phial of Distilled Gas (more on this later) and are shown as the Secondary Influence. A Strange Potion may only have one (1) Secondary Influence. As for the Secondary Effect type itself, there are four (4) kinds.\n\n- Corruptors, which reverse a potion effect if possible\n\n- Extenders, which extend a potion effect by a certain amount\n\n- Amplifiers, which amplify a potion's power by one (1)\n\n- Nullifiers, which nullify a potion effect completely\n\nFinally, Modifiers are any valid item that ONLY affect the Potency of the reagents in the Cauldron. When I discovered them, they were quite fascinating things. Even they do what they do in mathematical ways, they can completely flip the potency of the contents in the Cauldron. Additionally, all Modifiers are present in the form of Dusts.\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "mysticAlchemy.frontPage"
          }
        ]
      }
    ]
  },
  "mysticAlchemy.potency": {
    "title": "Potency",
    "body": "Potency describes how powerful a reagent is in the Cauldron. It is the most important aspect of Mystic Alchemy because different potencies grant different Primary Effects. This, as mentioned before, is called the Alchemical Spectrum.\n\nThe Alchemical Spectrum is simply a range of potion effects. It is used to determine the potion effect that a reagent gives when it is in the Cauldron, e.g. Dandelion at 6%% potency might give Speed, but at 70%% it could give Mining Fatigue. With this example, it becomes easier to see that Mystic Alchemy is a game of controlling the potencies of the different reagents in the Cauldron to achieve a satisfactory set of effects.\n\nThe closer the potency is to the midpoint of any range within the Alchemical Spectrum, the stronger the associated potion effect will be, e.g. For Dandelions, the range on the Alchemical Spectrum for Speed could be 0-30%%. If it has a potency of 3%%, you will get Speed I. If you increase it to 15%%, you will get Speed III, but if you let it go to 27%% potency, you will only get Speed I again. I must admit, this is my favorite aspect of Mystic Alchemy; attention to detail is something that is important.\n\nFinally, it is very possible for a reagent's potency to be too strong or too weak. All reagents with a potency below 0%% will offer no potion effect. On the other hand, all reagents with potencies above 100%% are highly poisonous.\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "mysticAlchemy.frontPage"
          }
        ]
      }
    ]
  },
  "mysticAlchemy.distillation": {
    "title": "Distillation",
    "body": "Distillation is a brewing process that requires there to be only one (1) reagent in the Cauldron. You must let it sit and simmer AFTER brewing for around 15 seconds. Clouds of colored smoke will naturally rise from the Cauldron, which is an important sign. Using a Glass Phial on the Cauldron will then gather a Phial of Distilled Fumes. This is how you gather a Distillation.\n\nDistillations are simply another name for Phials of Distilled Gas. They have a type and the effect that is affected, which is used as the Secondary Influence for Strange Potions. The type of Distillation is determined by the Secondary Effect type. The effect that is affected is determined by the potency and the Alchemical Spectrum of the reagent that was being distilled.\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "mysticAlchemy.frontPage"
          }
        ]
      }
    ]
  },
  "mysticAlchemy.crystallization": {
    "title": "Crystallization",
    "body": "Every reagent belongs to a Primal Element: Solar, Lunar, Earth, Sky, and Ender. When added to the Cauldron when doing Mystic Alchemy, the elemental energy is carried over. This residual energy can then be crystallized into Primal Crystals by simply interacting with the Cauldron using Amethyst Shards or Quartz Crystals. Naturally, you should not expect the potion to be spared. Different crystals of varying Primal Elements will pop out of the Cauldron however, and this is the result you want.\n\nThe Primal Element a reagent belongs to is generally constant, but reagents from unnatural sources can change Primal Energies per world. It is simply \"one of thse things\".\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "mysticAlchemy.frontPage"
          }
        ]
      }
    ]
  },
  
  "primalAlchemy.frontPage": {
    "title": "Primal Alchemy",
    "body": "Primal Alchemy is the process of changing an item from one thing into another by way of primal energies, if I must be scientific. If I am being mystical, it is the use of primal energies to warp an item into something similar but fundamentally different. Now, this does not apply to everything, and it is very much like crafting. What you put in determines what you will get out.\n\nSetting up the Cauldron to perform Primal Alchemy requires the spiritual heat. When the cauldron is sufficiently filled and changed by natural ash, primal crystals can be thrown into the pot. What will happen is that the primal crystals will dissolve into the Cauldron, increasing the primal energy of that type. Checking the primal energies in the pot is always a good practice.\n\nFor actual transmutation, all you need to do is throw the item to be transmuted in, and then stand (this is important) and interact with the Cauldron using a Wand. The item(s) will then disappear and the Cauldron will begin brewing. Different transmutations can have different brewing times so a little patience is always good to have with Primal Alchemy. When it finishes, the changed item(s) will burst from the Cauldron.\n\nWhile the process is easy to understand, you should understand that one item may have multiple possible transmutations based on the energies necessary to change it. In cases like that, a random transmutation is chosen if there are multiple possible results.\n\n",
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
  
  "otherBooks.frontPage": {
    "title": "Other Books",
    "body": "There is intentionally no recipes included in this tome. I have seperated them into different books. For Mystic Alchemy, §aOf Herbs, Stones & Organs§r is a comprehensive list of reagents and modifiers. This book cannot record the Primary Effects of these ingredients through mystical means however, so I recommend making a Book & Quill to record them and any other reagents you will not find within it. Additionally, a Book & Quill to record Strange Potion recipes you like is also helpful.\n\nFor Primal Alchemy, it is quite difficult to get along without the supplementary book, §aPrimal Alchemy & You§r. It neatly details all the different transmutation recipes that exist, which saves time and heartache.\n\n",
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
    "obfuscated": {
      "tagException": [
        "bw:witch_initiate"
      ]
    },
    "title": "What's Next?",
    "body": "I'm aware that this book may have taken a little bit to get through. That is fine; /-The Wylde did not manifest within a single day/_. Practice the things you've learned here. Concoct your first brew, create your first Phial of Distilled Gas, form your first primal crystal and transmute your first sapling. Most importantly though, have fun doing it. Whether that is a threat or not is heavily reliant on you.\n\nYour next step lies in the mysticism of symbols, the alignment of the heavens and time, the magic of items, and the invocation of mystical forces. Your journey shall lead you into §aCaeremoniarum§r.\n\n",
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