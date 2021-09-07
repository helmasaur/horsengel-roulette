const { Client, Intents } = require('discord.js');
const HorsengelRoulette = require('..');

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_INVITES,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.DIRECT_MESSAGES],
	allowedMentions: { parse: ['users', 'roles'], repliedUser: true }
});

client.once('ready', () => {
	console.log('Logged in');
  });

client.on('messageCreate', async msg => {
	if (msg.content.startsWith('?hr')) {
		const hr = new HorsengelRoulette(msg, msg.member, msg.mentions.members.first(), '!', 'fr');
		hr.load(6, 1);
		hr.start();
	}
});

client.login('');