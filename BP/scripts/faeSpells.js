import {world, system, Scoreboard, ItemStack, EntityHealthComponent, BlockVolume, BlockVolumeBase, BlockPermutation, MolangVariableMap, MoonPhase, GameRules, Block, Entity, Player} from "@minecraft/server";
import {Vector3, Random} from "./VectorMath/index.js";
import {getFace, quadSplit, isJack} from "./wardArrays.js";
import {pickJacks} from "./blockComp.js";
import {localizePos} from "./localize.js";
import {randomize, cleanseTarget} from "./castRitual.js";
import {potionEffects, getEffectInfo} from "./consumePotion.js";
import { lesserFae, convertFaeName } from "./lesserFaerie.js";
import {spawnMagicCircle, getSourceFromSpell, deductOrbos} from "./spellDraw.js";
import {verifyPatron} from "./altars.js";
import {normalizeVector, createBolt} from "./spellProjectiles.js";
import {luckRoll, diceRoll, findMysticCircleName, detectMysticCircle, openMysticCircle, closeMysticCircle, seeMysticCircle, runSpellCreation, decorateSpell, essenceCheck, hatchFromEgg, growFlora} from "./occultMagick.js";
import {checkAndSetCooldown, calculateDistance, spawnRootWave} from "./example-2.js";
import {getItem, removeItem, findItem} from "./getTaglock.js";
import {applySpellDamage} from "./spellDamage.js";
import {visuals} from "./particleFunc.js";
import {createAreaEffect} from "./spellAreas.js";
import {getWardCorrespondence} from "./blockComp.js";

// SIMPLE IS OFTEN BETTER.
const faeSpellParticles = {
  "Conceal": {
    "Self": {
      "particleName": "bw:conceal_self_particle",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.84,
          "green": 0.86,
          "blue": 0.84
        }
      }
    },
    "Sight": {
      "particleName": "bw:conceal_bolt_burst",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.84,
          "green": 0.86,
          "blue": 0.84
        }
      }
    },
    "Bolt_trail": {
      "particleName": "bw:conceal_bolt_trail",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.84,
          "green": 0.86,
          "blue": 0.84
        }
      }
    },
    "Bolt_collide": {
      "particleName": "bw:conceal_bolt_burst",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.84,
          "green": 0.86,
          "blue": 0.84
        }
      }
    },
    "Bubble": {
      "particleName": "bw:conceal_bubble_particle",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.84,
          "green": 0.86,
          "blue": 0.84
        },
        "float:spell_radius": 1.0
      }
    },
    "Cube": {
      "particleName": "bw:conceal_cube_particle",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.84,
          "green": 0.86,
          "blue": 0.84
        },
        "vector:offset": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "vector:dimensions": {
          "x": 0,
          "y": 0,
          "z": 0
        }
      }
    }
  },
  "Channel": {
    "Self": {
      "particleName": "bw:channel_self_particle",
      "mapVariables": {}
    },
    "Sight": {
      "particleName": "bw:channel_bolt_burst",
      "mapVariables": {}
    },
    "Bolt_trail": {
      "particleName": "bw:channel_bolt_trail",
      "mapVariables": {}
    },
    "Bolt_collide": {
      "particleName": "bw:channel_bolt_burst",
      "mapVariables": {}
    },
    "Bubble": {
      "particleName": "bw:channel_bubble_particle",
      "mapVariables": {
        "float:spell_radius": 1.0
      }
    },
    "Cube": {
      "particleName": "bw:channel_cube_particle",
      "mapVariables": {
        "vector:offset": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "vector:dimensions": {
          "x": 0,
          "y": 0,
          "z": 0
        }
      }
    }
  },
  
  "Growth": {
    "Sight": {
      "particleName": "bw:growth_bolt_burst",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0,
          "green": 0.78,
          "blue": 0
        }
      }
    },
    "Bolt_trail": {
      "particleName": "bw:growth_bolt_trail",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0,
          "green": 0.78,
          "blue": 0
        }
      }
    },
    "Bolt_collide": {
      "particleName": "bw:growth_bolt_burst",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0,
          "green": 0.78,
          "blue": 0
        }
      }
    },
    "Cube": {
      "particleName": "bw:growth_cube_particle",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0,
          "green": 0.78,
          "blue": 0
        },
        "vector:offset": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "vector:dimensions": {
          "x": 0,
          "y": 0,
          "z": 0
        }
      }
    }
  },
  "Bloom": {
    "Self": {
      "particleName": "bw:growth_self_particle",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.0,
          "green": 0.78,
          "blue": 0.0
        }
      }
    },
    "Sight": {
      "particleName": "bw:growth_bolt_burst",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0,
          "green": 0.78,
          "blue": 0
        }
      }
    },
    "Bolt_trail": {
      "particleName": "bw:growth_bolt_trail",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0,
          "green": 0.78,
          "blue": 0
        }
      }
    },
    "Bolt_collide": {
      "particleName": "bw:growth_bolt_burst",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0,
          "green": 0.78,
          "blue": 0
        }
      }
    },
    "Bubble": {
      "particleName": "bw:growth_bubble_particle",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.0,
          "green": 0.78,
          "blue": 0.0
        },
        "float:spell_radius": 1.0
      }
    },
    "Cube": {
      "particleName": "bw:growth_cube_particle",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0,
          "green": 0.78,
          "blue": 0
        },
        "vector:offset": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "vector:dimensions": {
          "x": 0,
          "y": 0,
          "z": 0
        }
      }
    }
  },
  "Thorns": {
    "Self": {
      "particleName": "bw:growth_self_particle",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.0,
          "green": 0.78,
          "blue": 0.0
        }
      }
    },
    "Sight": {
      "particleName": "bw:growth_bolt_burst",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0,
          "green": 0.78,
          "blue": 0
        }
      }
    },
    "Bolt_trail": {
      "particleName": "bw:growth_bolt_trail",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0,
          "green": 0.78,
          "blue": 0
        }
      }
    },
    "Bolt_collide": {
      "particleName": "bw:growth_bolt_burst",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0,
          "green": 0.78,
          "blue": 0
        }
      }
    },
    "Bubble": {
      "particleName": "bw:growth_bubble_particle",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.0,
          "green": 0.78,
          "blue": 0.0
        },
        "float:spell_radius": 1.0
      }
    },
    "Cube": {
      "particleName": "bw:growth_cube_particle",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0,
          "green": 0.78,
          "blue": 0
        },
        "vector:offset": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "vector:dimensions": {
          "x": 0,
          "y": 0,
          "z": 0
        }
      }
    }
  },
  "Apple": {
    "Self": {
      "particleName": "bw:growth_self_particle",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.7,
          "green": 0.05,
          "blue": 0.0
        }
      }
    },
    "Sight": {
      "particleName": "bw:growth_bolt_burst",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.7,
          "green": 0.05,
          "blue": 0.0
        }
      }
    },
    "Bolt_trail": {
      "particleName": "bw:growth_bolt_trail",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.7,
          "green": 0.05,
          "blue": 0.0
        }
      }
    },
    "Bolt_collide": {
      "particleName": "bw:growth_bolt_burst",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.7,
          "green": 0.05,
          "blue": 0.0
        }
      }
    },
    "Bubble": {
      "particleName": "bw:growth_bubble_particle",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.7,
          "green": 0.05,
          "blue": 0.0
        },
        "float:spell_radius": 1.0
      }
    },
    "Cube": {
      "particleName": "bw:growth_cube_particle",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.7,
          "green": 0.05,
          "blue": 0.0
        },
        "vector:offset": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "vector:dimensions": {
          "x": 0,
          "y": 0,
          "z": 0
        }
      }
    }
  },
  
  "Heal": {
    "Self": {
      "particleName": "bw:heal_self_particle",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 1,
          "green": 0.98,
          "blue": 0
        }
      }
    },
    "Sight": {
      "particleName": "bw:heal_bolt_burst",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 1,
          "green": 0.98,
          "blue": 0
        }
      }
    },
    "Bolt_trail": {
      "particleName": "bw:heal_bolt_trail",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 1,
          "green": 0.98,
          "blue": 0
        }
      }
    },
    "Bolt_collide": {
      "particleName": "bw:heal_bolt_burst",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 1,
          "green": 0.98,
          "blue": 0
        }
      }
    },
    "Bubble": {
      "particleName": "bw:heal_bubble_particle",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 1,
          "green": 0.98,
          "blue": 0
        },
        "float:spell_radius": 1.0
      }
    },
    "Cube": {
      "particleName": "bw:heal_cube_particle",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 1,
          "green": 0.98,
          "blue": 0
        },
        "vector:offset": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "vector:dimensions": {
          "x": 0,
          "y": 0,
          "z": 0
        }
      }
    }
  },
  "Detoxify": {
    "Self": {
      "particleName": "bw:heal_self_particle",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.455,
          "green": 0.85,
          "blue": 0.477
        }
      }
    },
    "Sight": {
      "particleName": "bw:heal_bolt_burst",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.455,
          "green": 0.85,
          "blue": 0.477
        }
      }
    },
    "Bolt_trail": {
      "particleName": "bw:heal_bolt_trail",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.455,
          "green": 0.85,
          "blue": 0.477
        }
      }
    },
    "Bolt_collide": {
      "particleName": "bw:heal_bolt_burst",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.455,
          "green": 0.85,
          "blue": 0.477
        }
      }
    },
    "Bubble": {
      "particleName": "bw:heal_bubble_particle",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.455,
          "green": 0.85,
          "blue": 0.477
        },
        "float:spell_radius": 1.0
      }
    },
    "Cube": {
      "particleName": "bw:heal_cube_particle",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.455,
          "green": 0.85,
          "blue": 0.477
        },
        "vector:offset": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "vector:dimensions": {
          "x": 0,
          "y": 0,
          "z": 0
        }
      }
    }
  },
  "Egg": {
    "Self": {
      "particleName": "bw:egg_self_particle",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.88,
          "green": 0.03,
          "blue": 0
        }
      }
    },
    "Sight": {
      "particleName": "bw:egg_bolt_burst",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.88,
          "green": 0.03,
          "blue": 0
        }
      }
    },
    "Bolt_trail": {
      "particleName": "bw:egg_bolt_trail",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.88,
          "green": 0.03,
          "blue": 0
        }
      }
    },
    "Bolt_collide": {
      "particleName": "bw:egg_bolt_burst",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.88,
          "green": 0.03,
          "blue": 0
        }
      }
    },
    "Bubble": {
      "particleName": "bw:egg_bubble_particle",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.88,
          "green": 0.03,
          "blue": 0
        },
        "float:spell_radius": 1.0
      }
    },
    "Cube": {
      "particleName": "bw:egg_cube_particle",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.88,
          "green": 0.03,
          "blue": 0
        },
        "vector:offset": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "vector:dimensions": {
          "x": 0,
          "y": 0,
          "z": 0
        }
      }
    }
  },
  "Buzz": {
    "Self": {
      "particleName": "bw:buzz_self_particle",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.582,
          "green": 0.448,
          "blue": 0.082
        }
      }
    },
    "Sight": {
      "particleName": "bw:buzz_bolt_burst",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.582,
          "green": 0.448,
          "blue": 0.082
        }
      }
    },
    "Bolt_trail": {
      "particleName": "bw:buzz_bolt_trail",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.582,
          "green": 0.448,
          "blue": 0.082
        }
      }
    },
    "Bolt_collide": {
      "particleName": "bw:buzz_bolt_burst",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.582,
          "green": 0.448,
          "blue": 0.082
        }
      }
    },
    "Bubble": {
      "particleName": "bw:buzz_bubble_particle",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.582,
          "green": 0.448,
          "blue": 0.082
        },
        "float:spell_radius": 1.0
      }
    },
    "Cube": {
      "particleName": "bw:buzz_cube_particle",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.582,
          "green": 0.448,
          "blue": 0.082
        },
        "vector:offset": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "vector:dimensions": {
          "x": 0,
          "y": 0,
          "z": 0
        }
      }
    }
  },
  "Hunt": {
    "Self": {
      "particleName": "bw:heal_self_particle",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.88,
          "green": 0.03,
          "blue": 0
        }
      }
    },
    "Sight": {
      "particleName": "bw:heal_bolt_burst",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.88,
          "green": 0.03,
          "blue": 0
        }
      }
    },
    "Bolt_trail": {
      "particleName": "bw:heal_bolt_trail",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.88,
          "green": 0.03,
          "blue": 0
        }
      }
    },
    "Bolt_collide": {
      "particleName": "bw:heal_bolt_burst",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.88,
          "green": 0.03,
          "blue": 0
        }
      }
    },
    "Bubble": {
      "particleName": "bw:heal_bubble_particle",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.88,
          "green": 0.03,
          "blue": 0
        },
        "float:spell_radius": 1.0
      }
    },
    "Cube": {
      "particleName": "bw:heal_cube_particle",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.88,
          "green": 0.03,
          "blue": 0
        },
        "vector:offset": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "vector:dimensions": {
          "x": 0,
          "y": 0,
          "z": 0
        }
      }
    }
  },
  "Pulse": {
    "Self": {
      "particleName": "bw:pulse_self_particle",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.650,
          "green": 0.094,
          "blue": 0.050
        }
      }
    },
    "Sight": {
      "particleName": "bw:pulse_bolt_burst",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.650,
          "green": 0.094,
          "blue": 0.050
        }
      }
    },
    "Bolt_trail": {
      "particleName": "bw:pulse_bolt_trail",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.650,
          "green": 0.094,
          "blue": 0.050
        }
      }
    },
    "Bolt_collide": {
      "particleName": "bw:pulse_bolt_burst",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.650,
          "green": 0.094,
          "blue": 0.050
        }
      }
    },
    "Bubble": {
      "particleName": "bw:pulse_bubble_particle",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.650,
          "green": 0.094,
          "blue": 0.050
        },
        "float:spell_radius": 1.0
      }
    },
    "Cube": {
      "particleName": "bw:pulse_cube_particle",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.650,
          "green": 0.094,
          "blue": 0.050
        },
        "vector:offset": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "vector:dimensions": {
          "x": 0,
          "y": 0,
          "z": 0
        }
      }
    }
  },
  
  "Ignite": {
    "Self": {
      "particleName": "bw:ignite_self_particle",
      "mapVariables": {}
    },
    "Sight": {
      "particleName": "bw:ignite_bolt_burst",
      "mapVariables": {}
    },
    "Bolt_trail": {
      "particleName": "bw:ignite_bolt_trail",
      "mapVariables": {}
    },
    "Bolt_collide": {
      "particleName": "bw:ignite_bolt_burst",
      "mapVariables": {}
    },
    "Bubble": {
      "particleName": "bw:ignite_bubble_particle",
      "mapVariables": {
        "float:spell_radius": 1.0
      }
    },
    "Cube": {
      "particleName": "bw:ignite_cube_particle",
      "mapVariables": {
        "vector:offset": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "vector:dimensions": {
          "x": 0,
          "y": 0,
          "z": 0
        }
      }
    }
  },
  "Shock": {
    "Self": {
      "particleName": "bw:shock_self_particle",
      "mapVariables": {
        "color:color": {
          "red": 0.9,
          "green": 0.95,
          "blue": 0.65
        }
      }
    },
    "Sight": {
      "particleName": "bw:shock_bolt_burst",
      "mapVariables": {
        "color:color": {
          "red": 0.9,
          "green": 0.95,
          "blue": 0.65
        }
      }
    },
    "Bolt_trail": {
      "particleName": "bw:shock_bolt_trail",
      "mapVariables": {
        "color:color": {
          "red": 0.9,
          "green": 0.95,
          "blue": 0.65
        }
      }
    },
    "Bolt_collide": {
      "particleName": "bw:shock_bolt_burst",
      "mapVariables": {
        "color:color": {
          "red": 0.9,
          "green": 0.95,
          "blue": 0.65
        }
      }
    },
    "Bubble": {
      "particleName": "bw:shock_bubble_particle",
      "mapVariables": {
        "color:color": {
          "red": 0.9,
          "green": 0.95,
          "blue": 0.65
        },
        "float:spell_radius": 1.0
      }
    },
    "Cube": {
      "particleName": "bw:shock_cube_particle",
      "mapVariables": {
        "color:color": {
          "red": 0.9,
          "green": 0.95,
          "blue": 0.65
        },
        "vector:offset": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "vector:dimensions": {
          "x": 0,
          "y": 0,
          "z": 0
        }
      }
    }
  },
  "Frenzy": {
    "Self": {
      "particleName": "bw:egg_self_particle",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.722,
          "green": 0.118,
          "blue": 0.165
        }
      }
    },
    "Sight": {
      "particleName": "bw:egg_bolt_burst",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.722,
          "green": 0.118,
          "blue": 0.165
        }
      }
    },
    "Bolt_trail": {
      "particleName": "bw:egg_bolt_trail",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.722,
          "green": 0.118,
          "blue": 0.165
        }
      }
    },
    "Bolt_collide": {
      "particleName": "bw:egg_bolt_burst",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.722,
          "green": 0.118,
          "blue": 0.165
        }
      }
    },
    "Bubble": {
      "particleName": "bw:egg_bubble_particle",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.722,
          "green": 0.118,
          "blue": 0.165
        },
        "float:spell_radius": 1.0
      }
    },
    "Cube": {
      "particleName": "bw:egg_cube_particle",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.722,
          "green": 0.118,
          "blue": 0.165
        },
        "vector:offset": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "vector:dimensions": {
          "x": 0,
          "y": 0,
          "z": 0
        }
      }
    }
  },
  "Surge": {
    "Self": {
      "particleName": "bw:pulse_self_particle",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.223,
          "green": 0.31,
          "blue": 0.545
        }
      }
    },
    "Sight": {
      "particleName": "bw:pulse_bolt_burst",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.223,
          "green": 0.31,
          "blue": 0.545
        }
      }
    },
    "Bolt_trail": {
      "particleName": "bw:pulse_bolt_trail",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.223,
          "green": 0.31,
          "blue": 0.545
        }
      }
    },
    "Bolt_collide": {
      "particleName": "bw:pulse_bolt_burst",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.223,
          "green": 0.31,
          "blue": 0.545
        }
      }
    },
    "Bubble": {
      "particleName": "bw:pulse_bubble_particle",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.223,
          "green": 0.31,
          "blue": 0.545
        },
        "float:spell_radius": 1.0
      }
    },
    "Cube": {
      "particleName": "bw:pulse_cube_particle",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.223,
          "green": 0.31,
          "blue": 0.545
        },
        "vector:offset": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "vector:dimensions": {
          "x": 0,
          "y": 0,
          "z": 0
        }
      }
    }
  },
  "Stone": {
    "Self": {
      "particleName": "bw:buzz_self_particle",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.58,
          "green": 0.58,
          "blue": 0.58
        }
      }
    },
    "Sight": {
      "particleName": "bw:buzz_bolt_burst",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.58,
          "green": 0.58,
          "blue": 0.58
        }
      }
    },
    "Bolt_trail": {
      "particleName": "bw:buzz_bolt_trail",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.58,
          "green": 0.58,
          "blue": 0.58
        }
      }
    },
    "Bolt_collide": {
      "particleName": "bw:buzz_bolt_burst",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.58,
          "green": 0.58,
          "blue": 0.58
        }
      }
    },
    "Bubble": {
      "particleName": "bw:buzz_bubble_particle",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.58,
          "green": 0.58,
          "blue": 0.58
        },
        "float:spell_radius": 1.0
      }
    },
    "Cube": {
      "particleName": "bw:buzz_cube_particle",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.58,
          "green": 0.58,
          "blue": 0.58
        },
        "vector:offset": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "vector:dimensions": {
          "x": 0,
          "y": 0,
          "z": 0
        }
      }
    }
  },
  "Dig": {
    "Self": {
      "particleName": "bw:buzz_self_particle",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.58,
          "green": 0.58,
          "blue": 0.58
        }
      }
    },
    "Sight": {
      "particleName": "bw:buzz_bolt_burst",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.58,
          "green": 0.58,
          "blue": 0.58
        }
      }
    },
    "Bolt_trail": {
      "particleName": "bw:buzz_bolt_trail",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.58,
          "green": 0.58,
          "blue": 0.58
        }
      }
    },
    "Bolt_collide": {
      "particleName": "bw:buzz_bolt_burst",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.58,
          "green": 0.58,
          "blue": 0.58
        }
      }
    },
    "Bubble": {
      "particleName": "bw:buzz_bubble_particle",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.58,
          "green": 0.58,
          "blue": 0.58
        },
        "float:spell_radius": 1.0
      }
    },
    "Cube": {
      "particleName": "bw:buzz_cube_particle",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.58,
          "green": 0.58,
          "blue": 0.58
        },
        "vector:offset": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "vector:dimensions": {
          "x": 0,
          "y": 0,
          "z": 0
        }
      }
    }
  },
  // Erupt
  // Resonate
  "Exchange": {
    "Self": {
      "particleName": "bw:conceal_self_particle",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.11,
          "green": 0.90,
          "blue": 0.039
        }
      }
    },
    "Sight": {
      "particleName": "bw:conceal_bolt_burst",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.11,
          "green": 0.90,
          "blue": 0.039
        }
      }
    },
    "Bolt_trail": {
      "particleName": "bw:conceal_bolt_trail",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.11,
          "green": 0.90,
          "blue": 0.039
        }
      }
    },
    "Bolt_collide": {
      "particleName": "bw:conceal_bolt_burst",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.11,
          "green": 0.90,
          "blue": 0.039
        }
      }
    },
    "Bubble": {
      "particleName": "bw:conceal_bubble_particle",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.11,
          "green": 0.90,
          "blue": 0.039
        },
        "float:spell_radius": 1.0
      }
    },
    "Cube": {
      "particleName": "bw:conceal_cube_particle",
      "colorable": true,
      "mapVariables": {
        "color:color": {
          "red": 0.11,
          "green": 0.90,
          "blue": 0.039
        },
        "vector:offset": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "vector:dimensions": {
          "x": 0,
          "y": 0,
          "z": 0
        }
      }
    }
  }
}

export function triggerVSFX(dimension, nounType, noun, verb, position) {
  let ptclInfo = faeSpellParticles[verb.verbName];
  let nounPtcl = ptclInfo[nounType];
  
  // If a particle is present here
  if (nounPtcl != undefined) {
    let molang = new MolangVariableMap();
    
    let name = nounPtcl.particleName;
    for (let [k, v] of Object.entries(nounPtcl.mapVariables)) {
      // Add Color to Map
      if (k.startsWith("color:")) {
        if (nounPtcl.colorable && verb.color != undefined) {
          molang.setColorRGB(`variable.${k.slice(6)}`, verb.color);
        } else {
          molang.setColorRGB(`variable.${k.slice(6)}`, v);
        }
      }
      if (k.startsWith("float:")) {
        let varBit = k.slice(6);
        // Controls bubble radius
        if (varBit == "spell_radius") {
          molang.setFloat(`variable.${varBit}`, noun.area);
        } else {
          molang.setFloat(`variable.${varBit}`, v);
        }
      }
      if (k.startsWith("vector:")) {
        let varBit = k.slice(7);
        // Controls cube dimensions
        if (varBit == "offset") {
          let offset = {
            "x": -Math.floor(noun.cubeArea.x/2)/2+1,
            "y": noun.cubeArea.y/2/2+0.5,
            "z": -Math.floor(noun.cubeArea.z/2)/2+1
          }
          molang.setVector3(`variable.${varBit}`, offset);
        } else 
        if (varBit == "dimensions") {
          let correctedVec = {
            x: noun.cubeArea.x/2+0.5,
            y: noun.cubeArea.y/2+1,
            z: noun.cubeArea.z/2+0.5
          }
          molang.setVector3(`variable.${varBit}`, correctedVec);
        } else {
          molang.setVector3(`variable.${varBit}`, v);
        }
      }
    }
    
    if (noun.offset != undefined) {
      position = Vector3.add(position, noun.offset);
    }
    dimension.spawnParticle(name, position, molang);
  } else {
    console.warn("§c[!]§r No spell particle.")
  }
}

export function transferOrbos(caster, target, power) {
  let orbosBoard = world.scoreboard.getObjective("bw:oEnergy");
  let inv = caster.getComponent("minecraft:inventory")?.container;
  
  if (inv != undefined) {
    if (getItem(inv, "bw:raw_orbos")) {
      orbosBoard.addScore(target, 60 * (1+power));
      console.warn(`${target.id}: ${orbosBoard.getScore(target)}`)
      removeItem(inv, "bw:raw_orbos");
    }
  }
}

function swapRandomItems(target, caster) {
  if (target?.hasComponent("minecraft:inventory") && caster?.hasComponent("minecraft:inventory")) {
    let inventories = [
      target.getComponent("minecraft:inventory").container,
      caster.getComponent("minecraft:inventory").container
    ];
    let invSlots = [
      Math.floor(inventories[0].size * Math.random()),
      Math.floor(inventories[1].size * Math.random())
    ];
    let invItems = [
      inventories[0].getItem(invSlots[0]),
      inventories[1].getItem(invSlots[1])
    ];
    
    inventories[0].setItem(invSlots[0], invItems[1]);
    inventories[1].setItem(invSlots[1], invItems[0]);
  }
}
function swapHunger(target, caster) {
  if (target?.hasComponent("minecraft:player.hunger") && caster?.hasComponent("minecraft:player.hunger")) {
    let hungers = [
      target.getComponent("minecraft:player.hunger").currentValue,
      caster.getComponent("minecraft:player.hunger").currentValue
    ];
    
    target.getComponent("minecraft:player.hunger").setCurrentValue(hungers[1]);
    caster.getComponent("minecraft:player.hunger").setCurrentValue(hungers[0]);
  }
}
function swapOrbos(target, caster) {
  let orbos = world.scoreboard.getObjective("bw:orbos");
  
  if (orbos.getScore(target) != undefined && orbos.getScore(caster) != undefined) {
    let orbosSize = [
      orbos.getScore(target),
      orbos.getScore(caster)
    ]
    
    orbos.setScore(target, orbosSize[1]);
    orbos.setScore(caster, orbosSize[0]);
  }
}
function swapFatigue(target, caster) {
  let fatg = world.scoreboard.getObjective("bw:Fatigue");
  
  if (fatg.getScore(target) != undefined && fatg.getScore(caster) != undefined) {
    let fatgSize = [
      fatg.getScore(target),
      fatg.getScore(caster)
    ]
    
    fatg.setScore(target, fatgSize[1]);
    fatg.setScore(caster, fatgSize[0]);
  }
}

export function triggerEruption(target, damageObj, caster = undefined) {
  let blockOn = target.getBlockStandingOn({
    "ignoreThinBlocks": true
  });
  
  console.warn(blockOn?.typeId);
  if (blockOn != undefined) {
    if (blockOn.hasTag("stone")) {
      applySpellDamage(target, damageObj.damage, damageObj.dmgType, damageObj.ignite, caster);
      if (diceRoll(1, 20, true) == 1) {
        blockOn.setType("minecraft:flowing_lava");
      }
      // Insert fiery eruption effect;
      return;
    }
    
    if (blockOn.hasTag("sand") || blockOn.hasTag("gravel") || blockOn.hasTag("dirt")) {
      damageObj.ignite = 0;
      damageObj.dmgType = "blunt";
      
      applySpellDamage(target, damageObj.damage, damageObj.dmgType, damageObj.ignite, caster);
      // Insert sandy eruption effect;
      return;
    }
    
    if (blockOn.hasTag("metal") && !blockOn.typeId.includes("iron_")) {
      damageObj.ignite = 0;
      damageObj.dmgType = "pierce";
      
      applySpellDamage(target, damageObj.damage, damageObj.dmgType, damageObj.ignite, caster);
      // Insert metallic eruption effect;
      return;
    }
  }
}

export function isWarded(entity, verbName) {
  if (!(entity instanceof Entity)) {
    return false;
  }
  if (entity.isValid) {
    let wardIDName = `bwWard:${verbName}`;
    if (entity.getDynamicProperty(wardIDName)) {
      return true;
    }
  }
  return false;
}

export function wardCheck(entity, verb) {
  if (entity.isValid) {
    let wardIDName = `bwWard:${verb.verbName}`;
    if (entity.getDynamicProperty(wardIDName)) {
      let ward = JSON.parse(entity.getDynamicProperty(wardIDName));
      
      let valid = false;
      if (ward.effects != undefined) {
        if (verb.verbName == "Evoke") {
          for (let efx of verb.potion_effects) {
            if (ward.effects.includes(efx)) {
              valid = true;
            }
          }
        } else
        if (verb.verbName == "Detoxify") {
          for (let efx of verb.detox_effects) {
            if (ward.effects.includes(efx)) {
              valid = true;
            }
          }
        }
      } else {
        valid = true;
      }
      
      if (valid) {
        if (diceRoll(1, 100, true) <= ward.wardChance) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
      
    }
  }
  return false;
}

export function isProtected(entity, verb) {
  let isProtected = false
  if (isWarded(entity, verb.verbName)) {
    if (wardCheck(entity, verb)) {
      isProtected = true;
    }
  }
  return isProtected;
}

export function attachCustomEffect(entity, potionInfo, caster = undefined) {
  let effectExists = entity.getDynamicProperty(potionInfo.id);
  
  if (effectExists != undefined) {
    let oldEffect = JSON.parse(effectExists);
    if (potionInfo.stackable != undefined) {
      if (!potionInfo.stackable) {
        return;
      } else {
        oldEffect.timer = oldEffect.timer + potionInfo.duration;
        oldEffect.inversed = potionInfo.inversed;
        oldEffect.amplifier = potionInfo.amplifier;
        
        oldEffect.diceSave = potionInfo.diceSave;
        
        entity.setDynamicProperty(oldEffect.id, JSON.stringify(oldEffect));
        return;
      }
    }
    if (potionInfo.overpowerable != undefined) {
      if (oldEffect.amplifier < potionInfo.amplifier) {
        entity.setDynamicProperty(oldEffect.id, undefined);
      }
    }
  }
  
  if (entity instanceof Player) {
    if (potionInfo.startingText != undefined || potionInfo.inverseStartingText != undefined) {
      let txt = potionInfo.startingText;
      if (potionInfo.inversed) {
        if (potionInfo.inverseStartingText != undefined) {
          txt = potionInfo.inverseStartingText;
        }
        
        if (potionInfo.inversedName != undefined) {
          txt = txt.replaceAll("#text", potionInfo.inversedName);
        }
      }
      
      txt = txt.replaceAll("#text", potionInfo.name);
      entity.sendMessage(txt);
    }
  }
  
  if (potionInfo.inversed) {
    if (potionInfo.inverseEndingText != undefined) {
      potionInfo.endingText = potionInfo.inverseEndingText;
    }
    if (potionInfo.inversedName != undefined) {
      potionInfo.name = potionInfo.inversedName;
    }
  }
  
  let obj = {
    timer: potionInfo.duration,
    endMsg: potionInfo.endingText,
    vanishOnDeath: true
  }
  if (potionInfo.sticky != undefined) {
    obj.cleansable = true;
  }
  if (potionInfo.damage != undefined) {
    obj.damage = potionInfo.damage;
  }
  if (potionInfo.amplifier != undefined) {
    obj.amplifier = potionInfo.amplifier;
  }
  if (potionInfo.inversed != undefined) {
    obj.inversed = potionInfo.inversed;
  }
  if (potionInfo.diceSave != undefined) {
    obj.diceSave = potionInfo.diceSave;
  }
  if (potionInfo.name != undefined) {
    obj.name = potionInfo.name;
  }
  
  if (caster != undefined) {
    obj.caster = caster;
  }
  
  entity.setDynamicProperty(potionInfo.id, JSON.stringify(obj));
}

export const baseNounOrbos = 50;
export const baseNounFatigue = 20;
export const baseVerbOrbos = 100;
export const baseVerbFatigue = 50;

export const inSpellCosts = {
  "Self": {
    "orbos": 0.2,
    "fatigue": 0.1,
    "tags": ["infusion"],
    "cooldown": 0.3
  },
  "Sight": {
    "orbos": 0.6,
    "fatigue": 0.15,
    "tags": ["infusion"],
    "cooldown": 0.3
  },
  "Bolt": {
    "orbos": 0.8,
    "fatigue": 0.25,
    "tags": ["emission"],
    "cooldown": 0.2
  },
  "Bubble": {
    "orbos": 1.2,
    "fatigue": 4.0,
    "tags": ["emission", "field"],
    "cooldown": 2.25
  },
  "Cube": {
    "orbos": 1.5,
    "fatigue": 4.0,
    "tags": ["field"],
    "cooldown": 2.5
  },
  "Ward": {
    "orbos": 1.0,
    "fatigue": 2.0,
    "tags": ["ward", "infusion"],
    "cooldown": 2.0
  },
  
  // General
  "Conceal": {
    "orbos": 0.45,
    "fatigue": 0.2,
    "tags": ["abjuration", "occult"],
    "cooldown": 0.7
  },
  "Channel": {
    "orbos": -1000000.0,
    "fatigue": -1000000.0,
    "tags": ["occult"],
    "cooldown": -100.0
  },
  "Spark": {
    "orbos": 0.3,
    "fatigue": 0.7,
    "tags": ["conjuration", "occult", "fire"],
    "cooldown": 0.3
  },
  // Spring
  "Egg": {
    "orbos": 2.0,
    "fatigue": 2.0,
    "tags": ["spring", "occult", "transmutation", "life"],
    "cooldown": 4.5
  },
  "Buzz": {
    "orbos": 0.6,
    "fatigue": 0.25,
    "tags": ["spring", "enchantment", "life"],
    "cooldown": 3.0
  },
  "Thorns": {
    "orbos": 1.0,
    "fatigue": 0.3,
    "tags": ["spring", "enchantment", "life"],
    "cooldown": 2.0
  },
  "Apple": {
    "orbos": 1.2,
    "fatigue": 0.5,
    "tags": ["spring", "enchantment", "transmutation", "life"],
    "cooldown": 3.5
  },
  "Heal": {
    "orbos": 1.9,
    "fatigue": 2.0,
    "tags": ["spring", "abjuration", "life"],
    "cooldown": 5
  },
  "Detoxify": {
    "orbos": 0.9,
    "fatigue": 1.0,
    "tags": ["spring", "abjuration", "occult"],
    "cooldown": 2.5
  },
  "Growth": {
    "orbos": 0.25,
    "fatigue": 0.18,
    "tags": ["spring", "transmutation", "life"],
    "cooldown": 1
  },
  "Bloom": {
    "orbos": 0.65,
    "fatigue": 0.3,
    "tags": ["spring", "transmutation", "life"],
    "cooldown": 2
  },
  "Hunt": {
    "orbos": 0.85,
    "fatigue": 0.6,
    "tags": ["spring", "enchantment", "life", "occult", "mental", "spirit"],
    "cooldown": 3
  },
  "Pulse": {
    "orbos": 3.0,
    "fatigue": 2.5,
    "tags": ["spring", "enchantment", "life"],
    "cooldown": 6
  },
  // Summer
  "Ignite": {
    "orbos": 0.75,
    "fatigue": 0.4,
    "tags": ["evocation", "fire"],
    "cooldown": 0.5
  },
  "Gust": {
    "orbos": 0.6,
    "fatigue": 0.6,
    "tags": ["evocation", "weather"],
    "cooldown": 0.3
  },
  "Frenzy": {
    "orbos": 1.0,
    "fatigue": 0.6,
    "tags": ["summer"],
    "cooldown": 1.0
  },
  "Surge": {
    "orbos": 0.7,
    "fatigue": 0.6,
    "tags": ["evocation", "weather"],
    "cooldown": 1.0
  },
  "Shock": {
    "orbos": 0.75,
    "fatigue": 0.4,
    "tags": ["evocation", "weather"],
    "cooldown": 0.5
  },
  "Dry": {
    "orbos": 0.5,
    "fatigue": 0.3,
    "tags": ["evocation", "water", "fire"],
    "cooldown": 0.75
  },
  "Dig": {
    "orbos": 0.3,
    "fatigue": 0.7,
    "tags": ["transmutation", "mineral"],
    "cooldown": 0.25
  },
  "Stone": {
    "orbos": 0.3,
    "fatigue": 0.7,
    "tags": ["transmutation", "mineral"],
    "cooldown": 0.5
  },
  "Splash": {
    "orbos": 0.3,
    "fatigue": 0.7,
    "tags": ["evocation", "water"],
    "cooldown": 0.3
  },
}
export const spellNounList = {
  "Self": {
    "weight": 1,
    "incompatibleNouns": [
      "Bolt",
      "Sight",
      "Ward",
      "Bubble",
      "Cube"
    ],
    "parameters": {},
    "components": {
      "totalChecks": 1,
      "itemArray": [
        {
          "itemName": "minecraft:wheat_seeds",
          "itemAmount": 2
        }
      ]
    }
  },
  "Sight": {
    "weight": 2,
    "incompatibleNouns": [
      "Self",
      "Bolt"
    ],
    "parameters": {
      "sightRange": 4,
      "sensitive": false,
      "face_sensitive": false,
      "waterproof": false,
      "astral": false,
      "detonate": false,
      "targetAmount": 1
    },
    "components": {
      "totalChecks": 1,
      "itemArray": [
        {
          "itemName": "minecraft:spider_eye",
          "itemAmount": 1
        }
      ]
    },
    "candleModifiers": [
      {
        "type": "minecraft:green_candle",
        "isBlock": true,
        "amount": 1,
        "weight": 0.25,
        "augments": {
          "sightRange": +1
        }
      },
      {
        "type": "minecraft:orange_candle",
        "isBlock": true,
        "weight": 0.25,
        "amount": 1,
        "augments": {
          "detonate": true
        }
      },
      {
        "type": "minecraft:blue_candle",
        "isBlock": true,
        "weight": 0.25,
        "amount": 1,
        "augments": {
          "waterproof": true
        }
      },
      {
        "type": "minecraft:light_blue_candle",
        "isBlock": true,
        "weight": 0.25,
        "amount": 1,
        "augments": {
          "astral": true
        }
      },
      {
        "type": "minecraft:cyan_candle",
        "isBlock": true,
        "weight": 0.25,
        "amount": 1,
        "augments": {
          "sensitive": true
        }
      },
      {
        "type": "minecraft:light_blue_candle",
        "isBlock": true,
        "weight": 0.25,
        "amount": 1,
        "augments": {
          "face_sensitive": true
        }
      },
      {
        "type": "minecraft:lime_candle",
        "amount": 1,
        "weight": 0.25,
        "augments": {
          "targetAmount": +1
        }
      }
    ]
  },
  "Bolt": {
    "weight": 2,
    "incompatibleNouns": [
      "Sight",
      "Self"
    ],
    "parameters": {
      "lifetime": 20,
      "speed": 0.3,
      "gravity": 0.0,
      "waterproof": false,
      "detonate": false,
      "face_sensitive": false,
      "sensitive": false
    },
    "components": {
      "totalChecks": 1,
      "itemArray": [
        {
          "itemName": "minecraft:arrow",
          "itemAmount": 1
        }
      ]
    },
    "candleModifiers": [
      {
        "type": "minecraft:orange_candle",
        "isBlock": true,
        "amount": 1,
        "weight": 0.25,
        "augments": {
          "detonate": true
        }
      },
      {
        "type": "minecraft:blue_candle",
        "isBlock": true,
        "amount": 1,
        "weight": 0.25,
        "augments": {
          "waterproof": true
        }
      },
      {
        "type": "minecraft:light_blue_candle",
        "isBlock": true,
        "weight": 0.25,
        "amount": 1,
        "augments": {
          "face_sensitive": true
        }
      },
      {
        "type": "minecraft:cyan_candle",
        "isBlock": true,
        "amount": 1,
        "weight": 0.25,
        "augments": {
          "sensitive": true
        }
      },
      {
        "type": "minecraft:red_candle",
        "isBlock": true,
        "amount": 2,
        "weight": 0.5,
        "augments": {
          "speed": +0.15
        },
        "limits": {
          "speed": {
            "max": 1.0
          }
        }
      },
      {
        "type": "minecraft:yellow_candle",
        "isBlock": true,
        "amount": 2,
        "weight": 0.5,
        "augments": {
          "lifetime": +20
        }
      },
      {
        "type": "minecraft:gray_candle",
        "amount": 1,
        "weight": 0.1,
        "augments": {
          "gravity": +0.001
        }
      },
      {
        "type": "minecraft:light_gray_candle",
        "amount": 1,
        "weight": 0.1,
        "augments": {
          "gravity": -0.001
        }
      }
    ]
  },
  "Bubble": {
    "weight": 3,
    "incompatibleNouns": [
      "Bolt",
      "Cube",
      "Sight",
      "Self"
    ],
    "parameters": {
      "range": 1,
      "hollow": false,
      "duration": 0
    },
    "components": {
      "totalChecks": 1,
      "itemArray": [
        {
          "itemName": "minecraft:tnt",
          "itemAmount": 1
        }
      ]
    },
    "candleModifiers": [
      {
        "type": "minecraft:yellow_candle",
        "isBlock": true,
        "amount": 2,
        "augments": {
          "duration": +5
        }
      },
      {
        "type": "minecraft:green_candle",
        "isBlock": true,
        "amount": 1,
        "augments": {
          "range": +1
        }
      },
      {
        "type": "minecraft:orange_candle",
        "isBlock": true,
        "amount": 1,
        "augments": {
          "hollow": true
        }
      }
    ]
  },
  "Cube": {
    "weight": 3,
    "incompatibleNouns": [
      "Bolt",
      "Bubble",
      "Sight",
      "Self"
    ],
    "parameters": {
      "cubeArea": {
        "x": 3,
        "y": 3,
        "z": 3
      },
      "offset": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "localized": false,
      "duration": 0
    },
    "components": {
      "totalChecks": 1,
      "itemArray": [
        {
          "itemName": "minecraft:stone",
          "itemAmount": 9
        }
      ]
    },
    "candleModifiers": [
      {
        "type": "minecraft:purple_candle",
        "isBlock": false,
        "amount": 1,
        "weight": 0.1,
        "augments": {
          "cubeArea": {
            "x": +1
          }
        }
      },
      {
        "type": "minecraft:magenta_candle",
        "isBlock": false,
        "amount": 1,
        "weight": 0.1,
        "augments": {
          "cubeArea": {
            "y": +1
          }
        }
      },
      {
        "type": "minecraft:pink_candle",
        "isBlock": false,
        "amount": 1,
        "weight": 0.1,
        "augments": {
          "cubeArea": {
            "z": +1
          }
        }
      },
      
      {
        "type": "minecraft:white_candle",
        "isBlock": false,
        "amount": 1,
        "weight": 0.1,
        "augments": {
          "offset": {
            "x": +1
          }
        }
      },
      {
        "type": "minecraft:gray_candle",
        "isBlock": false,
        "amount": 1,
        "weight": 0.1,
        "augments": {
          "offset": {
            "y": +1
          }
        }
      },
      {
        "type": "minecraft:light_gray_candle",
        "isBlock": false,
        "amount": 1,
        "weight": 0.1,
        "augments": {
          "offset": {
            "z": +1
          }
        }
      },
      
      {
        "type": "minecraft:brown_candle",
        "isBlock": true,
        "amount": 1,
        "weight": 0.25,
        "augments": {
          "localized": true
        }
      },
      
      {
        "type": "minecraft:yellow_candle",
        "isBlock": true,
        "amount": 1,
        "weight": 0.25,
        "augments": {
          "duration": +5
        }
      }
    ]
  },
  "Ward": {
    "weight": 1,
    "incompatibleNouns": [
      "Self"
    ],
    "parameters": {
      "wardChance": 40,
      "duration": 15
    },
    "components": {
      "totalChecks": 1,
      "itemArray": [
        {
          "itemName": "minecraft:shield",
          "itemAmount": 1
        }
      ]
    },
    "candleModifiers": [
      {
        "type": "minecraft:red_candle",
        "isBlock": true,
        "amount": 2,
        "augments": {
          "wardChance": +5
        }
      },
      {
        "type": "minecraft:yellow_candle",
        "isBlock": true,
        "amount": 2,
        "augments": {
          "duration": +5
        }
      }
    ]
  }
}
export const spellVerbList = {
  "Conceal": {
    "weight": 1,
    "rune": "bw:conceal_faestone",
    "incompatibleNouns": [],
    "parameters": {
      "verbName": "Conceal",
      "custom_potion_effect": {
        "id": "bwDuration:conceal",
        "name": "Concealment",
        "duration": 20,
        "amplifier": 0,
        "startingText": "§d[!]§r You are hidden from magickal forces.",
        "endingText": "§d[!]§r Your concealment falls away.",
        "stackable": false
      },
      "inversion": {
        "verbName": "Reveal",
        "amplifier": 0,
        "inversion": "null"
      }
    },
    "components": {
      "totalChecks": 2,
      "itemArray": [
        {
          "itemName": "minecraft:string",
          "itemAmount": 1
        }
      ],
      "correspondences": {
        "time": ["night"]
      }
    },
    "candleModifiers": [
      {
        "type": "minecraft:black_candle",
        "isBlock": true,
        "amount": 1,
        "weight": 0,
        "augments": {
          "inverseVerb": "hehe._."
        }
      },
      {
        "type": "minecraft:red_candle",
        "isBlock": true,
        "amount": 2,
        "weight": 0.5,
        "augments": {
          "custom_potion_effect": {
            "amplifier": +1
          },
          "amplifier": +1
        }
      },
      {
        "type": "minecraft:yellow_candle",
        "isBlock": true,
        "amount": 1,
        "weight": 0.25,
        "augments": {
          "custom_potion_effect": {
            "duration": +5
          }
        }
      }
    ]
  },
  "Channel": {
    "weight": 1,
    "rune": "bw:channel_faestone",
    "incompatibleNouns": [
      "Self",
      "Bubble",
      "Cube"
    ],
    "parameters": {
      "verbName": "Channel",
      "channelOrbos": {
        "power": 1,
        "inversed": false
      }
    },
    "components": {
      "totalChecks": 1,
      "itemArray": [
        {
          "itemName": "minecraft:glass_pane",
          "itemAmount": 2
        }
      ]
    },
    "candleModifiers": [
      {
        "type": "minecraft:black_candle",
        "isBlock": true,
        "amount": 1,
        "weight": 0,
        "augments": {
          "channelOrbos": {
            "inversed": true
          }
        }
      },
      {
        "type": "minecraft:red_candle",
        "isBlock": true,
        "amount": 2,
        "weight": 0.5,
        "augments": {
          "channelOrbos": {
            "power": +1
          }
        }
      }
    ]
  },
  "Spark": {
    "weight": 1,
    "rune": "bw:spark_faestone",
    "incompatibleNouns": [],
    "parameters": {
      "verbName": "Spark",
      "custom_potion_effect": {
        "id": "bwDuration:illuminate",
        "name": "Illuminance",
        "duration": 80,
        "amplifier": 0,
        "startingText": "§e[!]§r You light up like a torch.",
        "endingText": "§d[!]§r Your light dims into mundanity.",
        "stackable": false
      },
      "dealDamage": {
        "damage": 0,
        "dmgType": "occult",
        "ignite": 0
      }
    },
    "components": {
      "totalChecks": 2,
      "itemArray": [
        {
          "itemName": "minecraft:torch",
          "itemAmount": 1
        },
        {
          "itemName": "bw:natural_ash",
          "itemAmount": 1
        }
      ]
    },
    "candleModifiers": [
      {
        "type": "minecraft:red_candle",
        "isBlock": true,
        "amount": 2,
        "weight": 0.5,
        "augments": {
          "dealDamage": {
            "damage": +1
          }
        }
      }
    ]
  },
  
  "Growth": {
    "weight": 1,
    "rune": "bw:growth_faestone",
    "incompatibleNouns": [],
    "parameters": {
      "verbName": "Growth",
      "power": 0
    },
    "components": {
      "totalChecks": 4,
      "itemArray": [
        {
          "itemName": "minecraft:bone_meal",
          "itemAmount": 3
        },
        {
          "itemName": "minecraft:carrot",
          "itemAmount": 1
        },
        {
          "itemName": "minecraft:potato",
          "itemAmount": 1
        },
        {
          "itemName": "minecraft:beetroot",
          "itemAmount": 1
        }
      ]
    },
    "candleModifiers": [
      {
        "type": "minecraft:red_candle",
        "isBlock": true,
        "amount": 4,
        "weight": 0.5,
        "augments": {
          "power": +1
        }
      },
      {
        "type": "minecraft:yellow_candle",
        "isBlock": true,
        "amount": 1,
        "weight": 0.25,
        "augments": {
          "custom_potion_effect": {
            "duration": +5
          }
        }
      }
    ]
  },
  "Egg": {
    "weight": 1,
    "rune": "bw:egg_faestone",
    "incompatibleNouns": [],
    "parameters": {
      "verbName": "Egg",
      "custom_potion_effect": {
        "id": "bwDuration:eggshell_protection",
        "name": "Eggshell Ward",
        "duration": 20,
        "amplifier": 0,
        "startingText": "§a[!]§r A peculiar spell influences you, putting you under the protection of eggs.",
        "endingText": "§c[!]§r Your protective egg cracks and its shield breaks with it.",
        "stackable": false
      }
    },
    "components": {
      "totalChecks": 1,
      "itemArray": [
        {
          "itemName": "minecraft:egg",
          "itemAmount": 6
        }
      ]
    },
    "candleModifiers": [
      {
        "type": "minecraft:red_candle",
        "isBlock": true,
        "amount": 4,
        "weight": 0.5,
        "augments": {
          "custom_potion_effect": {
            "amplifier": +1
          }
        }
      },
      {
        "type": "minecraft:yellow_candle",
        "isBlock": true,
        "amount": 1,
        "weight": 0.25,
        "augments": {
          "custom_potion_effect": {
            "duration": +5
          }
        }
      }
    ]
  },
  "Buzz": {
    "weight": 1,
    "rune": "bw:buzz_faestone",
    "incompatibleNouns": [],
    "parameters": {
      "verbName": "Buzz",
      "custom_potion_effect": {
        "id": "bwDuration:honey_blessed",
        "name": "Honey Blessing",
        "duration": 20,
        "amplifier": 0,
        "startingText": "§6[!]§r Honey suddenly tastes like heaven.",
        "endingText": "§6[!]§r The divine sweetness of honey dissolves back into mundanity.",
        "stackable": false
      }
    },
    "components": {
      "totalChecks": 1,
      "itemArray": [
        {
          "itemName": "minecraft:honeycomb",
          "itemAmount": 3
        }
      ]
    },
    "candleModifiers": [
      {
        "type": "minecraft:red_candle",
        "isBlock": true,
        "amount": 4,
        "weight": 0.5,
        "augments": {
          "custom_potion_effect": {
            "amplifier": +1
          }
        }
      },
      {
        "type": "minecraft:yellow_candle",
        "isBlock": true,
        "amount": 1,
        "weight": 0.25,
        "augments": {
          "custom_potion_effect": {
            "duration": +5
          }
        }
      }
    ]
  },
  "Hunt": {
    "weight": 1,
    "rune": "bw:hunt_faestone",
    "incompatibleNouns": [],
    "parameters": {
      "verbName": "Hunt",
      "custom_potion_effect": {
        "id": "bwDuration:food_chain",
        "name": "Predator",
        "duration": 30,
        "amplifier": 0,
        "inversed": false,
        "inversedName": "Prey",
        "startingText": "§2[!]§r Nature has assigned you a role in its game, #text.",
        "endingText": "§2[!]§r You return to your natural disposition.",
        "stackable": false,
        "overpowerable": true
      }
    },
    "components": {
      "totalChecks": 1,
      "itemArray": [
        {
          "itemName": "minecraft:leather",
          "itemAmount": 3
        }
      ]
    },
    "candleModifiers": [
      {
        "type": "minecraft:black_candle",
        "isBlock": true,
        "amount": 1,
        "weight": 1,
        "augments": {
          "custom_potion_effect": {
            "inversed": true
          }
        }
      },
      {
        "type": "minecraft:red_candle",
        "isBlock": true,
        "amount": 2,
        "weight": 0.5,
        "augments": {
          "custom_potion_effect": {
            "amplifier": +1
          }
        }
      },
      {
        "type": "minecraft:yellow_candle",
        "isBlock": true,
        "amount": 1,
        "weight": 0.25,
        "augments": {
          "custom_potion_effect": {
            "duration": +5
          }
        }
      }
    ]
  },
  "Thorns": {
    "weight": 1,
    "rune": "bw:thorns_faestone",
    "incompatibleNouns": [],
    "parameters": {
      "verbName": "Thorns",
      "custom_potion_effect": {
        "id": "bwDuration:thorns",
        "name": "Thorns",
        "duration": 15,
        "amplifier": 0,
        "inversed": false,
        "startingText": "§2[!]§r An aura of prickly energy surrounds you.",
        "endingText": "§a[!]§r The thorny magick falls away.",
        "stackable": false
      }
    },
    "components": {
      "totalChecks": 2,
      "itemArray": [
        {
          "itemName": "minecraft:sweet_berries",
          "itemAmount": 2
        },
        {
          "itemName": "minecraft:wooden_sword",
          "itemAmount": 1
        }
      ]
    },
    "candleModifiers": [
      {
        "type": "minecraft:black_candle",
        "isBlock": true,
        "amount": 1,
        "weight": 1,
        "augments": {
          "custom_potion_effect": {
            "inversed": true
          }
        }
      },
      {
        "type": "minecraft:red_candle",
        "isBlock": true,
        "amount": 2,
        "weight": 0.5,
        "augments": {
          "custom_potion_effect": {
            "amplifier": +1
          }
        }
      },
      {
        "type": "minecraft:yellow_candle",
        "isBlock": true,
        "amount": 1,
        "weight": 0.25,
        "augments": {
          "custom_potion_effect": {
            "duration": +5
          }
        }
      }
    ]
  },
  "Bloom": {
    "weight": 1,
    "rune": "bw:bloom_faestone",
    "incompatibleNouns": [],
    "parameters": {
      "verbName": "Bloom",
      "custom_potion_effect": {
        "id": "bwDuration:photosynthesis",
        "name": "Bloom",
        "duration": 20,
        "amplifier": 0,
        "startingText": "§a[!]§r Your body changes. It is subtle, but you feel strangely... tree-like.",
        "endingText": "§a[!]§r Your body shifts back to how it was originally, flesh and bones with not a hint of faerie bark.",
        "stackable": false
      }
    },
    "components": {
      "totalChecks": 1,
      "itemArray": [
        {
          "itemName": "minecraft:oxeye_daisy",
          "itemAmount": 1
        }
      ]
    },
    "candleModifiers": [
      {
        "type": "minecraft:red_candle",
        "isBlock": true,
        "amount": 2,
        "weight": 0.5,
        "augments": {
          "custom_potion_effect": {
            "amplifier": +1
          }
        }
      },
      {
        "type": "minecraft:yellow_candle",
        "isBlock": true,
        "amount": 1,
        "weight": 0.25,
        "augments": {
          "custom_potion_effect": {
            "duration": +5
          }
        }
      }
    ]
  },
  "Apple": {
    "weight": 1,
    "rune": "bw:apple_faestone",
    "incompatibleNouns": [],
    "parameters": {
      "verbName": "Apple",
      "custom_potion_efect": {
        "id": "bwDuration:bounty_of_the_forest",
        "name": "Apple Blessing",
        "inversedName": "Apple Jinx",
        "duration": 25,
        "amplifier": 0,
        "inversed": false,
        "startingText": "§2[!]§r Apples are suddenly much more magickal to you.",
        "endingText": "§c[!]§r The Apples lose their mysticism and return to mundanity in your hands.",
        "stackable": false
      },
      "applify": {
        "appleChance": 8,
        "appleMaximum": 1
      }
    },
    "components": {
      "totalChecks": 1,
      "itemArray": [
        {
          "itemName": "minecraft:apple",
          "itemAmount": 8
        }
      ]
    },
    "candleModifiers": [
      {
        "type": "minecraft:black_candle",
        "isBlock": true,
        "amount": 1,
        "weight": 1,
        "augments": {
          "custom_potion_effect": {
            "inversed": true
          }
        }
      },
      {
        "type": "minecraft:red_candle",
        "isBlock": true,
        "amount": 2,
        "weight": 0.5,
        "augments": {
          "custom_potion_effect": {
            "amplifier": +1
          }
        }
      },
      {
        "type": "minecraft:yellow_candle",
        "isBlock": true,
        "amount": 1,
        "weight": 0.25,
        "augments": {
          "custom_potion_effect": {
            "duration": +5
          }
        }
      }
    ]
  },
  "Heal": {
    "weight": 1,
    "rune": "bw:heal_faestone",
    "incompatibleNouns": [],
    "parameters": {
      "verbName": "Heal",
      "healAmount": 2
    },
    "components": {
      "totalChecks": 1,
      "itemArray": [
        {
          "itemName": "minecraft:glistering_melon_slice",
          "itemAmount": 4
        }
      ]
    },
    "candleModifiers": [
      {
        "type": "minecraft:red_candle",
        "isBlock": true,
        "amount": 2,
        "weight": 0.5,
        "augments": {
          "healAmount": +1
        }
      }
    ]
  },
  "Detoxify": {
    "weight": 1,
    "rune": "bw:detoxify_faestone",
    "incompatibleNouns": [],
    "parameters": {
      "verbName": "Detoxify",
      "detox_effects": [],
      "amplifier": 0
    },
    "creatorSourcedParamEdit": (e, params) => {
      for (let i = 0; i < 2; i++) {
        if (getItem(e.getComponent("inventory").container, "bw:filled_clay_totem")) {
          let potionTotem = findItem(e.getComponent("inventory").container, "bw:filled_clay_totem").getDynamicProperty("bw:potionEffect");
          
          if (potionTotem) {
            potionTotem = JSON.parse(potionTotem);
            
            if (!params.detox_effects.includes(potionTotem.potionEffectId)) {
              params.detox_effects.push(potionTotem.potionEffectId);
              
              removeItem(e.getComponent("inventory").container, "bw:filled_clay_totem");
              e.dimension.spawnItem(new ItemStack("bw:clay_totem", 1), e.location);
            } else {
              i--;
              continue;
            }
          }
        }
      }
      return params;
    },
    "components": {
      "totalChecks": 1,
      "itemArray": [
        {
          "itemName": "minecraft:milk_bucket",
          "itemAmount": 1
        }
      ]
    },
    "candleModifiers": [
      {
        "type": "minecraft:red_candle",
        "isBlock": true,
        "amount": 2,
        "weight": 0.5,
        "augments": {
          "amplifier": +1
        }
      }
    ]
  },
  "Pulse": {
    "weight": 1,
    "rune": "bw:pulse_faestone",
    "incompatibleNouns": [],
    "parameters": {
      "verbName": "Pulse",
      "heartRate": {
        "inversed": false
      }
    },
    "components": {
      "totalChecks": 1,
      "itemArray": [
        {
          "itemName": "minecraft:echo_shard",
          "itemAmount": 2
        }
      ]
    },
    "candleModifiers": [
      {
        "type": "minecraft:black_candle",
        "isBlock": true,
        "amount": 1,
        "weight": 0.5,
        "augments": {
          "heartRate": {
            "inversed": true
          }
        }
      }
    ]
  },
  
  "Ignite": {
    "weight": 1,
    "rune": "bw:ignite_faestone",
    "incompatibleNouns": [],
    "parameters": {
      "verbName": "Ignite",
      "dealDamage": {
        "damage": 3,
        "dmgType": "burn",
        "ignite": 3
      }
    },
    "components": {
      "totalChecks": 1,
      "itemArray": [
        {
          "itemName": "minecraft:charcoal",
          "itemAmount": 3
        }
      ]
    },
    "candleModifiers": [
      {
        "type": "minecraft:red_candle",
        "isBlock": true,
        "amount": 2,
        "weight": 0.5,
        "augments": {
          "dealDamage": {
            "damage": +1
          }
        }
      },
      {
        "type": "minecraft:orange_candle",
        "isBlock": true,
        "amount": 2,
        "weight": 0.5,
        "augments": {
          "dealDamage": {
            "ignite": +1
          }
        }
      }
    ]
  },
  "Shock": {
    "weight": 1,
    "rune": "bw:shock_faestone",
    "incompatibleNouns": [],
    "parameters": {
      "verbName": "Shock",
      "dealDamage": {
        "damage": 2,
        "dmgType": "shock",
        "ignite": 0
      }
    },
    "components": {
      "totalChecks": 1,
      "itemArray": [
        {
          "itemName": "minecraft:copper_ingot",
          "itemAmount": 2
        }
      ]
    },
    "candleModifiers": [
      {
        "type": "minecraft:red_candle",
        "isBlock": true,
        "amount": 2,
        "weight": 0.5,
        "augments": {
          "dealDamage": {
            "damage": +1
          }
        }
      }
    ]
  },
  "Dry": {
    "weight": 1,
    "rune": "bw:dry_faestone",
    "incompatibleNouns": [],
    "parameters": {
      "verbName": "Dry",
      "dealDamage": {
        "damage": 2,
        "dmgType": "internal",
        "ignite": 0
      }
    },
    "components": {
      "totalChecks": 2,
      "itemArray": [
        {
          "itemName": "minecraft:bucket",
          "itemAmount": 1
        },
        {
          "itemName": "minecraft:charcoal",
          "itemAmount": 2
        }
      ]
    },
    "candleModifiers": [
      {
        "type": "minecraft:red_candle",
        "isBlock": true,
        "amount": 2,
        "weight": 0.5,
        "augments": {
          "dealDamage": {
            "damage": +1.0
          }
        }
      }
    ]
  },
  "Dig": {
    "weight": 1,
    "rune": "bw:dig_faestone",
    "incompatibleNouns": [],
    "parameters": {
      "verbName": "Dig",
      "power": 0
    },
    "components": {
      "totalChecks": 2,
      "itemArray": [
        {
          "itemName": "minecraft:wooden_pickaxe",
          "itemAmount": 1
        },
        {
          "itemName": "minecraft:wooden_shovel",
          "itemAmount": 1
        }
      ]
    },
    "candleModifiers": [
      {
        "type": "minecraft:red_candle",
        "isBlock": true,
        "amount": 2,
        "weight": 0.5,
        "augments": {
          "dealDamage": {
            "power": +1
          }
        }
      }
    ]
  },
  "Gust": {
    "weight": 1,
    "rune": "bw:gust_faestone",
    "incompatibleNouns": [],
    "parameters": {
      "verbName": "Gust",
      "power": 1.5,
      "inversion": false,
      "direction": {
        "x": 0,
        "y": 0,
        "z": 0
      }
    },
    "components": {
      "totalChecks": 1,
      "itemArray": [
        {
          "itemName": "minecraft:feather",
          "itemAmount": 1
        }
      ]
    },
    "candleModifiers": [
      {
        "type": "minecraft:black_candle",
        "isBlock": true,
        "amount": 1,
        "weight": 0,
        "augments": {
          "inversion": true
        }
      },
      {
        "type": "minecraft:red_candle",
        "isBlock": true,
        "amount": 2,
        "weight": 0.5,
        "augments": {
          "power": +1.0
        }
      }
    ]
  },
  "Surge": {
    "weight": 1,
    "rune": "bw:surge_faestone",
    "incompatibleNouns": [],
    "parameters": {
      "verbName": "Surge",
      "power": 0.5,
      "inversion": false
    },
    "components": {
      "totalChecks": 1,
      "itemArray": [
        {
          "itemName": "minecraft:gunpowder",
          "itemAmount": 2
        }
      ]
    },
    "candleModifiers": [
      {
        "type": "minecraft:black_candle",
        "isBlock": true,
        "amount": 1,
        "weight": 0,
        "augments": {
          "inversion": true
        }
      },
      {
        "type": "minecraft:red_candle",
        "isBlock": true,
        "amount": 2,
        "weight": 0.5,
        "augments": {
          "power": +1.0
        }
      }
    ]
  },
  "Stone": {
    "weight": 1,
    "rune": "bw:stone_faestone",
    "incompatibleNouns": [],
    "parameters": {
      "verbName": "Stone",
      "custom_potion_effect": {
        "id": "bwDuration:stone_skin",
        "name": "Stoneskin",
        "duration": 30,
        "amplifier": 0,
        "inversed": false,
        "inverseStartingText": "§8[!]§r Your skin hardens into rock. Your movement follows immediately.",
        "startingText": "§8[!]§r Your skin hardens into rock.",
        "endingText": "§c[!]§r Your flesh returns, replacing the cold stone.",
        "stackable": false,
        "overpowerable": true
      }
    },
    "components": {
      "totalChecks": 1,
      "itemArray": [
        {
          "itemName": "minecraft:cobblestone",
          "itemAmount": 3
        }
      ]
    },
    "candleModifiers": [
      {
        "type": "minecraft:black_candle",
        "isBlock": true,
        "amount": 1,
        "weight": 1,
        "augments": {
          "custom_potion_effect": {
            "inversed": true
          }
        }
      },
      {
        "type": "minecraft:red_candle",
        "isBlock": true,
        "amount": 2,
        "weight": 0.5,
        "augments": {
          "custom_potion_effect": {
            "amplifier": +1
          }
        }
      },
      {
        "type": "minecraft:yellow_candle",
        "isBlock": true,
        "amount": 1,
        "weight": 0.25,
        "augments": {
          "custom_potion_effect": {
            "duration": +5
          }
        }
      }
    ]
  },
  "Splash": {
    "weight": 1,
    "rune": "bw:splash_faestone",
    "incompatibleNouns": [],
    "parameters": {
      "verbName": "Splash",
      "dealDamage": {
        "damage": 0,
        "dmgType": "soak",
        "ignite": 0
      }
    },
    "components": {
      "totalChecks": 1,
      "itemArray": [
        {
          "itemName": "minecraft:potion",
          // Define Water
          "itemAmount": 1
        }
      ]
    },
    "candleModifiers": [
      {
        "type": "minecraft:red_candle",
        "isBlock": true,
        "amount": 2,
        "weight": 0.5,
        "augments": {
          "dealDamage": {
            "damage": +1
          }
        }
      }
    ]
  },
  "Frenzy": {
    "weight": 1,
    "rune": "bw:frenzy_faestone",
    "incompatibleNouns": [],
    "parameters": {
      "verbName": "Frenzy",
      "custom_potion_effect": {
        "id": "bwDuration:debauched_frenzy",
        "name": "Oberian Frenzy",
        "duration": 45,
        "diceSave": 6,
        "amplifier": 0,
        "startingText": "§c[!]§r You are intoxicated by the influence of Oberon's §cFrenzy§r. You are both stronger and weaker because of it.",
        "endingText": "§c[!]§r You recover your sanity, even though it might've taken you a while.",
        "stackable": false,
        "overpowerable": true
      }
    },
    "components": {
      "totalChecks": 1,
      "itemArray": [
        {
          "itemName": "minecraft:gold_sword",
          "itemAmount": 1
        }
      ]
    },
    "candleModifiers": [
      {
        "type": "minecraft:red_candle",
        "isBlock": true,
        "amount": 2,
        "weight": 0.5,
        "augments": {
          "custom_potion_effect": {
            "amplifier": +1
          }
        }
      },
      {
        "type": "minecraft:yellow_candle",
        "isBlock": true,
        "amount": 1,
        "weight": 0.25,
        "augments": {
          "custom_potion_effect": {
            "duration": +5
          }
        }
      }
    ]
  },
}
export const spellAestheticList = {
  "Add Color": {
    "parameters": {
      "type": "color"
    },
    "components": {
      "totalChecks": 1,
      "itemArray": [
        {
          "itemName": "minecraft:ink_sac",
          "itemAmount": 2
        }
      ]
    }
  },
  "Particle Fade": {
    "parameters": {
      "type": "overwrite",
      "values": [
        ["fade", "particle"]
      ]
    },
    "components": {
      "totalChecks": 1,
      "itemArray": [
        {
          "itemName": "minecraft:glow_ink_sac",
          "itemAmount": 2
        }
      ]
    }
  },
  "Spectral": {
    "parameters": {
      "type": "overwrite",
      "values": [
        ["spectral", true]
      ]
    },
    "components": {
      "totalChecks": 1,
      "itemArray": [
        {
          "itemName": "minecraft:sand",
          "itemAmount": 1
        }
      ]
    }
  },
  
  "Sparkles": {
    "parameters": {
      "type": "overwrite",
      "values": [
        ["aesthetic", "sparkles"]
      ]
    },
    "components": {
      "totalChecks": 1,
      "itemArray": [
        {
          "itemName": "minecraft:copper_nugget",
          "itemAmount": 1
        }
      ]
    }
  }
}

export function getSpellPieces(block, player) {
  // Runes; never consumed.
  let itemRunes = [];
  // ALL of these are getting despawned
  let allItems = [];
  // The Set that holds all unique items
  let itemSet = new Set();
  
  // Get all items and their entities and save them to the above arrays
  block.dimension.getEntitiesAtBlockLocation(block.above(1).location).forEach((i) => {
    let isItem = i.getComponent("minecraft:item");
    if (isItem) {
      if (isItem.itemStack.hasTag("bw:is_faerie_rune") || isItem.itemStack.typeId == "minecraft:hopper") {
        itemRunes.push(isItem.itemStack.typeId);
        return;
      }
      itemSet.add(isItem.itemStack.typeId);
      allItems.push([i, isItem.itemStack]);
    }
  });
  
  let spellPieceArray = [];
  let allSpellStuff = Object.entries(spellNounList).concat(Object.entries(spellVerbList));
  
  spellPieceLoop: for (let [key, value] of allSpellStuff) {
    let checkmarks = 0;
    let totalCheckmarks = value.components.totalChecks;
    
    // If a rune exists for it and it is inside the mystic circle, then auto-succeed. The Fae might not appreciate such a thing.
    if (value.rune != undefined) {
      if (itemRunes.includes(value.rune)) {
        spellPieceArray.push(key);
        continue;
      }
    }
    
    // Check if an item array exists, and if one does, run through it
    let spellItemArr = value.components.itemArray;
    if (spellItemArr) {
      if (spellItemArr.length != itemSet.size) {
        continue;
      }
      
      itemLoop: for (let item of spellItemArr) {
        let amt = 1;
        if (item.itemAmount != undefined) {
          amt = item.itemAmount;
        }
        
        for (let i of allItems) {
          // If not the right name, move on
          if (item.itemName != undefined && i[1].typeId != item.itemName) {
            continue;
          }
          
          // If not the right amount, subtract from the necessary amount. If the item over shares, mark it as destroyed
          if (i[1].amount > item.itemAmount) {
            amt = 0;
            i[1].amount = i[1].amount - item.itemAmount
          } else {
            amt = amt - i[1].amount;
            i[2] = "destroyed";
          }
          
          if (amt == 0) {
            checkmarks++;
            continue itemLoop;
          }
        }
      }
    }
    
    // Match any correspondences
    let corr = value.components.correspondences;
    if (corr != undefined) {
      let currentCorr = getWardCorrespondence(block.dimension, block.location, undefined);
      
      for (let c of Object.keys(currentCorr)) {
        if (corr[c]) {
          if (corr[c].includes(currentCorr[c])) {
            checkmarks++;
          }
        }
      }
    }
    
    if (checkmarks == totalCheckmarks) {
      spellPieceArray = key;
      break;
    }
  }
  
  // If multiple spell pieces, try combining them.
  // If still array, take the first value;
  if (Array.isArray(spellPieceArray)) {
    return [spellPieceArray[0], allItems];
  } else {
    return [spellPieceArray, allItems];
  }
}
export function getAestheticPieces(block, player) {
  // ALL of these are getting despawned
  let allItems = [];
  // The Set that holds all unique items
  let itemSet = new Set();
  
  // Get all items and their entities and save them to the above arrays
  block.dimension.getEntitiesAtBlockLocation(block.above(1).location).forEach((i) => {
    let isItem = i.getComponent("minecraft:item");
    if (isItem) {
      itemSet.add(isItem.itemStack.typeId);
      allItems.push([i, isItem.itemStack]);
    }
  });
  
  let particleArray;
  let allParticleStuff = Object.entries(spellAestheticList);
  
  particleLoop: for (let [key, value] of allParticleStuff) {
    let checkmarks = 0;
    let totalCheckmarks = value.components.totalChecks;
    
    // Check if an item array exists, and if one does, run through it
    let spellItemArr = value.components.itemArray;
    if (spellItemArr) {
      if (spellItemArr.length != itemSet.size) {
        continue;
      }
      
      itemLoop: for (let item of spellItemArr) {
        let amt = 1;
        if (item.itemAmount != undefined) {
          amt = item.itemAmount;
        }
        
        for (let i of allItems) {
          // If not the right name, move on
          if (item.itemName != undefined && i[1].typeId != item.itemName) {
            continue;
          }
          
          // If not the right amount, subtract from the necessary amount. If the item over shares, mark it as destroyed
          if (i[1].amount > item.itemAmount) {
            amt = 0;
            i[1].amount = i[1].amount - item.itemAmount
          } else {
            amt = amt - i[1].amount;
            i[2] = "destroyed";
          }
          
          if (amt == 0) {
            checkmarks++;
            continue itemLoop;
          }
        }
      }
    }
    
    // Match any correspondences
    let corr = value.components.correspondences;
    if (corr != undefined) {
      let currentCorr = getWardCorrespondence(block.dimension, block.location, undefined);
      
      for (let c of Object.keys(currentCorr)) {
        if (corr[c]) {
          if (corr[c].includes(currentCorr[c])) {
            checkmarks++;
          }
        }
      }
    }
    
    if (checkmarks == totalCheckmarks) {
      particleArray = key;
      break;
    }
  }
  
  return [particleArray, allItems];
}

export const nounCastFunctions = {
  "Self": {
    "default": (dim, spell, nested = false) => {
      let target;
      let targetType = "entityTarget";
      
      // Run validity checks
      if (!essenceCheck(target, spell.verb.filters)) {
        return;
      }
      
      if (isProtected(target, spell.verb)) {
        // Warded Particles Insert
        return;
      }
      
      if (spell.castingSource) {
        if (spell.castingSource.type == "entity") {
          target = world.getEntity(spell.castingSource.sourceID);
        }
        if (spell.castingSource.type == "jack") {
          let jack = world.getDynamicProperty(spell.castingSource.sourceID);
          if (jack) {
            let posArr = quadSplit(spell.castingSource.sourceID.slice(12));
            let jackPos = {
              x: posArr[0] * 1,
              y: posArr[1] * 1,
              z: posArr[2] * 1
            }
            if (dim.isChunkLoaded(jackPos)) {
              target = dim.getBlock(jackPos);
              targetType = "blockTarget";
            }
          }
        }
      }
      
      if (target) {
        let spellFunc = verbCastFunctions[spell.verb.verbName];
        
        if (spellFunc) {
          if (spellFunc[targetType]) {
            // Visuals
            if (targetType == "entityTarget") {
              visuals[spell.style.aesthetic](dim, target.getAABB().center, spell);
            }
            if (targetType == "blockTarget") {
              visuals[spell.style.aesthetic](dim, target.center(), spell);
            }
            
            // Cast Spell Function
            spellFunc[targetType](target, spell);
          }
        }
      }
    }
  },
  "Sight": {
    "default": (dim, spell, spellItem, useOrbos, nested = false) => {
      let target = [];
      let targetType = "entityTarget";
      let centerPos;
      
      if (spell.castingSource) {
        if (spell.castingSource.type == "entity") {
          let nodeEntity = world.getEntity(spell.castingSource.sourceID);
          centerPos = nodeEntity?.getAABB()?.center;
          
          
          let potTargets = nodeEntity?.getEntitiesFromViewDirection({ "ignoreBlockCollision": spell.noun_params.astral, "includeLiquidBlocks": !spell.noun_params.waterproof, "includePassableBlocks": spell.noun_params.sensitive, "maxDistance": spell.noun_params.sightRange});
          
          potTargets = potTargets.slice(0, spell.noun_params.targetAmount);
              
          if (potTargets.length == 0) {
            if (!spell.noun_params.astral) {
              let potBlock = nodeEntity?.getBlockFromViewDirection({"includeLiquidBlocks": !spell.noun_params.waterproof, "includePassableBlocks": spell.noun_params.sensitive, "maxDistance": spell.noun_params.sightRange});
              
              if (potBlock) {
                target = potBlock;
                targetType = "blockTarget";
              } else {
                if (spell.noun_params.detonate) {
                  let targetPos = {
                    x: nodeEntity.getHeadLocation().x + nodeEntity.getViewDirection().x * spell.noun_params.sightRange,
                    y: nodeEntity.getHeadLocation().y + nodeEntity.getViewDirection().y * spell.noun_params.sightRange,
                    z: nodeEntity.getHeadLocation().z + nodeEntity.getViewDirection().z * spell.noun_params.sightRange
                  };
                  if (dim.isChunkLoaded(targetPos)) {
                    target = {
                      block: dim.getBlock(targetPos)
                    }
                    targetType = "blockTarget";
                  }
                }
              }
            } else {
              if (spell.noun_params.detonate) {
                let targetPos = {
                  x: nodeEntity.getHeadLocation().x + nodeEntity.getViewDirection().x * spell.noun_params.sightRange,
                  y: nodeEntity.getHeadLocation().y + nodeEntity.getViewDirection().y * spell.noun_params.sightRange,
                  z: nodeEntity.getHeadLocation().z + nodeEntity.getViewDirection().z * spell.noun_params.sightRange
                };
                if (dim.isChunkLoaded(targetPos)) {
                  target = {
                    block: dim.getBlock(targetPos)
                  }
                  targetType = "blockTarget";
                }
              }
            }
          } else {
            target = potTargets;
          }
        }
        
        if (spell.castingSource.type == "jack") {
          let jack = world.getDynamicProperty(spell.castingSource.sourceID);
          if (jack) {
            let posArr = quadSplit(spell.castingSource.sourceID.slice(12));
            let jackPos = {
              x: posArr[0] * 1,
              y: posArr[1] * 1,
              z: posArr[2] * 1
            }
            if (dim.isChunkLoaded(jackPos)) {
              let nodeBlock = dim.getBlock(jackPos);
              centerPos = nodeBlock?.center();
              
              let facing = nodeBlock?.permutation.getState("minecraft:cardinal_direction");
              
              if (facing) {
                facing = getFace(facing);
              } else {
                facing = getFace("north");
              }
              
              let ray = Vector3.add(nodeBlock.center(), facing);
              dim.spawnParticle("minecraft:basic_flame_particle", ray);
              
              let potTargets = dim.getEntitiesFromRay(ray, facing, { "ignoreBlockCollision": spell.noun_params.astral, "includeLiquidBlocks": !spell.noun_params.waterproof, "includePassableBlocks": spell.noun_params.sensitive, "maxDistance": spell.noun_params.sightRange});
              
              potTargets = potTargets.slice(0, spell.noun_params.targetAmount);
              
              if (potTargets.length == 0) {
                if (!spell.noun_params.astral) {
                  let potBlock = dim.getBlockFromRay(ray, facing, {"includeLiquidBlocks": !spell.noun_params.waterproof, "includePassableBlocks": spell.noun_params.sensitive, "maxDistance": spell.noun_params.sightRange});
                  
                  if (potBlock) {
                    target = potBlock;
                    targetType = "blockTarget";
                  } else {
                    if (spell.noun_params.detonate) {
                      let targetPos = {
                        x: ray.x + facing.x * spell.noun_params.sightRange,
                        y: ray.y + facing.y * spell.noun_params.sightRange,
                        z: ray.z + facing.z * spell.noun_params.sightRange
                      };
                      if (dim.isChunkLoaded(targetPos)) {
                        target = {
                          block: dim.getBlock(targetPos)
                        }
                        targetType = "blockTarget";
                      }
                    }
                  }
                } else {
                  if (spell.noun_params.detonate) {
                    let targetPos = {
                      x: ray.x + facing.x * spell.noun_params.sightRange,
                      y: ray.y + facing.y * spell.noun_params.sightRange,
                      z: ray.z + facing.z * spell.noun_params.sightRange
                    };
                    if (dim.isChunkLoaded(targetPos)) {
                      target = {
                        block: dim.getBlock(targetPos)
                      }
                      targetType = "blockTarget";
                    }
                  }
                }
              } else {
                target = potTargets;
              }
            }
          }
        }
      }
      
      if (target && !nested) {
        if (spell.nested_noun) {
          let copySpell = JSON.parse(JSON.stringify(spell));
          // Sensitive spell
          let sensitive = copySpell.noun_params.face_sensitive;
          // Move around values
          copySpell.noun = copySpell.nested_noun.noun;
          copySpell.noun_params = copySpell.nested_noun.noun_params;
          // Remove Nested Values
          delete copySpell.nested_noun;
          
          let worked = false;
          // Cast based on changed value
          switch (copySpell.noun) {
            case "Bubble": {
              if (targetType == "entityTarget") {
                let spawnLoc = {
                  x: Math.floor(target[0].entity.location.x),
                  y: Math.floor(target[0].entity.location.y),
                  z: Math.floor(target[0].entity.location.z)
                }
                createAreaEffect(dim, spawnLoc, copySpell);
              }
              
              if (targetType == "blockTarget") {
                let blockTarg = target.block;
                if (sensitive && target.face != undefined) {
                  let face = getFace(target.face);
                  blockTarg = blockTarg.offset(face);
                }
                
                let spawnLoc = {
                  x: blockTarg.x,
                  y: blockTarg.y,
                  z: blockTarg.z
                }
                
                createAreaEffect(dim, spawnLoc, copySpell);
              }
              
              if (!worked) {
                worked = true;
              }
              break;
            }
            case "Cube": {
              if (targetType == "entityTarget") {
                let spawnLoc = {
                  x: Math.floor(target[0].entity.location.x),
                  y: Math.floor(target[0].entity.location.y),
                  z: Math.floor(target[0].entity.location.z)
                }
                createAreaEffect(dim, spawnLoc, copySpell);
              }
              
              if (targetType == "blockTarget") {
                let blockTarg = target.block;
                if (sensitive && target.face != undefined) {
                  let face = getFace(target.face);
                  blockTarg = blockTarg.offset(face);
                }
                
                let spawnLoc = {
                  x: blockTarg.x,
                  y: blockTarg.y,
                  z: blockTarg.z
                }
          
                createAreaEffect(dim, spawnLoc, copySpell);
              }
              
              if (!worked) {
                worked = true;
              }
              break;
            }
            case "Ward": {
              if (targetType == "entityTarget") {
                let entities = [];
                target.forEach(e => entities.push(e.entity));
                nounCastFunctions.Ward.onCast(entities, copySpell, true);
              }
              if (!worked) {
                worked = true;
              }
              break;
            }
          }
          
          if (worked) {
            return;
          }
        }
      }
      
      if (target) {
        if (Array.isArray(target)) {
          let found = false;
          for (let t of target) {
            // Run validity checks
            if (!essenceCheck(t.entity, spell.verb.filters)) {
              continue;
            }
            
            if (isProtected(t.entity, spell.verb)) {
              // Warded Particles Insert
              continue;
            }
            
            
            let spellFunc = verbCastFunctions[spell.verb.verbName];
            
            if (spellFunc) {
              if (spellFunc[targetType]) {
                // Visuals
                if (spell.verb.verbName == "Channel") {
                  visuals.channel_suction(dim, centerPos, t.entity.getAABB().center, spell);
                } else {
                  visuals[spell.style.aesthetic](dim, t.entity.getAABB().center, spell);
                }
                
                spellFunc[targetType](t.entity, spell);
                if (!found) {
                  found = true;
                }
              }
            }
          }
          
          if (found) {
            deductOrbos(spell.castingSource, spellItem, spell.cost, useOrbos);
          }
        } else {
          let blockTarg = target.block;
          if (spell.noun_params.face_sensitive && target.face != undefined) {
            let face = getFace(target.face);
            blockTarg = blockTarg.offset(face);
          }
          
          let spellFunc = verbCastFunctions[spell.verb.verbName];
          
          if (spellFunc) {
            if (spellFunc[targetType]) {
              if (spell.verb.verbName == "Channel") {
                visuals.channel_suction(dim, centerPos, blockTarg.center(), spell);
              } else {
                visuals[spell.style.aesthetic](dim, blockTarg.center(), spell);
              }
              
              spellFunc[targetType](blockTarg, spell);
              
              deductOrbos(spell.castingSource, spellItem, spell.cost, useOrbos);
            }
          }
        }
      }
    }
  },
  "Bolt": {
    "onShoot": (dim, spell, nested = false) => {
      if (spell.castingSource) {
        if (spell.castingSource.type == "entity") {
          let shooter = world.getEntity(spell.castingSource.sourceID);
          
          if (!shooter?.isValid) {
            return;
          }
          
          let spawnLoc = {
            x: shooter.getHeadLocation().x + shooter.getViewDirection().x,
            y: shooter.getHeadLocation().y + shooter.getViewDirection().y,
            z: shooter.getHeadLocation().z + shooter.getViewDirection().z
          }
          let firing = Vector3.scale(shooter.getViewDirection(), spell.noun_params.speed);
          
          // Where the projectile spawns
          // The direction the projectile is heading in
          // The spell object
          // The owner's id
          createBolt(dim, spawnLoc, firing, spell, spell.castingSource.sourceID);
        }
        
        if (spell.castingSource.type == "jack") {
          let jack = world.getDynamicProperty(spell.castingSource.sourceID);
          if (jack) {
            let posArr = quadSplit(spell.castingSource.sourceID.slice(12));
            let jackPos = {
              x: posArr[0] * 1,
              y: posArr[1] * 1,
              z: posArr[2] * 1
            }
            if (dim.isChunkLoaded(jackPos)) {
              let shooter = dim.getBlock(jackPos);
              
              let facing = shooter.permutation.getState("minecraft:cardinal_direction");
              
              if (facing) {
                facing = getFace(facing);
              } else {
                facing = getFace("north");
              }
              
              let spawnLoc = Vector3.add(shooter.center(), facing);
              facing = Vector3.scale(facing, spell.noun_params.speed);
              dim.spawnParticle("minecraft:basic_flame_particle", spawnLoc);
              
              createBolt(dim, spawnLoc, facing, spell, jack.owner);
            }
          }
        }
      }
    },
    "onCollide": (target, targetType, spell, nested = false) => {
      if (target && !nested) {
        if (spell.nested_noun != undefined) {
          let copySpell = JSON.parse(JSON.stringify(spell));
          // Move around values
          copySpell.noun = copySpell.nested_noun.noun;
          copySpell.noun_params = copySpell.nested_noun.noun_params;
          // Remove Nested Values
          delete copySpell.nested_noun;
          
          let worked = false;
          // Cast based on changed value
          switch (copySpell.noun) {
            case "Bubble": {
              if (targetType == "entityTarget") {
                let spawnLoc = {
                  x: Math.floor(target.location.x),
                  y: Math.floor(target.location.y),
                  z: Math.floor(target.location.z)
                }
                createAreaEffect(target.dimension, spawnLoc, copySpell);
              }
              
              if (targetType == "blockTarget") {
                let spawnLoc = {
                  x: target.x,
                  y: target.y,
                  z: target.z
                }
          
                createAreaEffect(target.dimension, spawnLoc, copySpell);
              }
              
              if (!worked) {
                worked = true;
              }
              break;
            }
            case "Cube": {
              if (targetType == "entityTarget") {
                let spawnLoc = {
                  x: Math.floor(target.location.x),
                  y: Math.floor(target.location.y),
                  z: Math.floor(target.location.z)
                }
                createAreaEffect(target.dimension, spawnLoc, copySpell);
              }
              
              if (targetType == "blockTarget") {
                let spawnLoc = {
                  x: target.x,
                  y: target.y,
                  z: target.z
                }
          
                createAreaEffect(target.dimension, spawnLoc, copySpell);
              }
              
              if (!worked) {
                worked = true;
              }
              break;
            }
            case "Ward": {
              if (targetType == "entityTarget") {
                nounCastFunctions.Ward.onCast([target], copySpell, true);
              }
              if (!worked) {
                worked = true;
              }
              break;
            }
          }
          
          if (worked) {
            return;
          }
        }
      }
      
      if (target) {
        // Run validity checks
        if (!essenceCheck(target, spell.verb.filters)) {
          return;
        }
        
        if (isProtected(target, spell.verb)) {
          // Warded Particles Insert
          return;
        }
        let spellFunc = verbCastFunctions[spell.verb.verbName];
        
        if (spellFunc) {
          if (spellFunc[targetType]) {
            spellFunc[targetType](target, spell);
          }
        }
      }
    }
  },
  "Bubble": {
    "onCreate": (dim, spell, nested = false) => {
      if (spell.castingSource) {
        if (spell.castingSource.type == "entity") {
          let entity = world.getEntity(spell.castingSource.sourceID);
          
          if (!entity?.isValid) {
            return;
          }
          
          let spawnPos = {
            x: Math.floor(entity.location.x),
            y: Math.floor(entity.location.y),
            z: Math.floor(entity.location.z)
          }
          
          createAreaEffect(dim, spawnPos, spell);
        }
        
        if (spell.castingSource.type == "jack") {
          let jack = world.getDynamicProperty(spell.castingSource.sourceID);
          if (jack) {
            let posArr = quadSplit(spell.castingSource.sourceID.slice(12));
            let jackPos = {
              x: posArr[0] * 1,
              y: posArr[1] * 1,
              z: posArr[2] * 1
            }
            if (dim.isChunkLoaded(jackPos)) {
              createAreaEffect(dim, jackPos, spell);
            }
          }
        }
      }
    },
    "onSustained": (targets, spell, nested = false) => {
      for (let target of targets) {
        // Run validity checks
        if (!essenceCheck(target, spell.verb.filters)) {
          continue;
        }
        
        if (isProtected(target, spell.verb)) {
          // Warded Particles Insert
          continue;
        }
        
        if (!nested) {
          if (spell.nested_noun != undefined) {
            let copySpell = JSON.parse(JSON.stringify(spell));
            // Sensitive spell
            let sensitive = copySpell.noun_params.sensitive;
            // Move around values
            copySpell.noun = copySpell.nested_noun.noun;
            copySpell.noun_params = copySpell.nested_noun.noun_params;
            // Remove Nested Values
            delete copySpell.nested_noun;
            
            let worked = false;
            // Cast based on changed value
            switch (copySpell.noun) {
              case "Ward": {
                nounCastFunctions.Ward.onCast([target], copySpell, true);
                
                if (!worked) {
                  worked = true;
                }
                break;
              }
            }
            
            if (worked) {
              continue;
            }
          }
        }
        
        let spellFunc = verbCastFunctions[spell.verb.verbName];
        
        if (spellFunc) {
          if (spellFunc["entityTarget"]) {
            spellFunc["entityTarget"](target, spell);
          }
        }
      }
    }
  },
  "Cube": {
    "onCreate": (dim, spell, nested = false) => {
      if (spell.castingSource) {
        if (spell.castingSource.type == "entity") {
          let entity = world.getEntity(spell.castingSource.sourceID);
          
          if (!entity?.isValid) {
            return;
          }
          
          let spawnPos = {
            x: Math.floor(entity.location.x) + 0.5,
            y: Math.floor(entity.location.y) + 0.5,
            z: Math.floor(entity.location.z) + 0.5
          }
          
          createAreaEffect(dim, spawnPos, spell);
        }
        
        if (spell.castingSource.type == "jack") {
          let jack = world.getDynamicProperty(spell.castingSource.sourceID);
          if (jack) {
            let posArr = quadSplit(spell.castingSource.sourceID.slice(12));
            let jackPos = {
              x: posArr[0] * 1,
              y: posArr[1] * 1,
              z: posArr[2] * 1
            }
            if (dim.isChunkLoaded(jackPos)) {
              createAreaEffect(dim, jackPos, spell);
            }
          }
        }
      }
    },
    "onSustained": (targets, spell, nested = false) => {
      for (let target of targets) {
        // Run validity checks
        if (!essenceCheck(target, spell.verb.filters)) {
          continue;
        }
        
        if (isProtected(target, spell.verb)) {
          // Warded Particles Insert
          continue;
        }
        
        if (!nested) {
          if (spell.nested_noun != undefined) {
            let copySpell = JSON.parse(JSON.stringify(spell));
            // Sensitive spell
            let sensitive = copySpell.noun_params.sensitive;
            // Move around values
            copySpell.noun = copySpell.nested_noun.noun;
            copySpell.noun_params = copySpell.nested_noun.noun_params;
            // Remove Nested Values
            delete copySpell.nested_noun;
            
            let worked = false;
            // Cast based on changed value
            switch (copySpell.noun) {
              case "Ward": {
                nounCastFunctions.Ward.onCast([target], copySpell, true);
                
                if (!worked) {
                  worked = true;
                }
                break;
              }
            }
            
            if (worked) {
              continue;
            }
          }
        }
        
        let spellFunc = verbCastFunctions[spell.verb.verbName];
        
        if (spellFunc) {
          if (spellFunc["entityTarget"]) {
            spellFunc["entityTarget"](target, spell);
          }
        }
      }
    },
    "onInstant": (dim, vol, spell) => {
      let volume = new BlockVolume(vol.from, vol.to);
      
      for (let vector of volume.getBlockLocationIterator()) {
        if (!dim.isChunkLoaded(vector)) {
          continue;
        }
        
        let target = dim.getBlock(vector);
        
        let spellFunc = verbCastFunctions[spell.verb.verbName];
        
        if (spellFunc) {
          if (spellFunc["blockTarget"]) {
            spellFunc["blockTarget"](target, spell);
          }
        }
      }
    },
  },
  "Ward": {
    // Ward is unique in that it works the exact same way almost every time.
    "onCast": (entities, spell, nested = false) => {
      const specialVerbs = [
        "Evoke",
        "Detoxify"
      ];
      for (let entity of entities) {
        if (!entity?.isValid) {
          continue;
        }
        // Run validity checks
        if (!essenceCheck(entity, spell.verb.filters)) {
          continue;
        }
        
        if (isProtected(entity, spell.verb)) {
          // Warded Particles Insert
          continue;
        }
        
        if (!specialVerbs.includes(spell.verb.verbName)) {
          let wardObj = {
            "timer": spell.noun_params.duration,
            "wardChance": spell.noun_params.wardChance,
            "verb": spell.verb.verbName
          }
          let wardName = `bwWard:${spell.verb.verbName}`;
          entity.setDynamicProperty(wardName, JSON.stringify(wardObj));
        } else {
          let effects = [];
          if (spell.verb.detox_effects != undefined) {
            effects = effects.concat(spell.verb.detox_effects);
          }
          if (spell.verb.potion_effects != undefined) {
            effects = effects.concat(spell.verb.potion_effects);
          }
          
          let wardObj = {
            "timer": spell.noun_params.duration,
            "wardChance": spell.noun_params.wardChance,
            "verb": spell.verb.verbName,
            "validEffects": effects
          }
          let wardName = `bwWard:${spell.verb.verbName}`;
          entity.setDynamicProperty(wardName, JSON.stringify(wardObj));
        }
        
        visuals[spell.style.aesthetic](entity.dimension, entity.getAABB().center, spell);
      }
    }
  }
}
export const verbCastFunctions = {
  "Conceal": {
    "entityTarget": (target, spell) => {
      if (target.isValid) {
        // Resolve the Effect
        attachCustomEffect(target, spell.verb.custom_potion_effect);
      }
    }
  },
  "Spark": {
    "entityTarget": (target, spell) => {
      let source = getSourceFromSpell(spell.castingSource);
      
      if (target.isValid) {
        let power = spell.verb.dealDamage.damage;
        
        if (power > 0) {
          let caster = undefined;
          if (spell.castingSource?.type == "entity" && source != undefined) {
            caster = source;
          }
          
          // Deals occult damage
          applySpellDamage(target, spell.verb.dealDamage.damage, spell.verb.dealDamage.dmgType, spell.verb.dealDamage.ignite, caster);
          
          let amp = power == 0 ? undefined : power;
          target.addEffect("minecraft:blindness", 2 + (2*power), {amplifier: amp});
        } else {
          attachCustomEffect(target, spell.verb.custom_potion_effect);
        }
      }
    }
  },
  "Channel": {
    "entityTarget": (target, spell) => {
      if (target.isValid) {
        let source = getSourceFromSpell(spell.castingSource);
        if (!source) {
          return;
        }
        
        let orbosScoreboard = world.scoreboard.getObjective("bw:oEnergy");
        
        let targetOrbos = 0;
        try {
          targetOrbos = orbosScoreboard.getScore(target);
        } catch (e) {
          orbosScoreboard.setScore(target, 0);
          targetOrbos = orbosScoreboard.getScore(target);
        }
        let powerValue = spell.verb.channelOrbos.power * 50;
        
        if (spell.castingSource.type == "entity") {
          let casterOrbos = orbosScoreboard.getScore(source);
          
          // Give Orbos else Take Orbos
          if (!spell.verb.channelOrbos.inversed) {
            if (casterOrbos > 0) {
              let addValue = Math.min(powerValue, casterOrbos);
              
              orbosScoreboard.addScore(target, addValue);
              orbosScoreboard.addScore(source, -addValue);
            }
          } else {
            if (targetOrbos > 0) {
              let addValue = Math.min(powerValue, targetOrbos);
              
              orbosScoreboard.addScore(source, addValue);
              orbosScoreboard.addScore(target, -addValue);
            }
          }
        }
        if (spell.castingSource.type == "jack") {
          let jackOWard;
          
          if (world.getDynamicProperty(spell.castingSource.sourceID) != undefined) {
            jackOWard = JSON.parse(world.getDynamicProperty(spell.castingSource.sourceID));
          } else {
            return;
          }
    
          let casterOrbos = jackOWard.storedOrbos;
          
          // Give Orbos else Take Orbos
          if (!spell.verb.channelOrbos.inversed) {
            // Ensure I'm using the right value;
            try {
              jackOWard = JSON.parse(world.getDynamicProperty(spell.castingSource.sourceID));
            } catch (err) {
              console.warn("Jack broke during the transfer")
              return;
            }
            casterOrbos = jackOWard.storedOrbos;
            
            if (casterOrbos > 0) {
              let addValue = Math.min(powerValue, casterOrbos);
              
              orbosScoreboard.addScore(target, addValue);
              
              jackOWard.storedOrbos = jackOWard.storedOrbos - addValue;
              world.setDynamicProperty(spell.castingSource.sourceID, JSON.stringify(jackOWard));
            }
          } else {
            // Ensure I'm using the right value;
            try {
              jackOWard = JSON.parse(world.getDynamicProperty(spell.castingSource.sourceID));
            } catch (err) {
              console.warn("Jack broke during the transfer")
              return;
            }
            casterOrbos = jackOWard.storedOrbos;
            
            if (targetOrbos > 0 && casterOrbos < 1800) {
              let addValue = Math.min(powerValue, targetOrbos);
              let diff = 1800 - (casterOrbos + addValue);
              if (diff > 0) {
                diff = 0;
              }
              
              orbosScoreboard.addScore(target, -(addValue + diff));
              
              jackOWard.storedOrbos = jackOWard.storedOrbos + addValue + diff;
              world.setDynamicProperty(spell.castingSource.sourceID, JSON.stringify(jackOWard));
            }
          }
        }
      }
    },
    "blockTarget": (target, spell) => {
      if (target.isValid) {
        let source = getSourceFromSpell(spell.castingSource);
        if (!source) {
          return;
        }
        
        let orbosScoreboard = world.scoreboard.getObjective("bw:oEnergy");
        
        let powerValue = spell.verb.channelOrbos.power * 50;
        let targetOrbos = 0;
        let jack = isJack(target);
        
        if (jack) {
          jack = JSON.parse(world.getDynamicProperty(jack));
          targetOrbos = jack.storedOrbos;
        }
        
        if (spell.castingSource.type == "entity") {
          let casterOrbos = orbosScoreboard.getScore(source);
          
          // Give Orbos else Take Orbos
          if (!spell.verb.channelOrbos.inversed) {
            if (casterOrbos > 0) {
              let addValue = Math.min(powerValue, casterOrbos);
              
              if (jack) {
                // Ensure I'm using the right value;
                try {
                  jack = JSON.parse(world.getDynamicProperty(isJack(target)));
                } catch (err) {
                  console.warn("Jack broke during the transfer")
                  return;
                }
                targetOrbos = jack.storedOrbos;
                
                if (targetOrbos < 1800) {
                  let diff = 1800 - (targetOrbos + addValue);
                  if (diff > 0) {
                    diff = 0;
                  }
                  
                  jack.storedOrbos = targetOrbos + addValue + diff;
                  world.setDynamicProperty(isJack(target), JSON.stringify(jack));
                  
                  orbosScoreboard.addScore(source, -(addValue + diff));
                }
              }
            }
          } else {
            if (jack) {
              // Ensure I'm using the right value;
              try {
                jack = JSON.parse(world.getDynamicProperty(isJack(target)));
              } catch (err) {
                console.warn("Jack broke during the transfer")
                return;
              }
              targetOrbos = jack.storedOrbos;
            }
            
            if (targetOrbos > 0) {
              let addValue = Math.min(powerValue, casterOrbos);
              
              if (jack) {
                jack.storedOrbos = targetOrbos - addValue;
                world.setDynamicProperty(isJack(target), JSON.stringify(jack));
                
                orbosScoreboard.addScore(source, addValue);
              }
            }
          }
        }
        if (spell.castingSource.type == "jack") {
          let jackOWard;
          
          if (world.getDynamicProperty(spell.castingSource.sourceID) != undefined) {
            jackOWard = JSON.parse(world.getDynamicProperty(spell.castingSource.sourceID));
          } else {
            return;
          }
          let casterOrbos = jackOWard.storedOrbos;
    
          
          // Give Orbos else Take Orbos
          if (!spell.verb.channelOrbos.inversed) {
            // Ensure I'm using the right value;
            try {
              jackOWard = JSON.parse(world.getDynamicProperty(spell.castingSource.sourceID));
            } catch (err) {
              console.warn("Jack broke during the transfer")
              return;
            }
            casterOrbos = jackOWard.storedOrbos;
            
            if (casterOrbos > 0) {
              let addValue = Math.min(powerValue, casterOrbos);
              
              if (jack) {
                // Ensure I'm using the right value;
                try {
                  jack = JSON.parse(world.getDynamicProperty(isJack(target)));
                } catch (err) {
                  console.warn("Jack broke during the transfer")
                  return;
                }
                targetOrbos = jack.storedOrbos;
                
                if (targetOrbos < 1800) {
                  let diff = 1800 - (targetOrbos + addValue);
                  if (diff > 0) {
                    diff = 0;
                  }
                  
                  jack.storedOrbos = targetOrbos + addValue + diff;
                  world.setDynamicProperty(isJack(target), JSON.stringify(jack));
                  
                  jackOWard.storedOrbos = jackOWard.storedOrbos - (addValue + diff);
                  world.setDynamicProperty(spell.castingSource.sourceID, JSON.stringify(jackOWard));
                }
              }
            }
          } else {
            // Ensure I'm using the right value;
            try {
              jackOWard = JSON.parse(world.getDynamicProperty(spell.castingSource.sourceID));
            } catch (err) {
              console.warn("Jack broke during the transfer")
              return;
            }
            casterOrbos = jackOWard.storedOrbos;
            // Double check this jack's orbos
            if (jack) {
              try {
                jack = JSON.parse(world.getDynamicProperty(isJack(target)));
              } catch (err) {
                console.warn("Jack broke during the transfer")
                return;
              }
              targetOrbos = jack.storedOrbos
            }
            
            if (targetOrbos > 0) {
              let addValue = Math.min(powerValue, targetOrbos);
              
              if (jack) {
                // Ensure I'm using the right value;
                if (casterOrbos < 1800) {
                  let diff = 1800 - (casterOrbos + addValue);
                  if (diff > 0) {
                    diff = 0;
                  }
                  
                  jack.storedOrbos = targetOrbos + (addValue - diff);
                  world.setDynamicProperty(isJack(target), JSON.stringify(jack));
                  
                  jackOWard.storedOrbos = jackOWard.storedOrbos + (addValue + diff);
                  world.setDynamicProperty(spell.castingSource.sourceID, JSON.stringify(jackOWard));
                }
              }
            }
          }
        }
      }
    }
  },
  "Reveal": {
    "entityTarget": (target, spell) => {
      if (target.isValid) {
        if (target.getDynamicProperty("bwDuration:conceal")) {
          let eft = JSON.parse(target.getDynamicProperty("bwDuration:conceal"));
          
          if (eft.amplifier <= spell.verb.amplifier) {
            target.setDynamicProperty("bwDuration:conceal", undefined);
            
            if (target instanceof Player) {
              target.sendMessage("§d[!]§r Your concealment has been shattered!");
            }
          }
        }
        target.removeEffect("minecraft:invisibility");
      }
    }
  },
  
  "Growth": {
    "entityTarget": (target, spell) => {
      if (target.isValid) {
        // Extend certain effects
        let durSurplus = (spell.verb.power + 1) * 3;
        
        // Bloom
        // Thorns
        // Apple
        let effects = [
          "bwDuration:photosynthesis",
          "bwDuration:thorns",
          "bwDuration:bounty_of_the_forest"
        ]
        
        for (let e of effects) {
          let p = target.getDynamicProperty(e);
          
          if (p != undefined) {
            let prop = JSON.parse(p);
            
            if (prop.timer != undefined) {
              prop.timer = prop.timer + durSurplus;
            }
            
            target.setDynamicProperty(e, JSON.stringify(prop));
            target.setDynamicProperty(p, undefined);
          }
        }
      }
    },
    "blockTarget": (target, spell) => {
      if (target.isValid) {
        let growthCrops = {
          "minecraft:wheat": 7,
          "minecraft:beetroot": 7,
          "minecraft:carrots": 7,
          "minecraft:potatoes": 7,
          "minecraft:melon_stems": 7,
          "minecraft:pumpkin_stems": 7,
          "minecraft:sweet_berry_bush": 3
        };
        let ageCrops = {
          "minecraft:nether_wart": 3
        };
        let grew = false;
        
        if (Object.keys(growthCrops).includes(target.typeId)) {
          grew = true;
          let maxGrowthStage = growthCrops[target.typeId];
          let allStates = target.permutation.getAllStates();
          let growthStage = allStates["growth"];
          
          if (growthStage < maxGrowthStage) {
            allStates["growth"] = growthStage + spell.verb.power + 1;
            
            if (allStates["growth"] > growthCrops[target.typeId]) {
              allStates["growth"] = growthCrops[target.typeId]
            }
            target.setPermutation(BlockPermutation.resolve(target.typeId, allStates));
          }
        }
        
        if (Object.keys(ageCrops).includes(target.typeId)) {
          grew = true;
          let maxGrowthStage = ageCrops[target.typeId];
          let allStates = target.permutation.getAllStates();
          let growthStage = allStates["age"];
          if (growthStage < maxGrowthStage) {
            allStates["age"] = growthStage + spell.verb.power + 1;
            
            if (allStates["age"] > ageCrops[target.typeId]) {
              allStates["age"] = ageCrops[target.typeId]
            }
            target.setPermutation(BlockPermutation.resolve(target.typeId, allStates));
          }
        }
        
        if (!grew) {
          growFlora(target, spell);
        }
      }
    }
  },
  "Egg": {
    "entityTarget": (target, spell) => {
      if (target.isValid) {
        attachCustomEffect(target, spell.verb.custom_potion_effect, spell.castingSource);
      }
    },
    "blockTarget": (target, spell) => {
      if (target?.isValid) {
        if (target.isAir || target.isLiquid) {
          hatchFromEgg(target, spell.castingSource)
        }
      }
    }
  },
  "Bloom": {
    "entityTarget": (target, spell) => {
      if (target.isValid) {
        attachCustomEffect(target, spell.verb.custom_potion_effect);
      }
    }
  },
  "Thorns": {
    "entityTarget": (target, spell) => {
      if (target.isValid) {
        attachCustomEffect(target, spell.verb.custom_potion_effect);
      }
    }
  },
  "Apple": {
    "entityTarget": (target, spell) => {
      if (target.isValid) {
        attachCustomEffect(target, spell.verb.custom_potion_effect);
      }
    },
    "blockTarget": (target, spell) => {
      if (target.isValid) {
        if (target.hasTag("minecraft:is_hoe_item_destructible")) {
          target.setType("minecraft:air");
          if (diceRoll(1, 20) <= spell.verb.applify.appleChance) {
            target.dimension.spawnItem(new ItemStack("minecraft:apple", Math.floor(Math.random()*spell.verb.applify.appleMaximum)+1), target.location);
          }
        }
      }
    }
  },
  "Buzz": {
    "entityTarget": (target, spell) => {
      if (target.isValid) {
        if (target.typeId != "minecraft:bee") {
          attachCustomEffect(target, spell.verb.custom_potion_effect);
        } else {
          // Give bee nectar
          target.triggerEvent("collected_nectar");
        }
      }
    }
  },
  "Hunt": {
    "entityTarget": (target, spell) => {
      if (target.isValid) {
        attachCustomEffect(target, spell.verb.custom_potion_effect);
      }
    }
  },
  "Heal": {
    "entityTarget": (target, spell) => {
      if (target.isValid) {
        let health = target.getComponent(EntityHealthComponent.componentId);
        if (health != undefined && health.currentValue > 0) {
          let healthSet = health.currentValue + spell.verb.healAmount;
          if (healthSet > health.effectiveMax) {
            healthSet = health.effectiveMax;
          }
          health.setCurrentValue(healthSet);
        }
      }
    }
  },
  "Detoxify": {
    "entityTarget": (target, spell) => {
      if (target.isValid) {
        for (let name of spell.verb.detox_effects) {
          let effect = target.getEffect(name);
          if (effect) {
            let power = effect.amplifier;
            if (power <= spell.verb.amplifier) {
              target.removeEffect(name);
            }
          }
        }
      }
    }
  },
  "Pulse": {
    "entityTarget": (target, spell) => {
      if (target.isValid) {
        let source = getSourceFromSpell(spell.castingSource);
        if (spell.castingSource.type != "entity") {
          source = undefined;
        }
        
        let heartBeat = target.getDynamicProperty("bw:heart_pulse");
        let rate = 1;
        if (spell.verb.heartRate.inversed) {
          rate = -1
        }
        
        if (heartBeat == undefined) {
          heartBeat = {
            timer: 15,
            currentRate: 0
          };
        } else {
          heartBeat = JSON.parse(heartBeat);
        }
        
        heartBeat.currentRate = heartBeat.currentRate + rate;
        // Heart Attack
        if (heartBeat.currentRate == 4) {
          applySpellDamage(target, 15, "internal", 0, source);
          if (target instanceof Player) {
            target.camera.fade({fadeColor: {"red": 1, "blue": 1, "green": 1}, fadeTime: {fadeInTime: 0.5, fadeOutTime: 0.5, holdTime: 0.5}});
            target.playSound("mob.warden.heartbeat", {
              pitch: 2
            })
          }
          heartBeat.currentRate = 0
        }
        
        // If lower than -3, bump back up to -3
        if (heartBeat.currentRate < -3) {
          heartBeat.currentRate = -3
        }
        
        // If not at 0, increase timer
        if (heartBeat.currentRate != 0) {
          heartBeat.timer = 15;
        } else {
          heartBeat.timer = 1;
        }
        
        if (target?.isValid) {
          target.setDynamicProperty("bw:heart_pulse", JSON.stringify(heartBeat));
        }
      }
    }
  },
  
  "Ignite": {
    "entityTarget": (target, spell) => {
      let source = getSourceFromSpell(spell.castingSource);
      
      if (target.isValid) {
        let caster = undefined;
        if (spell.castingSource?.type == "entity" && source != undefined) {
          caster = source;
        }
        
        // Burn entity
        applySpellDamage(target, spell.verb.dealDamage.damage, spell.verb.dealDamage.dmgType, spell.verb.dealDamage.ignite, caster);
      }
    },
    "blockTarget": (target, spell) => {
      if (!target?.isValid) {
        return;
      }
      
      let allStates = target.permutation.getAllStates();
      
      if (allStates.lit != undefined) {
        if (allStates.lit == false) {
          allStates.lit = true;
          target.setPermutation(BlockPermutation.resolve(target.typeId, allStates));
          return;
        }
      }
      if (allStates.extinguished != undefined) {
        if (allStates.extinguished == true) {
          allStates.extinguished = false;
          target.setPermutation(BlockPermutation.resolve(target.typeId, allStates));
          return;
        }
      }
      
      if (target.isAir) {
        target.setType("minecraft:fire");
        return;
      }
    }
  },
  "Shock": {
    "entityTarget": (target, spell) => {
      let source = getSourceFromSpell(spell.castingSource);
      
      if (target.isValid) {
        let caster = undefined;
        if (spell.castingSource?.type == "entity" && source != undefined) {
          caster = source;
        }
        
        // Burn entity
        applySpellDamage(target, spell.verb.dealDamage.damage, spell.verb.dealDamage.dmgType, spell.verb.dealDamage.ignite, caster);
      }
    },
    "blockTarget": (target, spell) => {
      if (target.isValid) {
        target.dimension.spawnEntity("minecraft:lightning_bolt", target.center());
      }
    }
  },
  "Dry": {
    "entityTarget": (target, spell) => {
      if (target.isValid) {
        if (target.getDynamicProperty("bwDuration:wet")) {
          target.setDynamicProperty("bwDuration:wet", undefined)
          return;
        }
        if (!target.getDynamicProperty("bwDuration:dehydrated")) {
          if (!target.isInWater) {
            target.setDynamicProperty("bwDuration:dehydrated", true)
          }
          return;
        }
      }
    },
    "blockTarget": (target, spell) => {
      if (target.isValid) {
        if (target.isLiquid) {
          target.setType("minecraft:air");
        }
        if (target.typeId == "minecraft:mud") {
          target.setType("minecraft:dirt");
        }
        if (target.typeId == "minecraft:wet_sponge") {
          target.setType("minecraft:sponge");
        }
        if (target.typeId == "minecraft:short_grass") {
          target.setType("minecraft:short_dry_grass");
        }
        if (target.typeId == "minecraft:tall_grass") {
          target.setType("minecraft:tall_dry_grass");
        }
        if (target.getComponent("minecraft:fluid_container")) {
          target.setType(target.typeId);
        }
      }
    }
  },
  "Splash": {
    "entityTarget": (target, spell) => {
      let source = getSourceFromSpell(spell.castingSource);
      
      if (target.isValid) {
        let caster = undefined;
        if (target.getDynamicProperty("bwDuration:dehydrated")) {
          target.setDynamicProperty("bwDuration:dehydrated", undefined);
        }
        
        if (spell.castingSource?.type == "entity" && source != undefined) {
          caster = source;
        }
        
        // Soak entity
        applySpellDamage(target, spell.verb.dealDamage.damage, spell.verb.dealDamage.dmgType, spell.verb.dealDamage.ignite, caster);
      }
    },
    "blockTarget": (target, spell) => {
      const fires = [
        "minecraft:fire",
        "minecraft:soul_fire",
        "minecraft:copper_fire"
      ];
      
      if (target?.isValid) {
        if (fires.includes(target.typeId)) {
          target.setType("minecraft:air");
          return;
        }
        if (target.typeId == "minecraft:dirt") {
          target.setType("minecraft:mud");
        }
        if (target.typeId == "minecraft:sponge") {
          target.setType("minecraft:wet_sponge");
        }
        if (target.typeId == "minecraft:lava") {
          target.setType("minecraft:obsidian");
        }
        
        let allStates = target.permutation.getAllStates();
        
        if (allStates.lit != undefined) {
          if (allStates.lit == true) {
            allStates.lit = false;
            target.setPermutation(BlockPermutation.resolve(target.typeId, allStates));
            return;
          }
        }
        if (allStates.extinguished != undefined) {
          if (allStates.extinguished == false) {
            allStates.extinguished = true;
            target.setPermutation(BlockPermutation.resolve(target.typeId, allStates));
            return;
          }
        }
        
        if (target.getComponent("minecraft:fluid_container")) {
          let cauldron = target.getComponent("minecraft:fluid_container");
          
          console.warn(JSON.stringify(cauldron))
          let levelDiv = Math.floor(cauldron.fillLevel/2);
          if (levelDiv <= 3) {
            let fluid = cauldron.getFluidType();
            if (levelDiv == 0) {
              cauldron.setFluidType("Water");
              cauldron.fluidColor = {
                red: 0,
                green: 0,
                blue: 0,
                alpha: 0
              }
              fluid = "Water"
            }
            console.warn(fluid);
            
            if (fluid == "Water" || fluid == "None") {
              if (levelDiv < 3) {
                cauldron.fillLevel = (levelDiv * 2) + 2
              }
            }
            if (fluid == "Lava") {
              let itemDropped;
              
              if (levelDiv == 1) {
                itemDropped = new ItemStack("minecraft:obsidian", levelDiv);
              } else {
                itemDropped = new ItemStack("minecraft:cobblestone", 1);
              }
              let i = target.dimension.spawnItem(itemDropped, target.above().center());
              cauldron.fillLevel = Math.max((levelDiv * 2) - 2, 0)
            }
            if (fluid == "Potion") {
              if (levelDiv < 3) {
                let chance = 90;
                let c = Math.round(Math.random() * 100);
                
                if (c < chance) {
                  cauldron.setFluidType("Water");
                  cauldron.fluidColor = {
                    red: 0,
                    green: 0,
                    blue: 0,
                    alpha: 0
                  }
                }
                cauldron.fillLevel = (levelDiv * 2) + 2
              }
            }
          }
        }
      }
    }
  },
  "Gust": {
    "entityTarget": (target, spell) => {
      let source = getSourceFromSpell(spell.castingSource);
      
      if (!source) {
        return;
      }
      
      if (Vector3.magnitude(spell.verb.direction) == 0) {
        if (spell.castingSource.type == "entity") {
          spell.verb.direction = source.getViewDirection();
        }
        if (spell.castingSource.type == "jack") {
          let posArr = quadSplit(spell.castingSource.sourceID.slice(12));
          let jackPos = {
            x: posArr[0] * 1,
            y: posArr[1] * 1,
            z: posArr[2] * 1
          }
          let dim = world.getDimension(source.dimension);
          if (dim.isChunkLoaded(jackPos)) {
            source = dim.getBlock(jackPos);
            
            let facing = source.permutation.getState("minecraft:cardinal_direction");
            
            if (facing) {
              facing = getFace(facing);
            } else {
              facing = getFace("north");
            }
            
            spell.verb.direction = facing;
          }
        }
      }
      
      if (target?.isValid) {
        // Fling entity
        let vector = {
          x: spell.verb.direction.x * spell.verb.power,
          y: spell.verb.direction.y * spell.verb.power,
          z: spell.verb.direction.z * spell.verb.power
        }
        
        if (spell.verb.inversion) {
          vector = Vector3.scale(vector, -1);
        }
        
        target.clearVelocity();
        target.applyImpulse(vector);
      }
    },
    "blockTarget": (target, spell) => {
      const gustable = [
        "minecraft:fire",
        "minecraft:soul_fire",
        "minecraft:copper_fire",
        "minecraft:grass",
        "minecraft:fern",
        "minecraft:bush",
        "minecraft:tall_grass",
        "minecraft:tall_fern",
        "minecraft:deadbush",
        "minecraft:dry_grass",
        "minecraft:dry_tall_grass"
      ]
      
      if (gustable.includes(target.typeId)) {
        target.setType("minecraft:air");
      }
    }
  },
  "Surge": {
    "entityTarget": (target, spell) => {
      let source = getSourceFromSpell(spell.castingSource);
      
      if (!source) {
        return;
      }
      
      if (target?.isValid) {
        let pushDir = {
          x: 0,
          y: 0,
          z: 0
        }
        
        if (spell.castingSource.type == "entity") {
          if (spell.centralPoint != undefined) {
            pushDir = Vector3.subtract(target.getAABB().center, spell.centralPoint);
          } else {
            pushDir = Vector3.subtract(target.getAABB().center, source.getAABB().center);
          }
        }
        if (spell.castingSource.type == "jack") {
          let posArr = quadSplit(spell.castingSource.sourceID.slice(12));
          let jackPos = {
            x: posArr[0] * 1,
            y: posArr[1] * 1,
            z: posArr[2] * 1
          }
          let dim = world.getDimension(source.dimension);
          if (dim.isChunkLoaded(jackPos)) {
            source = dim.getBlock(jackPos);
            
            if (spell.centralPoint != undefined) {
              pushDir = Vector3.subtract(target.getAABB().center, spell.centralPoint);
            } else {
              pushDir = Vector3.subtract(target.getAABB().center, source.center());
            }
          }
        }
        
        if (spell.verb.inversion) {
          pushDir = Vector3.normalize(Vector3.scale(pushDir, -1));
        } else {
          pushDir = Vector3.normalize(pushDir);
        }
        
        pushDir = {
          x: pushDir.x * spell.verb.power,
          y: pushDir.y * spell.verb.power,
          z: pushDir.z * spell.verb.power
        }
        
        try {
          target.clearVelocity();
          target.applyImpulse(pushDir);
        } catch (e) {}
      }
    }
  },
  "Dig": {
    "blockTarget": (target, spell) => {
      if (target.isValid) {
        if (target.hasTag("minecraft:is_pickaxe_item_destructible") || target.hasTag("minecraft:is_shovel_item_destructible")) {
          let valid = true;
          let lootMngr = world.getLootTableManager();
          
          if (target.hasTag("minecraft:stone_tier_destructible") && spell.verb.power < 1) {
            valid = false;
          }
          if (target.hasTag("minecraft:iron_tier_destructible") && spell.verb.power < 2) {
            valid = false;
          }
          if (target.hasTag("minecraft:diamond_tier_destructible") && spell.verb.power < 3) {
            valid = false;
          }
          
          if (valid) {
            let tool;
            if (target.hasTag("minecraft:is_shovel_item_destructible")) {
              tool = new ItemStack("minecraft:netherite_shovel", 1);
            }
            if (target.hasTag("minecraft:is_pickaxe_item_destructible")) {
              tool = new ItemStack("minecraft:netherite_pickaxe", 1);
            }
          
            let loot = lootMngr.generateLootFromBlock(target, tool);
            target.setType("minecraft:air");
            // Break Sound
            if (loot != undefined) {
              for (let i of loot) {
                target.dimension.spawnItem(i, target.center());
              }
            }
          }
        }
      }
    }
  },
  "Stone": {
    "entityTarget": (target, spell) => {
      if (target.isValid) {
        // Resolve the Effect
        attachCustomEffect(target, spell.verb.custom_potion_effect);
      }
    }
  },
  "Frenzy": {
    "entityTarget": (target, spell) => {
      if (target.isValid) {
        // Resolve the Effect
        attachCustomEffect(target, spell.verb.custom_potion_effect);
      }
    }
  },
}

export const spellCastTypes = {
  "Self": function (dimension, nounStats, verbs, target) {
    let isSuccessful = false;
    if (target == undefined) {
      return;
    }
    for (let verbStats of verbs) {
      if (target instanceof Entity) {
        if (!essenceCheck(target, verbStats.filters)) {
          continue;
        }
        
        if (isProtected(target, verbStats)) {
          // Warded Particles Insert
          continue;
        }
        
        // Normal
        if (verbStats.verbName == "Conceal") {
          if (target.isValid) {
            // Resolve the Effect
            attachCustomEffect(target, verbStats.custom_potion_effect);
          }
        }
        if (verbStats.verbName == "Reveal") {
          if (target.isValid) {
            if (target.getDynamicProperty("bwDuration:conceal")) {
              let eft = JSON.parse(target.getDynamicProperty("bwDuration:conceal"));
              
              if (eft.amplifier <= verbStats.revelation.power) {
                target.setDynamicProperty("bwDuration:conceal", undefined);
                
                if (target instanceof Player) {
                  target.sendMessage("§d[!]§r Your concealment is shattered.");
                }
              }
            }
            target.removeEffect("minecraft:invisibility");
          }
        }
        if (verbStats.verbName == "Channel") {
          if (target.isValid) {
            attachCustomEffect(target, verbStats.custom_potion_effect, true);
          }
        }
        // Summer
        if (verbStats.verbName == "Ignite") {
          if (target.isValid) {
            // Deal Fire Damage
            if (nounStats.caster?.type == "entity") {
              applySpellDamage(target, verbStats.dealDamage.damage, verbStats.dealDamage.dmgType, verbStats.dealDamage.ignite, nounStats.caster.value);
            } else {
              applySpellDamage(target, verbStats.dealDamage.damage, verbStats.dealDamage.dmgType, verbStats.dealDamage.ignite);
            }
          }
        }
        if (verbStats.verbName == "Shock") {
          if (target.block.isValid) {
            if (nounStats.caster?.type == "entity") {
              applySpellDamage(target, verbStats.dealDamage.damage, verbStats.dealDamage.dmgType, verbStats.dealDamage.ignite, nounStats.caster.value);
            } else {
              applySpellDamage(target, verbStats.dealDamage.damage, verbStats.dealDamage.dmgType, verbStats.dealDamage.ignite);
            }
          }
        }
        if (verbStats.verbName == "Frenzy") {
          if (target.isValid) {
            // Resolve the Effect
            attachCustomEffect(target, verbStats.custom_potion_effect);
          }
        }
        if (verbStats.verbName == "Stone") {
          if (target.isValid) {
            // Resolve the Effect
            attachCustomEffect(target, verbStats.custom_potion_effect);
          }
        }
        if (verbStats.verbName == "Exchange") {
          if (target.isValid) {
            if (verbStats.exchangeType == "default") {
              attachCustomEffect(target, verbStats.custom_potion_effect);
            }
          }
        }
        if (verbStats.verbName == "Surge") {
          if (target.isValid) {
            let epicenter;
            
            if (nounStats.caster.type == "entity") {
              if (nounStats.caster.value?.isValid) {
                epicenter = Vector3.add(nounStats.caster.value.getAABB().center, target.getViewDirection());
              }
            } else 
            if (nounStats.caster.type == "block") {
              if (nounStats.caster.value?.isValid) {
                epicenter = nounStats.caster.value.center();
              }
            } else {
              epicenter = Vector3.add(target.getAABB().center, target.getViewDirection());
            }
            
            let length = verbStats.baseForce * (verbStats.power + 1);
            let surgeVector = normalizeVector(Vector3.subtract(target.location, epicenter), length);
            
            // Push mob away from surge point
            target.clearVelocity();
            target.applyImpulse(surgeVector);
          }
        }
        if (verbStats.verbName == "Gust") {
          if (target.isValid) {
            let gustDir;
            
            if (nounStats.caster.type == "entity") {
              if (nounStats.caster.value?.isValid) {
                gustDir = nounStats.caster.value.getViewDirection();
              }
            }
            
            if (gustDir != undefined) {
              if (!spellInfo.verbs[v].inversed) {
                gustDir = {
                  x: gustDir.x,
                  y: gustDir.y,
                  z: gustDir.z
                }
              } else {
                gustDir = {
                  x: -gustDir.x,
                  y: -gustDir.y,
                  z: -gustDir.z
                }
              }
              let length = verbStats.baseForce * (verbStats.power + 1);
              let gustVector = normalizeVector(gustDir, length);
              
              // Push mob away from surge point
              target.clearVelocity();
              target.applyImpulse(gustVector);
            }
          }
        }
        if (verbStats.verbName == "Erupt") {
          if (target.isValid) {
            if (nounStats.caster?.type == "entity") {
              triggerEruption(target, verbStats.dealDamage, nounStats.caster.value);
            } else {
              triggerEruption(target, verbStats.dealDamage);
            }
          }
        }
        // Spring
        if (verbStats.verbName == "Growth") {
          if (target.isValid) {
            // Extend certain effects
            if (verbStats.power == undefined) {
              verbStats.power = 0;
            }
            let durSurplus = (verbStats.power + 1) * 3;
            
            // Bloom
            // Thorns
            // Apple
            let effects = [
              "bwDuration:photosynthesis",
              "bwDuration:thorns",
              "bwDuration:bounty_of_the_forest"
            ]
            
            for (let e of effects) {
              let p = target.getDynamicProperty(e);
              
              if (p != undefined) {
                let prop = JSON.parse(p);
                
                if (prop.timer != undefined) {
                  prop.timer = prop.timer + durSurplus;
                }
                
                
                target.setDynamicProperty(e, JSON.stringify(prop));
                target.setDynamicProperty(p, undefined);
              }
            }
          }
        }
        if (verbStats.verbName == "Bloom") {
          if (target.isValid) {
            // Resolve the Effect
            attachCustomEffect(target, verbStats.custom_potion_effect);
          }
        }
        if (verbStats.verbName == "Thorns") {
          if (target.isValid) {
            // Resolve the Effect
            attachCustomEffect(target, verbStats.custom_potion_effect);
          }
        }
        if (verbStats.verbName == "Egg") {
          if (target.isValid) {
            attachCustomEffect(target, verbStats.custom_potion_effect, false, nounStats.caster?.value);
          }
        }
        if (verbStats.verbName == "Buzz") {
          if (target.isValid) {
            if (target.typeId != "minecraft:bee") {
              attachCustomEffect(target, verbStats.custom_potion_effect);
            } else {
              // Give bee nectar
              target.triggerEvent("collected_nectar");
            }
          }
        }
        if (verbStats.verbName == "Apple") {
          if (target.isValid) {
            // Resolve the Effect
            attachCustomEffect(target, verbStats.custom_potion_effect);
          }
        }
        if (verbStats.verbName == "Heal") {
          if (target.isValid) {
            // Heal Entity
            let health = target.getComponent(EntityHealthComponent.componentId);
            if (health != undefined && health.currentValue > 0) {
              let healthSet = health.currentValue + (verbStats.healing.healPower * 2);
              if (healthSet > health.effectiveMax) {
                healthSet = health.effectiveMax;
              }
              health.setCurrentValue(healthSet);
            }
          }
        }
        if (verbStats.verbName == "Detoxify") {
          if (target.isValid) {
            // Remove effects
            for (let effect of verbStats.detox_effects) {
              let gottenEffect = target.getEffect(effect.id);
              if (gottenEffect == undefined) {
                continue;
              }
              
              if (gottenEffect.amplifier <= effect.amplifier) {
                target.removeEffect(effect.id);
              }
            }
          }
        }
        if (verbStats.verbName == "Hunt") {
          if (target.isValid) {
            // Resolve the Effect
            attachCustomEffect(target, verbStats.custom_potion_effect);
          }
        }
        if (verbStats.verbName == "Pulse") {
          if (target.isValid) {
            let heartBeat = target.getDynamicProperty("bw:heart_pulse");
            let rate = 1;
            if (verbStats.heartRate.inversed) {
              rate = -1
            }
            
            if (heartBeat == undefined) {
              heartBeat = {
                timer: 15,
                currentRate: 0
              };
            } else {
              heartBeat = JSON.parse(heartBeat);
            }
            
            heartBeat.currentRate = heartBeat.currentRate + rate;
            if (heartBeat.currentRate == 4) {
              applySpellDamage(target, 15, "internal", 0);
              if (target instanceof Player) {
                target.camera.fade({fadeColor: {"red": 1, "blue": 1, "green": 1}, fadeTime: {fadeInTime: 0.5, fadeOutTime: 0.5, holdTime: 0.5}});
                target.playSound("mob.warden.heartbeat", {
                  pitch: 3
                })
              }
            }
            if (heartBeat.currentRate > 3) {
              heartBeat.currentRate = 3
            } else
            if (heartBeat.currentRate < -3) {
              heartBeat.currentRate = -3
            }
            heartBeat.timer = 15;
            
            if (target?.isValid) {
              target.setDynamicProperty("bw:heart_pulse", JSON.stringify(heartBeat));
            }
          }
        }
        
        if (!isSuccessful) {
          isSuccessful = true;
        }
      } else {
        // The casting target is not an Entity so break it.
        break;
      }
    }
    
    // Trigger Particles
    if (isSuccessful != undefined) {
      triggerVSFX(dimension, "Self", nounStats, verbs[0], target.location);
    }
  },
  "Sight": function (dimension, nounStats, verbs, targets, doSFX = true) => {
    if (targets == undefined || targets.length == 0) {
      return;
    }
    for (let target of targets) {
      let monoTarget = false;
      let isSuccessful = false;
      let isFace = false;
      
      for (let v = 0; v < verbs.length; v++) {
        // Get Verb Stats
        let verbStats = verbs[v];
        
        // Block Verbs Effects
        if (target != undefined && target.block instanceof Block) {
          if (verbStats.verbName == "Growth") {
            if (target.block.isValid) {
              let growthCrops = {
                "minecraft:wheat": 7,
                "minecraft:beetroot": 7,
                "minecraft:carrots": 7,
                "minecraft:potatoes": 7,
                "minecraft:melon_stems": 7,
                "minecraft:pumpkin_stems": 7,
                "minecraft:sweet_berry_bush": 3
              };
              let ageCrops = {
                "minecraft:nether_warts": 3
              };
              let grew = false;
              
              if (Object.keys(growthCrops).includes(target.block.typeId)) {
                grew = true;
                let maxGrowthStage = growthCrops[target.block.typeId];
                let allStates = target.block.permutation.getAllStates();
                let growthStage = allStates["growth"];
                if (growthStage < maxGrowthStage) {
                  allStates["growth"] = growthStage + 1;
                  target.block.setPermutation(BlockPermutation.resolve(target.block.typeId, allStates));
                }
              }
              
              if (Object.keys(ageCrops).includes(target.block.typeId)) {
                grew = true;
                let maxGrowthStage = ageCrops[target.block.typeId];
                let allStates = target.block.permutation.getAllStates();
                let growthStage = allStates["age"];
                if (growthStage < maxGrowthStage) {
                  allStates["age"] = growthStage + 1;
                  
                  target.block.setPermutation(BlockPermutation.resolve(target.block.typeId, allStates));
                }
              }
              
              if (target.block.hasTag("minecraft:is_hoe_item_destructible")) {
                let faceDir = getFace(target.face);
                let hitBlk = dimension.getBlock(Vector3.add(faceDir, target.block.location));
                
                // Spread Leaves
                if (hitBlk.isAir || hitBlk.isLiquid) {
                  hitBlk.setPermutation(target.block.permutation);
                }
                grew = true;
              }
              
              if (!grew) {
                growFlora(target.block);
              }
            }
          }
          if (verbStats.verbName == "Dig") {
            if (target.block.isValid) {
              if (target.block.hasTag("minecraft:is_pickaxe_item_destructible") || target.block.hasTag("minecraft:is_shovel_item_destructible")) {
                let valid = true;
                let lootMngr = world.getLootTableManager();
                
                if (target.block.hasTag("minecraft:stone_tier_destructible") && verbStats.power < 1) {
                  valid = false;
                }
                if (target.block.hasTag("minecraft:iron_tier_destructible") && verbStats.power < 2) {
                  valid = false;
                }
                if (target.block.hasTag("minecraft:diamond_tier_destructible") && verbStats.power < 3) {
                  valid = false;
                }
                
                if (valid) {
                  let tool;
                  if (target.block.hasTag("minecraft:is_shovel_item_destructible")) {
                    tool = new ItemStack("minecraft:netherite_shovel", 1);
                  }
                  if (target.block.hasTag("minecraft:is_pickaxe_item_destructible")) {
                    tool = new ItemStack("minecraft:netherite_pickaxe", 1);
                  }
                
                  let loot = lootMngr.generateLootFromBlock(target.block, tool);
                  target.block.setType("minecraft:air");
                  if (loot != undefined) {
                    for (let i of loot) {
                      dimension.spawnItem(i, target.block.center());
                    }
                  }
                }
              }
            }
          }
          if (verbStats.verbName == "Ignite") {
            if (target.block.isValid) {
              let allStates = target.block.permutation.getAllStates();
              if (allStates["lit"] == false) {
                allStates.lit = true;
                target.block.setPermutation(BlockPermutation.resolve(target.block.typeId, allStates));
              } else
              if (allStates["extinguished"] == true) {
                allStates.extinguished = false;
                target.block.setPermutation(BlockPermutation.resolve(target.block.typeId, allStates));
              } else {
                let faceDir = getFace(target.face);
                let hitBlk = dimension.getBlock(Vector3.add(faceDir, target.block.location));
                
                if (hitBlk.isAir) {
                  if (v == 0) {
                    isFace = true;
                  }
                  hitBlk.setType("minecraft:fire")
                }
              }
            }
          }
          if (verbStats.verbName == "Channel") {
            if (target.block.isValid) {
              // If central slate
              /*
              if (target.block.hasTag("bw:red_slate")) {
                let channelRite = `ritualSave:${Math.floor(target.block.x)}_${Math.floor(target.block.y)}_${Math.floor(target.block.z)}_${target.block.dimension.id}`;
                
                world.setDynamicProperty(channelRite, 2);
              }
              */
              
              // If Orbic Nexus
              let dP = `orbicNexus:${Math.floor(target.block.x)}_${Math.floor(target.block.y)}_${Math.floor(target.block.z)}_${target.block.dimension.id}`
              let storedOrbos = world.getDynamicProperty(dP);
              if (storedOrbos != undefined) {
                let orbos = world.scoreboard.getObjective("bw:oEnergy");
                let c = nounStats.caster.value;
                let cOrbos = orbos.getScore(c);
                
                let powerValue = verbStats.channelOrbos.power * 50;
                
                // Into Orbic Nexus
                if (!verbStats.channelOrbos.absorb) {
                  let toFill = 2000 - storedOrbos;
                  if (toFill > 0) {
                    if (cOrbos > 0) {
                      if (cOrbos >= powerValue) {
                        let amtSent = 2000 - (storedOrbos + powerValue);
                        
                        if (amtSent >= 0) {
                          orbos.addScore(c, -powerValue);
                          world.setDynamicProperty(dP, storedOrbos + powerValue);
                        } else {
                          powerValue = powerValue + amtSent
                          orbos.addScore(c, -powerValue);
                          world.setDynamicProperty(dP, storedOrbos + powerValue);
                        }
                      } else {
                        let amtSent = 2000 - (storedOrbos + cOrbos);
                        
                        if (amtSent >= 0) {
                          orbos.addScore(c, -cOrbos);
                          world.setDynamicProperty(dP, storedOrbos + cOrbos);
                        } else {
                          cOrbos = cOrbos + amtSent
                          orbos.addScore(c, -cOrbos);
                          world.setDynamicProperty(dP, storedOrbos + cOrbos);
                        }
                        
                      }
                      
                    }
                  }
                } else {
                  // Out of Orbic Nexus
                  if (storedOrbos > 0) {
                    if (storedOrbos >= powerValue) {
                      orbos.addScore(c, powerValue);
                      world.setDynamicProperty(dP, storedOrbos - powerValue)
                    } else {
                      orbos.addScore(c, storedOrbos);
                      world.setDynamicProperty(dP, 0)
                    }
                  }
                }
              }
            }
          }
          if (verbStats.verbName == "Shock") {
            if (target.block.isValid) {
              let faceDir = getFace(target.face);
              let hitBlk = dimension.getBlock(Vector3.add(faceDir, target.block.location));
              
              if (v == 0) {
                isFace = true;
              }
              hitBlk.spawnEntity("minecraft:lightning_bolt", hitBlk.center());
            }
          }
          if (verbStats.verbName == "Apple") {
            if (target.block.isValid) {
              if (target.block.hasTag("minecraft:is_hoe_item_destructible")) {
                target.block.setType("minecraft:air");
                if (diceRoll(1, 20) <= verbStats.applify.appleChance) {
                  target.block.dimension.spawnItem(new ItemStack("minecraft:apple", Math.floor(Math.random()*verbStats.applify.appleMaximum)+1), target.block.location);
                }
              }
            }
          }
          if (verbStats.verbName == "Egg") {
            if (target.block.isValid) {
              let faceDir = getFace(target.face);
              let hitBlk = dimension.getBlock(Vector3.add(faceDir, target.block.location));
              
              hatchFromEgg(hitBlk, nounStats.caster?.value)
            }
          }
        }
        
        // Entity Verb Effects
        if (target != undefined && target instanceof Entity) {
          
          if (!essenceCheck(target, verbStats.filters)) {
            continue;
          }
          let centerPoint = Vector3.add(target.location, Vector3.subtract(target.getHeadLocation(), target.location));
          
          if (isProtected(target, verbStats)) {
            // Warded Particles Insert
            continue;
          }
          
          // Normal
          if (verbStats.verbName == "Conceal") {
            if (target.isValid) {
              // Resolve the Effect
              attachCustomEffect(target, verbStats.custom_potion_effect);
            }
          }
          if (verbStats.verbName == "Reveal") {
            if (target.isValid) {
              if (target.getDynamicProperty("bwDuration:conceal")) {
                let eft = JSON.parse(target.getDynamicProperty("bwDuration:conceal"));
                
                if (eft.amplifier <= verbStats.revelation.power) {
                  target.setDynamicProperty("bwDuration:conceal", undefined);
                  
                  if (target instanceof Player) {
                    target.sendMessage("§d[!]§r Your concealment is shattered.");
                  }
                }
              }
              target.removeEffect("minecraft:invisibility");
            }
          }
          if (verbStats.verbName == "Channel") {
            if (target.isValid && nounStats.caster?.value instanceof Entity) {
              let orbos = world.scoreboard.getObjective("bw:oEnergy");
              let c = nounStats.caster.value;
              
              let taker;
              let giver;
              let offeredPower;
              let powerValue = verbStats.channelOrbos.power * 50;
              
              if (!verbStats.channelOrbos.absorb) {
                offeredPower = orbos.getScore(c);
                taker = target;
                giver = c;
              } else {
                offeredPower = orbos.getScore(target);
                taker = c;
                giver = target;
              }
              
              if (offeredPower > 0 && offeredPower != undefined) {
                if (offeredPower >= powerValue) {
                  orbos.addScore(taker, powerValue);
                  orbos.addScore(giver, -powerValue);
                } else {
                  orbos.addScore(taker, offeredPower);
                  orbos.addScore(giver, -offeredPower);
                }
              }
              
            }
          }
          // Summer
          if (verbStats.verbName == "Ignite") {
            if (target.isValid) {
              // Deal Fire Damage
              if (nounStats.caster?.type == "entity") {
                applySpellDamage(target, verbStats.dealDamage.damage, verbStats.dealDamage.dmgType, verbStats.dealDamage.ignite, nounStats.caster.value);
              } else {
                applySpellDamage(target, verbStats.dealDamage.damage, verbStats.dealDamage.dmgType, verbStats.dealDamage.ignite);
              }
            }
          }
          if (verbStats.verbName == "Shock") {
            if (target.isValid) {
              // Deal Shock Damage
              if (nounStats.caster?.type == "entity") {
                applySpellDamage(target, verbStats.dealDamage.damage, verbStats.dealDamage.dmgType, verbStats.dealDamage.ignite, nounStats.caster.value);
              } else {
                applySpellDamage(target, verbStats.dealDamage.damage, verbStats.dealDamage.dmgType, verbStats.dealDamage.ignite);
              }
            }
          }
          if (verbStats.verbName == "Exchange") {
            if (monoTarget) {
              continue;
            }
            if (target.isValid) {
              // Trader Boon
              if (verbStats.exchangeType == "default") {
                attachCustomEffect(target, verbStats.custom_potion_effect);
              }
              if (verbStats.exchangeType == "inventory") {
                swapRandomItems(target, nounStats.caster?.value);
              }
              if (verbStats.exchangeType == "orbos") {
                swapOrbos(target, nounStats.caster?.value);
              }
              if (verbStats.exchangeType == "fatigue") {
                swapFatigue(target, nounStats.caster?.value);
              }
              if (verbStats.exchangeType == "hunger") {
                swapHunger(target, nounStats.caster?.value);
              }
            }
          }
          if (verbStats.verbName == "Frenzy") {
            if (target.isValid) {
              // Resolve the Effect
              attachCustomEffect(target, verbStats.custom_potion_effect);
            }
          }
          if (verbStats.verbName == "Stone") {
            if (target.isValid) {
              // Resolve the Effect
              attachCustomEffect(target, verbStats.custom_potion_effect);
            }
          }
          if (verbStats.verbName == "Surge") {
            if (target.isValid) {
              let epicenter;
              
              if (nounStats.caster.type == "entity") {
                if (nounStats.caster.value?.isValid) {
                  epicenter = nounStats.caster.value.getAABB().center;
                }
              } else 
              if (nounStats.caster.type == "block") {
                if (nounStats.caster.value?.isValid) {
                  epicenter = nounStats.caster.value.center();
                }
              } else {
                epicenter = target.getAABB().center;
              }
              
              verbStats.baseForce = 1.5
              let length = verbStats.baseForce * (verbStats.power + 1);
              let surgeVector = normalizeVector(Vector3.subtract(target.location, epicenter), length);
              
              
              // Push mob away from surge point
              target.clearVelocity();
              target.applyImpulse(surgeVector);
            }
          }
          if (verbStats.verbName == "Gust") {
            if (target.isValid) {
              let gustDir;
              
              if (nounStats.caster.type == "entity") {
                if (nounStats.caster.value?.isValid) {
                  gustDir = nounStats.caster.value.getViewDirection();
                }
              }
              
              if (gustDir != undefined) {
                let length = verbStats.baseForce * (verbStats.power + 1);
                let gustVector = normalizeVector(gustDir, length);
                
                
                // Push mob away from surge point
                target.clearVelocity();
                target.applyImpulse(gustVector);
              }
            }
          }
          if (verbStats.verbName == "Erupt") {
            if (target.isValid) {
              if (nounStats.caster?.type == "entity") {
                triggerEruption(target, verbStats.dealDamage, nounStats.caster.value);
              } else {
                triggerEruption(target, verbStats.dealDamage);
              }
            }
          }
          // Spring
          if (verbStats.verbName == "Growth") {
            if (target.isValid) {
              // Extend certain effects
              if (verbStats.power == undefined) {
                verbStats.power = 0;
              }
              let durSurplus = (verbStats.power + 1) * 3;
              
              // Bloom
              // Thorns
              // Apple
              let effects = [
                "bwDuration:photosynthesis",
                "bwDuration:thorns",
                "bwDuration:bounty_of_the_forest"
              ]
              
              for (let e of effects) {
                let p = target.getDynamicProperty(e);
                
                if (p != undefined) {
                  let prop = JSON.parse(p);
                  if (prop.timer != undefined) {
                    prop.timer = prop.timer + durSurplus;
                  }
                  
                  target.setDynamicProperty(e, JSON.stringify(prop));
                }
              }
            }
          }
          if (verbStats.verbName == "Bloom") {
            if (target.isValid) {
              // Resolve the Effect
              attachCustomEffect(target, verbStats.custom_potion_effect);
            }
          }
          if (verbStats.verbName == "Thorns") {
            if (target.isValid) {
              // Resolve the Effect
              attachCustomEffect(target, verbStats.custom_potion_effect);
            }
          }
          if (verbStats.verbName == "Egg") {
            if (target.isValid) {
              attachCustomEffect(target, verbStats.custom_potion_effect, false, nounStats.caster?.value);
            }
          }
          if (verbStats.verbName == "Buzz") {
            if (target.isValid) {
              if (target.typeId != "minecraft:bee") {
                attachCustomEffect(target, verbStats.custom_potion_effect);
              } else {
                // Give bee nectar
                target.triggerEvent("collected_nectar");
              }
            }
          }
          if (verbStats.verbName == "Apple") {
            if (target.isValid) {
              // Resolve the Effect
              attachCustomEffect(target, verbStats.custom_potion_effect);
            }
          }
          if (verbStats.verbName == "Heal") {
            if (target.isValid) {
              // Resolve the Effect
              let health = target.getComponent(EntityHealthComponent.componentId);
              if (health != undefined && health.currentValue > 0) {
                let healthSet = health.currentValue + verbStats.healing.healPower * 2;
                if (healthSet > health.effectiveMax) {
                  healthSet = health.effectiveMax;
                }
                health.setCurrentValue(healthSet);
              }
            }
          }
          if (verbStats.verbName == "Detoxify") {
            if (target.isValid) {
              // Remove effects
              for (let effect of verbStats.detox_effects) {
                let gottenEffect = target.getEffect(effect.id);
                if (gottenEffect == undefined) {
                  continue;
                }
                
                if (gottenEffect.amplifier <= effect.amplifier) {
                  target.removeEffect(effect.id);
                }
              }
            }
          }
          if (verbStats.verbName == "Hunt") {
            if (target.isValid) {
              // Resolve the Effect
              attachCustomEffect(target, verbStats.custom_potion_effect);
            }
          }
          if (verbStats.verbName == "Pulse") {
            if (target.isValid) {
              let heartBeat = target.getDynamicProperty("bw:heart_pulse");
              let rate = 1;
              if (verbStats.heartRate.inversed) {
                rate = -1
              }
              
              if (heartBeat == undefined) {
                heartBeat = {
                  timer: 15,
                  currentRate: 0
                };
              } else {
                heartBeat = JSON.parse(heartBeat);
              }
              
              heartBeat.currentRate = heartBeat.currentRate + rate;
              if (heartBeat.currentRate == 4) {
                applySpellDamage(target, 15, "internal", 0);
                if (target instanceof Player) {
                  target.camera.fade({fadeColor: {"red": 1, "blue": 1, "green": 1}, fadeTime: {fadeInTime: 0.5, fadeOutTime: 0.5, holdTime: 0.5}});
                  target.playSound("mob.warden.heartbeat", {
                    pitch: 3
                  })
                }
              }
              if (heartBeat.currentRate > 3) {
                heartBeat.currentRate = 3
              } else
              if (heartBeat.currentRate < -3) {
                heartBeat.currentRate = -3
              }
              
              if (target?.isValid) {
                target.setDynamicProperty("bw:heart_pulse", JSON.stringify(heartBeat));
              }
            }
          }
          if (!isSuccessful) {
            isSuccessful = true;
          }
        }
      }
      
      if (isSuccessful) {
        if (target instanceof Entity) {
          triggerVSFX(dimension, "Sight", nounStats, verbs[0], target.location);
        } else 
        if (target != undefined && target.block instanceof Block) {
          if (isFace) {
            let hitBlock = dimension.getBlock(Vector3.add(getFace(target.face), target.block.location));
            
            triggerVSFX(dimension, "Sight", nounStats, verbs[0], hitBlock.center());
          } else {
            triggerVSFX(dimension, "Sight", nounStats, verbs[0], target.block.center());
          }
        }
      }
    }
  },
  "Ward": function (dimension, nounStats, verbs, target, doSFX = true) => {
    if (target == undefined) {
      return;
    }
    for (let verbStats of verbs) {
      if (target.isValid && target instanceof Entity) {
        if (!essenceCheck(target, verbStats.filters)) {
          continue;
        }
        let centerPoint = Vector3.add(target.location, Vector3.subtract(target.getHeadLocation(), target.location));
        
        if (isProtected(target, verbStats)) {
          continue;
        }
        
        let specialVerbs = [
          "Evoke",
          "Detoxify"
        ];
        if (!specialVerbs.includes(verbStats.verbName)) {
          let wardObj = {
            "timer": nounStats.duration,
            "wardChance": nounStats.wardChance,
            "verb": verbStats.verbName
          }
          let wardName = `bwWard:${verbStats.verbName}`;
          target.setDynamicProperty(wardName, JSON.stringify(wardObj));
        } else {
          let effects = [];
          if (verbStats.detox_effects != undefined) {
            for (let efct of verbStats.detox_effects) {
              effects.push(efct.id)
            }
          }
          if (verbStats.potion_effect != undefined) {
            for (let p_efct of verbStats.potion_effect) {
              effects.push(p_efct.id)
            }
          }
          
          let wardObj = {
            "timer": nounStats.duration,
            "wardChance": nounStats.wardChance,
            "verb": verbStats.verbName,
            "validEffects": effects
          }
          let wardName = `bwWard:${verbStats.verbName}`;
          target.setDynamicProperty(wardName, JSON.stringify(wardObj));
        }
      }
    }
    
  }
}

export const spellFormulas = [
  // Nouns
  // {
  {
    "type": "Noun",
    "content": "Self",
    "weight": 1,
    "compatability": {
      "Touch": "Cube"
    },
    "nounStats": {},
    "spellCheck": (block) => {
      let finalItems = new Set([]);
      let itemArr = [];
      let necessaryItems = 1;
      
      let blockItems = block.dimension.getEntitiesAtBlockLocation(block.above(1).location).filter((i) => {
        if (i.getComponent("minecraft:item")) { return i };
      });
      
      if (blockItems.length == necessaryItems && blockItems.length > 0) {
        for (let item of blockItems) {
          let itemComp = item.getComponent("minecraft:item").itemStack;
          
          if (itemComp.typeId == "minecraft:wheat_seeds") {
            if (itemComp.amount == 2) {
              finalItems.add(itemComp.typeId);
              itemArr.push(item);
            }
          }
        }
      }
      
      if (finalItems.size == necessaryItems) {
        for (let i of itemArr) {
          if (i.isValid) {
            i.remove();
          }
        }
        
        return true;
      }
      
      return "moveOn";
    }
  }, // Self
  {
    "type": "Noun",
    "content": "Sight",
    "weight": 2,
    "compatability": {
      "Self": "Cube"
    },
    "nounStats": {
      "sightRange": 5,
      "sensitive": true,
      "waterproof": true,
      "astral": false,
      "targetAmount": 1
    },
    "spellCheck": (block) => {
      let finalItems = new Set([]);
      let itemArr = [];
      let necessaryItems = 1;
      
      let blockItems = block.dimension.getEntitiesAtBlockLocation(block.above(1).location).filter((i) => {
        if (i.getComponent("minecraft:item")) { return i };
      });
      
      if (blockItems.length == necessaryItems && blockItems.length > 0) {
        for (let item of blockItems) {
          let itemComp = item.getComponent("minecraft:item").itemStack;
          
          if (itemComp.typeId == "minecraft:spider_eye") {
            if (itemComp.amount == 1) {
              finalItems.add(itemComp.typeId);
              itemArr.push(item);
            }
          }
        }
      }
      
      if (finalItems.size == necessaryItems) {
        for (let i of itemArr) {
          if (i.isValid) {
            i.remove();
          }
        }
        
        return true;
      }
      
      return "moveOn";
    }
  }, // Sight
  {
    "type": "Noun",
    "content": "Bolt",
    "weight": 2,
    "nounStats": {
      "runtime": 20, // In ticks
      "collisionEffect": "Sight",
      "split_amount": 0,
      "homing": true
    },
    "spellCheck": (block) => {
      let finalItems = new Set([]);
      let itemArr = [];
      let necessaryItems = 1;
      
      let blockItems = block.dimension.getEntitiesAtBlockLocation(block.above(1).location).filter((i) => {
        if (i.getComponent("minecraft:item")) { return i };
      });
      
      if (blockItems.length == necessaryItems && blockItems.length > 0) {
        for (let item of blockItems) {
          let itemComp = item.getComponent("minecraft:item").itemStack;
          
          if (itemComp.typeId == "minecraft:arrow") {
            if (itemComp.amount == 1) {
              finalItems.add(itemComp.typeId);
              itemArr.push(item);
            }
          }
        }
      }
      
      if (finalItems.size == necessaryItems) {
        for (let i of itemArr) {
          if (i.isValid) {
            i.remove();
          }
        }
        
        return true;
      }
      
      return "moveOn";
    }
  }, // Bolt
  {
    "type": "Noun",
    "content": "Ward",
    "weight": 1,
    "nounStats": {
      "wardChance": 40,
      "duration": 15
    },
    "spellCheck": (block) => {
      let finalItems = new Set([]);
      let itemArr = [];
      let necessaryItems = 1;
      
      let blockItems = block.dimension.getEntitiesAtBlockLocation(block.above(1).location).filter((i) => {
        if (i.getComponent("minecraft:item")) { return i };
      });
      
      if (blockItems.length == necessaryItems && blockItems.length > 0) {
        for (let item of blockItems) {
          let itemComp = item.getComponent("minecraft:item").itemStack;
          
          if (itemComp.typeId == "minecraft:shield") {
            finalItems.add(itemComp.typeId);
            itemArr.push(item);
          }
        }
      }
      
      if (finalItems.size == necessaryItems) {
        for (let i of itemArr) {
          if (i.isValid) {
            i.remove();
          }
        }
        
        return true;
      }
      
      return "moveOn";
    }
  }, // Ward
  {
    "type": "Noun",
    "content": "Bubble",
    "weight": 3,
    "nounStats": {
      "area": 3,
      "innerArea": 0,
      "duration": 15
    },
    "spellCheck": (block) => {
      let finalItems = new Set([]);
      let itemArr = [];
      let necessaryItems = 1;
      
      let blockItems = block.dimension.getEntitiesAtBlockLocation(block.above(1).location).filter((i) => {
        if (i.getComponent("minecraft:item")) { return i };
      });
      
      if (blockItems.length == necessaryItems && blockItems.length > 0) {
        for (let item of blockItems) {
          let itemComp = item.getComponent("minecraft:item").itemStack;
          
          if (itemComp.typeId == "minecraft:tnt") {
            if (itemComp.amount == 1) {
              finalItems.add(itemComp.typeId);
              itemArr.push(item);
            }
          }
        }
      }
      
      if (finalItems.size == necessaryItems) {
        for (let i of itemArr) {
          if (i.isValid) {
            i.remove();
          }
        }
        
        return true;
      }
      
      return "moveOn";
    }
  }, // Bubble
  {
    "type": "Noun",
    "content": "Cube",
    "weight": 3,
    "nounStats": {
      "cubeArea": {
        "x": 2,
        "y": 2,
        "z": 2
      },
      "offset": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "localized": false,
      "duration": 15
    },
    "spellCheck": (block) => {
      let finalItems = new Set([]);
      let itemArr = [];
      let necessaryItems = 1;
      
      let blockItems = block.dimension.getEntitiesAtBlockLocation(block.above(1).location).filter((i) => {
        if (i.getComponent("minecraft:item")) { return i };
      });
      
      if (blockItems.length == necessaryItems && blockItems.length > 0) {
        for (let item of blockItems) {
          let itemComp = item.getComponent("minecraft:item").itemStack;
          
          if (itemComp.typeId == "minecraft:stone") {
            if (itemComp.amount == 9) {
              finalItems.add(itemComp.typeId);
              itemArr.push(item);
            }
          }
        }
      }
      
      if (finalItems.size == necessaryItems) {
        for (let i of itemArr) {
          if (i.isValid) {
            i.remove();
          }
        }
        
        return true;
      }
      
      return "moveOn";
    }
  }, // Cube
  // }
  // -> 6
  
  // General Verbs
  // {
  {
    "type": "Verb",
    "content": "Conceal",
    "weight": 2,
    "rune": "Conceal",
    "baseStats": {
      "verbName": "Conceal",
      "custom_potion_effect": {
        "id": "bwDuration:conceal",
        "name": "Concealment",
        "duration": 45,
        "amplifier": 0,
        "startingText": "§d[!]§r You are hidden from magickal forces.",
        "endingText": "§d[!]§r Your concealment falls away.",
        "stackable": false
      },
      "inversion": {
        "verbName": "Reveal",
        "revelation": {
          "power": 0
        },
        "inversion": "null"
      }
    }
  }, // Conceal + Reveal
  {
    "type": "Verb",
    "content": "Channel",
    "weight": 1,
    "incompatibleNouns": ["Self", "Bubble", "Cube"],
    "rune": "Channel",
    "baseStats": {
      "verbName": "Channel",
      "channelOrbos": {
        "power": 1,
        "absorb": false
      }
    }
  }, // Channel
  // }
  // -> 2
  
  // Spring Verbs
  // {
  {
    "type": "Verb",
    "content": "Growth",
    "weight": 1,
    "rune": "Growth",
    "baseStats": {
      "verbName": "Growth",
      "growthPower": 1
    },
    "incompatibleNouns": [],
    "spellCheck": (block) => {
      let finalItems = new Set([]);
      let itemArr = [];
      let necessaryItems = 1;
      
      let blockItems = block.dimension.getEntitiesAtBlockLocation(block.above(1).location).filter((i) => {
        if (i.getComponent("minecraft:item")) { return i };
      });
      
      if (blockItems.length == necessaryItems && blockItems.length > 0) {
        for (let item of blockItems) {
          let itemComp = item.getComponent("minecraft:item").itemStack;
          let hoes = [
            "minecraft:wooden_hoe",
            "minecraft:stone_hoe",
            "minecraft:iron_hoe",
            "minecraft:copper_hoe",
            "minecraft:diamond_hoe",
            "minecraft:netherite_hoe"
          ]
          
          
          if (hoes.includes(itemComp.typeId)) {
            finalItems.add(itemComp.typeId);
            itemArr.push(item);
          }
        }
      }
      
      if (finalItems.size == necessaryItems) {
        for (let i of itemArr) {
          if (i.isValid) {
            i.remove();
          }
        }
        
        return true;
      }
      
      return "moveOn";
    }
  }, // Growth
  {
    "type": "Verb",
    "content": "Bloom",
    "weight": 1,
    "rune": "Bloom",
    "baseStats": {
      "verbName": "Bloom",
      "custom_potion_effect": {
        "id": "bwDuration:photosynthesis",
        "name": "Bloom",
        "duration": 20,
        "amplifier": 0,
        "startingText": "§a[!]§r Your body changes. It is subtle, but you feel strangely... tree-like.",
        "endingText": "§a[!]§r Your body shifts back to how it was originally, flesh and bones with not a hint of faerie bark.",
        "stackable": false
      }
    },
    "spellCheck": (block) => {
      let finalItems = new Set([]);
      let itemArr = [];
      let necessaryItems = 2;
      
      let blockItems = block.dimension.getEntitiesAtBlockLocation(block.above(1).location).filter((i) => {
        if (i.getComponent("minecraft:item")) { return i };
      });
      
      if (blockItems.length == necessaryItems && blockItems.length > 0) {
        for (let item of blockItems) {
          let itemComp = item.getComponent("minecraft:item").itemStack;
          
          let saplings = [
            "minecraft:oak_sapling",
            "minecraft:spruce_sapling",
            "minecraft:birch_sapling",
            "minecraft:dark_oak_sapling",
            "minecraft:jungle_sapling",
            "minecraft:acacia_sapling",
            "minecraft:cherry_sapling",
            "minecraft:pale_oak_sapling"
          ]
          
          if (saplings.includes(itemComp.typeId)) {
            finalItems.add(itemComp.typeId);
            itemArr.push(item);
          }
          
          if (itemComp.typeId == "minecraft:oxeye_daisy" || itemComp.typeId == "bw:oxeye_daisy_dust") {
            if (!finalItems.has("minecraft:oxeye_daisy") && !finalItems.has("bw:oxeye_daisy_dust")) {
              if (itemComp.typeId == "minecraft:oxeye_daisy" && itemComp.amount == 1) {
                finalItems.add(itemComp.typeId);
                itemArr.push(item);
              }
              if (itemComp.typeId == "bw:oxeye_daisy_dust" && itemComp.amount == 2) {
                finalItems.add(itemComp.typeId);
                itemArr.push(item);
              }
            }
          }
        }
      }
      
      if (finalItems.size == necessaryItems) {
        for (let i of itemArr) {
          if (i.isValid) {
            i.remove();
          }
        }
        
        return true;
      }
      
      return "moveOn";
    }
  }, // Bloom
  {
    "type": "Verb",
    "content": "Thorns",
    "weight": 1,
    "rune": "Thorns",
    "baseStats": {
      "verbName": "Thorns",
      "custom_potion_effect": {
        "id": "bwDuration:thorns",
        "name": "Thorns",
        "duration": 15,
        "amplifier": 0,
        "inversed": false,
        "startingText": "§2[!]§r An aura of prickly energy surrounds you.",
        "endingText": "§a[!]§r The thorny magick falls away.",
        "stackable": false
      }
    },
    "spellCheck": (block) => {
      let finalItems = new Set([]);
      let itemArr = [];
      let necessaryItems = 1;
      
      let blockItems = block.dimension.getEntitiesAtBlockLocation(block.above(1).location).filter((i) => {
        if (i.getComponent("minecraft:item")) { return i };
      });
      
      if (blockItems.length == necessaryItems && blockItems.length > 0) {
        for (let item of blockItems) {
          let itemComp = item.getComponent("minecraft:item").itemStack;
          
          let berries = [
            "minecraft:sweet_berries"
          ]
          
          if (berries.includes(itemComp.typeId)) {
            if (itemComp.amount == 5) {
              finalItems.add(itemComp.typeId);
              itemArr.push(item);
            }
          }
        }
      }
      
      if (finalItems.size == necessaryItems) {
        for (let i of itemArr) {
          if (i.isValid) {
            i.remove();
          }
        }
        
        return true;
      }
      
      return "moveOn";
    }
  }, // Thorns
  {
    "type": "Verb",
    "content": "Apple",
    "weight": 1,
    "rune": "Apple",
    "baseStats": {
      "verbName": "Apple",
      "custom_potion_effect": {
        "id": "bwDuration:bounty_of_the_forest",
        "name": "Apple Blessing",
        "inversedName": "Apple Jinx",
        "duration": 25,
        "amplifier": 0,
        "inversed": false,
        "startingText": "§2[!]§r Apples are suddenly much more magickal to you.",
        "endingText": "§2[!]§r The Apples lose their mysticism and return to mundanity in your eyes.",
        "stackable": false
      },
      "applify": {
        "appleChance": 8,
        "appleMaximum": 1
      }
    },
    "spellCheck": (block) => {
      let finalItems = new Set([]);
      let itemArr = [];
      let necessaryItems = 1;
      
      let blockItems = block.dimension.getEntitiesAtBlockLocation(block.above(1).location).filter((i) => {
        if (i.getComponent("minecraft:item")) { return i };
      });
      
      if (blockItems.length == necessaryItems && blockItems.length > 0) {
        for (let item of blockItems) {
          let itemComp = item.getComponent("minecraft:item").itemStack;
          
          let apples = [
            "minecraft:apple",
            "minecraft:golden_apple",
            "minecraft:enchanted_golden_apple"
          ]
          let exquisiteApples = [
            "minecraft:golden_apple",
            "minecraft:enchanted_golden_apple"
          ]
          
          if (apples.includes(itemComp.typeId)) {
            if (exquisiteApples.includes(itemComp.typeId)) {
              if (itemComp.amount == 1) {
                finalItems.add(itemComp.typeId);
                itemArr.push(item);
              }
            } else {
              if (itemComp.amount == 9) {
                finalItems.add(itemComp.typeId);
                itemArr.push(item);
              }
            }
          }
        }
      }
      
      if (finalItems.size == necessaryItems) {
        for (let i of itemArr) {
          if (i.isValid) {
            i.remove();
          }
        }
        
        return true;
      }
      
      return "moveOn";
    }
  }, // Apple
  {
    "type": "Verb",
    "content": "Heal",
    "weight": 3,
    "rune": "Heal",
    "baseStats": {
      "verbName": "Heal",
      "healing": {
        "healPower": 1
      }
    }
  }, // Heal
  {
    "type": "Verb",
    "content": "Detoxify",
    "weight": 2,
    "rune": "Detoxify",
    "baseStats": {
      "verbName": "Detoxify",
      "detox_effects": [],
      "color": {
        "red": 0,
        "green": 0.76,
        "blue": 0
      }
    },
    "spellCheck": (block) => {
      let finalItems = new Set([]);
      let itemArr = [];
      let necessaryItems = 1;
      
      let blockItems = block.dimension.getEntitiesAtBlockLocation(block.above(1).location).filter((i) => {
        if (i.getComponent("minecraft:item")) { return i };
      });
      
      if (blockItems.length == necessaryItems && blockItems.length > 0) {
        for (let item of blockItems) {
          let itemComp = item.getComponent("minecraft:item").itemStack;
          
          if (itemComp.typeId == "minecraft:milk_bucket") {
            finalItems.add(itemComp.typeId);
            itemArr.push(item);
          }
        }
      }
      
      if (finalItems.size == necessaryItems) {
        let loc = itemArr[0].location;
        for (let i of itemArr) {
          if (i.isValid) {
            i.remove();
          }
        }
        block.dimension.spawnItem(new ItemStack("minecraft:bucket", 1), loc);
        
        return true;
      }
      
      return "moveOn";
    },
    "drawInfoFromPlayer": (player, baseStats) => {
      for (let i = 0; i < 2; i++) {
        if (getItem(player.getComponent("inventory").container, "bw:filled_clay_totem")) {
          let potionTotem = findItem(player.getComponent("inventory").container, "bw:filled_clay_totem").getDynamicProperty("bw:potionEffect");
          removeItem(player.getComponent("inventory").container, "bw:filled_clay_totem");
          player.dimension.spawnItem(new ItemStack("bw:clay_totem", 1), player.location);
          if (potionTotem != undefined) {
            potionTotem = JSON.parse(potionTotem);
            baseStats.detox_effects.push(
              {
                "id": potionTotem.potionEffectId,
                "amplifier": 0
              }
            )
          }
        }
      }
      
      return baseStats;
    }
  }, // Detoxify
  {
    "type": "Verb",
    "content": "Egg",
    "weight": 4,
    "rune": "Egg",
    "baseStats": {
      "verbName": "Egg",
      "custom_potion_effect": {
        "id": "bwDuration:eggshell_protection",
        "name": "Eggshell Ward",
        "duration": 20,
        "amplifier": 0,
        "startingText": "§a[!]§r A peculiar spell influences you, putting you under the protection of eggs.",
        "endingText": "§a[!]§r Your protective egg cracks and its shield breaks with it.",
        "stackable": false
      },
      "color": {
        "red": 0.8,
        "green": 0.9,
        "blue": 0.89
      }
    },
    "spellCheck": (block) => {
      let finalItems = new Set([]);
      let itemArr = [];
      let necessaryItems = 1;
      let eggs = [
        "minecraft:egg",
        "minecraft:blue_egg",
        "minecraft:brown_egg"
      ];
      
      let blockItems = block.dimension.getEntitiesAtBlockLocation(block.above(1).location).filter((i) => {
        if (i.getComponent("minecraft:item")) { return i };
      });
      
      if (blockItems.length == necessaryItems && blockItems.length > 0) {
        for (let item of blockItems) {
          let itemComp = item.getComponent("minecraft:item").itemStack;
          
          if (eggs.includes(itemComp.typeId) && itemComp.amount == 1) {
            finalItems.add(itemComp.typeId);
            itemArr.push(item);
          }
        }
      }
      
      if (finalItems.size == necessaryItems) {
        for (let i of itemArr) {
          if (i.isValid) {
            i.remove();
          }
        }
        
        return true;
      }
      
      return "moveOn";
    }
  }, // Egg
  {
    "type": "Verb",
    "content": "Buzz",
    "weight": 1,
    "rune": "Buzz",
    "baseStats": {
      "verbName": "Buzz",
      "custom_potion_effect": {
        "id": "bwDuration:honey_blessed",
        "name": "Honey Blessing",
        "duration": 20,
        "amplifier": 0,
        "startingText": "§6[!]§r Honey suddenly tastes like heaven.",
        "endingText": "§6[!]§r The divine sweetness of honey dissolves back into mundanity.",
        "stackable": false
      }
    },
    "spellCheck": (block) => {
      let finalItems = new Set([]);
      let itemArr = [];
      let necessaryItems = 1;
      
      let blockItems = block.dimension.getEntitiesAtBlockLocation(block.above(1).location).filter((i) => {
        if (i.getComponent("minecraft:item")) { return i };
      });
      
      if (blockItems.length == necessaryItems && blockItems.length > 0) {
        for (let item of blockItems) {
          let itemComp = item.getComponent("minecraft:item").itemStack;
          
          if (itemComp.typeId == "minecraft:honeycomb") {
            if (itemComp.amount == 3) {
              finalItems.add(itemComp.typeId);
              itemArr.push(item);
            }
          }
        }
      }
      
      if (finalItems.size == necessaryItems) {
        for (let i of itemArr) {
          if (i.isValid) {
            i.remove();
          }
        }
        
        return true;
      }
      
      return "moveOn";
    }
  }, // Buzz
  {
    "type": "Verb",
    "content": "Hunt",
    "weight": 2,
    "rune": "Hunt",
    "baseStats": {
      "verbName": "Hunt",
      "custom_potion_effect": {
        "id": "bwDuration:food_chain",
        "name": "Predator",
        "duration": 45,
        "amplifier": 0,
        "inversed": false,
        "inversedName": "Prey",
        "startingText": "§2[!]§r Nature has assigned you a role in its game, #text.",
        "endingText": "§2[!]§r You return to your natural disposition.",
        "stackable": false,
        "overpowerable": true
      }
    },
    "spellCheck": (block) => {
      let finalItems = new Set([]);
      let itemArr = [];
      let necessaryItems = 2;
      
      let blockItems = block.dimension.getEntitiesAtBlockLocation(block.above(1).location).filter((i) => {
        if (i.getComponent("minecraft:item")) { return i };
      });
      
      if (blockItems.length == necessaryItems && blockItems.length > 0) {
        for (let item of blockItems) {
          let itemComp = item.getComponent("minecraft:item").itemStack;
          
          let apples = [
            "minecraft:apple",
            "minecraft:golden_apple",
            "minecraft:enchanted_golden_apple"
          ]
          let exquisiteApples = [
            "minecraft:golden_apple",
            "minecraft:enchanted_golden_apple"
          ]
          
          if (itemComp.typeId == "minecraft:bone") {
            if (itemComp.amount == 2) {
              finalItems.add(itemComp.typeId);
              itemArr.push(item);
            }
          }
          if (itemComp.typeId == "minecraft:wheat") {
            if (itemComp.amount == 3) {
              finalItems.add(itemComp.typeId);
              itemArr.push(item);
            }
          }
        }
      }
      
      if (finalItems.size == necessaryItems) {
        for (let i of itemArr) {
          if (i.isValid) {
            i.remove();
          }
        }
        
        return true;
      }
      
      return "moveOn";
    }
  }, // Hunt
  {
    "type": "Verb",
    "content": "Pulse",
    "weight": 3,
    "rune": "Pulse",
    "orbosCost": 100,
    "baseStats": {
      "verbName": "Pulse",
      "heartRate": {
        "inversed": false
      },
      "color": {
        "red": 0.7,
        "green": 0.1,
        "blue": 0.4
      }
    },
    "spellCheck": (block) => {
      let finalItems = new Set([]);
      let itemArr = [];
      let necessaryItems = 1;
      
      let blockItems = block.dimension.getEntitiesAtBlockLocation(block.above(1).location).filter((i) => {
        if (i.getComponent("minecraft:item")) { return i };
      });
      
      if (blockItems.length == necessaryItems && blockItems.length > 0) {
        for (let item of blockItems) {
          let itemComp = item.getComponent("minecraft:item").itemStack;
          
          if (itemComp.typeId == "bw:blood_vial") {
            let bloodType = itemComp.getDynamicProperty("bw:blood");
            if (bloodType) {
              let bloodInfo = JSON.parse(bloodType);
              if (bloodInfo.type == "minecraft:bat") {
                finalItems.add(itemComp.typeId);
                itemArr.push(item);
              }
            }
          }
        }
      }
      
      if (finalItems.size == necessaryItems) {
        for (let i of itemArr) {
          if (i.isValid) {
            i.remove();
          }
        }
        
        return true;
      }
      
      return "moveOn";
    }
  }, // Pulse
  // }
  // -> 10
  
  // Summer Verbs
  // {
  {
    "type": "Verb",
    "content": "Ignite",
    "weight": 1,
    "rune": "Ignite",
    "orbosCost": 100,
    "baseStats": {
      "verbName": "Ignite",
      "dealDamage": {
        "damage": 3,
        "dmgType": "burn",
        "ignite": 3
      }
    },
    "spellCheck": (block) => {
      let finalItems = new Set([]);
      let itemArr = [];
      let necessaryItems = 1;
      
      let blockItems = block.dimension.getEntitiesAtBlockLocation(block.above(1).location).filter((i) => {
        if (i.getComponent("minecraft:item")) { return i };
      });
      
      if (blockItems.length == necessaryItems && blockItems.length > 0) {
        for (let item of blockItems) {
          let itemComp = item.getComponent("minecraft:item").itemStack;
          
          
          if (itemComp.typeId == "minecraft:coal" || itemComp.typeId == "minecraft:charcoal") {
            if (!finalItems.has("minecraft:coal") && !finalItems.has("minecraft:charcoal")) {
              if (itemComp.amount == 3) {
                finalItems.add(itemComp.typeId);
                itemArr.push(item);
              }
            }
          }
        }
      }
      
      if (finalItems.size == necessaryItems) {
        for (let i of itemArr) {
          if (i.isValid) {
            i.remove();
          }
        }
        
        return true;
      }
      
      return "moveOn";
    }
  }, // Ignite
  {
    "type": "Verb",
    "content": "Shock",
    "weight": 1,
    "rune": "Shock",
    "orbosCost": 100,
    "baseStats": {
      "verbName": "Shock",
      "dealDamage": {
        "damage": 2,
        "dmgType": "shock",
        "ignite": 0
      }
    }
  }, // Shock
  {
    "type": "Verb",
    "content": "Frenzy",
    "weight": 2,
    "rune": "Frenzy",
    "orbosCost": 100,
    "baseStats": {
      "verbName": "Frenzy",
      "custom_potion_effect": {
        "id": "bwDuration:debauched_frenzy",
        "name": "Oberian Frenzy",
        "duration": 60,
        "diceSave": 6,
        "amplifier": 0,
        "startingText": "§c[!]§r You are intoxicated by the influence of Oberon's §cFrenzy§r. You are both stronger and weaker because of it.",
        "endingText": "§c[!]§r You recover your sanity, even though it might've taken you a while.",
        "stackable": false,
        "overpowerable": true
      },
      "color": {
        "red": 0.78,
        "green": 0.03,
        "blue": 0
      }
    },
    "spellCheck": (block) => {
      let finalItems = new Set([]);
      let itemArr = [];
      let necessaryItems = 2;
      
      let blockItems = block.dimension.getEntitiesAtBlockLocation(block.above(1).location).filter((i) => {
        if (i.getComponent("minecraft:item")) { return i };
      });
      
      if (blockItems.length == necessaryItems && blockItems.length > 0) {
        for (let item of blockItems) {
          let itemComp = item.getComponent("minecraft:item").itemStack;
          
          let apples = [
            "minecraft:apple",
            "minecraft:golden_apple",
            "minecraft:enchanted_golden_apple"
          ]
          let exquisiteApples = [
            "minecraft:golden_apple",
            "minecraft:enchanted_golden_apple"
          ]
          
          if (itemComp.typeId == "minecraft:bone") {
            if (itemComp.amount == 2) {
              finalItems.add(itemComp.typeId);
              itemArr.push(item);
            }
          }
          if (itemComp.typeId == "minecraft:wheat") {
            if (itemComp.amount == 3) {
              finalItems.add(itemComp.typeId);
              itemArr.push(item);
            }
          }
        }
      }
      
      if (finalItems.size == necessaryItems) {
        for (let i of itemArr) {
          if (i.isValid) {
            i.remove();
          }
        }
        
        return true;
      }
      
      return "moveOn";
    }
  }, // Frenzy
  {
    "type": "Verb",
    "content": "Surge",
    "weight": 2,
    "rune": "Surge",
    "orbosCost": 100,
    "baseStats": {
      "verbName": "Surge",
      "baseForce": 1.5,
      "power": 0
    }
  }, // Surge
  {
    "type": "Verb",
    "content": "Stone",
    "weight": 1,
    "rune": "Stone",
    "orbosCost": 100,
    "baseStats": {
      "verbName": "Stone",
      "custom_potion_effect": {
        "id": "bwDuration:stone_skin",
        "name": "Stoneskin",
        "duration": 45,
        "amplifier": 0,
        "inversed": false,
        "inverseStartingText": "§8[!]§r Your skin hardens into rock. Your movement follows immediately.",
        "startingText": "§8[!]§r Your skin hardens into rock.",
        "endingText": "§c[!]§r Your flesh returns, replacing the cold stone.",
        "stackable": false,
        "overpowerable": true
      },
      "color": {
        "red": 0.78,
        "green": 0.03,
        "blue": 0
      }
    }
  }, // Stone
  {
    "type": "Verb",
    "content": "Dig",
    "weight": 2,
    "rune": "Dig",
    "orbosCost": 100,
    "incompatibleNouns": ["Self", "Bubble", "Ward"],
    "baseStats": {
      "verbName": "Dig",
      "power": 0
    }
  }, // Dig
  {
    "type": "Verb",
    "content": "Gust",
    "weight": 2,
    "rune": "Gust",
    "orbosCost": 100,
    "baseStats": {
      "verbName": "Gust",
      "inversed": false,
      "baseForce": 1.5,
      "power": 0
    }
  }, // Gust
  {
    "type": "Verb",
    "content": "Erupt",
    "weight": 2,
    "rune": "Erupt",
    "orbosCost": 100,
    "incompatibleNouns": ["Cube"],
    "baseStats": {
      "verbName": "Erupt",
      "dealDamage": {
        "damage": 4,
        "dmgType": "burn",
        "ignite": 3
      }
    }
  }, // Erupt
  {
    "type": "Verb",
    "content": "Resonate",
    "weight": 2,
    "rune": "Resonate",
    "orbosCost": 100,
    "incompatibleNouns": ["Self", "Bolt", "Sight"],
    "baseStats": {
      "verbName": "Resonate",
      "quakeStrength": 1,
      "dealDamage": {
        "damage": 1,
        "dmgType": "blunt",
        "ignite": 0
      }
    }
  }, // Resonate
  {
    "type": "Verb",
    "content": "Exchange",
    "weight": 2,
    "rune": "Exchange",
    "orbosCost": 100,
    "incompatibleNouns": ["Cube", "Bubble"],
    "baseStats": {
      "verbName": "Exchange",
      "exchangeType": "default"
    },
    "drawInfoFromPlayer": (player, baseStats) => {
      let inv = player.getComponent("inventory").container;
      let tradeType = "default";
      let trades = {
        "minecraft:item_frame": "inventory",
        "bs:raw_orbos": "orbos",
        "minecraft:rabbit_foot": "fatigue",
        "minecraft:golden_carrot": "hunger",
        "minecraft:compass": "position"
      }
      
      for (let i = 0; i < 9; i++) {
        let item = inv.getItem(i);
        if (item != undefined) {
          if (Object.keys(trades).includes(item.typeId)) {
            tradeType = trades[item.typeId];
            break;
          } else {
            continue;
          }
        }
      }
      
      baseStats.exchangeType = tradeType;
      if (tradeType == "default") {
        baseStats.custom_potion_effect = {
          "id": "bwDuration:trader_boon",
          "name": "Boon of the Trader",
          "duration": 60,
          "amplifier": 0,
          "startingText": "§a[!]§r The Luck of the Merchant slides over your form. May your deals be prosperous!",
          "endingText": "§c[!]§r The Merchant's Luck has faded now.",
          "stackable": false
        }
      }
      
      return baseStats;
    }
  }, // Exchange
  // }
  // -> 10
  
  // Modifiers
  // {
  // Noun Modifiers
  // Sight
  {
    "type": "Modifier",
    "content": "Astral Sight",
    "weight": 0,
    "orbosCost": 30,
    "modifyNoun": [
      {
        "astralProperty": {}
      }
    ],
    "spellCheck": (block) => {
      let finalItems = new Set([]);
      let itemArr = [];
      let necessaryItems = 1;
      
      const validItems = [
        "minecraft:glass",
        "minecraft:glass_pane"
      ];
      
      let blockItems = block.dimension.getEntitiesAtBlockLocation(block.above(1).location).filter((i) => {
        if (i.getComponent("minecraft:item")) { return i };
      });
      
      if (blockItems.length == necessaryItems && blockItems.length > 0) {
        for (let item of blockItems) {
          let itemComp = item.getComponent("minecraft:item").itemStack;
          
          if (itemComp.typeId == "minecraft:glass") {
            if (itemComp.amount == 1) {
              finalItems.add(itemComp.typeId);
              itemArr.push(item);
            }
          }
          
          if (itemComp.typeId == "minecraft:glass_pane") {
            if (itemComp.amount == 3) {
              finalItems.add(itemComp.typeId);
              itemArr.push(item);
            }
          }
        }
      }
      
      if (finalItems.size == necessaryItems) {
        for (let i of itemArr) {
          if (i.isValid) {
            i.remove();
          }
        }
        
        return true;
      }
      
      return "moveOn";
    }
  }, // Astral Sight
  {
    "type": "Modifier",
    "content": "Aquatic Sight",
    "weight": 0,
    "orbosCost": 30,
    "modifyNoun": [
      {
        "seeInWaterProperty": {}
      }
    ],
    "spellCheck": (block) => {
      let finalItems = new Set([]);
      let itemArr = [];
      let necessaryItems = 1;
      
      let blockItems = block.dimension.getEntitiesAtBlockLocation(block.above(1).location).filter((i) => {
        if (i.getComponent("minecraft:item")) { return i };
      });
      
      if (blockItems.length == necessaryItems && blockItems.length > 0) {
        for (let item of blockItems) {
          let itemComp = item.getComponent("minecraft:item").itemStack;
          
          if (itemComp.typeId == "minecraft:seagrass") {
            if (itemComp.amount == 3) {
              finalItems.add(itemComp.typeId);
              itemArr.push(item);
            }
          }
        }
      }
      
      if (finalItems.size == necessaryItems) {
        for (let i of itemArr) {
          if (i.isValid) {
            i.remove();
          }
        }
        
        return true;
      }
      
      return "moveOn";
    }
  }, // Aquatic Sight
  {
    "type": "Modifier",
    "content": "Sensitive Sight",
    "weight": 0,
    "orbosCost": 30,
    "modifyNoun": [
      {
        "sensitiveProperty": {}
      }
    ],
    "spellCheck": (block) => {
      let finalItems = new Set([]);
      let itemArr = [];
      let necessaryItems = 1;
      
      let blockItems = block.dimension.getEntitiesAtBlockLocation(block.above(1).location).filter((i) => {
        if (i.getComponent("minecraft:item")) { return i };
      });
      
      if (blockItems.length == necessaryItems && blockItems.length > 0) {
        for (let item of blockItems) {
          let itemComp = item.getComponent("minecraft:item").itemStack;
          
          if (itemComp.typeId == "minecraft:short_grass") {
            if (itemComp.amount == 3) {
              finalItems.add(itemComp.typeId);
              itemArr.push(item);
            }
          }
        }
      }
      
      if (finalItems.size == necessaryItems) {
        for (let i of itemArr) {
          if (i.isValid) {
            i.remove();
          }
        }
        
        return true;
      }
      
      return "moveOn";
    }
  }, // Sensitive Sight
  
  {
    "type": "Modifier",
    "content": "Inversion",
    "weight": 2,
    "orbosCost": 100,
    "modifyVerb": [
      {
        "invertEffect": {}
      }
    ],
    "spellCheck": (block) => {
      let finalItems = new Set([]);
      let itemArr = [];
      let necessaryItems = 1;
      
      let blockItems = block.dimension.getEntitiesAtBlockLocation(block.above(1).location).filter((i) => {
        if (i.getComponent("minecraft:item")) { return i };
      });
      
      if (blockItems.length == necessaryItems && blockItems.length > 0) {
        for (let item of blockItems) {
          let itemComp = item.getComponent("minecraft:item").itemStack;
          
          
          if (itemComp.typeId == "minecraft:fermented_spider_eye") {
            if (itemComp.amount == 2) {
              finalItems.add(itemComp.typeId);
              itemArr.push(item);
            }
          }
        }
      }
      
      if (finalItems.size == necessaryItems) {
        for (let i of itemArr) {
          if (i.isValid) {
            i.remove();
          }
        }
        
        return true;
      }
      
      return "moveOn";
    }
  }, // Inversion
  {
    "type": "Modifier",
    "content": "Extend I",
    "weight": 2,
    "orbosCost": 100,
    "modifyVerb": [
      {
        "duration": {
          "amount": 10
        }
      }
    ],
    "spellCheck": (block) => {
      let finalItems = new Set([]);
      let itemArr = [];
      let necessaryItems = 1;
      
      let blockItems = block.dimension.getEntitiesAtBlockLocation(block.above(1).location).filter((i) => {
        if (i.getComponent("minecraft:item")) { return i };
      });
      
      if (blockItems.length == necessaryItems && blockItems.length > 0) {
        for (let item of blockItems) {
          let itemComp = item.getComponent("minecraft:item").itemStack;
          
          if (itemComp.typeId == "minecraft:sugar") {
            if (itemComp.amount == 3) {
              finalItems.add(itemComp.typeId);
              itemArr.push(item);
            }
          }
        }
      }
      
      if (finalItems.size == necessaryItems) {
        for (let i of itemArr) {
          if (i.isValid) {
            i.remove();
          }
        }
        
        return true;
      }
      
      return "moveOn";
    }
  }, // Extend I
  {
    "type": "Modifier",
    "content": "Extend II",
    "weight": 3,
    "orbosCost": 250,
    "modifyVerb": [
      {
        "duration": {
          "amount": 45
        }
      }
    ],
    "spellCheck": (block) => {
      let finalItems = new Set([]);
      let itemArr = [];
      let necessaryItems = 2;
      
      let blockItems = block.dimension.getEntitiesAtBlockLocation(block.above(1).location).filter((i) => {
        if (i.getComponent("minecraft:item")) { return i };
      });
      
      if (blockItems.length == necessaryItems && blockItems.length > 0) {
        for (let item of blockItems) {
          let itemComp = item.getComponent("minecraft:item").itemStack;
          
          if (itemComp.typeId == "minecraft:sugar") {
            if (itemComp.amount == 3) {
              finalItems.add(itemComp.typeId);
              itemArr.push(item);
            }
          }
          if (itemComp.typeId == "minecraft:rabbit_foot") {
            if (itemComp.amount == 1) {
              finalItems.add(itemComp.typeId);
              itemArr.push(item);
            }
          }
        }
      }
      
      if (finalItems.size == necessaryItems) {
        for (let i of itemArr) {
          if (i.isValid) {
            i.remove();
          }
        }
        
        return true;
      }
      
      return "moveOn";
    }
  }, // Extend II
  {
    "type": "Modifier",
    "content": "Amplify I",
    "weight": 3,
    "orbosCost": 500,
    "modifyVerb": [
      {
        "amplifier": {
          "amount": 1
        }
      }
    ],
    "spellCheck": (block) => {
      let finalItems = new Set([]);
      let itemArr = [];
      let necessaryItems = 1;
      
      let blockItems = block.dimension.getEntitiesAtBlockLocation(block.above(1).location).filter((i) => {
        if (i.getComponent("minecraft:item")) { return i };
      });
      
      if (blockItems.length == necessaryItems && blockItems.length > 0) {
        for (let item of blockItems) {
          let itemComp = item.getComponent("minecraft:item").itemStack;
          
          if (itemComp.typeId == "minecraft:redstone_block") {
            if (itemComp.amount == 1) {
              finalItems.add(itemComp.typeId);
              itemArr.push(item);
            }
          }
        }
      }
      
      if (finalItems.size == necessaryItems) {
        for (let i of itemArr) {
          if (i.isValid) {
            i.remove();
          }
        }
        
        return true;
      }
      
      return "moveOn";
    }
  }, // Amplify
  
  {
    "type": "Modifier",
    "content": "Expansion",
    "weight": 1,
    "orbosCost": 40,
    "modifyNoun": [
      {
        "expandArea": {}
      }
    ],
    "spellCheck": (block) => {
      let finalItems = new Set([]);
      let itemArr = [];
      let necessaryItems = 1;
      
      let blockItems = block.dimension.getEntitiesAtBlockLocation(block.above(1).location).filter((i) => {
        if (i.getComponent("minecraft:item")) { return i };
      });
      
      if (blockItems.length == necessaryItems && blockItems.length > 0) {
        for (let item of blockItems) {
          let itemComp = item.getComponent("minecraft:item").itemStack;
          
          if (itemComp.typeId == "minecraft:gold_ingot") {
            if (itemComp.amount == 1) {
              finalItems.add(itemComp.typeId);
              itemArr.push(item);
            }
          }
        }
      }
      
      if (finalItems.size == necessaryItems) {
        for (let i of itemArr) {
          if (i.isValid) {
            i.remove();
          }
        }
        
        return true;
      }
      
      return "moveOn";
    }
  }, // Expand Area
  {
    "type": "Modifier",
    "content": "Inner Expansion",
    "weight": 1,
    "orbosCost": 40,
    "modifyNoun": [
      {
        "expandInnerArea": {}
      }
    ],
    "spellCheck": (block) => {
      let finalItems = new Set([]);
      let itemArr = [];
      let necessaryItems = 1;
      
      let blockItems = block.dimension.getEntitiesAtBlockLocation(block.above(1).location).filter((i) => {
        if (i.getComponent("minecraft:item")) { return i };
      });
      
      if (blockItems.length == necessaryItems && blockItems.length > 0) {
        for (let item of blockItems) {
          let itemComp = item.getComponent("minecraft:item").itemStack;
          
          if (itemComp.typeId == "minecraft:gold_nugget") {
            if (itemComp.amount == 9) {
              finalItems.add(itemComp.typeId);
              itemArr.push(item);
            }
          }
        }
      }
      
      if (finalItems.size == necessaryItems) {
        for (let i of itemArr) {
          if (i.isValid) {
            i.remove();
          }
        }
        
        return true;
      }
      
      return "moveOn";
    }
  }, // Expand Inner Area
  {
    "type": "Modifier",
    "content": "Reduction",
    "weight": -1,
    "orbosCost": 40,
    "modifyNoun": [
      {
        "expandArea": {}
      }
    ],
    "spellCheck": (block) => {
      let finalItems = new Set([]);
      let itemArr = [];
      let necessaryItems = 1;
      
      let blockItems = block.dimension.getEntitiesAtBlockLocation(block.above(1).location).filter((i) => {
        if (i.getComponent("minecraft:item")) { return i };
      });
      
      if (blockItems.length == necessaryItems && blockItems.length > 0) {
        for (let item of blockItems) {
          let itemComp = item.getComponent("minecraft:item").itemStack;
          
          if (itemComp.typeId == "minecraft:copper_ingot") {
            if (itemComp.amount == 1) {
              finalItems.add(itemComp.typeId);
              itemArr.push(item);
            }
          }
        }
      }
      
      if (finalItems.size == necessaryItems) {
        for (let i of itemArr) {
          if (i.isValid) {
            i.remove();
          }
        }
        
        return true;
      }
      
      return "moveOn";
    }
  }, // Reduce Area
  {
    "type": "Modifier",
    "content": "Inner Reduction",
    "weight": -1,
    "orbosCost": 40,
    "modifyNoun": [
      {
        "reduceInnerArea": {}
      }
    ],
    "spellCheck": (block) => {
      let finalItems = new Set([]);
      let itemArr = [];
      let necessaryItems = 1;
      
      let blockItems = block.dimension.getEntitiesAtBlockLocation(block.above(1).location).filter((i) => {
        if (i.getComponent("minecraft:item")) { return i };
      });
      
      if (blockItems.length == necessaryItems && blockItems.length > 0) {
        for (let item of blockItems) {
          let itemComp = item.getComponent("minecraft:item").itemStack;
          
          if (itemComp.typeId == "minecraft:copper_nugget") {
            if (itemComp.amount == 9) {
              finalItems.add(itemComp.typeId);
              itemArr.push(item);
            }
          }
        }
      }
      
      if (finalItems.size == necessaryItems) {
        for (let i of itemArr) {
          if (i.isValid) {
            i.remove();
          }
        }
        
        return true;
      }
      
      return "moveOn";
    }
  }, // Reduce Inner Area
  
  {
    "type": "Modifier",
    "content": "Quintessence",
    "weight": 0,
    "orbosCost": 150,
    "spellCheck": (block) => {
      let finalItems = new Set([]);
      let necessaryItems = 1;
      
      let blockItems = block.dimension.getEntitiesAtBlockLocation(block.above(1).location).filter((i) => {
        if (i.getComponent("minecraft:item")) { return i };
      });
      
      if (blockItems.length == necessaryItems && blockItems.length > 0) {
        for (let item of blockItems) {
          let itemComp = item.getComponent("minecraft:item").itemStack;
          
          if (itemComp.getDynamicProperty("bw:quintessence")) {
            if (itemComp.amount == 1) {
              return "filter";
            }
          }
        }
      }
      
      return "moveOn";
    }
  }, // Filter (Quintessence)
  // }
]

const candlePos = [
  [1, 3],
  [0, 3],
  [-1, 3],
  [-2, 2],
  [-3, 1],
  [-3, 0],
  [-3, -1],
  [-2, -2],
  [-1, -3],
  [0, -3],
  [1, -3],
  [2, -2],
  [3, -1],
  [3, 0],
  [3, 1],
  [2, 2]
];

function drawCircle(xCentre, zCentre, x, z) {
  let circleArray = [];
  circleArray.push(new Vector3(xCentre+x, 0, zCentre+z));
  circleArray.push(new Vector3(xCentre-x, 0, zCentre+z));
  circleArray.push(new Vector3(xCentre+x, 0, zCentre-z));
  circleArray.push(new Vector3(xCentre-x, 0, zCentre-z));
  circleArray.push(new Vector3(xCentre+z, 0, zCentre+x));
  circleArray.push(new Vector3(xCentre-z, 0, zCentre+x));
  circleArray.push(new Vector3(xCentre+z, 0, zCentre-x));
  circleArray.push(new Vector3(xCentre-z, 0, zCentre-x));
  return circleArray;
}

export function circleBres(xCentre, zCentre, radius) {
  let x = 0;
  let z = radius;
  let d = 3 - 2 * radius;
  let circle = drawCircle(xCentre, zCentre, x, z)
  
  while (z >= x) {
    if (d>0) {
      z--;
      d = d+4*(x-z)+10;
    } else {
      d = d+4*x+6;
    }
    x++;
    
    circle = circle.concat(drawCircle(xCentre, zCentre, x, z));
  }
  let circleSet = new Set();
  for (let val of circle) {
    circleSet.add(JSON.stringify(val));
  }
  circle = [];
  for (let pos of circleSet) {
    circle.push(JSON.parse(pos));
  }
  
  return circle;
}

function getSpellFaeries(spell) {
  return faerieSpells[spell].faeSpirits.singleFaeries;
}

function gatherTrustAvg(player, currentFae, validFae) {
  let trustTotal = 0;
  let validFaeNum = 0;
  for (let vFae of validFae) {
    for (let cFae of currentFae) {
      if (vFae == cFae) {
        validFaeNum += 1;
        trustTotal = Number(Number(trustTotal) + Number(JSON.parse(player.getDynamicProperty(`bw:${convertFaeName(cFae)}`)).trust)).toFixed(2);
      }
    }
  }
  
  if (validFaeNum == 0) {
    validFaeNum = 1;
  }
  return Number(trustTotal/validFaeNum).toFixed(2);
}

function outputBasedOnTrust(trust, outputArray, numArray) {
  let output = undefined;
  if (outputArray.length != numArray.length) {
    return;
  }
  for (let i = 0; i < numArray.length; i++) {
    if (i == 0) {
      if (trust >= 0.00 && trust < numArray[i]) {
        output = outputArray[i];
      }
    } else 
    if (i == outputArray.length-1) {
      if (trust >= numArray[i-1] && trust <= numArray[i]) {
        output = outputArray[i];
      }
    } else {
      if (trust >= numArray[i-1] && trust < numArray[i]) {
        output = outputArray[i];
      }
    }
  }
  return output;
}

function calculateAngle(v1, v2) {
  const dot = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
  const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y + v1.z * v1.z);
  const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y + v2.z * v2.z);
  return Math.acos(dot / (mag1 * mag2)) * (180 / Math.PI);
}

export function getEntitiesInView(player, distance, degrees) {
  const viewDir = player.getViewDirection();
  const pLoc = player.location;
  const entities = player.dimension.getEntities({ location: player.location, maxDistance: distance });
  const inViewEntities = entities.filter(entity => {
      const eLoc = entity.location;
      const toEntityVec = {
          x: eLoc.x - pLoc.x,
          y: eLoc.y - pLoc.y,
          z: eLoc.z - pLoc.z
      };
      const angle = calculateAngle(viewDir, toEntityVec);
      return angle >= -degrees && angle <= degrees;
  });
  return inViewEntities;
}

// Put in place a DEFAULT value for spells controlled by faeries (TESTING)
export const faerieSpells = {
  // Wylde Gate Spells
  "Opening the Wylde Gate": {
    "imbuedSpell": false,
    "cost": {
      "tags": [],
      "occultEnergy": 0,
      "fatigue": 0
    },
    "symbol": {
      "particle": "bw:spell_smoke_vanish",
      "color": {
        red: 0.439,
        green: 0.169,
        blue: 0.722
      }
    },
    "spellEffect": (player, scrollCast = false) => {
      let dim = world.getDimension(player.dimension.id);
      openMysticCircle(player);
    }
  },
  "Closing the Wylde Gate": {
    "imbuedSpell": false,
    "cost": {
      "tags": [],
      "occultEnergy": 0,
      "fatigue": 0
    },
    "symbol": {
      "particle": "bw:spell_smoke_vanish",
      "color": {
        red: 0.439,
        green: 0.169,
        blue: 0.722
      }
    },
    "spellEffect": (player, scrollCast = false) => {
      let dim = world.getDimension(player.dimension.id);
      closeMysticCircle(player);
    }
  },
  "Observing the Wylde Gate": {
    "imbuedSpell": false,
    "cost": {
      "tags": [],
      "occultEnergy": 0,
      "fatigue": 0
    },
    "symbol": {
      "particle": "bw:spell_smoke_vanish",
      "color": {
        red: 0.439,
        green: 0.169,
        blue: 0.722
      }
    },
    "spellEffect": (player, scrollCast = false) => {
      let dim = world.getDimension(player.dimension.id);
      console.warn("Observe Circle")
      // seeMysticCircle(player);
    }
  },
  "Shaping the Wylde Gate": {
    "imbuedSpell": false,
    "cost": {
      "tags": [],
      "occultEnergy": 0,
      "fatigue": 0
    },
    "symbol": {
      "particle": "bw:spell_smoke_vanish",
      "color": {
        red: 0.439,
        green: 0.169,
        blue: 0.722
      }
    },
    "spellEffect": (player, scrollCast = false) => {
      let dim = world.getDimension(player.dimension.id);
      runSpellCreation(player);
    }
  },
  "Painting the Wylde Gate": {
    "imbuedSpell": false,
    "cost": {
      "tags": [],
      "occultEnergy": 0,
      "fatigue": 0
    },
    "symbol": {
      "particle": "bw:spell_smoke_vanish",
      "color": {
        red: 0.439,
        green: 0.169,
        blue: 0.722
      }
    },
    "spellEffect": (player, scrollCast = false) => {
      let dim = world.getDimension(player.dimension.id);
      decorateSpell(player);
    }
  },
  
  // Jack Spells
  "Locking the Ward": {
    "imbuedSpell": false,
    "cost": {
      "tags": ["abjuration", "binding"],
      "occultEnergy": 150,
      "fatigue": 5 // 0.5%
    },
    "symbol": {
      "particle": "bw:spell_smoke_vanish",
      "color": {
        red: 0.741,
        green: 0.388,
        blue: 0.051
      }
    },
    "spellEffect": (player, scrollCast = false) => {
      let dim = world.getDimension(player.dimension.id);
      
      player.setDynamicProperty("pumpkinTouch_encrypt", true);
      player.sendMessage(`§6[!]§r Touch a Jack of your creation with your Wand.`);
    }
  },
  "Picking the Ward": {
    "imbuedSpell": false,
    "cost": {
      "tags": ["evocation"],
      "occultEnergy": 150,
      "fatigue": 5 // 0.5%
    },
    "symbol": {
      "particle": "bw:spell_smoke_vanish",
      "color": {
        red: 0.741,
        green: 0.388,
        blue: 0.051
      }
    },
    "spellEffect": (player, scrollCast = false) => {
      let dim = world.getDimension(player.dimension.id);
      
      player.sendMessage(`§6[!]§r A tinkering energy is sent out, hoping to pick apart any encryptions placed upon the surrounding Jack o' Wards.`);
      pickJacks(player);
    }
  },
  
  // Mystic Compression
  "Mystic Compression": {
    "imbuedSpell": false,
    "cost": {
      "tags": ["esoteric", "celestial", "binding"],
      "occultEnergy": 0,
      "fatigue": 20
    },
    "symbol": {
      "particle": "bw:libation_ink",
      "color": {
        red: 0,
        green: 0,
        blue: 0
      }
    },
    "spellEffect": (player, scrollCast = false) => {
      let dim = world.getDimension(player.dimension.id);
      let playerLoc = player.location;
      
      let orbos = world.scoreboard?.getObjective("bw:oEnergy");
      if (orbos.getScore(player.scoreboardIdentity) == undefined) {
        return;
      } else {
        let a = orbos.getScore(player.scoreboardIdentity);
        let rawOrbos = 0;
        let orbosHoney = 0;
        for (; a >= 30; a = a-30) {
          if (verifyPatron(player, "titania")) {
            if (diceRoll(1, 10, true) > 5) {
              orbosHoney++;
            }
          }
          rawOrbos++;
        }
        
        if (rawOrbos <= 0) {
          player.sendMessage("§c[!]§r Every §d30 Orbos§r is converted into §d1 Raw Orbos§r. You do not even have the bare minimum.")
          return;
        }
        if (rawOrbos <= 64) {
          let drops = new ItemStack("bw:raw_orbos", rawOrbos);
          dim.spawnItem(drops, playerLoc);
          orbos.setScore(player, a);
        } else {
          let i = Math.trunc(rawOrbos/64);
          for (; i > -1; i--) {
            let drops;
            if (i > 0) {
              drops = new ItemStack("bw:raw_orbos", 64);
              rawOrbos = rawOrbos - 64;
            } else {
              drops = new ItemStack("bw:raw_orbos", rawOrbos);
              rawOrbos = 0;
              orbos.setScore(player, a);
            }
            dim.spawnItem(drops, playerLoc);
          }
        }
        
        if (orbosHoney <= 0) {
          return;
        }
        if (orbosHoney <= 64) {
          let drops = new ItemStack("bw:honey_orbos", orbosHoney);
          dim.spawnItem(drops, playerLoc);
          orbos.setScore(player, a);
        } else {
          let h = Math.trunc(orbosHoney/64);
          for (; h > -1; h--) {
            let drops;
            if (h > 0) {
              drops = new ItemStack("bw:honey_orbos", 64);
              orbosHoney = orbosHoney - 64;
            } else {
              drops = new ItemStack("bw:honey_orbos", orbosHoney);
              orbosHoney = 0;
              orbos.setScore(player, a);
            }
            dim.spawnItem(drops, playerLoc);
          }
        }
      }
    }
  },
}

export const faeSpellArray = {
  '["UpRi","DoRi","DoLe","UpLe","DoRi"]': "Opening the Wylde Gate",
  '["UpRi","DoRi","DoLe","UpLe","DoRi","DoLe"]': "Shaping the Wylde Gate",
  '["UpRi","DoRi","DoLe","UpLe","DoLe","DoRi"]': "Observing the Wylde Gate",
  '["UpRi","DoRi","DoLe","UpLe","DoLe"]': "Closing the Wylde Gate",
  '["UpRi","DoRi","DoLe","UpLe","DoLe","UpLe"]': "Painting the Wylde Gate",
  
  // Jack Glyphs
  '["DoRi","UpRi","UpLe","DoLe","UpLe"]': "Locking the Ward",
  '["DoRi","UpRi","DoRi","DoLe","UpLe"]': "Picking the Ward",
  
  // Mystic Compression
  '["DoRi","UpRi","UpLe","UpRi","DoRi"]': "Mystic Compression",
}