<template>
  <div
    class="mapTopControl"
    @mouseover="disable_(false)"
    @mouseout="disable_(true)"
  >
    <!-- 操作按钮 -->
    <div class="layer-btn-box">
      <div class="layer-btn load" v-if="loading">
        图层加载中<i class="el-icon-loading"></i>
      </div>
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
      <!-- <el-tooltip class="item" effect="dark" content="清除" placement="bottom">
        <div class="layer-btn" @click.stop="setTools">
          <svg-icon icon-class="delete1" />
        </div>
      </el-tooltip> -->
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
          <svg-icon icon-class="tool1" />
        </div>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="定位" placement="bottom">
        <div
          class="layer-btn"
          :class="{ 'layer-bg': current == 'position' }"
          @click.stop="position"
        >
          <svg-icon icon-class="position1" />
        </div>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="全屏" placement="bottom">
        <div
          class="layer-btn"
          :class="{ 'layer-bg': current == 'fullscreen' }"
          @click.stop="screen"
        >
          <svg-icon icon-class="fullscreen1" />
        </div>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="图层" placement="bottom">
        <div
          class="layer-btn"
          :class="{ 'layer-bg': current == 'resource' }"
          @click.stop="current = current == 'resource' ? '' : 'resource'"
        >
          <svg-icon icon-class="resource1" />
        </div>
      </el-tooltip>
    </div>
    <!-- 图层切换 -->
    <div
      v-if="current == 'resource'"
      class="layer_control"
      :style="{ 'max-height': layerheight + 'px' }"
    >
      <div class="layer_check">
        <el-radio-group v-model="baselayers" @change="BaseLayerMap">
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
</template>
<script>
import axios from "axios";
import { mapGetters } from "vuex";
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
    openIn: {
      default: false,
      type: Boolean
    },
    x: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      baselayers: "天地图影像图",
      baseLayer: {},
      layerheight: document.body.clientHeight - 200,
      loading: false,
      open: true,
      location: {
        x: "",
        y: ""
      },
      baselist: [
        {
          key: "streetsLayer",
          name: "天地图影像图",
          imgUrl: require("@/assets/images/maps.jpg")
        },
        {
          key: "vector",
          name: "天地图矢量图",
          imgUrl: require("@/assets/images/map.png")
        },
        {
          key: "blank",
          name: "隐藏背景图层",
          imgUrl: require("@/assets/404_images/404_cloud.png")
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["currentLayer", "currentPage"]),
    current: {
      get() {
        return this.$store.state.map.currentLayer;
      },
      set(val) {
        this.$store.dispatch("map/setLayer", val);
      }
    }
  },
  methods: {
    clearLayerCheckbox() {
      this.LayerCheckbox = [];
    },
    clear() {
      this.$emit("clear");
    },
    path(coordinates) {
      this.$emit("path", coordinates);
    },
    setTools() {
      this.$emit("clear");
    },
    locationLayer() {
      this.location.x = "";
      this.location.y = "";
      this.current = this.current == "legend" ? "" : "legend";
    },
    setlocation() {
      if (this.location.x && this.location.y) {
        let x = this.DegreeConvertBack(this.location.x);
        let y = this.DegreeConvertBack(this.location.y);
        this.$emit("setMarker", y, x);
      }
    },
    DegreeConvertBack(value) {
      var du = value.split("°")[0];
      var fen = value.split("°")[1].split("′")[0];
      var miao = value
        .split("°")[1]
        .split("′")[1]
        .split("″")[0];
      var strDu = typeof du == "undefined" || du == "" ? 0 : parseFloat(du);
      var strFen =
        typeof fen == "undefined" || fen == "" ? 0 : parseFloat(fen) / 60;
      var strMiao =
        typeof miao == "undefined" || miao == "" ? 0 : parseFloat(miao) / 3600;
      var digital = strDu + strFen + strMiao;
      if (digital == 0) {
        return "";
      } else {
        return digital.toFixed(6);
      }
      return digital;
    },
    disable_(flag) {
      flag ? this.$emit("scrollenable") : this.$emit("scrolldisable");
    },
    position() {
      this.current = this.current == "position" ? "" : "position";
      this.$emit("setviews");
    },
    screen() {
      this.current = this.current == "fullscreen" ? "" : "fullscreen";
      this.$emit("screen");
    },
    setlayer() {
      this.current = "";
    },
    toggleSideBar() {
      this.$emit("toggleSideBar");
      this.open = !this.open;
    },

    clearLayer(item) {
      this.map.eachLayer(layer => {
        if (layer.type && layer.type == item) {
          this.map.removeLayer(layer);
        }
      });
    },

    changeLayer(layer, list) {
      if (!list.length) return;
      for (var i = 0; i < list.length; i++) {
        if (layer.length) {
          if (layer.indexOf(list[i]) === -1) {
            this.map.removeLayer(list[i].key);
          }
          layer.forEach(item => {
            if (item == list[i].kay) {
              this.map.addLayer(list[i].key);
            }
          });
        }
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
          maxZoom: 20
        }
      );
    },
    BaseLayerMap(v) {
      this.$emit("baseLayerMap", v);
    },

    all() {
      this.$emit("handleGeoLayer", this.LayerCheckbox);
    }
  }
};
</script>

<style lang="scss" scoped>
.load {
  width: 130px;
  font-size: 16px;
  color: #39ab69;
  text-align: center;
  line-height: 30px;
}
.mapTopControl {
  position: absolute;
  z-index: 999 !important;
  top: 10px;
  right: 10px;
  cursor: pointer;
  .layer_img {
    width: 40px;
    z-index: 999;
    border-radius: 2px;
    float: right;
  }
  .layer_control {
    color: #000;
    font-size: 12px;
    box-sizing: border-box;
    padding: 5px;
    margin: 40px 45px 0 0;
    width: 185px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0px 2px 4px 0px rgba(36, 130, 237, 0.25);
  }
  .LayerList {
    border-top: 1px solid #cedfd1;
    margin-top: 4px;
  }
  .layer_check {
    .layer_check_item {
      text-align: left;
      line-height: 16px;
      img {
        width: 18px;
        height: 18px;
        position: relative;
        top: 4px;
      }
    }
  }
}
.layer-btn-box {
  height: 30px;
  position: absolute;
  right: 0;
  z-index: 5555;
  top: 0px;
  display: flex;
  .layer-btn {
    width: 32px;
    height: 32px;
    margin-right: 5px;
    background: #fff;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0px 2px 4px 0px rgba(36, 130, 237, 0.25);
    &:hover {
      color: #fff;
      background: linear-gradient(
        225deg,
        rgba(85, 122, 242, 1) 0%,
        rgba(82, 171, 253, 1) 100%
      );
    }
    .svg-icon {
      font-size: 20px;
      margin-top: 0 !important;
    }
  }
  .layer-bg {
    color: #fff;
    background: linear-gradient(
      225deg,
      rgba(85, 122, 242, 1) 0%,
      rgba(82, 171, 253, 1) 100%
    );
  }
}
.mapTopControl .layer_control {
  overflow: hidden;
  overflow-y: auto;
}

.cardLayer {
  width: 116px;
  position: absolute;
  top: 40px;
  right: 0px;
}

.cardLabel {
  display: inline-block;
  font-size: 14px;
  margin-bottom: 5px;
}
.cardLabelLine {
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 3px 0;
}

.basic-config {
  width: 350px;
  height: 228px;
  border-radius: 4px;
  background: #fff;
  position: absolute;
  top: 20px;
  left: 50px;
  z-index: 1002;
}

</style>
