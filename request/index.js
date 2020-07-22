// 同时发送异步请求的次数
let AjaxTime = 0
export const request = (params) => {
    // 判断 url中是否带有 /my/ 请求的是私有的路径 带上header token
    let header = {
        ...params.header
    }
    if (params.url.includes("/my/")) {
        // 拼接header 带上token
        header["Authorization"] = wx.getStorageSync("token");
    }

    AjaxTime++
    // 等待加载
    wx.showLoading({
        title: "加载中",
        mask: true
    });
    // 定义公共的URl
    const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1"
    return new Promise((resolve, reject) => {
        // 发送请求
        wx.request({
            ...params,
            header: header,
            url: baseUrl + params.url,
            success: (result) => {
                resolve(result.data.message)
            },
            fail: (error) => {
                reject(error)
            },
            complete: () => {
                /* 
                // 是这样的情况，比如首页，有三个接口同时发送请求，一个接口返回数据后，其他两个还没返回数据，这个时候等待图标就已经关闭了，
                    对于这样的情况，我们需要处理
                    首先我们定义一个变量，表示请求的次数，刚开始为0，每请求一次就加一，当数据返回后就减一，直到全部数据都返回完，即是等于0，才关闭
                    等待图标
                */
                AjaxTime--;
                if (AjaxTime === 0) {
                    // 关闭正在等待的图标
                    wx.hideLoading();
                }

            }
        })

    })
}