<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in sidebarRouters"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>

      <div class="hamburger-menu">
        <hamburger
          id="hamburger-container"
          :is-active="sidebar.opened"
          class="hamburger-container"
          @toggleClick="toggleSideBar"
        />
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";
import Hamburger from "@/components/Hamburger";

export default {
  components: { SidebarItem, Logo, Hamburger },
  computed: {
    ...mapGetters(["sidebarRouters", "sidebar"]),

    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }

      let topCode = sessionStorage.getItem("topCode");
      let topCache = sessionStorage.getItem("topCache");
      topCache = JSON.parse(topCache);

      if (topCode && topCode != "Dashboard") {
        topCache[topCode] = path;
      }
      topCache = JSON.stringify(topCache);
      sessionStorage.setItem("topCache", topCache);

      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    }
  }
};
</script>
