<template>
	<view class="comment">
		<swiper class="swiper" circular indicator-dots=true autoplay=true interval=8000 duration=500>
			<swiper-item>
				<view class="bg-red swiper-item">
					<image :src="swiperItems[0]" mode=aspectFill></image>
				</view>
			</swiper-item>
			<swiper-item>
				<view class="bg-green swiper-item">
					<image :src="swiperItems[1]" mode=aspectFill></image>
				</view>
			</swiper-item>
			<swiper-item>
				<view class="bg-blue swiper-item">
					<image :src="swiperItems[2]" mode=aspectFill></image>
				</view>
			</swiper-item>
		</swiper>
		<view>
			<button class="but tab-bar-meal" @click="tabBarToMeal">立即点餐</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				swiperItems:[
					"http://localhost:8080/BuffetOrder/img/00282-26029825.png", 
					"http://localhost:8080/BuffetOrder/img/00283-3828490356.png", 
					"http://localhost:8080/BuffetOrder/img/00284-1374461210.png"
				],
			}
		},
		onLoad() {
			
		},
		methods: {
			test() {
				this.$api.setStorage("test", "test123")
				this.$api.getStorage("test")
			},
			tabBarToMeal() {
				uni.switchTab({
					url: "/pages/tabBar/orderMeal/index"
				})
			}
		}
	}
</script>

<style>
	.swiper {
		height: 500rpx;
	}

	.swiper-item {
		height: 500rpx;
		line-height: 500rpx;
		display: block;
		text-align: center;
	}

	.swiper-item image {
		width: 100%;
		height: 100%;
	}

	.tab-bar-meal {
		margin-top: 20rpx;
	}
</style>
