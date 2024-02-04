const reduceArgs = (args: string[]): Record<string, string> => {
  const result = args.reduce(
    (acc: Record<string, string>, elem) => {
      const [key, value] = elem.split('=');

      acc[key] = value.trim();

      return acc;
    },
    {},
  );

  return result;
}

export default reduceArgs;