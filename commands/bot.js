module.exports = {
    name : 'bot',
    description : 'provides the server owner with the ability to configure Warbot',
    execute(botPackage){
        msg = botPackage.msg;
        args = botPackage.args;
        if(args.length < 2){
            msg.reply('Please give me a viable bot configuration to alter.').then(
                (message) => {
                    botPackage.commands.get('chatCleaner').execute(message, msg, 3000);
                });
            return;
        }
        switch(args[1]){
            case 'off':
                msg.channel.send('Goodbye!');
                botPackage.exec('gnome-terminal; sleep 1; xdotool getactivewindow set_window --name TEMPMANAGER; xdotool type "stopWarbot; exit;"; xdotool key Return;');
                break;
            default:
                msg.reply('There are no available bot configuration options for that command!').then(
                    (message) => {
                        botPackage.commands.get('chatCleaner').execute(message, msg, 3000);
                    });
        }
    }
}