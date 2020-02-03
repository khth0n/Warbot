module.exports = {
    name : 'setupServer',
    description : 'provides the setup required for full functionality of the bot',
    execute(msg, server){
      server.client.commands.get('deleteFaction').execute(msg, server);
      server.defaultRole.setPermissions(0);
      if(!server.roles.find(role => role.name === 'Recruit'))
         server.createRole(
         {name : 'Recruit',
          mentionable : true,
          color : '0x7289DA',
          permissions : 116841537}).then(
             (role) => {
                server.members.forEach(member => {
                   member.addRole(role);
             });
          }).catch((error) => {
             console.log(error);
          });
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
          }).catch((error) => {
             console.log(error);
          });
   }
}