const msToTime = require('./play.js');

exports.run = async (client, message, args) => {
    const node = client.kazagumo;
    if (!node) return;
    const player = node.players.get(message.guild.id);
    if (player === undefined) {
        await message.channel.send('I am currently not in a voice channel.');
        return;
    }

    // yandere dev gaming
    if (args.length >= 1) {
        if (args[0] === 'none' || ['queue', 'track'].includes(player.loop)) {
            player.setLoop('none');
            await message.channel.send('Disabled looping.');
        } else if (args[0] === 'queue') {
            player.setLoop('queue');
            await message.channel.send('Looping the queue.');
        } else if (args[0] === 'track') {
            player.setLoop('track');
            const track = player.track;
            const embed = {
                color: 0xd65076,
                title: 'Looping Current Track',
                description: `**Title:** [${track.title}](${track.uri})\n**Length:** ${msToTime(track.length)}`
            };
            await message.channel.send({ embed: [embed] });
        }
    } else {
        if (['queue', 'track'].includes(player.loop)) {
            player.setLoop('none');
            await message.channel.send('Disabled looping.');
        } else {
            player.setLoop('track');
            const track = player.track;
            const embed = {
                color: 0xd65076,
                title: 'Looping Current Track',
                description: `**Title:** [${track.title}](${track.uri})\n**Length:** ${msToTime(track.length)}`
            };
            await message.channel.send({ embed: [embed] });
        }
    }
};

exports.name = 'loop';
