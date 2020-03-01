const Discord = require('discord.js');
const {Client, RichEmbed} = require('discord.js');
const client = new Client();

const config = require('./config.json');
client.login(config.token);
const PREFIX = config.prefix;
const VERSION = config.version;

const fs = require('fs');
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

const factionFile = './data/factionInfo.json';
let factionJSON = require(factionFile);
let factionInfo = {JSON : factionJSON, location : factionFile, type : 'faction'};

const memberFile = './data/memberInfo.json';
let memberJSON = require(memberFile);
let memberInfo = {JSON : memberJSON, location : memberFile, type : 'member'};


//this puts the bot into the "Online" state
client.once('ready', () =>{
    console.log('This bot is online!');
});

//this handles commands
client.on('message', msg => {
    if(msg.content.startsWith(PREFIX)){
        const args = msg.content.substring(PREFIX.length).split(' ');
        const server = msg.guild;
        switch(args[0]){
            case 'help':
                msg.reply('WIP');
                msg.delete();
                break;
            case 'test':
                msg.author.createDM().then(
                    (channel) => {
                        let embed = new Discord.RichEmbed(
                        {title : 'Warbot Command List',
                         description : 'You can use the following commands in your server:',
                         color : Number('0x004052')
                        })
                        .addField('!faction create {name}', 'Creates a faction with the given name.')
                        .addField('!faction delete {name}', 'Deletes the faction with the given name.\nRequires leader permissions.')
                        .addField('!faction delete all', 'Deletes all faction-related content in the server.\nRequires server owner privileges.')
                        .addField('!faction add {member}', 'Adds the given member to the faction.\nRequires leader permissions.')
                        .addField('!faction remove {member}', 'Removes the given member to the faction.\nRequires leader permissions.')
                        .addField('!id', 'Returns your personal id.')
                        .addField('!id {member}', 'Returns the given member\'s id.');
                        channel.send(embed);
                    });
                break;
            case 'faction':
                client.commands.get('faction').execute(msg, server, args[1], factionInfo);
                break;
            case 'id':
                client.commands.get('id').execute(msg, Discord);
                break;
            case 'clear':
                client.commands.get('clear').execute(msg, args);
                break;
            case 'setupServer':
                client.commands.get('setupServer').execute(msg, server);
                break;
            case 'author':
                client.commands.get('author').execute(msg, client);
                break;
            case 'info':
                client.commands.get('info').execute(msg, args[1], VERSION);
                break;
        }
    } else
        client.commands.get('greeting').execute(msg, client);
});

client.once('disconnect', () => {
    console.log('Goodbye');
});