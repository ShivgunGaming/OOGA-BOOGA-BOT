require('dotenv').config();
const { Client, IntentsBitField } = require("discord.js");

const client = new Client({
  intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent]
});

client.on('ready', (c) => {
    console.log(`:robot: **${c.user.username}** is awake and ready for action! :rocket:`)
});

// Additional commands
client.on('messageCreate', (message) => {
    if (message.author.bot) {
        return;
    }

    // Command to play "Rock, Paper, Scissors" game
    if (message.content.toLowerCase() === '!rps') {
        const choices = ['rock', 'paper', 'scissors'];
        const botChoice = choices[Math.floor(Math.random() * choices.length)];

        message.channel.send(':fist: :raised_hand: :v: Choose your weapon: **rock**, **paper**, or **scissors**!');

        const filter = m => !m.author.bot && choices.includes(m.content.toLowerCase());
        const collector = message.channel.createMessageCollector({ filter, time: 60000 });

        collector.on('collect', m => {
            const userChoice = m.content.toLowerCase();
            const result = determineWinner(userChoice, botChoice);

            message.channel.send(`You chose **${userChoice}**. I chose **${botChoice}**. ${result} :trophy:`);

            collector.stop();
        });

        collector.on('end', () => {
            message.channel.send('Game over. :x:');
        });
    }

    // Function to determine the winner
    function determineWinner(player, bot) {
        if (player === bot) {
            return "It's a tie!";
        } else if ((player === 'rock' && bot === 'scissors') ||
                   (player === 'paper' && bot === 'rock') ||
                   (player === 'scissors' && bot === 'paper')) {
            return 'You win! :tada:';
        } else {
            return 'I win! :tada:';
        }
    }

    // Command to play "Guess the Number" game
    if (message.content.toLowerCase() === '!guess') {
        const numberToGuess = Math.floor(Math.random() * 100) + 1;
        let attempts = 5;
        message.channel.send('I\'m thinking of a number between **1** and **100**. You have **5** attempts to guess it. :1234:');

        const filter = m => !m.author.bot;
        const collector = message.channel.createMessageCollector({ filter, time: 60000 });

        collector.on('collect', m => {
            const guess = parseInt(m.content);

            if (isNaN(guess)) {
                message.channel.send('Please enter a valid number. :warning:');
                return;
            }

            attempts--;

            if (guess === numberToGuess) {
                message.channel.send(`Congratulations, **${m.author.username}**! You guessed the number **${numberToGuess}** correctly! :tada:`);
                collector.stop();
            } else if (guess < numberToGuess) {
                message.channel.send('Too low! Try again. :arrow_down:');
            } else {
                message.channel.send('Too high! Try again. :arrow_up:');
            }

            if (attempts === 0) {
                message.channel.send(`Sorry, you've run out of attempts. The correct number was **${numberToGuess}**. :x:`);
                collector.stop();
            }
        });

        collector.on('end', () => {
            message.channel.send('Game over. :x:');
        });
    }

    // Command to display bot's ping
    if (message.content.toLowerCase() === '!ping') {
        const ping = client.ws.ping;
        message.channel.send(`Pong! My current ping is **${ping}ms**. :ping_pong:`);
    }

    // Command to roll a dice
    if (message.content.toLowerCase() === '!roll') {
        const diceRoll = Math.floor(Math.random() * 6) + 1;
        message.channel.send(`You rolled a **${diceRoll}**! :game_die:`);
    }

    // Command to display a random cat image
    if (message.content.toLowerCase() === '!cat') {
        message.channel.send({ files: ["https://cataas.com/cat"] });
    }

    // Command to display server information
    if (message.content.toLowerCase() === '!serverinfo') {
        const server = message.guild;
        message.channel.send(`Server name: **${server.name}**\nTotal members: **${server.memberCount}** :bar_chart:`);
    }

    // Command to greet user with their username
    if (message.content.toLowerCase() === 'hello') {
        message.reply(`Hello **${message.author.username}**! :wave:`);
    }

    // Command to send a random joke
    if (message.content.toLowerCase() === '!joke') {
        const jokes = [
            "Why don't scientists trust atoms? Because they make up everything!",
            "Parallel lines have so much in common. It’s a shame they’ll never meet.",
            "I'm reading a book on anti-gravity. It's impossible to put down!",
            "Why did the scarecrow win an award? Because he was outstanding in his field!",
            "Did you hear about the mathematician who’s afraid of negative numbers? He’ll stop at nothing to avoid them!",
        ];
        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
        message.channel.send(`*${randomJoke}* :joy:`);
    }

    // Command to display server's current time
    if (message.content.toLowerCase() === '!time') {
        const currentTime = new Date().toLocaleTimeString();
        message.channel.send(`The current time is: **${currentTime}** :clock1:`);
    }
});

client.login(process.env.TOKEN);
