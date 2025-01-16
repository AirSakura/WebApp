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
          <el-input v-model="dataForm.basin_name" />
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
      dataForm: {},
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
        this.createData();
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

            this.dialogFormVisible = false;
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
          const userid = {
            id: row.id
          };
          basinDelete(userid).then(res => {
            this.$messages({
              type: "success",
              message: "删除成功"
            });
            this.getBasin();
          });
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

    handleExcelerror(err) {
      this.$messages.error(err);
      this.loadLoading = false;
    },

    beforeExcelUpload(file) {
      this.loadLoading = true;
    }
  }
};
</script>
<style scope></style>
