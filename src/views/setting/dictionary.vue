<template>
  <div class="app-container">
    <div class="filter-bar">
      <p class="filter-line">
        <span class="title">关键字</span>
        <span>
          <el-input
            v-model="listQuery.keywords"
            v-permission="['admin_role_list:GET']"
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
          v-permission="['admin_config_add:POST']"
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
      ref="tableHeight"
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
          label="名称"
          prop="field_name"
          width="150"
        />

        <el-table-column align="center" label="配置信息" prop="config_info">
          <template slot-scope="scope">
            <span>{{ escape2Html(scope.row.config_info) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="标识符"
          prop="remark"
          width="150"
        />
        <el-table-column
          align="center"
          label="类别"
          prop="model_class"
          width="150"
          sortable
        />
        <el-table-column
          align="center"
          class-name="small-padding"
          label="操作"
          width="160px"
        >
          <template slot-scope="scope">
            <el-button
              v-permission="['admin_config_edit:POST']"
              type="primary"
              size="mini"
              @click="handleUpdate(scope.row)"
              >编辑</el-button
            >
            <el-button
              v-permission="['admin_config_delete:GET']"
              type="danger"
              size="mini"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
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
    <!-- 添加或修改对话框 -->
    <el-dialog
      ref="dialog"
      :close-on-click-modal="false"
      :title="textMap[dialogStatus]"
      width="750px"
      top="5vh"
      :visible.sync="dialogFormVisible"
    >
      <div style="display: flex">
        <div style="flex: 1">
          <el-form
            ref="dataForm"
            :rules="rules"
            :inline="false"
            :model="dataForm"
            status-icon
            label-position="left"
            label-width="100px"
            class="demo-table-expand"
          >
            <el-form-item label="名称" prop="field_name">
              <el-input v-model="dataForm.field_name" placeholder="填写名称" />
            </el-form-item>
            <el-form-item label="类别" prop="model_class">
              <el-input v-model="dataForm.model_class" placeholder="填写类别" />
            </el-form-item>
            <el-form-item label="参数配置" prop="config_info">
              <el-input
                v-model="dataForm.config_info"
                :autosize="{ minRows: 4, maxRows: 6 }"
                type="textarea"
                placeholder="参数配置json格式"
              />
            </el-form-item>
            <el-form-item label="标识符" prop="remark">
              <el-input v-model="dataForm.remark" placeholder="填写标识符" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          v-if="dialogStatus == 'create'"
          type="primary"
          @click="createData"
          >确定</el-button
        >
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
    <Query />
  </div>
</template>
<script>
import {
  queryDictionary,
  addDictionary,
  editDictionary,
  deleteDictionary
  // featuredatainfo,
} from "@/api/dictionary";

import Hamburg from "@/components/ZtreePart/Hamburger";
import { getToken } from "@/utils/auth";
import { mapGetters } from "vuex";
export default {
  name: "",
  components: {
    Hamburg
  },
  data() {
    return {
      field: [],
      checked: true,
      Height: 0,
      isHeight: false,
      clientHeight: 0,
      opened: false,
      list: [], // 列表
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        model_class: "",
        field_name: undefined
      },
      fileList: [],
      dataForm: {
        field_name: "",
        model_class: "",
        config_info: "",
        remark: ""
      },
      dialogFormVisible: false,
      dialog: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "添加"
      },
      site: [],
      rules: {
        field_name: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ],
        model_class: [
          { required: true, message: "类别不能为空", trigger: "blur" }
        ],
        remark: [{ required: true, message: "标识符不能为空", trigger: "blur" }]
      }
    };
  },
  computed: {
    ...mapGetters(["user"]),
    headers() {
      return {
        token: getToken()
      };
    }
  },
  watch: {
    list: {
      handler(n) {
        this.HandleHeight();
      },
      immediate: true,
      deep: true
    },
    checked: {
      handler(n) {
        this.$emit("sub", n ? 1 : 0);
      }
    }
  },
  created() {
    this.getList();
  },
  mounted() {
    this.clientHeight = document.body.clientHeight - 205;
    this.$refs.dialog.rendered = true;
  },
  methods: {
    sub(n) {
      this.getList();
    },
    getList() {
      this.listLoading = true;
      queryDictionary(this.listQuery)
        .then(res => {
          // console.log(res);
          this.list = res.data.data;
          this.total = res.data.total;
          this.listLoading = false;
          var sanxiaSite = [];
          this.list.forEach(v => {
            sanxiaSite.push(v.model_class);
          });
          const set = new Set(sanxiaSite);
          this.site = [...set];
          this.HandleHeight();
        })
        .catch(res => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        });
    },
    // 高度计算
    HandleHeight() {
      this.$nextTick(() => {
        this.Height = this.clientHeight;
        this.isHeight = true;
        var tableHeight = 0;
        setTimeout(() => {
          tableHeight = document.querySelector(".el-table").offsetHeight + 160;
          if (tableHeight > this.clientHeight) {
            this.Height = tableHeight;
          } else {
            this.Height = this.clientHeight;
          }
        }, 200);
      });
    },
    HandlePart(id) {
      // this.listQuery.partid = id;
      // this.getList();
    },
    toggleSideBar() {
      this.opened = !this.opened;
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    // 查看
    handleQuery(row) {
      this.dataForm.sysid = row.sysid;
      const id = {
        sysid: row.sysid
      };
      featuredatainfo(id).then(res => {
        const data = res.data;
        // Query
        const fields = {};
        const field = [];
        const dataForm = this.$refs["dataForm"].fields;
        for (let i = 0; i < dataForm.length; i++) {
          fields[dataForm[i].label] = dataForm[i].prop;
        }
        for (const i in fields) {
          const value = {
            name: i,
            value: data[fields[i]] // 如果没有请求就直接从列表取row.[fields[i]]
          };
          field.push(value);
        }
        const setField = {
          field: field,
          images: null // 没有图片直接null
        };
        this.$store.dispatch("app/setField", setField);
      });
    },

    resetForm() {
      this.dataForm = {
        field_name: "",
        model_class: "",
        config_info: "[{name:'名称',value:'值'}]",
        remark: ""
      };
    },
    handleCreate() {
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
          addDictionary(this.dataForm).then(res => {
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
    escape2Html(str) {
      return str.replace(/[\\]/g, "");
    },
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row);
      this.dataForm.config_info = this.escape2Html(this.dataForm.config_info);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      editDictionary(this.dataForm).then(res => {
        this.getList();
        this.dialogFormVisible = false;
        this.$messages({
          type: "success",
          message: "更新成功"
        });
      });
    },
    handleDelete(row) {
      const data = {
        id: row.id
      };
      this.$confirms("确定删除吗?", "删除操作", {
        confirmsButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "confirmsTop"
      })
        .then(() => {
          deleteDictionary(data).then(res => {
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
    }
  }
};
</script>
<style lang="scss" scoped></style>
