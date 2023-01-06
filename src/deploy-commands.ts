import 'reflect-metadata';
import 'dotenv/config';
import { ComponentManager } from './componentManager';
import { REST, Routes } from 'discord.js';
const componentManager = new ComponentManager();
(async () => {
  const commands = await componentManager.loadDirectory('./commands');
  const rest = new REST({ version: '10' })
    .setToken(process.env.DISCORD_BOT_TOKEN);

  const commandData = [];

  for (const command of commands) {
    const commandInstance = new command();
    commandData.push(commandInstance.commandData);
  }

  try {
    console.log('\x1b[90m', `Refreshing ${commandData.length} application command(s)`, '\x1b[0m');
    const res: any = await rest.put(Routes.applicationCommands(process.env.DISCORD_BOT_CLIENT_ID), { body: commandData });
    console.log('\x1b[32m', `Successfully refreshed ${res.length} application command(s)`, '\x1b[0m');
  } catch(e) {
    console.log(e);
  }
})();