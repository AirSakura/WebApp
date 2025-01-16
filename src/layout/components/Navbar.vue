<template>
  <div class="navbar">
    <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" /> -->
    <logo :collapse="false" />

    <top-nav id="topmenu-container" class="topmenu-container" />

    <div class="right-menu">
      <!-- <screenfull id="screenfull" class="right-menu-item hover-effect" /> -->

      <!-- <search id="header-search" class="right-menu-search" /> -->

      <span class="cname">您好！{{ nickname }}</span>
      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <img
            fit="fit"
            v-if="image_url != ''"
            :src="image_url"
            class="user-avatar"
            alt=""
          />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <!-- <router-link to="/setting/profile">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link> -->

          <el-dropdown-item divided>
            <div @click="goSys">系统配置</div>
          </el-dropdown-item>

          <el-dropdown-item divided>
            <span style="display: block" @click="logout">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      title="修改密码"
      width="400px"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        :inline="true"
        status-icon
        label-position="left"
        label-width="100px"
        style="margin-left: 20px"
      >
        <el-form-item label="旧密码" prop="old_pwd">
          <el-input v-model="dataForm.old_pwd" type="text" />
        </el-form-item>
        <el-form-item label="新密码" prop="userpwd">
          <el-input v-model="dataForm.userpwd" type="text" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="change">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      title="资料修改"
      width="450px"
      :visible.sync="dialogFormVisible_"
    >
      <el-form
        ref="userForm"
        :model="userForm"
        :inline="true"
        status-icon
        label-position="left"
        label-width="100px"
        style="margin-left: 20px"
      >
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="userForm.nickname" type="text" />
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="userForm.phone" type="text" />
        </el-form-item>

        <el-form-item label="用户头像">
          <span style="color: red">只能上传image/jpeg/png文件，且不超过1M</span>
          <el-upload
            class="avatar-uploader"
            v-loading="loading"
            :action="uploadPath()"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="image_url" :src="image_url" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible_ = false">取消</el-button>
        <el-button type="primary" @click="handleuser">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import TopNav from "@/components/TopNav";
import Logo from "./Sidebar/Logo";
import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";
import Search from "@/components/HeaderSearch";
import { getToken } from "@/utils/auth";
import { editself } from "@/api/user";
import axios from "axios";
export default {
  components: {
    Breadcrumb,
    Screenfull,
    SizeSelect,
    Logo,
    Search,
    TopNav
  },
  data() {
    return {
      dialogFormVisible: false,
      // headerImgUrl: require('@/assets/images/header.png'),
      headerlogo: require("@/assets/images/header-logo.png"),
      image_url: "",
      nickname: "",
      loading: false,
      userForm: {
        id: "",
        nickname: "",
        username: "",
        phone: "",
        headimg: ""
      },
      dataForm: {
        userid: "",
        username: "",
        old_pwd: "",
        userpwd: ""
      },
      dialogFormVisible_: false,
      rules: {
        userpwd: [
          {
            required: true,
            message: "新密码不能为空",
            trigger: "blur"
          }
        ],
        old_pwd: [
          {
            required: true,
            message: "旧密码不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    this.$nextTick(() => {
      let img = eval(this.user.headimg) || [];
      if (img && img.length > 0) {
        this.image_url = this.getImage(img[0].url);
      } else {
        this.image_url = require("@/assets/images/header.png");
      }
      this.nickname = this.user.nickname;
    });
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "device", "user"]),
    headers() {
      return {
        token: getToken()
      };
    }
  },
  methods: {
    goSys() {
      this.$router.push({ path: "/setting/profile" });
      sessionStorage.setItem("topCode", "Setting");
    },
    toUrl() {
      axios
        .get(
          `${
            process.env.VUE_APP_BASE_API
          }bigdata/loginbywebtoken?token=${getToken()}`
        )
        .then(res => {
          if (res.data.status == 0) {
            const tk = res.data.data.token;
            window.open(`${process.env.VUE_APP_BASE_DP}`);
          } else {
            this.$messages.error(res.data.msg);
          }
        });
    },
    uploadPath() {
      return `${
        process.env.VUE_APP_BASE_API
      }admin/self/addheadimg?token=${getToken()}`;
    },
    getImage(name) {
      return `${
        process.env.VUE_APP_BASE_API
      }admin/headimg/download?filename=${name}&token=${getToken()}&time=${Date.parse(
        new Date()
      )}`;
    },
    async logout() {
      this.$confirm("确定注销并退出系统吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$store.dispatch("LogOut").then(() => {
          this.$router.push("/login");
        });
      });
    },

    beforeAvatarUpload(file) {},
    edituser_() {
      this.image_url = this.getImage();
      this.userForm = Object.assign({}, this.user);
      this.dialogFormVisible_ = true;
    },
    handleAvatarSuccess(res, file) {
      if (file.response.status == 0) {
        this.image_url = null;

        this.image_url = this.getImage();
        this.$messages({
          type: "success",
          message: "上传成功"
        });

        this.dataForm.headimg = file.response.data;
      } else {
        this.$messages({
          type: "warning",
          message: file.response.msg
        });
      }
    },
    handleuser() {
      var data = {
        username: this.userForm.username,
        nickname: this.userForm.nickname,
        phone: this.userForm.phone,
        headimg: this.userForm.headimg,
        id: this.userForm.id
      };
      editself(data)
        .then(() => {
          this.dialogFormVisible_ = false;
          this.$messages({
            type: "success",
            message: "更新成功"
          });
          this.nickname = this.userForm.nickname;
        })
        .catch(res => {
          this.$messages({
            type: "warning",
            message: res
          });
        });
    },
    change() {
      this.dataForm.username = this.user.username;
      this.dataForm.userid = this.user.userid;
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          editself(this.dataForm)
            .then(res => {
              this.$messages({
                type: "success",
                message: "修改密码成功"
              });
              this.dialogFormVisible = false;
            })
            .catch(res => {
              this.$messages({
                type: "warning",
                message: res
              });
            });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.header_log {
  animation: rotate 10s infinite linear;
  height: 30px;
  width: 30px;
  margin-top: 10px;
  outline: none;
}

.header_log:hover {
  border: 1px solid #0ee5ff;
  border-radius: 50%;
}

.cname {
  font-size: 14px;
  font-weight: 400;
  color: rgba(52, 53, 56, 1);
}
.topmenu-container {
  width: auto !important;
  height: 72px;
  display: flex;
  align-items: center;
  float: left;
  /deep/.el-submenu__title {
    font-size: 16px;
  }
}
/deep/ .el-tooltip__popper {
  z-index: 2009 !important;
}
/deep/ .el-menu--horizontal {
  z-index: 2009 !important;
  border: none !important;
  .el-menu-item {
    font-size: 18px;
    color: #000;
    border: none;
    .icon {
      margin: 0 4px 0 0;
    }
  }

  .el-menu-item:not(.is-disabled):hover,
  .el-menu-item:not(.is-disabled):focus {
    color: rgba(85, 122, 242, 1) !important;
    border: none;
  }
}
.navbar {
  height: 72px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    display: flex;
    align-items: center;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .right-menu-search {
      padding-right: 40px;
    }

    .avatar-container {
      margin-left: 12px;
      margin-right: 10px;
      display: flex;
      align-items: center;

      .avatar-wrapper {
        // margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          vertical-align: middle;
          border-style: none;
          //border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
