module.exports = {
    name : 'id',
    description : 'provides the user with the ability to id themselves and other users',
    execute(msg, Discord){
        const arg = msg.cleanContent.slice(4);
        switch(arg){
            case '':
                msg.channel.send(generateEmbed(msg.member, Discord));
                msg.delete();
                break;
            case '@here':
                msg.channel.members.forEach(member => {
                    msg.channel.send(generateEmbed(member, Discord));
                });
                break;
            case '@everyone':
                msg.guild.members.forEach(member => {
                    msg.channel.send(generateEmbed(member, Discord));
                });
                break;
            default:
                const member = msg.guild.members.find(member => arg.includes(member.displayName));
                if(!member){
                    msg.reply('Member does not exist!').then(
                        (message) => {
                            msg.guild.client.commands.get('chatCleaner').execute(message, msg, 3000);
                        });
                    break;
                }
                msg.channel.send(generateEmbed(member, Discord));
                msg.delete();
                break;
        }
    }
}

function generateEmbed(member, Discord){
    var lastActivity = member.lastMessage;
    if(!member.lastMessage)
        lastActivity = 'A long time ago';
    else
        lastActivity = lastActivity.createdAt.toLocaleString();
    const embed = new Discord.RichEmbed(
    {title : member.displayName,
     description : '**```ml\nLast online : ' + lastActivity + '```**',
     color : member.highestRole.color})
     .setThumbnail(member.user.avatarURL)
     .addField('Faction', 'Faction Name', true)
     .addField('Rank', member.highestRole.name, true)
     .addField('Balance', '$' + 1000, true)
     .setFooter('Veni Vidi Vici', member.guild.iconURL);
    return embed;
}