<template>
  <div>
    <div
      class="mapTopControl"
      :style="{ right: right ? '0' : '0' }"
      @mouseover="disable_(false)"
      @mouseout="disable_(true)"
    >
      <!-- 头部操作栏 -->
      <div class="layer-btn-box">
        <el-tooltip
          v-show="openIn"
          class="item"
          effect="dark"
          content="收起"
          placement="bottom"
        >
          <div class="layer-btn" @click.stop="toggleSideBar">
            <svg-icon v-if="open" icon-class="in" />
            <svg-icon v-else icon-class="open" />
          </div>
        </el-tooltip>

        <el-tooltip
          class="item"
          effect="dark"
          content="放大"
          placement="bottom"
        >
          <div
            class="layer-btn"
            :class="{ 'layer-bg': current == 'scaleUp' }"
            @click.stop="onScale(1)"
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
            @click.stop="onScale"
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

        <el-tooltip
          class="item"
          effect="dark"
          content="绘图工具"
          placement="bottom"
        >
          <div
            class="layer-btn"
            :class="{ 'layer-bg': current == 'tool' }"
            @click.stop="current = current == 'tool' ? '' : 'tool'"
          >
            <svg-icon icon-class="tool" />
          </div>
        </el-tooltip>

        <el-tooltip
          class="item"
          effect="dark"
          content="清除"
          placement="bottom"
        >
          <div class="layer-btn" @click.stop="setClear">
            <svg-icon icon-class="delete" />
          </div>
        </el-tooltip>
      </div>
      <!-- 图层列表 -->
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
        <!-- <div class="layer_check LayerList">
          <el-checkbox v-model="uav" label="航拍历史地图" @change="gethistory">
            <img
              :src="images"
              style="width: 18px;height: 18px;position: relative;top: 4px;"
            />
            航拍历史地图
          </el-checkbox>
        </div> -->
      </div>
    </div>
    <!-- 底部操作按钮 -->
    <div
      class="mapBotControl"
      :style="{ right: right ? '0' : '0' }"
      v-show="showBotControl"
    >
      <div class="layer-bot-btn">
        <el-tooltip class="item" effect="dark" content="搜索" placement="left">
          <div
            :class="[
              'layer-btn',
              current == 'search' && 'layer-bot-btn-active'
            ]"
            @click.stop="current = current == 'search' ? '' : 'search'"
          >
            <svg-icon icon-class="search" />
          </div>
        </el-tooltip>

        <div class="slide-box">
          <transition name="slide">
            <div class="search" v-show="current == 'search'">
              <el-select
                v-model="skSelect"
                @change="handleSelect"
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in usersk"
                  :key="item.partid"
                  :label="item.partname"
                  :value="item.partid"
                >
                </el-option>
              </el-select>
              <!-- <el-autocomplete
                v-model="rainfallTime"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入内容"
                @select="handleSelect"
              ></el-autocomplete> -->
            </div>
          </transition>
        </div>
      </div>

      <div class="layer-bot-btn">
        <el-tooltip
          class="item"
          content="降雨量"
          effect="dark"
          placement="left"
        >
          <div
            :class="[
              'layer-btn',
              current == '降水量_24小时' && 'layer-bot-btn-active'
            ]"
            @click.stop="handleWeather('降水量_24小时')"
          >
            <svg-icon icon-class="water" />
          </div>
        </el-tooltip>

        <!-- <div class="slide-rain">
          <transition name="slide">
            <div class="rainfall" v-show="current == 'rainfall'">
              <p
                :class="['time', rainfallTime == item.key && 'time-active']"
                v-for="item in rainfallList"
                :key="item.key"
                @click.stop="toggleRainfall(item.key)"
              >
                {{ item.label }}h
              </p>
            </div>
          </transition>
        </div> -->
      </div>
      <div class="layer-bot-btn">
        <el-tooltip class="item" effect="dark" content="风速" placement="left">
          <div
            :class="[
              'layer-btn',
              current == '风速_地上2米' && 'layer-bot-btn-active'
            ]"
            @click.stop="handleWeather('风速_地上2米')"
          >
            <svg-icon icon-class="satellite" />
          </div>
        </el-tooltip>
      </div>
      <div class="layer-bot-btn">
        <el-tooltip class="item" effect="dark" content="温度" placement="left">
          <div
            :class="[
              'layer-btn',
              current == '地表温度' && 'layer-bot-btn-active'
            ]"
            @click.stop="handleWeather('地表温度')"
          >
            <svg-icon icon-class="rain" />
          </div>
        </el-tooltip>
      </div>
    </div>

    <canvas
      v-if="showBotControl"
      id="canvas_legend"
      width="100"
      height="500"
      :style="{
        position: 'absolute',
        bottom: '150px',
        'z-index': 1000,
        right: right ? '15px' : '38px'
      }"
    ></canvas>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import { mapGetters, mapActions } from "vuex";
import axios from "axios";
import store from "@/store";

export default {
  props: {
    obj: {
      default: () => ({}),
      type: Object
    },
    map: {
      type: Object,
      default: () => ({})
    },
    baseLayer: {
      type: Object,
      default: () => ({})
    },
    openIn: {
      default: false,
      type: Boolean
    },
    showBotControl: {
      default: true,
      type: Boolean
    },
    right: {
      default: false,
      type: Boolean
    },
    showSk: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      skSelect: "",
      list: [],
      uav: false,
      popupLfet: "",
      popupTop: "",
      showReservoirInfo: false,
      layerheight: document.body.clientHeight - 200,
      images: require("@/assets/images/globle.png"),
      open: true,
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
      ],
      latlng: {},
      rainfallTime: "",
      rainfallList: [
        { key: "1", label: "24" },
        { key: "2", label: "48" },
        { key: "3", label: "72" }
      ],

      // 云图接口参数
      catalogCode: "00",
      url: "https://cloud.yccsic.com:5000",
      wtoken: "a0ace0fae69c11ed92750242ac110005",
      weatherLayer: null,
      defaultSkImg: require("@/assets/images/order.jpg")
    };
  },
  computed: {
    ...mapGetters([
      "user",
      "currentLayer",
      "currentPage",
      "currentsk",
      "showdash",
      "usersk",
      "siteList",
      "siteType"
    ]),
    current: {
      get() {
        return this.$store.state.map.currentLayer;
      },
      set(val) {
        this.$store.dispatch("map/setLayer", val);
      }
    }
    // deviceLayerType() {
    //   return this.siteType;
    // }
  },
  watch: {
    map: {
      handler(n) {
        if (n) {
          this.initialize();
        }
      },
      immediate: true
    },
    siteType(n) {
      if (n) {
        if (n.indexOf("monitor") != -1) {
          this.initMonitorSite();
        } else {
          this.initWarnSite();
        }
      }
    }
  },
  mounted() {},

  methods: {
    ...mapActions(["SetCurrentSk", "SetShowDash"]),
    // 开启航拍历史图
    gethistory() {
      if (this.uav) {
        this.$emit("gettime");
      } else {
        this.$emit("closeslider");
      }
    },

    handleWeather(v) {
      this.current = this.current == v ? "" : v;
      document.getElementById("canvas_legend").style.display =
        this.current == "" ? "none" : "block";
      this.getWeather();
    },
    getWeather() {
      var c = document.getElementById("canvas_legend");
      var context = c.getContext("2d");
      context.clearRect(0, 0, c.width, c.height);
      this.weatherLayer && this.map.removeLayer(this.weatherLayer);
      this.weatherLayer = null;
      axios
        .get(
          `${this.url}/gfs/getparamlayerinfobytime?appkey=${
            this.wtoken
          }&catalogcode=${this.catalogCode}&paraname=${this.current}`
        )
        .then(res => {
          if (res.data.success) {
            const bounds = new L.LatLngBounds([0, 0], [90, 180]);
            this.weatherLayer = L.imageOverlay(
              `${this.url}/gfs/getparamlayerfilebytime?appkey=${
                this.wtoken
              }&catalogcode=${this.catalogCode}&paraname=${this.current}`,
              bounds,
              {
                visible: true,
                opacity: 0.6,
                pane: "tilePane"
              }
            );
            this.map.addLayer(this.weatherLayer);
            this.getLegend();
          }
        });
    },
    getLegend() {
      axios
        .get(
          `${this.url}/gfs/getparaminfo?appkey=${this.wtoken}&paraname=${
            this.current
          }`
        )
        .then(res => {
          this.tmpObj = res.data.data;
          this.refreshParamLegend();
        });
    },
    refreshParamLegend() {
      var c = document.getElementById("canvas_legend");
      var context = c.getContext("2d");
      context.clearRect(0, 0, c.width, c.height);

      var tmpObj = this.tmpObj;
      if (tmpObj != undefined && tmpObj != null) {
        var tmpparamsconfig = tmpObj.paramsconfig || tmpObj.layerconfig;
        if (tmpparamsconfig != undefined && tmpparamsconfig != null) {
          var tmpParaConfigObj = eval("(" + tmpparamsconfig + ")");

          if (tmpParaConfigObj != undefined && tmpParaConfigObj != null) {
            let width = 24;
            let left = 12;
            if (
              this.tmpObj.layerid == "nm-ndvi" ||
              this.tmpObj.layerid == "nm-spei" ||
              this.tmpObj.layerid == "nm-gpr"
            ) {
              width = 44;
              left = 22;
              if (
                this.tmpObj.layerid == "nm-ndvi" ||
                this.tmpObj.layerid == "nm-gpr"
              ) {
                tmpObj.unit = "g/m2";
              }
              tmpParaConfigObj.legend = [];
              tmpParaConfigObj.colorlist.forEach((item, index) => {
                let json = {
                  name: tmpParaConfigObj.colorlistvalue[index],
                  color: item
                };
                tmpParaConfigObj.legend.push(json);
              });
            }

            var tmpLegendListValue = tmpParaConfigObj.legend;
            if (
              tmpLegendListValue != undefined &&
              tmpLegendListValue != null &&
              tmpLegendListValue.length > 0
            ) {
              var tmpCount = tmpLegendListValue.length;
              context.font = "14px 黑体"; // 设置字体
              context.fillStyle = "#ff0"; // 设置颜色
              context.textAlign = "center"; // 设置水平对齐方式
              context.textBaseline = "middle"; // 设置垂直对

              var tmpStartX = c.width - 50;
              var tmpTxtMaxCount = 0;
              for (var i = 0; i < tmpCount; i++) {
                var tmpLegendObj = tmpLegendListValue[i];
                var tmpI = tmpLegendObj.name.length;
                if (tmpTxtMaxCount < tmpI) tmpTxtMaxCount = tmpI;
              }
              if (
                tmpObj.unit != undefined &&
                tmpObj.unit != null &&
                tmpObj.unit != ""
              ) {
                var tmpI = tmpObj.unit.length;
                if (tmpTxtMaxCount < tmpI) tmpTxtMaxCount = tmpI;
              }
              var tmpTxtWidth = 6 * tmpTxtMaxCount;
              tmpStartX = c.width - tmpTxtWidth - width;
              for (var i = 0; i < tmpCount; i++) {
                var tmpLegendObj = tmpLegendListValue[i];
                var tmpY = c.height - 24 * i - 24;
                context.fillStyle = tmpLegendObj.color;
                context.fillRect(tmpStartX, tmpY, tmpStartX + tmpTxtWidth, 24);
                var tmpColor02 = this.ColorReverse(tmpLegendObj.color);
                context.fillStyle = "#" + tmpColor02;
                context.fillText(
                  tmpLegendObj.name,
                  tmpStartX + tmpTxtWidth / 2 + left,
                  tmpY + 12
                );
              }

              if (
                tmpObj.unit != undefined &&
                tmpObj.unit != null &&
                tmpObj.unit != ""
              ) {
                var tmpY = c.height - 24 * tmpCount - 24;
                var tmpMsg = tmpObj.unit;
                context.fillStyle = "#FFFFFF";
                context.fillRect(tmpStartX, tmpY, tmpStartX + tmpTxtWidth, 24);
                context.fillStyle = "#000000";
                context.fillText(
                  tmpMsg,
                  tmpStartX + tmpTxtWidth / 2 + left,
                  tmpY + 12
                );
              }
            }
          }
        }
      }
    },
    ColorReverse(OldColorValue) {
      var tmpColor = OldColorValue.replace(/#/g, "");
      var tmpV =
        0.213 * parseInt("0x" + tmpColor.substring(0, 2)) +
        0.715 * parseInt("0x" + tmpColor.substring(2, 4)) +
        0.072 * parseInt("0x" + tmpColor.substring(4, 6));
      return tmpV > 255 / 2 ? "000" : "FFF";
    },

    handleSelect(item) {
      let obj = {};
      this.usersk.map(v => {
        if (v.partid == item) {
          obj = v;
          return;
        }
      });
      this.map.flyTo([obj.y, obj.x], 15);

      let tmp = `<div class="reservoir reservoirPop" data-id="${
        obj.partid
      }"  data-x="${obj.x}" data-y="${obj.y}">
          <div class="content">
            <div class="top">
              <p class="title">
                <span class="name">${obj.partname || 0}</span>
                <span class="line"></span>
                <span>${this.skType(obj.sk_type)}</span>
              </p>
              <p class="check"><i class="el-icon-view"></i> 点击查看水库</p>
            </div>
            <div class="bottom">
              <img class="img" src="${obj.img}" alt="" />
              <div class="info">
                <p><span>大坝类型：${this.damType(
                  obj.main_type
                )}</span> <span>坝高：${obj.main_high || 0}m</span></p>
                <p><span>最新水位：${obj.main_high ||
                  0}m</span> <span>汛限水位：${obj.flood_control_level ||
        0}m</span></p>
                <p><span>正常蓄水位：${obj.level_normal ||
                  0}m</span> <span>总库容：${obj.capacity_total ||
        0}亿m³</span></p>
              </div>
            </div>
          </div>
        </div>`;
      let m_IdentifyPopup = L.popup({
        autoPan: true,
        closeButton: true,
        autoClose: true,
        closeOnClick: true,
        className: "popup-reservoir",
        maxWidth: 446
      })
        .setLatLng([obj.y, obj.x])
        .setContent(tmp)
        .openOn(this.map);

      // 给弹框绑定点击事件
      this.map.on("popupopen", ev => {
        let popupEle = ev.popup.getElement();
        let dom = popupEle.querySelector(".reservoirPop");
        if (!dom) return;
        let id = dom.getAttribute("data-id");
        let x = dom.getAttribute("data-x");
        let y = dom.getAttribute("data-y");
        dom.addEventListener("click", e => {
          this.SetCurrentSk(id);
          this.SetShowDash("false");

          sessionStorage.setItem("currentsk", id);
          sessionStorage.setItem("showdash", false);
        });
      });
    },

    onRainfall() {
      if (this.current == "rainfall") {
        this.current = "";
        this.rainfallTime = "";
      } else {
        this.current = "rainfall";
        this.rainfallTime = "1";
      }
    },
    toggleRainfall(key) {
      this.rainfallTime = key;
    },
    onRefresh() {
      this.$router.go(0);
    },
    setClear() {
      this.$emit("clearPm");
    },
    disable_(flag) {
      flag ? this.$emit("scrollenable") : this.$emit("scrolldisable");
    },
    onScale(key) {
      this.$emit("scale", key);
    },
    screen() {
      this.current = this.current == "fullscreen" ? "" : "fullscreen";
      this.$emit("screen");
    },
    Handleward() {
      this.current = this.current == "ward" ? "" : "ward";
      this.$emit("HandleWard");
    },
    setlayer() {
      this.current = "";
    },
    toggleSideBar() {
      this.$emit("toggleSideBar");
      this.open = !this.open;
    },
    initialize() {
      if (this.showdash) {
        this.BaseLayer();
      }
      // this.map.on("mousemove", e => {
      //   this.latlng = e.latlng;
      // });
    },

    BaseLayer() {
      for (const i in this.baseLayer) {
        this.map.removeLayer(this.baseLayer[i]);
      }
      this.map.addLayer(this.baseLayer[this.BaseLayerList]);

      if (this.showSk) {
        this.initReservoir();
      }
    },
    setmarkerIcon(images) {
      return L.icon({
        iconUrl: require(`@/assets/images/dashboard/${images}.png`),
        iconSize: [32, 32],
        iconAnchor: [16, 10]
      });
    },
    // 获取水库图片
    getSkImage(name) {
      return `${
        process.env.VUE_APP_BASE_API
      }sk_base_info/download?filename=${name}&token=${getToken()}`;
    },
    // 初始化水库点位
    initReservoir() {
      this.map.closePopup();
      this.markerLayer && this.markerLayer.clearLayers();
      this.markerLayer = new L.featureGroup([]);
      for (let l of this.usersk) {
        let mark = L.marker([l.y, l.x], {
          icon: this.setmarkerIcon("scaleMap" + (l.capacity_type - 1))
        });
        mark["config"] = l;
        mark.addTo(this.markerLayer);

        let img = eval(l.attachment) || [];
        if (img && img.length > 0) {
          l.img = this.getSkImage(img[0].url);
        } else {
          l.img = this.defaultSkImg;
        }
      }
      this.map.addLayer(this.markerLayer);
      this.markerLayer.on("click", e => {
        let param = e.layer.config;
        let tmp = `<div class="reservoir reservoirPop" data-id="${
          param.partid
        }"  data-x="${param.x}" data-y="${param.y}">
          <div class="content">
            <div class="top">
              <p class="title">
                <span class="name">${param.partname}</span>
                <span class="line"></span>
                <span>${this.skType(param.sk_type)}</span>
              </p>
              <p class="check"><i class="el-icon-view"></i> 点击查看水库</p>
            </div>
            <div class="bottom">
              <img class="img" src="${param.img}" alt="" />
              <div class="info">
                <p><span>大坝类型：${this.damType(
                  param.main_type
                )}</span> <span>坝高：${param.main_high || 0}m</span></p>
                <p><span>最新水位：${param.main_high ||
                  0}m</span> <span>汛限水位：${param.flood_control_level ||
          0}m</span></p>
                <p><span>正常蓄水位：${param.level_normal ||
                  0}m</span> <span>总库容：${param.capacity_total ||
          0}亿m³</span></p>
              </div>
            </div>
          </div>
        </div>`;
        let m_IdentifyPopup = L.popup({
          autoPan: true,
          closeButton: true,
          autoClose: true,
          closeOnClick: true,
          className: "popup-reservoir",
          maxWidth: 446
        })
          .setLatLng(e.latlng)
          .setContent(tmp)
          .openOn(this.map);
      });
      // 给弹框绑定点击事件
      this.map.on("popupopen", ev => {
        let popupEle = ev.popup.getElement();
        let dom = popupEle.querySelector(".reservoirPop");
        if (!dom) return;
        let id = dom.getAttribute("data-id");
        let x = dom.getAttribute("data-x");
        let y = dom.getAttribute("data-y");
        dom.addEventListener("click", e => {
          this.SetCurrentSk(id);
          this.SetShowDash("false");

          sessionStorage.setItem("currentsk", id);
          sessionStorage.setItem("showdash", false);
        });
      });
    },

    // 初始化预警记录点位
    initWarnSite() {
      this.map.closePopup();
      this[this.siteType + "Layer"] &&
        this[this.siteType + "Layer"].clearLayers();
      this[this.siteType + "Layer"] = new L.featureGroup([]);

      if (this.siteList.length <= 0) {
        this.$messages({
          type: "info",
          message: "该水库还未绑定预警设备！"
        });
        return;
      }

      for (let l of this.siteList) {
        if (l.x) {
          let mark = L.marker([l.y, l.x], {
            icon: this.setmarkerIcon(this.siteType)
          });
          mark["config"] = l;
          mark.addTo(this[this.siteType + "Layer"]);
        }
      }
      let first = this.siteList[0];
      this.map.flyTo([first.y, first.x], 15);
      this.map.addLayer(this[this.siteType + "Layer"]);

      this[this.siteType + "Layer"].on("click", e => {
        let param = e.layer.config;

        let tbth = `<tr><th>预警名称</th><th>预警等级</th><th>预警值</th><th>预警时间</th></tr>`,
          tbtr = "",
          table = "";
        if (param.warning && param.warning.length > 0) {
          param.warning.map(v => {
            tbtr += `<tr>
            <td> ${v.warning_name}</td>
            <td>${v.warning_grade}</td>
            <td>${v.para1}</td>
            <td>${v.time}</td>
            </tr>`;
          });
          table = `<table class="pure-table pure-table-bordered">
                <thead>${tbth}</thead>
                <tbody>${tbtr}</tbody>
              </table>`;
        } else {
          table = `<div class="pure-table-no">
                暂无预警信息
              </div>`;
        }

        let tmp = `<div class="reservoir warning" data-id="${param.id}" >
          <div class="content">
            <div class="top">
              <p class="title">
                <span class="name">${param.sensor_name}</span>
              </p>
            </div>
            <div class="bottom">
              ${table}
            </div>
          </div>
        </div>`;
        let m_IdentifyPopup = L.popup({
          autoPan: true,
          closeButton: true,
          autoClose: true,
          closeOnClick: true,
          className: "popup-reservoir",
          maxWidth: 446
        })
          .setLatLng(e.latlng)
          .setContent(tmp)
          .openOn(this.map);
      });
    },
    // 初始化视频点位
    initMonitorSite() {
      this.map.closePopup();
      this.cameraLayer && this.cameraLayer.clearLayers();
      this.cameraLayer = new L.featureGroup([]);
      if (this.siteList.length <= 0) {
        this.$messages({
          type: "info",
          message: "该水库还未绑定视频监控点位！"
        });
        return;
      }
      for (let l of this.siteList) {
        if (l.x) {
          let mark = L.marker([l.y, l.x], {
            icon: this.setmarkerIcon("video")
          });
          mark["config"] = l;
          mark.addTo(this.cameraLayer);
        }
      }
      let first = this.siteList[0];
      this.map.flyTo([first.y, first.x], 15);

      this.map.addLayer(this.cameraLayer);
      this.cameraLayer.on("click", e => {
        let param = e.layer.config;
        let tmp = `<div class="reservoir videoPop" data-id="${param.id}" >
          <div class="content">
            <div class="top">
              <p class="title">
                <span class="name">${param.camera_name}</span>
              </p>
            </div>
            <div class="bottom">
              <video id="videoPlayer${param.id}"
                  controls playsinline autoplay
                  class="video-js vjs-default-skin"
                  style="min-width: 400px;display: block; margin: 0 auto;"
                  height="230"
                >
                <source src="${
                  param.camera_video
                }" type="application/x-mpegURL" />
                </video>
            </div>
          </div>
        </div>`;
        let video_popup = L.popup({
          autoPan: true,
          closeButton: true,
          autoClose: true,
          closeOnClick: false,
          className: "popup-reservoir",
          maxWidth: 446
        })
          .setLatLng(e.latlng)
          .setContent(tmp)
          .openOn(this.map);
      });

      this.map.on("popupopen", ev => {
        let popupEle = ev.popup.getElement();
        let dom = popupEle.querySelector(".videoPop");
        if (!dom) return;
        let id = dom.getAttribute("data-id");
        this["db" + id] = videojs("videoPlayer" + id, {
          autoplay: true,
          muted: true, // 设置了它为true，才可实现自动播放,同时视频也被静音（Chrome66及以上版本，禁止音视频的自动播放）
          preload: "auto", // 预加载
          controls: true // 显示播放的控件
        });
      });

      this.map.on("popupclose", ev => {
        let popupEle = ev.popup.getElement();
        let dom = popupEle.querySelector(".videoPop");
        if (!dom) return;
        let id = dom.getAttribute("data-id");
        this["db" + id].dispose();
      });
    },

    // 雨量等值面
    getRainfallLayer() {
      var data = [
        {
          layer: "rainfall24",
          styles: "rain_style",
          name: "24小时"
        },
        {
          layer: "rainfall48",
          styles: "rain_style",
          name: "48小时"
        },
        {
          layer: "rainfall72",
          styles: "rain_style",
          name: "72小时"
        }
      ];
      this.tileLayer(data, this.obj1, this.rainfallTime);
    },

    changeLayer(layer, list) {
      if (!list) return;
      for (var i = 0; i < list.length; i++) {
        if (layer.indexOf(list[i]) === -1) {
          this.map.removeLayer(list[i].key);
        }
        layer.forEach(item => {
          if (item == list[i].name) {
            this.map.addLayer(list[i].key);
          }
        });
      }
    },
    tileLayer(data, obj, arr) {
      data.map(item => {
        obj[item.name] = L.layerGroup([
          L.tileLayer.wms(
            `${process.env.VUE_APP_BASE_API}geomap/dataapi/wms?`,
            {
              token: getToken(),
              layerid: item.layer || "yuhangquyizhangtu2019",
              format: "image/png",
              styles: item.styles,
              transparent: true
            }
          )
        ]);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.mapTopControl .layer_control {
  overflow: hidden;
  overflow-y: auto;
}

.cutline {
  display: inline-block;
  width: 19px;
  height: 12px;
  position: relative;
  top: 1px;
}

.cardLayer {
  width: 175px;
  position: absolute;
  top: 40px;
  right: 0px;
}

.cardLabel {
  display: inline-block;
  font-size: 14px;
  margin-bottom: 5px;
}
.mapBotControl {
  position: absolute;
  z-index: 970 !important;
  bottom: 20px;
  right: 545px;
  margin: 0 15px 0 0;
  cursor: pointer;
  width: 30px;
  border-radius: 4px;
  background: #557af2;
  .layer-bot-btn {
    width: 30px;
    height: 30px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.3);
    &:last-child {
      border: none;
    }
    .layer-btn {
      width: 30px;
      height: 30px;
      color: #fff;
      display: flex;
      justify-content: space-around;
      align-items: center;

      .svg-icon {
        font-size: 16px;
      }
    }
    &:first-child {
      .layer-btn {
        border-radius: 4px 4px 0 0;
      }
    }
    &:last-child {
      .layer-btn {
        border-radius: 0 0 4px 4px;
      }
    }
  }
  .layer-bot-btn-active {
    background: #fff;
    color: #557af2 !important;
  }
  .search {
    width: 180px;
    height: 40px;
  }
  .rainfall {
    width: 72px;
    background: #fff;
    border-radius: 4px;
    .time {
      text-align: center;
      line-height: 32px;
      font-size: 14px;
      cursor: pointer;
      &:hover {
        color: #409eff;
      }
    }
    .time-active {
      color: #409eff;
    }
  }
}
.slide-box {
  width: 180px;
  height: 40px;
  position: absolute;
  right: 32px;
  top: 0px;
  z-index: 1991;
  overflow: hidden;
}
.slide-rain {
  width: 72px;
  position: absolute;
  right: 32px;
  top: 0px;
  z-index: 1991;
  overflow: hidden;
}
.slide-enter,
.slide-leave-to {
  transform: translateX(100%);
}
.slide-enter-active,
.slide-leave-active {
  transition: 0.1s;
}
.slide-enter-to {
  transform: translateX(0);
}

.latlng {
  position: fixed;
  bottom: 20px;
  width: 260px;
  line-height: 36px;
  left: 50%;
  margin-left: -130px;
  background: rgba($color: #fff, $alpha: 0.7);
  border-radius: 4px;
  z-index: 991;
  text-align: center;
  font-size: 14px;
}
</style>
