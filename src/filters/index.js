// import parseTime, formatTime and set to filter
import { parseTime, formatTime, formatSeconds } from "@/utils";

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
  const si = [
    { value: 1e18, symbol: "E" },
    { value: 1e15, symbol: "P" },
    { value: 1e12, symbol: "T" },
    { value: 1e9, symbol: "G" },
    { value: 1e6, symbol: "M" },
    { value: 1e3, symbol: "k" }
  ];
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (
        (num / si[i].value + 0.1)
          .toFixed(digits)
          .replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + si[i].symbol
      );
    }
  }
  return num.toString();
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
  return (+num || 0)
    .toString()
    .replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ","));
}

export function getNumtxt(status) {
  const statusMap = {
    0: "全部",
    1: "待售",
    2: "预定",
    3: "已售",
    4: "安葬",
    5: "异常",
    6: "迁出"
  };
  return statusMap[status];
}

export function statusNotice(status) {
  const statusMap = { 0: "未读", 1: "已读", 2: "未反馈", 3: "已反馈" };
  return statusMap[status];
}

// 截取经纬度小数点后六位
export function interceptLnglat(num, length) {
  if (num > 0) {
    let ns = num.toString();
    return ns.substring(0, ns.indexOf(".") + 1 + length);
  }
}

export function deviceType(status) {
  if (status && status.length > 0) {
    let res = JSON.parse(status);
    return res.join(",");
  } else {
    return "--";
  }
}

// 秒转时分秒
export function formatSecond(data) {
  if (data > 0) {
    return formatSeconds(data);
  }
}

