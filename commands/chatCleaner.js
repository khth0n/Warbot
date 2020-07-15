module.exports = {
    name: 'chatCleaner',
    description: 'provides the bot the ability to clean the chat',
    execute(msg, text){
        msg.reply(text).then((message) => {
            let {server, channelID, msgID, messageID} = {server: msg.guild, channelID: msg.channel.id, msgID: msg.id, messageID: message.id};
            
            setTimeout(() => {
                let channel = server.channels.cache.find(chan => chan.id === channelID); 
                if(!channel)
                    return;

                findAndDeleteMessage(channel, msgID);
                findAndDeleteMessage(channel, messageID);
            }, 4000);
        }).catch((err) => { console.log(err.stack); });
    }
}

function findAndDeleteMessage(channel, id){
    channel.messages.fetch(id).then((result) => {
        result.delete();
    }).catch((err) => { console.log(err.stack); });
}