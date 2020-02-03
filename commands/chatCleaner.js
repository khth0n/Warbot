module.exports = {
    name : 'chatCleaner',
    description : 'provides the bot the ability to clean the chat',
    execute(botMessage, message, ms){
        botMessage.delete(ms);
        message.delete(ms);
    }
}