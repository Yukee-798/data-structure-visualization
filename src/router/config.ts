import Home from '../pages/Home/home'
import Array from '../pages/Array/array'
import AVLTree from '../pages/AVLTree/avlTree'
import Graph from '../pages/Graph/graph'
import Heap from '../pages/Heap/heap'
import BTree from '../pages/BTree/bTree'
import Queue from '../pages/Queue/queue'
import Stack from '../pages/Stack/stack'
import HashTable from '../pages/HashTable/hashTable'
import LinkedList from '../pages/LinkedList/linkedList'
import RedBlackTree from '../pages/RedBlackTree/redBlackTree'
import BPlusTree from '../pages/BPlusTree/bPlusTree'
import BinarySearchTree from '../pages/BinarySearchTree/binarySearchTree'

const routerView = [
    {
        path: "/home",
        page: Home
    },
    {
        path: "/array",
        page: Array
    },
    {
        path: "/avlTree",
        page: AVLTree
    },
    {
        path: "/binarySearchTree",
        page: BinarySearchTree
    },
    {
        path: "/bPlusTree",
        page: BPlusTree
    },
    {
        path: "/bTree",
        page: BTree
    },
    {
        path: "/graph",
        page: Graph
    },
    {
        path: "/hashTable",
        page: HashTable
    },
    {
        path: "/heap",
        page: Heap
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
        path: "/redBlackTree",
        page: RedBlackTree
    },
    {
        path: "/stack",
        page: Stack
    },
];


export default routerView
