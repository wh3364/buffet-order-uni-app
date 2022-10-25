<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			this.$api.useSessionLogin().then((session_key) => {
				this.firstLogin({
					session_key: session_key
				})
			}).catch(() => {
				this.$api.useCodeLogin().then((code) => {
					this.firstLogin({
						code: code
					})
				})
			})

		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			firstLogin(header) {
				this.$api.postRequest(this.mainPath + 'Login/LoginUser', null, header).then((res) => {
					if (res.statusCode === 200) {
						this.$api.sucMsg("登陆成功")
						this.$api.setStorage("nick", res.data.user.nickName, true)
						this.$api.setStorage("avatar", res.data.user.avatarPath, true)
						this.$api.setStorage("money", res.data.user.money, true)
					} else if (res.statusCode === 401) {
						this.$api.useCodeLogin().then((code) => {
							this.firstLogin({
								code: code
							})
						})
					}
				}).catch(() => {
				})
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import './common/global.css';
</style>
