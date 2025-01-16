import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export function provincelist(query) {
  return request({
    url: '/device/query/province?token=' + getToken(),
    method: 'get',
    params: query
  })
}

export function citylist(query) {
  return request({
    url: '/device/query/city?token=' + getToken(),
    method: 'get',
    params: query
  })
}

export function districtlist(query) {
  return request({
    url: '/device/query/district?token=' + getToken(),
    method: 'get',
    params: query
  })
}

export function administrativelist(query) {
  return request({
    url: '/device/query/administrative?token=' + getToken(),
    method: 'get',
    params: query
  })
}

// 根据code查询行政区域
export function zonelist(query) {
  return request({
    url: '/administrative/query?token=' + getToken(),
    method: 'get',
    params: query
  })
}

// 添加
export function adminiAdd(data) {
  return request({
    url: '/administrative/self/add?token=' + getToken(),
    method: 'post',
    data
  })
}

// 删除
export function adminiDel(data) {
  return request({
    url: '/administrative/self/delete?token=' + getToken(),
    method: 'post',
    data
  })
}

// 编辑
export function adminiEdit(data) {
  return request({
    url: '/administrative/self/edit?token=' + getToken(),
    method: 'post',
    data
  })
}
