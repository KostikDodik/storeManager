import type {Ref, ComputedRef} from "vue";
import type {ISupplier} from "@/types/ISupplier";

export default interface ISupplierState {
    suppliers: Ref<ISupplier[]>
}
