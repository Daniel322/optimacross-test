import readline  from 'node:readline';

import axios from 'axios';

type Commands = 'help' | 'get cars' | 'login' | 'exit';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> ',
});

let sessionCookie: string;

rl.prompt();

const commands: Record<Commands, Function> = {
  'help': () => {
    console.log('Commands:', Object.keys(commands).join(', '));
  },
  'login': async (args: string[]) => {
    try {
      const sendData = args.reduce(
        (acc: Record<string, string>, elem) => {
          const [key, value] = elem.split('=');
  
          acc[key] = value.trim();
  
          return acc;
        },
        {},
      );
      
      const loginUser = await axios.post('http://localhost:3333/api/auth/login', {
        ...sendData,
      }, { withCredentials: true });

      console.log(loginUser.headers['set-cookie'], loginUser.data);

      if (Array.isArray(loginUser.headers['set-cookie'])) {
        sessionCookie = loginUser.headers['set-cookie'][0];
      }
  
      console.log('login success!');
    } catch (error: any) {
      console.log('login failed');
      console.error(JSON.stringify(error?.message ?? error));
    }
  },
  'get cars': async () => {
    try {
      const cars = await axios.get('http://localhost:3333/api/cars', { withCredentials: true, headers: { Cookie: sessionCookie } });

      console.log(cars.data);
    } catch (error: any) {
      console.error(JSON.stringify(error?.message ?? error));
    }

    rl.prompt();
  },
  'exit': () =>  {
    rl.close();
  }
};

rl.on('line', (line) => {
  line = line.trim();

  const lineArr = line.split('-');

  console.log(lineArr);

  if (lineArr.length > 1) {
    const [commandName, ...args] = lineArr;
    console.log(commandName, args);

    const command = commands[commandName.trim() as Commands];

    console.log(command);

    if (command) {
      command(args);
      rl.prompt();
      return;
    }
  }

  const command = commands[line as Commands];
  if (command) command();
  else console.log('Unknown command');
  rl.prompt();
}).on('close', () => {
  console.log('Bye!');
  process.exit(0);
});