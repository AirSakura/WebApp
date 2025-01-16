<template>
  <div :class="classObj" class="app-wrapper">
    <div :class="{ 'fixed-header': fixedHeader }">
      <navbar />
    </div>
    <sidebar class="sidebar-container" v-show="!fullscreen" />
    <div
      :class="{ hasTagsView: needTagsView }"
      class="main-container"
      :style="{ 'margin-left': fullscreenLeft }"
    >
      <tags-view v-if="needTagsView && spath != 'Dashboard'" />
      <app-main />
      <right-panel v-if="showSettings">
        <settings />
      </right-panel>
    </div>
  </div>
</template>

<script>
import RightPanel from "@/components/RightPanel";
import { AppMain, Navbar, Settings, Sidebar, TagsView } from "./components";
// import ResizeMixin from "./mixin/ResizeHandler";
import { mapState } from "vuex";

export default {
  name: "Layout",
  components: {
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView
  },
  data() {
    return {
      spath: ""
    };
  }, // mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader,
      fullscreen: state => state.app.fullscreen
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile"
      };
    },
    fullscreenLeft() {
      if (this.fullscreen) {
        return "0px";
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 如果不是从B来的就重新获取数据
      vm.spath = to.name;
    });
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  z-index: 9;
  // width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
  z-index: 999;
}

.mobile .fixed-header {
  width: 100%;
}
</style>
