import router from "./router";
import store from "./store";

import { Message } from "element-ui";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getToken, removeToken } from "@/utils/auth"; // get token from cookie
import getPageTitle from "@/utils/get-page-title";
NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ["/login"]; // no redirect whitelist
const session = [
  "/redirect",
  "/",
  "/dashboard",
  "/404",
  "/401",
  "/auth-redirect"
];
router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start();

  // set page title
  document.title = getPageTitle(to.meta.title);

  // 综合监控和水库管理不显示侧边菜单
  if (to.name) {
    if (to.name == "Dashboard" || to.name == "EditmapIndex") {
      store.dispatch("app/toggleFullscreen", true);
    } else {
      store.dispatch("app/toggleFullscreen", false);
    }
  }

  if (session.indexOf(to.path) !== -1) {
    sessionStorage.setItem("topCode", "Dashboard");
  }

  // determine whether the user has logged in
  const hasToken = getToken();
  if (hasToken) {
    if (to.path === "/login") {
      // if is logged in, redirect to the home page
      next();
      NProgress.done();
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = store.getters.roles && store.getters.roles.length > 0;

      if (hasRoles) {
        next();
      } else {
        store
          .dispatch("GetInfo")
          .then(() => {
            store.dispatch("GenerateRoutes").then(accessRoutes => {
              // 根据roles权限生成可访问的路由表
              router.addRoutes(accessRoutes); // 动态添加可访问路由表
              global.antRouter = accessRoutes;

              next({ ...to, replace: true }); // hack方法 确保addRoutes已完成
            });
          })
          .catch(err => {
            sessionStorage.clear();
            removeToken();
            next(`/login`);
            NProgress.done();
          });
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next();
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
