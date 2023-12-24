const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { useMainPlayer, useQueue, QueryType } = require('discord-player');

module.exports = {
    guildCooldown: 1000,
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("▶️ Search and play a song")
		.addStringOption(option =>
            option.setName("query").setDescription("search keywords").setRequired(true)
        ),
    execute: async ({ interaction }) => {
        const player = useMainPlayer()
        const channel = interaction.member.voice.channel
        let embed = new EmbedBuilder()

        if (!channel) {
            return interaction.reply({
                content: "❌ | Join a voice channel to let me play music!", ephemeral: true
            })
        }

        if (interaction.guild.members.me.voice.channelId &&
            interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
            return await interaction.reply({
                content: "❌ | I am not in your voice channel!", ephemeral: true
            })
        }

        let queue = useQueue(interaction.guild.id)

        if (!queue) {
            player.nodes.create(interaction.guild.id, {
                leaveOnEmpty: false,
                leaveOnEmptyCooldown: 0,
                leaveOnEnd: false,
                leaveOnEndCooldown: 0,
                leaveOnStop: false,
                leaveOnStopCooldown: 0,
                selfDeaf: true,
                skipOnNoStream: true,
				metadata: {
					channel: interaction.channel,
					requestedBy: interaction.user,
					client: interaction.guild.members.me,
				}
            })
        }

        queue = useQueue(interaction.guildId)

        console.log(queue)

        await interaction.deferReply()

        try {
            const query = interaction.options.getString('query', true);
            const queryResult = await player.search(query, {
				requestedBy: interaction.user,
				searchEngine: QueryType.AUTO
			})

            if (!queryResult || queryResult.tracks.length == 0 || !queryResult.tracks) {
                return interaction.followUp({
                    content: `❌ | Errrmmmmm... couldn't find the song with the requested query.`, ephemeral: true
                })
            }

            try {
                if (!queue.connection) {
                    await queue.connect(channel)
                }
            } catch (e) {
                queue.delete()
                await interaction.followUp({
                    content: `❌ | Errmmmmm... couldn't join your channel. Try again?`,
                    ephemeral: true 
                })
            }

            try {
                queue.addTrack(queryResult.playlist ? queryResult.tracks : queryResult.tracks[0])
            } catch (e) {
                await interaction.followUp({ content: `❌ | Errrmmmmm... I couldn't add your song to the queue :<. Try again?`, ephemeral: true })
            }

            if (!queue.isPlaying()) {
                try {
                    await queue.node.play(queue.tracks[0]);
                    queue.node.setVolume(1)
                } catch (e) {
                    await interaction.followUp({
                        content: `❌ | Errrmmmm... playback could not be started. Please try again.`,
                        ephemeral: true
                    })
                }
            }
            
            if (!queryResult.playlist) {
                const track = queryResult.tracks[0]
                
                embed
                    .setDescription(`**[${track.title}](${track.url})** has been added to the queue!`)
                    .setThumbnail(track.thumbnail)
                    .setFooter({ text: `Duration: ${track.duration}`})
            } else {
                const playlist = queryResult.playlist

                embed
                    .setDescription(`**[${playlist.title}](${playlist.url})** has been added to the queue!`)
                    .setThumbnail(playlist.thumbnail)
                    .setFooter({ text: `Duration: ${playlist.durationFormatted}`})
            }

            await interaction.followUp({
                embeds: [embed]
            })
        } catch (e) {
            console.log(e)
            await interaction.followUp({
                content: `❌ | Errrmmmm... playback could not be started. Please try again.`,
                ephemeral: true
            })
        }
	},
}