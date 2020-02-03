module.exports = {
    name : 'removeFaction',
    description : 'provides the user with the ability to remove members from a faction',
    execute(msg, server, fileInfo){
        const memberName = msg.cleanContent.slice(16);
        if(!memberName){
            msg.reply('Please provide me with the name of the member you would like to remove from the faction!').then(
                (message) => {
                    server.client.commands.get('chatCleaner').execute(msg, message, 4000);
                });
        }
    }
}