module.exports = {
    name : 'confirmation',
    description : 'provides the bot with the ability to receive confirmation for an event',
    execute(msg, data, process){
        switch(process){
            case 'factionInvite':
                let filter = response => {
                    return msg.channel.messages.some(answer => validate(
                        {state : answer.cleanContent.toUpperCase(),
                         validStates : ['YES', 'NO', 'Y', 'N']})
                    );
                }
                let verified = false;
                msg.channel.send(`${data.member} would you like to join ${data.faction.name}? Please respond with a yes/no within the next 30 seconds.`).then(
                    () => {
                        let botMessage = getLatestMessage(msg.guild);
                        msg.channel.awaitMessages(filter, {maxMatches : 1, time : 30000, errors : ['time']}).then(
                            (collected) => {
                                if(validate({state : collected.first().cleanContent.toUpperCase(),
                                             validStates : ['YES', 'Y']})
                                             && msg.member === data.member){
                                    verified = true;
                                    botMessage.delete();
                                    collected.first().delete();
                                }
                        }).catch(
                            (collected) => {
                                msg.channel.send('You have taken too long to respond. A new invite will have to be sent to you if you wish to deliberate again.').then(
                                    (tempMessage) => {
                                        msg.guild.client.commands.get('chatCleaner').execute(botMessage, tempMessage, 4000);
                                    });
                            }).then(
                                () => {
                                    if(verified){
                                        let memberRole = msg.guild.roles.find(role => role.name.includes(data.faction.memberRole));
                                        data.member.removeRoles(data.member.roles).then(
                                            (member) => {
                                                member.addRole(memberRole);
                                            });
                                        let temp = {factionName : data.faction.name, member : data.member.displayName};
                                        msg.guild.client.commands.get('dataStorage').execute(data.fileInfo, temp, 'add');
                                    }
                                });
                }).catch(
                    (error) => {
                        console.log(error.stack);
                });
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