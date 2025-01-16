<template>
  <fullscreen
    :fullscreen.sync="fullscreen"
    style="position: relative; height: 100%"
  >
    <div
      id="lzz"
      ref="map"
      v-loading="loading"
      element-loading-text="图层加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :style="{ height: fullheight, width: '100%' }"
    >
      <layer_
        v-if="slayer"
        @path="path"
        @startLoading="startLoading"
        @endLoading="endLoading"
        ref="layer_"
        :map="map"
        :obj="obj"
        :x="x"
        @clear="clear"
        @setviews="setviews"
        @screen="screen"
        @toggleSideBar="toggleSideBar"
        @scrolldisable="scrolldisable"
        @scrollenable="scrollenable"
        @baseLayerMap="baseLayerMap"
      />

      <!-- 地图经纬度展示 -->
      <div class="lnglat" v-if="lnglat.length > 0">
        {{ lnglat }}
      </div>
    </div>
  </fullscreen>
</template>
<script>
import store from "@/store";
import Axios from "axios";
import * as turf from "@turf/turf";
import { getTif } from "@/api/editmap";

import layer_ from "./components/editlayer"; // 图层
import { getToken } from "@/utils/auth";
import { mapGetters } from "vuex";
import VueFullscreen from "vue-fullscreen";
import Vue from "vue";

Vue.use(VueFullscreen);

var layers = [];

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

export default {
  components: {
    layer_
  },
  props: {
    x: {
      default: false,
      type: Boolean
    },
    partid: {
      default: "",
      type: String
    },
    slayer: {
      default: true,
      type: Boolean
    },
    mapHeight: {
      default: 130,
      type: Number
    }
  },
  data() {
    return {
      // 地图相关数据↓↓↓
      map: null,
      lnglat: "",
      fullscreen: false,
      loading: false,
      fullheight: document.body.clientHeight - this.mapHeight + "px",
      layers: ["mask"],
      antPolyline: null,
      m_market: null,
      Markers: null,
      maskpolygon: null,
      MarkText: null,
      width: "",
      obj: {},
      marks: {},
      baseLayer: {},
      dictionary: {},
      tempFeature: null,
      tempLayer: null
    };
  },
  computed: {
    ...mapGetters(["currentPage", "currentLayer"]),
    current_: {
      get() {
        return this.$store.state.map.currentLayer;
      },
      set(val) {
        this.$store.dispatch("map/setLayer", val);
      }
    }
  },
  watch: {
    currentLayer: {
      handler: function(oldValue, newValue) {
        setTimeout(() => {
          let dom = document.querySelector(".leaflet-right");
          if (dom) {
            dom.style.display = oldValue == "tool" ? "block" : "none";
          }
        }, 100);
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
        if (n) {
          this.fullheight = "calc(100vh)";
        } else {
          setTimeout(() => {
            this.fullheight =
              document.body.clientHeight - this.mapHeight + "px";
          }, 100);
        }
        setTimeout(() => {
          this.width = Number(document.querySelector("#lzz").offsetWidth - 400);
        }, 100);
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.initialize();

    window.onresize = () => {
      setTimeout(() => {
        if (!this.fullscreen) {
          this.fullheight = document.body.clientHeight - this.mapHeight + "px";
          this.width = Number(document.querySelector("#lzz").offsetWidth - 400);
        }
      }, 100);
    };
  },
  destroyed() {
    window.onresize = null;
    this.map = null;
  },
  methods: {
    colorRGB2Hex(color) {
      var rgb = color.split(",");
      var r = parseInt(rgb[0].split("(")[1]);
      var g = parseInt(rgb[1]);
      var b = parseInt(rgb[2]);
      var a = rgb[3].split(")")[0];

      return {
        hex: "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1),
        a: a
      };
    },
    showTif(obj) {
      console.log(obj);
      this[obj.label] && this.map.removeLayer(this[obj.label]);
      getTif({ file: obj.url }).then(({ data }) => {
        let imageBounds = [
          [data.left_top[1], data.left_top[0]],
          [data.right_shift[1], data.right_shift[0]]
        ]; //图片的经纬度范围，西南角点,东北角点(纬度、经度)
        let imageUrl = `${
          process.env.VUE_APP_BASE_API
        }data_manage/tif_download?file=${obj.url}&token=adminxxxxxx`; //图片的地址
        this[obj.label] = L.imageOverlay(imageUrl, imageBounds, {
          opacity: 0.8 //修改透明度
        });
        this.map.addLayer(this[obj.label]);
        this.map.fitBounds(this[obj.label].getBounds());
      });
    },
    showGeo(obj) {
      this[obj.label] && this.map.removeLayer(this[obj.label]);
      console.log(obj.label);
      let outObj = this.colorRGB2Hex(obj.outColor);
      let inObj = this.colorRGB2Hex(obj.inColor);
      Axios.get(
        `${process.env.VUE_APP_BASE_API}data_manage/geojson?file=${
          obj.url
        }&token=adminxxxxxx`,
        { responseType: "arraybuffer" }
      ).then(({ data }) => {
        console.log(2221);
        console.log(data);
        const enc = new TextDecoder("utf-8");
        let resp = JSON.parse(enc.decode(new Uint8Array(data)));
        console.log(resp.data);
        //设置样式
        let myStyle = {
          color: outObj.hex, //线颜色
          weight: 5, //线宽度
          opacity: outObj.a, //线透明度
          fillColor: inObj.hex, //填充色
          fillOpacity: inObj.a, //填充透明度
          radius: 10 //半径
        };
        let icon = L.icon({
          iconUrl: require(`@/assets/images/marker.png`),
          iconSize: [32, 32],
          iconAnchor: [16, 6],
          popupAnchor: [0, -8]
        });
        try {
          this[obj.label] = L.geoJson(resp.data, {
            pmIgnore: true,
            style: myStyle,
            pointToLayer: (features, latlng) => {
              return L.marker(latlng, {
                icon: icon,
                pmIgnore: true
              });
            }
          }).addTo(this.map);

          this.map.fitBounds(this[obj.label].getBounds());
        } catch (e) {
          this.$messages({
            type: "warning",
            message: "geoJson数据结构错误！"
          });
        }
      });
    },

    getGshowGeo(data) {
      let label = "111111";

      console.log("开始");
      console.log(data);
      // console.log(data);
      // const enc = new TextDecoder("utf-8");
      // console.log(enc.decode(new Uint8Array(data)));
      // let resp = JSON.parse(JSON.stringify(data));
      // console.log("成功");
      // console.log(resp.data);
      //设置样式
      let myStyle = {
        color: "#ff4500", //线颜色
        weight: 5, //线宽度
        opacity: 1, //线透明度
        fillColor: "#ff4500", //填充色
        fillOpacity: 0.5, //填充透明度
        radius: 10 //半径
      };
      let icon = L.icon({
        iconUrl: require(`@/assets/images/marker.png`),
        iconSize: [24, 24],
        iconAnchor: [16, 6],
        popupAnchor: [0, -8]
      });
      try {
        this[label] = L.geoJson(data, {
          pmIgnore: true,
          style: myStyle,
          pointToLayer: (features, latlng) => {
            return L.marker(latlng, {
              icon: icon,
              pmIgnore: true
            });
          }
        }).addTo(this.map);

        this.map.fitBounds(this[label].getBounds());
      } catch (e) {
        this.$messages({
          type: "warning",
          message: "geoJson数据结构错误！"
        });
      }
    },
    clearLayer(obj) {
      this[obj.label] && this.map.removeLayer(this[obj.label]);
    },
    // 切换基础图层
    baseLayerMap(v) {
      for (const i in this.baseLayer) {
        this.map.removeLayer(this.baseLayer[i]);
      }
      if (v !== "隐藏背景图层") {
        console.log(v);
        this.map.addLayer(this.baseLayer[v]);
      }
    },
    startLoading() {
      this.loading = true;
    },
    endLoading() {
      this.loading = false;
    },
    initialize() {
      var grayscaleLayer = this.tileLayerUrl("vec", "grayscaleLayer");
      var streetsLayer = this.tileLayerUrl("cva", "streetsLayer");
      var grayscaleLayer_img = this.tileLayerUrl("img", "grayscaleLayer_img");
      var grayscaleLayer_cva = this.tileLayerUrl("cva", "grayscaleLayer_cva");

      let vector = L.layerGroup([grayscaleLayer, streetsLayer]);
      let screenage = L.layerGroup([grayscaleLayer_img, grayscaleLayer_cva]);

      this.baseLayer = {
        天地图影像图: screenage,
        天地图矢量图: vector
      };
      this.map = L.map("lzz", {
        center: [31.75249, 114.486084],
        zoom: 10,
        minZoom: 3,
        maxZoom: 20,
        minNativeZoom: 3,
        maxNativeZoom: 18,
        layers: [screenage],
        zoomControl: false,
        attributionControl: false,
        crs: L.CRS.EPSG3857
      });

      this.loading = true;
      this.map.on("load", this.MapReady());

      let scale = L.control.scale({
        metric: true,
        imperial: false,
        position: "bottomleft"
      });
      scale.addTo(this.map);

      this.map.on("mousemove", e => {
        this.lnglat =
          this._round(e.latlng.lng, 4) + ", " + this._round(e.latlng.lat, 4);
      });

      this.map.pm.setPathOptions({
        weight: 4,
        color: "#25b46a",
        fillColor: "#25b46a",
        fillOpacity: 0.3
      });
      this.map.on("pm:create", ({ shape, layer }) => {
        // 给点线绑定编辑模式
        let measure = layer.toGeoJSON();
        this.tempFeature = measure;
        this.tempLayer = layer;

        if (shape != "Marker") {
          this.drawMarkers = new L.FeatureGroup();
          this.map.addLayer(this.drawMarkers);
          let latlngs = layer._defaultShape
            ? layer._defaultShape()
            : layer.getLatLngs();
          var div = L.divIcon({
            html: this.getPopupContent(layer),
            className: "markTexts",
            iconAnchor: [40, 0],
            iconSize: [80, 20]
          });
          let text = L.marker(latlngs[0], {
            icon: div,
            id: "marker"
          });
          this.drawMarkers.addLayer(text);
        }
      });

      this.map.on("pm:drawend", e => {
        this.draw();
      });
      this.map.on("pm:remove", e => {
        this.draw();
      });
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
      // if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
      //   let l = layer.getLatLng();
      //   return this.strLatLng(l);
      // } else
      if (layer instanceof L.Polygon) {
        let geoJSON = layer.toGeoJSON();
        let area = turf.area(geoJSON);
        let areaStr = area.toFixed(2) + "㎡";
        if (area > 10e5) {
          areaStr = (area / 10e5).toFixed(2) + "k㎡";
        }
        return "面积: " + areaStr;
      } else if (layer instanceof L.Polyline) {
        let latlngs = layer._defaultShape
            ? layer._defaultShape()
            : layer.getLatLngs(),
          distance = 0;
        if (latlngs.length < 2) {
          return "距离: 0";
        } else {
          for (let i = 0; i < latlngs.length - 1; i++) {
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
    // 加载画图工具
    MapReady() {
      this.loading = false;
      this.map.pm.addControls({
        position: "topright",
        drawPolygon: true, // 添加绘制多边形
        drawMarker: true, // 添加按钮以绘制标记
        drawCircleMarker: false, // 添加按钮以绘制圆形标记
        drawPolyline: true, // 添加按钮绘制线条
        drawRectangle: false, // 添加按钮绘制矩形
        drawCircle: false, //  添加按钮绘制圆圈
        editMode: false, //  添加按钮编辑多边形
        dragMode: false, //   添加按钮拖动多边形
        cutPolygon: false, // 添加一个按钮以删除图层里面的部分内容
        removalMode: false, // 清除图层,
        rotateMode: false,
        drawText: false
      });

      this.map.pm.controlsVisible(false);
      this.map.pm.setLang("zh");
      document.querySelector(".leaflet-pm-action").innerHTML = "完成";
      document.querySelector(".leaflet-right").style.display = "none";
    },
    draw() {
      let feature = this.CreateGeoJson();
      this.drawJson = feature;
    },
    // 生成几何数据
    CreateGeoJson() {
      var layerArray = [];
      this.map.eachLayer(layer => {
        if (
          layer.pm != "undefined" &&
          layer.pm != null &&
          layer.pm != "" &&
          this.layers.indexOf(layer.options.id) == -1
        ) {
          if (
            layer.pm._enabled == false &&
            layer.pm.options.draggable == true
          ) {
            if (!layer.options.style || layer.options.style.id != "zone") {
              if (layer.options.id != "marker") layerArray.push(layer);
            }
          }
        }
      });
      var geojson = L.layerGroup(layerArray).toGeoJSON();
      for (var n = 0; n < geojson.features.length; n++) {
        var nowJson = JSON.stringify(geojson.features[n]);
        for (var m = n + 1; m < geojson.features.length; m++) {
          var nextJson = JSON.stringify(geojson.features[m]);
          if (nowJson == nextJson) {
            geojson.features.splice(n, 1);
          }
        }
      }
      return geojson;
    },
    setgeoJson(feature) {
      L.geoJson(feature, {
        style: {
          color: "#ffdd00f5",
          weight: 3,
          fillColor: "#FF0000",
          fillOpacity: 0.15
        }
      }).addTo(this.map);
      this.map.fitBounds(L.geoJson(feature).getBounds());
      this.draw();
    },

    toggleSideBar() {
      this.$emit("toggleSideBar");
    },
    scrolldisable() {
      if (this.map) {
        this.map.scrollWheelZoom.disable();
        this.map.doubleClickZoom.disable();
        this.map.dragging.disable();
      }
    },
    scrollenable() {
      if (this.map) {
        this.map.scrollWheelZoom.enable();
        this.map.doubleClickZoom.enable();
        this.map.dragging.enable();
      }
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
          minZoom: 3,
          maxZoom: 20,
          minNativeZoom: 3,
          maxNativeZoom: 18
        }
      );
    },

    setMarkText(name) {
      if (this.MarkText) this.map.removeLayer(this.MarkText);
      var text = L.divIcon({
        html: name,
        className: "markText",
        iconAnchor: [40, 0],
        iconSize: [80, 20]
      });
      var center = this.polygon.getBounds().getCenter();
      this.MarkText = L.marker(center, {
        icon: text
      }).addTo(this.map);
    },
    setgeometry(coordinate, name) {
      if (this.polygon) this.map.removeLayer(this.polygon);
      this.polygon = L.polygon([coordinate], {
        color: "#01E3F1",
        weight: 3,
        fillColor: "#00192E",
        fillOpacity: 0.5
      });
      this.polygon.addTo(this.map);
      var tmpExtend = this.polygon.getBounds([coordinate]);
      this.map.flyToBounds(tmpExtend);
      this.draw();
      if (name) this.setMarkText(name);
    },
    setPolygon(coordinate, code, name) {
      if (this.m_market) this.map.removeLayer(this.m_market);
      if (this.polygon) this.map.removeLayer(this.polygon);
      this.polygon = L.polygon([coordinate], {
        color: "#01E3F1",
        weight: 3,
        fillColor: "#00192E",
        fillOpacity: 0.5
      });
      this.polygon.addTo(this.map);
      var tmpExtend = this.polygon.getBounds();
      this.map.flyToBounds(tmpExtend);
      if (this.wardShow) {
        var html = `<div class="map-popup">
                  <div class="map-popup-main">
                    <p>是否添加${name}为责任区？</p>
                      <div class="map-popup-button">
                      <button type="text" onclick=closeduty()>取消</button>
                      <button type="text" class="button-confirm" onclick=addduty('${code}','${name}')>是</button>
                      </div>
                  </div>
                 </div>`;
        this.polygon.bindPopup(html).openPopup();
      }
    },
    setviews(center = [40.834224, 111.748195]) {
      this.map.setView(center, 11);
    },
    path(coordinates) {
      if (this.antPolyline) this.map.removeLayer(this.antPolyline);
      this.antPolyline = new AntPath(coordinates, {
        paused: false,
        color: "#4169E1",
        pulseColor: "#00FA9A",
        dashArray: [1, 20],
        weight: 5,
        opacity: 0.8,
        hardwareAccelerated: true,
        delay: 1000
      });
      this.antPolyline.addTo(this.map);
    },
    clear() {
      this.map.eachLayer(layer => {
        if (
          layer.pm != "undefined" &&
          layer.pm != null &&
          layer.pm != "" &&
          this.layers.indexOf(layer.options.id) == -1 &&
          this.layers.indexOf(layer.options.id) != "mask"
        ) {
          if (
            layer.pm._enabled == false &&
            layer.pm.options.draggable == true
          ) {
            if (!layer.options.style) {
              this.map.removeLayer(layer);
            }
          }
        }

        this.$refs.layer_.clearLayerCheckbox();
      });

      this.draw();
    },

    screen() {
      this.fullscreen = !this.fullscreen;
    },
    invalidate() {
      setTimeout(() => {
        this.map.invalidateSize(true);
        this.map.fitBounds(this.projectLayer.getBounds());
        this.width = Number(document.querySelector("#lzz").offsetWidth - 400);
      }, 200);
    }
  }
};
</script>
<style lang="scss">
#lzz {
  p {
    margin: 5px 0;
  }
}

.leaflet-container .leaflet-right {
  top: 40px !important;
  right: 115px;
}
.lnglat {
  position: absolute;
  bottom: 10px;
  right: 10px;
  line-height: 24px;
  text-align: center;
  padding: 0 12px;
  background: #fff;
  z-index: 999;
  border-radius: 4px;
  font-weight: 600;
}
</style>
