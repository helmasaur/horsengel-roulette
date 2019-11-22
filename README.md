[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![](https://img.shields.io/npm/v/horsengel-roulette.svg)](https://www.npmjs.com/package/horsengel-roulette)


# Horsengel roulette

Russian roulette for the Discord.js library where the loser gets kicked. For the moment, it's only one versus one.

## Installation

You have to add this module to your npm project folder.

```bash
$ npm install horsengel-roulette
```

If you are using a command framework such as [Commando.js](https://www.npmjs.com/package/discord.js-commando), you need to create two commands files called `yes.js` and `pan.js`. Those commands are used to play to the game and the command framework might return that those commands don't exist as it wouldn't find any file. If you have this issue, just create an empty class in the style of the command framework that you chose and it will work just fine.

## Example

This is the most basic example of a working Horsengel roulette command. Its aim is to make it understandable.

```js
const Discord = require('discord.js');
const client = new Discord.Client();
const HorsengelRoulette = require('horsengel-roulette');

client.on('message', msg => {
	if (msg.content.startsWith('!hr')) {
		const hr = new HorsengelRoulette(msg, msg.member, msg.mentions.members.first(), '!', 'fr');
		hr.load(6, 1); // Chamber size and number of bullets
		hr.start();
	}
}

client.login('');
```

## How to play

For this example, the command prefix is `!` but feel free to use the one you use with your bot. You can also personalise the command name but I advice you to use the name `horsengel-roulette` with `hr` as an alias. If you don't use aliasses, the second one is prefered.

- To start a game: `!hr <User>`
- To accept a duel: `!yes`
- To shoot : `!pan`

If there is no answer 30 seconds the start of a game, it is cancelled. After the same amount of time, if a player does not shoot, he loses the game but he isn't kicked.

## Translation

For the moment, the only language avaible is English but a more personalised text will soon be released in English and in French. After that, you are free to participate to a translation in any other language as long as it follows the original text.

## Licenses

- Horsengel-roulette source code is published under [MIT License](https://github.com/Helmasaur/ac-keijiban/blob/master/LICENSE).
- Discord.js source code is published under [Apache License 2.0](https://github.com/discordjs/discord.js/blob/master/LICENSE).