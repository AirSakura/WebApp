<template>
  <div class="app-container" style="margin-top: 30px">
    <main id="pjax-container">
      <div class="container">
        <el-card
          class="box-card"
          style="
              width: 100%;
              height: 200px;
              text-align: start;
              margin-bottom: 45px;
            "
        >
          <div class="flexMain">
            <div class="filter-bar">
              <p class="filter-line">
                <span class="title">关键字</span>
                <span>
                  <el-input
                    v-model="listQuery.keywords"
                    clearable
                    class="filter-item"
                    style="width: 170px"
                    size="small"
                    placeholder="请输入名称"
                    @keyup.enter.native="handleFilter"
                  />
                </span>
              </p>

              

              <p class="filter-line">
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  class="fr"
                  size="mini"
                  round
                  @click="handleFilter"
                  >查找</el-button
                >
              </p>

              <p class="filter-line">
                <el-button
                  v-permission="['admin_user_add:POST']"
                  icon="el-icon-edit"
                  round
                  size="mini"
                  type="success"
                  @click="handleCreate"
                  >添加</el-button
                >
              </p>

              <p class="filter-line">
                <el-button
                  v-permission="['admin_user_delete_many:POST']"
                  type="danger"
                  class="filter-item"
                  icon="el-icon-delete"
                  round
                  size="mini"
                  :disabled="multiple"
                  @click="handleDelete(null, false)"
                  >批量删除</el-button
                >
              </p>

              <p class="filter-line">
                <el-button
                  v-permission="['admin_user_template:GET']"
                  class="filter-item"
                  type="primary"
                  round
                  size="mini"
                  icon="el-icon-download"
                >
                  <a :href="handleDownload()">下载模板</a>
                </el-button>
              </p>

              <p class="filter-line">
                <el-upload
                  v-permission="['admin_user_import_data:POST']"
                  :headers="headers"
                  class="filter-item"
                  :action="uploadPathLoad()"
                  :show-file-list="false"
                  :on-success="handleExcelSuccess"
                  :on-error="handleExcelerror"
                  :before-upload="beforeExcelUpload"
                >
                  <el-button
                    type="primary"
                    icon="el-icon-upload"
                    round
                    size="mini"
                    :loading="loadLoading"
                    >批量导入</el-button
                  >
                </el-upload>
              </p>

              <p class="filter-line">
                <el-button
                  v-permission="['admin_user_template:POST']"
                  class="filter-item"
                  type="primary"
                  round
                  size="mini"
                  icon="el-icon-download"
                >
                  <a :href="handleDownloadUser()">批量导出</a>
                </el-button>
              </p>
            </div>

            <div
              class="table-container"
              :style="{ 'min-height': clientHeight + 'px' }"
            >
              <el-table
                v-loading="listLoading"
                :data="list"
                element-loading-text="正在查询中。。。"
                border
                fit
                stripe
                highlight-current-row
                :tree-props="{ children: 'children' }"
                default-expand-all
                row-key="id"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="55" align="center" />

                <el-table-column
                  align="center"
                  label="所属单位"
                  prop="partname"
                />
                <el-table-column
                  align="center"
                  label="用户名"
                  prop="username"
                />

                <el-table-column align="center" label="姓名" prop="nickname">
                  <template slot-scope="{ row }">
                    <strong>{{ row.nickname }}</strong>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="角色" prop="rolename">
                  <template slot-scope="{ row }">
                    <span>{{ row.rolename }} </span>
                  </template>
                </el-table-column>
                <!-- <el-table-column
              align="center"
              label="用户类型"
              prop="user_type_txt"
            /> -->
                <el-table-column
                  prop="user_status"
                  label="状态"
                  align="center"
                  width="100"
                >
                  <template slot-scope="{ row }">
                    <el-tag :type="row.user_status == 0 ? 'danger' : 'success'">
                      {{ row.user_status == 0 ? "不可用" : "可用" }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  label="操作"
                  class-name="small-padding"
                  width="220"
                >
                  <template slot-scope="scope">
                    <template v-if="scope.row.id == 1">
                      <el-button type="info" plain disabled size="mini"
                        >无法操作</el-button
                      >
                    </template>
                    <template v-else>
                      <template>
                        <el-button
                          v-permission="['admin_user_info:GET']"
                          type="primary"
                          size="mini"
                          @click="handleQuery(scope.row)"
                          >查看</el-button
                        >
                        <el-button
                          v-permission="['admin_user_edit:GET']"
                          type="primary"
                          size="mini"
                          @click="handleUpdate(scope.row)"
                          >编辑</el-button
                        >
                        <el-button
                          v-if="user.userid != scope.row.userid"
                          v-permission="['admin_user_delete:GET']"
                          type="danger"
                          size="mini"
                          @click="handleDelete(scope.row, true)"
                          >删除
                        </el-button>
                      </template>
                    </template>
                  </template>
                </el-table-column>
              </el-table>

              <pagination
                v-show="total > 0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.limit"
                @pagination="getList"
              />
            </div>
          </div>
          <h1>流域信息创建</h1>
          <el-row>
            <el-col :span="8" align="center">
              <div
                style="
                    margin-top: 15px;
                    margin-bottom: 5px;
                    display: flex;
                    width: 380px;
                    justify-content: space-between;
                  "
              >
                <!-- //配置参数 -->
                <el-dialog
                  ref="dialog"
                  :close-on-click-modal="false"
                  title="参数配置"
                  width="890px"
                  top="8vh"
                  class="dialog-form"
                  :visible.sync="dialogbasinVisible"
                >
                  <el-form
                    ref="dataForm"
                    :rules="rules"
                    :inline="true"
                    :model="dataForm"
                    label-position="left"
                    label-width="210px"
                  >
                    <el-form-item label="流域名称" prop="basin_name">
                      <el-input
                        class="input-unit"
                        v-model.trim="dataForm.basin_name"
                        placeholder="请输入"
                      />
                    </el-form-item>
                    <el-form-item label="备注" prop="remark">
                      <el-input
                        class="input-unit"
                        v-model.trim="dataForm.remark"
                        placeholder="请输入"
                      />
                    </el-form-item>
                  </el-form>
                  <div slot="footer" class="dialog-footer">
                    <el-button round @click="dialogbasinVisible = false"
                      >关闭</el-button
                    >
                    <el-button type="primary" round @click="basinSubmit"
                      >确定</el-button
                    >
                  </div>
                </el-dialog>
                <el-button size="primary" @click="handleBasin">新建</el-button>
                <el-button size="primary" @click="handleBasin">修改</el-button>
                <span>
                  <el-upload>
                    <el-button type="primary" icon="el-icon-upload"
                      >批量导入</el-button
                    >
                  </el-upload>
                </span>
                <el-button type="primary" icon="el-icon-s-claim"
                  >保存数据</el-button
                >
              </div>
            </el-col>
          </el-row>
        </el-card>
      </div>
      <div class="container">
        <el-card
          class="box-card"
          style="
              width: 100%;
              height: 200px;
              text-align: start;
              margin-bottom: 45px;
            "
        >
          <h1>在线潜在蒸发计算</h1>
          <el-row>
            <el-col :span="8" align="center">
              <div
                style="
                    margin-top: 15px;
                    margin-bottom: 5px;
                    display: flex;
                    width: 380px;
                    justify-content: space-between;
                  "
              >
                <el-button type="primary" icon="el-icon-download"
                  >下载模板</el-button
                >
                <span>
                  <el-upload>
                    <el-button type="primary" icon="el-icon-upload"
                      >批量导入</el-button
                    >
                  </el-upload>
                </span>
                <el-button type="primary" icon="el-icon-s-claim"
                  >保存数据</el-button
                >
              </div>
            </el-col>
          </el-row>
        </el-card>
      </div>
      <el-card
        style="border: solid #409eff; width: 1000px; height: 100%; margin: auto"
      >
        <div class="tool-desc-entry headable"></div>
      </el-card>
    </main>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import {
  basinAdd,
  basinEdit,
  basinList,
  planEdit,
  basinDelete,
  stationAdd,
  stationEdit,
  stationDataIn
} from "@/api/hydromodel/datama";
import store from "@/store";
import * as echarts from "echarts";
export default {
  name: "test",
  data() {
    return {
      list: [],
      dataForm: {},
      paramList: [],
      dialogbasinVisible: false,
      moment_url: window.location.href,
      rules: {
        basin_name: [{ required: true, message: "流域名称", trigger: "blur" }]
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
  mounted() {
    this.clientHeight = document.body.clientHeight - 205;

    window.onresize = () => {};
  },
  methods: {
    // 提交方案配置
    handleBasin() {
      this.dialogbasinVisible = true;
    },
    basinSubmit() {
      let type = "add",
        urls = {
          add: basinAdd,
          edit: basinEdit
        };
      console.log(this.dataForm.id);
      if (this.dataForm.id > 0) type = "edit";
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          urls[type](this.dataForm).then(({ data }) => {
            this.$messages({
              type: "success",
              message: "添加成功"
            });
            this.dialogbasinVisible = false;
          });
        }
      });
    }
  },
  getList() {
      this.listLoading = true;
      basinList(this.listQuery)
        .then(res => {
          this.list = res.data.data;
          this.total = res.data.total;
          this.listLoading = false;
        })
        .catch(res => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        });
    },
  handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
};
</script>

<style lang="scss" scoped>
.math-block {
  display: block;
  margin: 1em auto;
  width: 40%;
}
.text {
  text-indent: 2em;
  font-family: Times New Roman;
  font-size: 16px;
  color: #000;
  //   word-spacing: 20px;//空格设置为20px
  letter-spacing: 1px; //字体间距
}
</style>
