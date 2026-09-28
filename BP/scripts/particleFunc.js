import {world, system, Scoreboard, ItemStack, EntityHealthComponent, BlockVolume, BlockVolumeBase, BlockPermutation, MolangVariableMap, MoonPhase, GameRules, Block, Entity, Player} from "@minecraft/server";
import {Vector3, Random} from "./VectorMath/index.js";

// Color Fade Styles
// Duration Fade - If two colors, the color is determined by the duration of the spell itself. If no duration, choose the first color.
// Particle Fade - If two colors, the color quickly interpolates per emitter/particle lifetime.
// No Fade, Dual Colors - Each particle is randomly assigned one of the two colors only if the emitter emits 2 or more particles, otherwise it chooses the first color.
// (+) Fade ONLY works if there are two colors.

// A particle with multiple colors can either have a Fading effect or Dual Color effect.
// Sparkles - Drops of measured starlight, woven into the stitches that the Celestial Bounds together.
export const visuals = {
  "mystic_circle": (dim, loc, spell) => {
    let particle_style = spell.style;
    let mol = new MolangVariableMap();
    let color_vars = [
      "variable.spell_color_1",
      "variable.spell_color_2"
    ];
    
    // Define Colors
    if (particle_style.colors.length == 0) {
      mol.setColorRGB(color_vars[0], {
        "red": Math.random() * 255,
        "green": Math.random() * 255,
        "blue": Math.random() * 255
      });
    } else {
      for (let i = 0; i < particle_style.colors.length; i++) {
        mol.setColorRGB(color_vars[i], {
          "red": particle_style.colors[i].red * 255,
          "green": particle_style.colors[i].green * 255,
          "blue": particle_style.colors[i].blue * 255
        });
      }
    }
    
    // Does the particle have two colors?
    if (particle_style.colors.length == 2) {
      mol.setFloat("variable.is_dual_color", 1.0);
    } else {
      mol.setFloat("variable.is_dual_color", 0.0);
    }
    
    // Does the color fade?
    if (particle_style.fade != undefined) {
      mol.setFloat("variable.fading", 1.0);
      
      // Is it a particle fade?
      if (particle_style.fade == "particle") {
        mol.setFloat("variable.particle_fade", 1.0);
      } else {
        // It's neither
        mol.setFloat("variable.particle_fade", 0.0);
      }
    } else {
      mol.setFloat("variable.fading", 0.0);
    }
    
    mol.setFloat("variable.radius", 3.1);
    
    let state = 0;
    if (spell.noun != undefined) {
      state++;
      if (spell.verb != undefined) {
        state++;
      }
    }
    
    switch (state) {
      case 0: {
        mol.setFloat("variable.rising", 0.0);
        dim.spawnParticle("bw:basic_smoke_circle", loc, mol);
        break;
      }
      case 1: {
        mol.setFloat("variable.rising", 0.0);
        dim.spawnParticle("bw:basic_smoke_circle", loc, mol);
        dim.spawnParticle("bw:basic_smoke_star", loc, mol);
        break;
      }
      case 2: {
        mol.setFloat("variable.rising", 1.0);
        dim.spawnParticle("bw:basic_smoke_circle", loc, mol);
        dim.spawnParticle("bw:basic_smoke_star", loc, mol);
        break;
      }
    }
    
    dim.playSound("beacon.ambient", loc, {pitch: 0.3+Math.random()*0.5 + (state/10 * 2), volume: 0.3});
    
  },
  "channel_suction": (dim, loc, endLoc, spell) => {
    let particle_style = spell.style;
    let mol = new MolangVariableMap();
    let color_vars = [
      "variable.spell_color_1",
      "variable.spell_color_2"
    ];
    
    // Define Colors
    if (particle_style.colors.length == 0) {
      mol.setColorRGB(color_vars[0], {
        "red": Math.random() * 255,
        "green": Math.random() * 255,
        "blue": Math.random() * 255
      });
    } else {
      for (let i = 0; i < particle_style.colors.length; i++) {
        mol.setColorRGB(color_vars[i], {
          "red": particle_style.colors[i].red * 255,
          "green": particle_style.colors[i].green * 255,
          "blue": particle_style.colors[i].blue * 255
        });
      }
    }
    
    // Does the particle have two colors?
    if (particle_style.colors.length == 2) {
      mol.setFloat("variable.is_dual_color", 1.0);
    } else {
      mol.setFloat("variable.is_dual_color", 0.0);
    }
    
    // Does the color fade?
    if (particle_style.fade != undefined) {
      mol.setFloat("variable.fading", 1.0);
      
      // Is it a particle fade?
      if (particle_style.fade == "particle") {
        mol.setFloat("variable.particle_fade", 1.0);
      } else {
        // It's neither
        mol.setFloat("variable.particle_fade", 0.0);
      }
    } else {
      mol.setFloat("variable.fading", 0.0);
    }
    
    let distanceVec;
    let startingPos;
    if (!spell.verb.channelOrbos.inversed) {
      distanceVec = {
        x: endLoc.x - loc.x,
        y: endLoc.y - loc.y,
        z: endLoc.z - loc.z
      };
      startingPos = loc;
    } else {
      distanceVec = {
        x: loc.x - endLoc.x,
        y: loc.y - endLoc.y,
        z: loc.z - endLoc.z
      };
      startingPos = endLoc;
    }
    
    let magn = Vector3.magnitude(distanceVec);
    
    mol.setVector3("variable.direction", distanceVec);
    mol.setFloat("variable.lifetime", magn);
    
    dim.spawnParticle("bw:channel_trail", startingPos, mol);
    
    dim.playSound("beacon.power", loc, {pitch: 0.25, volume: 0.3});
    
  },
  "sparkles": (dim, loc, spell, mode = undefined) => {
    let ptcl;
    let sfx;
    let particle_style = spell.style;
    let mol = new MolangVariableMap();
    let color_vars = [
      "variable.spell_color_1",
      "variable.spell_color_2"
    ];
    
    // Molang things
    // {
    // Is the particle spectral?
    if (particle_style.spectral) {
      mol.setFloat("variable.spectral", 1.0);
    }
    // }
    
    switch (spell.noun) {
      case "Self": {
        // Define Colors
        if (particle_style.colors.length == 0) {
          mol.setColorRGB(color_vars[0], {
            "red": Math.random() * 255,
            "green": Math.random() * 255,
            "blue": Math.random() * 255
          });
        } else {
          for (let i = 0; i < particle_style.colors.length; i++) {
            mol.setColorRGB(color_vars[i], {
              "red": particle_style.colors[i].red * 255,
              "green": particle_style.colors[i].green * 255,
              "blue": particle_style.colors[i].blue * 255
            });
          }
        }
        
        // Does the particle have two colors?
        if (particle_style.colors.length == 2) {
          mol.setFloat("variable.is_dual_color", 1.0);
        } else {
          mol.setFloat("variable.is_dual_color", 0.0);
        }
        
        // Does the color fade?
        if (particle_style.fade != undefined) {
          mol.setFloat("variable.fading", 1.0);
          
          // Is it a particle fade?
          if (particle_style.fade == "particle") {
            mol.setFloat("variable.particle_fade", 1.0);
          } else {
            // It's neither
            mol.setFloat("variable.particle_fade", 0.0);
          }
        } else {
          mol.setFloat("variable.fading", 0.0);
        }
        
        mol.setFloat("variable.radius", 2.0);
        
        ptcl = [
          "bw:sparkle_collision_flash",
          "bw:self_sparkles"
        ]
        break;
      }
      case "Ward": {
        // Define Colors
        if (particle_style.colors.length == 0) {
          mol.setColorRGB(color_vars[0], {
            "red": Math.random() * 255,
            "green": Math.random() * 255,
            "blue": Math.random() * 255
          });
        } else {
          for (let i = 0; i < particle_style.colors.length; i++) {
            mol.setColorRGB(color_vars[i], {
              "red": particle_style.colors[i].red * 255,
              "green": particle_style.colors[i].green * 255,
              "blue": particle_style.colors[i].blue * 255
            });
          }
        }
        
        // Does the particle have two colors?
        if (particle_style.colors.length == 2) {
          mol.setFloat("variable.is_dual_color", 1.0);
        } else {
          mol.setFloat("variable.is_dual_color", 0.0);
        }
        
        // Does the color fade?
        if (particle_style.fade != undefined) {
          mol.setFloat("variable.fading", 1.0);
          
          // Is it a particle fade?
          if (particle_style.fade == "particle") {
            mol.setFloat("variable.particle_fade", 1.0);
          } else {
            // It's neither
            mol.setFloat("variable.particle_fade", 0.0);
          }
        } else {
          mol.setFloat("variable.fading", 0.0);
        }
        
        mol.setFloat("variable.radius", 2.0);
        
        ptcl = [
          "bw:sparkle_collision_flash",
          "bw:self_sparkles"
        ]
        break;
      }
      case "Sight": {
        // Define Colors
        if (particle_style.colors.length == 0) {
          mol.setColorRGB(color_vars[0], {
            "red": Math.random() * 255,
            "green": Math.random() * 255,
            "blue": Math.random() * 255
          });
        } else {
          for (let i = 0; i < particle_style.colors.length; i++) {
            mol.setColorRGB(color_vars[i], {
              "red": particle_style.colors[i].red * 255,
              "green": particle_style.colors[i].green * 255,
              "blue": particle_style.colors[i].blue * 255
            });
          }
        }
        
        // Does the particle have two colors?
        if (particle_style.colors.length == 2) {
          mol.setFloat("variable.is_dual_color", 1.0);
        } else {
          mol.setFloat("variable.is_dual_color", 0.0);
        }
        
        // Does the color fade?
        if (particle_style.fade != undefined) {
          mol.setFloat("variable.fading", 1.0);
          
          // Is it a particle fade?
          if (particle_style.fade == "particle") {
            mol.setFloat("variable.particle_fade", 1.0);
          } else {
            // It's neither
            mol.setFloat("variable.particle_fade", 0.0);
          }
        } else {
          mol.setFloat("variable.fading", 0.0);
        }
        
        mol.setFloat("variable.radius", 2.0);
        
        ptcl = [
          "bw:sparkle_collision_flash",
          "bw:sight_sparkles"
        ]
        break;
      }
      case "Bolt": {
        // Define Colors
        if (particle_style.colors.length == 0) {
          mol.setColorRGB(color_vars[0], {
            "red": Math.random() * 255,
            "green": Math.random() * 255,
            "blue": Math.random() * 255
          });
        } else {
          for (let i = 0; i < particle_style.colors.length; i++) {
            mol.setColorRGB(color_vars[i], {
              "red": particle_style.colors[i].red * 255,
              "green": particle_style.colors[i].green * 255,
              "blue": particle_style.colors[i].blue * 255
            });
          }
        }
        
        // Does the particle have two colors?
        if (particle_style.colors.length == 2) {
          mol.setFloat("variable.is_dual_color", 1.0);
        } else {
          mol.setFloat("variable.is_dual_color", 0.0);
        }
        
        // Does the color fade?
        if (particle_style.fade != undefined) {
          mol.setFloat("variable.fading", 1.0);
          
          // Is it a particle fade?
          if (particle_style.fade == "particle") {
            mol.setFloat("variable.particle_fade", 1.0);
          } else {
            // It's neither
            mol.setFloat("variable.particle_fade", 0.0);
          }
        } else {
          mol.setFloat("variable.fading", 0.0);
        }
        
        if (mode == "trail") {
          ptcl = "bw:bolt_trail_sparkles";
        } else {
          mol.setFloat("variable.radius", 2.0);
          ptcl = [
            "bw:sparkle_collision_flash",
            "bw:bolt_burst_sparkles"
          ]
        }
        break;
      }
      case "Bubble": {
        // Define Colors
        if (particle_style.colors.length == 0) {
          mol.setColorRGB(color_vars[0], {
            "red": Math.random() * 255,
            "green": Math.random() * 255,
            "blue": Math.random() * 255
          });
        } else {
          for (let i = 0; i < particle_style.colors.length; i++) {
            mol.setColorRGB(color_vars[i], {
              "red": particle_style.colors[i].red * 255,
              "green": particle_style.colors[i].green * 255,
              "blue": particle_style.colors[i].blue * 255
            });
          }
        }
        
        // Does the particle have two colors?
        if (particle_style.colors.length == 2) {
          mol.setFloat("variable.is_dual_color", 1.0);
        } else {
          mol.setFloat("variable.is_dual_color", 0.0);
        }
        
        // Does the color fade?
        if (particle_style.fade != undefined) {
          mol.setFloat("variable.fading", 1.0);
          
          // Is it a particle fade?
          if (particle_style.fade == "particle") {
            mol.setFloat("variable.particle_fade", 1.0);
          } else {
            // It's neither
            mol.setFloat("variable.particle_fade", 0.0);
          }
        } else {
          mol.setFloat("variable.fading", 0.0);
        }
        
        // {
        // Enlargen the range
        mol.setFloat("variable.radius", spell.noun_params.range);
        // }
        
        if (spell.noun_params.hollow) {
          ptcl = "bw:bubble_hollow_sparkles";
        } else {
          if (spell.noun_params.duration == 0) {
            ptcl = "bw:bubble_instant_sparkles";
          } else {
            ptcl = "bw:bubble_sustain_sparkles";
          }
        }
        break;
      }
      case "Cube": {
        // Define Colors
        if (particle_style.colors.length == 0) {
          mol.setColorRGB(color_vars[0], {
            "red": Math.random() * 255,
            "green": Math.random() * 255,
            "blue": Math.random() * 255
          });
        } else {
          for (let i = 0; i < particle_style.colors.length; i++) {
            mol.setColorRGB(color_vars[i], {
              "red": particle_style.colors[i].red * 255,
              "green": particle_style.colors[i].green * 255,
              "blue": particle_style.colors[i].blue * 255
            });
          }
        }
        
        // Does the particle have two colors?
        if (particle_style.colors.length == 2) {
          mol.setFloat("variable.is_dual_color", 1.0);
        } else {
          mol.setFloat("variable.is_dual_color", 0.0);
        }
        
        // Does the color fade?
        if (particle_style.fade != undefined) {
          mol.setFloat("variable.fading", 1.0);
          
          // Is it a particle fade?
          if (particle_style.fade == "particle") {
            mol.setFloat("variable.particle_fade", 1.0);
          } else {
            // It's neither
            mol.setFloat("variable.particle_fade", 0.0);
          }
        } else {
          mol.setFloat("variable.fading", 0.0);
        }
        
        // {
        // Define corners
        mol.setVector3("variable.area", spell.noun_params.cubeArea);
        mol.setVector3("variable.offset", spell.noun_params.offset);
        // }
        
        ptcl = "bw:cube_sparkles";
        break;
      }
    }
    
    if (ptcl != undefined) {
      if (Array.isArray(ptcl)) {
        ptcl.forEach(p => dim.spawnParticle(p, loc, mol));
      } else {
        dim.spawnParticle(ptcl, loc, mol);
      }
    }
    
    if (sfx != undefined) {
      if (Array.isArray(sfx)) {
        for (let s of sfx) {
          dim.playSound(s.name, loc, s.params);
        }
      } else {
        dim.playSound(sfx.name, loc, sfx.params);
      }
    }
  }
}