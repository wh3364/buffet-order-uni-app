<template>
	<view class="comment">
		<view class="top flex row">
			<text>餐厅名</text>
			<text v-if="order.orderState === 0">待付款</text>
			<text v-else-if="order.orderState === 1">已付款</text>
			<text v-else-if="order.orderState === 2">发货中</text>
			<text v-else-if="order.orderState === 3">已完成</text>
			<text v-else-if="order.orderState === 4">已取消</text>
			<text v-else>订单状态</text>
		</view>
		<view class="mid">
			<view v-for="(item, index) in order.orderJsonBody" :key="index" class="order-item flex row">
				<view class="item-left flex row">
					<image :src="item.img" class="item-img"></image>
					<view class="item-text flex column">
						<text>{{item.na}}</text>
						<text class="unemp-color">{{item.de}}</text>
						<text>×{{item.nu}}</text>
					</view>
				</view>
				<text class="item-right">{{item.pr}}￥</text>
			</view>

			<view class="item-bottom flex row">
				<text class="unemp-color">共{{count}}件,合计</text>
				<text>￥{{total}}</text>
			</view>
		</view>
		<view class="bottom flex column">
			<view class="flex row">
				<text class="bottom-left unemp-color">下单时间</text>
				<text class="bottom-right">{{order.orderCreateTime}}</text>
			</view>
			<view class="flex row">
				<text class="bottom-left unemp-color">取餐方式</text>
				<text v-if="order.orderWay === 0" class="bottom-right">线下点餐</text>
				<text v-else-if="order.orderWay === 1" class="bottom-right">外卖</text>
				<text v-else class="bottom-right">取餐方式</text>

			</view>
			<view v-if="order.orderWay === 0" class="flex row">
				<text class="bottom-left unemp-color">取餐码</text>
				<text class="bottom-right">{{order.orderGetNumb}}</text>
			</view>
			<view v-if="order.orderWay === 1" class="flex row">
				<text class="bottom-left unemp-color">地址</text>
				<text class="bottom-right">{{order.orderAddress}}</text>
			</view>
			<view class="flex row">
				<text class="bottom-left unemp-color">备注</text>
				<text class="bottom-right">{{order.orderNote}}</text>
			</view>
			<view class="flex row">
				<text class="bottom-left unemp-color">订单号</text>
				<text class="bottom-right">{{order.orderId}}</text>
			</view>
		</view>
		<view v-if="order.orderState === 0 && time > -1" class="time unemp-color">{{ timeStr }}后自动取消订单</view>
		<view v-if="order.orderState === 0" class="bottom-but">
			<button class="bottom-but but" hover-class="but-hover" @click="showPayOrder">支付</button>
			<button class="bottom-but but-red" hover-class="but-red-hover" @click="showCancelOrder">取消订单</button>
		</view>
		<view v-if="order.orderState === 2" class="bottom-but">
			<button class="bottom-but but" hover-class="but-hover" @click="showCompleteOrder">完成订单</button>
		</view>
	</view>
</template>

<script>
	import {
		timeStamp
	} from "@/common/countdown.js"
	import {
		getOrder,
		completeOrder,
		cancelOrder,
		payOrder
	} from "@/common/request/order.js"
	export default {
		data() {
			return {
				order: {},
				orderId: 0,
				time: -1,
				timeStr:'',
				interval: null,
				itemTotal: 0,
				itemCount: 0
			}
		},
		computed: {
			total: {
				// getter
				get() {
					if (this.itemTotal <= 0)  return 0
					return this.itemTotal.toFixed(2)
				}
			},
			count: {
				// getter
				get() {
					if (this.itemCount <= 0)  return 0
					return this.itemCount
				}
			}
		},
		onLoad(param) {
			if (param.id) {
				this.orderId = param.id
				this.getOrder()
			}
		},
		// onHide(){
		// 	console.log("onHide");
		// },
		onUnload() {
			this.stopInterval()
		},
		methods: {
			showPayOrder() {
				const _this = this
				uni.showModal({
					title: '是否要付款',
					success: function(res) {
						if (res.confirm) {
							_this.payOrder()
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			},
			payOrder(data, header) {
				const orderId = this.orderId
				payOrder({
					orderId
				}).then((res) => {
					if (res.statusCode === 200) {
						if (res.data.code === 0) {
							this.$api.errMsg(res.data.msg)
						} else if (res.data.code === 1) {
							this.$api.sucMsg(res.data.msg)
							this.order.orderState = 1
						}
						this.stopInterval()
					} else if (res.statusCode === 401) {
						this.payOrder()
					} else if (res.statusCode === 400) {
						this.$api.errMsg("订单异常")
					}
				}).catch((res) => {
					this.$api.errMsg("订单异常")
				})
			},
			showCancelOrder() {
				const _this = this
				uni.showModal({
					title: '是否要取消订单',
					success: function(res) {
						if (res.confirm) {
							_this.cancelOrder()
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			},
			cancelOrder() {
				const orderId = this.orderId
				cancelOrder({
					orderId
				}).then((res) => {
					if (res.statusCode === 200) {
						if (res.data.code === 0) {
							this.$api.errMsg(res.data.msg)
						} else if (res.data.code === 1) {
							this.$api.sucMsg(res.data.msg)
							this.order.orderState = 4
						}
						this.stopInterval()
					} else if (res.statusCode === 401) {
						this.cancelOrder()
					} else if (res.statusCode === 400) {
						this.$api.errMsg("订单异常")
					}
				}).catch((res) => {
					this.$api.errMsg("订单异常")
				})
			},
			showCompleteOrder() {
				const _this = this
				uni.showModal({
					title: '是否要完成订单',
					success: function(res) {
						if (res.confirm) {
							_this.completeOrder()
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			},
			completeOrder() {
				const orderId = this.orderId
				completeOrder({
					orderId
				}).then((res) => {
					if (res.statusCode === 200) {
						if (res.data.code === 0) {
							this.$api.errMsg(res.data.msg)
						} else if (res.data.code === 1) {
							this.$api.sucMsg(res.data.msg)
							this.order.orderState = 3
						}
					} else if (res.statusCode === 401) {
						this.completeOrder()
					} else if (res.statusCode === 400) {
						this.$api.errMsg("订单异常")
					}
				}).catch((res) => {
					this.$api.errMsg("订单异常")
				})
			},
			getOrder() {
				const orderId = this.orderId
				getOrder({
					orderId
				}).then((res) => {
					if (res.statusCode === 200) {
						this.order = res.data.order
						this.order.orderJsonBody = JSON.parse(res.data.order.orderJsonBody)
						let count = 0
						let total = 0
						this.order.orderJsonBody.forEach((item) => {
							count += item.nu
							total += item.pr
						})
						this.itemCount = count
						this.itemTotal = total
						if (this.order.orderState === 0) this.startInterval(res.data.time)
						console.log(this.order);
					} else if (res.statusCode === 401) {
						this.getOrder()
					} else if (res.statusCode === 400) {
						this.$api.errMsg("订单异常")
					}
				}).catch((res) => {
					this.$api.errMsg("订单异常")
					this.stopInterval()
				})
			},
			startInterval(time) {
				this.interval = setInterval(() => {
					const obj = timeStamp(time / 1000 + 60 * 30)
					this.time = obj.time
					this.timeStr = obj.str
					console.log(this.time);
					if (this.time < 0) {
						this.stopInterval()
					}
				}, 1000)
			},
			stopInterval(){
				clearInterval(this.interval)
				this.interval = null
			}
		}
	}
</script>

<style>
	page {
		background-color: #f5f5f5;
	}

	.comment {
		padding: 20rpx 40rpx;
	}

	.top {
		margin-bottom: 20rpx;
		justify-content: space-between;
	}

	.top text {
		font-size: 36rpx
	}

	.mid {
		padding: 20rpx 30rpx;
		background-color: #fff;
		border-radius: 30rpx;
		box-shadow: 2px 2px 4px #696969;
	}

	.mid .order-item:last-child {
		border: none;
	}

	.order-item {
		justify-content: space-between;
		border-bottom: 1rpx solid #696969;
	}

	.item-left {
		align-items: center;
	}

	.item-img {
		width: 120rpx;
		height: 120rpx;
	}

	.item-text {
		margin-left: 20rpx;
	}

	.item-text text:nth-child(1) {
		font-size: 30rpx;
	}

	.item-text text:nth-child(2) {
		font-size: 22rpx;
	}

	.item-text text:nth-child(3) {}

	.item-right {
		align-self: flex-start;
		font-size: 36rpx;
	}

	.item-bottom {
		align-items: center;
		justify-content: flex-end;
	}

	.item-bottom text:last-child {
		font-size: 40rpx
	}

	.time{
		margin-top: 20rpx;
		text-align: center;
	}

	.bottom {
		margin-top: 30rpx;
		padding: 20rpx 30rpx;
		background-color: #fff;
		border-radius: 30rpx;
		box-shadow: 2px 2px 4px #696969;
	}

	.bottom view {
		align-items: center;
	}

	.bottom view text {
		font-size: 30rpx;
	}

	.bottom-left {
		width: 26%;
	}

	.but {
		margin-top: 20rpx;
	}

	.bottom-but {
		margin-top: 20rpx;
	}
</style>
