const Discord = require('discord.js');
const {Client, RichEmbed} = require('discord.js');
const client = new Client();

var ENV = process.env;

client.login(ENV.WB_TOKEN);

const fs = require('fs');
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.configs = new Discord.Collection();

const configFiles = fs.readdirSync('./config/').filter(file => file.endsWith('.json'));
for(const file of configFiles){
    const config = require(`./config/${file}`);
    client.configs.set(config.cfg, config);
}

const {MongoClient} = require('mongodb');
var uri = `mongodb://${ENV.DB_USER}:${ENV.DB_PASSWORD}@${ENV.DB_HOST}:${ENV.DB_PORT}/?authSource=admin`;

const mongo = new MongoClient(uri, {useUnifiedTopology: true});
mongo.connect((err) => {
    if(err) throw err;
    console.log('Successfully connected to MongoDB!');
});

let dbconnection = mongo.db('warbot');

let exec = require('child_process').exec;

const usablecommandFile = './data/commandInfo.json';
var usable = require(usablecommandFile);

let getCommand = (cmd) => {
    return client.commands.get(cmd);
}

let commands = (cmd, pkg) => {
    let command = getCommand(cmd);
    if(!command)
        return false;
    command.execute(pkg);
    return true;
};

let cleaner = (msg, message)  => {
    client.commands.get('chatCleaner').execute(msg, message);
};

let cfgGet = (name) => {
    return client.configs.get(name);
};

let toJSONstr = (obj) => {
    return JSON.stringify(obj, null, 2);
};

let cfgUpdate = (name, JSONstr) => {
    fs.writeFile(`./config/${name}.json`, JSONstr, (err) => {
        if(err) throw err;
        console.log(`Updated ${name}!`);
    });
    let config = `./config/${name}.json`;
    client.configs.set(config.cfg, config);
};

let maincfg = cfgGet('main');
let prefix = maincfg.prefix;

let botPackage = {
    Discord: Discord,
    client: client,
    prefix: prefix,
    version: maincfg.version,
    baseRole: maincfg.baseRole,
    getCommand: getCommand,
    commands: commands,
    cleaner: cleaner,
    cfgGet: cfgGet,
    toJSONstr: toJSONstr,
    cfgUpdate: cfgUpdate,
    db: dbconnection,
    usable: usable,
    exec: exec,
    msg: null,
    channel: null,
    server: null,
    args: null
};

//this puts the bot into the "Online" state
client.once('ready', () => {
    console.log('This bot is online!');
});

//this handles commands
client.on('message', msg => {
    botPackage.msg = msg;
    botPackage.channel = msg.channel;
    botPackage.server = msg.guild;
    let content = msg.content;
    let args = msg.content.split(' ');
    botPackage.args = args;
    if(content.startsWith(prefix)){
        let cmd = args[0].substring(prefix.length);
        if(usable.commands.includes(cmd) || (usable.administrator.privileges.includes(cmd) && usable.administrator.ids.includes(msg.member.id)))
            commands(cmd, botPackage);
        else
            cleaner(msg, 'You cannot use this command! Please refer to !help for a command list!');
    } else if(msg.member.user.id != client.user.id){
        commands('greeting', botPackage);
        if(args[0] === 'yes'){
            msg.channel.send('yes');
        }
    }
});

client.once('disconnect', () => {
    console.log('Goodbye');
});

client.on('error', console.error);