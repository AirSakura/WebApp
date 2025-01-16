import request from "@/utils/request";
import { getToken } from "@/utils/auth";


// 获取率定算法
export function planList(query) {
  return request({
    url: "/hydro_model/xaj/list?token=" + getToken(),
    method: "get",
    params: query
  });
}


// 模型数据1
export function calibrate(data) {
  return request({
    url: "/hydro_model/xaj/calibrate?token=" + getToken(),
    method: "post",
    header: {
      "Content-Type": "application/json" //规定传递的参数格式为json
    },
    data
  });
}
// 模型计算图表
export function calibrateChart(query) {
  return request({
    url: "/hydro_model/xaj/calibrate_result?token=" + getToken(),
    method: "get",
    params: query
  });
}

// 模型计算指标
export function calibrateEvaluate(query) {
  return request({
    url: "/hydro_model/xaj/calibrate_result_evaluate?token=" + getToken(),
    method: "get",
    params: query
  });
}



