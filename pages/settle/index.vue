<template>
	<view class="comment">
		<view class="comment-body top flex row">
			<text class="top-title">这里显示餐厅名</text>
			<view class="flex row top-way">
				<text :class="{'top-way-select' : way === 0}" @click="changeWay()">线下点餐</text>
				<text :class="{'top-way-select' : way === 1}" @click="changeWay()">外卖</text>
			</view>
		</view>
		<view class="mid-scroll" :style="{height: scrollHeight}">
			<scroll-view scroll-y="true" class="scroll-Y column">
				<view v-for="(item, index) in body" :key="index" class="order">
					<view class="scroll-food-item flex row">
						<image class="item-left" :src="item.foodImg" mode="aspectFit"></image>
						<view class="item-mid flex column">
							<text class="mid-name">{{item.foodName}}</text>
							<view class="mid-d" v-if="item.haveDetail === 1 && item.m.length !== 0">额外配料:
								<text v-for="(m, i) in item.m" :key="i">{{m.n + ' '}}</text>
							</view>
							<view class="mid-d" v-if="item.haveDetail === 1 && item.r.length !== 0">
								<text v-for="(r, i) in item.r" :key="i">{{r.n + ' '}}</text>
							</view>
						</view>
						<view v-if="item.haveDetail === 0" class="item-right flex column">
							<text class="item-v">{{(item.foodPrice * item.numb).toFixed(2)}}￥</text>
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
							<text class="item-v">{{item.foodPrice}}￥</text>
							<button class="but-red" hover-class="but-red-hover"
								@click="delItem(item, index)">删除</button>
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
				<button class="but" hover-class="but-hover" @click="showCreateOrder">下订单</button>
			</view>
		</view>
	</view>
</template>

<script>
	import store from '@/store'
	import {
		mapState
	} from 'vuex'
	import { createOrder } from "@/common/request/order.js"
	export default {
		data() {
			return {
				canAdd: '../../static/img/icon/can-add.png',
				add: '../../static/img/icon/add.png',
				canSub: '../../static/img/icon/can-sub.png',
				sub: '../../static/img/icon/sub.png',
				scrollHeight: 0,
			}
		},
		computed: {
			...mapState({
				total: store => store.cart.total,
				way: store => store.cart.way,
				body: store=> store.cart.body
			})
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

		},
		methods: {
			/**
			 * 选择配送方式
			 */
			changeWay() {
				store.dispatch('cart/changeWay')
			},
			back() {
				uni.navigateBack()
			},
			delItem(item, index) {
				store.dispatch('cart/delFoodByCart', item)
			},
			cartAdd(item, index) {
				item.numb++
				store.dispatch('cart/addFoodByBut', item)
			},
			cartSub(item, index) {
				item.numb--
				store.dispatch('cart/subFoodByBut', item)
			},
			showCreateOrder(){
				const _this = this
				let way
				this.way ? way = '外卖' : way = '线下点餐'
				uni.showModal({
					title: '是否要下订单',
					content: `配送方式:${way}`,
					success: function(res) {
						if (res.confirm) {
							_this.createOrder()
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			},
			createOrder() {
				if (this.total <= 0.0001) {
					this.$api.errMsg("购物车为空")
					return
				}
				const body = this.body.map(item => item = {
					id: item.foodId,
					hD: item.haveDetail,
					numb: item.numb,
					m: item.m,
					r: item.r
				})
				const way = this.way
				createOrder({ body, way }).then((res) => {
					if (res.statusCode === 200) {
						if (res.data.code === 1) {
							store.dispatch('cart/emptyCart')
							this.$api.sucMsg("下单成功")
							setTimeout(()=>{
								uni.redirectTo({
									url: "/pages/orderDetail/index?id=" + res.data.order.orderId
								})
							}, 500)
						} else if (res.data.code === 2) {
							uni.showModal({
								title: '创建失败',
								content: res.data.msg,
								showCancel: false,
								success: function(res) {
									if (res.confirm) {
										console.log('用户点击确定');
									}
								}
							})
						}
					} else if (res.statusCode === 401) {
						this.createOrder()
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

	.but-red {}

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
