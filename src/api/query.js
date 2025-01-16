import request from "@/utils/request";
import { getToken } from "@/utils/auth";

export function getuserbypartid(data) {
  return request({
    url: "/admin/getuserbypartid?token=" + getToken(),
    method: "post",
    data
  });
}

export function partlist(data) {
  return request({
    url: "/admin/part/all?token=" + getToken(),
    method: "post",
    data
  });
}

export function querytrack(query) {
  return request({
    url: "/location/querytrack?token=" + getToken(),
    method: "get",
    params: query
  });
}
export function queryuserslastloc(query) {
  return request({
    url: "/location/queryuserslastloc?token=" + getToken(),
    method: "get",
    params: query
  });
}
export function querysosdatabytime(query) {
  return request({
    url: "/sos/querysosdatabytime?token=" + getToken(),
    method: "get",
    params: query
  });
}
export function touser(query) {
  return request({
    url: "/admin/part/user/list?token=" + getToken(),
    method: "get",
    params: query
  });
}
export function getheadimgbyusername(query) {
  return request({
    url: "/admin/getheadimgbyusername?token=" + getToken(),
    method: "get",
    params: query
  });
}

export function parttree(query) {
  return request({
    url: "/admin/part/tree?token=" + getToken(),
    method: "get",
    params: query
  });
}

// export function parttree(query) {
//   return request({
//     url: '/admin/part/all?token=' + getToken(),
//     method: 'get',
//     params: query
//   })
// }

export function roletree(query) {
  return request({
    url: "/admin/user/under/role/tree?token=" + getToken(),
    method: "get",
    params: query
  });
}
export function querypolygonbylnglat(query) {
  return request({
    url: "/geomap/dataapi/querybypoint?token=" + getToken(),
    method: "get",
    params: query
  });
}
export function querypolygonbysysid(query) {
  return request({
    url: "/spatialdb/querypolygonbysysid?token=" + getToken(),
    method: "get",
    params: query
  });
}
export function getuserinfobysysid(query) {
  return request({
    url: "/statisics/getuserinfobysysid?token=" + getToken(),
    method: "get",
    params: query
  });
}
export function roletree_(query) {
  return request({
    url: "/resource/roletree?token=" + getToken(),
    method: "get",
    params: query
  });
}
export function boundarytree(query) {
  return request({
    url: "/boundary/boundarytree?token=" + getToken(),
    method: "get",
    params: query
  });
}

export function getboundary(data) {
  return request({
    url: "/boundary/coordinate?token=" + getToken(),
    method: "post",
    data
  });
}

export function querytimesection(query) {
  return request({
    url: "/drone/layer/querytimesection?token=" + getToken(),
    method: "get",
    params: query
  });
}

export function userall(query) {
  return request({
    url: "/admin/user/all?token=" + getToken(),
    method: "get",
    params: query
  });
}
export function getuserbyid(query) {
  return request({
    url: "/admin/user/info?token=" + getToken(),
    method: "get",
    params: query
  });
}
export function underuser(query) {
  return request({
    url: "/admin/user/under/user?token=" + getToken(),
    method: "get",
    params: query
  });
}

export function partunderuser(query) {
  return request({
    url: "/admin/part/user/list?token=" + getToken(),
    method: "get",
    params: query
  });
}

export function adminlog(query) {
  return request({
    url: "/admin/user/operation/log?token=" + getToken(),
    method: "get",
    params: query
  });
}

export function queryFileList(query) {
  return request({
    url: "/device/readfile_list?token=" + getToken(),
    method: "get",
    params: query
  });
}
