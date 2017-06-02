/*

WHAT IS THIS?

This module demonstrates simple uses of Botkit's `hears` handler functions.

In these examples, Botkit is configured to listen for certain phrases, and then
respond immediately with a single line response.

*/

var wordfilter = require('wordfilter');

module.exports = function(controller) {

    /* Collect some very simple runtime stats for use in the uptime/debug command */
    var stats = {
        triggers: 0,
        convos: 0,
    }

    controller.on('heard_trigger', function() {
        stats.triggers++;
    });

    controller.on('conversationStarted', function() {
        stats.convos++;
    });


    controller.hears(['^hi there','^how are you'], 'direct_message,direct_mention', function(bot, message) {

            bot.reply(message, 'Why hello <@' + message.user + '>');
    });

    
    controller.hears(['^create FD ticket'], 'direct_message,direct_mention', function(bot, message) {

		// create http request client
		var request = require("request")
		
		// JSON to be passed to Freshdesk
		var requestData = {
			 "description": "This is the longer ticket description...", 
			 "subject": "TESTING API ticket creation...", 
			 "email": "jridpath@gdg.agency", 
			 "priority": 4, 
			 "status": 2, 
			 "type": "FileMaker", 
			 "responder_id" : 6000203974, 
			 "custom_fields" : { "urgent" : true, "gdg_source" : "Slack" } 
		}
		
		// Post request
		request({
			url: "yJuV8tF7Lme2KBjV304w:pwd@https://glenndavisgroup.freshdesk.com/api/v2/tickets",
			method: "POST",
			json: requestData,
		
		}, function (error, response, body) {
			if (!error && response.statusCode === 200) {
				console.log(body)
			}
			else {
		
				console.log("error: " + error)
				console.log("response.statusCode: " + response.statusCode)
				console.log("response.statusText: " + response.statusText)
			}
		})
    });
    
    
    controller.hears(['^uptime','^debug'], 'direct_message,direct_mention', function(bot, message) {

        bot.createConversation(message, function(err, convo) {
            if (!err) {
                convo.setVar('uptime', formatUptime(process.uptime()));
                convo.setVar('convos', stats.convos);
                convo.setVar('triggers', stats.triggers);

                convo.say('My main process has been online for {{vars.uptime}}. Since booting, I have heard {{vars.triggers}} triggers, and conducted {{vars.convos}} conversations.');
                convo.activate();
            }
        });

    });

    controller.hears(['^say (.*)','^say'], 'direct_message,direct_mention', function(bot, message) {
        if (message.match[1]) {

            if (!wordfilter.blacklisted(message.match[1])) {
                bot.reply(message, message.match[1]);
            } else {
                bot.reply(message, '_sigh_');
            }
        } else {
            bot.reply(message, 'I will repeat whatever you say.')
        }
    });


    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    /* Utility function to format uptime */
    function formatUptime(uptime) {
        var unit = 'second';
        if (uptime > 60) {
            uptime = uptime / 60;
            unit = 'minute';
        }
        if (uptime > 60) {
            uptime = uptime / 60;
            unit = 'hour';
        }
        if (uptime != 1) {
            unit = unit + 's';
        }

        uptime = parseInt(uptime) + ' ' + unit;
        return uptime;
    }

};
