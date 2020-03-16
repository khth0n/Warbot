module.exports = {
    name : 'addFaction',
    description : 'provides the user with the ability to add members to a faction',
    execute(botPackage){
        msg = botPackage.msg;
        server = msg.guild;
        fileInfo = botPackage.factionInfo;
        const memberName = msg.cleanContent.slice(13);
        if(!memberName){
            msg.reply('Please provide me with the name of the member you would like to add to the faction!').then(
                (message) => {
                    botPackage.commands.get('chatCleaner').execute(msg, message, 4000);
                });
            return;
        }
        const member = server.members.find(member => memberName.includes(member.displayName));
        if(!member){
            msg.reply('Invalid name! Please provide me with the valid name of a member to add!').then(
                (message) => {
                    botPacakge.commands.get('chatCleaner').execute(msg, message, 4000);
                });
            return;
        }
        let faction = fileInfo.JSON.factions.find(faction => faction.leader === msg.member.displayName);
        if(!faction){
            msg.reply('You are not the leader of a faction! You cannot add a member without being the faction\'s leader!').then(
                (message) => {
                    botPackage.commands.get('chatCleaner').execute(msg, message, 4000);
                });
            return;
        }
        if(faction.members.includes(member.displayName) || member.displayName === faction.leader){
            msg.reply('You cannot invite a person to a faction that they are already apart of!').then(
                (message) => {
                    botPackage.commands.get('chatCleaner').execute(msg, message, 4000);
                });
            return;
        }
        let temp = {member : member, faction : faction, fileInfo : fileInfo};
        server.client.commands.get('confirmation').execute(msg, temp, 'factionInvite');
        msg.delete();
    }
}