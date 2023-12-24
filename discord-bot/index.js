require("dotenv").config()

const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const { Client, GatewayIntentBits, Collection } = require('discord.js')
const { Player, useMainPlayer } = require('discord-player')
const { BridgeProvider, BridgeSource } = require('@discord-player/extractor')

const fs = require('fs')
const path = require('path')

const client = new Client({
    intents: [GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
    ],
})

const commands = []
client.commands = new Collection()

const commandsPath = path.join(__dirname, 'commands')
const commandsFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

for (const file of commandsFiles) {
    const filePath = path.join(commandsPath, file)
    const command = require(filePath);

    client.commands.set(command.data.name, command)
    commands.push(command.data.toJSON())
}

const bridgeProvider = new BridgeProvider(BridgeSource.YouTube);

const player = new Player(client, {
    useLegacyFFmpeg: false,
    skipFFmpeg: false,
    bridgeProvider,
    ytdlOptions: {
        quality: 'highestaudio',
        highWaterMark: 1 << 25,
    },
    ipconfig: {
        blocks: ['fa25::/48', '2001:2::/48']
    },
    smoothVolume: process.env.SMOOTH_VOLUME,
})

player.extractors.loadDefault()

client.on("ready", async () => {
    const guild_ids = client.guilds.cache.map(guild => guild.id)

    const rest = new REST({version: '9'}).setToken(process.env.TOKEN)
    for (const guild_id of guild_ids) {
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, guild_id),
            {body: commands},
        )
        .then(() => console.log(`Successfully registered application commands for guild ${guild_id}`))
        .catch(console.error)
    }
})

client.on("interactionCreate", async interaction => {
    if(!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if(!command) return;

    console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);

    try
    {
        await command.execute({client, interaction});
    }
    catch(error)
    {
        console.error(error);
        await interaction.reply({content: "There was an error executing this command"});
    }
});

client.once('ready', () => {
    const player = useMainPlayer();

    console.log(player.scanDeps());

    player.on('debug', console.log);

    player.events.on('debug', (queue, message) => console.log(`[DEBUG ${queue.guild.id}] ${message}`));
});

client.login(process.env.TOKEN);