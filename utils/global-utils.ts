// These utils could be used both on the server and the client.

// Types for the result object with discriminated union
type Success<T> = {
  data: T;
  error: null;
};

type Failure<E> = {
  data: null;
  error: E;
};

type Result<T, E = Error> = Success<T> | Failure<E>;

// TryCatch wrapper function, based on: https://gist.github.com/t3dotgg/a486c4ae66d32bf17c09c73609dacc5b
export async function tryCatch<T, E = Error>(promise: Promise<T>): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as E };
  }
}

export const isLocalhost = process.env.NODE_ENV === "development";

// Only enable PostHog in non-localhost environments and if the keys are provided
// We don't do this in the CI environment to not pollute the data with test data
export const enablePostHog =
  !isLocalhost &&
  typeof process.env.NEXT_PUBLIC_POSTHOG_KEY === "string" &&
  typeof process.env.NEXT_PUBLIC_POSTHOG_HOST === "string";
