import { CommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { Command } from '../componentManager';

export default class Example extends Command {
  public commandData: SlashCommandBuilder;

  constructor() {
    super();
    this.commandData.setName('example')
      .setDescription('This is an example')
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);
  }

  async execute(interaction: CommandInteraction) {
    await interaction.reply('Hello World!');
  }
}
