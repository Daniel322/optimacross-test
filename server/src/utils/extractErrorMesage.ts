const extractErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return 'Try again later';
}

export default extractErrorMessage;