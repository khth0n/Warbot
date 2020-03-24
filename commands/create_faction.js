module.exports = {
    name : 'create_faction',
    description : 'provides the user with the ability to create factions',
    execute(botPackage){
        let msg = botPackage.msg;
        let server = msg.guild;
        let commands = botPackage.commands;
        let db = botPackage.db;
        const factionName = msg.content.slice(16);
        if(!factionName){
            msg.reply('Please provide me the name of the faction you want to create when calling this command.').then(
                (message) => {
                    commands.get('chatCleaner').execute(msg, message);
                }).catch((error) => { console.log(error.stack); });
            return;
        } else if(factionName === 'all'){
            msg.reply('Cannot create a faction called \'all\' because it is used in a faction command.').then(
                (message) => {
                    commands.get('chatCleaner').execute(msg, message);
                }).catch((error) => { console.log(error.stack); });
            return;
        }
        let sql = `SELECT name FROM factions WHERE name = '${factionName}' OR leader = '${msg.member.id}'`;
        db.query(sql, (err, result) => {
            if(err) throw err;
            console.log(result);
            if(!result.length){
                let leader = msg.member;
                let recruitRole = server.roles.find(role => role.name === 'Recruit');
                leader.removeRole(recruitRole);
                let factionRoles = {leaderRole: '', memberRole: ''};
                server.createRole(
                    {name : `Leader of the ${factionName}`,
                    mentionable : true,
                    hoist : true,
                    permissions : 116907329}).then(
                        (role) => {
                            leader.addRole(role);
                            factionRoles.leaderRole = role.id;
                        }).catch((error) => { console.log(error.stack); }).then(() => {
                            server.createRole(
                            {name: `Member of the ${factionName}`,
                             mentionable: true,
                             permissions: 116907073}).catch((error) => { console.log(error.stack); }).then(
                                 (role) => {
                                     factionRoles.memberRole = role.id;
                                 }).catch((error) => { console.log(error.stack); }).then(() => {
                                     server.createChannel(factionName,
                                        {type: 'category',
                                         topic: `These are the communication channels for ${factionName}`}).then(
                                             (channel) => {
                                                 server.roles.forEach((role) => {
                                                     if(role.name === factionRoles.leaderRole || role.name === factionRoles.memberRole){
                                                         channel.overwritePermissions(role, 
                                                            {VIEW_CHANNEL: true,
                                                             SEND_MESSAGES: true,
                                                             EMBED_LINKS: true,
                                                             SEND_TTS_MESSAGES: true,
                                                             ADD_REACTIONS: true,
                                                             ATTACH_FILES: true,
                                                             READ_MESSAGE_HISTORY: true,
                                                             MENTION_EVERYONE: true,
                                                             USE_EXTERNAL_EMOJIS: true,
                                                             CONNECT: true,
                                                             SPEAK: true,
                                                             MUTE_MEMBERS: true,
                                                             DEAFEN_MEMBERS: true,
                                                             USE_VAD: true});
                                                         return;
                                                     }
                                                     channel.overwritePermissions(role, 
                                                        {VIEW_CHANNEL: false,
                                                         SEND_MESSAGES: false});
                                                 });
                                                 server.createChannel(`${factionName}-text`, 
                                                    {type: 'text',
                                                     topic: `Text Communications for ${factionName}`,
                                                     parent: channel});
                                                 server.createChannel(`${factionName}-voice`, 
                                                 {type: 'voice',
                                                  topic: `Voice Communications for ${factionName}`,
                                                  parent: channel});
                                             }).catch((error) => { console.log(error.stack); });
                                 }).catch((error) => { console.log(error.stack); }).then(() => {
                                     let leaderUser = leader.user.id;
                                     sql = `INSERT INTO factions (name, leaderRole, leader, memberRole, motto)
                                            VALUES ('${factionName}', '${factionRoles.leaderRole}', '${leaderUser}', '${factionRoles.memberRole}', NULL);
                                            UPDATE members SET roleid = '${leader.highestRole.id}' WHERE userid = '${leaderUser}';
                                            UPDATE members SET faction = '${factionName}' WHERE userid = '${leaderUser}'`;
                                     db.query(sql, (err, result) => {
                                        if(err) throw err;
                                        console.log(result);
                                     });
                                     msg.delete();
                                 }).catch((error) => { console.log(error.stack); });
                        }).catch((error) => { console.log(error.stack); });
                        return;
            }
            if(`'${result[0].name}'` === `'${factionName}'`){
                msg.reply(`${factionName} already exists! Please contact the faction\'s leader for an invite!`).then(
                    (message) => {
                        commands.get('chatCleaner').execute(msg, message);
                    }).catch((error) => { console.log(error); });
                return;
            }
            msg.reply('You cannot be the leader of two factions at the same time! Ask for an alliance or truce instead!').then(
                (message) => {
                    commands.get('chatCleaner').execute(msg, message);
                }).catch((error) => { console.log(error); });
        });
    }
}