import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder } from "discord.js";
import { useQueue } from 'discord-player';

const command = {
    guildCooldown: 1000,
	data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("▶️ Resumes the song at current time"),
	execute: async ({ interaction }) => {
        const channel = interaction.member.voice.channel
        let embed = new EmbedBuilder()

		if (!channel) {
            return interaction.reply({
                content: "❌ | You are not in any voice channel!", ephemeral: true
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
				content: `❌ | No music to resume!`, ephemeral: true 
			})
		}

		var isPaused = queue.node.isPaused()

        if (!isPaused) {
            return await interaction.reply({ 
                content: "❌ | I am already playing music!", ephemeral: true 
            })
        }
    
        embed
			.setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL() })
			.setThumbnail(queue.currentTrack.thumbnail)
			.setTitle(`Song resumed ▶️`)
			.setDescription(`Playback has been resumed. Currently playing ${queue.currentTrack.title} ${queue.currentTrack.queryType != 'arbitrary' ? `([Link](${queue.currentTrack.url}))` : ''}!`)
			.setTimestamp()
			.setFooter({ text: `Requested by: ${interaction.user.discriminator != 0 ? interaction.user.tag : interaction.user.username}` })

		try {
			queue.node.setPaused(!queue.node.isPaused())
			await interaction.reply({ embeds: [embed] })
		} catch (err) {
            await interaction.reply({ content: `❌ | Errrrmmm... there was an error resuming the queue. Please try again? 😢`, ephemeral: true });
        }
	},
}

export { command }