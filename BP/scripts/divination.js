import {world, MolangVariableMap, system, ItemStack, BlockPermutation, GameMode} from "@minecraft/server";
import {ActionFormData, ActionFormResponse, MessageFormData, ModalFormData} from "@minecraft/server-ui";
import {randomize, findFaery} from "./castRitual.js";
import {essenceInputs} from "./consumePotion.js";
import {inRange} from "./occultMagick.js";
import {FAE_GAMES, playKnock} from "./feyBargain.js";
import {abilityList} from "./familiars.js";
import {Vector3, Random} from "./VectorMath/index.js";

const MOON_PHASE_MSG = {
  0: "§b[!]§r Lady Moon is Full and brilliant in Her shine.",
  1: "§b[!]§r Lady Moon slowly covers Her face. Her light is waning, giving way to Waning Gibbous.",
  2: "§b[!]§r Lady Moon has turned halfway, and thus has marked the First Quarter.",
  3: "§b[!]§r The light has almost fully left Lady Moon's serene face. Thus marks the Waning Crescent.",
  4: "§b[!]§r Lady Moon grows dark and shadows grow vicious as she transitions into the New. Let it be known: The Moon has many Faces and this one is New.",
  5: "§b[!]§r There is a glimmer; light, at the corner of Lady Moon's shadowed form. Thus marks the Waxing Crescent.",
  6: "§b[!]§r Shadow and light caress Lady Moon's Face in equal parts, but Shadow knows Light will win. It is the Last Quarter.",
  7: "§b[!]§r Light has tugged its victory from Shadow, and Lady Moon is radiant once more. Shadow can only retreat further, as we reach the Waxing Gibbous.",
}

system.runInterval(() => {
  world.getPlayers({includeTags: ["bw:scrying"]}).forEach((peeker) => {
    if (peeker.getDynamicProperty("bw:scryOldLocation") != undefined) {
      let ballLocation = JSON.parse(peeker.getDynamicProperty("bw:scryOldLocation"));
      let scryLocation = JSON.parse(peeker.getDynamicProperty("bw:scryLocation"));
      let distanceCost = 1;
      
      if (peeker.getDynamicProperty("bw:scryDuration") != undefined) {
        let num = peeker.getDynamicProperty("bw:scryDuration")/20;
        
        if (peeker.getDynamicProperty("bw:scryDuration") % 20 == 0 && num > 0) {
          let orbos = world.scoreboard.getObjective("bw:oEnergy");
          
          if (orbos.getScore(peeker) >= distanceCost) {
            world.scoreboard.getObjective("bw:oEnergy").addScore(peeker, -distanceCost);
          } else {
            peeker.setDynamicProperty("bw:scryDuration", undefined)
          }
          
          peeker.onScreenDisplay.setActionBar(`§d[Orbos| ${orbos?.getScore(peeker)}]`);
        }
      }
      
      if (peeker.getDynamicProperty("bw:scryDuration") == undefined || peeker.getDynamicProperty("bw:scryDuration") < 0) {
        peeker.camera.fade({fadeColor: {red:0.637, blue:0.74, green:0.0}, fadeTime: {fadeInTime: 0, fadeOutTime: 0.5, holdTime: 0}});
        peeker.teleport(ballLocation.location, {dimension: world.getDimension(ballLocation.dimension), rotation: ballLocation.rotation});
        
        let mode = JSON.parse(peeker.getDynamicProperty("bw:scryGameMode"));
        if (mode == undefined) {
          mode = GameMode.Survival;
        }
        peeker.setGameMode(mode);
        peeker.setDynamicProperty("bw:scryGameMode", undefined);
        peeker.setDynamicProperty("bw:scryOldLocation", undefined);
        peeker.setDynamicProperty("bw:scryLocation", undefined);
        peeker.setDynamicProperty("bw:scryDuration", undefined);
        peeker.removeTag("bw:scrying");
        return;
      }
      
      if (inRange(scryLocation, peeker.getHeadLocation(), 15)) {
        let dur = peeker.getDynamicProperty("bw:scryDuration");
        if (dur == undefined) {
          dur = 1;
        }
        peeker.setDynamicProperty("bw:scryDuration", dur - 1);
      } else {
        peeker.setDynamicProperty("bw:scryDuration", undefined);
      }
    }
  });
}, 1);

function parseQuintFilter(filter) {
  let str = [];
  for (let [k, v] of Object.entries(filter)) {
    if (k == "quintessences") {
      continue;
    }
    
    let inputType = essenceInputs[k];
    if (inputType == "string") {
      str = str.concat({"text": `§l§g${k}§r\n`});
      for (let iV of v) {
        if (iV.startsWith("$")) {
          str = str.concat({"text": `-> §c${iV.slice(1)}§r\n`});
        } else {
          str = str.concat({"text": `-> §a${iV}§r\n`});
        }
      }
    }
    if (inputType == "bool") {
      str = str.concat({"text": `§l§g${k}§r: `});
      if (v) {
        str = str.concat({"text": `§atrue§r\n`});
      } else {
        str = str.concat({"text": `§cfalse§r\n`});
      }
    }
    if (inputType == "int") {
      str = str.concat({"text": `§l§g${k}§r `});
      if (v > 0) {
        str = str.concat({"text": `§a>=§r ${v}\n`});
      } else {
        str = str.concat({"text": `§a<=§r ${Math.abs(v)}\n`});
      }
    }
  }
  
  return str;
}
function tellQuintInfo(quint, witch) {
  const formData = new ActionFormData();
  let str = {rawtext: []};
  let contents = Object.keys(quint);
  
  if (quint.quintessences) {
    let qC = 1;
    str.rawtext.push({"text": `A creature must meet §gall§r of the Essence Criterias within AT LEAST one (1) of the following Quintessences:\n`});
    for (let q of quint.quintessences) {
      str.rawtext.push({"text": `-----(${qC})-----\n`});
      let result = parseQuintFilter(q);
      str.rawtext = str.rawtext.concat(result);
      str.rawtext.push({"text": `\n`});
      qC++;
    }
  }
  
  if (quint.quintessences == undefined || contents.length > 1) {
    str.rawtext.push({"text": `A creature must meet §gany§r of the Essence Criterias within the following Quintessence:\n`});
    let result = parseQuintFilter(quint);
    str.rawtext = str.rawtext.concat(result);
    str.rawtext.push({"text": `\n`});
  }
  
  formData.body(str);
  
  formData.show(witch).then(display => {
    if (display.canceled) {
      return;
    }
  })
}
function giveFamiliarInfo(witch, info) {
  const formData = new ActionFormData();
  formData.title(`${witch.name}'s Familiar`);
  let str = {rawtext: []};
  
  str.rawtext.push({"text": `§gFamiliar Type: §r`});
  str.rawtext.push({"translate": `entity.${info.spriteType.replace("minecraft:", "")}.name`});
  str.rawtext.push({"text": `\n`});
  
  str.rawtext.push({"text": `§gMood: §r${info.mood},\n`});
  
  if (info.moodTraits != undefined) {
    str.rawtext.push({"text": `§l§gMood Traits: §r`});
    for (let [m, v] of Object.entries(info.moodTraits)) {
      str.rawtext.push({"text": `\n - §d${m}§r (${v})`});
    }
    str.rawtext.push({"text": `\n`});
  }
  
  str.rawtext.push({"text": `§gLast Position: §r(${info.lastLocation.x}, ${info.lastLocation.y}, ${info.lastLocation.z}),\n`});
  
  str.rawtext.push({"text": `§gLast Dimension: §r${info.lastDimension},\n\n`});
  
  str.rawtext.push({"text": `§l§gAbilities: §r`});
  if (info.traits.genusAbility != undefined) {
    let ab = info.traits.genusAbility;
    if (abilityList[ab] != undefined) {
      str.rawtext.push({"text": `\n§l${ab}§r\n${abilityList[ab].description}`});
    }
  }
  if (info.traits.subfamilyAbilities != undefined) {
    let sA = info.traits.subfamilyAbilities;
    for (let a of sA) {
      if (abilityList[a] != undefined) {
        str.rawtext.push({"text": `\n§l${a}§r\n${abilityList[a].description}\n`});
      }
    }
  }
  str.rawtext.push({"text": `\n`});
  
  
  
  // str.rawtext.push({"text": `${JSON.stringify(info)}`})
  formData.body(str);
  
  formData.show(witch).then(display => {
    if (display.canceled) {
      return;
    }
  })
}
function initiateScry(witch, nugget) {
  if (!nugget.getDynamicProperty("bw:savedLocation")) {
    witch.sendMessage(`§c[!]§r No location is saved to this Amethyst Nugget.`)
    return;
  }
  
  if (!world.isHardcore) {
    let loc = JSON.parse(nugget.getDynamicProperty("bw:savedLocation"));
    
    witch.setDynamicProperty("bw:scryLocation", nugget.getDynamicProperty("bw:savedLocation"));
    witch.setDynamicProperty("bw:scryOldLocation", JSON.stringify({
      dimension: witch.dimension.id,
      location: witch.location,
      rotation: witch.getRotation()
    }));
    witch.setDynamicProperty("bw:scryGameMode", JSON.stringify(witch.getGameMode()));
    witch.setDynamicProperty("bw:scryDuration", 90*20);
    witch.setGameMode(GameMode.Spectator);
    witch.camera.fade({fadeColor: {red:0.637, blue:0.74, green:0.0}, fadeTime: {fadeInTime: 0, fadeOutTime: 0.5, holdTime: 0}});
    witch.teleport(loc, {facingLoc: {x: 0, y: -1, z: 0}});
    witch.addTag("bw:scrying");
  } else {
    witch.sendMessage("You reach forward with your mind... and see nothing.")
    return;
  }
}

system.beforeEvents.startup.subscribe(initEvent => {
    initEvent.blockComponentRegistry.registerCustomComponent('bw:prophecy', {
        onPlayerInteract: evt => {
          let ball = evt.block;
          let player = evt.player;
          let playerInv = player.getComponent('inventory').container
          let item = playerInv.getItem(player.selectedSlotIndex)
          
          if (item == undefined) {
            player.sendMessage(`§d[Orbos (${world.scoreboard.getObjective("bw:oEnergy")?.getScore(player.scoreboardIdentity)}) | Fatigue (${(world.scoreboard.getObjective("bw:Fatigue")?.getScore(player.scoreboardIdentity)/10).toFixed(2)}%)]§r`);
            return;
          }
          
          // Scrying
          if (item != undefined && item.typeId == "bw:amethyst_nugget") {
            initiateScry(player, item);
          }
          
          // Check for Fae Game
          if (item != undefined && item.typeId == "bw:natural_ash") {
            if (player.getDynamicProperty("bw:faeryGame") != undefined) {
              let faeGame = JSON.parse(player.getDynamicProperty("bw:faeryGame"));
              let faery = findFaery(faeGame.faeryId);
              let game = FAE_GAMES[faeGame.gameId]
              if (faeGame.gameId == "joyful_frolick") {
                player.sendMessage(game.description(player.dimension, player.location, faeGame));
                player.sendMessage(`You have until Day ${faeGame.finishDay} at the waking of Dawn.\n\nYou have ${faeGame.finishDay - world.getDay()} day(s) left.`);
              }
              if (faeGame.gameId == "helpful_gardener") {
                player.sendMessage(game.description(player.dimension, player.location, faeGame));
                
                player.sendMessage(`You've have ${game.planted} seeds left to plant and ${game.harvested} pests to kill and harvest. You have until Day ${faeGame.finishDay} at the waking of Dawn.\n\nYou have ${faeGame.finishDay - world.getDay()} day(s) left.`);
              }
              if (faeGame.gameId == "flower_picking") {
                player.sendMessage(game.description(player.dimension, player.location, faeGame));
                
                player.sendMessage(`You have until Day ${faeGame.finishDay} at the waking of Dawn.\n\nYou have ${faeGame.finishDay - world.getDay()} day(s) left.`);
              }
              if (faeGame.gameId == "who_is_here") {
                player.sendMessage(game.description(player.dimension, player.location, faeGame));
                player.sendMessage(`You have until Day ${faeGame.finishDay} at the waking of Dawn.\n\nYou have ${faeGame.finishDay - world.getDay()} day(s) left.`);
                playKnock(player, faeGame.passCode, true);
              }
            } else {
              player.sendMessage("You are not a pawn in any Faery Game at the moment.")
            }
          }
          
          // Check for Hexes
          if (item != undefined && item.typeId == "bw:coal_dust") {
            let hexes = player.getDynamicProperty("bw:hexPool");
            if (hexes != undefined) {
              hexes = JSON.parse(hexes);
              let hexAmount = hexes.length;
              if (hexAmount > 0) {
                for (let h of hexes) {
                  console.warn(`${h} ${player.getDynamicProperty(h)}`)
                }
                player.sendMessage(`§d[!]§r You are plagued by ${hexAmount} hex(es)! To remove them, you can try cleansing rituals or counter hexes.`)
              } else {
                player.sendMessage("§a[!]§r There is no hex or curse that plagues you.");
              }
            } else {
              player.sendMessage("§a[!]§r There is no hex or curse that plagues you.");
            }
          }
          
          // Check Amt of Secrets
          if (item != undefined && item.typeId == "minecraft:honeycomb") {
            let secrets = player.getDynamicProperty("bw:secrets");
            
            if (secrets != undefined) {
              player.sendMessage(`§d[!]§r You have ${secrets} Secrets. Don't use them all in one place!`)
            } else {
              player.sendMessage("§a[!]§r What Secrets is one such as yourself supposed to know?");
            }
          }
          
          // Check Coven
          if (item != undefined && item.typeId == "minecraft:copper_chain") {
            let coven = player.getDynamicProperty("bw:coven");
            
            if (coven != undefined) {
              let covenInfo = world.getDynamicProperty("covenID:"+coven);
              
              if (covenInfo != undefined) {
                covenInfo = JSON.parse(covenInfo);
                if (covenInfo.creator == player.id) {
                  player.sendMessage(`§d[!]§r You are the High Witch of the coven, ${coven}. It currently has ${covenInfo.members} recorded members.`)
                } else {
                  player.sendMessage(`§d[!]§r You are a Coven Witch of the coven, ${coven}. It currently has ${covenInfo.members} recorded members.`);
                }
              } else {
                player.getDynamicProperty("bw:coven", undefined);
                player.sendMessage("§d[!]§r The coven you were once apart of has been disbanded.");
              }
            } else {
              player.sendMessage("§d[!]§r You are not affiliated with any coven.");
            }
          }
          
          // Check Moon Phase
          if (item != undefined && item.typeId == "bw:lunar_imbued_quartz") {
            if (ball.dimension.id == "minecraft:overworld") {
              let msg = MOON_PHASE_MSG[world.getMoonPhase()];
              player.sendMessage(msg);
            } else {
              player.sendMessage(`§c[!]§r This dimension has no moon.`)
            }
          }
          
          // Check Quintessence
          if (item != undefined && item.getDynamicProperty("bw:quintessence")) {
            let quint = JSON.parse(item.getDynamicProperty("bw:quintessence"));
            
            tellQuintInfo(quint, player);
          }
          
          // Check Familiar Trinket
          if (item != undefined && item.getComponent("bw:familiar_container")) {
            let familiar = item.getDynamicProperty("bw:savedFamiliar");
            
            if (familiar) {
              let familiarProperty = `bw:isFamiliar_${familiar}_${player.id}`;
              
              if (world.getDynamicProperty(familiarProperty) == undefined) {
                player.sendMessage(`§c[!]§r You are not the owner of the Familiar contained within this Trinket.`);
                return;
              }
              
              let fInfo = JSON.parse(world.getDynamicProperty(familiarProperty));
              giveFamiliarInfo(player, fInfo);
            }
          }
        }
    });
});