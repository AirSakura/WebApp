<template>
  <div class="app-container">
    <div style="display: flex">
      <div class="flexPart">
        <Partztree
          v-if="isHeight"
          :height="Height"
          @partid="HandlePart"
          @sub="sub"
        />
      </div>

      <div class="flexMain">
        <div class="filter-bar">
          <p class="filter-line">
            <span class="title">关键字</span>
            <span>
              <el-input
                v-model="listQuery.keywords"
                clearable
                class="filter-item"
                size="small"
                placeholder="请输入关键字"
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
              v-permission="['admin_role_add:POST']"
              icon="el-icon-edit"
              round
              size="small"
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
          >
            <el-table-column
              align="center"
              label="所属单位"
              prop="partname"
              width="200"
            />

            <el-table-column align="center" label="角色名" prop="rolename" />
            <el-table-column align="center" label="角色类别" width="roleclass">
              <template slot-scope="scope">
                <div class="role-def">
                  <span
                    v-if="
                      scope.row.roleclass == 0 ||
                        scope.row.roleclass == 1 ||
                        scope.row.roleclass == 30
                    "
                    >{{
                      scope.row.roleclass == 0
                        ? "系统访客"
                        : scope.row.roleclass == 1
                        ? "默认成员"
                        : "默认管理员"
                    }}</span
                  >
                  <span v-else-if="scope.row.roleclass == 2">普通成员</span>
                  <span v-else>管理员({{ scope.row.roleclass }}级)</span>
                </div>
              </template>
            </el-table-column>
            <!-- <el-table-column align="center" label="角色类型" prop="roletype" /> -->
            <el-table-column
              align="center"
              label="操作"
              width="300"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <template v-if="scope.row.roleid == 1 || scope.row.roleid == 2">
                  <el-button
                    type="info"
                    style="width: 85px;"
                    plain
                    disabled
                    size="mini"
                    >无法操作</el-button
                  >
                </template>
                <template v-else>
                  <el-button
                    v-if="user.roleid != scope.row.roleid"
                    v-permission="['admin_role_power:POST']"
                    type="primary"
                    size="mini"
                    icon="el-icon-s-tools"
                    @click="handlePermission(scope.row)"
                    >权限配置</el-button
                  >
                  <el-button
                    v-if="scope.row.roleclass != 1 && scope.row.roleclass != 30"
                    v-permission="['admin_role_edit:POST']"
                    type="primary"
                    style="margin-left: 10px"
                    size="mini"
                    icon="el-icon-edit"
                    @click="handleUpdate(scope.row)"
                    >编辑</el-button
                  >
                  <el-button
                    v-if="scope.row.roleclass != 1 && scope.row.roleclass != 30"
                    v-permission="['admin_role_delete:GET']"
                    type="danger"
                    size="mini"
                    icon="el-icon-delete"
                    @click="handleDelete(scope.row)"
                    >删除</el-button
                  >
                </template>
              </template>
            </el-table-column>
          </el-table>

          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            @pagination="getList"
          />
        </div>
      </div>
    </div>

    <el-dialog
      :close-on-click-modal="false"
      :title="textMap[dialogStatus]"
      width="600px"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        status-icon
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="角色名" prop="rolename">
          <el-input v-model="dataForm.rolename" />
        </el-form-item>

        <el-form-item label="上级角色" prop="roleparentid">
          <TreeSelectRole
            v-model="dataForm.roleparentid"
            :multiple="false"
            :width="`460`"
          />
          <!-- <el-select
            v-model="dataForm.roleparentid"
            filterable
            style="width: 220px"
            placeholder="可搜索"
          >
            <el-option
              v-for="item in list_"
              :key="item.roleid"
              :label="`${item.rolename} (${item.partname})`"
              :value="item.roleid"
            />
          </el-select> -->
        </el-form-item>

        <el-form-item label="角色类别" prop="roleclass">
          <el-tooltip
            class="item"
            effect="dark"
            content="管理员数值越低，权限越低，默认管理员权限最高。"
            placement="bottom"
          >
            <i
              class="el-icon-question"
              style="position: absolute;left: -20px;top: 13px;"
            ></i>
          </el-tooltip>
          <el-select
            v-model="dataForm.roleclass"
            style="width: 100%"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in dictionary.roleclass"
              :key="index"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="角色类型" prop="roletype">
          <el-select v-model="dataForm.roletype" style="width: 100%" clearable placeholder="请选择">
            <el-option
              v-for="(item,index) in dictionary.roletype"
              :key="index"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item label="职责描述" prop="remark">
          <el-input v-model="dataForm.remark" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关闭</el-button>
        <el-button
          v-if="dialogStatus == 'create'"
          type="primary"
          @click="createData"
          >确定</el-button
        >
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      top="5vh"
      :visible.sync="permissionDialogFormVisible"
      title="权限配置"
      width="600px"
    >
      <el-tree
        id="role-tree"
        ref="tree"
        v-loading="listRole"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        :data="systemPermissions"
        :default-checked-keys="assignedPermissions"
        show-checkbox
        default-expand-all
        node-key="func"
        highlight-current
        :expand-on-click-node="false"
        @check="handleCheckChange"
      >
        <span
          slot-scope="{ node, data }"
          class="custom-tree-node"
          :class="{ 'role-tree-node': data.func && !Array.isArray(data.func) }"
        >
          <span>{{ data.title ? data.title : data.name }}</span>
          <!-- <el-tag
            v-if="data.func && !Array.isArray(data.func)"
            type="success"
            size="mini"
          >{{ data.func }}</el-tag> -->
        </span>
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="permissionDialogFormVisible = false">关闭</el-button>
        <el-button
          type="primary"
          :loading="roleloading"
          @click="updatePermission"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  rolelist,
  rolepower,
  addrole,
  editrole,
  delrole,
  roleinfo,
  getrole,
  menubyroleid,
  delroleformenu
} from "@/api/role";
import { mapGetters } from "vuex";
import store from "@/store";
export default {
  name: "Role",
  data() {
    return {
      Height: 0,
      isHeight: false,
      clientHeight: 0,
      opened: true,
      list: [],
      list_: null,
      part: null,
      total: 0,
      listLoading: false,
      roleloading: false,
      listRole: true,
      tableHeight: "",
      listQuery: {
        page: 1,
        limit: 10,
        partid: null,
        keywords: undefined,
        sort: "add_time",
        order: "desc",
        sub_status: 1
      },
      dataForm: {
        rolename: null,
        roleparentid: null,
        roleclass: 0,
        // roletype: null,
        // zonecode: null,
        remark: null
      },
      dialogFormVisible: false,
      permissionDialogFormVisible: false,
      dialogStatus: null,
      textMap: {
        update: "编辑",
        create: "添加"
      },
      rules: {
        rolename: [
          { required: true, message: "角色名不能为空", trigger: "blur" }
        ],
        roleparentid: [
          { required: true, message: "上级角色不能为空", trigger: "change" }
        ],
        roleclass: [
          { required: true, message: "角色类别不能为空", trigger: "change" }
        ]
      },
      dictionary: {},
      systemPermissions: null,
      assignedPermissions: [],
      permissionForm: {
        roleid: undefined,
        menus: []
      },
      roleType: []
    };
  },
  computed: {
    ...mapGetters(["user", "dict"])
  },
  watch: {
    list: {
      handler(n) {
        this.HandleHeight();
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.clientHeight = document.body.clientHeight - 115;
  },
  created() {
    this.getdict();
  },
  methods: {
    getList() {
      this.listLoading = true;
      rolelist(this.listQuery)
        .then(res => {
          this.list = res.data.data;
          this.total = res.data.total;
          this.listLoading = false;
          const data = {
            code: 1
          };
          getrole(data)
            .then(item => {
              this.list_ = item.data;
            })
            .catch(result => {
              this.$messages({ type: "warning", message: result });
            });
        })
        .catch(res => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        });
    },

    // 左侧相关
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
      this.getList();
    },
    sub(n) {
      this.listQuery.sub_status = n;
      this.getList();
    },
    toggleSideBar() {
      this.opened = !this.opened;
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    getdict() {
      store.dispatch("app/setdict").then(dict => {
        const name = ["roleclass"];
        const value = ["角色类别"];
        value.forEach((item, i) => {
          this.dictionary[name[i]] = dict.filter(
            v => v.field_name == item
          )[0].config_info;
        });
        console.log(this.dictionary);
      });
    },
    resetForm() {
      this.dataForm = {
        rolename: null,
        roleclass: null,
        roleparentid: null,
        // zonecode: null,
        remark: null
        // roletype: null
      };
    },
    handleCreate() {
      this.roleType = [];
      this.resetForm();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          addrole(this.dataForm).then(res => {
            this.getList();
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
      this.dataForm = Object.assign({}, row);
      this.dialogStatus = "update";
      this.dataForm.roleclass = row.roleclass;
      this.dialogFormVisible = true;
    },
    updateData() {
      delete this.dataForm.menuid;
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          editrole(this.dataForm).then(() => {
            this.getList();
            this.dialogFormVisible = false;
            this.$messages({
              type: "success",
              message: "更新成功"
            });
          });
        }
      });
    },
    handleDelete(row) {
      const data = {
        roleid: row.roleid
      };
      this.$confirms("确定删除吗?", "删除操作", {
        confirmsButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "confirmsTop"
      })
        .then(() => {
          delrole(data).then(res => {
            this.$messages({
              type: "success",
              message: "删除成功"
            });
            this.getList();
          });
        })
        .catch(() => {
          this.$messages({
            type: "info",
            message: "已取消"
          });
        });
    },
    handlePermission(row) {
      this.permissionForm.roleid = row.roleid;
      const data = {
        roleid: row.roleid
      };
      this.listRole = true;
      menubyroleid(data)
        .then(v => {
          var systemPermissions = [];
          systemPermissions = v.data;
          this.systemPermissions = systemPermissions.filter(item => {
            if (item.children) return item;
          });
          this.permissionDialogFormVisible = true;
          this.$nextTick(() => {
            document.querySelectorAll(".role-tree-node").forEach(node => {
              var role_node = node.parentNode.parentNode.parentNode;
              node.parentNode.parentNode.style.cssText =
                "width:170px;margin-left:10px";
              role_node.style.cssText = "display: flex;flex-wrap: wrap";
            });
          });
          this.getmenuid();
        })
        .catch(res => {
          this.listRole = false;
        });
    },
    getmenuid() {
      roleinfo({ roleid: this.permissionForm.roleid })
        .then(res => {
          this.$nextTick(() => {
            this.$refs.tree.setCheckedKeys([]);
            // 授权增加
            this.assignedPermissions = res.data.power;
            this.listRole = false;
            // this.assignedPermissions.push(24)
          });
        })
        .catch(res => {
          this.listRole = false;
        });
    },
    calleArr(array) {
      for (var i in array) {
        var data = array[i];
        if (data.children) {
          this.calleArr(data.children);
        } else {
          if (data.func_id) {
            this.assignedPermissions.forEach(v => {
              if (data.func == v) {
                console.log(data);
              }
            });
          }
        }
      }
    },
    handleCheckChange() {
      const prem = this.$refs.tree.getCheckedNodes(true);
      this.dataForm.menus = [];
      for (let i = 0; i < prem.length; i++) {
        this.dataForm.menus.push(prem[i]);
      }
    },
    updatePermission() {
      const prem = this.$refs.tree.getCheckedNodes(true);
      this.permissionForm.menus = [];
      var menus = [];
      for (let i = 0; i < prem.length; i++) {
        const data = {
          func_id: prem[i].func_id,
          menu_id: prem[i].menu_id,
          func: prem[i].func
        };
        menus.push(data);
      }
      console.log(menus);

      this.permissionForm.menus = menus;
      this.roleloading = true;
      rolepower(this.permissionForm)
        .then(res => {
          this.permissionDialogFormVisible = false;
          this.$messages({
            type: "success",
            message: "授权成功"
          });
          this.getList();
          setTimeout(() => {
            this.roleloading = false;
          }, 300);
        })
        .catch(res => {
          this.permissionDialogFormVisible = false;
          setTimeout(() => {
            this.roleloading = false;
          }, 300);
        });
    }
  }
};
</script>
<style>
.role-def span {
  font-weight: 800;
}
</style>
