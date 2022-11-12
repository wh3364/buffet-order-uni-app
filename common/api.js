const path = "http://localhost:8080/BuffetOrder/"

const onlyLogin = (fun, data) => {
	const _this = this
	return new Promise((resolve, reject) => {
		useSessionLogin().then((session_key) => {
			fun()
		}).catch(() => {
			useCodeLogin().then((code) => {
				fun()
			})
		})
	})
}

const useCodeLogin = () => {
	const _this = this
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
	const _this = this
	return new Promise((resolve, reject) => {
		let session_key = getStorage("session_key", true)
		if (session_key != '') {
			console.log(session_key);
			resolve(session_key)
		} else {
			reject(null)
		}
	})
}

const regUser = () => {
	const _this = this
	return new Promise((resolve, reject) => {
		uni.showModal({
			title: '当前用户未注册',
			content: '是否立即注册',
			success: function(res) {
				if (res.confirm) {
					console.log('用户点击确定');
					useCodeLogin().then((code) => {
						postRequest(path + 'Login/RegUser', null, {
							'code': code
						}).then((res) => {
							if (res.statusCode === 200) {
								setStorage("nick", res.data.user.nickName, true)
								setStorage("avatar", res.data.user.avatarPath, true)
								setStorage("money", res.data.user.money, true)
								// setStorage("session_key", res.data.session_key,
								// 	true)
								setStorage("session_key", res.header.session_key, true)
								uni.switchTab({
									url: "/pages/index/index"
								})
								resolve(res)
							} else {
								uni.removeStorageSync("nick")
								uni.removeStorageSync("avatar")
								uni.removeStorageSync("money")
								uni.removeStorageSync("session_key")
								reject(res)
							}
						}).catch((res) => {
							uni.removeStorageSync("nick")
							uni.removeStorageSync("avatar")
							uni.removeStorageSync("money")
							uni.removeStorageSync("session_key")
							reject(res)
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

const getRequest = (url, data, header) => {
	showLoading()
	return new Promise((resolve, reject) => {
		uni.request({
			method: 'GET',
			header,
			url,
			data,
			success(res) {
				console.log(res);
				hideLoading()
				if (res.statusCode === 200) {
					//setStorage("session_key", res.data.session_key, true)
					setStorage("session_key", res.header.session_key, true)
					resolve(res)
				} else if (res.statusCode === 401) {
					uni.removeStorageSync("session_key")
					resolve(res)
				} else if (res.statusCode === 403) {
					hideLoading()
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
					reject()
				} else if (res.statusCode === 408) {
					hideLoading()
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
				resolve(res)
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

const postRequest = (url, data, header) => {
	showLoading()
	return new Promise((resolve, reject) => {
		uni.request({
			method: 'POST',
			header,
			url,
			data,
			success(res) {
				console.log(res);
				hideLoading()
				if (res.statusCode === 200) {
					//setStorage("session_key", res.data.session_key, true)
					setStorage("session_key", res.header.session_key, true)
					resolve(res)
				} else if (res.statusCode === 401) {
					// uni.removeStorageSync("nick")
					// uni.removeStorageSync("avatar")
					// uni.removeStorageSync("money")
					uni.removeStorageSync("session_key")
					resolve(res)
				} else if (res.statusCode === 403) {
					hideLoading()
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
					reject()
				} else if (res.statusCode === 408) {
					errMsg(res.data.msg)
					hideLoading()
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
				resolve(res)
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

const setStorage = (key, data, sync) => {
	if (data == null || data == '')
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

const getStorage = (key, sync) => {
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

//注册定义的方法


export default {
	path,
	useSessionLogin,
	useCodeLogin,
	onlyLogin,
	regUser,
	sucMsg,
	errMsg,
	getRequest,
	postRequest,
	setStorage,
	getStorage,
	showLoading,
	hideLoading
}
