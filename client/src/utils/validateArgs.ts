import chalk from "chalk";

const validateArgs = (args: string[], errorMsg: string): boolean => {
  if (!args || args.length === 0) {
    console.error(chalk.red(errorMsg));
    return false;
  }

  return true;
};

export default validateArgs;