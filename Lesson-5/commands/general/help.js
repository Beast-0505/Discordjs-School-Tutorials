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
  }
}
