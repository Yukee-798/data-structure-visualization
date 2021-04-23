import axios  from 'axios'

// type PendingQueue = ((...args: any) => void)[]

const BASE_URL = 'https://cnodejs.org/api/v1/'

const TIMEOUT = 1000 * 10 //最大请求到期时间 10s



export const url = {
    getTopics: () => 'topics',
    getTopicDetial: (id: string) => 'topic/' + id
}

// 需要 token 的请求
//     '/post/topics', // 新建文章
//     '/post/topics/update', // 编辑文章
//     '/post/topic_collect/collect', // 收藏文章
//     '/post/topic_collect/de_collect', // 取消收藏
//     '/get/topic_collect/:loginname', // 获取用户收藏的所有文章
//     '/post topic/:topic_id/replies', // 新建评论
//     '/post/reply/:reply_id/ups', // 为评论点赞
//     '/get/user/:loginname', // 用户详情
//     '/post/accesstoken', // 验证 token 正确性
//     '/get/message/count', // 获取未读消息数
//     '/get/messages', // 获取已读和未读消息
//     '/post/message/mark_all', // 标记全部已读
//     '/post/message/mark_one/:msg_id' // 标记单个消息为已读

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

