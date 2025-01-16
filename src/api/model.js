import request from "@/utils/request";
import { getToken } from "@/utils/auth";

// gr4j模型数据
export function gr4jData(query) {
  return request({
    url: "/gr4j/getdata?token=" + getToken(),
    method: "get",
    params: query
  });
}
// gr4j模型数据
export function gr4jSave(data) {
  return request({
    url: "/gr4j/calculate?token=" + getToken(),
    method: "post",
    header: {
      "Content-Type": "application/json" //规定传递的参数格式为json
    },
    data
  });
}
// 获取率定算法
export function calibrateList(query) {
  return request({
    url: "/hydro_model/calibrate_list?token=" + getToken(),
    method: "get",
    params: query
  });
}
// 获取率定算法
export function planList(query) {
  return request({
    url: "/hydro_model/list?token=" + getToken(),
    method: "get",
    params: query
  });
}
// 添加率定方案
export function planAdd(data) {
  return request({
    url: "/hydro_model/add?token=" + getToken(),
    method: "post",
    data
  });
}
// 添加率定方案
export function planEdit(data) {
  return request({
    url: "/hydro_model/edit?token=" + getToken(),
    method: "post",
    data
  });
}

// 保存率定方案
export function editStatus(query) {
  return request({
    url: "/hydro_model/edit_status?token=" + getToken(),
    method: "get",
    params: query
  });
}

// 获取率定算法
export function planInfo(query) {
  return request({
    url: "/hydro_model/info?token=" + getToken(),
    method: "get",
    params: query
  });
}
// 获取率定算法
export function planDelete(query) {
  return request({
    url: "/hydro_model/delete?token=" + getToken(),
    method: "get",
    params: query
  });
}

// 获取设备列表
export function deviceList(query) {
  return request({
    url: "/hydro_model/station_list?token=" + getToken(),
    method: "get",
    params: query
  });
}
// 模型数据
export function monitorData(query) {
  return request({
    url: "/hydro_model/monitor_data_by_code?token=" + getToken(),
    method: "get",
    params: query
  });
}


// 流域
export function getBasin(query) {
  return request({
    url: "/hydro_model/get_basin?token=" + getToken(),
    method: "get",
    params: query
  });
}

// 模型数据
export function calibrate(data) {
  return request({
    url: "/hydro_model/calibrate?token=" + getToken(),
    method: "post",
    header: {
      "Content-Type": "application/json" //规定传递的参数格式为json
    },
    data
  });
}
// 模型计算参数
export function calibrateEvaluate(query) {
  return request({
    url: "/hydro_model/calibrate_result_evaluate?token=" + getToken(),
    method: "get",
    params: query
  });
}

// 模型计算图表
export function calibrateChart(query) {
  return request({
    url: "/hydro_model/calibrate_result?token=" + getToken(),
    method: "get",
    params: query
  });
}
// 获取所有洪水场次
export function userModelInfo(query) {
  return request({
    url: "/user_ref_model/info?token=" + getToken(),
    method: "get",
    params: query
  });
}
// 添加率定方案
export function userModelEdit(data) {
  return request({
    url: "/user_ref_model/edit?token=" + getToken(),
    method: "post",
    header: {
      "Content-Type": "application/json" //规定传递的参数格式为json
    },
    data
  });
}
