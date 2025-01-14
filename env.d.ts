/// <reference types="vite/client" />
declare global {
    interface Window {
        environmentVariables: {
            apiUrl: string
        }
    }

    interface Date {
        toUaString(): string;
        toUaTimeString(): string;
        getDateOnly(): Date;
        formatDate(): Date;
    }
    
    interface String {
        formatDate(): Date;
    }
}
export {};