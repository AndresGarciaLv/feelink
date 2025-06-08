import {FetchBaseQueryError} from '@reduxjs/toolkit/query';

export function getErrorMessage(error: unknown): string {
    if (isFetchBaseQueryError(error)) {
        if (error.data && typeof error.data === "object" && "title" in error.data) {
            if ("errors" in error.data) {
                const validationErrors = error.data.errors;
                if (typeof validationErrors === "object" && validationErrors !== null) {
                    const errorMessages = Object.values(validationErrors)
                        .flat()
                        .map(message => String(message))
                        .join("\n");
                    return errorMessages;
                }
            }
            return String(error.data.title);
        }
        return 'error' in error ? String(error.error) : "Error desconocido en la respuesta.";
    }
    if (isErrorWithMessage(error)) {
        return error.message;
    }
    return "Ocurrió un error inesperado.";
}

export function getErrorStatusCode(error: unknown): number | null {
    if (isFetchBaseQueryError(error)) {
        if (typeof error.status === "number") {
            return error.status;
        }
    }
    if (isErrorWithStatusCode(error)) {
        return error.statusCode;
    }
    return null;
}


/*
    * Type guards
 */
function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
    return (
        typeof error === "object" &&
        error !== null &&
        "status" in error &&
        typeof (error as FetchBaseQueryError).status !== "undefined"
    );
}

function isErrorWithMessage(error: unknown): error is { message: string } {
    return (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof (error as { message: unknown }).message === "string"
    );
}

function isErrorWithStatusCode(error: unknown): error is { statusCode: number } {
    return (
        typeof error === "object" &&
        error !== null &&
        "statusCode" in error &&
        typeof (error as { statusCode: unknown }).statusCode === "number"
    );
}