export const covenRites = {
  "introduction": {
    "title": "Mysticism of the Collective",
    "body": "The Bewitching Art does not need to be a solitary practice. In the past, communities of witches thrived because of the abundance of resources and knowledge that came with practicing magick together.\n\nAt present, this kind of communal witchcraft has dwindled greatly; however, I hope that this book rekindles just a little bit of this ancient practice. After all, it only takes a spark to create a blazing fire.\n\n",
    "buttons": [
      {
        "buttonName": "Ceremonies of the Coven",
        "buttonIcon": "textures/items/chain",
        "onClick": [
          {
            "type": "openForm",
            "form": "covenRituals.frontPage"
          }
        ]
      }
    ]
  },
  
  // Coven Rituals
  "covenRituals.frontPage": {
    "title": "Ceremonies of the Coven",
    "body": "A collective of Witches is considered a §aCoven§r (where magi are involved, it is considered a §aCovenant§r). Ideally, a Coven is bound under the blessing of Hebaya so that the §aHigh Witch§r can manage its affairs through various rituals.\n\nBelow, the various ceremonies associated with Covens are explained.\n\n",
    "buttons": [
      {
        "buttonName": "Binding of the Coven",
        "buttonIcon": "textures/items/chain",
        "onClick": [
          {
            "type": "openForm",
            "form": "covenRituals.binding"
          }
        ]
      },
      {
        "buttonName": "Growth of the Coven",
        "buttonIcon": "textures/items/bonemeal",
        "onClick": [
          {
            "type": "openForm",
            "form": "covenRituals.growth"
          }
        ]
      },
      {
        "buttonName": "Withering of the Coven",
        "buttonIcon": "textures/blocks/wither_rose",
        "onClick": [
          {
            "type": "openForm",
            "form": "covenRituals.withering"
          }
        ]
      },
      {
        "buttonName": "Dissolution of the Coven",
        "buttonIcon": "textures/items/chalk/white_chalk",
        "onClick": [
          {
            "type": "openForm",
            "form": "covenRituals.dissolution"
          }
        ]
      },
      {
        "buttonName": "Establishing the Sacred Grounds",
        "buttonIcon": "textures/block/birch_sapling",
        "onClick": [
          {
            "type": "openForm",
            "form": "covenRituals.covenGrounds"
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
  "covenRituals.binding": {
    "title": "Binding of the Coven",
    "body": "§aRitual Items:§r Chain (Named), Natural Ash & Ender Crystal\n§aFormation:§r Mark of Hebaya\n§aOrbos Cost:§r 1300\n§aFatigue:§r §6Mid§r\n§aRitual Type:§r Binding, Esoteric\n\n§oAn ancient rite used to establish a Coven. If it works, the ritualist becomes the High Witch of a Coven that only they are a member of. §aThe name of the chain becomes the name of the Coven.§r§o§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "covenRituals.frontPage"
          }
        ]
      }
    ]
  },
  "covenRituals.growth": {
    "title": "Growth of the Coven",
    "body": "§aRitual Items:§r Chain, Bottle o' Blood (Target), Lunar Crystal & Ender Crystal\n§aFormation:§r Mark of Hebaya\n§aOrbos Cost:§r 300\n§aFatigue:§r §2Low§r\n§aRitual Type:§r Binding, Esoteric\n\n§oThis is an important ritual of any Coven. It allows a §aHigh Witch§r§o to invite new members into their Coven. Of course, other witches can accept or deny these requests. Additionally, normal mobs can be added to the Coven so long as they have a name.§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "covenRituals.frontPage"
          }
        ]
      }
    ]
  },
  "covenRituals.withering": {
    "title": "Withering of the Coven",
    "body": "§aRitual Items:§r Chain, Bottle o' Blood (Target), Solar Crystal & Ender Crystal\n§aFormation:§r Mark of Hebaya\n§aOrbos Cost:§r 300\n§aFatigue:§r §2Low§r\n§aRitual Type:§r Binding, Esoteric\n\n§oThis is an important ritual of any Coven. It allows a §aHigh Witch§r§o to evict members from their Coven. This goes for any entity within the Coven; however, they must be online or valid to be evicted.§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "covenRituals.frontPage"
          }
        ]
      }
    ]
  },
  "covenRituals.dissolution": {
    "title": "Dissolution of the Coven",
    "body": "§aRitual Items:§r Chain, Natural Ash, Iron Sword, Ender Crystal\n§aFormation:§r Mark of Hebaya\n§aOrbos Cost:§r 500\n§aFatigue:§r §6Mid§r\n§aRitual Type:§r Binding, Esoteric\n\n§oThis rite allows a §aHigh Witch§r§o to disband their Coven, unbinding them as a collective.§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "covenRituals.frontPage"
          }
        ]
      }
    ]
  },
  "covenRituals.covenGrounds": {
    "title": "Establishing the Sacred Grounds",
    "body": "§aRitual Items:§r Chain, Natural Ash, Crushed Dandelion (Named), Ender Crystal\n§aFormation:§r Mark of Hebaya\n§aOrbos Cost:§r 1000\n§aFatigue:§r §6Mid§r\n§aRitual Type:§r Binding, Esoteric, Conjuration\n\n§oThis rite allows a §aHigh Witch§r§o to bind a location (defined by the name on Crushed Dandelion) as their Coven's Sacred Grounds. This is where Coven Members are conjured when coven based conjuration magic is used.\n\nThey are considered \"Sacred/Coven Grounds\" because Covens tend to set up powerful Wards around this area and may serve as a Coven's base of operations or meeting grounds.§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "covenRituals.frontPage"
          }
        ]
      }
    ]
  },
}