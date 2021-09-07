const { MessageEmbed, Permissions, Collection } = require('discord.js');

// Bioman is the name of the bot which originally directly included the Horsengel roulette. It means "the bot that implements this module".
class HorsengelRoulette {
	constructor(msg, player1, player2, prefix, language) {
		this.bot = msg.guild.me;
		this.channel = msg.channel;
		this.guild = msg.guild;
		this.players = [player1, player2];
		this.prefix = prefix;
		this.revolver = [];
		this.revolverString = '[o][o][o][o][o][o]';
		this.maxTimePlayerAnswer = 30000;
		this.timeBotAnswer = 1500;

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

	load(magazine, bullets) {
		// Initialise the chambers
		for (let chamber = 0; chamber < magazine; chamber++) {
			this.revolver[chamber] = 0;
		}

		// Adds bullets to random chambers
		const addBullets = (revolver) => {
			let chamber;
			
			if (this.players[1].id === this.bot.id) { // B doesn't lose
				chamber = Math.floor(Math.random() * (magazine / 2)) * 2;
			} else {
				chamber = Math.floor(Math.random() * (magazine));
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

	async start() {
		// Stops the game if both players are the same member
		if (this.players[1].id === this.players[0].id) {
			if (this.players[0].id === this.guild.ownerId) {
				return this.channel.send('I can\'t suggest you to kick yourself. I would feel remorse after.');
			} else {
				return this.channel.send('It would be easier to kick yourself. Or would you need some help?');
			}
		}

		this.channel.send(`${this.players[1]}, you have been challenged by ${this.players[0]} to a *Horsengel roulette* duel. Your answer must start by ${this.prefix}yes to accept it. (You have 30 seconds.)`);

		let answerYes = true;

		// A bot is provoked
		if (this.players[1].user.bot) {
			// Bioman is provoked
			if (this.players[1].id === this.bot.id) {
				await this.sleep();
				// Bot refuses to play
				const mood = Math.floor(Math.random() * 10);
				if (mood === 5) {
					if (this.players[0].user.id === this.guild.ownerId) {
						return this.channel.send('I don\'t want to play to a Horsengel roulette. I\'m sorry.');
					} else {
						const description = 'don\'t bother me with a Horsengel roulette';
						return this.kick(this.players[0], description);
					}
				}
				// Bioman accepts to play
				this.channel.send(`${this.prefix}yes`);
			// An other bot is provoked
			} else {
				return this.channel.send(`It's impossible to play against ${this.players[1]}.`)
			}
		// A member is provoked
		} else {
			const filterYes = msg => msg.author.id === this.players[1].id && msg.content === `${this.prefix}yes`;
			answerYes = await this.channel.awaitMessages({ filter: filterYes, max: 1, time: this.maxTimePlayerAnswer, errors: ['time'] })
				.then(() => { return true; })
				.catch(() => { return false; });
		}

		// The provoked member refuses to play
		if (!answerYes) {
			return this.channel.send(`${this.players[1]} preferred to run away.`);
		}

		return this.game();
	}

	async game() {
		let player = this.players[0];
		let answerPan = true;

		for (let chamber = 0; chamber < this.revolver.length; chamber++) {
			// Waiting for the answer
			this.channel.send(`${player}, it's your turn to shoot. You should use the command ${this.prefix}pan to shoot. (You have 30 seconds.)`);
			// Game against the bot
			if (player.id === this.bot.id) {
				await this.sleep();
				this.channel.send(`${this.prefix}pan`);
			// Game against a member
			} else {
				const filterPan = msg => msg.author.id === player.id && msg.content === `${this.prefix}pan`;
				answerPan = await this.channel.awaitMessages({ filter: filterPan, max: 1, time: this.maxTimePlayerAnswer, errors: ['time'] })
					.then(() => { return true; })
					.catch(() => { return false; });
			}

			// Game abandoned by a player
			if (!answerPan) {
				return this.channel.send(`${player} preferred to run away.`);
			}

			// No bullet
			if (this.revolver[chamber] === 0) {
				await this.channel.send({ embeds: [this.embedRound(chamber, `${player} shot but he is still alive.`)] });
			// Game over
			} else {
				// The loser is the guild owner
				if (player.user.id === this.guild.ownerId) {
					return this.channel.send({ embeds: [this.embedRound(chamber, `I don't have the right to kick ${player} but I can say that he lost.`, true)] });
				// Loser is Bioman
				} else if (player.user.id === this.bot.id) {
					return this.channel.send('There must be a mistake…');
				// The loser is a member
				} else {
					await this.channel.send({ embeds: [this.embedRound(chamber, `${player} lost.`, true)] });
					const description = 'lost the Horsengel roulette';
					return this.kick(player, description);
				}
			}
	
			// Player swticher
			if (player.id  === this.players[0].id) {
				player = this.players[1];
			} else {
				player = this.players[0];
			}
		}
	}

	async kick(player, description) {
		if (this.bot.permission.has(Permissions.FLAGS.KICK_MEMBERS)) {
			await this.channel.send(`${this.prefix}kick ${player} ${description}`);
			await this.channel.send({ embed: [this.embedKick(player.user, description)] });
			const invite = await this.channel.createInvite({ maxAge: 0, maxUses: 1 });
			await player.user.send(invite.url);
			return player.kick(player, description);
		}

		return this.channel.send('I don\'t have the persmission to kick.');
	}

	async sleep() {
		return new Promise(res => setTimeout(res, this.timeBotAnswer));
	}

	embedRound(round, description, gameOver = false) {
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

		return new MessageEmbed()
			.setTitle('Horsengel roulette')
			.setColor('BLUE')
			.setDescription(description)
			//.setThumbnail()
			.addField('Player 1', this.players[0].toString(), true)
			.addField('Player 2', this.players[1].toString(), true)
			.addField('\u200b', '​\u200b') // blank field
			.addField('Round', round.toString(), true)
			.addField('Revolver', this.revolverString, true)
			.addField('\u200b', '​\u200b') // blank field
	}

	embedKick(kicked, reason) {
		return new MessageEmbed()
			.setAuthor(this.bot.user.tag, this.bot.user.displayAvatarURL)
			.setColor('ORANGE')
			//.setImage('https://img1.closermag.fr/var/closermag/storage/images/media/images-des-contenus/article/2016-08-04-corbier-l-ancien-complice-de-dorothee-je-deviens-ce-que-les-medias-ont-fait-de-moi-c-est-a-dire-rien/archive-corbier-1989/5405200-2-fre-FR/Archive-Corbier-1989_exact1024x768_l.jpg')
			.setThumbnail(kicked.displayAvatarURL)
			.addField('Action', 'Kick', true)
			.addField('Reason', reason, true)
			.addField('Member', kicked.toString(), true)
			.addField('Member ID', kicked.id, true);
	}
	
}

module.exports = HorsengelRoulette;