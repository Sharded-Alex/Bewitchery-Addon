export const ritesGuide = {
  "introduction": {
    "title": "Everyday Rites & Rituals",
    "body": "There are a few ceremonies that can be performed by anyone (aside from Magi). Unlike §aadept ceremonies§r, these rites do not §oneed§r Orbos\n- Fatigue to function and can be substituted with §aexperience§r. Most are quite minor by the standards of witchy progression but they can still come in handy. After all, having a good foundation in ceremonial magicks is always good for a beginning witch.\n\n",
    "buttons": [
      {
        "buttonName": "Occult Ceremonies",
        "buttonIcon": "textures/items/chalk/white_chalk",
        "onClick": [
          {
            "type": "openForm",
            "form": "ceremony.rites"
          }
        ]
      },
    ]
  },
  
  "ceremony.rites": {
    "title": "Occult Ceremonies",
    "body": "This chapter is a list of rites known to work for the §auninitiated Witch§r. Understand that this list does not hold every rite, only the ones relevant to this book.\n\n",
    "buttons": [
      {
        "buttonName": "Blessing of Rain",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "list.summonRain"
          }
        ]
      },
      {
        "buttonName": "Clearing of the Clouds",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "list.banishRain"
          }
        ]
      },
      {
        "buttonName": "Howling of the Aerials",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "list.summonThunder"
          }
        ]
      },
      {
        "buttonName": "Lesser Rite of Cleansing",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "list.lesserCleanse"
          }
        ]
      },
      {
        "buttonName": "Greater Rite of Cleansing",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "list.greaterCleanse"
          }
        ]
      },
      {
        "buttonName": "Rite of Malicious Reflection",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "list.reflection"
          }
        ]
      },
      
      {
        "buttonName": "Equin's Heralding of Autumn",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "list.autumnHerald"
          }
        ]
      },
      {
        "buttonName": "Exchanging of the Minerals",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "list.mineralExchange"
          }
        ]
      },
      
      {
        "buttonName": "Safe Returns of the Adventurer",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "list.totemSpawn"
          }
        ]
      },
      {
        "buttonName": "Safe Returns of the Witch",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "list.totemCoven"
          }
        ]
      },
      {
        "buttonName": "Safe Returns of the Traveler",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "list.totemTravel"
          }
        ]
      },
      {
        "buttonName": "Release of the Bound Totem",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "list.totemFree"
          }
        ]
      },
      
      {
        "buttonName": "Bestow the Sacred Name",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "list.nameBestowal"
          }
        ]
      },
      {
        "buttonName": "Protection Against Malevolence",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "list.protection"
          }
        ]
      },
      {
        "buttonName": "Rite of Shattered Barriers",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "list.protectionBreak"
          }
        ]
      },
      {
        "buttonName": "Rite of Mystic Ascension",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "list.ascension"
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
  
  "list.summonRain": {
    "title": "Blessing of Rain",
    "body": "§aRitual Items:§r\n- Crushed Cornflower\n- Crushed Fern\n- Sky Crystal\n- Lunar Crystal\n- Water Bottle\n§aRequirements:§r Clear Weather\n§aFormation:§r Spiral of Urrican\n§aOrbos Cost:§r 50\n§aFatigue:§r §2Low§r\n§aRitual Type:§r Weather, Water, Conjuration\n\n§oA rite designed to call down pouring rain by requesting aid from the Aerials.§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "ceremony.rites"
          }
        ]
      }
    ]
  },
  "list.banishRain": {
    "title": "Clearing of the Clouds",
    "body": "§aRitual Items:§r\n- Crushed Oxeye Daisy\n- Crushed Fern\n- Sky Crystal\n- Solar Crystal\n- Sunflower\n§aRequirements:§r Bad Weather\n§aFormation:§r Spiral of Urrican\n§aOrbos Cost:§r 35\n§aFatigue:§r §2Low§r\n§aRitual Type:§r Weather, Conjuration\n\n§oA ceremony that banishes rain and thunderstorms.§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "ceremony.rites"
          }
        ]
      }
    ]
  },
  "list.summonThunder": {
    "title": "Howling of the Aerials",
    "body": "§aRitual Items:§r\n- Copper Ingot\n- Crushed Fern\n- Sky Crystal\n- Crushed Dandelion\n- Crushed Cornflower\n§aRequirements:§r Clear or Rainy weather but not in a thunderstorm.\n\n§aFormation:§r Spiral of Urrican\n§aOrbos Cost:§r 50\n§aFatigue:§r §2Low§r\n§aRitual Type:§r Weather, Fire, Water, Conjuration\n\n§oA powerful rite that incites anger and rage in the surrounding Aerials, causing a large thunderstorm to take form.§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "ceremony.rites"
          }
        ]
      }
    ]
  },
  "list.lesserCleanse": {
    "title": "Lesser Rite of Cleansing",
    "body": "§aRitual Items:§r\n- Crushed Oxeye Daisy\n- Bottle O' Blood (Target)\n- Solar Crystal\n- Milk Bucket\n§aFormation:§r Circle of Duality\n§aOrbos Cost:§r 60\n§aFatigue:§r §2Low§r\n§aRitual Type:§r Esoteric, Abjuration\n\n§oA minor rite used to banish hexes and curses. It also removes any potion effects on the target of the ritual (defined by the Blood provided). However, it is not a fool-proof method. Maladies are stickier than you think.§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "ceremony.rites"
          }
        ]
      }
    ]
  },
  "list.greaterCleanse": {
    "title": "Greater Rite of Cleansing",
    "body": "§aRitual Items:§r\n- Glowstone Dust\n- Diamond\n- Bottle O' Blood (Target)\n- Solar Crystal\n- Milk Bucket\n§aFormation:§r Circle of Duality\n§aOrbos Cost:§r 80\n§aFatigue:§r §6Mid§r\n§aRitual Type:§r Esoteric, Abjuration\n\n§oA major rite used to banish hexes and curses. It removes any potion effects on the one who performed the ritual. Hexes are almost always dispelled when using this rite, but curses can still be a challenge.§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "ceremony.rites"
          }
        ]
      }
    ]
  },
  "list.reflection": {
    "title": "Rite of Malicious Reflection",
    "body": "§aRitual Items:§r\n- Bottle O' Blood (Target)\n- Lunar Crystal\n- Glass Pane\n§aFormation:§r Circle of Duality\n§aOrbos Cost:§r 800\n§aFatigue:§r §6Mid§r\n§aRitual Type:§r Esoteric, Abjuration\n\n§oA major rite used to reflect hexes and early-stage curses. They are returned to their sender and removed from the target when successful.§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "ceremony.rites"
          }
        ]
      }
    ]
  },
  "list.autumnHerald": {
    "title": "Equin's Heralding of Autumn",
    "body": "§aRitual Items:§r\n- Bone Meal\n- Crushed Fern\n- Earth Crystal\n- §dCompostable Items§r\n§aFormation:§r Crest of Transmutation\n§aOrbos Cost:§r 150\n§aFatigue:§r §2Low§r\n§aCandle Type:§r Green Candles\n§aRitual Type:§r Transmutation, Plant\n\n§oA ceremony that calls upon the Chlorophae, spirits of gardens and growing plants. Plants within the range will grow instantly on ritual completion.§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "ceremony.rites"
          }
        ]
      }
    ]
  },
  "list.mineralExchange": {
    "title": "Exchanging of the Minerals",
    "body": "§aRitual Items:§r\n- Natural Ash\n- Earth Crystal\n- Honey Bottle\n§aFormation:§r Crest of Transmutation\n§aOrbos Cost:§r 300\n§aFatigue:§r §2Low§r\n§aCandle Type:§r Yellow Candles\n§aRitual Type:§r Transmutation, Mineral\n\n§oA ceremony that changes blocks of ore and mineral in range into a higher material's ore, eg. a block of raw copper would become iron ore, a block of raw iron would become gold ore, etc.§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "ceremony.rites"
          }
        ]
      }
    ]
  },
  "list.totemSpawn": {
    "title": "Safe Returns of the Adventurer",
    "body": "§aRitual Items:§r\n- Totem of Undying\n- Bottle O' Blood (Target)\n- Ender Pearl\n- Ender Crystal\n§aFormation:§r Mark of Hebaya\n§aOrbos Cost:§r 2500\n§aFatigue:§r §cHigh§r\n§aRitual Type:§r Esoteric, Binding, Conjuration\n\n§oA grand ritual that requires the target to be able to resurrect (usually by holding a Totem of Undying). On resurrection, the target is moved to their spawn point.§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "ceremony.rites"
          }
        ]
      }
    ]
  },
  "list.totemCoven": {
    "title": "Safe Returns of the Witch",
    "body": "§aRitual Items:§r\n- Totem of Undying\n- Bottle O' Blood (Target)\n- Chain\n- Ender Crystal\n§aFormation:§r Mark of Hebaya\n§aOrbos Cost:§r 2500\n§aFatigue:§r §cHigh§r\n§aRitual Type:§r Esoteric, Binding, Conjuration\n\n§oA grand ritual that requires the target to be able to resurrect (usually by holding a Totem of Undying). On resurrection, the target is moved to their Coven's Grounds. Because of this, the target MUST be in a Coven (that has a Coven Grounds) for this to work.§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "ceremony.rites"
          }
        ]
      }
    ]
  },
  "list.totemTravel": {
    "title": "Safe Returns of the Traveler",
    "body": "§aRitual Items:§r\n- Totem of Undying\n- Bottle O' Blood (Target)\n- Lead\n- Ender Crystal\n§aFormation:§r Mark of Hebaya\n§aOrbos Cost:§r 2500\n§aFatigue:§r §cHigh§r\n§aRitual Type:§r Esoteric, Binding, Conjuration\n\n§oA grand ritual that requires the target to be able to resurrect (usually by holding a Totem of Undying). On resurrection, the target is moved to §athe location that is inscribed on the Bottle o' Blood§r§o. This ritual seems to transcend dimension.§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "ceremony.rites"
          }
        ]
      }
    ]
  },
  "list.totemFree": {
    "title": "Release of the Bound Totem",
    "body": "§aRitual Items:§r\n- Totem of Undying\n- Bottle O' Blood (Target)\n- Milk Bucket\n- Lunar Crystal\n§aFormation:§r Mark of Hebaya\n§aOrbos Cost:§r 2500\n§aFatigue:§r §cHigh§r\n§aRitual Type:§r Esoteric, Abjuration\n\n§oA grand ritual that removes any totem binding placed on the target. There have been instances where it has been seen as a Cleansing Ritual, only that this works 100%% of the time.§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "ceremony.rites"
          }
        ]
      }
    ]
  },
  
  "list.nameBestowal": {
    "title": "Bestow the Sacred Name",
    "body": "§aRitual Items:§r\n- Paper (Named)\n- Bottle O' Blood (Target)\n§aFormation:§r Mark of Hebaya\n§aOrbos Cost:§r 100\n§aFatigue:§r §2Low§r\n§aRitual Type:§r Esoteric, Abjuration\n\n§oA minor rite used to name creatures without a name tag. The name of the paper is mystically carried over to the creature the blood belongs to.§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "ceremony.rites"
          }
        ]
      }
    ]
  },
  "list.protection": {
    "title": "Protection Against Malevolence",
    "body": "§aRitual Items:§r\n- Diamond\n- Glowstone Dust\n- Iron Ingot\n- Crushed Oxeye Daisy\n- Crushed Cornflower\n- Natural Ash\n- Bottle O' Blood (Target)\n§aRequirements:§r A Full Moon Night\n§aFormation:§r Mark of Hebaya\n§aOrbos Cost:§r 5000\n§aFatigue:§r §cHigh§r\n§aRitual Type:§r Esoteric, Abjuration\n\n§oAn important ceremony that protects the caster from mystical harm and trickery (hexes and taglocking), making these magicks have a harder time to lock on to and exploit the protected creature. This protection lasts until the next Full Moon Night, so this rite is used as a passive kind of protection.§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "ceremony.rites"
          }
        ]
      }
    ]
  },
  "list.protectionBreak": {
    "title": "Rite of Shattered Barriers",
    "body": "§aRitual Items:§r\n- Diamond Pickaxe\n- Gunpowder\n- Fermented Spider Eye\n- Crushed Oxeye Daisy\n- Crushed Poppy\n- Bottle O' Blood (Target)\n§aRequirements:§r A New Moon Night/Day\n§aFormation:§r Mark of Hebaya\n§aOrbos Cost:§r 4000\n§aFatigue:§r §cHigh§r\n§aRitual Type:§r Evocation, Malice\n\n§oA rite designed to pierce and shatter Protections against Malovelonce. That is all this does.§r\n\n",
    "buttons": [
      {
        "buttonName": "Back",
        "buttonIcon": "textures/ui/book_arrowleft_default",
        "onClick": [
          {
            "type": "openForm",
            "form": "ceremony.rites"
          }
        ]
      }
    ]
  },
  
  "list.ascension": {
    "title": "Rite of Mystic Ascension",
    "body": "§aRitual Items:§r\n- Copper Ingot\n- Emerald\n- Strange Potion\n- Phial of Distilled Gas\n- Sky Crystal\n- Earth Crystal\n- Solar Crystal\n- Lunar Crystal\n- Ender Crystal\n§aRestrictions§r: On a Full or New Moon. The time does not matter.\n§aFormation:§r Spiral of Urrican\n§aOrbos Cost:§r 1500\n§aFatigue:§r §6Mid§r\n§aRitual Type:§r Binding, Evocation\n\n§oThe rite that enables a witch to transition from Mundane to Mystic. This opens the door to new rituals and interactions with the Fae.§r\n\n",
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

export const ceremonialis_adeptus = {
  "introduction": {
    "title": "Ceremonialis Adeptus",
    "body": "Within are the standard rites of the Mystic Witch. Keep in mind that this list is not exhaustive. There are quite a few rites that are not detailed inside it; however, that is for you to discover.\n\n",
    "buttons": [
      {
        "buttonName": "Acceleration of the Clock",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "list.speedTime"
          }
        ]
      },
      {
        "buttonName": "Reversal of the Clock",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "list.reverseTime"
          }
        ]
      },
      
      {
        "buttonName": "Call Through The End",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "list.endCall"
          }
        ]
      },
      {
        "buttonName": "Call Across The End",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "list.endCallTargeted"
          }
        ]
      },
      {
        "buttonName": "Conjuring By the Spatial Crossroads",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "list.crossroadConjure"
          }
        ]
      },
      {
        "buttonName": "Rite of Traveling",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "list.traveling"
          }
        ]
      },
      {
        "buttonName": "Rite of Planar Banishment",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "list.banishment"
          }
        ]
      },
      
      {
        "buttonName": "Rite of Faerie Commune",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "list.faeCommune"
          }
        ]
      },
      {
        "buttonName": "Rite of Faerie Departure",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "list.faeDepart"
          }
        ]
      },
      
      {
        "buttonName": "Enchanting of the Mundane Armament",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "buttonTagRequirements": ["bw:oberon_armor"],
        "onClick": [
          {
            "type": "openForm",
            "form": "list.oberonArmor"
          }
        ]
      },
      {
        "buttonName": "Enchanting of the Mundane Weapon",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "buttonTagRequirements": ["bw:oberon_weapons"],
        "onClick": [
          {
            "type": "openForm",
            "form": "list.oberonWeapon"
          }
        ]
      },
      {
        "buttonName": "Enchanting of the Mundane Trinket",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "buttonTagRequirements": ["bw:oberon_trinkets"],
        "onClick": [
          {
            "type": "openForm",
            "form": "list.oberonTrinket"
          }
        ]
      },
      
      {
        "buttonName": "Binding the Mystic Barrel",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "buttonTagRequirements": ["bw:oberon_barrel"],
        "onClick": [
          {
            "type": "openForm",
            "form": "list.oberonBarrel"
          }
        ]
      },
      
      {
        "buttonName": "Binding of the Enchant",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "list.enchant"
          }
        ]
      },
      {
        "buttonName": "Enchanting of the Broom",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "list.enchantBroom"
          }
        ]
      },
      
      {
        "buttonName": "Rite of Bound Permanence",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "list.bindItem"
          }
        ]
      },
      {
        "buttonName": "Untethering of the Bound Artifact",
        "buttonIcon": "textures/items/dusts/calcite_dust",
        "onClick": [
          {
            "type": "openForm",
            "form": "list.unbindItem"
          }
        ]
      }
    ]
  },
  
  "list.speedTime": {
    "title": "Acceleration of the Clock",
    "body": "§aRitual Items:§r\n- Clock\n- Emerald Dust\n- Sky Crystal\n- Sky Crystal\n- Solar Crystal\n§aFormation:§r Spiral of Urrican\n§aOrbos Cost:§r 600\n§aFatigue:§r §6Mid§r\n§aRitual Type:§r Evocation, Celestial\n\n§oA rite that accelerates the passage of time, quickly forcing time forward by 24000. It must be understood that this only affects celestial existences.§r\n\n",
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
  "list.reverseTime": {
    "title": "Reversal of the Clock",
    "body": "§aRitual Items:§r\n- Clock\n- Emerald Dust\n- Sky Crystal\n- Sky Crystal\n- Lunar Crystal\n§aFormation:§r Spiral of Urrican\n§aOrbos Cost:§r 600\n§aFatigue:§r §6Mid§r\n§aRitual Type:§r Evocation, Celestial\n\n§oA rite that reverses the passage of time, quickly forcing time backwards by 24000. It must be understood that this only affects celestial existences.§r\n\n",
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
  "list.endCall": {
    "title": "Call Through The End",
    "body": "§aRitual Items:§r\n- Ender Pearl\n- Amethyst Shard\n- Ender Crystal\n- Bottle O' Blood (Target)\n§aFormation:§r Star of Nathe\n§aOrbos Cost:§r 600\n§aFatigue:§r §6Mid§r\n§aRitual Type:§r Esoteric, Conjuration\n\n§oA rite that summons the owner of the blood into the ritual area. Historically, this ritual has been used to call forth various unwelcome entities.§r\n\n",
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
  "list.endCallTargeted": {
    "title": "Call Across The End",
    "body": "§aRitual Items:§r\n- Ender Pearl\n- Amethyst Nugget (Location)\n- Ender Crystal\n- Bottle O' Blood (Target)\n§aFormation:§r Star of Nathe\n§aOrbos Cost:§r 900\n§aFatigue:§r §6Mid§r\n§aRitual Type:§r Esoteric, Conjuration\n\n§oA rite that transfers the owner of the blood to the location bound to the Amethyst Nugget. It is like summoning, but a bit more powerful.§r\n\n",
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
  "list.crossroadConjure": {
    "title": "Conjuring By the Spatial Crossroads",
    "body": "§aRitual Items:§r\n- Ender Pearl\n- Chicken Egg (Any)\n- Diamond\n- Ender Crystal\n- Bottle O' Blood (Target)\n§aFormation:§r Star of Nathe\n§aOrbos Cost:§r 1300\n§aFatigue:§r §6Mid§r\n§aRitual Type:§r Esoteric, Conjuration\n\n§oA rite that conjures a creature in the ritual area. This is true conjuration, meaning that this creature is conjured from nothing or spawned.§r\n\n",
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
  "list.traveling": {
    "title": "Rite of Traveling",
    "body": "§aRitual Items:§r\n- Crushed Dandelion\n- Ender Pearl\n- Amethyst Nugget (Location)\n- Ender Crystal\n§aFormation:§r Star of Nathe\n§aOrbos Cost:§r 550\n§aFatigue:§r §aLow§r\n§aRitual Type:§r Esoteric, Conjuration\n\n§oA simplistic rite that briefly connects the ritual site to the location bound within the Amethyst Nugget, teleporting all creatures in the vicinity to that position.§r\n\n",
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
  "list.banishment": {
    "title": "Rite of Planar Banishment",
    "body": "§aRitual Items:§r\n- Ender Pearl\n- Nether Warts\n- Soul Sand\n- Dirt\n- Ender Crystal\n- Earth Crystal\n§aAlignments§r:\n- Day (connects to the Nether)\n- Night (connects to the End)\n§aFormation:§r Star of Nathe\n§aOrbos Cost:§r 550\n§aFatigue:§r §aLow§r\n§aRitual Type:§r Esoteric, Conjuration\n\n§oA risky rite that randomly chooses a dimension that the surrounding entities are not currently in. All surrounding entities are transported through this planar shift. Alignments only accurately when the casting Witch is in the Overworld.§r\n\n",
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
  "list.faeCommune": {
    "title": "Rite of Faerie Commune",
    "body": "§aRitual Items:§r\n- Honey Bottle\n- Apple\n- Bread\n- Ender Crystal\n§aFormation:§r Star of Nathe\n§aOrbos Cost:§r 800\n§aFatigue:§r §cHigh§r\n§aRitual Type:§r Celestial, Binding, Conjuration\n\n§oA beacon rite that calls upon the Lesser Faeries. They may not always answer, and getting their attention is not the only thing you must do when interacting with them. This rite only marks the beginning.§r\n\n",
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
  "list.faeDepart": {
    "title": "Rite of Faerie Departure",
    "body": "§aRitual Items:§r\n- Honey Bottle\n- Iron Sword\n- Obsidian Dust\n- Faerie Grimoire (Owned)\n- Ender Crystal\n§aRequirements§r: A Night on the Waxing or Waning Crescent Moon.\n§aFormation:§r Star of Nathe\n§aOrbos Cost:§r 800\n§aFatigue:§r §cHigh§r\n§aRitual Type:§r Celestial, Binding, Conjuration\n\n§oAn unbinding ritual that attempts to release the Witch from Faerie Pacts they have made. The Faerie Grimoire must be set to the Faerie that you wish to depart before the rite is performed. Keep in mind; the higher tge Faerie is on the Wylde political ladder, the more dangerous or difficult it is to get them to agree.§r\n\n",
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
  "list.enchant": {
    "title": "Binding of the Enchant",
    "body": "§aRitual Items:§r\n- Book\n- Lapis Lazuli\n- Lunar Crystal\n§aFormation:§r Mark of Hebaya\n§aOrbos Cost:§r 600\n§aFatigue:§r §6Mid§r\n§aRitual Type:§r Binding, Esoteric\n\n§oA simple ritual that conjures an Enchanted Book. It is much like the ones Quillwyn offers to his Witches. In fact, this rite seems to point directly to this Lesser Faerie.§r\n\n",
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
  "list.enchantBroom": {
    "title": "Enchanting of the Broom",
    "body": "§aRitual Items:§r\n- Stick\n- Wheat\n- Natural Ash\n- Sky Crystal\n§aFormation:§r Mark of Hebaya\n§aOrbos Cost:§r 400\n§aFatigue:§r §6Mid§r\n§aRitual Type:§r Binding, Esoteric\n\n§oA semi-important rite that creates a broom through the mystical binding of the ritual materials. It can be used for flight, though Bubble spells are not recommended if you do not wish for your broom to be affected.§r\n\n",
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
  "list.bindItem": {
    "title": "Rite of Bound Permanence",
    "body": "§aRitual Items:§r\n- Netherite Ingot\n- Diamond\n- Emerald\n- Earth Crystal\n- ANY Item\n§aFormation:§r Mark of Hebaya\n§aOrbos Cost:§r 1000\n§aFatigue:§r §6Mid§r\n§aRitual Type:§r Binding, Esoteric\n\n§oA fairly expensive rite that forces an item to be kept on death. Be warned, this trait will interfere with a Magus's ability to akashically move it across inventories.§r\n\n",
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
  "list.unbindItem": {
    "title": "Untethering of the Bound Artifact",
    "body": "§aRitual Items:§r\n- Iron Sword\n- Sand\n- Dirt\n- Coal Dust\n- Sky Crystal\n- ANY Item\n§aFormation:§r Mark of Hebaya\n§aOrbos Cost:§r 1500\n§aFatigue:§r §6Mid§r\n§aRitual Type:§r Binding, Esoteric\n\n§oA fairly cheap but Orbos and Fatigue expensive rite that forces an item bound through death to immediately become mundane.§r\n\n",
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
  
  "list.oberonArmor": {
    "title": "Enchanting of the Mundane Armament",
    "body": "§aRitual Items:§r\n- Lapis Lazuli\n- Glyph Book (Spell)\n- Emerald Dust\n- Item with Durability\n§aFormation:§r Mark of Hebaya\n§aOrbos Cost:§r 1200\n§aFatigue:§r §6Mid§r\n§aRitual Type:§r Binding, Esoteric\n\n§oA secret ritual all Oberian Witches (and only they) can perform. It binds a Glyph Spell to the armor piece in question. When the wearer is hit, it has a chance to cast the spell at the cost of some of the armor's durability.§r\n\n",
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
  "list.oberonTrinket": {
    "title": "Enchanting of the Mundane Trinket",
    "body": "§aRitual Items:§r\n- Lapis Lazuli\n- Glyph Book (Spell)\n- Amethyst Dust\n- Item with Durability\n§aFormation:§r Mark of Hebaya\n§aOrbos Cost:§r 1200\n§aFatigue:§r §6Mid§r\n§aRitual Type:§r Binding, Esoteric\n\n§oA secret ritual all Oberian Witches (and only they) can perform. It binds a Glyph Spell to the item in question. When the holder uses the item, it will cast the spell at the cost of some of the item's durability.§r\n\n",
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
  "list.oberonWeapon": {
    "title": "Enchanting of the Mundane Weapon",
    "body": "§aRitual Items:§r\n- Lapis Lazuli\n- Glyph Book (Spell)\n- Coal Dust\n- Item with Durability\n§aFormation:§r Mark of Hebaya\n§aOrbos Cost:§r 1200\n§aFatigue:§r §6Mid§r\n§aRitual Type:§r Binding, Esoteric\n\n§oA secret ritual all Oberian Witches (and only they) can perform. It binds a §aTouch Glyph Spell§r to the weapon in question. When the holder hits a creature with the item, it will cast the spell at the cost of some of the item's durability. Keep in mind, even a Shear is a weapon if used to harm.§r\n\n",
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
  "list.oberonBarrel": {
    "title": "Binding the Mystic Barrel",
    "body": "§aRitual Items:§r\n- Honey Bottle\n- Sugar\n- Sugar Cane\n- Faerie Grimoire (Oberon)\n- Amethyst Nugget (Location)\n§aFormation:§r Mark of Hebaya\n§aOrbos Cost:§r 700\n§aFatigue:§r §6Mid§r\n§aRitual Type:§r Binding, Esoteric\n\n§oA secret ritual all Oberian Witches (and only they) can perform. It enchants a Barrel to ferment all the Strange Potions inside it. If the barrel is open at any point, the fermentation ends.§r\n\n",
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
}