import request from "@/utils/request";
import { getToken } from "@/utils/auth";

export function basinAdd(query) {
  return request({
    url: "/sys_basin/add?token=" + getToken(),
    method: "get",
    params: query
  });
}

export function basinEdit(query) {
  return request({
      url: "/sys_basin/edit?token=" + getToken(),
      method: "get",
      params: query
    });
  }

export function basinList(query) {
  return request({
    url: "/sys_basin/list?token=" + getToken(),
    method: "get",
    params: query
});
}

export function basininfo(query) {
  return request({
    url: "/sys_basin/info?token=" + getToken(),
    method: "get",
    params: query
});
}

export function basinDelete(query) {
  return request({
    url: "/sys_basin/delete?token=" + getToken(),
    method: "get",
    params: query
});
}


export function stationAdd(query) {
  return request({
    url: "/station_data/add?token=" + getToken(),
    method: "get",
    params: query
});
}

export function stationEdit(query) {
  return request({
    url: "/station_data/edit?token=" + getToken(),
    method: "get",
    params: query
  });
}




export function stationDataIn(data) {
  return request({
    url: "/data_to_in/import/file?token=" + getToken(),
    method: 'post',
    data
});
}

