import { DatabaseError } from 'errors';

// Type for Prisma errors
export type PrismaError = Error & {
  code?: string;
  meta?: Record<string, unknown>;
};

/**
 * Handles Prisma errors and converts them to DatabaseError
 * @param error - The caught error from Prisma operations
 * @param message - Custom error message
 * @returns DatabaseError with the original error as cause
 */
export function handlePrismaError(error: unknown, message: string): never {
  // Type guard to check if error is an Error instance
  if (error instanceof Error) {
    throw new DatabaseError(message, { cause: error });
  }

  // Fallback for non-Error objects
  const genericError = new Error(String(error));
  throw new DatabaseError(message, { cause: genericError });
}
