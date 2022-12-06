import api from "../api.js"

export function getOrderList(data, pageNum) {
  return api.request({
	  method: 'post',
	  url: `Order/GetOrderList?pageNum=${pageNum}`,
	  data
  })
}

export function getOrder(data) {
  return api.request({
	  method: 'post',
	  url: 'Order/GetOrder',
	  data
  })
}

export function completeOrder(data) {
  return api.request({
	  method: 'post',
	  url: 'Order/CompleteOrder',
	  data
  })
}

export function cancelOrder(data) {
  return api.request({
	  method: 'post',
	  url: 'Order/CancelOrder',
	  data
  })
}

export function payOrder(data) {
  return api.request({
	  method: 'post',
	  url: 'Order/PayOrder',
	  data
  })
}

export function createOrder(data) {
  return api.request({
	  method: 'post',
	  url: 'Order/Create',
	  data
  })
}