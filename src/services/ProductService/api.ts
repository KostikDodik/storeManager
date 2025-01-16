import type {IProduct} from "@/types/IProduct";
import Service from "@/services/Service";

export class ProductService extends Service {
    public async getAllProducts(): Promise<IProduct[]> {
        return (await this.get<IProduct[]>('/products')).data;
    }
    
    public async getAvailableProducts(ids?: string[]): Promise<IProduct[]> {
        if (!ids) {
            return (await this.get<IProduct[]>(`/products/available`)).data
        }
        return (await this.get<IProduct[]>(`/products/available?ids=${ids.join("&ids=")}`)).data;
    }

    public async getProduct(id: string): Promise<IProduct> {
        return (await this.get<IProduct>(`/products/${id}`)).data;
    }

    public async addProduct(product: IProduct): Promise<IProduct> {
        return (await this.post<IProduct>(`/products`, product)).data;
    }

    public async updateProduct(product: IProduct): Promise<IProduct> {
        return (await this.put<IProduct>(`/products`, product)).data;
    }

    /*
    * Returns updated available products
    */
    public async deleteProduct(id: string): Promise<void> {
        await this.delete(`/products/${id}`);
    }
}