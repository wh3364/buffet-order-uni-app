<template>
	<view class="comment">
		<view class="list-cell-navigate top-bar">
			<text :class="{'txstSelect': isSelect === 0}" @click="selectText(0)">进行中</text>
			<text :class="{'txstSelect': isSelect === 1}" @click="selectText(1)">历史</text>
			<text :class="{'txstSelect': isSelect === 2}" @click="selectText(2)">退单</text>
		</view>
		<view class="comment-body">
			<scroll-view scroll-y="true" @scrolltolower="loadMoreList" :style="{height: scrollHeight}"
				class="order-list">

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
				<view class="bottom-text unemp-color" v-if="nextPage === 0">~~没有了~~</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import {
		getOrderList
	} from "@/common/request/order.js"
	export default {
		data() {
			return {
				isSelect: -1,
				orderList: [],
				scrollHeight: 0,
				pageNum: 0,
				orderState: 0,
				nextPage: 0
			}
		},
		onShow() {
			console.log("onShow");
			this.selectText(0)
		},
		onLoad() {
			/**
			 * 获得scroll的高
			 */
			let _this = this;
			uni.getSystemInfo({
				success(res) {
					let wHeight = res.windowHeight
					let titleH = uni.createSelectorQuery().select(".comment-body");
					titleH.boundingClientRect(data => {
						_this.scrollHeight = wHeight - data.top + 'px'
					}).exec()
				}
			})
		},
		methods: {
			selectText(i) {
				if (i === this.isSelect) {
					return
				}
				this.isSelect = i
				switch (i) {
					case 0:
						this.orderState = 0
						this.pageNum = 1
						this.getOrderList()
						break;
					case 1:
						this.orderState = 3
						this.pageNum = 1
						this.getOrderList()
						break;
					case 2:
						this.orderState = 4
						this.pageNum = 1
						this.getOrderList()
						break;
					default:
				}
			},
			navToOrderDetail(id) {
				uni.navigateTo({
					url: "/pages/orderDetail/orderDetail?id=" + id
				})
			},
			getOrderList() {
				const orderState = this.orderState
				getOrderList({
					orderState
				}, this.pageNum).then((
					res) => {
					if (res.statusCode === 200) {
						this.orderList = res.data.orders.list
						this.nextPage = res.data.orders.nextPage
						this.orderList.forEach((item) => {
							item.orderJsonBody = JSON.parse(item.orderJsonBody)
							let count = 0
							item.orderJsonBody.forEach((i) => {
								count += i.nu
							})
							item.count = count
						})
					} else if (res.statusCode === 400) {
						this.$api.errMsg("订单异常")
					} else if (res.statusCode === 401) {
						this.getOrderList()
					}
				}).catch(() => {
					this.$api.errMsg("查询失败")
				})
			},
			loadMoreList() {
				if(!this.nextPage)
					return
				const orderState = this.orderState
				getOrderList({
					orderState
				}, this.nextPage).then((
					res) => {
					if (res.statusCode === 200) {
						let list = res.data.orders.list
						this.nextPage = res.data.orders.nextPage
						list.forEach((item) => {
							item.orderJsonBody = JSON.parse(item.orderJsonBody)
							let count = 0
							item.orderJsonBody.forEach((i) => {
								count += i.nu
							})
							item.count = count
						})
						this.orderList = this.orderList.concat(list)
					} else if (res.statusCode === 400) {
						this.$api.errMsg("订单异常")
					} else if (res.statusCode === 401) {
						this.getOrderList()
					}
				}).catch(() => {
					this.$api.errMsg("查询失败")
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #f5f5f5;
	}

	.comment-body {
		padding: 0;
	}

	.order-list {
		box-sizing: border-box;
		padding-top: 30rpx;
	}

	/* .order-list .order-item:first-child {
		margin-top: 0;
	}

	.order-list .order-item:last-child {
		margin-bottom: 0;
	} */

	.order-item {
		width: 90%;
		padding: 10rpx;
		margin-bottom: 30rpx;
		margin-left: 4%;
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
		border-bottom: #80D8FF 2rpx solid !important;
	}

	.bottom-text {
		width: 100%;
		text-align: center;
	}
</style>
