import type ICategoryState from "./state";
import type {ICategory} from "@/types/ICategory";
import {CategoryService} from "@/services/CategoryService";
const categoryService = new CategoryService();

export function flattenCategories(category: ICategory): ICategory[] {
    let result: ICategory[] = [category];
    if (category.children) {
        for (const child of category.children) {
            result = result.concat(flattenCategories(child));
        }
    }
    return result;
}

export async function add(state: ICategoryState, category: ICategory) {
    const newCategory = await categoryService.addCategory(category);
    if (await loadList(state)) {
        // Don't need to refresh as it was not initialised before and now is loaded with changes
        return;
    }
    
    category.id = newCategory.id;
    if (newCategory.parentId) {
        const parentCategory = state.flatCategories.value.find((c: ICategory) => c.id === newCategory.parentId);
        if (parentCategory) {
            if (!parentCategory.children) {
                parentCategory.children = [];
            }
            parentCategory.children.push(newCategory);
        }
    } else {
        state.categories.value.push(newCategory);        
    }
}

export async function update(state: ICategoryState, category: ICategory) {
    const updatedCategory = await categoryService.updateCategory(category);
    if (await loadList(state)) {
        // Don't need to refresh as it was not initialised before and now is loaded with changes
        return;
    }
    
    const existingCategory = state.flatCategories.value.find(cat => cat.id === updatedCategory.id);
    if (existingCategory != null) {
        Object.assign(existingCategory, updatedCategory);        
    }
}

export async function remove(state: ICategoryState, category: ICategory) {
    if (category.id == null) {
        return
    }
    await categoryService.deleteCategory(category.id);
    if (await loadList(state)) {
        // Don't need to refresh as it was not initialised before and now is loaded with changes
        return;
    }
    
    const categories = category.parentId
        ? state.flatCategories.value.find((c: ICategory) => c.id === category.parentId)?.children
        : state.categories.value;
    if (!categories) {
        return;
    }
    const index = categories.indexOf(category);
    if (index >= 0) {
        categories.splice(index, 1);
    }
}

async function loadList(state: ICategoryState): Promise<boolean> {
    if (state.categories.value?.length) {
        return false;
    } 
    await getAll(state);
    return true;
}

export async function getAll(state: ICategoryState) {
    state.categories.value = await categoryService.getAll();
}
