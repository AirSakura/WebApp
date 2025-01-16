import request from "@/utils/request";
import { getToken } from "@/utils/auth";
export function listpart(query) {
  return request({
    url: "/admin/part/tree?token=" + getToken(),
    method: "get",
    params: query
  });
}

export function addpart(data) {
  return request({
    url: "/admin/part/add?token=" + getToken(),
    method: "post",
    header: {
      "Content-Type": "application/json" //规定传递的参数格式为json
    },
    data
  });
}

export function editpart(data) {
  return request({
    url: "/admin/part/edit?token=" + getToken(),
    method: "post",
    header: {
      "Content-Type": "application/json" //规定传递的参数格式为json
    },
    data
  });
}

export function delpart(data) {
  return request({
    url: "/admin/part/delete?token=" + getToken(),
    method: "get",
    params: data
  });
}
export function infopart(data) {
  return request({
    url: "/admin/part/info?token=" + getToken(),
    method: "get",
    params: data
  });
}

export function closepart(data) {
  return request({
    url: "/admin/closepart?token=" + getToken(),
    method: "post",
    data
  });
}
export function getboundarybypartid(data) {
  return request({
    url: "/admin/getboundarybypartid?token=" + getToken(),
    method: "get",
    params: data
  });
}

export function listpartbypid(query) {
  return request({
    url: "/admin/part/list?token=" + getToken(),
    method: "get",
    params: query
  });
}
