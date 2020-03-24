module.exports = {
    name: 'setup',
    description: 'provides the user with the ability to configure different bot/server functionalities',
    execute(botPackage){
        let msg = botPackage.msg;
        let arg = botPackage.args[1];
        let commands = botPackage.commands;
        if(!arg){
            msg.reply('Please specify a bot or server functionality you would like to configure!').then(
                (message) => {
                    commands.get('chatCleaner').execute(msg, message);
                }).catch((error) => { console.log(error.stack); });
            return;
        }
        let cmd = `setup_${arg.toLowerCase()}`;
        if(!commands.get(cmd)){
            msg.reply('This is an invalid setup command! Please try another command or refer to !help.').then(
                (message) => {
                    commands.get('chatCleaner').execute(msg, message);
                }).catch((error) => { console.log(error.stack); });
            return;
        }
        commands.get(cmd).execute(botPackage);
    }
}