import { NextResponse } from "next/server";
import { ZodError } from "zod";

// Standard API error response structure
export type ApiErrorResponse = {
  error: {
    message: string;
    code?: string;
    details?: Record<string, unknown>;
  };
  timestamp: string;
};

// Standard API success response structure
export type ApiSuccessResponse<T> = {
  data: T;
  timestamp: string;
};

// HTTP status codes for common scenarios
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * Base error response creator - use this for custom error scenarios
 * @param message - Human-readable error message
 * @param status - HTTP status code (defaults to 500)
 * @param code - Machine-readable error code for client handling
 * @param details - Additional error context (avoid sensitive data)
 */
export function createErrorResponse(
  message: string,
  status: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  code?: string,
  details?: Record<string, unknown>
): NextResponse<ApiErrorResponse> {
  const errorResponse: ApiErrorResponse = {
    error: {
      message,
      code,
      details,
    },
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(errorResponse, { status });
}

/**
 * Success response creator - use this for successful operations
 * @param data - The response data
 * @param status - HTTP status code (defaults to 200)
 */
export function createSuccessResponse<T>(
  data: T,
  status: number = HTTP_STATUS.OK
): NextResponse<ApiSuccessResponse<T>> {
  const successResponse: ApiSuccessResponse<T> = {
    data,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(successResponse, { status });
}

/**
 * Use this when client sends invalid data (validation fails)
 * Examples: missing required fields, wrong data types, invalid formats
 * Status: 422 (Unprocessable Entity)
 */
export function createValidationErrorResponse(
  error: ZodError | string
): NextResponse<ApiErrorResponse> {
  const message = typeof error === "string" ? error : error.errors.map(e => e.message).join(", ");
  return createErrorResponse(
    message,
    HTTP_STATUS.UNPROCESSABLE_ENTITY,
    "VALIDATION_ERROR",
    typeof error === "string" ? undefined : { validationErrors: error.errors }
  );
}

/**
 * Use this when user is not authenticated (no valid token/session)
 * Examples: missing auth header, expired token, invalid credentials
 * Status: 401 (Unauthorized)
 */
export function createAuthenticationErrorResponse(
  message: string = "Authentication required"
): NextResponse<ApiErrorResponse> {
  return createErrorResponse(message, HTTP_STATUS.UNAUTHORIZED, "AUTHENTICATION_ERROR");
}

/**
 * Use this for unexpected server errors (database failures, external service errors)
 * Examples: database connection issues, third-party API failures, unhandled exceptions
 * Status: 500 (Internal Server Error)
 * Note: Don't expose sensitive error details in production
 */
export function createInternalErrorResponse(error: unknown): NextResponse<ApiErrorResponse> {
  const message = error instanceof Error ? error.message : "An internal server error occurred";
  const details = error instanceof Error ? { stack: error.stack } : undefined;

  return createErrorResponse(message, HTTP_STATUS.INTERNAL_SERVER_ERROR, "INTERNAL_ERROR", details);
}
