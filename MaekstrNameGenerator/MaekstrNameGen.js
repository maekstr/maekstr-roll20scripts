/**
 * 
 */
var maekstr = maekstr || {};
maekstr.nameGen = (function() {
    'use strict';
    
    var version = 0.1,
        commands = {
            namegen: function(args, msg) {
                log("namegen called");
                namegenCommand(args, msg);
            },
            help: function(command, args, msg) {
                if (_.isFunction(commands['help_' + command])) {
                    commands['help_' + command](args, msg);
                }
            }
        };
        
    function namegenCommand(args, msg) {
        if(args[0] === "setup") {
            namegenSetup();
             
        } else {
            
                
            log("handout found? " + namesList[0].id);

            
        }    
    };
    
    function namegenSetup(args, msg) {
        //get the master list of names and categories
        var masterList = findObjs({                            
                                _type: "handout",
                                name: "master_namelist"
            });
            
//TODO: add safety check for existence + maybe more
        
        masterList[0].get("notes", function(notes) {
                //create a separate handout for each category
                /*TODO: automatically organize in subfolders if it ever becomes
                possible*/
                
            });
        
        var handout = createObj("handout",
            {name: "maekstrNameGen_NameList",
            archived: false});
            handout.set('notes', 'notes need to be set after the handout is created.');
    }
    
    function handleInput(msg) {
        var isApi = msg.type === 'api',
            args = msg.content.trim().splitArgs(),
            command, arg0, isHelp;
        
        if (!playerIsGM(msg.playerid)) { return; }
        
        if (isApi) {
            command = args.shift().substring(1).toLowerCase();
            arg0 = args.shift() || '';
            isHelp = arg0.toLowerCase() === 'help' || arg0.toLowerCase() === 'h';
            
            if (!isHelp) {
                if (arg0) {
                    args.unshift(arg0);
                }
                
                if (_.isFunction(commands[command])) {
                    commands[command](args, msg);
                }
            } else if (_.isFunction(commands.help)) {
                commands.help(command, args, msg);
            }
        } else if (_.isFunction(commands['msg_' + msg.type])) {
            commands['msg_' + msg.type](args, msg);
        }
    }
    
    function registerEventHandlers() {
        on('chat:message', handleInput);
    }
    
    return {
        registerEventHandlers: registerEventHandlers
    };
}());

on('ready', function() {
    'use strict';
    
    maekstr.nameGen.registerEventHandlers();
});