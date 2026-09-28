import {
    world,
    MolangVariableMap,
    system
  } from "@minecraft/server";

let lightningIntervalId;
let LightningCounter = 0;

export const ignoreList = new Set([
    "minecraft:minecart",
    "minecraft:chest_minecart",
    "minecraft:hopper_minecart",
    "minecraft:tnt_minecart",
    "minecraft:xp_orb",
    "minecraft:item",
    "minecraft:tnt"
  ]);
  
/*
world.afterEvents.itemStartUse.subscribe((e) => { 
    const {itemStack, source: player} = e;
    if (itemStack.typeId !== "minecraft:apple") return;
    const direction = player.getViewDirection();
    const { spawnPos, endPosition, entities } = calculateLightningPositions(player, direction);
    if (entities.length > 0) {
        entities.forEach((entity) => {
            const distance = Math.sqrt(
            Math.pow(endPosition.x - spawnPos.x, 2) +
            Math.pow(endPosition.y - spawnPos.y, 2) +
            Math.pow(endPosition.z - spawnPos.z, 2)
            );

            const maxDamage = 15;
            const damage = Math.max(1, maxDamage - distance);
            entity.applyDamage(damage, { cause: "lightning" });
        });
    }
    createLightningEffect(player, endPosition)
    startLightningInterval(player, itemStack)
    player.dimension.playSound("ambient.weather.thunder", player.location)
    player.dimension.playSound("ambient.weather.lightning.impact", player.location)
});

world.afterEvents.itemStopUse.subscribe((e) => { 
  const {itemStack} = e;
  if (itemStack.typeId !== "minecraft:apple") return;
    try {
        system.clearRun(lightningIntervalId);
    } catch (e) {
        //expected error when theres no intervals running
    }
});
*/

export function calculateLightningPositions(player, direction) {
  const startPosition = player.getHeadLocation();
  const playerRotation = player.getRotation();

  // Constants for offset
  const rightOffset = -0.1;
  const baseForwardOffset = 0.1;
  const baseDownOffset = 0.25;

  // Convert player rotation to radians
  const pitch = playerRotation.x * (Math.PI / 180);
  const yaw = playerRotation.y * (Math.PI / 180);

  // Adjust offsets based on pitch
  const adjustedForwardOffset = baseForwardOffset * Math.cos(pitch);
  const adjustedDownOffset = baseDownOffset + baseForwardOffset * Math.abs(Math.sin(pitch));

  // Calculate the spawn position
  const spawnPos = {
    x: startPosition.x - Math.sin(yaw) * adjustedForwardOffset + Math.cos(yaw) * rightOffset,
    y: startPosition.y - adjustedDownOffset,
    z: startPosition.z + Math.cos(yaw) * adjustedForwardOffset + Math.sin(yaw) * rightOffset
  };

  const entities = getEntitiesInVShape(player, direction);
  let endPosition;

  if (entities.length > 0) {
    endPosition = {
      x: entities[0].location.x,
      y: entities[0].location.y + 1,
      z: entities[0].location.z
    };
  } else {
    endPosition = {
      x: startPosition.x + direction.x * 8,
      y: startPosition.y + direction.y * 8,
      z: startPosition.z + direction.z * 8,
    };
  }

  return { spawnPos, endPosition, entities };
}

export function startLightningInterval(player) {
  lightningIntervalId = system.runInterval(() => {
    const direction = player.getViewDirection();
    LightningCounter++;
    const { spawnPos, endPosition, entities } = calculateLightningPositions(player, direction);
    if (entities.length > 0) {
      createEntityHitLightning(player, entities);
      entities.forEach((entity) => {
        if (!ignoreList.has(entity.typeId)) {
          const distance = Math.sqrt(
            Math.pow(endPosition.x - spawnPos.x, 2) +
            Math.pow(endPosition.y - spawnPos.y, 2) +
            Math.pow(endPosition.z - spawnPos.z, 2)
          );
          const maxDamage = 15;
          const damage = Math.max(1, maxDamage - distance); // damage scales, the further away the less damage they take
          entity.applyDamage(damage, { cause: "lightning" });
        }
      });
    }
    createLightningEffect(player, endPosition);
  }, 4);
}
  
export function createLightningEffect(player, end, headBase = false) {
    const steps = 30;
    const branchProbability = 0.1;
    const maxBranchLength = 15;
    const numControlPoints = 4;
    const maxDeviation = 1.5;

    const viewDirection = player.getViewDirection();
    const playerHeadLocation = player.getHeadLocation();

    // Constants for offset
    const offset = 0;
    // const rightOffset = -0.35;
    // const leftOffset = 0.35;
    const baseForwardOffset = 0.5;
    const baseDownOffset = 0.45;
    let centreStart = calculateBaseSpawnPos(playerHeadLocation, viewDirection, baseForwardOffset, offset, baseDownOffset);
    if (headBase) {
      centreStart = playerHeadLocation;
    }
    // const rightStart = calculateBaseSpawnPos(playerHeadLocation, viewDirection, baseForwardOffset, rightOffset, baseDownOffset);
    // const leftStart = calculateBaseSpawnPos(playerHeadLocation, viewDirection, baseForwardOffset, leftOffset, baseDownOffset);
    
    // Create center lightning bolt
    createLightningBolt(player, centreStart, end, steps, numControlPoints, maxDeviation, branchProbability, maxBranchLength);
    // Create right lightning bolt
    // createLightningBolt(player, rightStart, end, steps, numControlPoints, maxDeviation, branchProbability, maxBranchLength);

    // Create left lightning bolt
    // createLightningBolt(player, leftStart, end, steps, numControlPoints, maxDeviation, branchProbability, maxBranchLength);
}

export function createLightningBolt(player, start, end, steps, numControlPoints, maxDeviation, branchProbability, maxBranchLength, fadeAlpha) {
    const alpha = fadeAlpha ? fadeAlpha : 1;
    // Generate control points
    const controlPoints = [start];
    for (let i = 1; i < numControlPoints - 1; i++) {
        const t = i / (numControlPoints - 1);
        let pointVector = null;
        if (i === 1) {
            pointVector = {
                x: start.x + (end.x - start.x) * t,
                y: start.y + (end.y - start.y) * t,
                z: start.z + (end.z - start.z) * t,
            };
        } else {
            pointVector = {
                x: start.x + (end.x - start.x) * t + (Math.random() - 0.5) * maxDeviation,
                y: start.y + (end.y - start.y) * t + (Math.random() - 0.5) * maxDeviation,
                z: start.z + (end.z - start.z) * t + (Math.random() - 0.5) * maxDeviation,
            };
        }
        controlPoints.push(pointVector);
    }
    controlPoints.push(end);

    // Interpolate between control points and draw lines
    let lastPos = start;
    for (let i = 1; i < controlPoints.length; i++) {
        const segmentSteps = Math.floor(steps / (numControlPoints - 1));
        let segmentLastPos = lastPos;

        function createBranch(start, mainDirection, length) {
            let perpendicularDirection = {
                x: -mainDirection.y + mainDirection.z,
                y: mainDirection.x - mainDirection.z,
                z: -mainDirection.x + mainDirection.y
            };
            
            const magnitude = Math.sqrt(
                perpendicularDirection.x ** 2 + 
                perpendicularDirection.y ** 2 + 
                perpendicularDirection.z ** 2
            );
            perpendicularDirection = {
                x: perpendicularDirection.x / magnitude,
                y: perpendicularDirection.y / magnitude,
                z: perpendicularDirection.z / magnitude
            };
    
            let lastPos = start;
            for (let i = 1; i <= length; i++) {
                const branchPos = {
                    x: start.x + perpendicularDirection.x * i * 0.1 + (Math.random() - 0.5) * 0.2,
                    y: start.y + perpendicularDirection.y * i * 0.1 + (Math.random() - 0.5) * 0.2,
                    z: start.z + perpendicularDirection.z * i * 0.1 + (Math.random() - 0.5) * 0.2,
                };
                traceLine(player, lastPos, branchPos, "ubd:lightning_line", alpha);
                lastPos = branchPos;
            }
        }
        
        for (let j = 1; j <= segmentSteps; j++) {
            const t = j / segmentSteps;
            const pos = {
                x: controlPoints[i-1].x + (controlPoints[i].x - controlPoints[i-1].x) * t,
                y: controlPoints[i-1].y + (controlPoints[i].y - controlPoints[i-1].y) * t,
                z: controlPoints[i-1].z + (controlPoints[i].z - controlPoints[i-1].z) * t,
            };

            // Add some small-scale randomness
            const finalPos = {
                x: pos.x + (Math.random() - 0.5) * 0.3,
                y: pos.y + (Math.random() - 0.5) * 0.3,
                z: pos.z + (Math.random() - 0.5) * 0.3,
            };

            // Draw line segment
            traceLine(player, segmentLastPos, finalPos, "ubd:lightning_line", alpha);

            // Chance to create a branch
            if (Math.random() < branchProbability) {
                const mainDirection = {
                    x: finalPos.x - segmentLastPos.x,
                    y: finalPos.y - segmentLastPos.y,
                    z: finalPos.z - segmentLastPos.z,
                };
                const branchLength = Math.floor(Math.random() * maxBranchLength) + 1;
                createBranch(finalPos, mainDirection, branchLength);
            }

            segmentLastPos = finalPos;
        }
        
        lastPos = segmentLastPos;
    }
}

function traceLine(player, pStart, pEnd, particleType, pAlpha){
    try {
        const point1 = pStart;
        const point2 = pEnd;
        const distance = calculateDistance(point1, point2);
        const vectorDir = { x: point1.x - point2.x, y: point1.y - point2.y, z: point1.z - point2.z };
    
        const midPoint = { x: (point1.x + point2.x) / 2, y: (point1.y + point2.y) / 2, z: (point1.z + point2.z) / 2 };
        const customMap = new MolangVariableMap();
        customMap.setVector3("variable.plane", { x: 0.1, y: 0.9, z: 1 });
        customMap.setVector3("variable.direction", vectorDir);
        customMap.setFloat("variable.width", 0.08);
        customMap.setFloat("variable.length", distance/2);
        customMap.setFloat("variable.alpha", pAlpha);
        player.dimension.spawnParticle(particleType, midPoint, customMap);

        customMap.setVector3("variable.plane", { x: 0.1, y: 0.6, z: 1 });
        customMap.setFloat("variable.width", 0.1);
        player.dimension.spawnParticle(particleType, midPoint, customMap);

        customMap.setVector3("variable.plane", { x: 1, y: 1, z: 1 });
        customMap.setFloat("variable.width", 0.05);
        player.dimension.spawnParticle(particleType, midPoint, customMap);
    } catch (error) {
        console.warn(`Error tracing lightning line: ${error}`)
    };
}

function getEntitiesInVShape(player, direction) {
    const dimension = player.dimension;
    const maxDistance = 8;
    const widthPattern = [1, 1, 3, 3, 5, 5, 7, 7, 7, 9, 9, 9, 9, 11, 11, 11, 11, 11, 11, 11];
    const entitiesInVShape = [];
    const start = {x: player.location.x, y: player.location.y -1, z: player.location.z}
    const maxHits = 5;
    let hitCount = 0;
  
    for (let i = 0; i < maxDistance && hitCount < maxHits; i++) {
      const width = widthPattern[i];
      const forwardPoint = {
        x: start.x + direction.x * (i),
        y: start.y + direction.y * (i),
        z: start.z + direction.z * (i),
      };
  
      // Get entities around the forward point within the specified width
      const nearbyEntities = dimension.getEntities({
        location: forwardPoint,
        maxDistance: width / 2,
      });
  
      for (const entity of nearbyEntities) {
        if (!entitiesInVShape.includes(entity) && !ignoreList.has(entity.typeId)) {
          entitiesInVShape.push(entity);
          hitCount++;
          if (hitCount >= maxHits) break;
        }
      }
    }
  
    return entitiesInVShape;
}

function calculateBaseSpawnPos(headLoc, baseVelocity, forwardOffset, rightOffset, downOffset) {
  return {
      x: headLoc.x + baseVelocity.x * forwardOffset + baseVelocity.z * rightOffset,
      y: headLoc.y + baseVelocity.y * forwardOffset - downOffset,
      z: headLoc.z + baseVelocity.z * forwardOffset - baseVelocity.x * rightOffset
  };
}

function calculateDistance(posA, posB) {
  let direction = {
      x: posA.x - posB.x,
      y: posA.y - posB.y,
      z: posA.z - posB.z
  };
  return magnitude(direction);
}

function magnitude(vector) {
  return Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
};

export function createEntityHitLightning(player, entities) {
  const steps = 6; // Number of segments for each bolt
  const numBolts = 3; // Number of bolts per entity
  const maxBoltLength = 1.2; // Maximum length of each bolt
  const fadeDuration = 1; // Fade duration in ticks
  const branchProbability = 0.05; // Chance to spawn a branch off of the main line
  const numControlPoints = 2; // Controls the overall shape, more points = more chance to change directions and create branches
  const maxDeviation = 1.5; // How much change in direction can be applied for each new line

  entities.forEach((entity) => {
    const entityLocation = {
      x: entity.location.x,
      y: entity.location.y + 1, // Adjust height if needed
      z: entity.location.z,
    };

    for (let i = 0; i < numBolts; i++) {
      // Generate a random direction for each bolt
      const randomDirection = {
        x: (Math.random() - 0.5) * maxBoltLength,
        y: (Math.random() - 0.5) * maxBoltLength,
        z: (Math.random() - 0.5) * maxBoltLength,
      };

      const endPosition = {
        x: entityLocation.x + (randomDirection.x * 2),
        y: entityLocation.y + (randomDirection.y * 2),
        z: entityLocation.z + (randomDirection.z * 2),
      };

      // Fade logic over time
      let tickCount = 0;
      const intervalId = system.runInterval(() => {
        tickCount++;
        const fadeAlpha = Math.max(0, 1 - tickCount / fadeDuration); // Gradually reduce alpha
        createLightningBolt(player, entityLocation, endPosition, steps, numControlPoints, maxDeviation, branchProbability, maxBoltLength, fadeAlpha);
        //traceLine(player, entityLocation, endPosition, "ubd:lightning_line", fadeAlpha);

        if (tickCount >= fadeDuration) {
          system.clearRun(intervalId); // Stop fading after duration ends
        }
      }, 1); // Run every tick
    }
  });
}