Basic message collector
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
The collect event, ```js
collector.on('collect', m => {
});
```

Will be triggered every time a message is sent in those 15 seconds
The end event, ```js
collector.on('end', collected => {
});
```
 Will Be triggered after those 15 seconds. It will output a collection
