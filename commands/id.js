module.exports = {
    name : 'id',
    description : 'provides the user with the ability to id themselves and other users',
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
                server.members.forEach(member => {
                    generateEmbed(channel, member, db, Discord);
                });
                break;
            default:
                arg = arg.substring(3, arg.length - 1);
                let sql = `SELECT userid FROM members WHERE userid = '${arg}'`;
                db.query(sql, (err, result) => {
                    if(err) throw err;
                    console.log(result);
                    if(!result.length){
                        msg.reply('Member does not exist!').then(
                            (message) => {
                                botPackage.commands.get('chatCleaner').execute(msg, message);
                            }).catch((error) => { console.log(error.stack); });
                        return;
                    }
                    generateEmbed(channel, server.members.get(result[0].userid), db, Discord);
                });
                break;
        }
        msg.delete();
    }
}

function generateEmbed(channel, member, db, Discord){
    var lastActivity = member.lastMessage;
    if(!member.lastMessage)
        lastActivity = 'A long time ago';
    else
        lastActivity = lastActivity.createdAt.toLocaleString();
    let sql = `SELECT username, balance, faction FROM members WHERE userid = '${member.id}'`;
    db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        let faction = result[0].faction;
        let embed = new Discord.RichEmbed(
            {title: `${member.displayName} (${result[0].username})`,
             description: '**```ml\nLast online : ' + lastActivity + '```**',
             color: member.highestRole.color})
             .setThumbnail(member.user.avatarURL)
             .addField('Balance', `$${result[0].balance}`, true)
             .addField('Rank', member.highestRole.name, true);
        if(!faction){
            embed.addField('Faction', 'None', true)
                 .setFooter('The Art of Warbot', member.guild.iconURL);
            channel.send(embed);
            return;
        }
        sql = `SELECT motto FROM factions WHERE name = '${faction}'`;
        db.query(sql, (err, result) => {
            if(err) throw err;
            console.log(result);
            if(!result[0].motto){
                embed.addField('Faction', `${faction}`, true)
                     .setFooter('All\'s fair in love and Warbot', member.guild.iconURL);
                channel.send(embed);
                return;
            }
        });
    });
}