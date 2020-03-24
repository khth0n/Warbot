const Discord = require('discord.js');
const {Client, RichEmbed} = require('discord.js');
const client = new Client();

var ENV = process.env;

client.login(ENV.WB_TOKEN);
const PREFIX = ENV.WB_PREFIX;
const VERSION = ENV.WB_VERSION;

const fs = require('fs');
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

var mysql = require('mysql');
var dbconnection = mysql.createConnection({
    multipleStatements: true,
    host: ENV.DB_HOST,
    port: ENV.DB_PORT,
    user: ENV.DB_USER,
    password: ENV.DB_PASSWORD,
    database: 'Warbot'
});

dbconnection.connect((err) => {
    if(err) throw err;
    console.log('Connected successfully to database!');
});

let exec = require('child_process').exec;

const usablecommandFile = './data/commandInfo.json';
var usable = require(usablecommandFile);

const commands = client.commands;

let botPackage =
    {discord: Discord,
     client: client,
     prefix: PREFIX,
     version: VERSION,
     commands: commands,
     db: dbconnection,
     usable: usable,
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
    let content = msg.content;
    if(content.startsWith(PREFIX)){
        let args = content.substring(PREFIX.length).split(' ');
        botPackage.args = args;
        let cmd = args[0].toLowerCase();
        if(usable.commands.includes(cmd) || (usable.administrator.privileges.includes(cmd) && usable.administrator.usernames.includes(msg.member.user.username)))
            commands.get(cmd).execute(botPackage);
        else
            msg.reply('You cannot use this command! Please refer to !help for a command list!').then(
                (message) => {
                    commands.get('chatCleaner').execute(message, msg);
                }).catch((error) => { console.log(error.stack); });
    } else {
        commands.get('greeting').execute(botPackage);
        if(content.slice(0, 3) === 'yes' && msg.member.user.username != 'Warbot'){
            msg.channel.send('yes');
        }
    }
});

client.once('disconnect', () => {
    console.log('Goodbye');
});

client.on('error', console.error);