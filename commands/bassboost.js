exports.run = async (client, message, args) => {
    const node = client.kazagumo;
    if (!node) return;
    const player = node.players.get(message.guild.id);
    if (player === undefined) {
        await message.channel.send('I am currently not in a voice channel.');
        return;
    }

    const gain = args[0].toLowerCase();
    const levels = {
        none: 0.0,
        low: 0.20,
        medium: 0.30,
        high: 0.35
    };
    await player.shoukaku.setEqualizer([{ band: 1, gain: levels[gain] }]);
    await message.channel.send(`Set the bassboost level to ${gain.charAt(0).toUpperCase() + gain.slice(1)}.`);
};

exports.name = 'bassboost';
