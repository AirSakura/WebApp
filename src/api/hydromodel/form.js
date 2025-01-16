import request from "@/utils/request";
import { getToken } from "@/utils/auth";





// 获取率定方案列表1
export function planList(query) {
  return request({
    url: "/model_form/list?token=" + getToken(),
    method: "get",
    params: query
  });
}
// 添加率定方案1
export function planAdd(data) {
  return request({
    url: "/model_form/add?token=" + getToken(),
    method: "post",
    data
  });
}
// 修改率定方案1
export function planEdit(data) {
  return request({
    url: "/model_form/edit?token=" + getToken(),
    method: "post",
    data
  });
}

// 保存率定方案1
export function editStatus(query) {
  return request({
    url: "/model_form/edit_status?token=" + getToken(),
    method: "get",
    params: query
  });
}


// 删除率定算法1
export function planDelete(query) {
  return request({
    url: "/combin/gr4j/delete?token=" + getToken(),
    method: "get",
    params: query
  });
}

// 获取设备列表1
export function deviceList(query) {
  return request({
    url: "/model_form/station_list?token=" + getToken(),
    method: "get",
    params: query
  });
}



// 流域1
export function getBasin(query) {
  return request({
    url: "/model_form/get_basin?token=" + getToken(),
    method: "get",
    params: query
  });
}



// 模型计算参数1
export function calibrateEvaluate(query) {
  return request({
    url: "/model_form/calibrate_result_evaluate?token=" + getToken(),
    method: "get",
    params: query
  });
}

// 模型计算图表1
export function calibrateChart(query) {
  return request({
    url: "/model_form/calibrate_result?token=" + getToken(),
    method: "get",
    params: query
  });
}
// 获取所有洪水场次1
export function userModelInfo(query) {
  return request({
    url: "/model_form/model_list?token=" + getToken(),
    method: "get",
    params: query
  });
}

