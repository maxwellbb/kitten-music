const { SlashCommandBuilder } = require("@discordjs/builders")
const { useQueue } = require('discord-player')
const { EmbedBuilder } = require("discord.js")

module.exports = {
	guildCooldown: 1000,
	data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("⏯️ Pauses or resumes the song at current time"),
	execute: async ({ interaction }) => {
		const channel = interaction.member.voice.channel
        let embed = new EmbedBuilder()

		if (!channel) {
            return interaction.reply({
                content: "❌ | You are not in any voice channel to pause me in!", ephemeral: true
            })
        }

		if (interaction.guild.members.me.voice.channelId && 
				interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
			return await interaction.reply({ 
				content: "❌ | I am not in your voice channel!", ephemeral: true 
			})
		}

		const queue = useQueue(interaction.guildId)

		if (!queue || !queue.isPlaying()) {
			return interaction.reply({ 
				content: `❌ | No music is currently being played!`, ephemeral: true 
			})
		}

		var isPaused = queue.node.isPaused()
    
        embed
			.setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL() })
			.setThumbnail(queue.currentTrack.thumbnail)
			.setTitle(`Song **${isPaused ? 'resumed ▶️' : 'paused ⏸️'}**`)
			.setDescription(`Playback has been **${isPaused ? 'resumed' : 'paused'}**. Currently playing ${queue.currentTrack.title} ${queue.currentTrack.queryType != 'arbitrary' ? `([Link](${queue.currentTrack.url}))` : ''}!`)
			.setTimestamp()
			.setFooter({ text: `Requested by: ${interaction.user.discriminator != 0 ? interaction.user.tag : interaction.user.username}` })

		try {
			queue.node.setPaused(!queue.node.isPaused())
			await interaction.reply({ embeds: [embed] })
		} catch (err) {
            await interaction.reply({ content: `❌ | Errrrmmm... there was an error pausing the queue. Please try again? 😢`, ephemeral: true });
        }
	},
}