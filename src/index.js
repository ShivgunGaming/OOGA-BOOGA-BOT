require('dotenv').config();
const { Client, IntentsBitField } = require("discord.js");

const client = new Client({
  intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent,]
});

client.on('ready', (c) => {
    console.log(`${c.user.username} is awake and ready for action!`)
})

client.on('messageCreate', (message) => {
    
    if (message.author.bot) {
        return;
    }

    if (message.content === 'hello') {
        message.reply('Hello There!');
    }
})

client.login(process.env.TOKEN)