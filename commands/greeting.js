module.exports = {
    name : 'greeting',
    description : 'provides a greeting upon stimulation',
    execute(botPackage){
        let msg = botPackage.msg;
        let arg = botPackage.msg.content.split(' ')[0];
        const greeting = getGreeting(arg);
        switch(greeting){
            case null:
                if(!(msg.member.toString() === botPackage.client.user.toString()) && msg.cleanContent.includes('@Warbot'))
                    msg.reply('I will provide you with a copy of the server rules and the bot commands. Check your DMs.');
                return;
            default:
                msg.reply(greeting);
                return;
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