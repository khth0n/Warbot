module.exports = {
    name: 'setup_greeting',
    description: 'provides the user with the ability to configure the bot\'s greetings',
    syntax: '!setup greeting (+/-)[triggers/responses/reset/basic] [string | ... ]',
    example: '!setup greeting +triggers hi | yo //Use pipe character for multiple entries',
    behavior: 'Configures the bot\'s greeting functionality',
    execute({msg, args, cleaner, ...rest}){
        let pkg = {msg, args, cleaner, ...rest};
        let arg = args[2];

        switch(arg){
            case undefined:
                cleaner(msg, 'Please define an operation and a list you would like to modify!');
                return;
            case 'reset':
                resetGreetingCfg(pkg);
                return;
            case 'basic':
                basicGreetingCfg(pkg);
                return;
            default:
                let list = arg.slice(1);
                let str = args.slice(3).join(' ');

                if(!(list === 'triggers' || list === 'responses')){
                    cleaner(msg, 'Please define a proper list to modify!');
                    return;
                }

                if(str === ''){
                    cleaner(msg, `Please define a phrase to add to the list of ${list}!`);
                    return;
                }

                let determinant = arg.slice(0, 1);
                if(!(determinant === '+' || determinant === '-')){
                    cleaner(msg, `Please define a proper operation to modify the list of ${list} with!`);
                    return;
                }

                let phraseCollection = str.split(' | ');
                console.log(phraseCollection);

                let data = {
                    isAdding: determinant === '+',
                    element: list,
                    values: []
                };

                for(let phrase of phraseCollection)
                    data.values.push(phrase);

                updateGreetingCfg(pkg, data);
                console.log(pkg.cfgGet('greeting'));
        }
    }
}

function resetGreetingCfg({msg, cleaner, cfgGet, toJSONstr, cfgUpdate}){
    let greetingJSON = cfgGet('greeting');
    greetingJSON.triggers = [];
    greetingJSON.responses = [];
    greetingJSON.longestTrigger = 0;

    cleaner(msg, 'All triggers and responses have been cleared from the greeting config!');

    cfgUpdate('greetingcfg', toJSONstr(greetingJSON));
}

function basicGreetingCfg({msg, cleaner, cfgGet, toJSONstr, cfgUpdate}){
    let greetingJSON = cfgGet('greeting');
    greetingJSON.triggers = ['hi', 'yo', 'hey', 'hello', 'howdy', 'wassup', 'greetings', 'what\'s up', 'salutations'];
    greetingJSON.responses = ['Yo!', 'Whaddup!', ':thumbsup:', 'What\'s good?', 'Welcome back, friend! :heart:'];
    greetingJSON.longestTrigger = 11;

    cleaner(msg, 'Basic triggers and responses have been set to the greeting config!');

    cfgUpdate('greetingcfg', toJSONstr(greetingJSON));
}

function updateGreetingCfg({msg, cleaner, cfgGet, toJSONstr, cfgUpdate}, {isAdding, element, values}){
    let greetingJSON = cfgGet('greeting');
    let {successes, failures} = {successes: [], failures: []};

    if(isAdding){
        for(let value of values){
            let search = getSearchStr(element, value);
            let index = greetingJSON[element].indexOf(search);
            if(index < 0){
                greetingJSON[element].push(search);
                successes.push(value);
            } else
                failures.push(value);
        }
    } else {
        for(let value of values){
            let search = getSearchStr(element, value);
            let index = greetingJSON[element].indexOf(search);
            if(index >= 0){
                greetingJSON[element].splice(index, 1);
                successes.push(value);
            } else
                failures.push(value);
        }
    }

    cleaner(msg, getStatus({isAdding, element, values, successes, failures}));

    if(successes.length > 0){
        greetingJSON[element] = greetingJSON[element].sort((a, b) => {
            return b.length - a.length;
        });
        greetingJSON.longestTrigger = greetingJSON.triggers[0].length;

        cfgUpdate('greetingcfg', toJSONstr(greetingJSON));
    }
}

function getSearchStr(element, value){
    if(element === 'triggers')
        return value.toLowerCase();
    return value;
}

function getStatus({isAdding, element, successes, failures}){
    if(isAdding)
        return `\nSuccessfully added the following to the list of ${element} for bot greetings: ${arrStr(successes)}\n\nThe list of ${element} for bot greetings already included the following values: ${arrStr(failures)}`;
    return `\nSuccessfully removed the following from the list of ${element} for bot greetings: ${arrStr(successes)}\n\nThe list of ${element} for bot greetings did not include the following values: ${arrStr(failures)}`;
}

function arrStr(arr){
    return `[${arr.join(', ')}]`;
}