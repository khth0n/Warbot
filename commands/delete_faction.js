module.exports = {
    name: 'faction_delete',
    description: 'provides the user with the ability to delete factions',
    syntax: '!faction delete [string]',
    example: '!faction delete Legumes of Legend',
    behavior: 'Deletes a faction as specified by [string]',
    execute({msg, server, cleaner, cfgGet, db}){
        let pkg = {msg, server, cleaner, db};
        let baseRole = cfgGet('main').baseRole;
        let requester = msg.member.id;
        let factionName = msg.content.slice(16);

        switch(factionName){
            case '':
                if(msg.content.toLowerCase() === '!setup server'){
                    deleteAll(pkg, requester, baseRole);
                    return;
                }
                cleaner(msg, 'Please give me the name of faction you would like to delete. This requires being the leader of the faction.');
                return;
            case 'all':
                deleteAll(pkg, requester, baseRole);
                return;
            default:
                db.collection('factions').findOne({_id: factionName}, (err, result) => {
                    if(err) throw err;
                    console.log(result);
                    if(!result){
                        cleaner(msg, 'The given faction does not exist! Please keep in mind that deletion requires case-sensitivity!');
                        return;
                    }
                    if(result.leader != requester){
                        cleaner(msg, 'You must be the leader of a faction to delete it!');
                        return;
                    }
                    db.collection('factions').deleteOne({_id: factionName}, (err, result) => {
                        if(err) throw err;
                        console.log(result.ops);
                    });
                    db.collection('members').updateOne({_id: requester}, {$set: {faction: null, role: baseRole}}, (err, result) => {
                        if(err) throw err;
                        console.log(result.ops);
                    });
                    server.channels.cache.forEach((channel) => {
                        if(channel.name === factionName || (channel.parent != null && channel.parent.name === factionName))
                            channel.delete();
                    });
                    server.roles.cache.forEach((role) => {
                        if(result.leaderRole === role.id || result.memberRole === role.id)
                            role.delete();
                    });
                    server.members.cache.forEach((member) => {
                        member.roles.add(baseRole);
                    });
                    cleaner(msg, `${factionName} was sucessfully deleted!`);
                });
                return;
        }
    }
}

function deleteAll({msg, server, cleaner, db}, requester, baseRole){
    if(requester === server.ownerID){
        server.channels.cache.forEach((channel) => {
            if(channel.name === 'War Forum' || (channel.parent != null && channel.parent.name === 'War Forum'))
                return;
            channel.delete();
        });

        server.roles.cache.forEach((role) => {
            if(role.name === 'Discord Wars' || role.name === '@everyone' || role.id === baseRole)
                return;
            role.delete();
        });

        db.collection('factions').deleteMany({});
        server.roles.fetch(baseRole).then((role) => {
            if(role)
                server.members.cache.forEach((member) => {
                    member.roles.add(role);
                });
        });

        cleaner(msg, 'Successfully implemented server setup!');
        return;
    }
    cleaner(msg, `Please contact the server owner, ${server.owner}, to make server-wide alterations like this!`);
}