const msToTime = require('./play.js');
const getProgressBar = require('./current.js');

exports.run = async (client, message, args) => {
    const node = client.kazagumo;
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

    await player.seek(ms);
    const track = player.track;
    const progressBar = await getProgressBar.getProgressBar(ms, track);
    await message.channel.send(`Seeked the position to. ${msToTime.msToTime(ms)}\n**New Position:** ${msToTime.msToTime(ms)} ${progressBar} ${msToTime.msToTime(track.length)}`);
};

exports.name = 'seek';
