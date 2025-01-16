import Cookies from "js-cookie";
import { queryDictionary } from "@/api/dictionary";
import { Message } from "element-ui";
const state = {
  sidebar: {
    opened: false,
    withoutAnimation: false
  },
  fullscreen: true,
  device: "desktop",
  size: Cookies.get("size") || "medium",
  field: {},
  fieldfire: {},
  dict: [],
};

// 这里面的函数才能修改上面state里面的数据  这里面只允许写同步代码
const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened;
    state.sidebar.withoutAnimation = false;
    if (state.sidebar.opened) {
      Cookies.set("sidebarStatus", 1);
    } else {
      Cookies.set("sidebarStatus", 0);
    }
  },
  // withoutAnimation 参数是调用这和参数的时候 传进来的参数
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set("sidebarStatus", 0);
    state.sidebar.opened = false;
    state.sidebar.withoutAnimation = withoutAnimation;
  },
  TOGGLE_FULLSCREEN: (state, code) => {
    state.fullscreen = code;
    if (!code) {
      Cookies.set("sidebarStatus", 1);
      state.sidebar.opened = true;
    }
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device;
  },
  SET_SIZE: (state, size) => {
    state.size = size;
    Cookies.set("size", size);
  },
  SET_FIELD: (state, field) => {
    state.field = field;
  },
  SET_FIELD_FIRE: (state, field) => {
    state.fieldfire = field;
  },
  SET_DICT: (state, dict) => {
    state.dict = dict;
  }
};

//  这里面可以写异步代码
const actions = {
  toggleSideBar({ commit }) {
    commit("TOGGLE_SIDEBAR");
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit("CLOSE_SIDEBAR", withoutAnimation);
  },
  toggleFullscreen({ commit }, code) {
    commit("TOGGLE_FULLSCREEN", code);
  },
  toggleDevice({ commit }, device) {
    commit("TOGGLE_DEVICE", device);
  },
  setSize({ commit }, size) {
    commit("SET_SIZE", size);
  },
  setFieldfire({ commit }, size) {
    commit("SET_FIELD_FIRE", size);
  },
  setField({ commit }, size) {
    commit("SET_FIELD", size);
  },
  setdict({ commit }, name) {
    return new Promise((resolve, reject) => {
      const data = { model_class: name, limit: 1000, page: 1 };
      queryDictionary(data)
        .then(res => {
          const dict = res.data.data;
          try {
            dict.forEach(ele => {
              ele.config_info = eval(ele.config_info.replace(/[\\]/g, ""));
              ele.field_name = ele.field_name.replace(
                /[^\u4e00-\u9fa5|,]+/,
                ""
              );
            });
          } catch (err) {
            Message({
              message: "数据字典录入格式有误,请检查！",
              type: "warning",
              duration: 2 * 1000
            });
          }
          commit("SET_DICT", dict);
          resolve(dict);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
