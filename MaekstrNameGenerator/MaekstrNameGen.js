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
    
    /**
     * Splits the master_namelist handout notes into a separate handout for
     * each section of names.
     * @param {type} args The arguments of the command.
     * @param {type} msg The message of the command
     */
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
            var endsAt;
            var index = 0;
            var categories;
            var section;
            
            //Get start index of first section after CATEGORIES.
            endsAt = notes.indexOf("!");
            //Save categories.
            section = notes.slice(0, endsAt);
            log(notes);
            log(section);
            //Create handout for categories
            createHandoutSafe("CATEGORIES", section);
            
            //Extract the categories from the string containing the categories
            //section
            categories = extractCategories(section);
            
            while(true) {
                //Delete previous section and the "!" from this section
                notes = notes.slice((endsAt+1), notes.length);
                //Find start of next section
                endsAt = notes.indexOf("!");
                //If no more "!" then finish this section and we're done
                if(endsAt === -1) {
                    createHandoutSafe(categories[index], notes);
                    break;
                }
                //Copy this section and paste it into a handout.
                section = notes.slice(0, endsAt);
                createHandoutSafe(categories[index], section);
                //Advance to next category
                index = index+1;
            }
        });
    }
    
    /**
     * Extracts the semicolon separated categories from the section into an 
     * array which is then returned.
     * @param {type} categoriesSection The section of semicolon separated
     * categories.
     * @returns An array containing the categories as strings.
     */
    function extractCategories(categoriesSection) {
        var categories;
        
        while(true) {
            
        }
        
        return categories;
    }
    
    /**
     * Creates a handout safely. That is, if a handout with the specified name
     * already exists then the existing handout will be overwritten.
     * @param String name The name of the new handout.
     * @param String newNotes The notes of the new handout.
     * @returns The created or modified handout.
     */
    function createHandoutSafe(name, newNotes) {
        var handout = findObjs({                            
                                _type: "handout",
                                name: name
        });
        log(name);
        log(handout);
        if(handout == null || handout[0] == null) {
            var newHandout = createObj("handout",
            {name: name,
            archived: false});
            newHandout.set('notes', newNotes);
            return newHandout;
        } else {
            handout[0].get("notes", function(notes) {
                notes = newNotes;
            });
            return handout[0];
        };
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