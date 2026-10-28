import { toast } from "react-toastify";
import { ApiError, ApiRequestConfig, ApiResponse } from "@/types/api";
import { AxiosError, AxiosResponse } from "axios";


export const decodeJWT = (token: string): any | null => {
    try {
        const payload = token.split(".")[1];
        const decoded = JSON.parse(atob(payload));
        return decoded;
    } catch (error) {
        console.error("Error decoding JWT:", error);
        return null;
    }
};


export const isTokenExpired = (token: string): boolean => {
    try {
        const decoded = decodeJWT(token);
        if (!decoded || !decoded.exp) {
            return true;
        }

        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp < currentTime;
    } catch (error) {
        return true;
    }
};


export const getValidToken = (): string | null => {
    if (typeof window === "undefined") {
        return null;
    }

    const token = localStorage.getItem("accessToken");

    if (!token) {
        return null;
    }

    if (isTokenExpired(token)) {
        clearAuthData();
        return null;
    }

    return token;
};


export const clearAuthData = (): void => {
    if (typeof window === "undefined") {
        return;
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
};


export const setAccessToken = (token: string): void => {
    if (typeof window === "undefined") {
        return;
    }
    localStorage.setItem("accessToken", token);
};


export const isAuthenticated = (): boolean => {
    return getValidToken() !== null;
};


export const getErrorMessage = (error: unknown): string => {
    // Check if error contains response data (Axios or similar)
    const anyErr = error as any;
    const responseData = anyErr?.response?.data;

    if (responseData) {
        // Check for errorMessages array (e.g. [{ message: "...", path: "..." }])
        if (Array.isArray(responseData.errorMessages) && responseData.errorMessages.length > 0) {
            const first = responseData.errorMessages[0];
            if (typeof first === "string" && first) return first;
            if (first?.message) return first.message;
        }

        // Check for structured error message
        if (responseData.message && typeof responseData.message === "string") {
            return responseData.message;
        }

        // Check for validation errors object
        if (responseData.errors && typeof responseData.errors === "object") {
            const firstErrorKey = Object.keys(responseData.errors)[0];
            const firstError = responseData.errors[firstErrorKey];
            if (Array.isArray(firstError) && firstError[0]) {
                return firstError[0];
            } else if (typeof firstError === "string") {
                return firstError;
            }
        }

        if (typeof responseData.error === "string" && responseData.error) {
            return responseData.error;
        }
    }

    if (error instanceof AxiosError) {
        // Fallback to generic error messages
        if (error.response?.status === 401) {
            return "Unauthorized. Please login again.";
        }

        if (error.response?.status === 403) {
            return "You don't have permission to perform this action.";
        }

        if (error.response?.status === 404) {
            return "Resource not found.";
        }

        if (error.response?.status === 500) {
            return "Server error. Please try again later.";
        }

        if (error.message === "Network Error") {
            return "Network error. Please check your internet connection.";
        }

        return error.message || "An unexpected error occurred.";
    }

    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === "string") {
        return error;
    }

    return "An unexpected error occurred.";
};


export const handleApiError = (
    error: unknown,
    showToast: boolean = true
): string => {
    const errorMessage = getErrorMessage(error);

    if (showToast) {
        toast.error(errorMessage);
    }

    // Log error in development
    if (process.env.NODE_ENV === "development") {
        console.error("API Error:", error);
    }

    return errorMessage;
};


export const handleApiSuccess = <T>(
    response: AxiosResponse<ApiResponse<T>>,
    config?: ApiRequestConfig
): T | undefined => {
    const { data } = response;

    if (config?.showSuccessToast) {
        const message = config.successMessage || data.message || "Success!";
        toast.success(message);
    }

    return data.data;
};


export const apiRequest = async <T>(
    requestFn: () => Promise<AxiosResponse<ApiResponse<T>>>,
    config?: ApiRequestConfig
): Promise<T | undefined> => {
    const defaultConfig: ApiRequestConfig = {
        showErrorToast: true,
        showSuccessToast: false,
        retryOnFailure: false,
        maxRetries: 3,
        ...config,
    };

    let retries = 0;

    while (retries <= (defaultConfig.maxRetries || 0)) {
        try {
            const response = await requestFn();
            return handleApiSuccess(response, defaultConfig);
        } catch (error) {
            // Don't retry on client errors (4xx)
            if (error instanceof AxiosError && error.response?.status && error.response.status < 500) {
                handleApiError(error, defaultConfig.showErrorToast);
                throw error;
            }

            // Retry on server errors (5xx) if enabled
            if (defaultConfig.retryOnFailure && retries < (defaultConfig.maxRetries || 0)) {
                retries++;
                // Exponential backoff
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
                continue;
            }

            handleApiError(error, defaultConfig.showErrorToast);
            throw error;
        }
    }
};


export const redirectToLogin = (): void => {
    if (typeof window === "undefined") {
        return;
    }

    clearAuthData();
    window.location.href = "/login";
};
