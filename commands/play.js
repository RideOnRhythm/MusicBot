let isPlaying = false;
const listened = [];
const urlRe = /https?:\/\/(?:www\.)?.+/;

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

// Adds queue track and plays the next song in the queue if not currently playing music
async function addQueueTrack (client, player, track, channel) {
    client.queue.push(track);
    if (!isPlaying) {
        playNext(client, player, channel);
    }
}

// Plays the next song in the queue or disconnects from the voice channel if the queue is empty
async function playNext (client, player, channel) {
    if (client.queue.length !== 0) {
        const track = client.queue.shift();
        isPlaying = true;
        const embed = {
            color: 0xd65076,
            title: 'Playing Track',
            description: `**Title:** [${track.info.title}](${track.info.uri})\n**Length:** ${msToTime(track.info.length)}`
        };
        await channel.send({ embeds: [embed] });
        await player.playTrack({ track: track.encoded });
        player.trackMetadata = track;
    } else {
        isPlaying = false;
        await player.stopTrack();
        await player.node.leaveChannel(channel.guildId.toString());
    }
}

async function skip (client, player, channel) {
    if (client.queue.length !== 0) {
        await player.stopTrack();
    }
}

exports.run = async (client, message, args) => {
    let query = args.join(' ');
    query = query.replace(/(^<>)|(<>$)/g, '');
    const node = client.shoukaku.getNode();
    if (!node) return;

    const member = message.guild.members.cache.find(member => member.id === message.author.id);
    if (!member.voice.channel) {
        message.channel.send('Please join a voice channel first.');
        return;
    }

    let searchQuery = '';
    if (!urlRe.exec(query)) {
        searchQuery = `ytsearch:${query}`;
    } else {
        searchQuery = query;
    }
    const result = await node.rest.resolve(searchQuery);
    if (!result?.tracks.length) return;
    const metadata = result.tracks.shift();
    const embed = {
        color: 0xd65076,
        title: 'Added Track to Queue',
        description: `**Title:** [${metadata.info.title}](${metadata.info.uri})\n**Length:** ${msToTime(metadata.info.length)}`
    };
    await message.channel.send({ embeds: [embed] });

    // Joins a voice channel if the bot is not in a voice channel, gets the current player otherwise
    const memberBot = message.guild.members.cache.find(member => member.id === client.user.id);
    let player = null;
    if (!memberBot.voice.channel) {
        player = await node.joinChannel({
            guildId: message.guildId.toString(),
            channelId: member.voice.channel.id.toString(),
            shardId: 0
        });
    } else {
        player = node.players.get(message.guild.id);
    }
    // Plays the next track in the queue everytime each track ends
    if (!listened.includes(player)) {
        player.on('end', reason => {
            playNext(client, player, message.channel);
        });
        listened.push(player);
    }
    await addQueueTrack(client, player, metadata, message.channel);
};

exports.name = 'play';
exports.skip = skip;
exports.msToTime = msToTime;
