const path = "http://localhost:8080/"

const useCodeLogin = () => {
	return new Promise((resolve, reject) => {
		uni.login({
			provider: 'weixin',
			onlyAuthorize: true,
			success(res) {
				resolve(res.code)
			},
			fail(res) {
				console.log(res);
				errMsg("登陆失败")
				reject(res)
			}
		})
	})
}

const useSessionLogin = () => {
	return new Promise((resolve, reject) => {
		const session_key = getStorage("session_key", true)
		if (session_key) {
			console.log(session_key);
			resolve(session_key)
		} else {
			errMsg("登陆失败")
			reject(null)
		}
	})
}

const regUser = () => {
	return new Promise((resolve, reject) => {
		uni.showModal({
			title: '当前用户未注册',
			content: '是否立即注册',
			success: function(res) {
				if (res.confirm) {
					console.log('用户点击确定');
					useCodeLogin().then((code) => {
						uni.request({
							method: 'post',
							url: path + 'User/RegUser',
							header: {
								code
							},
							success(res) {
								if (res.data.code === 200) {
									setStorage("nick", res.data.data.nickName)
									setStorage("avatar", res.data.data
										.avatarPath)
									setStorage("money", res.data.data.money)
									setStorage("session_key", res.header
										.session_key)
									uni.switchTab({
										url: "/pages/index/index"
									})
									resolve(res)
								} else {
									uni.removeStorage("nick")
									uni.removeStorage("avatar")
									uni.removeStorage("money")
									uni.removeStorage("session_key")
									reject(res.data.message)
								}
							},
							fail(res) {
								uni.removeStorage("nick")
								uni.removeStorage("avatar")
								uni.removeStorage("money")
								uni.removeStorage("session_key")
								reject(res)
							}
						})
					})
				} else if (res.cancel) {
					console.log('用户点击取消');
				}
			}
		})
	})
}

const sucMsg = (title, duration = 1500) => {
	uni.showToast({
		title,
		duration,
		icon: 'success'
	});
}

const errMsg = (title, duration = 1500) => {
	uni.showToast({
		title,
		duration,
		icon: 'error'
	});
}

const request = async (req) => {
	showLoading()
	const url = path + req.url
	const session_key = getStorage("session_key", true)
	let header
	if (session_key) {
		header = {
			session_key
		}
	} else {
		const code = await useCodeLogin()
		header = {
			code
		}
	}
	return new Promise((resolve, reject) => {
		uni.request({
			method: req.method,
			data: req.data,
			header,
			url,
			success(res) {
				console.log(res);
				hideLoading()
				if (res.statusCode === 200) {
					setStorage("session_key", res.header.session_key, true)
					resolve(res)
				} else if (res.statusCode === 401) {
					uni.removeStorageSync("session_key")
					resolve(res)
				} else if (res.statusCode === 403) {
					uni.removeStorageSync("nick")
					uni.removeStorageSync("avatar")
					uni.removeStorageSync("money")
					uni.removeStorageSync("session_key")
					regUser().then(() => {
						sucMsg("注册成功")
						resolve()
					}).catch(() => {
						errMsg("注册失败")
						reject()
					})
				} else if (res.statusCode === 408) {
					errMsg(res.data.msg)
					uni.removeStorageSync("nick")
					uni.removeStorageSync("avatar")
					uni.removeStorageSync("money")
					uni.removeStorageSync("session_key")
					reject()
				} else {
					errMsg(res.data.error)
					uni.removeStorageSync("nick")
					uni.removeStorageSync("avatar")
					uni.removeStorageSync("money")
					uni.removeStorageSync("session_key")
					reject()
				}
			},
			fail(res) {
				hideLoading()
				errMsg("服务器未响应")
				console.log(res);
				reject(res)
			}
		})
	})
}

const noLoginRequest = (req) => {
	showLoading()
	const url = path + req.url
	return new Promise((resolve, reject) => {
		uni.request({
			method: req.method,
			data: req.data,
			url,
			success(res) {
				console.log(res);
				hideLoading()
				if (res.data.code === 200) {
					resolve(res.data)
				} else {
					errMsg("请求失败")
					reject()
				}
			},
			fail(res) {
				hideLoading()
				errMsg("服务器未响应")
				console.log(res);
				reject(res)
			}
		})
	})
}

const setStorage = (key, data, sync = false) => {
	if (!data)
		return
	if (sync) {
		uni.setStorageSync(key, data)
	} else {
		uni.setStorage({
			key,
			data,
			success() {
				return true
			},
			fail() {
				errMsg("缓存" + key + "存放失败")
				return false
			}
		})
	}
}

const getStorage = (key, sync = false) => {
	if (sync) {
		return uni.getStorageSync(key)
	} else {
		uni.getStorage({
			key,
			success(res) {
				console.log(res);
				return res.data
			},
			fail() {
				errMsg("缓存" + key + "获取失败")
				return null
			}
		})
	}
}

const showLoading = () => {
	uni.showLoading({
		title: '加载中'
	});
}
const hideLoading = () => {
	uni.hideLoading();
}
export default {
	path,
	useSessionLogin,
	useCodeLogin,
	sucMsg,
	errMsg,
	request,
	noLoginRequest,
	setStorage,
	getStorage,
	showLoading,
	hideLoading
}
