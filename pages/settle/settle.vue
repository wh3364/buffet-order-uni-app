<template>
	<view class="comment">
		<view class="comment-body top flex row">
			<text class="top-title">这里显示餐厅名</text>
			<view class="flex row top-way">
				<text :class="{'top-way-select' : cart.way === 0}" @click="changeWay()">线下点餐</text>
				<text :class="{'top-way-select' : cart.way === 1}" @click="changeWay()">外卖</text>
			</view>
		</view>
		<view class="mid-scroll" :style="{height: scrollHeight}">
			<scroll-view scroll-y="true" class="scroll-Y column" show-scrollbar="false">
				<view v-for="(item, index) in cart.body" :key="index" class="order">
					<view class="scroll-food-item flex row">
						<image class="item-left" :src="item.i" mode="aspectFit"></image>
						<view class="item-mid flex column">
							<text class="mid-name">{{item.n}}</text>
							<view class="mid-d" v-if="item.hD === 1 && item.m.length !== 0">额外配料:
								<text v-for="(m, i) in item.m" :key="i">{{m.n + ' '}}</text>
							</view>
							<view class="mid-d" v-if="item.hD === 1 && item.r.length !== 0">
								<text v-for="(r, i) in item.r" :key="i">{{r.n + ' '}}</text>
							</view>
						</view>
						<view v-if="item.hD === 0" class="item-right flex column">
							<text class="item-v">{{item.v * item.numb}}￥</text>
							<view class="meal-item-right flex row">
								<image v-if="item.numb < 1" class="add-sub-icon" :src="sub" mode="aspectFit"></image>
								<image v-else class="add-sub-icon" :src="canSub" mode="aspectFit"
									@click="cartSub(item, index)">
								</image>
								<text class="item-nub">{{item.numb}}</text>
								<image class="add-sub-icon" :src="canAdd" mode="aspectFit"
									@click="cartAdd(item, index)">
								</image>
							</view>
						</view>
						<view v-else class="item-right flex column">
							<text class="item-v">{{item.v}}￥</text>
							<button class="but-red" hover-class="but-red-hover"
								@click="delItem(item.v, index)">删除</button>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="bottom flex column ">
			<view class="bottom-total flex row">
				<text class="unemp-color">合计:</text>
				<text>{{total}}</text>
				<text class="main-color">￥</text>
			</view>
			<view class="bottom-but flex row">
				<button class="but-red" hover-class="but-red-hover" @click="back">取消</button>
				<button class="but" hover-class="but-hover" @click="doCreateOrder">下订单</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				canAdd: '../../static/img/icon/can-add.png',
				add: '../../static/img/icon/add.png',
				canSub: '../../static/img/icon/can-sub.png',
				sub: '../../static/img/icon/sub.png',
				scrollHeight: 0,
				cart: {
					body: [],
					way: 0,
					total: 0
				}
			}
		},
		computed: {
			total: {
				// getter
				get() {
					if (this.cart.total <= 0) {
						return 0
					}
					return this.cart.total.toFixed(2)
				}
			}
		},
		onReady() {
			/**
			 * 获得scroll的高
			 */
			let _this = this;
			uni.getSystemInfo({
				success(res) {
					let wHeight = res.windowHeight
					let titleH = uni.createSelectorQuery().select(".scroll-Y");
					let bottomH = uni.createSelectorQuery().select(".bottom");
					bottomH.boundingClientRect(data => {
						bottomH = data.height
					}).exec()
					titleH.boundingClientRect(data => {
						_this.scrollHeight = wHeight - data.top - bottomH + 'px'
					}).exec()
				}
			})
		},
		onLoad() {
			this.cart = this.$api.cart
			console.log(this.cart);
		},
		methods: {
			/**
			 * 选择配送方式
			 */
			changeWay() {
				if (this.cart.way === 0)
					this.cart.way = 1
				else if (this.cart.way === 1)
					this.cart.way = 0
			},
			back() {
				uni.navigateBack()
			},
			delItem(v, index) {
				this.cart.body.splice(index, 1)
				this.cart.total -= v
			},
			cartAdd(item, index) {
				item.numb++
				this.cart.total += item.v
			},
			cartSub(item, index) {
				item.numb--
				this.cart.total -= item.v
				if (item.numb === 0) {
					this.cart.body.splice(index, 1)
				}
			},
			doCreateOrder() {
				this.$api.useSessionLogin().then((session_key) => {
					this.createOrder({
						'data': this.cart
					}, {
						'session_key': session_key,
					})
				}).catch(() => {
					this.$api.useCodeLogin().then((code) => {
						this.createOrder({
							data: this.cart
						}, {
							'code': code,
						})
					})
				})
			},
			createOrder(data, header) {
				if (this.cart.total <= 0.0001) {
					this.$api.errMsg("购物车为空")
					return
				}
				this.$api.postRequest(this.mainPath + "Order/Create", data, header).then((res) => {
					if (res.statusCode === 200) {
						this.$api.cart = {
							body: [],
							way: 0,
							total: 0
						}
						this.cart = {
							body: [],
							way: 0,
							total: 0
						}
						this.$api.sucMsg("下单成功")
						uni.redirectTo({
							url: "/pages/orderDetail/orderDetail?id=" + res.data.order.orderId
						})

					} else if (res.statusCode === 401) {
						this.$api.useCodeLogin().then((code) => {
							this.createOrder({
								data: this.cart
							}, {
								'code': code,
							})
						})
					} else if (res.statusCode === 400) {
						this.$api.errMsg("订单异常")
					}
				}).catch((res) => {
					this.$api.errMsg("创建失败")
				})
			}
		}
	}
</script>

<style>
	.top {
		align-items: center;
		justify-content: space-between;
	}

	.top-title {
		font-size: 36rpx;
	}

	.top-way {
		width: 260rpx;
		border: 4rpx #80D8FF solid;
		border-radius: 20rpx;
	}

	.top-way text {
		width: 130rpx;
		height: 54rpx;
		line-height: 54rpx;
		text-align: center;
		font-size: 32rpx;
	}

	.top-way-select {
		background-color: #00B0FF !important;
		color: #FFF !important;
		border-radius: 10rpx;
	}

	.mid-scroll {
		width: 100%;
	}

	.scroll-Y {
		height: 100%;
	}

	.scroll-food-item {
		padding: 20rpx;
		border-bottom: 1rpx solid #80D8FF;
	}

	.item-left {
		width: 160rpx;
		height: 160rpx;
		margin-right: 20rpx;
	}

	.item-mid {
		width: 60%;
		justify-content: center;
	}

	.mid-name {}

	.mid-d {}

	.item-right {
		width: 30%;
		justify-content: center;
		align-items: center;
	}

	.but-red {

	}

	.meal-item-right {
		align-items: center;
		align-self: flex-end;
		margin-right: 20rpx;
		margin-bottom: 20rpx;
	}

	.item-nub {
		width: 50rpx;
		margin: 0 10rpx;
		text-align: center;
		font-size: 30rpx;
	}

	.item-v {
		font-size: 30rpx;
		margin: 10rpx 0;
	}

	.bottom-total {
		margin-left: 60rpx;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.bottom-total text:nth-child(2) {
		margin-left: 10rpx;
		margin-right: 4rpx;
		font-size: 46rpx;
		font-weight: 600;
	}

	.bottom-total text:nth-child(3) {
		font-size: 40rpx;
		font-weight: 500;
	}

	.bottom {
		width: 100%;
		justify-content: space-between;
	}

	.bottom-but {
		justify-content: space-between;
	}

	.bottom button {
		width: 48%;
		margin: 0;
	}
</style>
