module.exports = {
    name: 'faction',
    description: 'provides the user with the ability to manage a faction',
    usage: '!faction [command] (options)',
    associated: [
        'create',
        'delete',
        'add',
        'remove'
    ],
    branches: [
        'create',
        'delete',
        'add',
        'remove'
    ],
    execute({msg, args, commands, cleaner, prefix, ...rest}){
        let arg = args[1];

        switch(arg){
            case undefined:
                cleaner(msg, 'Please provide me with the faction command you would like me to execute!');
                return;
            default:
                let cmd = `faction_${arg.toLowerCase()}`;
                if(!commands(cmd, {msg, args, commands, cleaner, ...rest}))
                    cleaner(msg, `This is an invalid faction command! Please try another command or refer to ${prefix}help for proper usage!`);
        }
    }
}