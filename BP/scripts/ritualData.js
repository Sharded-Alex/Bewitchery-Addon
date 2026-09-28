/* jshint maxerr: 10000 */
import {world, system, ItemStack, BlockPermutation, BlockVolume, Dimension, EntityItemComponent, MolangVariableMap, Player} from "@minecraft/server";
import { cleanseTarget, ritualHexTarget, detectBlockInArea, greaterFaePunishment, randomize, getFaery, getFaeFamily, hasFaery, getFaeries, findFaery, addFaery, removeFaery, addFaeryTrust, greaterOpposition, updateOfferedFaerie, createSprigganSprite} from "./castRitual";
import { requestStartingGame } from "./feyBargain.js";
import { hexArea } from "./curses.js";
import { lesserFae, medianFae, greaterFae, solarFaeArray, lunarFaeArray, twilightFaeArray, convertFaeName } from "./lesserFaerie.js";
import { diceRoll } from "./occultMagick.js";
import { combineEssences } from "./consumePotion.js";
import {Vector3} from "./VectorMath/index.js";
import {verifyPatron} from "./altars.js";
import { hasFamiliar, getTrueFamiliars } from "./familiars.js";

// REVAMPED RITUAL SYSTEM
// Rituals make use of Ambient Energy.
// – Mystics+ may substitute Orbos for Ambient Energy. [1 Ob => 5 AE]
// Aspects help to reduce ritual costs by percentages. 
// Certain Correspondences can influence a ritual.
// Certain rituals are enhanced based on how much excess Ambient Energy is present.
// Rituals may extract ritual items from bundles thrown into the ritual space.

// occultEnergy = Orbos
// - Orbos * 5 = Ambient Energy
// Fatigue is limited at 1000 but is divided by 10 on display.
export const ceremonies = [
  // Weather Rites (+)
  {
    id: "Blessing of the Rain",
    itemArray: [
      "bw:cornflower_dust",
      "bw:crushed_fern",
      "bw:sky_imbued_quartz",
      "bw:lunar_imbued_quartz"
    ],
    cost: {
      "tags": ["conjuration", "summer", "weather"],
      "occultEnergy": 50,
      "fatigue": 100
    },
    traineeFriendly: true,
    validCircle: "Spiral of Urrican",
    ambience: "neutral",
    ritualEffects: (witch, ritualSlate, alignments) => {
      let timeInMinutes = 1;
      
      // Every 250 N + P Ambience, another minute is added;
      timeInMinutes = timeInMinutes + Math.max(0, Math.floor((alignments.ambience.neutral + alignments.ambience.pure + alignments.ambience.taint)/300));
      
      witch.dimension.setWeather("Rain", timeInMinutes*20*60);
    }
  },
  {
    id: "Clearing of the Clouds",
    itemArray: [
      "bw:oxeye_daisy_dust", 
      "bw:crushed_fern", 
      "bw:sky_imbued_quartz", 
      "bw:solar_imbued_quartz", 
      "minecraft:sunflower"
    ],
    cost: {
      "tags": ["conjuration", "summer", "weather"],
      "occultEnergy": 45,
      "fatigue": 120
    },
    validCircle: "Spiral of Urrican",
    traineeFriendly: true,
    ambience: "neutral",
    ritualEffects: (witch, ritualSlate, alignments) => {
      let timeInMinutes = 1;
      
      // Every 250 N + P Ambience, another minute is added;
      timeInMinutes = timeInMinutes + Math.max(0, Math.floor((alignments.ambience.neutral + alignments.ambience.pure + alignments.ambience.taint)/300));
      
      witch.dimension.setWeather("Clear", timeInMinutes*20*60);
    }
  },
  {
    id: "Howling of the Aerials",
    itemArray: [
      "minecraft:copper_ingot", 
      "bw:sky_imbued_quartz", 
      "bw:crushed_fern", 
      "bw:dandelion_dust", 
      "bw:cornflower_dust"
    ],
    cost: {
      "tags": ["conjuration", "summer", "weather"],
      "occultEnergy": 60,
      "fatigue": 150
    },
    validCircle: "Spiral of Urrican",
    traineeFriendly: true,
    ambience: "neutral",
    ritualEffects: (witch, ritualSlate, alignments) => {
      let timeInMinutes = 1;
      
      // Every 250 N + P Ambience, another minute is added;
      timeInMinutes = timeInMinutes + Math.max(0, Math.floor((alignments.ambience.neutral + alignments.ambience.pure + alignments.ambience.taint)/300));
      
      witch.dimension.setWeather("Thunder", timeInMinutes*20*60);
    }
  },
  
  // Time Rites (+)
  {
    id: "Acceleration of the Clock",
    itemArray: [
      "minecraft:clock", 
      "bw:sky_imbued_quartz", 
      "bw:solar_imbued_quartz",
      "bw:emerald_dust",
      "bw:blue_orchid_dust"
    ],
    cost: {
      "tags": ["evocation", "celestial"],
      "occultEnergy": 700,
      "fatigue": 350
    },
    validCircle: "Spiral of Urrican",
    traineeFriendly: true,
    ambience: "neutral",
    ritualEffects: (witch, ritualSlate, alignments) => {
      let max = 24000;
      
      let addedTime = Math.floor((alignments.ambience.neutral + alignments.ambience.pure + alignments.ambience.taint)/1500);
      
      if (addedTime > 3) {
        addedTime = 3;
      }
      
      max = max + (addedTime * 12000);
      
      let t = 0;
      let timeSys = system.runInterval(e => {
        witch.dimension.runCommand(`time add 20`);
        t = t + 20;
        if (t >= max) {
          system.clearRun(timeSys);
        }
      }, 1);
    }
  },
  {
    id: "Reversal of the Clock",
    itemArray: [
      "minecraft:clock", 
      "bw:sky_imbued_quartz", 
      "bw:lunar_imbued_quartz",
      "bw:emerald_dust",
      "bw:blue_orchid_dust"
    ],
    cost: {
      "tags": ["evocation", "celestial"],
      "occultEnergy": 800,
      "fatigue": 350
    },
    validCircle: "Spiral of Urrican",
    traineeFriendly: true,
    ambience: "neutral",
    ritualEffects: (witch, ritualSlate, alignments) => {
      let max = 24000;
      
      let addedTime = Math.floor((alignments.ambience.neutral + alignments.ambience.pure + alignments.ambience.taint)/1500);
      
      if (addedTime > 3) {
        addedTime = 3;
      }
      
      max = max + (addedTime * 12000);
      
      let t = 0;
      let timeSys = system.runInterval(e => {
        witch.dimension.runCommand(`time add -20`);
        t = t + 20;
        if (t >= max) {
          system.clearRun(timeSys);
        }
      }, 1);
    }
  },
  
  // Ascension Rite
  {
    id: "Rite of Mystic Ascension",
    itemArray: [
      "minecraft:amethyst_shard", 
      "bw:sky_imbued_quartz", 
      "bw:lunar_imbued_quartz", 
      "bw:earth_imbued_quartz", 
      "bw:solar_imbued_quartz", 
      "bw:ender_imbued_quartz"
    ],
    cost: {
      "tags": ["evocation", "binding"],
      "occultEnergy": 1500,
      "fatigue": 600
    },
    validCircle: "Spiral of Urrican",
    traineeFriendly: true,
    ambience: "neutral",
    vfx: [
      // I call to Fire in the North
      // I call to Earth in the West
      // I call to Water in the South
      // I call to Air in the West
      // I call to the Spirit that encompasses
      
      // Your powers are welcomed here.
      // Now I ask you to settle within me
      {
        particle: "bw:solar_energy_gathering",
        particleOffset: {
          x: 0,
          y: 1.8,
          z: 2.5
        },
        delayAfterParticleInSeconds: 1,
        sound: "block.bell.hit",
        soundValues: {
          pitch: 1.3,
          volume: 2.0
        }
      },
      {
        particle: "bw:earth_energy_gathering",
        particleOffset: {
          x: 2.5,
          y: 1.8,
          z: 0
        },
        delayAfterParticleInSeconds: 1,
        sound: "block.bell.hit",
        soundValues: {
          pitch: 1.3,
          volume: 2.0
        }
      },
      {
        particle: "bw:lunar_energy_gathering",
        particleOffset: {
          x: 0,
          y: 1.8,
          z: -2.5
        },
        delayAfterParticleInSeconds: 1,
        sound: "block.bell.hit",
        soundValues: {
          pitch: 1.3,
          volume: 2.0
        }
      },
      {
        particle: "bw:sky_energy_gathering",
        particleOffset: {
          x: -2.5,
          y: 1.8,
          z: 0
        },
        delayAfterParticleInSeconds: 1,
        sound: "block.bell.hit",
        soundValues: {
          pitch: 1.3,
          volume: 2.0
        }
      },
      {
        particle: "bw:ender_energy_gathering",
        particleOffset: {
          x: 0,
          y: 0.15,
          z: 0
        },
        delayAfterParticleInSeconds: 0,
        sound: "block.bell.hit",
        soundValues: {
          pitch: 1.3,
          volume: 2.0
        }
      },
      {
        sound: "conduit.ambient",
        soundValues: {
          pitch: 1.25,
          volume: 3.0
        },
        delayAfterParticleInSeconds: 10,
        playDuringDelay: {}
      },
      {
        sound: "random.totem",
        soundValues: {
          pitch: 0.6,
          volume: 3.0
        },
        delayAfterParticleInSeconds: 0
      }
    ],
    ritualEffects: (witch, ritualSlate, alignments) => {
      if (!witch.hasTag("bw:witch_initiate")) {
        witch.addTag("bw:witch_initiate");
        witch.sendMessage(`You have ascended to the heights of a Mystic Witch.`);
      } else {
        witch.sendMessage(`You are already a Mystic Witch. This Rite does nothing for you.`);
      }
    }
  },
  
  // Cleansing Rites (+)
  {
    id: "Lesser Rite of Cleansing",
    itemArray: [
      "bw:oxeye_daisy_dust", 
      "bw:blood_vial", 
      "bw:solar_imbued_quartz", 
      "minecraft:milk_bucket"
    ],
    specialProperties: {
      "bw:blood_vial": "bw:blood"
    },
    cost: {
      "tags": ["abjuration", "occult"],
      "occultEnergy": 70,
      "fatigue": 150
    },
    validCircle: "Circle of Duality",
    traineeFriendly: true,
    ambience: "pure",
    vfx: [
      {
        particle: "bwRitual:cleanseSmoke",
        particleOffset: {
          x: 0.5,
          y: 0,
          z: 0.5
        },
        delayAfterParticleInSeconds: 0.5
      },
      {
        particle: "bwRitual:cleanseSmokeOutwards",
        particleOffset: {
          x: 0.5,
          y: 0,
          z: 0.5
        },
        delayAfterParticleInSeconds: 3.5
      },
      {
        sound: "block.bell.hit",
        soundValues: {
          pitch: 0.6,
          volume: 3.0
        },
        delayAfterParticleInSeconds: 0
      }
    ],
    ritualEffects: (witch, ritualSlate, alignments) => {
      // Give the bucket back
      ritualSlate.dimension.spawnItem(new ItemStack("minecraft:bucket", 1), ritualSlate.center());
      
      if (alignments.properties["bw:blood_vial"] == undefined) {
        return;
      }
      let blood = JSON.parse(alignments.properties["bw:blood_vial"]);
      
      let magnitude = Math.max(0, Math.floor((alignments.ambience.neutral + alignments.ambience.pure)/1000));
      
      let target = world.getEntity(blood.id);
      
      if (target != undefined) {
        if (ritualSlate.dimension.id == target.dimension.id) {
          cleanseTarget(target, "lesser", witch, magnitude);
        }
      }
    }
  },
  {
    id: "Greater Rite of Cleansing",
    itemArray: [
      "minecraft:glowstone_dust", 
      "bw:solar_imbued_quartz", 
      "bw:blood_vial", 
      "minecraft:milk_bucket", 
      "minecraft:diamond"
    ],
    specialProperties: {
      "bw:blood_vial": "bw:blood"
    },
    cost: {
      "tags": ["abjuration", "occult"],
      "occultEnergy": 140,
      "fatigue": 300
    },
    validCircle: "Circle of Duality",
    traineeFriendly: true,
    ambience: "pure",
    vfx: [
      {
        particle: "bwRitual:cleanseSmoke",
        particleOffset: {
          x: 0.5,
          y: 0,
          z: 0.5
        },
        delayAfterParticleInSeconds: 0.5
      },
      {
        particle: "bwRitual:cleanseSmokeOutwards",
        particleOffset: {
          x: 0.5,
          y: 0,
          z: 0.5
        },
        delayAfterParticleInSeconds: 3.5
      },
      {
        sound: "block.bell.hit",
        soundValues: {
          pitch: 0.6,
          volume: 3.0
        },
        delayAfterParticleInSeconds: 0
      }
    ],
    ritualEffects: (witch, ritualSlate, alignments) => {
      // Give the bucket back
      ritualSlate.dimension.spawnItem(new ItemStack("minecraft:bucket", 1), ritualSlate.center());
      if (alignments.properties["bw:blood_vial"] == undefined) {
        return;
      }
      let blood = JSON.parse(alignments.properties["bw:blood_vial"]);
      
      let magnitude = Math.max(0, Math.floor((alignments.ambience.neutral + alignments.ambience.pure)/1000));
      
      let target = world.getEntity(blood.id);
      
      if (target != undefined) {
        if (ritualSlate.dimension.id == target.dimension.id) {
          cleanseTarget(target, "greater", witch, magnitude);
        }
      }
      
    }
  },
  {
    id: "Rite of Malicious Reflection",
    itemArray: [
      "bw:lunar_imbued_quartz", 
      "bw:blood_vial", 
      "minecraft:glass_pane"
    ],
    specialProperties: {
      "bw:blood_vial": "bw:blood"
    },
    cost: {
      "tags": ["evocation", "abjuration", "occult"],
      "occultEnergy": 200,
      "fatigue": 450
    },
    validCircle: "Circle of Duality",
    traineeFriendly: true,
    ambience: "neutral",
    vfx: [
      {
        particle: "bwRitual:cleanseSmoke",
        particleOffset: {
          x: 0.5,
          y: 0,
          z: 0.5
        },
        delayAfterParticleInSeconds: 0.5
      },
      {
        particle: "bwRitual:cleanseSmokeOutwards",
        particleOffset: {
          x: 0.5,
          y: 0,
          z: 0.5
        },
        delayAfterParticleInSeconds: 3.5
      },
      {
        sound: "block.bell.hit",
        soundValues: {
          pitch: 0.6,
          volume: 3.0
        },
        delayAfterParticleInSeconds: 0
      }
    ],
    ritualEffects: (witch, ritualSlate, alignments) => {
      if (alignments.properties["bw:blood_vial"] == undefined) {
        return;
      }
      let blood = JSON.parse(alignments.properties["bw:blood_vial"]);
      
      let magnitude = Math.max(0, Math.floor((alignments.ambience.taint + alignments.ambience.pure)/1000));
      
      let target = world.getEntity(blood.id);
      
      if (target != undefined) {
        if (ritualSlate.dimension.id == target.dimension.id) {
          cleanseTarget(target, "reflection", witch, magnitude);
        }
      }
    }
  },
  
  // Summoning (+)
  {
    id: "Call by the Crossroads",
    itemArray: [
      "minecraft:ender_pearl",
      "bw:ender_imbued_quartz",
      "minecraft:string",
      "bw:blood_vial"
    ],
    specialProperties: {
      "bw:blood_vial": "bw:blood"
    },
    cost: {
      "tags": ["occult", "conjuration"],
      "occultEnergy": 500,
      "fatigue": 350
    },
    validCircle: "Star of Nathe",
    vfx: [
      {
        particle: "bwritual:esoteric_floating_symbols",
        particleOffset: {
          x: 0.5,
          y: 1,
          z: 0.5
        },
        delayAfterParticleInSeconds: 0
      },
      {
        particle: "bwritual:end_dispersal_particle",
        particleOffset: {
          x: 0.5,
          y: 1,
          z: 0.5
        },
        sound: "block.end_portal.spawn",
        soundValues: {
          pitch: 1,
          volume: 2.5
        },
        delayAfterParticleInSeconds: 10,
        playDuringDelay: {}
      },
      {
        particle: "bwritual:end_rite_burst",
        particleOffset: {
          x: 0.5,
          y: 1,
          z: 0.5
        },
        sound: "mob.endermen.death",
        soundValues: {
          pitch: 1,
          volume: 2.5
        },
        delayAfterParticleInSeconds: 0
      }
    ],
    traineeFriendly: true,
    ambience: "neutral",
    ritualEffects: (witch, ritualSlate, alignments) => {
      if (alignments.properties["bw:blood_vial"] == undefined) {
        return;
      }
      let blood = JSON.parse(alignments.properties["bw:blood_vial"]);
      
      let target = world.getEntity(blood.id);
          
      if (target != undefined) {
        target.teleport(ritualSlate.center(), {dimension: ritualSlate.dimension});
      }
    }
  },
  {
    id: "Banish Across the Crossroads",
    itemArray: [
      "minecraft:ender_pearl",
      "bw:ender_imbued_quartz",
      "bw:amethyst_nugget",
      "bw:blood_vial"
    ],
    specialProperties: {
      "bw:blood_vial": "bw:blood",
      "bw:amethyst_nugget": "bw:savedLocation"
    },
    keptItems: [
      "bw:amethyst_nugget"
    ],
    cost: {
      "tags": ["occult", "conjuration"],
      "occultEnergy": 400,
      "fatigue": 250
    },
    validCircle: "Star of Nathe",
    ambience: "neutral",
    vfx: [
      {
        particle: "bwritual:esoteric_floating_symbols",
        particleOffset: {
          x: 0.5,
          y: 1,
          z: 0.5
        },
        delayAfterParticleInSeconds: 0
      },
      {
        particle: "bwritual:end_dispersal_particle",
        particleOffset: {
          x: 0.5,
          y: 1,
          z: 0.5
        },
        sound: "block.end_portal.spawn",
        soundValues: {
          pitch: 1,
          volume: 2.5
        },
        delayAfterParticleInSeconds: 10,
        playDuringDelay: {}
      },
      {
        particle: "bwritual:end_rite_burst",
        particleOffset: {
          x: 0.5,
          y: 1,
          z: 0.5
        },
        sound: "mob.endermen.death",
        soundValues: {
          pitch: 1,
          volume: 2.5
        },
        delayAfterParticleInSeconds: 0
      }
    ],
    ritualEffects: (witch, ritualSlate, alignments) => {
      if (alignments.properties["bw:blood_vial"] == undefined) {
        return;
      }
      let blood = JSON.parse(alignments.properties["bw:blood_vial"]);
      
      if (alignments.properties["bw:amethyst_nugget"] == undefined) {
        return;
      }
      let location = JSON.parse(alignments.properties["bw:amethyst_nugget"]);
      
      let target = world.getEntity(blood.id);
          
      if (target != undefined) {
        target.teleport(location);
      }
    }
  },
  {
    id: "Conjuring by the Crossroads",
    itemArray: [
      "minecraft:ender_pearl",
      [
        "minecraft:egg",
        "minecraft:brown_egg",
        "minecraft:blue_egg"
      ],
      "minecraft:diamond",
      "bw:ender_imbued_quartz", 
      "bw:blood_vial"
    ],
    specialProperties: {
      "bw:blood_vial": "bw:blood"
    },
    cost: {
      "tags": ["occult", "conjuration"],
      "occultEnergy": 3000,
      "fatigue": 450
    },
    validCircle: "Star of Nathe",
    ambience: "neutral",
    traineeFriendly: true,
    vfx: [
      {
        particle: "bwritual:ender_inwards",
        particleOffset: {
          x: 0.5,
          y: 1.5,
          z: 0.5
        },
        sound: "block.end_portal.spawn",
        soundValues: {
          pitch: 1,
          volume: 2.5
        },
        delayAfterParticleInSeconds: 8,
        playDuringDelay: {}
      },
      {
        particle: "bwritual:end_rite_burst",
        particleOffset: {
          x: 0.5,
          y: 1.5,
          z: 0.5
        },
        sound: "mob.endermen.death",
        soundValues: {
          pitch: 1,
          volume: 2.5
        },
        delayAfterParticleInSeconds: 0
      }
    ],
    ritualEffects: (witch, ritualSlate, alignments) => {
      if (alignments.properties["bw:blood_vial"] == undefined) {
        return;
      }
      let blood = JSON.parse(alignments.properties["bw:blood_vial"]);
      
      ritualSlate.dimension.spawnEntity(blood.type, ritualSlate.center());
    }
  },
  {
    id: "Rite of Traveling",
    itemArray: [
      "bw:dandelion_dust",
      "minecraft:ender_pearl",
      "bw:amethyst_nugget",
      "bw:ender_imbued_quartz"
    ],
    specialProperties: {
      "bw:amethyst_nugget": "bw:savedLocation"
    },
    keptItems: [
      "bw:amethyst_nugget"
    ],
    cost: {
      "tags": ["occult", "conjuration"],
      "occultEnergy": 550,
      "fatigue": 200
    },
    validCircle: "Star of Nathe",
    vfx: [
      {
        particle: "bwritual:esoteric_floating_symbols",
        particleOffset: {
          x: 0.5,
          y: 1,
          z: 0.5
        },
        delayAfterParticleInSeconds: 0
      },
      {
        particle: "bwritual:end_dispersal_particle",
        particleOffset: {
          x: 0.5,
          y: 1,
          z: 0.5
        },
        sound: "block.end_portal.spawn",
        soundValues: {
          pitch: 1,
          volume: 2.5
        },
        delayAfterParticleInSeconds: 10,
        playDuringDelay: {}
      },
      {
        particle: "bwritual:end_rite_burst",
        particleOffset: {
          x: 0.5,
          y: 1,
          z: 0.5
        },
        sound: "mob.endermen.death",
        soundValues: {
          pitch: 1,
          volume: 2.5
        },
        delayAfterParticleInSeconds: 0
      }
    ],
    ritualEffects: (witch, ritualSlate, alignments) => {
      if (alignments.properties["bw:amethyst_nugget"] == undefined) {
        return;
      }
      let location = JSON.parse(alignments.properties["bw:amethyst_nugget"]);
      
      let targets = ritualSlate.dimension.getEntities({location: ritualSlate.center(), maxDistance: 5});
          
      for (let target of targets) {
        if (target.typeId == "minecraft:player") {
          target.camera.fade({fadeColor: {red: 0.234, blue: 0.039, green: 0.470}, fadeTime: {fadeInTime: 0, fadeOutTime: 1, holdTime: 1}});
        }
        target.teleport({x: location.x, y: location.y + 1, z: location.z}, {dimension: ritualSlate.dimension});
      }
    }
  },
  {
    id: "Rite of Planar Banishment",
    itemArray: [
      "minecraft:ender_pearl",
      "minecraft:soul_sand", 
      "minecraft:dirt",
      "bw:earth_imbued_quartz",
      "bw:ender_imbued_quartz"
    ],
    cost: {
      "tags": ["occult", "conjuration"],
      "occultEnergy": 750,
      "fatigue": 20
    },
    validCircle: "Star of Nathe",
    ambience: "neutral",
    vfx: [
      {
        particle: "bwritual:esoteric_floating_symbols",
        particleOffset: {
          x: 0.5,
          y: 1,
          z: 0.5
        },
        delayAfterParticleInSeconds: 0
      },
      {
        particle: "bwritual:end_dispersal_particle",
        particleOffset: {
          x: 0.5,
          y: 1,
          z: 0.5
        },
        sound: "block.end_portal.spawn",
        soundValues: {
          pitch: 1,
          volume: 2.5
        },
        delayAfterParticleInSeconds: 10,
        playDuringDelay: {}
      },
      {
        particle: "bwritual:end_rite_burst",
        particleOffset: {
          x: 0.5,
          y: 1,
          z: 0.5
        },
        sound: "mob.endermen.death",
        soundValues: {
          pitch: 1,
          volume: 2.5
        },
        delayAfterParticleInSeconds: 0
      }
    ],
    ritualEffects: (witch, ritualSlate, alignments) => {
      let dimBoundLocation = ritualSlate.center();
      let dimList = [];
      DimensionTypes.getAll().forEach((d) => {
        if (d.type.id != ritualSlate.dimension.id) {
          dimList.push(d.type.id);
        }
      })
      
      let dimChosen = dimList[Math.floor(Math.random() * dimList.length)];
      
      let time = alignments.correspondences.time_of_day;
      
      if (time == "day") {
        dimChosen = "minecraft:nether";
      } else
      if (time == "night") {
        dimChosen = "minecraft:the_end";
      }
      
      let targets = ritualSlate.dimension.getEntities({location: dimBoundLocation, maxDistance: 4.5});
      
      for (let target of targets) {
        if (target.typeId == "minecraft:player") {
          target.camera.fade({fadeColor: {red: 0.234, blue: 0.039, green: 0.470}, fadeTime: {fadeInTime: 0, fadeOutTime: 1, holdTime: 1}});
        }
        
        target.teleport(Vector3.add({x: dimBoundLocation.x, y: dimBoundLocation.y + 1, z: dimBoundLocation.z}, Vector3.subtract(dimBoundLocation, target.location)), {dimension: world.getDimension(dimChosen)});
      }
    }
  },
  
  // Familiar Rites
  {
    id: "Bind the Familiar Spriggan",
    itemArray: [
      "minecraft:lead",
      "minecraft:birch_sapling",
      "bw:blood_vial",
      "bw:dandelion_dust",
      [{"id": "callingFood", "componentType": "minecraft:food"}]
    ],
    specialProperties: {
      "bw:blood_vial": "bw:blood"
    },
    cost: {
      "tags": ["occult", "spring", "conjuration"],
      "occultEnergy": 800,
      "fatigue": 900
    },
    traineeFriendly: true,
    ambience: "neutral",
    validCircle: "Star of Nathe",
    ritualEffects: (witch, ritualSlate, alignments) => {
      // - Creates an amorphous smoke blob
      // - This smoke blob will absolutely try to rebel against being leashed.
      // - You may try to outlast its confused outburst or quell it via throwing its tame items into the space it occupies (if any tame items exist for it).
      // - In this state, the "spirit" lobs Bolt spells at the witch's position. This continues until it runs out of Orbos. (This can get destructive!)
      // - When the spirit is being quelled by tame items, it stops to munch on them.
      // - Once the Spriggan sprite has been calmed, its smoke color will change into anything besides smoky black.
      // - At that point, you throw in a Familiar Trinket, which it will shrink into.
      // - The final aspect of the ritual is using this trinket on the right animal type (determined at the start of the ritual by the blood). The Spriggan "possesses" this creature (which must be named) and it is considered your familiar.
      if (alignments.properties["bw:blood_vial"] == undefined) {
        return;
      }
      let blood = JSON.parse(alignments.properties["bw:blood_vial"]);
      
      if (!hasFamiliar(witch)) {
        createSprigganSprite(witch.dimension, Vector3.add(ritualSlate.center(), new Vector3(0, 1, 0)), blood, witch.id);
      } else {
        witch.sendMessage(`§c[!]§r You are already bound to a Familiar sprite. You cannot have another until you sever the current connection.`);
      }
    }
  },
  {
    id: "Severing the Familiar Bond",
    itemArray: [
      "minecraft:shears",
      "bw:coal_dust",
      "bw:cornflower_dust",
      "minecraft:string"
    ],
    keptItems: [
      "minecraft:shears"
    ],
    cost: {
      "tags": ["occult", "winter", "abjuration"],
      "occultEnergy": 450,
      "fatigue": 500
    },
    traineeFriendly: true,
    ambience: "neutral",
    validCircle: "Star of Nathe",
    ritualEffects: (witch, ritualSlate, alignments) => {
      // - Snip sound;
      // - Familiar Bond is completely severed
      // ENSURE THAT THE PHYSICAL ASPECTS OF FAMILIARS ARE ERASED.
      
      if (hasFamiliar(witch)) {
        let familiar = getTrueFamiliars(witch);
        if (familiar.length > 0) {
          familiar = familiar[0];
          let identifier = `${familiar.identity}_${witch.id}`;
          
          world.setDynamicProperty(`bw:isFamiliar_${identifier}`, undefined);
          
          let structureName = `familiarBox:${identifier}`;
          if (world.structureManager.get(structureName) != undefined) {
            world.structureManager.delete(structureName);
          }
          
          witch.playSound("mob.sheep.shear");
          witch.sendMessage(`§d[!]§r There is a snip... and you are released from ${familiar.firstName}'s bond. You no longer have a Familiar.`);
        }
      } else {
        witch.sendMessage(`§c[!]§r You do not have a Familiar bond to sever.`);
      }
    }
  },
  {
    id: "Discerning the Familiar Location",
    itemArray: [
      "minecraft:compass",
      "bw:dandelion_dust",
      "bw:blue_orchid_dust",
      "minecraft:string"
    ],
    keptItems: [
      "minecraft:compass"
    ],
    cost: {
      "tags": ["occult", "spring", "conjuration"],
      "occultEnergy": 250,
      "fatigue": 250
    },
    traineeFriendly: true,
    ambience: "neutral",
    validCircle: "Star of Nathe",
    ritualEffects: (witch, ritualSlate, alignments) => {
      // - Tells the casting witch the last place where the world saw their Familiar;
      
      if (hasFamiliar(witch)) {
        let familiar = getTrueFamiliars(witch);
        if (familiar.length > 0) {
          familiar = familiar[0];
          
          witch.sendMessage(`§a[!]§r The compass points; but in this moment, you understand its language. It tells you softly: "§c${familiar.lastLocation.x}§r §a${familiar.lastLocation.y}§r §b${familiar.lastLocation.z}§r in the dimension, §d${familiar.lastDimension}§r."`);
          witch.playSound("random.levelup",{pitch: 2.8});
        }
      } else {
        witch.sendMessage(`§c[!]§r You do not have a Familiar to locate.`);
      }
    }
  },
  {
    id: "Recalling of the Familiar",
    itemArray: [
      [
        "minecraft:gold_block",
        "minecraft:raw_gold_block"
      ],
      "minecraft:bone",
      "minecraft:poppy",
      "bw:obsidian_dust",
      "minecraft:string"
    ],
    cost: {
      "tags": ["occult", "spring", "conjuration"],
      "occultEnergy": 250,
      "fatigue": 250
    },
    traineeFriendly: true,
    ambience: "neutral",
    validCircle: "Star of Nathe",
    ritualEffects: (witch, ritualSlate, alignments) => {
      // - Tells the casting witch the last place where the world saw their Familiar;
      
      if (hasFamiliar(witch)) {
        let familiar = getTrueFamiliars(witch);
        if (familiar.length > 0) {
          familiar = familiar[0];
          let identifier = `bw:isFamiliar_${familiar.identity}_${witch.id}`;
          
          // Resurrection
          if (familiar.isDead || familiar.dismissed) {
            let structureName = `familiarBox:${familiar.identity}_${witch.id}`;
          
            if (world.structureManager.get(structureName) != undefined) {
              world.structureManager.place(structureName, witch.dimension, ritualSlate.above(1).center(), {includeBlocks: false, includeEntities: true, waterlogged: true});
              
              witch.sendMessage(`§e[!]§r Powerful magicks have reconstructed your Familiar's vessel as it had been the last time it was Trinketed.`);
              witch.playSound("mob.evocation_illager.cast_spell",{pitch: 2.8});
              
              familiar.isDead = false;
              familiar.dismissed = false;
              if (familiar.dismissCode) {
                delete familiar.dismissCode;
              }
              familiar.dismissed = false;
              world.setDynamicProperty(identifier, JSON.stringify(familiar));
            } else {
              witch.sendMessage(`§c[!]§r The call has been sent forth... but nothing happens. Your Familiar seems beyond your conjuring. Unfortunately, you likely will need to bind a new one.`);
            }
          } else {
            witch.sendMessage(`§c[!]§r The world does not see your Familiar as dead. Perhaps you may be able to locate them otherwise.`);
          }
        }
      } else {
        witch.sendMessage(`§c[!]§r You do not have a Familiar to resurrect.`);
      }
    }
  },
  
  // Faerie Commune (+)
  {
    id: "Rite of Faerie Commune",
    itemArray: [
      "minecraft:honey_bottle", 
      "minecraft:bread", 
      "minecraft:apple",
      "bw:ender_imbued_quartz"
    ],
    cost: {
      "tags": ["binding", "occult", "conjuration"],
      "occultEnergy": 1000,
      "fatigue": 750
    },
    alignment: {
      timeOfDay: {
        "day": 1,
        "night": 2,
        "dawn": 3,
        "dusk": 3
      }
    },
    ambience: "neutral",
    validCircle: "Star of Nathe",
    vfx: [
      {
        delayAfterParticleInSeconds: 0.5
      },
      {
        particle: "bwritual:esoteric_floating_symbols",
        particleOffset: {
          x: 0.5,
          y: 0.5,
          z: 0.5
        },
        delayAfterParticleInSeconds: 0
      },
      {
        particle: "bwRitual:summonCircle",
        particleOffset: {
          x: 0.5,
          y: 0.5,
          z: 0.5
        },
        sound: "beacon.ambience",
        soundValues: {
          pitch: 1,
          volume: 2.5
        },
        delayAfterParticleInSeconds: 9,
        playDuringDelay: {}
      },
      {
        particle: "bwRitual:commune_finish",
        particleOffset: {
          x: 0.5,
          y: 1,
          z: 0.5
        },
        sound: "beacon.activate",
        soundValues: {
          pitch: 1,
          volume: 2.5
        },
        delayAfterParticleInSeconds: 0
      }
    ],
    ritualEffects: (witch, ritualSlate, alignments) => {
      witch.sendMessage("Nice try... No <3");
      if (true) {
        return;
      }
      
      if (witch.getDynamicProperty("bw:wagerRequest") != undefined || witch.getDynamicProperty("bw:faeryGame") != undefined) {
        witch.sendMessage(`§c[!!]§r You're already caught up in a Faerie Game! Either you've already accepted a Wager or a Faerie is awaiting an answer.`)
        return;
      }
      
      let faeFamily = getFaeFamily(witch);
      if (faeFamily.lessers == 0) {
        requestStartingGame(witch, lesserFae["genis"]);
        return;
      } else {
        if (alignments.boostValue == 1) {
          requestStartingGame(witch, lesserFae[randomize(solarFaeArray)]);
        }
        if (alignments.boostValue == 2) {
          requestStartingGame(witch, lesserFae[randomize(lunarFaeArray)]);
        }
        if (alignments.boostValue == 3) {
          requestStartingGame(witch, lesserFae[randomize(twilightFaeArray)]);
        }
      }
    }
  },
  {
    id: "Rite of Faerie Departure",
    itemArray: [
      "minecraft:honey_bottle", 
      "minecraft:iron_sword", 
      "bw:obsidian_dust",
      "bw:faerie_grimoire",
      "bw:ender_imbued_quartz"
    ],
    specialProperties: {
      "bw:faerie_grimoire": "bw:attunedFaerie"
    },
    keptItems: [
      "bw:faerie_grimoire"
    ],
    cost: {
      "tags": ["binding", "conjuration"],
      "occultEnergy": 800,
      "fatigue": 750
    },
    validCircle: "Star of Nathe",
    vfx: [
      {
        particle: "bwitch:clear_particle4",
        particleOffset: {
          x: 0.5,
          y: 1.0,
          z: 0.5
        },
        sound: "dig.chain",
        soundValues: {
          pitch: 1.8,
          volume: 1.2
        },
        delayAfterParticleInSeconds: 1
      }
    ],
    ambience: "neutral",
    ritualEffects: (witch, ritualSlate, alignments) => {
      let faeFound = alignments.properties["bw:faerie_grimoire"];
      if (faeFound != undefined) {
        let faery = findFaery(faeFound);
        if (hasFaery(witch, faery)) {
          removeFaery(witch, faery);
        }
      }
    }
  },
  
  // Transmutative
  {
    id: "Equinn's Heralding of Autumn",
    itemArray: [
      "minecraft:bone_meal",
      "bw:crushed_fern",
      "bw:earth_imbued_quartz",
      [{"id": "heraldRite", "componentType": "minecraft:compostable"}]
    ],
    cost: {
      "tags": ["transmutation", "autumn"],
      "occultEnergy": 500,
      "fatigue": 100
    },
    alignment: {
      weather: {
        "Clear": 1,
        "Rain": 2,
        "Thunder": 2
      }
    },
    validCircle: "Crest of Transmutation",
    traineeFriendly: true,
    ambience: "pure",
    vfx: [
      {
        delayAfterParticleInSeconds: 1
      },
      {
        particle: "bwRitual:plantCirculate_1",
        particleOffset: {
          x: 0.5,
          y: 0.5,
          z: 0.5
        },
        delayAfterParticleInSeconds: 0
      },
      {
        particle: "bwRitual:plantCirculate_2",
        particleOffset: {
          x: 0.5,
          y: 0.5,
          z: 0.5
        },
        sound: "block.chorusflower.grow",
        soundValues: {
          pitch: 1.24,
          volume: 1.2
        },
        delayAfterParticleInSeconds: 3
      },
      {
        particle: "bwRitual:plantWave",
        particleOffset: {
          x: 0.5,
          y: 0.5,
          z: 0.5
        },
        sound: "mob.evocation_illager.cast_spell",
        soundValues: {
          pitch: 1.24,
          volume: 1.2
        },
        delayAfterParticleInSeconds: 0
      }
    ],
    ritualEffects: (witch, ritualSlate, alignments) => {
      let validBlocks = [
        "minecraft:wheat",
        "minecraft:potatoes",
        "minecraft:carrots",
        "minecraft:beetroot",
        "minecraft:sweet_berry_bush",
        "minecraft:melon_stem",
        "minecraft:pumpkin_stem"
      ]
      
      let magnitude = Math.max(0, Math.floor((alignments.ambience.neutral + alignments.ambience.pure)/50));
      
      if (magnitude > 8) {
        magnitude = 8;
      }
      
      for (let growBlock of validBlocks) {
        ritualSlate.dimension.runCommand(`fill ${ritualSlate.location.x + 2 + magnitude} ${ritualSlate.location.y} ${ritualSlate.location.z + 2 + magnitude} ${ritualSlate.location.x - 2 - magnitude} ${ritualSlate.location.y + 2} ${ritualSlate.location.z - 2 - magnitude} ${growBlock} ["growth"= 7] replace ${growBlock} []`);
      }
    }
  },
  {
    id: "Exchanging of the Minerals",
    itemArray: [
      "bw:natural_ash", 
      "bw:earth_imbued_quartz", 
      "minecraft:copper_ingot"
    ],
    cost: {
      "tags": ["transmutation", "mineral"],
      "occultEnergy": 250,
      "fatigue": 150
    },
    validCircle: "Crest of Transmutation",
    traineeFriendly: true,
    ambience: "neutral",
    vfx: [
      {
        delayAfterParticleInSeconds: 1
      },
      {
        particle: "bwitch:clear_particle4",
        particleOffset: {
          x: 0.5,
          y: 0.5,
          z: 0.5
        },
        sound: "block.enchanting_table.use",
        soundValues: {
          pitch: 1.24,
          volume: 1.2
        },
        delayAfterParticleInSeconds: 0
      }
    ],
    ritualEffects: (witch, ritualSlate, alignments) => {
      let replaceBlock = [
        {
          "replace": "minecraft:smooth_stone",
          "block": "minecraft:coal_ore"
        },
        {
          "replace": "minecraft:coal_block",
          "block": "minecraft:lapis_ore"
        },
        
        {
          "replace": "minecraft:quartz_block",
          "block": "minecraft:copper_ore"
        },
        {
          "replace": "minecraft:raw_copper_block",
          "block": "minecraft:iron_ore"
        },
        {
          "replace": "minecraft:raw_iron_block",
          "block": "minecraft:gold_ore"
        },
        {
          "replace": "minecraft:raw_gold_block",
          "block": "minecraft:diamond_ore"
        },
        {
          "replace": "minecraft:redstone_block",
          "block": "minecraft:glowstone"
        },
        
        {
          "replace": "minecraft:emerald_block",
          "block": "minecraft:budding_amethyst"
        },
        
        {
          "replace": "minecraft:amethyst_block",
          "block": "minecraft:quartz_ore"
        },
        {
          "replace": "minecraft:bone_block",
          "block": "minecraft:calcite"
        }
      ]
      
      let magnitude = Math.max(0, Math.floor((alignments.ambience.neutral + alignments.ambience.pure)/50));
      
      if (magnitude > 8) {
        magnitude = 8;
      }
      
      for (let blockObj of replaceBlock) {
        ritualSlate.dimension.runCommand(`fill ${ritualSlate.location.x + 2 + magnitude} ${ritualSlate.location.y - 2} ${ritualSlate.location.z + 2 + magnitude} ${ritualSlate.location.x - 2 - magnitude} ${ritualSlate.location.y + 4} ${ritualSlate.location.z - 2 - magnitude} ${blockObj.block} [] replace ${blockObj.replace} []`);
      }
    }
  },
  
  // Enchantment & Binding (+);
  {
    id: "Enchanting of the Broom",
    itemArray: [
      "minecraft:stick", 
      "minecraft:wheat",
      "bw:natural_ash",
      "bw:sky_imbued_quartz"
    ],
    cost: {
      "tags": ["binding", "weather", "occult"],
      "occultEnergy": 400,
      "fatigue": 350
    },
    validCircle: "Mark of Hebaya",
    vfx: [
      {
        particle: "bwRitual:enchantment_spiral",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bwRitual:enchanted_burst",
        particleOffset: {
          x: 0.5,
          y: 1.5,
          z: 0.5
        },
        sound: "block.enchanting_table.use",
        soundValues: {
          pitch: 1.24,
          volume: 1.2
        },
        delayAfterParticleInSeconds: 0
      }
    ],
    ambience: "neutral",
    ritualEffects: (witch, ritualSlate, alignments) => {
      let item = new ItemStack("bw:normal_broom_item", 1);
      
      let range = {
        1: 10,
        3: 5,
        5: 2,
        "min": 1,
      }
      let dmg = 10;
      let magnitude = Math.max(0, Math.floor((alignments.ambience.neutral)/150));
      
      for (let [n, v] of Object.entries(range)) {
        if (n == "min" || magnitude <= n) {
          dmg = v;
          break;
        }
      }
      
      item.setDynamicProperty("bw:broomDmg", dmg);
      
      ritualSlate.dimension.spawnItem(item, ritualSlate.center());
    }
  },
  
  /*
  {
    id: "Safe Returns of the Adventurer",
    itemArray: [
      "minecraft:totem_of_undying", 
      "bw:blood_vial",
      "minecraft:ender_pearl", 
      "bw:ender_imbued_quartz"
    ],
    keptItems: [
      "minecraft:totem_of_undying"
    ],
    specialProperties: {
      "bw:blood_vial": "bw:blood"
    },
    cost: {
      "tags": ["binding", "esoteric", "conjuration"],
      "occultEnergy": 2500,
      "fatigue": 75
    },
    validCircle: "Mark of Hebaya",
    traineeFriendly: true,
    vfx: [
      {
        particle: "bwRitual:enchantment_spiral",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bwRitual:enchanted_burst",
        particleOffset: {
          x: 0.5,
          y: 1.5,
          z: 0.5
        },
        sound: "block.enchanting_table.use",
        soundValues: {
          pitch: 1.24,
          volume: 1.2
        },
        delayAfterParticleInSeconds: 0
      }
    ],
    ritualEffects: (witch, ritualSlate, alignments) => {
      if (alignments.properties["bw:blood_vial"] == undefined) {
        return;
      }
      let blood = JSON.parse(alignments.properties["bw:blood_vial"]);
      let target = ritualSlate.dimension.getEntities({type: blood.type, name: blood.name});
      
      for (let i of target) {
        if (i.id == blood.id) {
          target = i;
          break;
        } else {
          target.pop();
        }
      }
      if (target.length == 0) {
        target = undefined;
      }
      
      let binding = {
        type: "spawnPoint"
      };
      target.setDynamicProperty("bw:boundLocation", JSON.stringify(binding));
      
    }
  },
  {
    id: "Safe Returns of the Traveler",
    itemArray: [
      "minecraft:totem_of_undying", 
      "bw:blood_vial", 
      "minecraft:lead",
      "bw:amethyst_nugget",
      "bw:ender_imbued_quartz"
    ],
    keptItems: [
      "minecraft:totem_of_undying",
      "bw:amethyst_nugget"
    ],
    specialProperties: {
      "bw:blood_vial": "bw:blood",
      "bw:amethyst_nugget": "bw:savedLocation"
    },
    cost: {
      "tags": ["binding", "esoteric", "conjuration"],
      "occultEnergy": 2500,
      "fatigue": 75
    },
    validCircle: "Mark of Hebaya",
    traineeFriendly: true,
    vfx: [
      {
        particle: "bwRitual:enchantment_spiral",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bwRitual:enchanted_burst",
        particleOffset: {
          x: 0.5,
          y: 1.5,
          z: 0.5
        },
        sound: "block.enchanting_table.use",
        soundValues: {
          pitch: 1.24,
          volume: 1.2
        },
        delayAfterParticleInSeconds: 0
      }
    ],
    ritualEffects: (witch, ritualSlate, alignments) => {
      if (alignments.properties["bw:blood_vial"] == undefined) {
        return;
      }
      let blood = JSON.parse(alignments.properties["bw:blood_vial"]);
      
      if (alignments.properties["bw:amethyst_nugget"] == undefined) {
        witch.sendMessage("§c[!]§r No coordinates were given.")
        return;
      }
      let location = JSON.parse(alignments.properties["bw:amethyst_nugget"]);
      
      let target = ritualSlate.dimension.getEntities({type: blood.type, name: blood.name});
      
      for (let i of target) {
        if (i.id == blood.id) {
          target = i;
          break;
        } else {
          target.pop();
        }
      }
      if (target.length == 0) {
        target = undefined;
      }
      
      let binding = {
        type: "enderBound",
        loc: location,
        dimension: witch.dimension.id
      };
      target.setDynamicProperty("bw:boundLocation", JSON.stringify(binding));
      
      if (effect.bindType == "erase") {
        target.setDynamicProperty("bw:boundLocation", undefined);
        witch.sendMessage(`§c[!]§r You have banished any magical influence on this player/creature's resurrection.`);
      }
    }
  },
  {
    id: "Release of the Bound Totem",
    itemArray: [
      "minecraft:totem_of_undying",
      "bw:blood_vial",
      "minecraft:milk_bucket", 
      "bw:lunar_imbued_quartz"
    ],
    keptItems: [
      "minecraft:totem_of_undying"
    ],
    specialProperties: {
      "bw:blood_vial": "bw:blood"
    },
    cost: {
      "tags": ["abjuration", "esoteric"],
      "occultEnergy": 2500,
      "fatigue": 75
    },
    validCircle: "Mark of Hebaya",
    traineeFriendly: true,
    vfx: [
      {
        particle: "bwRitual:enchantment_spiral",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bwRitual:enchanted_burst",
        particleOffset: {
          x: 0.5,
          y: 1.5,
          z: 0.5
        },
        sound: "block.enchanting_table.use",
        soundValues: {
          pitch: 1.24,
          volume: 1.2
        },
        delayAfterParticleInSeconds: 0
      }
    ],
    ritualEffects: (witch, ritualSlate, alignments) => {
      if (alignments.properties["bw:blood_vial"] == undefined) {
        return;
      }
      let blood = JSON.parse(alignments.properties["bw:blood_vial"]);
      
      let target = ritualSlate.dimension.getEntities({type: blood.type, name: blood.name});
      
      for (let i of target) {
        if (i.id == blood.id) {
          target = i;
          break;
        } else {
          target.pop();
        }
      }
      if (target.length == 0) {
        target = undefined;
      }
      
      target.setDynamicProperty("bw:boundLocation", undefined);
      witch.sendMessage(`§c[!]§r You have banished any magical influence on this player/creature's resurrection.`);
    }
  },
  */
  
  // Rite of Quintessence
  {
    id: "Rite of Quintessence",
    itemArray: [
      "minecraft:string",
      "bw:raw_orbos",
      "bw:amethyst_nugget"
    ],
    specialProperties: {
      "bw:amethyst_nugget": "bw:savedLocation"
    },
    keptItems: [
      "bw:amethyst_nugget"
    ],
    cost: {
      "tags": ["binding", "occult"],
      "occultEnergy": 20,
      "fatigue": 50
    },
    validCircle: "Mark of Hebaya",
    vfx: [
      {
        particle: "bwRitual:enchantment_spiral",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bwRitual:enchanted_burst",
        particleOffset: {
          x: 0.5,
          y: 1.5,
          z: 0.5
        },
        sound: "block.enchanting_table.use",
        soundValues: {
          pitch: 1.24,
          volume: 1.2
        },
        delayAfterParticleInSeconds: 0
      }
    ],
    ambience: "neutral",
    traineeFriendly: true,
    ritualEffects: (witch, ritualSlate, alignments) => {
      if (alignments.properties["bw:amethyst_nugget"] == undefined) {
        return;
      }
      let location = JSON.parse(alignments.properties["bw:amethyst_nugget"]);
      
      if (!ritualSlate.dimension.isChunkLoaded(location)) {
        return witch.sendMessage(`§c[!]§r The position that the nugget points to is unloaded.`);
      }
      
      let chest = ritualSlate.dimension.getBlock(location);
      
      if (!chest.getComponent("minecraft:inventory")) {
        return witch.sendMessage(`§c[!]§r The position that the nugget points to should have an inventory with the Essences and/or Pure Quintessences that are being combined.`);
      }
      
      
      combineEssences(chest, chest.getComponent("minecraft:inventory").container);
    }
  },
  
  // Coven Binding
  {
    id: "Creation of the Coven",
    itemArray: [
      "minecraft:copper_chain", 
      "bw:natural_ash", 
      "bw:earth_imbued_quartz"
    ],
    specialProperties: {
      "minecraft:copper_chain": "bw:undefined"
    },
    cost: {
      "tags": ["binding", "occult"],
      "occultEnergy": 300,
      "fatigue": 600
    },
    validCircle: "Mark of Hebaya",
    vfx: [
      {
        particle: "bwRitual:enchantment_spiral",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bwRitual:enchanted_burst",
        particleOffset: {
          x: 0.5,
          y: 1.5,
          z: 0.5
        },
        delayAfterParticleInSeconds: 0
      }
    ],
    ambience: "neutral",
    traineeFriendly: true,
    ritualEffects: (witch, ritualSlate, alignments) => {
      if (alignments.names["minecraft:copper_chain"] == undefined || alignments.names["minecraft:copper_chain"] == "") {
        witch.sendMessage("§c[!]§r The chain offered should be named. This will become what the coven is known as.");
        return;
      }
      
      let covenName = alignments.names["minecraft:copper_chain"];
      let covenId = `covenID:${covenName}`;
      if (world.getDynamicProperty(covenId) == undefined) {
        world.setDynamicProperty(covenId, JSON.stringify({
          "creator": witch.id,
          "members": 1
        }));
        witch.setDynamicProperty("bw:coven", covenName);
        witch.sendMessage(`§a[!]§r You have founded the coven, ${covenName}§r.`);
        witch.sendMessage(`§a[!]§r You are the High Witch of ${covenName}§r.`);
      } else {
        witch.sendMessage("§c[!]§r A coven of a similar name is already present within the world.");
      }
    }
  },
  {
    id: "Initiation of the Coven Witch",
    itemArray: [
      "bw:blood_vial", 
      "minecraft:copper_chain",
      "bw:earth_imbued_quartz",
      "bw:lunar_imbued_quartz"
    ],
    specialProperties: {
      "bw:blood_vial": "bw:blood"
    },
    cost: {
      "tags": ["binding", "occult"],
      "occultEnergy": 100,
      "fatigue": 300
    },
    validCircle: "Mark of Hebaya",
    vfx: [
      {
        particle: "bwRitual:enchantment_spiral",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bwRitual:enchanted_burst",
        particleOffset: {
          x: 0.5,
          y: 1.5,
          z: 0.5
        },
        delayAfterParticleInSeconds: 0
      }
    ],
    ambience: "neutral",
    traineeFriendly: true,
    ritualEffects: (witch, ritualSlate, alignments) => {
      if (alignments.properties["bw:blood_vial"] == undefined) {
        return;
      }
      let blood = JSON.parse(alignments.properties["bw:blood_vial"]);
      
      let covenName = witch.getDynamicProperty("bw:coven");
      let coven = covenName;
      
      if (coven != undefined) {
        let covId = `covenID:${covenName}`
        if (world.getDynamicProperty(covId)) {
          coven = JSON.parse(world.getDynamicProperty(covId));
        }
        
        if (coven.creator != witch.id) {
          witch.sendMessage(`§c[!]§r Only the coven's High Witch (creator) can initiate new members.`);
          return;
        }
        
        if (coven.members > 12) {
          witch.sendMessage(`§c[!]§r This coven already has its 13 chosen members. It will not allow more.`);
          return;
        }
        
        // Prospective Witch must be in the radius of the ritual.
        let target = world.getEntity(blood.id);
        if (target != undefined) {
          let diff = Vector3.subtract(ritualSlate.center(), target.location);
          let distance = Vector3.magnitude(diff);
          
          let families = target.getComponent("minecraft:type_family");
          
          if (families == undefined || !(families.hasTypeFamily("witch") || families.hasTypeFamily("player") || families.hasTypeFamily("illager") || families.hasTypeFamily("villager"))) {
            witch.sendMessage(`§c[!]§r The target of this ritual must either be a Witch, a Villager, an Illager or another Player.`);
            return;
          }
          
          if (ritualSlate.dimension.id != target.dimension.id) {
            witch.sendMessage(`§c[!]§r The target of this ritual is not in the same dimension.`);
            return;
          }
          
          if (distance > 7.5) {
            witch.sendMessage(`§c[!]§r The target of this ritual must be within 7 blocks of the central slate.`);
            return;
          }
          
          let targetName = target.nameTag;
          if (target.name != undefined) {
            targetName = target.name;
          }
          if (targetName == undefined) {
            targetName = "The target";
          }
          witch.sendMessage(`§a[!]§r ${targetName} has been initiated into your coven, ${covenName}.`);
          if (target instanceof Player) {
            target.sendMessage(`§a[!]§r You have been initiated into the coven, ${covenName}.`);
          }
          target.setDynamicProperty("bw:coven", covenName);
          coven.members = coven.members + 1;
          
          world.setDynamicProperty(covId, JSON.stringify(coven));
        }
      } else {
        witch.sendMessage(`§c[!]§r You are not in a coven to initiate anyone into.`);
      }
    }
  },
  {
    id: "Exile of the Coven Witch",
    itemArray: [
      "bw:blood_vial", 
      "minecraft:copper_chain",
      "bw:earth_imbued_quartz", 
      "bw:solar_imbued_quartz"
    ],
    specialProperties: {
      "bw:blood_vial": "bw:blood"
    },
    cost: {
      "tags": ["conjuration", "occult"],
      "occultEnergy": 100,
      "fatigue": 300
    },
    validCircle: "Mark of Hebaya",
    vfx: [
      {
        particle: "bwRitual:enchantment_spiral",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bwRitual:enchanted_burst",
        particleOffset: {
          x: 0.5,
          y: 1.5,
          z: 0.5
        },
        delayAfterParticleInSeconds: 0
      }
    ],
    ambience: "neutral",
    traineeFriendly: true,
    ritualEffects: (witch, ritualSlate, alignments) => {
      if (alignments.properties["bw:blood_vial"] == undefined) {
        return;
      }
      let blood = JSON.parse(alignments.properties["bw:blood_vial"]);
      
      let covenName = witch.getDynamicProperty("bw:coven");
      let coven = covenName;
      
      if (coven != undefined) {
        let covId = `covenID:${covenName}`;
        if (world.getDynamicProperty(covId)) {
          coven = JSON.parse(world.getDynamicProperty(covId));
        }
        
        if (coven.creator != witch.id) {
          witch.sendMessage(`§c[!]§r Only the coven's High Witch (creator) can exile members.`);
          return;
        }
        
        // Prospective Witch must be in the radius of the ritual.
        let target = world.getEntity(blood.id);
        if (target != undefined) {
          target.sendMessage(`§c[!]§r You have been exiled from the coven, ${covenName}.`);
          
          if (target.id == coven.creator) {
            target.sendMessage(`As you are the High Witch, the coven silently collapses into nothing.`);
            
            target.setDynamicProperty("bw:coven", undefined);
            world.setDynamicProperty(covId, undefined)
            return;
          } else {
            coven.members = coven.members - 1;
          }
          
          target.setDynamicProperty("bw:coven", undefined);
          
          world.setDynamicProperty(covId, JSON.stringify(coven));
        }
      } else {
        witch.sendMessage(`§c[!]§r You are not in a coven to even exile anyone from.`);
      }
    }
  },
  {
    id: "Passing of the Coven",
    itemArray: [
      "bw:blood_vial", 
      "minecraft:copper_chain",
      "bw:sky_imbued_quartz", 
      "bw:earth_imbued_quartz"
    ],
    specialProperties: {
      "bw:blood_vial": "bw:blood"
    },
    cost: {
      "occultEnergy": 300,
      "tags": ["binding", "occult"],
      "fatigue": 350
    },
    validCircle: "Mark of Hebaya",
    vfx: [
      {
        particle: "bwRitual:enchantment_spiral",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bwRitual:enchanted_burst",
        particleOffset: {
          x: 0.5,
          y: 1.5,
          z: 0.5
        },
        delayAfterParticleInSeconds: 0
      }
    ],
    ambience: "neutral",
    traineeFriendly: true,
    ritualEffects: (witch, ritualSlate, alignments) => {
      if (alignments.properties["bw:blood_vial"] == undefined) {
        return;
      }
      let blood = JSON.parse(alignments.properties["bw:blood_vial"]);
      
      let covenName = witch.getDynamicProperty("bw:coven");
      let coven = covenName;
      
      if (coven != undefined) {
        let covId = `covenID:${covenName}`;
        if (world.getDynamicProperty(covId)) {
          coven = JSON.parse(world.getDynamicProperty(covId));
        }
        
        if (coven.creator != witch.id) {
          witch.sendMessage(`§c[!]§r Only the coven's High Witch (creator) can transfer ownership.`);
          return;
        }
        
        // Prospective Witch must be in the radius of the ritual.
        let target = world.getEntity(blood.id);
        if (target != undefined) {
          if (target instanceof Player) {
            coven.creator = target.id;
            target.sendMessage(`§a[!]§r You have been appointed High Witch of the coven, ${covenName}.`);
          } else {
            witch.sendMessage("§c[!]§r Only players can be the High Witch of a coven.");
            return;
          }
          
          world.setDynamicProperty(covId, JSON.stringify(coven));
        }
      } else {
        witch.sendMessage(`§6[§c!§6]§r You know d*mn well you don't even belong to a coven.`);
      }
    }
  },
  
  // Misc Rites
  {
    id: "Bestow the Sacred Name",
    itemArray: [
      "minecraft:paper", 
      "bw:blood_vial"
    ],
    specialProperties: {
      "minecraft:paper": "",
      "bw:blood_vial": "bw:blood",
    },
    cost: {
      "tags": ["binding", "occult"],
      "occultEnergy": 50,
      "fatigue": 50
    },
    validCircle: "Mark of Hebaya",
    traineeFriendly: true,
    ambience: "neutral",
    vfx: [
      {
        particle: "bwRitual:enchantment_spiral",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bwRitual:enchanted_burst",
        particleOffset: {
          x: 0.5,
          y: 1.5,
          z: 0.5
        },
        delayAfterParticleInSeconds: 0
      }
    ],
    ritualEffects: (witch, ritualSlate, alignments) => {
      if (alignments.properties["bw:blood_vial"] == undefined) {
        return;
      }
      let blood = JSON.parse(alignments.properties["bw:blood_vial"]);
      let target = world.getEntity(blood.id);
      
      if (target != undefined) {
        target.nameTag = alignments.names["minecraft:paper"];
      }
    }
  },
  
  // Hexing
  // Mystic Hexes
  {
    id: "Hexing Rite of Sinking",
    itemArray: [
      "minecraft:nautilus_shell",
      "minecraft:prismarine_crystals",
      "minecraft:seagrass",
      "bw:blood_vial"
    ],
    specialProperties: {
      "bw:blood_vial": "bw:blood",
    },
    cost: {
      "tags": ["malefic", "water"],
      "occultEnergy": 1000,
      "fatigue": 400
    },
    validCircle: "Circle of Duality",
    vfx: [
      {
        particle: "bw:malice_rite_stage_one",
        particleOffset: {
          x: 0.5,
          y: 0.35,
          z: 0.5
        },
        sound: "mob.warden.sniff",
        soundValues: {
          pitch: 1.24,
          volume: 1.2
        },
        playDuringDelay: {},
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bw:malice_rite_stage_two",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        sound: "mob.ravager.ambient",
        soundValues: {
          pitch: 0.46,
          volume: 1.2
        },
        playDuringDelay: {},
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bw:malice_rite_stage_three",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        sound: "mob.warden.roar",
        soundValues: {
          pitch: 3,
          volume: 1.2
        },
        delayAfterParticleInSeconds: 0
      }
    ],
    ambience: "tainted",
    ritualEffects: (witch, ritualSlate, alignments) => {
      if (alignments.properties["bw:blood_vial"] == undefined) {
        return;
      }
      let blood = JSON.parse(alignments.properties["bw:blood_vial"]);
      let target = world.getEntity(blood.id);
      
      let magnitude = Math.max(0, Math.floor((alignments.ambience.neutral + alignments.ambience.taint)/1000));
      
      if (target != undefined) {
        if (target.dimension.id == ritualSlate.dimension.id) {
          ritualHexTarget(target, "ocean_hold", witch, magnitude);
        }
      }
    }
  },
  {
    id: "Hexing Rite of Ignition",
    itemArray: [
      "minecraft:blaze_powder",
      "minecraft:fire_charge",
      "minecraft:gunpowder",
      "bw:blood_vial"
    ],
    specialProperties: {
      "bw:blood_vial": "bw:blood",
    },
    cost: {
      "tags": ["malefic", "fire"],
      "occultEnergy": 1000,
      "fatigue": 400
    },
    validCircle: "Circle of Duality",
    vfx: [
      {
        particle: "bw:malice_rite_stage_one",
        particleOffset: {
          x: 0.5,
          y: 0.35,
          z: 0.5
        },
        sound: "mob.warden.sniff",
        soundValues: {
          pitch: 1.24,
          volume: 1.2
        },
        playDuringDelay: {},
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bw:malice_rite_stage_two",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        sound: "mob.ravager.ambient",
        soundValues: {
          pitch: 0.46,
          volume: 1.2
        },
        playDuringDelay: {},
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bw:malice_rite_stage_three",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        sound: "mob.warden.roar",
        soundValues: {
          pitch: 3,
          volume: 1.2
        },
        delayAfterParticleInSeconds: 0
      }
    ],
    ambience: "tainted",
    ritualEffects: (witch, ritualSlate, alignments) => {
      if (alignments.properties["bw:blood_vial"] == undefined) {
        return;
      }
      let blood = JSON.parse(alignments.properties["bw:blood_vial"]);
      let target = world.getEntity(blood.id);
      
      let magnitude = Math.max(0, Math.floor((alignments.ambience.neutral + alignments.ambience.taint)/1000));
      
      if (target != undefined) {
        if (target.dimension.id == ritualSlate.dimension.id) {
          ritualHexTarget(target, "hellish_attraction", witch, magnitude);
        }
      }
    }
  },
  {
    id: "Hexing Rite of the Copper Soul",
    itemArray: [
      "minecraft:copper_ingot",
      "minecraft:gray_wool",
      "bw:sky_imbued_quartz", 
      "bw:blood_vial"
    ],
    specialProperties: {
      "bw:blood_vial": "bw:blood",
    },
    cost: {
      "tags": ["malefic", "weather"],
      "occultEnergy": 1000,
      "fatigue": 400
    },
    validCircle: "Circle of Duality",
    vfx: [
      {
        particle: "bw:malice_rite_stage_one",
        particleOffset: {
          x: 0.5,
          y: 0.35,
          z: 0.5
        },
        sound: "mob.warden.sniff",
        soundValues: {
          pitch: 1.24,
          volume: 1.2
        },
        playDuringDelay: {},
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bw:malice_rite_stage_two",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        sound: "mob.ravager.ambient",
        soundValues: {
          pitch: 0.46,
          volume: 1.2
        },
        playDuringDelay: {},
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bw:malice_rite_stage_three",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        sound: "mob.warden.roar",
        soundValues: {
          pitch: 3,
          volume: 1.2
        },
        delayAfterParticleInSeconds: 0
      }
    ],
    ambience: "tainted",
    ritualEffects: (witch, ritualSlate, alignments) => {
      if (alignments.properties["bw:blood_vial"] == undefined) {
        return;
      }
      let blood = JSON.parse(alignments.properties["bw:blood_vial"]);
      let target = world.getEntity(blood.id);
      
      let magnitude = Math.max(0, Math.floor((alignments.ambience.neutral + alignments.ambience.taint)/1000));
      
      if (target != undefined) {
        if (target.dimension.id == ritualSlate.dimension.id) {
          ritualHexTarget(target, "copper_soul", witch, magnitude);
        }
      }
    }
  },
  {
    id: "Hexing Rite of the Enderman",
    itemArray: [
      "minecraft:warped_fungus",
      "minecraft:chorus_fruit",
      "minecraft:ender_pearl",
      "bw:blood_vial"
    ],
    specialProperties: {
      "bw:blood_vial": "bw:blood",
    },
    cost: {
      "tags": ["malefic", "occult"],
      "occultEnergy": 1000,
      "fatigue": 400
    },
    validCircle: "Circle of Duality",
    vfx: [
      {
        particle: "bw:malice_rite_stage_one",
        particleOffset: {
          x: 0.5,
          y: 0.35,
          z: 0.5
        },
        sound: "mob.warden.sniff",
        soundValues: {
          pitch: 1.24,
          volume: 1.2
        },
        playDuringDelay: {},
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bw:malice_rite_stage_two",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        sound: "mob.ravager.ambient",
        soundValues: {
          pitch: 0.46,
          volume: 1.2
        },
        playDuringDelay: {},
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bw:malice_rite_stage_three",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        sound: "mob.warden.roar",
        soundValues: {
          pitch: 3,
          volume: 1.2
        },
        delayAfterParticleInSeconds: 0
      }
    ],
    ambience: "tainted",
    ritualEffects: (witch, ritualSlate, alignments) => {
      if (alignments.properties["bw:blood_vial"] == undefined) {
        return;
      }
      let blood = JSON.parse(alignments.properties["bw:blood_vial"]);
      let target = world.getEntity(blood.id);
      
      let magnitude = Math.max(0, Math.floor((alignments.ambience.neutral + alignments.ambience.taint)/1000));
      
      if (target != undefined) {
        if (target.dimension.id == ritualSlate.dimension.id) {
          ritualHexTarget(target, "enderman_hex", witch, magnitude);
        }
      }
    }
  },
  {
    id: "Hexing Rite of the Creeper",
    itemArray: [
      "minecraft:gunpowder",
      "minecraft:sand", 
      "minecraft:gravel",
      "bw:blood_vial"
    ],
    specialProperties: {
      "bw:blood_vial": "bw:blood",
    },
    cost: {
      "tags": ["malice", "esoteric"],
      "occultEnergy": 1000,
      "fatigue": 400
    },
    validCircle: "Circle of Duality",
    vfx: [
      {
        particle: "bw:malice_rite_stage_one",
        particleOffset: {
          x: 0.5,
          y: 0.35,
          z: 0.5
        },
        sound: "mob.warden.sniff",
        soundValues: {
          pitch: 1.24,
          volume: 1.2
        },
        playDuringDelay: {},
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bw:malice_rite_stage_two",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        sound: "mob.ravager.ambient",
        soundValues: {
          pitch: 0.46,
          volume: 1.2
        },
        playDuringDelay: {},
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bw:malice_rite_stage_three",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        sound: "mob.warden.roar",
        soundValues: {
          pitch: 3,
          volume: 1.2
        },
        delayAfterParticleInSeconds: 0
      }
    ],
    ambience: "tainted",
    ritualEffects: (witch, ritualSlate, alignments) => {
      if (alignments.properties["bw:blood_vial"] == undefined) {
        return;
      }
      let blood = JSON.parse(alignments.properties["bw:blood_vial"]);
      let target = world.getEntity(blood.id);
      
      let magnitude = Math.max(0, Math.floor((alignments.ambience.neutral + alignments.ambience.taint)/1000));
      
      if (target != undefined) {
        if (target.dimension.id == ritualSlate.dimension.id) {
          ritualHexTarget(target, "creeper_hex", witch, magnitude);
        }
      }
    }
  },
  {
    id: "Hexing Rite of Impending Death",
    itemArray: [
      "minecraft:clock",
      "minecraft:ghast_tear",
      "minecraft:soul_sand",
      "bw:solar_imbued_quartz",
      "bw:lunar_imbued_quartz",
      "bw:blood_vial"
    ],
    keptItems: [
      "minecraft:clock"
    ],
    specialProperties: {
      "bw:blood_vial": "bw:blood",
    },
    cost: {
      "tags": ["malefic", "occult", "winter"],
      "occultEnergy": 1200,
      "fatigue": 900
    },
    validCircle: "Circle of Duality",
    vfx: [
      {
        particle: "bw:malice_rite_stage_one",
        particleOffset: {
          x: 0.5,
          y: 0.35,
          z: 0.5
        },
        sound: "mob.warden.sniff",
        soundValues: {
          pitch: 1.24,
          volume: 1.2
        },
        playDuringDelay: {},
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bw:malice_rite_stage_two",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        sound: "mob.ravager.ambient",
        soundValues: {
          pitch: 0.46,
          volume: 1.2
        },
        playDuringDelay: {},
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bw:malice_rite_stage_three",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        sound: "mob.warden.roar",
        soundValues: {
          pitch: 3,
          volume: 1.2
        },
        delayAfterParticleInSeconds: 0
      }
    ],
    ambience: "tainted",
    ritualEffects: (witch, ritualSlate, alignments) => {
      if (alignments.properties["bw:blood_vial"] == undefined) {
        return;
      }
      let blood = JSON.parse(alignments.properties["bw:blood_vial"]);
      let target = world.getEntity(blood.id);
      
      let magnitude = Math.max(0, Math.floor((alignments.ambience.neutral + alignments.ambience.taint)/1000));
      
      if (target != undefined) {
        if (target.dimension.id == ritualSlate.dimension.id) {
          ritualHexTarget(target, "death", witch, magnitude);
        }
      }
    }
  },
  {
    id: "Hexing Rite of Entombment",
    itemArray: [
      "minecraft:ender_pearl",
      "minecraft:soul_sand",
      "minecraft:gravel",
      "bw:ender_imbued_quartz",
      "bw:earth_imbued_quartz",
      "bw:blood_vial"
    ],
    specialProperties: {
      "bw:blood_vial": "bw:blood",
    },
    cost: {
      "tags": ["malefic", "occult", "mineral"],
      "occultEnergy": 1000,
      "fatigue": 850
    },
    validCircle: "Circle of Duality",
    vfx: [
      {
        particle: "bw:malice_rite_stage_one",
        particleOffset: {
          x: 0.5,
          y: 0.35,
          z: 0.5
        },
        sound: "mob.warden.sniff",
        soundValues: {
          pitch: 1.24,
          volume: 1.2
        },
        playDuringDelay: {},
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bw:malice_rite_stage_two",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        sound: "mob.ravager.ambient",
        soundValues: {
          pitch: 0.46,
          volume: 1.2
        },
        playDuringDelay: {},
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bw:malice_rite_stage_three",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        sound: "mob.warden.roar",
        soundValues: {
          pitch: 3,
          volume: 1.2
        },
        delayAfterParticleInSeconds: 0
      }
    ],
    ambience: "tainted",
    ritualEffects: (witch, ritualSlate, alignments) => {
      if (alignments.properties["bw:blood_vial"] == undefined) {
        return;
      }
      let blood = JSON.parse(alignments.properties["bw:blood_vial"]);
      let target = world.getEntity(blood.id);
      
      let magnitude = Math.max(0, Math.floor((alignments.ambience.neutral + alignments.ambience.taint)/1000));
      
      if (target != undefined) {
        if (target.dimension.id == ritualSlate.dimension.id) {
          ritualHexTarget(target, "entombment", witch, magnitude);
        }
      }
    }
  },
  
  // Mundane Hexes
  {
    id: "Hexing Rite of Brittle Bones",
    itemArray: [
      "minecraft:brick",
      "minecraft:bone", 
      "bw:blood_vial"
    ],
    specialProperties: {
      "bw:blood_vial": "bw:blood",
    },
    cost: {
      "tags": ["malefic", "mineral"],
      "occultEnergy": 1000,
      "fatigue": 250
    },
    validCircle: "Circle of Duality",
    vfx: [
      {
        particle: "bw:malice_rite_stage_one",
        particleOffset: {
          x: 0.5,
          y: 0.35,
          z: 0.5
        },
        sound: "mob.warden.sniff",
        soundValues: {
          pitch: 1.24,
          volume: 1.2
        },
        playDuringDelay: {},
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bw:malice_rite_stage_two",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        sound: "mob.ravager.ambient",
        soundValues: {
          pitch: 0.46,
          volume: 1.2
        },
        playDuringDelay: {},
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bw:malice_rite_stage_three",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        sound: "mob.warden.roar",
        soundValues: {
          pitch: 3,
          volume: 1.2
        },
        delayAfterParticleInSeconds: 0
      }
    ],
    ambience: "tainted",
    traineeFriendly: true,
    ritualEffects: (witch, ritualSlate, alignments) => {
      if (alignments.properties["bw:blood_vial"] == undefined) {
        return;
      }
      let blood = JSON.parse(alignments.properties["bw:blood_vial"]);
      let target = world.getEntity(blood.id);
      
      let magnitude = Math.max(0, Math.floor((alignments.ambience.neutral + alignments.ambience.taint)/1000));
      
      if (target != undefined) {
        if (target.dimension.id == ritualSlate.dimension.id) {
          ritualHexTarget(target, "brittle_bones", witch, magnitude);
        }
      }
    }
  },
  {
    id: "Hexing Rite of Obliquity",
    itemArray: [
      "bw:crushed_fern",
      "bw:obsidian_dust",
      "bw:natural_ash",
      "bw:lunar_imbued_quartz",
      "bw:sky_imbued_quartz",
      "bw:blood_vial"
    ],
    specialProperties: {
      "bw:blood_vial": "bw:blood",
    },
    cost: {
      "tags": ["malefic", "occult"],
      "occultEnergy": 1000,
      "fatigue": 600
    },
    validCircle: "Circle of Duality",
    vfx: [
      {
        particle: "bw:malice_rite_stage_one",
        particleOffset: {
          x: 0.5,
          y: 0.35,
          z: 0.5
        },
        sound: "mob.warden.sniff",
        soundValues: {
          pitch: 1.24,
          volume: 1.2
        },
        playDuringDelay: {},
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bw:malice_rite_stage_two",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        sound: "mob.ravager.ambient",
        soundValues: {
          pitch: 0.46,
          volume: 1.2
        },
        playDuringDelay: {},
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bw:malice_rite_stage_three",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        sound: "mob.warden.roar",
        soundValues: {
          pitch: 3,
          volume: 1.2
        },
        delayAfterParticleInSeconds: 0
      }
    ],
    ambience: "tainted",
    traineeFriendly: true,
    ritualEffects: (witch, ritualSlate, alignments) => {
      if (alignments.properties["bw:blood_vial"] == undefined) {
        return;
      }
      let blood = JSON.parse(alignments.properties["bw:blood_vial"]);
      let target = world.getEntity(blood.id);
      
      let magnitude = Math.max(0, Math.floor((alignments.ambience.neutral + alignments.ambience.taint)/1000));
      
      if (target != undefined) {
        if (target.dimension.id == ritualSlate.dimension.id) {
          ritualHexTarget(target, "obliquity", witch, magnitude);
        }
      }
    }
  },
  {
    id: "Hexing Rite of Sympathy",
    itemArray: [
      "minecraft:glass_pane",
      "minecraft:iron_sword",
      "minecraft:sweet_berries",
      "bw:ender_imbued_quartz",
      "bw:poppy_dust",
      "bw:blood_vial"
    ],
    specialProperties: {
      "bw:blood_vial": "bw:blood",
    },
    cost: {
      "tags": ["malefic", "occult"],
      "occultEnergy": 1000,
      "fatigue": 700
    },
    validCircle: "Circle of Duality",
    vfx: [
      {
        particle: "bw:malice_rite_stage_one",
        particleOffset: {
          x: 0.5,
          y: 0.35,
          z: 0.5
        },
        sound: "mob.warden.sniff",
        soundValues: {
          pitch: 1.24,
          volume: 1.2
        },
        playDuringDelay: {},
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bw:malice_rite_stage_two",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        sound: "mob.ravager.ambient",
        soundValues: {
          pitch: 0.46,
          volume: 1.2
        },
        playDuringDelay: {},
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bw:malice_rite_stage_three",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        sound: "mob.warden.roar",
        soundValues: {
          pitch: 3,
          volume: 1.2
        },
        delayAfterParticleInSeconds: 0
      }
    ],
    ambience: "tainted",
    traineeFriendly: true,
    ritualEffects: (witch, ritualSlate, alignments) => {
      if (alignments.properties["bw:blood_vial"] == undefined) {
        return;
      }
      let blood = JSON.parse(alignments.properties["bw:blood_vial"]);
      let target = world.getEntity(blood.id);
      
      let magnitude = Math.max(0, Math.floor((alignments.ambience.neutral + alignments.ambience.taint)/1000));
      
      if (target != undefined) {
        if (target.dimension.id == ritualSlate.dimension.id) {
          ritualHexTarget(target, "sympathy", witch, magnitude);
        }
      }
    }
  },
  {
    id: "Hexing Rite of Leadweight",
    itemArray: [
      "minecraft:iron_chestplate",
      "minecraft:brick",
      "bw:obsidian_dust",
      "bw:coal_dust",
      "bw:earth_imbued_quartz",
      "bw:blood_vial"
    ],
    specialProperties: {
      "bw:blood_vial": "bw:blood",
    },
    cost: {
      "tags": ["malefic", "mineral"],
      "occultEnergy": 1000,
      "fatigue": 450
    },
    validCircle: "Circle of Duality",
    vfx: [
      {
        particle: "bw:malice_rite_stage_one",
        particleOffset: {
          x: 0.5,
          y: 0.35,
          z: 0.5
        },
        sound: "mob.warden.sniff",
        soundValues: {
          pitch: 1.24,
          volume: 1.2
        },
        playDuringDelay: {},
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bw:malice_rite_stage_two",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        sound: "mob.ravager.ambient",
        soundValues: {
          pitch: 0.46,
          volume: 1.2
        },
        playDuringDelay: {},
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bw:malice_rite_stage_three",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        sound: "mob.warden.roar",
        soundValues: {
          pitch: 3,
          volume: 1.2
        },
        delayAfterParticleInSeconds: 0
      }
    ],
    ambience: "tainted",
    traineeFriendly: true,
    ritualEffects: (witch, ritualSlate, alignments) => {
      if (alignments.properties["bw:blood_vial"] == undefined) {
        return;
      }
      let blood = JSON.parse(alignments.properties["bw:blood_vial"]);
      let target = world.getEntity(blood.id);
      
      let magnitude = Math.max(0, Math.floor((alignments.ambience.neutral + alignments.ambience.taint)/1000));
      
      if (target != undefined) {
        if (target.dimension.id == ritualSlate.dimension.id) {
          ritualHexTarget(target, "leadweight", witch, magnitude);
        }
      }
    }
  },
  {
    id: "Hexing Rite of Ineptitude",
    itemArray: [
      "minecraft:iron_ingot",
      "minecraft:copper_chain",
      "minecraft:fermented_spider_eye",
      "bw:obsidian_dust",
      "bw:natural_ash",
      "bw:blood_vial"
    ],
    specialProperties: {
      "bw:blood_vial": "bw:blood",
    },
    cost: {
      "tags": ["malefic", "occult"],
      "occultEnergy": 1000,
      "fatigue": 500
    },
    validCircle: "Circle of Duality",
    vfx: [
      {
        particle: "bw:malice_rite_stage_one",
        particleOffset: {
          x: 0.5,
          y: 0.35,
          z: 0.5
        },
        sound: "mob.warden.sniff",
        soundValues: {
          pitch: 1.24,
          volume: 1.2
        },
        playDuringDelay: {},
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bw:malice_rite_stage_two",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        sound: "mob.ravager.ambient",
        soundValues: {
          pitch: 0.46,
          volume: 1.2
        },
        playDuringDelay: {},
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bw:malice_rite_stage_three",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        sound: "mob.warden.roar",
        soundValues: {
          pitch: 3,
          volume: 1.2
        },
        delayAfterParticleInSeconds: 0
      }
    ],
    ambience: "tainted",
    traineeFriendly: true,
    ritualEffects: (witch, ritualSlate, alignments) => {
      if (alignments.properties["bw:blood_vial"] == undefined) {
        return;
      }
      let blood = JSON.parse(alignments.properties["bw:blood_vial"]);
      let target = world.getEntity(blood.id);
      
      let magnitude = Math.max(0, Math.floor((alignments.ambience.neutral + alignments.ambience.taint)/1000));
      
      if (target != undefined) {
        if (target.dimension.id == ritualSlate.dimension.id) {
          ritualHexTarget(target, "ineptitude", witch, magnitude);
        }
      }
    }
  },
  
  /*
  {
    id: "Hexing Rite of Insomnia",
    itemArray: [
      "minecraft:phantom_membrane",
      "minecraft:glow_ink_sac", 
      "bw:blood_vial"
    ],
    specialProperties: {
      "bw:blood_vial": "bw:blood",
    },
    cost: {
      "tags": ["malice", "esoteric"],
      "occultEnergy": 1200,
      "fatigue": 400
    },
    validCircle: "Circle of Duality",
    vfx: [
      {
        particle: "bw:malice_rite_stage_one",
        particleOffset: {
          x: 0.5,
          y: 0.35,
          z: 0.5
        },
        sound: "mob.warden.sniff",
        soundValues: {
          pitch: 1.24,
          volume: 1.2
        },
        playDuringDelay: {},
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bw:malice_rite_stage_two",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        sound: "mob.ravager.ambient",
        soundValues: {
          pitch: 0.46,
          volume: 1.2
        },
        playDuringDelay: {},
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bw:malice_rite_stage_three",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        sound: "mob.warden.roar",
        soundValues: {
          pitch: 3,
          volume: 1.2
        },
        delayAfterParticleInSeconds: 0
      }
    ],
    ritualEffects: (witch, ritualSlate, alignments) => {
      if (alignments.properties["bw:blood_vial"] == undefined) {
        return;
      }
      let blood = JSON.parse(alignments.properties["bw:blood_vial"]);
      let target = ritualSlate.dimension.getEntities({type: blood.type, name: blood.name});
      
      for (let i of target) {
        if (i.id == blood.id) {
          target = i;
          break;
        } else {
          target.pop();
        }
      }
      if (target.length == 0) {
        target = undefined;
      }
      
      if (target != undefined) {
        ritualHexTarget(target, "insomnia", witch);
      }
    }
  },
  */
  // New Hexes
  /*
  {
    id: "Hexing Rite of Mystical Instability",
    itemArray: [
      "minecraft:blaze_powder",
      "minecraft:gunpowder",
      "minecraft:fermented_spider_eye",
      "bw:solar_imbued_quartz",
      "bw:poppy_dust",
      "bw:blood_vial"
    ],
    specialProperties: {
      "bw:blood_vial": "bw:blood",
    },
    cost: {
      "tags": ["malice", "fire"],
      "occultEnergy": 1000,
      "fatigue": 80
    },
    validCircle: "Circle of Duality",
    vfx: [
      {
        particle: "bw:malice_rite_stage_one",
        particleOffset: {
          x: 0.5,
          y: 0.35,
          z: 0.5
        },
        sound: "mob.warden.sniff",
        soundValues: {
          pitch: 1.24,
          volume: 1.2
        },
        playDuringDelay: {},
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bw:malice_rite_stage_two",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        sound: "mob.ravager.ambient",
        soundValues: {
          pitch: 0.46,
          volume: 1.2
        },
        playDuringDelay: {},
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bw:malice_rite_stage_three",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        sound: "mob.warden.roar",
        soundValues: {
          pitch: 3,
          volume: 1.2
        },
        delayAfterParticleInSeconds: 0
      }
    ],
    ritualEffects: (witch, ritualSlate, alignments) => {
      if (alignments.properties["bw:blood_vial"] == undefined) {
        return;
      }
      let blood = JSON.parse(alignments.properties["bw:blood_vial"]);
      let target = ritualSlate.dimension.getEntities({type: blood.type, name: blood.name});
      
      for (let i of target) {
        if (i.id == blood.id) {
          target = i;
          break;
        } else {
          target.pop();
        }
      }
      if (target.length == 0) {
        target = undefined;
      }
      
      if (target != undefined) {
        ritualHexTarget(target, "instability", witch);
      }
    }
  },
  {
    id: "Hexing Rite of Antimateriality",
    itemArray: [
      "minecraft:gunpowder",
      "minecraft:blaze_powder",
      "bw:coal_dust",
      "bw:earth_imbued_quartz",
      "bw:solar_imbued_quartz",
      "bw:blood_vial"
    ],
    specialProperties: {
      "bw:blood_vial": "bw:blood",
    },
    cost: {
      "tags": ["malice", "fire", "earth"],
      "occultEnergy": 1000,
      "fatigue": 65
    },
    validCircle: "Circle of Duality",
    vfx: [
      {
        particle: "bw:malice_rite_stage_one",
        particleOffset: {
          x: 0.5,
          y: 0.35,
          z: 0.5
        },
        sound: "mob.warden.sniff",
        soundValues: {
          pitch: 1.24,
          volume: 1.2
        },
        playDuringDelay: {},
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bw:malice_rite_stage_two",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        sound: "mob.ravager.ambient",
        soundValues: {
          pitch: 0.46,
          volume: 1.2
        },
        playDuringDelay: {},
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bw:malice_rite_stage_three",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        sound: "mob.warden.roar",
        soundValues: {
          pitch: 3,
          volume: 1.2
        },
        delayAfterParticleInSeconds: 0
      }
    ],
    ritualEffects: (witch, ritualSlate, alignments) => {
      if (alignments.properties["bw:blood_vial"] == undefined) {
        return;
      }
      let blood = JSON.parse(alignments.properties["bw:blood_vial"]);
      let target = ritualSlate.dimension.getEntities({type: blood.type, name: blood.name});
      
      for (let i of target) {
        if (i.id == blood.id) {
          target = i;
          break;
        } else {
          target.pop();
        }
      }
      if (target.length == 0) {
        target = undefined;
      }
      
      if (target != undefined) {
        ritualHexTarget(target, "antimateriality", witch);
      }
    }
  },
  {
    id: "Hexing Rite of Hemophilia",
    itemArray: [
      "minecraft:fermented_spider_eye",
      "minecraft:iron_sword",
      "minecraft:rotten_flesh",
      "minecraft:redstone",
      "bw:poppy_dust",
      "bw:blood_vial"
    ],
    specialProperties: {
      "bw:blood_vial": "bw:blood",
    },
    cost: {
      "tags": ["malice", "esoteric"],
      "occultEnergy": 1000,
      "fatigue": 45
    },
    validCircle: "Circle of Duality",
    vfx: [
      {
        particle: "bw:malice_rite_stage_one",
        particleOffset: {
          x: 0.5,
          y: 0.35,
          z: 0.5
        },
        sound: "mob.warden.sniff",
        soundValues: {
          pitch: 1.24,
          volume: 1.2
        },
        playDuringDelay: {},
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bw:malice_rite_stage_two",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        sound: "mob.ravager.ambient",
        soundValues: {
          pitch: 0.46,
          volume: 1.2
        },
        playDuringDelay: {},
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bw:malice_rite_stage_three",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        sound: "mob.warden.roar",
        soundValues: {
          pitch: 3,
          volume: 1.2
        },
        delayAfterParticleInSeconds: 0
      }
    ],
    ritualEffects: (witch, ritualSlate, alignments) => {
      if (alignments.properties["bw:blood_vial"] == undefined) {
        return;
      }
      let blood = JSON.parse(alignments.properties["bw:blood_vial"]);
      let target = ritualSlate.dimension.getEntities({type: blood.type, name: blood.name});
      
      for (let i of target) {
        if (i.id == blood.id) {
          target = i;
          break;
        } else {
          target.pop();
        }
      }
      if (target.length == 0) {
        target = undefined;
      }
      
      if (target != undefined) {
        ritualHexTarget(target, "hemophilia", witch);
      }
    }
  },
  */
  // Taint Rites
  // {
  {
    id: "Tainting Rite of Famine",
    itemArray: [
      "minecraft:echo_shard",
      "minecraft:wheat",
      "minecraft:coarse_dirt",
      "minecraft:rotten_flesh",
      "bw:ender_imbued_quartz",
      "bw:amethyst_nugget"
    ],
    specialProperties: {
      "bw:amethyst_nugget": "bw:savedLocation"
    },
    keptItems: [
      "bw:amethyst_nugget"
    ],
    cost: {
      "tags": ["malice", "transmutation", "esoteric"],
      "occultEnergy": 4600,
      "fatigue": 70
    },
    validCircle: "Circle of Duality",
    vfx: [
      {
        particle: "bw:malice_rite_stage_one",
        particleOffset: {
          x: 0.5,
          y: 0.35,
          z: 0.5
        },
        sound: "mob.warden.sniff",
        soundValues: {
          pitch: 1.24,
          volume: 1.2
        },
        playDuringDelay: {},
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bw:malice_rite_stage_two",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        sound: "mob.ravager.ambient",
        soundValues: {
          pitch: 0.46,
          volume: 1.2
        },
        playDuringDelay: {},
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bw:malice_rite_stage_three",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        sound: "mob.warden.roar",
        soundValues: {
          pitch: 3,
          volume: 1.2
        },
        delayAfterParticleInSeconds: 0
      }
    ],
    ritualEffects: (witch, ritualSlate, alignments) => {
      if (alignments.properties["bw:amethyst_nugget"] == undefined) {
        witch.sendMessage("§c[!]§r No coordinates were given on the amethyst nugget.")
        return;
      }
      let location = JSON.parse(alignments.properties["bw:amethyst_nugget"]);
      let attributes = {
        duration: 4800,
        range: 17
      }
      hexArea("famine_hex", location, witch.dimension.id, attributes);
      
    }
  },
  {
    id: "Tainting Rite of Drought",
    itemArray: [
      "minecraft:echo_shard",
      "minecraft:blaze_powder",
      "minecraft:coal",
      ["minecraft:sand", "minecraft:red_sand"],
      "minecraft:deadbush",
      "bw:earth_imbued_quartz",
      "bw:ender_imbued_quartz",
      "bw:amethyst_nugget"
    ],
    specialProperties: {
      "bw:amethyst_nugget": "bw:savedLocation"
    },
    keptItems: [
      "bw:amethyst_nugget"
    ],
    cost: {
      "tags": ["malice", "transmutation", "fire"],
      "occultEnergy": 4800,
      "fatigue": 65
    },
    validCircle: "Circle of Duality",
    vfx: [
      {
        particle: "bw:malice_rite_stage_one",
        particleOffset: {
          x: 0.5,
          y: 0.35,
          z: 0.5
        },
        sound: "mob.warden.sniff",
        soundValues: {
          pitch: 1.24,
          volume: 1.2
        },
        playDuringDelay: {},
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bw:malice_rite_stage_two",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        sound: "mob.ravager.ambient",
        soundValues: {
          pitch: 0.46,
          volume: 1.2
        },
        playDuringDelay: {},
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bw:malice_rite_stage_three",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        sound: "mob.warden.roar",
        soundValues: {
          pitch: 3,
          volume: 1.2
        },
        delayAfterParticleInSeconds: 0
      }
    ],
    ritualEffects: (witch, ritualSlate, alignments) => {
      if (alignments.properties["bw:amethyst_nugget"] == undefined) {
        witch.sendMessage("§c[!]§r No coordinates were given on the amethyst nugget.")
        return;
      }
      let location = JSON.parse(alignments.properties["bw:amethyst_nugget"]);
      let attributes = {
        duration: 4800,
        range: 17
      }
      hexArea("drought_hex", location, witch.dimension.id, attributes);
      
    }
  },
  {
    id: "Tainting Rite of Malignant Heat",
    itemArray: [
      "minecraft:echo_shard",
      "minecraft:blaze_powder",
      "minecraft:magma",
      "bw:solar_imbued_quartz",
      "bw:amethyst_nugget"
    ],
    specialProperties: {
      "bw:amethyst_nugget": "bw:savedLocation"
    },
    keptItems: [
      "bw:amethyst_nugget"
    ],
    cost: {
      "tags": ["malice", "transmutation", "fire"],
      "occultEnergy": 5100,
      "fatigue": 90
    },
    validCircle: "Circle of Duality",
    vfx: [
      {
        particle: "bw:malice_rite_stage_one",
        particleOffset: {
          x: 0.5,
          y: 0.35,
          z: 0.5
        },
        sound: "mob.warden.sniff",
        soundValues: {
          pitch: 1.24,
          volume: 1.2
        },
        playDuringDelay: {},
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bw:malice_rite_stage_two",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        sound: "mob.ravager.ambient",
        soundValues: {
          pitch: 0.46,
          volume: 1.2
        },
        playDuringDelay: {},
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bw:malice_rite_stage_three",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        sound: "mob.warden.roar",
        soundValues: {
          pitch: 3,
          volume: 1.2
        },
        delayAfterParticleInSeconds: 0
      }
    ],
    ritualEffects: (witch, ritualSlate, alignments) => {
      if (alignments.properties["bw:amethyst_nugget"] == undefined) {
        witch.sendMessage("§c[!]§r No coordinates were given on the amethyst nugget.")
        return;
      }
      let location = JSON.parse(alignments.properties["bw:amethyst_nugget"]);
      let attributes = {
        duration: 4800,
        range: 17
      }
      hexArea("malignant_heat_hex", location, witch.dimension.id, attributes);
      
    }
  },
  {
    id: "Tainting Rite of Chilling",
    itemArray: [
      "minecraft:echo_shard",
      "minecraft:ice",
      "minecraft:snowball",
      "bw:lunar_imbued_quartz",
      "bw:amethyst_nugget"
    ],
    specialProperties: {
      "bw:amethyst_nugget": "bw:savedLocation"
    },
    keptItems: [
      "bw:amethyst_nugget"
    ],
    cost: {
      "tags": ["malice", "transmutation", "water"],
      "occultEnergy": 4200,
      "fatigue": 65
    },
    validCircle: "Circle of Duality",
    vfx: [
      {
        particle: "bw:malice_rite_stage_one",
        particleOffset: {
          x: 0.5,
          y: 0.35,
          z: 0.5
        },
        sound: "mob.warden.sniff",
        soundValues: {
          pitch: 1.24,
          volume: 1.2
        },
        playDuringDelay: {},
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bw:malice_rite_stage_two",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        sound: "mob.ravager.ambient",
        soundValues: {
          pitch: 0.46,
          volume: 1.2
        },
        playDuringDelay: {},
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bw:malice_rite_stage_three",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        sound: "mob.warden.roar",
        soundValues: {
          pitch: 3,
          volume: 1.2
        },
        delayAfterParticleInSeconds: 0
      }
    ],
    ritualEffects: (witch, ritualSlate, alignments) => {
      if (alignments.properties["bw:amethyst_nugget"] == undefined) {
        witch.sendMessage("§c[!]§r No coordinates were given on the amethyst nugget.")
        return;
      }
      let location = JSON.parse(alignments.properties["bw:amethyst_nugget"]);
      let attributes = {
        duration: 4800,
        range: 17
      }
      hexArea("chilling_hex", location, witch.dimension.id, attributes);
      
    }
  },
  {
    id: "Tainting Rite of Quaking",
    itemArray: [
      "minecraft:echo_shard",
      "minecraft:gravel",
      "bw:earth_imbued_quartz",
      "bw:amethyst_nugget"
    ],
    specialProperties: {
      "bw:amethyst_nugget": "bw:savedLocation"
    },
    keptItems: [
      "bw:amethyst_nugget"
    ],
    cost: {
      "tags": ["malice", "transmutation", "mineral"],
      "occultEnergy": 4000,
      "fatigue": 70
    },
    validCircle: "Circle of Duality",
    vfx: [
      {
        particle: "bw:malice_rite_stage_one",
        particleOffset: {
          x: 0.5,
          y: 0.35,
          z: 0.5
        },
        sound: "mob.warden.sniff",
        soundValues: {
          pitch: 1.24,
          volume: 1.2
        },
        playDuringDelay: {},
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bw:malice_rite_stage_two",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        sound: "mob.ravager.ambient",
        soundValues: {
          pitch: 0.46,
          volume: 1.2
        },
        playDuringDelay: {},
        delayAfterParticleInSeconds: 5
      },
      {
        particle: "bw:malice_rite_stage_three",
        particleOffset: {
          x: 0.5,
          y: 0.0,
          z: 0.5
        },
        sound: "mob.warden.roar",
        soundValues: {
          pitch: 3,
          volume: 1.2
        },
        delayAfterParticleInSeconds: 0
      }
    ],
    ritualEffects: (witch, ritualSlate, alignments) => {
      if (alignments.properties["bw:amethyst_nugget"] == undefined) {
        witch.sendMessage("§c[!]§r No coordinates were given on the amethyst nugget.")
        return;
      }
      let location = JSON.parse(alignments.properties["bw:amethyst_nugget"]);
      let attributes = {
        duration: 4800,
        range: 17
      }
      hexArea("quaking", location, witch.dimension.id, attributes);
      
    }
  },
  // }
  
  // Item Binding & Item Unbinding
  {
    id: "Rite of Bound Permanence",
    itemArray: [
      "minecraft:netherite_ingot",
      "minecraft:emerald",
      "minecraft:diamond",
      "bw:earth_imbued_quartz",
      "ANY"
    ],
    cost: {
      "tags": ["binding", "esoteric"],
      "occultEnergy": 1000,
      "fatigue": 45
    },
    validCircle: "Mark of Hebaya",
    vfx: [
      {
        particle: "bwitch:clear_particle4",
        particleOffset: {
          x: 0.5,
          y: 1.0,
          z: 0.5
        },
        sound: "beacon.activate",
        soundValues: {
          pitch: 1.24,
          volume: 1.2
        },
        delayAfterParticleInSeconds: 1
      }
    ],
    ritualEffects: (witch, ritualSlate, alignments) => {
      if (alignments.properties.itemFound != undefined) {
        let item = alignments.properties.itemFound;
        item.keepOnDeath = true;
        
        ritualSlate.dimension.spawnItem(item, ritualSlate.above().location);
      }
    }
  },
  {
    id: "Untethering of the Bound Artifact",
    itemArray: [
      "minecraft:iron_sword",
      "minecraft:sand",
      "minecraft:dirt",
      "bw:coal_dust",
      "bw:sky_imbued_quartz",
      "ANY"
    ],
    cost: {
      "tags": ["binding", "esoteric"],
      "occultEnergy": 1500,
      "fatigue": 60
    },
    validCircle: "Mark of Hebaya",
    vfx: [
      {
        particle: "bwitch:clear_particle4",
        particleOffset: {
          x: 0.5,
          y: 1.0,
          z: 0.5
        },
        sound: "beacon.deactive",
        soundValues: {
          pitch: 1.24,
          volume: 1.2
        },
        delayAfterParticleInSeconds: 1
      }
    ],
    ritualEffects: (witch, ritualSlate, alignments) => {
      if (alignments.properties.itemFound != undefined) {
        let item = alignments.properties.itemFound;
        item.keepOnDeath = false;
        
        ritualSlate.dimension.spawnItem(item, ritualSlate.above().location);
      }
    }
  },
  
  // Oberon Spell Binding
  {
    id: "Enchanting of the Mundane Armament",
    itemArray: [
      "minecraft:lapis_lazuli",
      "bw:glyph_book",
      "bw:emerald_dust",
      [{"id": "armor", "componentType": "minecraft:durability"}]
    ],
    specialProperties: {
      "bw:glyph_book": "bw:mysticSpell",
    },
    cost: {
      "tags": ["binding", "esoteric"],
      "occultEnergy": 1200,
      "fatigue": 35
    },
    validCircle: "Mark of Hebaya",
    vfx: [
      {
        particle: "bwitch:clear_particle4",
        particleOffset: {
          x: 0.5,
          y: 1.0,
          z: 0.5
        },
        sound: "random.levelup",
        soundValues: {
          pitch: 1.24,
          volume: 1.2
        },
        delayAfterParticleInSeconds: 1
      }
    ],
    ritualEffects: (witch, ritualSlate, alignments) => {
      let spell = alignments.properties["bw:glyph_book"];
      
      if (!verifyPatron(witch, "oberon")) {
        witch.sendMessage('The Greater Faerie that presides over this ritual deems you unworthy of its use. Naturally, he will still accept your kind offering of ritual materials.')
        return;
      }
      
      if (spell != undefined) {
        let item = alignments.properties.armor;
        item.setDynamicProperty("bw:imbued_item_spell", undefined);
        item.setDynamicProperty("bw:imbued_weapon_spell", undefined);
        item.setDynamicProperty("bw:imbued_armor_spell", spell);
        
        ritualSlate.dimension.spawnItem(item, ritualSlate.above().location);
      }
    }
  },
  {
    id: "Enchanting of the Mundane Weapon",
    itemArray: [
      "minecraft:lapis_lazuli",
      "bw:glyph_book",
      "bw:coal_dust",
      [{"id": "armor", "componentType": "minecraft:durability"}]
    ],
    specialProperties: {
      "bw:glyph_book": "bw:mysticSpell",
    },
    cost: {
      "tags": ["binding", "esoteric"],
      "occultEnergy": 1200,
      "fatigue": 35
    },
    validCircle: "Mark of Hebaya",
    vfx: [
      {
        particle: "bwitch:clear_particle4",
        particleOffset: {
          x: 0.5,
          y: 1.0,
          z: 0.5
        },
        sound: "random.levelup",
        soundValues: {
          pitch: 1.24,
          volume: 1.2
        },
        delayAfterParticleInSeconds: 1
      }
    ],
    ritualEffects: (witch, ritualSlate, alignments) => {
      let spell = alignments.properties["bw:glyph_book"];
      
      if (!verifyPatron(witch, "oberon")) {
        witch.sendMessage('The Greater Faerie that presides over this ritual deems you unworthy of its use. Naturally, he will still accept your kind offering of ritual materials.')
        return;
      }
      
      if (spell != undefined) {
        let item = alignments.properties.armor;
        item.setDynamicProperty("bw:imbued_item_spell", undefined);
        item.setDynamicProperty("bw:imbued_weapon_spell", spell);
        item.setDynamicProperty("bw:imbued_armor_spell", undefined);
        
        ritualSlate.dimension.spawnItem(item, ritualSlate.above().location);
      }
    }
  },
  {
    id: "Enchanting of the Mundane Trinket",
    itemArray: [
      "minecraft:lapis_lazuli",
      "bw:glyph_book",
      "bw:amethyst_dust",
      [{"id": "armor", "componentType": "minecraft:durability"}]
    ],
    specialProperties: {
      "bw:glyph_book": "bw:mysticSpell",
    },
    cost: {
      "tags": ["binding", "esoteric"],
      "occultEnergy": 1200,
      "fatigue": 35
    },
    validCircle: "Mark of Hebaya",
    vfx: [
      {
        particle: "bwitch:clear_particle4",
        particleOffset: {
          x: 0.5,
          y: 1.0,
          z: 0.5
        },
        sound: "random.levelup",
        soundValues: {
          pitch: 1.24,
          volume: 1.2
        },
        delayAfterParticleInSeconds: 1
      }
    ],
    ritualEffects: (witch, ritualSlate, alignments) => {
      let spell = alignments.properties["bw:glyph_book"];
      
      if (!verifyPatron(witch, "oberon")) {
        witch.sendMessage('The Greater Faerie that presides over this ritual deems you unworthy of its use. Naturally, he will still accept your kind offering of ritual materials.')
        return;
      }
      
      if (spell != undefined) {
        let item = alignments.properties.armor;
        item.setDynamicProperty("bw:imbued_item_spell", spell);
        item.setDynamicProperty("bw:imbued_weapon_spell", undefined);
        item.setDynamicProperty("bw:imbued_armor_spell", undefined);
        
        ritualSlate.dimension.spawnItem(item, ritualSlate.above().location);
      }
    }
  },
  
  {
    id: "Binding the Mystic Barrel",
    itemArray: [
      "minecraft:honey",
      "minecraft:sugar",
      "minecraft:reeds",
      "bw:amethyst_nugget",
      "bw:faerie_grimoire"
    ],
    specialProperties: {
      "bw:faerie_grimoire": "bw:attunedFaerie",
      "bw:amethyst_nugget": "bw:savedLocation"
    },
    cost: {
      "tags": ["binding", "esoteric"],
      "occultEnergy": 700,
      "fatigue": 45
    },
    validCircle: "Mark of Hebaya",
    vfx: [
      {
        particle: "bwitch:clear_particle4",
        particleOffset: {
          x: 0.5,
          y: 1.0,
          z: 0.5
        },
        sound: "random.levelup",
        soundValues: {
          pitch: 1.24,
          volume: 1.2
        },
        delayAfterParticleInSeconds: 1
      }
    ],
    ritualEffects: (witch, ritualSlate, alignments) => {
      let faeFound = alignments.properties["bw:faerie_grimoire"];
      let locationFound = alignments.properties["bw:amethyst_nugget"];
      if (locationFound != undefined && faeFound != undefined && faeFound == "oberon") {
        if (verifyPatron(player, faeFound)) {
          try {
            let block = witch.dimension.getBlock(JSON.parse(locationFound));
            if (block?.typeId == "minecraft:barrel") {
              let loc = {
                x: Math.floor(block.location.x),
                y: Math.floor(block.location.y),
                z: Math.floor(block.location.z)
              };
              let ferment_loc = `bw:barrel_enchanted_${loc.x}_${loc.y}_${loc.z}`;
              world.setDynamicProperty(ferment_loc, world.getDay());
              
              witch.sendMessage(`§a[!]§r A magical force wraos around the barrel at §a[${loc.x}, ${loc.y}, ${loc.z}]§r. It is now Day ` + world.getDay());
            } else {
              witch.sendMessage("§c[!]§r Your rite failed... There was no barrel to enchant there.")
            }
          } catch (e) {
            witch.sendMessage("§c[!]§r Your rite failed... Perhaps the barrel was too far?")
          }
        }
      }
    }
  },
  
  // Test Rite
  /*
  {
    id: "Hexing Rite of [Insert]",
    itemArray: [
      "minecraft:leather",
      "bw:raw_orbos",
      "hjjj",
      "bw:blood_vial"
    ],
    specialProperties: {
      "bw:blood_vial": "bw:blood",
    },
    cost: {
      "tags": ["malice", "esoteric"],
      "occultEnergy": 0,
      "fatigue": 0
    },
    validCircle: "Circle of Duality",
    vfx: [
      {
        particle: "bwitch:clear_particle4",
        particleOffset: {
          x: 0.5,
          y: 1.0,
          z: 0.5
        },
        delayAfterParticleInSeconds: 1
      }
    ],
    ritualEffects: (witch, ritualSlate, alignments) => {
      if (alignments.properties["bw:blood_vial"] == undefined) {
        return;
      }
      let blood = JSON.parse(alignments.properties["bw:blood_vial"]);
      let target = ritualSlate.dimension.getEntities({type: blood.type, name: blood.name});
      
      for (let i of target) {
        if (i.id == blood.id) {
          target = i;
          break;
        } else {
          target.pop();
        }
      }
      if (target.length == 0) {
        target = undefined;
      }
      
      if (target != undefined) {
        ritualHexTarget(target, "leadweight", witch);
      }
    }
  },
  */
  // Cursing
];

/*
let y = new Set();
let x = [];
for (let ceremony of ceremonies) {
  let tags = ceremony.cost.tags;
  for (let tag of tags) {
    y.add(tag)
  }
}

for (let i of y.keys()) {
  x.push(i);
}

console.log("Set Size: ", y.size)
console.log("Set Entries: ", x)
*/