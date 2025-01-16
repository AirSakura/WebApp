<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <!-- <el-input
        v-model="listQuery.imei"
        v-permission="['map_querylayers:GET']"
        clearable
        class="filter-item"
        style="width: 200px"
        placeholder="请输入设备编号"
        @keyup.enter.native="handleFilter"
      /> -->

      <!-- <el-button
        v-permission="['map_querylayers:GET']"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查找</el-button> -->
      <el-button
        v-permission="['map_addlayer:GET']"
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
        >添加</el-button
      >
    </div>
    <!-- 查询结果 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="正在查询中。。。"
      border
      fit
      stripe
      highlight-current-row
    >
      <el-table-column align="center" label="文件" prop="filename" />
      <el-table-column width="120" label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            v-permission="['map_editlayer:GET']"
            type="text"
            size="medium"
            @click="handleDown(scope.row)"
            icon="el-icon-view"
            >下载</el-button
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
      width="700px"
      top="5vh"
      :close-on-click-modal="false"
      title="上传文件"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :inline="false"
        :model="dataForm"
        status-icon
        label-position="left"
        label-width="120px"
      >
        <el-upload
          class="upload-demo"
          drag
          :action="uploadPathLoad()"
          :file-list="fileList"
          :show-file-list="true"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :before-upload="beforeUpload"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传py文件</div>
        </el-upload>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关闭</el-button>
        <!-- <el-button
          v-if="dialogStatus == 'create'"
          type="primary"
          @click="createData"
        >确定</el-button> -->
        <!-- <el-button v-else type="primary" @click="updateData">确定</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { queryFileList } from "@/api/query";
import { getToken } from "@/utils/auth";
export default {
  name: "Layer",
  data() {
    return {
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20
      },
      dataForm: {},
      fileList: [],
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "添加"
      }
    };
  },
  created() {
    // this.getList()
    this.handleFilter();
  },
  methods: {
    getList() {
      this.listLoading = true;
      queryFileList(this.listQuery)
        .then(res => {
          this.list = res.data;
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
    resetForm() {
      this.fileList = [];
    },
    uploadPathLoad() {
      return `${process.env.VUE_APP_BASE_API}device/upfile?token=${getToken()}`;
    },
    handleRemove(file) {},
    beforeUpload(file) {
      // this.fileList = [];
    },
    handleSuccess(res, file) {
      console.log(res);
      let that = this;
      if (res.success) {
        that.fileList.push(res.data);
        this.$messages({
          type: "success",
          message: "上传成功"
        });
      } else {
        that.fileList = [];
        this.$messages({
          type: "warn",
          message: res.msg
        });
      }
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
          addlayer(this.dataForm)
            .then(res => {
              this.getList();
              this.dialogFormVisible = false;
              this.$messages({
                type: "success",
                message: "添加成功"
              });
            })
            .catch(res => {});
        }
      });
    },
    handleDown(row) {
      let url = `${
        process.env.VUE_APP_BASE_API
      }device/download/file?token=${getToken()}&file_name=${row.filename}`;
      window.open(url);
    },
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          editlayer(this.dataForm)
            .then(() => {
              this.getList();
              this.dialogFormVisible = false;
              this.$messages({
                type: "success",
                message: "更新成功"
              });
            })
            .catch(res => {});
        }
      });
    },
    handleDelete(row) {
      const delPara = { layerid: row.layerid };
      this.$confirms("确定删除吗?", "删除操作", {
        confirmsButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "confirmsTop"
      })
        .then(() => {
          deletelayer(delPara).then(() => {
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
<style>
.el-upload-dragger {
  width: 100%;
}

.el-upload__tip {
  color: red;
}
</style>
