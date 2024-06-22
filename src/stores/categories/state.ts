import type {Ref, ComputedRef} from "vue";
import type {ICategory} from "@/types/ICategory";

export default interface ICategoryState {
    categories: Ref<ICategory[]>,
    flatCategories: ComputedRef<ICategory[]>
}
