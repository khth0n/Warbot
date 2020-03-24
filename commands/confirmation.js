module.exports = {
    name : 'confirmation',
    description : 'provides the bot with the ability to receive confirmation for an event',
    execute(msg, data, process, commands, db){
        let channel = msg.channel;
        switch(process){
            case 'factionInvite':
                let filter = (response) => {
                    return channel.messages.some((answer) => answer.member.id === data.member.id && validate(
                        {state : answer.cleanContent.toUpperCase(),
                         validStates : ['YES', 'NO', 'Y', 'N']})
                    );
                }
                let faction = data.faction;
                let member = data.member;
                channel.send(`${member} would you like to join ${faction}? Please respond with a yes/no within the next 30 seconds.`).then(
                    (botMessage) => {
                        if(data.member.user.username === 'Warbot'){
                            setTimeout(() => {
                                channel.send('N');
                                msg.reply('That was a pathetic attempt. You\'d have to be luckiest person alive to have me of all bots join your faction!');
                            }, 10);
                        }
                        channel.awaitMessages(filter, {maxMatches : 1, time : 30000, errors : ['time']}).then(
                            (collected) => {
                                let affirm = ['YES', 'Y'].includes(collected.first().content.toUpperCase());
                                botMessage.delete();
                                collected.first().delete();
                                if(affirm){
                                    let sql = `SELECT memberRole FROM factions WHERE name = '${faction}'`;
                                    db.query(sql, (err, result) => {
                                        if(err) throw err;
                                        console.log(result);
                                        if(!result.length){
                                            msg.reply('The faction was disbanded before the member could join!').then(
                                                (message) => {
                                                    commands.get('chatCleaner').execute(msg, message);
                                                }).catch((error) => { console.log(error.stack); });
                                            return;
                                        }
                                        let role = msg.guild.roles.get(`${result[0].memberRole}`);
                                        member.removeRole(member.highestRole).then((mem) => {
                                            mem.addRole(role);
                                        });
                                        sql = `UPDATE members SET faction = '${faction}', roleid = '${role.id}' WHERE userid = '${member.id}'`;
                                        db.query(sql, (err, result) => {
                                            if(err) throw err;
                                            console.log(result);
                                        });
                                    });
                                    channel.send(`${member} has chosen to join ${faction}! Please welcome them and treat them well!`);
                                } else {
                                    channel.send(`${member} has chosen NOT to join ${faction}! I, for one, agree with the decision.`)
                                }
                            }).catch((collected) => {
                                console.log(collected);
                                channel.send('You have taken too long to respond. A new invite will have to be sent to you if you wish to deliberate again.').then(
                                    (tempMessage) => {
                                        commands.get('chatCleaner').execute(botMessage, tempMessage);
                                }).catch((error) => { console.log(error.stack); });
                            });
                    }).catch((error) => { console.log(error.stack); });
                msg.delete();
                return;
            default:
                break;
        }
    }
}

function validate(object){
    return object.validStates.includes(object.state);
}

function getLatestMessage(server){
    return server.members.find(member => member.displayName === 'Warbot').lastMessage;
}