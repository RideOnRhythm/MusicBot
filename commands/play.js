const voice = require('@discordjs/voice');

// Converts milliseconds to a time string format
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
        return mins.toString() + ':' + pad(secs);
    }
    return hrs.toString() + ':' + pad(mins) + ':' + pad(secs);
}

exports.run = async (client, message, args) => {
    let query = args.join(' ');
    query = query.replace(/(^[<>])|([<>]$)/g, '');
    const node = client.kazagumo;
    if (!node) return;

    const member = message.guild.members.cache.find(member => member.id === message.author.id);
    if (!member.voice.channel) {
        message.channel.send('Please join a voice channel first.');
        return;
    }

    // Joins a voice channel if the bot is not in a voice channel, gets the current player otherwise
    const memberBot = message.guild.members.cache.find(member => member.id === client.user.id);
    let player = null;

    player = node.players.get(message.guild.id.toString());
    if (player == null) {
        player = await node.createPlayer({
            guildId: message.guildId.toString(),
            textId: message.channel.id.toString(),
            voiceId: member.voice.channel.id.toString()
        });
    }

    // Checks if the query is a link, otherwise searches with YouTube
    const result = await node.search(query);
    if (!result.tracks.length) {
        await message.reply('No result found');
    }

    // Add track to queue
    let embed = null;
    if (result.type === 'PLAYLIST') {
        for (const track of result.tracks) {
            player.queue.add(track);
        }
        embed = {
            color: 0xd65076,
            title: 'Added Playlist to Queue',
            description: `**Playlist Name:** ${result.tracks.playlistName}`
        };
    } else {
        const playingTrack = result.tracks[0];
        embed = {
            color: 0xd65076,
            title: 'Added Track to Queue',
            description: `**Title:** [${playingTrack.title}](${playingTrack.uri})\n**Length:** ${msToTime(playingTrack.length)}`
        };
        player.queue.add(playingTrack);
    }
    await message.channel.send({ embeds: [embed] });

    if (!player.playing && !player.paused) {
        player.play();
    }
};

exports.name = 'play';
exports.msToTime = msToTime;
