<template>
  <fullscreen
    :fullscreen.sync="fullscreen"
    style="position: relative;height:100%"
  >
    <div
      id="scopemap"
      ref="scopemap"
      v-loading="loading"
      element-loading-text="图层加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :style="{ height: fullheight, width: '100%' }"
    >
      <div
        class="mapTopControl"
        :style="{ right: '0' }"
        @mouseover="scrolldisable"
        @mouseout="scrollenable"
      >
        <div class="layer-btn-box">
          <el-tooltip
            class="item"
            effect="dark"
            content="放大"
            placement="bottom"
          >
            <div
              class="layer-btn"
              :class="{ 'layer-bg': current == 'scaleUp' }"
              @click.stop="scale(1)"
            >
              <svg-icon icon-class="scale-up" />
            </div>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="缩小"
            placement="bottom"
          >
            <div
              class="layer-btn"
              :class="{ 'layer-bg': current == 'scaleDown' }"
              @click.stop="scale"
            >
              <svg-icon icon-class="scale-down" />
            </div>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="刷新"
            placement="bottom"
          >
            <div
              class="layer-btn"
              :class="{ 'layer-bg': current == 'refresh' }"
              @click.stop="onRefresh"
            >
              <svg-icon icon-class="refresh" />
            </div>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="全屏"
            placement="bottom"
          >
            <div
              class="layer-btn"
              :class="{ 'layer-bg': current == 'fullscreen' }"
              @click.stop="screen"
            >
              <svg-icon icon-class="fullscreen" />
            </div>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="图层"
            placement="bottom"
          >
            <div
              class="layer-btn"
              :class="{ 'layer-bg': current == 'resource' }"
              @click.stop="current = current == 'resource' ? '' : 'resource'"
            >
              <svg-icon icon-class="resource" />
            </div>
          </el-tooltip>
        </div>
        <div
          v-if="current == 'resource'"
          class="layer_control"
          :style="{ 'max-height': layerheight + 'px' }"
        >
          <div class="layer_check">
            <el-radio-group v-model="BaseLayerList" @change="BaseLayer">
              <div class="layer_check_item">
                <el-radio
                  v-for="(item, index) in baselist"
                  :key="index"
                  :label="item.name"
                  @click.stop.native="() => {}"
                >
                  <img :src="item.imgUrl" /> {{ item.name }}
                </el-radio>
              </div>
            </el-radio-group>
          </div>
        </div>
      </div>
    </div>
  </fullscreen>
</template>

<script>
import { querylayers } from "@/api/layer";
import store from "@/store";
import geoJson from "./js/data.json";

import { getToken } from "@/utils/auth";
import { parseTime } from "@/utils";

import { mapGetters } from "vuex";
import VueFullscreen from "vue-fullscreen";
import Vue from "vue";
Vue.use(VueFullscreen);

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

export default {
  props: {
    size: {
      default: "calc(100vh - 72px)",
      type: String
    }
  },
  data() {
    return {
      map: null,
      fullscreen: false,
      loading: false,
      current: "",
      fullheight: this.size,
      width: "",
      lat: null,
      lng: null,
      list: [],
      obj: {},
      baseLayer: {},
      lnglat: [111.486084, 30.75249],
      layerid: "f14c9476065411ec950744032cbb6af1",
      layerheight: document.body.clientHeight - 200,
      BaseLayerList: "影像图",
      baselist: [
        {
          key: "streetsLayer",
          name: "影像图",
          imgUrl: require("@/assets/images/maps.jpg")
        },
        {
          key: "vector",
          name: "矢量图",
          imgUrl: require("@/assets/images/map.png")
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["user"]),
    headers() {
      return {
        token: getToken()
      };
    }
  },
  watch: {
    fullscreen: {
      handler(n) {
        if (n) {
          this.fullheight = "calc(100vh)";
        } else {
          setTimeout(() => {
            this.fullheight = this.size;
          }, 100);
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.init();
    this.$nextTick(() => {
      if (this.map) {
        this.map.invalidateSize(true);
      }
    });
    window.onresize = () => {
      setTimeout(() => {
        this.width = Number(document.querySelector("#scopemap").offsetWidth);
      }, 100);
    };
  },
  destroyed() {
    window.onresize = null;
  },
  methods: {
    getImage(name) {
      return `${
        process.env.VUE_APP_BASE_API
      }warehouse/download?filename=${name}&token=${getToken()}`;
    },
    // 修改定位点
    setMapCenter(val) {
      this.map.flyTo([val.y, val.x], 15);
      let imgs = eval(val.attachfiles) || [];
      let img =
        imgs.length > 0
          ? this.getImage(imgs[0].url)
          : require("@/assets/images/order.jpg");
      let tmp = `<div class="reservoir warehouse" data-id="${val.id}">
      <div class="content">
        <div class="top">
          <p class="title">
            <span class="name">${val.name}</span>
          </p>
        </div>
        <div class="bottom">
          <img class="img" src="${img}" alt="" />
          <div class="info">
            <p><span>仓库地址：${val.address}</span></p>
            <p><span>责任人：${val.person_liable}</span></p>
            <p><span>电话：${val.phone}</span></p>
          </div>
        </div>
      </div>
    </div>`;
      var popup = L.popup({
        autoPan: true,
        closeButton: true,
        autoClose: true,
        closeOnClick: true,
        className: "popup-reservoir"
      })
        .setLatLng([val.y, val.x])
        .setContent(tmp)
        .openOn(this.map);
    },
    BaseLayer() {
      for (const i in this.baseLayer) {
        this.map.removeLayer(this.baseLayer[i]);
      }
      this.map.addLayer(this.baseLayer[this.BaseLayerList]);
      L.geoJSON(geoJson, {
        style: {
          color: "#F6D92F",
          fillColor: "#F6D92F",
          fillOpacity: 0
        },
        pane: "overlayPane"
      }).addTo(this.map);
      // this.initReservoir();
    },
    // 初始化水库流量点位
    initReservoir(list) {
      var LeafIcon = L.Icon.extend({
        options: {
          iconSize: [32, 32]
        }
      });
      let greenIcon = new LeafIcon({
        iconUrl: require("@/assets/images/site1.png")
      });

      this.markerLayer && this.markerLayer.clearLayers();
      this.map.closePopup();

      this.markerLayer = new L.featureGroup([]);
      for (let l of list) {
        let mark = L.marker([l.y, l.x], { icon: greenIcon });

        let urlList = eval(l.attachfiles) || [];
        console.log(urlList);
        if (urlList.length > 0) {
          l.url = urlList[0].url;
        } else {
          l.url = require("@/assets/images/order.jpg");
        }
        mark["config"] = l;
        mark.addTo(this.markerLayer);
      }
      this.map.addLayer(this.markerLayer);
      this.markerLayer.on("click", e => {
        let param = e.layer.config;
        let img = this.getImage(param.url);

        let tmp = `<div class="reservoir warehouse warning" data-id="${
          param.id
        }">
      <div class="content">
        <div class="top">
          <p class="title">
            <span class="name">${param.name}</span>
          </p>
        </div>
        <div class="bottom">
          <img class="img" src="${img}" alt="" />
          <div class="info">
            <p><span>仓库地址：${param.address}</span></p>
            <p><span>责任人：${param.person_liable}</span></p>
            <p><span>电话：${param.phone}</span></p>
          </div>
        </div>
      </div>
    </div>`;
        let m_IdentifyPopup = L.popup({
          autoPan: true,
          closeButton: true,
          autoClose: true,
          closeOnClick: true,
          className: "popup-reservoir"
        })
          .setLatLng(e.latlng)
          .setContent(tmp)
          .openOn(this.map);
      });
      // 给弹框绑定点击事件
      // this.map.on("popupopen", ev => {
      //   let popupEle = ev.popup.getElement();
      //   let dom = popupEle.querySelector(".reservoir");
      //   if (!dom) return;
      //   let id = dom.getAttribute("data-id");
      //   dom.addEventListener("click", e => {});
      // });
    },

    init() {
      let grayscaleLayer = this.tileLayerUrl("vec", "grayscaleLayer");
      let streetsLayer = this.tileLayerUrl("cva", "streetsLayer");
      let grayscaleLayer_img = this.tileLayerUrl("img", "grayscaleLayer_img");
      let grayscaleLayer_cva = this.tileLayerUrl("cva", "grayscaleLayer_cva");

      let vector = L.layerGroup([grayscaleLayer, streetsLayer]);
      let screenage = L.layerGroup([grayscaleLayer_img, grayscaleLayer_cva]);

      this.baseLayer = {
        矢量图: vector,
        影像图: screenage
      };
      this.map = L.map("scopemap", {
        minZoom: 3, //最小缩放等级
        maxZoom: 18, //最大缩放等级
        layers: [screenage],
        zoomControl: false, //禁用 + - 按钮
        doubleClickZoom: false, // 禁用双击放大
        attributionControl: false // 移除右下角leaflet标识,
      }).setView([30.708928, 111.309222], 12);

      // 点集合
      this.drawMarkers = new L.FeatureGroup();
      this.map.addLayer(this.drawMarkers);
    },

    setmarkerIcon(images) {
      return L.icon({
        iconUrl: require(`@/assets/images/${images}.png`),
        iconSize: [32, 32],
        iconAnchor: [8, 8],
        popupAnchor: [0, -8]
      });
    },

    scrolldisable() {
      this.map.scrollWheelZoom.disable();
      this.map.doubleClickZoom.disable();
      this.map.dragging.disable();
    },
    scrollenable() {
      this.map.scrollWheelZoom.enable();
      this.map.doubleClickZoom.enable();
      this.map.dragging.enable();
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
    onRefresh() {
      this.$router.go(0);
    },
    invalidate() {
      setTimeout(() => {
        this.map.invalidateSize();
        this.width = Number(
          document.querySelector("#scopemap").offsetWidth - 400
        );
      }, 200);
    },
    scale(key) {
      if (key === 1) {
        this.map.zoomIn();
      } else {
        this.map.zoomOut();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.mapTopControl .layer_control {
  overflow: hidden;
  overflow-y: auto;
  margin-left: 115px;
}
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
