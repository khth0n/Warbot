module.exports = {
    name : 'faction',
    description : 'provides the user with the ability to manage a faction',
    execute(botPackage){
        switch(botPackage.args[1]){
            case 'add':
                botPackage.commands.get('addFaction').execute(botPackage);
                break;
            case 'remove':
                break;
            case 'create':
                botPackage.commands.get('createFaction').execute(botPackage);
                break;
            case 'delete':
                botPackage.commands.get('deleteFaction').execute(botPackage);
                break;
            default:
                botPackage.msg.reply('Please provide me with the faction command you would like me to execute!').then(
                    (message) => {
                        botPackage.commands.get('chatCleaner').execute(msg, message, 4000);
                    });
        }
    }
}