import request from "@/utils/request";

import { getToken } from "@/utils/auth";

export function getTif(params) {
  return request({
    url: "/data_manage/tif_info",
    method: "get",
    params
  });
}

export function getUpdata(params) {
  return request({
    url: "/data_manage/updata",
    method: "get",
    params
  });
}
export function tifClip(params) {
  return request({
    url: "/data_manage/tif_clip",
    method: "get",
    params
  });
}
export function saveFile(params) {
  return request({
    url: "/data_manage/datatype",
    method: "get",
    params
  });
}

export function analysisFile(params) {
  return request({
    url: "/data_manage/analysis",
    method: "get",
    params
  });
}


export function fileTree(params) {
  return request({
    url: "/data_manage/updata_list",
    method: "get",
    params
  });
}
export function delFile(params) {
  return request({
    url: "/data_manage/delete",
    method: "get",
    params
  });
}

export function getTwi(params) {
  return request({
    url: "/data_manage/cacal_twi",
    method: "get",
    params
  });
}


export function getBasin(params) {
  return request({
    url: "/data_manage/basin_divide",
    method: "get",
    params
  });
}

export function dataViews(data) {
  return request({
    url: '/data_manage/view?token=' + getToken(),
    method: 'post',
    data
  })
}