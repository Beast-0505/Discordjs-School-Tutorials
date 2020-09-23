Ok So Hello people! I am Beast and I will be teaching you how to make a command handler and a help command which is compatible with it.

So for starters, what is a command handler?

A command handler is a handler that well, of course handles commands

Now let's get to the big boy parts

**CODING**

Now let's get your basic code up: 
```js
const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json"); // Contains the prefix, and token!

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", message => {
  if (message.author.bot) return;
  if (message.content.indexOf(config.prefix) !== 0) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Command Handler code here
});

client.login(config.token);
```

Now, the commands will be in separate files in a directory called commands, then separated into another folder which is it's type, so there will be a directory like: `/commands/general/`
Now back to our `index.js`,
Now you need to require `fs` and `path`

```js
const Discord = require("discord.js");
const fs = require("fs");
const path = require("path");
const client = new Discord.Client();
const config = require("./config.json"); // Contains the prefix, and token!

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", message => {
  if (message.author.bot) return;
  if (message.content.indexOf(config.prefix) !== 0) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Command Handler code here
});

client.login(config.token);
```

Now, to get all of the files and use them, you will need to create 2 collections which will store the files

```js
const Discord = require("discord.js");
const fs = require("fs");
const path = require("path");
const client = new Discord.Client();
const config = require("./config.json"); // Contains the prefix, and token!

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", message => {
  if (message.author.bot) return;
  if (message.content.indexOf(config.prefix) !== 0) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Command Handler code here
});

client.login(config.token);
```

Now to set the files into the collections, you need to add: 

```js
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
  ```
  
  This part will be requiring the files, getting it from the directory, so `/commands/general/`, and setting it to client.commands and client.aliases
And now our code would look like this:
```js
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

  // Command Handler code here
});

client.login(config.token);
```

Now it's time to get the commands from the collections and execute them, but before that, we need to create and setup the help.js file.
Let's have a quick little break to just bring back what we learned
Now once you created the help.js file in `/commands/general/`, you will need to add a few things, 

```js
const Discord = require('discord.js');

module.exports = {
name: "help",
  display: true,
  type: 'general',
  usage: "[Command]",
  description: "Shows command list.",
  aliases: ["h", "commands", "command"],
  execute: async function(client, message, args, prefix) {  
    //This is where our code will go for the help.
  }
}
```

So yeah,
We will be using our knowledge from my previous lesson about handlers
This reaction role menu will look like this: https://beastcoder.is-inside.me/xLaSiFuJ.png (I use this on my bot too so yeah.)

It will work like this:
Someone says PREFIX help
it will send an embed

The person reacts to the reactions and it switches pages
First we need to create embeds for every section, in this one, it will be general and home:

```js
const Discord = require('discord.js');

module.exports = {
name: "help",
  display: true,
  type: 'general',
  usage: "[Command]",
  description: "Shows command list.",
  aliases: ["h", "commands", "command"],
  execute: async function(client, message, args, prefix) {  
        const general = new Discord.MessageEmbed()
    .setColor('RANDOM')
    .setTitle('General Commands')
    .setDescription("Help menu \n Anything in '<>' is required. Anything in '[]' is optional.")
    .setFooter(client.user.username,client.user.avatarURL());
        const vanillaHelp = new Discord.MessageEmbed()
    .setColor('RANDOM')
    .setTitle('📖 Help')
    .setDescription(`You can use \`PREFIX help [command]\` to view specific information about commands. To view categories, Please use reactions.
    The categories are: `)
    .addField(`🏠 Home`,`This page`)
    .addField(`📚 General`, `Bot usage commands with some others`,true)
    .setFooter(client.user.username,client.user.avatarURL()); 
  }
}
```

Now, we have to add each command to every embed so, 

```js
    client.commands.forEach((file, name) => {
      if (file.display === false) {
        return;
      } else {
         if(file.type == "general") {
          general.addField(`PREFIX ${name} ${file.usage}`, file.description)
        } 
      }
    })
```
Now our code would look like: 
```js
const Discord = require('discord.js');

module.exports = {
name: "help",
  display: true,
  type: 'general',
  usage: "[Command]",
  description: "Shows command list.",
  aliases: ["h", "commands", "command"],
  execute: async function(client, message, args, prefix) {  
        const general = new Discord.MessageEmbed()
    .setColor('RANDOM')
    .setTitle('General Commands')
    .setDescription("Help menu \n Anything in '<>' is required. Anything in '[]' is optional.")
    .setFooter(client.user.username,client.user.avatarURL());
        const vanillaHelp = new Discord.MessageEmbed()
    .setColor('RANDOM')
    .setTitle('📖 Help')
    .setDescription(`You can use \`PREFIX help [command]\` to view specific information about commands. To view categories, Please use reactions.
    The categories are: `)
    .addField(`🏠 Home`,`This page`)
    .addField(`📚 General`, `Bot usage commands with some others`,true)
    .setFooter(client.user.username,client.user.avatarURL()); 
    client.commands.forEach((file, name) => {
      if (file.display === false) {
        return;
      } else {
         if(file.type == "general") {
          general.addField(`PREFIX ${name} ${file.usage}`, file.description)
        } 
      }
    })
  }
}
```

Now, we got the basics done for help.
Now we need to check if there is an argument or not
And react etc etc

```js
    if(args.length === 0) {
      let a = await message.channel.send(vanillaHelp)
            await a.react('🏠')
            await a.react('📚')
                const filter = (reaction, user) => user.id !== message.client.user.id && user.id == message.author.id;
    const collector = a.createReactionCollector(filter);
        collector.on("collect", (reaction, user) => {
        reaction.users.remove(user);
        switch (reaction.emoji.name) {
        case "🏠":
        a.edit(vanillaHelp)
          break;
        case "📚":
        a.edit(general)
          default:
          break;
        }
        })
    } else if(args.length === 1) {
      let menu = args[0].toLowerCase();
      commandDescEmbed(menu);
    }

    function commandDescEmbed(commandName) {
      try {
        const command = client.commands.get(commandName) || client.aliases.get(commandName)
        let aliases = "";
        if(command.aliases.length == 0) {
          aliases = "None";
        } else {
          aliases = command.aliases.join(", ");
        }
        let embed = new Discord.MessageEmbed()
      .setColor('RANDOM')
      .setTitle(`PREFIX ${command.name} help`)
      .setDescription(command.description)
      .addField("Usage:", prefix + command.name + " " + command.usage, true)
      .addField("Aliases:", aliases, true)
      .addField("Type:", command.type, true)
      .setFooter(client.user.username,client.user.avatarURL());
      if(command.display) return message.channel.send(embed);
      if(!command.display) errorMsg();
      } catch (error) {
        errorMsg();
      }
    }
    function errorMsg() {
      let embed = new Discord.MessageEmbed()
        .setColor('RANDOM')
        .setDescription("Invalid Command. Please try with a valid one")
        .setFooter(client.user.username,client.user.avatarURL());
        return message.channel.send(embed)
    }
```

You can edit this as your likings but now, your help menu is ready!
You code would look like this: https://hasteb.in/zoyevomu.js
Now back to our index.js
Which should look like 

```js
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

  // Command Handler code here
});

client.login(config.token);
```

Now it's time to get and execute the commands!
Now to get, it's simple,
We've already done it in help if you didn't see

```js
const cmd = client.commands.get(command) || client.aliases.get(command)
```

This will get it but not run it,
And to execute/run it, 

```js
    cmd.execute(client, message, args, guildpre); // guildpre can be anything you want for now, we will be using it in another lesson
```

```js
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

      cmd.execute(client, message, args, guildpre); // guildpre can be anything you want for now, we will be using it in another lesson

});

client.login(config.token);
```
To prevent people from doing PREFIXX blah and getting a billion lines of errors saying thats not a command, we can add a line like 
```js
if (!cmd) return
```

 This will stop it from running if it's not a command

```js
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
```

And that should be it!
Your bot should be responding to commands,
also if you didn't understand the help.js parms, let me explain them a bit
So, 
```js
const Discord = require('discord.js');

//above this line will be our requires
module.exports = {
name: "help", //name of the command
  display: true, //should it display to the public? true or false
  type: 'general', //What type of command is this?
  usage: "[Command]",// what are the arguments and usage
  description: "Shows command list.", //what does this command do
  aliases: ["h", "commands", "command"], //aliases
  execute: async function(client, message, args, prefix) {  
    //code for your command
  }
}
```
