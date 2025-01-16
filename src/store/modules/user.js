import { login, getInfo, logout } from "@/api/user";
import { parttree } from "@/api/query";
import { getToken, setToken, setExpiresIn, removeToken } from "@/utils/auth";

const user = {
  state: {
    token: getToken(),
    userinfo: "",
    avatar: "",
    roles: [],
    permissions: [],
    currentsk: "",
    currentname: "",
    showdash: true,
    usersk: [],
    menus: [],
    siteList: [],
    siteType: "",
    partList: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_EXPIRES_IN: (state, time) => {
      state.expires_in = time;
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus;
    },
    SET_NAME: (state, userinfo) => {
      state.userinfo = userinfo;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions;
    },
    SET_CURRENTSK: (state, currentsk) => {
      state.currentsk = currentsk;
    },
    SET_CURRENTNAME: (state, currentsk) => {
      state.currentname = currentsk;
    },
    SET_USERSK: (state, usersk) => {
      state.usersk = usersk;
    },
    SET_SHOWDASH: (state, showdash) => {
      state.showdash = showdash;
    },
    SET_SITELIST: (state, data) => {
      state.siteList = data;
    },
    SET_SITETYPE: (state, data) => {
      state.siteType = data;
    },
    SET_PARTLIST: (state, data) => {
      state.partList = data;
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then(res => {
            commit("SET_TOKEN", res.data.token);
            setToken(res.data.token);
            resolve(res);
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    vuelogin: function({commit}) {
      let _token = Math.random()
      commit('SET_TOKEN', _token)
      setToken(_token)
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      const data = {
        token: state.token
      };
      return new Promise((resolve, reject) => {
        getInfo(data)
          .then(({ data }) => {
            const user = data.userinfo;
            const avatar =
              user.avatar == ""
                ? require("@/assets/images/animal.png")
                : user.avatar;

            if (user.roleid == 1) {
              user.perms = ["*"];
              commit("SET_ROLES", ["超级管理员"]);
              commit("SET_PERMISSIONS", ["*"]);
            } else {
              // 验证返回的roles是否是一个非空数组
              commit("SET_ROLES", data.perms);
              commit("SET_PERMISSIONS", data.perms);
            }
            // 获取菜单数组
            if (data.menu.length > 0) {
              data.menu.map(menu => {
                if (menu.children && menu.children.length > 0) {
                  menu.children.map(sub => {
                    delete sub.alwaysShow;
                    if (sub.children && sub.children.length > 0) {
                      sub.redirect = "noRedirect";
                      sub.alwaysShow = true;
                      sub.children.map(child => {
                        child.hidden = false;
                        delete child.alwaysShow;
                        if (child.redirect) delete child.redirect;
                      });
                    }
                  });
                }
              });

              commit("SET_MENUS", data.menu);
            }

            if (data.sk_list && data.sk_list.length > 0) {
              commit("SET_USERSK", data.sk_list);
            }

            commit("SET_NAME", user);
            commit("SET_AVATAR", avatar);
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    // 跟新用户信息
    SetUserinfo({ commit }, data) {
      commit("SET_NAME", data);
    },

    // 设置系统水库
    SetCurrentSk({ commit }, code) {
      commit("SET_CURRENTSK", code);
    },
    // 设置系统水库名称
    SetCurrentName({ commit }, code) {
      commit("SET_CURRENTNAME", code);
    },
    // 调整logo及首页显示
    SetShowDash({ commit }, code) {
      commit("SET_SHOWDASH", code);
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(() => {
            commit("SET_TOKEN", "");
            commit("SET_ROLES", []);
            commit("SET_PERMISSIONS", []);
            sessionStorage.clear();
            removeToken();
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 首页处理图层类型
    setSiteType({ commit }, size) {
      commit("SET_SITETYPE", size);
    },
    // 首页处理图层数据
    setSiteList({ commit }, size) {
      commit("SET_SITELIST", size);
    },
    // 首页处理行政区下拉选数据
    getPartSelect({ commit }) {
      return new Promise((resolve, reject) => {
        parttree({
          not_sk: 0
        })
          .then(res => {
            commit("SET_PARTLIST", res.data);
            resolve(res.data);
          })
          .catch(error => {
            commit("SET_PARTLIST", []);
            reject(error);
          });
      });
    }
  }
};

export default user;
