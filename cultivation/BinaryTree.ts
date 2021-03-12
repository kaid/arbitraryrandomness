interface ISerializable<S, D> {
    serialize(): S; 
    deserialize(): D;
}

interface IBinaryTreeTraversal<T, N, R> {
    tree: T;

    inOrderTraversal(node: N): R;
    preOrderTraversal(node: N): R;
    postOrderTraversal(node: N): R;
}

class TreeNode<V> {
    public left: TreeNode<V>;
    public right: TreeNode<V>;

    constructor(public value: V) {
        this.left = null;
        this.right = null
    }
}

class BinaryTree<V> {
    public root: TreeNode<V>;

    constructor(value: V) {
        this.root = new TreeNode(value);
    }
}

type BinaryTreeWalker<V> = IBinaryTreeTraversal<BinaryTree<V>, TreeNode<V>, Array<V>>;

class RecursiveBinaryTreeWalker<V> implements BinaryTreeWalker<V> {
    constructor(public tree: BinaryTree<V>) {
    }

    public preOrderTraversal(
        node: TreeNode<V> = this.tree.root,
        accumulation: Array<V> = [],
    ): Array<V> {
        if (!node) {
            return accumulation;
        }

        return this.inOrderTraversal(
            node.right,
            this.inOrderTraversal(
                node.left,
                accumulation.concat(node.value),
            ),
        );
    }

    public inOrderTraversal(
        node: TreeNode<V> = this.tree.root,
        accumulation: Array<V> = [],
    ): Array<V> {
        if (!node) {
            return accumulation;
        }

        return this.inOrderTraversal(
            node.right,
            this.inOrderTraversal(
                node.left,
                accumulation,
            ).concat(node.value),
        );
    }

    public postOrderTraversal(
        node: TreeNode<V> = this.tree.root,
        accumulation: Array<V> = [],
    ): Array<V> {
        if (!node) {
            return accumulation;
        }

        return this.inOrderTraversal(
            node.right,
            this.inOrderTraversal(
                node.left,
                accumulation,
            ),
        ).concat(node.value);
    }
}

class IterativeBinaryTreeWalker<V> implements BinaryTreeWalker<V> {
    constructor(public tree: BinaryTree<V>) {
    }

    public inOrderTraversal(): Array<V> {
        throw new Error("Method not implemented.");
    }
    public preOrderTraversal(): Array<V> {
        throw new Error("Method not implemented.");
    }
    public postOrderTraversal(): Array<V> {
        throw new Error("Method not implemented.");
    }
}
