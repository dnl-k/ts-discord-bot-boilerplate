import type { Command } from "./index.js";

export default {
	data: {
		name: 'example',
		description: 'This is a test',
	},
	async execute(interaction) {
		await interaction.reply({
			content: "Hi!",
			ephemeral: true
		});
	},
} satisfies Command;