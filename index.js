const Discord = require('discord.js');

class HorsengelRoulette {
	constructor(msg, player1, player2, prefix, language) {
		this.bot = msg.guild.me;
		this.channel = msg.channel;
		this.guild = msg.guild;
		this.players = [player1, player2];
		this.prefix = prefix;
		this.revolver = [];
		this.revolverString = '[o][o][o][o][o][o]';

		// Language
		const regex = new RegExp('^[a-z]{2}(-[A-Z]{2})?$');

		if (regex.test(language)) { // Language format (xx-YY) verification
			language = language.substring(0, 2);
		}

		try {
			this.strings = require(`./locales/${language}/common.json`);
		} catch (e) {
			this.strings = require('./locales/en/common.json');
		}
	}

	embed(round, description, gameOver = false) {
		round++;
		let index = round * 3 - 2; // Brackets management

		const replaceAt = (str, char, i) => {
			if (i > str.length - 1 || str.charAt(i) === char) {
				return str;
			}
			return str.substr(0, i) + char + str.substr(i + 1);
		};

		// Replaces the character between brackets by 1, 2 or X
		if (round > 0) {
			if (gameOver) {
				this.revolverString = replaceAt(this.revolverString, 'X', index);
			} else {
				let player;
				if ((round & 1) === 0) {
					player = 2;
				} else {
					player = 1;
				}
				this.revolverString = replaceAt(this.revolverString, player, index);
			}
		}

		return new Discord.RichEmbed()
			.setTitle('Horsengel roulette')
			.setColor('BLUE')
			.setDescription(description)
			//.setThumbnail()
			.addField('Player 1', this.players[0], true)
			.addField('Player 2', this.players[1], true)
			.addBlankField(true)
			.addField('Round', round, true)
			.addField('Revolver', this.revolverString, true)
			.addBlankField(true);
	}

	load(magazine, bullets) {
		// Initialise the chambers
		for (let chamber = 0; chamber < magazine; chamber++) {
			this.revolver[chamber] = 0;
		}

		// Adds bullets to random chambers
		const addBullets = (revolver) => {
			let chamber;
			
			if (this.players[1] === this.bot.id) { // Bioman doesn't lose
				chamber = Math.floor(Math.random() * (magazine));
			} else {
				chamber = Math.floor(Math.random() * (magazine / 2)) * 2;
			}

			if (revolver[chamber] === 0) {
				revolver[chamber] = 1;
			} else {
				addBullets(revolver);
			}
			
			return revolver;
		}

		for (let b = 0; b < bullets; b++) {
			this.revolver = addBullets(this.revolver);
		}
		console.log(this.revolver);
	}

	async game() {
		let player = this.players[0];

		for (let chamber = 0; chamber < this.revolver.length; chamber++) {
			// Waiting the answer
			this.channel.send(`*${player}, it's your turn to shoot. You should use the command ?pan to shoot. (You have 30 seconds.)*`);
			try {
				const round = await this.channel.awaitMessages((msg) => {
					if (msg.author.id === this.players[1].id && msg.content === '?pan') {
						return true;
					}
					return false;
				}, {maxMatches: 1, time: 30 * 1000, errors: ['time']});
	
				// Round
				let description;

				if (this.revolver[chamber] === 0) {
					description = `XXX shot but he is still alive.`;
					this.channel.send({embed: this.embed(chamber, description)});
				} else {
					if (player.user.id === this.guild.ownerID) {
						description = `*I don't have the right to kick XXXX but I can say that he lost.*`;
					} else if (player.user.id === this.bot.id) {
						return this.channel.send('There must be a mistake…');
					} else {
						description = 'lost the horsengel roulette'
					}

					this.channel.send({embed: this.embed(chamber, description,true)});
					this.channel.send(`*!kick ${player} ${lostMessage}*`);
					return kick(player, lostMessage);
				}

				// Player swticher
				if (player.id  === this.players[0].id) {
					player = this.players[1];
				} else {
					player = this.players[0];
				}
			} catch (e) {
				console.log(e);
				return this.channel.send(`*Your opponent, XXX preferred to run away.*`);
			}
		}
	}

	async start() {

		// Case when both players are the same member
		if (this.players[1].id === this.players[0].id) {
			if (this.players[0].id === this.guild.ownerID) {
				return this.channel.send('*I can\'t suggest you to kick yourself. I would feel remorse after.*');
			} else {
				return this.channel.send('*It would be easier to kick yourself. Or would you need some help?*');
			}
		}

		this.channel.send(`*${this.players[1]}, you have been challenged by ${this.players[0]} to a *Horsengel roulette* duel. Your answer must start by !yes to accept it. (You have 30 seconds.)*`);

		// Waiting the answer
		try {
			const start = await this.channel.awaitMessages((msg) => {
				if (msg.author.id === this.players[1].id && msg.content === '?yes') {
					return true;
				}
				return false;
			}, {maxMatches: 1, time: 30 * 1000, errors: ['time']});
			this.game();
		} catch(e) {
			console.log(e);
			return this.channel.send(`*Your opponent, ${this.players[1]} preferred to run away.*`);
		}
	}
}

module.exports = HorsengelRoulette;