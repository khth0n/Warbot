module.exports = {
    name : 'info',
    description : 'provides various information about the bot and author',
    execute(botPackage){
        let msg = botPackage.msg;
        let arg = botPackage.args[1];
        let commands = botPackage.commands;
        if(!arg){
            msg.reply('Please specify the info you\'d like to access! Check !help for reference!').then(
                (message) => {
                    commands.get('chatCleaner').execute(msg, message);
                }).catch((error) => { console.log(error.stack); });
            return;
        }
        arg = arg.toLowerCase();
        switch(arg){
            case 'author':
                msg.reply('PUT MY AUTHOR BIO HERE');
                break;
            case 'version':
                msg.reply('Discord Wars Version ' + botPackage.version);
                break;
            default:
                msg.reply('Not a valid info command!').then(
                    (message) => {
                        commands.get('chatCleaner').execute(msg, message);
                    }).catch((error) => { console.log(error.stack); });
                return;
        }
        msg.delete();
    }
}