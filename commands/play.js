function msToTime (s) {
    function pad (n, z) {
        z = z || 2;
        return ('00' + n).slice(-z);
    }

    const ms = s % 1000;
    s = (s - ms) / 1000;
    const secs = s % 60;
    s = (s - secs) / 60;
    const mins = s % 60;
    const hrs = (s - mins) / 60;

    return pad(hrs) + ':' + pad(mins) + ':' + pad(secs);
}

exports.run = async (client, message, args) => {
    const query = args.join(' ');
    const node = client.shoukaku.getNode();
    if (!node) return;

    const member = message.guild.members.cache.find(member => member.id === message.author.id);
    if (!member.voice.channel) {
        message.channel.send('Please join a voice channel first.');
        return;
    }

    const result = await node.rest.resolve(`ytsearch:${query}`);
    if (!result?.tracks.length) return;
    const metadata = result.tracks.shift();
    client.queue.push(metadata);
    const embed = {
        color: 0xd65076,
        title: 'Added Track',
        description: `**Title:** [${metadata.info.title}](${metadata.info.uri})\n**Length:** ${msToTime(metadata.info.length)}`
    };
    await message.channel.send({ embeds: [embed] });

    const player = await node.joinChannel({
        guildId: message.guildId.toString(),
        channelId: member.voice.channel.id.toString(),
        shardId: 0
    });
    await player.playTrack({ track: metadata.encoded });
}

exports.name = 'play';
