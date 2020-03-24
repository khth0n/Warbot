module.exports = {
    name : 'bot',
    description : 'provides the server owner with the ability to configure Warbot',
    execute(botPackage){
        let msg = botPackage.msg;
        let arg = botPackage.args[1];
        let commands = botPackage.commands;
        if(!arg){
            msg.reply('Please give me a viable bot configuration to alter.').then(
                (message) => {
                    commands.get('chatCleaner').execute(msg, message);
                });
            return;
        }
        arg = arg.toLowerCase();
        switch(arg){
            case 'off':
                msg.channel.send('Goodbye!');
                botPackage.exec('gnome-terminal; sleep 1; xdotool getactivewindow set_window --name TEMPMANAGER; xdotool type "stopWarbot; exit;"; xdotool key Return;');
                break;
            default:
                msg.reply('There are no bot configuration options available for that command!').then(
                    (message) => {
                        commands.get('chatCleaner').execute(msg, message);
                    });
        }
    }
}