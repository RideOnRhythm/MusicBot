module.exports = (client, message) => {
    if (message.author.bot) return;

    // Loop over all the prefixes and stop when it finds the matching one to find the right prefix
    let botPrefix = null;
    for (const prefix of client.config.prefixes) {
        if (message.content.indexOf(prefix) === 0) {
            botPrefix = prefix;
            break;
        }
    }
    if (botPrefix === null) return;

    const args = message.content.slice(botPrefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    let cmd = client.commands.get(command);

    // Checks all the commands if one contains an alias
    let aliasCommand = null;
    if (!cmd) {
        for (const scout of client.commands) {
            if (scout[1].aliases == null) continue;
            if (scout[1].aliases.includes(command)) {
                aliasCommand = scout[1];
                break;
            }
        }
        cmd = aliasCommand;
        if (cmd == null) return;
    }

    cmd.run(client, message, args);
};
