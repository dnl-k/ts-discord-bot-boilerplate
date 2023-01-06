import { BaseInteraction } from 'discord.js';
import { container } from 'tsyringe';
import { Client } from '../client';
import { Event } from '../componentManager';

export default class interactionCreate extends Event {
  public async run(interaction: BaseInteraction): Promise<void> {
    const client = container.resolve<Client>('client');
    if (interaction.isChatInputCommand()) {
      const command = client.commandManager.commands.get(interaction.commandName);

      if (!command) return;
      try {
        await command.execute(interaction);
      } catch (e) {
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      }
    }
  }
}
