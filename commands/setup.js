module.exports = {
    name: 'setup',
    description: 'provides the user with the ability to configure different bot/server functionalities',
    usage: '!setup [commands]',
    associated: [
        'server',
        'greeting'
    ],
    branches: [
        'server',
        'greeting'
    ],
    execute({msg, args, commands, cleaner, prefix, ...rest}){
        let arg = args[1];

        switch(arg){
            case undefined:
                cleaner(msg, 'Please specify a bot or server functionality you would like to configure!');
                return;
            default:
                let cmd = `setup_${arg.toLowerCase()}`;
                if(!commands(cmd, {msg, args, commands, cleaner, ...rest}))
                    cleaner(msg, `This is an invalid setup command! Please try another command or refer to ${prefix}help for proper usage!`);
        }
    }
}