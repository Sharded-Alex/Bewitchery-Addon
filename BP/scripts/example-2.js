import {world, system} from "@minecraft/server";

const cooldowns = new Map();
const COOLDOWN_DURATION = 200;

const entitySet = new Set ([
    "your:custom_mobs"
])
const allowedBlocks = [
  "minecraft:air"
]

world.afterEvents.entitySpawn.subscribe((e) => {
  const { entity } = e;
    if (entity.typeId !== "your:custom_evoker_fang_entity") { 
        return;
    }

  const nearbyEntity = entity.dimension.getEntities({
    location: entity.location,
    maxDistance: 3
  }).filter(entity => 
    entitySet.has(entity.typeId)
);

    if (nearbyEntity.length > 0) {
        const SourceEntity = nearbyEntity[0]; // Assume the closest SourceEntity is the one who shot the projectile
        spawnFlowerFangs(SourceEntity, SourceEntity.location);   
    }
});


export function checkAndSetCooldown(entityId) {
    const currentTime = Date.now();
    if (cooldowns.has(entityId)) {
        const lastUsedTime = cooldowns.get(entityId);
        const timeRemaining = COOLDOWN_DURATION - (currentTime - lastUsedTime);
        if (timeRemaining > 0) {
            return false;
        }
    }
    cooldowns.set(entityId, currentTime);
    return true;
}

// Helper function to calculate distance between two points
export function calculateDistance(pos1, pos2) {
    const dx = pos2.x - pos1.x;
    const dy = pos2.y - pos1.y;
    const dz = pos2.z - pos1.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function spawnFlowerFangs(entity, startLoc) {
    const dim = entity.dimension;
    const delayBetweenSpawns = 2; // Ticks between each branch spawn
    const branchCount = 3; // Number of branches


    const targetTypes = ["minecraft:cow"]; //changed to a cow for testing purposes
    let maxDistance = 15;
    let targetPlayer = null;

    // Find the nearest target
    const potentialTargets = dim.getEntities({
        location: entity.location,
        maxDistance: 35 // Adjust this range as needed
    }).filter(target => targetTypes.includes(target.typeId));

    if (potentialTargets.length > 0) {
        targetPlayer = potentialTargets[0]; // Assuming the first player is the target
        maxDistance = calculateDistance(entity.location, targetPlayer.location) + 5;

        // Calculate direction to the player
        const playerDirection = {
            x: targetPlayer.location.x - startLoc.x,
            z: targetPlayer.location.z - startLoc.z
        };
        const playerDirectionLength = Math.sqrt(playerDirection.x * playerDirection.x + playerDirection.z * playerDirection.z);
        const normalizedPlayerDirection = {
            x: playerDirection.x / playerDirectionLength,
            z: playerDirection.z / playerDirectionLength
        };

        // Spawn the main branch targeting the player
        spawnBranch(normalizedPlayerDirection, 0);

        // Spawn additional branches
        for (let branch = 1; branch < branchCount; branch++) {
            const branchAngle = (Math.random() - 0.5) * Math.PI / 2; // Random angle between -π/2 and π/2
            const branchDirection = {
                x: normalizedPlayerDirection.x * Math.cos(branchAngle) - normalizedPlayerDirection.z * Math.sin(branchAngle),
                z: normalizedPlayerDirection.x * Math.sin(branchAngle) + normalizedPlayerDirection.z * Math.cos(branchAngle)
            };

            // Random start point along the main branch
            const startOffset = Math.floor(Math.random() * (maxDistance / 2));
            spawnBranch(branchDirection, startOffset);
        }
    }

    function spawnBranch(direction, startOffset) {
        let currentTick = startOffset;

        system.runInterval(() => {
            if (currentTick >= maxDistance) {
                return "stop";
            }

            const spawnX = Math.round(startLoc.x + direction.x * currentTick);
            const spawnZ = Math.round(startLoc.z + direction.z * currentTick);

            // Cast a ray to find the ground level
            const raycastOptions = {
                maxDistance: 10,
                includeLiquidBlocks: false,
                includePassableBlocks: false
            };
            const raycastResult = dim.getBlockFromRay({ x: spawnX, y: startLoc.y + 5, z: spawnZ }, { x: 0, y: -1, z: 0 }, raycastOptions);

            if (raycastResult) {
                const spawnY = raycastResult.block.y + 1; // Spawn one block above the found ground

                dim.spawnEntity("your:custom_evoker_fang_entity", { x: spawnX, y: spawnY, z: spawnZ });
            }

            currentTick++;
        }, delayBetweenSpawns);
    }
}

export function spawnRootWave(entity, startLoc, viewDir) {
    const dim = entity.dimension;
    const delayBetweenSpawns = 1;
    const targetTypes = ["minecraft:cow"]; // changed for testing purposes
    let maxDistance = 20;
    let targetPlayer = null;

    const waveAmplitude = 2;

    maxDistance = calculateDistance(entity.location, viewDir) + 5;
    console.warn(maxDistance)
    placeRootBlocks();

    function placeRootBlocks() {
        let currentTick = 0;
        const waveLength = 8;
    
        const rootInterval = system.runInterval(() => {
            if (currentTick >= maxDistance) {
                system.clearRun(rootInterval);
                return;
            }

            const playerDirection = {
                x: viewDir.x - startLoc.x,
                z: viewDir.z - startLoc.z
            };
            const playerDirectionLength = Math.sqrt(playerDirection.x * playerDirection.x + playerDirection.z * playerDirection.z);
            const normalizedPlayerDirection = {
                x: playerDirection.x / playerDirectionLength,
                z: playerDirection.z / playerDirectionLength
            };
    
            const spawnX = Math.round(startLoc.x + normalizedPlayerDirection.x * currentTick);
            const spawnZ = Math.round(startLoc.z + normalizedPlayerDirection.z * currentTick);
    
            const raycastOptions = {
                maxDistance: 40,
                includeLiquidBlocks: false,
                includePassableBlocks: false
            };
            const raycastResult = dim.getBlockFromRay(
                { x: spawnX, y: startLoc.y + 10, z: spawnZ },
                { x: 0, y: -1, z: 0 },
                raycastOptions
            );
    
            if (raycastResult) {
                const groundY = raycastResult.block.y + 1;
                const normalizedDistance = (currentTick % waveLength) / waveLength;
                const waveOffset = Math.sin(normalizedDistance * 2 * Math.PI) * waveAmplitude;
                const spawnY = Math.round(groundY + waveOffset);
                const newLoc = { x: spawnX, y: spawnY, z: spawnZ };
                const blockBelowId = dim.getBlock(newLoc);
                
                if (allowedBlocks.includes(blockBelowId.typeId)) {
                    dim.setBlockType(newLoc, "minecraft:blue_ice");
    
                    system.runTimeout(() => {
                        dim.setBlockType(newLoc, "minecraft:air");
                    }, 10);
    
                    checkForEntities(spawnX, spawnY, spawnZ, entity);
                }
            }
    
            currentTick++;
        }, delayBetweenSpawns);
    }

    function checkForEntities(x, y, z, caster) {
        const damageRadius = 3;
        const entitiesInRange = dim.getEntities({
            location: { x: x, y: y, z: z },
            maxDistance: damageRadius
        });

        entitiesInRange.forEach(entity => {
          if (entity.id != caster.id && !entity.getComponent("item") && !entity.getComponent("projectile")) {
            entity.applyDamage(4);
          }
        });
    }
}