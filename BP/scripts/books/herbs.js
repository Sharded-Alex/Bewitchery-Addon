import {herbToString} from "herbList.js";
export const herbAlmanac = {
  "introduction": {
    "title": "Of Herbs, Stones & Organs",
    "body": "Alchemy is the art of mixing reagents and modifiers in the Cauldron to produce customized potions and elixirs. However, what are the materials used in this process? That is where this book comes into play. Here lies the documentable* information on each alchemical materials.\n\n* §oAlchemy is an art as much as it is a science. Reagents rarely keep the same primary effects across worlds, so you should keep your own notes in that regard.§r\n\n",
    "buttons": [
      {
        "buttonName": "Reagents",
        "buttonIcon": "textures/items/bundle",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.frontPage"
          }
        ]
      },
      {
        "buttonName": "Modifiers",
        "buttonIcon": "textures/items/bundle",
        "onClick": [
          {
            "type": "openForm",
            "form": "modifiers.frontPage"
          }
        ]
      }
    ]
  },
  
  // Reagents
  // - Item Name
  // - Secondary Type and Affected Effects
  // - Primal Element
  // - Brief description of the plant/material. Perhaps talking about where it can be found.
  "reagents.frontPage": {
    "title": "Reagents",
    "body": "§r",
    "buttons": [
      {
        "buttonName": "Dandelion",
        "buttonIcon": "textures/blocks/flower_dandelion",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.dandelion"
          }
        ]
      },
      {
        "buttonName": "Poppy",
        "buttonIcon": "textures/blocks/flower_rose",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.poppy"
          }
        ]
      },
      {
        "buttonName": "Blue Orchid",
        "buttonIcon": "textures/blocks/flower_blue_orchid",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.blue_orchid"
          }
        ]
      },
      {
        "buttonName": "Cornflower",
        "buttonIcon": "textures/blocks/flower_cornflower",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.cornflower"
          }
        ]
      },
      {
        "buttonName": "Oxeye Daisy",
        "buttonIcon": "textures/blocks/flower_oxeye_daisy",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.oxeye_daisy"
          }
        ]
      },
      {
        "buttonName": "Allium",
        "buttonIcon": "textures/blocks/flower_allium",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.allium"
          }
        ]
      },
      {
        "buttonName": "Lily of the Valley",
        "buttonIcon": "textures/blocks/flower_lily_of_the_valley",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.lily_of_the_valley"
          }
        ]
      },
      {
        "buttonName": "Tulips",
        "buttonIcon": "textures/blocks/flower_tulip_red",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.tulips"
          }
        ]
      },
      {
        "buttonName": "Azure Bluet",
        "buttonIcon": "textures/blocks/flower_houstonia",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.azure_bluet"
          }
        ]
      },
      {
        "buttonName": "Wither Rose",
        "buttonIcon": "textures/blocks/flower_wither_rose",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.wither_rose"
          }
        ]
      },
      {
        "buttonName": "Fermented Spider Eye",
        "buttonIcon": "textures/items/spider_eye_fermented",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.fermented_spider_eye"
          }
        ]
      },
      {
        "buttonName": "Feather",
        "buttonIcon": "textures/items/feather",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.feather"
          }
        ]
      },
      {
        "buttonName": "Phantom Membrane",
        "buttonIcon": "textures/items/phantom_membrane",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.phantom_membrane"
          }
        ]
      },
      {
        "buttonName": "Gold Ingot",
        "buttonIcon": "textures/items/gold_ingot",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.gold_ingot"
          }
        ]
      },
      {
        "buttonName": "Iron Ingot",
        "buttonIcon": "textures/items/iron_ingot",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.iron_ingot"
          }
        ]
      },
      {
        "buttonName": "Turtle Scute",
        "buttonIcon": "textures/items/turtle_shell_piece",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.scute"
          }
        ]
      },
      {
        "buttonName": "Armadillo Scute",
        "buttonIcon": "textures/items/armadillo_scute",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.armadillo_scute"
          }
        ]
      },
      {
        "buttonName": "Prismarine Crystals",
        "buttonIcon": "textures/items/prismarine_crystals",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.prismarine_crystals"
          }
        ]
      },
      {
        "buttonName": "Nautilus Shell",
        "buttonIcon": "textures/items/nautilus",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.nautilus_shell"
          }
        ]
      },
      {
        "buttonName": "Ghast Tear",
        "buttonIcon": "textures/items/ghast_tear",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.ghast_tear"
          }
        ]
      },
      {
        "buttonName": "Echo Shard",
        "buttonIcon": "textures/items/echo_shard",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.echo_shard"
          }
        ]
      },
      {
        "buttonName": "Magma Cream",
        "buttonIcon": "textures/items/magma_cream",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.magma_cream"
          }
        ]
      },
      {
        "buttonName": "Resin Clump",
        "buttonIcon": "textures/items/resin_clump",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.resin_clump"
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
  "reagents.dandelion": {
    "title": "Dandelion",
    "body": `${herbToString("minecraft:dandelion")}\n§oAs a flower of the skies, Dandelion has a strong affinity with the Primal Element of Sky. This is made even more obvious because of how common Dandelion is, as it can be found in forests, in plains, along rivers, and more.\n\n`,
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.frontPage"
          }
        ]
      }
    ]
  },
  "reagents.poppy": {
    "title": "Poppy",
    "body": `${herbToString("minecraft:poppy")}\n§oDrugs.§r\n\n`,
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.frontPage"
          }
        ]
      }
    ]
  },
  "reagents.blue_orchid": {
    "title": "Blue Orchid",
    "body": `${herbToString("minecraft:blue_orchid")}\n§oAs a generally difficult to get their hands on, Alchemists tend to collect this herb in swamps when they can so they can grow it later.§r\n\n`,
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.frontPage"
          }
        ]
      }
    ]
  },
  "reagents.cornflower": {
    "title": "Cornflower",
    "body": `${herbToString("minecraft:cornflower")}\n§oThese blue petaled flowers are a common sight around forests and plains. In fact, villages tend to feature Cornflowers, Oxeye Daisies and Poppies quite a bit. Perhaps they should be points of interest for wayward Alchemists looking for these flowers.§r\n\n`,
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.frontPage"
          }
        ]
      }
    ]
  },
  "reagents.oxeye_daisy": {
    "title": "Oxeye Daisy",
    "body": `${herbToString("minecraft:oxeye_daisy")}\n§oThe Oxeye Daisy is recognized as a flower with amazing healing properties because of their secondary effects. Although it can be rare at times, they also pop up often in the plains and in birch forests. Personally, I find that this plant likes hills and mountains quite a bit.§r\n\n`,
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.frontPage"
          }
        ]
      }
    ]
  },
  "reagents.allium": {
    "title": "Allium",
    "body": `${herbToString("minecraft:allium")}\n§oA lesser mentioned flower that has delicate and beautiful magenta petals. It can be found growing in flower forests and meadows, like most flowers that exist.§r\n\n`,
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.frontPage"
          }
        ]
      }
    ]
  },
  "reagents.lily_of_the_valley": {
    "title": "Lily of the Valley",
    "body": `${herbToString("minecraft:lily_of_the_valley")}\n§oA naturally poisonous plant despite its Mab-like beauty. In fact, the Queen of Winter does like these beautiful flowers. They can be found growing in most forests, but specifically flower and birch forests.§r\n\n`,
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.frontPage"
          }
        ]
      }
    ]
  },
  "reagents.tulips": {
    "title": "Tulips",
    "body": `${herbToString("minecraft:red_tulip")}\n§oTulips come in many variations but they all have the same secondary effects and base values; however the same cannot be said about their primary effects. Tulips can be found around flower forests and sunflower plains.§r\n\n`,
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.frontPage"
          }
        ]
      }
    ]
  },
  "reagents.azure_bluet": {
    "title": "Azure Bluet",
    "body": `${herbToString("minecraft:azure_bluet")}\n§oAzure Bluet is a simple little flower found in meadows, plains and flower forests.§r\n\n`,
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.frontPage"
          }
        ]
      }
    ]
  },
  "reagents.wither_rose": {
    "title": "Wither Rose",
    "body": `${herbToString("minecraft:wither_rose")}\n§oA deadly corrupting flower found in the Nether or after the Wither has killed something.§r\n\n`,
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.frontPage"
          }
        ]
      }
    ]
  },
  "reagents.fermented_spider_eye": {
    "title": "Fermented Spider Eye",
    "body": `${herbToString("minecraft:fermented_spider_eye")}\n§oA spider eye that has been fermented with sugar and brown mushroom.§r\n\n`,
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.frontPage"
          }
        ]
      }
    ]
  },
  "reagents.feather": {
    "title": "Feather",
    "body": `${herbToString("minecraft:feather")}\n§oIf a chicken had scales, it'd likely be these.§r\n\n`,
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.frontPage"
          }
        ]
      }
    ]
  },
  "reagents.phantom_membrane": {
    "title": "Phantom Membrane",
    "body": `${herbToString("minecraft:phantom_membrane")}\n§oWhen phantoms prowl the night time skies,\nAnd angry players slice and dice,\nTheir membranes they will drop,\nFor the witch's hungry pot!§r\n\n`,
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.frontPage"
          }
        ]
      }
    ]
  },
  "reagents.gold_ingot": {
    "title": "Gold Ingot",
    "body": `${herbToString("minecraft:gold_ingot")}\n§oA brilliant metal with an even more brilliant lustre. Unfortunately, it is the pompous noble of its kin; however, there is said to be ancient magic that lies within.§r\n\n`,
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.frontPage"
          }
        ]
      }
    ]
  },
  "reagents.iron_ingot": {
    "title": "Iron Ingot",
    "body": `${herbToString("minecraft:iron_ingot")}\n§oIron is a very average metal with very average uses. However, in magic, it mostly defends and abjures.§r\n\n`,
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.frontPage"
          }
        ]
      }
    ]
  },
  "reagents.scute": {
    "title": "Turtle Scute",
    "body": `${herbToString("minecraft:turtle_scute")}\n§oTurtle babies shed their scutes, a valuable alchemical resource. Perhaps a walk on the local beach would do the Alchemist some good.§r\n\n`,
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.frontPage"
          }
        ]
      }
    ]
  },
  "reagents.armadillo_scute": {
    "title": "Armadillo Scute",
    "body": `${herbToString("minecraft:armadillo_scute")}\n§oArmadillos have a tough carapace that sometimes cause sheds, giving Armadillo Scutes. Brushing them also drops this tough material. Its use in wolf armors, an Alchemist can pull out its latent alchemical properties with some research.§r\n\n`,
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.frontPage"
          }
        ]
      }
    ]
  },
  "reagents.prismarine_crystals": {
    "title": "Prismarine Crystals",
    "body": `${herbToString("minecraft:prismarine_crystals")}\n§oPretty little crystals that belong to the sea. Many underwater structures are constructed by them, as well as the aquatic golems that guard the drowned temples of drowned civilizations.§r\n\n`,
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.frontPage"
          }
        ]
      }
    ]
  },
  "reagents.nautilus_shell": {
    "title": "Nautilus Shell",
    "body": `${herbToString("minecraft:nautilus_shell")}\n§oA shell of a forgotten creature. It is usually held rarely by the Drowned and can be fished up sometimes, as well as found in underwater temples.§r\n\n`,
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.frontPage"
          }
        ]
      }
    ]
  },
  "reagents.ghast_tear": {
    "title": "Ghast Tear",
    "body": `${herbToString("minecraft:ghast_tear")}\n§oA very self explanatory name. For such a precious resource, it is usually found within the Nether.§r\n\n`,
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.frontPage"
          }
        ]
      }
    ]
  },
  "reagents.echo_shard": {
    "title": "Echo Shard",
    "body": `${herbToString("minecraft:echo_shard")}\n§oA dark, moving thing that beats and pulses with un-overworldly life. It is found usually where the dark is deepest.§r\n\n`,
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.frontPage"
          }
        ]
      }
    ]
  },
  "reagents.magma_cream": {
    "title": "Magma Cream",
    "body": `${herbToString("minecraft:magma_cream")}\n§oThe Nether equivalent of slime balls.§r\n\n`,
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.frontPage"
          }
        ]
      }
    ]
  },
  "reagents.resin_clump": {
    "title": "Resin Clump",
    "body": `${herbToString("minecraft:resin_clump")}\n§oOrange resinous substance found in the Pale Forests of the world.§r\n\n`,
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "reagents.frontPage"
          }
        ]
      }
    ]
  },
  
  "modifiers.frontPage": {
    "title": "Modifiers",
    "body": "Modifiers are usually dusts that affect the potion as a whole. They perform \"operations\" on each reagent inside the Witch's Pot, affecting their potencies. Below are the various dusts and what they do.",
    "buttons": [
      {
        "buttonName": "Amethyst Dust",
        "buttonIcon": "textures/items/dusts/ender_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "modifiers.amethyst_dust"
          }
        ]
      },
      {
        "buttonName": "Coal Dust",
        "buttonIcon": "textures/items/dusts/coal_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "modifiers.coal_dust"
          }
        ]
      },
      {
        "buttonName": "Crushed Dandelion",
        "buttonIcon": "textures/items/dusts/dandelion_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "modifiers.dandelion_dust"
          }
        ]
      },
      {
        "buttonName": "Crushed Poppy",
        "buttonIcon": "textures/items/dusts/poppy_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "modifiers.poppy_dust"
          }
        ]
      },
      {
        "buttonName": "Crushed Blue Orchid",
        "buttonIcon": "textures/items/dusts/azure_bluet_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "modifiers.blue_orchid_dust"
          }
        ]
      },
      {
        "buttonName": "Crushed Cornflower",
        "buttonIcon": "textures/items/dusts/cornflower_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "modifiers.cornflower_dust"
          }
        ]
      },
      {
        "buttonName": "Crushed Oxeye Daisy",
        "buttonIcon": "textures/items/dusts/oxeye_daisy_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "modifiers.oxeye_daisy_dust"
          }
        ]
      },
      {
        "buttonName": "Emerald Dust",
        "buttonIcon": "textures/items/dusts/emerald_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "modifiers.emerald_dust"
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
  "modifiers.amethyst_dust": {
    "title": "Amethyst Dust",
    "body": "This modifier multiplies every reagent's potency by 3.",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "modifiers.frontPage"
          }
        ]
      }
    ]
  },
  "modifiers.coal_dust": {
    "title": "Coal Dust",
    "body": "This modifier multiplies every reagent's potency by 2.",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "modifiers.frontPage"
          }
        ]
      }
    ]
  },
  "modifiers.dandelion_dust": {
    "title": "Crushed Dandelion",
    "body": "This modifier removes 10%% potency from each reagent's potency.",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "modifiers.frontPage"
          }
        ]
      }
    ]
  },
  "modifiers.poppy_dust": {
    "title": "Crushed Poppy",
    "body": "This modifier removes 30%% potency from each reagent's potency.",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "modifiers.frontPage"
          }
        ]
      }
    ]
  },
  "modifiers.blue_orchid_dust": {
    "title": "Crushed Blue Orchid",
    "body": "This modifier adds 10%% potency to each reagent's potency.",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "modifiers.frontPage"
          }
        ]
      }
    ]
  },
  "modifiers.cornflower_dust": {
    "title": "Crushed Cornflower",
    "body": "This modifier adds 30%% potency to each reagent's potency.",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "modifiers.frontPage"
          }
        ]
      }
    ]
  },
  "modifiers.oxeye_daisy_dust": {
    "title": "Crushed Oxeye Daisy",
    "body": "This modifier divides every reagent's potency by 2.",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "modifiers.frontPage"
          }
        ]
      }
    ]
  },
  "modifiers.emerald_dust": {
    "title": "Emerald Dust",
    "body": "This modifier divides every reagent's potency by 3.",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "modifiers.frontPage"
          }
        ]
      }
    ]
  },
}