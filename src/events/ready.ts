import { Events } from "discord.js";
import type { Event } from './index.js';

export default {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    for (const task of client.tasks.values()) {
      task.execute();
      task.timeoutID = setInterval(() => {
        task.execute();
      }, task.delay);
    }
  }
} satisfies Event<Events.ClientReady>;