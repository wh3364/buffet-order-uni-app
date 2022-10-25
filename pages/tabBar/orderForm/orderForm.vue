<template>
	<view class="comment">
		<view class="list-cell-navigate top-bar">
			<text :class="{'txstSelect': isSelect === 0}" @click="selectText(0)">进行中</text>
			<text :class="{'txstSelect': isSelect === 1}" @click="selectText(1)">历史</text>
			<text :class="{'txstSelect': isSelect === 2}" @click="selectText(2)">退单</text>
		</view>
		<view class="comment-body">
			<view class="order-list">

				<view v-for="(order, index) in orderList" :key="index" class="order-item"
					@click="navToOrderDetail(order.orderId)">
					<view class="top-order row">
						<text>这里显示餐厅名</text>
						<text v-if="order.orderState === 0" class="unemp-color">待付款</text>
						<text v-else-if="order.orderState === 1" class="unemp-color">已付款</text>
						<text v-else-if="order.orderState === 2" class="unemp-color">发货中</text>
						<text v-else-if="order.orderState === 3" class="unemp-color">已完成</text>
						<text v-else-if="order.orderState === 4" class="unemp-color">已取消</text>
						<text v-else class="unemp-color">这里显示订单状态</text>
					</view>
					<scroll-view class="mid-order" scroll-x="true">
						<image v-for="(item, index) in order.orderJsonBody" :key="index" :src="item.img"></image>
					</scroll-view>
					<view class="bottom-order row">
						<text class="unemp-color">{{order.orderCreateTime}}</text>
						<view class="flex">
							<text>共{{order.count}}件</text>
							<text>{{order.orderShouldPay}}￥</text>
						</view>
					</view>
				</view>


			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isSelect: 0,
				orderList: []
			}
		},
		onShow() {
			console.log("onShow");
			this.doGetOrderList()
		},
		onLoad() {

		},
		methods: {
			selectText(i) {
				this.isSelect = i
				switch (i) {
					case 0:
						break;
					case 1:
						break;
					case 2:
						break;
					default:
				}
			},
			navToOrderDetail(id) {
				uni.navigateTo({
					url: "/pages/orderDetail/orderDetail?id=" + id
				})
			},

			doGetOrderList() {
				this.$api.useSessionLogin().then((session_key) => {
					this.getOrderList({
						'session_key': session_key,
					})
				}).catch(() => {
					this.$api.useCodeLogin().then((code) => {
						this.getOrderList({
							'code': code,
						})
					})
				})
			},
			getOrderList(header) {
				this.$api.postRequest(this.mainPath + "Order/GetOrderList", null, header).then((res) => {
					if (res.statusCode === 200) {
						this.orderList = res.data.orders
						this.orderList.forEach((item) => {
							item.orderJsonBody = JSON.parse(item.orderJsonBody)
							let count = 0
							item.orderJsonBody.forEach((i) => {
								count += i.nu
							})
							item.count = count
						})
						console.log(this.orderList);
					} else if (res.statusCode === 400) {
						this.$api.errMsg("订单异常")
					} else if (res.statusCode === 401) {
						this.$api.useCodeLogin().then((code) => {
							this.getOrderList({
								'code': code,
							})
						})
					}
				}).catch((res) => {
					this.$api.errMsg("查询失败")
				})
			},

			/**
			 * 注册
			 */
			regUser() {
				const _this = this
				uni.showModal({
					title: '当前用户未注册',
					content: '是否立即注册',
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击确定');
							_this.$api.regUser().then((res) => {
								if (res.statusCode === 200) {
									_this.$api.sucMsg("注册成功")
								}
							}).catch((res) => {
								_this.$api.errMsg("注册失败")
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #f5f5f5;
	}

	.order-list {
		box-sizing: border-box;
	}

	.order-list .order-item:first-child {
		margin-top: 0;
	}

	.order-list .order-item:last-child {
		margin-bottom: 0;
	}

	.order-item {
		width: 100%;
		padding: 10rpx;
		margin: 40rpx 0;
		background-color: white;
		border-radius: 20rpx;
		box-shadow: 2px 2px 4px #696969;
	}

	.top-order {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.top-order text {
		font-size: 32rpx
	}

	.top-order text:last-child {
		font-size: 26rpx
	}

	.mid-order {
		width: 100%;
		margin: 10rpx 0;
		white-space: nowrap;
	}

	.mid-order image {
		width: 160rpx;
		height: 160rpx;
		margin: 0 10rpx;
		background-color: aqua;
	}

	.mid-order image:first-child {
		margin-left: 0;
	}

	.mid-order image:last-child {
		margin-right: 0;
	}

	.bottom-order {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.bottom-order text {
		font-size: 26rpx;
	}

	.bottom-order .flex {
		align-items: flex-end;
	}

	.bottom-order .flex text {
		color: #777;
		font-size: 26rpx;
	}

	.bottom-order .flex text:last-child {
		color: #343434;
		margin-left: 10rpx;
		font-size: 36rpx;
	}

	.top-bar {
		height: 80rpx;
		background-color: #FFF;
		font-size: 38rpx;
		line-height: 80rpx;
		display: flex;
		box-sizing: border-box;
		width: 100%;
		justify-content: space-between;
		align-items: center;
	}

	.top-bar text {
		width: 100%;
		height: 100%;
		text-align: center;
	}

	.txstSelect {
		color: #00B0FF !important;
		border-bottom: #80D8FF 4rpx solid !important;
	}
</style>
