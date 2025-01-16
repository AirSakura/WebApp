<template>
  <div class="dashboard">
    <div v-if="showdash == 'true' || showdash == true" class="overtotal">
      
    <div ref="flexMaps" style="height: 100%">
      <Maps
        ref="setMaps"
        :firstShowTool="false"
        :right="false"
        :key="mapKey"
        :showSk="true"
      />
    </div>
    <div class="content" id="rightContent">
      <div id="total">
        <!-- 视频监控 -->
        <div ref="video" id="video">
          <monitor :warning="sk_camera_warning" />
        </div>
        <!-- 三维展示 -->
      </div>
    </div>
    </div>
  </div>
</template>
<script>
import Maps from "@/components/Maps/smap";
import Monitor from "./components/monitor";
import { parseTime } from "@/utils";
import { mapGetters, mapActions } from "vuex";
import { getToken } from "@/utils/auth";
import store from "@/store";
export default {
  components: {
    Maps,
    Monitor
  },
  data() {
    return {
      showAnalysis: false,
      archorIdx: "total",
      archorState: true,
      lsatScrollTop: 0,
      mapKey: 1,
      list: [],
      showSidebar: true,
      percent: [
        { name: "大(1)型", code: "b1" },
        { name: "大(2)型", code: "b2" },
        { name: "中型", code: "mid" },
        { name: "小(1)型", code: "l1" },
        { name: "小(2)型", code: "l2" }
      ],
      herfList: [
        { key: "total", name: "总览", label: "水库总数" },
        { key: "water", name: "水情监测", label: "水情预警" },
        { key: "rain", name: "雨情监测", label: "雨情预警" },
        // { key: "flow", name: "流量监测", label: "流量预警" },
        { key: "quality", name: "水质监测", label: "水质预警" },
        { key: "work", name: "工情监测", label: "工情预警" },
        { key: "video", name: "视频监控", label: "接入总数" },
        { key: "vr", name: "三维展示", label: "3D/VR/BIM" }
      ],
      typeMap: {
        water: 2,
        rain: 1,
        video: 4,
        vr: 5,
        flow: 3,
        quality: 10,
        work: 6
      },
      total: 0,
      listQuery: {
        page: 1,
        limit: 3,
        partid: null
      },
      dictionary: {},
      sk_vr: {},
      sk_flood_warning: {},
      sk_over: {},
      sk_quality_warning: {},
      sk_rain_warning: {},
      sk_site: {},
      sk_total_num: {},
      sk_zone: [],
      sk_camera_warning: {},
      sk_ticket: {},
      sk_total: {}
    };
  },
  computed: {
    ...mapGetters(["showdash", "currentsk", "usersk"]),
    headers() {
      return {
        token: getToken()
      };
    }
  },

  mounted() {
    this.getdict();
    this.getMainInfo();
    this.getPartSelect();

    let timeArchor;
    if (document.querySelector("#rightContent")) {
      document
        .querySelector("#rightContent") //绑定指定页面滚动区域
        .addEventListener(
          "scroll",
          () => {
            clearTimeout(timeArchor);
            timeArchor = setTimeout(() => {
              this.handleScroll();
            }, 100);
          },
          true
        );
    }
  },
  methods: {
    ...mapActions(["getPartSelect"]),

    // 获取无关搜索条件数据
    getMainInfo() {
      mainStatistics({
        stime: parseTime(
          new Date().getTime() - 3600 * 1000 * 24 * 7,
          "{y}-{m}-{d} 00:00:00"
        ),
        etime: parseTime(Date.parse(new Date()))
      }).then(res => {
        this.sk_flood_warning = res.data.sk_flood_warning;
        this.sk_over = res.data.sk_over;
        this.sk_quality_warning = res.data.sk_quality_warning;
        this.sk_rain_warning = res.data.sk_rain_warning;
        this.sk_site = res.data.sk_site;
        this.sk_total_num = res.data.sk_total_num;
        this.sk_zone = res.data.sk_zone;
        this.sk_vr = res.data.sk_vr;
        this.sk_camera_warning = res.data.sk_camera_warning;
        this.sk_ticket = res.data.ticket;
        this.sk_total = res.data.total;
      });
    },

    // 获取字典
    getdict() {
      store.dispatch("app/setdict").then(dict => {
        this.dictionary = {
          project_scale: [],
          sensor_site_type: []
        };

        Object.keys(this.dictionary).map(key => {
          this.dictionary[key] = dict.filter(
            v => v.remark == key
          )[0].config_info;
        });
      });
    },
    // 展开统计分析页面
    openAnalysis() {
      this.showAnalysis = true;
    },
    // 点击滚动
    onArchorIdx(idx) {
      this.archorIdx = idx;
      this.$el.querySelector(`#${idx}`).scrollIntoView({
        behavior: "smooth" // 平滑过渡
      });

      let timeArchor;
      this.archorState = false;
      clearTimeout(timeArchor);
      timeArchor = setTimeout(() => {
        this.archorState = true;
      }, 200);
    },
    // 点击滚动
    onArchorScroll(idx) {
      this.archorIdx = idx;
      this.$el.querySelector(`#fixed${idx}`).scrollIntoView({
        behavior: "smooth" // 平滑过渡
      });

      let timeArchor;
      this.archorState = false;
      clearTimeout(timeArchor);
      timeArchor = setTimeout(() => {
        this.archorState = true;
      }, 200);
    },
    // 监控滚动条
    handleScroll() {
      if (document.querySelector("#rightContent")) {
        let scrollTop = document.querySelector("#rightContent").scrollTop;
        let offsetHeight = document.querySelector("#rightContent").offsetHeight;

        if (this.archorState) {
          //作用是点击导航栏时，延迟这里执行。
          this.herfList.map((v, i) => {
            // 获取监听元素距离视窗顶部距离
            let offsetTop = document.getElementById(v.key).offsetTop;
            // 获取监听元素本身高度
            let scrollHeight = document.getElementById(v.key).scrollHeight;
            // 如果 dom滚动位置 >= 元素距离视窗距离 && dom滚动位置 <= 元素距离视窗距离+元素本身高度
            // 则表示页面已经滚动到可视区了。
            if (
              scrollTop >= offsetTop &&
              scrollTop <= offsetTop + scrollHeight
            ) {
              // 导航栏背景色选中
              this.archorIdx = v.key;

              this.onArchorScroll(v.key);
            }
          });
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
// 右边操作栏
.sidebar {
  width: 252px;
  height: calc(100vh - 72px);
  position: fixed;
  top: 72px;
  left: 24px;
  z-index: 991;
  box-sizing: border-box;
  margin: 24px 0;
  overflow-y: auto;
  overflow: -moz-scrollbars-none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    width: 0 !important;
  }
  .slide-box {
    width: 252px;
    overflow: hidden;
  }
  .list {
    width: 252px;
    float: left;
    padding-bottom: 24px;
  }
  .item {
    width: 100%;
    height: 128px;
    border-radius: 8px;
    background: #fff;
    box-sizing: border-box;
    margin: 0 0 16px 0;
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    &:hover {
      background: linear-gradient(225deg, #557af2 0%, #52abfd 100%);
      color: #fff;
      .right {
        background: #fff;
      }
    }
    .left {
      width: 152px;
      font-size: 16px;
      span {
        line-height: 24px;
        display: block;
      }
      .title {
        font-size: 16px;
      }
      .number {
        font-size: 24px;
        font-weight: 700;
        line-height: 35px;
        margin: 14px 0 4px;
      }
    }
    .right {
      width: 60px;
      height: 60px;
      background: #dde4fc;
      border-radius: 50%;
      margin: 32px 0 0;
      .right-btn {
        line-height: 24px;
      }
    }
    .right-top {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 72px;
      .right-img {
        width: 60px;
        height: 60px;
        background: #dde4fc;
        border-radius: 50%;
      }
      .right-btn {
        line-height: 24px;
        margin-top: 18px;
      }
    }
  }
  .archor-active {
    background: linear-gradient(225deg, #557af2 0%, #52abfd 100%);
    color: #fff;
    .right {
      background: #fff;
    }
    .right-img {
      background: #fff;
    }
  }
  .collapseLeft {
    position: fixed;
    left: 0;
    top: 50%;
    margin-top: -30px;
    margin-left: 0;
    width: 30px;
    height: 60px;
    border-radius: 0 30px 30px 0;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    cursor: pointer;
    z-index: 992;
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
    &:hover {
      background: rgba(85, 122, 242, 0.8);
      color: #fff;
    }
    span {
      width: 20px;
      font-size: 12px;
    }
  }
  .slide-enter,
  .slide-leave-to {
    transform: translateX(-120%);
  }
  .slide-enter-active,
  .slide-leave-active {
    transition: 0.8s;
  }
  .slide-enter-to {
    transform: translateX(0);
  }
}

.legend {
  width: 220px;
  height: 72px;
  float: left;
  border-radius: 8px;
  box-sizing: border-box;
  padding: 0 16px;
  // background: rgba(198, 209, 247, 0.5);
  background: #fff;
  position: fixed;
  top: 96px;
  left: 290px;
  z-index: 991;
  font-size: 14px;
  .line {
    display: flex;
    align-items: center;
    float: left;
    width: 50%;
    margin: 8px 0 0;
    color: #000;

    .img {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      margin: 0 8px 0 0;
    }
  }
}
// 右边内容主体
.content {
  width: 544px;
  position: fixed;
  height: calc(100vh - 72px);
  top: 72px;
  right: 0;
  left: 10px;
  z-index: 991;
  box-sizing: border-box;
  margin: 24px 0 0 0;
  overflow-y: auto;
  overflow: -moz-scrollbars-none;
  color: #000;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    width: 0 !important;
  }
  #total {
    padding-bottom: 24px;
  }
  .container {
    background: #fff;
    width: 520px;
    border-radius: 8px;
    box-sizing: border-box;
    padding: 20px;
    margin: 0 0 20px 0;
    position: relative;
    color: #000;
    font-size: 14px;

    .title {
      display: flex;
      align-items: center;
      font-size: 20px;
      font-weight: bold;
      height: 30px;
      margin: 0 0 13px 0;
      .block {
        width: 4px;
        height: 20px;
        border-radius: 2px;
        margin: 0 8px 0 0;
        background: linear-gradient(
          180deg,
          rgba(85, 122, 242, 1) 0%,
          rgba(73, 199, 201, 1) 100%
        );
      }
      .number {
        color: #d95050;
        margin: 0 0 0 8px;
      }
    }
    .progress {
      .item {
        width: 100%;
        height: 24px;
        margin: 16px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        &:last-child {
          margin-bottom: 0;
        }
        .name {
          width: 64px;
        }
        .bar-bg {
          height: 24px;
          width: 75%;
          border-radius: 12px;
          background: #f2f4fa;
          margin: 0 1% 0 0;
          position: relative;
          .bar {
            height: 24px;
            width: 0;
            border-radius: 12px 0 0 12px;
            background: linear-gradient(
              -90deg,
              rgba(85, 122, 242, 1) 0%,
              rgba(73, 199, 201, 1) 100%
            );
            position: absolute;
            top: 0;
            left: 0;
          }
          .percent {
            height: 24px;
            display: flex;
            align-items: center;
            position: absolute;
            top: 0;
            left: 0;
          }
        }
        .number {
          width: 30px;
          color: #557af2;
          display: flex;
        }
      }
    }
    .spread-select {
      position: absolute;
      top: 18px;
      right: 20px;
    }
    // 覆写table
    /deep/.el-table--striped .el-table__body tr.el-table__row--striped td {
      background: rgba(242, 244, 250, 1);
    }
    /deep/.el-table td,
    .building-top .el-table th.is-leaf {
      border: none;
    }

    .pagination-container {
      padding: 16px 0 0;
    }
    // 测站建设
    .survey {
      padding: 2px 20px 18px;
      overflow: hidden;
      .station {
        width: 122px;
        height: 60px;
        float: left;
        margin: 16px 36px 0 0;
        display: flex;
        &:nth-child(3n) {
          margin-right: 0;
        }
        .img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #dde4fc;
          margin: 0 8px 0 0;
        }
        .info {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .name {
            line-height: 21px;
          }
          .number {
            line-height: 35px;
            .num {
              font-size: 24px;
              font-weight: bold;
              color: #557af2;
            }
          }
        }
      }
    }
    // 水情预警
    .water-warn {
      .warn {
        padding: 16px 0 0;
        display: flex;
        justify-content: space-around;
        .left {
          display: flex;
          align-items: center;
          .img {
            width: 48px;
            height: 48px;
            border-radius: 24px;
            background: #f2f4fa;
            margin: 0 8px 0 0;
          }
          .img-small {
            width: 36px;
            height: 36px;
            border-radius: 18px;
            margin: 0 4px 0 0;
          }

          .info {
            display: flex;
            flex-direction: column;
            justify-content: center;
            .number {
              font-size: 18px;
              font-weight: bold;
              text-align: center;
            }
            .name {
              color: rgba(118, 119, 122, 1);
            }
          }
        }
      }
      // 雨情预警
      .rain {
        justify-content: space-between;
      }
      .quality {
        justify-content: flex-start;
        .left1 {
          margin: 0 0 0 68px;
        }
      }
    }
    .total {
      position: absolute;
      top: 24px;
      right: 20px;
      .number {
        color: #d95050;
        font-size: 20px;
        font-weight: bold;
        margin: 0 4px;
      }
    }
    // 覆写下拉选
    .fillet {
      width: 130px !important;
      /deep/.el-input__inner {
        width: 130px !important;
        height: 30px !important;
        border-radius: 15px !important;
        background: rgba(242, 244, 250, 1);
        border: none;
      }
      /deep/.el-select__caret {
        height: 30px !important;
        line-height: 30px !important;
      }
      /deep/.el-input__suffix {
        right: 12px !important;
      }
    }
    .fillet-input {
      /deep/.el-input__inner {
        width: 180px !important;
      }
    }
    // 查询条件
    .filter-container {
      position: relative;
      overflow: hidden;
      .filter-line {
        display: flex;
        overflow: hidden;
        justify-content: space-between;
      }
      .filter-item {
        display: flex;
        align-items: center;
        float: left;
        margin: 0 0 16px 0;
      }

      .filter-time {
        .el-range-editor.el-input__inner {
          height: 30px !important;
          border-radius: 15px !important;
          background: rgba(242, 244, 250, 1);
          border: none;
        }
        /deep/.el-date-editor .el-range-input {
          background: rgba(242, 244, 250, 1) !important;
        }
        /deep/.el-date-editor .el-range__icon,
        /deep/.el-date-editor .el-range__close-icon,
        /deep/.el-date-editor .el-range-separator {
          height: 30px !important;
          line-height: 30px !important;
        }
      }
    }
    .filter-btn {
      width: 80px;
      height: 30px;
      background: linear-gradient(
        -90deg,
        rgba(85, 122, 242, 1) 0%,
        rgba(73, 199, 201, 1) 100%
      );
      border: none;
      border-radius: 15px;
      position: absolute;
      top: 20px;
      right: 20px;
    }
    .filter-btn-bottom {
      right: 0;
      top: 46px;
    }
    /deep/.el-button {
      padding: 0;
    }
    .rain-query {
      .rain-radio {
        margin-bottom: 8px;
      }
      .rain-station {
        overflow: hidden;
        margin: 0 0 16px 0;
        width: 100%;
        .station {
          width: 25%;
          float: left;
          margin: 16px 0 0;
          .top {
            margin-bottom: 4px;
          }
          .dot {
            width: 12px;
            height: 12px;
            border-radius: 6px;
            display: inline-block;
            background: #557af2;
            margin-right: 2px;
          }
        }
      }
    }
    .video {
      overflow: hidden;
      display: flex;
      align-items: center;
      .count {
        height: 48px;
        float: left;
        border-left: 2px solid #d95050;
        padding: 0 0 0 12px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-left: 32px;
        .number {
          font-size: 20px;
          font-weight: bold;
          color: #d95050;
        }
      }
      .count1 {
        border-left: 2px solid #e9eaf0;
      }
      .pie {
        width: 110px;
        height: 110px;
        border-radius: 50%;
        border: 1px solid #e9eaf0;
        margin: 0 0 0 80px;
        position: relative;
        .pos {
          width: 108px;
          height: 108px;
          position: absolute;
          top: 0;
          left: 0;
          transform: rotate(-90deg);
        }
        .pie-in {
          width: 110px;
          height: 110px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          .number {
            font-size: 24px;
            font-weight: bold;
            color: #557af2;
            margin: 0 0 6px 0;
          }
        }
      }
    }
  }
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}

.analysis {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 992;
  top: 72px;
  left: 0;
  bottom: 0;
  right: 0;
  background: #f2f4fa;
  overflow-y: auto;
  .analysis-close {
    position: fixed;
    top: 72px;
    right: 0;
    background-color: #dce4f5;
    height: 40px;
    width: 40px;
    line-height: 30px;
    text-align: right;
    border-radius: 0 0 0 40px;
    box-sizing: border-box;
    padding-right: 5px;
    font-size: 20px;
    cursor: pointer;
    color: #3c3a39;
  }
}
</style>
