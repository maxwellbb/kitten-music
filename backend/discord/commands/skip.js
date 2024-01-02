import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder } from "discord.js";
import { useQueue } from 'discord-player';

const command = {
    guildCooldown: 1000,
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("⏭️ Skips the current song"),

    execute: async ({ interaction }) => {
        const channel = interaction.member.voice.channel
        let embed = new EmbedBuilder()
        let embedFollow = new EmbedBuilder()

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
                content: `❌ | No music is currently being played or in queue!`, ephemeral: true
            })
        }

        const queuedTracks = queue.tracks.toArray()
        const nextTrack = queuedTracks[0]

        embed
            .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL() })
            .setTitle(`Song skipped ⏭️`)
            .setTimestamp()
            .setFooter({ text: `Requested by: ${interaction.user.discriminator != 0 ? interaction.user.tag : interaction.user.username}` })

        try {
            queue.node.skip()
            await interaction.reply({ embeds: [embed] })
        } catch (err) {
            await interaction.reply({ content: `❌ | Errrrmmm... there was an error skipping the song. Please try again? 😢`, ephemeral: true });
        }

        if (nextTrack) {
            embedFollow
                .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL() })
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                .setTitle(`Now playing 🎵`)
                .setDescription(`Now playing ${nextTrack.title} ${nextTrack.queryType != 'arbitrary' ? `([Link](${nextTrack.url}))` : ''}!`)
                .setTimestamp()
                .setFooter({ text: `Requested by: ${interaction.user.discriminator != 0 ? interaction.user.tag : interaction.user.username}` })
        }

        await interaction.followUp({ embeds: [embedFollow] })
    },
}

export { command }