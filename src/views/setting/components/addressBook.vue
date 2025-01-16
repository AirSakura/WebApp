<template>
  <div>
    <!-- 查询和其他操作 -->
    <div class="filter-bar">
      <p class="filter-line">
        <span class="title">姓名</span>
        <span>
          <el-input
            v-model="listQuery.keywords"
            placeholder="请输入"
            clearable
            size="small"
          />
        </span>
      </p>

      <p class="filter-line">
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          round
          @click="handleFilter"
          >查找</el-button
        >
      </p>

      <p class="filter-line">
        <el-button
          v-permission="['address_book_add:POST']"
          icon="el-icon-edit"
          size="mini"
          round
          type="success"
          @click="handleCreate"
          >新增</el-button
        >
      </p>

      <p class="filter-line">
        <el-button
          v-permission="['admin_user_template:GET']"
          round
          size="small"
          type="primary"
          icon="el-icon-download"
          @click="openLoadTemp"
        >
          下载模板
        </el-button>
      </p>
      <p class="filter-line">
        <dataImport
          v-permission="['admin_user_import_data:POST']"
          upload="address_book/import/file"
          type="address"
          :device="listQuery.sensor_code"
          @overImport="handleFilter"
        >
          <template slot="dataTable">
            <el-table-column align="center" label="联系人" prop="nickname" />
            <el-table-column align="center" label="所属单位" prop="partname" />
            <el-table-column align="center" label="联系方式" prop="phone" />
          </template>
        </dataImport>
        <!-- <el-upload
          v-permission="['admin_user_import_data:POST']"
          :headers="headers"
          :action="uploadPathLoad()"
          :show-file-list="false"
          :on-success="handleExcelSuccess"
          :on-error="handleExcelerror"
          :before-upload="beforeExcelUpload"
        >
          <el-button
            type="primary"
            round
            size="small"
            icon="el-icon-upload"
            :loading="tmpLoading"
            >批量导入</el-button
          >
        </el-upload> -->
      </p>
      <p class="filter-line">
        <el-button
          v-permission="['admin_user_template:GET']"
          round
          size="small"
          type="primary"
          icon="el-icon-download"
          @click="openLoadData"
        >
          批量导出
        </el-button>
      </p>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="正在查询中。。。"
      border
      fit
      stripe
      highlight-current-row
      :tree-props="{ children: 'children' }"
    >
      <el-table-column align="center" label="联系人" prop="nickname" />
      <el-table-column align="center" label="所属单位" prop="partname" />
      <el-table-column align="center" label="联系方式" prop="phone" />
      <el-table-column align="center" label="创建时间" prop="createtime" />
      <el-table-column
        align="center"
        class-name="small-padding"
        label="操作"
        width="200px"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.biao == '通讯'"
            v-permission="['address_book_edit:POST']"
            type="primary"
            size="mini"
            icon="el-icon-setting"
            @click="handleUpdate(scope.row)"
            >修改</el-button
          >
          <el-button
            v-if="scope.row.biao == '通讯'"
            v-permission="['address_book_delete:GET']"
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
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

    <!-- 添加或修改对话框 -->
    <el-dialog
      ref="dialog"
      :close-on-click-modal="false"
      :title="textMap[dialogStatus]"
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
            <el-form-item label="联系人" prop="nickname">
              <el-input v-model="dataForm.nickname" placeholder="填写联系人" />
            </el-form-item>
            <el-form-item label="所属单位" prop="partname">
              <el-input
                v-model="dataForm.partname"
                placeholder="填写所属单位"
              />
            </el-form-item>
            <el-form-item label="联系方式" prop="phone">
              <el-input v-model="dataForm.phone" placeholder="填写联系方式" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="dataForm.remark" placeholder="填写备注" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          v-if="dialogStatus == 'create'"
          type="primary"
          @click="createData"
          >确定</el-button
        >
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listAddressBook,
  addAddressBook,
  editAddressBook,
  delAddressBook
} from "@/api/user";
import { parseTime } from "@/utils";
import { getToken } from "@/utils/auth";
import dataImport from "@/components/Uploads/import";
export default {
  name: "addressBook",
  components: {
    dataImport
  },
  data() {
    return {
      Height: 0,
      isHeight: false,
      clientHeight: 0,
      list: [], // 列表
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        keywords: ""
      },
      dataForm: {},
      dialogFormVisible: false,
      dialog: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "添加"
      },
      rules: {},
      tmpLoading: false
    };
  },
  computed: {
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
    }
  },
  created() {
    this.getList();
  },
  mounted() {
    this.clientHeight = document.body.clientHeight - 205;
    this.$refs.dialog.rendered = true;
  },
  methods: {
    sub(n) {
      this.getList();
    },
    // 批量导入
    uploadPathLoad() {
      return `${
        process.env.VUE_APP_BASE_API
      }address_book/import/file?token=${getToken()}`;
    },
    // 上传失败的消息
    handleExcelerror(err) {
      this.$messages.error(err);
      this.tmpLoading = false;
    },
    // 上传成功的消息
    handleExcelSuccess(res, file) {
      this.$message({
        message: `成功`,
        type: "success"
      });

      this.tmpLoading = false;
      this.getList();
    },
    // 上传文件
    beforeExcelUpload(file) {
      this.tmpLoading = true;
      var filename = file.name.split(".");
      if (filename && filename.length > 0) {
        const isType = filename[1] === "xls" || filename[1] === "xlsx";
        const isLt2M = file.size / 1024 / 1024 < 5;
        if (!isType) {
          this.$messages.error("上传文件后缀必须是xls或xlsx!");
          this.tmpLoading = false;
          return false;
        }
        if (!isLt2M) {
          this.$messages.error("上传文件大小不能超过 5MB!");
          this.tmpLoading = false;
          return false;
        }
        return isType && isLt2M;
      } else {
        return false;
      }
    },
    // 打开下载模板弹窗
    openLoadTemp() {
      window.location.href = `${
        process.env.VUE_APP_BASE_API
      }address_book/template?token=${getToken()}`;
    },
    // 批量导出
    openLoadData() {
      window.location.href = `${
        process.env.VUE_APP_BASE_API
      }address_book/list/export?token=${getToken()}`;
    },
    getList() {
      this.listLoading = true;
      listAddressBook(this.listQuery)
        .then(res => {
          this.list = res.data.data;
          this.total = res.data.total;
          this.listLoading = false;
          this.HandleHeight();
        })
        .catch(res => {
          this.$messages({
            type: "warning",
            message: res
          });
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        });
    },
    // 高度计算
    HandleHeight() {
      this.$nextTick(() => {
        this.Height = this.clientHeight;
        this.isHeight = true;
        var tableHeight = 0;
        setTimeout(() => {
          tableHeight = document.querySelector(".el-table").offsetHeight + 160;
          if (tableHeight > this.clientHeight) {
            this.Height = tableHeight;
          } else {
            this.Height = this.clientHeight;
          }
        }, 200);
      });
    },

    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },

    resetForm() {
      this.dataForm = {
        id: "",
        nickname: "",
        partname: "",
        phone: "",
        remark: ""
      };
    },

    handleCreate() {
      this.resetForm();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          addAddressBook(this.dataForm).then(res => {
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
    handleUpdate(row) {
      this.resetForm();
      this.dataForm = this.assignObj(this.dataForm, row);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          editAddressBook(this.dataForm)
            .then(res => {
              this.getList();
              this.dialogFormVisible = false;
              this.$messages({
                type: "success",
                message: "修改成功"
              });
            })
            .catch(res => {
              this.$messages({
                type: "warning",
                message: "修改失败"
              });
            });
        }
      });
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
          delAddressBook(data)
            .then(res => {
              this.$messages({
                type: "success",
                message: "删除成功"
              });
              this.getList();
            })
            .catch(res => {});
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
<style lang="scss" scoped></style>
