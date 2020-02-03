module.exports = {
    name : 'dataRetrieval',
    description : 'provides the bot with the ability to retrieve information',
    execute(file, data, request){
        const faction = getFaction(file, data);
        switch(request){
            case 'getFaction':
                break;
            case 'getMemRole':
                
                break;
            default:
                break;
        }
    }
}

function getFaction(file, data){

}