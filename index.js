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

let exec = require('child_process').exec;

const usablecommandFile = './data/commandInfo.json';
let usable = require(usablecommandFile);

let botPackage =
    {discord: Discord,
     client: client,
     prefix: PREFIX,
     version: VERSION,
     commands: client.commands,
     factionInfo: factionInfo,
     memberInfo: memberInfo,
     exec: exec,
     msg: null,
     args: null};

//this puts the bot into the "Online" state
client.once('ready', () =>{
    console.log('This bot is online!');
});

//this handles commands
client.on('message', msg => {
    botPackage.msg = msg;
    if(msg.content.startsWith(PREFIX)){
        const args = msg.content.substring(PREFIX.length).split(' ');
        botPackage.args = args;
        let cmd = args[0];
        if(usable.commands.includes(cmd))
            client.commands.get(cmd).execute(botPackage);
        else
            msg.reply('You cannot use this command! Please refer to !help for a command list!').then(
                (message) => {
                    botPackage.commands.get('chatCleaner').execute(message, msg, 3000);
                });
        /*
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
            case 'mc':
                let terminal = 'gnome-terminal; '
                let sleep = 'sleep 1; ';
                let run = 'xdotool key Return; ';
                let exit = 'exit';
                function execute(error, stdout, stderr){
                    if(error){
                        console.log(error);
                        return;
                    }
                    console.log(stdout);
                    console.log(stderr);
                }
                if(args[1] === 'start'){
                    let start = 'xdotool type "mcstart"; ';
                    let cmd = terminal+sleep+start+run;
                    exec(cmd, execute);
                    msg.reply('The server is starting!');
                } else if(args[1] === 'stop'){
                    let stop = 'xdotool type "mcstop"; ';
                    let cmd = terminal+sleep+stop+run;
                    exec(cmd, execute);
                    msg.reply('The server is stopping!');
                } else if(args[1] === 'save'){
                    let save = 'xdotool type "mcsave"; ';
                    let cmd = terminal+sleep+save+run;
                    exec(cmd, execute);
                    msg.reply('The server is saving!');
                }
                break;
            case 'bot':
                function execute(error, stdout, stderr){
                    if(error){
                        console.log(error);
                        return;
                    }
                    console.log(stdout);
                    console.log(stderr);
                }
                msg.channel.send()
                if(args[1] === 'off'){
                    exec('gnome-terminal; sleep 1; xdotool getactivewindow set_window --name TEMPMANAGER; xdotool type "stopWarbot; exit;"; xdotool key Return;', execute);
                }
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
        */
    } else
        botPackage.commands.get('greeting').execute(botPackage);
});

client.once('disconnect', () => {
    console.log('Goodbye');
});