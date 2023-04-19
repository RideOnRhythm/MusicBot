exports.run = async (client, message, args) => {
    const node = client.kazagumo;
    if (!node) return;
    const player = node.players.get(message.guild.id);
    if (player === undefined) {
        await message.channel.send('I am currently not in a voice channel.');
        return;
    }

    if (!player.paused) {
        await player.pause(true);
        await message.channel.send('Paused music.');
    } else {
        await player.pause(false);
        await message.channel.send('Resumed music.');
    }
};

exports.name = 'pause';
