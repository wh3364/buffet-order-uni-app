const getDefaultState = () => {
	return {
		body: [],
		way: 0,
		total: 0
	}
}

const state = getDefaultState()

const mutations = {
	RESET_STATE: (state) => {
		Object.assign(state, getDefaultState())
	},
	ADD_FOOD_BY_ADD_BUT: (state, food) => {
		const index = state.body.findIndex((item) => {
			return item.foodId == food.foodId
		})
		if (index !== -1) {
			state.body[index] = food
		} else {
			state.body.push(food)
		}
		const total = state.total + food.foodPrice
		state.total = Number(total.toFixed(2))
	},
	SUB_FOOD_BY_SUB_BUT: (state, food) => {
		const index = state.body.findIndex((item) => {
			return item.foodId == food.foodId
		})
		if (index !== -1) {
			state.body[index] = food
			const total = state.total - food.foodPrice
			state.total = Number(total.toFixed(2))
		}
		if (state.body[index].numb < 0) {
			state.body[index].numb = 0
		}
		if(state.body[index].numb === 0){
			state.body.splice(index, 1)
		}
	},
	ADD_FOOD_BY_ADD_CART: (state, food) => {
		state.body.push(food)
		const total = state.total + food.foodPrice
		state.total = Number(total.toFixed(2))
	},
	DEL_FOOD_BY_DEL_BUT: (state, food) => {
		const index = state.body.findIndex((item) => {
			return item.foodId == food.foodId
		})
		if (index !== -1) {
			state.body.splice(index, 1)
			const total = state.total - food.foodPrice
			state.total = Number(total.toFixed(2))
		}
	},
	CHANGE_WAY: (state) => {
		state.way ? state.way = 0 : state.way = 1
	},
	// CHANGE_TOTAL: (state, total) => {
	// 	state.total = total
	// },
}

const actions = {
	emptyCart({
		commit,
		state
	}) {
		const way = state.way
		commit('RESET_STATE')
		state.way = way
	},
	changeWay({
		commit
	}){
		commit('CHANGE_WAY')
	},
	addFoodByBut({
		commit
	}, food) {
		commit('ADD_FOOD_BY_ADD_BUT', food)
	},
	subFoodByBut({
		commit
	}, food) {
		commit('SUB_FOOD_BY_SUB_BUT', food)
	},
	addFoodByCart({
		commit
	}, data) {
		let food = data.food
		let mS = []
		let rS = []
		const dM = data.dM
		const dR = data.dR
		dM.mS.forEach((item, index) => {
			if (item.s === 1) {
				mS.push({
					s: index,
					n: item.n
				})
			}
		})
		dR.forEach(i => {
			i.rS.forEach((j, index) => {
				if (j.s === 1) {
					rS.push({
						s: index,
						n: j.n
					})
				}
			})
		})
		food.m = mS
		food.r = rS
		commit('ADD_FOOD_BY_ADD_CART', food)
	},
	delFoodByCart({
		commit
	}, food) {
		commit('DEL_FOOD_BY_DEL_BUT', food)
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}
