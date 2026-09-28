export const orbPondering = {
  "introduction": {
    "title": "Pondering Your Orb",
    "body": "There are many things that lurk within the glass of the Crystal Ball, and it is your job to find and ponder them. In this book, you'll put the Crystal Ball (crafted in the §aWitch's Workbench§r) to use, and learn the things others will not.\n\n",
    "buttons": [
      {
        "buttonName": "Prying Presence",
        "buttonIcon": "textures/items/essence/amethyst_nugget",
        "onClick": [
          {
            "type": "openForm",
            "form": "divination.future"
          }
        ]
      },
      {
        "buttonName": "The Games We Play",
        "buttonIcon": "textures/items/dusts/natural_ash",
        "onClick": [
          {
            "type": "openForm",
            "form": "divination.games"
          }
        ]
      },
      {
        "buttonName": "It That Pollutes",
        "buttonIcon": "textures/items/dusts/coal_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "divination.hexes"
          }
        ]
      },
      {
        "buttonName": "To Know Secrets",
        "buttonIcon": "textures/items/honeycomb",
        "onClick": [
          {
            "type": "openForm",
            "form": "divination.secrets"
          }
        ]
      },
      {
        "buttonName": "Dowsing Leynexuses",
        "buttonIcon": "textures/items/string",
        "onClick": [
          {
            "type": "openForm",
            "form": "divination.leylines"
          }
        ]
      },
      {
        "buttonName": "Of Other Methods",
        "buttonIcon": "textures/items/clock_item",
        "onClick": [
          {
            "type": "openForm",
            "form": "divination.lesser_ways"
          }
        ]
      },
    ]
  },
  
  // Seeing the Present Somewhere Else
  "divination.future": {
    "title": "Prying Presence",
    "body": "§oI was here. Now I am there, scrutinizing this place from above and below. Seeing what is a hundred blocks away from where I am as if in a dream...§r\n\nA Mystic Witch has a unique method of observing areas. By using Amethyst Nuggets (with a Location bound inside), they can interact with the Crystal Ball and \"appear\" there, watching all that happens within the area.\n\nBased on oral accounts, the Witch can only move upwards and downwards. Additionally, this state consumes Orbos per second. The further the distance, the more expensive this becomes. After 60 seconds, the observer wakes up back at their original position.\n\n",
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
  // Faery Games
  "divination.games": {
    "title": "The Games We Play",
    "body": "§oTo dance with the faeries is a wonderful and deadly thing. There is always a need for luck, patience and tenacity.§r\n\nCurious Witches often frolick with the Fae and play their cruel and unusual games in search of power and aid. This little divination spell picks at the chain that binds the player and provides them the details they ought not to forget again. Simply sprinkle a bit of §aNatural Ash§r on the Crystal Ball, and you will know what you must.\n\n",
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
  // Seeing Hexes
  "divination.hexes": {
    "title": "It That Pollutes",
    "body": "§oTo shy away from darkness is a foolish thing. How else will we see that which hides with the intent to harm us?§r\n\nHexes are very sticky things, and not even the best rituals guarantee that they will be vanquished. However, Divination can always discern the taint that it leaves behind. With a sprinkle of §6Coal Dust§r on the Crystal Ball, you can gain a sense for the amount of hexes currently on you.\n\n",
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
  // Knowing Secrets
  "divination.secrets": {
    "title": "To Know Secrets",
    "body": "§oTo know and to understand can be very different things. This is something to Know, but never to Understand.§r\n\n§aSecrets§r are pieces of Fae gossip that a Witch knows but must never understand. They have their use in the wagers of the Fae, and knowing how many you have is useful. Simply use a §aHoneycomb§r on the Crystal Ball to know.\n\n",
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
  // Other Ways
  "divination.lesser_ways": {
    "title": "Of Other Methods",
    "body": "§oThere are a million and one ways to do a very many things. It'd be best to learn at least a few.§r\n\nThere are other things that can be used to gather information.\n\nA §aClock§r can tell the time if used.\n\nA §aFae Bound Totem§r gives a variety of information about the faery that is connected to it.\n\n",
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
  // Dowsing Leylines
  "divination.leylines": {
    "title": "Dowsing Leynexuses",
    "body": "§oCuriosity is the root of discovery. Of course, many cats have died to it, but many more still have been brought back.§r\n\n§aLeynexuses§r are fonts of Orbos that provide powerful boosts to Orbos gathering. They are usually very invisible but by using a §cFermented Spider Eye§r on the Crystal Ball, you can glean their positions quite accurately.\n\n",
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