const { Client, Events, GatewayIntentBits } = require('discord.js');
const HorsengelRoulette = require('..');

const client = new Client({
	intents: [
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildInvites,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent
	]
});

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.MessageCreate, async msg => {
	if (msg.content.startsWith('!hr')) {
		const hr = new HorsengelRoulette(msg, msg.member, msg.mentions.members.first(), '!', 'fr');
		hr.load(6, 1);
		hr.start();
	}
});

client.login('');