exports.run = async (client, message, args) => {
    const query = args.join(' ');
    const node = client.shoukaku.getNode();
    if (!node) return;
    const result = await node.rest.resolve(`ytsearch:${query}`);
    if (!result?.tracks.length) return;
    const metadata = result.tracks.shift();
    const player = await node.joinChannel({
        guildId: message.guildId.toString(),
        channelId: '1077880923720257596',
        shardId: 0
    });

    await player.playTrack({ track: metadata.encoded });
}

exports.name = 'play';