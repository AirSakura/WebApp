<template>
  <div class="dashboard-container">
    <div style="display: flex; height: calc(100vh - 120px)">
      <div :class="opened ? 'flexRole' : 'flexDashboard'">
        <el-card class="box-card" :body-style="{ padding: '0px' }">
          <div ref="CardTree" class="card-tree">
            <div class="card-tree-title">
              <p class="title">
                图层目录
              </p>
              <el-dropdown @command="handleClick">
                <el-button type="primary" size="mini">
                  工具<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="1">裁剪</el-dropdown-item>
                  <el-dropdown-item command="2">TWI</el-dropdown-item>
                  <el-dropdown-item command="2">等流时线</el-dropdown-item>
                  <el-dropdown-item command="3">河网提取</el-dropdown-item>
                  <el-dropdown-item command="3">流域提取</el-dropdown-item>
                  <el-dropdown-item command="4">泰森多边形</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-button
                type="primary"
                icon="el-icon-upload"
                size="mini"
                @click="refresh"
              >
                上传
              </el-button>
            </div>
            <div style="padding-right: 6px">
              <el-tree
                v-if="openPanel"
                ref="eltree"
                :data="part"
                show-checkbox
                :default-expand-all="true"
                :default-checked-keys="defaultCheck"
                node-key="id"
                @check="handleTree"
              >
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="node.label"
                    placement="top-start"
                  >
                    <span class="tree-nowrap">{{ node.label }}</span>
                  </el-tooltip>
                  <span v-if="node.level == 2">
                    <i
                      v-if="
                        data.suffix == ['zip'] ||
                          (data.suffix == ['geojson'] &&
                            node.parent.data.label != '点')
                      "
                      style="color: #2482ed"
                      class="el-icon-setting"
                      @click="() => config(node, data)"
                    ></i>
                    <i
                      style="color: rgb(65, 170, 119)"
                      class="el-icon-printer"
                      @click="() => dowanload(node, data)"
                    ></i>
                    <i
                      style="color: red"
                      class="el-icon-delete"
                      @click="() => remove(node, data)"
                    ></i>
                  </span>
                </span>
              </el-tree>
            </div>
          </div>
        </el-card>
      </div>

      <el-dialog title="裁剪工具" :visible.sync="dialogtoolVisible">
        <el-form :model="form" label-width="120px">
          <el-form-item label="裁剪边界">
            <el-select v-model="basinValue2" placeholder="请选择边界数据">
              <el-option
                v-for="(item, index) in basin_form2"
                :key="index"
                :value="item.dataname"
                :name="item.dataname"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="栅格文件">
            <el-select v-model="basinValue3" placeholder="请选择栅格数据">
              <el-option
                v-for="(item, index) in basin_form3"
                :key="index"
                :value="item.dataname"
                :name="item.dataname"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogtoolVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveData">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="地形指数计算" :visible.sync="dialogtooltwiVisible">
        <el-form :model="form" label-width="120px">
          <el-form-item label="DEM">
            <el-select v-model="basinValue3" placeholder="请选择流域DEM数据">
              <el-option
                v-for="(item, index) in basin_form3"
                :key="index"
                :value="item.dataname"
                :name="item.dataname"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogtooltwiVisible = false">取 消</el-button>
          <el-button type="primary" @click="caculTwi">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="提取流域" :visible.sync="dialogtoolbasinVisible">
        <el-form
          ref="form"
          :rules="examineRules"
          :inline="true"
          :model="form"
          label-position="left"
          label-width="120px"
        >
          <el-form-item label="DEM">
            <el-select v-model="basinValue3" placeholder="请选择流域DEM数据">
              <el-option
                v-for="(item, index) in basin_form3"
                :key="index"
                :value="item.dataname"
                :name="item.dataname"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="流域出口x坐标">
            <el-input
              v-model="basinValue4"
              placeholder="请输入"
              style="width: 200px;"
              clearable
              size="small"
            />
          </el-form-item>
          <el-form-item label="流域出口y坐标">
            <el-input
              v-model="basinValue5"
              placeholder="请输入"
              style="width: 200px;"
              clearable
              size="small"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogtoolbasinVisible = false">取 消</el-button>
          <el-button type="primary" @click="basinDivide">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog
        ref="dialog"
        :close-on-click-modal="false"
        title="泰森多边形划分"
        width="450px"
        top="5vh"
        :visible.sync="dialogtoolTsVisible"
      >
        <div style="display: flex">
          <div style="flex: 1">
            <el-form
              ref="dataForm"
              :rules="rules"
              :inline="false"
              :model="dataForm"
              status-icon
              label-position="left"
              label-width="100px"
              class="demo-table-expand"
            >
              <el-form-item label="shp文件上传" prop="url">
                <uploads
                  v-if="dialogtoolTsVisible"
                  ref="imglist"
                  upload="data_manage/upload_shpzip"
                  :suffix="['zip']"
                  :size="200"
                  @setFile="getFiles"
                />
              </el-form-item>
              <el-form-item label="Excel文件上传" prop="url">
                <uploads
                  v-if="dialogtoolTsVisible"
                  ref="imglist"
                  upload="data_manage/upload_excel"
                  :suffix="['xlsx']"
                  :size="200"
                  @setFile="getFiles1"
                />
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogtoolTsVisible = false">取消</el-button>
          <el-button type="primary" @click="updateData1">确定</el-button>
        </div>
      </el-dialog>

      <div :class="opened ? 'flexMainRole' : 'flexMainFull'">
        <el-card class="box-card" :body-style="{ padding: '0px' }">
          <div ref="flexMaps">
            <leafletMaps
              ref="setMaps"
              :key="mapKey"
              :mapHeight="150"
              v-loading="loading"
              element-loading-text="图层加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
              @toggleSideBar="toggleSideBar"
            />
          </div>
        </el-card>
      </div>
    </div>

    <el-dialog
      ref="dialog"
      :close-on-click-modal="false"
      title="上传图层"
      width="450px"
      top="5vh"
      :visible.sync="dialogFormVisible"
    >
      <div style="display: flex">
        <div style="flex: 1">
          <el-form
            ref="dataForm"
            :rules="rules"
            :inline="false"
            :model="dataForm"
            status-icon
            label-position="left"
            label-width="100px"
            class="demo-table-expand"
          >
            <el-form-item label="图层类别" prop="pidx">
              <el-select
                v-model="dataForm.pidx"
                placeholder="选择图层类别"
                class="form-line"
                clearable
              >
                <el-option label="点" value="0" />
                <el-option label="线" value="1" />
                <el-option label="面" value="2" />
                <el-option label="栅格" value="3" />
              </el-select>
            </el-form-item>
            <el-form-item label="文件上传" prop="url">
              <uploads
                v-if="dialogFormVisible"
                ref="imglist"
                upload="data_manage/upload"
                :suffix="['geojson', 'zip', 'tif', 'tiff']"
                :size="200"
                @setFile="getFiles"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      ref="dialog"
      :close-on-click-modal="false"
      title="图层配置"
      width="350px"
      top="5vh"
      :visible.sync="dialogConfigVisible"
    >
      <div style="display: flex">
        <div style="flex: 1">
          <el-form
            :model="colorForm"
            status-icon
            label-position="left"
            label-width="100px"
            class="demo-table-expand"
          >
            <el-form-item label="边框颜色">
              <el-color-picker
                v-model="colorForm.out"
                show-alpha
                size="mini"
                style="margin: 8px 0 0"
              ></el-color-picker>
            </el-form-item>
            <el-form-item label="填充颜色">
              <el-color-picker
                v-model="colorForm.in"
                show-alpha
                style="margin: 8px 0 0"
                size="mini"
              ></el-color-picker>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogConfigVisible = false">取消</el-button>
        <el-button type="primary" @click="updateConfig">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="地形指数频率曲线"
      type="flex"
      justify="center"
      align="middle"
      :modal-append-to-body="false"
      :visible.sync="newDialogFormVisible"
      append-to-body
    >
      <el-form :inline="true" size="medium" label-width="80px">
        <el-row :gutter="10" type="flex" justify="center" align="middle">
          <el-col :span="12"
            ><div class="grid-content"></div>
            <el-form-item>
              <div
                id="newEcharts"
                style="width:400px;height:350px;padding-top:5px;"
              ></div>
            </el-form-item>
          </el-col>
          <el-col :span="12"
            ><div class="grid-content">
              <el-button
                class="my-button"
                size="small"
                type="primary"
                icon="el-icon-download"
                @click="downLoadtwi"
                >下载</el-button
              >
            </div>
            <el-table :data="tableData" height="250" border style="width: 100%">
              <el-table-column
                prop="score"
                align="center"
                label="TWI"
                width="200"
              >
              </el-table-column>
              <el-table-column
                prop="reclassfy"
                align="center"
                label="占比"
                width="200"
              >
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

    <el-dialog
      title="泰森多边形处理结果"
      type="flex"
      justify="center"
      align="middle"
      :modal-append-to-body="false"
      :visible.sync="TsDialogFormVisible"
      append-to-body
    >
      <el-form :inline="true" size="medium" label-width="80px">
        <el-row :gutter="10" type="flex" justify="center" align="middle">
          <el-col :span="12"
            ><div class="grid-content">
              <el-button
                class="my-button"
                size="small"
                type="primary"
                icon="el-icon-download"
                @click="downLoadpa"
                >下载</el-button
              >
            </div>
            <div class="grid-content">
              <el-button
                class="my-button"
                size="small"
                type="primary"
                icon="el-icon-download"
                @click="viewpa"
                >查看</el-button
              >
            </div>
            <el-table
              :data="tstableData"
              height="250"
              border
              style="width: 100%"
            >
              <el-table-column
                prop="station_name"
                align="center"
                label="站点"
                width="200"
              >
              </el-table-column>
              <el-table-column
                prop="weight"
                align="center"
                label="占比"
                width="200"
              >
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {
  saveFile,
  analysisFile,
  delFile,
  fileTree,
  getUpdata,
  tifClip,
  getTwi,
  getBasin,
  dataViews
} from "@/api/editmap";
import leafletMaps from "@/components/Maps/editmap";
import uploads from "@/components/Uploads";
import downLoadRemoteFile from "@/utils/blob";
import Axios from "axios";
import { config } from "@vue/test-utils";
import * as echarts from "echarts";
import { getToken } from "@/utils/auth";
export default {
  components: {
    leafletMaps,
    uploads
  },
  data() {
    return {
      opened: true,
      mapKey: 1,
      fileList: [],
      colorForm: {
        out: "rgba(255, 69, 0, 1)",
        in: "rgba(255, 120, 0, 0.6)"
      },
      list: [],
      tableData: [],
      tstableData: [],
      suffix: "",
      loading: false,
      tmpLoading: false,
      dialogConfigVisible: false,
      dialogFormVisible: false,
      TsDialogFormVisible: false,
      newDialogFormVisible: false,
      dialogVisible: false,
      curNode: null,
      dataForm: {},
      openPanel: true,
      defaultCheck: [],
      rules: {
        pidx: [
          {
            required: true,
            message: "请选择图层类型",
            trigger: "blur"
          }
        ],
        url: [
          {
            required: true,
            message: "请上传图层文件",
            trigger: "blur"
          }
        ]
      },
      dialogtoolVisible: false,
      dialogtooltwiVisible: false,
      dialogtoolbasinVisible: false,
      dialogtoolTsVisible: false,
      basin_form2: [],
      basin_form3: [],
      basinValue2: "",
      basinValue3: "",
      basinValue4: "",
      basinValue5: "",
      data_type: "",
      clipname: "",
      basinname: {
        label: "",
        url: "",
        inColor: "rgba(255, 120, 0, 0.6)",
        outColor: "rgba(255, 69, 0, 1)"
      },
      twi: "",
      form: {
        dataname: ""
      },
      examineRules: {
        basinValue3: [
          { required: true, message: "DEM不能为空", trigger: "blur" }
        ],
        basinValue4: [
          { required: true, message: "x坐标不能为空", trigger: "blur" }
        ],
        basinValue5: [
          { required: true, message: "y坐标不能为空", trigger: "blur" }
        ]
      }
    };
  },
  activated() {
    this.mapKey = Math.floor(Math.random() * 100);
  },
  created() {
    this.getProjects();
  },
  methods: {
    handleClick(command) {
      console.log(command);
      if (command == 1) {
        this.dialogtoolVisible = true;
        this.getUpdatainfo(2);
        this.getUpdatainfo(3);
      }
      if (command == 2) {
        this.dialogtooltwiVisible = true;

        this.getUpdatainfo(3);
      }
      if (command == 3) {
        this.dialogtoolbasinVisible = true;
        this.getUpdatainfo(3);
      }
      if (command == 4) {
        this.dialogtoolTsVisible = true;
        this.getUpdatainfo(4);
      }
    },
    dowanload(node, data) {
      let url = `${process.env.VUE_APP_BASE_API}data_manage/download?filename=${
        data.url
      }&token=adminxxxxxx`;
      downLoadRemoteFile(url, data.label);
    },

    getUpdatainfo(key) {
      getUpdata({ type: key })
        .then(res => {
          console.log(res);
          this["basin_form" + key] = res.data;
          console.log(this["basin_form" + key]);
        })
        .catch(res => {
          this.$messages({
            type: "warning",
            message: res
          });
        });
    },
    saveData() {
      tifClip({ file_shp: this.basinValue2, file_tif: this.basinValue3 })
        .then(res => {
          this.$messages({
            type: "success",
            message: "裁剪成功"
          });
          this.clipname = res.data;
          this.getProjects();
          this.dialogtoolVisible = false;
        })
        .catch(res => {
          this.$messages({
            type: "warning",
            message: res
          });
        });
    },
    caculTwi() {
      getTwi({ file: this.basinValue3 })
        .then(res => {
          this.$messages({
            type: "success",
            message: "地形指数计算成功"
          });
          console.log(res);
          this.twi = res.data;
          this.dialogtooltwiVisible = false;
          this.newDialogFormVisible = true;
          this.tableData = res.data.table_data;
          console.log(this.twi, this.twi.score, this.twi.reclassfy);
          this.$nextTick(() => {
            this.initDeviceChart(this.twi.score, this.twi.reclassfy);
          });
          this.defaultCheck.push(res.data.id);
          console.log(this.defaultCheck);
          this.getProjects();
          this.basinname.url = res.data.name;
          this.basinname.label = this.basinname.url.split(".")[0];
          this.$refs.setMaps.showGeo(this.basinname); //显示geojson数据
        })
        .catch(res => {
          this.$messages({
            type: "warning",
            message: res
          });
        });
    },
    basinDivide() {
      getBasin({
        file: this.basinValue3,
        x: this.basinValue4,
        y: this.basinValue5
      })
        .then(res => {
          this.$messages({
            type: "success",
            message: "流域提取成功"
          });
          this.dialogtoolbasinVisible = false;
          this.defaultCheck.push(res.data.id);
          console.log(this.defaultCheck);
          this.getProjects();
          this.basinname.url = res.data.name;
          this.basinname.label = this.basinname.url.split(".")[0];
          this.$refs.setMaps.showGeo(this.basinname);
        })
        .catch(res => {
          this.$messages({
            type: "warning",
            message: res
          });
        });
    },
    downLoadtwi() {
      Axios({
        url:
          process.env.VUE_APP_BASE_API +
          "data_manage/export_twi?token=" +
          getToken(),
        method: "post",
        responseType: "blob",
        data: { data: this.tableData }
      }).then(({ data, headers }) => {
        console.log(data);
        this.saveAs(data, "地形指数");
      });
    },
    downLoadpa() {
      Axios({
        url:
          process.env.VUE_APP_BASE_API +
          "data_manage/export_pa?token=" +
          getToken(),
        method: "post",
        responseType: "blob",
        data: { data: this.tableData.data_out }
      }).then(({ data, headers }) => {
        console.log(data);
        this.saveAs(data, "面雨量");
      });
    },
    viewpa() {
      dataViews({ data: this.tableData.merged_gdf })
        .then(res => {
          // this.TsDialogFormVisible = false;
          this.$refs.setMaps.getGshowGeo(res.data);
          this.$messages({
            type: "success",
            message: "处理成功"
          });
        })
        .catch(() => {
          this.$messages({
            type: "warning",
            message: res
          });
        });
    },

    saveAs(blob, filename) {
      let link = document.createElement("a");
      let body = document.querySelector("body");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${filename}.csv`;
      link.style.display = "none";
      body.appendChild(link);
      link.click();
      body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    },
    initDeviceChart(xdata, data) {
      this.myChart = echarts.init(document.getElementById("newEcharts"));
      {
        this.myChart.setOption({
          title: {
            left: "center",
            top: "5%"
          },
          toolbox: {
            show: true,
            feature: {
              dataView: { show: true },
              restore: { show: true },
              saveAsImage: {
                pixelRatio: 50
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

          dataZoom: [
            {
              show: false, //不显示最下方轴
              realtime: true
            },
            {
              type: "inside",
              realtime: true
            }
          ],
          xAxis: [
            {
              name: "地形指数值",
              nameLocation: "center",
              nameTextStyle: {
                color: "rgb(0,0,0)",
                fontSize: 14,
                padding: [10, 0, 0, 0]
              },
              type: "category",
              boundaryGap: true,
              axisLabel: {
                textStyle: {
                  color: "rgb(0,0,0)"
                }
              },
              color: "rgb(0,0,0)",
              axisLine: { onZero: false },
              data: xdata
            }
          ],
          yAxis: [
            {
              name: "面积比",
              nameLocation: "center",
              nameTextStyle: {
                color: "rgb(0,0,0)",
                fontSize: 14,
                padding: [0, 0, 10, 0]
              },
              type: "value",
              axisLabel: {
                textStyle: {
                  color: "rgb(0,0,0)"
                }
              },
              color: "rgb(0,0,0)"
            }
          ],
          series: [
            {
              name: "占比",
              // symbol: "none", //去掉圆点
              type: "line",
              color: "rgb(0,0,0)",
              lineStyle: {
                width: 2
              },
              data: data
            }
          ]
        });
      }
    },

    toggleSideBar() {
      this.opened = !this.opened;
      this.$refs.setMaps.invalidate();
    },
    config(node) {
      this.colorForm = {
        out: node.data.outColor || "rgba(255, 69, 0, 1)",
        in: node.data.inColor || "rgba(255, 120, 0, 0.6)"
      };
      this.dialogConfigVisible = true;
      this.curNode = node.data;
    },
    updateConfig() {
      let list = this.part[this.curNode.pid].children;
      console.log(list);
      console.log(list);
      this.part[this.curNode.pid].children.map(v => {
        if (v.id == this.curNode.id) {
          v.outColor = this.colorForm.out;
          v.inColor = this.colorForm.in;
          this.$refs.setMaps.showGeo(v);
          this.$refs.eltree.setChecked(this.curNode, true);
        }
      });
      this.dialogConfigVisible = false;
    },
    handleTree(node, { checkedNodes }) {
      this.updataCheck(node, checkedNodes);
    },
    updataCheck(data, arrs) {
      if (data.children) {
        for (let i = 0; i < data.children.length; i++) {
          this.updataCheck(data.children[i], arrs);
        }
      } else {
        if (arrs.indexOf(arrs.filter(val => val.id == data.id)[0]) != -1) {
          let suffix = data.url.split(".")[1];
          console.log(suffix);
          if (suffix == "zip" || suffix == "geojson") {
            this.$refs.setMaps.showGeo(data);
          } else {
            this.$refs.setMaps.showTif(data);
          }
        } else {
          this.$refs.setMaps.clearLayer(data);
        }
      }
    },
    getFiles(data) {
      this.dataForm.url = data[0].url;
      this.dataForm.name = data[0].name.split(".")[0];
    },
    getFiles1(data) {
      this.dataForm.url1 = data[0].url;
      this.dataForm.name1 = data[0].name.split(".")[0];
    },
    getProjects() {
      this.part = [
        { id: "t0000", label: "点", children: [] },
        { id: "t0001", label: "线", children: [] },
        { id: "t0002", label: "面", children: [] },
        { id: "t0003", label: "栅格", children: [] }
      ];

      fileTree().then(({ data }) => {
        if (data.length > 0) {
          console.log(this.part);
          this.openPanel = false;
          data.map(v => {
            this.part[v.type].children.push({
              id: v.id,
              pid: v.type,
              label: v.dataname.split(".")[0],
              url: v.dataname,
              suffix: v.dataname.split(".")[1],
              outColor: "rgba(255, 69, 0, 1)",
              inColor: "rgba(255, 120, 0, 0.6)"
            });
          });
          this.$nextTick(() => {
            this.openPanel = true;
          });
        }
      });
    },
    resetForm() {
      this.dataForm = {
        id: "",
        pidx: "",
        name: "",
        url: "",
        name1: "",
        url1: ""
      };
    },
    refresh() {
      this.resetForm();
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          saveFile({ type: this.dataForm.pidx, file: this.dataForm.url }).then(
            ({ data }) => {
              this.getProjects();
              this.dialogFormVisible = false;
            }
          );
        }
      });
    },
    updateData1() {
      analysisFile({
        shp_file: this.dataForm.url,
        excel_file: this.dataForm.url1
      }).then(({ data }) => {
        this.dialogtoolTsVisible = false;

        this.tableData = data;

        this.TsDialogFormVisible = true;
        this.tstableData = data.temp_res;
      });
    },
    // updateData11() {
    //   analysisFile({
    //     shp_file: this.dataForm.url,
    //     excel_file: this.dataForm.url1
    //   }).then(({ data }) => {
    //     this.dialogtoolTsVisible = false;
    //     this.tableData = data;

    //     if (idtype == 0) {
    //       this.TsDialogFormVisible = true;
    //       this.tstableData = data.temp_res;
    //     } else {
    //       this.TsDialogFormVisible = false;
    //       this.$refs.setMaps.getGshowGeo(data.merged_gdf);
    //     }

    //     // this.getProjects();
    //   });
    //   // this.$refs["dataForm"].validate(valid => {
    //   //   if (valid) {
    //   //   }
    //   // });
    // },

    remove(node, data) {
      this.$confirms("确定删除吗?", "删除操作", {
        confirmsButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "confirmsTop"
      })
        .then(() => {
          delFile({ id: data.id }).then(({ data }) => {
            this.$messages({
              type: "success",
              message: "删除成功"
            });
            this.getProjects();
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
p {
  margin: 0;
  padding: 0;
}
.dashboard-container {
  margin: 15px;
}
.flexMain {
  width: calc(100% - 270px);
}
.flexMainFull {
  width: 100%;
}
.flexPartFull {
  width: 0;
  margin-right: 0;
}
.flexDashboard {
  width: 40px;
  margin-right: 0;
}
.flexRole {
  width: 285px;
  margin-right: 15px;
}
.flexMainRole {
  width: calc(100% - 300px);
}
.card-tree {
  height: calc(100vh - 145px);
  background: #fff;
  border-radius: 4px;
  padding: 15px 10px;
  overflow-y: auto;
  .card-tree-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    margin: 0 0 16px 0;
    .title {
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 0px;
      display: flex;
      align-items: center;
      justify-content: center;
      .icon {
        width: 24px;
        height: 24px;
        border-radius: 12px;
        background: #2482ed;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 8px 0 0;
        img {
          width: 16px;
          height: 16px;
        }
      }
      .name {
        font-size: 16px;
        font-weight: 300;
        color: #2482ed;
        margin: 0 0 0 4px;
        width: 102px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .card-tree-btn {
      display: flex;
      align-items: center;
      .refresh {
        font-size: 18px;
        color: #2482ed;
        cursor: pointer;
      }
    }
    .hamburger-container {
      line-height: 28px;
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background 0.3s;
      -webkit-tap-highlight-color: transparent;
      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }
  }
}
.dash-tree {
  height: calc(100vh - 175px);
  overflow-y: auto;
  .curSelectedNode .node_name {
    color: #2482ed !important;
    background: #f2f4fa !important;
  }
}
.custom-tree-node {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
::v-deep .el-upload-list__item {
  transition: none !important;
}
.tree-nowrap {
  display: block;
  width: 110px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.my-button {
  color: white;
  float: right;
  margin-bottom: 5px;
}
// .shp_upload {
//   font-size: 18px;
//   font-weight: 700;
//   letter-spacing: 0px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// }
</style>
