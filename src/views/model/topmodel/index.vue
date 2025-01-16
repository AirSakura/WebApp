<template>
  <div class="app-container">
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
                    @click="handleConfig(item)"
                    >参数</el-button
                  >
                  <el-button
                    v-if="item.status == 0"
                    type="text"
                    size="mini"
                    @click="handleConfigman(item)"
                    >手调</el-button
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
                <el-radio-button label="0">率定结果</el-radio-button>
                <el-radio-button label="1">验证结果</el-radio-button>
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
            <div class="params" :style="{ height: clientHeight - 80 + 'px' }">
              <el-card shadow="never" class="basic-card">
                <!-- <el-form slot="header">
                  <el-form-item>
                    <span style="font-size:18px;">子流域</span>
                    <el-select
                      style="height: 30px;width: 130px"
                      v-model="childcurrentsk"
                      placeholder="选择子流域"
                    >
                      <el-option
                        v-for="item in childbasin_form"
                        :value="item.basin_child_id"
                        :label="item.basin_child_name"
                      ></el-option>
                    </el-select>
                    <el-button
                      type="primary"
                      style="margin-left:20px"
                      @click="getList"
                      >确 定</el-button
                    >
                  </el-form-item>
                </el-form> -->

                <div slot="header" class="clearfix">
                  <span>基本参数：</span>
                  <el-button
                    v-if="curPlan > 0"
                    style="margin-left: 90px;"
                    type="success"
                    size="mini"
                    @click="handelDataOut()"
                    >导出结果</el-button
                  >
                </div>

                <el-table
                  v-loading="listLoading"
                  :data="calibrateResult.paras"
                  element-loading-text="正在查询中。。。"
                  border
                  fit
                  stripe
                  highlight-current-row
                  size="mini"
                  :max-height="(clientHeight - 80) / 2 - 55"
                >
                  <el-table-column align="center" label="参数" prop="name" />
                  <el-table-column
                    align="center"
                    label="值"
                    prop="value"
                    :formatter="numTofixed"
                  />
                </el-table>
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

            <el-card
              shadow="never"
              class="basic-card horn-card"
              :style="{ height: clientHeight - 80 + 'px' }"
            >
              <div slot="header" class="clearfix">
                <span>场次洪水</span>
              </div>
              <ul class="ul">
                <li
                  v-for="(item, index) in calibrateResult.ids"
                  :class="['horn-item', curHydro == item && 'horn-active']"
                  @click="getChart(item)"
                >
                  {{ item }}
                </li>
              </ul>
            </el-card>

            <div
              id="settle"
              class="security-charts"
              :style="{ height: clientHeight - 100 + 'px' }"
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
        :model="dataForm"
        label-position="left"
        label-width="210px"
      >
        <el-form-item label="方案名称" prop="name">
          <el-input
            class="input-unit"
            v-model.trim="dataForm.name"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="流域面积" prop="area">
          <el-input
            class="input-unit"
            v-model.trim="dataForm.area"
            placeholder="请输入"
            ><template slot="append"
              >k㎡
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="水文模型" prop="model_name">
          <el-select
            :disabled="dataForm.id > 0"
            class="input-unit"
            v-model="dataForm.model_name"
            placeholder="请选择"
            @change="getParams"
          >
            <el-option label="TOPMODEL模型" value="TOPMODEL"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日模型/次洪模型" prop="day_or_h">
          <el-select
            :disabled="dataForm.id > 0"
            class="input-unit"
            v-model="dataForm.day_or_h"
            placeholder="请选择"
          >
            <el-option label="日模型" :value="1"></el-option>
            <el-option label="次洪模型" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参数优选算法" prop="calib">
          <el-select
            class="input-unit"
            v-model="dataForm.calib"
            placeholder="请选择"
            @change="getParams"
          >
            <el-option label="GM" value="GM"></el-option>
            <el-option label="SCEUA" value="SCEUA"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="率定次数" prop="run_counts">
          <el-input
            class="input-unit"
            v-model.trim="dataForm.run_counts"
            placeholder="请输入"
            ><template slot="append"
              >次
            </template>
          </el-input>
        </el-form-item>
        <el-divider content-position="left">模型参数</el-divider>
        <el-form-item
          v-for="(item, index) in paramList"
          :label="item.name_c"
          :rules="rules[item.name]"
          :prop="item.name"
        >
          <el-input
            class="input-unit"
            v-model.trim="dataForm[item.name]"
            :placeholder="'请输入' + item.name_c"
          >
            <template slot="append" v-if="item.unit && item.unit != ''"
              >{{ item.unit }}
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button round @click="dialogFormVisible = false">关闭</el-button>
        <el-button type="primary" round @click="handleSubmit">确定</el-button>
      </div>
    </el-dialog>

    <!-- 配置参数 -->
    <el-dialog
      ref="dialog"
      :close-on-click-modal="false"
      title="参数配置"
      width="890px"
      top="8vh"
      class="dialog-form"
      :visible.sync="dialogFormVisibleman"
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
            class="input-unit"
            v-model.trim="dataFormman.name"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="流域面积" prop="area">
          <el-input
            class="input-unit"
            v-model.trim="dataFormman.area"
            placeholder="请输入"
            ><template slot="append"
              >k㎡
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="水文模型" prop="model_name">
          <el-select
            :disabled="dataFormman.id > 0"
            class="input-unit"
            v-model="dataFormman.model_name"
            placeholder="请选择"
            @change="getParams"
          >
            <el-option label="TOPMODEL模型" value="TOPMODEL"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日模型/次洪模型" prop="day_or_h">
          <el-select
            :disabled="dataFormman.id > 0"
            class="input-unit"
            v-model="dataFormman.day_or_h"
            placeholder="请选择"
          >
            <el-option label="日模型" :value="1"></el-option>
            <el-option label="次洪模型" :value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-divider content-position="left">模型参数</el-divider>
        <el-form-item
          v-for="(item, index) in paramList"
          :label="item.name_c"
          :rules="rules[item.name]"
          :prop="item.name"
        >
          <el-input
            class="input-unit"
            v-model.trim="dataFormman[item.name]"
            :placeholder="'请输入' + item.name_c"
          >
            <template slot="append" v-if="item.unit && item.unit != ''"
              >{{ item.unit }}
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button round @click="dialogFormVisibleman = false">关闭</el-button>
        <el-button type="primary" round @click="handleSubmitman"
          >确定</el-button
        >
      </div>
    </el-dialog>

    <!-- 选择场次 -->
    <el-dialog
      :close-on-click-modal="false"
      title="选择场次洪水"
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
          <el-table-column align="center" label="洪号" prop="id" />
          <el-table-column align="center" label="开始时间" prop="stime" />
          <el-table-column align="center" label="结束时间" prop="etime" />
        </el-table>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button round size="mini" @click="dialogCalibrateVisible = false"
          >关闭</el-button
        >
        <el-button
          type="primary"
          v-if="tempList.length > 0"
          round
          size="mini"
          @click="saveCalibrate(0)"
          >率定</el-button
        >
        <el-button
          type="primary"
          v-if="tempList.length > 0"
          round
          size="mini"
          @click="saveCalibrate(2)"
          >人工</el-button
        >
        <el-button
          type="primary"
          size="mini"
          v-if="tempList.length > 0"
          round
          @click="saveCalibrate(1)"
          >验证</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Axios from "axios";

import {
  calibrateList,
  planAdd,
  planEdit,
  planDelete,
  userModelInfo,
  deviceList,
  monitorData,
  editStatus,
  getBasin,
  calibmanList
} from "@/api/hydromodel/gr4j";

import {
  planList,
  calibrate,
  calibrateChart,
  calibrateEvaluate
} from "@/api/hydromodel/topmodel";
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
        area: [
          { required: true, message: "流域面积不能为空", trigger: "blur" }
        ],
        model_name: [
          { required: true, message: "水文模型不能为空", trigger: "blur" }
        ],
        run_counts: [
          { required: true, message: "率定次数不能为空", trigger: "blur" }
        ],
        calib: [
          { required: true, message: "参数优选算法不能为空", trigger: "blur" }
        ],
        day_or_h: [
          { required: true, message: "请选择日模型/次洪模型", trigger: "blur" }
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
        return Number(cellValue).toFixed(6);
      } else {
        return cellValue;
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
      this.getCalibrateEvaluate();
    },
    // 获取模型计算结果
    getCalibrateEvaluate() {
      this.calibrateResult = {
        comprehensive: [],
        ids: [],
        multi: [],
        paras: []
      };
      calibrateEvaluate({ id: this.curPlan, types: this.resultType }).then(
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
      calibrate({
        id: this.dataForm.id,
        types: type,
        times: this.tempList
      }).then(({ data }) => {
        this.$messages({
          type: "success",
          message:
            type == 0
              ? "模型计算中，请耐心等待！"
              : type == 1
              ? "模型校验成功！"
              : "手动调参成功！"
        });
        this.dialogCalibrateVisible = false;
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
          console.log(this.curPlan);
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
      console.log(this.resultType);
      Axios({
        url:
          process.env.VUE_APP_BASE_API +
          "hydro_model/gr4j/calibrate_result_dataoutfile?token=" +
          getToken(),
        method: "post",
        responseType: "blob",
        data: { data: this.tableData, id: this.curPlan, types: this.resultType }
      }).then(({ data, headers }) => {
        this.saveAs(data, "TOPMODEL模拟数据");
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
    getParams() {
      let obj = this.assignObj(
        {
          id: "",
          name: "",
          area: "",
          model_name: "TOPMODEL",
          run_counts: "",
          calib: "GM",
          status_ver: "",
          day_or_h: "",
          cache_data: null
        },
        this.dataForm
      );
      this.resetForm();
      return new Promise((resolve, reject) => {
        calibrateList({ model_name: this.dataForm.model_name }).then(
          ({ data }) => {
            this.paramList = data;
            this.dataForm = this.assignObj(this.dataForm, obj);
            data.map(v => {
              this.$set(this.dataForm, v.name, v.values);
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
    // 根据模型获取参数
    getParamsman() {
      let obj = this.assignObj(
        {
          id: "",
          name: "",
          area: "",
          model_name: "TOPMODEL",
          status_ver: "",
          day_or_h: "",
          paras: null
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
        area: "",
        model_name: "TOPMODEL",
        run_counts: "",
        calib: "GM",
        status_ver: "",
        day_or_h: "",
        cache_data: null
      };
    },
    resetFormman() {
      this.dataFormman = {
        id: "",
        name: "",
        area: "",
        model_name: "TOPMODEL",
        status_ver: "",
        day_or_h: "",
        paras: null
      };
    },
    // 新增清除数据
    async handleCreate() {
      this.resetForm();
      await this.getParams();
      this.dialogFormVisible = true;
    },
    // 配置方案参数
    async handleConfig(row) {
      this.planName = row.name;
      this.resetForm();
      this.dataForm.model_name = row.model_name;
      await this.getParams();

      this.dataForm = this.assignObj(this.dataForm, row);
      this.dataForm = this.assignObj(this.dataForm, row.cache_data);

      this.dialogFormVisible = true;
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
        this.saveAs(data, "TOPMODEL模型数据导出");
      });
    },
    // 计算模型
    getChart(id) {
      this.curHydro = id;
      calibrateChart({
        id: this.curPlan,
        hydro_id: id,
        types: this.resultType
      }).then(({ data }) => {
        let obj = {
          xAxis: [],
          data1: [],
          data2: [],
          data3: []
        };
        data.map(v => {
          obj.xAxis.push(v.time);
          obj.data1.push(v.obs);
          obj.data2.push(v.p);
          obj.data3.push(v.sim);
        });

        this.$nextTick(() => {
          this.initLineChart("settle", obj);
        });
      });
    },
    // 初始化库容统计环图
    initLineChart(id, data) {
      this.reportChart = this.$echarts.init(document.getElementById(id));
      this.reportChart.showLoading();

      function calMax(arr) {
        var max = Math.max.apply(null, arr); // 获取最大值方法
        var maxint = Math.ceil(max / 100); // 向上以100的倍数取整
        var maxval = maxint * 100; // 最终设置的最大值
        var info = [maxval, maxint + 1];
        return info; // 输出最大值
      }
      function calMax1(arr) {
        var max = Math.max.apply(null, arr); // 获取最大值方法
        var maxint = Math.ceil(max / 10); // 向上以100的倍数取整
        var maxval = maxint * 10; // 最终设置的最大值
        var info1 = [maxval, maxint + 1];
        return info1; // 输出最大值
      }
      // 调用方法，获取数据的最大值
      let num1 = calMax(data.data1)[0];
      let num2 = calMax1(data.data2)[0];

      this.reportChart.setOption({
        title: {
          text: "模拟结果展示",
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
          data: ["实测流量", "模拟流量", "面雨量"],
          top: "5%",
          color: "rgb(0,0,0)",
          left: "5%",
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

            areaStyle: {
              color: this.$echarts.graphic.LinearGradient(0, 0, 0, 1.1, [
                {
                  offset: 0,
                  color: "rgb(0,0,255)"
                },
                {
                  offset: 1,
                  color: "rgb(212,242,231)"
                }
              ])
            },
            data: data.data1
          },
          {
            name: "模拟流量",
            symbol: "none", //去掉圆点
            type: "line",
            color: "rgb(255,165,0)",
            lineStyle: {
              width: 1.5
            },
            emphasis: {
              focus: "series"
            },
            itemStyle: {
              opacity: 0.3
            },

            data: data.data3
          },
          {
            name: "面雨量",
            type: "bar",
            color: "rgb(0,255,0)",
            yAxisIndex: 1,
            emphasis: {
              focus: "series"
            },
            data: data.data2
          }
        ]
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
