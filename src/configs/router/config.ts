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
        path: "/home",
        page: Home
    },
    {
        path: "/sort",
        page: Sort
    },
    {
        path: "/linkedList",
        page: LinkedList
    },
    {
        path: "/queue",
        page: Queue
    },
    {
        path: "/stack",
        page: Stack
    },
    {
        path: "/binarySearchTree",
        page: BinarySearchTree
    },
    {
        path: "/binaryHeap",
        page: BinaryHeap
    },
    {
        path: "/hashTable",
        page: HashTable
    },
    {
        path: "/avlTree",
        page: AVLTree
    },
    {
        path: "/redBlackTree",
        page: RedBlackTree
    },
    {
        path: "/bTree",
        page: BTree
    },

    {
        path: "/bPlusTree",
        page: BPlusTree
    },
    {
        path: "/graph",
        page: Graph
    },
];


export default routerView
