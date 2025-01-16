<template>
  <div class="dashboard">
    <div class="overtotal">
      <div ref="flexMaps" style="height: 100%">
        <Maps
          ref="setMaps"
          :firstShowTool="false"
          :right="false"
          :key="mapKey"
          :showSk="true"
        />
      </div>
    </div>
  </div>
</template>
<script>
import Maps from "@/components/Maps/smap";
import { parseTime } from "@/utils";
import { getToken } from "@/utils/auth";
import store from "@/store";
export default {
  components: {
    Maps
  },
  data() {
    return {
      mapKey: 1
    };
  },
  computed: {
    headers() {
      return {
        token: getToken()
      };
    }
  },

  mounted() {},
  methods: {}
};
</script>

<style lang="scss" scoped></style>
