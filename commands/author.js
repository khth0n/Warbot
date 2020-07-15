module.exports = {
    name: 'author',
    description: 'provides the user with information about the author',
    usage: '!author',
    associated: [
        'check out Warbot\'s creator!'
    ],
    execute(botPackage){
        let msg = botPackage.msg;
        msg.reply('I was created in a galaxy far, far away by Isaiah Cordova.');
        botPackage.args[1] = 'author';
        botPackage.commands.get('info').execute(botPackage);
    }
}