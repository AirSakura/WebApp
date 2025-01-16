<template>
  <div class="login-container">
    <div class="login-center">
      <div class="title-container">
        <div class="title1">欢迎登录</div>
        <div class="title">中小流域洪水预报系统</div>
      </div>
      <div
        style="width:470px;padding-left:30px;padding-right:30px;margin-top:10px"
      >
        <el-divider content-position="center">SGIN IN</el-divider>
      </div>

      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        auto-complete="on"
        label-position="top"
      >
        <span class="input-title">您的账号</span>
        <el-form-item prop="user">
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

        <span class="input-title">您的密码</span>
        <el-tooltip
          v-model="capsTooltip"
          content="Caps lock is On"
          placement="right"
          manual
        >
          <el-form-item prop="pwd">
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

        <span class="input-title">验证码</span>
        <el-form-item prop="user">
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
          plain
          class="submit"
          @click.native.prevent="handleLogin"
          >登 录</el-button
        >
      </el-form>
    </div>
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
              // this.hasSk();
              this.$router.push({ path: this.redirect || "/" });
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

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  .el-input {
    display: inline-block;
    height: 47px;
    width: 400px;

    input {
      background: transparent;
      -webkit-appearance: none;
      padding: 12px 5px 12px 15px;
      color: #000;
      height: 47px;
      caret-color: $cursor;
      border: none;
      border-radius: 0px;
      border-bottom: 1px solid #777;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }

    input:focus {
      border-bottom: 2px solid #409eff;
    }
  }

  .el-form-item {
    border: none;
    background: transparent;
    border-radius: 5px;
    color: #454545;
  }
}
.login-container:before {
  content: "";
  position: absolute;
  background: url(../../assets/images/loginbody.jpeg) center center / cover
    no-repeat;
  background-size: 100% 100%;
  filter: blur(1px);
  width: 100%;
  height: 100%;
  animation: login 10s linear;
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-center {
  position: absolute;
  width: 30%;
  height: 100%;
  background-color: #fff;
  // top: 25vh;
  right: 0px;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-wrap: wrap;
  border-radius: 18px 0px 0px 18px;
  // margin: 0 auto;
  .title-container {
    position: relative;
    width: 470px;
    height: 100px;
    background-color: #fff;
    padding-left: 30px;
    .title1 {
      font-size: 16px;
      color: #777;
      text-align: start;
      font-weight: bold;
      letter-spacing: 2.5px;
    }
    .title {
      font-size: 26px;
      color: #409eff;
      text-align: start;
      font-weight: bold;
      height: 70px;
      line-height: 70px;
      letter-spacing: 2.5px;
      text-align: center;
    }
  }
  .input-title {
    width: 80px;
    height: 20px;
    line-height: 20px;
    display: block;
    color: #fff;
    font-size: 16px;
    margin: 0 0 10px 0;
  }

  .verify {
    position: absolute;
    right: 1px;
    top: 1px;
    min-width: 120px;
    height: 48px;
    cursor: pointer;
    border-radius: 0 4px 4px 0;
  }
}
.login-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  .login-form {
    overflow: hidden;
    background: #fff;
    // border-radius: 5px;
    padding: 30px;
    height: 400px;
    margin: 0 auto;
    .form_button {
      width: 200px;
      margin: 30px auto;
      display: block;
      box-shadow: 4px 4px 4px 0px rgba(1, 1, 1, 0.295);
    }
    .form_button:hover {
      transform: translateY(-3px);
    }
    .form_button:active {
      transform: translateY(3px);
    }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }



  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }
  

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
