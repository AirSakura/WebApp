<template>
  <el-upload
    ref="singleUpload"
    :headers="headers"
    :action="uploadPath()"
    :on-success="handleSuccess"
    :on-error="handleError"
    :before-upload="beforeUpload"
    :on-change="isVideo ? changeVideoUpload : changeUpload"
    :file-list="fileList"
    :limit="2"
    :list-type="isImg ? 'picture' : ''"
  >
    <el-button
      type="primary"
      size="mini"
      icon="el-icon-upload"
      :loading="tmpLoading"
      >上传</el-button
    >
    <div
      slot="tip"
      class="el-upload__tip"
      style="display: inline-block; margin-left: 5px"
    >
      上传{{ size }}MB内的文件
    </div>
  </el-upload>
</template>
<script>
import { getToken } from "@/utils/auth";
export default {
  name: "single",
  props: {
    upload: {
      type: String,
      default: ""
    },
    download: {
      type: String,
      default: ""
    },
    size: {
      type: Number,
      default: 5
    },
    isVideo: {
      type: Boolean,
      default: false
    },
    isImg: {
      type: Boolean,
      default: true
    },
    suffix: {
      type: Array,
      default: () => ["png", "jpg"]
    }
  },
  data() {
    return {
      tmpLoading: false,
      fileList: []
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
    // 处理数据回填
    fileBack(n) {
      this.fileList = [];
      if (n == "") return;
      if (n && n.length > 0) {
        let imgs = JSON.parse(n);
        imgs.map(v => {
          this.fileList.push({
            name: v.name,
            code: v.url,
            url: this.getImage(v.url)
          });
        });
        this.$emit("setFile", imgs);
      }
    },
    getImage(name) {
      return `${process.env.VUE_APP_BASE_API}${
        this.download
      }?filename=${name}&token=${getToken()}`;
    },

    // 图片上传
    uploadPath() {
      return `${process.env.VUE_APP_BASE_API}${
        this.upload
      }?token=${getToken()}`;
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
      console.log(file);
      if (res.status == 0) {
        console.log(this.fileList);
        let arr = [];
        if (this.fileList.length > 0)
          this.fileList.map(v => {
            arr.push({
              name: v.name,
              size: file.size,
              url: v.response.data
            });
          });
        console.log(arr);
        this.$emit("setFile", arr);

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
    changeVideoUpload(files, fileList) {
      this.fileList = fileList.slice(-1);
      console.log(files);
      if (files.status !== "ready") return;
      const getVideoInfo = new Promise(resolve => {
        const videoElement = document.createElement("video");
        console.log(videoElement);
        videoElement.src = URL.createObjectURL(files.raw);
        videoElement.addEventListener("loadedmetadata", function() {
          resolve({
            duration: videoElement.duration,
            height: videoElement.videoHeight,
            width: videoElement.videoWidth
          });
        });
      });
      getVideoInfo.then(videoInfo => {
        this.$emit("setDuration", videoInfo.duration);
      });
    },
    // 上传之前
    beforeUpload(file) {
      this.tmpLoading = true;

      let fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1);
      if (this.suffix.indexOf(fileSuffix) == -1) {
        this.tmpLoading = false;
        this.$message.error(`上传文件只能是 ${this.suffix.join("、")} 格式`);
        // this.fileList = this.fileList.slice(-1);
        // this.$refs.singleUpload.clearFiles();
        return false;
      }

      const isLt2M = file.size / 1024 / 1024 < this.size;
      if (!isLt2M) {
        this.tmpLoading = false;
        this.$messages.error(`上传文件大小不能超过 ${this.size}MB!`);
        // this.fileList = this.fileList.slice(-1);
        // this.$refs.singleUpload.clearFiles();
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
