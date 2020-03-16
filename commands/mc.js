module.exports = {
    name : 'mc',
    description : 'provides the user with integration and manipulation of the Warbot minecraft server',
    execute(botPackage){
        let arg = botPackage.args[1];
        let valid = ['start', 'stop', 'save'];
        if(valid.includes(arg)){
            botPackage.exec(`gnome-terminal; sleep 1; xdotool type "mc${arg}; exit;"; xdotool key Return;`);
            botPackage.msg.reply(`You have chosen to ${arg} the Warbot server!`);
        }
    }
}