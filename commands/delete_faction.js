module.exports = {
    name : 'delete_faction',
    description : 'provides the user with the ability to delete factions',
    execute(botPackage){
        let msg = botPackage.msg;
        let server = msg.guild;
        let commands = botPackage.commands;
        let db = botPackage.db;
        let requester = msg.member.id;
        const factionName = msg.content.slice(16);
        switch(factionName){
            case '':
                if(msg.content.toLowerCase() === '!setup server'){
                    deleteAll(requester, msg, commands, server, db);
                    return;
                }
                msg.reply('Please give me the name of faction you would like to delete. This requires being the leader of the faction.').then(
                    (message) => {
                        commands.get('chatCleaner').execute(msg, message);
                    }).catch((error) => { console.log(error.stack); });
                return;
            case 'all':
                deleteAll(requester, msg, commands, server, db);
                return;
            default:
                let sql = `SELECT leader FROM factions WHERE name = '${factionName}'`;
                db.query(sql, (err, result) => {
                    if(err) throw err;
                    console.log(result);
                    if(!result.length){
                        msg.reply('The given faction does not exist! Please keep in mind that deletion requires case-sensitivity!').then(
                            (message) => {
                                commands.get('chatCleaner').execute(msg, message);
                            }).catch((error) => { console.log(error.stack); });
                        return;
                    }
                    if(`'${result[0].leader}'` != `'${requester}'`){
                        msg.reply('You must be the leader of a faction to delete it!').then(
                            (message) => {
                                commands.get('chatCleaner').execute(msg, message);
                            }).catch((error) => { console.log(error.stack); });
                        return;
                    }
                    server.channels.forEach((channel) => {
                        if(channel.name === factionName || (channel.parent != null && channel.parent.name === factionName))
                            channel.delete();
                    });
                    let recruitRole = server.roles.find(role => role.name === 'Recruit');
                    server.members.forEach((member) => {
                        if(member.highestRole.name.includes(factionName))
                            member.addRole(recruitRole);
                    });
                    server.roles.forEach((role) => {
                        if(role.name.includes(factionName))
                            role.delete();
                    });
                    msg.delete();
                    sql = `DELETE FROM factions WHERE name = '${factionName}';
                           UPDATE members SET roleid = ${recruitRole.id} WHERE faction = '${factionName}';
                           UPDATE members SET faction = NULL WHERE faction = '${factionName}'`;
                    db.query(sql, (err, result) => {
                        if(err) throw err;
                        console.log(result);
                    });
                });
                return;
        }
    }
}

function deleteAll(requester, msg, commands, server, db){
    if(requester === server.ownerID){
        server.channels.forEach((channel) => {
            if(channel.name === 'War Forum' || (channel.parent != null && channel.parent.name === 'War Forum'))
                return;
            channel.delete();
        });
        server.roles.forEach((role) => {
            if(role.name === 'Discord Wars' || role.name === '@everyone' || role.name === 'Recruit')
                return;
            role.delete();
        });
        let recruitRole = server.roles.find(role => role.name === 'Recruit');
        if(recruitRole != null)
            server.members.forEach((member) => {
                member.addRole(recruitRole);
            });
        let sql = 'DELETE FROM factions'
        db.query(sql, (err, result) => {
            if(err) throw err;
            console.log(result);
        });
        msg.delete();
        return;
    }
    msg.reply(`Please contact the server owner, ${server.owner}, to make server wide alterations like this!`).then(
        (message) => {
            commands.get('chatCleaner').execute(msg, message);
        }).catch((error) => { console.log(error); });
}