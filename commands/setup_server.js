module.exports = {
   name: 'setup_server',
   description: 'provides the server setup required for full functionality of the bot',
   syntax: '!setup server',
   example: '!setup server //BEWARE: WILL CLEAR LOTS OF SERVER STUFF',
   behavior: 'Formats server configurations to best suit Warbot',
   execute({msg, server, commands, cfgGet, db, ...rest}){
      let pkg = {msg, server, commands, cfgGet, db, ...rest};
      let baseRole = cfgGet('main').baseRole;

      server.roles.fetch(baseRole).then(async (role) => {
         if(!role){
            await server.roles.create({
               data: {
                  name: 'Recruit',
                  mentionable: true,
                  color: '#7289DA',
                  permissions: 116907073
               }
            }).then((newRole) => {
               server.members.cache.forEach((member) => {
                  member.roles.add(newRole);
               });

               role = newRole;

               updateMainCfg(pkg, newRole.id);
            }).catch((err) => { console.log(err); });
         }

         let members = db.collection('members');
         members.deleteMany({}, (err, result) => {
            if(err) throw err;
            console.log(result.ops);
         });

         let data = [];
         server.members.cache.forEach((member) => {
            let entry = {_id: member.id, url: '', quote: 'Veni, Vidi, Vici', alias: 'None', balance: 0, faction: null, role: role.id};
            data.push(entry);
         });
         members.insertMany(data, (err, result) => {
            if(err) throw err;
            console.log(result.ops);
         });
      });

      commands('delete_faction', pkg);

      if(!server.channels.cache.find(channel => channel.name === 'War Forum')){
         server.channels.create('War Forum', {
            type : 'category',
            topic : 'The general communications collection'}).then((channel) => {
               server.channels.create('Free-Talk-Text-Channel', {
                  type : 'text',
                  topic : 'The general text communication channel',
                  parent : channel
               });
               server.channels.create('Free-Talk-Voice-Channel', {
                  type : 'voice',
                  topic : 'The general voice cummunication channel',
                  parent : channel
               });
          }).catch((err) => { console.log(err); });
      }
   }
}

function updateMainCfg({cfgGet, toJSONstr, cfgUpdate}, newRoleID){
   let maincfg = cfgGet('main');

   maincfg.baseRole = newRoleID;

   cfgUpdate('maincfg', toJSONstr(maincfg));
}