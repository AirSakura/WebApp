import request from "@/utils/request";
import { getToken } from "@/utils/auth";

export function login(data) {
  return request({
    url: "/admin/self/login",
    method: "post",
    data
  });
}
export function verify(query) {
  return request({
    url: "/admin/self/verify/code",
    responseType: "arraybuffer",
    method: "get",
    params: query
  });
}

// 关注的水库
export function listCollection(query) {
  return request({
    url: "/personal_collection/list",
    method: "get",
    params: query
  });
}
export function listCollectionByPart(query) {
  return request({
    url: "/personal_collection/list_by_partid",
    method: "get",
    params: query
  });
}
export function addCollection(data) {
  return request({
    url: "/personal_collection/edit_sk",
    method: "post",
    header: {
      "Content-Type": "application/json" //规定传递的参数格式为json
    },
    data
  });
}
export function topCollection(query) {
  return request({
    url: "/personal_collection/ticket_total_by_part",
    method: "get",
    params: query
  });
}
export function delCollection(query) {
  return request({
    url: "/personal_collection/delete",
    method: "get",
    params: query
  });
}

// 通讯录相关
export function infoAddressBook(query) {
  return request({
    url: "/address_book/info",
    method: "get",
    params: query
  });
}
export function importAddressBook(data) {
  return request({
    url: "/address_book/import_file_save",
    method: "post",
    header: {
      "Content-Type": "application/json" //规定传递的参数格式为json
    },
    data
  });
}
export function listAddressBook(query) {
  return request({
    url: "/address_book/list",
    method: "get",
    params: query
  });
}

export function addAddressBook(data) {
  return request({
    url: "/address_book/add",
    method: "post",
    data
  });
}
export function editAddressBook(data) {
  return request({
    url: "/address_book/edit",
    method: "post",
    data
  });
}
export function delAddressBook(query) {
  return request({
    url: "/address_book/delete",
    method: "get",
    params: query
  });
}

export function getInfo(query) {
  return request({
    url: "/admin/self/info?token=" + getToken(),
    method: "get",
    params: query
  });
}
export function getuserbyusername(query) {
  return request({
    url: "/admin/self/getuserbyusername?token=" + getToken(),
    method: "get",
    params: query
  });
}

export function logout() {
  return request({
    url: "/admin/self/logout?token=" + getToken(),
    method: "post"
  });
}

export function changePassword(data) {
  return request({
    url: "/admin/user/pwd/edit",
    method: "post",
    data
  });
}
export function userlist(query) {
  return request({
    url: "/admin/user/list?token=" + getToken(),
    method: "get",
    params: query
  });
}
export function edituser(data) {
  return request({
    url: "/admin/user/edit?token=" + getToken(),
    method: "post",
    data
  });
}
export function adduser(data) {
  return request({
    url: "/admin/user/add?token=" + getToken(),
    method: "post",
    data
  });
}
export function deluser(query) {
  return request({
    url: "/admin/user/delete?token=" + getToken(),
    method: "get",
    params: query
  });
}
export function infouser(query) {
  return request({
    url: "/admin/user/info?token=" + getToken(),
    method: "get",
    params: query
  });
}
export function manyuser(data) {
  return request({
    url: "/admin/user/delete/many?token=" + getToken(),
    method: "post",
    data
  });
}
export function editself(data) {
  return request({
    url: "/admin/self/edit?token=" + getToken(),
    method: "post",
    data
  });
}

export function user_management(data) {
  return request({
    url: "/boundary/user_management?token=" + getToken(),
    method: "post",
    data
  });
}
export function user_management_zone(data) {
  return request({
    url: "/boundary/user_management_zone?token=" + getToken(),
    method: "post",
    data
  });
}
export function import_user_save(data) {
  return request({
    url: "/admin/user/import/data?token=" + getToken(),
    method: "post",
    data
  });
}
export function import_user_save_zhuanyedui(data) {
  return request({
    url: "/admin/zhuanyedui/import/data?token=" + getToken(),
    method: "post",
    data
  });
}
export function import_user_save_fire(data) {
  return request({
    url: "/admin/user/patrolman/import/data?token=" + getToken(),
    method: "post",
    data
  });
}
export function userexport(data) {
  return request({
    url: "/admin/user/list/export?token=" + getToken(),
    method: "post",
    data
  });
}
export function zhuanyeduilist(query) {
  return request({
    url: "/admin/zhuanyedui/list?token=" + getToken(),
    method: "get",
    params: query
  });
}
export function editzhuanyedui(data) {
  return request({
    url: "/admin/zhuanyedui/edit?token=" + getToken(),
    method: "post",
    data
  });
}
export function addzhuanyedui(data) {
  return request({
    url: "/admin/zhuanyedui/add?token=" + getToken(),
    method: "post",
    data
  });
}
export function delzhuanyedui(query) {
  return request({
    url: "/admin/zhuanyedui/delete?token=" + getToken(),
    method: "get",
    params: query
  });
}
export function xunhuiduilist(query) {
  return request({
    url: "/admin/xunhuidui/list?token=" + getToken(),
    method: "get",
    params: query
  });
}
export function editxunhuidui(data) {
  return request({
    url: "/admin/xunhuidui/edit?token=" + getToken(),
    method: "post",
    data
  });
}
export function addxunhuidui(data) {
  return request({
    url: "/admin/xunhuidui/add?token=" + getToken(),
    method: "post",
    data
  });
}
export function delxunhuidui(query) {
  return request({
    url: "/admin/xunhuidui/delete?token=" + getToken(),
    method: "get",
    params: query
  });
}
export function manyxunhuidui(data) {
  return request({
    url: "/admin/xunhuidui/delete/many?token=" + getToken(),
    method: "post",
    data
  });
}
export function manyzhuanyedui(data) {
  return request({
    url: "/admin/zhuanyedui/delete/many?token=" + getToken(),
    method: "post",
    data
  });
}
export function infozhuanyedui(query) {
  return request({
    url: "/admin/zhuanyedui/info?token=" + getToken(),
    method: "get",
    params: query
  });
}
export function infoxunhuidui(query) {
  return request({
    url: "/admin/xunhuidui/info?token=" + getToken(),
    method: "get",
    params: query
  });
}
export function userlistexport(query) {
  return request({
    url: "/admin/user/list/export?token=" + getToken(),
    method: "get",
    params: query
  });
}
export function resetpwd(data) {
  return request({
    url: "/admin/user/pwd/reset?token=" + getToken(),
    method: "post",
    data
  });
}
