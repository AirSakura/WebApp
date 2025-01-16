import request from "@/utils/request";
import { getToken } from "@/utils/auth";

export function listInform(query) {
  return request({
    url: "/inform/list?token=" + getToken(),
    method: "get",
    params: query
  });
}
export function infoInform(query) {
  return request({
    url: "/inform/info?token=" + getToken(),
    method: "get",
    params: query
  });
}
export function delInform(query) {
  return request({
    url: "/inform/delete?token=" + getToken(),
    method: "get",
    params: query
  });
}

export function addInform(data) {
  return request({
    url: "/inform/add?token=" + getToken(),
    method: "post",
    header: {
      "Content-Type": "application/json" //规定传递的参数格式为json
    },
    data
  });
}

export function editInform(data) {
  return request({
    url: "/inform/edit?token=" + getToken(),
    method: "post",
    header: {
      "Content-Type": "application/json" //规定传递的参数格式为json
    },
    data
  });
}
// 用户列表
export function userInform(query) {
  return request({
    url: "/inform/user/list?token=" + getToken(),
    method: "get",
    params: query
  });
}