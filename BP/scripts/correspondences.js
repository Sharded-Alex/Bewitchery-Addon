export const correspondences = {
  // Time
  "temporal": {
    "day": {
      "Ignite": {
        "correspondenceType": "positive",
        "setOnFire": {
          "duration": "+2"
        },
        "damage": {
          "damageAmount": "+1"
        }
      },
      "Frenzy": {
        "correspondenceType": "positive",
        "custom_potion_effect": {
          "duration": "+5"
        }
      },
      "Growth": {
        "correspondenceType": "positive",
        "growth": {
          "diceSave": "+2"
        }
      },
      "Thorns": {
        "correspondenceType": "positive",
        "custom_potion_effect": {
          "damage": "+1"
        }
      }
    },
    "night": {
      "Frost": {
        "correspondenceType": "positive",
        "potion_effect": {
          "diceSave": "-2"
        },
        "damage": {
          "damageAmount": "+1"
        }
      },
      "Conceal": {
        "correspondenceType": "positive",
        "potion_effect": {
          "duration": "+10"
        },
        "custom_potion_effect": {
          "duration": "+10"
        }
      },
      "Growth": {
        "correspondenceType": "negative",
        "growth": {
          "diceSave": "-2"
        }
      },
      "Hearth": {
        "correspondenceType": "negative",
        "hearthRadius": {
          "radius": "+2"
        }
      }
    },
    "dusk": {
      "Evoke": {
        "correspondenceType": "positive",
        "potion_effect": {
          "duration": "+5"
        }
      },
      "Wyrd": {
        "correspondenceType": "positive",
        "damage": {
          "damageAmount": "+1"
        }
      }
    },
    "dawn": {
      "Evoke": {
        "correspondenceType": "positive",
        "potion_effect": {
          "duration": "+5"
        }
      },
      "Wyrd": {
        "correspondenceType": "positive",
        "damage": {
          "damageAmount": "+1"
        }
      }
    }
  },
  "atmospheric": {
    "clear": {
      "Ignite": {
        "correspondenceType": "positive",
        "damage": {
          "diceSave": "-2",
          "damageAmount": "+1"
        }
      },
      "Missile": {
        "correspondenceType": "nuetral",
        "projectile_visual": "bw:basic_bolt_wispy"
      },
      "Bolt": {
        "correspondenceType": "nuetral",
        "projectile_visual": "bw:basic_bolt_wispy"
      }
    },
    "rainy": {
      "Detoxify": {
        "correspondenceType": "positive",
        "nullify_effect": {
          "amplifier": "+1"
        }
      },
      "Missile": {
        "correspondenceType": "nuetral",
        "projectile_visual": "bw:basic_bolt_smoky"
      },
      "Bolt": {
        "correspondenceType": "nuetral",
        "projectile_visual": "bw:basic_bolt_smoky"
      }
    },
    "thunderstorm": {
      "Ignite": {
        "correspondenceType": "negative",
        "setOnFire": {
          "duration": "-4"
        },
        "damage": {
          "diceSave": "+2",
          "damageAmount": "-2"
        }
      },
      "Shock": {
        "correspondenceType": "positive",
        "lightningStrike": {
          "diceSave": "-3",
          "damageAmount": "+2"
        }
      },
      "Bubble": {
        "correspondenceType": "positive",
        "radius": "+1"
      },
      "Gust": {
        "correspondenceType": "positive",
        "gust": {
          "power": "+2"
        }
      },
      "Frenzy": {
        "correspondenceType": "positive",
        "custom_potion_effect": {
          "diceSave": "+10",
          "duration": "+15"
        }
      },
      "Missile": {
        "correspondenceType": "nuetral",
        "projectile_visual": "bw:basic_bolt_sparkly"
      },
      "Bolt": {
        "correspondenceType": "nuetral",
        "projectile_visual": "bw:basic_bolt_sparkly"
      }
    }
  },
  "lunar": {
    "full_moon": {
      "Bubble": {
        "correspondenceType": "positive",
        "radius": "+2"
      },
      "Evoke": {
        "correspondenceType": "positive",
        "potion_effect": {
          "duration": "+30"
        }
      },
      "Frost": {
        "correspondenceType": "positive",
        "potion_effect": {
          "diceSave": "-5"
        },
        "damage": {
          "damageAmount": "+4"
        }
      }
    },
    "waning_gibbous": {
      "Detoxify": {
        "correspondenceType": "positive",
        "nullify_effect": {
          "amplifier": "+1"
        }
      }
    },
    "first_quarter": {
      "Detoxify": {
        "correspondenceType": "positive",
        "nullify_effect": {
          "amplifier": "+2"
        }
      }
    },
    "waning_crescent": {
      "Detoxify": {
        "correspondenceType": "positive",
        "nullify_effect": {
          "amplifier": "+3"
        }
      }
    },
    "new_moon": {
      "Bubble": {
        "correspondenceType": "positive",
        "radius": "+2"
      },
      "Evoke": {
        "correspondenceType": "positive",
        "potion_effect": {
          "amplifier": "+1"
        }
      },
      "Wyrd": {
        "correspondenceType": "positive",
        "damage": {
          "damageAmount": "+2"
        }
      }
    },
    "waxing_crescent": {},
    "last_quarter": {},
    "waxing_gibbous": {}
  }
}