<template>
  <div class="app-container">
    <div style="display: flex">
      <div
        :class="opened ? 'flexMapPart' : 'flexMapPartFull'"
        style="transition: width .28s;"
      >
        <div class="filter-bar" style="position: relative;">
          <p class="filter-line">
            <el-button
              v-permission="['warehouse_add:POST']"
              icon="el-icon-edit"
              class="fr"
              round
              type="success"
              size="small"
              @click="handleCreate(0)"
              >参数配置</el-button
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
              >导出结果</el-button
            >
          </p>
        </div>
        <div class="table-container" style="min-height: 300px">
          <el-table
            :data="allList"
            v-loading="listLoading"
            :row-style="{ height: '15px' }"
            :cell-style="{ padding: '0px' }"
            height="300"
            style="
        width: 100%;
        margin: 15px 0 30px; 
      "
            element-loading-text="正在查询中。。。"
            border
            fit
            highlight-current-row
          >
            <el-table-column fixed align="center" label="时间" prop="time" />
            <el-table-column fixed align="center" label="降雨(mm)" prop="p" />
            <el-table-column
              fixed
              align="center"
              label="实测流量(m³/s)"
              prop="obs"
            />
            <el-table-column
              fixed
              align="center"
              label="模拟流量(m³/s)"
              prop="sim"
            />
          </el-table>
        </div>

        <div id="container" style="min-width: 250px; height: 350px"></div>
      </div>
      <div :class="opened ? 'flexMapMainFull' : 'flexMapMain'">
        <Scopemap
          v-if="opened"
          ref="warehouseList"
          size="calc(100vh - 115px)"
        />
      </div>
    </div>

    <!-- 编辑表单 -->
    <el-dialog
      ref="dialog"
      :close-on-click-modal="false"
      :title="textMap[dialogStatus]"
      width="960px"
      top="8vh"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :inline="true"
        :model="dataForm"
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="训练期" prop="train">
          <el-input
            class="input-unit"
            v-model.trim="dataForm.train"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="输入变量层数" prop="fea_num">
          <el-input
            class="input-unit"
            v-model.trim="dataForm.fea_num"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="训练次数" prop="epochs">
          <el-input
            class="input-unit"
            v-model.trim="dataForm.epochs"
            placeholder="请输入"
          />
        </el-form-item>

        <div class="clearfix"></div>
        <el-form-item label="附件">
          <MultipleUpload
            v-if="dialogFormVisible"
            ref="imglist"
            upload="warehouse/upload"
            download="warehouse/download"
            @setFile="getImgs"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button round @click="onClose">取消</el-button>
        <el-button type="primary" round @click="updateData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
//:style{ 'min-height': clientHeight + 'px' }

<script>
import Axios from "axios";
import { lstmCnn } from "@/api/hydromodel/lstm";
import Hamburg from "@/components/Hamburger";
import Latlng from "@/components/Maps/components/latlng";
import Location from "@/components/Maps/components/location";
import Scopemap from "@/components/Maps/scopemap";
import Treesite from "@/components/ZtreePart/part.vue";
import MultipleUpload from "@/components/Uploads/multiple";
import { getToken } from "@/utils/auth";
import store from "@/store";
import * as echarts from "echarts";
export default {
  name: "reservoirBase",
  components: {
    Hamburg,
    Latlng,
    Location,
    Treesite,
    Scopemap,
    MultipleUpload
  },
  data() {
    return {
      tmpLoading: false,
      opened: false,
      Height: 0,
      isHeight: false,
      islatlng: false,
      activeCheck: "base",
      clientHeight: 0,
      dialogMap: false,
      dictionary: [],
      imgload: false,
      fileList: [],
      srcList: [],
      textMap: {
        update: "编辑仓库",
        create: "添加仓库"
      },
      warehouseStatus: [
        { name: "可用", value: 0 },
        { name: "不可用", value: 1 }
      ],
      approved: "",
      total: 0,
      listLoading: false,
      list: [], // 列表
      dataForm: {},
      dialogFormVisible: false,
      dialogCheck: false,
      dialogStatus: "",
      allList: [],
      dataList: [],
      rules: {
        name: [
          { required: true, message: "仓库名称不能为空", trigger: "blur" }
        ],
        x: [{ required: true, message: "坐标信息不能为空", trigger: "blur" }],
        y: [{ required: true, message: "坐标信息不能为空", trigger: "blur" }],
        attachfiles: [
          { required: true, message: "仓库图片不能为空", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    headers() {
      return {
        token: getToken()
      };
    }
  },

  created() {
    this.resetForm();
  },
  mounted() {
    this.clientHeight = document.body.clientHeight - 205;

    window.onresize = () => {
      this.myChart && this.myChart.resize();
    };
  },
  methods: {
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
    toggleSideBar() {
      this.opened = !this.opened;
      this.$nextTick(() => {
        if (this.opened && this.allList.length > 0) {
          this.$refs.warehouseList.invalidate();
          this.$refs.warehouseList.initReservoir(this.allList);
        }
      });
    },
    // 导出数据
    handleExport() {
      Axios({
        url: `${
          process.env.VUE_APP_BASE_API
        }gr4j/list/export?token=${getToken()}`,
        method: "post",
        header: {
          "Content-Type": "application/json" //规定传递的参数格式为json
        },
        data: { data: this.allList },
        responseType: "blob"
      }).then(({ data }) => {
        this.saveAs(data, "LSTM模型数据导出");
      });
    },

    resetForm() {
      this.dataForm = {
        file: "",
        train: "",
        fea_num: "",
        epochs: ""
      };
    },
    getImage(name) {
      return `${
        process.env.VUE_APP_BASE_API
      }warehouse/download?filename=${name}&token=${getToken()}`;
    },

    getImgs(data) {
      console.log(data);
      this.dataForm.attachfiles = data;
    },

    onClose() {
      this.$refs.imglist.clearFiles();
      this.dialogFormVisible = false;
    },

    handleCreate() {
      this.resetForm();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.islatlng = false;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    updateData() {
      console.log(this.dataForm);
      lstmCnn(this.dataForm)
        .then(res => {
          console.log(res);
          this.$messages({
            type: "success",
            message: "模型运行结束"
          });
          this.tmpLoading = false;
          this.dataList = res.data;
          this.allList = res.data.data;
          console.log(this.allList);
          console.log(this.dataList);
          this.onClose();
          this.$nextTick(() => {
            this.initchart();
          });
        })
        .catch(res => {
          this.$messages({
            type: "warning",
            message: res
          });
          console.log(res.data);
        });
    },
    initchart() {
      this.myChart = echarts.init(document.getElementById("container"));
      let time_arr = [],
        p = [],
        obs_f = [],
        sim_f = [];
      console.log(this.dataList.NSE);
      //   this.dataList.forEach(item => {
      this.dataList.data.forEach(item => {
        time_arr.push(item.time);
        obs_f.push(item.obs);
        sim_f.push(item.sim);
        p.push(item.p);
      });
      // time_arr = this.dataList.time;
      // p = this.dataList.p;
      // obs_f = this.dataList.obs;
      // sim_f = this.dataList.sim;
      //   });
      let data1 = eval(obs_f), //实测流量
        data2 = time_arr,
        data3 = eval(p), //降雨
        data4 = eval(sim_f); //m模拟流量
      console.log(data3);
      // 获取最大值方法
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
      let num1 = calMax(data1)[0];
      let num2 = calMax1(data3)[0];

      this.myChart.setOption({
        title: {
          text: "Rainfall and Flow Relationship",
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
          data: ["Obs_Flow", "Sim_Flow", "Rainfall"],
          top: "5%",
          color: "rgb(0,0,0)",
          left: "15%",
          padding: [5, 5, 5, 5] //图例框
        },
        dataZoom: [
          {
            show: true,
            realtime: true
            // start: 65,
            // end: 85,
          },
          {
            type: "inside",
            realtime: true
            // start: 65,
            // end: 85,
          }
        ],
        xAxis: [
          {
            type: "category",
            boundaryGap: true,
            axisLabel: {
              textStyle: {
                color: "rgb(0,0,0)"
              }
            },
            color: "rgb(0,0,0)",
            axisLine: { onZero: false },
            // prettier-ignore
            data: data2
          }
        ],
        yAxis: [
          {
            name: "Flow(m³/s)",
            nameTextStyle: {
              color: "rgb(0,0,0)",
              fontSize: 12
            },
            type: "value",
            min: 0,
            max: num1,
            axisLabel: {
              textStyle: {
                color: "rgb(0,0,0)"
              }
            },
            color: "rgb(0,0,0)",
            // splitNumber: 6, //设置坐标轴的分割段数
            interval: 100 // 标轴分割间隔
          },

          {
            name: "Rainfall(mm)",
            nameTextStyle: {
              color: "rgb(0,0,0)",
              fontSize: 12
            },
            nameLocation: "start",
            color: "rgb(0,0,0)",
            // min: 0,
            // max: num2,
            axisLabel: {
              textStyle: {
                color: "rgb(0,0,0)"
              }
            },
            // splitNumber: 8, //设置坐标轴的分割段数
            // interval: 10, // 标轴分割间隔
            alignTicks: true,
            type: "value",
            inverse: true
          }
        ],
        series: [
          {
            name: "Obs_Flow",
            symbol: "none", //去掉圆点
            type: "line",
            color: "rgb(30,144,255)",
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

            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1.1, [
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
            data: data1
          },
          {
            name: "Sim_Flow",
            symbol: "none", //去掉圆点
            type: "line",
            color: "rgb(0,255,0)",
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

            data: data4
          },
          {
            name: "Rainfall",
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
            data: data3
          }
        ]
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.flexMapPart {
  width: 900px;
  margin-right: 20px;
}
.flexMapPartFull {
  width: 100%;
}
.flexMapMain {
  width: 0;
}
.flexMapMainFull {
  width: calc(100% - 900px);
}
.hamburger-map {
  position: absolute;
  right: 5px;
  top: 20px;
}
</style>
