module.exports = {
    name : 'chatCleaner',
    description : 'provides the bot the ability to clean the chat',
    execute(msg, message){
        setTimeout(() => {
            let channel = msg.guild.channels.get(msg.channel.id);
            if(!channel)
                return;
            if(channel.messages.get(msg.id) != null)
                msg.delete();
            if(channel.messages.get(message.id) != null)
                message.delete();
        }, 4000);
    }
}