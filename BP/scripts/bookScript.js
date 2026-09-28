import {ActionFormData, ActionFormResponse, MessageFormData, ModalFormData} from "@minecraft/server-ui";
import {world, system} from "@minecraft/server";
import {verifyPatron} from "./altars.js";

function doAction(action, player, book, key) {
  let playerName = player.nameTag;
  for (let i = 0; i < action.length; i++){
    switch (action[i].type) {
      case "sayInfo": {
        player.sendMessage(action[i].info);
        break;
      }
      case "addTag": {
        player.addTag(action[i].tag);
        break;
      }
      case "removeTag": {
        player.removeTag(action[i].tag);
        break;
      }
      case "giveXP": {
        player.addExperience(action[i].amount);
        break;
      }
      case "openForm": {
        triggerBook(action[i].form, player, book, key);
        break;
      }
    }
  }
}

export function checkPlayerTags(tags, player) {
  if (tags == undefined) { return true; }
  for (let i of tags) {
    if (!player.hasTag(i)) {
      return false;
    }
  }
  return true;
}

export function checkPlayerPatron(fae, player) {
  if (fae == undefined) { return true; }
  for (let i of fae) {
    if (!verifyPatron(player, i)) { return false; }
  }
  return true;
}

export function excludePlayerTags(tags, player) {
  if (tags == undefined) { return true; }
  for (let i of tags) {
    if (player.hasTag(i)) { return false; }
  }
  return true;
}

// Opens a specific book and find a particular page then display it to the player.
export function triggerBook(info, player, book, key) {
  let chapter = book[info];
  
  if (!chapter) {
    console.warn("Chapter doesn't exist!");
  }
  
  const lexicon = new ActionFormData();
  let title = chapter.title;
  let body = "";
  
  if (Array.isArray(chapter.body)) {
    for (let line of chapter.body) {
      if (body == "") {
        body = body.concat(`${line}`);
      } else {
        body = body.concat(`\n${line}`);
      }
    }
  } else {
    body = chapter.body;
  }
  
  // /-Text/_ (Tag Hidden)
  // #-Text#_ (Faerie Hidden)
  if (chapter.obfuscated) {
    if (!checkPlayerTags(chapter.obfuscated.tagException, player)) {
      title = chapter.title.replaceAll('/_', '§r').replaceAll('/-', '§k');
      body = chapter.body.replaceAll('/_', '§r').replaceAll('/-', '§k');
    } else {
      title = chapter.title.replaceAll('/_', '').replaceAll('/-', '');
      body = chapter.body.replaceAll('/_', '').replaceAll('/-', '');
    }
    if (!checkPlayerPatron(chapter.obfuscated.patronException, player)) {
      title = chapter.title.replaceAll('#_', '§r').replaceAll('#-', '§k');
      body = chapter.body.replaceAll('#_', '§r').replaceAll('#-', '§k');
    } else {
      title = chapter.title.replaceAll('#_', '').replaceAll('#-', '');
      body = chapter.body.replaceAll('#_', '').replaceAll('#-', '');
    }
  }
  
  if (body.includes("{playerName}")) {
    body = body.replaceAll("{playerName}", player.name);
  }
  
  lexicon.title(title);
  lexicon.body(body);
  
  let buttons = chapter.buttons;
  let validButtons = [];
  for (let b of buttons) {
    if (checkPlayerTags(b.buttonTagRequirements, player) && excludePlayerTags(b.excludeTags, player)) {
      validButtons.push(b);
    }
  }
  for (let btn of validButtons) {
    let hasIcon = ![undefined, ""].includes(btn.buttonIcon);
    lexicon.button(btn.buttonName, hasIcon ? btn.buttonIcon : null);
  }
  
  lexicon.show(player).then(display => {
    if (display.canceled) {
      player.setDynamicProperty(`${key}`, info);
      return;
    }
    if (display.selection != undefined) {
      if (validButtons[display.selection].onClick == undefined) {
        player.setDynamicProperty(`${key}`, info);
        return;
      }
      doAction(validButtons[display.selection].onClick, player, book, key);
      return;
    }
  });
}