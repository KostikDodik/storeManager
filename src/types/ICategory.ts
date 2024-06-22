import {TreeNode} from "primevue/treenode";

export interface ICategory {
    id?: string,
    name?: string,
    code?: string,
    parentId?: string,
    children?: ICategory[]
}

/**/
export function makeTreeSelectNodes(categories: ICategory[]): TreeNode[] {
    return categories.map(category =>({
        key: category.id,
        label: category.name,
        data: category,
        children: makeTreeSelectNodes(category.children || [])
    }));
}