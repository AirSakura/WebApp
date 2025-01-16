<template>
  <div class="dashboard-container">
    <div style="display: flex">
      <div
        :class="opened ? 'flexPart' : 'flexPartFull'"
        style="transition: width 0.28s"
      >
        <Partztree v-if="isHeight" :height="Height" />
      </div>
      <div :class="opened ? 'flexMain' : 'flexMainFull'">
        <el-card :style="{ 'min-height': clientHeight + 'px' }">
          <div ref="tableHeight" class="ztree-table">
            <!-- <div class="filter-container">
              <el-input v-model="listQuery.field_name"  clearable
                class="filter-item" style="width: 200px" placeholder="输入名称" @keyup.enter.native="handleFilter" />
              <el-select v-model="listQuery.model_class" placeholder="选择类别" class="filter-item" clearable>
                <el-option v-for="(item, index) in site" :key="index" :label="item" :value="item" />

              </el-select>
              <el-button  class="filter-item" type="primary"
                icon="el-icon-search" @click="handleFilter">查找</el-button>
              <el-button  class="filter-item" type="primary" icon="el-icon-edit"
                @click="handleCreate">添加</el-button>
            </div> -->
            <!-- <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit
              highlight-current-row 
              :tree-props="{ children: 'children' }" default-expand-all row-key="id">
              <el-table-column align="center" label="名称" prop="field_name" width="150" />

              <el-table-column align="center" label="配置信息" prop="config_info">
                <template slot-scope="scope">
                  <span>{{ escape2Html(scope.row.config_info) }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="标识符" prop="remark" width="150" />
              <el-table-column align="center" label="类别" prop="model_class" width="150" sortable />
              <el-table-column align="center" class-name="small-padding" label="操作" width="120px">
                <template slot-scope="scope">
                  <el-button  type="text" size="medium"
                    @click="handleUpdate(scope.row)">编辑</el-button>
                  <el-button  type="text" style="color: red" size="medium"
                    @click="handleDelete(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
              @pagination="getList" /> -->
            <el-card class="box-card">
              <el-descriptions title="推送配置" border>
                <template slot="extra">
                  <el-button
                    type="primary"
                    size="small"
                    @click="handleUpdate(paraData)"
                    >编辑</el-button
                  >
                </template>
                <el-descriptions-item label="频次（次）">{{
                  paraData.frequency_number
                }}</el-descriptions-item>
                <el-descriptions-item label="频率（分钟）">{{
                  paraData.frequency_time
                }}</el-descriptions-item>
                <el-descriptions-item
                  label="推送类型"
                  v-if="paraData.push_type == 1"
                  >短信推送</el-descriptions-item
                >
                <el-descriptions-item
                  label="推送类型"
                  v-if="paraData.push_type == 3"
                  >小程序推送</el-descriptions-item
                >
                <el-descriptions-item label="发送间隔（秒）">{{
                  paraData.send_min_interval
                }}</el-descriptions-item>
              </el-descriptions>
            </el-card>

            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>健康配置</span>
                <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
              </div>
              <el-table
                v-loading="listLoading"
                :data="list"
                element-loading-text="正在查询中。。。"
                border
                fit
                stripe
                highlight-current-row
                default-expand-all
                row-key="id"
              >
                <el-table-column
                  align="center"
                  label="体征类型"
                  prop="healthy_type"
                />
                <el-table-column
                  align="center"
                  label="规则名称"
                  prop="rule_name"
                />
                <el-table-column align="center" label="类型" prop="rule_type" />
                <el-table-column align="center" label="阀值" prop="threshold" />
                <el-table-column
                  align="center"
                  label="等级"
                  prop="level"
                  width="100px"
                />
                <el-table-column
                  align="center"
                  label="预警信息"
                  prop="msg"
                  width="300px"
                />
                <el-table-column
                  align="center"
                  class-name="small-padding"
                  label="是否推送"
                  width="100px"
                >
                  <template slot-scope="scope">
                    <template v-if="scope.row.sms_push == 1">
                      是
                    </template>
                    <template v-else>
                      否
                    </template>
                  </template>
                </el-table-column>

                <!-- <el-table-column align="center" label="创建人" prop="username" /> -->
                <!-- <el-table-column align="center" label="创建时间" prop="create_time" width="160px"/> -->
                <el-table-column
                  align="center"
                  class-name="small-padding"
                  label="操作"
                  width="160px"
                >
                  <template slot-scope="scope">
                    <el-button
                      v-permission="['dwsj_manage_delete:GET']"
                      type="text"
                      size="medium"
                      icon="el-icon-setting"
                      @click="handleUpdateHealth(scope.row)"
                      >修改</el-button
                    >
                    <!-- <el-button
                        v-permission="['dwsj_manage_delete:GET']"
                        type="text"
                        style="color: red"
                        size="medium"
                        icon="el-icon-delete"
                        @click="handleDeleteSapce(scope.row)"
                      >删除</el-button> -->
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </div>
        </el-card>
      </div>
    </div>
    <!-- 修改对话框 -->
    <el-dialog
      ref="dialog"
      :close-on-click-modal="false"
      title="推送配置"
      width="750px"
      top="5vh"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :inline="false"
        :model="dataForm"
        status-icon
        label-position="left"
        label-width="100px"
        class="demo-table-expand"
      >
        <el-form-item label="频次">
          <el-input
            v-model="dataForm.frequency_number"
            placeholder="上班时间"
          />
        </el-form-item>
        <el-form-item label="频率" prop="endtime">
          <el-input v-model="dataForm.frequency_time" placeholder="下班时间" />
        </el-form-item>
        <el-form-item label="推送类型">
          <el-select v-model="dataForm.push_type" placeholder="请选择类型">
            <el-option
              v-for="item in dictionary.push_type"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发送间隔">
          <el-input
            v-model="dataForm.send_min_interval"
            placeholder="填写打卡范围"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关闭</el-button>
        <el-button type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      ref="dialogrules"
      :close-on-click-modal="false"
      title="编辑"
      width="500px"
      top="5vh"
      :visible.sync="dialogFormRules"
    >
      <div style="display: flex">
        <div style="flex: 1">
          <el-form
            ref="dataFormHealth"
            :rules="rules"
            :inline="false"
            :model="dataFormHealth"
            status-icon
            label-position="left"
            label-width="100px"
          >
            <el-form-item label="所属单位" prop="partname">
              <TreeSelectPart
                ref="selztree"
                v-model="dataFormHealth.partid"
                :multiple="false"
                :width="'100%'"
                style="width: 100%"
                @treeValue="treeValue"
              />
            </el-form-item>
            <el-form-item label="规则名称">
              <el-input v-model="dataFormHealth.rule_name" />
            </el-form-item>
            <el-form-item label="体征类型">
              <el-select
                v-model="dataFormHealth.healthy_type"
                placeholder="请选择体征类型"
              >
                <el-option
                  v-for="item in dictionary.sign_type"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="规则类型">
              <el-select
                v-model="dataFormHealth.rule_type"
                placeholder="请选择规则类型"
              >
                <el-option
                  v-for="item in dictionary.healthrule_type"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="阀值设置">
              <el-input v-model="dataFormHealth.threshold" />
            </el-form-item>
            <el-form-item label="预警等级">
              <el-select
                v-model="dataFormHealth.level"
                placeholder="请选择预警等级"
              >
                <el-option
                  v-for="item in dictionary.level"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="预警信息">
              <el-input
                v-model="dataFormHealth.msg"
                type="textarea"
                :rows="2"
              />
            </el-form-item>
            <el-form-item label="是否推送">
              <el-radio v-model="dataFormHealth.sms_push" :label="0"
                >是</el-radio
              >
              <el-radio v-model="dataFormHealth.sms_push" :label="1"
                >否</el-radio
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <!-- <el-button v-if="dialogStatus == 'create'" type="primary" @click="createDataSpace">确定</el-button> -->
        <el-button type="primary" @click="updateDataRule">确定</el-button>
      </div>
    </el-dialog>
    <Query />
  </div>
</template>
<script>
import {
  querySysparam,
  addSysparam,
  queryDefaultrule,
  editDefaultrule
} from "@/api/pushconfig";

import Hamburg from "@/components/ZtreePart/Hamburger";
import store from "@/store";
import { getToken } from "@/utils/auth";
import { mapGetters } from "vuex";
export default {
  name: "",
  components: {
    Hamburg
  },
  data() {
    return {
      field: [],
      checked: true,
      Height: 0,
      isHeight: false,
      clientHeight: 0,
      opened: false,
      paraData: {},
      listLoading: true,
      list: [], // 列表
      dictionary: {},
      dataForm: {
        frequency_number: "",
        frequency_time: "",
        push_type: "",
        send_min_interval: ""
      },
      dialogFormVisible: false,
      dialog: false,
      dialogFormRules: false,
      dataFormHealth: {
        rule_name: "",
        healthy_type: "",
        partid: "",
        rule_type: "",
        threshold: "",
        level: "",
        msg: "",
        sms_push: ""
      },
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "添加"
      },
      site: []
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
  watch: {
    list: {
      handler(n) {
        this.HandleHeight();
      },
      immediate: true,
      deep: true
    },
    checked: {
      handler(n) {
        this.$emit("sub", n ? 1 : 0);
      }
    }
  },
  created() {
    this.getList();
    this.getdict();
  },
  mounted() {
    this.clientHeight = document.body.clientHeight - 100;
    this.$refs.dialog.rendered = true;
  },
  methods: {
    sub(n) {
      // this.getList()
    },
    getList() {
      querySysparam()
        .then(res => {
          if (res.success) {
            this.paraData = res.data.data[0];
            this.HandleHeight();
          } else {
            this.$messages({ type: "warning", message: res.msg });
          }
        })
        .catch(res => {
          this.$messages({ type: "warning", message: res });
        });
      queryDefaultrule()
        .then(res => {
          if (res.success) {
            this.list = res.data.data;

            // this.HandleHeight();
          } else {
            this.$messages({ type: "warning", message: res.msg });
            this.list = [];
          }
          this.listLoading = false;
        })
        .catch(res => {
          this.$messages({ type: "warning", message: res });
          this.list = [];
          this.listLoading = false;
        });
    },
    getdict() {
      store.dispatch("app/setdict").then(dict => {
        const name = ["push_type"];
        const value = ["推送方式"];
        value.forEach((item, i) => {
          this.dictionary[name[i]] = dict.filter(
            v => v.field_name == item
          )[0].config_info;
        });
        console.log(this.dictionary);
      });
    },
    treeValue(e) {},
    // 高度计算
    HandleHeight() {
      this.$nextTick(() => {
        this.Height = this.clientHeight;
        this.isHeight = true;
      });
    },
    HandlePart(id) {
      // this.listQuery.partid = id;
      // this.getList();
    },
    handleFilter() {
      this.getList();
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          addDictionary(this.dataForm).then(res => {
            this.getList();
            this.dialogFormVisible = false;
            this.$messages({
              type: "success",
              message: "添加成功"
            });
          });
        }
      });
    },
    handleUpdate(data) {
      this.dialogFormVisible = true;
      this.dialogStatus = "update";
      this.dataForm = data;
      // console.log(this.dataForm);
    },
    updateData() {
      addSysparam(this.dataForm).then(res => {
        if (res.success) {
          this.getList();
          this.dialogFormVisible = false;
          this.$messages({
            type: "success",
            message: "更新成功"
          });
        } else {
          this.$messages({
            type: "warning",
            message: res.msg
          });
        }
      });
    },

    handleUpdateHealth(row) {
      this.dialogFormRules = true;
      this.dataFormHealth = row;
    },
    updateDataRule() {
      editDefaultrule(this.dataFormHealth)
        .then(res => {
          if (res.success) {
            this.dialogFormRules = false;
            this.$messages({
              type: "success",
              message: "更新成功"
            });
          } else {
            this.$messages({
              type: "warning",
              message: res.msg
            });
          }
        })
        .catch(err => {});
    },
    handleDelete(row) {
      const data = {
        id: row.id
      };
      this.$confirms("确定删除吗?", "删除操作", {
        confirmsButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "confirmsTop"
      })
        .then(() => {
          deleteDictionary(data).then(res => {
            this.$messages({
              type: "success",
              message: "删除成功"
            });
            this.getList();
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
.ztree-table {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.box-card {
  width: 100%;
}

.clearfix {
  text-align: left;
}

.clearfix {
  font-weight: 600;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
</style>
