import type {Ref} from "vue";
import type {IProduct} from "@/types/IProduct";

export default interface IProductState {
    products: Ref<IProduct[]>,
    setCurrentPage: (page: number) => void
}
