// Importing required modules and configuring environment variables
require('dotenv').config();
const { Client, IntentsBitField } = require("discord.js");

// Creating a new Discord client instance with specified intents
const client = new Client({
  intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent]
});

// Event listener for when the bot is ready
client.on('ready', (c) => {
    console.log(`:robot: **${c.user.username}** is awake and ready for action! :rocket:`)
});

// Event listener for when a message is created
client.on('messageCreate', (message) => {
    // Check if the message author is a bot, if yes, return
    if (message.author.bot) {
        return;
    }

    // Command to play "Rock, Paper, Scissors" game
    if (message.content.toLowerCase() === '!rps') {
        // Array of choices for the game
        const choices = ['rock', 'paper', 'scissors'];
        // Randomly selecting bot's choice
        const botChoice = choices[Math.floor(Math.random() * choices.length)];

        // Prompting user to choose their weapon
        message.channel.send(':fist: :raised_hand: :v: Choose your weapon: **rock**, **paper**, or **scissors**!');

        // Filtering messages from users and creating a collector
        const filter = m => !m.author.bot && choices.includes(m.content.toLowerCase());
        const collector = message.channel.createMessageCollector({ filter, time: 60000 });

        // Event listener for when a valid choice is collected
        collector.on('collect', m => {
            // Storing user's choice
            const userChoice = m.content.toLowerCase();
            // Determining the winner of the game
            const result = determineWinner(userChoice, botChoice);

            // Sending the result of the game
            message.channel.send(`You chose **${userChoice}**. I chose **${botChoice}**. ${result} :trophy:`);

            // Stopping the collector
            collector.stop();
        });

        // Event listener for when the collector ends
        collector.on('end', () => {
            message.channel.send('Game over. :x:');
        });
    }

    // Function to determine the winner of the game
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
        // Generating a random number for the game
        const numberToGuess = Math.floor(Math.random() * 100) + 1;
        let attempts = 5;
        // Prompting the user to guess a number
        message.channel.send('I\'m thinking of a number between **1** and **100**. You have **5** attempts to guess it. :1234:');

        // Creating a collector for user's guesses
        const filter = m => !m.author.bot;
        const collector = message.channel.createMessageCollector({ filter, time: 60000 });

        // Event listener for when a guess is collected
        collector.on('collect', m => {
            // Parsing the guessed number
            const guess = parseInt(m.content);

            // Validating if the guess is a number
            if (isNaN(guess)) {
                message.channel.send('Please enter a valid number. :warning:');
                return;
            }

            // Decreasing attempts and comparing guess with the number
            attempts--;

            if (guess === numberToGuess) {
                // If guess is correct, sending congratulations message
                message.channel.send(`Congratulations, **${m.author.username}**! You guessed the number **${numberToGuess}** correctly! :tada:`);
                collector.stop();
            } else if (guess < numberToGuess) {
                // If guess is too low, prompting user to try again
                message.channel.send('Too low! Try again. :arrow_down:');
            } else {
                // If guess is too high, prompting user to try again
                message.channel.send('Too high! Try again. :arrow_up:');
            }

            // Checking if attempts are exhausted
            if (attempts === 0) {
                // If attempts are exhausted, revealing the correct number
                message.channel.send(`Sorry, you've run out of attempts. The correct number was **${numberToGuess}**. :x:`);
                collector.stop();
            }
        });

        // Event listener for when the collector ends
        collector.on('end', () => {
            message.channel.send('Game over. :x:');
        });
    }

    // Command to display bot's ping
    if (message.content.toLowerCase() === '!ping') {
        // Sending the bot's current ping
        const ping = client.ws.ping;
        message.channel.send(`Pong! My current ping is **${ping}ms**. :ping_pong:`);
    }

    // Command to roll a dice
    if (message.content.toLowerCase() === '!roll') {
        // Rolling a dice and sending the result
        const diceRoll = Math.floor(Math.random() * 6) + 1;
        message.channel.send(`You rolled a **${diceRoll}**! :game_die:`);
    }

    // Command to display a random cat image
    if (message.content.toLowerCase() === '!cat') {
        // Sending a random cat image
        message.channel.send({ files: ["https://cataas.com/cat"] });
    }

    // Command to display server information
    if (message.content.toLowerCase() === '!serverinfo') {
        // Retrieving server information and sending it
        const server = message.guild;
        message.channel.send(`Server name: **${server.name}**\nTotal members: **${server.memberCount}** :bar_chart:`);
    }

    // Command to greet user with their username
    if (message.content.toLowerCase() === 'hello') {
        // Greeting the user
        message.reply(`Hello **${message.author.username}**! :wave:`);
    }

    if (message.content.toLowerCase() === 'oogabooga') {
        // Greeting the user
        message.reply(`Hello fellow OOGA BOOGA! :wave:`);
    }

    // Command to send a random joke
    if (message.content.toLowerCase() === '!joke') {
        // Array of jokes and sending a random one
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
        // Retrieving and sending the current time
        const currentTime = new Date().toLocaleTimeString();
        message.channel.send(`The current time is: **${currentTime}** :clock1:`);
    }

});

// Logging into Discord using the bot token
client.login(process.env.TOKEN);
