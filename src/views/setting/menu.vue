<template>
  <div class="app-container">
    <div class="filter-bar">
      <p class="filter-line">
        <el-button
          v-permission="['admin_menu_add:POST']"
          icon="el-icon-edit"
          round
          size="mini"
          type="success"
          @click="handleCreate"
          >添加</el-button
        >
      </p>
    </div>
    <div class="table-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="正在查询中。。。"
        :tree-props="{ children: 'children' }"
        :default-expand-all="false"
        row-key="id"
      >
        <el-table-column align="left" label="菜单名称" prop="title">
          <template slot-scope="{ row }">
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="icon"
          label="菜单图标"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <svg-icon v-if="scope.row.icon" :icon-class="scope.row.icon" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="菜单路由" prop="path" />
        <el-table-column align="center" label="菜单标示" prop="name">
          <template slot-scope="scope">
            <span v-if="!scope.row.func_id">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="页面路径" prop="component" />

        <el-table-column align="center" label="权限标示" prop="func">
          <template slot-scope="{ row }">
            <span style="color: #f44336">{{
              row.func instanceof Array ? null : row.func
            }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="是否显示" prop="hidden">
          <template slot-scope="{ row }">
            <el-tag :type="row.hidden ? 'danger' : 'success'">
              {{ row.hidden ? "否" : "是" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="160"
          fixed="right"
          class-name="small-padding"
        >
          <template slot-scope="scope">
            <el-button
              v-permission="['admin_menu_edit:POST']"
              type="primary"
              size="mini"
              @click="handleUpdate(scope.row)"
            >
              编辑</el-button
            >
            <el-button
              v-permission="['admin_menu_delete:GET']"
              type="danger"
              size="mini"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="550px"
      top="5vh"
    >
      <div v-if="dialogStatus == 'create'" class="menuslabel">
        <el-radio-group v-model="menuType" size="small">
          <el-radio-button :label="0">菜单</el-radio-button>
          <el-radio-button :label="1">功能</el-radio-button>
        </el-radio-group>
      </div>
      <el-form
        v-show="menuType == 0"
        ref="dataMenu"
        :rules="menus"
        :inline="false"
        :model="dataMenu"
        status-icon
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="父级菜单" prop="parentid">
          <treeselect
            v-model="dataMenu.parentid"
            placeholder="顶级菜单"
            :normalizer="normalizer"
            :options="list"
          >
          </treeselect>
        </el-form-item>
        <el-form-item label="菜单名称" prop="title">
          <el-input
            v-model="dataMenu.title"
            placeholder="菜单的中文名称，如系统设置"
          />
        </el-form-item>
        <el-form-item label="唯一标示" prop="name">
          <el-input
            v-model="dataMenu.name"
            placeholder="全局唯一英文值，如setting"
          />
        </el-form-item>
        <el-form-item label="菜单路由" prop="path">
          <el-input
            v-model="dataMenu.path"
            placeholder="一级菜单必须加上/，如/setting"
          />
        </el-form-item>
        <el-form-item label="页面路径" prop="component">
          <el-input v-if="flag" v-model="dataMenu.component" />
          <template v-else>
            <el-input
              v-model="dataMenu.component"
              :readonly="checked"
              placeholder="页面所在view下的路径,如setting/user"
              style="width:300px"
            />
            <el-tooltip
              class="item"
              effect="dark"
              content="如配置多级菜单时"
              placement="bottom"
            >
              <el-checkbox style="margin-left: 5px;" v-model="checked"
                >无实际页面</el-checkbox
              >
            </el-tooltip>
          </template>
        </el-form-item>
        <el-form-item label="是否显示" prop="hidden">
          <el-select
            v-model="dataMenu.hidden"
            placeholder="请选择"
            style="width: 100%;"
          >
            <el-option label="是" :value="0" />
            <el-option label="否" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="菜单图标">
          <el-popover
            placement="bottom-start"
            width="460"
            trigger="click"
            @show="$refs['iconSelect'].reset()"
          >
            <IconSelect ref="iconSelect" @selected="selected" />
            <el-input
              slot="reference"
              v-model="dataMenu.icon"
              placeholder="点击选择图标"
              readonly
            >
              <svg-icon
                v-if="dataMenu.icon"
                slot="prefix"
                :icon-class="dataMenu.icon"
                class="el-input__icon"
                style="height: 40px; margin-left: 3px;width: 16px"
              />
              <i v-else slot="prefix" class="el-icon-search el-input__icon" />
            </el-input>
          </el-popover>
        </el-form-item>
        <el-form-item label="菜单排序" prop="sortindex">
          <el-input v-model="dataMenu.sortindex" />
        </el-form-item>
      </el-form>
      <el-form
        v-show="menuType == 1"
        ref="dataForm"
        :rules="rules"
        :inline="false"
        :model="dataForm"
        status-icon
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="父级菜单" prop="menu_id">
          <treeselect
            v-model="dataForm.menu_id"
            placeholder="顶级菜单"
            :normalizer="normalizer"
            :options="list"
          >
          </treeselect>
        </el-form-item>
        <el-form-item label="按钮名称" prop="name">
          <el-input v-model="dataForm.name" />
        </el-form-item>

        <el-form-item label="权限标识" prop="func">
          <el-select
            v-model="dataForm.func"
            filterable
            placeholder="请选择接口"
            style="width: 100%"
          >
            <el-option
              v-for="item in api_"
              :key="item.func"
              :label="item.func"
              :value="item.func"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关闭</el-button>
        <template v-if="dialogStatus == 'create'">
          <el-button v-if="menuType == 0" type="primary" @click="createData"
            >确定</el-button
          >
          <el-button v-else type="primary" @click="createMenu">确定</el-button>
        </template>
        <template v-else>
          <el-button v-if="menuType == 0" type="primary" @click="updateMenu"
            >确定</el-button
          >
          <el-button v-else type="primary" @click="updateData">确定</el-button>
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listmenu,
  apis,
  addfunc,
  addmenu,
  editmenu,
  delmenu,
  delfunc,
  editfunc
} from "@/api/menu";
import IconSelect from "@/components/IconSelect";
import { mapGetters } from "vuex";
import Treeselect from "y_treeselect";
export default {
  name: "Menu",
  components: {
    IconSelect,
    Treeselect
  },
  data() {
    return {
      list: [],
      apis: [],
      api_: [],
      total: 0,
      normalizer(node) {
        return {
          id: node.id,
          label: node.title,
          children: node.children
        };
      },
      menuType: 0,
      flag: false,
      checked: false,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        keywords: undefined,
        sort: "add_time",
        order: "desc"
      },
      dataMenu: {
        title: null,
        component: "layout/Layout",
        name: null,
        parentid: null,
        path: null,
        icon: null,
        sortindex: 0,
        remark: null,
        alwaysShow: 1,
        noCache: 1,
        hidden: 0
      },
      dataForm: {
        menu_id: null,
        name: null,
        func: null
      },
      dialogFormVisible: false,
      dialogStatus: null,
      textMap: {
        update: "编辑",
        create: "添加"
      },
      rules: {
        // menuname: [
        //   { required: true, message: '名称不能为空', trigger: 'blur' }
        // ]
      },
      menus: {
        title: [
          {
            required: true,
            message: "菜单名称不能为空",
            trigger: "blur"
          }
        ],
        path: [
          {
            required: true,
            message: "菜单路由不能为空",
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,
            message: "菜单标示不能为空",
            trigger: "blur"
          }
        ],
        component: [
          {
            required: true,
            message: "页面路径不能为空",
            trigger: "blur"
          }
        ]
        // parentid:[
        //    { required: true, message: '父级菜单不能为空', trigger: 'change' }
        // ]
      }
    };
  },
  watch: {
    "dataMenu.parentid": {
      handler(val) {
        // 判断是否为一级菜单
        if (this.menuType == 0) {
          if (val == 0 || val == null) {
            // this.dataMenu.component = 'layout/Layout'
            this.dataMenu.alwaysShow = 1;
            this.flag = true;
          } else {
            this.dataMenu.component =
              this.dialogStatus == "create" ? "" : this.dataMenu.component;
            this.dataMenu.alwaysShow = 0;
            this.flag = false;
          }
        }
      },
      deep: true
    },
    checked: {
      handler(val) {
        if (val) {
          this.dataMenu.component = "redirect/view";
        } else {
          this.dataMenu.component = "";
        }
      }
    }
  },
  computed: {
    ...mapGetters(["user"])
  },
  created() {
    this.getList();
  },
  mounted() {},
  methods: {
    getList() {
      this.listLoading = true;
      listmenu(this.listQuery)
        .then(res => {
          this.list = res.data;
          // this.list = this.calleArr(res.data)
          this.listLoading = false;
        })
        .catch(res => {
          this.$messages({
            type: "warning",
            message: res
          });
          this.list = [];
          this.listLoading = false;
        });
      const data = {
        page: 1,
        limit: 10000
      };
      apis(data).then(v => {
        this.api_ = v.data;
      });
    },
    calleArr(array) {
      const res = [];
      for (var i in array) {
        var data = array[i];
        if (data.children) {
          this.calleArr(data.children);
        } else {
          data.isDisabled = true;
        }
        res.push(data);
      }
      return res;
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    selected(name) {
      this.dataMenu.icon = name;
    },
    resetForm() {
      this.dataMenu = {
        title: null,
        component: null,
        name: null,
        parentid: null,
        path: null,
        icon: null,
        sortindex: 0,
        remark: null,
        alwaysShow: 1,
        noCache: 1,
        hidden: 0
      };
      this.dataForm = {
        menu_id: null,
        name: null,
        func: null
      };
      this.menuType = 0;
    },

    handleCreate() {
      this.resetForm();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    getData(arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].children) {
          arr = arr.slice(0, i + 1).concat(arr[i].children, arr.slice(i + 1));
        }
      }
      return arr;
    },
    createData() {
      this.dataMenu.parentid = this.dataMenu.parentid
        ? this.dataMenu.parentid
        : 0;
      this.$refs["dataMenu"].validate(valid => {
        if (valid) {
          addmenu(this.dataMenu)
            .then(res => {
              this.dialogFormVisible = false;
              this.$messages({
                type: "success",
                message: "添加成功"
              });
              this.getList();
            })
            .catch(res => {});
        }
      });
    },
    createMenu() {
      addfunc(this.dataForm)
        .then(res => {
          this.getList();
          this.dialogFormVisible = false;
          this.$messages({
            type: "success",
            message: "添加成功"
          });
        })
        .catch(res => {});
    },
    handleUpdate(row) {
      if (row.func_id) {
        this.dataForm = Object.assign({}, row);
      } else {
        this.dataMenu = Object.assign({}, row);
        this.checked =
          this.dataMenu.component == "redirect/view" ? true : false;
        // this.dataMenu.component = row.component || 'layout/Layout'
        this.dataMenu.menu_id = this.dataMenu.id;
      }

      // this.dataMenu.parentid = row.menu_id ? row.menu_id : row.parentid
      this.menuType = row.func ? 1 : 0;
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          editfunc(this.dataForm).then(() => {
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
    updateMenu() {
      if (this.dataMenu.children) delete this.dataMenu.children;
      this.$refs["dataMenu"].validate(valid => {
        if (valid) {
          editmenu(this.dataMenu).then(() => {
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
      this.$confirms("确定删除吗?", "删除操作", {
        confirmsButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "confirmsTop"
      })
        .then(() => {
          if (row.func_id) {
            const data = {
              func_id: row.func_id
            };
            delfunc(data).then(res => {
              this.$messages({
                type: "success",
                message: "删除成功"
              });
              this.getList();
            });
          } else {
            const form = {
              menu_id: row.id
            };
            delmenu(form).then(res => {
              this.$messages({
                type: "success",
                message: "删除成功"
              });
              this.getList();
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
    get_api(id) {
      this.api_.forEach(item => {
        if (item.id == id) {
          this.dataForm.func = item.apiname;
        }
      });
    }
  }
};
</script>
<style scoped>
.menuslabel {
  height: 40px;
  line-height: 15px;
  padding-left: 20px;
  margin-bottom: 10px;
}

.menuslabel span {
  font-size: 15px;
  color: #606266;
  font-weight: 700;
  margin-right: 45px;
}
</style>
