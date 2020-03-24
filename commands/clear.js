module.exports = {
    name : 'clear',
    description : 'provides the ability to clear the server\'s chat',
    execute(botPackage){
        let msg = botPackage.msg;
        let args = botPackage.args;
        let commands = botPackage.commands;
        if(!args[1]){
            msg.reply('Please give me the number of messages to delete.').then(
                (message) => {
                    commands.get('chatCleaner').execute(msg, message);
                }).catch((error) => { console.log(error.stack); });
            return;
        }
        let channel = msg.channel;
        if(args[1] === 'all'){
            channel.clone(channel.name, true, true).then(
                (chan) => {
                    chan.setParent(channel.parent);
                }).catch((error) => { console.log(error.stack); });
            channel.delete();
        } else {
            const quantity = Math.round(Number(args[1])) + 1;
            if(quantity < 2 || isNaN(quantity)){
                msg.reply('Please give me an appropriate argument regarding the volume of messages to be deleted.').then(
                    (message) => {
                        commands.get('chatCleaner').execute(msg, message);
                    }).catch((error) => { console.log(error.stack); });
                return;
            }
            if(quantity <= 100)
                channel.bulkDelete(quantity);
            else
                channel.bulkDelete(100);
        }
    }
}