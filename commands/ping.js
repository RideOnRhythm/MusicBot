exports.run = async (client, message, args) => {
    const node = client.shoukaku.getNode();
    if (!node) return;
    const player = node.players.get(message.guild.id);

    let nodeString = '';
    if (player === undefined) {
        nodeString = 'Not connected.';
    } else {
        nodeString = Math.round(player.ping).toString();
    }
    await message.channel.send(`Bot Ping: ${Math.round(client.ws.ping)}ms\nNode Ping: ${nodeString}ms`);
};

exports.name = 'ping';
