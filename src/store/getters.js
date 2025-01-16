// 这个包装数据 形成新的数据
const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  field: state => state.app.field,
  fieldfire: state => state.app.fieldfire,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  config: state => state.user.config,
  user: state => state.user.userinfo,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  menus: state => state.user.menus,
  permissions: state => state.user.permissions,
  permission_routes: state => state.permission.routes,
  addRoutes: state => state.permission.addRoutes,
  topbarRouters: state => state.permission.topbarRouters,
  defaultRoutes: state => state.permission.defaultRoutes,
  sidebarRouters: state => state.permission.sidebarRouters,
  errorLogs: state => state.errorLog.logs,
  currentLayer: state => state.map.currentLayer,
  currentPage: state => state.map.currentPage,
  currentPart: state => state.map.currentPart,
  dict: state => state.app.dict,
  map: state => state.map.map,

  // 头部水库切换
  currentsk: state => state.user.currentsk,
  showdash: state => state.user.showdash,
  usersk: state => state.user.usersk,
  currentname: state => state.user.currentname,

  // 综合监控数据
  siteList: state => state.user.siteList,
  siteType: state => state.user.siteType,
  partList: state => state.user.partList
};
export default getters;
