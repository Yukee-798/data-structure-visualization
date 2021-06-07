import axios  from 'axios'

// type PendingQueue = ((...args: any) => void)[]

const BASE_URL = 'https://cnodejs.org/api/v1/'

const TIMEOUT = 1000 * 10 //最大请求到期时间 10s



export const url = {
    getTopics: () => 'topics',
    getTopicDetial: (id: string) => 'topic/' + id
}


const request = axios.create({
    baseURL: BASE_URL,
    timeout: TIMEOUT
})

export default request;

export interface Response<T> {
    status: number;
    data: {
        data: T,
        success: boolean
    };
}

