const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { Shoukaku, Connectors } = require('shoukaku');
const config = require('./config.json');
const fs = require('fs');

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
// Initialize client and add Shoukaku connector
const shoukaku = new Shoukaku(new Connectors.DiscordJS(client), Nodes);
shoukaku.on('error', (_, error) => console.error(error));
client.shoukaku = shoukaku;
client.config = config;
client.commands = new Collection();
client.queue = [];

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
