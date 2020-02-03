const fs = require('fs');

module.exports = {
    name : 'dataStorage',
    description : 'provides the bot with the ability to store information',
    execute(file, data, operation){
        switch(operation){
            case 'add':
                add(file, data);
                break;
            case 'remove':
                remove(file, data);
                break;
        }
        let content = JSON.stringify(file.JSON, null, 2);
        fs.writeFileSync(file.location, content);
    }
}

function add(file, data){
    switch(file.type){
        case 'faction':
            const faction = file.JSON.factions.find(faction => faction.name === data.factionName);
            if(!faction){
                file.JSON.factions.push(
                {'name' : data.factionName,
                 'leaderRole' : data.leadRole,
                 'leader' : data.member,
                 'memberRole' : data.memRole,
                 'members' : []});
            } else
                faction.members.push(data.member);
            return;
        case 'member':
            break;
    }
}

function remove(file, data){
    switch(file.type){
        case 'faction':
            let factions = file.JSON.factions;
            switch(data.factionName){
                case 'all':
                    factions.splice(0);
                    return;
                default:
                    switch(data.member){
                        case undefined:
                            file.JSON.factions = factions.filter((value) => {
                                return value.name != data.factionName;
                            });
                            return;
                        default:
                            file.JSON.factions = factions.members.filter((value) => {
                                return value != data.member;
                            });
                            return;
                    }
            }
        case 'member':
            break;
    }
}