exports.run = async (client, message, args) => {
    const node = client.shoukaku.getNode();
    if (!node) return;
    const player = node.players.get(message.guild.id);

    await message.channel.send(`Bot Ping: ${Math.round(client.ws.ping)}ms\nNode Ping: ${Math.round(player.ping)}`);
};

exports.name = 'ping';
