export const alchemy_book = {
  "intro": {
    "title": "Alchemical Basics",
    "body": [
      "In the swamps, adventurers sometimes stumble into oak huts that rise above the swamplands on four spindly wooden legs. Their stories tell us what are inside: an alchemist witch, their black cat, a mushroom in its flower pot and a cauldron of potion. There is nothing peculiar about this... except that something §ois§r peculiar. If there is no brewing stand, how did the witch filled the cauldron with potion?",
      "",
      "The witch must know of a different way to craft the same potions as a brewing stand. Perhaps she has alchemical secrets that only her kind knows. Everyone knows the Illagers draw upon unknown and unkind powers we cannot fathom. Thankfully, we also have alchemical secrets Illager Witches cannot fathom.",
      "",
      "In this book, I will take the time to go over the uses of the Cauldron in Bewitched Alchemy. In fact, §devery bit of magic within this book uses the Cauldron as an instrument§r. Alchemy can be split into two core aspects. They are as follows:",
      ""
    ],
    "buttons": [
      {
        "buttonName": "Occult Alchemy",
        "buttonIcon": "textures/items/campfire",
        "onClick": [
          {
            "type": "openForm",
            "form": "alchemy.occult"
          }
        ]
      },
      {
        "buttonName": "Primal Alchemy",
        "buttonIcon": "textures/items/soul_campfire",
        "onClick": [
          {
            "type": "openForm",
            "form": "alchemy.primal"
          }
        ]
      },
      {
        "buttonName": "Next Steps",
        "buttonIcon": "textures/blocks/infused_pumpkin/sigiled_activated_enchanted_pumpkin",
        "onClick": [
          {
            "type": "openForm",
            "form": "alchemy.next_steps"
          }
        ]
      },
    ]
  },

  "alchemy.occult": {
    "title": "Occult Alchemy",
    "body": [
      "Occult Alchemy uses the Cauldron to §dbrew strange potions§r using natural ash, water, heat, ingredients and a little time.",
      "",
      "§lCauldron Preparation§r",
      "Before a Cauldron can be used for any witchcraft, you must §dsneak§r (VERY important) and §dtouch it with some natural ash in hand§r. This is said to infuse it with magical power. The §6Witch of the Wylde Wood§r would agree.",
      "",
      "Next, the Cauldron must be heated with natural flames. This is done easily by placing a normal campfire, some regular fire, magma block or lava directly underneath it. If everything is right, the water should come to an almost immediate boil.",
      "",
      "With these preparations done, you can add ingredients into the Cauldron by either interacting with it or just throwing the items in the boiling water. After brewing for a couple of seconds, the ingredient will be infused into the potion. A glass bottle or a glass flask can be used to collect the Strange Potion produced.",
      "",
      "§lAlchemical Theory§r",
      "It is at this point that a lot of novice alchemists either poison themselves (we all do, don't feel too bad) and decide the intricacies of occult alchemy is not for them. For those who want to continue though, the rest of this section covers what actually happens in the Cauldron.",
      ""
    ],
    "buttons": [
      {
        "buttonName": "Ingredients",
        "buttonIcon": "textures/items/rotten_flesh",
        "onClick": [
          {
            "type": "openForm",
            "form": "alchemy.occult.ingredients"
          }
        ]
      }, // Ingredients
      {
        "buttonName": "Potion Tasting",
        "buttonIcon": "textures/items/tools/wood_spoon",
        "onClick": [
          {
            "type": "openForm",
            "form": "alchemy.occult.tasting"
          }
        ]
      }, // Potion Tasting
      {
        "buttonName": "Distillation",
        "buttonIcon": "textures/items/bottles/glass_phial",
        "onClick": [
          {
            "type": "openForm",
            "form": "alchemy.occult.distillation"
          }
        ]
      }, // Distillation
      {
        "buttonName": "Crystallization",
        "buttonIcon": "textures/items/essence/storm_quartz",
        "onClick": [
          {
            "type": "openForm",
            "form": "alchemy.occult.crystals"
          }
        ]
      }, // Crystallization
      {
        "buttonName": "Helpful(?) Tips",
        "buttonIcon": "textures/items/book_writable",
        "onClick": [
          {
            "type": "openForm",
            "form": "alchemy.occult.tips"
          }
        ]
      }, // Helpful(?) Tips
      {
        "buttonName": "Cauldron Portals",
        "buttonIcon": "textures/blocks/portal_placeholder",
        "onClick": [
          {
            "type": "openForm",
            "form": "alchemy.occult.portals"
          }
        ]
      }, // Helpful(?) Tips
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "intro"
          }
        ]
      } // Back
    ]
  },
  "alchemy.occult.ingredients": {
    "title": "Ingredients",
    "body": [
      "Ingredients are the items added to the Cauldron and there are two types: §dReagents§r and §cModifiers§r.",
      "",
      "A §dreagent§r is any item that adds their §apotency§r to the Cauldron. The effect they add to the final product depends on how potent the item is in the potion, and this potency -> effect relationship is called the reagent's §dAlchemical Spectrum§r. Each reagent increases the potency of everything else inside the Cauldron using its base potency, which is simply the item's potency when first added to the pot.",
      "",
      "According to the §o'Potens Alchimia'§r:",
      "§oThe Alchemical Spectrum is simply a range of potion effects. It is used to determine the potion effect that a reagent gives when it is in the Cauldron, e.g. Dandelion at 6%% potency might give Speed, but at 70%% it could give Mining Fatigue. With this example, it becomes easier to see that Occult Alchemy is a game of controlling the potencies of the different reagents in the Cauldron to achieve a satisfactory set of effects.\n\nThe closer the potency is to the midpoint of any range within the Alchemical Spectrum, the stronger the associated potion effect will be, e.g. For Dandelions, the range on the Alchemical Spectrum for Speed could be 0-30%%. If it has a potency of 3%%, you will get Speed I. If you increase it to 15%%, you will get Speed III, but if you let it go to 27%% potency, you will only get Speed I again.§r",
      "",
      "A reagent can be too weak or too strong as well (below 0%% and above 100%% respectively). Too weak and that reagent does nothing, too strong and it becomes poisonous.",
      "",
      "A §cmodifier§r, on the other hand, is any item that manipulates the potencies within a Cauldron but does not add any of its own. This is useful when trying to control potencies and keep them within specific ranges. Not much is said about them aside from the fact that some of them can be fairly strange and that most are dusts.",
      "",
      "There are many more reagents than there are modifiers, but all serve their purposes. An important thing to note is that, aside from the list of known material reagents, all foods have alchemical spectrums! This means that they can all be brewed and this can have strange and often funny results. This also sheds light on another peculiar aspect of Occult Alchemy: the same reagent may not share the same alchemical spectrum across different world seeds.",
      ""
    ],
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "alchemy.occult"
          }
        ]
      }
    ]
  },
  "alchemy.occult.tasting": {
    "title": "Potion Tasting",
    "body": [
      `The Cauldron has its ingredients. The water bubbles with their potencies and you know that there is magical power held firmly inside. The question now is: how can you be sure of what effects the potion will have if bottled? That particular problem is answered with the §dTasting Spoon§r.`,
      ``,
      `The §dTasting Spoon§r is simply a wooden spoon (crafted in the Witch's Workbench) that allows a witch to taste test the potion within the Cauldron in such small amounts that it gives the witch a feel of what exactly is inside the Cauldron without causing any adverse effects. This has saved no small amount of novices from being poisoned or seriously harmed while testing what a Strange Potion does.`,
      ``
    ],
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "alchemy.occult"
          }
        ]
      }
    ]

  },
  "alchemy.occult.distillation": {
    "title": "Distillation",
    "body": [
      `Strange Potions can be improved by adding the §dappropriate Phial of Distilled Gas§r to the Cauldron. This adds a secondary effect to the final bottled product (which is the Strange Potion or Strange Splash Potion), hopefully improving the potion in some way. This addition is only ever really helpful if the alchemist understands what they are trying to achieve so it can absolutely be ignored.`,
      ``,
      `Distillation can only be achieved with one reagent in the Cauldron (VERY important). It is this reagent that determines what sort of effect the Phial has as well as the potion effect it affects §awhen bottled§d (more on this later). After waiting for about 15 seconds, the Cauldron should begin to release thick smoke. When that smoke begins, simply interacting with the pot while holding an §dGlass Phial§r should produce a §dPhial of Distilled Gas§r.`,
      ``,
      `Distilled Gases may not all do the same things. What they actually do when added as a Secondary Effect depends on their §atype§r. The types of Distilled Gases are:`,
      ``,
      `- §aExtenders§r: Used to extend the potion effect being affected by the Distilled Gas.`,
      ``,
      `- §aAmplifiers§r: Used to increase the power of the potion effect being affected by the Distilled Gas. The natural limit of this increase is up to Power IV.`,
      ``,
      `- §aCorruptors§r: Used to corrupt and reverse the potion effect being affected by the Distilled Gas. Not all potion effects have a counterpart they can be corrupted into.`,
      ``,
      `- §aNullifiers§r: Used to completely erase the potion effect being affected by the Distilled Gas.`,
      ``,
      `The specific potion effect that is affected by the Distilled Gas depends on the potency of the reagent when it was being bottled in the Glass Phial. This is another reason why having some knowledge of the Alchemical Spectrum of the reagent being turned into a Distilled Gas is important. Of course, there will always be the few true alchemist witches that spend the time to collect all the possible Distilled Gases from each reagent so that they always have this aid whenever they feel it is necessary.`,
      ``,
      `Finally, the Phial of Distilled Gas is added to a Cauldron simply by interacting with it while there are reagents in it. However, the Secondary Effect it brings with it is only applied after the potion is bottled so many alchemists prefer to add it as the very last component/ingredient, especially when they are not following any particular recipe.`,
      ``
    ],
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "alchemy.occult"
          }
        ]
      }
    ]
  },
  "alchemy.occult.tips": {
    "title": "Helpful(?) Tips",
    "body": [
      `1. Journals are your best friend. They are great for keeping track of reagents and their details, and for any recipes you figure out. Alchemists are famous for the Book of Recipes they create when they figure out the exact recipes for really powerful potions.`,
      ``,
      `2. There aren't many (mundane) ways to extend the durations of potion effects in the Cauldron but multiple reagents pointing to the same effect will stack in duration when the potion is bottled. Aligning them properly requires a bit of experimentation and experience.`,
      ``,
      `3. There is a limit to how many ingredients a full Cauldron can hold, and this is determined when natural ash is used on it. A Mundane Witch can create a Cauldron that can hold 6 ingredients. A Mystic Witch can create a Cauldron that can hold 15 ingredients. There are some witches, through their Fae connections, that can create a Cauldron that can hold 21 ingredients.`,
      ``,
      `4. There are only 3 reagents that have the Resistance effect somewhere on their Alchemical Spectrum. One of the Resistance Reagents (as they are sometimes called) was a potato in my world.`,
      ``,
      `5. The more reagents you add to a potion, the more Alchemical Spectrums you are forced to deal with. Wherever possible, use Modifiers to influence potency.`,
      ``,
      `6. Ingredients can be physically thrown into a Cauldron. However, throw exactly 1 item at a time, otherwise the pot will ignore it.`,
      ``,
      `7. Aside from being consumed, Strange Potions can also be used to hit other creatures, using up one of its Uses to inflict its effects on the victim. Strange Splash Potions work like a witch would expect.`,
      ``,
      `8. §dQuintessence§r can be used in Occult Alchemy to filter in or out valid targets. In Strange Potions, a blacklisted entity drinking it will remain unaffected and consume none of its Uses. The same applies when used as a melee "weapon". In Strange Splash Potions, 1 Use will still be consumed but any blacklisted entities within the splash zone will be excluded from its effects.`,
      ``
    ],
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "alchemy.occult"
          }
        ]
      }
    ]
  },
  "alchemy.occult.crystals": {
    "title": "Crystallization",
    "body": [
      `The final aspect of Occult Alchemy moves a little further away from potion craft. In fact, it toes the line of Alchemy's more primal side. However, due to the fact that this process uses reagents and their potencies, most witches classify it as something that is mostly Occult. Thankfully, crystallization is not an overly complex process.`,
      ``,
      `When reagents are in the Cauldron, you only need to use Quartz Crystals or Amethyst Shards on it. This will convert everything inside into Primal Crystals. These crystals all correspond to the Primal Elements which are Solar, Lunar, Earth, Sky, and Ender. Reagents are all connected to one of these Primal Elements, never more than one and they do not always make sense. When Quartz and Amethyst come in contact with them in Cauldron liquid form, the primal energies are sucked into them and whatever is left is dispersed into the air.`,
      ``,
      `An important sidenote: the amount of crystals being held has an impact on how many Primal Crystals the Cauldron will spit out as well as the potency of the reagents. As for the potential uses of Primal Crystals, it is an important aspect of Primal Alchemy (covered later in this book) and a frequently mentioned component in rituals that you will learn about in a later volume.`,
      ``
    ],
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "alchemy.occult"
          }
        ]
      }
    ]
  },
  "alchemy.occult.portals": {
    "title": "Cauldron Portals",
    "body": [
      `A lesser known fact of Occult Alchemy is that a Cauldron can connect a distant location through poorly understood but clearly mystical means. When doing this kind of working, NO ingredient can be in the Cauldron and the heat must be natural.`,
      ``,
      `By using an Amethyst Nugget bound to a location on the Cauldron, the destination is bound to it. A simple step into the pot and perhaps a little wait, and you will vanish from your position to appear at the bound location.`,
      ``,
      `Naturally, the water can be dyed any color (which affects the process visually), and interacting with the pot while holding a nametag will name the Cauldron. This name is displayed if the destination of a Cauldron Portal jump is that cauldron position exactly. However, it should be noted that every time the Cauldron is used as a Portal, there is a chance the water in the Cauldron evaporates a little more. If the water is ever fully consumed, the Cauldron will become mundane once more. Thankfully, refilling the Cauldron will prolong the Portal.`,
      ``,
      `Cauldron Portals are powerful and fairly reliable tools of translocation. Because it qualifies a piece of mundane magic, it is even more so. Many witches and covens end up creating their own portal networks.`,
      ``
    ],
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "alchemy.occult"
          }
        ]
      }
    ]
  },


  "alchemy.primal": {
    "title": "Primal Alchemy",
    "body": [
      "Primal Alchemy uses the Cauldron to transmute one material into another using primal energies (provided by brewed Primal Crystals). Some witches even consider it the Alchemy of Equivalent Exchange because of how it can be used to create resources from others.",
      "",
      "§lCauldron Preparation§r",
      "Like with Occult Alchemy, natural ash must be used on the Cauldron. However, a MAJOR difference is that the kind of heat used must be spiritual by nature. This can be provided by actual soul fire or with soul campfires.",
      "",
      "The final aspect of Primal Alchemy is §dprimal energy§r. All primal recipes require it in some way, and Primal Alchemy is named as it is for this reason. This is also a fairly simple aspect because all it takes to add primal energies into the Cauldron is §athrowing primal crystals into whatever solvent is in the Cauldron§r.",
      "",
      "Throwing the thing(s) being transmuted into the Cauldron and then interacting with it using a wand is enough to begin the transmuting process. If you need to check what primal energies are in the pot, sneak interacting with a wand is enough to do so. If the transmutation is valid, the pot will transmute the item(s) as normal.",
      "",
      "§lRecipes§r",
      "Primal Alchemy is not as freeform as Occult Alchemy, where happy accidents can be born. Instead, this system lends itself heavily to following pre-discovered recipes. With this in mind, I have done you the service of collating all the recipes I have come across in the supplementary text, §o\"The Primal Cookbook\"§r. It explains how to create certain solvents as well.",
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
      } // Back
    ]
  },


  "alchemy.next_steps": {
    "title": "Next Steps",
    "body": [
      "In this tome, I briefly covered the basics of alchemy and the various things a witch can do with it, which, when put simply, can be simplified down to brewing, transmuting and transporting.",
      "",
      "Next, we move into a form of apotropaic magick known as Jack o' Warding. It is exactly what it sound like; the use of alchemically improved pumpkins to guard a location with mystical means. A good foundation for this deceptively simple magical discipline is detailed in the book, §o'Pumpkin Witchcraft'§r.",
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
      } // Back
    ]
  }
}

export const primal_cookbook = {
  "intro": {
    "title": "The Primal Cookbook",
    "body": [
      "Primal Alchemy is similar to the crafting table in one aspect; they both rely on various recipes in order to provide any actual use. However, primal transmutation has the additional requirement of primal energies, which is explained concisely in the Primal Alchemy section of the book, §oAlchemical Basics§r.",
      "",
      "This supplementary book serves the purpose of being a reliable reference for all the alchemical recipes I have gathered over my long time researching and collecting a variety of lores. A little note: excess materials simply evaporate into nothing, so the stingy primal alchemist keeps a close eye on primal energies as well as the amount of materials they use for their transmutations to avoid waste.",
      ""
    ],
    "buttons": [
      {
        "buttonName": "Saplings",
        "buttonIcon": "textures/blocks/sapling_oak",
        "onClick": [
          {
            "type": "openForm",
            "form": "primal.saplings"
          }
        ]
      },
      {
        "buttonName": "Bonemeal",
        "buttonIcon": "textures/items/dye_powder_white",
        "onClick": [
          {
            "type": "openForm",
            "form": "primal.bonemeal"
          }
        ]
      },
      {
        "buttonName": "Sculk Catalyst",
        "buttonIcon": "textures/blocks/sculk_catalyst_top",
        "onClick": [
          {
            "type": "openForm",
            "form": "primal.sculk_catalyst"
          }
        ]
      },
      {
        "buttonName": "Ink Sac",
        "buttonIcon": "textures/items/dye_powder_black",
        "onClick": [
          {
            "type": "openForm",
            "form": "primal.ink"
          }
        ]
      },
      {
        "buttonName": "Glowing Ink Sac",
        "buttonIcon": "textures/items/dye_powder_glow",
        "onClick": [
          {
            "type": "openForm",
            "form": "primal.glow_ink"
          }
        ]
      },
      {
        "buttonName": "Infused Pumpkin",
        "buttonIcon": "textures/blocks/infused_pumpkin/enchanted_pumpkin_side",
        "onClick": [
          {
            "type": "openForm",
            "form": "primal.infused_pumpkin"
          }
        ]
      },
      {
        "buttonName": "Budding Amethyst",
        "buttonIcon": "textures/blocks/budding_amethyst",
        "onClick": [
          {
            "type": "openForm",
            "form": "primal.budding_amethyst"
          }
        ]
      },
      {
        "buttonName": "Pointed Dripstone",
        "buttonIcon": "textures/blocks/pointed_dripstone_up_tip",
        "onClick": [
          {
            "type": "openForm",
            "form": "primal.dripstone"
          }
        ]
      },
      {
        "buttonName": "Breeze Rod",
        "buttonIcon": "textures/items/breeze_rod",
        "onClick": [
          {
            "type": "openForm",
            "form": "primal.breeze_rod"
          }
        ]
      },
      {
        "buttonName": "Blaze Rod",
        "buttonIcon": "textures/items/blaze_rod",
        "onClick": [
          {
            "type": "openForm",
            "form": "primal.blaze_rod"
          }
        ]
      },
      {
        "buttonName": "Shulker Shell",
        "buttonIcon": "textures/items/shulker_shell",
        "onClick": [
          {
            "type": "openForm",
            "form": "primal.shulker_shell"
          }
        ]
      },
      {
        "buttonName": "Scutes",
        "buttonIcon": "textures/items/turtle_shell_piece",
        "onClick": [
          {
            "type": "openForm",
            "form": "primal.scutes"
          }
        ]
      },
      {
        "buttonName": "Trident",
        "buttonIcon": "textures/items/trident",
        "onClick": [
          {
            "type": "openForm",
            "form": "primal.trident"
          }
        ]
      },
      {
        "buttonName": "Sea Lantern",
        "buttonIcon": "textures/items/prismarine_crystals",
        "onClick": [
          {
            "type": "openForm",
            "form": "primal.sea_lantern"
          }
        ]
      },
      {
        "buttonName": "Glowstone Dust",
        "buttonIcon": "textures/items/glowstone_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "primal.glowstone"
          }
        ]
      },
      {
        "buttonName": "Crying Obsidian",
        "buttonIcon": "textures/blocks/crying_obsidian",
        "onClick": [
          {
            "type": "openForm",
            "form": "primal.crying_obsidian"
          }
        ]
      },
      {
        "buttonName": "Ender Pearl",
        "buttonIcon": "textures/items/ender_pearl",
        "onClick": [
          {
            "type": "openForm",
            "form": "primal.ender_pearl"
          }
        ]
      },
      {
        "buttonName": "Cactus",
        "buttonIcon": "textures/blocks/cactus_side.tga",
        "onClick": [
          {
            "type": "openForm",
            "form": "primal.cactus"
          }
        ]
      },
      {
        "buttonName": "Seeds",
        "buttonIcon": "textures/items/seeds_wheat",
        "onClick": [
          {
            "type": "openForm",
            "form": "primal.seeds"
          }
        ]
      },
      {
        "buttonName": "Raw Iron",
        "buttonIcon": "textures/items/raw_iron",
        "onClick": [
          {
            "type": "openForm",
            "form": "primal.iron"
          }
        ]
      },
      {
        "buttonName": "Raw Gold",
        "buttonIcon": "textures/items/raw_gold",
        "onClick": [
          {
            "type": "openForm",
            "form": "primal.gold"
          }
        ]
      },
      {
        "buttonName": "Diamond",
        "buttonIcon": "textures/items/diamond",
        "onClick": [
          {
            "type": "openForm",
            "form": "primal.diamond"
          }
        ]
      },
      {
        "buttonName": "Crystals",
        "buttonIcon": "textures/items/amethyst_shard",
        "onClick": [
          {
            "type": "openForm",
            "form": "primal.crystals"
          }
        ]
      },
      {
        "buttonName": "Flint",
        "buttonIcon": "textures/items/flint",
        "onClick": [
          {
            "type": "openForm",
            "form": "primal.flint"
          }
        ]
      },
      {
        "buttonName": "Golden Apple",
        "buttonIcon": "textures/items/apple_golden",
        "onClick": [
          {
            "type": "openForm",
            "form": "primal.golden_apple"
          }
        ]
      },
      {
        "buttonName": "Enchanted Golden Apple",
        "buttonIcon": "textures/items/apple_golden",
        "onClick": [
          {
            "type": "openForm",
            "form": "primal.enchanted_golden_apple"
          }
        ]
      },
      {
        "buttonName": "Orbic Honey Bottle",
        "buttonIcon": "textures/items/essence/honey_orbos_bottle",
        "onClick": [
          {
            "type": "openForm",
            "form": "primal.orbic_honey"
          }
        ]
      },
      {
        "buttonName": "Honeycomb",
        "buttonIcon": "textures/items/honeycomb",
        "onClick": [
          {
            "type": "openForm",
            "form": "primal.honeycomb"
          }
        ]
      },
      {
        "buttonName": "Paper",
        "buttonIcon": "textures/items/paper",
        "onClick": [
          {
            "type": "openForm",
            "form": "primal.paper"
          }
        ]
      },
      {
        "buttonName": "Leather",
        "buttonIcon": "textures/items/leather",
        "onClick": [
          {
            "type": "openForm",
            "form": "primal.leather"
          }
        ]
      },
      {
        "buttonName": "Raw Orbos",
        "buttonIcon": "textures/items/essence/raw_orbos",
        "onClick": [
          {
            "type": "openForm",
            "form": "primal.raw_orbos"
          }
        ]
      },
      {
        "buttonName": "Essences",
        "buttonIcon": "textures/items/essence/essence_texture",
        "onClick": [
          {
            "type": "openForm",
            "form": "primal.essences"
          }
        ]
      }
    ]
  },

  "primal.saplings": {
    "title": "Saplings",
    "body": [
      "§aItems§r:",
      "- x1 Any Vanilla Sapling",
      "§aBrew Time§r: 3 seconds",
      "",
      "§a§lPrimal Energies§r",
      "§6Solar Energy§r: 0",
      "§bLunar Energy§r: 0",
      "§2Earth Energy§r: 3",
      "§7Sky Energy§r: 0",
      "§5Ender Energy§r: 0",
      "",
      "§aResult§r: x1 Any Vanilla Sapling",
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
      } // Back
    ]
  },
  "primal.bonemeal": {
    "title": "Bonemeal",
    "body": [
      "§aItems§r:",
      "- x3 of Any (Wheat, Beetroot, Carrot, Potato, Poisonous Potato)",
      "§aBrew Time§r: 4 seconds",
      "",
      "§a§lPrimal Energies§r",
      "§6Solar Energy§r: 0",
      "§bLunar Energy§r: 0",
      "§2Earth Energy§r: 3",
      "§7Sky Energy§r: 0",
      "§5Ender Energy§r: 0",
      "",
      "§aResult§r: x1 Bonemeal",
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
      } // Back
    ]
  },
  "primal.sculk_catalyst": {
    "title": "Sculk Catalyst",
    "body": [
      "§aItems§r:",
      "- x4 Bone",
      "- x1 Echo Shard",
      "§aBrew Time§r: 8 seconds",
      "",
      "§a§lPrimal Energies§r",
      "§6Solar Energy§r: 0",
      "§bLunar Energy§r: 60",
      "§2Earth Energy§r: 200",
      "§7Sky Energy§r: 0",
      "§5Ender Energy§r: 120",
      "",
      "§aResult§r: x1 Sculk Catalyst",
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
      } // Back
    ]
  },
  "primal.ink": {
    "title": "Ink Sac",
    "body": [
      "§aItems§r:",
      "- x1 Glowing Ink Sac",
      "§aBrew Time§r: 3 seconds",
      "",
      "§a§lPrimal Energies§r",
      "§6Solar Energy§r: 0",
      "§bLunar Energy§r: 0",
      "§2Earth Energy§r: 5",
      "§7Sky Energy§r: 0",
      "§5Ender Energy§r: 0",
      "",
      "§aResult§r: x1 Ink Sac",
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
      } // Back
    ]
  },
  "primal.glow_ink": {
    "title": "Glowing Ink Sac",
    "body": [
      "§aItems§r:",
      "- x1 Ink Sac",
      "§aBrew Time§r: 3 seconds",
      "",
      "§a§lPrimal Energies§r",
      "§6Solar Energy§r: 0",
      "§bLunar Energy§r: 5",
      "§2Earth Energy§r: 0",
      "§7Sky Energy§r: 0",
      "§5Ender Energy§r: 0",
      "",
      "§aResult§r: x1 Glowing Ink Sac",
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
      } // Back
    ]
  },
  "primal.infused_pumpkin": {
    "title": "Infused Pumpkin",
    "body": [
      "§aItems§r:",
      "- x1 Pumpkin Seeds",
      "- x2 Natural Ash",
      "- x2 Bonemeal",
      "§aBrew Time§r: 5 seconds",
      "",
      "§a§lPrimal Energies§r",
      "§6Solar Energy§r: 0",
      "§bLunar Energy§r: 15",
      "§2Earth Energy§r: 30",
      "§7Sky Energy§r: 0",
      "§5Ender Energy§r: 0",
      "",
      "§aResult§r: x1 Infused Pumpkin",
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
      } // Back
    ]
  },
  "primal.budding_amethyst": {
    "title": "Budding Amethyst",
    "body": [
      "§aItems§r:",
      "- x8 Amethyst Shard",
      "- x1 Bonemeal",
      "§aBrew Time§r: 10 seconds",
      "",
      "§a§lPrimal Energies§r",
      "§6Solar Energy§r: 40",
      "§bLunar Energy§r: 40",
      "§2Earth Energy§r: 240",
      "§7Sky Energy§r: 0",
      "§5Ender Energy§r: 0",
      "",
      "§aResult§r: x1 Budding Amethyst",
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
      } // Back
    ]
  },
  "primal.amethyst_nugget": {
    "title": "Amethyst Nugget",
    "body": [
      "§aItems§r:",
      "- x1 Amethyst Shard",
      "- x1 Empty Map",
      "§aBrew Time§r: 5 seconds",
      "",
      "§a§lPrimal Energies§r",
      "§6Solar Energy§r: s0",
      "§bLunar Energy§r: 0",
      "§2Earth Energy§r: 40",
      "§7Sky Energy§r: 0",
      "§5Ender Energy§r: 0",
      "",
      "§aResult§r: x4 Amethyst Nugget",
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
      } // Back
    ]
  },
  "primal.dripstone": {
    "title": "Pointed Dripstone",
    "body": [
      "§aItems§r:",
      "- x1 Stick",
      "- x1 Dripstone Block",
      "§aBrew Time§r: 6 seconds",
      "",
      "§a§lPrimal Energies§r",
      "§6Solar Energy§r: 0",
      "§bLunar Energy§r: 0",
      "§2Earth Energy§r: 60",
      "§7Sky Energy§r: 30",
      "§5Ender Energy§r: 0",
      "",
      "§aResult§r: x4 Pointed Dripstone",
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
      } // Back
    ]
  },
  "primal.breeze_rod": {
    "title": "Breeze Rod",
    "body": [
      "§aItems§r:",
      "- x1 Stick",
      "- x2 Phantom Membrane",
      "- x1 Feather",
      "§aBrew Time§r: 6 seconds",
      "",
      "§a§lPrimal Energies§r",
      "§6Solar Energy§r: 0",
      "§bLunar Energy§r: 0",
      "§2Earth Energy§r: 20",
      "§7Sky Energy§r: 320",
      "§5Ender Energy§r: 0",
      "",
      "§aResult§r: x1 Breeze Rod",
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
      } // Back
    ]
  },
  "primal.blaze_rod": {
    "title": "Blaze Rod",
    "body": [
      "§aItems§r:",
      "- x1 Stick",
      "- x4 Coal Dust",
      "- x2 Gunpowder",
      "§aBrew Time§r: 6 seconds",
      "",
      "§a§lPrimal Energies§r",
      "§6Solar Energy§r: 320",
      "§bLunar Energy§r: 0",
      "§2Earth Energy§r: 20",
      "§7Sky Energy§r: 0",
      "§5Ender Energy§r: 0",
      "",
      "§aResult§r: x1 Blaze Rod",
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
      } // Back
    ]
  },
  "primal.shulker_shell": {
    "title": "Shulker Shell",
    "body": [
      "§aItems§r:",
      "- x1 Natural Ash",
      "- x1 Turtle Scute OR Armadillo Scute",
      "§aBrew Time§r: 4 seconds",
      "",
      "§a§lPrimal Energies§r",
      "§6Solar Energy§r: 0",
      "§bLunar Energy§r: 0",
      "§2Earth Energy§r: 0",
      "§7Sky Energy§r: 0",
      "§5Ender Energy§r: 120",
      "",
      "§aResult§r: x1 Shulker Shell",
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
      } // Back
    ]
  },
  "primal.scutes": {
    "title": "Scutes",
    "body": [
      "§aItems§r:",
      "- x1 Shulker Shell",
      "§aBrew Time§r: 4 seconds",
      "",
      "§a§lPrimal Energies§r",
      "§6Solar Energy§r: 0",
      "§bLunar Energy§r: 60",
      "§2Earth Energy§r: 60",
      "§7Sky Energy§r: 0",
      "§5Ender Energy§r: 0",
      "",
      "§aResult§r: x1 Turtle Scute OR x1 Armadillo Scute",
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
      } // Back
    ]
  },
  "primal.trident": {
    "title": "Trident",
    "body": [
      "§aItems§r:",
      "- x1 Iron Spear",
      "- x3 Prismarine Shard",
      "§aBrew Time§r: 8 seconds",
      "",
      "§a§lPrimal Energies§r",
      "§6Solar Energy§r: 0",
      "§bLunar Energy§r: 240",
      "§2Earth Energy§r: 0",
      "§7Sky Energy§r: 120",
      "§5Ender Energy§r: 0",
      "",
      "§aResult§r: x1 Trident",
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
      } // Back
    ]
  },
  "primal.sea_lantern": {
    "title": "Sea Lantern",
    "body": [
      "§aItems§r:",
      "- x1 Glowstone",
      "§aBrew Time§r: 4 seconds",
      "",
      "§a§lPrimal Energies§r",
      "§6Solar Energy§r: 0",
      "§bLunar Energy§r: 60",
      "§2Earth Energy§r: 0",
      "§7Sky Energy§r: 0",
      "§5Ender Energy§r: 0",
      "",
      "§aResult§r: x1 Sea Lantern",
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
      } // Back
    ]
  },
  "primal.glowstone": {
    "title": "Glowstone Dust",
    "body": [
      "§aItems§r:",
      "- x2 Blaze Powder",
      "- x1 Stone OR Andesite OR Granite OR Diorite",
      "§aBrew Time§r: 5 seconds",
      "",
      "§a§lPrimal Energies§r",
      "§6Solar Energy§r: 30",
      "§bLunar Energy§r: 0",
      "§2Earth Energy§r: 0",
      "§7Sky Energy§r: 0",
      "§5Ender Energy§r: 0",
      "",
      "§aResult§r: x4 Glowstone Dust",
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
      } // Back
    ]
  },
  "primal.crying_obsidian": {
    "title": "Crying Obsidian",
    "body": [
      "§aItems§r:",
      "- x1 Obsidian",
      "- x1 Amethyst Dust",
      "§aBrew Time§r: 6 seconds",
      "",
      "§a§lPrimal Energies§r",
      "§6Solar Energy§r: 0",
      "§bLunar Energy§r: 0",
      "§2Earth Energy§r: 0",
      "§7Sky Energy§r: 0",
      "§5Ender Energy§r: 120",
      "",
      "§aResult§r: x1 Crying Obsidian",
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
      } // Back
    ]
  },
  "primal.ender_pearl": {
    "title": "Ender Pearl",
    "body": [
      "§aItems§r:",
      "- x1 Obsidian",
      "- x2 Slime Ball",
      "- x2 Chorus Fruit",
      "§aBrew Time§r: 6 seconds",
      "",
      "§a§lPrimal Energies§r",
      "§6Solar Energy§r: 0",
      "§bLunar Energy§r: 0",
      "§2Earth Energy§r: 0",
      "§7Sky Energy§r: 0",
      "§5Ender Energy§r: 70",
      "",
      "§aResult§r: x2 Ender Pearl",
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
      } // Back
    ]
  },
  "primal.cactus": {
    "title": "Cactus",
    "body": [
      "§aItems§r:",
      "- x1 Sand",
      "- x2 Wheat Seeds",
      "§aBrew Time§r: 3 seconds",
      "",
      "§a§lPrimal Energies§r",
      "§6Solar Energy§r: 10",
      "§bLunar Energy§r: 0",
      "§2Earth Energy§r: 10",
      "§7Sky Energy§r: 0",
      "§5Ender Energy§r: 0",
      "",
      "§aResult§r: x1 Cactus",
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
      } // Back
    ]
  },
  "primal.seeds": {
    "title": "Seeds",
    "body": [
      "§aItems§r:",
      "- x1 Most Seeds (not Ancient Seeds)",
      "§aBrew Time§r: 3 seconds",
      "",
      "§a§lPrimal Energies§r",
      "§6Solar Energy§r: 5",
      "§bLunar Energy§r: 0",
      "§2Earth Energy§r: 5",
      "§7Sky Energy§r: 0",
      "§5Ender Energy§r: 0",
      "",
      "§aResult§r: x1 Most Seeds (not Ancient Seeds)",
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
      } // Back
    ]
  },
  "primal.iron": {
    "title": "Raw Iron",
    "body": [
      "§aItems§r:",
      "- x2 Raw Copper",
      "§aBrew Time§r: 8 seconds",
      "",
      "§a§lPrimal Energies§r",
      "§6Solar Energy§r: 0",
      "§bLunar Energy§r: 0",
      "§2Earth Energy§r: 15",
      "§7Sky Energy§r: 0",
      "§5Ender Energy§r: 0",
      "",
      "§aResult§r: x1 Raw Iron",
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
      } // Back
    ]
  },
  "primal.gold": {
    "title": "Raw Gold",
    "body": [
      "§aItems§r:",
      "- x2 Raw Iron",
      "§aBrew Time§r: 8 seconds",
      "",
      "§a§lPrimal Energies§r",
      "§6Solar Energy§r: 15",
      "§bLunar Energy§r: 0",
      "§2Earth Energy§r: 15",
      "§7Sky Energy§r: 0",
      "§5Ender Energy§r: 0",
      "",
      "§aResult§r: x1 Raw Gold",
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
      } // Back
    ]
  },
  "primal.diamond": {
    "title": "Diamond",
    "body": [
      "§aItems§r:",
      "- x16 Coal OR x32 Charcoal",
      "§aBrew Time§r: 12 seconds",
      "",
      "§a§lPrimal Energies§r",
      "§6Solar Energy§r: 0",
      "§bLunar Energy§r: 0",
      "§2Earth Energy§r: 600",
      "§7Sky Energy§r: 0",
      "§5Ender Energy§r: 0",
      "",
      "§aResult§r: x1 Diamond",
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
      } // Back
    ]
  },
  "primal.crystals": {
    "title": "Crystals",
    "body": [
      "§aItems§r:",
      "- x1 Quartz OR Amethyst Shard",
      "§aBrew Time§r: 6 seconds",
      "",
      "§a§lPrimal Energies§r",
      "§6Solar Energy§r: 0",
      "§bLunar Energy§r: 0",
      "§2Earth Energy§r: 70",
      "§7Sky Energy§r: 0",
      "§5Ender Energy§r: 0",
      "",
      "§aResult§r: x1 Quartz OR Amethyst Shard",
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
      } // Back
    ]
  },
  "primal.flint": {
    "title": "Flint",
    "body": [
      "§aItems§r:",
      "- x1 Gravel",
      "§aBrew Time§r: 3 seconds",
      "",
      "§a§lPrimal Energies§r",
      "§6Solar Energy§r: 0",
      "§bLunar Energy§r: 0",
      "§2Earth Energy§r: 50",
      "§7Sky Energy§r: 10",
      "§5Ender Energy§r: 0",
      "",
      "§aResult§r: x1 Flint",
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
      } // Back
    ]
  },
  "primal.golden_apple": {
    "title": "Golden Apple",
    "body": [
      "§aItems§r:",
      "- x1 Apple",
      "- x8 Gold Nugget",
      "§aBrew Time§r: 6 seconds",
      "",
      "§a§lPrimal Energies§r",
      "§6Solar Energy§r: 120",
      "§bLunar Energy§r: 0",
      "§2Earth Energy§r: 0",
      "§7Sky Energy§r: 0",
      "§5Ender Energy§r: 0",
      "",
      "§aResult§r: x1 Golden Apple",
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
      } // Back
    ]
  },
  "primal.enchanted_golden_apple": {
    "title": "Enchanted Golden Apple",
    "body": [
      "§aItems§r:",
      "- x1 Apple",
      "- x8 Gold Ingot",
      "§aBrew Time§r: 6 seconds",
      "",
      "§a§lPrimal Energies§r",
      "§6Solar Energy§r: 300",
      "§bLunar Energy§r: 0",
      "§2Earth Energy§r: 0",
      "§7Sky Energy§r: 0",
      "§5Ender Energy§r: 0",
      "",
      "§aResult§r: x1 Enchanted Golden Apple",
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
      } // Back
    ]
  },
  "primal.orbic_honey": {
    "title": "Orbic Honey Bottle",
    "body": [
      "§aItems§r:",
      "- x3 Orbic Honeycomb",
      "- x1 Glass Bottle",
      "§aBrew Time§r: 6 seconds",
      "",
      "§a§lPrimal Energies§r",
      "§6Solar Energy§r: 120",
      "§bLunar Energy§r: 0",
      "§2Earth Energy§r: 60",
      "§7Sky Energy§r: 0",
      "§5Ender Energy§r: 0",
      "",
      "§aResult§r: x1 Orbic Honey Bottle",
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
      } // Back
    ]
  },
  "primal.honeycomb": {
    "title": "Honeycomb",
    "body": [
      "§aItems§r:",
      "- x1 Orbic Honeycomb",
      "§aBrew Time§r: 2 seconds",
      "",
      "§a§lPrimal Energies§r",
      "§6Solar Energy§r: 0",
      "§bLunar Energy§r: 0",
      "§2Earth Energy§r: 10",
      "§7Sky Energy§r: 0",
      "§5Ender Energy§r: 0",
      "",
      "§aResult§r: x1 Honeycomb, x1 Raw Orbos",
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
      } // Back
    ]
  },
  "primal.paper": {
    "title": "Paper",
    "body": [
      "§aItems§r:",
      "- x1 Sugar Cane/Bamboo",
      "- x1 Natural Ash",
      "§aBrew Time§r: 4 seconds",
      "",
      "§a§lPrimal Energies§r",
      "§6Solar Energy§r: 5",
      "§bLunar Energy§r: 0",
      "§2Earth Energy§r: 5",
      "§7Sky Energy§r: 0",
      "§5Ender Energy§r: 0",
      "",
      "§aResult§r: x2 Paper",
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
      } // Back
    ]
  },
  "primal.leather": {
    "title": "Leather",
    "body": [
      "§aItems§r:",
      "- x3 Rotten Flesh",
      "- x1 Natural Ash",
      "§aBrew Time§r: 4 seconds",
      "",
      "§a§lPrimal Energies§r",
      "§6Solar Energy§r: 10",
      "§bLunar Energy§r: 0",
      "§2Earth Energy§r: 0",
      "§7Sky Energy§r: 0",
      "§5Ender Energy§r: 0",
      "",
      "§aResult§r: x1 Leather",
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
      } // Back
    ]
  },
  "primal.raw_orbos": {
    "title": "Raw Orbos",
    "body": [
      "§aItems§r:",
      "- x1 Blood Essence OR Blood Anti-Essence",
      "§aBrew Time§r: 4 seconds",
      "",
      "§a§lPrimal Energies§r",
      "§6Solar Energy§r: 0",
      "§bLunar Energy§r: 0",
      "§2Earth Energy§r: 0",
      "§7Sky Energy§r: 0",
      "§5Ender Energy§r: 10",
      "",
      "§aResult§r: x1 Raw Orbos",
      "",
      "---------------",
      "",
      "§aItems§r:",
      "- x1 Pure Quintessence OR Mixed Quintessence",
      "§aBrew Time§r: 6 seconds",
      "",
      "§a§lPrimal Energies§r",
      "§6Solar Energy§r: 0",
      "§bLunar Energy§r: 0",
      "§2Earth Energy§r: 0",
      "§7Sky Energy§r: 0",
      "§5Ender Energy§r: 10",
      "",
      "§aResult§r: x5 Raw Orbos",
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
      } // Back
    ]
  },
  "primal.essences": {
    "title": "Essences",
    "body": [
      "§aItems§r:",
      "- x1 Blood Vial",
      "§aBrew Time§r: 5 seconds",
      "",
      "§a§lPrimal Energies§r",
      "§6Solar Energy§r: 30",
      "§bLunar Energy§r: 30",
      "§2Earth Energy§r: 30",
      "§7Sky Energy§r: 30",
      "§5Ender Energy§r: 30",
      "",
      "§aResult§r: §6Essences§r",
      "",
      "§oBlood Essences come in two varieties: Blood Essence and Blood Anti-Essence. These essences draw from the Blood being alchemically broken down. These are used when creating Quintessence, an essential for filtering out entities in magical effects.§r",
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
      } // Back
    ]
  }
}