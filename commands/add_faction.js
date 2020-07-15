module.exports = {
    name: 'faction_add',
    description: 'provides the user with the ability to add members to a faction',
    syntax: '!faction add [member]',
    example: '!faction add @Warbot',
    behavior: 'Sends a faction invitation to the specified [member]',
    execute(botPackage){
        let msg = botPackage.msg;
        let arg = botPackage.args[2];
        let server = msg.guild;
        let commands = botPackage.commands;
        let db = botPackage.db;
        if(!arg){
            msg.reply('Please provide me with the member you would like to add to the faction!').then(
                (message) => {
                    commands.get('chatCleaner').execute(msg, message);
                }).catch((error) => { console.log(error.stack); });
            return;
        }
        let member = server.members.get(`${arg.substring(3, arg.length - 1)}`);
        if(!member){
            msg.reply('Invalid member! Please provide me with a valid member to add!').then(
                (message) => {
                    commands.get('chatCleaner').execute(msg, message);
                }).catch((error) => { console.log(error.stack); });
            return;
        }
        let sql = `SELECT name FROM factions WHERE leader = '${msg.member.user.id}'`;
        db.query(sql, (err, result) => {
            if(err) throw err;
            console.log(result);
            if(!result.length){
                msg.reply('You are not the leader of a faction! You cannot add a member without being the faction\'s leader!').then(
                    (message) => {
                        commands.get('chatCleaner').execute(msg, message);
                    }).catch((error) => { console.log(error.stack); });
                return;
            }
            let faction = result[0].name;
            sql = `SELECT userid FROM members WHERE userid = '${member.user.id}' AND faction IS NULL`;
            db.query(sql, (err, result) => {
                if(err) throw err;
                console.log(result);
                if(!result.length){
                    msg.reply('This member is already apart of a faction! You may only invite members who do not belong to a faction!').then(
                        (message) => {
                            commands.get('chatCleaner').execute(msg, message);
                        }).catch((error) => { console.log(error.stack); });
                    return;
                }
                let data = {faction: faction, member: member};
                commands.get('confirmation').execute(msg, data, 'factionInvite', commands, db);
            });
        });
    }
}