import { SlashCommandBuilder } from "@discordjs/builders"
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder } from "discord.js"
import { useQueue } from 'discord-player'

const command = {
    guildCooldown: 1000,
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("shows first 10 songs in the queue"),

    execute: async ({ interaction }) => {
        const channel = interaction.member.voice.channel
        let embed = new EmbedBuilder()

        const queue = useQueue(interaction.guildId)

        if (!queue || !queue.isPlaying()) {
            return interaction.reply({
                content: `❌ | No music is currently being played or in queue!`, ephemeral: true
            })
        }

        const queuedTracks = queue.tracks.toArray()
        var size = queuedTracks.length
        var queueSize = Math.ceil(size / 10)

        embed
            .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL() })
            .setThumbnail(interaction.guild.iconURL({dynamic: true}))
            .setTitle(`Current Music Queue 🎵`)
            .setTimestamp()
            .setFooter({ text: `Requested by: ${interaction.user.discriminator != 0 ? interaction.user.tag : interaction.user.username} - Page ${1} of ${queueSize}` })

        var curPageNum = 1
        var curTrackView = []

        curTrackView.push(
            { 
                name: 'Currently playing 🎶', 
                value: `**${queue.currentTrack.title}** ${queue.currentTrack.queryType != 'arbitrary' ? `([Link](${queue.currentTrack.url}))` : ''}` 
            },
        )
        
        for (var i = (curPageNum - 1) * 10; i < curPageNum * 10; i++) {
            if (queuedTracks[i]) {
                curTrackView.push(
                    {
                        name: `${i + 1}. ${queuedTracks[i].title}`,
                        value: `**${queuedTracks[i].author}** ${queuedTracks[i].queryType != 'arbitrary' ? `([Link](${queuedTracks[i].url}))` : ''}`
                    },
                )
            }
        }

        embed
            .addFields(curTrackView)

        var timestamp = Date.now();
        var finalComponents = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`queue-${timestamp}-previous`)
                    .setStyle(1)
                    .setLabel("⬅️"),
                new ButtonBuilder()
                    .setCustomId(`queue-${timestamp}-next`)
                    .setStyle(1)
                    .setLabel("➡️")
        )

        interaction.reply({ embeds: [embed], components: [finalComponents] })

        const filter = (interaction) => interaction.customId.includes(`queue-${timestamp}`)
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 180000 })

        collector.on('collect', async (buttonResponse) => {
            const queue = useQueue(interaction.guildId)
            let embed = new EmbedBuilder()

            if (!queue || !queue.isPlaying()) {
                return interaction.reply({
                    content: `❌ | No music is currently being played or in queue!`, ephemeral: true
                })
            }

            const queuedTracks = queue.tracks.toArray()
            const nextTrack = queuedTracks[0]
            size = queuedTracks.length
            queueSize = Math.ceil(size / 10)
            if (!nextTrack) {
                return interaction.reply({
                    content: `❌ | No music is currently being played or in queue!`, ephemeral: true
                })
            }

            embed
                .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL() })
                .setThumbnail(interaction.guild.iconURL({dynamic: true}))
                .setTitle(`Current Music Queue 🎵`)
                .setTimestamp()

            if (buttonResponse.customId.includes('next')) {
                if (curPageNum >= Math.ceil(size / 10)) {
                    curPageNum = 1
                } else {
                    curPageNum++
                }
            } else if (buttonResponse.customId.includes('previous')) {
                if (curPageNum <= 1) {
                    curPageNum = Math.ceil(size / 10)
                } else {
                    curPageNum--
                }   
            }

            var i = (curPageNum - 1) * 10
            var curTracks = []

            curTracks.push({ name: 'Now Playing ▶️', value: `**${queue.currentTrack.title}** ${queue.currentTrack.queryType != 'arbitrary' ? `([Link](${queue.currentTrack.url}))` : ''}` },)

            for (i; i < curPageNum * 10; i++) {
                if (queuedTracks[i]) {
                    curTracks.push(
                        {
                            name: `${i + 1}. ${queuedTracks[i].title}`,
                            value: `**${queuedTracks[i].author}** ${queuedTracks[i].queryType != 'arbitrary' ? `([Link](${queuedTracks[i].url}))` : ''}`
                        },
                    )
                }
            }

            embed
                .addFields(curTracks)
                .setFooter({ text: `Requested by: ${interaction.user.discriminator != 0 ? interaction.user.tag : interaction.user.username} - Page ${curPageNum} of ${queueSize}` })
            interaction.editReply({ embeds: [embed] })
            buttonResponse.deferUpdate()
        })

        collector.on('end', async () => {
            interaction.editReply({
                content: 'Please use **/queue** again to show the embed again.', components: []
            })
        })
    }
}

export { command }