import request from '@/utils/request'
import { getToken } from '@/utils/auth'
export function listmenu(data) {
  return request({
    url: '/admin/menu/list?token=' + getToken(),
    method: 'get',
    params: data
  })
}
export function apis(data) {
  return request({
    url: '/admin/menu/function/list?token=' + getToken(),
    method: 'get',
    params: data
  })
}
export function addmenu(data) {
  return request({
    url: '/admin/menu/add?token=' + getToken(),
    method: 'post',
    data
  })
}
export function addfunc(data) {
  return request({
    url: '/admin/menu/function/add?token=' + getToken(),
    method: 'post',
    data
  })
}
export function delfunc(data) {
  return request({
    url: '/admin/menu/function/delete?token=' + getToken(),
    method: 'get',
    params: data
  })
}
export function editfunc(data) {
  return request({
    url: '/admin/menu/function/edit?token=' + getToken(),
    method: 'post',
    data
  })
}

export function editmenu(data) {
  return request({
    url: '/admin/menu/edit?token=' + getToken(),
    method: 'post',
    data
  })
}

export function delmenu(data) {
  return request({
    url: '/admin/menu/delete?token=' + getToken(),
    method: 'get',
    params: data
  })
}

