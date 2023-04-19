const msToTime = require('./play.js');

async function getProgressBar (ms, track) {
    // Progress bar of current playing track depending on current position
    const tempBar = '──────────';
    const index = Math.ceil(ms / track.length * 10 - 1);
    let progressBar = null;
    if (ms === 0) {
        progressBar = 'ㅇ─────────';
    } else {
        progressBar = tempBar.slice(0, index) + 'ㅇ' + tempBar.slice(index + 1);
    }
    return progressBar;
}

exports.run = async (client, message) => {
    const node = client.kazagumo;
    if (!node) return;
    const player = node.players.get(message.guild.id.toString());
    if (player === undefined) {
        await message.channel.send('I am currently not in a voice channel.');
        return;
    }
    const track = player.track;

    const progressBar = await getProgressBar(player.position, track);
    const embed = {
        color: 0xd65076,
        title: 'Current Song',
        description: `**Title:** [${track.title}](${track.uri})\n**Position:** ${msToTime.msToTime(player.position)} ${progressBar} ${msToTime.msToTime(track.length)}`
    };
    await message.channel.send({ embeds: [embed] });
};

exports.name = 'current';
exports.getProgressBar = getProgressBar;
