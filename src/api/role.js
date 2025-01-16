import request from '@/utils/request'
import { getToken } from '@/utils/auth'
export function rolelist(query) {
  return request({
    url: '/admin/role/list?token=' + getToken(),
    method: 'get',
    params: query
  })
}
export function getmyrolelist(query) {
  return request({
    url: '/admin/getmyrolelist?token=' + getToken(),
    method: 'post',
    params: query
  })
}
export function addrole(data) {
  return request({
    url: '/admin/role/add?token=' + getToken(),
    method: 'post',
    data
  })
}

export function editrole(data) {
  return request({
    url: '/admin/role/edit?token=' + getToken(),
    method: 'post',
    data
  })
}

export function delrole(data) {
  return request({
    url: '/admin/role/delete?token=' + getToken(),
    method: 'get',
    params: data
  })
}

export function roleinfo(data) {
  return request({
    url: '/admin/role/info?token=' + getToken(),
    method: 'get',
    params: data
  })
}

export function rolepower(data) {
  return request({
    url: '/admin/role/power?token=' + getToken(),
    method: 'post',
    data
  })
}
export function editroleList(query) {
  return request({
    url: '/admin/editroleList?token=' + getToken(),
    method: 'get',
    params: query
  })
}

export function menubyroleid(query) {
  return request({
    url: '/admin/role/menus?token=' + getToken(),
    method: 'get',
    params: query
  })
}

export function delroleformenu(data) {
  return request({
    url: '/admin/delroleformenu?token=' + getToken(),
    method: 'post',
    data
  })
}
export function getrole(query) {
  return request({
    url: '/admin/role/all?token=' + getToken(),
    method: 'get',
    params: query
  })
}
