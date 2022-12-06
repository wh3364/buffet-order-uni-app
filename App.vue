<script>
	import { getUser } from './common/request/user'
	export default {
		onLaunch: function() {
			console.log('App Launch')
			this.firstLogin()
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			firstLogin() {
				getUser().then((res) => {
					if (res.statusCode === 200) {
						this.$api.sucMsg("登陆成功")
						this.$api.setStorage("nick", res.data.user.nickName, true)
						this.$api.setStorage("avatar", res.data.user.avatarPath, true)
						this.$api.setStorage("money", res.data.user.money, true)
					}else if(res.statusCode === 401){
						this.firstLogin()
					}
				})
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import './common/global.css';
</style>
