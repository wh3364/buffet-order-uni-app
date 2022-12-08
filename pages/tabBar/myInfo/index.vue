<template>
	<view class="comment">
		<view v-if="avatar != '' && nick != ''" class="top flex row">
			<image class="top-left" :src="avatar" mode="aspectFit"></image>
			<text>{{nick}}</text>
		</view>
		<view v-else class="top flex row" @click="loginUser">
			<image class="top-left" src="@/static/logo.png" mode="aspectFit"></image>
			<text>点击登录</text>
		</view>
		<view v-if="avatar != '' && nick != ''" class="mid flex column">
			<view class="mid-info flex row">
				<view class="mid-left">
					<text>本店可用金额？</text>
					<text>{{money}}￥</text>
				</view>
				<view class="mid-right">
					<text>优惠卷？</text>
					<text>000</text>
				</view>
			</view>
			<view class="mid-but flex row but" hover-class="but-hover" @click="addMoney">
				<image class="money-img" src="@/static/img/icon/money.png" mode="aspectFit"></image>
				<text class="white">立即充值</text>
			</view>
			<view class="mid-but flex row but" hover-class="but-hover" @click="openPopup1">
				<text class="white">添加或修改地址</text>
			</view>
			<view class="mid-but flex row but" hover-class="but-hover" @click="updateWeiXinInfo">
				<text class="white">以微信头像和昵称更新信息</text>
			</view>
			<view class="mid-but flex row but" hover-class="but-hover" @click="openPopup">
				<text class="white">修改昵称</text>
			</view>
			<view class="mid-but flex row but" hover-class="but-hover" @click="uploadAvatar">
				<text class="white">上传头像</text>
			</view>
		</view>
	</view>

	<view class="popup" v-if="popup">
		<view class="popup-info flex column">
			<image class="close" src="@/static/img/icon/close.png" mode="aspectFit" @click="hidPopup"></image>
			<input class="input-text" focus maxlength="20" placeholder="输入新用户名(最长20字符)" type="text" v-model="newNick" />
			<button class="but name-submit" hover-class="but-hover" @click="uploadNick">修改</button>
		</view>
	</view>
	<view class="popup" v-if="popup1">
		<view class="popup-info flex column">
			<image class="close" src="@/static/img/icon/close.png" mode="aspectFit" @click="hidPopup1"></image>
			<input class="input-text" focus maxlength="100" placeholder="输入地址(最长100字符)" type="text"
				v-model="newAddress" />
			<button class="but name-submit" hover-class="but-hover" @click="updateAddress">修改</button>
		</view>
	</view>
</template>

<script>
	import {
		getUser,
		addMoney,
		getAddress,
		updateAddress,
		uploadNick
	} from "@/common/request/user.js"
	export default {
		data() {
			return {
				nick: '',
				avatar: '',
				money: '',
				newNick: '',
				newAddress: '',
				popup: false,
				popup1: false
			}
		},
		onShow() {
			this.nick = this.$api.getStorage("nick", true)
			this.avatar = this.$api.getStorage("avatar", true)
			this.money = this.$api.getStorage("money", true)
		},
		onLoad() {
			this.nick = this.$api.getStorage("nick", true)
			this.avatar = this.$api.getStorage("avatar", true)
			this.money = this.$api.getStorage("money", true)
		},
		methods: {
			/**
			 * 登录
			 */
			loginUser() {
				getUser().then((res) => {
					if (res.statusCode === 200) {
						this.$api.sucMsg("登陆成功")
						this.$api.setStorage("nick", res.data.user.nickName, true)
						this.$api.setStorage("avatar", res.data.user.avatarPath, true)
						this.$api.setStorage("money", res.data.user.money, true)
						this.nick = this.$api.getStorage("nick", true)
						this.avatar = this.$api.getStorage("avatar", true)
						this.money = this.$api.getStorage("money", true)
					} else if (res.statusCode === 401) {
						this.loginUser()
					}
				})
			},
			openPopup() {
				this.popup = true
			},
			hidPopup() {
				this.popup = false
			},
			openPopup1() {
				this.popup1 = true
				this.$api.showLoading()
				this.getAddress()
			},
			hidPopup1() {
				this.popup1 = false
				this.$api.hideLoading()
			},
			addMoney() {
				addMoney().then(res => {
					if (res.statusCode === 200) {
						this.money = res.data.money
						this.$api.setStorage('money', res.data.money)
					} else if (res.statusCode === 401) {
						this.addMoney()
					}
				})
			},
			/**
			 * 获得地址
			 */
			getAddress() {
				getAddress().then((res) => {
					if (res.statusCode === 200) {
						if (res.data.address.address) {
							this.newAddress = res.data.address.address
						}
					} else if (res.statusCode === 401) {
						this.getAddress()
					}
				})
			},
			/**
			 * 添加或修改地址
			 */
			updateAddress() {
				if (!this.newAddress) {
					this.$api.errMsg("请输入地址")
					return
				}
				const address = this.newAddress
				updateAddress({
						address
					}).then((res) => {
						if (res.statusCode === 200) {
							this.$api.sucMsg("修改成功")
							this.newAddress = ''
							this.popup1 = false
						} else if (res.statusCode === 401) {
							this.updateAddress()
						}
					})
					.catch(() => {
						this.$api.errMsg("修改失败")
					})
			},
			/**
			 * 更新用户名
			 */
			uploadNick() {
				if (!this.newNick) {
					this.$api.errMsg("请输入姓名")
					return
				}
				const nick = this.newNick
				uploadNick({
						nick
					}).then((res) => {
						if (res.statusCode === 200) {
							this.$api.sucMsg("修改成功")
							this.$api.setStorage("nick", this.newNick, true)
							this.nick = this.newNick
							this.newNick = ''
							this.popup = false
						} else if (res.statusCode === 401) {
							this.uploadNick()
						}
					})
					.catch(() => {
						this.$api.errMsg("修改失败")
					})
			},

			/**
			 * 更新头像
			 */
			uploadAvatar() {
				const _this = this
				let tempFilePaths
				this.$api.useSessionLogin().then((session_key) => {
					uni.chooseImage({
						success(chooseImageRes) {
							console.log(chooseImageRes);
							tempFilePaths = chooseImageRes.tempFilePaths;
							uni.uploadFile({
								url: _this.$api.path + 'User/UploadAvatar',
								filePath: tempFilePaths[0],
								name: 'File',
								header: {
									session_key
								},
								success: (uploadFileRes) => {
									if (uploadFileRes.statusCode === 200) {
										uploadFileRes.data = JSON.parse(uploadFileRes.data)
										_this.$api.setStorage("avatar", uploadFileRes.data.user
											.avatarPath,
											true)
										_this.$api.setStorage("session_key", uploadFileRes.data
											.session_key,
											true)
										_this.avatar = _this.$api.getStorage("avatar", true) +
											"?time=" + new Date
										console.log(uploadFileRes);
										_this.$api.sucMsg("上传成功")
									} else if (uploadFileRes.statusCode === 401) {
										_this.$api.useCodeLogin().then((code) => {
											uni.uploadFile({
												url: _this.$api.path +
													'User/UploadAvatar',
												filePath: tempFilePaths[0],
												name: 'File',
												header: {
													code
												},
												success: (uploadFileRes) => {
													if (uploadFileRes
														.statusCode === 200
													) {
														uploadFileRes
															.data = JSON
															.parse(
																uploadFileRes
																.data)
														_this.$api
															.setStorage(
																"avatar",
																uploadFileRes
																.data.user
																.avatarPath,
																true)
														_this.$api
															.setStorage(
																"session_key",
																uploadFileRes
																.data
																.session_key,
																true)
														_this.avatar =
															_this.$api
															.getStorage(
																"avatar",
																true) +
															"?time=" +
															new Date
														console.log(
															uploadFileRes
														);
														_this.$api.sucMsg(
															"上传成功")
													}
												}
											})
										})
									}
								}
							})
						}
					})
				}).catch(() => {
					this.$api.useCodeLogin().then((code) => {
						uni.chooseImage({
							success(chooseImageRes) {
								tempFilePaths = chooseImageRes.tempFilePaths;
								uni.uploadFile({
									url: _this.$api.path + 'User/UploadAvatar',
									filePath: tempFilePaths[0],
									name: 'File',
									header: {
										code
									},
									success: (uploadFileRes) => {
										console.log(uploadFileRes);
										if (uploadFileRes.statusCode === 200) {
											uploadFileRes.data = JSON.parse(
												uploadFileRes.data)
											_this.$api.setStorage("avatar",
												uploadFileRes.data.user
												.avatarPath,
												true)
											_this.$api.setStorage("session_key",
												uploadFileRes.data
												.session_key,
												true)
											_this.avatar = _this.$api.getStorage(
													"avatar", true) +
												"?time=" + new Date
											console.log(uploadFileRes);
											_this.$api.sucMsg("上传成功")
										} else
											_this.$api.errMsg("上传失败")
									}
								})
							}
						})
					})
				})
			},

			/**
			 * 获取用户微信名和头像
			 */
			updateWeiXinInfo() {
				const _this = this
				uni.showModal({
					title: '获取用户信息',
					content: '获取用户昵称和头像',
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击确定');
							_this.getUserInfo()
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})

			},
			/**
			 * 获取微信昵称和头像
			 */
			getUserInfo() {
				const _this = this
				if (uni.getUserProfile) {
					uni.getUserProfile({
						desc: '获取用户信息',
						success(infoRes) {
							console.log(infoRes);
							uni.login({
								provider: 'weixin',
								success(codeRes) {
									uni.request({
										url: _this.$api.path + 'Login/UploadInfo',
										method: 'POST',
										header: {
											'code': codeRes.code
										},
										data: {
											nick: infoRes.userInfo.nickName,
											avatar: infoRes.userInfo.avatarUrl,
										},
										success(res) {
											if (res.statusCode === 500) {
												_this.$api.setStorage("nick", res.data.user
													.nickName)
												_this.$api.setStorage("avatar", res.data
													.user
													.avatarPath)

												_this.nick = res.data.user.nickName
												_this.avatar = res.data.user.avatarPath

												_this.$api.errMsg(res.data.msg)
											} else if (res.statusCode === 200) {
												_this.$api.setStorage("nick", res.data
													.nickName)
												_this.$api.setStorage("avatar", res.data
													.avatarPath)
												_this.nick = res.data.nickName
												_this.avatar = res.data.avatarPath
												_this.$api.sucMsg('获取成功')
											} else if (res.statusCode === 403) {
												_this.$api.errMsg("您还未注册")
												_this.showReg()
											}
										}
									})
								}
							})
						},
						fail(res) {
							_this.$api.errMsg('获取失败')
							console.log(res);
						}
					})
				} else
					_this.$api.errMsg('无法获取用户信息')
			}
		}
	}
</script>

<style>
	.comment {
		align-items: center;
	}

	.top {
		width: 100%;
		height: 120rpx;
		margin: 20rpx 0;
		justify-content: center;
		align-items: center;
	}

	.top-left {
		width: 120rpx;
		height: 120rpx;
		margin-right: 20rpx;
	}

	.mid {
		width: 80%;
	}

	.mid-but {
		width: 100%;
		height: 80rpx;
		margin: 10rpx 0;
		line-height: 80rpx;
		align-items: center;
		justify-content: center;
	}

	.mid-info {
		width: 100%;
		margin: 10rpx 0;
	}

	.mid-info view:nth-child(1) {
		width: 50%;
	}

	.mid-info view:nth-child(2) {
		width: 50%;
	}


	.mid-left {}

	.mid-right {}

	.money-img {
		width: 64rpx;
		height: 64rpx;
	}

	.popup {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.6);
		z-index: 9998;
	}

	.popup-info {
		position: fixed;
		width: 550rpx;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: 30rpx;
		padding: 40rpx;
		border-radius: 20rpx;
		background-color: #fff;
		z-index: 9999;
	}

	.popup-info .but {
		width: 50%;
	}

	.close {
		width: 50rpx;
		height: 50rpx;
		align-self: flex-end;
	}
</style>
