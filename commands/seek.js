const msToTime = require('./play.js');
const getProgressBar = require('./current.js');

exports.run = async (client, message, args) => {
    const node = client.shoukaku.getNode();
    if (!node) return;
    const player = node.players.get(message.guild.id);
    if (player === undefined) {
        await message.channel.send('I am currently not in a voice channel.');
        return;
    }

    const input = args[0];
    const splittedInput = input.split(':');
    let ms = null;
    if (splittedInput.length === 1) {
        ms = parseInt(splittedInput[0]) * 1000;
    } else if (splittedInput.length === 2) {
        ms = parseInt(splittedInput[0]) * 60 + parseInt(splittedInput[1]);
        ms *= 1000;
    } else if (splittedInput.length === 3) {
        ms = parseInt(splittedInput[0]) * 3600 + parseInt(splittedInput[1]) * 60 + parseInt(splittedInput[2]);
        ms *= 1000;
    }

    await player.seekTo(ms);
    const track = player.trackMetadata;
    const progressBar = await getProgressBar.getProgressBar(player, track);
    await message.channel.send(`Seeked the position to. ${msToTime.msToTime(ms)}\n**New Position:** ${msToTime.msToTime(player.position)} ${progressBar} ${msToTime.msToTime(track.info.length)}`);
};

exports.name = 'seek';
