exports.run = async (client, message, args) => {
    const node = client.kazagumo;
    if (!node) return;
    const player = node.players.get(message.guild.id);
    if (player === undefined) {
        await message.channel.send('I am currently not in a voice channel.');
        return;
    }

    player.skip();
};

exports.name = 'skip';
