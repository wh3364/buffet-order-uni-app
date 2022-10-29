<template>
	<view class="comment">
		<view class="comment-body top flex row">
			<text class="top-title">这里显示餐厅名</text>
			<view class="flex row top-way">
				<text :class="{'top-way-select' : cart.way === 0}" @click="changeWay()">线下点餐</text>
				<text :class="{'top-way-select' : cart.way === 1}" @click="changeWay()">外卖</text>
			</view>
		</view>
		<view class="mid flex row" :style="{height: scrollHeight}">
			<view class="mid-left">
				<scroll-view scroll-y="true" class="scroll-Y column" show-scrollbar="false">
					<view v-for="(item, index) in cates" :key="index" :class="{'select-order-class' : slCate === index}"
						class="scroll-order-class" @click="selectCate(index)">{{item.cateName}}</view>
				</scroll-view>
			</view>
			<view class="mid-right">
				<view v-if="cates != []" class="class-name-text">{{cates[slCate].cateName}}</view>
				<scroll-view scroll-y="true" class="order-meal scroll-Y column" show-scrollbar="false"
					:style="{height: scrollHeight1}">

					<view class="order-meal-item flex" v-for="(item, index) in showFoods" :key="index">
						<view class="flex row">
							<image class="item-img" :src="item.foodImg" mode="aspectFit"></image>
							<view class="item-mid flex column">
								<text class="item-name">{{item.foodName}}</text>
								<text class="item-note unemp-color">{{item.foodNote}}</text>
								<view class="item-momey">
									{{item.foodPrice}}
									<text class="main-color">￥</text>
									<text v-if="item.haveDetail === 1" class="unemp-color"
										style="font-size: 22rpx;">起</text>
								</view>
							</view>
						</view>
						<view v-if="item.haveDetail === 1" class="meal-item-right flex row">
							<button class="select-speci but" hover-class="but-hover"
								@click="openDetail(item)">选择规格</button>
						</view>
						<view v-else class="meal-item-right flex row">
							<image v-if="item.numb < 1" class="add-sub-icon" :src="sub" mode="aspectFit"></image>
							<image v-else class="add-sub-icon" :src="canSub" mode="aspectFit" @click="cartSub(item)">
							</image>
							<text class="item-nub">{{item.numb}}</text>
							<image class="add-sub-icon" :src="canAdd" mode="aspectFit" @click="cartAdd(item)"></image>
						</view>
					</view>

				</scroll-view>
			</view>
		</view>
		<view class="bottom flex row">
			<view class="bottom-left flex row">
				<text class="unemp-color">合计:</text>
				<text>{{total}}</text>
				<text class="main-color">￥</text>
			</view>
			<button class="bottom-right but" hover-class="but-hover" @click="navigateToSettle">购物车</button>
		</view>
	</view>

	<view class="popup" v-if="popup">
		<view class="popup-info">
			<view class="popup-top flex">
				<text class="top-food-name">{{food.foodName}}</text>
				<image class="close" src="../../../static/img/icon/close.png" mode="aspectFit" @click="hidDetail">
				</image>
			</view>
			<view class="dM">
				<text>{{dM.mI}}</text>
				<view class="d-body flex row">
					<view v-for="(item, index) in dM.mS" :key="index" @click="selectDmItem(index, item.v, item.s)"
						:class="{'d-item-select' : item.s === 1 }" class="d-item flex row">
						<text>{{item.n}}</text>
						<text>￥{{item.v}}</text>
					</view>
				</view>
			</view>

			<view v-for="(item, index) in dR" :key="index" class="dR">
				<text>{{item.rI}}</text>
				<view class="d-body flex row">
					<view v-for="(it, i) in item.rS" :key="i" @click="selectDrItem(i, item.rS)"
						:class="{'d-item-select' : it.s === 1 }" class="d-item flex row">
						<text>{{it.n}}</text>
						<text v-if="it.v === 0"></text>
						<text v-else>￥{{it.v}}</text>
					</view>
				</view>
			</view>


			<view class="popup-bottom flex row">
				<text class="item-momey">{{singlePrice}}￥</text>
				<button class="but" hover-class="but-hover" @click="addToCart">添加购物车</button>
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				windowHeight: 0,
				scrollHeight: 0,
				scrollHeight1: 0,
				canAdd: '../../../static/img/icon/can-add.png',
				add: '../../../static/img/icon/add.png',
				canSub: '../../../static/img/icon/can-sub.png',
				sub: '../../../static/img/icon/sub.png',
				popup: false,
				cates: [],
				foods: [],
				showFoods: [],
				slCate: 0,



				food: {

				},
				dM: {
					mI: '',
					mS: []
				},
				dR: [],
				price: 0,
				cart: {
					body: [],
					way: 0,
					total: 0
				}

			}
		},
		computed: {
			singlePrice: {
				// getter
				get() {
					if (this.price <= 0) {
						return 0
					}
					return this.price.toFixed(2)
				}
				// setter
				// set(newValue) {
				// 	var names = newValue.split(' ')
				// 	this.firstName = names[0]
				// 	this.lastName = names[names.length - 1]
				// }
			},
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
		onLoad() {

		},
		onShow() {
			console.log("onShow");
			// if (this.$api.cart.body.length !== 0) {
			// 	this.$api.cart = this.cart
			// 	this.cart.body.forEach((item) => {
			// 		if (item.hD === 0) {
			// 			for (let i = 0; i < this.foots.length; i++) {
			// 				if (this.foots[i].footId === item.id) {
			// 					this.foots[i].numb = item.numb
			// 				}
			// 			}
			// 		}
			// 	})
			// 	console.log(this.cart);
			// } else {
				
			// }
			this.cart = this.$api.cart
			this.getAllCate()
			this.getAllFood()
		},
		onReady() {
			/**
			 * 获得scroll的高
			 */
			let _this = this;
			uni.getSystemInfo({
				success(res) {
					let wHeight = res.windowHeight
					let titleH = uni.createSelectorQuery().select(".mid-left");
					let bottomH = uni.createSelectorQuery().select(".bottom");
					bottomH.boundingClientRect(data => {
						bottomH = data.height
					}).exec()
					titleH.boundingClientRect(data => {
						_this.scrollHeight = wHeight - data.top - bottomH + 'px'
					}).exec()
					titleH = uni.createSelectorQuery().select(".order-meal");
					titleH.boundingClientRect(data => {
						_this.scrollHeight1 = wHeight - data.top - bottomH + 'px'
					}).exec()
				}
			})
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
			/**
			 * @param {Object} o
			 * 打开详细选择
			 */
			openDetail(o) {
				this.popup = true
				this.food.foodId = o.foodId
				this.food.foodName = o.foodName
				this.food.haveDetail = o.haveDetail
				this.food.foodImg = o.foodImg
				const d = JSON.parse(o.foodDetail)
				this.dM = d.dM
				this.dR = d.dR
				console.log(this.dM);
				console.log(this.dR);
				console.log(this.food);
				this.price = o.foodPrice
			},
			/**
			 * 关闭详细选择
			 */
			hidDetail() {
				this.popup = false
				this.food = {}
				this.dM = null
				this.dR = null
				this.price = 0
			},
			/**
			 * @param {int} index
			 * @param {int} p
			 * @param {int} s
			 * 多选
			 */
			selectDmItem(index, p, s) {
				if (s === 1) {
					this.price -= p
					s = 0
				} else {
					this.price += p
					s = 1
				}
				this.dM.mS[index].s = s
			},
			/**
			 * @param {int} index
			 * @param {object} rS
			 * 单选
			 */
			selectDrItem(index, rS) {
				if (rS[index].s === 1) {
					return
				}
				for (let i = 0; i < rS.length; i++) {
					console.log(rS[i]);
					if (rS[i].s === 1) {
						this.price -= rS[i].v
					}
					if (i === index) {
						rS[i].s = 1
						this.price += rS[i].v
					} else {
						rS[i].s = 0
					}
				}
				
			},
			/**
			 * 添加购物车
			 */
			addToCart() {
				console.log(this.dM);
				console.log(this.dR);
				console.log(this.food);
				let cartFood = {}
				cartFood.id = this.food.foodId
				cartFood.n = this.food.foodName
				cartFood.hD = this.food.haveDetail
				cartFood.i = this.food.foodImg
				cartFood.v = this.price
				if (cartFood.hD === 1) {
					let mS = new Array()
					let rS = new Array()
					if (this.dM != null) {
						for (let i = 0; i < this.dM.mS.length; i++) {
							if (this.dM.mS[i].s === 1) {
								let m = {}
								m.s = i
								m.n = this.dM.mS[i].n
								mS.push(m)
							}
						}
					}
					if (this.dR != null) {
						this.dR.forEach((item) => {
							for (let i = 0; i < item.rS.length; i++) {
								if (item.rS[i].s === 1) {
									let s = {}
									s.s = i
									s.n = item.rS[i].n
									rS.push(s)
								}
							}
						})
					}
					cartFood.m = mS
					cartFood.r = rS
				}
				this.cart.body.push(cartFood)
				this.cart.total += this.price
			},
			/**
			 * @param {Object} o
			 * 添加按钮
			 */
			cartAdd(o) {
				o.numb++
				let cartFood = {}
				let flag = true
				for (let i = 0; i < this.cart.body.length; i++) {
					if (this.cart.body[i].id === o.foodId) {
						flag = false
						this.cart.body[i].numb = o.numb
					}
				}
				if (flag) {
					cartFood.id = o.foodId
					cartFood.n = o.foodName
					cartFood.hD = o.haveDetail
					cartFood.i = o.foodImg
					cartFood.numb = o.numb
					cartFood.v = o.foodPrice
					this.cart.body.push(cartFood)
				}
				this.cart.total += o.foodPrice
				console.log(this.cart);
			},
			/**
			 * @param {Object} o
			 * 消除按钮
			 */
			cartSub(o) {
				o.numb--
				let cartFood = {}
				if (o.numb === 0) {
					cartFood.id = o.foodId
					cartFood.n = o.foodName
					cartFood.hD = o.haveDetail
					cartFood.i = o.foodImg
					cartFood.numb = 0
					cartFood.v = o.foodPrice
					this.cart.body.splice(cartFood, 1)

					this.cart.total -= o.foodPrice
					console.log(this.cart);
					return
				}
				for (let i = 0; i < this.cart.body.length; i++) {
					if (this.cart.body[i].id === o.foodId) {
						this.cart.body[i].numb = o.numb
					}
				}
				this.cart.total -= o.foodPrice
				console.log(this.cart);
			},
			/**
			 * 去结算
			 */
			navigateToSettle() {
				let arr = new Array()
				for (let i = 0; i < this.cart.body.length; i++) {
					if (this.cart.body[i].numb !== 0) {
						arr.push(this.cart.body[i])
					}
				}
				this.cart.body = arr
				this.$api.cart = this.cart
				uni.navigateTo({
					url: "/pages/settle/settle"
				})
			},
			/**
			 * 获得所有分类
			 */
			getAllCate() {
				this.$api.getRequest(this.mainPath + 'Food/GetAllCate').then((res) => {
					if (res.statusCode === 200) {
						this.cates = res.data
					} else
						this.$api.errMsg("请求失败")
				}).catch((res) => {
					this.$api.errMsg("请求失败")
				})
			},
			/**
			 * 获得所有食物
			 */
			getAllFood() {
				this.$api.getRequest(this.mainPath + 'Food/GetAllFood').then((res) => {
					if (res.statusCode) {
						this.foods = res.data
						for (let i = 0; i < this.foods.length; i++) {
							if (this.foods[i].haveDetail === 0) {
								const foodIncart = this.$api.cart.body.find(item => {
									return this.foods[i].foodId == item.id
								})
								if (foodIncart != null) {
									this.foods[i].numb = foodIncart.numb
								} else {
									this.foods[i].numb = 0
								}
							}
						}
						this.selectCate(0)
					} else
						this.$api.errMsg("请求失败")
				}).catch((res) => {
					this.$api.errMsg("请求失败")
				})
			},
			/**
			 * @param {int} index
			 * 点击分类触发
			 */
			selectCate(index) {
				this.slCate = index
				this.showFoods = this.foods.filter((item) => {
					return this.cates[index].cateId === item.foodCate
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

	.mid-left {
		width: 20%;
	}

	.scroll-order-class {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 180rpx;
		text-align: center;
		font-size: 34rpx;
		background-color: #eaeaea;
		color: #343434;
	}
	.select-order-class {
		background-color: #00B0FF;
		color: #FFF;
	}

	.scroll-Y {
		width: 100%;
		height: 100%;
	}

	.class-name-text {
		height: 60rpx;
		padding-left: 20rpx;
		line-height: 60rpx;
		font-size: 36rpx;
	}

	.mid-right {
		width: 100%;
	}

	.order-meal-item {
		width: 100%;
		height: 220rpx;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid #80D8FF;
	}
	.order-meal .order-meal-item:last-child{
		border-bottom: none;
	}

	.item-img {
		width: 200rpx;
		height: 200rpx;
	}

	.item-mid {
		margin-left: 20rpx;
	}

	.item-name {
		font-size: 36rpx
	}

	.item-note {
		font-size: 26rpx
	}

	.item-momey {
		height: 100%;
		display: flex;
		align-items: flex-end;
		font-size: 40rpx
	}

	.item-momey text {
		font-size: 40rpx
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

	.select-speci {
		width: 140rpx;
		height: 48rpx;
		padding: 0 2rpx;
		font-size: 30rpx;
		line-height: 48rpx;
		border-radius: 20rpx;
	}

	.bottom {
		width: 100%;
		height: 100rpx;
		align-items: center;
		justify-content: space-between;
	}

	.bottom-left {
		margin-left: 60rpx;
		align-items: center;
	}

	.bottom-left text:nth-child(2) {
		margin-left: 10rpx;
		margin-right: 4rpx;
		font-size: 46rpx;
		font-weight: 600;
	}

	.bottom-left text:nth-child(3) {
		font-size: 40rpx;
		font-weight: 500;
	}

	.bottom-right {
		height: 80rpx;
		line-height: 80rpx;
		margin: 0 60rpx 0 0;
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
		width: 600rpx;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: 30rpx;
		padding: 40rpx;
		border-radius: 20rpx;
		background-color: #fff;
		z-index: 9999;
	}

	.top-food-name{
		margin: 10rpx 0;
		font-size: 32rpx
	}

	.dM {}

	.d-body {
		width: 100%;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.d-item {
		width: 30%;
		height: 50rpx;
		margin: 10rpx 0;
		align-items: center;
		justify-content: center;
		border: 1rpx solid #00B0FF;
		border-radius: 20rpx;
	}

	.d-item-select {
		background-color: #00B0FF;
		border: 1rpx solid #00B0FF;
		border-radius: 20rpx;
	}

	.d-item-select text {
		color: #FFF !important;
	}

	.d-item text {
		color: #343434;
		font-size: 26rpx;
		text-align: center;
	}

	.d-item text:first-child {
		width: 70%;
	}

	.d-item text:last-child {
		width: 30%;
	}

	.popup-bottom {
		margin-top: 20rpx;
		align-items: center;
		justify-content: space-between;
	}

	.popup-bottom button {
		height: 60rpx;
		margin: 0;
		line-height: 60rpx;
		font-size: 30rpx;
	}

	.popup-top {
		justify-content: space-between;
	}

	.close {
		width: 40rpx;
		height: 40rpx;
	}
</style>
