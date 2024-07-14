import {  URL } from 'node:url';
import { Client } from './client/index.js';
import express, { Application } from 'express';
import { GatewayIntentBits, Partials } from 'discord.js';
import { predicate as Command } from './commands/index.js';
import { predicate as Task } from './tasks/index.js';
import { predicate as Event } from './events/index.js';
import Router from './api/router.js';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import responseFormatter from './api/middlewares/response-formatter.js';

/**
 * Discord
 */
const client = new Client({
  partials: [
    Partials.Channel, Partials.GuildMember, Partials.GuildScheduledEvent, Partials.Message, Partials.Reaction, Partials.User
  ],
  intents: [
    GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMembers
  ]
});

/**
 * Load commands from the 'commands' directory
 */
client.components.load(new URL('commands/', import.meta.url), Command).then((commands) => {
  commands.reduce((acc, cur) => acc.set(cur.data.name, cur), client.commands);
});

/**
 * Load tasks from the 'tasks' directory
 */
client.components.load(new URL('tasks/', import.meta.url), Task).then((tasks) => {
  tasks.reduce((acc, cur) => acc.set(cur.name, cur), client.tasks);
});

/**
 * Load events from the 'events' directory and register the execute function as event listener 
 */
client.components.load(new URL('events/', import.meta.url), Event).then((events) => {
  for (const event of events) {
    client[event.once ? 'once' :'on'](event.name, async (...args) => event.execute(...args));
  }
});

await client.login(process.env.token);

/**
 * API
 */
const app: Application = express();

app.use(responseFormatter);
app.use(helmet());
app.use(bodyParser.json());

app.set('discord-client', client);

const router = new Router(app);
await router.load(new URL('api/routes/', import.meta.url));

app.listen(process.env.port);