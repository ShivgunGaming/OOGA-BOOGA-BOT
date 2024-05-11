// Importing required modules and configuring environment variables
require("dotenv").config();
const { Client, IntentsBitField } = require("discord.js");
const fetch = require("node-fetch");

// Creating a new Discord client instance with specified intents
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

// Command prefix
const commandPrefix = "!";

// Event listener for when the bot is ready
client.on("ready", () => {
  console.log(`:robot: **${client.user.username}** is awake and ready for action! :rocket:`);
});

// Event listener for handling errors
client.on("error", (error) => {
  console.error("An error occurred:", error);
});

// Event listener for when a message is created
client.on("messageCreate", async (message) => {
  // Check if the message author is a bot or doesn't start with the command prefix, if yes, return
  if (message.author.bot || !message.content.startsWith(commandPrefix)) {
    return;
  }

  // Splitting the message content into command and arguments
  const [command, ...args] = message.content.slice(commandPrefix.length).trim().split(/\s+/);

  // Command to get weather information
  if (command === "weather") {
    const location = args.join(" ");

    // Checking if a location is provided
    if (!location) {
      message.channel.send("Please provide a location.");
      return;
    }

    try {
      // Fetching weather data from OpenWeatherMap API
      const apiKey = process.env.OPENWEATHERMAP_API_KEY;
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`;
      const response = await fetch(url);
      const data = await response.json();

      // Checking if the location is valid
      if (data.cod === "404") {
        message.channel.send("Location not found.");
        return;
      }

      // Extracting relevant weather information
      const cityName = data.name;
      const country = data.sys.country;
      const weatherDescription = data.weather[0].description;
      const temperature = data.main.temp;

      // Sending weather information
      message.channel.send(`Weather in ${cityName}, ${country}: ${weatherDescription}, Temperature: ${temperature}°C`);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      message.channel.send("An error occurred while fetching weather data.");
    }
  }

  // Command to display all available commands
  if (command === "help") {
    // Creating a list of available commands
    const helpMessage = `
        **Available Commands:**
        - ${commandPrefix}weather <location>: Get current weather information for a location
        - ${commandPrefix}rps: Play Rock, Paper, Scissors game
        - ${commandPrefix}guess: Play Guess the Number game
        - ${commandPrefix}ping: Display bot's current ping
        - ${commandPrefix}roll: Roll a dice
        - ${commandPrefix}cat: Display a random cat image
        - ${commandPrefix}serverinfo: Display server information
        - ${commandPrefix}hello: Greet the user
        - ${commandPrefix}joke: Display a random joke
        - ${commandPrefix}time: Display server's current time
        - ${commandPrefix}inspire: Get a random inspirational quote`;

    // Sending the list of available commands
    message.channel.send(helpMessage);
  }

  // Command to display a bear GIF
  if (message.content.toLowerCase() === "!bear") {
    // Logging to check if message.channel is defined
    console.log("Message Channel:", message.channel);

    // Sending the bear GIF
    message.channel
      .send({ files: ["https://media3.giphy.com/media/YohvjRwIzXHt6SL6fX/giphy.gif?cid=6c09b952d52cj2glarjhiwpx2zysqyet7lzjcplz5kc9d3z7&ep=v1_gifs_search&rid=giphy.gif&ct=g"] })
      .catch((error) => {
        console.error("Error sending bear GIF:", error);
      });
  }

  // Command to play "Rock, Paper, Scissors" game
  if (message.content.toLowerCase() === "!rps") {
    // Array of choices for the game
    const choices = ["rock", "paper", "scissors"];
    // Randomly selecting bot's choice
    const botChoice = choices[Math.floor(Math.random() * choices.length)];

    // Prompting user to choose their weapon
    message.channel.send(
      ":fist: :raised_hand: :v: Choose your weapon: **rock**, **paper**, or **scissors**!"
    );

    // Filtering messages from users and creating a collector
    const filter = (m) =>
      !m.author.bot && choices.includes(m.content.toLowerCase());
    const collector = message.channel.createMessageCollector({
      filter,
      time: 60000,
    });

    // Event listener for when a valid choice is collected
    collector.on("collect", (m) => {
      // Storing user's choice
      const userChoice = m.content.toLowerCase();
      // Determining the winner of the game
      const result = determineWinner(userChoice, botChoice);

      // Sending the result of the game
      message.channel.send(
        `You chose **${userChoice}**. I chose **${botChoice}**. ${result} :trophy:`
      );

      // Stopping the collector
      collector.stop();
    });

    // Event listener for when the collector ends
    collector.on("end", () => {
      message.channel.send("Game over. :x:");
    });
  }

  // Function to determine the winner of the game
  function determineWinner(player, bot) {
    if (player === bot) {
      return "It's a tie!";
    } else if (
      (player === "rock" && bot === "scissors") ||
      (player === "paper" && bot === "rock") ||
      (player === "scissors" && bot === "paper")
    ) {
      return "You win! :tada:";
    } else {
      return "I win! :tada:";
    }
  }

  // Command to play "Guess the Number" game
  if (message.content.toLowerCase() === "!guess") {
    // Generating a random number for the game
    const numberToGuess = Math.floor(Math.random() * 100) + 1;
    let attempts = 5;
    // Prompting the user to guess a number
    message.channel.send(
      "I'm thinking of a number between **1** and **100**. You have **5** attempts to guess it. :1234:"
    );

    // Creating a collector for user's guesses
    const filter = (m) => !m.author.bot;
    const collector = message.channel.createMessageCollector({
      filter,
      time: 60000,
    });

    // Event listener for when a guess is collected
    collector.on("collect", (m) => {
      // Parsing the guessed number
      const guess = parseInt(m.content);

      // Validating if the guess is a number
      if (isNaN(guess)) {
        message.channel.send("Please enter a valid number. :warning:");
        return;
      }

      // Decreasing attempts and comparing guess with the number
      attempts--;

      if (guess === numberToGuess) {
        // If guess is correct, sending congratulations message
        message.channel.send(
          `Congratulations, **${m.author.username}**! You guessed the number **${numberToGuess}** correctly! :tada:`
        );
        collector.stop();
      } else if (guess < numberToGuess) {
        // If guess is too low, prompting user to try again
        message.channel.send("Too low! Try again. :arrow_down:");
      } else {
        // If guess is too high, prompting user to try again
        message.channel.send("Too high! Try again. :arrow_up:");
      }

      // Checking if attempts are exhausted
      if (attempts === 0) {
        // If attempts are exhausted, revealing the correct number
        message.channel.send(
          `Sorry, you've run out of attempts. The correct number was **${numberToGuess}**. :x:`
        );
        collector.stop();
      }
    });

    // Event listener for when the collector ends
    collector.on("end", () => {
      message.channel.send("Game over. :x:");
    });
  }

  // Command to display bot's ping
  if (message.content.toLowerCase() === "!ping") {
    // Sending the bot's current ping
    const ping = client.ws.ping;
    message.channel.send(`Pong! My current ping is **${ping}ms**. :ping_pong:`);
  }

  // Command to roll a dice
  if (message.content.toLowerCase() === "!roll") {
    // Rolling a dice and sending the result
    const diceRoll = Math.floor(Math.random() * 6) + 1;
    message.channel.send(`You rolled a **${diceRoll}**! :game_die:`);
  }

  // Command to display a random cat image
  if (message.content.toLowerCase() === "!cat") {
    // Sending a random cat image
    message.channel.send({ files: ["https://cataas.com/cat"] });
  }

  // Command to display server information
  if (message.content.toLowerCase() === "!serverinfo") {
    // Retrieving server information and sending it
    const server = message.guild;
    message.channel.send(
      `Server name: **${server.name}**\nTotal members: **${server.memberCount}** :bar_chart:`
    );
  }

  // Command to greet user with their username
  if (message.content.toLowerCase() === "hello") {
    // Greeting the user
    message.reply(`Hello **${message.author.username}**! :wave:`);
  }

  if (message.content.toLowerCase() === "oogabooga") {
    // Greeting the user
    message.reply(`Hello fellow OOGA BOOGA! :wave:`);
  }

  // Command to send a random joke
  if (message.content.toLowerCase() === "!joke") {
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
  if (message.content.toLowerCase() === "!time") {
    // Retrieving and sending the current time
    const currentTime = new Date().toLocaleTimeString();
    message.channel.send(`The current time is: **${currentTime}** :clock1:`);
  }
});

// Logging into Discord using the bot token
client.login(process.env.TOKEN);
