**Basic message collector**
A message collector waits for a specific user, a number of messages, a specific time interval, or the message has a word/letter in it.
Let's use the example Discord.js Docs provided us with: 
```js
// `m` is a message object that will be passed through the filter function
const filter = m => m.content.includes('discord');
const collector = message.channel.createMessageCollector(filter, { time: 15000 });

collector.on('collect', m => {
    console.log(`Collected ${m.content}`);
});

collector.on('end', collected => {
    console.log(`Collected ${collected.size} items`);
});
```
This message collector will collect messages sent in 15 seconds
The collect event, 
```js
collector.on('collect', m => {
});
```

Will be triggered every time a message is sent in those 15 seconds
The end event, 
```js
collector.on('end', collected => {
});
```

 Will Be triggered after those 15 seconds. It will output a collection
 
 **How to create a message collector Notes:**
There's another way of a message collector too!
It's called Await Messages

Using `.awaitMessages()` can be easier if you understand promises, and it allows you to have cleaner code overall. It is technically identical to `.createMessageCollector()`, except promisified. The drawback of using this method,  is that you cannot do things before the promise is resolved or rejected, either by an error or completion. However, it should do for most purposes, such as awaiting the correct response in a quiz.
Now let's move to Reaction Collectors
Reaction Collectors are like message collectors but with reactions!
A reaction is the emoji that pops up underneath your message,
The following is an example taken from the documentation, with slightly better variable names for clarification. The filter will check for the :thumbsup: emoji. It will also check that the person who reacted shares the same id as the author of the original message that the collector was assigned to.
```js
const filter = (reaction, user) => {
    return reaction.emoji.name === '👍' && user.id === message.author.id;
};

const collector = message.createReactionCollector(filter, { time: 15000 });

collector.on('collect', (reaction, user) => {
    console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
});

collector.on('end', collected => {
    console.log(`Collected ${collected.size} items`);
});
```

The docs for `.createReactionCollector()` are here: https://discord.js.org/#/docs/main/stable/class/Message?scrollTo=createReactionCollector
**Await reactions**
As before with message collectors, these work almost exactly the same as a reaction collector, except it is promise based.
This uses the same principal as Await Messages
The code below creates a message collector for the emoji, 👍 in a time period of 1 minute, 60 seconds, where the user who reacted is the same as the user who sent the message, and max of 4 reactions
```js
const filter = (reaction, user) => {
    return reaction.emoji.name === '👍' && user.id === message.author.id;
};

message.awaitReactions(filter, { max: 4, time: 60000, errors: ['time'] })
    .then(collected => console.log(collected.size))
    .catch(collected => {
        console.log(`After a minute, only ${collected.size} out of 4 reacted.`);
    });
```
    
Notes
All of the times are in milliseconds so if you put time: 6, it's going to end in 6 milliseconds, 

Documentation:

AwaitMessages: https://discord.js.org/#/docs/main/stable/class/TextChannel?scrollTo=awaitMessages

AwaitReactions: https://discord.js.org/#/docs/main/stable/class/Message?scrollTo=createReactionCollector
This ends our lesson for today. I hope you enjoyed it!
