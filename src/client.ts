import { Client as DiscordClient, ClientOptions } from 'discord.js';
import { singleton, inject, container, injectable } from 'tsyringe';
import { CommandManager, EventManager } from './componentManager';

@singleton()
@injectable()
export class Client extends DiscordClient {
  constructor(@inject('token') token: string, @inject('clientOptions') options: ClientOptions, public eventManager: EventManager, public commandManager: CommandManager) {
    super(options);
    container.registerInstance<Client>('client', this);
    this.init(token);
  }

  private async init(token: string): Promise<void> {
    try {
      await this.commandManager.load('./commands');
      await this.eventManager.load('./events');

      await this.login(token);
    } catch (e) {
      console.log(`Could not initialize: ${e}`);
      process.exit(1);
    }
  }
}
