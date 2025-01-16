<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <!-- <svg-icon class-name="home" icon-class="index" /> -->
    <span class="sidebar-title" @click.stop="routerHome">{{ title }}</span>
    <!-- <el-dropdown @command="switchSk">
      <div class="sidebar-logo-link">
        <h1 class="sidebar-title">{{ title }}</h1>
      </div>
      <el-dropdown-menu
        slot="dropdown"
        v-if="usersk.length > 0"
        style="min-width: 200px;overflow-y: auto;max-height: 500px;"
      >
        <el-input
          placeholder="请输入关键字"
          prefix-icon="el-icon-search"
          v-model="search"
          @input="querySearch"
          style="width: 180px;margin: 0 10px 5px;"
          size="mini"
        >
        </el-input>
        <el-dropdown-item
          style="font-size: 16px;"
          v-for="item in results"
          :command="item"
          :key="item.partid"
          >{{ item.partname }}</el-dropdown-item
        >
      </el-dropdown-menu>
    </el-dropdown> -->

    <!-- <i class="el-icon-arrow-down"></i> -->
  </div>
</template>

<script>
export default {
  name: "SidebarLogo",
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  computed: {},
  watch: {},
  data() {
    return {
      title: "中小流域洪水预报系统",
      logo: require("../../../assets/images/globle.png"),
      search: "",
      results: []
    };
  },
  methods: {
    routerHome() {
      this.$router.push({ path: "/dashboard" });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}
.sidebar-title {
  width: 100%;
  text-align: center;
  display: inline-block;
  margin: 0 4px 0 0;
  font-size: 22px !important;
  font-weight: 700;
  color: rgba(52, 53, 56, 1);
  line-height: 72px;
  font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
}
.sidebar-logo-container {
  position: relative;
  width: 280px;
  height: 72px;
  line-height: 72px;
  background: #fff;
  text-align: center;
  overflow: hidden;
  float: left;
  display: flex;
  align-items: center;
  .home {
    font-size: 24px;
    cursor: pointer;
    margin: 0 20px 0 20px;
  }

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;
    cursor: pointer;
    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      max-width: 192px;
      display: inline-block;
      margin: 0 4px 0 0;
      font-size: 20px !important;
      font-weight: 700;
      color: rgba(52, 53, 56, 1);
      line-height: 72px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
