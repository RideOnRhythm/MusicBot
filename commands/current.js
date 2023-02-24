const msToTime = require('./play.js');

async function getProgressBar (player, track) {
    // Progress bar of current playing track depending on current position
    const tempBar = '──────────';
    const index = Math.ceil(player.position / track.info.length * 10 - 1);
    let progressBar = null;
    if (player.position === 0) {
        progressBar = 'ㅇ─────────';
    } else {
        progressBar = tempBar.slice(0, index) + 'ㅇ' + tempBar.slice(index + 1);
    }
    return progressBar;
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

    const progressBar = await getProgressBar(player, track);
    const embed = {
        color: 0xd65076,
        title: 'Current Song',
        description: `**Title:** [${track.info.title}](${track.info.uri})\n**Position:** ${msToTime.msToTime(player.position)} ${progressBar} ${msToTime.msToTime(track.info.length)}`
    };
    await message.channel.send({ embeds: [embed] });
};

exports.name = 'current';
exports.getProgressBar = getProgressBar;
