[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![](https://img.shields.io/npm/v/horsengel-roulette.svg)](https://www.npmjs.com/package/horsengel-roulette)


# Horsengel roulette

Russian roulette for the Discord.js library where the loser gets kicked. For the moment, it's only one versus one. After getting kicked, an invitation link is sent to the loser.

*Note: after getting kicked, the server joined date on a member's profile will be the date of the member rejoining the server.*

## Requirements

The Horsengel roulette works both on version 13 and 14 of discord.js:

- **v14:** you can use the last version of horsengel-roulette (Node.js version 16.9.0 or newer required);
- **v13:** use the version 1.2.0 of horsengel-roulette using this command to install it: `npm install horsengel-roulette@1.2.0` and [this example](https://github.com/helmasaur/horsengel-roulette/tree/release/1.2.0#example) to make it work. If you have an issue, you can [leave a comment here](https://github.com/helmasaur/horsengel-roulette/discussions/69).

The Horsengel roulette is compatible with TypeScript. If you have an issue, you can [leave a comment here](https://github.com/helmasaur/horsengel-roulette/discussions/70).

## Installation

You have to add this module to your npm project folder.

```bash
$ npm install horsengel-roulette
```

If you are using a framework, you might need to create two command files called `yes.js` and `pan.js`. Those commands are used during the game but the framework might return that those don't exist as it wouldn't find any corresponding file. If you have this issue, create a file using the structure of the framework that you chose and it will work just fine. If you have an issue, you can [leave a comment here](https://github.com/helmasaur/horsengel-roulette/discussions/71).

## Example

This is the most basic example of a working Horsengel roulette command on discord.js v14. Its aim is to make it understandable. Don't forget to add the [gateway intents](https://discordjs.guide/popular-topics/intents.html) listed in the example.

```js
const { Client, Events, GatewayIntentBits } = require('discord.js');
const HorsengelRoulette = require('horsengel-roulette');

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
		const hr = new HorsengelRoulette(msg, msg.member, msg.mentions.members.first(), '!', 'en');
		hr.load(6, 1);
		hr.start();
	}
});

client.login('your-bot-token');
```

### The Horsengel roulette instanciation

```js
const hr = new HorsengelRoulette(msg, msg.member, msg.mentions.members.first(), '!', 'en');
```

- The first argument is the message starting the duel.
- The second and third argument are respectively the player 1 (the one provoking the duel) and the player 2 (the one provoked).
- The third argument is the prefix you want to use;
- The last argument is to set the language of the game response (not used yet).

### The loading of the revolver

```js
hr.load(6, 1);
```

- The first argument is the magazine size.
- The second the number of bullets.

## How to play

For this example, the command prefix is `!` but feel free to use the one you use with your bot. You can also personalise the command name but I advice you to use the name `horsengel-roulette` with `hr` as an alias. If you don't use aliasses, the second one is preferred.

Commands:
- to start a duel: `!hr <GuildMember>`
- to accept a duel: `!yes`
- to shoot : `!pan`

If there is no answer before 30 seconds after the start command, the duel is cancelled. After the same amount of time, if a player does not shoot, he loses the game but he isn't kicked.

## Translation

For the moment, the only avaible language is English but a more personalised text will soon be released in English and in French. After that, you are free to participate to the translation in any other language as long as it follows the original text.

## Thanks

Thanks to:

- [Horsengel](https://twitter.com/horsengel) for the inspiration and the kicks he received during the trials;
- [@Lioness100](https://github.com/Lioness100) for making this package compatible with TypeScript projects;
- the [Programming Discussion](https://discord.com/invite/progdisc) Discord server.


## Licenses

- horsengel-roulette source code is published under [MIT License](https://github.com/Helmasaur/ac-keijiban/blob/master/LICENSE).
- [discord.js](https://discord.js.org/) source code is published under [Apache License 2.0](https://github.com/discordjs/discord.js/blob/master/LICENSE).