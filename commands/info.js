module.exports = {
    name : 'info',
    description : 'provides various information about the bot and author',
    execute(botPackage){
        msg = botPackage.msg;
        switch(botPackage.args[1]){
            case 'author':
                msg.reply('PUT MY AUTHOR BIO HERE');
                break;
            case 'version':
                msg.reply('Discord Wars Version ' + botPackage.version);
                break;
            default:
                msg.reply('Command could not be executed!').then(
                    (message) => {
                        botPackage.commands.get('chatCleaner').execute(msg, message, 3000);
                    });
                break;
        }
    }
}