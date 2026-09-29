/* jshint maxerr: 10000 */
import { world, system, ItemStack, EntityHealthComponent, BlockPermutation, MolangVariableMap, Player, FluidType } from "@minecraft/server";
import { ActionFormData, ActionFormResponse, MessageFormData, ModalFormData } from "@minecraft/server-ui";
import { luckRoll, getWandTags, validCandles, inRange, jackBlocks, essenceCheck } from "./occultMagick.js";
import { candlePos, detectCandles, checkRituals, castRitual, getTimeAlignment, getWeatherAlignment, getPhaseAlignment, getAltitudeAlignment, useRitualItems } from "./castRitual.js";
import { herbList } from "./herbList";
import { isFamiliar } from "./familiars.js";
import { generateUniqueId } from "./curses";
import { wardingDusts, readJack, quadSplit, jackEat, checkSwitch } from "./wardArrays.js";
import { deductOrbos, allPlayersCasting, allPlayersDrawing } from "./spellDraw";
import { attachCustomEffect } from "./faeSpells";
import { corruptList, getHerbId, corruptEffect, isEffectValid, getPotionTime, herbsToLore, herbsToElements, bottlePotion, herbDistil } from "./potionCrafting.js";
import { Vector3 } from "./VectorMath/index.js";

let ambientLimits = {
  "bells": 6,
  "books": 16,
  "torches": 100,
  "portals": 30,
  "bells": 6,
  "cauldrons": 9,
  "jukes": 20,
  "ritual_slates": 85,
  "enchanted_table": 1,
  "dragon_egg": 2,
  "sniffer_eggs": 10,
  "hives": 12,
  "skulls": 15,
  "hives": 15
}

const ambientSources = {
  // Natural Pures (+1)
  // [
  "minecraft:water": {
    "basePower": 1,
    "powerType": "pure"
  },
  "minecraft:lava": {
    "basePower": 1,
    "powerType": "pure"
  },
  "minecraft:flowing_water": {
    "basePower": 1,
    "powerType": "pure"
  },
  "minecraft:flowing_lava": {
    "basePower": 1,
    "powerType": "pure"
  },
  "minecraft:ice": {
    "basePower": 1,
    "powerType": "pure"
  },
  "minecraft:blue_ice": {
    "basePower": 4,
    "powerType": "pure"
  },
  "minecraft:snow_layer": {
    "basePower": 1,
    "bonusPowerBasedOnProperty": "layers",
    "powerType": "pure"
  },
  // ]
  // Wooden Logs & Saplings (+2)
  // [
  "minecraft:acacia_log": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:acacia_sapling": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:bamboo": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:bamboo_sapling": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:birch_log": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:birch_sapling": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:cherry_log": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:cherry_sapling": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:dark_oak_log": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:dark_oak_sapling": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:flowering_azalea": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:mangrove_log": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:mangrove_propagule": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:oak_log": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:oak_sapling": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:pale_oak_log": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:pale_oak_sapling": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:spruce_log": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:spruce_sapling": {
    "basePower": 2,
    "powerType": "pure"
  },
  // ]
  // Leaves (+2)
  // [
  "minecraft:acacia_leaves": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:birch_leaves": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:cherry_leaves": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:dark_oak_leaves": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:mangrove_leaves": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:azalea_leaves": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:azalea_leaves_flowering": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:oak_leaves": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:pale_oak_leaves": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:spruce_leaves": {
    "basePower": 2,
    "powerType": "pure"
  },
  // ]
  // Flowers, Grass & Vines
  // [
  "minecraft:poppy": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:blue_orchid": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:cornflower": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:allium": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:azure_bluet": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:pink_petals": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:wildflowers": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:cactus_flower": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:cactus": {
    "basePower": 1,
    "powerType": "pure"
  },
  "minecraft:red_tulip": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:white_tulip": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:orange_tulip": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:pink_tulip": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:oxeye_daisy": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:lily_of_the_valley": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:dandelion": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:rose_bush": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:peony": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:lilac": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:sunflower": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:twisting_vines": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:weeping_vines": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:waterlily": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:vine": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:cave_vines": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:cave_vines_body_with_berries": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:cave_vines_head_with_berries": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:pale_hanging_moss": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:hanging_moss": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:small_dripleaf_block": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:short_grass": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:fern": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:bush": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:spore_blossom": {
    "basePower": 3,
    "powerType": "pure"
  },
  "minecraft:tall_grass": {
    "basePower": 2,
    "powerType": "pure"
  }, // Technically +4
  "minecraft:big_dripleaf": {
    "basePower": 2,
    "powerType": "pure"
  }, // Technically more than +2
  "minecraft:large_fern": {
    "basePower": 2,
    "powerType": "pure"
  }, // Technically +4

  "minecraft:wither_flower": {
    "basePower": 2,
    "powerType": "taint"
  },
  "minecraft:closed_eyeblossom": {
    "basePower": 2,
    "powerType": "neutral"
  },
  // ]
  // Crops
  // [
  "minecraft:reeds": {
    "basePower": 2,
    "powerType": "neutral"
  },
  "minecraft:carrots": {
    "basePower": 2,
    "powerType": "neutral"
  },
  "minecraft:beetroot": {
    "basePower": 2,
    "powerType": "neutral"
  },
  "minecraft:potatoes": {
    "basePower": 2,
    "powerType": "neutral"
  },
  "minecraft:wheat": {
    "basePower": 2,
    "powerType": "neutral"
  },
  "minecraft:pumpkin": {
    "basePower": 2,
    "powerType": "neutral"
  },
  "minecraft:melon_block": {
    "basePower": 2,
    "powerType": "neutral"
  },
  "minecraft:cocoa": {
    "basePower": 2,
    "powerType": "neutral"
  },
  // ]
  // Grass-ish Blocks
  // [
  "minecraft:grass_block": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:podzol": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:mycelium": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:moss_block": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:pale_moss_block": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:moss_carpet": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:pale_moss_carpet": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:warped_nylium": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:crimson_nylium": {
    "basePower": 2,
    "powerType": "pure"
  },
  // ]
  // Mushrooms and Fungi
  // [
  "minecraft:red_mushroom": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:red_mushroom_block": {
    "basePower": 8,
    "powerType": "pure"
  },
  "minecraft:brown_mushroom": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:brown_mushroom_block": {
    "basePower": 8,
    "powerType": "pure"
  },
  "minecraft:mushroom_stem": {
    "basePower": 4,
    "powerType": "pure"
  },
  "minecraft:warped_stem": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:crimson_stem": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:warped_fungus": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:crimson_fungus": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:warped_hyphae": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:crimson_hyphae": {
    "basePower": 2,
    "powerType": "pure"
  },
  // ]
  // Underwater Flora & Stuff
  // [
  "minecraft:seagrass": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:sea_pickle": {
    "basePower": 2,
    "conditionProperty": ["dead_bit", 0],
    "bonusPowerBasedOnProperty": "cluster_count",
    "powerType": "pure"
  },
  "minecraft:turtle_egg": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:tube_coral": {
    "basePower": 3,
    "powerType": "pure"
  },
  "minecraft:brain_coral": {
    "basePower": 3,
    "powerType": "pure"
  },
  "minecraft:fire_coral": {
    "basePower": 3,
    "powerType": "pure"
  },
  "minecraft:horn_coral": {
    "basePower": 3,
    "powerType": "pure"
  },
  "minecraft:bubble_coral": {
    "basePower": 3,
    "powerType": "pure"
  },
  "minecraft:tube_coral_block": {
    "basePower": 6,
    "powerType": "pure"
  },
  "minecraft:brain_coral_block": {
    "basePower": 6,
    "powerType": "pure"
  },
  "minecraft:fire_coral_block": {
    "basePower": 6,
    "powerType": "pure"
  },
  "minecraft:horn_coral_block": {
    "basePower": 6,
    "powerType": "pure"
  },
  "minecraft:bubble_coral_block": {
    "basePower": 6,
    "powerType": "pure"
  },
  "minecraft:tube_coral_fan": {
    "basePower": 3,
    "powerType": "pure"
  },
  "minecraft:brain_coral_fan": {
    "basePower": 3,
    "powerType": "pure"
  },
  "minecraft:fire_coral_fan": {
    "basePower": 3,
    "powerType": "pure"
  },
  "minecraft:horn_coral_fan": {
    "basePower": 3,
    "powerType": "pure"
  },
  "minecraft:bubble_coral_fan": {
    "basePower": 3,
    "powerType": "pure"
  },
  "minecraft:tube_coral_wall_fan": {
    "basePower": 3,
    "powerType": "pure"
  },
  "minecraft:brain_coral_wall_fan": {
    "basePower": 3,
    "powerType": "pure"
  },
  "minecraft:fire_coral_wall_fan": {
    "basePower": 3,
    "powerType": "pure"
  },
  "minecraft:horn_coral_wall_fan": {
    "basePower": 3,
    "powerType": "pure"
  },
  "minecraft:bubble_coral_wall_fan": {
    "basePower": 3,
    "powerType": "pure"
  },
  // ]
  // Hives
  // [
  "minecraft:bee_nest": {
    "basePower": 15,
    "bonusPowerBasedOnProperty": "honey_level",
    "addedBonus": 5,
    "limit": "hives",
    "powerType": "pure"
  },
  "minecraft:beehive": {
    "basePower": 15,
    "bonusPowerBasedOnProperty": "honey_level",
    "addedBonus": 5,
    "limit": "hives",
    "powerType": "pure"
  },
  // ]
  // Ore Blocks
  // [
  "minecraft:coal_ore": {
    "basePower": 1,
    "powerType": "pure"
  },
  "minecraft:copper_ore": {
    "basePower": 1,
    "powerType": "pure"
  },
  "minecraft:iron_ore": {
    "basePower": 1,
    "powerType": "pure"
  },
  "minecraft:gold_ore": {
    "basePower": 3,
    "powerType": "pure"
  },
  "minecraft:diamond_ore": {
    "basePower": 1,
    "powerType": "pure"
  },
  "minecraft:emerald_ore": {
    "basePower": 1,
    "powerType": "pure"
  },
  // ]
  // Mineral Blocks
  // [
  "minecraft:coal_block": {
    "basePower": 2,
    "powerType": "pure"
  },
  "minecraft:raw_copper_block": {
    "basePower": 3,
    "powerType": "pure"
  },
  "minecraft:raw_iron_block": {
    "basePower": 3,
    "powerType": "pure"
  },
  "minecraft:raw_gold_block": {
    "basePower": 12,
    "powerType": "pure"
  },
  "minecraft:amethyst_block": {
    "basePower": 8,
    "powerType": "pure"
  },
  "minecraft:budding_amethyst": {
    "basePower": 16,
    "powerType": "pure"
  },
  "minecraft:amethyst_cluster": {
    "basePower": 6,
    "powerType": "pure"
  },
  // ]

  // Candles
  // [
  "minecraft:candle": {
    "basePower": 4,
    "bonusPowerBasedOnProperty": "candles",
    "conditionProperty": ["lit", true],
    "powerType": "neutral",
    "limit": "candles"
  },
  "minecraft:white_candle": {
    "basePower": 4,
    "bonusPowerBasedOnProperty": "candles",
    "conditionProperty": ["lit", true],
    "powerType": "neutral"
  },
  "minecraft:orange_candle": {
    "basePower": 4,
    "bonusPowerBasedOnProperty": "candles",
    "conditionProperty": ["lit", true],
    "powerType": "neutral"
  },
  "minecraft:magenta_candle": {
    "basePower": 4,
    "bonusPowerBasedOnProperty": "candles",
    "conditionProperty": ["lit", true],
    "powerType": "neutral"
  },
  "minecraft:red_candle": {
    "basePower": 4,
    "bonusPowerBasedOnProperty": "candles",
    "conditionProperty": ["lit", true],
    "powerType": "neutral"
  },
  "minecraft:yellow_candle": {
    "basePower": 4,
    "bonusPowerBasedOnProperty": "candles",
    "conditionProperty": ["lit", true],
    "powerType": "neutral"
  },
  "minecraft:pink_candle": {
    "basePower": 4,
    "bonusPowerBasedOnProperty": "candles",
    "conditionProperty": ["lit", true],
    "powerType": "neutral"
  },
  "minecraft:purple_candle": {
    "basePower": 4,
    "bonusPowerBasedOnProperty": "candles",
    "conditionProperty": ["lit", true],
    "powerType": "neutral"
  },
  "minecraft:brown_candle": {
    "basePower": 4,
    "bonusPowerBasedOnProperty": "candles",
    "conditionProperty": ["lit", true],
    "powerType": "neutral"
  },
  "minecraft:light_blue_candle": {
    "basePower": 4,
    "bonusPowerBasedOnProperty": "candles",
    "conditionProperty": ["lit", true],
    "powerType": "neutral"
  },
  "minecraft:blue_candle": {
    "basePower": 4,
    "bonusPowerBasedOnProperty": "candles",
    "conditionProperty": ["lit", true],
    "powerType": "neutral"
  },
  "minecraft:light_gray_candle": {
    "basePower": 4,
    "bonusPowerBasedOnProperty": "candles",
    "conditionProperty": ["lit", true],
    "powerType": "neutral"
  },
  "minecraft:gray_candle": {
    "basePower": 4,
    "bonusPowerBasedOnProperty": "candles",
    "conditionProperty": ["lit", true],
    "powerType": "neutral"
  },
  "minecraft:cyan_candle": {
    "basePower": 4,
    "bonusPowerBasedOnProperty": "candles",
    "conditionProperty": ["lit", true],
    "powerType": "neutral"
  },
  "minecraft:green_candle": {
    "basePower": 4,
    "bonusPowerBasedOnProperty": "candles",
    "conditionProperty": ["lit", true],
    "powerType": "neutral"
  },
  "minecraft:lime_candle": {
    "basePower": 4,
    "bonusPowerBasedOnProperty": "candles",
    "conditionProperty": ["lit", true],
    "powerType": "neutral"
  },
  "minecraft:black_candle": {
    "basePower": 4,
    "bonusPowerBasedOnProperty": "candles",
    "conditionProperty": ["lit", true],
    "powerType": "neutral"
  },
  // ]
  // Bookshelves
  // [
  "minecraft:bookshelf": {
    "basePower": 6,
    "powerType": "neutral",
    "limit": "books"
  },
  "minecraft:chiseled_bookshelf": {
    "basePower": 0,
    "bonusPowerBasedOnProperty": "books_stored",
    "bonusAdded": 1,
    "powerType": "neutral",
    "limit": "books"
  },
  // ]
  // Torches
  // [
  "minecraft:torch": {
    "basePower": 4,
    "powerType": "neutral",
    "limit": "torches"
  },
  "minecraft:copper_torch": {
    "basePower": 2,
    "powerType": "neutral",
    "limit": "torches"
  },
  "minecraft:soul_torch": {
    "basePower": 5,
    "powerType": "taint",
    "limit": "torches"
  },
  "minecraft:redstone_torch": {
    "basePower": 2,
    "powerType": "neutral",
    "limit": "torches"
  },
  // ]
  // Bell
  // [
  "minecraft:bell": {
    "basePower": 150,
    "powerType": "neutral",
    "limit": "bells"
  },
  // ]
  // Campfires & Fires
  // [
  "minecraft:campfire": {
    "basePower": 4,
    "conditionProperty": ["extinguished", false],
    "powerType": "neutral",
    "limit": "torches"
  },
  "minecraft:soul_campfire": {
    "basePower": 5,
    "conditionProperty": ["extinguished", false],
    "powerType": "taint",
    "limit": "torches"
  },
  "minecraft:fire": {
    "basePower": 4,
    "powerType": "neutral",
    "limit": "torches"
  },
  "minecraft:soul_fire": {
    "basePower": 5,
    "powerType": "taint",
    "limit": "torches"
  },
  "minecraft:copper_fire": {
    "basePower": 4,
    "powerType": "neutral",
    "limit": "torches"
  },
  // ]
  // Item Frame
  // [
  "minecraft:frame": {
    "basePower": 0,
    "powerType": "neutral",
    "itemInFrame": {
      "minecraft:egg": {
        "powerType": "pure",
        "raisedPower": 1
      },
      "minecraft:blue_egg": {
        "powerType": "pure",
        "raisedPower": 1
      },
      "minecraft:brown_egg": {
        "powerType": "pure",
        "raisedPower": 1
      },
      "minecraft:clock": {
        "powerType": "neutral",
        "correspondence": "time_of_day"
      }
    }
  },
  "minecraft:glow_frame": {
    "basePower": 0,
    "powerType": "neutral",
    "itemInFrame": {
      "minecraft:egg": {
        "raisedPower": 1,
        "powerType": "pure"
      },
      "minecraft:blue_egg": {
        "raisedPower": 1,
        "powerType": "pure"
      },
      "minecraft:brown_egg": {
        "raisedPower": 1,
        "powerType": "pure"
      },
      "minecraft:clock": {
        "powerType": "neutral",
        "correspondence": "time_of_day"
      }
    }
  },
  // ]
  // Eggs
  // [
  "minecraft:dragon_egg": {
    "basePower": 2500,
    "powerType": "neutral",
    "limit": "dragon_egg"
  },
  "minecraft:sniffer_egg": {
    "basePower": 250,
    "powerType": "pure",
    "limit": "sniffer_eggs"
  },
  // ]
  // Enchantment Table
  // [
  "minecraft:enchanting_table": {
    "basePower": 500,
    "powerType": "neutral",
    "limit": "enchanted_table"
  },
  // ]
  // Cauldron
  // [
  "minecraft:cauldron": {
    "basePower": 20,
    "bonusPowerBasedOnPotion": true,
    "powerType": "neutral",
    "limit": "cauldrons"
  },
  // ]
  // Portals
  // [
  "minecraft:portal": {
    "basePower": 50,
    "powerType": "neutral",
    "limit": "portals"
  },
  "minecraft:end_portal": {
    "basePower": 50,
    "powerType": "neutral",
    "limit": "portals"
  },
  // ]
  // Jukebox
  // [
  "minecraft:jukebox": {
    "basePower": 10,
    "bonusPowerBasedOnRedstone": true,
    "playing": {
      "minecraft:music_disc_chirp": "pure",
      "minecraft:music_disc_cat": "pure",
      "minecraft:music_disc_strad": "pure",
      "minecraft:music_disc_precipe": "pure",
      "minecraft:music_disc_lava_chicken": "pure",
      "minecraft:music_disc_mall": "neutral",
      "minecraft:music_disc_far": "neutral",
      "minecraft:music_disc_creator": "neutral",
      "minecraft:music_disc_creator_music_box": "neutral",
      "minecraft:music_disc_blocks": "neutral",
      "minecraft:music_disc_wait": "neutral",
      "minecraft:music_disc_otherside": "neutral",
      "minecraft:music_disc_relic": "neutral",
      "minecraft:music_disc_pigstep": "neutral",
      "minecraft:music_disc_13": "taint",
      "minecraft:music_disc_11": "taint",
      "minecraft:music_disc_5": "taint",
      "minecraft:music_disc_stal": "taint",
      "minecraft:music_disc_ward": "taint",
      "minecraft:music_disc_tears": "taint",
      "minecraft:music_disc_mellohi": "taint"
    },
    "powerType": "neutral",
    "limit": "jukes"
  },
  // ]
  // Chalked Ritual Slates
  // [
  "bw:deepslate_runic_slate": {
    "basePower": 3,
    "powerType": "neutral",
    "conditionTag": "bw:white_slate",
    "limit": "ritual_slates"
  },
  "bw:diorite_runic_slate": {
    "basePower": 3,
    "powerType": "neutral",
    "conditionTag": "bw:white_slate",
    "limit": "ritual_slates"
  },
  "bw:blackstone_runic_slate": {
    "basePower": 3,
    "powerType": "neutral",
    "conditionTag": "bw:white_slate",
    "limit": "ritual_slates"
  },
  "bw:granite_runic_slate": {
    "basePower": 3,
    "powerType": "neutral",
    "conditionTag": "bw:white_slate",
    "limit": "ritual_slates"
  },
  "bw:runic_slate": {
    "basePower": 3,
    "powerType": "neutral",
    "conditionTag": "bw:white_slate",
    "limit": "ritual_slates"
  },
  // ]
  // Soul Ground
  // [
  "minecraft:soul_soil": {
    "basePower": 5,
    "powerType": "taint"
  },
  "minecraft:soul_sand": {
    "basePower": 5,
    "powerType": "taint"
  },
  "minecraft:bone_block": {
    "basePower": 5,
    "powerType": "taint"
  },
  // ]
  // Skulls
  // [
  "minecraft:skeleton_skull": {
    "basePower": 20,
    "powerType": "taint",
    "limit": "skulls"
  },
  "minecraft:wither_skeleton_skull": {
    "basePower": 60,
    "powerType": "taint",
    "limit": "skulls"
  },
  "minecraft:zombie_head": {
    "basePower": 20,
    "powerType": "taint",
    "limit": "skulls"
  },
  "minecraft:player_head": {
    "basePower": 20,
    "powerType": "taint",
    "limit": "skulls"
  },
  "minecraft:creeper_head": {
    "basePower": 20,
    "powerType": "taint",
    "limit": "skulls"
  },
  "minecraft:piglin_head": {
    "basePower": 20,
    "powerType": "taint",
    "limit": "skulls"
  },
  "minecraft:dragon_head": {
    "basePower": 120,
    "powerType": "taint",
    "limit": "skulls"
  },
  // ]
  // Sculk
  // [
  // ]

  // Correspondences and Multipliers
  // Lightning Rod
  "minecraft:lightning_rod": {
    "basePower": 0,
    "powerType": "neutral",
    "correspondence": "weather"
  },
  // Eye Blossom
  "minecraft:open_eyeblossom": {
    "basePower": 0,
    "powerType": "neutral",
    "correspondence": "moon_phase"
  },
  // Dead Coral
  // [
  "minecraft:dead_tube_coral": {
    "basePower": 0,
    "modifier": 2,
    "powerType": "taint"
  },
  "minecraft:dead_brain_coral": {
    "basePower": 0,
    "modifier": 2,
    "powerType": "taint"
  },
  "minecraft:dead_fire_coral": {
    "basePower": 0,
    "modifier": 2,
    "powerType": "taint"
  },
  "minecraft:dead_horn_coral": {
    "basePower": 0,
    "modifier": 2,
    "powerType": "taint"
  },
  "minecraft:dead_bubble_coral": {
    "basePower": 0,
    "modifier": 2,
    "powerType": "taint"
  },
  "minecraft:dead_tube_coral_block": {
    "basePower": 0,
    "modifier": 2,
    "powerType": "taint"
  },
  "minecraft:dead_brain_coral_block": {
    "basePower": 0,
    "modifier": 2,
    "powerType": "taint"
  },
  "minecraft:dead_fire_coral_block": {
    "basePower": 0,
    "modifier": 2,
    "powerType": "taint"
  },
  "minecraft:dead_horn_coral_block": {
    "basePower": 0,
    "modifier": 2,
    "powerType": "taint"
  },
  "minecraft:dead_bubble_coral_block": {
    "basePower": 0,
    "modifier": 2,
    "powerType": "taint"
  },
  "minecraft:dead_tube_coral_fan": {
    "basePower": 0,
    "modifier": 2,
    "powerType": "taint"
  },
  "minecraft:dead_brain_coral_fan": {
    "basePower": 0,
    "modifier": 2,
    "powerType": "taint"
  },
  "minecraft:dead_fire_coral_fan": {
    "basePower": 0,
    "modifier": 2,
    "powerType": "taint"
  },
  "minecraft:dead_horn_coral_fan": {
    "basePower": 0,
    "modifier": 2,
    "powerType": "taint"
  },
  "minecraft:dead_bubble_coral_fan": {
    "basePower": 0,
    "modifier": 2,
    "powerType": "taint"
  },
  "minecraft:dead_tube_coral_wall_fan": {
    "basePower": 0,
    "modifier": 2,
    "powerType": "taint"
  },
  "minecraft:dead_brain_coral_wall_fan": {
    "basePower": 0,
    "modifier": 2,
    "powerType": "taint"
  },
  "minecraft:dead_fire_coral_wall_fan": {
    "basePower": 0,
    "modifier": 2,
    "powerType": "taint"
  },
  "minecraft:dead_horn_coral_wall_fan": {
    "basePower": 0,
    "modifier": 2,
    "powerType": "taint"
  },
  "minecraft:dead_bubble_coral_wall_fan": {
    "basePower": 0,
    "modifier": 2,
    "powerType": "taint"
  },
  // ]
};

let ritualRes = {
  "id": "bwDuration:ritualResonance",
  "name": "Ceremonial Resonance",
  "duration": 60,
  "amplifier": 0,
  "startingText": "§d[!]§r The ceremony you are performing resonates with you on a metaphysical level. You cannot perform another one until this effect leaves you.",
  "endingText": "§d[!]§r The thrum of mystical resonance quietens down to a small tremor, and then it is gone.",
  "stackable": true
}

// Check symmetry around central slate
// cB - currentBlock
// rC - ritualCenterBlock
function checkSymmetry(cB, rC) {
  let blockCenter = cB.center();
  let ritualCenter = rC.center();

  // If this is true, the current block IS the ritual center. Symmetry is impossible.
  if (blockCenter.x == ritualCenter.x && blockCenter.y == ritualCenter.y && blockCenter.z == ritualCenter.z) {
    return false;
  }

  let dir = Vector3.subtract(ritualCenter, blockCenter);
  // let mag = Vector3.magnitude(dir);

  let revDir = Vector3.scale(dir, -1);
  let oppositePos = Vector3.add(ritualCenter, revDir);

  // Verify Opposite Side
  if (oppositePos.y <= ritualCenter.y + 2 && oppositePos.y >= ritualCenter.y - 1) {
    let nB = rC.dimension.getBlock(oppositePos);
    if (nB.typeId == cB.typeId) {
      return true;
    }
  }

  return false;
}

// 38 Seconds
// Particles and sounds are quite basic, but I like them. There is power in simplicity.
function doCeremonialParticle(b, s) {
  let riteCenter = b.center();
  riteCenter.y = riteCenter.y - 0.35;
  let rise = 0;
  let quantity = 1;

  // 38 seconds / 5
  let pValue = Math.floor(s / 5);
  rise = pValue / 10;
  if (pValue > 0) {
    quantity = pValue;
  }

  let firstMol = new MolangVariableMap();
  let secondMol = new MolangVariableMap();

  firstMol.setFloat("variable.rise_value", rise);
  secondMol.setFloat("variable.ball_size", 0.15);
  secondMol.setFloat("variable.particle_amt", quantity + 2);

  if (b.dimension.isChunkLoaded(riteCenter)) {
    b.dimension.spawnParticle("bw_ritual:raising_energy", riteCenter, firstMol);

    b.dimension.spawnParticle("bw_ritual:gathering_energy", Vector3.add(riteCenter, new Vector3(0, 1.65, 0)), secondMol);
    // Vector3.add(riteCenter, new Vector3(0, 1.5, 0))

    // Ritual Sounds
    // Ritual begins
    if (s == 1) {
      b.dimension.playSound("beacon.power", riteCenter, { pitch: 1, volume: 8 });
    }
    // Initial gathering of power
    if (s > 1 && s < 16) {
      b.dimension.playSound("beacon.ambient", riteCenter, { pitch: 0.4, volume: 8 });
    }
    // Hold and shape the ambient energy
    if (s > 15 && s < 26) {
      b.dimension.playSound("beacon.ambient", riteCenter, { pitch: 1, volume: 8 });
    }
    // Crescendo of the power.
    if (s > 25 && s < 34) {
      b.dimension.playSound("beacon.ambient", riteCenter, { pitch: 2, volume: 8 });
    }
    // ABSOLUTE FUCKING HARMONY
    if (s > 33) {
      b.dimension.playSound("beacon.ambient", riteCenter, { pitch: 3, volume: 8 });
    }

    // The tri-bell signaling completion
    // Do particle burst
    if (s == 36) {
      b.dimension.spawnParticle("bw_ritual:dispersing_energy", Vector3.add(riteCenter, new Vector3(0, 1.65, 0)));
      b.dimension.playSound("block.bell.hit", riteCenter, { pitch: 0.68, volume: 0.5 });
    }
    if (s == 37) {
      b.dimension.spawnParticle("bw_ritual:dispersing_energy", Vector3.add(riteCenter, new Vector3(0, 1.75, 0)));
      b.dimension.playSound("block.bell.hit", riteCenter, { pitch: 0.68, volume: 0.5 });
    }
    if (s == 38) {
      b.dimension.spawnParticle("bw_ritual:dispersing_energy", Vector3.add(riteCenter, new Vector3(0, 1.85, 0)));
      b.dimension.playSound("block.bell.hit", riteCenter, { pitch: 0.68, volume: 0.5 });
      b.dimension.playSound("beacon.deactivate", riteCenter, { pitch: 1, volume: 8 });
    }
  }
}

const CORRESPONDENCE_TYPES = {
  "weather": "Atmospheric",
  "time_of_day": "Temporal",
  "moon_phase": "Lunar Phase",
  "season": "Seasonal"
}
const CORRESPONDENCE_VALUES = {
  "clear": "Clear Weather",
  "rainy": "Rainy Weather",
  "thunderstorm": "Thunderstorm",

  "day": "Day Hours",
  "night": "Night Hours",
  "dawn": "Dawn Hours",
  "dusk": "Dusk Hours",

  "new_moon": "New",
  "waxing_crescent": "Waxing Crescent",
  "first_quarter": "First Quarter",
  "waxing_gibbous": "Waxing Gibbous",
  "full_moon": "Full Moon",
  "waning_crescent": "Waning Crescent",
  "last_quarter": "Last Quarter",
  "waning_gibbous": "Waning Gibbous",

  "spring": "Spring",
  "summer": "Summer",
  "autumn": "Autumn",
  "winter": "Winter"
}
function checkCorrInRitual(corrType, dim) {
  let multiplier = 0;
  let val;
  if (corrType == "weather") {
    val = getWeatherAlignment(dim);

    if (val == "clear") {
      multiplier = 1;
    }
    if (val == "rainy") {
      multiplier = 1.5;
    }
    if (val == "thunderstorm") {
      multiplier = 2;
    }
  }
  if (corrType == "time_of_day") {
    val = getTimeAlignment(dim);

    if (val == "day") {
      multiplier = 1;
    }
    if (val == "dawn" || val == "dusk") {
      multiplier = 1.25;
    }
    if (val == "night") {
      multiplier = 1.5;
    }
  }
  if (corrType == "moon_phase") {
    val = getPhaseAlignment();

    if (val == "new_moon") {
      multiplier = 1;
    }

    if (val == "waxing_crescent" || val == "waning_crescent") {
      multiplier = 1.25;
    }

    if (val == "first_quarter" || val == "last_quarter") {
      multiplier = 1.5;
    }

    if (val == "waxing_gibbous" || val == "waning_gibbous") {
      multiplier = 1.75;
    }

    if (val == "full_moon") {
      multiplier = 2;
    }

  }

  return {
    multiplier: multiplier,
    value: val
  }
}

function confirmCoven(entity) {
  let coven = entity.getDynamicProperty("bw:coven");
  if (coven != undefined) {
    let covenInfo = world.getDynamicProperty("covenID:" + coven);
    if (covenInfo != undefined) {
      return true;
    } else {
      entity.setDynamicProperty("bw:coven", undefined);
      return false;
    }
  }
  return false;
}
// Gathers ambient energy from surrounding blocks.
async function gatherAmbientEnergy(block, witch) {
  let taint = 0;
  let pure = 0;
  let neutral = 0;
  let loc = block.location;
  let blockPerPause = 35;
  let runLimits = new Map();
  let customLimits = new Map();
  let seconds = 0;

  let multiplier = 1;
  let multiplierType = "neutral";
  let correspondences = {};
  // Pick through all the blocks, doing their thing.
  ambientLoop: for (let x = loc.x - 10; x < loc.x + 10; x++) {
    for (let y = loc.y - 1; y < loc.y + 2; y++) {
      for (let z = loc.z - 10; z < loc.z + 10; z++) {
        const cl = {
          x: x,
          y: y,
          z: z
        }

        if (!block.isValid) {
          return "broken";
        }
        if (!block.hasTag("bw:red_slate")) {
          return "broken";
        }

        if (witch.isSneaking) {
          break ambientLoop;
        }

        if (blockPerPause > 0) {
          blockPerPause--;
        } else {
          blockPerPause = 30;
          seconds++;
          doCeremonialParticle(block, seconds);
          await system.waitTicks(20);
        }

        // Process Sacrifices
        let sac = `bw:deathTaint_${x}_${y}_${z}_${block.dimension.id}`;

        if (world.getDynamicProperty(sac)) {
          let sacObj = JSON.parse(world.getDynamicProperty(sac));

          taint = taint + sacObj.energy;
          world.setDynamicProperty(sac, undefined)
        }

        // Is chunk loaded?
        if (block.dimension.isChunkLoaded(cl)) {
          let currBlock = block.dimension.getBlock(cl);

          // Ambient Object
          let ambientObj = ambientSources[currBlock.typeId];
          // Check for an ambience component
          if (currBlock.getComponent("bw:ambient_block")?.customComponentParameters?.params) {
            ambientObj = currBlock.getComponent("bw:ambient_block").customComponentParameters?.params;
          }

          // If there IS an Ambient Object for this Block Type
          if (ambientObj) {
            // Check conditions
            if (ambientObj.conditionProperty) {
              let prop = ambientObj.conditionProperty;
              if (currBlock.permutation.getState(prop[0]) != prop[1]) {
                continue;
              }
            }

            if (ambientObj.conditionTag) {
              if (!currBlock.hasTag(ambientObj.conditionTag)) {
                continue;
              }
            }

            // Check Limits
            if (ambientObj.limit) {
              if (runLimits.has(ambientObj.limit)) {
                let l = runLimits.get(ambientObj.limit);
                let sl = ambientLimits[ambientObj.limit];
                if (sl == undefined) {
                  sl = customLimits.get(ambientObj.limit);
                }

                if (l < sl) {
                  runLimits.set(ambientObj.limit, l + 1);
                } else {
                  continue;
                }
              } else {
                runLimits.set(ambientObj.limit, 1);

                if (ambientLimits[ambientObj.limit] == undefined) {
                  if (ambientObj.limitValue != undefined) {
                    customLimits.set(ambientObj.limit, ambientObj.limitValue);
                  } else {
                    customLimits.set(ambientObj.limit, 1);
                  }
                }
              }
            }

            // Check Correspondences
            if (ambientObj.correspondence) {
              let mult = checkCorrInRitual(ambientObj.correspondence, currBlock.dimension);
              if (mult.multiplier > multiplier) {
                multiplier = mult.multiplier;
                if (multiplierType != ambientObj.powerType) {
                  multiplierType = ambientObj.powerType;
                }
              }

              correspondences[ambientObj.correspondence] = mult.value;
            }

            // Check Block Modifiers
            if (ambientObj.modifier) {
              if (ambientObj.modifier > multiplier) {
                multiplier = ambientObj.modifier;
                if (multiplierType != ambientObj.powerType) {
                  multiplierType = ambientObj.powerType;
                }
              }
            }

            // Power from this specific block
            let power = ambientObj.basePower;

            // Add power based property
            if (ambientObj.bonusPowerBasedOnProperty) {
              let propBonus = currBlock.permutation.getState(ambientObj.bonusPowerBasedOnProperty);
              if (propBonus === undefined) {
                propBonus = 0;
              }

              if (ambientObj.addedBonus != undefined) {
                propBonus = ambientObj.addedBonus * propBonus;
              } else {
                propBonus = power * propBonus;
              }

              power = power + propBonus;
            }

            // Add power based on redstone
            if (ambientObj.bonusPowerBasedOnRedstone) {
              let energy = currBlock.getComponent("minecraft:redstone_producer");
              if (energy == undefined) {
                energy = 0;
              } else {
                energy = energy.power;
              }

              power = power + energy;
            }

            // Add power based on potion level (Cauldron only)
            if (ambientObj.bonusPowerBasedOnPotion) {
              let potionValue = 0;
              let contents = currBlock.getComponent("minecraft:fluid_container");
              if (contents != undefined) {
                let fillLevel = Math.ceil(contents.fillLevel / 2);
                if (fillLevel > 0) {
                  if (contents.getFluidType() == FluidType.Potion) {
                    potionValue = fillLevel;
                  }
                }
              }

              power = power + (power * potionValue);
            }

            // Change Power Type based on disc
            if (ambientObj.playing) {
              let juke = currBlock.getComponent("minecraft:record_player");

              if (juke != undefined && juke.isPlaying()) {
                let record = juke.getRecord().typeId;
                if (ambientObj.playing[record]) {
                  ambientObj.powerType = ambientObj.playing[record];
                }
              }
            }

            // Change power output based on item in frame/correspondence;
            if (ambientObj.itemInFrame) {
              let i = currBlock.getItemStack(1, true);
              let inFrame = ambientObj.itemInFrame[i.typeId];

              if (inFrame != undefined) {
                if (inFrame.raisedPower) {
                  power = power + inFrame.raisedPower;
                  ambientObj.powerType = inFrame.powerType;
                }

                if (inFrame.correspondence) {
                  let mult = checkCorrInRitual(inFrame.correspondence, currBlock.dimension);
                  if (mult.multiplier > multiplier) {
                    multiplier = mult.multiplier;
                    if (multiplierType != inFrame.powerType) {
                      multiplierType = ambientObj.powerType;
                    }
                  }

                  correspondences[inFrame.correspondence] = mult.value;
                }
              }
            }

            // Radial Symmetry
            if (power <= 10 && checkSymmetry(currBlock, block)) {
              power = power * 2;
            }

            // Power type
            if (ambientObj.powerType == "neutral") {
              neutral += power;
            }
            if (ambientObj.powerType == "pure") {
              pure += power;
            }
            if (ambientObj.powerType == "taint") {
              taint += power;
            }
          } else {
            continue;
          }
        }
      }
    }
  }

  // Get coven members and familiars;
  let entities = block.dimension.getEntities({ excludeFamilies: ["inanimate"], excludeTypes: ["minecraft:item", "minecraft:xp_orb"], location: block.center(), maxDistance: 8 });

  let coven = witch.getDynamicProperty("bw:coven");
  if (coven != undefined && multiplierType == "neutral") {
    let covenMembers = 1;
    let familiar = false;
    let helpingFamiliars = 0;
    for (let entity of entities) {
      if (entity.id == witch.id) {
        if (!confirmCoven(entity)) {
          break;
        }
        continue;
      }

      if (confirmCoven(entity)) {
        if (entity.getDynamicProperty("bw:coven") == coven) {
          covenMembers++;
          continue;
        }
      }

      let familiarCreature = isFamiliar(entity);
      if (familiarCreature) {
        if (witch.id == familiarCreature[1]) {
          familiar = true;
          continue;
        }

        let owner = world.getEntity(familiarCreature[1]);
        if (owner != undefined) {
          if (owner.getDynamicProperty("bw:coven") == coven) {
            helpingFamiliars++;
          }
        }
      }
    }

    if (covenMembers > 1) {
      multiplier = multiplier + (covenMembers * 0.2) + (helpingFamiliars * 0.15);
    }
    if (familiar) {
      multiplier = multiplier + 0.5;
    }
  }

  if (multiplierType == "pure") {
    pure = Math.floor(pure * multiplier);
  }
  if (multiplierType == "taint") {
    taint = Math.floor(taint * multiplier);
  }
  if (multiplierType == "neutral") {
    neutral = Math.floor(neutral * multiplier);
    pure = Math.floor(pure * multiplier);
    taint = Math.floor(taint * multiplier);
  }

  return [neutral, pure, taint, correspondences];
}

async function readAmbientEnergy(block, witch) {
  const formData = new ActionFormData();
  formData.title("Ambient Energy Readings");
  let taint = 0;
  let pure = 0;
  let neutral = 0;
  let sacrificialEnergies = 0;
  let loc = block.location;
  let blockPerPause = 100;
  let runLimits = new Map();
  let seconds = 0;

  let multiplier = 1;
  let multiplierType = "neutral";
  let correspondences = {};
  // Pick through all the blocks, doing their thing.
  ambientLoop: for (let x = loc.x - 10; x < loc.x + 10; x++) {
    for (let y = loc.y - 1; y < loc.y + 2; y++) {
      for (let z = loc.z - 10; z < loc.z + 10; z++) {
        const cl = {
          x: x,
          y: y,
          z: z
        }

        if (!block.isValid) {
          return;
        }
        if (!block.hasTag("bw:red_slate")) {
          return;
        }

        /*
        if (witch.isSneaking) {
          break ambientLoop;
        }
        */

        if (blockPerPause > 0) {
          blockPerPause--;
        } else {
          blockPerPause = 100;
          seconds++;
          block.dimension.spawnParticle("minecraft:smoke_cauldron", block.center());
          await system.waitTicks(20);
        }

        // Process Sacrifices
        let sac = `bw:deathTaint_${x}_${y}_${z}_${block.dimension.id}`;

        if (world.getDynamicProperty(sac)) {
          let sacObj = JSON.parse(world.getDynamicProperty(sac));
          taint = taint + sacObj.energy;
          sacrificialEnergies = sacrificialEnergies + sacObj.energy;
        }

        // Is chunk loaded?
        if (block.dimension.isChunkLoaded(cl)) {
          let currBlock = block.dimension.getBlock(cl);

          // Ambient Object
          let ambientObj = ambientSources[currBlock.typeId];

          // If there IS an Ambient Object for this Block Type
          if (ambientObj) {
            // Check conditions
            if (ambientObj.conditionProperty) {
              let prop = ambientObj.conditionProperty;
              if (currBlock.permutation.getState(prop[0]) != prop[1]) {
                continue;
              }
            }

            if (ambientObj.conditionTag) {
              if (!currBlock.hasTag(ambientObj.conditionTag)) {
                continue;
              }
            }

            // Check Limits
            if (ambientObj.limit) {
              if (runLimits.has(ambientObj.limit)) {
                let l = runLimits.get(ambientObj.limit);

                if (l < ambientLimits[ambientObj.limit]) {
                  runLimits.set(ambientObj.limit, l + 1);
                } else {
                  continue;
                }
              } else {
                runLimits.set(ambientObj.limit, 1);
              }
            }

            // Check Correspondences
            if (ambientObj.correspondence) {
              let mult = checkCorrInRitual(ambientObj.correspondence, currBlock.dimension);
              if (mult.multiplier > multiplier) {
                multiplier = mult.multiplier;
                if (multiplierType != ambientObj.powerType) {
                  multiplierType = ambientObj.powerType;
                }
              }

              correspondences[ambientObj.correspondence] = mult.value;
            }

            // Check Block Modifiers
            if (ambientObj.modifier) {
              if (ambientObj.modifier > multiplier) {
                multiplier = ambientObj.modifier;
                if (multiplierType != ambientObj.powerType) {
                  multiplierType = ambientObj.powerType;
                }
              }
            }

            // Power from this specific block
            let power = ambientObj.basePower;

            // Add power based property
            if (ambientObj.bonusPowerBasedOnProperty) {
              let propBonus = currBlock.permutation.getState(ambientObj.bonusPowerBasedOnProperty);
              if (propBonus === undefined) {
                propBonus = 0;
              }

              if (ambientObj.addedBonus != undefined) {
                propBonus = ambientObj.addedBonus * propBonus;
              } else {
                propBonus = power * propBonus;
              }

              power = power + propBonus;
            }

            // Add power based on redstone
            if (ambientObj.bonusPowerBasedOnRedstone) {
              let energy = currBlock.getComponent("minecraft:redstone_producer");
              if (energy == undefined) {
                energy = 0;
              } else {
                energy = energy.power;
              }

              power = power + energy;
            }

            // Add power based on potion level (Cauldron only)
            if (ambientObj.bonusPowerBasedOnPotion) {
              let potionValue = 0;
              let contents = currBlock.getComponent("minecraft:fluid_container");
              if (contents != undefined) {
                let fillLevel = Math.ceil(contents.fillLevel / 2);
                if (fillLevel > 0) {
                  if (contents.getFluidType() == FluidType.Potion) {
                    potionValue = fillLevel;
                  }
                }
              }

              power = power + (power * potionValue);
            }

            // Change Power Type based on disc
            if (ambientObj.playing) {
              let juke = currBlock.getComponent("minecraft:record_player");

              if (juke != undefined && juke.isPlaying()) {
                let record = juke.getRecord().typeId;
                if (ambientObj.playing[record]) {
                  ambientObj.powerType = ambientObj.playing[record];
                }
              }
            }

            // Change power output based on item in frame/correspondence;
            if (ambientObj.itemInFrame) {
              let i = currBlock.getItemStack(1, true);
              let inFrame = ambientObj.itemInFrame[i.typeId];

              if (inFrame != undefined) {
                if (inFrame.raisedPower) {
                  power = power + inFrame.raisedPower;
                  ambientObj.powerType = inFrame.powerType;
                }

                if (inFrame.correspondence) {
                  let mult = checkCorrInRitual(inFrame.correspondence, currBlock.dimension);
                  if (mult.multiplier > multiplier) {
                    multiplier = mult.multiplier;
                    if (multiplierType != inFrame.powerType) {
                      multiplierType = ambientObj.powerType;
                    }
                  }

                  correspondences[inFrame.correspondence] = mult.value;
                }
              }
            }

            // Radial Symmetry
            if (power <= 10 && checkSymmetry(currBlock, block)) {
              power = power * 2;
            }

            // Power type
            if (ambientObj.powerType == "neutral") {
              neutral += power;
            }
            if (ambientObj.powerType == "pure") {
              pure += power;
            }
            if (ambientObj.powerType == "taint") {
              taint += power;
            }
          } else {
            continue;
          }
        }
      }
    }
  }

  let str = `§lBase Ambient Energies§r\nNeutral Ambience: ${neutral}\n§ePure Ambience§r: ${pure}\n§5Tainted Ambience§r: ${taint}\n§4 - Sacrificial Energy§r: ${sacrificialEnergies}\n--------\n§lModifiers§r\n`;
  if (multiplierType == "neutral") {
    str = str.concat(`Modifier Type: Neutral\n`);
  }
  if (multiplierType == "pure") {
    str = str.concat(`Modifier Type: §ePure§r\n`);
  }
  if (multiplierType == "taint") {
    str = str.concat(`Modifier Type: §5Tainted§r\n`);
  }
  str = str.concat(`Base Multiplier: x${multiplier}\n`);

  // Get coven members and familiars;
  let entities = block.dimension.getEntities({ excludeFamilies: ["inanimate"], excludeTypes: ["minecraft:item", "minecraft:xp_orb"], location: block.center(), maxDistance: 8 });

  let coven = witch.getDynamicProperty("bw:coven");
  if (coven != undefined && multiplierType == "neutral") {
    let covenMembers = 1;
    let familiar = false;
    let helpingFamiliars = 0;
    for (let entity of entities) {
      if (entity.id == witch.id) {
        if (!confirmCoven(entity)) {
          break;
        }
        continue;
      }

      if (confirmCoven(entity)) {
        if (entity.getDynamicProperty("bw:coven") == coven) {
          covenMembers++;
          continue;
        }
      }

      let familiarCreature = isFamiliar(entity);
      if (familiarCreature) {
        if (witch.id == familiarCreature[1]) {
          familiar = true;
          continue;
        }

        let owner = world.getEntity(familiarCreature[1]);
        if (owner != undefined) {
          if (owner.getDynamicProperty("bw:coven") == coven) {
            helpingFamiliars++;
          }
        }
      }
    }

    if (covenMembers > 1) {
      str = str.concat(`Coven Boost (only Neutral Modifiers): +${(covenMembers * 0.2) + (helpingFamiliars * 0.15)}\n`);
      multiplier = multiplier + (covenMembers * 0.2) + (helpingFamiliars * 0.15);
    }
    if (familiar) {
      str = str.concat(`Familiar Boost (only Neutral Modifiers): +0.5\n`);
      multiplier = multiplier + 0.5;
    }
  }
  str = str.concat(`\nFinal Multiplier: x${multiplier}\n`);

  if (Object.keys(correspondences).length > 0) {
    str = str.concat(`--------\n§lCorrespondences§r\n`)
    for (let [k, v] of Object.entries(correspondences)) {
      str = str.concat(`${CORRESPONDENCE_TYPES[k]}: ${CORRESPONDENCE_VALUES[v]}\n`);
    }
  }


  if (multiplierType == "pure") {
    pure = Math.floor(pure * multiplier);
  }
  if (multiplierType == "taint") {
    taint = Math.floor(taint * multiplier);
  }
  if (multiplierType == "neutral") {
    neutral = Math.floor(neutral * multiplier);
    pure = Math.floor(pure * multiplier);
    taint = Math.floor(taint * multiplier);
  }

  str = str.concat(`--------\n§lFinal Result§r\nNeutral Ambience: ${neutral}\n§ePure Ambience§r: ${pure}\n§5Tainted Ambience§r: ${taint}\n`)

  formData.body(str);

  formData.show(witch).then(display => {
    if (display.canceled) {
      return;
    }
  });
}

async function gatherRitualPower(ritualArray, cost, tool, block, witch) {
  // Add Ritual Resonance to the Witch
  attachCustomEffect(witch, ritualRes);
  // Gather ambient magic
  let ambientArr = await gatherAmbientEnergy(block, witch);

  if (ambientArr == "broken") {
    if (witch.isValid) {
      witch.sendMessage("§c[!]§r You feel your ritual fall flat. Either the central slate was broken/tampered with or the ritual site was not loaded.");
      witch.playSound("beacon.deactivate", { pitch: 1.9, volume: 1 });
      return;
    }
  }

  let totalAmbience = 0;

  // Record Ambience
  let energyTypes = [];

  if (ritualArray[1]?.ambience == undefined || ritualArray[1].ambience == "neutral") {
    totalAmbience = ambientArr[0] + ambientArr[1] + ambientArr[2];

    energyTypes.push("neutral");
    energyTypes.push("pure");
    energyTypes.push("taint");
  } else {
    energyTypes.push("neutral");
    if (ritualArray[1].ambience == "pure") {
      totalAmbience = ambientArr[0] + ambientArr[1];
      energyTypes.push("pure");
    }

    if (ritualArray[1].ambience == "tainted") {
      totalAmbience = ambientArr[0] + ambientArr[2];
      energyTypes.push("taint");
    }
  }



  let totalAmbientOrbos = Math.floor(totalAmbience / 5);
  console.warn(`${totalAmbience} Ambient Energy => ${totalAmbientOrbos} Orbos`);

  // Is Ceremony Mundane Friendly?
  if (!ritualArray[1].traineeFriendly) {
    if (!witch.hasTag("bw:witch_initiate")) {
      witch.sendMessage(`§c[!]§r You cannot draw on the energies necessary to complete this ritual. To perform it, you must §dascend§r.`);
      return;
    }
  }

  // Get Global Orbos Scoreboard
  let orbos = world.scoreboard.getObjective("bw:oEnergy");
  // Get cost and slowly chip away at it
  let orbosCost = cost[0];

  // Remove ambient first
  orbosCost = orbosCost - totalAmbientOrbos;

  // Record Correspondence
  ritualArray[2].correspondences = ambientArr[3];

  // Record Remaining Ambience
  let costFound = cost[0] * 5;
  let lOAmbience = {
    "neutral": ambientArr[0],
    "pure": ambientArr[1],
    "taint": ambientArr[2]
  };

  for (let energy of energyTypes) {
    if (costFound > 0) {
      costFound = costFound - lOAmbience[energy];
      if (costFound > 1) {
        lOAmbience[energy] = 0;
      } else {
        lOAmbience[energy] = lOAmbience[energy] + costFound;
      }
    }
  }
  ritualArray[2].ambient = JSON.parse(JSON.stringify(lOAmbience));

  // Ambient energy covered it all
  // else
  // Ambient energy could not cover everything/anything
  if (orbosCost <= 0) {
    // Instantly perform ritual if the materials are still laid out
    let success = await useRitualItems(ritualArray[0], block);
    if (success == true) {
      castRitual(ritualArray[1], ritualArray[2], block, witch);
    } else {
      witch.sendMessage("§c[!]§r The required items are not present for the ritual to be completed.");
      block.dimension.playSound("beacon.deactivate", block.center(), { pitch: 1.9, volume: 1 });
    }
  } else {
    // Take orbos from pool
    let witchOrbos = orbos.getScore(witch);
    if (witchOrbos == undefined) {
      witchOrbos = 0;
    }

    let affordable = orbosCost <= witchOrbos;
    if (affordable) {
      // Try to use items
      let success = await useRitualItems(ritualArray[0], block);
      if (success) {
        // Use Orbos
        orbos.addScore(witch, -orbosCost);
        // Instantly perform ritual
        castRitual(ritualArray[1], ritualArray[2], block, witch);
      } else {
        witch.sendMessage("§c[!]§r The required items are not present for the ritual to be completed.");
        block.dimension.playSound("beacon.deactivate", block.center(), { pitch: 1.9, volume: 1 });
      }
    } else {
      witch.sendMessage("§c[!]§r Not enough Orbos and ambient energy to complete the ritual.");
      block.dimension.playSound("beacon.deactivate", block.center(), { pitch: 1.9, volume: 1 });
      return;
    }
  }
}

export function useItem(item) {
  if (item.amount > 1) {
    item.amount = item.amount - 1;
  } else {
    item = undefined;
  }
  return item;
}

function roundToFive(num) {
  let mod = num % 5;
  return num - mod
}

// Ward Correspondence List
export function getWardCorrespondence(dimension, location, crystals) {
  let wardObj = {};
  // Only considers Sky, Lunar, Solar, Earth & Seasonal Correspondence

  if (!crystals || crystals.includes("sky")) {
    wardObj.weather = getWeatherAlignment(dimension);
  }
  if (!crystals || crystals.includes("solar")) {
    wardObj.time = getTimeAlignment(dimension);
  }
  if (!crystals || crystals.includes("lunar")) {
    wardObj.moon_phase = getPhaseAlignment();
  }
  if (!crystals || crystals.includes("ender")) {
    wardObj.season = "spring";
  }
  if (!crystals || crystals.includes("earth")) {
    wardObj.altitude = getAltitudeAlignment(dimension, location);
  }

  return wardObj;
}

export function corrToStrings(obj) {
  let arr = [];
  // Weather
  if (obj.weather != undefined) {
    switch (obj.weather) {
      case "clear": {
        arr.push("Clear Weather");
        break;
      }
      case "rainy": {
        arr.push("Rainy Weather");
        break;
      }
      case "thunderstorm": {
        arr.push("Awful weather");
        break;
      }
    }
  }
  // Altitudes
  if (obj.altitude != undefined) {
    switch (obj.altitude) {
      case "upper_realm": {
        arr.push("Higher Altitudes");
        break;
      }
      case "mid_realm": {
        arr.push("Normal Altitudes");
        break;
      }
      case "lower_realm": {
        arr.push("Lower Altitudes");
        break;
      }
    }
  }
  // Time
  if (obj.time != undefined) {
    switch (obj.time) {
      case "dawn": {
        arr.push("Dawn");
        break;
      }
      case "day": {
        arr.push("Daytime");
        break;
      }
      case "dusk": {
        arr.push("Dusk");
        break;
      }
      case "night": {
        arr.push("Night");
        break;
      }
    }
  }
  // Phase
  if (obj.moon_phase != undefined) {
    switch (obj.moon_phase) {
      case "full_moon": {
        arr.push("Full Moon");
        break;
      }
      case "waning_gibbous": {
        arr.push("Waning Gibbous Moon");
        break;
      }
      case "first_quarter": {
        arr.push("First Quarter Moon");
        break;
      }
      case "waning_crescent": {
        arr.push("Waning Crescent Moon");
        break;
      }
      case "new_moon": {
        arr.push("New Moon");
        break;
      }
      case "waxing_crescent": {
        arr.push("Waxing Crescent Moon");
        break;
      }
      case "last_quarter": {
        arr.push("Last Quarter Moon");
        break;
      }
      case "waxing_gibbous": {
        arr.push("Waxing Gibbous Moon");
        break;
      }
    }
  }
  // Seasons
  if (obj.season != undefined) {
    switch (obj.season) {
      case "spring": {
        arr.push("Spring Season");
        break;
      }
      case "summer": {
        arr.push("Summer Season");
        break;
      }
      case "autumn": {
        arr.push("Autumn Season");
        break;
      }
      case "winter": {
        arr.push("Winter Season");
        break;
      }
    }
  }

  let str = ``;
  let final = arr.length - 1;
  for (let i = 0; i < arr.length; i++) {
    if (final == 0) {
      str = str.concat(`${arr[i]}.`);
      break;
    } else {
      if (final > i) {
        if (i == 0) {
          str = str.concat(`${arr[i]}`);
        } else {
          str = str.concat(`, ${arr[i]}`);
        }
      } else {
        str = str.concat(` & ${arr[i]}.`);
        break;
      }
    }
  }
  return str;
}


export function isCorrValid(value, checker) {
  let n = 0;
  for (let [k, v] of Object.entries(checker)) {
    if (value[k] == v) {
      n = n + 1;
    }
  }
  // Two or more correspondences need to match to the value to be considered true
  n = n - 1;
  if (n < 1) {
    return false;
  } else {
    return n;
  }
}

export function jackBlastEntity(jackOWard, entity) {
  let dustInfo = wardingDusts[jackOWard.effect];

  if (entity.getEffect("minecraft:invisibility")) {
    if (diceRoll(1, 20, true) >= 12) {
      // Effect was blocked
      entity.playSound("item.shield.block");
      return;
    }
  }
  dustInfo.effect(entity, jackOWard.params);
}

export function breakJackShield(jackOWard, dmg, dimension) {
  jackOWard.shields = jackOWard.shields - dmg;
  if (jackOWard.shields <= 0) {
    dimension.playSound("mace.heavy_smash_ground", jackOWard.position, { pitch: 1.45, volume: 16.0 });
    jackOWard.shields = 0;
  } else {
    dimension.playSound("mace.smash_ground", jackOWard.position, { pitch: 1.45, volume: 16.0 });
  }
  return jackOWard;
}


export function pickJacks(player) {
  let currentCorr = getWardCorrespondence(player.dimension, player.location, false);

  const validWards = [];
  const effects = [];
  let knockedOut = 0;
  let acquiredTarget = false;

  let wards = world.getDynamicPropertyIds().filter((e) => {
    if (e.startsWith("pumpkinWard:")) {
      return e;
    }
  });
  for (let w of wards) {
    if (!world.getDynamicProperty(w)) {
      continue;
    }
    let ward = JSON.parse(world.getDynamicProperty(w));

    try {
      if (ward.dimension != player.dimension.id) {
        continue;
      }
      if (!player.dimension.isChunkLoaded(ward.position)) {
        continue;
      }
    } catch (err) {
      continue;
    }

    if (ward.asleep) {
      continue;
    }
    if (inRange(player.location, ward.position, 33)) {
      if (ward.unfed) {
        continue;
      }
      if (ward.encryption != undefined) {
        let num = isCorrValid(ward.encryption, currentCorr);
        if (num > 0) {
          validWards.push([num, w, ward]);
          effects.push(ward);
        }
      } else {
        validWards.push([1, w, ward]);
      }
    }
  }

  for (let info of validWards) {
    if (info[2].shields) {
      info[2] = breakJackShield(info[2], info[0], player.dimension);

      if (info[2].encryption != undefined && !acquiredTarget) {
        acquiredTarget = true;
      }
    }

    // If no shields are up, the Jack is put to sleep
    if (info[2].shields == 0) {
      knockedOut++;
      info[2].asleep = 300;

      // Set the pumpkin to sleep
      let posArr = quadSplit(info[1].slice(12));
      let pos = {
        x: posArr[0] * 1,
        y: posArr[1] * 1,
        z: posArr[2] * 1
      }
      let dim = world.getDimension(posArr[3]);

      // Get block
      let block = dim.getBlock(pos);

      // Get component
      let wardComponent = block.getComponent("bw:warding_magick")?.customComponentParameters?.params;

      if (wardComponent) {
        // Set activated ward to its deactivated variant;
        let states = block.permutation.getAllStates();
        states[wardComponent.sleep_state] = true;
        if (block.typeId == wardComponent.active_variant) {
          try {
            block.setPermutation(BlockPermutation.resolve(wardComponent.inactive_variant, states));
          } catch (err) {
            console.warn("Ward block is defined incorrectly somewhere.")
          }
        }
      }
    }
    world.setDynamicProperty(info[1], JSON.stringify(info[2]));
  }

  if (validWards.length > 0) {
    let msg = `§6[!]§r §a${validWards.length}§r Jack o' Ward(s) were caught and picked at by your spell.`;

    if (knockedOut > 0) {
      msg = msg.concat(`\n\n-> §a${knockedOut}§r of them were knocked out.`)
    }

    player.sendMessage(msg);
  } else {
    player.sendMessage(`§6[!]§r The spell detects no Jack o' Wards that it can affect.`);
    return;
  }

  // Direct effect at player
  if (acquiredTarget) {
    player.playSound("mob.evocation_illager.cast_spell", { pitch: 1.65 });

    // Effect is sent at the decryptor
    let e = effects[Math.floor(Math.random() * effects.length)];
    jackBlastEntity(e, player);
  }
}

export function getJackDays(day) {
  return Math.abs(world.getDay() - day);
}

function getJackBelow(block) {
  let dim = block.dimension;
  
  let newLoc = {
    x: block.location.x,
    x: block.location.y - 1,
    x: block.location.z
  }
  if (dim.isChunkLoaded(newLoc)) {
    let dynProp = block.getComponent("minecraft:dynamic_properties")
    if (dynProp.get("bw:ward_info")) {
      return JSON.parse(dynProp.get("bw:ward_info"))
    }
  } else {
    return;
  }
}

export function reduceCost(wand, cost, caster = undefined) {
  let orbosReduction = 0;
  let fatigueReduction = 0;

  let riteTags = cost.tags;
  let orbos = cost.occultEnergy;
  let fatigue = cost.fatigue;

  if (wand != undefined) {
    let tags = {};
    if (wand.getDynamicProperty("bw:wandTags")) {
      tags = JSON.parse(wand.getDynamicProperty("bw:wandTags"));
    }
    riteTags.forEach(e => {
      let value = tags[e];
      if (value != undefined) {
        let core = wand?.getDynamicProperty("bw:wandCore");
        let owner = wand?.getDynamicProperty("bw:wand_owner");
        let bonus = 0;

        if (core == "bw:blood_bottle") {
          if (owner != undefined && caster?.id == owner) {
            bonus = 10;
          }
        }
        if (wand.typeId == "bw:oak_wand") {
          bonus = 10;
        }

        orbosReduction = Math.floor(orbos * (value + bonus) / 100);
        fatigueReduction = Math.floor(fatigue * (value + bonus) / 100);
      }
    });
  }

  orbos = orbos - orbosReduction;
  fatigue = fatigue - fatigueReduction;

  if (orbos <= 0) {
    orbos = 0
  }
  if (fatigue <= 0) {
    fatigue = 0
  }
  return [orbos, fatigue];
}

const wool = [
  "minecraft:black_wool",
  "minecraft:blue_wool",
  "minecraft:brown_wool",
  "minecraft:light_blue_wool",
  "minecraft:lime_wool",
  "minecraft:green_wool",
  "minecraft:cyan_wool",
  "minecraft:magenta_wool",
  "minecraft:pink_wool",
  "minecraft:purple_wool",
  "minecraft:gray_wool",
  "minecraft:light_gray_wool",
  "minecraft:red_wool",
  "minecraft:orange_wool",
  "minecraft:yellow_wool",
  "minecraft:white_wool"
]
export const wands = [
  "minecraft:stick",
  "bw:oak_wand",
  "bw:spruce_wand",
  "bw:birch_wand",
  "bw:dark_oak_wand",
  "bw:jungle_wand",
  "bw:acacia_wand",
  "bw:ritual_scroll"
];

function hasAllInfo(entity, type, array) {
  if (type == "tag") {
    for (let tag of array) {
      if (!entity.hasTag(tag)) {
        return false;
      }
    }
  }
  if (type == "name") {
    for (let name of array) {
      if (entity instanceof Player) {
        if (entity.name != name) {
          return false
        }
      } else {
        return false;
      }
    }
  }
  if (type == "family") {
    for (let family of array) {
      if (!entity.getComponent("minecraft:type_family")?.hasTypeFamily(family)) {
        return false;
      }
    }
  }
  return true;
}

function saveToAmethyst(item, player, slot, loc, dim) {
  let inv = player.getComponent("inventory").container;
  let location = {
    x: Math.floor(loc.x),
    y: Math.floor(loc.y),
    z: Math.floor(loc.z)
  }
  let loreStr = [
    `§rLocation Saved: §a${location.x} ${location.y} ${location.z}§r`,
    `§rDimension: §d${dim}§r`
  ];
  item.setLore(loreStr);
  item.setDynamicProperty("bw:savedLocation", JSON.stringify(location));
  item.setDynamicProperty("bw:savedDimension", dim);
  player.dimension.playSound("mob.allay.idle", player.location, {
    volume: 1.5,
    pitch: 1.0
  });

  inv.setItem(slot, item);
}

const offenseEnchants = [
  "sharpness",
  "smite",
  "bane_of_arthropods",
  "fire_aspect",
  "breach",
  "density",
  "impaling",
  "lunge"
]

system.beforeEvents.startup.subscribe(initEvent => {
  initEvent.blockComponentRegistry.registerCustomComponent('bw:inscribe_rune', {
    onPlayerInteract: evt => {
      let slate = evt.block;
      let player = evt.player;
      let playerInv = player.getComponent("inventory").container;
      let whiteRunes = slate.permutation.getState("bw:white_glyphs");
      let redRune = slate.permutation.getState("bw:center_glyph");

      let item = player.getComponent("inventory").container.getItem(player.selectedSlotIndex);

      if (whiteRunes == 0 && redRune == false) {
        // Apply red chalk onto ritual slate
        if (item.typeId == "bw:red_chalk") {
          slate.setPermutation(BlockPermutation.resolve(slate.typeId, { "bw:center_glyph": true }));
          if (item.amount > 1) {
            item.amount = item.amount - 1
            playerInv.setItem(player.selectedSlotIndex, item);
          } else {
            playerInv.setItem(player.selectedSlotIndex, undefined);
          }
        }

        // Apply white chalk onto ritual slate
        if (item.typeId == "bw:white_chalk") {
          slate.setPermutation(BlockPermutation.resolve(slate.typeId, { "bw:white_glyphs": Math.round(1 + (8 * Math.random())) }));
          if (item.amount > 1) {
            item.amount = item.amount - 1
            playerInv.setItem(player.selectedSlotIndex, item);
          } else {
            playerInv.setItem(player.selectedSlotIndex, undefined);
          }
        }
      } else {
        // Use Wool to clear slate
        if (item != undefined && wool.includes(item.typeId)) {
          slate.setPermutation(BlockPermutation.resolve(slate.typeId, { "bw:white_glyphs": 0, "bw:center_glyph": false }));
        }

        // Change around white glyphs when a wand is used on a White glyph
        if (whiteRunes > 0 && wands.includes(item.typeId)) {
          slate.setPermutation(BlockPermutation.resolve(slate.typeId, { "bw:white_glyphs": whiteRunes == 9 ? 1 : whiteRunes + 1 }));
        }
      }
    }
  });

  initEvent.blockComponentRegistry.registerCustomComponent('bw:ritually_valid', {
    onPlayerInteract: evt => {
      let slate = evt.block;
      let player = evt.player;
      let oE = world.scoreboard.getObjective("bw:oEnergy");
      let fatigue = world.scoreboard.getObjective("bw:Fatigue");
      let item = player.getComponent("inventory").container.getItem(player.selectedSlotIndex);

      if (item != undefined && wands.includes(item.typeId) && slate.hasTag("bw:red_slate")) {
        if (player.getDynamicProperty("bwDuration:ritualResonance")) {
          player.sendMessage("§d[!]§r You are affected by §dRitual Resonance§r. You cannot start another ritual until this is gone.");
          player.playSound("beacon.deactivate", { pitch: 1.9, volume: 1 });
          return;
        }

        let items = []
        let entities = evt.dimension.getEntities({ location: slate.location, maxDistance: 3, type: "minecraft:item" });

        for (let entity of entities) {
          items.push(entity.getComponent("item").itemStack);
        }
        if (items.length > 0) {
          let foundRitual = checkRituals(items, slate, item);
          // Ceremony Found
          if (foundRitual != null) {
            // Reduce Cost
            let reducedCost = reduceCost(item, foundRitual[1].cost, player);
            // Pull from Familiar
            // 30% is taken

            // Gather Ritual Energy and then cast the ritual if possible
            gatherRitualPower(foundRitual, reducedCost, item, slate, player);
          }
        }
      }

      if (item?.typeId == "bw:natural_ash" && slate.hasTag("bw:red_slate")) {
        readAmbientEnergy(slate, player);
      }
    }
  });

  // Infused Pumpkin
  // - On place, prepare Ward
  // - On break, remove Ward
  // - On interact, edit Ward
  // ---
  // - Effect
  // - Trigger
  // - Condition (Block/Item)
  // - Quintessence Filter
  // - Candle Toggle
  initEvent.blockComponentRegistry.registerCustomComponent('bw:ward_dustable', {
    onPlace: event => {
      const block = event.block;
      const dimension = event.dimension;
      let isActivated = false;
      
      let blockDP = block.getComponent("minecraft:dynamic_properties");

      if (!blockDP) {
        console.warn('Ward Block has no ability to store dynamic properties! Fix that!');
        return;
      }

      // Define things in Jack
      let jackObj = {
        "position": {
          x: block.location.x,
          y: block.location.y,
          z: block.location.z
        },
        "totemPos": 1,
        "dimension": dimension.id,
        "shields": 0,
        "effect": null,
        "trigger": null
      };

      // Check if this is a Jack o' Totem 
      // Only allow a maximum of 6 stacked Jacks
      // Maybe remove encryption and decryption. Too complicated to explain.
      let jackBelow = getJackBelow(block);
      if (jackBelow != undefined) {
        if (jackBelow.totemPos < 6) {
          jackObj.totemPos = jackBelow.totemPos + 1;
          jackObj.position = jackBelow.position;
        }
      }
      

      if (!blockDP.get("bw:ward_info")) {
        blockDP.set("bw:ward_info", JSON.stringify(jackObj));
        isActivated = true;
      }
      
      if (isActivated) {
        console.warn("Activated Pumpkin");
      }
    },
    onBreak: event => {
      const block = event.block;
      const dimension = event.dimension;
      let blockDP = block.getComponent("minecraft:dynamic_properties");

      let jackWard = blockDP.get("bw:ward_info");

      if (jackWard) {
        console.warn(jackWard);
        console.warn("Prelim. Jack Broke");
        // Snap Sound
      }
    },
    onPlayerInteract: event => {
      const block = event.block;
      const dimension = event.dimension;
      const face = event.face;
      const player = event.player;
      const playerInv = player.getComponent("minecraft:inventory").container;
      let item = undefined;
      if (playerInv) {
        item = playerInv.getItem(player.selectedSlotIndex);
      }
      let blockDP = block.getComponent("minecraft:dynamic_properties");

      let definingJackID = blockDP.get("bw:ward_info");

      if (definingJackID) {
        let definingJack = JSON.parse(definingJackID);

        // Dusts
        // Get all possible Dusts
        let dusts = Object.keys(wardingDusts);
        let dusted = false;

        // If Effect or Trigger is undefined
        if (!definingJack.effect || !definingJack.trigger) {
          // The held item is a defined dust
          if (dusts.includes(item?.typeId)) {
            let sprinkled = false;
            // Effect & Trigger is undefined
            if (!definingJack.effect && !definingJack.trigger) {
              let params = [];
              if (wardingDusts[item.typeId]?.parameter != undefined) {
                params = wardingDusts[item.typeId].parameter(block.above(1));
                if (params.length < wardingDusts[item.typeId]?.paramsAmt) {
                  player.sendMessage("§c[!]§r There are additional items that must be on top of this block for the Jack O' Ward to gain this Effect.");
                  return;
                }
              }
              definingJack.effect = item.typeId;
              definingJack.params = params;
              player.sendMessage("§a[!]§r An §dEffect§r was added to the premature Jack O' Ward.");
              block.dimension.playSound("mob.evocation_illager.cast_spell", block.location);
              sprinkled = true;
            }

            // Effect is defined but Trigger is not
            if (!sprinkled && definingJack.effect && !definingJack.trigger) {
              definingJack.trigger = wardingDusts[item.typeId]?.trigger;
              player.sendMessage("§a[!]§r A §dTrigger§r was added to the premature Jack O' Ward.");
              block.dimension.playSound("click_on.wooden_pressure_plate", block.location);
            }

            // Dust Particles and sounds
            // Nom nom on dust
            let molang = new MolangVariableMap();
            molang.setColorRGB("variable.color", wardingDusts[item.typeId].color);
            block.dimension.spawnParticle("bw:jack_dust_add", block.center(), molang);
            block.dimension.playSound("brush.suspicious_sand", block.location);
            playerInv.setItem(player.selectedSlotIndex, useItem(item));
          }
        } else {
          dusted = true;
        }

        if (dusted && (item != undefined && !dusts.includes(item?.typeId))) {
          if (item?.typeId == "bw:natural_ash") {
            let blockAbv = block.above(1);
            // Ensure that the block above the jack is not air/liquid.
            if (!blockAbv.isAir && !blockAbv.isLiquid) {
              let frames = [
                "minecraft:frame",
                "minecraft:glow_frame"
              ]
              let localizedName = blockAbv.localizationKey;

              if (frames.includes(blockAbv.typeId)) {
                let frameItem = blockAbv.getItemStack(1, true);
                if (frameItem.typeId != blockAbv.typeId) {
                  definingJack.condition = frameItem.typeId;
                  definingJack.conditionType = "item";
                  localizedName = frameItem.localizationKey;
                } else {
                  definingJack.condition = blockAbv.typeId;
                  definingJack.conditionType = "block";
                }
              } else {
                definingJack.condition = blockAbv.typeId;
                definingJack.conditionType = "block";
              }

              player.sendMessage({ rawtext: [{ "text": "§a[!]§r A §dCondition§r was added to the premature Jack O' Ward. The Trigger is only valid if the block triggered OR item equipped is a/n §d" }, { "translate": localizedName }, { "text": "§r." }] });
            } else {
              return;
            }

            // Dust particles
            let molang = new MolangVariableMap();
            molang.setColorRGB("variable.color", {
              red: 57 / 255,
              green: 118 / 255,
              blue: 57 / 255
            });
            dimension.spawnParticle("bw:jack_dust_add", block.center(), molang);
            // Dust sounds
            dimension.playSound("brush.suspicious_sand", block.location);
            // Dust use
            playerInv.setItem(player.selectedSlotIndex, useItem(item));
          }

          if (item?.getDynamicProperty("bw:quintessence")) {
            let filter = JSON.parse(item.getDynamicProperty("bw:quintessence"));

            definingJack.filter = [filter];
            dimension.spawnParticle("bw:jack_dust_final", block.center());
            dimension.playSound("hit.slime", block.location);
            player.sendMessage("§a[!]§r §dQuintessence§r has been infused into the premature Jack O' Ward.");
            playerInv.setItem(player.selectedSlotIndex, useItem(item));
          }

          if (item?.getDynamicProperty("bw:savedLocation")) {
            let abvBlk = block.above(1);

            if (validCandles.includes(abvBlk.typeId)) {
              let loc = JSON.parse(item?.getDynamicProperty("bw:savedLocation"));
              if (inRange(loc, block.location, 32) && validCandles.includes(dimension.getBlock(loc)?.typeId)) {
                definingJack.switch = loc;
                player.sendMessage(`§a[!]§r A §dCandle Toggle§r has been successfully bound to this premature Jack O' Ward at ${loc.x} ${loc.y} ${loc.z}.`);
                abvBlk.setType("minecraft:air");

                let molang = new MolangVariableMap();
                molang.setColorRGB("variable.color", {
                  "red": 0.67,
                  "green": 0.12,
                  "blue": 0.5
                })
                dimension.spawnParticle("bw:jack_dust_add", block.center(), molang);
                dimension.playSound("brush.suspicious_gravel", block.location);
              } else
                if (!inRange(loc, block.location, 32)) {
                  player.sendMessage("§c[!]§r The position you are aiming for is outside of the premature Jack O' Ward's 64 block cubic area.");
                  return;
                } else {
                  player.sendMessage("§c[!]§r There is no candle at the target location.");
                  return;
                }
            }
          }

          if (item?.typeId == "bw:raw_orbos") {
            if (item.amount < 5) {
              player.sendMessage("§6[!]§r Not enough Raw Orbos is being provided.");
              return;
            }
            definingJack.owner = player.id;

            definingJack.lastFed = world.getDay();
            definingJack.storedOrbos = 150;

            let states = block.permutation.getAllStates();

            states["bw:is_asleep"] = false;
            states["bw:is_fed"] = true;

            if (definingJack.switch) {
              states["bw:has_toggle"] = true;
            }
            if (definingJack.condition) {
              states["bw:has_condition"] = true;
            }
            if (definingJack.filter) {
              states["bw:has_filter"] = true;
            }

            block.setPermutation(BlockPermutation.resolve("bw:jackoward", states));
            
            // TEST
            console.warn("Transform Test!")
            blockDP.set("bw:ward_info", JSON.stringify(definingJack));
            console.warn("Transform Test SUCCESS!!")
            // Dust Particles
            dimension.spawnParticle("bw:jack_dust_final", block.center());
            dimension.playSound("mob.evocation_illager.cast_spell", block.location);

            // Use Raw Orbos
            for (let i = 0; i < 5; i++) {
              playerInv.setItem(player.selectedSlotIndex, useItem(item));
            }
            // Spirit Message
            player.sendMessage("§6[§5!§6]§r A little spirit settles into the Infused Pumpkin you have prepared. You do not know, for sure, if it is fae, but you do understand that this is a deal... in a way.")
            return;
          }
        }

        console.warn(JSON.stringify(definingJack))
        blockDP.set("bw:ward_info", JSON.stringify(definingJack));
      }
    }
  });

  // Jack O Ward Pumpkin
  initEvent.blockComponentRegistry.registerCustomComponent('bw:warding_magick', {
    onBreak: event => {
      const block = event.block;
      const brokenBlock = event.brokenBlockPermutation;
      const breaker = event.entitySource;
      const dimension = event.dimension;

      let jackName = `pumpkinWard:${Math.floor(block.x)}_${Math.floor(block.y)}_${Math.floor(block.z)}_${dimension.id}`;

      // Check if this Ward exists
      // Make this block impossible to break by any means without Creative Mode.
      // Shielded Jack o' Wards grow back when trying to break them, just with one less shield.
      // Shields are only used up on encrypted Jacks when the breaking happens in alignment with 2 or more of its encryption Correspondences.
      if (world.getDynamicProperty(jackName) != undefined) {
        let jackOWard = JSON.parse(world.getDynamicProperty(jackName));

        let breakable = true;
        if (jackOWard.encryption) {
          // Present Correspondences
          let presentCorr = getWardCorrespondence(dimension, block.location, false);
          let force = isCorrValid(jackOWard.encryption, presentCorr);
          if (force == 0) {
            breakable = false;
          }
        }

        if (!breakable) {
          // Flashy Particles
          // Sounds
          console.warn("Encryption go brrr. Your breaking attempts are tanked.");
          // Blast the attacker for their impudence;
          if (breaker != undefined) {
            jackBlastEntity(jackOWard, breaker);
          }
          // Replace block cuz rude, tf?!
          block.setPermutation(brokenBlock);
          return;
        } else {
          // If the Jack has Shields
          if (jackOWard.shields > 0) {
            // Break down these shields
            jackOWard = breakJackShield(jackOWard, 1, block.dimension);
            // - Sidenote: 10 Durability per Shield broken tbh

            // Replace block
            block.setPermutation(brokenBlock);

            // Blast back, tff?
            if (breaker != undefined) {
              jackBlastEntity(jackOWard, breaker);
            }

            // Set jack o ward
            world.setDynamicProperty(jackName, JSON.stringify(jackOWard));
          } else {
            // Block has been successfully broken.
            world.setDynamicProperty(jackName, undefined);

            console.warn("Jack o' Ward Broke");
            // Snap Sound
          }
        }
      }
    },
    onPlayerInteract: event => {
      const block = event.block;
      const dimension = event.dimension;
      const player = event.player;
      const playerInv = player.getComponent("minecraft:inventory").container;
      let item = undefined;
      if (playerInv) {
        item = playerInv.getItem(player.selectedSlotIndex);
      }

      let wardJackName = `pumpkinWard:${Math.floor(block.x)}_${Math.floor(block.y)}_${Math.floor(block.z)}_${dimension.id}`;

      // Confirm that the Jack exists
      if (world.getDynamicProperty(wardJackName)) {
        let jackOWard = JSON.parse(world.getDynamicProperty(wardJackName));

        // Let Sleeping Pumpkins Lie
        if (jackOWard.asleep && player.id == jackOWard.owner) {
          player.sendMessage(`§6[!]§r Your Jack o' Ward is fast asleep. It says to give it ${jackOWard.asleep} more second(s).`);
          return;
        }

        // Read the damn pumpkin
        if (item == undefined) {
          readJack(jackOWard, player);
        }

        // Jacks can be shielded with Protective Enchantments up to a maximum of 10;
        if (item?.typeId == "minecraft:enchanted_book") {
          // Gets the first enchantment on the item
          let enchant = item.getComponent("minecraft:enchantable")?.getEnchantments()[0];

          if (enchant == undefined) {
            return;
          }

          if (jackOWard.shields >= 10) {
            return;
          }

          if (enchant.type.id.includes("protection")) {
            jackOWard.shields = jackOWard.shields + enchant.level;
            if (jackOWard.shields > 10) {
              jackOWard.shields = 10;
            }
            // Use Enchanted Book
            playerInv.setItem(player.selectedSlotIndex, useItem(item));
            player.sendMessage(`§6[!]§r An enchanted shield has been placed over this Jack o' Ward. It now has Shield ${jackOWard.shields}.`);
            // Particles & Sounds
            dimension.spawnParticle("bw:jack_dust_final", block.center());
            dimension.playSound("mob.evocation_illager.cast_spell", block.location);
            // Set Jack
            world.setDynamicProperty(wardJackName, JSON.stringify(jackOWard));
            return;
          }
        }

        // If not enchanted book but it has an enchantment, its likely to be a tool with an enchantment placed on it. Some enchantments interact with Shielded Jacks. Naturally encryption protects against this.
        if (item?.typeId != "minecraft:enchanted_book" && item?.getComponent("minecraft:enchantable")) {
          // Gets the first enchantment on the item
          let enchant = item.getComponent("minecraft:enchantable")?.getEnchantments()[0];

          // Determines if the Jack can be attacked based on encryption. If no encryption is present, this is always true;
          let attackable = false;

          if (jackOWard.encryption) {
            // Present Correspondences
            let presentCorr = getWardCorrespondence(block.dimension, block.location, false);
            let force = isCorrValid(jackOWard.encryption, presentCorr);
            if (force > 0) {
              attackable = true;
            }
          } else {
            attackable = true;
          }

          if (!attackable) {
            // Flashy Particles
            // Sounds
            console.warn("Encryption go brrr. Your attacks are tanked.");
            // Blast the attacker for their impudence;
            jackBlastEntity(jackOWard, player);
            return;
          } else {
            // If the item's first enchantment is offensive
            if (offenseEnchants.includes(enchant?.type?.id)) {
              // If the Jack has Shields
              if (jackOWard.shields > 0) {
                // Break down these shields
                jackOWard = breakJackShield(jackOWard, enchant.level, player.dimension);
                // - Sidenote: 10 Durability per Shield broken tbh

                // Blast back with potentially deadly force
                jackBlastEntity(jackOWard, player);
                // Set jack o ward
                world.setDynamicProperty(wardJackName, JSON.stringify(jackOWard));
              }
            }
          }
        }

        // Encrypt Pumpkin
        if (player.getDynamicProperty("pumpkinTouch_encrypt") === true) {
          if (!item?.hasTag("bw:castingWand")) {
            return;
          }
          if (jackOWard.owner == player.id) {
            let itemEntities = block.dimension.getEntitiesAtBlockLocation(block.above(1).location);
            let items = [];
            let crystals = [];
            itemEntities.forEach(e => {
              if (e.getComponent("minecraft:item")) {
                let it = e.getComponent("minecraft:item").itemStack;

                if (!crystals.includes("sky")) {
                  if (it.typeId == "bw:sky_imbued_quartz") {
                    crystals.push("sky");
                    items.push(e);
                  }
                }
                if (!crystals.includes("solar")) {
                  if (it.typeId == "bw:solar_imbued_quartz") {
                    crystals.push("solar");
                    items.push(e);
                  }
                }
                if (!crystals.includes("lunar")) {
                  if (it.typeId == "bw:lunar_imbued_quartz") {
                    crystals.push("lunar");
                    items.push(e);
                  }
                }
                if (!crystals.includes("earth")) {
                  if (it.typeId == "bw:earth_imbued_quartz") {
                    crystals.push("earth");
                    items.push(e);
                  }
                }
                if (!crystals.includes("ender")) {
                  if (it.typeId == "bw:ender_imbued_quartz") {
                    crystals.push("ender");
                    items.push(e);
                  }
                }
              }
            })

            if (crystals.length > 0 && crystals.length < 3) {
              player.sendMessage(`§6[!]§r A Jack o' Ward needs the influence of §c3 different Correspondences§r to be encrypted. Because crystals are being used to focus them, you require §a3 (or more) different primal crystals§r, not just §c${crystals.length}§r.\nThe effects of §6Locking the Ward§r fades away...`);
              player.setDynamicProperty("pumpkinTouch_encrypt", undefined);
              return;
            }

            if (crystals.length > 0) {
              for (let iE of items) {
                let i = iE.getComponent("minecraft:item").itemStack;
                let newI = useItem(i);
                if (newI != undefined) {
                  block.dimension.spawnItem(newI, block.center());
                }
                iE.remove();
              }
            } else {
              crystals = false;
            }

            let currentCorr = getWardCorrespondence(player.dimension, jackOWard.position, crystals);

            player.sendMessage(`§6[!]§r This Jack o' Ward has been §aencrypted§r using the natural alignment of §a${corrToStrings(currentCorr)}§r`);

            player.dimension.playSound("beacon.activate", player.location, { pitch: 1.67 })

            jackOWard.encryption = currentCorr;
            player.setDynamicProperty("pumpkinTouch_encrypt", undefined);
            world.setDynamicProperty(wardJackName, JSON.stringify(jackOWard))
          } else {
            player.sendMessage(`§6[!]§r This Jack o' Ward was not created by you. The effects of §6Locking the Ward§r fades away...`);
            player.setDynamicProperty("pumpkinTouch_encrypt", undefined);
          }
        }

        // Give the Jack Orbos to stock up
        if (item?.typeId == "bw:raw_orbos") {
          let consolidated = Math.floor(jackOWard.storedOrbos / 30);
          if (consolidated < 60) {
            let orbDiff = 60 - consolidated;
            if (orbDiff >= item.amount) {
              jackOWard.storedOrbos = jackOWard.storedOrbos + (item.amount * 30);
              item = undefined;
            } else {
              jackOWard.storedOrbos = jackOWard.storedOrbos + (orbDiff * 30);

              item.amount = item.amount - orbDiff;
            }

            if (jackOWard.storedOrbos > 1800) {
              jackOWard.storedOrbos = 1800;
            }
          }

          // Update last fed date
          jackOWard.lastFed = world.getDay();

          // Set Jack
          world.setDynamicProperty(wardJackName, JSON.stringify(jackOWard))
          // Use Raw Orbos
          playerInv.setItem(player.selectedSlotIndex, item);

          // Send warning
          let days = getJackDays(jackOWard.lastFed);
          console.warn("Days:" + days);
        }
      }
    }
  });

  // Jack Redstone Trigger
  initEvent.blockComponentRegistry.registerCustomComponent('bw:redstone_jack', {
    onRedstoneUpdate: event => {
      const block = event.block;
      const power = event.powerLevel;
      const dimension = event.dimension;

      let jackName = `pumpkinWard:${Math.floor(block.x)}_${Math.floor(block.y)}_${Math.floor(block.z)}_${dimension.id}`;

      // Trigger Redstone Trigger
      if (world.getDynamicProperty(jackName) != undefined) {
        let jackOWard = JSON.parse(world.getDynamicProperty(jackName));

        if (jackOWard.asleep) {
          return;
        }

        let eatResult = jackEat(jackOWard, jackName);
        if (eatResult) {
          jackOWard = eatResult;
        } else {
          return;
        }

        if (jackOWard.trigger == "redstone_trigger_jack") {
          if (jackOWard.effect == "bw:amethyst_dust") {
            if (!checkSwitch(jackOWard.switch, dimension)) {
              return;
            }

            let effectFunc = wardingDusts[jackOWard.effect].effect;

            effectFunc(block, jackOWard.params);
          } else {
            let entities = dimension.getEntities({
              location: {
                x: jackOWard.position.x - 32,
                y: jackOWard.position.y - 32,
                z: jackOWard.position.z - 32
              },
              volume: {
                x: 64,
                y: 64,
                z: 64
              }
            });

            for (let entity of entities) {
              if (jackOWard.condition != undefined && jackOWard.conditionType == "item") {
                let equipped = entity?.getComponent("minecraft:equippable")?.getEquipment("Mainhand");
                if (jackOWard.condition != equipped?.typeId) {
                  continue;
                }
              }
              if (!checkSwitch(jackOWard.switch, dimension)) {
                continue;
              }
              if (!essenceCheck(entity, jackOWard.filter)) {
                continue;
              }
              let effectFunc = wardingDusts[jackOWard.effect].effect;

              effectFunc(entity, jackOWard.params);
            }
          }
        }
      }
    }
  });

  // Pumpkin Slumber
  initEvent.blockComponentRegistry.registerCustomComponent('bw:zzz_pumpkin', {
    onTick: event => {
      const block = event.block;
      const dimension = event.dimension;

      let jackName = `pumpkinWard:${Math.floor(block.x)}_${Math.floor(block.y)}_${Math.floor(block.z)}_${dimension.id}`;

      // Confirm that the Jack exists
      if (world.getDynamicProperty(jackName)) {
        let jackOWard = JSON.parse(world.getDynamicProperty(jackName));

        if (jackOWard.asleep > 0) {
          jackOWard.asleep--;
        } else {
          delete jackOWard.asleep;
          // Get component
          let wardComponent = block.getComponent("bw:warding_magick")?.customComponentParameters?.params;

          if (wardComponent) {
            // Set activated ward to its deactivated variant;
            let states = block.permutation.getAllStates();
            states[wardComponent.sleep_state] = false;
            if (block.typeId == wardComponent.inactive_variant) {
              block.setPermutation(BlockPermutation.resolve(wardComponent.active_variant, states));
            }
          }
        }

        world.setDynamicProperty(jackName, JSON.stringify(jackOWard));
      }
    }
  });

  // Ambience Block
  initEvent.blockComponentRegistry.registerCustomComponent('bw:ambient_block', {});

  // Force location into amethyst nugget
  initEvent.itemComponentRegistry.registerCustomComponent('bw:get_location', {
    onUseOn: e => {
      const item = e.itemStack;
      const player = e.source;
      const block = e.block;

      if (player.isSneaking) {
        return;
      }
      // Get Amethyst Nugget
      if (!item.getDynamicProperty("bw:savedLocation")) {
        saveToAmethyst(item, player, player.selectedSlotIndex, block.location, block.dimension.id);
        player.sendMessage(`§d[!]§r You've bound the touched location to this item.`)
      }
    },
    onUse: e => {
      const item = e.itemStack;
      const player = e.source;

      if (player.isSneaking) {
        return;
      }

      // Get Amethyst Nugget
      if (!item.getDynamicProperty("bw:savedLocation")) {
        saveToAmethyst(item, player, player.selectedSlotIndex, player.location, player.dimension.id);
        player.sendMessage(`§d[!]§r You've bound your current position to this item.`)
      }
    }
  });
});

world.afterEvents.playerSpawn.subscribe((e) => {
  let player = e.player;
  let initialSpawn = e.initialSpawn;
  if (!initialSpawn) {
    let allProperties = player.getDynamicPropertyIds();
    let revisedEffects = [];
    for (let p of allProperties) {
      if (p.startsWith("bwDuration:")) {
        revisedEffects.push(p);
      }
    }

    for (let duration of revisedEffects) {
      let parsed = JSON.parse(player.getDynamicProperty(duration));
      if (parsed.vanishOnDeath == undefined && parsed.vanishOnDeath) {
        player.setDynamicProperty(duration, undefined);
      }
    }
  }
});