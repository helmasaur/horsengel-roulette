const Discord = require('discord.js');
const client = new Discord.Client();
const HorsengelRoulette = require('..');

client.on('ready', () => {
	console.log('Logged in');
  });

client.on('message', msg => {
	if (msg.content.startsWith('?hr')) {
		const hr = new HorsengelRoulette(msg, msg.member, msg.content.split(' ')[1], '?', 'fr');
		hr.load(6, 1);
		hr.start();
	}
});

client.login('');