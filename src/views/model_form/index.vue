<template>
  <div
    class="app-container"
    :style="{ height: clientHeight - 50 + 'px', 'margin-top': 0 }"
  >
    <div style="display: flex">
      <div class="flexPart" style="width:350px">
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
                @click="getList"
                >确 定</el-button
              >
            </el-form-item>
          </el-form>

          <div class="security-table-bar">
            <div class="title">
              <p class="title-icon"><svg-icon icon-class="list" /></p>
              <p class="title-text">方案列表</p>
            </div>

            <p>
              <el-button
                type="text"
                size="mini"
                icon="el-icon-plus"
                @click="handleCreate"
                >新增</el-button
              >
            </p>
          </div>
          <div class="tree-box">
            <ul class="dm-list">
              <li class="dm-item" v-for="item in list" :key="item.id">
                <p
                  style="display: flex; align-items: center;"
                  @click="setPlanId(item)"
                >
                  <svg-icon icon-class="example" class="icon" />
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="item.name"
                    placement="top-start"
                  >
                    <span
                      :class="[
                        'plan-name',
                        curPlan == item.id && 'plan-active'
                      ]"
                      alter=""
                      >{{ item.name }}</span
                    >
                  </el-tooltip>
                </p>
                <p>
                  <el-button
                    v-if="item.status == 0"
                    type="text"
                    size="mini"
                    @click="Configtimes(item)"
                    >时段</el-button
                  >
                  <el-button
                    v-if="item.status == 0"
                    type="text"
                    size="mini"
                    @click="handleCalibrate(item)"
                    >处理</el-button
                  >
                  <el-button
                    type="text"
                    size="mini"
                    style="color: red;"
                    @click="handleDelete(item)"
                    >删除</el-button
                  >
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="flexMain" style="width:calc(100% - 350px)">
        <div
          class="table-container"
          :style="{ 'min-height': clientHeight + 'px' }"
        >
          <div class="security-table-bar">
            <div class="title">
              <p class="title-icon"><svg-icon icon-class="report" /></p>
              <p class="title-text">
                模型数据
              </p>

              <el-radio-group
                size="mini"
                v-model="resultType"
                @input="handleChangeType"
                style="margin-left: 15px;"
              >
                <el-radio-button label="0">结果</el-radio-button>
              </el-radio-group>

              <el-button
                v-if="curPlan > 0 && curStatus == 0"
                style="margin-left: 15px;"
                type="success"
                size="mini"
                @click="handelSavePlan"
                >保存方案</el-button
              >
            </div>
          </div>
          <div style="display: flex;">
            <div class="params" :style="{ height: clientHeight - 500 + 'px' }">
              <el-card shadow="never" class="basic-card">
                <div slot="header" class="clearfix">
                  <span>数据操作：</span>
                  <el-button
                    v-if="curPlan > 0"
                    style="margin-left: 90px;"
                    type="success"
                    size="mini"
                    @click="handelDataOut()"
                    >导出结果</el-button
                  >
                </div>
              </el-card>

              <el-card shadow="never" class="basic-card level-card">
                <div slot="header" class="clearfix">
                  <p>
                    <span
                      :class="[
                        'level-name',
                        showTable == '1' && 'level-active'
                      ]"
                      @click="switchLevel(1)"
                      >综合评价</span
                    >
                    <span
                      @click="switchLevel(2)"
                      :class="[
                        'level-name',
                        showTable == '2' && 'level-active'
                      ]"
                      >场次评价</span
                    >
                  </p>
                </div>
                <el-table
                  v-if="showTable == '1'"
                  v-loading="listLoading"
                  :data="calibrateResult.comprehensive"
                  element-loading-text="正在查询中。。。"
                  border
                  fit
                  stripe
                  highlight-current-row
                  size="mini"
                  :max-height="(clientHeight - 80) / 2 - 55"
                >
                  <el-table-column
                    align="center"
                    label="精度等级"
                    prop="name"
                  />

                  <el-table-column align="center" label="甲" prop="t1" />
                  <el-table-column align="center" label="乙" prop="t2" />
                  <el-table-column align="center" label="丙" prop="t3" />
                  <el-table-column align="center" label="不合格" prop="t4" />
                </el-table>

                <el-table
                  v-if="showTable == '2'"
                  v-loading="listLoading"
                  :data="calibrateResult.multi"
                  element-loading-text="正在查询中。。。"
                  border
                  fit
                  stripe
                  highlight-current-row
                  size="mini"
                  :max-height="(clientHeight - 80) / 2 - 55"
                >
                  <el-table-column
                    align="center"
                    label="洪号"
                    prop="hydro_id"
                  />

                  <el-table-column
                    align="center"
                    label="洪量相对误差/%"
                    prop="REV"
                  />
                  <el-table-column
                    align="center"
                    label="洪峰相对误差/%"
                    prop="REP"
                  />
                  <el-table-column
                    align="center"
                    label="峰现时间误差/h"
                    prop="L"
                  />
                  <el-table-column
                    align="center"
                    label="确定性系数"
                    prop="NSE"
                  />
                </el-table>
              </el-card>
            </div>

            <el-card shadow="never"> </el-card>

            <div
              id="settle"
              class="security-charts"
              :style="{ height: clientHeight - 150 + 'px' }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 自动率定配置参数 -->
    <el-dialog
      ref="dialog"
      :close-on-click-modal="false"
      title="参数配置"
      width="890px"
      top="8vh"
      class="dialog-form"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :inline="true"
        :model="dataFormman"
        label-position="left"
        label-width="210px"
      >
        <el-form-item label="方案名称" prop="name">
          <el-input
            style="width: 360px;"
            v-model.trim="dataFormman.name"
            placeholder="请输入"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button round @click="dialogFormVisible = false">关闭</el-button>
        <el-button type="primary" round @click="handleSubmitman"
          >确定</el-button
        >
      </div>
    </el-dialog>

    <!-- 选择预报开始及结束时间 -->
    <el-dialog
      ref="dialog"
      :close-on-click-modal="false"
      title="参数配置"
      width="890px"
      top="8vh"
      class="dialog-form"
      :visible.sync="dialogFormVisibletimes"
    >
      <p class="filter-line">
        <span class="title">时间范围</span>
        <span class="filter-time-box">
          <el-date-picker
            v-model="json_times.stime"
            type="datetime"
            placeholder="选择日期时间"
            size="small"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
          <span>-</span>
          <el-date-picker
            v-model="json_times.etime"
            type="datetime"
            size="small"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </span>
      </p>
      <div slot="footer" class="dialog-footer">
        <el-button round @click="dialogFormVisibletimes = false"
          >关闭</el-button
        >
        <el-button type="primary" round @click="handleConfigtimes"
          >确定</el-button
        >
      </div>
    </el-dialog>

    <!-- 选择场次 -->
    <el-dialog
      :close-on-click-modal="false"
      title="选择预报方案"
      width="900px"
      top="5vh"
      :visible.sync="dialogCalibrateVisible"
    >
      <div style="display: flex;">
        <el-table
          ref="multipleTable"
          :data="timeList"
          element-loading-text="正在查询中。。。"
          border
          fit
          stripe
          highlight-current-row
          row-key="id"
          size="mini"
          :max-height="300"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column
            width="60"
            align="center"
            label="序号"
            prop="region_name"
          >
            <template slot-scope="{ row, $index }">
              {{ $index + 1 }}
            </template>
          </el-table-column>
          <el-table-column
            width="100"
            align="center"
            label="模型编号"
            prop="id"
          />
          <el-table-column align="center" label="方案名称" prop="name" />
          <el-table-column align="center" label="模型名称" prop="model_name" />
          <el-table-column
            align="center"
            label="日/次模型"
            prop="day_or_h"
            :formatter="sfktFormateday_or_h"
          />

          <el-table-column
            align="center"
            label="模型是否构建完整"
            prop="status"
            :formatter="sfktFormate"
          />
        </el-table>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button round size="mini" @click="dialogCalibrateVisible = false"
          >关闭</el-button
        >
        <!-- <el-button
            type="primary"
            v-if="tempList.length > 0"
            round
            size="mini"
            @click="saveCalibrate(0)"
            >率定</el-button
          > -->
        <el-button
          type="primary"
          v-if="tempList.length > 0"
          round
          size="mini"
          @click="saveCalibrate(2)"
          >确定</el-button
        >
        <!-- <el-button
          type="primary"
          size="mini"
          v-if="tempList.length > 0"
          round
          @click="saveCalibrate(1)"
          >测试</el-button
        > -->
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Axios from "axios";

import {
  deviceList,
  monitorData,
  editStatus,
  getBasin
} from "@/api/hydromodel/gr4j";

import {
  userModelInfo,
  planAdd,
  planEdit,
  planDelete,
  calibmanList,
  planList,
  calibrateEvaluate,
  calibrateChart,
  trainproEdit
} from "@/api/hydromodel/form";
import { calibrate } from "@/api/hydromodel/misdc";
import { parseTime } from "@/utils";
import { getToken } from "@/utils/auth";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      Height: 0,
      isHeight: false,
      resultType: 0,
      dialogFormVisible: false,
      dialogFormVisibleman: false,
      dialogCalibrateVisible: false,
      dialogFormVisibletimes: false,
      calib: "",
      dataout: "",
      dialogVisible: false,
      tmpLoading: false,
      clientHeight: 0,
      showTable: "1",
      chartRange: [],
      list: [], // 列表
      dataList: [],
      deviceList: [],
      basin_form: [],
      childbasin_form: [],
      dataForm: {},
      dataFormman: {},
      total: 0,
      listLoading: false,
      curPlan: "",
      curHydro: "",
      currentsk: "",
      childcurrentsk: "",
      dictionary: {},
      json_times: {
        stime: parseTime(
          new Date().getTime() - 3600 * 1000 * 24 * 7,
          "{y}-{m}-{d} 00:00:00"
        ),
        etime: parseTime(Date.parse(new Date()))
      },
      dataQuery: {
        sensor_code: "",
        stime: "",
        etime: ""
      },
      calibrateResult: {
        // comprehensive: [],
        // ids: [],
        // multi: [],
        // paras: []
      },
      paramList: [],
      timeList: [],
      tempList: [],
      tempForm: {},
      planName: "",
      rules: {
        name: [
          { required: true, message: "方案名称不能为空", trigger: "blur" }
        ],
        model_name: [
          { required: true, message: "集成学习算法不能为空", trigger: "blur" }
        ]
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
    this.clientHeight = document.body.clientHeight - 115;
    window.addEventListener("resize", () => {
      this.reportChart && this.reportChart.resize();
      this.deviceChart && this.deviceChart.resize();
    });
    this.$nextTick(() => {
      this.getUpBasininfo();
      // this.getList();
      // this.getDevice();
      // this.getTimeList();
    });
  },
  methods: {
    numTofixed(row, column, cellValue, index) {
      if (Number(cellValue) > 0) {
        return Number(cellValue).toFixed(3);
      } else {
        return cellValue;
      }
    },
    sfktFormate(row, index) {
      if (row.status == 1) {
        return "是";
      } else if (row.status == 0) {
        return "否";
      }
    },

    sfktFormateday_or_h(row, index) {
      if (row.day_or_h == 1) {
        return "日模型";
      } else if (row.day_or_h == 2) {
        return "次模型";
      }
    },

    // 切换率定结果和验证结果
    handleChangeType() {
      this.getCalibrateEvaluate();
    },
    // 选择场次洪水
    handleSelectionChange(selection) {
      this.tempList = selection;
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
    // 点击方案
    setPlanId(row) {
      this.$nextTick(() => {
        this.getList();
      });
      this.curPlan = row.id;
      this.curStatus = row.status;
      this.reportChart && this.reportChart.clear();
      this.getChart();
    },
    // 获取模型计算结果
    getCalibrateEvaluate() {
      this.calibrateResult = {
        comprehensive: [],
        ids: [],
        multi: [],
        paras: []
      };
      // console.log(this.curPlan);

      if (this.curPlan) {
        this.planid = this.curPlan;
      } else {
        this.planid = this.dataForm.id;
      }
      calibrateEvaluate({ id: this.planid, types: this.resultType }).then(
        ({ data }) => {
          data.paras = this.dealObj(data.paras);
          let res = [];
          data.comprehensive.map((v, i) => {
            if (i == 0) {
              res[i] = {
                name: "合格率/%",
                t1: v.QR1 || "/",
                t2: v.QR2 || "/",
                t3: v.QR3 || "/",
                t4: v.QR4 || "/"
              };
            }
            if (i == 1) {
              res[i] = {
                name: "确定性系数",
                t1: v.NS1 || "/",
                t2: v.NS2 || "/",
                t3: v.NS3 || "/",
                t4: v.NS4 || "/"
              };
            }
          });
          data.comprehensive = res;

          this.calibrateResult = this.assignObj(this.calibrateResult, data);
        }
      );
    },
    // 切换显示场次洪水率定结果
    switchLevel(key) {
      this.showTable = key;
    },
    // 获取洪水场次列表
    getTimeList() {
      userModelInfo({ basin_id: this.currentsk }).then(({ data }) => {
        this.timeList = data;
      });
    },
    //选取流域列表
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

    // 开启动率定/验证弹窗
    handleCalibrate(row) {
      this.dataForm = this.assignObj(this.dataForm, row);
      this.dialogCalibrateVisible = true;
      this.$nextTick(() => {
        this.tempList = [];
        this.$refs.multipleTable.clearSelection();
      });
    },
    // 自动率定/验证
    saveCalibrate(type) {
      if (this.curPlan) {
        this.planid = this.curPlan;
      } else {
        this.planid = this.dataForm.id;
      }
      planEdit({
        id: this.planid,
        train_times: this.tempList
      }).then(({ data }) => {
        this.$messages({
          type: "success",
          message: "已选择对比方案！"
        });
        this.dialogCalibrateVisible = false;
        // 展示图表
        this.$nextTick(() => {
          this.getChart();
        });
      });
    },
    // 保存率定方案
    handelSavePlan() {
      this.$confirms("方案保存后将无法修改，请确认后再保存?", "删除操作", {
        confirmsButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "confirmsTop"
      })
        .then(() => {
          editStatus({ id: this.curPlan }).then(({ data }) => {
            this.getList();
            this.$messages({
              type: "success",
              message: "方案保存成功！"
            });
          });
        })
        .catch(() => {
          this.$messages({
            type: "info",
            message: "已取消"
          });
        });
    },
    handelDataOut() {
      Axios({
        url:
          process.env.VUE_APP_BASE_API +
          "hydro_model/gr4j/calibrate_result_dataoutfile?token=" +
          getToken(),
        method: "post",
        responseType: "blob",
        data: { data: this.tableData, id: this.curPlan, types: this.resultType }
      }).then(({ data, headers }) => {
        this.saveAs(data, "RF模拟数据");
      });
    },
    saveAs(blob, filename) {
      let link = document.createElement("a");
      let body = document.querySelector("body");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${filename}.xlsx`;
      link.style.display = "none";
      body.appendChild(link);
      link.click();
      body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    },
    // 获取设备列表
    getDevice() {
      deviceList({ basin_id: this.currentsk }).then(({ data }) => {
        this.deviceList = data;
        this.dataQuery.sensor_code = this.deviceList[0].sensor_code;
      });
    },
    // 获取方案列表
    getList() {
      this.$nextTick(() => {
        this.getTimeList();
      });

      planList({ basin_id: this.currentsk }).then(({ data }) => {
        this.list = data;
      });
    },

    // 根据模型获取参数
    getParamsman() {
      let obj = this.assignObj(
        {
          id: "",
          name: "",
          model_name: "RF",
          cache_data: null
        },
        this.dataFormman
      );
      this.resetFormman();
      return new Promise((resolve, reject) => {
        calibmanList({ model_name: this.dataForm.model_name }).then(
          ({ data }) => {
            this.paramList = data;
            this.dataFormman = this.assignObj(this.dataFormman, obj);
            data.map(v => {
              this.$set(this.dataFormman, v.name, v.values);
              this.tempForm[v.name] = "";
              this.rules[v.name] = [
                {
                  required: true,
                  message: "请填写" + v.name_c,
                  trigger: "blur"
                }
              ];
            });
            resolve();
          }
        );
      });
    },
    // 重置配置参数表单
    resetForm() {
      this.dataForm = {
        id: "",
        name: "",
        model_name: "RF",
        cache_data: null
      };
    },
    resetFormman() {
      this.dataFormman = {
        id: "",
        name: "",
        model_name: "RF",
        paras: null
      };
    },
    // 新增清除数据
    async handleCreate() {
      this.resetForm();
      this.dialogFormVisible = true;
    },
    // 配置方案参数
    // async handleConfig(row) {
    //   this.planName = row.name;
    //   this.resetForm();
    //   this.dataForm.model_name = row.model_name;
    //   await this.getParams();

    //   this.dataForm = this.assignObj(this.dataForm, row);
    //   this.dataForm = this.assignObj(this.dataForm, row.cache_data);

    //   this.dialogFormVisible = true;
    // },

    // 手动配置预报时间段
    async Configtimes(row) {
      this.dialogFormVisibletimes = true;
    },
    // 手动配置预报时间段
    async handleConfigtimes(row) {
      if (this.curPlan) {
        this.planid = this.curPlan;
      } else {
        this.planid = this.dataForm.id;
      }
      planEdit({ id: this.planid, pretimes: this.json_times })
        .then(res => {
          this.$messages({
            type: "success",
            message: "添加成功"
          });
        })
        .catch(res => {});
      this.dialogFormVisibletimes = false;
    },

    // 手动配置方案参数
    async handleConfigman(row) {
      this.planName = row.name;
      this.resetFormman();
      this.dataFormman.model_name = row.model_name;
      await this.getParamsman();
      this.dataFormman = this.assignObj(this.dataFormman, row);
      this.dataFormman = this.assignObj(this.dataFormman, row.paras);
      this.dialogFormVisibleman = true;
    },
    // 根据设备和时间获取数据
    handleData() {
      this.dataQuery.basin_id = this.currentsk;
      monitorData(this.dataQuery).then(({ data }) => {
        this.dataList = data;
        this.dataXAxis = [];
        this.dataSeries = [];
        data.map(v => {
          this.dataXAxis.push(v.time);
          this.dataSeries.push(v.para1);
        });

        this.$nextTick(() => {
          this.initDeviceChart("deviceChart", this.dataXAxis, this.dataSeries);
        });
      });
    },
    // 初始化库容统计环图
    initDeviceChart(id, xAxis, data) {
      this.deviceChart = this.$echarts.init(document.getElementById(id));
      this.deviceChart.showLoading();
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
                "m³/s";
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
        yAxis: {
          name: "流量(m³/s)",
          nameLocation: "end",
          alignTicks: true,
          type: "value"
        },
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
    },
    // 提交方案配置
    handleSubmit() {
      let type = "add",
        urls = {
          add: planAdd,
          edit: planEdit
        };
      if (this.dataForm.id > 0) type = "edit";
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.dataForm.basin_id = this.currentsk;
          this.dataForm.cache_data = this.assignObj(
            this.tempForm,
            this.dataForm
          );
          urls[type](this.dataForm).then(({ data }) => {
            this.getList();
            this.$messages({
              type: "success",
              message: "添加成功"
            });
            this.dialogFormVisible = false;
          });
        }
      });
    },
    handleSubmitman() {
      let type = "add",
        urls = {
          add: planAdd,
          edit: planEdit
        };
      if (this.dataFormman.id > 0) type = "edit";
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.dataFormman.basin_id = this.currentsk;
          this.dataFormman.paras = this.assignObj(
            this.tempForm,
            this.dataFormman
          );
          urls[type](this.dataFormman).then(({ data }) => {
            this.getList();
            this.$messages({
              type: "success",
              message: "添加成功"
            });
            this.dialogFormVisibleman = false;
            this.dialogFormVisible = false;
          });
        }
      });
    },
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
        this.saveAs(data, "RF模型数据导出");
      });
    },
    // 计算模型
    getChart() {
      // this.curHydro = id;
      if (this.curPlan) {
        this.planid = this.curPlan;
      } else {
        this.planid = this.dataForm.id;
      }
      calibrateChart({
        id: this.planid
      }).then(({ data }) => {
        let obj = {
          xAxis: [],
          data2: []
        };
        obj.data2 = data.data2;
        data.data1.map(v => {
          obj.xAxis.push(v.time);
        });

        this.$nextTick(() => {
          this.initLineChart("settle", obj);
        });
      });
    },
    // 初始化库容统计环图
    initLineChart(id, data) {
      this.reportChart = this.$echarts.init(document.getElementById(id));
      this.reportChart.clear();
      this.reportChart.showLoading();

      let option = null;
      let option1 = [];
      let p_data = null;
      let q_data = [];
      data.data2.map(item => {
        if (item.name == "面雨量") {
          option = {
            name: "面雨量",
            type: "bar",
            color: "rgb(0,255,0)",
            yAxisIndex: 1,
            emphasis: {
              focus: "series"
            },
            data: item.data
          };
          p_data = item.data;
          option1.push(option);
        } else {
          option = {
            name: item.name,
            symbol: "none", //去掉圆点
            type: "line",
            lineStyle: {
              width: 1.5
            },
            emphasis: {
              focus: "series"
            },
            itemStyle: {
              opacity: 0.3
            },
            data: item.data
          };
          q_data.push(item.data);
          option1.push(option);
        }
      });

      function calMax(arr) {
        var max = Math.max.apply(null, arr); // 获取最大值方法
        var maxint = Math.ceil(max / 10); // 向上以100的倍数取整
        var maxval = maxint * 10; // 最终设置的最大值
        var info = [maxval, maxint + 1];
        return info; // 输出最大值
      }
      function calMax1(arr) {
        var max = Math.max.apply(null, arr); // 获取最大值方法
        var maxint = Math.ceil(max / 5); // 向上以10的倍数取整
        var maxval = maxint * 5; // 最终设置的最大值
        var info1 = [maxval, maxint + 1];
        return info1; // 输出最大值
      }
      // 调用方法，获取数据的最大值
      let num = [];
      q_data.map(item => {
        num.push(calMax(item)[0]);
      });
      let num1 = Math.max.apply(null, num);
      let num2 = calMax1(p_data)[0];
      console.log(num1, num2);
      this.reportChart.setOption({
        title: {
          text: "预报结果对比",
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
          orient: "vertical",
          right: 120,
          top: 120,
          data: data.data2.map(item => item.name),

          color: "rgb(0,0,0)",

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
            max: Math.ceil(Number(num1 / 0.7) / 10) * 10,
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
            max: Number(num2 / 0.8).toFixed(0),
            type: "value",
            inverse: true
            // interval: 10 // 标轴分割间隔
          }
        ],
        series: option1
      });

      this.reportChart.hideLoading();
    },
    handleDelete(row) {
      this.$confirms("确定删除吗?", "删除操作", {
        confirmsButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "confirmsTop"
      })
        .then(() => {
          planDelete({
            id: row.id
          }).then(() => {
            this.$messages({
              type: "success",
              message: "删除成功"
            });
            this.getList();
            this.$refs.sitetree.refresh();
          });
        })
        .catch(() => {
          this.$messages({
            type: "info",
            message: "已取消"
          });
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.dm-container {
  padding: 20px 10px;
  background: #fff;
  overflow-y: auto;
  border-radius: 8px !important;
  margin: 10px 10px 0 0;
}
.dm-list {
  padding: 0 0 0 5px;
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
  width: 145px;
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
  width: calc(50vw - 0px);
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
  .ul {
    height: 680px;
    overflow-y: auto;
  }
  .select_child {
    width: 80px;
    height: 10px;
  }
}
</style>
