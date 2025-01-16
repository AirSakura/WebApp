import request from "@/utils/request";
import { getToken } from "@/utils/auth";

// 站点设备树
export function deviceTree(query) {
  return request({
    url: "/analysis_data/list/tree?token=" + getToken(),
    method: "get",
    params: query
  });
}

// 沉降
export function settlement(query) {
  return request({
    url: "/monitor_data/settlement?token=" + getToken(),
    method: "get",
    params: query
  });
}

// 水位
export function level(query) {
  return request({
    url: "/monitor_data/level?token=" + getToken(),
    method: "get",
    params: query
  });
}
// 雨量
export function rain(query) {
  return request({
    url: "/monitor_data/rain?token=" + getToken(),
    method: "get",
    params: query
  });
}

// 渗压
export function osmotic_pressure(query) {
  return request({
    url: "/monitor_data/osmotic_pressure?token=" + getToken(),
    method: "get",
    params: query
  });
}
// 渗流
export function transfusion(query) {
  return request({
    url: "/monitor_data/transfusion?token=" + getToken(),
    method: "get",
    params: query
  });
}
// 位移
export function displacement(query) {
  return request({
    url: "/monitor_data/displacement?token=" + getToken(),
    method: "get",
    params: query
  });
}

// 气温
export function temperature(query) {
  return request({
    url: "/monitor_data/temperature?token=" + getToken(),
    method: "get",
    params: query
  });
}
// 气压
export function pressure(query) {
  return request({
    url: "/monitor_data/pressure?token=" + getToken(),
    method: "get",
    params: query
  });
}
// 获取单个设备数据
export function monitor(query) {
  return request({
    url: "/analysis_data/monitor_data_by_code?token=" + getToken(),
    method: "get",
    params: query
  });
}
// 导入数据提交
export function submit(data) {
  return request({
    url: "/analysis_data/monitor/import_file_save?token=" + getToken(),
    method: "post",
    header: {
      "Content-Type": "application/json" //规定传递的参数格式为json
    },
    data
  });
}
