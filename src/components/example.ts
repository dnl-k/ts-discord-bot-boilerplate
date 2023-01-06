import { ButtonBuilder } from '@discordjs/builders';
import { ButtonStyle, CommandInteraction } from 'discord.js';
import { Component } from '../componentManager';

export default class Example extends Component {
  public componentData = new ButtonBuilder();
  constructor() {
    super();
    this.componentData.setCustomId('exampleButton')
      .setLabel('Ahoi')
      .setStyle(ButtonStyle.Primary);
  }

  async execute(interaction: CommandInteraction) {
    await interaction.reply('Hello World');
  }
}