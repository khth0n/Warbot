module.exports = {
    name : 'info',
    description : 'provides various information about the bot and author',
    execute(msg, arg, versionNum){
        switch(arg){
            case 'author':
                msg.reply('PUT MY AUTHOR BIO HERE');
                break;
            case 'version':
                msg.reply('Discord Wars Version ' + versionNum);
                break;
            default:
                msg.reply('Command could not be executed!');
                break;
        }
    }
}