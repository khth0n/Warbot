module.exports = {
    name : 'createFaction',
    description : 'provides the user with the ability to create factions',
    execute(botPackage){
        msg = botPackage.msg;
        server = msg.guild;
        fileInfo = botPackage.factionInfo;
        const factionName = msg.content.slice(16);
        if(!factionName){
            msg.reply('Please provide me the name of the faction you want to create when calling this command.').then(
                (message) => {
                    botPackage.commands.get('chatCleaner').execute(msg, message, 4000);
                });
            return;
        }
        if(factionName === 'all')
            msg.reply('Cannot create a faction called \'all\' because it is used in a faction command.').then(
                (message) => {
                    botPackage.commands.get('chatCleaner').execute(msg, message, 4000);
                });
        else if(server.channels.find(channel => channel.name === factionName))
            msg.reply(`${factionName} already exists! Please contact the faction\'s leader for an invite!`).then(
                (message) => {
                    botPackage.commands.get('chatCleaner').execute(msg, message, 4000);
                });
        else {
            let recruitRole = server.roles.find(role => role.name === 'Recruit');
            msg.member.removeRole(recruitRole);
            leaderRole = server.createRole(
                {name : `Leader of the ${factionName}`,
                 mentionable : true,
                 hoist : true,
                 permissions : 116907329}).then(
                     (role) => {
                         msg.member.addRole(role);
                     }
                 ).catch((error) => {
                    console.log(error.stack);
                 });
            memberRole = server.createRole(
                {name : `Member of the ${factionName}`,
                 mentionable : true,
                 permissions : 116907073});
            server.createChannel(factionName,
                {type : 'category',
                 topic : `These are the communication channels for ${factionName}`}).then(
                    (channel) => {
                        server.roles.forEach(role => {
                            if(role.name.includes(factionName)){
                                channel.overwritePermissions(role,
                                    {VIEW_CHANNEL : true,
                                     SEND_MESSAGES : true,
                                     EMBED_LINKS : true,
                                     SEND_TTS_MESSAGES : true,
                                     ADD_REACTIONS : true,
                                     ATTACH_FILES : true,
                                     READ_MESSAGE_HISTORY : true,
                                     MENTION_EVERYONE : true,
                                     USE_EXTERNAL_EMOJIS : true,
                                     CONNECT : true,
                                     SPEAK : true,
                                     MUTE_MEMBERS : true,
                                     DEAFEN_MEMBERS : true,
                                     USE_VAD : true});
                                return;
                            }
                            channel.overwritePermissions(role,
                                {VIEW_CHANNEL : false,
                                 SEND_MESSAGES : false});
                        });
                        server.createChannel(`${factionName}-text`,
                        {type : 'text',
                         topic : `Text Communications for ${factionName}`,
                         parent : channel});
                        server.createChannel(`${factionName}-voice`,
                        {type : 'voice',
                         topic : `Voice Communications for ${factionName}`,
                         parent : channel});
                    }).catch((error) => {
                        console.log(error.stack);
                    });
            let data = {factionName, member : msg.member.displayName, leadRole : `Leader of the ${factionName}`, memRole : `Member of the ${factionName}`};
            server.client.commands.get('dataStorage').execute(fileInfo, data, 'add');
            msg.delete();
        }
    }
}