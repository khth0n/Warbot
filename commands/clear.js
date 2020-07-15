module.exports = {
    name : 'clear',
    description : 'provides the ability to clear the server\'s chat',
    usage: '!clear [num]',
    associated: [
        'all'
    ],
    execute({msg, args, cleaner}){
        let arg = args[1];
        let channel = msg.channel;

        switch(arg){
            case undefined:
                cleaner(msg, 'Please give me the number of messages to delete.');
                return;
            case 'all':
                channel.clone({
                    options: {
                        name: channel.name,
                        type: channel.type,
                        permissionOverwrites: channel.permissionOverwrites,
                        parent: channel.parent,
                        topic: channel.topic,
                    }
                }).then(() => {
                    channel.delete();
                }).catch((err) => { console.log(err.stack); });
                return;
            default:
                let quantity = Math.round(Number(arg)) + 1;
                
                if(quantity < 2 || isNaN(quantity)){
                    cleaner(msg, 'Please give me an appropriate argument regarding the volume of messages to be deleted.');
                    return;
                }

                if(quantity <= 100)
                    channel.bulkDelete(quantity);
                else
                    channel.bulkDelete(100);
        }
    }
}