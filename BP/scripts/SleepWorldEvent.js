import { world, system, GameMode } from '@minecraft/server';

function getWorldInfo() { return { day: world.getDay(), timeOfDay: world.getTimeOfDay(), moonPhase: world.getMoonPhase(), playersSleepingPercentage: world.gameRules.playersSleepingPercentage } }
function getValidPlayers() { return world.getDimension("minecraft:overworld").getPlayers({ GameMode: [GameMode.survival, GameMode.adventure] }); }
class SleepEventManager {
  static #TicksToSleep = 100; // 5 seconds
  static #CheckInterval = 5; // ticks
  #activeEvents = { onStartSleep: false, onStopSleep: false, onSleep: false };
  #isInitialized = false; #SleepingPlayers = []; #EventDuration = 0; #RemainingPlayersNeeded = 0; #eventTrigger;
  #createEvent(eventName) {
    return {
      subscribers: new Set(),
      subscribe: (callback) => {
        this[eventName].subscribers.add(callback);
        this.#activeEvents[eventName] = true;
        this.#switchEventTrigger(); return callback;
      },
      unsubscribe: (callback) => {
        this[eventName].subscribers.delete(callback);
        this.#activeEvents[eventName] = this[eventName].subscribers.size > 0;
        this.#switchEventTrigger();
      },
      trigger: (eventData) => { this[eventName].subscribers.forEach(cb => cb(eventData)); }
    };
  }
  onStartSleep = this.#createEvent('onStartSleep');
  onStopSleep = this.#createEvent('onStopSleep');
  onSleep = this.#createEvent('onSleep');
  #initializeSleepWorldEvent() {
    this.#isInitialized = true;
    const run = system.runInterval(() => {
      const awakePlayers = this.#SleepingPlayers.filter(p => p && p.isValid && !p.isSleeping);
      this.#EventDuration = this.#RemainingPlayersNeeded === 0 ? this.#EventDuration + SleepEventManager.#CheckInterval : 0;
      if ((this.#EventDuration >= SleepEventManager.#TicksToSleep) && this.#SleepingPlayers.length > 0) {
        system.clearRun(run);
        this.onSleep.trigger({ sleptPlayers: this.#SleepingPlayers, worldInfo: getWorldInfo() });
        this.#resetSleepWorldEvent(); return;
      }
      if (awakePlayers.length > 0) {
        this.#SleepingPlayers = this.#SleepingPlayers.filter(p => p && p.isValid && p.isSleeping);
        this.#RemainingPlayersNeeded = Math.max(0, Math.floor(Math.max(1, getValidPlayers().length * (world.gameRules.playersSleepingPercentage / 100))) - this.#SleepingPlayers.length);
        this.onStopSleep.trigger({ sleepingPlayers: this.#SleepingPlayers, awakePlayers, eventDuration: this.#EventDuration, remainingPlayersNeeded: this.#RemainingPlayersNeeded });
        this.#EventDuration = 0; return;
      }
      if (this.#SleepingPlayers.length === 0) {
        system.clearRun(run); this.#resetSleepWorldEvent();
      }
    }, SleepEventManager.#CheckInterval);
  }
  // Reset to default values
  #resetSleepWorldEvent() { this.#isInitialized = false; this.#SleepingPlayers = []; this.#EventDuration = 0; this.#RemainingPlayersNeeded = 0; }
  constructor() {
    this.#isInitialized = false; this.#SleepingPlayers = []; this.#EventDuration = 0; this.#RemainingPlayersNeeded = 0;
    this.#eventTrigger = ({ player, block, isFirstEvent }) => {
      if (!isFirstEvent || block?.typeId !== 'minecraft:bed' || !player?.isSleeping || this.#SleepingPlayers.some(p => p.id === player.id)) return;
      this.#SleepingPlayers.push(player);
      const validPlayers = getValidPlayers();
      this.#RemainingPlayersNeeded = Math.max(0, Math.floor(Math.max(1, getValidPlayers().length * (world.gameRules.playersSleepingPercentage / 100))) - this.#SleepingPlayers.length);
      this.onStartSleep.trigger({ player, sleepingPlayers: this.#SleepingPlayers, awakePlayers: validPlayers.filter(p => p && p.isValid && !p.isSleeping), remainingPlayersNeeded: this.#RemainingPlayersNeeded, isFirstPlayer: !this.#isInitialized }), this.#isInitialized || this.#initializeSleepWorldEvent();
    };
    this.#switchEventTrigger();
  }
  #switchEventTrigger() {
    if (!Object.values(this.#activeEvents).includes(true)) world.afterEvents.playerInteractWithBlock.unsubscribe(this.#eventTrigger);
    else world.afterEvents.playerInteractWithBlock.subscribe(this.#eventTrigger);
  }
}

export const SleepWorldEvent = new SleepEventManager();