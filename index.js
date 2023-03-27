require("dotenv").config();
const { Client, IntentsBitField } = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("ready", () => console.log("Bot is online!"));

const configuration = new Configuration({
  organization: "org-3Q0OIKZrldpIPqsW893nR2yj",
  apiKey: process.env.OpenAI_API,
});

const openai = new OpenAIApi(configuration);

client.on("messageCreate", async (msg) => {
  await msg.channel.sendTyping();
  let Log = [{ role: "system", content: "Chat bot!" }];

  Log.push({
    role: "user",
    content: msg.content,
  });

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: Log,
  });

  msg.reply(response.data.choices[0].message.content);
});

client.login(process.env.Discord_Token);
