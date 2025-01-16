import request from "@/utils/request";
import { getToken } from "@/utils/auth";

// 视频与站点接口
export function listCamera(query) {
  return request({
    url: "/camera/list?token=" + getToken(),
    method: "get",
    params: query
  });
}
export function infoCamera(query) {
  return request({
    url: "/camera/info?token=" + getToken(),
    method: "get",
    params: query
  });
}
export function addCamera(data) {
  return request({
    url: "/camera/add?token=" + getToken(),
    method: "post",
    data
  });
}
export function editCamera(data) {
  return request({
    url: "/camera/edit?token=" + getToken(),
    method: "post",
    data
  });
}

export function delCamera(query) {
  return request({
    url: "/camera/delete?token=" + getToken(),
    method: "get",
    params: query
  });
}


export function listSite(query) {
  return request({
    url: "/camera_site/list?token=" + getToken(),
    method: "get",
    params: query
  });
}
export function infoSite(query) {
  return request({
    url: "/camera_site/info?token=" + getToken(),
    method: "get",
    params: query
  });
}
export function addSite(data) {
  return request({
    url: "/camera_site/add?token=" + getToken(),
    method: "post",
    data
  });
}
export function editSite(data) {
  return request({
    url: "/camera_site/edit?token=" + getToken(),
    method: "post",
    data
  });
}

export function delSite(query) {
  return request({
    url: "/camera_site/delete?token=" + getToken(),
    method: "get",
    params: query
  });
}
// 摄像头分组树
export function listCameraTree(query) {
  return request({
    url: "/camera/list/tree?token=" + getToken(),
    method: "get",
    params: query
  });
}