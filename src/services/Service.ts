import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export default class Service {
    protected get apiUrl(): string {
        return window.environmentVariables.apiUrl;
    }

    protected put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return axios.put<T>(this.apiUrl + url, data, config);
    }

    protected get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return axios.get<T>(this.apiUrl + url, config);
    }

    protected post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return axios.post<T>(this.apiUrl + url, data, config);
    }

    protected delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return axios.delete<T>(this.apiUrl + url, config);
    }
}
