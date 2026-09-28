import {world, system, Scoreboard, Direction, ItemStack, Entity, EntityHealthComponent, BlockVolume, BlockVolumeBase, BlockPermutation, MolangVariableMap, MoonPhase, GameRules, Player} from "@minecraft/server";
import {getFace} from "./wardArrays.js";
import {Vector3} from "./VectorMath/index.js";
import {capitalize} from "./wandLore.js";
import {reduceCost, wands} from "./blockComp.js";
import {getWandTags, gatherCelestialOrbos, castBWSpell, diceRoll, essenceCheck} from "./occultMagick.js";
import {faerieSpells, faeSpellArray, spellCastTypes} from "./faeSpells.js";
import {localizePos} from "./localize.js";
import {convertFaeName} from "./lesserFaerie.js";
import {faeSpellTagDetection} from "./altars.js";
import {getItem, removeItem} from "./getTaglock.js";
import {applySpellDamage} from "./spellDamage.js";
import {parryBolt} from "./spellEffects.js";

function triggerSpellType(wand, spellParams, entity) {
  let spells = [];
  spellLoop: for (let i = 0; i < 8; i++) {
    let property = wand.getDynamicProperty(`bwWandSlot_${i}`);
    if (property != undefined) {
      let spell = JSON.parse(property);
      let costMax = spellParams.below_orbos_cost;
      
      if (costMax == undefined) {
        costMax = 0;
      }
      
      if (spellParams.nouns_castable.includes(spell.noun) && spell.cost.occultEnergy <= costMax) {
        spells.push(spell);
        continue spellLoop;
      }
      
      if (spellParams.verbs_castable) {
        if (spellParams.verbs_castable.includes(spell.verb.verbName) && spell.cost.occultEnergy <= costMax) {
          spells.push(spell);
          continue spellLoop;
        }
      }
      
      if (spellParams.aspects_castable) {
        let tags = spell.cost.tags;
        if (hasAspect(spellParams.aspects_castable, spell, "any")) {
          spells.push(spell);
          continue spellLoop;
        }
      }
    }
  }
  
  if (spells.length > 0) {
    let chosenSpell = spells[Math.floor(Math.random() * spells.length)];
    
    castBWSpell(chosenSpell, wand, entity, false);
  }
}

export function hasAspect(tags, spell, mode = "any") {
  let count = 0;
  for (let a of tags) {
    if (spell.cost.tags.includes(a)) {
      count++;
    }
  }
  if (mode == "any") {
    if (count > 0) {
      return true;
    } else {
      return false;
    }
  }
  if (mode == "all") {
    if (count == tags.length) {
      return true;
    } else {
      return false;
    }
  }
}

export function getWandOwner(wand) {
  if (wand.getDynamicProperty("bw:wand_owner")) {
    return wand.getDynamicProperty("bw:wand_owner");
  }
}

function findCustomSpellGlyph(index, wand) {
  if (index === undefined) {
    return;
  }
  
  let indexProp = `bwWandSlot_${index}`;
  if (wand.getDynamicProperty(indexProp)) {
    return JSON.parse(wand.getDynamicProperty(indexProp));
  }
}
// Notes
// Detect the Lines, not the Points.
// Get a Starting Point, then constantly detect the direction the wand is moving in.
// Every time there is a drastic direction shift, add the direction to a dynamic property.
// Store the beginning and ending points in a Line Storing dynamic property.
// Use those two points to draw a line between them
// On stop charging/death/item change, break the charging loop.

// New spell drawing array thing
export const allPlayersCasting = new Map();
export const allPlayersDrawing = new Map();

// Loop through the players casting at once.
system.runInterval(() => {
  if (allPlayersDrawing.size > 0) {
    for (let [id, player] of allPlayersDrawing) {
      
      // Spell Drawing & Particles
      if (player.getComponent(EntityHealthComponent.componentId).currentValue <= 0) {
        allPlayersDrawing.delete(player.id);
        player.setDynamicProperty("bw:drawCooldown", undefined)
      }
      
      if (!player.isSneaking) {
        allPlayersDrawing.delete(player.id);
        player.setDynamicProperty("bw:drawCooldown", undefined)
      }
      
      let item = player.getComponent("minecraft:inventory").container.getItem(player.selectedSlotIndex);
      
      let num = player.getDynamicProperty("bw:drawCooldown");
      if (num == undefined) {
        num = 1;
        player.setDynamicProperty("bw:drawCooldown", num);
      } else {
        player.setDynamicProperty("bw:drawCooldown", num + 1);
      }
      
      if (item?.hasTag("bw:castingWand")) {
        let visuals = item.getComponent("bw:wand_visuals")?.customComponentParameters?.params;
        let lineVisuals = {
          "drawingParticle": "bw:spell_ink",
          "color": {
            red: 0.937,
            green: 0.949,
            blue: 0.78
          }
        }
        if (visuals != undefined) {
          lineVisuals = visuals;
        }
        
        player.setDynamicProperty("bw:currentSpell", undefined);
        let convertedRot = convert(player.getRotation());
        let movingRoom = 5 // Moving room in degrees
        if (player.getDynamicProperty("bw:xMov") == undefined && player.getDynamicProperty("bw:yMov") == undefined) {
          player.setDynamicProperty("bw:xMov", convertedRot.x);
          player.setDynamicProperty("bw:yMov", convertedRot.y);
        }
        if (player.getDynamicProperty("bw:lookPoint") == undefined) {
          player.setDynamicProperty("bw:lookPoint", JSON.stringify(player.getViewDirection()));
        }
        
        let subtracted = {x: convertedRot.x- player.getDynamicProperty("bw:xMov"), y: convertedRot.y - player.getDynamicProperty("bw:yMov")};
        
        let seq = player.getDynamicProperty("bw:spellSequence");
        let mov = checkMovement(subtracted, movingRoom, seq);
        let pointArray = player.getDynamicProperty("bw:spellLinePoints") == undefined ? new SpellLine(player.dimension.id, lineVisuals) : JSON.parse(player.getDynamicProperty("bw:spellLinePoints"));
        if (mov[0]) {
          let seqArray = player.getDynamicProperty("bw:spellSequence") == undefined ? [] : JSON.parse(player.getDynamicProperty("bw:spellSequence"));
          
          player.setDynamicProperty("bw:xMov", convertedRot.x);
          player.setDynamicProperty("bw:yMov", convertedRot.y);
          if (mov[1] != "") {
            pointArray = addLine(pointArray, JSON.parse(player.getDynamicProperty("bw:lookPoint")), player.getViewDirection(), mov[1]);
            seqArray.push(mov[1]);
            player.setDynamicProperty("bw:lookPoint", JSON.stringify(player.getViewDirection()));
            player.setDynamicProperty("bw:spellSequence", JSON.stringify(seqArray));
            player.setDynamicProperty("bw:spellLinePoints", JSON.stringify(pointArray));
            
            let spell = faeSpellArray[player.getDynamicProperty("bw:spellSequence")];
            if (!verifyFaePrivelege(spell, player)) {
              spell = undefined;
            }
            // Have a function check Wand spells
            
            if (spell != undefined) {
              player.onScreenDisplay.setActionBar(`§gPotential Spell | ${spell}§r\nGesture | ${JSON.stringify(seqArray).replaceAll("\"", "").replaceAll(",", " + ")}`)
            } else {
              player.onScreenDisplay.setActionBar(`Pattern | ${JSON.stringify(seqArray).replaceAll("\"", "").replaceAll(",", " + ")}`)
            }
          } else {
            pointArray = updateLastLine(pointArray, player.getViewDirection());
            player.setDynamicProperty("bw:spellLinePoints", JSON.stringify(pointArray));
            player.setDynamicProperty("bw:lookPoint", JSON.stringify(player.getViewDirection()));
          }
        }
        
        let molang = new MolangVariableMap;
        let inkParticle = "bw:spell_ink";
        let inkColor = {
          red: 0.937,
          green: 0.949,
          blue: 0.78
        };
        
        if (visuals != undefined) {
          if (visuals.drawingParticle) {
            inkParticle = visuals.drawingParticle;
          }
          if (visuals.particleColor) {
            inkColor = visuals.color;
          }
        }
        
        molang.setColorRGB("variable.color", inkColor);
        try {
          world.getDimension(player.dimension.id).spawnParticle(inkParticle, Vector3.add(player.getHeadLocation(), player.getViewDirection()), molang);
          
          if (!player.getDynamicProperty("bwAnimation:spell_drawing")) {
            player.playAnimation("animation.bewitchery.casting", {stopAnimation: "!query.is_sneaking || !query.is_using_item"});
            player.setDynamicProperty("bwAnimation:spell_drawing", true);
          }
        } catch (e) {
        }
      } else {
        allPlayersDrawing.delete(player.id);
        player.setDynamicProperty("bwAnimation:spell_drawing", undefined);
        player.setDynamicProperty("bw:drawCooldown", undefined)
        continue;
      }
      
      // Particles
      try {
        gatherCelestialOrbos(item, player, num);
      } catch (e) {}
    }
  }
}, 1);
system.runInterval(() => {
  if (allPlayersCasting.size > 0) {
    for (let [id, player] of allPlayersCasting) {
      
      // Spell Charging & Particles
      if (player.getComponent(EntityHealthComponent.componentId).currentValue <= 0) {
        allPlayersCasting.delete(player.id);
        player.setDynamicProperty("bw:spellCooldown", undefined)
      }
      
      if (player.isSneaking) {
        allPlayersCasting.delete(player.id);
        player.setDynamicProperty("bw:spellCooldown", undefined)
      }
      
      let item = player.getComponent("minecraft:inventory").container.getItem(player.selectedSlotIndex);
      
      let num = player.getDynamicProperty("bw:spellCooldown");
      if (num == undefined) {
        num = 1;
        player.setDynamicProperty("bw:spellCooldown", num);
      } else {
        player.setDynamicProperty("bw:spellCooldown", num + 1);
      }
      
      if (item != undefined && item.hasTag("bw:castingWand")) {
        // Gather Orbos
        try {
          gatherCelestialOrbos(item, player, num*2);
        } catch (e) {}
        
        // Find spell saved to wand.
        // Glyph spells are not imbued spells at all.
        let castingSpell = item.getDynamicProperty("bw:lastGlyph");
        if (castingSpell != undefined) {
          castingSpell = findCustomSpellGlyph(castingSpell, item);
        }
        
        // Display text
        if (castingSpell != undefined) {
          // Display spell stuff;
          player.onScreenDisplay.setActionBar(`§gSpell | [${castingSpell.name}§r§g]§r\n§d[Orbos (${world.scoreboard.getObjective("bw:oEnergy")?.getScore(player.scoreboardIdentity)}) | Fatigue (${(world.scoreboard.getObjective("bw:Fatigue")?.getScore(player.scoreboardIdentity)/10).toFixed(2)}%)]§r`);
          
          // Core Based Mods to Charge Time
          let core = item?.getDynamicProperty("bw:wandCore");
          if (core != undefined) {
            if (core == "minecraft:dragon_breath") {
              if (castingSpell.noun == "Sight") {
                castingSpell.cost.cooldown = 0.1;
              }
            }
          }
          
          // Actually do spell
          let charge = Math.ceil(castingSpell.cost.cooldown * 20);
          // 2 charge = 1 loop (approximately 0.2 seconds);
          
          if (charge == undefined) {
            charge = 14;
          }
          if (num != Math.round(charge/2)) {
            // Place for spell charging animation
            try {
              // Anims Stuff
            } catch (e) {
              continue;
            }
            continue;
          } else {
            player.setDynamicProperty("bw:spellCooldown", 0);
          }
          
          // Jungle Wand Aggression
          if (item.typeId == "bw:jungle_wand") {
            if (hasAspect(["abjuration"], item)) {
              if (diceRoll(1, 6, true) <= 1) {
                player.playSound("random.fizz", {
                  pitch: 0.65,
                  volume: 1.5
                });
                continue;
              }
            }
          }
          
          let spellSucceeded = castBWSpell(castingSpell, item, player);
      
          if (spellSucceeded) {
            player.dimension.playSound("mob.evocation_illager.cast_spell", player.location);
            
            // Play Finishing Animation
            if (item.getComponent("bw:wand_personality")) {
              let personality = item.getComponent("bw:wand_personality").customComponentParameters?.params;
              
              if (personality.self_casting) {
                let chance = 0.5;
                if (personality.self_casting.cast_chance != undefined) {
                  chance = personality.self_casting.cast_chance;
                }
                if (Math.random() <= chance) {
                  triggerSpellType(item, personality.self_casting, player);
                }
              }
            }
          }
        } else {
          player.onScreenDisplay.setActionBar(`Auto Parrying\n§d[Orbos (${world.scoreboard.getObjective("bw:oEnergy")?.getScore(player.scoreboardIdentity)}) | Fatigue (${(world.scoreboard.getObjective("bw:Fatigue")?.getScore(player.scoreboardIdentity)/10).toFixed(2)}%)]§r`);
          
          // Auto shield against bolt spells
          let checkCooldown = player.getDynamicProperty("bw:boltParryCooldown");
          if (checkCooldown != undefined) {
            let timeElapsed = Math.abs((checkCooldown - Date.now())/1000);
            if (timeElapsed < 3) {
              continue;
            } else {
              player.setDynamicProperty("bw:boltParryCooldown", undefined);
            }
          }
          
          let bolts = player.dimension.getEntities({ location: player.getHeadLocation(), maxDistance: 3.0, families: ["spell_bolt"], closest: 1 });
          
          if (bolts.length == 0 && bolts[0]?.getComponent("minecraft:projectile")) {
            return;
          }
          
          bolts.forEach(e => parryBolt(e, player, true));
        }
      } else {
        allPlayersCasting.delete(player.id);
        player.setDynamicProperty("bw:spellCooldown", undefined)
        continue;
      }
    }
  }
}, 2)

const velocity = 0.6;

export const faceVelocity = {
  "West": { x: -1, y: 1, z: 1 },
  "East": { x: -1, y: 1, z: 1 },
  "Up": { x: 1, y: -1, z: 1 }, 
  "Down": { x: 1, y: -1, z: 1 },
  "North": { x: 1, y: 1, z: -1 }, 
  "South": { x: 1, y: 1, z: -1 }
}

export const faceOffset = {
  "West": { x: -0.01, y: 0, z: 0 },
  "East": { x: 0.01, y: 0, z: 0 },
  "Up": { x: 0, y: 0.01, z: 0 }, 
  "Down": { x: 0, y: -0.01, z: 0 },
  "North": { x: 0, y: 0, z: -0.01 }, 
  "South": { x: 0, y: 0, z: 0.01 }
}

export function getSourceFromSpell(sourceInfo) {
  let source;
  if (sourceInfo.type == "entity") {
    source = world.getEntity(sourceInfo.sourceID);
    
    if (!source) {
      return false;
    }
  }
  if (sourceInfo.type == "jack") {
    source = world.getDynamicProperty(sourceInfo.sourceID);
    
    if (!source) {
      return false;
    } else {
      source = JSON.parse(source);
    }
  }
  
  return source;
}
export function deductOrbos(sourceInfo, wand, cost, useUpOrbos = true) {
  let source = getSourceFromSpell(sourceInfo);
  
  if (!source) {
    if (sourceInfo instanceof Entity) {
      source = sourceInfo;
      sourceInfo = {
        "type": "entity",
        "sourceID": source.id
      }
    } else {
      return false;
    }
  }
  
  let bool = true;
  if (sourceInfo.type == "entity") {
    let oE = world.scoreboard.getObjective("bw:oEnergy");
    let fatigue = world.scoreboard.getObjective("bw:Fatigue");
    
    let spellCost = reduceCost(wand, cost, source);
    
    if (source.hasTag("bw:witch_initiate")) {
      let orbosAmt = oE?.getScore(source);
      if (orbosAmt == undefined) {
        orbosAmt = 0;
      }
      if (orbosAmt >= spellCost[0]) {
        if (!useUpOrbos) {
          return bool;
        }
        oE.addScore(source, -spellCost[0])
        fatigue.addScore(source, spellCost[1]);
        /*
        if (diceRoll(1, 100, true) <= 60) {
          faeSpellTagDetection(source, cost.tags);
        }
        */
      } else {
        if (source instanceof Player) {
          source.sendMessage(`§dThis spell requires ${spellCost[0]} Orbos. You only have ${orbosAmt} Orbos.§r`)
        }
        bool = false;
      }
    } else {
      if (source instanceof Player) {
        source.sendMessage(`§c[!]§r There is a small stirring but nothing happens. There is something you are missing.`)
      }
      bool = false;
    }
  } else 
  if (sourceInfo.type == "jack") {
    let inLey = false;
    
    // If not in Leynexus at all;
    if (!inLey) {
      if (source.storedOrbos >= cost.occultEnergy) {
        if (!useUpOrbos) {
          return bool;
        }
        source.storedOrbos = source.storedOrbos - cost.occultEnergy;
        world.setDynamicProperty(sourceInfo.sourceID, JSON.stringify(source));
      } else {
        bool = false;
      }
    }
  }
  
  return bool;
}

export function spawnMagicCircle(dimension, position, direction, size, duration, color, circle_particle) {
  let molang = new MolangVariableMap();
  molang.setFloat("variable.circle_size", size);
  molang.setFloat("variable.life_time", duration);
  molang.setVector3("variable.facing", Vector3.normalize(direction));
  if (Array.isArray(color)) {
    molang.setColorRGBA("variable.color", color[Math.floor(color.length * Math.random())]);
  } else {
    molang.setColorRGBA("variable.color", color);
  }
  
  world.getDimension(dimension).spawnParticle(circle_particle, position, molang);
}

function calculatePointsAlongLine(locationA, locationB, numberOfPoints) {
  const points = [];
  for (let i = 0; i <= numberOfPoints; i++) {
    const t = i / numberOfPoints;
    const point = {
      x: locationA.x + (locationB.x - locationA.x) * t,
      y: locationA.y + (locationB.y - locationA.y) * t,
      z: locationA.z + (locationB.z - locationA.z) * t
    };
    points.push(point);
  }
  return points;
}

function drawGlyph(player, lineClass) {
  if (lineClass.points.length == 0) {
    return;
  }
  for (let point of lineClass.points) {
    let linePoints = calculatePointsAlongLine(point.begin, point.end, lineClass.frequency);
    for (let linePoint of linePoints) {
      linePoint = Vector3.add(player.getHeadLocation(), linePoint)
      let molang = new MolangVariableMap;
      if (lineClass.color != undefined) {
        molang.setColorRGB("variable.color", lineClass.color)
      }
      world.getDimension(lineClass.dimension).spawnParticle(lineClass.particle, linePoint, molang);
    }
  }
}

function addLine(lineClass, pos1, pos2, dir) {
  let obj = {
    begin: pos1,
    end: pos2,
    direction: dir
  }
  lineClass.points.push(obj)
  return lineClass;
}

function getLastLine(lineClass) {
  return lineClass.points[points.length-1]
}

function updateLastLine(lineClass, pos) {
  if (lineClass.points.length > 0) {
    lineClass.points[lineClass.points.length-1].end = pos;
  }
  return lineClass;
}

class SpellLine {
  constructor(dimension, visuals) {
    this.points = [];
    this.directions = [];
    this.lineDirection = "none";
    this.frequency = 8;
    this.dimension = dimension;
    this.particle = visuals.drawingParticle;
    this.color = visuals.color
  }
}

function stopCharge(id, player) {
  system.clearRun(id);
  player.setDynamicProperty("bw:drawCooldown", 0);
  player.setDynamicProperty("bw:drawRunNum", undefined);
}

function checkMovement(rot, errorSpace, sequence) {
  let bool = false;
  let direction = "";
  let dir = "";
  // If Sequence is defined, get the last input
  if (sequence != undefined) {
    sequence = JSON.parse(sequence);
    dir = sequence[sequence.length-1];
  }
  
  // A Downward Direction
  if (rot.x >= 0 + errorSpace || rot.x <= -180) {
    // A Rightward Direction
    if ((rot.y >= 0 + errorSpace && rot.y < 180) || (rot.y < -180 && rot.y >= -360)) {
      bool = true;
      if (dir != "DoRi") {
        direction = "DoRi";
      }
    } else
    // A Leftward Direction
    if ((rot.y <= 0 - errorSpace && rot.y > -180) || (rot.y > 180 && rot.y <= 360)) {
      bool = true;
      if (dir != "DoLe") {
        direction = "DoLe";
      }
    }
  } else
  
  // An Upward Direction
  if (rot.x <= 0 - errorSpace || rot.x >= 180) {
    if ((rot.y >= 0 + errorSpace && rot.y < 180) || (rot.y < -180 && rot.y >= -360)) {
      bool = true;
      if (dir != "UpRi") {
        direction = "UpRi";
      }
    } else
    if ((rot.y <= 0 - errorSpace && rot.y > -180) || (rot.y > 180 && rot.y <= 360)) {
      bool = true;
      if (dir != "UpLe") {
        direction = "UpLe";
      }
    }
  }
  return [bool, direction]
}

export function verifyFaePrivelege(spellFinder, player) {
  let spell = faerieSpells[spellFinder];
  if (spell?.faeSpirits == undefined) {
    return true;
  }
  
  let lesserFaeries = player.getDynamicProperty("bw:lessers");
  if (lesserFaeries != undefined) {
    lesserFaeries = JSON.parse(lesserFaeries)
  } else {
    lesserFaeries = []
  }
  let medianFaeries = player.getDynamicProperty("bw:medians");
  if (medianFaeries != undefined) {
    medianFaeries = JSON.parse(medianFaeries)
  } else {
    medianFaeries = []
  }
  let patronFaeries = player.getDynamicProperty("bw:patrons");
  if (patronFaeries != undefined) {
    patronFaeries = JSON.parse(patronFaeries)
  } else {
    patronFaeries = []
  }
  
  // All Medians & Greater Patrons are here.
  let faeries = lesserFaeries.concat(medianFaeries.concat(patronFaeries));
  
  if (faeries == undefined || faeries.length < 1) {
    return false;
  }
  for (let i = 0; i < faeries.length; i++) {
    faeries[i] = capitalize(faeries[i]);
  }
  if (spell.faeSpirits.singleFaeries != undefined) {
    for (let [key, value] of Object.entries(spell.faeSpirits.singleFaeries)) {
      if (faeries.includes(key)) {
        let foundFaery = JSON.parse(player.getDynamicProperty(`bw:${convertFaeName(key)}`))
        if (foundFaery.trust >= value) {
          return true;
        }
      }
    }
  }
  if (spell.faeSpirits.dualFaeries != undefined) {
    for (let duo of spell.faeSpirits.dualFaeries) {
      let checkMark = Object.entries(duo).length;
      let check = 0;
      for (let [key, value] of Object.entries(duo)) {
        if (faeries.includes(key)) {
          let foundFaery = JSON.parse(player.getDynamicProperty(`bw:${convertFaeName(key)}`))
          if (foundFaery.trust >= value) {
            check++;
          }
        }
      }
      if (check == checkMark) {
        return true;
      }
    }
  }
  return false;
}

function convert(rot) {
  let newRot = {
    x: Math.round(rot.x),
    y: Math.round(rot.y)
  }
  return newRot;
}

function generateUniqueId (length) {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    id += characters[randomIndex];
  }
  return id;
}

world.afterEvents.itemStartUse.subscribe(chargeSpell => {
  let item = chargeSpell.itemStack;
  let player = chargeSpell.source;
  
  if (item.hasTag("bw:castingWand")) {
    // Loyalty Aspect of Wand Personality
    if (item.getComponent("bw:wand_personality")) {
      let personality = item.getComponent("bw:wand_personality").customComponentParameters?.params;
      
      if (personality.loyalty) {
        let owner = getWandOwner(item);
        
        if (owner != undefined && owner != player.id) {
          if (personality.loyalty.backfireDmg > 0) {
            applySpellDamage(player, personality.loyalty.backfireDmg, "occult", 0);
          }
          
          if (personality.loyalty.owner_only) {
            player.dimension.playSound("random.explode", player.location);
            player.dimension.playSound("mob evocation_illager.cast_spell", player.location);
            return;
          }
        }
      }
    }
    
    if (!item.getDynamicProperty("bw:wand_id")) {
      item.setDynamicProperty("bw:wand_id", `${generateUniqueId(14)}`);
      player.getComponent("minecraft:inventory").container.setItem(player.selectedSlotIndex, item)
    }
  }
  
  if (player.isSneaking) {
    allPlayersDrawing.set(player.id, player);
  } else {
    allPlayersCasting.set(player.id, player);
  }
});

world.afterEvents.playerHotbarSelectedSlotChange.subscribe(hotbar => {
  let item = hotbar.itemStack;
  let slotIndex = hotbar.newSlotSelected;
  let previousIndex = hotbar.previousSlotSelected;
  let player = hotbar.player;
  
  
  let playerInv = player.getComponent("minecraft:inventory").container;
  let lastItem = playerInv.getItem(previousIndex);
  
  let condition = true
  if (!condition) {
    return;
  }
  
  let wand = player.getDynamicProperty("bw:wandSelected");
  
  if (wand == undefined) {
    if (item?.getDynamicProperty("bw:wand_id")) {
      player.setDynamicProperty("bw:wandSelected", item?.getDynamicProperty("bw:wand_id"));
      return;
    }
  } else {
    let id;
    for (let i = 0; i < 9; i++) {
      if (playerInv.getItem(i)?.getDynamicProperty("bw:wand_id") === wand) {
        id = i;
        break;
      }
    }
    
    if (id != undefined) {
      let wandItem = playerInv.getItem(id);
      wandItem.setDynamicProperty("bw:lastGlyph", slotIndex);
      player.setDynamicProperty("bw:wandSelected", undefined);
      playerInv.setItem(id, wandItem);
      
      let spellFound = findCustomSpellGlyph(wandItem.getDynamicProperty("bw:lastGlyph"), wandItem);
      if (spellFound != undefined) {
        player.onScreenDisplay.setActionBar(`§g[${spellFound.name}§r§g] selected.§r`);
      }
    } else {
      player.setDynamicProperty("bw:wandSelected", undefined);
    }
  }
});

world.afterEvents.itemStopUse.subscribe(stopSpell => {
  let item = stopSpell.itemStack;
  let playerSec = stopSpell.source;
  let offhand = playerSec.getComponent("equippable").getEquipment("Offhand");
  
  playerSec.setDynamicProperty("bw:xMov", undefined);
  playerSec.setDynamicProperty("bw:yMov", undefined);
  let drawingLines = playerSec.getDynamicProperty("bw:spellLinePoints");
  playerSec.setDynamicProperty("bw:spellLinePoints", undefined);
  if (playerSec.getDynamicProperty("bw:currentSpell") == undefined) {
    playerSec.setDynamicProperty("bw:currentSpell", playerSec.getDynamicProperty("bw:spellSequence"))
  }
  playerSec.setDynamicProperty("bw:spellSequence", undefined);
  
  playerSec.setDynamicProperty("bw:lookPoint", undefined);
  
  allPlayersDrawing.delete(playerSec.id)
  // Stop the animation HOPEFULLY
  playerSec.setDynamicProperty("bwAnimation:spell_drawing", undefined);
  playerSec.setDynamicProperty("bw:drawCooldown", undefined)
  allPlayersCasting.delete(playerSec.id)
  playerSec.setDynamicProperty("bw:spellCooldown", undefined)
  
  // Find the spell glyph
  let foundSpell = faeSpellArray[playerSec.getDynamicProperty("bw:currentSpell")];
  
  // Ensure the witch is pacted to the Faerie needed to perform this defined spell.
  if (verifyFaePrivelege(foundSpell, playerSec) && foundSpell != undefined) {
    // Get spell object from the master spell list
    foundSpell = faerieSpells[foundSpell];
    
    // Control the drawing of the glyphs
    if (item != undefined && item.hasTag("bw:castingWand") && drawingLines != undefined) {
      let draw = JSON.parse(drawingLines);
      draw.particle = foundSpell.symbol.particle
      draw.color = foundSpell.symbol.color
      
      if (draw.points.length > 0) {
        try {
          drawGlyph(playerSec, draw);
        } catch (e) {
          return;
        }
      }
    }
    
    
    // Controls the material components of a spell glyph.
    if (foundSpell.cost.components != undefined) {
      if (foundSpell.cost.components.inOffhand == undefined && !getItem(playerSec.getComponent("inventory").container, foundSpell.cost.components.item)) {
        playerSec.sendMessage(`§cYou need ${foundSpell.cost.components.itemMsg} to successfully perform this spell.§r`);
        return;
      }
      let plrOffhand = playerSec.getComponent("equippable").getEquipment("Offhand");
      if (foundSpell.cost.components.inOffhand) {
        if (plrOffhand == undefined || plrOffhand.typeId != foundSpell.cost.components.item) {
          playerSec.sendMessage(`§cYou need ${foundSpell.cost.components.itemMsg} in the offhand to successfully perform this spell.§r`);
          return;
        }
      }
    }
    // Check if the Witch has enough orbos available.
    let enoughOrbos = deductOrbos(playerSec, item, foundSpell.cost);
    // If not enough Orbos, return.
    if (!enoughOrbos) {
      return;
    }
    
    // Cast the found spell
    foundSpell.spellEffect(playerSec);
    // If the material component should not be kept, remove it from the Witch's inventory.
    if (foundSpell.cost.components != undefined && !foundSpell.cost.components.isKept) {
      removeItem(playerSec.getComponent("inventory"), foundSpell.cost.components.item)
    }
  }
  // Draw Glyph and reset currentSpell
  playerSec.setDynamicProperty("bw:currentSpell", undefined);
  if (drawingLines != undefined) {
    let draw = JSON.parse(drawingLines);
    if (draw.points.length > 0) {
      try {
        drawGlyph(playerSec, draw);
      } catch (e) {
        return;
      }
    }
  }
});

world.afterEvents.projectileHitBlock.subscribe(e => {
  let dimension = e.dimension;
  let missile = e.projectile;
  let caster = e.source;
  let block = e.getBlockHit().block
  let hitLoc = Vector3.add(Vector3.scale(e.hitVector,-1), block.center());
  
  if (missile == undefined) {
    return;
  }
  
  if (missile.typeId == "bw:flask_projectile") {
    let burstEffects;
    let burstColor;
    let burstFilter;
    try {
      burstEffects = JSON.parse(missile.getDynamicProperty("bwProj:potion"));
      burstFilter = missile.getDynamicProperty("bwProj:potion_filter");
      burstColor = JSON.parse(missile.getDynamicProperty("bwProj:potionColor"));
    } catch (e) {};
    if (burstEffects != undefined && burstColor != undefined) {
      let burst = new MolangVariableMap();
      burst.setFloat("variable.splash_range", 5);
      
      burst.setColorRGBA('variable.color', burstColor);
      dimension.spawnParticle("minecraft:splash_spell_emitter", hitLoc, burst);
      
      dimension.getEntities({location: missile.location, maxDistance:3}).forEach((e) => {
        if (burstFilter) {
          burstFilter = JSON.parse(burstFilter);
          if (!essenceCheck(e, burstFilter)) {
            return;
          }
        }
        
        for (let [effectName, effectValues] of Object.entries(burstEffects)) {
          if (effectValues.duration == 0) {
            effectValues.duration = 0.1
          } else {
            if (missile.getDynamicProperty("bw:fermented") != undefined) {
              let ferment = missile.getDynamicProperty("bw:fermented");
              
              effectValues.duration += Math.floor((ferment/2)*5);
            }
          }
          
          if (missile.getDynamicProperty("bw:fermented") != undefined) {
            let ferment = missile.getDynamicProperty("bw:fermented");
            
            let amp = Math.floor((ferment/10)*0.2);
            
            if (effectValues.amplifier == undefined) {
              if (amp > 0) {
                effectValues.amplifier = amp
              }
            } else {
              effectValues.amplifier += amp;
            }
          }
          e.addEffect(effectName, effectValues.duration*20, {showParticles: true, amplifier: effectValues.amplifier})
        }
      });
    }
    if (missile.isValid) {
      missile.remove();
    }
  }
});

world.afterEvents.projectileHitEntity.subscribe(e => {
  let dimension = e.dimension;
  let missile = e.projectile;
  let caster = e.source;
  let victim = e.getEntityHit().entity;
  
  if (missile == undefined) {
    return;
  }
  
  if (missile.typeId == "bw:flask_projectile") {
    let burstEffects;
    let burstFilter;
    let burstColor;
    try {
      burstEffects = JSON.parse(missile.getDynamicProperty("bwProj:potion"));
      burstFilter = missile.getDynamicProperty("bwProj:potion_filter");
      burstColor = JSON.parse(missile.getDynamicProperty("bwProj:potionColor"));
    } catch (e) {};
    if (burstEffects != undefined && burstColor != undefined) {
      let burst = new MolangVariableMap();
      burst.setFloat("variable.splash_range", 5);
      
      burst.setColorRGBA('variable.color', burstColor);
      dimension.spawnParticle("minecraft:splash_spell_emitter", missile.location, burst);
      
      dimension.getEntities({location: victim.location, maxDistance:3}).forEach((e) => {
        if (burstFilter) {
          burstFilter = JSON.parse(burstFilter);
          if (!essenceCheck(e, burstFilter)) {
            return;
          }
        }
        
        for (let [effectName, effectValues] of Object.entries(burstEffects)) {
          
          if (effectValues.duration == 0) {
            effectValues.duration = 0.1
          } else {
            if (missile.getDynamicProperty("bw:fermented") != undefined) {
              let ferment = missile.getDynamicProperty("bw:fermented");
              
              effectValues.duration += Math.floor((ferment/2)*5);
            }
          }
          
          if (missile.getDynamicProperty("bw:fermented") != undefined) {
            let ferment = missile.getDynamicProperty("bw:fermented");
            
            let amp = Math.floor((ferment/10)*0.2);
            
            if (effectValues.amplifier == undefined) {
              if (amp > 0) {
                effectValues.amplifier = amp
              }
            } else {
              effectValues.amplifier += amp;
            }
          }
          
          e.addEffect(effectName, effectValues.duration*20, {showParticles: true, amplifier: effectValues.amplifier})
        }
      });
    }
    if (missile.isValid) {
      missile.remove();
    }
  }
});