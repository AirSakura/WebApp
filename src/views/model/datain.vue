<template>
  <div class="app-container">
    <div style="display:flex">
      <div class="flexMain">
        <div class="filter-bar">
          <p class="filter-line">
            <span class="title">关键字</span>
            <span>
              <el-input
                v-model="listQuery.keywords"
                clearable
                class="filter-item"
                style="width: 170px"
                size="small"
                placeholder="请输入名称"
                @keyup.enter.native="handleFilter"
              />
            </span>
          </p>

          <p class="filter-line">
            <el-button
              type="primary"
              icon="el-icon-search"
              class="fr"
              size="mini"
              round
              @click="handleFilter"
              >查找</el-button
            >
          </p>

          <p class="filter-line">
            <el-button
              v-permission="['admin_user_add:POST']"
              icon="el-icon-edit"
              round
              size="mini"
              type="success"
              @click="handleCreate"
              >添加</el-button
            >
          </p>

          <p class="filter-line">
            <el-button
              v-permission="['admin_user_delete_many:POST']"
              type="danger"
              class="filter-item"
              icon="el-icon-delete"
              round
              size="mini"
              :disabled="multiple"
              @click="handleDelete(null, false)"
              >批量删除</el-button
            >
          </p>

          <p class="filter-line">
            <el-button
              v-permission="['admin_user_template:GET']"
              class="filter-item"
              type="primary"
              round
              size="mini"
              icon="el-icon-download"
            >
              <a :href="handleDownload()">下载模板</a>
            </el-button>
          </p>

          <p class="filter-line">
            <el-upload
              v-permission="['admin_user_import_data:POST']"
              :headers="headers"
              class="filter-item"
              :action="uploadPathLoad()"
              :show-file-list="false"
              :on-success="handleExcelSuccess"
              :on-error="handleExcelerror"
              :before-upload="beforeExcelUpload"
            >
              <el-button
                type="primary"
                icon="el-icon-upload"
                round
                size="mini"
                :loading="loadLoading"
                >批量导入</el-button
              >
            </el-upload>
          </p>

          <p class="filter-line">
            <el-button
              v-permission="['admin_user_template:POST']"
              class="filter-item"
              type="primary"
              round
              size="mini"
              icon="el-icon-download"
            >
              <a :href="handleDownloadUser()">批量导出</a>
            </el-button>
          </p>
        </div>

        <div
          class="table-container"
          :style="{ 'min-height': clientHeight + 'px' }"
        >
          <el-table
            v-loading="listLoading"
            :data="list"
            element-loading-text="正在查询中。。。"
            border
            fit
            stripe
            highlight-current-row
            :tree-props="{ children: 'children' }"
            default-expand-all
            row-key="id"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" align="center" />

            <el-table-column
              align="center"
              label="流域名称"
              prop="basin_name"
            />

            <el-table-column align="center" label="备注" prop="remark">
            </el-table-column>

            <el-table-column
              align="center"
              label="操作"
              class-name="small-padding"
              width="220"
            >
              <template slot-scope="scope">
                <template>
                  <!-- <el-button
                      v-permission="['admin_user_info:GET']"
                      type="primary"
                      size="mini"
                      @click="handleQuery(scope.row)"
                      >查看</el-button
                    > -->
                  <el-button
                    v-permission="['admin_user_edit:GET']"
                    type="primary"
                    size="mini"
                    @click="handleUpdate(scope.row)"
                    >编辑</el-button
                  >
                  <el-button
                    v-if="user.userid != scope.row.userid"
                    v-permission="['admin_user_delete:GET']"
                    type="danger"
                    size="mini"
                    @click="handleDelete(scope.row, true)"
                    >删除
                  </el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>

          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            @pagination="getBasin"
          />
        </div>
      </div>
    </div>

    <el-dialog
      ref="dialog"
      :close-on-click-modal="false"
      :title="textMap[dialogStatus]"
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
        <el-form-item label="流域名称" prop="basin_name">
          <el-input
            v-model="dataForm.basin_name"
            :disabled="dialogStatus == 'update'"
          />
        </el-form-item>
        <el-form-item label="详情" prop="remark">
          <el-input v-model="dataForm.remark" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onClose">关闭</el-button>
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
  userlist,
  adduser,
  edituser,
  deluser,
  manyuser,
  infouser,
  resetpwd,
  user_management,
  user_management_zone,
  import_user_save,
  userlistexport
} from "@/api/user";

import {
  basinAdd,
  basinEdit,
  basinList,
  planEdit,
  basinDelete,
  stationAdd,
  stationEdit,
  stationDataIn,
  basininfo
} from "@/api/hydromodel/datama";
import SingleUpload from "@/components/Uploads/single";
import { mapGetters } from "vuex";
import store from "@/store";
import { getToken } from "@/utils/auth";
export default {
  name: "User",
  components: {
    SingleUpload
  },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入手机号"));
      } else {
        if (!/^1[3456789]\d{9}$/.test(value)) {
          callback(new Error("请输入正确的手机号"));
        } else {
          callback();
        }
      }
    };
    const validatePassword = (rule, value, callback) => {
      console.log(value);
      if (value == null) {
        callback(new Error("密码不得为空"));
      }
      if (value.length < 8) {
        callback(new Error("密码长度不低于8位"));
      }
      var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,}$/;
      if (!reg.test(value)) {
        callback(new Error("不低于8位的字母加数字"));
      } else {
        callback();
      }
    };
    return {
      is_image: true,
      checked: false,
      repeat: false,
      installer: [],
      field: [],
      status: true,
      tip: false,
      Height: 0,
      Mheight: 600,
      isHeight: false,
      clientHeight: 0,
      opened: true,
      userrole: [],
      multiple: true,
      ids: [],
      imgload: false,
      list: [],
      duty: [],
      roleid: null,
      part: null,
      role: [],
      total: 0,
      name: null,
      partname: "",
      listLoading: false,
      loadLoading: false,
      loading: false,
      listQuery: {
        page: 1,
        limit: 20,
        keywords: undefined,
        user_id: null,
        roleid: null,
        sort: "add_time",
        order: "desc",
        sub_status: 1,
        user_type: ""
      },
      dictionary: {},
      dataForm: {
        username: null,
        userpwd: null,
        nickname: null,
        roleid: null,
        phone: null,
        bdcardid: null,
        address: null,
        headimg: null,
        remark: null,
        age: null,
        user_status: null,
        IDcard: null,
        sex: null,
        birthday: null,
        user_type: null
        // work_date: null,
        // fire_control_work_date: null,
        // political_status: null,
        // user_class: null,
        // education_level: null,
        // work_type: null,
        // veteran: null,
        // nation: null,
        // professional_title: null,
        // zone_level: null,
        // email: null,
        // height: null,
        // weight: null,
        // shoe_size: null,
        // hat_number: null,
        // clothes_size: null,
        // native_place: null,
        // health: null,
        // wages: null
      },
      management: {
        username: null,
        management_zone: []
      },
      image_url: null,
      visible: false,
      dialogFormVisible: false,
      dialogs: false,
      dialogStatus: null,
      textMap: {
        update: "编辑",
        create: "添加"
      },
      sex: [],
      user_type: [],
      rules: {
        basin_name: [
          {
            required: true,
            message: "流域名称不能为空",
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
  watch: {
    checked: {
      handler(n) {
        this.part = n ? this.listQuery.partid : "";
      }
    },
    list: {
      handler(n) {
        this.HandleHeight();
      },
      immediate: true,
      deep: true
    }
  },

  mounted() {
    this.clientHeight = document.body.clientHeight - 205;
    this.$refs.dialog.rendered = true;
  },
  methods: {
    getBasin() {
      console.log(this.listQuery);
      this.listLoading = true;
      basinList(this.listQuery)
        .then(res => {
          console.log(res.data);
          this.list = res.data.data;
          this.total = res.data.total;
          this.listLoading = false;
        })
        .catch(res => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        });
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userid);
      this.multiple = !selection.length;
    },
    getIdCard() {
      let IdCard = this.dataForm.IDcard;
      if (IdCard != "" && IdCard.length == 18) {
        let birthday =
          IdCard.substring(6, 10) +
          "-" +
          IdCard.substring(10, 12) +
          "-" +
          IdCard.substring(12, 14);
        this.dataForm.birthday = birthday;

        if (parseInt(IdCard.substr(16, 1)) % 2 === 1) {
          this.dataForm.sex = "男";
        } else {
          this.dataForm.sex = "女";
        }

        var ageDate = new Date();
        var month = ageDate.getMonth() + 1;
        var day = ageDate.getDate();
        var age = ageDate.getFullYear() - IdCard.substring(6, 10) - 1;
        if (
          IdCard.substring(10, 12) < month ||
          (IdCard.substring(10, 12) === month &&
            IdCard.substring(12, 14) <= day)
        ) {
          age++;
        }
        if (age <= 0) {
          age = 1;
        }
        this.dataForm.age = age;
      }
    },
    setduty(data) {
      this.duty = data;
    },
    sub(n) {
      this.listQuery.sub_status = n;
      this.getBasin();
    },

    dotips() {
      this.$message({
        message: "请点击右侧按钮开始选择！",
        type: "warning"
      });
    },
    PassData() {
      this.$prompt("请输入新密码（密码必须是8位以上字母+数字）", "重置操作", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/,
        inputErrorMessage: "密码必须是8位以上字母+数字"
      })
        .then(({ value }) => {
          const data = {
            userpwd: value,
            userid: this.dataForm.userid
          };
          // this.dataForm.userpwd = value
          // delete this.dataForm.roles
          resetpwd(data).then(() => {
            this.getBasin();
            this.dialogFormVisible = false;
            this.$messages({
              type: "success",
              message: "密码重置成功!"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },
    SetData() {
      if (!this.duty) {
        this.$messages({
          type: "warning",
          message: "请选择责任区！"
        });
        return false;
      } else {
        this.$confirms(`确认提交责任区数据吗？`, "确认操作", {
          confirmsButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          customClass: "confirmsTop"
        })
          .then(() => {
            var code = [];
            this.duty.forEach(v => {
              code.push(v.zonecode);
            });
            this.management.management_zone = code;

            user_management(this.management)
              .then(res => {
                this.getBasin();
                this.dialogs = false;
                this.$messages({
                  type: "success",
                  message: "添加成功"
                });
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
    },
    openMaps(row) {
      this.management.username = row.username;
      const data = {
        username: row.username
      };
      user_management_zone(data)
        .then(res => {
          this.dialogs = true;
        })
        .catch(res => {
          this.dialogs = true;
        });
    },
    HandleHeight() {
      this.$nextTick(() => {
        this.Height = this.clientHeight;
        this.isHeight = true;
        var tableHeight = 0;
        setTimeout(() => {
          tableHeight =
            document.querySelector(".table-container").offsetHeight +
            document.querySelector(".filter-bar").offsetHeight +
            20;
          if (tableHeight > this.clientHeight) {
            this.Height = tableHeight;
          } else {
            this.Height = this.clientHeight;
          }
        }, 200);
      });
    },
    HandlePart(id) {
      this.listQuery.partid = id;
      this.listQuery.page = 1;
      this.getBasin();
    },
    HandlePartName(name) {
      this.partname = name;
    },
    toggleSideBar() {
      this.opened = !this.opened;
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getBasin();
    },
    resetForm() {
      this.dataForm = {
        basin_name: null,
        basin_id: null,
        remark: null
      };
      this.image_url = "";
    },

    handleCreate() {
      this.resetForm();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.checked = false;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    usertypeChange(e) {
      console.log(e);
      if (e == 2) {
        this.dataForm.roleid = 3;
      } else {
        this.dataForm.roleid = null;
      }
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          basinAdd(this.dataForm).then(res => {
            this.getBasin();

            this.$messages({
              type: "success",
              message: "添加成功"
            });
          });
        }
      });
    },

    handleUpdate(row) {
      const id = {
        id: row.id
      };
      basininfo(id).then(res => {
        var data = res.data;
        this.dataForm = Object.assign({}, data);
        this.dialogStatus = "update";

        this.dialogFormVisible = true;
      });
    },

    handleQuery(row) {
      this.dataForm.user_id = row.user_id;
      const id = {
        user_id: row.user_id
      };
      infouser(id).then(res => {
        const data = res.data;
        // Query
        const fields = {};
        let field = [];
        const dataForm = this.$refs["dataForm"].fields;
        for (let i = 0; i < dataForm.length; i++) {
          fields[dataForm[i].label] = dataForm[i].prop;
        }
        for (const i in fields) {
          // 需要判断时 如果没有可略
          if (i == "用户类型") data[fields[i]] = data.user_type_txt;
          console.log(i);
          const value = {
            name: i,
            value: data[fields[i]] // 如果没有请求就直接从列表取row.[fields[i]]
          };
          field.push(value);
        }

        // 需要剔除时 如果没有可略
        field = field.filter(
          ele =>
            ele.name != "用户角色" &&
            ele.name != "用户密码" &&
            ele.name != "状态"
        );
        const setField = {
          field: field,
          images: this.getImage() || null // 没有图片直接null
        };
        this.$store.dispatch("app/setField", setField);
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          basinEdit(this.dataForm).then(() => {
            this.getBasin();
            this.dialogFormVisible = false;
            this.$messages({
              type: "success",
              message: "更新成功"
            });
          });
        }
      });
    },
    setVisible() {
      this.visible = false;
    },
    handleDelete(row, flag) {
      this.$confirms("确定删除吗?", "删除操作", {
        confirmsButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "confirmsTop"
      })
        .then(() => {
          if (flag) {
            const userid = {
              userid: row.userid
            };
            deluser(userid).then(res => {
              this.$messages({
                type: "success",
                message: "删除成功"
              });
              this.getBasin();
            });
          } else {
            const userids = {
              userids: this.ids
            };
            manyuser(userids).then(res => {
              this.$messages({
                type: "success",
                message: "删除成功"
              });
              this.getBasin();
            });
          }
        })
        .catch(() => {
          this.$messages({
            type: "info",
            message: "已取消"
          });
        });
    },

    onClose() {
      // this.$refs.attachment.clearFiles();
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

    handleExcelerror(err) {
      this.$messages.error(err);
      this.loadLoading = false;
    },
    handleExcelSuccess(res, file) {
      if (!res.data) {
        this.$messages.error(res.msg);
        this.loadLoading = false;
        return false;
      }
      this.loadLoading = false;
      if (res.status == 0) {
        this.status = true;
        this.field = [
          {
            name: "姓名",
            value: "nickname"
          },
          {
            name: "手机号码",
            value: "phone"
          },
          {
            name: "身份证号",
            value: "IDcard"
          },
          {
            name: "出生日期",
            value: "birthday"
          }
        ];
        this.installer = res.data.data;
      } else {
        this.status = false;
        this.field = [
          {
            name: "姓名",
            value: "nickname"
          },
          {
            name: "手机号码",
            value: "phone"
          },
          {
            name: "身份证号",
            value: "IDcard"
          },
          {
            name: "出生日期",
            value: "birthday"
          }
        ];
        this.installer = res.data.data;
        this.installer.forEach(v => {
          if (v.error_status) {
            v.error_status = "通过";
          } else {
            v.error_status = "未通过";
          }
        });
      }
    },
    beforeExcelUpload(file) {
      this.loadLoading = true;
    },
    getImage(name) {
      const data =
        this.dialogStatus == "create"
          ? `&headimg=${name}`
          : `&userid=${this.dataForm.userid}`;
      return `${
        process.env.VUE_APP_BASE_API
      }admin/user/getheadimg?${data}&token=${getToken()}&time=${Date.parse(
        new Date()
      )}`;
    },
    uploadPath(name) {
      const data =
        this.dialogStatus == "create" ? `` : `&userid=${this.dataForm.userid}`;
      return `${
        process.env.VUE_APP_BASE_API
      }admin/user/addheadimg?token=${getToken()}${data}`;
    },
    uploadPathLoad() {
      return `${
        process.env.VUE_APP_BASE_API
      }admin/user/import/file?token=${getToken()}`;
    },
    handleDownload() {
      return `${
        process.env.VUE_APP_BASE_API
      }admin/user/template?token=${getToken()}`;
    },
    handleDownloadUser() {
      let role = this.listQuery.roleid
        ? `&roleid=${this.listQuery.roleid}`
        : "";
      let keywords = this.listQuery.keywords
        ? `&keywords=${this.listQuery.keywords}`
        : "";
      let partid = this.listQuery.partid
        ? `&partid=${this.listQuery.partid}`
        : "";
      return `${
        process.env.VUE_APP_BASE_API
      }admin/user/list/export?token=${getToken()}${role}${partid}${keywords}&sub_status=${
        this.listQuery.sub_status
      }`;
    },
    send(installer, id) {
      // var data = installer.filter(v => v.status == '通过')
      // data.forEach(ele => { if (ele.status == '通过') delete ele.status })
      const form = {
        roleid: id,
        user_data: installer
      };
      import_user_save(form)
        .then(res => {
          if (res.status == 0) {
            this.$messages({
              type: "success",
              message: "导入成功"
            });
            this.$refs.lead.close();
            this.getBasin();
          } else {
            this.$messages.error(res.msg);
          }
        })
        .catch(res => {
          this.$messages.error(res);
        });
    }
  }
};
</script>
<style scope></style>
