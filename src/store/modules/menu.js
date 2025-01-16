let menu = [
  /*  {
    name: "Reservoir",
    path: "/reservoir",
    hidden: false,
    redirect: "noRedirect",
    component: "Layout",
    alwaysShow: true,
    meta: { title: "水库管理", icon: "reservoir", noCache: false },
    children: [
      {
        name: "Information",
        path: "information",
        hidden: false,
        redirect: "noRedirect",
        component: "ParentView",
        alwaysShow: true,
        meta: {
          title: "水库信息",
          icon: "information",
          noCache: false
        },
        children: [
          {
            name: "Base",
            path: "base",
            hidden: false,
            component: "reservoir/base",
            meta: { title: "基本信息", icon: "dot", noCache: false }
          },
          {
            name: "Features",
            path: "features",
            hidden: false,
            component: "reservoir/features",
            meta: { title: "水文特征", icon: "dot", noCache: false }
          }
        ]
      },
      {
        name: "Building",
        path: "building",
        hidden: false,
        redirect: "noRedirect",
        component: "ParentView",
        alwaysShow: true,
        meta: {
          title: "建筑物管理",
          icon: "all",
          noCache: false
        },
        children: [
          {
            name: "Baffle",
            path: "baffle",
            hidden: false,
            component: "reservoir/baffle",
            meta: { title: "挡水建筑物", icon: "dot", noCache: false }
          },
          {
            name: "Drainage",
            path: "drainage",
            hidden: false,
            component: "reservoir/drainage",
            meta: { title: "泄水建筑物", icon: "dot", noCache: false }
          },
          {
            name: "Other",
            path: "other",
            hidden: false,
            component: "reservoir/other",
            meta: { title: "其他建筑物", icon: "dot", noCache: false }
          }
        ]
      },
      {
        name: "Operation",
        path: "operation",
        hidden: false,
        component: "reservoir/operation",
        meta: { title: "运行管理", icon: "resource", noCache: false }
      },
      {
        name: "Unit",
        path: "unit",
        hidden: true,
        component: "reservoir/unit",
        meta: { title: "管理单位", icon: "tree", noCache: false }
      }
    ]
  }, */
  {
    name: "Reservoir",
    path: "/reservoir",
    hidden: false,
    redirect: "noRedirect",
    component: "Layout",
    alwaysShow: true,
    meta: { title: "水库管理", icon: "reservoir", noCache: false },
    children: [
      {
        name: "ReservoirIndex",
        path: "reservoir-index",
        hidden: true,
        component: "reservoir/index",
        meta: { title: "水库管理", icon: "reservoir", noCache: false }
      }
    ]
  },
  {
    name: "Operation",
    path: "/operation",
    hidden: false,
    redirect: "noRedirect",
    component: "Layout",
    alwaysShow: true,
    meta: { title: "运行管理", icon: "operation", noCache: false },
    children: [
      {
        name: "Material",
        path: "material",
        hidden: false,
        redirect: "noRedirect",
        component: "ParentView",
        alwaysShow: true,
        meta: {
          title: "物资管理",
          icon: "features",
          noCache: false
        },
        children: [
          {
            name: "Warehouse",
            path: "warehouse",
            hidden: false,
            component: "material/warehouse",
            meta: { title: "仓库管理", icon: "dot", noCache: false }
          },
          {
            name: "MaterialManage",
            path: "material-manage",
            hidden: false,
            component: "material/manage",
            meta: { title: "物资管理", icon: "dot", noCache: false }
          },
          {
            name: "MaterialCheck",
            path: "material-check",
            hidden: false,
            component: "material/check",
            meta: { title: "物资审核", icon: "dot", noCache: false }
          },
          {
            name: "MaterialLog",
            path: "material-log",
            hidden: false,
            component: "material/log",
            meta: { title: "物资日志", icon: "dot", noCache: false }
          }
        ]
      },
      {
        name: "Order",
        path: "Order",
        hidden: false,
        redirect: "noRedirect",
        component: "ParentView",
        alwaysShow: true,
        meta: {
          title: "工单管理",
          icon: "order",
          noCache: false
        },
        children: [
          {
            name: "OrderWork",
            path: "order-work",
            hidden: false,
            component: "order/work",
            meta: { title: "检查项", icon: "dot", noCache: false }
          },
          {
            name: "OrderTask",
            path: "order-task",
            hidden: false,
            component: "order/task",
            meta: { title: "工单管理", icon: "dot", noCache: false }
          },
          {
            name: "OrderList",
            path: "order-list",
            hidden: false,
            component: "order/list",
            meta: { title: "运维工单", icon: "dot", noCache: false }
          },
          {
            name: "OrderMatter",
            path: "order-matter",
            hidden: false,
            component: "order/matter",
            meta: { title: "事件管理", icon: "dot", noCache: false }
          },
          
        ]
      },
      {
        name: "Orderstate",
        path: "Orderstate",
        hidden: false,
        redirect: "noRedirect",
        component: "ParentView",
        alwaysShow: true,
        meta: {
          title: "工单统计",
          icon: "chart",
          noCache: false
        },
        children: [
          {
            name: "TourState",
            path: "tour-state",
            hidden: false,
            component: "state/tour",
            meta: { title: "巡视检查", icon: "dot", noCache: false }
          },
          {
            name: "MaintainState",
            path: "Maintain-State",
            hidden: false,
            component: "state/tour",
            meta: { title: "养护维修", icon: "dot", noCache: false }
          },
          {
            name: "ClearState",
            path: "clear-state",
            hidden: false,
            component: "state/tour",
            meta: { title: "水库保洁", icon: "dot", noCache: false }
          }
        ]
      },
      {
        name: "Overview",
        path: "overview",
        hidden: false,
        component: "state/overview",
        meta: { title: "运维总览", icon: "monitor", noCache: false }
      },
    ]
  },
  {
    name: "Device",
    path: "/device",
    hidden: false,
    redirect: "noRedirect",
    component: "Layout",
    alwaysShow: true,
    meta: { title: "设备管理", icon: "set", noCache: false },
    children: [
      {
        name: "Monitor",
        path: "monitor",
        hidden: false,
        redirect: "noRedirect",
        component: "ParentView",
        alwaysShow: true,
        meta: {
          title: "监测设备",
          icon: "monitoring",
          noCache: false
        },
        children: [
          {
            name: "MonitorSite",
            path: "monitor-site",
            hidden: false,
            component: "monitor/site",
            meta: { title: "站点管理", icon: "dot", noCache: false }
          },
          {
            name: "MonitorSection",
            path: "monitor-section",
            hidden: false,
            component: "monitor/section",
            meta: { title: "断面管理", icon: "dot", noCache: false }
          },
          {
            name: "MonitorType",
            path: "monitor-type",
            hidden: false,
            component: "monitor/type",
            meta: { title: "设备型号", icon: "dot", noCache: false }
          },
          {
            name: "MonitorApply",
            path: "monitor-apply",
            hidden: false,
            component: "monitor/apply",
            meta: { title: "接入申请", icon: "dot", noCache: false }
          },
          {
            name: "MonitorDevice",
            path: "monitor-device",
            hidden: false,
            component: "monitor/device",
            meta: { title: "设备管理", icon: "dot", noCache: false }
          }
          // {
          //   name: "MonitorLog",
          //   path: "monitor-log",
          //   hidden: false,
          //   component: "monitor/log",
          //   meta: { title: "设备日志", icon: "dot", noCache: false }
          // }
        ]
      },
      {
        name: "Warning",
        path: "warning",
        hidden: false,
        redirect: "noRedirect",
        component: "ParentView",
        alwaysShow: true,
        meta: {
          title: "预警监测",
          icon: "warn",
          noCache: false
        },
        children: [
          {
            name: "WarningRule",
            path: "warning-rule",
            hidden: false,
            component: "warning/rule",
            meta: { title: "预警规则", icon: "dot", noCache: false }
          },
          {
            name: "WarningInfo",
            path: "warning-info",
            hidden: false,
            component: "warning/info",
            meta: { title: "预警记录", icon: "dot", noCache: false }
          }
        ]
      },
      {
        name: "Video",
        path: "video",
        hidden: false,
        redirect: "noRedirect",
        component: "ParentView",
        alwaysShow: true,
        meta: {
          title: "视频监控",
          icon: "video",
          noCache: false
        },
        children: [
          {
            name: "VideoPoint",
            path: "video-point",
            hidden: false,
            component: "video/point",
            meta: { title: "监控管理", icon: "dot", noCache: false }
          },
          {
            name: "VideoCamera",
            path: "video-camera",
            hidden: false,
            component: "video/camera",
            meta: { title: "视频大厅", icon: "dot", noCache: false }
          }
        ]
      },
      {
        name: "Uav",
        path: "uav",
        hidden: false,
        redirect: "noRedirect",
        component: "ParentView",
        alwaysShow: true,
        meta: {
          title: "无人机",
          icon: "drone",
          noCache: false
        },
        children: [
          {
            name: "UavIndex",
            path: "uav-index",
            hidden: false,
            component: "uav/uav",
            meta: { title: "无人机管理", icon: "dot", noCache: false }
          },
          {
            name: "UavData",
            path: "uav-data",
            hidden: false,
            component: "uav/data",
            meta: { title: "无人机数据", icon: "dot", noCache: false }
          }
        ]
      },
      {
        name: "VrData",
        path: "vr-data",
        hidden: false,
        component: "vr/data",
        meta: { title: "全景图片", icon: "vr-img", noCache: false }
      }
    ]
  },
  {
    name: "Security",
    path: "/security",
    hidden: false,
    redirect: "noRedirect",
    component: "Layout",
    alwaysShow: true,
    meta: { title: "安全管理", icon: "security", noCache: false },
    children: [
      {
        name: "File",
        path: "file",
        hidden: false,
        redirect: "noRedirect",
        component: "ParentView",
        alwaysShow: true,
        meta: {
          title: "文档管理",
          icon: "documentation",
          noCache: false
        },
        children: [
          {
            name: "Appraisal",
            path: "appraisal",
            hidden: false,
            component: "security/appraisal",
            meta: { title: "安全鉴定", icon: "dot", noCache: false }
          },
          {
            name: "Reinforcement",
            path: "reinforcement",
            hidden: false,
            component: "security/reinforcement",
            meta: { title: "除险加固", icon: "dot", noCache: false }
          }
        ]
      },
      {
        name: "Safety",
        path: "safety",
        hidden: false,
        redirect: "noRedirect",
        component: "ParentView",
        alwaysShow: true,
        meta: {
          title: "安全监测",
          icon: "plane",
          noCache: false
        },
        children: [
          {
            name: "Settlement",
            path: "settlement",
            hidden: false,
            component: "security/settlement",
            meta: { title: "沉降监测", icon: "dot", noCache: false }
          },
          {
            name: "Waterlevel",
            path: "waterlevel",
            hidden: false,
            component: "security/waterlevel",
            meta: { title: "水位监测", icon: "dot", noCache: false }
          },
          {
            name: "Rainfall",
            path: "rainfall",
            hidden: false,
            component: "security/rainfall",
            meta: { title: "雨量监测", icon: "dot", noCache: false }
          },
          {
            name: "Pressure",
            path: "pressure",
            hidden: false,
            component: "security/pressure",
            meta: { title: "渗压监测", icon: "dot", noCache: false }
          },
          {
            name: "Seepage",
            path: "seepage",
            hidden: false,
            component: "security/seepage",
            meta: { title: "渗流监测", icon: "dot", noCache: false }
          },
          {
            name: "Temperature",
            path: "temperature",
            hidden: false,
            component: "security/temperature",
            meta: { title: "气温监测", icon: "dot", noCache: false }
          },
          {
            name: "Atmospheric",
            path: "atmospheric",
            hidden: false,
            component: "security/atmospheric",
            meta: { title: "气压监测", icon: "dot", noCache: false }
          },
          {
            name: "Displacement",
            path: "displacement",
            hidden: false,
            component: "security/displacement",
            meta: { title: "表面位移", icon: "dot", noCache: false }
          },
          {
            name: "Infiltra",
            path: "infiltra",
            hidden: false,
            component: "security/infiltra",
            meta: { title: "浸润线分析", icon: "dot", noCache: false }
          }
        ]
      }
    ]
  },
  {
    name: "Analysis",
    path: "/analysis",
    hidden: true,
    redirect: "noRedirect",
    component: "Layout",
    alwaysShow: false,
    meta: { title: "统计分析", icon: "linechart", noCache: false },
    children: [
      {
        name: "Water",
        path: "water",
        hidden: false,
        component: "analysis/water",
        meta: { title: "水情", icon: "waterfall", noCache: false }
      },
      {
        name: "WaterView",
        path: "water-view",
        hidden: true,
        component: "analysis/waterView",
        meta: { title: "水情", icon: "waterfall", noCache: false }
      },
      {
        name: "Rain",
        path: "rain",
        hidden: false,
        component: "analysis/rain",
        meta: { title: "雨情", icon: "rainfall", noCache: false }
      },
      {
        name: "RainView",
        path: "rain-view",
        hidden: true,
        component: "analysis/rainView",
        meta: { title: "雨情", icon: "rainfall", noCache: false }
      },
      {
        name: "Quality",
        path: "quality",
        hidden: false,
        component: "analysis/quality",
        meta: { title: "水质", icon: "quality", noCache: false }
      },
      {
        name: "QualityView",
        path: "quality-view",
        hidden: true,
        component: "analysis/qualityView",
        meta: { title: "水质", icon: "quality", noCache: false }
      },
      {
        name: "Flow",
        path: "flow",
        hidden: false,
        component: "analysis/flow",
        meta: { title: "流量", icon: "flow", noCache: false }
      },
      {
        name: "FlowView",
        path: "flow-view",
        hidden: true,
        component: "analysis/flowView",
        meta: { title: "流量", icon: "flow", noCache: false }
      },
      {
        name: "Capacity",
        path: "capacity",
        hidden: false,
        component: "analysis/capacity",
        meta: { title: "水位库容统计", icon: "features", noCache: false }
      }
    ]
  },
  {
    name: "Setting",
    path: "/setting",
    hidden: true,
    redirect: "noRedirect",
    component: "Layout",
    alwaysShow: false,
    meta: { title: "系统管理", icon: "system", noCache: false },
    children: [
      {
        name: "Profile",
        path: "profile",
        hidden: false,
        component: "setting/profile",
        meta: { title: "个人中心", icon: "user", noCache: false }
      },
      {
        name: "Notice",
        path: "notice",
        hidden: false,
        component: "setting/notice",
        meta: { title: "发布通知", icon: "message", noCache: false }
      },
      {
        name: "Training",
        path: "training",
        hidden: false,
        redirect: "noRedirect",
        component: "ParentView",
        alwaysShow: true,
        meta: {
          title: "培训管理",
          icon: "education",
          noCache: false
        },
        children: [
          {
            name: "Record",
            path: "record",
            hidden: false,
            component: "training/record",
            meta: { title: "培训记录", icon: "dot", noCache: false }
          },
          {
            name: "Course",
            path: "course",
            hidden: false,
            component: "training/course",
            meta: { title: "培训视频", icon: "dot", noCache: false }
          }
        ]
      },
      {
        name: "Part",
        path: "part",
        hidden: false,
        component: "setting/part",
        meta: { title: "行政区管理", icon: "tree-table", noCache: false }
      },
      {
        name: "ReservoirManage",
        path: "reservoir-manage",
        hidden: false,
        component: "setting/reservoir",
        meta: { title: "水库管理", icon: "reservoir", noCache: false }
      },
      {
        name: "ReservoirForm",
        path: "reservoir-form",
        hidden: true,
        component: "setting/reservoirForm",
        meta: { title: "水库管理", icon: "reservoir", noCache: false }
      },
      {
        name: "Role",
        path: "role",
        hidden: false,
        component: "setting/role",
        meta: { title: "角色管理", icon: "examine", noCache: false }
      },
      {
        name: "User",
        path: "user",
        hidden: false,
        component: "setting/user",
        meta: { title: "用户管理", icon: "peoples", noCache: false }
      },
      {
        name: "Menu",
        path: "menu",
        hidden: false,
        component: "setting/menu",
        meta: { title: "菜单管理", icon: "features", noCache: false }
      },
      {
        name: "Layer",
        path: "layer",
        hidden: false,
        component: "setting/layer",
        meta: { title: "图层管理", icon: "tree", noCache: false }
      },
      {
        name: "Feedback",
        path: "feedback",
        hidden: false,
        component: "setting/feedback",
        meta: { title: "意见管理", icon: "feedback", noCache: false }
      },
      {
        name: "Log",
        path: "log",
        hidden: false,
        component: "setting/log",
        meta: { title: "系统日志", icon: "log", noCache: false }
      },
      {
        name: "Dictionary",
        path: "dictionary",
        hidden: false,
        component: "setting/dictionary",
        meta: { title: "字典配置", icon: "device", noCache: false }
      },

      {
        name: "Access",
        path: "access",
        hidden: false,
        redirect: "noRedirect",
        component: "ParentView",
        alwaysShow: true,
        meta: {
          title: "设备管理",
          icon: "documentation",
          noCache: false
        },
        children: [
          {
            name: "AccessType",
            path: "access-type",
            hidden: false,
            component: "access/device/type",
            meta: { title: "设备型号", icon: "device", noCache: false }
          },
          {
            name: "AccessApply",
            path: "access-apply",
            hidden: false,
            component: "access/device/apply",
            meta: { title: "接入管理", icon: "device", noCache: false }
          }
        ]
      }
      // {
      //   name: "Parameter",
      //   path: "parameter",
      //   hidden: false,
      //   redirect: "noRedirect",
      //   component: "ParentView",
      //   alwaysShow: true,
      //   meta: {
      //     title: "接入配置",
      //     icon: "parameter",
      //     noCache: false
      //   },
      //   children: [
      //     {
      //       name: "Parsing",
      //       path: "parsing",
      //       hidden: false,
      //       component: "parameter/parsing",
      //       meta: { title: "接入服务管理", icon: "dot", noCache: false }
      //     },
      //     {
      //       name: "Redis",
      //       path: "redis",
      //       hidden: false,
      //       component: "parameter/redis",
      //       meta: { title: "Redis配置", icon: "dot", noCache: false }
      //     },
      //     {
      //       name: "Influx",
      //       path: "influx",
      //       hidden: false,
      //       component: "parameter/influx",
      //       meta: { title: "数据存储管理", icon: "dot", noCache: false }
      //     }
      //   ]
      // }
      // {
      //   name: "Service",
      //   path: "service",
      //   hidden: false,
      //   redirect: "noRedirect",
      //   component: "ParentView",
      //   alwaysShow: true,
      //   meta: {
      //     title: "接入服务管理",
      //     icon: "documentation",
      //     noCache: false
      //   },
      //   children: [
      //     {
      //       name: "ServiceServer",
      //       path: "service-server",
      //       hidden: false,
      //       component: "access/service/server",
      //       meta: { title: "服务器管理", icon: "dot", noCache: false }
      //     },
      //     {
      //       name: "ServiceMysql",
      //       path: "service-mysql",
      //       hidden: false,
      //       component: "access/service/mysql",
      //       meta: { title: "mysql管理", icon: "dot", noCache: false }
      //     },
      //     {
      //       name: "ServiceRedis",
      //       path: "service-redis",
      //       hidden: false,
      //       component: "access/service/redis",
      //       meta: { title: "redis管理", icon: "dot", noCache: false }
      //     },
      //     {
      //       name: "ServiceInflux",
      //       path: "service-influx",
      //       hidden: false,
      //       component: "access/service/influx",
      //       meta: { title: "influxDB管理", icon: "dot", noCache: false }
      //     },
      //     {
      //       name: "ServiceData",
      //       path: "service-data",
      //       hidden: false,
      //       component: "access/service/data",
      //       meta: { title: "数据接入中心", icon: "dot", noCache: false }
      //     }
      //   ]
      // }
    ]
  }
];

export default menu;
