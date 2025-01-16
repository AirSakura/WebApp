<template>
  <fullscreen
    :fullscreen.sync="fullscreen"
    style="position: relative;height:100%"
  >
    <div
      id="map"
      ref="map"
      v-loading="loading"
      element-loading-text="图层加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :style="{ height: size, width: '100%' }"
    >
      <layer_
        v-if="slayer"
        ref="layer_"
        :base-layer="baseLayer"
        :map="map"
        :obj="obj"
        :list="list"
        :right="isRight"
        :showSk="showSk"
        :showBotControl="showBotControl"
        @closeslider="closeslider"
        @gettime="gettime"
        @screen="screen"
        @scale="scale"
        @clearPm="clearPm"
        @toggleSideBar="toggleSideBar"
        @HandleWard="Handleward"
        @scrolldisable="scrolldisable"
        @scrollenable="scrollenable"
      />
    </div>
  </fullscreen>
</template>
<script>
/*global L*/
import { querylayers } from "@/api/layer";
import { querytimesection } from "@/api/query";
import store from "@/store";
import "leaflet-draw";
import "./js/leaflet.draw-cn.js";
import "leaflet-draw/dist/leaflet.draw.css";

import layer_ from "./components/layer"; // 图层
import { getToken } from "@/utils/auth";
import { parseTime } from "@/utils";
require("@/utils/blinkmarker");

import { mapGetters } from "vuex";
import VueFullscreen from "vue-fullscreen";
import Vue from "vue";
Vue.use(VueFullscreen);
var cmap = null;

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

export default {
  name: "smap",
  components: {
    layer_
  },
  props: {
    islatlng: {
      default: false,
      type: Boolean
    },
    slayer: {
      default: true,
      type: Boolean
    },
    showSk: {
      default: false,
      type: Boolean
    },
    firstShowTool: {
      default: true,
      type: Boolean
    },
    showBotControl: {
      default: false,
      type: Boolean
    },
    size: {
      default: "calc(100vh - 72px)",
      type: String
    },
    right: {
      default: false,
      type: Boolean
    },
    geoJson: {
      type: Array,
      default: () => []
    },
    showPoint: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      showDrawMark: true,
      map: null,
      fullscreen: false,
      loading: false,
      current_: "",
      fullheight: document.body.clientHeight + "px",
      layers: ["mask"],
      Markers: null,
      MarkText: null,
      width: "",
      lat: null,
      lng: null,
      options: {},
      list: [],
      obj: {},
      baseLayer: {},
      lnglat: [111.486084, 30.75249],
      layerid: "f14c9476065411ec950744032cbb6af1",
      toolsLayer: [],
      markersLayer: [],
      pmText: "",
      coordinate: {},
      // draw地图插件
      drawControl: null,
      // 绘制对象
      drawObj: null,
      // 图形图层组
      drawLayerGrounp: null,
      isRight: false,
      // 历史航拍图层
      layerdata: [],
      slider: false,
      marks: []
    };
  },
  computed: {
    ...mapGetters(["user", "currentPage", "currentLayer", "showdash"]),
    headers() {
      return {
        token: getToken()
      };
    }
  },
  watch: {
    currentLayer: {
      handler: function(oldValue, newValue) {
        if (document.querySelector(".leaflet-right")) {
          document.querySelector(".leaflet-right").style.display =
            oldValue == "tool" ? "block" : "none";

          let domlist = document.querySelectorAll(".leaflet-right");
          let dom = document.querySelector(".leaflet-right");

          if (domlist.length > 2) dom = domlist[2];
          dom.style.display = oldValue == "tool" ? "block" : "none";

          if (this.right) {
            dom.style.right = "38px";
          } else {
            dom.style.right = "38px";
          }
        }

        switch (oldValue) {
          case "tool":
            break;
          default:
        }
      },
      immediate: true,
      deep: true
    },
    fullscreen: {
      handler(n) {
        if (this.showdash === true || this.showdash === "true") {
          this.isRight = this.fullscreen;
        } else {
          this.isRight = true;
        }
        if (n) {
          this.fullheight = "calc(100vh)";
        } else {
          setTimeout(() => {
            this.fullheight = document.body.clientHeight - 130 + "px";
          }, 100);
        }
        setTimeout(() => {
          this.width = Number(document.querySelector("#map").offsetWidth - 400);
        }, 100);
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.isRight = this.right;
    const end = parseTime(Date.parse(new Date()));
    const start = parseTime(Date.parse(new Date()) - 3600 * 1000 * 24 * 5);
  },
  mounted() {
    this.init();
    this.$nextTick(() => {
      if (cmap) {
        cmap.invalidateSize(true);
      }
    });
    (window.onresize = () => {
      setTimeout(() => {
        this.width = Number(document.querySelector("#map").offsetWidth - 400);
      }, 100);
    }),
      (window.handleUserTrack = name => {
        this.$emit("trackOpen", name);
      });
  },
  destroyed() {
    window.onresize = null;
  },
  methods: {
    // 开启航拍历史图层
    gettime() {
      querytimesection().then(res => {
        var data = res.data.data;
        this.layerdata = data;
        var marks = [];
        data.forEach((v, i) => {
          marks.push(v.dronetime);
        });

        this.marks = Array.from(new Set(marks));
        this.slider = true;
      });
    },
    // 关闭航拍历史图层
    closeslider() {
      this.slider = false;
      if (this.layerLine) this.map.removeLayer(this.layerLine);
    },
    // 切换航拍历史图层
    setchecked(v) {
      this.slidered = v;
    },
    // 切换航拍历史图层
    slidervalue(value) {
      this.currerTime = value;
      if (this.sliderData) {
        this.cantonData = {};
        this.cantonData = this.sliderData.find(v => v.stattime == value);
      }
      if (this.layerLine) this.map.removeLayer(this.layerLine);
      if (value) {
        let item = this.layerdata.find(v => v.dronetime == value);
        this.layerLine = L.tileLayer(
          `${
            process.env.VUE_APP_BASE_API
          }drone/layer/gettimelayertile?token=${getToken()}&time=${value}&x={x}&y={y}&z={z}`,
          {
            maxZoom: item.maxlevel,
            minZoom: item.minlevel
          }
        );
        this.map.addLayer(this.layerLine);
        this.$message({
          message: `图层切换成功！`,
          type: "success"
        });
      }
    },
    // 绘制行政边界
    setGeoJson() {
      let geo = L.geoJson(this.geoJson, {
        style: {
          color: "#F6D92F",
          weight: 5,
          fillColor: "#00192E",
          fillOpacity: 0,
          id: "part"
        }
      });
      geo.addTo(this.map);
    },

    // 设置地图中心点
    setMapCenter(center, zoom) {
      this.map.flyTo(center, zoom);
    },
    // 回填打点
    setMarker(y, x, images) {
      // x经度 y纬度
      if (!this.islatlng) return;
      this.map.flyTo([y, x], 12);
      if (this.drawMarkers) this.drawMarkers.clearLayers();
      this.drawMarkers
        .addLayer(
          L.marker([y, x], {
            icon: images ? this.setmarkerIcon(images) : new L.Icon.Default()
          })
        )
        .bindPopup(this.strLatLng({ lng: x, lat: y }))
        .openPopup()
        .addTo(this.map);
    },
    // 获取画线数据
    setPolyline(coordinates) {
      try {
        if (this.drawLines) this.drawLines.clearLayers();

        let distance = 0;
        for (var i = 0; i < coordinates.length - 1; i++) {
          distance += L.latLng(coordinates[i]).distanceTo(
            L.latLng(coordinates[i + 1])
          );
        }
        let disStr = "距离: " + distance.toFixed(2) + "m";
        if (distance > 10e2) {
          disStr = "距离: " + (distance / 10e2).toFixed(2) + "km";
        }
        this.drawLines
          .addLayer(L.polyline(coordinates))
          .bindPopup(disStr)
          .openPopup()
          .addTo(this.map);
        this.map.setView(coordinates[0], 12);
      } catch (err) {
        this.$messages({
          type: "warning",
          message: err
        });
      }
    },
    // 获取画面数据
    setPolygon(coordinate) {
      try {
        if (this.drawLayers) this.drawLayers.clearLayers();

        let area = L.GeometryUtil.geodesicArea(coordinate);
        let areaStr = "面积: " + area.toFixed(2) + "㎡";
        if (area > 10e5) {
          areaStr = "面积: " + (area / 10e5).toFixed(2) + "k㎡";
        }

        this.drawLines
          .addLayer(L.polygon(coordinate))
          .bindPopup(areaStr)
          .openPopup()
          .addTo(this.map);
        var tmpExtend = this.drawLines.getBounds(coordinate);
        this.map.flyToBounds(tmpExtend);
      } catch (err) {
        this.$messages({
          type: "warning",
          message: err
        });
      }
    },
    // 交互绘制回调
    drawCreatedBack(e) {
      this.map.off("click");
      // 绘制的图形图层对象
      let layer = e.layer;
      if (e.layerType === "marker") {
        if (this.drawMarkers) this.drawMarkers.clearLayers();
        this.drawMarkers.addLayer(layer);
      }

      if (e.layerType === "polyline") {
        this.drawLines.addLayer(layer);
      }

      if (e.layerType === "polygon") {
        this.drawLayers.addLayer(layer);
      }
    },
    // 初始化绘制控件
    initDrawCtrl() {
      //初始化绘制控件
      this.drawControl = new L.Control.Draw({
        position: "topright", //控件位置 'topleft'(默认), 'topright', 'bottomleft' or 'bottomright'
        draw: {
          polyline: {
            metric: true,
            feet: false
          },
          polygon: {
            allowIntersection: false,
            showArea: true,
            metric: ["km", "m"]
          },
          marker: false,
          rectangle: false,
          circle: false,
          circlemarker: false
        }
        // edit: {
        //   featureGroup: this.drawnItems,
        //   remove: true,
        //   poly: {
        //     allowIntersection: false
        //   }
        // }
      }).addTo(this.map); // 要添加到 L.map 对象中

      let domlist = document.querySelectorAll(".leaflet-right");
      if (domlist.length > 0) {
        domlist.forEach(dom => {
          dom.style.display = "none";
        });
      }

      this.$store.dispatch("map/setLayer", "");
      if (this.firstShowTool) {
        this.$store.dispatch("map/setLayer", "tool");
      }
      // document.querySelector(".leaflet-right").style.display = "none";

      // 添加绘制完监听事件
      this.map.on(L.Draw.Event.CREATED, this.drawCreatedBack);
    },

    _round(num, len) {
      return Math.round(num * Math.pow(10, len)) / Math.pow(10, len);
    },
    strLatLng(latlng) {
      return (
        "(" +
        this._round(latlng.lng, 6) +
        ", " +
        this._round(latlng.lat, 6) +
        ")"
      );
    },
    getPopupContent(layer) {
      if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
        let l = layer.getLatLng();
        this.$emit("setlatlng", [l.lat, l.lng]);
        return this.strLatLng(l);
      } else if (layer instanceof L.Polygon) {
        var latlngs = layer._defaultShape
            ? layer._defaultShape()
            : layer.getLatLngs(),
          area = L.GeometryUtil.geodesicArea(latlngs);
        this.$emit("setlatlng", latlngs);
        let areaStr = area.toFixed(2) + "㎡";
        if (area > 10e5) {
          areaStr = (area / 10e5).toFixed(2) + "k㎡";
        }
        return "面积: " + areaStr;
      } else if (layer instanceof L.Polyline) {
        var latlngs = layer._defaultShape
            ? layer._defaultShape()
            : layer.getLatLngs(),
          distance = 0;
        this.$emit("setlatlng", latlngs);
        if (latlngs.length < 2) {
          return "距离: 0";
        } else {
          for (var i = 0; i < latlngs.length - 1; i++) {
            distance += latlngs[i].distanceTo(latlngs[i + 1]);
          }

          let disStr = distance.toFixed(2) + "m";
          if (distance > 10e2) {
            disStr = (distance / 10e2).toFixed(2) + "km";
          }
          return "距离: " + disStr;
        }
      }
      return null;
    },

    // 销毁绘制控件
    destoryDrawCtr() {
      // this.$store.state.map.currentLayer = "";
      // L.Control.Draw 控件对象
      this.drawControl = null;
      // 绘制对象
      this.drawObj = null;
      // 删除全部绘制的图层
      this.clearPm();
      // 取消绘制完监听事件，避免在真正开发中，其它地方也监听了 CREATED 事件
      this.map.off(L.Draw.Event.CREATED, this.drawCreatedBack);
      this.map.closePopup();
    },
    clearPm() {
      // 删除全部绘制的图层
      if (this.drawMarkers) this.drawMarkers.clearLayers();
      if (this.drawLines) this.drawLines.clearLayers();
      if (this.drawLayers) this.drawLayers.clearLayers();
    },
    //  初始化打点
    initDrawPoint() {
      this.map.on("click", e => {
        let latlng = e.latlng;
        if (this.showPoint && this.showDrawMark) {
          this.drawPoint && this.map.removeLayer(this.drawPoint);
          this.drawPoint = L.marker(latlng)
            .addTo(this.map)
            .bindPopup(this.strLatLng(latlng))
            .openPopup();
          this.$emit("setlatlng", [latlng.lat, latlng.lng]);
        }
      });
    },
    init() {
      return new Promise((resolve, reject) => {
        var grayscaleLayer = this.tileLayerUrl("vec", "grayscaleLayer");
        var streetsLayer = this.tileLayerUrl("cva", "streetsLayer");
        var grayscaleLayer_img = this.tileLayerUrl("img", "grayscaleLayer_img");
        var grayscaleLayer_cva = this.tileLayerUrl("cva", "grayscaleLayer_cva");

        var vector = L.layerGroup([grayscaleLayer, streetsLayer]);
        var screenage = L.layerGroup([grayscaleLayer_img, grayscaleLayer_cva]);

        this.baseLayer = {
          矢量图: vector,
          影像图: screenage
        };
        cmap = L.map("map", {
          minZoom: 3, //最小缩放等级
          maxZoom: 18, //最大缩放等级
          layers: [screenage],
          zoomControl: false, //禁用 + - 按钮
          doubleClickZoom: false, // 禁用双击放大
          attributionControl: false // 移除右下角leaflet标识,
        }).setView([30.708928, 111.309222], 12);
        this.map = cmap;

        // 单独处理打点
        this.initDrawPoint();
        cmap.on(L.Draw.Event.DRAWSTART, event => {
          this.drawPoint && this.map.removeLayer(this.drawPoint);
          this.showDrawMark = false;
        });
        cmap.on(L.Draw.Event.DRAWSTOP, event => {
          this.showDrawMark = true;
          this.initDrawPoint();
        });

        // 点集合
        this.drawMarkers = new L.FeatureGroup();
        cmap.addLayer(this.drawMarkers);
        // 线集合
        this.drawLines = new L.FeatureGroup();
        cmap.addLayer(this.drawLines);
        // 面集合
        this.drawLayers = new L.FeatureGroup();
        cmap.addLayer(this.drawLayers);

        this.initDrawCtrl();

        cmap.on(L.Draw.Event.CREATED, event => {
          var layer = event.layer;
          var content = this.getPopupContent(layer);
          if (content !== null) {
            layer.bindPopup(content).openPopup();
          }

          if (event.layerType === "marker") {
            this.drawMarkers.addLayer(layer);
          }

          if (event.layerType === "polyline") {
            this.drawLines.addLayer(layer);
          }

          if (event.layerType === "polygon") {
            this.drawLayers.addLayer(layer);
          }
        });
      });
    },

    setmarkerIcon(images) {
      return L.icon({
        iconUrl: require(`@/assets/images/${images}.png`),
        iconSize: [32, 32],
        iconAnchor: [8, 8],
        popupAnchor: [0, -8]
      });
    },
    getImage(type, name) {
      return `${
        process.env.VUE_APP_BASE_API
      }${type}getimage?image=${name}&token=${getToken()}`;
    },
    toggleSideBar() {
      this.$emit("toggleSideBar");
    },
    scrolldisable() {
      cmap.scrollWheelZoom.disable();
      cmap.doubleClickZoom.disable();
      cmap.dragging.disable();
    },
    scrollenable() {
      cmap.scrollWheelZoom.enable();
      cmap.doubleClickZoom.enable();
      cmap.dragging.enable();
    },
    tileLayerUrl(layer, id) {
      const servers = [...Array(8).keys()];
      const rand = (min = 0, max = 1) =>
        Math.round(Math.random() * (max - min) + min);
      const serversProxy = new Proxy(servers, {
        get(target, prop) {
          if (prop === "server") {
            return target[rand(1, target.length - 1)];
          }
          return target[prop];
        }
      });
      return L.tileLayer(
        `http://t${
          serversProxy.server
        }.tianditu.gov.cn/DataServer?T=${layer}_w&x={x}&y={y}&l={z}&tk=c68d03496060026ff2f20b1cfa2a0326`,
        {
          id: `${id}`,
          maxZoom: 20
        }
      );
    },
    getlayer() {
      return new Promise((resolve, reject) => {
        querylayers()
          .then(res => {
            res.data.data.forEach(v => {
              if (v.layertype == "WMTS") {
                this.obj[v.name] = L.layerGroup([
                  L.tileLayer(v.layerurl, {
                    id: v.name
                  })
                ]);
              } else {
                var layerurl = JSON.parse(v.layerurl);
                this.obj[v.name] = L.layerGroup([
                  L.tileLayer.wms(layerurl.url, {
                    layers: layerurl.layers,
                    format: layerurl.format,
                    styles: layerurl.styles || "",
                    transparent: true,
                    crs: L.CRS.EPSG4326
                  })
                ]);
              }
            });
            resolve();
          })
          .catch(res => {
            this.obj = {};
            reject(res);
          });
      });
    },
    screen() {
      this.fullscreen = !this.fullscreen;
    },
    invalidate() {
      setTimeout(() => {
        cmap.invalidateSize();
        this.width = Number(document.querySelector("#map").offsetWidth - 400);
      }, 200);
    },
    getcurrent(data) {
      this.current_ = data;
    },
    Handleward() {
      this.wardConceal = !this.wardConceal;
      if (this.polygon) cmap.removeLayer(this.polygon);
    },
    scale(key) {
      if (key === 1) {
        cmap.zoomIn();
      } else {
        cmap.zoomOut();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
button {
  cursor: pointer;
}
/deep/.markDiv {
  border: none !important;
  border-radius: 2px;
  min-width: 80px !important;
  height: 24px !important;
  background: #fff !important;
  top: 8px !important;
  display: flex;
  align-items: center;
  border: none !important;
  justify-content: space-around;
  .markIcon {
    width: 24px;
    height: 24px;
  }
}
</style>
