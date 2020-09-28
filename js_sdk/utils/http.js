import store from '../../store'
export default function(action, data) {
    return new Promise((resolve, reject) => {
        uniCloud.callFunction({
            name: 'uni-admin',
            data: {
                action,
                data
            }
        }).then(res => {
            if (res.result.code) {
                if (res.result.code.indexOf('TOKEN_INVALID') === 0) {
                    uni.reLaunch({
                        url: '/pages/login/login.vue'
                    })
                }
                return Promise.reject(new Error(res.result.message))
            }
            const {
                token,
                tokenExpired
            } = res.result
            if (token && tokenExpired) {
                store.commit('user/SET_TOKEN', {
                    token,
                    tokenExpired
                })
            }
            resolve(res)
        }).catch(err => {
            uni.showModal({
                content: '请求服务失败:' + err.message,
                showCancel: false
            })
        })
    })
}
