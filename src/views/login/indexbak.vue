<template>
  <div class="login-container">
    <div class=" login-mask"></div>
    <div class="login-wrapper">
      <div class="login-center">
        <div class="title-container">
          <h3 class="title">巡库管理系统</h3>
        </div>
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          auto-complete="on"
          label-position="left"
        >
          <el-form-item prop="user">
            <span class="input-title">您的账号</span>
            <el-input
              ref="user"
              v-model="loginForm.user"
              placeholder="请输入您的账号"
              name="user"
              type="text"
              tabindex="1"
              auto-complete="on"
            />
          </el-form-item>

          <el-tooltip
            v-model="capsTooltip"
            content="Caps lock is On"
            placement="right"
            manual
          >
            <el-form-item prop="pwd">
              <span class="input-title">您的密码</span>
              <el-input
                :key="passwordType"
                ref
                v-model="loginForm.pwd"
                :type="passwordType"
                placeholder="请输入您的密码"
                name="pwd"
                tabindex="2"
                auto-complete="on"
                @keyup.native="checkCapslock"
                @blur="capsTooltip = false"
                @keyup.enter.native="handleLogin"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon
                  :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
                />
              </span>
            </el-form-item>
          </el-tooltip>
          <el-form-item prop="user">
            <span class="input-title">验证码</span>
            <el-input
              ref="verify"
              v-model.trim="loginForm.verify"
              placeholder="请输入验证码"
              name="verify"
              type="text"
              tabindex="3"
              auto-complete="on"
              maxlength="6"
            />
            <img class="verify" :src="verifyUrl" @click="getVerify" alt="" />
          </el-form-item>

          <el-button
            tabindex="4"
            v-preventClick
            :loading="loading"
            type="primary"
            style="width: 100%;height: 55px;margin-top: 18px;"
            @click.native.prevent="handleLogin"
            >登 录</el-button
          >
        </el-form>
      </div>
    </div>

    <!-- <div class="copyright">
      <span>中软信通（宜昌）科技有限公司</span> ICP备案号: 鄂ICP备2020017223号
    </div> -->
  </div>
</template>
<script>
import { getInfo, verify } from "@/api/user";
import Axios from "axios";
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        user: "",
        pwd: "",
        verify: "",
        vt: ""
      },
      loginRules: {
        user: [{ required: true, trigger: "blur", message: "用户名不能为空" }],
        pwd: [{ required: true, trigger: "blur", message: "密码不能为空" }],
        verify: [{ required: true, trigger: "blur", message: "验证码不能为空" }]
      },
      verifyUrl: "",
      passwordType: "password",
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    this.getVerify();
  },
  mounted() {
    if (this.loginForm.user === "") {
      this.$refs.user.focus();
    } else if (this.loginForm.pwd === "") {
      this.$refs.pwd.focus();
    }
  },
  methods: {
    getVerify() {
      Axios({
        url: process.env.VUE_APP_BASE_API + "admin/self/verify/code",
        method: "get",
        responseType: "blob"
      }).then(({ data, headers }) => {
        this.verifyUrl = URL.createObjectURL(data);
        this.loginForm.vt = headers.vt;
      });
    },
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (
          (shiftKey && (key >= "a" && key <= "z")) ||
          (!shiftKey && (key >= "A" && key <= "Z"))
        ) {
          this.capsTooltip = true;
        } else {
          this.capsTooltip = false;
        }
      }
      if (key === "CapsLock" && this.capsTooltip === true) {
        this.capsTooltip = false;
      }
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    hasSk(token) {
      getInfo({ token: token }).then(({ data }) => {
        console.log(data.sk_list);
        this.loading = false;
        if (data.sk_list && data.sk_list.length > 0) {
          this.$router.push({ path: this.redirect || "/" });
        } else {
          this.$router.push({ path: "/setting/part" });
        }
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("Login", this.loginForm)
            .then(() => {
              this.hasSk();
            })
            .catch(res => {
              // this.$messages.error(res)
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss">
$bg: #fff;
$light_gray: #fff;
$cursor: #666;
$dark_gray: #889aa4;
$light_gray: #eee;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

.login-container {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  z-index: 9;
  overflow: hidden;
  .login-mask {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100%;
    width: 100%;
    overflow: hidden;
    z-index: 10;
    background: linear-gradient(
      225deg,
      rgba(85, 122, 242, 0.3) 0%,
      rgba(82, 171, 253, 0.3) 100%
    );
  }
  .login-wrapper {
    position: absolute;
    right: 20%;
    top: 50%;
    margin-top: -288px;
    width: 512px;
    height: 576px;
    box-sizing: border-box;
    padding: 16px;
    z-index: 11;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.64);
  }
  .login-center {
    width: 480px;
    height: 545px;
    background: #fff;
    border-radius: 20px;
    margin: 0 auto;
    box-sizing: border-box;
    padding: 60px 40px 0;
    .title-container {
      color: #557af2;
      .title {
        font-size: 36px;
        line-height: 53px;
        margin: 0;
        text-align: center;
      }
    }

    .login-form {
      padding: 40px 0 0;
      .el-form-item {
        margin-bottom: 40px;
      }

      .el-form-item__content {
        display: flex;
        align-items: center;
      }
      .el-input {
        display: inline-block;
        input {
          background: transparent;
          font-size: 16px;
          border: 0px;
          border-radius: 0px;
          padding: 0 32px;
          color: #000;
          caret-color: $cursor;
          width: 400px;
          height: 50px;
          border-radius: 8px;
          box-sizing: border-box;
          border: 1px solid rgba(226, 226, 226, 1);

          &:-webkit-autofill {
            box-shadow: 0 0 0px 1000px $bg inset !important;
            -webkit-text-fill-color: $cursor !important;
          }
        }
      }
      .input-title {
        position: absolute;
        z-index: 13;
        width: 80px;
        height: 20px;
        top: -10px;
        left: 42px;
        color: rgba(92, 96, 99, 1);
        background: #fff;
        text-align: center;
        line-height: 20px;
        display: block;
      }

      .verify {
        position: absolute;
        right: 1px;
        top: 1px;
        min-width: 120px;
        height: 48px;
        cursor: pointer;
        border-radius: 0 8px 8px 0;
      }

      .show-pwd {
        position: absolute;
        right: 25px;
        top: 10px;
        font-size: 16px;
        color: $dark_gray;
        cursor: pointer;
        user-select: none;
      }
    }
  }
}
.login-container:before {
  content: "";
  position: absolute;
  background: url(../../assets/images/login.png) center center / cover no-repeat;
  width: 100%;
  height: 100%;
}

.copyright {
  position: fixed;
  bottom: 20px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #dcdcdc;
}
.copyright span {
  margin-right: 15px;
}
</style>
