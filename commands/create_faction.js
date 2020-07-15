module.exports = {
    name: 'faction_create',
    description: 'provides the user with the ability to create factions',
    syntax: '!faction create [string]',
    example: '!faction create Legumes of Legend',
    behavior: 'Creates a faction as specified by [string]',
    execute({msg, server, cleaner, cfgGet, db}){
        let factionName = msg.content.slice(16);

        if(!factionName){
            cleaner(msg, 'Please provide me with the name of the faction you want to create when calling this command!');
            return;
        } else if(factionName === 'all'){
            cleaner(msg, 'Cannot create a faction called "all" because it is used in a faction command, sorry!');
            return;
        }

        let requester = msg.member.id;

        let factions = db.collection('factions');
        factions.findOne({$or: [{_id: factionName}, {leader: requester}]}, {_id: true, leader: true}, (err, result) => {
            if(err) throw err;
            console.log(result);
            if(!result){
                let leader = msg.member;
                let baseRole = cfgGet('main').baseRole;

                server.roles.fetch(baseRole).then((role) => {
                    leader.roles.remove(role);
                });

                let [leaderRole, memberRole] = ['', ''];
                server.roles.create({
                    data: {
                        name: `Leader of the ${factionName}`,
                        mentionable: true,
                        hoist: true,
                        permissions: 116907329
                    }
                }).then((role) => {
                    leader.roles.add(role);
                    leaderRole = role.id;
                }).catch((err) => { console.log(err); }).then(() => {
                    server.roles.create({
                        data: {
                            name: `Member of the ${factionName}`,
                            mentionable: true,
                            permissions: 116907073
                        }
                    }).then((role) => {
                        memberRole = role.id;
                    }).catch((err) => { console.log(err); }).then(() => {
                        server.channels.create(factionName, {
                            type: 'category',
                            topic: `These are the communication channels for ${factionName}`,
                            permissionOverwrites: [
                                {
                                    id: server.roles.everyone,
                                    deny: [
                                        'VIEW_CHANNEL'
                                    ]
                                },
                                {
                                    id: leaderRole,
                                    allow: [
                                        'VIEW_CHANNEL',
                                        'SEND_MESSAGES',
                                        'EMBED_LINKS',
                                        'SEND_TTS_MESSAGES',
                                        'ADD_REACTIONS',
                                        'ATTACH_FILES',
                                        'READ_MESSAGE_HISTORY',
                                        'MENTION_EVERYONE',
                                        'USE_EXTERNAL_EMOJIS',
                                        'CONNECT',
                                        'SPEAK',
                                        'MUTE_MEMBERS',
                                        'DEAFEN_MEMBERS',
                                        'USE_VAD'
                                    ]
                                },
                                {
                                    id: memberRole,
                                    allow: [
                                        'VIEW_CHANNEL',
                                        'SEND_MESSAGES',
                                        'EMBED_LINKS',
                                        'SEND_TTS_MESSAGES',
                                        'ADD_REACTIONS',
                                        'ATTACH_FILES',
                                        'READ_MESSAGE_HISTORY',
                                        'MENTION_EVERYONE',
                                        'USE_EXTERNAL_EMOJIS',
                                        'CONNECT',
                                        'SPEAK',
                                        'MUTE_MEMBERS',
                                        'DEAFEN_MEMBERS',
                                        'USE_VAD'
                                    ]
                                }
                            ]
                        }).then((channel) => {
                            server.channels.create(`${factionName}-text`, {
                                type: 'text',
                                topic: `Text Communications for ${factionName}`,
                                parent: channel
                            });
                            server.channels.create(`${factionName}-voice`, {
                                type: 'voice',
                                topic: `Voice Communications for ${factionName}`,
                                parent: channel
                            });
                        }).catch((err) => { console.log(err); });
                    }).then(() => {
                        factions.insertOne({_id: factionName, leaderRole: leaderRole, leader: requester, memberRole: memberRole, members: [], motto: 'All is fair in Love and Warbot'}, (err, result) => {
                            if(err) throw err;
                            console.log(result.ops);
                        });
                        db.collection('members').updateOne({_id: requester}, {$set: {faction: factionName, role: leaderRole}}, (err, result) => {
                            if(err) throw err;
                            console.log(result.ops);
                        });
                    });
                });
                cleaner(msg, `${factionName} was successfully created!`)
                return;
            }
            if(result.leader === requester){
                cleaner(msg, 'You cannot be the leader of two factions at the same time! Ask for an alliance or truce instead!');
                return;
            }
            cleaner(msg, `${factionName} already exists! Please contact the faction\'s leader for an invite!`);
        });
    }
}