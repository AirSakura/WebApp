import Vue from "vue";
import axios from "axios"
import VueAxios from "vue-axios"

import Cookies from "js-cookie";

import "normalize.css/normalize.css"; // a modern alternative to CSS resets

import Element from "element-ui";
import "./styles/element-variables.scss";

import "@/styles/index.scss"; // global css

import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import "leaflet.pm";
import "leaflet.pm/dist/leaflet.pm.css";

import App from "./App";
import store from "./store";
import router from "./router";
import preventClick from "@/directive/controlClick";
import "./icons";
import "./permission";
import "./utils/error-log";
import { Message, MessageBox } from "element-ui";
import * as filters from "./filters";
import permission from "@/directive/permission/index.js";
import Pagination from "@/components/Pagination";
import VueCompositionAPI from "@vue/composition-api";
// 下拉目录树
import TreeselectRole from "@/components/TreeSelect";
import TreeSelectProvince from "@/components/TreeSelect/province";
import TreeSelectPart from "@/components/TreeSelect/part";
import HomeSelectPart from "@/components/TreeSelect/partProp";
// 侧边栏目录树
import ztree from "@/components/ZtreePart/part";
import Roleztree from "@/components/ZtreePart/role";
import Hamburg from "@/components/ZtreePart/Hamburger";
import Province from "@/components/ZtreePart/province";
import "y_treeselect/dist/vue-treeselect.css";
import * as echarts from "echarts";
import XLSX from "xlsx";

Vue.use(VueAxios,axios)
Vue.use(Element, { zIndex: 1000 });
Vue.prototype.XLSX = XLSX;

import { selectDictLabel, assignObj } from "@/utils/index";
Vue.prototype.selectDictLabel = selectDictLabel;
Vue.prototype.assignObj = assignObj;

Vue.prototype.$messages = Message;
Vue.prototype.$confirms = MessageBox.confirm;
Vue.config.productionTip = false;
Vue.prototype.$echarts = echarts;

Vue.component("Pagination", Pagination);
Vue.component("TreeSelectRole", TreeselectRole);
Vue.component("TreeSelectProvince", TreeSelectProvince);
Vue.component("TreeSelectPart", TreeSelectPart);
Vue.component("HomeSelectPart", HomeSelectPart);

Vue.component("ztree", Province);
Vue.component("Partztree", ztree);
Vue.component("Roleztree", Roleztree);

Vue.component("Hamburg", Hamburg);

Vue.use(VueCompositionAPI);
Vue.use(Element, {
  size: Cookies.get("size") || "medium"
});
Vue.directive("permission", permission);
Vue.use(preventClick);
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App)
});

const on = Vue.prototype.$on;
Vue.prototype.$on = function(event, func) {
  let timer;
  let flag = true;
  let newFunc = func;
  if (event === "click") {
    newFunc = function() {
      if (flag) {
        func.apply(this, arguments);
        flag = false;
      }
      clearTimeout(timer);
      timer = setTimeout(function() {
        flag = true;
      }, 500);
    };
  }
  on.call(this, event, newFunc);
};
