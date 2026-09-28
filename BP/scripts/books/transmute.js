export const transmuteRecipes = {
  "introduction": {
    "title": "Primal Alchemy & You",
    "body": "Primal Alchemy is the art of changing one item into another item through the use of primal energies. While this tome does not go into explicit details of this process (see the LookUp book), it does include a comprehensive list of all recipes.\n\n",
    "buttons": [
      {
        "buttonName": "Saplings",
        "buttonIcon": "textures/blocks/sapling_oak",
        "onClick": [
          {
            "type": "openForm",
            "form": "transmute.saplings"
          }
        ]
      },
      {
        "buttonName": "Bonemeal",
        "buttonIcon": "textures/items/dye_powder_white",
        "onClick": [
          {
            "type": "openForm",
            "form": "transmute.crops"
          }
        ]
      },
      {
        "buttonName": "Sculk Catalyst",
        "buttonIcon": "textures/blocks/sculk_catalyst_side",
        "onClick": [
          {
            "type": "openForm",
            "form": "transmute.sculk_catalyst"
          }
        ]
      },
      {
        "buttonName": "Glow Ink Sac",
        "buttonIcon": "textures/items/dye_powder_glow",
        "onClick": [
          {
            "type": "openForm",
            "form": "transmute.glow_ink_sac"
          }
        ]
      },
      {
        "buttonName": "Small Budding Amethyst",
        "buttonIcon": "textures/blocks/amethyst_cluster",
        "onClick": [
          {
            "type": "openForm",
            "form": "transmute.amethyst_bud"
          }
        ]
      },
      {
        "buttonName": "Torch",
        "buttonIcon": "textures/blocks/torch_on",
        "onClick": [
          {
            "type": "openForm",
            "form": "transmute.torch"
          }
        ]
      },
      {
        "buttonName": "Breeze Rod",
        "buttonIcon": "textures/items/breeze_rod",
        "onClick": [
          {
            "type": "openForm",
            "form": "transmute.breeze_rod"
          }
        ]
      },
      {
        "buttonName": "Blaze Rod",
        "buttonIcon": "textures/items/blaze_rod",
        "onClick": [
          {
            "type": "openForm",
            "form": "transmute.blaze_rod"
          }
        ]
      },
      {
        "buttonName": "Trident",
        "buttonIcon": "textures/items/trident",
        "onClick": [
          {
            "type": "openForm",
            "form": "transmute.trident"
          }
        ]
      },
      {
        "buttonName": "Sea Lantern",
        "buttonIcon": "textures/blocks/sea_lantern_img",
        "onClick": [
          {
            "type": "openForm",
            "form": "transmute.sea_lantern"
          }
        ]
      },
      {
        "buttonName": "Glowstone Dust",
        "buttonIcon": "textures/items/glowstone_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "transmute.glowstone_dust"
          }
        ]
      },
      {
        "buttonName": "Wind Charge",
        "buttonIcon": "textures/items/wind_charge",
        "onClick": [
          {
            "type": "openForm",
            "form": "transmute.wind_charge"
          }
        ]
      },
      {
        "buttonName": "Crying Obsidian",
        "buttonIcon": "textures/blocks/crying_obsidian",
        "onClick": [
          {
            "type": "openForm",
            "form": "transmute.crying_obsidian"
          }
        ]
      },
      {
        "buttonName": "Ender Pearl",
        "buttonIcon": "textures/items/ender_pearl",
        "onClick": [
          {
            "type": "openForm",
            "form": "transmute.ender_pearl"
          }
        ]
      },
      {
        "buttonName": "Cactus",
        "buttonIcon": "textures/blocks/cactus_side.tga",
        "onClick": [
          {
            "type": "openForm",
            "form": "transmute.cactus"
          }
        ]
      },
      {
        "buttonName": "Orbic Honey Bottle",
        "buttonIcon": "textures/items/essence/honey_orbos_bottle",
        "onClick": [
          {
            "type": "openForm",
            "form": "transmute.orbos_honey"
          }
        ]
      },
      {
        "buttonName": "Orbos Honeycomb",
        "buttonIcon": "textures/items/essence/honey_orbos",
        "onClick": [
          {
            "type": "openForm",
            "form": "transmute.honeycomb"
          }
        ]
      }
    ]
  },

  "transmute.saplings": {
    "title": "Saplings",
    "body": "§aInput§r: Sapling (any vanilla kind)\n§aOutput§r: Other Sapling (won't be the same as Input)\n§aBrew Time§r: 3 seconds\n\n§6Solar Energy§r: 0\n§bLunar Energy§r: 0\n§2Earth Energy§r: 3\n§7Sky Energy§r: 0\n§5Ender Energy§r: 0\n\n",
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
  "transmute.crops": {
    "title": "Bonemeal",
    "body": "§aInput§r: Crops (wheat, beetroot, carrot, potato)\n§aOutput§r: Bonemeal\n§aBrew Time§r: 3 seconds\n\n§6Solar Energy§r: 0\n§bLunar Energy§r: 0\n§2Earth Energy§r: 3\n§7Sky Energy§r: 0\n§5Ender Energy§r: 0\n\n",
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
  "transmute.sculk_catalyst": {
    "title": "Sculk Catalyst",
    "body": "§aInput§r: Sculk Vein\n§aOutput§r: Sculk Catalyst\n§aBrew Time§r: 20 seconds\n\n§6Solar Energy§r: 0\n§bLunar Energy§r: 15\n§2Earth Energy§r: 35\n§7Sky Energy§r: 0\n§5Ender Energy§r: 0\n\n",
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
  "transmute.glow_ink_sac": {
    "title": "Glow Ink Sac",
    "body": "§aInput§r: Ink Sac\n§aOutput§r: Glow Ink Sac\n§aBrew Time§r: 1 second\n\n§6Solar Energy§r: 0\n§bLunar Energy§r: 5\n§2Earth Energy§r: 0\n§7Sky Energy§r: 0\n§5Ender Energy§r: 0\n\n",
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
  "transmute.amethyst_bud": {
    "title": "Small Amethyst Bud",
    "body": "§aInput§r: Amethyst Shard\n§aOutput§r: Small Amethyst Bud\n§aBrew Time§r: 8 seconds\n\n§6Solar Energy§r: 0\n§bLunar Energy§r: 240\n§2Earth Energy§r: 0\n§7Sky Energy§r: 60\n§5Ender Energy§r: 0\n\n",
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
  "transmute.torch": {
    "title": "Torch",
    "body": "§aInput§r: Stick\n§aOutput§r: Torch\n§aBrew Time§r: 4 seconds\n\n§6Solar Energy§r: 5\n§bLunar Energy§r: 0\n§2Earth Energy§r: 3\n§7Sky Energy§r: 0\n§5Ender Energy§r: 0\n\n",
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
  "transmute.breeze_rod": {
    "title": "Breeze Rod",
    "body": "§aInput§r: Stick\n§aOutput§r: Breeze Rod\n§aBrew Time§r: 5 seconds\n\n§6Solar Energy§r: 0\n§bLunar Energy§r: 0\n§2Earth Energy§r: 0\n§7Sky Energy§r: 420\n§5Ender Energy§r: 0\n\n",
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
  "transmute.blaze_rod": {
    "title": "Blaze Rod",
    "body": "§aInput§r: Stick\n§aOutput§r: Blaze Rod\n§aBrew Time§r: 5 seconds\n\n§6Solar Energy§r: 420\n§bLunar Energy§r: 0\n§2Earth Energy§r: 0\n§7Sky Energy§r: 0\n§5Ender Energy§r: 0\n\n",
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
  "transmute.trident": {
    "title": "Trident",
    "body": "§aInput§r: Prismarine Shard\n§aOutput§r: Trident\n§aBrew Time§r: 5 seconds\n\n§6Solar Energy§r: 0\n§bLunar Energy§r: 220\n§2Earth Energy§r: 0\n§7Sky Energy§r: 120\n§5Ender Energy§r: 0\n\n",
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
  "transmute.sea_lantern": {
    "title": "Sea Lantern",
    "body": "§aInput§r: Glowstone\n§aOutput§r: Sea Lantern\n§aBrew Time§r: 4 seconds\n\n§6Solar Energy§r: 0\n§bLunar Energy§r: 50\n§2Earth Energy§r: 0\n§7Sky Energy§r: 0\n§5Ender Energy§r: 0\n\n",
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
  "transmute.glowstone_dust": {
    "title": "Glowstone Dust",
    "body": "§aInput§r: Stone, Andesite, Granite, Diorite\n§aOutput§r: Glowstone Dust\n§aBrew Time§r: 4 seconds\n\n§6Solar Energy§r: 0\n§bLunar Energy§r: 50\n§2Earth Energy§r: 0\n§7Sky Energy§r: 0\n§5Ender Energy§r: 0\n\n",
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
  "transmute.wind_charge": {
    "title": "Wind Charge",
    "body": "§aInput§r: Feather\n§aOutput§r: Wind Charge\n§aBrew Time§r: 3 seconds\n\n§6Solar Energy§r: 0\n§bLunar Energy§r: 0\n§2Earth Energy§r: 0\n§7Sky Energy§r: 80\n§5Ender Energy§r: 0\n\n",
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
  "transmute.crying_obsidian": {
    "title": "Crying Obsidian",
    "body": "§aInput§r: Obsidian\n§aOutput§r: Crying Obsidian\n§aBrew Time§r: 6 seconds\n\n§6Solar Energy§r: 0\n§bLunar Energy§r: 0\n§2Earth Energy§r: 0\n§7Sky Energy§r: 0\n§5Ender Energy§r: 250\n\n",
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
  "transmute.ender_pearl": {
    "title": "Ender Pearl",
    "body": "§aInput§r: Obsidian\n§aOutput§r: Ender Pearl\n§aBrew Time§r: 6 seconds\n\n§6Solar Energy§r: 0\n§bLunar Energy§r: 0\n§2Earth Energy§r: 0\n§7Sky Energy§r: 0\n§5Ender Energy§r: 60\n\n",
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
  "transmute.cactus": {
    "title": "Cactus",
    "body": "§aInput§r: Sand, Red Sand\n§aOutput§r: Cactus\n§aBrew Time§r: 4 seconds\n\n§6Solar Energy§r: 10\n§bLunar Energy§r: 0\n§2Earth Energy§r: 10\n§7Sky Energy§r: 0\n§5Ender Energy§r: 0\n\n",
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
  "transmute.orbos_honey": {
    "title": "Orbic Honey Bottle",
    "body": "§aInput§r: Orbos Honeycomb\n§aOutput§r: Orbic Honey Bottle\n§aBrew Time§r: 10 seconds\n\n§6Solar Energy§r: 120\n§bLunar Energy§r: 0\n§2Earth Energy§r: 60\n§7Sky Energy§r: 0\n§5Ender Energy§r: 0\n\n",
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
  "transmute.honeycomb": {
    "title": "Honeycomb",
    "body": "§aInput§r: Honeycomb\n§aOutput§r: Orbic Honey Bottle\n§aBrew Time§r: 8 seconds\n\n§6Solar Energy§r: 10\n§bLunar Energy§r: 0\n§2Earth Energy§r: 0\n§7Sky Energy§r: 0\n§5Ender Energy§r: 0\n\n",
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

export const spellMods = {
  "introduction": {
    "title": "Spell Modifiers for Masters",
    "body": "§r",
    "buttons": [
      {
        "buttonName": "Redstone",
        "buttonIcon": "textures/items/redstone_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "modifier.redstone"
          }
        ]
      },
      {
        "buttonName": "Emerald",
        "buttonIcon": "textures/items/emerald",
        "onClick": [
          {
            "type": "openForm",
            "form": "modifier.emerald"
          }
        ]
      },
      {
        "buttonName": "Arrow",
        "buttonIcon": "textures/items/arrow",
        "onClick": [
          {
            "type": "openForm",
            "form": "modifier.arrow"
          }
        ]
      },
      {
        "buttonName": "Glowstone Dust",
        "buttonIcon": "textures/items/glowstone_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "modifier.glowstone"
          }
        ]
      },
      {
        "buttonName": "String",
        "buttonIcon": "textures/items/string",
        "onClick": [
          {
            "type": "openForm",
            "form": "modifier.string"
          }
        ]
      },
      {
        "buttonName": "Cobweb",
        "buttonIcon": "textures/blocks/web",
        "onClick": [
          {
            "type": "openForm",
            "form": "modifier.cobweb"
          }
        ]
      },
      {
        "buttonName": "Gunpowder",
        "buttonIcon": "textures/items/gunpowder",
        "onClick": [
          {
            "type": "openForm",
            "form": "modifier.gunpowder"
          }
        ]
      },
      {
        "buttonName": "Sugar",
        "buttonIcon": "textures/items/sugar",
        "onClick": [
          {
            "type": "openForm",
            "form": "modifier.sugar"
          }
        ]
      },
      {
        "buttonName": "Fermented Spider Eye",
        "buttonIcon": "textures/items/fermented_spider_eye",
        "onClick": [
          {
            "type": "openForm",
            "form": "modifier.fermented_spider_eye"
          }
        ]
      },
      {
        "buttonName": "Honeycomb",
        "buttonIcon": "textures/items/honeycomb",
        "onClick": [
          {
            "type": "openForm",
            "form": "modifier.honeycomb"
          }
        ]
      },
      {
        "buttonName": "Slimeball",
        "buttonIcon": "textures/items/slimeball",
        "onClick": [
          {
            "type": "openForm",
            "form": "modifier.slime_ball"
          }
        ]
      },
      {
        "buttonName": "Crossbow",
        "buttonIcon": "textures/items/crossbow",
        "onClick": [
          {
            "type": "openForm",
            "form": "modifier.crossbow"
          }
        ]
      },
      {
        "buttonName": "Shulker Shell",
        "buttonIcon": "textures/items/shulker_shell",
        "onClick": [
          {
            "type": "openForm",
            "form": "modifier.shulker_shell"
          }
        ]
      },
      {
        "buttonName": "Dyes",
        "buttonIcon": "textures/items/dye_powder_blue_new",
        "onClick": [
          {
            "type": "openForm",
            "form": "modifier.dyes"
          }
        ]
      }
    ]
  },

  "modifier.redstone": {
    "title": "Redstone",
    "body": "Increases width and radius by 1. Works with Bubble spells and spells that have radius overall. Touch Stone is affected by this modifier as well.\n\n* Counts towards Modifier Limit\n\n",
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
  "modifier.emerald": {
    "title": "Emerald",
    "body": "Increases minimum radius and height by 1. Works with Bubble spells and spells that have radius overall. Touch Stone is affected by this modifier as well.\n\n* Counts towards Modifier Limit\n\n",
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
  "modifier.arrow": {
    "title": "Arrow",
    "body": "Increases the force of gravity on a spell glyph. It only affects the Missile and the Bolt Glyphs.\n\n",
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
  "modifier.glowstone": {
    "title": "Glowstone Dust",
    "body": "A very multi-faceted modifier that affects spell power and damage by increasing it by 1. This goes for Heal, Mend, damaging Glyphs and potion effect applying/removing Glyphs (increases their power by 1).\n\n* Counts towards Modifier Limit\n\n",
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
  "modifier.string": {
    "title": "String",
    "body": "Increases duration by +5. Important for extending glyph durations that usually do not last very long (eg. Bubble).\n\n* Counts towards Modifier Limit\n\n",
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
  "modifier.cobweb": {
    "title": "Cobweb",
    "body": "Multiplies duration by 3. Important for extending glyph durations that usually do not last very long (eg. Evoke).\n\n* Counts towards Modifier Limit\n\n",
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
  "modifier.gunpowder": {
    "title": "Gunpowder",
    "body": "Makes it so that when the spell is performed as a Glyph, it is cast instantaneously. It is NOT bound to the Wand after the glyph is drawn, so it cannot be spammed. However, spells like this do not overwrite spells imbued on the Wand either.\n\n",
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
  "modifier.sugar": {
    "title": "Gunpowder",
    "body": "Makes it so that when the spell is performed as a Glyph, it is imbued into the Wand and are cast when the Wand is used. By default, all spells function like this. There can only be one (1) imbued spell on a Wand at a time.\n\n",
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
  "modifier.fermented_spider_eye": {
    "title": "Fermented Spider Eye",
    "body": "Inverses the effects of certain Glyphs. Not every one has an inversion, so take care to not waste Modifier Slots.\n\n",
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
  "modifier.honeycomb": {
    "title": "Honeycomb",
    "body": "Reverses a Glyph if it is currently in its inversed state.\n\n",
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
  "modifier.slime_ball": {
    "title": "Slimeball",
    "body": "Only compatible with Missile and Bolt. Increases the bouncability of the projectile by 1. Bouncability represents how many times the projectile conjured with bounce off blocks.\n\n",
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
  "modifier.crossbow": {
    "title": "Crossbow",
    "body": "Only compatible with Missile and Bolt and only functions on spell projectiles with bouncability. Each time the projectile bounces, it splits into more projectiles. The amount depends on how many Crossbows were used in the spell's creation.\n\n",
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
  "modifier.shulker_shell": {
    "title": "Shulker Shell",
    "body": "Only compatible with Missile and Bolt. Forces the projectile to home in on any nearby valid entity.\n\n",
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
  "modifier.dyes": {
    "title": "Dyes",
    "body": "Adds a color to a Glyph, and is best used on Verbs. A spell verb can have up to two colors.\n\n",
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
}