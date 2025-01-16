<template>
  <div>
    <el-upload
      ref="singleUpload"
      :headers="headers"
      :action="uploadPath()"
      :show-file-list="false"
      :on-success="handleSuccess"
      :on-error="handleError"
      :before-upload="beforeUpload"
    >
      <el-button
        type="primary"
        icon="el-icon-upload"
        size="mini"
        round
        :loading="tmpLoading"
        >批量导入</el-button
      >
    </el-upload>

    <el-dialog
      ref="dialog"
      :close-on-click-modal="false"
      title="请核对导入数据，确认无误后再提交！"
      width="1000px"
      top="5vh"
      :visible.sync="dialogVisible"
    >
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
        <slot name="dataTable"></slot>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getToken } from "@/utils/auth";
import { importDevice } from "@/api/device/monitor";

export default {
  name: "single",
  props: {
    size: {
      type: Number,
      default: 50
    },
    suffix: {
      type: Array,
      default: () => ["xls", "xlsx", "cvs"]
    }
  },
  data() {
    return {
      dialogVisible: false,
      listLoading: false,
      tmpLoading: false,
      fileList: [],
      dataList: []
    };
  },
  computed: {
    headers() {
      return {
        token: getToken()
      };
    }
  },

  methods: {
    handleSubmit() {
      importDevice({
        partid: this.$store.state.user.currentsk,
        data: this.dataList
      })
        .then(res => {
          this.$messages({
            type: "success",
            message: "提交成功！"
          });
          this.dialogVisible = false;
          this.clearFiles();
          this.$emit("overImport");
        })
        .catch(err => {
          this.$messages({
            type: "warning",
            message: err
          });
        });
    },

    // 图片上传
    uploadPath() {
      return `${
        process.env.VUE_APP_BASE_API
      }device_sensor/import/file?token=${getToken()}`;
    },

    // 上传失败的消息
    handleError(err) {
      this.$messages.error(err);
      this.tmpLoading = false;
    },
    // 个数超出限制
    changeUpload(file, fileList) {
      let fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1);
      if (this.suffix.indexOf(fileSuffix) > -1) {
        this.fileList = fileList.slice(-1);
      }
    },

    // 上传成功的消息
    handleSuccess(res, file) {
      if (res.status == 0) {
        this.dataList = res.data;
        this.dialogVisible = true;

        this.$messages({
          type: "success",
          message: "上传成功"
        });
      } else {
        this.$refs.singleUpload.clearFiles();
        this.$messages({
          type: "warning",
          message: res.msg
        });
      }
      this.tmpLoading = false;
    },
    // 上传之前
    beforeUpload(file) {
      this.tmpLoading = true;

      let fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1);
      if (this.suffix.indexOf(fileSuffix) == -1) {
        this.tmpLoading = false;
        this.$message.error(`上传文件只能是 ${this.suffix.join("、")} 格式`);
        return false;
      }

      const isLt2M = file.size / 1024 / 1024 < this.size;
      if (!isLt2M) {
        this.tmpLoading = false;
        this.$messages.error(`上传文件大小不能超过 ${this.size}MB!`);
        return false;
      }
    },
    clearFiles() {
      this.$refs.singleUpload && this.$refs.singleUpload.clearFiles();
    }
  }
};
</script>

<style scope></style>
