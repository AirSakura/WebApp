<template>
  <div class="app-container">
    <el-tabs type="border-card" :style="{ 'min-height': clientHeight + 'px' }">
      <el-tab-pane label="个人信息">
        <div class="title">
          <span class="dot"></span>个人信息
          <p class="lasttime">上次登录时间：{{ user.last_logintime }}</p>
        </div>
        <div class="user-info">
          <div class="img">
            <el-image :src="useImg">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </div>
          <div class="info-list">
            <div class="info-item">
              <p>
                <span class="info-item-title">登录账号</span
                ><span>{{ user.username }}</span>
              </p>
              <p>
                <span class="info-item-title">所属机构</span
                ><span>{{ user.partname }}</span>
              </p>
            </div>
            <div class="info-item">
              <p>
                <span class="info-item-title">用户姓名</span
                ><span>{{ user.nickname }}</span>
              </p>
              <p>
                <span class="info-item-title">角色类型</span
                ><span>{{ user.rolename }}</span>
              </p>
            </div>
            <div class="info-item">
              <p>
                <span class="info-item-title"
                  >职&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;务</span
                ><span>{{ user.station }}</span>
              </p>
              <p>
                <span class="info-item-title"
                  >性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别</span
                ><span>{{ user.sex }}</span>
              </p>
            </div>
            <div class="info-item">
              <p>
                <span class="info-item-title">手机号码</span
                ><span>{{ user.phone }}</span>
              </p>
              <p>
                <span class="info-item-title">邮箱地址</span
                ><span>{{ user.email }}</span>
              </p>
            </div>
          </div>
        </div>
        <div class="info-edit">
          <span @click="openEidtInfo" v-permission="['admin_user_edit:POST']"
            >修改资料<i class="el-icon-edit"></i
          ></span>
        </div>

        <el-divider></el-divider>

        <div class="title">
          <span class="dot"></span>工作职责
          <p class="tips">{{ user.rolename }}</p>
        </div>

        <div class="user-info">
          <el-input
            type="textarea"
            :rows="20"
            readonly
            v-model="user['sr.remark']"
          >
          </el-input>
        </div>
      </el-tab-pane>

      <!-- <el-tab-pane label="常用水库">
        <div class="title"><span class="dot"></span>常用水库运行统计</div>
        <favorite />
      </el-tab-pane> -->
      <el-tab-pane label="通讯录">
        <div class="title "><span class="dot"></span>通讯录</div>
        <addressBook />
      </el-tab-pane>

      <el-tab-pane label="修改密码" v-permission="['admin_user_pwd_edit:POST']">
        <div class="title table-title"><span class="dot"></span>修改密码</div>
        <el-form
          ref="pwdForm"
          :rules="pwdrules"
          :model="pwdForm"
          status-icon
          label-position="left"
          label-width="100px"
          style="width: 360px;"
        >
          <el-form-item label="原始密码" prop="old_userpwd">
            <el-input v-model="pwdForm.old_userpwd" show-password />
          </el-form-item>
          <el-form-item label="新密码" prop="userpwd">
            <el-input v-model="pwdForm.userpwd" show-password />
          </el-form-item>
          <!-- <el-form-item label="确认密码" prop="userpwd1">
            <el-input v-model="pwdForm.userpwd1" show-password />
          </el-form-item> -->
        </el-form>
        <div class="dialog-footer" style="margin-left: 60px;">
          <el-button @click="onClearPwd">取消</el-button>
          <el-button type="primary" @click="onSavePwd">确定</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 修改个人信息弹窗 -->
    <el-dialog
      ref="dialog"
      :close-on-click-modal="false"
      title="修改资料"
      width="980px"
      top="10vh"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :inline="true"
        :model="dataForm"
        status-icon
        label-position="left"
        label-width="100px"
      >
        <el-divider content-position="left">设置头像</el-divider>
        <el-form-item label="用户头像" v-if="is_image">
          <SingleUpload
            v-if="dialogFormVisible"
            ref="attachment"
            upload="admin/headimg/upload"
            download="admin/headimg/download"
            @setFile="getFlies"
          />
        </el-form-item>

        <el-divider content-position="left">编辑资料</el-divider>

        <el-form-item label="用户姓名" prop="nickname">
          <el-input v-model="dataForm.nickname" />
        </el-form-item>

        <el-form-item label="职务" prop="station">
          <el-input v-model="dataForm.station" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select
            v-model="dataForm.sex"
            style="width: 187px"
            clearable
            placeholder="请选择"
          >
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
            <el-option label="未知" value="未知" />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="dataForm.phone" />
        </el-form-item>
        <el-form-item label="邮箱地址" prop="email">
          <el-input v-model="dataForm.email" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onClose">关闭</el-button>
        <el-button type="primary" @click="onSaveUser">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { edituser, getInfo, changePassword } from "@/api/user";
import { rolelist } from "@/api/role";
import { getToken } from "@/utils/auth";
import { parseTime } from "@/utils";
import { mapGetters, mapActions } from "vuex";
import addressBook from "./components/addressBook";
//import favorite from "./components/favorite";
import SingleUpload from "@/components/Uploads/single";

export default {
  components: {
    addressBook,
    SingleUpload
  },
  data() {
    return {
      useImg: "",
      dialogMap: false,
      clientHeight: "",
      dialogFormVisible: false,
      imgload: false,
      is_image: true,
      image_url: null,
      dictionary: {},
      roleList: [],
      dataForm: {},
      pwdForm: {},
      pwdrules: {
        old_userpwd: [
          {
            required: true,
            message: "旧密码不能为空",
            trigger: "blur"
          }
        ],
        userpwd: [
          {
            required: true,
            message: "新密码不能为空",
            trigger: "blur"
          }
        ]
      },
      rules: {
        nickname: [
          {
            required: true,
            message: "用户名不能为空",
            trigger: "blur"
          }
        ],
        roleid: [
          {
            required: true,
            message: "角色不能为空",
            trigger: "change"
          }
        ],

        nickname: [
          {
            required: true,
            message: "姓名不能为空",
            trigger: "blur"
          }
        ],
        user_type: [
          { required: true, message: "人员类别不能为空", trigger: "blur" }
        ],

        phone: [
          {
            required: true,
            message: "电话不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(["user", "dict"]),

    headers() {
      return {
        token: getToken()
      };
    }
  },

  created() {
    this.onClearPwd();
    // this.getRolelist();
  },
  mounted() {
    this.clientHeight = document.body.clientHeight - 115;

    this.$nextTick(() => {
      let img = eval(this.user.headimg);
      if (img && img.length > 0) {
        this.useImg = this.getImage(img[0].url);
      } else {
        this.useImg = require("@/assets/images/header.png");
      }
    });
  },
  methods: {
    ...mapActions(["SetUserinfo"]),

    resetForm() {
      this.dataForm = {
        userid: "",
        nickname: null,
        roleid: null,
        phone: null,
        sex: null,
        headimg: null,
        station: null,
        email: null
      };
    },
    // 清空重置密码表单
    onClearPwd() {
      this.pwdForm = {
        old_userpwd: "",
        userpwd: ""
      };
    },
    // 提交重置密码表单
    onSavePwd() {
      this.$refs["pwdForm"].validate(valid => {
        if (valid) {
          changePassword(this.pwdForm).then(res => {
            this.onClearPwd();
            this.$messages({
              type: "success",
              message: "修改成功"
            });
            this.$router.push("/login");
          });
        }
      });
    },
    // 获取角色列表
    getRolelist() {
      rolelist({
        page: 1,
        limit: 10000
      }).then(res => {
        this.roleList = res.data.data;
      });
    },
    onClose() {
      this.$refs.attachment.clearFiles();
      this.dialogFormVisible = false;
    },
    getFlies(data) {
      this.dataForm.headimg = data;
    },
    getImage(name) {
      return `${
        process.env.VUE_APP_BASE_API
      }admin/headimg/download?filename=${name}&token=${getToken()}&time=${Date.parse(
        new Date()
      )}`;
    },
    // 打开用户编辑弹窗
    openEidtInfo() {
      this.resetForm();
      this.dataForm = this.assignObj(this.dataForm, this.user);
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs.attachment.fileBack(this.dataForm.headimg);
        this.$refs["dataForm"].clearValidate();
      });
    },
    // 编辑用户
    onSaveUser() {
      edituser(this.dataForm).then(res => {
        this.getUserinfo();
        this.$messages({
          type: "success",
          message: "修改成功"
        });
        this.dialogFormVisible = false;
      });
    },
    // 获取用户信息
    getUserinfo() {
      getInfo().then(res => {
        this.SetUserinfo(res.data.userinfo);
      });
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/.el-tabs--border-card {
  border-radius: 8px;
}
/deep/ .el-tabs__item {
  font-size: 16px;
}
/deep/.el-tabs__header {
  border-radius: 8px 8px 0 0;
}
/deep/.el-tabs__nav-wrap {
  border-radius: 8px 8px 0 0;
}
.title {
  display: flex;
  align-items: center;
  height: 24px;
  font-size: 16px;
  .dot {
    width: 4px;
    height: 20px;
    background: #557af2;
    border-radius: 2px;
    margin: 0 8px 0 0;
  }
  .lasttime {
    font-size: 14px;
    color: #c7c7c7;
    margin: 0 0 0 10px;
  }
  .tips {
    height: 20px;
    line-height: 20px;
    color: #557af2;
    border: 1px solid #557af2;
    padding: 0 8px;
    border-radius: 12px;
    margin: 0 0 0 12px;
    font-size: 12px;
  }
}
.table-title {
  margin: 0 0 15px 0;
}
.user-info {
  display: flex;
  margin: 20px 0 0 20px;
  .img {
    width: 160px;
    height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f2f4fa;
    font-size: 24px;
  }
  .info-list {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 160px;
    margin: 0 0 0 24px;
    .info-item {
      display: flex;
      p {
        display: flex;
        width: 320px;
      }
      .info-item-title {
        display: flex;
        justify-content: space-between;
        width: 80px;
      }
    }
  }
}
.info-edit {
  color: #557af2;
  font-size: 14px;
  line-height: 48px;
  padding: 0 0 0 68px;
  span {
    cursor: pointer;
  }
}
</style>
