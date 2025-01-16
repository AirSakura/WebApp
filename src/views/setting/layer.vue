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
          v-permission="['admin_role_list:POST']"
          icon="el-icon-edit"
          round
          size="small"
          type="success"
          @click="handleCreate"
          >添加</el-button
        >
      </p>
    </div>

    <!-- 查询结果 -->
    <div class="table-container" :style="{ 'min-height': clientHeight + 'px' }">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="正在查询中。。。"
        border
        fit
        stripe
        highlight-current-row
      >
        <el-table-column
          align="center"
          label="图层名称"
          prop="layername"
          width="180"
        />
        <el-table-column
          align="center"
          label="图层编号"
          prop="layerid"
          width="180"
        />
        <el-table-column align="center" label="地图服务" prop="serverconfig" />
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template slot-scope="{ row }">
            <el-tag :type="row.status == 0 ? 'danger' : 'success'">
              {{ row.status == 0 ? "不可用" : "可用" }}
            </el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column
        align="center"
        label="图层备注"
        prop="remark"
        width="130"
      /> -->
        <el-table-column
          align="center"
          label="操作"
          class-name="small-padding"
          width="160"
        >
          <template slot-scope="scope">
            <el-button
              v-permission="['map_editlayer:GET']"
              type="text"
              size="medium"
              @click="handleUpdate(scope.row)"
              >编辑</el-button
            >
            <el-button
              v-permission="['map_deletelayer:GET']"
              type="text"
              size="medium"
              style="color: red;"
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
      width="700px"
      top="3vh"
      :close-on-click-modal="false"
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :inline="false"
        :rules="rules"
        :model="dataForm"
        status-icon
        label-position="left"
        label-width="120px"
      >
        <el-form-item label="图层名称" prop="layername">
          <el-input v-model="dataForm.layername" placeholder="请输入图层名称" />
        </el-form-item>
        <el-form-item label="图层编号" prop="layerid">
          <el-input v-model="dataForm.layerid" placeholder="请输入图层编号" />
        </el-form-item>
        <el-form-item label="图层字段" prop="fieldslist">
          <el-input
            v-model="dataForm.fieldslist"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入图层字段"
          />
        </el-form-item>
        <el-form-item label="地图服务访问" prop="serverconfig">
          <el-input
            v-model="dataForm.serverconfig"
            placeholder="请输入地图服务访问地址,Json数据"
          />
        </el-form-item>
        <el-form-item label="权限控制字段" prop="authfieldname">
          <el-input
            v-model="dataForm.authfieldname"
            placeholder="如果设置自动将开启授权模式进行图层数据限制.."
          />
        </el-form-item>
        <el-form-item label="权限控制方式" prop="authfieldtype">
          <el-select
            v-model="dataForm.authfieldtype"
            clearable
            style="width: 100%"
            placeholder="选择方式"
          >
            <el-option label="必须相等" :value="0" />
            <el-option label="当前及下级" :value="1" />
            <el-option label="当前及上级" :value="-1" />
          </el-select>
        </el-form-item>
        <el-form-item label="图层数据数量" prop="geocount">
          <el-input
            v-model="dataForm.geocount"
            placeholder="请输入图层数据数量"
          />
        </el-form-item>
        <el-form-item label="WKID" prop="wkid">
          <el-input v-model="dataForm.wkid" placeholder="请输入WKID" />
        </el-form-item>
        <el-form-item label="最小X坐标" prop="xmin">
          <el-input v-model="dataForm.xmin" placeholder="请输入xmin" />
        </el-form-item>
        <el-form-item label="最大X坐标" prop="xmax">
          <el-input v-model="dataForm.xmax" placeholder="请输入xmax" />
        </el-form-item>
        <el-form-item label="最小Y坐标" prop="ymin">
          <el-input v-model="dataForm.ymin" placeholder="请输入ymin" />
        </el-form-item>
        <el-form-item label="最大Y坐标" prop="ymax">
          <el-input v-model="dataForm.ymax" placeholder="请输入ymax" />
        </el-form-item>
        <el-form-item label="空间数据库访问" prop="gisdbconfig">
          <el-input
            v-model="dataForm.gisdbconfig"
            placeholder="请输入空间数据库"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="dataForm.status"
            clearable
            style="width: 100%"
            placeholder="选择状态"
          >
            <el-option label="可用" :value="1" />
            <el-option label="不可用" :value="0" />
          </el-select>
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
  </div>
</template>

<script>
import { addlayer, editlayer, deletelayer, querylayer } from "@/api/layer";
export default {
  name: "Layer",
  data() {
    return {
      clientHeight: 0,
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        layerclass: undefined,
        layertype: "",
        sharetype: "",
        name: undefined,
        sort: "add_time",
        order: "desc"
      },
      dataForm: {
        layerid: "",
        layername: "",
        fieldslist: "",
        serverconfig: "",
        authfieldname: "",
        authfieldtype: "",
        xmax: "",
        xmin: "",
        ymax: "",
        ymin: "",
        geocount: "",
        wkid: "",
        gisdbconfig: "",
        status: 1
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "添加"
      },
      rules: {
        layerid: [
          { required: true, message: "图层编号不能为空", trigger: "blur" }
        ],
        layername: [
          { required: true, message: "图层名称不能为空", trigger: "blur" }
        ],
        serverconfig: [
          { required: true, message: "地图服务不能为空", trigger: "blur" }
        ],
        fieldslist: [
          { required: true, message: "图层字段不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.clientHeight = document.body.clientHeight - 205;
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      querylayer(this.listQuery)
        .then(res => {
          this.list = res.data.data;
          this.total = res.data.total || 0;
          this.listLoading = false;
        })
        .catch(res => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    resetForm() {
      this.dataForm = {
        layerid: "",
        layername: "",
        fieldslist: "",
        serverconfig: "",
        authfieldname: "",
        authfieldtype: "",
        xmax: "",
        xmin: "",
        ymax: "",
        ymin: "",
        geocount: "",
        wkid: "",
        gisdbconfig: "",
        status: 1
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
          addlayer(this.dataForm)
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
      this.dataForm = Object.assign({}, row);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          editlayer(this.dataForm)
            .then(() => {
              this.getList();
              this.dialogFormVisible = false;
              this.$messages({
                type: "success",
                message: "更新成功"
              });
            })
            .catch(res => {});
        }
      });
    },
    handleDelete(row) {
      const delPara = { layerid: row.layerid };
      this.$confirms("确定删除吗?", "删除操作", {
        confirmsButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "confirmsTop"
      })
        .then(() => {
          deletelayer(delPara).then(() => {
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
<style></style>
