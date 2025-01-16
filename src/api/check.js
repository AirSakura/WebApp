import request from '@/utils/request'
import { getToken } from '@/utils/auth'
export function checkdataquery(query) {
  return request({
    url: '/checkdata/query?token=' + getToken(),
    method: 'get',
    params: query
  })
}

export function checkdataadd(data) {
  return request({
    url: '/checkdata/manage/add?token=' + getToken(),
    method: 'post',
    data
  })
}

