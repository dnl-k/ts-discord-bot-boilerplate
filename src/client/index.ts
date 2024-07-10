import { ClientOptions, Client as DiscordClient } from 'discord.js';
import { Components } from './components.js';

export class Client<Ready extends boolean = boolean> extends DiscordClient<Ready> {
  public components: Components;

  constructor(options: ClientOptions) {
    super(options);
    this.components = new Components(this);
  }

  get commands() {
    return this.components.commands;
  }

  get tasks() {
    return this.components.tasks;
  }
}