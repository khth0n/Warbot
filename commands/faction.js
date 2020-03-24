module.exports = {
    name : 'faction',
    description : 'provides the user with the ability to manage a faction',
    execute(botPackage){
        let msg = botPackage.msg;
        let arg = botPackage.args[1];
        let commands = botPackage.commands;
        if(!arg){
            msg.reply('Please provide me with the faction command you would like me to execute!').then(
                (message) => {
                    commands.get('chatCleaner').execute(msg, message);
                }).catch((error) => { console.log(error); });
            return;
        }
        let cmd = `${arg}_faction`.toLowerCase();
        if(!commands.get(cmd)){
            msg.reply('Please use a valid faction command to execute!').then(
                (message) => {
                    commands.get('chatCleaner').execute(msg, message);
                }).catch((error) => { console.log(error); });
            return;
        }
        commands.get(cmd).execute(botPackage);
    }
}