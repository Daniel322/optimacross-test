import { AxiosError } from 'axios';
import chalk from 'chalk';

const extractErrorMessage = (error: unknown): void => {
  if (error instanceof AxiosError) {
    console.error(chalk.red(error.response?.data ?? error));
  } else {
    console.error(chalk.red(error));
  }
}

export default extractErrorMessage;