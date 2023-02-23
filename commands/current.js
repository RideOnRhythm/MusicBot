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

    if (hrs === 0) {
        return pad(mins) + ':' + pad(secs);
    }
    return pad(hrs) + ':' + pad(mins) + ':' + pad(secs);
}

exports.run = async (client, message, args) => {
    const node = client.shoukaku.getNode();
    if (!node) return;
    const player = node.players.get(message.guild.id);
    if (player === undefined) {
        await message.channel.send('I am currently not in a voice channel.');
        return;
    }
    const track = player.trackMetadata;

    const tempBar = '──────────';
    const index = player.position / track.info.length * 10 - 1;
    let progressBar = null;
    if (player.position === 0) {
        progressBar = 'ㅇ─────────';
    } else {
        progressBar = tempBar.slice(0, index) + 'ㅇ' + tempBar.slice(index + 1);
    }
    const embed = {
        color: 0xd65076,
        title: 'Current Song',
        description: `**Title:** [${track.info.title}](${track.info.uri})\n**Position:** ${msToTime(player.position)} ${progressBar} ${msToTime(track.info.length)}`
    };
    await message.channel.send({ embeds: [embed] });
};

exports.name = 'current';
