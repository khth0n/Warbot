module.exports = {
    name : 'deleteFaction',
    description : 'provides the user with the ability to delete factions',
    execute(botPackage){
        msg = botPackage.msg;
        server = msg.guild;
        fileInfo = botPackage.factionInfo;
        const factionName = msg.content.slice(16);
        switch(factionName){
            case '':
                if(msg.content === '!setupServer'){
                    deleteAll(server);
                    break;
                }
                msg.reply('Please give me the name of faction you would like to delete. This requires that you be the last possible member of the faction.').then(
                    (message) => {
                        server.client.commands.get('chatCleaner').execute(msg, message, 4000);
                    });
                break;
            case 'all':
                deleteAll(server);
                let data = {factionName : 'all'};
                server.client.commands.get('dataStorage').execute(fileInfo, data, 'remove');
                msg.delete();
                return;
            default:
                if(!server.channels.find(channel => channel.name === factionName)){
                    msg.reply('The given faction does not exist! Please keep in mind that deletion requires case-sensitivity!').then(
                        (message) => {
                            botPackage.commands.get('chatCleaner').execute(msg, message, 4000);
                        });
                    break;
                }
                server.channels.forEach(channel => {
                    if(channel.name === factionName || (channel.parent != null && channel.parent.name === factionName))
                        channel.delete();
                });
                server.roles.forEach(role => {
                    if(role.name.includes(factionName))
                        role.delete();
                });
                let recruitRole = server.roles.find(role => role.name === 'Recruit');
                msg.member.addRole(recruitRole);
                let data2 = {factionName : factionName};
                server.client.commands.get('dataStorage').execute(fileInfo, data2, 'remove');
                msg.delete();
                return;
        }
    }
}

function deleteAll(server){
    server.channels.forEach(channel => {
        if(channel.name === 'War Forum' || (channel.parent != null && channel.parent.name === 'War Forum'))
            return;
        channel.delete();
    });
    server.roles.forEach(role => {
        if(role.name === 'Discord Wars' || role.name === '@everyone' || role.name === 'Recruit')
            return;
        role.delete();
    });
    let recruitRole = server.roles.find(role => role.name === 'Recruit');
    if(!recruitRole)
        return;
    server.members.forEach(member => {
        member.addRole(recruitRole);
    });
}