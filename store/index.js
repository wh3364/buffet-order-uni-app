import {createStore} from 'vuex'
import getters from './getters'
import cart from './modules/cart'

const store = createStore({
  modules: {
    cart
  },
  getters
})

export default store