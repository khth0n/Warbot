module.exports = {
    name: 'help',
    description: 'provides the user with the ability to see the available bot commands',
    usage: '!help [command]',
    associated: [
        'update',
        'reset'
    ],
    execute({msg, args, getCommand, cleaner, cfgGet, toJSONstr, cfgUpdate, ...rest}){
        let arg = args[1];

        switch(arg){
            case 'update':
                let cmdcfg = cfgGet('cmd');
                
                cmdcfg.commands.sort();

                let stemsData = [], branchesData = [];
                for(cmd of cmdcfg.commands){
                    let {usage = undefined, associated = undefined, branches = undefined} = getCommand(cmd);
                    if(branches){
                        let syntaxArr = [], exampleArr = [], behaviorArr = [];
                        for(branch of branches){
                            let {syntax = undefined, example = undefined, behavior = undefined} = getCommand(`${cmd}_${branch}`);
                            syntaxArr.push(syntax);
                            exampleArr.push(example);
                            behaviorArr.push(behavior);
                        }
                        let branchobj = {cmd, syntaxArr, exampleArr, behaviorArr};
                        branchesData.push(branchobj);
                    }
                    let obj = {cmd, usage, associated, branches};
                    stemsData.push(obj);
                }

                setHelpCfg({cfgGet, toJSONstr, cfgUpdate}, {stemsData, branchesData});
                cfgUpdate('cmdcfg', toJSONstr(cmdcfg));

                cleaner(msg, 'Successfully updated the help config!');
                return;
            case 'reset':
                setHelpCfg({cfgGet, toJSONstr, cfgUpdate}, []);
                cleaner(msg, 'Successfully reset the help config!');
                return;
            default:
                generateHelpEmbed({cfgGet, ...rest}, arg);
                msg.delete();
        }
    }
}

function setHelpCfg({cfgGet, toJSONstr, cfgUpdate}, {stemsData: stems, branchesData: branches}){
    let helpcfg = cfgGet('help');

    helpcfg.stems = stems;
    helpcfg.branches = branches;

    cfgUpdate('helpcfg', toJSONstr(helpcfg));
}

function generateHelpEmbed({cfgGet, channel, server, Discord}, arg){
    let helpcfg = cfgGet('help');

    let embed = new Discord.MessageEmbed({
        color: '#ff0000'
    });

    switch(arg){
        case undefined:
            let entries = helpcfg.stems;

            embed.setTitle('__**Main Help Menu**__');
            embed.setDescription('**Contains all primary command stems!**');
            for({cmd, usage = '', associated = [''], branches = ['']} of entries)
                embed.addField(`***${cmd}***`, `**${usage}\n[${associated.join(', ')}]**\n*${branches[0] === '' ? `No branches for !${cmd}` : `See also: !help ${cmd}`}*`, false);
            break;
        default:
            let branchEntries = helpcfg.branches.find(branch => branch.cmd === arg);
            if(!branchEntries)
                return;
            
            embed.setTitle(`__**!${arg} Help Menu**__`);
            embed.setDescription(`**Contains all command branches for !${arg}**`);

            let {syntaxArr, exampleArr, behaviorArr} = branchEntries;
            for(let i = 0; i < syntaxArr.length; i++){
                let temp = {
                    syntax: syntaxArr[i],
                    example: exampleArr[i],
                    behavior: behaviorArr[i]
                }
                let {syntax, example, behavior} = temp;
                embed.addField(`***${syntax}***`, `**Ex.\n${example}**\n*${behavior}*`);
            }
    }
    embed.setFooter('Powered by Node.js, amateur networking, and insomnia', server.iconURL({dynamic: true, size: 4096}));

    channel.send(embed);
}