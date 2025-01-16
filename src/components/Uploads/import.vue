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
      title="请核对导入数据（时间格式示例：2022-09-01 12:30:30），确认无误后再提交！"
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
        ><el-table-column
          align="center"
          label="监测时间"
          prop="time"
          :formatter="validDatetime"
        />
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
import { submit } from "@/api/security";
import { importAddressBook } from "@/api/user";

export default {
  name: "single",
  props: {
    upload: {
      type: String,
      default: ""
    },
    device: {
      type: String,
      default: ""
    },
    size: {
      type: Number,
      default: 50
    },
    type: {
      type: String,
      default: ""
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
    // 校验日期时间格式是否符合yyyy-mm-dd hh:mm:ss
    validDatetime(row) {
      let reg = /^((\d{2}(([02468][048])|([13579][26]))[\-\/\s]?((((0?[13578])|(1[02]))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/\s]?((0?[1-9])|([1-2][0-9])))))|(\d{2}(([02468][1235679])|([13579][01345789]))[\-\/\s]?((((0?[13578])|(1[02]))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/\s]?((0?[1-9])|(1[0-9])|(2[0-8]))))))(\s((([0-1][0-9])|(2?[0-3]))\:([0-5]?[0-9])((\s)|(\:([0-5]?[0-9])))))?$/;
      let res = reg.test(row.time)
        ? row.time
        : "时间格式错误，请按要求填写时间";
      return res;
    },
    handleSubmit() {
      if (this.type == "address") {
        importAddressBook({
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
      } else {
        submit({
          type: this.upload,
          sensor_code: this.device,
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
      }
    },

    // 图片上传
    uploadPath() {
      if (this.type == "address") {
        return `${process.env.VUE_APP_BASE_API}${
          this.upload
        }?token=${getToken()}`;
      } else {
        return `${
          process.env.VUE_APP_BASE_API
        }analysis_data/monitor/import/file?token=${getToken()}&sensor_code=${
          this.device
        }&type=${this.upload}`;
      }
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
      if (this.type != "address") {
        if (!this.device || this.device == "") {
          this.$messages({
            type: "warning",
            message: "请先选择设备！"
          });
          return false;
        }
      }

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
