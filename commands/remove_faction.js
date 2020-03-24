module.exports = {
    name : 'remove_faction',
    description : 'provides the user with the ability to remove members from a faction',
    execute(botPackage){
        let msg = botPackage.msg;
        let server = msg.guild;
        let arg = botPackage.args[2];
        let commands = botPackage.commands;
        let db = botPackage.db;
        if(!arg){
            msg.reply('Please provide me with the member you would like to remove from the faction!').then(
                (message) => {
                    commands.get('chatCleaner').execute(msg, message);
                }).catch((error) => { console.log(error.stack); });
        }
        let member = server.members.get(`${arg.substring(3, arg.length - 1)}`);
        if(!member){
            msg.reply('Invalid member! Please provide me with a valid member to remove!').then(
                (message) => {
                    commands.get('chatCleaner').execute(msg, message);
                }).catch((error) => { console.log(error.stack); });
        }
        let sql = `SELECT name FROM factions WHERE leader = '${msg.member.user.id}'`;
        db.query(sql, (err, result) => {
            if(err) throw err;
            console.log(result);
            if(!result.length){
                msg.reply('You are not the leader of a faction! You cannot remove a member without being the faction\'s leader!').then((message) => {
                    commands.get('chatCleaner').execute(msg, message);
                }).catch((error) => { console.log(error); });
                return;
            }
            let faction = result[0].name;
            sql = `SELECT userid FROM members WHERE userid = '${member.user.id}' AND faction = '${faction}'`;
            db.query(sql, (err, result) => {
                if(err) throw err;
                console.log(result);
                if(!result.length){
                    msg.reply('This member is not apart of your faction! You may only remove members who are apart of your faction!').then((message) => {
                        commands.get('chatCleaner').execute(msg, message);
                    }).catch((error) => { console.log(error.stack); });
                    return;
                }
                let memberID = result[0].userid;
                let recruit = server.roles.find(role => role.name === 'Recruit');
                member.removeRole(member.highestRole).then((mem) => {
                    mem.addRole(recruit);
                });
                sql = `UPDATE members SET faction = NULL, roleid = '${recruit.id}' WHERE userid = '${memberID}'`
                db.query(sql, (err, result) => {
                    if(err) throw err;
                    console.log(result);
                });
                msg.delete();
            });
        });
    }
}