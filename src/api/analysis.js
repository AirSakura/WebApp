import request from "@/utils/request";
import { getToken } from "@/utils/auth";

// 雨情
export function getRainView(query) {
  return request({
    url: "/analysis_data/rain_list_info?token=" + getToken(),
    method: "get",
    params: query
  });
}
export function getRainList(query) {
  return request({
    url: "/analysis_data/rain_list?token=" + getToken(),
    method: "get",
    params: query
  });
}
export function getRain(query) {
  return request({
    url: "/analysis_data/rain?token=" + getToken(),
    method: "get",
    params: query
  });
}
// 水情
export function getWaterView(query) {
  return request({
    url: "/analysis_data/water_list_info?token=" + getToken(),
    method: "get",
    params: query
  });
}
export function getWaterList(query) {
  return request({
    url: "/analysis_data/water_list?token=" + getToken(),
    method: "get",
    params: query
  });
}
export function getWater(query) {
  return request({
    url: "/analysis_data/water?token=" + getToken(),
    method: "get",
    params: query
  });
}
// 流量
export function getFloodView(query) {
  return request({
    url: "/analysis_data/flood_list_info?token=" + getToken(),
    method: "get",
    params: query
  });
}
export function getFloodList(query) {
  return request({
    url: "/analysis_data/flood_list?token=" + getToken(),
    method: "get",
    params: query
  });
}
export function getFlood(query) {
  return request({
    url: "/analysis_data/flood?token=" + getToken(),
    method: "get",
    params: query
  });
}
// 库容
export function getCapacity(query) {
  return request({
    url: "/analysis_data/capacity_list?token=" + getToken(),
    method: "get",
    params: query
  });
}
// 水质
export function getQualityView(query) {
  return request({
    url: "/analysis_data/quality_list_info?token=" + getToken(),
    method: "get",
    params: query
  });
}
export function getQualityList(query) {
  return request({
    url: "/analysis_data/quality_list?token=" + getToken(),
    method: "get",
    params: query
  });
}
export function getQuality(query) {
  return request({
    url: "/analysis_data/quality?token=" + getToken(),
    method: "get",
    params: query
  });
}
// 单水库事件统计
export function eventStatistics(query) {
  return request({
    url: "/om_ticket/event_manage/statistics?token=" + getToken(),
    method: "get",
    params: query
  });
}
// 单水库雨量统计
export function rainStatistics(query) {
  return request({
    url: "/sk_statistics_info/rain?token=" + getToken(),
    method: "get",
    params: query
  });
}
// 单水库水情统计
export function waterStatistics(query) {
  return request({
    url: "/sk_statistics_info/water?token=" + getToken(),
    method: "get",
    params: query
  });
}

// 综合监控杂项统计
export function mainStatistics(query) {
  return request({
    url: "/home_page/main/info?token=" + getToken(),
    method: "get",
    params: query
  });
}

// 水库视频站点统计
export function partCamera(query) {
  return request({
    url: "/home_page/camera?token=" + getToken(),
    method: "get",
    params: query
  });
}

// 位移水库信息
export function displacement(query) {
  return request({
    url: "/analysis_data/displacement_list?token=" + getToken(),
    method: "get",
    params: query
  });
}
// 渗压水库信息
export function osmoticPressure(query) {
  return request({
    url: "/analysis_data/osmotic_pressure_list?token=" + getToken(),
    method: "get",
    params: query
  });
}
// 沉降水库信息
export function settlement(query) {
  return request({
    url: "/analysis_data/settlement_list?token=" + getToken(),
    method: "get",
    params: query
  });
}
// 渗流水库信息
export function transfusion(query) {
  return request({
    url: "/analysis_data/transfusion_list?token=" + getToken(),
    method: "get",
    params: query
  });
}
// 水库vr详情
export function vrStatistics(query) {
  return request({
    url: "/analysis_data/vr_statistics?token=" + getToken(),
    method: "get",
    params: query
  });
}
// 水库vr列表
export function vrListStatistics(query) {
  return request({
    url: "/analysis_data/user/vr_statistics?token=" + getToken(),
    method: "get",
    params: query
  });
}

// 运维总览头部
export function totalMaintenance(query) {
  return request({
    url: "/analysis_data/ticket_list_info?token=" + getToken(),
    method: "get",
    params: query
  });
}
// 运维总览图
export function chartMaintenance(query) {
  return request({
    url: "/analysis_data/ticket_list?token=" + getToken(),
    method: "get",
    params: query
  });
}
// 运维总览列表
export function listMaintenance(query) {
  return request({
    url: "/analysis_data/ticket_list_by_part?token=" + getToken(),
    method: "get",
    params: query
  });
}
// 运维单项统计列表
export function listMaintenanceByType(query) {
  return request({
    url: "/analysis_data/ticket_list_by_type?token=" + getToken(),
    method: "get",
    params: query
  });
}
// 运维单项统计头部
export function infoMaintenanceByType(query) {
  return request({
    url: "/analysis_data/ticket_total_by_type?token=" + getToken(),
    method: "get",
    params: query
  });
}
// 根据设备类型获取预警记录
export function deviceWarning(query) {
  return request({
    url: "/home_page/warning?token=" + getToken(),
    method: "get",
    params: query
  });
}

// vr显示根据设备获取预警记录
export function deviceVrWarning(query) {
  return request({
    url: "/home_page/data_by_code?token=" + getToken(),
    method: "get",
    params: query
  });
}
