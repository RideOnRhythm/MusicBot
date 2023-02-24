exports.run = async (client, message, args) => {
    const node = client.shoukaku.getNode();
    if (!node) return;
    const player = node.players.get(message.guild.id);
    if (player === undefined) {
        await message.channel.send('I am currently not in a voice channel.');
        return;
    }

    const volume = Number(args[0]);
    if (volume < 0 || volume > 1000) {
        await message.channel.send('You can only set the volume between 0% and 1000.%');
    }
    await player.setVolume(volume / 100);
    await message.channel.send(`Set the volume to ${volume}%.`);
};

exports.name = 'volume';
