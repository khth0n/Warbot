module.exports = {
    name : 'greeting',
    description : 'provides a greeting upon stimulation',
    execute({msg, args, cleaner, ...rest}){
        let pkg = {msg, args, cleaner, ...rest};
        const greeting = getGreeting(pkg, args.join(' ').toLowerCase());

        switch(greeting){
            case null:
                if(!(msg.member.toString() === pkg.client.user.toString()) && msg.cleanContent.includes('@Warbot'))
                    cleaner(msg, 'I will provide you with a copy of the server rules and the bot commands. Check your DMs.');
                return;
            default:
                msg.reply(greeting);
                return;
        }
    }
}

function getGreeting({cfgGet}, str){
    let greetingJSON = cfgGet('greeting');
    let arg = str.slice(0, greetingJSON.longestTrigger);
    if(greetingJSON.triggers.includes(arg)){
        let index = Math.floor(Math.random() * greetingJSON.responses.length);
        return greetingJSON.responses[index];
    }
    return null;
}