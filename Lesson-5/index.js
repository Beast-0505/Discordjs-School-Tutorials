const Discord = require("discord.js");
const fs = require("fs");
const path = require("path");
const client = new Discord.Client();
const config = require("./config.json"); // Contains the prefix, and token!

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

// Resolve a folder from the `bot` folder.
const resolveFolder = folderName => path.resolve(__dirname, '.', folderName);

const commandsFolder = resolveFolder('commands');
fs.readdirSync(commandsFolder).map(async(dir) => {
    if (dir.endsWith('.txt')) return;
    const commands = fs.readdirSync(path.join(commandsFolder, dir)).map((cmd) => {
      if (!cmd.endsWith('.js')) return;
      let cmd = require(path.join(commandsFolder, dir, cmd));
      client.commands.set(cmd.name, cmd);
      if (cmd.aliases) {
        cmd.aliases.map((c) => client.aliases.set(c, cmd));
      }
    });
    await console.log(`${dir} has been loaded`)
  });

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", message => {
  if (message.author.bot) return;
  if (message.content.indexOf(config.prefix) !== 0) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  const cmd = client.commands.get(command) || client.aliases.get(command);

  if (!cmd) return; 

  cmd.execute(client, message, args, guildpre); // guildpre can be anything you want for now, we will be using it in another lesson
});

client.login(config.token);
