module.exports = {
    name : 'author',
    description : 'provides the user with information about the author',
    execute(msg, client){
        msg.reply('I was created in a galaxy far, far away by Isaiah Cordova.');
        client.commands.get('info').execute(msg, 'author', null);
    }
}