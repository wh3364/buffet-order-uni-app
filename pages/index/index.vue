<template>
	<view class="comment">
		<swiper class="swiper" circular indicator-dots=true autoplay=true interval=8000 duration=500>
			<swiper-item>
				<view class="bg-red swiper-item">
					<image :src="swiperItems[0]" mode=center></image>
				</view>
			</swiper-item>
			<swiper-item>
				<view class="bg-green swiper-item">
					<image :src="swiperItems[1]" mode=center></image>
				</view>
			</swiper-item>
			<swiper-item>
				<view class="bg-blue swiper-item">
					<image :src="swiperItems[2]" mode=center></image>
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
				swiperItems:[]
			}
		},
		onLoad() {

		},
		methods: {
			test() {
				console.log(this.mainPath);
				this.$api.setStorage("test", "test123")
				this.$api.getStorage("test")
			},
			

			tabBarToMeal() {
				uni.switchTab({
					url: "/pages/tabBar/orderMeal/orderMeal"
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

	.swiper-item image {}

	.tab-bar-meal {
		margin-top: 20rpx;
	}
</style>
