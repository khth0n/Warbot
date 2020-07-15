module.exports = {
    name : 'id',
    description : 'provides the user with the ability to id themselves and other users',
    usage: '!id [@]',
    associated: [
        '@here',
        '@everyone',
        '@member',
        '@Warbot'
    ],
    execute(botPackage){
        let msg = botPackage.msg;
        let channel = msg.channel;
        let server = msg.guild;
        let db = botPackage.db;
        let Discord = botPackage.discord;
        let arg = botPackage.args[1];

        switch(arg){
            case undefined:
                generateEmbed(channel, msg.member, db, Discord);
                break;
            case '@here':
                channel.members.forEach(member => {
                    generateEmbed(channel, member, db, Discord);
                });
                break;
            case '@everyone':
                server.members.cache.forEach(member => {
                    generateEmbed(channel, member, db, Discord);
                });
                break;
            default:
                arg = arg.substring(3, arg.length - 1);
                let member = server.members.cache.get(arg);
                if(!member){
                    botPackage.cleaner(msg, 'Member does not exist!');
                    return;
                }
                generateEmbed(channel, member, db, Discord);
                break;
        }
        msg.delete();
    }
}

function generateEmbed(channel, member, db, Discord){
    var lastActivity = member.lastMessage;
    if(!member.lastMessage)
        lastActivity = 'No recent messages logged';
    else
        lastActivity = lastActivity.createdAt.toLocaleString();
    db.collection('members').findOne({_id: member.id}, (err, result) => {
        if(err) throw err;
        console.log(result);
        let apparentRole = member.roles.cache.get(result.role);
        let embed = new Discord.MessageEmbed({
            title: member.displayName,
            description: member.user.username,
            color: apparentRole.color
        })
        .setURL(result.url)
        .setThumbnail(member.user.avatarURL({dynamic: true, size: 4096}))
        .addFields(
            {name: 'Quote', value: result.quote, inline: true},
            {name: 'Alias', value: result.alias, inline: true},
            {name: 'Balance', value: `$${result.balance}`, inline: true},
            {name: 'Rank', value: apparentRole.name, inline: true}
        );
        let faction = result.faction;
        if(!faction){
            embed.addField('Faction', 'None', true);
            embed.setFooter('The Art of Warbot', member.guild.iconURL({dynamic: true, size: 4096}));
            channel.send(embed);
            return;
        }
        db.collection('factions').findOne({_id: faction }, (err, result) => {
            if(err) throw err;
            console.log(result);
            embed.addField('Faction', faction, true);
            embed.setFooter(result.motto, member.guild.iconURL({dynamic: true, size: 4096}));
            channel.send(embed);
        });
    });
}