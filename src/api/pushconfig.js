import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export function addSysparam(data) {
    return request({
        url: '/bracelet/health?token=' + getToken(),
        method: 'post',
        data
    })
}

export function querySysparam(query) {
    return request({
        url: '/warn/common/frequency/query?token=' + getToken(),
        method: 'get',
        params: query
    })
}

export function queryDefaultrule(query) {
    return request({
      url: '/warn/common/healthy/query?token=' + getToken(),
      method: 'get',
      params: query
    })
}

export function editDefaultrule(data) {
    return request({
        url: '/warn/common/healthy/edit?token=' + getToken(),
        method: 'post',
        data
    })
}

  