<template>
  <div>
    <maps
      v-if="showMap"
      ref="setMaps"
      :islatlng="true"
      :firstShowTool="false"
      :showBotControl="false"
      :right="true"
      :geoJson="geoJson"
      :size="size"
    />
  </div>
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
    area: {
      type: Array,
      default: () => []
    },
    line: {
      type: Array,
      default: () => []
    },
    icon: {
      default: "",
      type: String
    },
    isMarker: {
      default: true,
      type: Boolean
    },
    isLine: {
      default: false,
      type: Boolean
    },
    isArea: {
      default: false,
      type: Boolean
    },
    showMap: {
      default: false,
      type: Boolean
    },
    geoJson: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      latlng: [],
      tips: "",
      size: "calc(100vh - 320px)"
    };
  },
  watch: {
    showMap: {
      handler(n, o) {
        if (this.location.length > 0) {
          setTimeout(() => {
            if (this.$refs.setMaps) {
              this.$refs.setMaps.invalidate();
              if (this.isMarker) {
                this.$refs.setMaps.setMarker(
                  this.location[0], // 纬度
                  this.location[1], // 经度
                  this.icon
                );
              }
            }
          }, 200);
        }
        if (this.line.length > 0) {
          setTimeout(() => {
            if (this.$refs.setMaps) {
              this.$refs.setMaps.invalidate();
              if (this.isLine) {
                this.$refs.setMaps.setPolyline(this.line);
              }
            }
          }, 200);
        }
        if (this.area.length > 0) {
          setTimeout(() => {
            if (this.$refs.setMaps) {
              this.$refs.setMaps.invalidate();
              if (this.isArea) {
                this.$refs.setMaps.setPolygon(this.area);
              }
            }
          }, 200);
        }
      },
      immediate: true
    }
  },
  methods: {
    convert(v, y) {
      return `${convertDegree(v)},${convertDegree(y)}`;
    }
  }
};
</script>

<style>
.box-card .el-card__body {
  height: 100%;
}
</style>
