import api from "../api.js"

export function getUser() {
  return api.request({
	  method: 'post',
	  url: 'Login/LoginUser'
  })
}

export function getAddress() {
  return api.request({
	  method: 'get',
	  url: 'User/GetAddress'
  })
}

export function updateAddress(data) {
  return api.request({
	  method: 'post',
	  url: 'User/AddOrUploadAddress',
	  data
  })
}

export function uploadNick(data) {
  return api.request({
	  method: 'post',
	  url: 'User/UploadNick',
	  data
  })
}