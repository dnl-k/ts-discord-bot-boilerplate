import { container } from 'tsyringe';
import { Client } from '../client';
import { Event } from '../componentManager';

export default class Ready extends Event {
  public async run(): Promise<void> {
    const client = container.resolve<Client>('client');
    if (client.user) {
      console.log(`\x1b[32m${client.user.username} is ready\x1b[0m`);
    }
  }
}
