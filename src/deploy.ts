import process from 'node:process';
import { URL } from 'node:url';
import { API } from '@discordjs/core/http-only';
import { REST, GatewayIntentBits } from 'discord.js';
import { Client } from './client/index.js';
import { predicate } from './commands/index.js';

const client = new Client({intents: [GatewayIntentBits.Guilds]});
const commands = await client.components.load(new URL('commands/', import.meta.url), predicate);
const commandData = [...commands.values()].map((command) => command.data);

const rest = new REST({ version: '10' }).setToken(process.env.token as string);
const api = new API(rest as any);

const result = await api.applicationCommands.bulkOverwriteGlobalCommands(process.env.appID as string, commandData);

console.log(`Successfully registered ${result.length} commands.`);