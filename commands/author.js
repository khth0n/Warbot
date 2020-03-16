module.exports = {
    name : 'author',
    description : 'provides the user with information about the author',
    execute(botPackage){
        msg = botPackage.msg;
        msg.reply('I was created in a galaxy far, far away by Isaiah Cordova.');
        botPackage.commands.get('info').execute(msg, 'author', null);
        msg.delete();
    }
}