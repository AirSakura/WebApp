import request from "@/utils/request";
import { getToken } from "@/utils/auth";


// 修改率定方案1
export function trainproEdit(data) {
    return request({
      url: "/combin/edit_train?token=" + getToken(),
      method: "post",
      data
    });
  }

// 获取自动率定参数1
export function calibrateList(query) {
  return request({
    url: "/combin/rf/calibrate_list?token=" + getToken(),
    method: "get",
    params: query
  });
}

// 手动调参1
export function calibmanList(query) {
  return request({
    url: "/combin/rf/calibman_list?token=" + getToken(),
    method: "get",
    params: query
  });
}
// 获取率定方案列表1
export function planList(query) {
  return request({
    url: "/combin/rf/list?token=" + getToken(),
    method: "get",
    params: query
  });
}
// 添加率定方案1
export function planAdd(data) {
  return request({
    url: "/combin/rf/add?token=" + getToken(),
    method: "post",
    data
  });
}
// 修改率定方案1
export function planEdit(data) {
  return request({
    url: "/combin/rf/edit?token=" + getToken(),
    method: "post",
    data
  });
}

// 保存率定方案1
export function editStatus(query) {
  return request({
    url: "/combin/rf/edit_status?token=" + getToken(),
    method: "get",
    params: query
  });
}

// // 获取率定算法
// export function planInfo(query) {
//   return request({
//     url: "/combin/gr4j/info?token=" + getToken(),
//     method: "get",
//     params: query
//   });
// }
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
    url: "/combin/rf/station_list?token=" + getToken(),
    method: "get",
    params: query
  });
}
// 模型数据1
export function monitorData(query) {
  return request({
    url: "/combin/rf/monitor_data_by_code?token=" + getToken(),
    method: "get",
    params: query
  });
}


// 流域1
export function getBasin(query) {
  return request({
    url: "/combin/rf/get_basin?token=" + getToken(),
    method: "get",
    params: query
  });
}
// 子流域1
export function getChildBasin(query) {
  return request({
    url: "/combin/rf/get_childbasin?token=" + getToken(),
    method: "get",
    params: query
  });
}

// 模型数据1
export function calibrate(data) {
  return request({
    url: "/combin/rf/calibrate?token=" + getToken(),
    method: "post",
    header: {
      "Content-Type": "application/json" //规定传递的参数格式为json
    },
    data
  });
}
// 模型计算参数1
export function calibrateEvaluate(query) {
  return request({
    url: "/combin/rf/calibrate_result_evaluate?token=" + getToken(),
    method: "get",
    params: query
  });
}

// 模型计算图表1
export function calibrateChart(query) {
  return request({
    url: "/combin/rf/calibrate_result?token=" + getToken(),
    method: "get",
    params: query
  });
}
// 获取所有洪水场次1
export function userModelInfo(query) {
  return request({
    url: "/combin/list?token=" + getToken(),
    method: "get",
    params: query
  });
}

// export function userModelEdit(data) {
//   return request({
//     url: "/user_ref_model/edit?token=" + getToken(),
//     method: "post",
//     header: {
//       "Content-Type": "application/json" //规定传递的参数格式为json
//     },
//     data
//   });
// }
