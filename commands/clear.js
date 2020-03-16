module.exports = {
    name : 'clear',
    description : 'provides the ability to clear the server\'s chat',
    execute(botPackage){
        msg = botPackage.msg;
        args = botPackage.args;
        if(args.length <  2){
            msg.reply('Please give me the number of messages to delete.').then(
                (message) => {
                    botPackage.commands.get('chatCleaner').execute(msg, message, 3000);
                });
            return;
        }
        if(args[1] === 'all'){
            msg.channel.clone(msg.channel.name, true, true).then(
                (channel) => {
                    channel.setParent(msg.channel.parent);
                });
            msg.channel.delete();
        } else {
            const quantity = Math.round(Number(args[1])) + 1;
            if(quantity < 1 || isNaN(quantity)){
                msg.reply('Please give me an appropriate argument regarding the volume of messages to be deleted.');
                return;
            }
            if(quantity <= 100)
                msg.channel.bulkDelete(quantity);
            else
                msg.channel.bulkDelete(100);
        }
    }
}