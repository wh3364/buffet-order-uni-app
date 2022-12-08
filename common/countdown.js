// 倒计时
export function timeStamp(times) {
	const timestamp = new Date().getTime() / 1000
	const time = parseInt(times - timestamp)
	let m = parseInt(time / 60)
	let s = parseInt(time - m * 60)
	if (m < 10){
		m = '0' + m
	}
	if (s < 10){
		s = '0' + s
	}
	const str = `${m}分${s}秒`
	return {
		time,
		str
	}
}
