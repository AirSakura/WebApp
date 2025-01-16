<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-bar">
      <p class="filter-line">
        <el-button
          type="primary"
          class="fr"
          size="mini"
          icon="el-icon-s-tools"
          round
          @click="handleConfig"
          >模型配置</el-button
        >
      </p>
      <p class="filter-line">
        <el-button
          type="primary"
          icon="el-icon-document-copy"
          class="fr"
          size="mini"
          round
          @click="handleExport"
          >结果导出</el-button
        >
      </p>
    </div>
    <div style="display: flex">
      <div class="flexMainFull">
        <div
          class="table-container"
          :style="{ 'min-height': clientHeight + 'px' }"
        >
          <div class="security-table-bar">
            <div class="title">
              <p class="title-icon"><svg-icon icon-class="report" /></p>
              <p class="title-text">
                数据模型
              </p>
            </div>

            <el-radio-group size="medium" v-model="showTable">
              <el-radio-button label="chart">图表形式</el-radio-button>
              <el-radio-button label="table">数据列表</el-radio-button>
            </el-radio-group>
          </div>

          <div
            id="settle"
            class="security-charts"
            :style="{ height: clientHeight - 100 + 'px' }"
            v-show="showTable == 'chart'"
          ></div>

          <div v-show="showTable == 'table'">
            <el-table
              v-loading="listLoading"
              :data="list"
              :height="clientHeight - 100"
              element-loading-text="正在查询中。。。"
              border
              fit
              stripe
              highlight-current-row
            >
              />
              <el-table-column align="center" label="时间" prop="time" />
              <el-table-column
                align="center"
                label="面雨量(mm)"
                prop="p"
                :formatter="numTofixed"
              />
              <el-table-column
                align="center"
                label="蒸发量(mm)"
                prop="etp"
                :formatter="numTofixed"
              />
              <el-table-column
                align="center"
                label="实测流量(m³/s)"
                prop="obs"
                :formatter="numTofixed"
              />
              <el-table-column
                align="center"
                label="模拟流量(m³/s)"
                prop="sim"
                :formatter="numTofixed"
              />
            </el-table>
          </div>
        </div>
      </div>
    </div>

    <!-- 选择数据 -->
    <el-dialog
      ref="dialog"
      :close-on-click-modal="false"
      title="模型配置"
      width="1000px"
      top="5vh"
      :visible.sync="dialogVisible"
    >
      <el-divider content-position="center">选择方案</el-divider>
      <div style="display: flex;margin-bottom: 20px;">
        <span style="margin-right: 10px;">
          模型：
          <el-select
            class="input-unit"
            v-model="dataQuery.model_name"
            placeholder="请选择"
            @change="getPlan"
          >
            <el-option label="GR4J模型" value="GR4J"></el-option>
            <el-option label="LSTM模型" value="LSTM"></el-option>
            <el-option label="新安江模型" value="XAJ"></el-option>
          </el-select>
        </span>

        <span style="margin-right: 10px;">
          方案：
          <el-select
            class="input-unit"
            v-model="dataQuery.id"
            placeholder="请选择"
            @change="getDayOrH"
          >
            <el-option
              v-for="item in planList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </span>

        <span>
          日模型/次洪模型：
          <el-select disabled v-model="dataQuery.day_or_h">
            <el-option label="日模型" :value="1"></el-option>
            <el-option label="次洪模型" :value="2"></el-option>
          </el-select>
        </span>
      </div>

      <el-divider content-position="center">选择数据</el-divider>
      <div style="display: flex;margin-bottom: 10px;">
        <p class="filter-line">
          <span class="filter-time-box">
            <el-date-picker
              v-model="dataQuery.stime"
              type="date"
              placeholder="选择日期时间"
              size="small"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
            <span>-</span>
            <el-date-picker
              v-model="dataQuery.etime"
              type="date"
              size="small"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </span>
        </p>
        <p class="filter-line" style="margin-left: 10px;">
          <el-button
            type="primary"
            icon="el-icon-search"
            class="fr"
            size="mini"
            round
            @click="handleData"
            >查找</el-button
          >
        </p>
      </div>

      <el-table
        v-loading="listLoading"
        :data="dataList"
        element-loading-text="正在查询中。。。"
        border
        fit
        stripe
        highlight-current-row
        row-key="id"
        :max-height="500"
      >
        <el-table-column align="center" label="时间" prop="time" />
        <el-table-column
          align="center"
          label="面雨量(mm)"
          prop="p"
          :formatter="numTofixed"
        />
        <el-table-column
          align="center"
          label="蒸发量(mm)"
          prop="etp"
          :formatter="numTofixed"
        />
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button type="success" class="fr" @click="handleCalculate"
          >计算模型</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Axios from "axios";
import { getData, hydroPlan, calibrateChart } from "@/api/model";
import { parseTime } from "@/utils";
import { getToken } from "@/utils/auth";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      Height: 0,
      isHeight: false,
      dialogFormVisible: false,
      dialogVisible: false,
      tmpLoading: false,
      clientHeight: 0,
      showTable: "chart",
      list: [], // 列表
      dataList: [],
      dataForm: {},
      total: 0,
      listLoading: false,
      planList: [],
      dataQuery: {
        id: "",
        type_run: 1,
        day_or_h: "",
        model_name: "",
        // hydro_id: "",
        stime: parseTime(
          new Date().getTime() - 3600 * 1000 * 24 * 7,
          "{y}-{m}-{d} 00:00:00"
        ),
        etime: parseTime(Date.parse(new Date()))
      }
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

  mounted() {
    this.resetForm();
    this.clientHeight = document.body.clientHeight - 205;
    window.addEventListener("resize", () => {
      this.reportChart && this.reportChart.resize();
    });
  },
  methods: {
    numTofixed(row, column, cellValue, index) {
      if (Number(cellValue) > 0) {
        return Number(cellValue).toFixed(2);
      } else {
        return 0;
      }
    },
    // 开启配置弹窗
    handleConfig() {
      // this.dataQuery = {
      //   id: "",
      //   type_run: 1,
      //   day_or_h: "",
      //   model_name: "",
      //   // hydro_id: "",
      //   stime: parseTime(
      //     new Date().getTime() - 3600 * 1000 * 24 * 7,
      //     "{y}-{m}-{d} 00:00:00"
      //   ),
      //   etime: parseTime(Date.parse(new Date()))
      // };
      // this.dataList = [];
      this.dialogVisible = true;
    },
    // 获取当前方案的模型 日/小时
    getDayOrH() {
      this.dataQuery.day_or_h = this.planList.filter(
        v => v.id == this.dataQuery.id
      )[0].day_or_h;
    },
    // 获取方案列表
    getPlan() {
      hydroPlan({
        model_name: this.dataQuery.model_name,
        partid: this.$store.state.user.currentsk
      }).then(({ data }) => {
        this.planList = data;
        this.dataQuery.day_or_h = "";
        this.dataQuery.day_or_h = "";
      });
    },
    // 获取计算模型所需的数据
    handleData() {
      if (this.dataQuery.id == "") {
        this.$messages({
          type: "info",
          message: "请先选择方案！"
        });
        return;
      }
      this.dataQuery.partid = this.$store.state.user.currentsk;
      getData(this.dataQuery).then(({ data }) => {
        this.dataList = data[0] || [];
      });
    },
    // 提交
    handleSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
        }
      });
    },
    // 下载
    saveAs(blob, filename) {
      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename);
      } else {
        let link = document.createElement("a");
        let body = document.querySelector("body");
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        // fix Firefox
        link.style.display = "none";
        body.appendChild(link);
        link.click();
        body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
      }
    },
    // 导出
    handleExport() {
      Axios({
        url: `${
          process.env.VUE_APP_BASE_API
        }gr4j/list/export?token=${getToken()}`,
        method: "post",
        header: {
          "Content-Type": "application/json" //规定传递的参数格式为json
        },
        data: { data: this.list },
        responseType: "blob"
      }).then(({ data }) => {
        this.saveAs(data, "GR4J模型数据导出");
      });
    },
    // 计算模型
    handleCalculate() {
      // 洪号暂时不要
      // this.dataQuery.hydro_id = this.dataQuery.stime
      //   .split(" ")[0]
      //   .replace(/-/g, "");
      if (this.dataQuery.id == "") {
        this.$messages({
          type: "info",
          message: "请先选择方案！"
        });
        return;
      }
      calibrateChart(this.dataQuery).then(({ data }) => {
        this.dialogVisible = false;
        this.list = data;
        let obj = {
          xAxis: [],
          data1: [],
          data2: []
        };
        this.list.map(v => {
          obj.xAxis.push(v.time);
          obj.data1.push(v.p);
          obj.data2.push(v.sim);
        });
        this.$nextTick(() => {
          this.initLineChart("settle", obj);
        });
      });
    },

    // 重置表单
    resetForm() {
      this.dataForm = {
        partid: this.$store.state.user.currentsk,
        x1: "",
        x2: "",
        x3: "",
        x4: "",
        s: "",
        r: ""
      };
    },

    // 初始化库容统计环图
    initLineChart(id, data) {
      this.reportChart = this.$echarts.init(document.getElementById(id));
      this.reportChart.showLoading();

      function calMax(arr) {
        var max = Math.max.apply(null, arr); // 获取最大值方法
        var maxint = Math.ceil(max / 100); // 向上以100的倍数取整
        var maxval = maxint * 100 + 100; // 最终设置的最大值
        var info = [maxval, maxint + 1];
        return info; // 输出最大值
      }
      function calMax1(arr) {
        var max = Math.max.apply(null, arr); // 获取最大值方法
        var maxint = Math.ceil(max / 10); // 向上以100的倍数取整
        var maxval = maxint * 10 + 10; // 最终设置的最大值
        var info1 = [maxval, maxint + 1];
        return info1; // 输出最大值
      }
      // 调用方法，获取数据的最大值
      let num1 = calMax(data.data1)[0];
      let num2 = calMax1(data.data2)[0];

      this.reportChart.setOption({
        title: {
          text: "预报结果展示",
          left: "center",
          top: "5%"
        },
        toolbox: {
          show: true,
          feature: {
            dataView: { show: true },
            restore: { show: true },
            saveAsImage: {
              pixelRatio: 20
            } //值越大分辨率越高
          }
        },
        grid: {
          top: "15%",
          bottom: 80,
          right: "10%"
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: "none"
            },
            restore: {},
            saveAsImage: {}
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            animation: false,
            label: {
              backgroundColor: "#505765"
            }
          }
        },
        legend: {
          borderWidth: 0.3,
          borderColor: "rgb(0,0,0)",
          data: ["模拟流量", "面雨量"],
          top: "5%",
          color: "rgb(0,0,0)",
          left: "15%",
          padding: [5, 5, 5, 5] //图例框
        },
        dataZoom: [
          {
            show: true,
            realtime: true
          },
          {
            type: "inside",
            realtime: true
          }
        ],
        xAxis: [
          {
            type: "category",
            boundaryGap: true,
            data: data.xAxis
          }
        ],
        yAxis: [
          {
            name: "流量(m³/s)",
            type: "value",
            min: 0,
            max: Number(num1 / 0.8).toFixed(0),
            axisLine: {
              show: true
            },
            splitLine: {
              show: false // 不显示网格线
            },
            axisTick: {
              show: true // 不显示坐标轴刻度线
            },
            interval: 100 // 标轴分割间隔
          },
          {
            name: "面雨量(mm)",
            nameLocation: "start",
            axisLine: {
              show: true
            },
            splitLine: {
              show: true // 不显示网格线
            },
            axisTick: {
              show: true // 不显示坐标轴刻度线
            },
            min: 0,
            max: Number(num2 / 0.3).toFixed(0),
            type: "value",
            inverse: true
            // interval: 10 // 标轴分割间隔
          }
        ],
        series: [
          {
            name: "模拟流量",
            symbol: "none", //去掉圆点
            type: "line",
            color: "rgb(255,165,0)",
            areaStyle: {},
            lineStyle: {
              width: 1
            },
            emphasis: {
              focus: "series"
            },
            itemStyle: {
              opacity: 0.3
            },
            data: data.data2
          },
          {
            name: "面雨量",
            type: "bar",
            color: "rgb(0,255,0)",
            yAxisIndex: 1,
            areaStyle: {},
            lineStyle: {
              width: 1
            },
            emphasis: {
              focus: "series"
            },
            data: data.data1
          }
        ]
      });
      this.reportChart.hideLoading();
    }
  }
};
</script>
<style lang="scss" scoped></style>
