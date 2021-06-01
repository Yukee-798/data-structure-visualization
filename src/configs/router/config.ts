import Home from '../../pages/Home/home'
import Sort from '../../pages/Sort/sort'
// import AVLTree from '../../pages/AVLTree/avlTree'
// import Graph from '../../pages/Graph/graph'
import BinaryHeap from '../../pages/BinaryHeap/binaryHeap'
// import BTree from '../../pages/BTree/bTree'
import Queue from '../../pages/Queue/queue'
import Stack from '../../pages/Stack/stack'
// import HashTable from '../../pages/HashTable/hashTable'
// import LinkedList from '../../pages/LinkedList/linkedList'
// import RedBlackTree from '../../pages/RedBlackTree/redBlackTree'
// import BPlusTree from '../../pages/BPlusTree/bPlusTree'
import BinarySearchTree from '../../pages/BinarySearchTree/binarySearchTree'
import HashTable from '../../pages/HashTable/hashTable'
import Graph from '../../pages/Graph/graph'


export const root = '/data-structure-visualization';

const routers = [
    {
        path: root + "/home",
        page: Home
    },
    {
        path: root + "/sort",
        page: Sort
    },
    {
        path: root + "/graph",
        page: Graph
    },
    {
        path: root + "/queue",
        page: Queue
    },
    {
        path: root + "/stack",
        page: Stack
    },
    {
        path: root + "/binarySearchTree",
        page: BinarySearchTree
    },
    {
        path: root + "/binaryHeap",
        page: BinaryHeap
    },
    {
        path: root + "/hashTable",
        page: HashTable
    },
    // {
    //     path: root + "/avlTree",
    //     page: AVLTree
    // },
    // {
    //     path: root + "/redBlackTree",
    //     page: RedBlackTree
    // },
    // {
    //     path: root + "/bTree",
    //     page: BTree
    // },

    // {
    //     path: root + "/bPlusTree",
    //     page: BPlusTree
    // },

];


export default routers
