/*  Manage GDG Freshdesk ticket creation and other FD functions:

	- Responds to the request for a help ticket with a Slack 'form' with buttons
	- Parses the results of the 'form'
	- Creates a new ticket via HTTP POST to the Freshdesk API
*/

var wordfilter = require('wordfilter');

module.exports = function(controller) {

// CREATE a Freshdesk TICKET using data from the Slack response

controller.hears(['^create FD ticket'], 'direct_message,direct_mention', function(bot, message) {

	// create http request client
	var request = require("request");
	
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
	};
	
	// Post request
	request({
		url: "https://yJuV8tF7Lme2KBjV304w:pwd@glenndavisgroup.freshdesk.com/api/v2/tickets",
		method: "POST",
		json: requestData,
	
	}, function (error, response, body) {
		if (!error && response.statusCode === 201) {
			console.log(body);
		}
		else {
			console.log("error: " + error);
			console.log("response.statusCode: " + response.statusCode);
			console.log("response.statusText: " + response.statusText);
		}
	});
});
    
    
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    /* Utility functions */
    function foo(bar) {
        var some_var = 'foo';
        var bar = some_var + 'bar'
        return bar;
    }

};
