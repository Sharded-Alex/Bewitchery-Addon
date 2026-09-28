execute as @e run scoreboard objectives add bw:curseTimer dummy
execute as @a run scoreboard objectives add bw:fatgTimer dummy
execute as @a run scoreboard objectives add bw:Fatigue dummy
execute as @a run scoreboard objectives add bw:oEnergy dummy


execute as @a[tag=!bw:Initialize] as @s run scoreboard players set @s bw:Fatigue 0
execute as @a[tag=!bw:Initialize] as @s run scoreboard players set @s bw:oEnergy 0
execute as @a[tag=!bw:Initialize] as @s run tag @s add bw:Initialize


execute as @a[scores={bw:Fatigue=1..}] as @s run scoreboard players add @s bw:fatgTimer 1
execute as @a[scores={bw:fatgTimer=61..}] as @s run scoreboard players set @s bw:fatgTimer 0
execute as @a[scores={bw:Fatigue=0}] as @s run scoreboard players set @s bw:fatgTimer 0

execute as @a[scores={bw:Fatigue=1.., bw:fatgTimer=20}] as @s run scriptEvent bw:fatigueMechanic
execute as @a[scores={bw:Fatigue=1.., bw:fatgTimer=40}] as @s run scriptEvent bw:fatigueMechanic
execute as @a[scores={bw:Fatigue=1.., bw:fatgTimer=60}] as @s run scriptEvent bw:fatigueMechanic
execute as @a[scores={bw:Fatigue=1.., bw:fatgTimer=60}] as @s run scoreboard players remove @s bw:Fatigue 1
