import readline  from 'node:readline';

import { CommandsService } from './services/commands.service';

type Commands = keyof CommandsService;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> ',
});

const commands = new CommandsService();

rl.prompt();

rl.on('line', async (line) => {
  line = line.trim();

  if (line === 'help') {
    commands.help();
    rl.prompt();
    return;
  } else {
    const lineArr = line.split('-');

    const [commandName, ...args] = lineArr;

    if (commands[commandName.trim() as Commands]) {
      await commands[commandName.trim() as Commands](args)
      rl.prompt();
      return;
    } else {
      console.log(`Unknown command, use command 'help' for see list of available commands`);
      rl.prompt();
    }
  }
}).on('close', () => {
  console.log('Bye!');
  process.exit(0);
});