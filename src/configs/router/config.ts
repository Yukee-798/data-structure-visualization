import Home from '../../pages/Home/home'
import Sort from '../../pages/Sort/sort'
import AVLTree from '../../pages/AVLTree/avlTree'
import Graph from '../../pages/Graph/graph'
import BinaryHeap from '../../pages/BinaryHeap/binaryHeap'
import BTree from '../../pages/BTree/bTree'
import Queue from '../../pages/Queue/queue'
import Stack from '../../pages/Stack/stack'
import HashTable from '../../pages/HashTable/hashTable'
import LinkedList from '../../pages/LinkedList/linkedList'
import RedBlackTree from '../../pages/RedBlackTree/redBlackTree'
import BPlusTree from '../../pages/BPlusTree/bPlusTree'
import BinarySearchTree from '../../pages/BinarySearchTree/binarySearchTree'

const routerView = [
    {
        path: "/data-structure-visualization/home/",
        page: Home
    },
    {
        path: "/data-structure-visualization/sort",
        page: Sort
    },
    {
        path: "/data-structure-visualization/linkedList",
        page: LinkedList
    },
    {
        path: "/data-structure-visualization/queue",
        page: Queue
    },
    {
        path: "/data-structure-visualization/stack",
        page: Stack
    },
    {
        path: "/data-structure-visualization/binarySearchTree",
        page: BinarySearchTree
    },
    {
        path: "/data-structure-visualization/binaryHeap",
        page: BinaryHeap
    },
    {
        path: "/data-structure-visualization/hashTable",
        page: HashTable
    },
    {
        path: "/data-structure-visualization/avlTree",
        page: AVLTree
    },
    {
        path: "/data-structure-visualization/redBlackTree",
        page: RedBlackTree
    },
    {
        path: "/data-structure-visualization/bTree",
        page: BTree
    },

    {
        path: "/data-structure-visualization/bPlusTree",
        page: BPlusTree
    },
    {
        path: "/data-structure-visualization/graph",
        page: Graph
    },
];


export default routerView
