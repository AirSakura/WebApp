<template>
  <div class="login-container">
    <div class=" login-mask">
      <div class="area">
        <ul class="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    </div>

    <div class="login-wrapper">
      <div class="login-center">
        <div class="title-container">
          <!-- <img class="logo" src="../../assets/images/logo.png" alt="" /> -->
          <h3 class="title">中小流域洪水预报系统</h3>
        </div>
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          auto-complete="on"
          label-position="left"
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
              />
<!--              @keyup.enter.native="handleLogin"-->
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
<!--            @keyup.enter.native="handleLogin"-->
            <img class="verify" :src="verifyUrl" @click="getVerify" alt="" />
          </el-form-item>

          <el-button
            tabindex="4"
            v-preventClick
            :loading="loading"
            plain
            class="sbm"
            @click.native.prevent="handleLogin"
            >登 录</el-button
          >
        </el-form>
      </div>
    </div>

    <div class="copyright">
      <span>三峡大学水利与环境学院——水资源信息化研究所</span> ICP备案号: 测试
    </div>
  </div>
</template>
<script>
import { getInfo, verify } from "@/api/user";
import {setToken,getToken} from '@/utils/auth'
import axios from "axios";

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
      redirect: undefined,
      key:""
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
    // this.getVerify();
  },
  mounted() {
    this.key = Math.random();
    this.verifyUrl = "http://localhost:8093/captcha/getCaptcha?key=" + this.key
    if (this.loginForm.user === "") {
      this.$refs.user.focus();
    } else if (this.loginForm.pwd === "") {
      this.$refs.pwd.focus();
    }
  },
  methods: {
    clearLoginForm:function() {
        const _this = this
        _this.loginForm.verify = ''
        _this.loginForm.user = ''
        _this.loginForm.pwd = ''
    },
    getVerify() {
      // this.verifyUrl = "http://localhost:8093/captcha/getCaptcha?key=" + this.key
      // Axios({
      //   url: process.env.VUE_APP_BASE_API + "admin/self/verify/code",
      //   method: "get",
      //   responseType: "blob"
      // }).then(({ data, headers }) => {
      //   this.verifyUrl = URL.createObjectURL(data);
      //   this.loginForm.vt = headers.vt;
      // });

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
      const _this = this;
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          axios.get("http://localhost:8093/users/Login",{
            params:{
              username: _this.loginForm.user,
              password: _this.loginForm.pwd,
              verifycode: _this.loginForm.verify,
              key:_this.key
            }
          })
          .then(function(res) {
              if (res.data == 1){
                // setToken(Math.random())
                setToken(Math.random())
                let _token = getToken()
                _this.$message({
                  message:'登陆成功，正在前往首页,token:'+_token ,
                  type:'success'
                })
                window.location.href = '/'
                // alert("获取的token是:"+_token)
                // setToken()

                // _this.hasSk()
                // window.location.href = '/dashboard'
                // _this.hasSk()
                // this.$router.push({ path: this.redirect || "/" });
                // window.location.href = '/dashboard'
                // _this.$route.push("/dashboard")
                // router.push("/dashboard")
              }else if(res.data == 0){
                _this.clearLoginForm()
                _this.$message({
                  message:'密码错误，请检查后重试',
                  type:'error'
                })
              }else if (res.data == -1) {
                _this.clearLoginForm()
                _this.$message({
                  message:'该用户不存在',
                  type:'error'
                })
              }else if (res.data == -2) {
                _this.loginForm.verify = ''
                _this.loading = false
                _this.key = Math.random();
                _this.verifyUrl = "http://localhost:8093/captcha/getCaptcha?key=" + this.key
                _this.$message({
                  message:'验证码错误，请重新输入',
                  type:'error'
                })
              }
              // else {
              //   _this.$message({
              //     message: '登录失败，请检查账号或者密码',
              //     type:'error'
              //   })
              //   _this.loginForm.clearText
              // }
          })
          // this.$store
          //   .dispatch("Login", this.loginForm)
          //   .then(() => {
          //     // this.hasSk();
          //     this.$router.push({ path: this.redirect || "/" });
          //   })
          //   .catch(res => {
          //     // this.$messages.error(res)
          //     this.loading = false;
          //   });
        } else {
          return false;
        }
      });
      this.$nextTick(() => {
        this.getVerify();
      });
    }
  }
};
</script>

<style lang="scss">
#particles-js {
  background-size: cover;
  background-position: 50% 50%;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
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
      rgba(85, 122, 242, 0.5) 0%,
      rgba(82, 171, 253, 0.5) 100%
    );
  }

  .login-wrapper {
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: -360px;
    margin-left: -256px;
    width: 512px;
    height: 576px;
    box-sizing: border-box;
    padding: 16px;
    z-index: 11;
  }
  .login-center {
    width: 480px;
    height: 545px;
    margin: 0 auto;
    box-sizing: border-box;
    padding: 60px 40px 0;
    .title-container {
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      .title {
        justify-content: center;
        font-size: 36px;
        line-height: 53px;
        margin: 0 0 20px 0;
        text-align: center;
      }
      .logo {
        width: 60px;
        height: 60px;
      }
    }

    .login-form {
      padding: 40px 0 0;
      .el-form-item {
        margin-bottom: 30px;
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
          color: #fff;
          background: transparent !important;
          width: 400px;
          height: 50px;
          border-radius: 4px;
          box-sizing: border-box;
          border: 1px solid #fff;
          &::placeholder {
            color: #fff;
            background: transparent !important;
          }
          &:focus-within {
            border: 2px solid #fff;
          }
          &:-webkit-autofill {
            -webkit-text-fill-color: #fff !important;
            -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
            background-color: transparent;
            background-image: none;
            transition: background-color 50000s ease-in-out 0s;
          }
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

      .show-pwd {
        position: absolute;
        right: 25px;
        top: 10px;
        font-size: 16px;
        color: #fff;
        cursor: pointer;
        user-select: none;
      }
      .sbm {
        width: 60%;
        margin: 18px 20% 0;
        height: 55px;
        font-size: 16px;
        font-weight: bold;
        border: 1px solid #fff;
        color: #fff !important;
        background: transparent !important;

        &:focus-within {
          border: 2px solid #fff;
        }
      }
    }
  }
}
.login-container:before {
  content: "";
  position: absolute;
  background: url(../../assets/images/login.jpg) center center / cover no-repeat;
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
  span {
    margin-right: 15px;
  }
}

.area {
  width: 100%;
  height: 100vh;
}

.circles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.circles li {
  position: absolute;
  display: block;
  list-style: none;
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.2);
  animation: animate 25s linear infinite;
  bottom: -150px;
}

.circles li:nth-child(1) {
  left: 25%;
  width: 80px;
  height: 80px;
  animation-delay: 0s;
}

.circles li:nth-child(2) {
  left: 10%;
  width: 20px;
  height: 20px;
  animation-delay: 2s;
  animation-duration: 12s;
}

.circles li:nth-child(3) {
  left: 70%;
  width: 20px;
  height: 20px;
  animation-delay: 4s;
}

.circles li:nth-child(4) {
  left: 40%;
  width: 60px;
  height: 60px;
  animation-delay: 0s;
  animation-duration: 18s;
}

.circles li:nth-child(5) {
  left: 65%;
  width: 20px;
  height: 20px;
  animation-delay: 0s;
}

.circles li:nth-child(6) {
  left: 75%;
  width: 110px;
  height: 110px;
  animation-delay: 3s;
}

.circles li:nth-child(7) {
  left: 35%;
  width: 150px;
  height: 150px;
  animation-delay: 7s;
}

.circles li:nth-child(8) {
  left: 50%;
  width: 25px;
  height: 25px;
  animation-delay: 15s;
  animation-duration: 45s;
}

.circles li:nth-child(9) {
  left: 20%;
  width: 15px;
  height: 15px;
  animation-delay: 2s;
  animation-duration: 35s;
}

.circles li:nth-child(10) {
  left: 85%;
  width: 150px;
  height: 150px;
  animation-delay: 0s;
  animation-duration: 11s;
}

@keyframes animate {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
    border-radius: 0;
  }

  100% {
    transform: translateY(-1000px) rotate(720deg);
    opacity: 0;
    border-radius: 50%;
  }
}
</style>
