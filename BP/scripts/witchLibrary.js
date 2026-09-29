import { world, system, ItemStack, ItemLockMode } from "@minecraft/server";
import { ActionFormData, ActionFormResponse, ModalFormData } from "@minecraft/server-ui";
import { triggerBook, checkPlayerTags } from "./bookScript.js";

// Books
import { mundane_fundamentals, wands_book, divination_book } from "./books/beginner_stuff.js";
import { alchemy_book, primal_cookbook } from "./books/alchemy_stuff.js";
import { ceremony_book } from "./books/ceremonies.js";
import { jackBook } from "./books/jackBooks.js";

const allBooks = {
  "mundane_fundamentals": mundane_fundamentals,
  "wands_book": wands_book,
  "divination_book": divination_book,
  "alchemy_book": alchemy_book,
  "primal_cookbook": primal_cookbook,
  "ceremony_book": ceremony_book,
  "jack_o_ward_book": jackBook
}

world.afterEvents.itemUse.subscribe(e => {
  const item = e.itemStack;
  const player = e.source;

  // Add support for glyphbooks
  if (item.getComponent("bw:readable_book")) {
    let book_stuff = item.getComponent("bw:readable_book")?.customComponentParameters?.params;

    if (book_stuff) {
      let key = player.getDynamicProperty(book_stuff.key_property);

      if (!key) {
        key = book_stuff.default_page;
      }

      triggerBook(key, player, allBooks[book_stuff.volume], book_stuff.key_property);
    }
  }
});