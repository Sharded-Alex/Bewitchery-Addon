import {world, system, ItemStack, BlockPermutation, Dimension, EntityItemComponent, MolangVariableMap} from "@minecraft/server";
import {wands} from "./blockComp.js";
import {getWandTags, diceRoll} from "./occultMagick.js";
import {Vector3} from "./VectorMath/index.js";
import {localizePos} from "./localize.js";
import {randomize} from "./castRitual.js";
import {lostWager} from "./feyBargain.js";
import {convertFaeName} from "./lesserFaerie.js";
// credits to the Bedrock Wiki
class Utils {
    /**
     * @param {Entity} entity
     */
    constructor(entity) {
        this.entity = entity;
        this.rideable = entity?.getComponent("rideable");
        this.player = this.rideable?.getRiders()[0];
        this.riding = this.player?.getComponent("riding");
    }

    /**
     * @param {number} flySpeed
     * @param {number} fallSpeed
     * @param {number} XZspeed
     */
    flySystem(flySpeed, fallSpeed, XZspeed) {
        if (!this.riding || this.player.id != this.entity.getDynamicProperty("bwBroom:owner")) {
          let broom = new ItemStack("bw:normal_broom_item", 1);
          world.getDimension(this.entity.dimension.id).spawnItem(broom, this.entity.location);
          this.entity.remove();
          return;
        };
        if (!this.riding && this.entity.isValid) {
          this.entity.applyImpulse({x:0,y:fallSpeed,z:0});
        }
        let direction = {
          x: 0,
          y: 0,
          z: 0
        }
        if (this.player.isJumping) {
          direction.y = this.player.getViewDirection().y > 0 ? flySpeed : fallSpeed;
        }
        this.entity.addEffect("speed", 5, {
            showParticles: false,
            amplifier: XZspeed,
        });
        if (this.player.isJumping) {
          this.entity.applyImpulse(direction);
        } else {
          if (this.entity.getVelocity().y != 0) {
            this.entity.applyImpulse({x:0,y:this.entity.getVelocity().y > 0 ? -flySpeed : -fallSpeed,z:0});
          }
          this.entity.applyImpulse({x:0,y:0,z:0});
        }
    }
}

function cutOrboCosts(wandTags, concepts) {
  let value = 10;
  for (let i = 0; i < wandTags.length; i++) {
    if (concepts.includes(wandTags[i])) {
      value -= 1;
    }
  }
  return value/10;
}

world.afterEvents.playerBreakBlock.subscribe(e => {
  let player = e.player;
  let blockPerm = e.brokenBlockPermutation;
  
  let curse = player.getDynamicProperty("bw:cursePool");
  
  if (curse != undefined) {
    curse = JSON.parse(curse);
    
    if (curse.antimateriality != undefined) {
      if (diceRoll(1, 100, true) <= 5) {
        player.dimension.createExplosion(e.block.center(), 2, {causesFire: world.gameRules.doFireTick, breaksBlocks: world.gameRules.mobGriefing})
      }
    }
  }
  
});