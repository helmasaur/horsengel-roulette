[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![](https://img.shields.io/npm/v/horsengel-roulette.svg)](https://www.npmjs.com/package/horsengel-roulette)


# Horsengel roulette

Russian roulette for the Discord.js library where the loser gets kicked. For the moment, it's only one versus one.

## Requirements

- If you are using discord.js version 12, make sure to use horsengel-roulette 1.1.0 ;
- If you are using discord.js version 12, you can use the last version of horsengel-roulette (Node.js version 16.6.0 required).

## Installation

You have to add this module to your npm project folder.

```bash
$ npm install horsengel-roulette
```

If you are using a command framework such as [Commando.js](https://www.npmjs.com/package/discord.js-commando), you need to create two commands files called `yes.js` and `pan.js`. Those commands are used to play to the game and the command framework might return that those commands don't exist as it wouldn't find any file. If you have this issue, just create an empty class in the style of the command framework that you chose and it will work just fine.

## Example

This is the most basic example of a working Horsengel roulette command on discord.js version 13. Its aim is to make it understandable. Don't forget to add the [intents](https://discordjs.guide/popular-topics/intents.html) listed in the example.

```js
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
		const hr = new HorsengelRoulette(msg, msg.member, msg.mentions.members.first(), '?', 'fr');
		hr.load(6, 1);
		hr.start();
	}
});

client.login('');
```

## How to play

For this example, the command prefix is `!` but feel free to use the one you use with your bot. You can also personalise the command name but I advice you to use the name `horsengel-roulette` with `hr` as an alias. If you don't use aliasses, the second one is preferred.

- To start a duel: `!hr <User>`
- To accept a duel: `!yes`
- To shoot : `!pan`

If there is no answer before 30 seconds after the start command, the duel is cancelled. After the same amount of time, if a player does not shoot, he loses the game but he isn not kicked.

## Translation

For the moment, the only language avaible is English but a more personalised text will soon be released in English and in French. After that, you are free to participate to a translation in any other language as long as it follows the original text.

## Thanks

Thanks to:

- [Horsengel](https://twitter.com/horsengel) for the inspiration and the kicks he received during the trials;
- @Lioness100 for making this package compatible with TypeScript projects.


## Licenses

- Horsengel-roulette source code is published under [MIT License](https://github.com/Helmasaur/ac-keijiban/blob/master/LICENSE).
- Discord.js source code is published under [Apache License 2.0](https://github.com/discordjs/discord.js/blob/master/LICENSE).