const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { Connectors } = require('shoukaku');
const config = require('./config.json');
const fs = require('fs');
const { Kazagumo } = require('kazagumo');
const { msToTime } = require('./commands/play.js');

const Nodes = [{
    name: 'Localhost',
    url: 'localhost:2333',
    auth: 'youshallnotpass'
}];
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});
const kazagumo = new Kazagumo({
    defaultSearchEngine: 'youtube',
    send: (guildId, payload) => {
        const guild = client.guilds.cache.get(guildId);
        if (guild) guild.shard.send(payload);
    }
}, new Connectors.DiscordJS(client), Nodes);
client.kazagumo = kazagumo;
client.config = config;
client.commands = new Collection();

// Kazagumo events
kazagumo.shoukaku.on('ready', (name) => console.log(`Lavalink ${name}: Ready!`));
kazagumo.shoukaku.on('error', (name, error) => console.warn(`Lavalink ${name}: Error Caught,`, error));
kazagumo.shoukaku.on('close', (name, code, reason) => console.warn(`Lavalink ${name}: Closed, Code ${code}, Reason ${reason || 'No reason'}`));
kazagumo.shoukaku.on('debug', (name, info) => console.debug(`Lavalink ${name}: Debug,`, info));
kazagumo.shoukaku.on('disconnect', (name, players, moved) => {
    if (moved) return;
    players.map(player => player.connection.disconnect());
    console.warn(`Lavalink ${name}: Disconnected`);
});
kazagumo.on('playerStart', (player, track) => {
    player.track = track;
    const embed = {
        color: 0xd65076,
        title: 'Playing Track',
        description: `**Title:** [${track.title}](${track.uri})\n**Length:** ${msToTime(track.length)}`
    };
    client.channels.cache.get(player.textId)?.send({ embeds: [embed] })
        .then(x => player.data.set('message', x));
});
kazagumo.on('playerEnd', (player) => {
    player.data.get('message')?.edit({ content: 'Finished playing' });
});
kazagumo.on('playerEmpty', player => {
    client.channels.cache.get(player.textId)?.send({ content: 'Destroyed player due to inactivity.' })
        .then(x => player.data.set('message', x));
    player.destroy();
});

// Register events and commands from their respective folders
const events = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of events) {
    const eventName = file.split('.')[0];
    const event = require(`./events/${file}`);
    client.on(eventName, event.bind(null, client));
}

const commands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commands) {
    const commandName = file.split('.')[0];
    const command = require(`./commands/${file}`);

    console.log(`Attempting to load command ${commandName}`);
    client.commands.set(commandName, command);
}

client.login(config.token);
