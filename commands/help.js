module.exports = {
    name : 'help',
    description : 'provides the user with the ability to see the available bot commands',
    execute(botPackage){
        let msg = botPackage.msg;
        msg.reply('COMING SOON (TM)');
        msg.delete();
    }
}