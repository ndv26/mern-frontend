import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const activeHttpRequests = useRef([]);

    const sendRequest = useCallback(
        async (url, method = "GET", body = null, headers = {}) => {
            setIsLoading(true);
            // handle memory leak
            const httpAbortController = new AbortController();
            activeHttpRequests.current.push(httpAbortController);

            try {
                const response = await fetch(url, {
                    method,
                    body,
                    headers,
                    // link the abort controller to this request => to cancel the request
                    signal: httpAbortController.signal,
                });

                const responseData = await response.json();

                activeHttpRequests.current = activeHttpRequests.current.filter(
                    (reqCtrl) => reqCtrl !== httpAbortController
                );

                if (!response.ok) {
                    throw new Error(responseData.message);
                }
                setIsLoading(false);
                return responseData;
            } catch (error) {
                setError(error.message);
                setIsLoading(false);
                throw error;
            }
        },
        []
    );

    const clearError = () => {
        setError(null);
    };

    useEffect(() => {
        return () => {
            activeHttpRequests.current.forEach((activeHttpReq) =>
                activeHttpReq.abort()
            );
        };
    }, []);

    return {
        isLoading,
        error,
        sendRequest,
        clearError,
    };
};
