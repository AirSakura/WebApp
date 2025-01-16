import request from '@/utils/request'
import { getToken } from '@/utils/auth'
export function getprovince(query) {
  return request({
    url: '/boundary/info?token=' + getToken(),
    method: 'get',
    params: query
  })
}
export function provincelist(query) {
  return request({
    url: '/boundary/list?token=' + getToken(),
    method: 'get',
    params: query
  })
}
export function addprovince(data) {
  return request({
    url: '/boundary/add?token=' + getToken(),
    method: 'post',
    data
  })
}
export function updateprovince(data) {
  return request({
    url: '/boundary/edit?token=' + getToken(),
    method: 'post',
    data
  })
}
export function deleteprovince(query) {
  return request({
    url: '/boundary/del?token=' + getToken(),
    method: 'get',
    params: query
  })
}
export function boundaryinfo(query) {
  return request({
    url: '/boundary/info?token=' + getToken(),
    method: 'get',
    params: query
  })
}

