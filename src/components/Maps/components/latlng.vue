<template>
  <el-dialog
    id="latlng"
    width="900px"
    top="3vh"
    :show-close="false"
    title="行政地图"
    :visible.sync="dialog"
  >
    <maps
      v-if="dialog"
      ref="setMaps"
      :size="size"
      :showBotControl="false"
      :islatlng="islatlng"
      :right="true"
      :showPoint="true"
      @setlatlng="setlatlng"
    />
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">关闭</el-button>
      <el-button type="primary" @click="setdata">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import maps from "@/components/Maps/smap";
import { convertDegree } from "@/utils";
export default {
  components: {
    maps
  },
  props: {
    location: {
      type: Array,
      default: () => []
    },
    dialog: {
      default: false,
      type: Boolean
    },
    islatlng: {
      default: true,
      type: Boolean
    },
    action: {
      default: "marker",
      type: String
    },
    icon: {
      default: "",
      type: String
    }
  },
  data() {
    return {
      latlng: [],
      tips: "",
      size: "calc(100vh - 200px)"
    };
  },
  watch: {
    dialog: {
      handler(n) {
        if (this.location && this.location.length) {
          setTimeout(() => {
            if (this.$refs.setMaps) {
              if (this.action === "marker") {
                this.$refs.setMaps.setMarker(
                  this.location[0], // 纬度
                  this.location[1], // 经度
                  this.icon
                );
              }

              if (this.action === "line") {
                this.$refs.setMaps.setPolyline(this.location);
              }
              if (this.action === "area") {
                this.$refs.setMaps.setPolygon(this.location);
              }
            }
          }, 200);
        }
      },
      immediate: true
    }
  },
  methods: {
    setlatlng(latlng) {
      this.latlng = latlng;
    },
    close() {
      this.$refs.setMaps && this.$refs.setMaps.destoryDrawCtr();
      this.$emit("close");
    },
    convert(v, y) {
      return `${convertDegree(v)},${convertDegree(y)}`;
    },
    setdata() {
      if (this.latlng.length > 0) {
        this.$emit("getLatlng", this.latlng);
        this.close();
      } else {
        if (this.islatlng) {
          if (this.action === "marker") {
            this.$emit("getLatlng", this.location);
          }
          if (this.action === "line") {
            this.$emit("getLine", this.location);
          }
          if (this.action === "area") {
            this.$emit("getArea", this.location);
          }

          this.close();
        } else {
          this.$messages({ type: "warning", message: "请选取坐标点" });
          return false;
        }
      }
    }
  }
};
</script>

<style scoped></style>
