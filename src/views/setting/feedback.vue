<template>
  <div class="app-container">
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
          label="问题详情"
          show-overflow-tooltip
          prop="detail"
        />
        <el-table-column
          align="center"
          label="提交人"
          prop="uploader"
          width="120"
        />
        <el-table-column align="center" label="电话" prop="phone" width="120" />
        <el-table-column
          align="center"
          label="创建时间"
          prop="createtime"
          width="120"
        />

        <el-table-column
          align="center"
          label="处理描述"
          prop="remark"
          width="120"
          show-overflow-tooltip
        />
        <el-table-column
          align="center"
          label="处理时间"
          prop="handletime"
          width="120"
        />
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template slot-scope="{ row }">
            <el-tag :type="row.status == 1 ? 'danger' : 'success'">
              {{ row.status == 0 ? "已处理" : "未处理" }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="操作"
          class-name="small-padding"
          width="160"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status == 0"
              v-permission="['feedback_info:GET']"
              type="primary"
              size="mini"
              @click="handleUpdate(scope.row)"
              >查看</el-button
            >
            <el-button
              v-else
              v-permission="['feedback_edit_verify:GET']"
              type="primary"
              size="mini"
              @click="handleUpdate(scope.row)"
              >处理</el-button
            >
            <el-button
              v-permission="['feedback_delete:GET']"
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
      width="800px"
      top="5vh"
      :close-on-click-modal="false"
      title="处理意见反馈"
      :visible.sync="dialogFormVisible"
    >
      <div style="display: flex; justify-content: space-between;">
        <div v-if="srcList.length > 0">
          <el-image
            style="width: 160px; height: 160px"
            :src="srcList[0]"
            fit="cover"
            :preview-src-list="srcList"
          ></el-image>
          <p style="padding: 10px 0 0 0; text-align: center">
            共（{{ srcList.length }}张）
          </p>
        </div>

        <el-descriptions
          direction="vertical"
          :column="dataForm.status == 0 ? 4 : 3"
          :style="{ width: srcList.length > 0 ? '580px' : '780px' }"
          border
        >
          <el-descriptions-item
            label="提交人"
            :labelStyle="{ width: '100px' }"
            >{{ dataForm.uploader }}</el-descriptions-item
          >
          <!-- <el-descriptions-item label="联系方式">{{
            dataForm.phone
          }}</el-descriptions-item> -->
          <el-descriptions-item
            label="提交时间"
            :labelStyle="{ width: '100px' }"
            >{{ dataForm.createtime }}</el-descriptions-item
          >
          <el-descriptions-item
            v-if="dataForm.status == 0"
            label="处理时间"
            :labelStyle="{ width: '100px' }"
            >{{ dataForm.handletime }}</el-descriptions-item
          >
          <el-descriptions-item label="状态" :labelStyle="{ width: '100px' }">
            <el-tag :type="dataForm.status == 1 ? 'danger' : 'success'">
              {{ dataForm.status == 0 ? "已处理" : "未处理" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="问题描述" :span="2">
            {{ dataForm.detail }}
          </el-descriptions-item>
          <el-descriptions-item label="处理描述">
            <el-input
              v-if="dataForm.status == 1"
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="dataForm.remark"
            >
            </el-input>
            <span v-else>{{ dataForm.remark }}</span>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关闭</el-button>
        <el-button
          type="primary"
          v-if="dataForm.status == 1"
          @click="updateData"
          >处理</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  listFeedback,
  infoFeedback,
  delFeedback,
  editFeedback
} from "@/api/feedback";
import { getToken } from "@/utils/auth";
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
        limit: 10,
        keywords: ""
      },
      dataForm: {},
      dialogFormVisible: false,
      rules: {},
      srcList: []
    };
  },
  computed: {
    headers() {
      return {
        token: getToken()
      };
    }
  },
  created() {
    this.clientHeight = document.body.clientHeight - 205;
    this.resetForm();
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      listFeedback(this.listQuery)
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
        id: "",
        uploader: "",
        phone: "",
        createtime: "",
        handletime: "",
        status: "",
        detail: "",
        remark: "",
        file: ""
      };
    },
    getImage(name) {
      return `${
        process.env.VUE_APP_BASE_API
      }feedback/download?filename=${name}&token=${getToken()}`;
    },
    handleUpdate(row) {
      this.dataForm = this.assignObj(this.dataForm, row);
      this.srcList = [];
      this.imgList = eval(this.dataForm.file) || [];
      this.imgList.map(v => {
        this.srcList.push(this.getImage(v.url));
      });

      this.dialogStatus = "update";
      this.dialogFormVisible = true;
    },
    updateData() {
      console.log(this.dataForm.remark);
      if (!this.dataForm.remark || this.dataForm.remark == "") {
        this.$messages({
          type: "error",
          message: "请先填写问题处理描述!"
        });
        return false;
      }
      this.$confirms("确定处理这条意见反馈吗?", "操作提示", {
        confirmsButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "confirmsTop"
      })
        .then(() => {
          this.dataForm.status = 0;
          editFeedback(this.dataForm).then(() => {
            this.getList();
            this.dialogFormVisible = false;
            this.$messages({
              type: "success",
              message: "处理成功"
            });
          });
        })
        .catch(() => {
          this.$messages({
            type: "info",
            message: "已取消"
          });
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
          delFeedback({ id: row.id }).then(() => {
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
