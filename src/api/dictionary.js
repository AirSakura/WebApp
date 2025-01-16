import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export function addDictionary(data) {
  return request({
    url: '/admin/dictionary/add?token=' + getToken(),
    method: 'post',
    data
  })
}
export function editDictionary(data) {
  return request({
    url: '/admin/dictionary/edit?token=' + getToken(),
    method: 'post',
    data
  })
}
export function deleteDictionary(query) {
  return request({
    url: '/admin/dictionary/delete?token=' + getToken(),
    method: 'get',
    params: query
  })
}
export function queryDictionary(query) {
  return request({
    url: '/admin/dictionary/list?token=' + getToken(),
    method: 'get',
    params: query
  })
}




