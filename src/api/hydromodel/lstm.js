import request from "@/utils/request";
import { getToken } from "@/utils/auth";

// LSTM_CNN模型
export function lstmCnn(data) {
  return request({
    url: "/network/calculate?token=" + getToken(),
    method: "post",
    data
  });
}

