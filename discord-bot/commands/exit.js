const { SlashCommandBuilder } = require("@discordjs/builders")
const { useQueue } = require('discord-player')
const { EmbedBuilder } = require("discord.js")

module.exports = {
	guildCooldown: 1000,
	data: new SlashCommandBuilder()
        .setName("exit")
        .setDescription("Stop music and kick me from your voice channel"),
	execute: async ({ client, interaction }) => {
        const channel = interaction.member.voice.channel
        let embed = new EmbedBuilder()

		if (!channel) {
            return await interaction.reply({
                content: "❌ | You are not in any voice channel to kick me from!", ephemeral: true
            })
        }

        if (interaction.guild.members.me.voice.channelId && 
				interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
			return await interaction.reply({ 
				content: "❌ | I am not in your voice channel!", ephemeral: true 
			})
		}

		const queue = useQueue(interaction.guildId)
		
		if (!queue) {
			return await interaction.reply({ 
				content: `❌ | I have nothing to exit!`, ephemeral: true 
			})
		}

		embed
			.setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL() })
			.setTitle(`Kicked! 🦵🦶`)
			.setDescription(`I have been kicked... leaving the channel!`)
			.setTimestamp()
			.setFooter({ text: `Requested by: ${interaction.user.discriminator != 0 ? interaction.user.tag : interaction.user.username}` })

		try {
			queue.clear()
			queue.delete()

			await interaction.reply({ embeds: [embed] })
		} catch (e) {
			console.log(e)
            await interaction.reply({ content: `❌ | Errrrmmm... there was an error stopping the queue. Please try again? 😢`, ephemeral: true });
        }
	},
}