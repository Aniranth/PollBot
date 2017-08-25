var Discordie = require("discordie");//change block stuff to consts
var Events = Discordie.Events;
var channel_name = "The Accursed Willow";
var bot_token = "MzMxMjE0MDEwODc4MDAxMTYy.DDsSqA.3B21qap7rC3grFsQOrQng5G8D28"

var client = new Discordie();
var polls = [];
 
client.connect({ token: bot_token });

client.Dispatcher.on(Events.GATEWAY_READY, e => {
  console.log("Connected as: " + client.User.username);
});

client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
	if(e.message.content == "!poll" && e.message.author.username != "PollBot"){
		var user = client.Users.find(u => u.id == e.message.author.id);
		var index_of_poll = -1;
		
		for(var i = 0; i < polls.length; i++){
			if(polls[i].user == e.message.author.username){
				index_of_poll = i;
			}
		}
		if (!user)
			return;
		if(index_of_poll = -1){
			user.openDM().then(dm => dm.sendMessage("Create a poll for the " + channel_name + "  server. You may only have one poll active per user account at a time.\n\nType !question followed by a question to set a question.\nType !option followed by an option to input an option to select.\nType !finalize to submit your question to " + channel_name + ".\nType !review at any time to view what your question will appear like.", true));
			polls.push({user:e.message.author.username, id: e.message.author.id, question:"Undefined", options:[], voted:[], response:[], is_finalize: false});
		}
	}
});

client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
	if(e.message.content.charAt(0) == '!' && e.message.content.slice(0,5) != "!poll" && e.message.content.slice(0,7) != "!option" && e.message.content.slice(0,9) != "!finalize" && e.message.author.username != "PollBot"){
		var user = client.Users.find(u => u.id == e.message.author.id);
		var index_of_poll = -1;
		
		for(var i = 0; i < polls.length; i++){
			if(polls[i].user == e.message.author.username){
				index_of_poll = i;
			}
		}
	
		if(index_of_poll == -1){
			user.openDM().then(dm => dm.sendMessage("You must input the command !poll to create a poll."));	
			return;
		}
		if(e.message.content.indexOf(" ") == -1 && e.message.content == "!question"){
			user.openDM().then(dm => dm.sendMessage("To format your question type the !question followed by a space followed by your question."));
			return;
		} else {
			if((e.message.content).substring(0, (e.message.content).indexOf(" ")) == "!question" && e.message.isPrivate){
				polls[index_of_poll].question = e.message.content.substring((e.message.content).indexOf(" ")+1);
				user.openDM().then(dm => dm.sendMessage("Your question is: " + e.message.content.slice(e.message.content.indexOf(" ")+1)));
			}
		}
	}
});

client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
	if(e.message.content.charAt(0) == '!' && e.message.content.slice(0,5) != "!poll" && e.message.content.slice(0,9) != "!question" && e.message.content.slice(0,9) != "!finalize" && e.message.author.username != "PollBot"){
		var user = client.Users.find(u => u.id == e.message.author.id);
		var index_of_poll = -1;
		
		for(var i = 0; i < polls.length; i++){
			if(polls[i].user == e.message.author.username){
				index_of_poll = i;
			}
		}
	
		if(index_of_poll == -1){
			user.openDM().then(dm => dm.sendMessage("You must input the command !poll to create a poll."));	
			return;
		}
		if(e.message.content.indexOf(" ") == -1 && e.message.content == "!option"){
			user.openDM().then(dm => dm.sendMessage("To format your option type the !option followed by a space followed by your option."));
			return;
		} else {
			if((e.message.content).substring(0, (e.message.content).indexOf(" ")) == "!option" && e.message.isPrivate){
				(polls[index_of_poll].options).push(e.message.content.slice(e.message.content.indexOf(" ")+1));
				user.openDM().then(dm => dm.sendMessage("You have added the option: " + e.message.content.slice(e.message.content.indexOf(" ")+1)));
			}
		}
	}
});

client.Dispatcher.on(Events.MESSAGE_CREATE, e=> {
	var user = client.Users.find(u => u.id == e.message.author.id);
	var index_of_poll = -1;
	if(e.message.content == "!review"){		
		for(var i = 0; i < polls.length; i++){
			if(polls[i].user == e.message.author.username){
				index_of_poll = i;
			}
		}
		if(index_of_poll == -1) {
			return;
		}
		var string = "@everyone " + polls[index_of_poll].user + " has created a poll! They would like to know the answer to: " + polls[index_of_poll].question + " \nThe following are the options to answer\n\n";
		for(var i = 0; polls[index_of_poll].options.length > i; i++) {
			string += ((i + 1) + ". " + polls[index_of_poll].options[i] + "\n");
		}
		string += "\nIn order to select an answer use the command !vote followed by a space with the number cooresponding to your selection. For the owner of the question use the !endPoll command in the direct message channel to get results.";
		user.openDM().then(dm => dm.sendMessage(string));
	}
});

client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
	if(e.message.content == "!finalize" && e.message.content.slice(0,5) != "!poll" && e.message.content.slice(0,9) != "!question" && e.message.content.slice(0,7) != "!option" && e.message.author.username != "PollBot"){
		var user = client.Users.find(u => u.id == e.message.author.id);
		var index_of_poll = -1;
		
		for(var i = 0; i < polls.length; i++){
			if(polls[i].user == e.message.author.username){
				index_of_poll = i;
			}
		}
		if(index_of_poll == -1){
			user.openDM().then(dm => dm.sendMessage("You must input the command !poll to create a poll."));	
			return;
		}
		if(polls[index_of_poll].question == "Undefined"){
			user.openDM().then(dm => dm.sendMessage("Use the !question command to define your question."));	
			return;
		}
		if((polls[index_of_poll].options.length) < 2){
			user.openDM().then(dm => dm.sendMessage("Your poll must have at least two options to select from. Use the !option command to define your option."));
			return;
		}
		var guild = client.Guilds.find(g => g.name == channel_name);
		var string = "@everyone " + polls[index_of_poll].user + " has created a poll! They would like to know the answer to: \n" + polls[index_of_poll].question + " \nThe following are the options to answer\n\n";
		for(var i = 0; polls[index_of_poll].options.length > i; i++) {
			string += ((i + 1) + ". " + polls[index_of_poll].options[i] + "\n");
		}
		string += "\nIn order to select an answer use the command @username !vote followed by a space with the number cooresponding to your selection. For the owner of the question use the !endPoll command in the direct message channel to get results.";
		var text_channel = guild.textChannels.find(t => t.name == "general");
		text_channel.sendMessage(string);
		polls[index_of_poll].is_finalize = true;
	}
});

client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
	if(e.message.content.substr(e.message.content.indexOf("!"), 5) == "!vote" || e.message.mentions.length != 0){
		var user = client.Users.find(u => u.id == e.message.author.id);
		var index_of_poll = -1;
		for(var i = 0; i < polls.length; i++){
			if(e.message.mentions.length == 0){
				user.openDM().then(dm => dm.sendMessage("Your vote must mention the user that initiated the poll please try again."));
			} else {
				if(polls[i].id == e.message.mentions[0].id){
					index_of_poll = i;
				}
			}
		}
		if(index_of_poll == -1){
			user.openDM().then(dm => dm.sendMessage("A poll for this user could not be found. Are you sure you spelled their username correctly?"));
			return;
		}
		if(polls[index_of_poll].is_finalize){
			for(var i = 0; i < polls[index_of_poll].voted.length; i++){
				if(polls[index_of_poll].voted[i] == e.message.author.username){
					user.openDM().then(dm => dm.sendMessage("You have already voted for this poll. Please wait until the results are posted."));
					return;
				}
			}		
			var response = e.message.content.slice(e.message.content.indexOf("!vote"));
			response = response.slice(response.indexOf(" ")+1);
			var int_response = parseInt(response);
			if(isNaN(int_response)){
				user.openDM().then(dm => dm.sendMessage("You must input a number to vote."));
				return;
			}
			if(int_response > polls[index_of_poll].options.length){
				user.openDM().then(dm => dm.sendMessage("This is not a valid voting option"));
				return;
			}
			polls[index_of_poll].response.push(int_response);
			polls[index_of_poll].voted.push(e.message.author.username);
			user.openDM().then(dm => dm.sendMessage("You have successfully voted."));
		} else {
			user.openDM().then(dm => dm.sendMessage("The poll creator has yet to finalize their poll. Please wait before voting."));
		}
	}
});

client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
	if(e.message.content == "!endPoll"){
		var flag = false;
		var user = client.Users.find(u => u.id == e.message.author.id);
		var index_of_poll = -1;
		
		for(var i = 0; i < polls.length; i++){
			if(polls[i].user == e.message.author.username){
				index_of_poll = i;
			}
		}
		if(index_of_poll == -1) {
			return;
		}
		var results = "@everyone " + polls[index_of_poll].question + " \nThe following are the results of the poll: \n\n";
		var percent = 0;
		var count = 0;
		for(var i = 0; i < polls[index_of_poll].options.length; i++){
			for(var j = 0; j < polls[index_of_poll].response.length; j++){
				if(polls[index_of_poll].response[j]-1 == i) {
					count++;
				}
			}
			if((polls[index_of_poll].response.length) != 0 && polls[index_of_poll].is_finalize){
				percent = count/(polls[index_of_poll].response.length);
				results += polls[index_of_poll].options[i] + " had a " + percent.toFixed(2) * 100 + "%\n";
				flag = false;
			} else {
				flag = true;
			}
			percent = 0;
			count = 0;
		}
		if(!polls[index_of_poll].is_finalize) {
			flag = true;
		}
		if(!flag){
			results += "\nThat concludes @" + e.message.author.username + " 's poll.";
			var guild = client.Guilds.find(g => g.name == channel_name);
			guild.generalChannel.sendMessage(results);
			user.openDM().then(dm => dm.sendMessage("This concludes your poll. The poll results have been posted in general chat. You have been removed from the list and may now create another poll."));
		} else {
			user.openDM().then(dm => dm.sendMessage("Noone has voted in your poll you may recreate the poll using the !poll command."));
			var guild = client.Guilds.find(g => g.name == channel_name);
			var text_channel = guild.textChannels.find(t => t.name == "general");
			text_channel.sendMessage("@" + polls[index_of_poll].user + " 's Poll has been cancelled.");
		}
		polls.splice(index_of_poll, 1);
	}
});