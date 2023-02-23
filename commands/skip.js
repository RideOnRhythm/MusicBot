exports.run = async (client, message, args) => {
    const node = client.shoukaku.getNode();
    if (!node) return;
    const player = node.players.get(message.guild.id);
    if (player === undefined) {
        await message.channel.send('I am currently not in a voice channel.');
        return;
    }

    const skip = require('./play.js');
    skip.skip(client, player, message.channel);
};

exports.name = 'skip';
