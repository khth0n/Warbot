module.exports = {
   name : 'setup_server',
   description : 'provides the server setup required for full functionality of the bot',
   execute(botPackage){
      let msg = botPackage.msg;
      let server = msg.guild;
      let commands = botPackage.commands;
      let db = botPackage.db;
      commands.get('delete_faction').execute(botPackage);
      server.defaultRole.setPermissions(0);
      if(!server.roles.find(role => role.name === 'Recruit'))
         server.createRole(
         {name : 'Recruit',
          mentionable : true,
          color : '0x7289DA',
          permissions : 116907073}).then(
             (role) => {
                server.members.forEach(member => {
                   member.addRole(role);
                });
             }).catch((error) => { console.log(error); });
      if(!server.channels.find(channel => channel.name === 'War Forum'))
         server.createChannel('War Forum',
         {type : 'category',
          topic : 'The general communications collection'}).then(
          (channel) => {
             server.createChannel('Free-Talk-Text-Channel',
             {type : 'text',
              topic : 'The general text communication channel',
              parent : channel});
             server.createChannel('Free-Talk-Voice-Channel',
             {type : 'voice',
              topic : 'The general voice cummunication channel',
              parent : channel});
          }).catch((error) => { console.log(error); });
      let sql = `DELETE FROM members`;
      db.query(sql, (err, result) => {
         if(err) throw err;
         console.log(result);
      });
      server.members.forEach((member) => {
         let user = member.user;
         let role = member.highestRole;
         sql = `INSERT INTO members (userid, username, roleid, balance, faction)
                VALUES ('${user.id}', '${user.username}', '${role.id}', 0, NULL)`;
         db.query(sql, (err, result) => {
            if(err) throw err;
            console.log(result);
         });
      });
   }
}