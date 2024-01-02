import 'dotenv/config';

import { REST } from '@discordjs/rest';
// import { Routes } from 'discord-api-types/v10';
import { Client, GatewayIntentBits, Collection, Routes } from 'discord.js';
import { Player } from 'discord-player';
import { BridgeProvider, BridgeSource } from '@discord-player/extractor';

const client = new Client({
    intents: [GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

const commands = [];
const commandsMap = new Collection();

const commandNames = ['exit', 'pause', 'play', 'queue', 'resume', 'skip']

for (const file of commandNames) {
    const { command } = await import(`./commands/${file}.js`);
    commandsMap.set(command.data.name, command);
    commands.push(command.data.toJSON());
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
});

client.once("ready", async () => {
    await player.extractors.loadDefault();

    const rest = new REST()
    rest.setToken(process.env.CLIENT_TOKEN)

    try {
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        )
    } catch(err) {
        console.error(err)
    }
});

client.on("interactionCreate", async interaction => {
    if(!interaction.isCommand()) return;

    const command = commandsMap.get(interaction.commandName);
    if(!command) return;

    console.log(`${interaction.user.tag} in #${interaction.channel.name} of server "${interaction.guild}" triggered an interaction.`);

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

// client.once('ready', () => {
//     const player = useMainPlayer();

//     console.log(player.scanDeps());

//     player.on('debug', console.log);

//     player.events.on('debug', (queue, message) => console.log(`[DEBUG ${queue.guild.id}] ${message}`));
// });

export { client };