module.exports = {
    name : 'mc',
    description : 'provides the user with integration and manipulation of the Warbot minecraft server',
    execute(botPackage){
        let msg = botPackage.msg;
        let arg = botPackage.args[1];
        let commands = botPackage.commands;
        if(!arg){
            msg.reply('Please select a valid operation to perform on the Warbot MC Server').then(
                (message) => {
                    commands.get('chatCleaner').execute(msg, message);
                }).catch((error) => { console.log(error.stack); });
            return;
        }
        let valid = ['start', 'stop', 'save'];
        arg = arg.toLowerCase();
        if(valid.includes(arg)){
            botPackage.exec(`gnome-terminal; sleep 1; xdotool type "mc${arg}; exit;"; xdotool key Return;`);
            msg.reply(`You have chosen to ${arg} the Warbot MC server!`).then(
                (message) => {
                    commands.get('chatCleaner').execute(msg, message);
                }).catch((error) => { console.log(error.stack); });
        }
    }
}