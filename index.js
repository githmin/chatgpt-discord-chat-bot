// Import dotenv, discordJS and openai
require("dotenv").config();
const { Client, IntentsBitField } = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");

// Discord Config
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});
client.on("ready", () => console.log("Bot is online!"));
client.login(process.env.Discord_Token);

// OpenAi Config
const configuration = new Configuration({
  apiKey: process.env.OpenAI_API,
});
const openai = new OpenAIApi(configuration);

// Handeling new messages
client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;

  // Trigger bot if a message starts with ! so that not every message is responded by the bot
  if (msg.content.startsWith("!")) {
    await msg.channel.sendTyping();
    let ConvoLog = [{ role: "system", content: "Discord Chat Bot" }];

    let prevMsgs = await msg.channel.messages.fetch({ limit: 20 });
    prevMsgs.reverse();
    prevMsgs.forEach((m) => {
      if (m.author.id !== client.user.id && msg.author.bot) return;
      if (m.author.id !== msg.author.id) return;

      ConvoLog.push({
        role: "user",
        content: m.content,
      });
    });

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: ConvoLog,
    });

    msg.reply(response.data.choices[0].message.content);
  }
});
