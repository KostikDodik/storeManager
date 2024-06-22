export interface ITreeNode<Type> {
    data: Type,
    key?: string,
    children?: ITreeNode<Type>[];
}

export interface  ITreeNodeData {
    id?: string,
    children?: ITreeNodeData[]
}
export function makeTreeNodes<T extends ITreeNodeData>(data?: T[]): ITreeNode<T>[] | undefined {
    return data?.map(d => <ITreeNode<T>>{ key: d.id, data: d, children: makeTreeNodes(d.children)})
}