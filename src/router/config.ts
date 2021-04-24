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
        path: "/home/array",
        page: Array
    },
    {
        path: "/home/avlTree",
        page: AVLTree
    },
    {
        path: "/home/binarySearchTree",
        page: BinarySearchTree
    },
    {
        path: "/home/bPlusTree",
        page: BPlusTree
    },
    {
        path: "/home/bTree",
        page: BTree
    },
    {
        path: "/home/graph",
        page: Graph
    },
    {
        path: "/home/hashTable",
        page: HashTable
    },
    {
        path: "/home/heap",
        page: Heap
    },
    {
        path: "/home/linkedList",
        page: LinkedList
    },
    {
        path: "/home/queue",
        page: Queue
    },
    {
        path: "/home/redBlackTree",
        page: RedBlackTree
    },
    {
        path: "/home/stack",
        page: Stack
    },
];


export default routerView
