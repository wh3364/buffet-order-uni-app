import api from "@/common/api"

export function getAllFoods() {
  return api.noLoginRequest({
	  method: 'get',
	  url: 'Food/GetAllFood'
  })
}

export function getAllCates() {
  return api.noLoginRequest({
	  method: 'get',
	  url: 'Food/GetAllCate'
  })
}