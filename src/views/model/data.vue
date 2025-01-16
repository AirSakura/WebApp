<template>
  <div class="app-container">
    <div style="display: flex">
      <div class="flexPart" style="width:500px">
        <div
          class="dm-container"
          :style="{ height: clientHeight + 'px', 'margin-top': 0 }"
        >
          <el-form>
            <el-form-item label="流域">
              <el-select
                style="width:120px"
                v-model="currentsk"
                placeholder="选择流域"
              >
                <el-option
                  v-for="item in basin_form"
                  :value="item.basin_id"
                  :label="item.basin_name"
                ></el-option>
              </el-select>
              <el-button
                type="primary"
                style="margin-left:20px"
                @click="gettimeData"
                >确 定</el-button
              >
            </el-form-item>
          </el-form>
          <div class="security-table-bar">
            <div class="title">
              <p class="title-icon"><svg-icon icon-class="list" /></p>
              <p class="title-text">场次洪水</p>
            </div>

            <p>
              <el-button type="primary" size="mini" round @click="saveModel"
                >提交</el-button
              >
            </p>
          </div>
          <el-table
            :data="timeList"
            element-loading-text="正在查询中。。。"
            border
            fit
            stripe
            highlight-current-row
            row-key="id"
            size="mini"
            :max-height="600"
          >
            <el-table-column align="center" label="洪号" prop="id" />
            <el-table-column align="center" label="开始时间" prop="stime" />
            <el-table-column align="center" label="结束时间" prop="etime" />
            <el-table-column align="center" width="160px" label="操作">
              <template slot-scope="scope">
                <el-button
                  type="danger"
                  size="mini"
                  round
                  @click="handleDeleteTime(scope.$index)"
                  >删除</el-button
                >
                <el-button
                  type="primary"
                  size="mini"
                  round
                  @click="handleFlowGetTime(scope.$index)"
                  >查看</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="flexMain" style="width:calc(100% - 510px)">
        <div
          class="table-container"
          :style="{ 'min-height': clientHeight + 'px' }"
        >
          <div class="filter-bar" style="padding: 0 20px 0 20px;">
            <p class="filter-line">
              <el-select
                v-model="dataQuery.sensor_code"
                size="small"
                placeholder="请选择设备"
                style="width: 160px;"
              >
                <el-option
                  v-for="item in deviceList"
                  :key="item.id"
                  :label="item.station_name"
                  :value="item.sensor_code"
                >
                </el-option>
              </el-select>
            </p>

            <p class="filter-line">
              <span class="filter-time-box" style="margin-left: 5px;">
                <el-date-picker
                  v-model="dataQuery.stime"
                  type="datetime"
                  placeholder="选择日期时间"
                  size="small"
                  value-format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
                <span>-</span>
                <el-date-picker
                  v-model="dataQuery.etime"
                  type="datetime"
                  size="small"
                  placeholder="选择日期时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
              </span>
            </p>

            <p class="filter-line">
              <el-button
                style="margin-left: 5px;"
                type="primary"
                class="fr"
                size="mini"
                round
                @click="handleData"
                >查找</el-button
              >
            </p>

            <p class="filter-line">
              <el-button
                type="primary"
                class="fr"
                size="mini"
                :disabled="chartRange.length <= 1"
                round
                @click="handleSaveTime"
                >场次提取</el-button
              >
            </p>
          </div>
          <div
            class="security-charts"
            :style="{ height: clientHeight - 105 + 'px', width: '100%' }"
            id="deviceChart"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  userModelInfo,
  userModelEdit,
  monitorData,
  deviceList,
  pqData
} from "@/api/hydromodel/extraction";

import { planList, getBasin } from "@/api/model";
import { parseTime } from "@/utils";
import { getToken } from "@/utils/auth";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      clientHeight: 0,
      chartRange: [],
      dataList: [],
      basin_form: "",
      timeList: [],
      deviceList: [],
      total: 0,
      listLoading: false,
      currentsk: "",
      dataQuery: {
        sensor_code: "",
        stime: "",
        etime: ""
      },
      filename: "gjy1.csv"
    };
  },
  computed: {
    ...mapGetters(["currentsk"]),
    headers() {
      return {
        token: getToken()
      };
    }
  },

  mounted() {
    this.clientHeight = document.body.clientHeight - 115;
    window.addEventListener("resize", () => {
      this.deviceChart && this.deviceChart.resize();
    });
    this.$nextTick(() => {
      this.getUpBasininfo();
      this.getList();
      this.getDevice();
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
    getUpBasininfo() {
      getBasin()
        .then(res => {
          this.basin_form = res.data;
        })
        .catch(res => {
          this.$messages({
            type: "warning",
            message: res
          });
        });
    },
    ///获取流域
    getList() {
      planList({ basin_id: this.currentsk }).then(({ data }) => {
        this.list = data;
      });
    },
    // 获取洪水场次列表
    getList() {
      userModelInfo({ basin_id: this.currentsk }).then(({ data }) => {
        this.timeList = data;
      });
    },
    gettimeData() {
      this.$nextTick(() => {
        this.getList();
        this.getDevice();
      });
    },

    // 对象处理成数据
    dealObj(data) {
      let list = [];
      for (var i in data) {
        let obj = {
          name: i,
          value: data[i] != null ? data[i] : "--"
        };
        list.push(obj);
      }
      return list;
    },
    // 保存时间范围
    saveModel() {
      userModelEdit({ basin_id: this.currentsk, times: this.timeList }).then(
        ({ data }) => {
          this.getList();
          this.$messages({
            type: "success",
            message: "添加成功"
          });
        }
      );
    },
    // 保存时间范围
    handleSaveTime() {
      let obj = {
        id: this.chartRange[0].split(" ")[0].replace(/-/g, ""),
        stime: this.chartRange[0],
        etime: this.chartRange[this.chartRange.length - 1],
        sensor_code: this.dataQuery.sensor_code
      };
      this.chartRange = [];
      this.timeList.push(obj);
    },
    // 删除时间范围
    handleDeleteTime(index) {
      this.timeList.splice(index, 1);
    },
    ///点击洪号获取过程线
    handleFlowGetTime(index) {
      var datat = this.timeList.slice(index, index + 1)[0];
      this.dataQuery.basin_id = this.currentsk;
      this.dataQuery.stime = datat.stime;
      this.dataQuery.etime = datat.etime;
      this.dataQuery.sensor_code = datat.sensor_code;
      monitorData(this.dataQuery).then(({ data }) => {
        this.dataList = data;
        this.dataXAxis = [];
        this.dataSeries = [];
        this.dataYSeries = [];
        data.map(v => {
          this.dataXAxis.push(v.time);
          this.dataSeries.push(v.para3);
          this.dataYSeries.push(v.para1);
        });

        this.$nextTick(() => {
          this.initDeviceChart(
            "deviceChart",
            this.dataXAxis,
            this.dataSeries,
            this.dataYSeries
          );
        });
      });
    },
    //获取场次洪水图
    // handleGetTime(index) {
    //   this.timeList.splice(index, 1);
    //   this.dataQuery = this.$nextTick(() => {
    //     this.handleData(
    //       "deviceChart",
    //       this.dataXAxis,
    //       this.dataSeries,
    //       this.dataYSeries
    //     );
    //   });
    // },
    // 获取设备列表
    getDevice() {
      deviceList({ basin_id: this.currentsk }).then(({ data }) => {
        this.deviceList = data;
        this.dataQuery.sensor_code = this.deviceList[0].sensor_code;
      });
    },

    // 根据设备和时间获取数据
    // handleData1() {
    //   this.dataQuery.basin_id = this.currentsk;
    //   monitorData(this.dataQuery).then(({ data }) => {
    //     this.dataList = data;
    //     this.dataXAxis = [];
    //     this.dataSeries = [];
    //     this.dataYSeries = [];
    //     data.map(v => {
    //       this.dataXAxis.push(v.time);
    //       this.dataSeries.push(v.para3);

    //       this.dataYSeries.push(v.para1);
    //     });

    //     this.$nextTick(() => {
    //       this.initDeviceChart(
    //         "deviceChart",
    //         this.dataXAxis,
    //         this.dataSeries,
    //         this.dataYSeries
    //       );
    //     });
    //   });
    // },
    // 根据设备和时间获取数据
    // handleData() {
    //   this.dataQuery.basin_id = this.currentsk;
    //   pqData({ file: this.filename }).then(({ data }) => {
    //     this.dataList = data;
    //     this.dataXAxis = [];
    //     this.dataSeries = [];
    //     console.log(this.dataList);
    //     data.map(v => {
    //       this.dataXAxis.push(v.time);
    //       this.dataSeries.push(v.para1);
    //     });
    //     console.log(this.dataXAxis);
    //     console.log(this.dataSeries);
    //     this.$nextTick(() => {
    //       this.initDeviceChart("deviceChart", this.dataXAxis, this.dataSeries);
    //     });
    //   });
    // },

    // 根据设备和时间获取数据
    handleData() {
      this.dataQuery.basin_id = this.currentsk;
      monitorData(this.dataQuery).then(({ data }) => {
        this.dataList = data;
        this.dataXAxis = [];
        this.dataSeries = [];
        this.dataYSeries = [];
        data.map(v => {
          this.dataXAxis.push(v.time);
          this.dataSeries.push(v.para3);
          this.dataYSeries.push(v.para1);
        });

        this.$nextTick(() => {
          this.initDeviceChart(
            "deviceChart",
            this.dataXAxis,
            this.dataSeries,
            this.dataYSeries
          );
        });
      });
    },
    // 初始化设备统计数据
    initDeviceChart(id, xAxis, data, datay) {
      this.deviceChart = this.$echarts.init(document.getElementById(id));
      this.deviceChart.showLoading();
      function calMax(arr) {
        var max = Math.max.apply(null, arr); // 获取最大值方法
        var maxint = Math.ceil(max / 100); // 向上以100的倍数取整
        var maxval = maxint * 100; // 最终设置的最大值
        var info = [maxval, maxint];
        return info; // 输出最大值
      }
      function calMax1(arr) {
        var max = Math.max.apply(null, arr); // 获取最大值方法
        var maxint = Math.ceil(max / 10); // 向上以100的倍数取整
        var maxval = maxint * 10 + 10; // 最终设置的最大值
        var info1 = [maxval, maxint];
        return info1; // 输出最大值
      }
      // 调用方法，获取数据的最大值
      let num1 = calMax(data)[0];
      let num2 = calMax1(datay)[0];

      this.deviceChart.setOption({
        title: {
          text: "",
          x: "center"
        },
        grid: {
          top: "10%",
          left: "5%",
          bottom: "22%",
          right: "5%"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            animation: false,
            label: {
              backgroundColor: "#505765"
            }
          },
          formatter: function(params) {
            var relVal = params[0].name;
            for (var i = 0, l = params.length; i < l; i++) {
              relVal +=
                "<br/>" +
                params[i].marker +
                params[i].seriesName +
                " " +
                params[i].value +
                "";
            }
            return relVal;
          }
        },
        dataZoom: [
          {
            show: true,
            realtime: true,
            start: 0,
            end: 100
          },
          {
            type: "inside",
            realtime: true,
            start: 0,
            end: 100
          }
        ],
        brush: {
          toolbox: ["rect", "clear"],
          brushStyle: {
            borderWidth: 2,
            color: "rgba(120,140,180,0.3)",
            borderColor: "rgba(0,0,0,.65)"
          },
          xAxisIndex: "all",
          throttleType: "debounce",
          throttleDelay: 1500
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          axisLine: { onZero: false },
          data: xAxis.map(function(str) {
            return str.replace(" ", "\n");
          })
        },
        yAxis: [
          // {
          //   name: "流量(m³/s)",
          //   nameLocation: "end",
          //   alignTicks: true,
          //   type: "value"
          // },
          // {
          //   name: "雨量(mm)",
          //   nameTextStyle: {
          //     color: "rgb(0,0,0)",
          //     fontSize: 12
          //   },
          //   nameLocation: "start",
          //   color: "rgb(0,0,0)",
          //   axisLabel: {
          //     textStyle: {
          //       color: "rgb(0,0,0)"
          //     }
          //   },
          //   interval: 10,
          //   alignTicks: true,
          //   type: "value",
          //   inverse: true
          // }
          {
            name: "流量(m³/s)",
            type: "value",
            min: 0,
            max: Number(num1 / 1).toFixed(0),
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
            max: Number(num2 / 1).toFixed(0),
            type: "value",
            inverse: true
            // interval: 10 // 标轴分割间隔
          }
        ],
        series: [
          {
            name: "实测流量",
            type: "line",
            symbol: "circle",
            symbolSize: 10,
            data: data,
            selectedMode: "multiple",
            select: {
              itemStyle: {
                color: "#fa8c16"
              }
            }
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
            data: datay
          }
        ]
      });
      this.deviceChart.hideLoading();

      this.deviceChart.dispatchAction({
        type: "takeGlobalCursor",
        // 如果想变为“可刷选状态”，必须设置。不设置则会关闭“可刷选状态”。
        key: "brush",
        brushOption: {
          // 参见 brush 组件的 brushType。如果设置为 false 则关闭“可刷选状态”。
          brushType: "lineX",
          // 参见 brush 组件的 brushMode。如果不设置，则取 brush 组件的 brushMode 设置
          brushMode: "single"
        }
      });

      this.deviceChart.on("brushSelected", this.renderBrushed);
    },
    renderBrushed(params) {
      this.chartRange = [];
      var brushComponent = params.batch[0];
      let numArray = []; //选中范围
      if (brushComponent.areas[0] !== undefined) {
        numArray = brushComponent.areas[0].coordRange;
      }
      this.dataXAxis.forEach((value, index, array) => {
        if (index >= numArray[0] && index <= numArray[1]) {
          this.chartRange.push(value);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.dm-container {
  padding: 20px;
  background: #fff;
  overflow-y: auto;
  border-radius: 8px !important;
  margin: 10px 10px 0 0;
}
.dm-list {
  padding: 0 0 0 10px;
  .dm-item {
    margin: 5px 0;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    span {
      padding: 2px 4px;
      border-radius: 4px;
    }
    .icon {
      color: #557af2;
      margin: 0 5px 0 0;
    }
  }
  .dm-active {
    background: #c9e9f7;
  }
}
.input-unit {
  width: 200px;
}
.plan-name {
  width: 120px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  display: inline-block;
  &:hover {
    background: rgba($color: #557af2, $alpha: 0.1);
  }
}
.plan-active {
  background: rgba($color: #557af2, $alpha: 0.1);
}
.el-button + .el-button {
  margin-left: 5px;
}
.basic-card {
  width: 300px;
  margin-right: 10px;
  height: calc(50% - 5px);
  margin-bottom: 10px;
}
.level-card {
  margin-bottom: 0;
}
.level-name {
  cursor: pointer;
}
.level-active {
  color: #557af2;
}
.security-charts {
  width: calc(50vw - 150px);
}
.horn-card {
  width: 120px;
  height: 100%;
  margin-bottom: 0;
  .horn-item {
    padding: 5px;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
      background: rgba($color: #557af2, $alpha: 0.15);
    }
  }
  .horn-active {
    background: rgba($color: #557af2, $alpha: 0.15);
  }
}
</style>
