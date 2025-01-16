import request from "@/utils/request";
import { getToken } from "@/utils/auth";

export function listFeedback(query) {
  return request({
    url: "/feedback/list?token=" + getToken(),
    method: "get",
    params: query
  });
}
export function infoFeedback(query) {
  return request({
    url: "/feedback/info?token=" + getToken(),
    method: "get",
    params: query
  });
}
export function delFeedback(query) {
  return request({
    url: "/feedback/delete?token=" + getToken(),
    method: "get",
    params: query
  });
}

export function editFeedback(data) {
  return request({
    url: "/feedback/edit_verify?token=" + getToken(),
    method: "post",
    data
  });
}
