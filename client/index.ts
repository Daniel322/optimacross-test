import readline  from 'node:readline';

import axios from 'axios';

type Commands = 'help' | 'get cars' | 'exit';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> ',
});

rl.prompt();

const commands: Record<Commands, () => void> = {
  'help': () => {
    console.log('Commands:', Object.keys(commands).join(', '));
  },
  'get cars': async () => {
    const cars = await axios.get('http://localhost:3333/cars');

    console.log(cars.data);
  },
  'exit': () =>  {
    rl.close();
  }
};

rl.on('line', (line) => {
  line = line.trim();
  const command = commands[line as Commands];
  if (command) command();
  else console.log('Unknown command');
  rl.prompt();
}).on('close', () => {
  console.log('Bye!');
  process.exit(0);
});