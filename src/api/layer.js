import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export function addlayer(query) {
  return request({
    url: '/geomap/manage/addlayerconfig?token=' + getToken(),
    method: 'get',
    params: query
  })
}
export function editlayer(query) {
  return request({
    url: '/geomap/manage/editlayerconfig?token=' + getToken(),
    method: 'get',
    params: query
  })
}
export function deletelayer(query) {
  return request({
    url: '/geomap/manage/deletelayerconfig?token=' + getToken(),
    method: 'get',
    params: query
  })
}
export function querylayer(query) {
  return request({
    url: '/geomap/manage/query?token=' + getToken(),
    method: 'get',
    params: query
  })
}
export function querylayerinfo(query) {
  return request({
    url: '/geomap/manage/querylayerconfigbyid?token=' + getToken(),
    method: 'get',
    params: query
  })
}
