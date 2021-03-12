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
    constructor(public root: TreeNode<V>) {
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

        return this.preOrderTraversal(
            node.right,
            this.preOrderTraversal(
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

        return [node.value].concat(this.postOrderTraversal(
            node.right,
            this.postOrderTraversal(
                node.left,
                accumulation,
            ),
        ));
    }
}

class IterativeBinaryTreeWalker<V> implements BinaryTreeWalker<V> {
    constructor(public tree: BinaryTree<V>) {
    }

    public inOrderTraversal(): Array<V> {
        const result = [];
        const root = this.tree?.root;

        if (!root) {
            return result;
        }

        const stack = [];
        let node: TreeNode<V> = root;

        while (node || stack.length) {
            while (node) {
                stack.push(node);
                node = node.left;
            }

            node = stack.pop();
            result.push(node.value);
            node = node.right;
        }

        return result;
    }

    public preOrderTraversal(): Array<V> {
        const result = [];
        const root = this.tree?.root;

        if (!root) {
            return result;
        }

        let node: TreeNode<V>;
        const stack = [root];

        while (stack.length) {
            node = stack.pop();
            result.push(node.value);

            if (node.right) {
                stack.push(node.right);
            }

            if (node.left) {
                stack.push(node.left);
            }
        }

        return result;
    }

    public postOrderTraversal(): Array<V> {
        const result = [];
        const root = this.tree?.root;

        if (!root) {
            return result;
        }

        let node: TreeNode<V>;
        const stack = [root];

        while (stack.length) {
            node = stack.pop();
            result.push(node.value);

            if (node.left) {
                stack.push(node.left);
            }

            if (node.right) {
                stack.push(node.right);
            }
        }

        return result;
    }
}

const root = new TreeNode(1);
root.left = new TreeNode(2);
root.left.left = new TreeNode(3);
root.left.right = new TreeNode(4);
root.left.right.left = new TreeNode(5);
root.right = new TreeNode(6);
root.right.left = new TreeNode(7);
root.right.left.right = new TreeNode(8);
root.right.right = new TreeNode(9);
root.right.right.left = new TreeNode(10);
root.right.right.left.left = new TreeNode(11);
root.right.right.left.right = new TreeNode(12);

const tree = new BinaryTree(root);

const recursiveWalker = new RecursiveBinaryTreeWalker(tree);
const iterativeWalker = new IterativeBinaryTreeWalker(tree);

console.log('pre-order', recursiveWalker.preOrderTraversal(), iterativeWalker.preOrderTraversal());
console.log('in-order', recursiveWalker.inOrderTraversal(), iterativeWalker.inOrderTraversal());
console.log('post-order', recursiveWalker.postOrderTraversal(), iterativeWalker.postOrderTraversal());
