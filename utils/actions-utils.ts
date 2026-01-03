// Types for the action result object with discriminated union
type ActionSuccess<T> = {
  data: T;
  error: null;
};

type ActionFailure = {
  data: null;
  error: string;
};

export type ActionResponse<T> = Promise<ActionSuccess<T> | ActionFailure>;

export function formatActionErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred, please try again later";
}
