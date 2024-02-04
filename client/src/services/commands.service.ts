import chalk from 'chalk';

import {
  axiosAdapter,
  extractErrorMessage,
  reduceArgs,
  validateArgs,
} from '../utils';

export class CommandsService {
  private userToken: string | null = null;

  help(): void {
    console.log(`
      ${chalk.green('list of available commands')}:
      - ${chalk.green('signup')} with arguments: -${chalk.green('email')}=value(${chalk.red('required')}), -${chalk.green('password')}=value(${chalk.red('required')})

      - ${chalk.green('login')} with arguments: -${chalk.green('email')}=value(${chalk.red('required')}), -${chalk.green('password')}=value(${chalk.red('required')})

      - ${chalk.green('get cars')} with arguments:
        -${chalk.green('brand')}=value(${chalk.red('required')})
        -${chalk.green('limit')}=value(${chalk.red('required')})
        -${chalk.green('offset')}=value(${chalk.red('required')})
        -${chalk.green('sort')}=name | price | yearOfCreated(optional)
        -${chalk.green('sortType')}=asc | desc(optional)

      - ${chalk.green('create car')} with arguments(${chalk.red('all required')}): -${chalk.green('brand')} -${chalk.green('name')} -${chalk.green('price')} -${chalk.green('yearOfCreated')}

      - ${chalk.green('update car')} with optional arguments like in create car method and also 1 argument: -${chalk.green('id')}=value(${chalk.red('required')})

      - ${chalk.green('delete car')} with arguments: -${chalk.green('id')}=value(${chalk.red('required')})
    `);
  }

  async signup(args: string[]): Promise<void> {
    try {
      const isValid = validateArgs(args, 'set email and password');

      if (!isValid) {
        return;
      }
  
      const sendData = reduceArgs(args);
  
      const { data } = await axiosAdapter.post('/auth/signup', {
        ...sendData,
      });
  
      console.log(chalk.green('user created, now you can login'));
      console.table(data);
    } catch (error: unknown) {
      extractErrorMessage(error);
    }
  }

  async login(args: string[]): Promise<void> {
    try {
      const isValid = validateArgs(args, 'set email and password');

      if (!isValid) {
        return;
      }

      const sendData = reduceArgs(args);
  
      const { data, headers } = await axiosAdapter.post('/auth/login', {
        ...sendData,
      });
  
      this.userToken = headers.token;
  
      console.log(chalk.green(`welcome, ${data.email}`));
    } catch (error: unknown) {
      extractErrorMessage(error);
    }
  }

  async 'get cars'(args: string[]): Promise<void> {
    try {
      const isValid = validateArgs(args, 'set brand please');

      if (!isValid) {
        return;
      }

      const queryString = args.map((elem) => elem.trim()).join('&');

      const { data } = await axiosAdapter.get(
        `/cars/?${queryString}`,
        {
          headers: {
            'Authorization': `Bearer ${this.userToken}`,
          },
        },
      );
  
      console.log(`
        ${chalk.green('Total docs:')} ${data.totalDocs}
        ${chalk.green('Total pages:')} ${data.totalPages}
        ${chalk.green('Next page:')} ${data.hasNextPage ? `Set offset to ${data.offset + data.limit}` : `Last page`}
        ${chalk.green('Prev page:')} ${data.hasPrevPage ? `Set offset to ${data.offset - data.limit}` : `First page`}
      `);
      console.table(data.docs);
    } catch (error: unknown) {
      extractErrorMessage(error);
    }
  }

  async 'create car'(args: string[]): Promise<void> {
    try {
      const isValid = validateArgs(
        args,
        'set required for create car arguments, you can look arguments list in help command',
      );

      if (!isValid) {
        return;
      }
  
      const sendData = reduceArgs(args);
  
      const { data } = await axiosAdapter.post(
        '/cars',
        sendData,
        {
          headers: {
            'Authorization': `Bearer ${this.userToken}`,
          },
        },
      );
      
      console.log('car was created!');
      console.table(data);
    } catch (error: unknown) {
      extractErrorMessage(error);
    }
  }

  async 'update car'(args: string[]): Promise<void> {
    try {
      const isValid = validateArgs(
        args,
        'set required for update car arguments, you can look arguments list in help command',
      );

      if (!isValid) {
        return;
      }

      const { id, ...sendData } = reduceArgs(args);
  
      const { data } = await axiosAdapter.patch(
        `/cars/${id}`,
        sendData,
        {
          headers: {
            'Authorization': `Bearer ${this.userToken}`,
          },
        },
      );

      console.log(chalk.green('car was updated!'));
      console.table(data);
    } catch (error) {
      extractErrorMessage(error);
    }
  }

  async 'delete car'(args: string[]): Promise<void> {
    try {
      const isValid = validateArgs(args, 'set id');

      if (!isValid) {
        return;
      }

      const { id } = reduceArgs(args);

      await axiosAdapter.delete(
        `/cars/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${this.userToken}`,
          },
        },
      );

      console.log(chalk.green(`car, ${id}, was deleted!`));
    } catch (error) {
      extractErrorMessage(error);
    }
  }
}