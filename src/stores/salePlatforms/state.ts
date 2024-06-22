import type {Ref, ComputedRef} from "vue";
import type {ISalePlatform} from "@/types/ISalePlatform";

export default interface ISalePlatformState {
    salePlatforms: Ref<ISalePlatform[]>
}
