module.exports = {
    name : 'faction',
    description : 'provides the user with the ability to manage a faction',
    execute(msg, server, arg, fileInfo){
        switch(arg){
            case 'add':
                server.client.commands.get('addFaction').execute(msg, server, fileInfo);
                break;
            case 'remove':
                break;
            case 'create':
                server.client.commands.get('createFaction').execute(msg, server, fileInfo);
                break;
            case 'delete':
                server.client.commands.get('deleteFaction').execute(msg, server, fileInfo);
                break;
            default:
                msg.reply('Please provide me with the faction command you would like me to execute!').then(
                    (message) => {
                        msg.guild.client.commands.get('chatCleaner').execute(msg, message, 4000);
                    });
        }
    }
}