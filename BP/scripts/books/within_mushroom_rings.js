export const within_mushroom_rings = {
  "introduction": {
    "title": "Within Mushroom Rings",
    "body": "You have likely survived the Faerie Games of those children; the Lesser Fae. They truly do not mean any harm by their little games, but this is a lesson.\n\nDealing with the Fae is a dangerous affair for Witches. We rarely consider your feelings, similar to how you would rarely consider a Villager's. I suppose it is because our quality of life is alot... broader.\n\nHowever, there are ways for us to cooperate and empower your general quality of life. In fact, I personally find it quite fun.\n\n",
    "buttons": [
      {
        "buttonName": "Fae Rites",
        "buttonIcon": "textures/book_icons/rune_celestia",
        "onClick": [
          {
            "type": "openForm",
            "form": "faeRites.frontPage"
          }
        ]
      },
      {
        "buttonName": "Fae Hierarchy",
        "buttonIcon": "textures/items/gold_chestplate",
        "onClick": [
          {
            "type": "openForm",
            "form": "hierarchy.frontPage"
          }
        ]
      },
      {
        "buttonName": "Offerings",
        "buttonIcon": "textures/items/apple",
        "onClick": [
          {
            "type": "openForm",
            "form": "offerings.frontPage"
          }
        ]
      },
      {
        "buttonName": "What's Next?",
        "buttonIcon": "textures/items/essence/raw_orbos",
        "onClick": [
          {
            "type": "openForm",
            "form": "whatsNext?"
          }
        ]
      }
    ]
  },
  
  "faeRites.frontPage": {
    "title": "Fae Rites",
    "body": "You have already communed with the lesser children of the Wylde and you have played their game, so you already know of the Rite of Faerie Commune. This ritual opens you up to the influences from Lesser Faeries, allowing you to be chosen by one among their ranks. They will wager a Faerie Game (a well kept faerie practice) and seek consent from you. Drinking Water refuses the game, while drinking Honey accepts it.\n\nIf you win the Wager, the Faerie is obligated to provide you with a Glyph or two. These are useful for Spell Weaving. If you lose the Wager, the Faerie takes something away from you. This could be a random item or a random aspect of yourself. It really depends on what side of the Eternal Forests the child winning the Wager wakes up on on that day/night/twlight.\n\nIn the case of you winning, an entry will automatically be added to the Faerie Grimoire, a mystical book that should be crafted if you plan to constantly deal with the Fae. This entry will let you be aware of how much Trust the Faerie has placed in you, as well as things like their preferred offerings, favored times, and other things that the Faerie likes or dislikes. You cannot mess it up, and if you did, don't worry, you didn't. The Faerie Grimoire and the various magicks that bind it together were verified by me.\n\nFinally, the Rite of Severed Bonds is used to break Faerie pacts. By doing this, you lose any glyphs you gained from the Faerie you are parting ways with, as well as any benefits you were priveliged to have through your partnership.\n\nThese rites can be found quite easily in Ceremonialis Adeptus.\n\n",
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
  
  "hierarchy.frontPage": {
    "title": "Fae Hierarchy",
    "body": "I could go on and on about the intricacies of Faerie politics but I will not. I'll leave that to any Witch practiced and talented in the mysterious arts of history and its documentation.\n\nIn reality, all you NEED to know is that there are three Wylde Courts: Solar, Lunar, and Twilight. When communing with the Fae, the Court a Faerie belongs to will determine the time when you have a chance of recieving their attention.\n\nAs for the Factions within these Courts, you may naturally gain a map of the political landscape of the Wylde as you make offerings to the Lesser Fae.\n\n",
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
  
  "offerings.frontPage": {
    "title": "Offerings",
    "body": "In the grand scheme of Faerie Magicks, offerings are important. They are the gifts offered to the Fae in return for their Trust and time should be taken to make them. Keep in mind though, they can only be made once per day so make sure it counts.\n\nFor Lesser Faeries, offerings can be made at a Lit Campfire. After throwing the items being offered around it, you simply interact with the campfire using the Faerie Grimoire. Naturally, the items offered will vanish and your Faerie \"friend\" will either like the offerings, dislike them or have no strong feelings towards them.\n\nHow do the Lesser Faerie understand who these offerings are for though? That is simple; when you read an entry in the Faerie Grimoire, the Grimoire will serve as a compass that points to the Faerie that entry is about. Because of this, using the Faerie Grimoire to complete this minor ritual will send the offerings to the §alast read about§r Lesser Faerie. Offerings made during their Favored Times are naturally amplified, so making your offerings during these times is recommended.\n\n\nFor Faeries of a higher standing, §aAltars§r are necessary. I have seen mighty altars of such Wylde Alignment that they warp the environment around them, bringing them closer to the Faerie dimension. However, these arts have truly been lost to the witches of modern day.\n\nIn your case, you will simply need a candle or two, and the favored blocks of the high standing Faerie you are trying to contact. Favored Times do not exist for us, majorly because a portion of our conciousness is constantly watching those who beseech us through Offering.\n\nIn regards to contacting high standing Faeries, known to your kind as Median Faeries and Greater Faeries, you will need to forge your connections with the Lesser Faerie below them and assimilate yourself with their Court subtly. Through frequent Offerings, you will gain the qualifications and recieve dream whispers and gossip about how to contact Medians, and by gaining high Trust with a Median, you naturally gain the qualification to commune with their Greater Faerie.\n\nThere is one constant though: make sure to use §aflower dusts§r to interact with the candle that serves as the center of the altar. If a valid offering is on the candle, it will be accepted and the consequences will soon follow.\n\nBe warned: The Lesser Faerie are not the most intrusive in the lives of their Witch but that isn't the case for a good number of the Median and Greater Faerie. There is a reason why Dryasian Witches are careful around the breaking of logs and are in constant opposition to the idea of wanton deforestation.\n\nTip: Among my Court, there is a little bookish fellow that enjoys watching those interested in the Bewitched Art. As he is Twilight, you will only ever gain his attention during the hours bound to dusk and dawn, but he favors dusk. He is my most stalwart Faerie Lesser and I adore his presence. If I wasn't being clear, that is a warning.\n\n",
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
  
  "whatsNext?": {
    "title": "What's Next?",
    "body": "The major benefit of communing with the Fae is the Glyphs we provide you with. They are little fragments of our powers that we are legally obligated to provide because of this specific clause in our magickal contracts.\n\nHowever, most are just that, fragments of power, and so they must be shaped into something you can use. This is where you, the witch, have a level of control over the mystical effects that you can evoke on the go. This is the true essence of Spell Weaving.\n\nYour next step lies within the confines of §aMystica Artificiosa§r, where you will learn of the Mystic Circle, how to approach glyph casting, spell creation, and the binding of created spells onto Wands.\n\n",
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