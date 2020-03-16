module.exports = {
    name : 'greeting',
    description : 'provides a greeting upon stimulation',
    execute(botPackage){
        msg = botPackage.msg;
        if(!msg.member)
            return;
        let args = msg.content.split(' ');
        const greeting = getGreeting(args[0]);
        switch(greeting){
            case null:
                if(!(msg.member.toString() === botPackage.client.user.toString()) && msg.cleanContent.includes('@Warbot'))
                    msg.reply('I will provide you with a copy of the server rules and the bot commands. Check your DMs.');
                break;
            default:
                msg.reply(greeting);
                break;
        }
    }
}

function getGreeting(argument){
    const arg = argument.toUpperCase();
    if(arg === 'HI' ||
       arg === 'YO' ||
       arg === 'HEY' ||
       arg === 'HELLO' ||
       arg === 'GREETINGS' ||
       arg === 'SALUTATIONS'){
        const roll = Math.random() * 100;
        if(roll < 20)
            return 'This is the way.';
        else if(roll >= 20 && roll < 40)
            return 'What\'s good? :thumbsup:';
        else if(roll >= 40 && roll < 60)
            return 'Welcome back, friend. :heart:';
        else if(roll >= 60 && roll < 80)
            return 'Welcome to the Champions Club! :cd:';
        else
            return 'Affirmative. :wave:'
    }
    return null;
}