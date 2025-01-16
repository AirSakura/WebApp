import request from "@/utils/request";
import { getToken } from "@/utils/auth";

// 测试
export function listTest(query) {
  return request({
    url: "/test/list?token=" + getToken(),
    method: "get",
    params: query
  });
}
export function infoTest(query) {
  return request({
    url: "/test/info?token=" + getToken(),
    method: "get",
    params: query
  });
}
export function delTest(query) {
  return request({
    url: "/test/delete?token=" + getToken(),
    method: "get",
    params: query
  });
}

export function addTest(data) {
  return request({
    url: "/test/add01?token=" + getToken(),
    method: "post",
    data
  });
}

export function editTest(data) {
  return request({
    url: "/test/edit?token=" + getToken(),
    method: "post",
    data
  });
}


export function templateTest(query) {
  return request({
    url: "/data_manage/template?token=" + getToken(),
    method: "get",
    params: query
  });
}
export function fileTest(query) {
  return request({
    url: "/data_manage/import/file?token=" + getToken(),
    method: "get",
    params: query
  });
}
export function fileDataTest(query) {
  return request({
    url: "/data_manage/list?token=" + getToken(),
    method: "get",
    params: query
  });
}
export function trendAnalysis(data) {
  return request({
    url: "/trend_analysis/list?token=" + getToken(),
    method: "post",
    header: {
      "Content-Type": "application/json" //规定传递的参数格式为json
    },
    data
  });
}
export function fileGeojson(query) {
  return request({
    url: "/data_manage/geojson?token=" + getToken(),
    method: "get",
    params: query
  });
}


