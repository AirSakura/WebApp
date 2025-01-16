<template>
  <div class="app-container">
    <div class="filter-bar">
      <p class="filter-line">
        <span class="title">名称</span>
        <span>
          <el-input
            v-model="listQuery.keywords"
            clearable
            class="filter-item"
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
          v-permission="['admin_part_add:POST']"
          icon="el-icon-edit"
          round
          size="small"
          type="success"
          @click="handleCreate"
          >添加</el-button
        >
      </p>
    </div>

    <div class="table-container" :style="{ 'min-height': clientHeight + 'px' }">
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        element-loading-text="正在查询中。。。"
        :tree-props="{ children: 'children' }"
        :default-expand-all="true"
        row-key="partid"
      >
        <el-table-column
          align="left"
          label="名称"
          prop="partname"
          width="320"
        />
        <el-table-column
          align="left"
          label="单位全称"
          prop="fullname"
          width="300"
        />
        <el-table-column align="left" label="类型" prop="part_type" />
        <el-table-column align="left" label="编号" prop="partid" />
        <el-table-column
          align="center"
          label="操作"
          width="230"
          class-name="small-padding"
        >
          <template slot-scope="scope">
            <template v-if="scope.row.partid == '00'">
              <el-button
                type="info"
                plain
                style="width: 85px;"
                disabled
                size="mini"
                >无法操作</el-button
              >
            </template>
            <template v-else>
              <el-button
                v-permission="['admin_part_info:GET']"
                type="primary"
                size="mini"
                @click="handleQuery(scope.row)"
                >查看</el-button
              >
              <el-button
                v-permission="['admin_part_edit:POST']"
                type="primary"
                size="mini"
                @click="handleUpdate(scope.row)"
                >编辑</el-button
              >
              <el-button
                v-permission="['admin_part_delete:GET']"
                type="danger"
                size="mini"
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

    <el-dialog
      ref="dialog"
      :close-on-click-modal="false"
      :title="textMap[dialogStatus]"
      width="600px"
      top="5vh"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="dialogStatus == 'create' ? rules : rules_"
        :model="dataForm"
        status-icon
        label-position="left"
        label-width="110px"
      >
        <el-form-item
          label="上级单位"
          prop="parentpart"
          v-if="dialogStatus == 'create'"
        >
          <TreeSelectPart
            ref="selztree"
            v-model="dataForm.parentpart"
            :multiple="false"
            :width="'450'"
            style="width: 100%"
            @treeValue="treeValue"
          />
        </el-form-item>
        <el-form-item label="单位名称" prop="partname">
          <el-input v-model="dataForm.partname" />
        </el-form-item>
        <el-form-item label="单位全称" prop="fullname">
          <el-input v-model="dataForm.fullname" />
        </el-form-item>

        <template v-if="dialogStatus == 'create'">
          <el-form-item label="管理员名称" prop="person">
            <el-input v-model="dataForm.person" />
          </el-form-item>
          <el-form-item label="管理员密码" prop="userpwd">
            <el-input v-model="dataForm.userpwd" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="dataForm.phone" placeholder="登录账号" />
          </el-form-item>
        </template>
        <el-form-item label="单位简介" prop="remark">
          <el-input
            v-model="dataForm.remark"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 8 }"
          />
        </el-form-item>

        <el-form-item
          v-if="dataForm.part_type == '水库'"
          label="单位辖区"
          prop="boundary"
        >
          <el-input
            v-model="dataForm.boundary"
            type="textarea"
            placeholder="geojson数据，如: {'type': 'FeatureCollection','features': []}"
            style="width: 100%"
            :autosize="{ minRows: 3, maxRows: 8 }"
          />
        </el-form-item>

        <el-form-item
          v-if="dataForm.part_type == '水库'"
          label="坐标"
          prop="boundary"
        >
        </el-form-item>

        <el-form-item label="排序" prop="order_index">
          <el-input v-model="dataForm.order_index" />
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

    <Query />
  </div>
</template>
<script>
import { listpart, addpart, editpart, delpart, infopart } from "@/api/part";
import { mapGetters } from "vuex";
import store from "@/store";
import { getToken } from "@/utils/auth";
export default {
  name: "Part",
  data() {
    return {
      Height: 0,
      isHeight: false,
      clientHeight: 0,
      opened: false,
      list: [],
      province: [],
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        partid: null,
        // keywords: "",
        part_type: "行政区"
      },
      dataForm: {},
      dictionary: {},
      dialogFormVisible: false,
      dialogStatus: null,
      textMap: {
        update: "编辑",
        create: "添加"
      },
      rules: {
        partname: [
          {
            required: true,
            message: "名称不能为空",
            trigger: "blur"
          }
        ],
        fullname: [
          {
            required: true,
            message: "全称不能为空",
            trigger: "blur"
          }
        ],
        person: [
          {
            required: true,
            message: "管理员名称不能为空",
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            message: "管理员手机号不能为空",
            trigger: "blur"
          }
        ],
        userpwd: [
          {
            required: true,
            message: "管理员密码不能为空",
            trigger: "blur"
          }
        ]
      },
      rules_: {
        partname: [
          {
            required: true,
            message: "名称不能为空",
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
  created() {
    this.resetForm();
    this.getList();
  },
  methods: {
    // 查
    getList() {
      this.listLoading = true;
      listpart(this.listQuery)
        .then(res => {
          this.list = res.data;
          this.total = 0;
          this.listLoading = false;
          this.HandleHeight();
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
          tableHeight = document.querySelector(".el-table").offsetHeight + 160;
          if (tableHeight > this.clientHeight) {
            this.Height = tableHeight;
          } else {
            this.Height = this.clientHeight;
          }
        }, 200);
      });
    },

    toggleSideBar() {
      this.opened = !this.opened;
    },
    treeValue(part) {
      this.dataForm.parentpart = part;
    },
    getdict() {
      store.dispatch("app/setdict").then(dict => {
        const name = ["part_type"];
        const value = ["单位类型"];
        value.forEach((item, i) => {
          this.dictionary[name[i]] = dict.filter(
            v => v.field_name == item
          )[0].config_info;
        });
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    resetForm() {
      this.dataForm = {
        partname: null,
        parentpart: null,
        part_type: "行政区",
        fullname: null,
        person: null,
        userpwd: null,
        phone: null,
        boundary: null,
        x: 0,
        y: 0,
        remark: "",
        status: 1,
        order_index: 999
      };
    },
    handleCreate() {
      this.resetForm();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs.selztree && this.$refs.selztree.getpart();
        this.$refs["dataForm"].clearValidate();
      });
    },
    // 增
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          // this.dataForm.boundary = this.dataForm.boundary.replace(/[n]/g, '')
          // this.dataForm.boundary = this.dataForm.boundary.replace(/[\\]/g, '')
          // this.dataForm.boundary = this.dataForm.boundary.replace(/\s*/g,"")
          addpart(this.dataForm)
            .then(res => {
              this.getList();
              this.dialogFormVisible = false;
              this.$messages({
                type: "success",
                message: "添加成功"
              });
            })
            .catch(res => {});
        }
      });
    },
    handleUpdate(row) {
      const id = {
        partid: row.partid
      };
      infopart(id).then(res => {
        var data = res.data.partinfo;
        this.dataForm = Object.assign({}, data);
        // if (this.dataForm.boundary) {
        //   this.dataForm.boundary = this.dataForm.boundary.replace(/(\||\n|\\n)/g, "").replace(/(\\)/g, "")
        //     .replace(/\s*/g, "")
        // }
        this.dialogStatus = "update";
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs.selztree && this.$refs.selztree.getpart();
          this.$refs["dataForm"].clearValidate();
        });
      });
    },

    handleQuery(row) {
      const id = {
        partid: row.partid
      };
      infopart(id).then(res => {
        const data = res.data.partinfo;
        const fields = {};
        let field = [];
        const dataForm = this.$refs["dataForm"].fields;
        console.log(dataForm);
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
        field = field.filter(
          ele => ele.name != "上级单位" && ele.name != "行政界"
        );
        const setField = {
          field: field,
          images: null
        };
        this.$store.dispatch("app/setField", setField);
      });
    },

    // 改
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          editpart(this.dataForm).then(() => {
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
    // 删
    handleDelete(row) {
      const data = {
        partid: row.partid
      };
      this.$confirms("确定删除吗?", "删除操作", {
        confirmsButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "confirmsTop"
      })
        .then(() => {
          delpart(data).then(res => {
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
