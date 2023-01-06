import 'reflect-metadata';
import 'dotenv/config';
import { container, Lifecycle } from 'tsyringe';
import { Partials, GatewayIntentBits as Intents, ClientOptions } from 'discord.js';
import { Client } from './client';

container.register<ClientOptions>('clientOptions', {
  useValue: {
    partials: [Partials.Channel, Partials.GuildMember, Partials.GuildScheduledEvent, Partials.Message, Partials.Reaction, Partials.User],
    intents: [Intents.Guilds, Intents.GuildMessages, Intents.GuildMessageReactions, Intents.GuildMembers],
  },
});
container.register('token', { useValue: process.env.DISCORD_BOT_TOKEN });
container.register('client', { useClass: Client }, { lifecycle: Lifecycle.Singleton });
container.resolve('client');