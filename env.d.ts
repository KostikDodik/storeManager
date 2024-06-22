/// <reference types="vite/client" />
declare global {
    interface Window {
        environmentVariables: {
            apiUrl: string
        }
    }

    interface Date {
        toUaString(): string;
    }
}
export {};