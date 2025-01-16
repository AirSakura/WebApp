<template>
  <div class="app-container">
    <div class="filter-bar">
      <p class="filter-line">
        <span class="title">通知标题</span>
        <span>
          <el-input
            v-model="listQuery.keywords"
            clearable
            placeholder="输入关键词搜索"
            @keyup.enter.native="handleFilter"
            size="small"
          />
        </span>
      </p>
      <p class="filter-line">
        <span class="title">时间范围</span>
        <span class="filter-time-box">
          <el-date-picker
            v-model="listQuery.stime"
            type="datetime"
            placeholder="选择日期时间"
            size="small"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
          <span>-</span>
          <el-date-picker
            v-model="listQuery.etime"
            type="datetime"
            size="small"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </span>
      </p>
      <p class="filter-line">
        <el-button
          round
          type="primary"
          class="fr"
          icon="el-icon-search"
          size="mini"
          @click="handleFilter"
          >查找</el-button
        >
      </p>
      <p class="filter-line">
        <el-button
          v-permission="['inform_add:POST']"
          icon="el-icon-edit"
          class="fr"
          round
          type="success"
          size="mini"
          @click="handleCreate(0)"
          >添加</el-button
        >
      </p>
    </div>
    <div class="table-container" :style="{ 'min-height': clientHeight + 'px' }">
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
        <el-table-column align="center" label="通知标题" prop="notice_title" />
        <el-table-column
          align="center"
          label="通知内容"
          prop="notice_content"
        />
        <el-table-column align="center" label="通知对象" prop="nickname" />
        <el-table-column align="center" label="是否需要反馈">
          <template slot-scope="scope">{{
            scope.row.feedback == 0 ? "否" : "是"
          }}</template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">{{
            scope.row.status | statusNotice
          }}</template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" prop="create_time" />
        <el-table-column
          align="center"
          width="190px"
          class-name="small-padding"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              v-permission="['inform_info:GET']"
              type="primary"
              size="mini"
              icon="el-icon-search"
              @click="handleCheck(scope.row)"
              >查看</el-button
            >
            <!-- <el-button
              v-permission="['inform_edit:POST']"
              type="primary"
              size="mini"
              icon="el-icon-setting"
              @click="handleUpdate(scope.row)"
              >编辑</el-button
            > -->
            <el-button
              v-permission="['inform_delete:GET']"
              type="danger"
              size="mini"
              icon="el-icon-delete"
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

    <!-- 编辑表单 -->
    <el-dialog
      ref="dialog"
      class="dialog-form"
      :close-on-click-modal="false"
      :title="textMap[dialogStatus]"
      width="720px"
      top="8vh"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :inline="true"
        :model="dataForm"
        label-position="left"
        label-width="120px"
      >
        <el-form-item label="通知标题" prop="notice_title">
          <el-input
            class="input-unit"
            style="width:538px"
            v-model.trim="dataForm.notice_title"
            placeholder="请输入"
          />
        </el-form-item>

        <div class="clearfix"></div>
        <el-form-item label="通知对象" prop="user_id">
          <el-select v-model="dataForm.user_id" filterable placeholder="请选择">
            <el-option
              v-for="item in userlist"
              :label="item.nickname"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否需要反馈" prop="feedback">
          <el-select v-model="dataForm.feedback" placeholder="请选择">
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>

        <div class="clearfix"></div>
        <el-form-item label="通知内容" prop="notice_content">
          <el-input
            class="input-unit"
            type="textarea"
            v-model.trim="dataForm.notice_content"
            placeholder="请输入"
            style="width:538px"
            :rows="4"
          />
        </el-form-item>

        <el-form-item label="附件" prop="name">
          <SingleUpload
            v-if="dialogFormVisible"
            ref="attachment"
            upload="inform/upload"
            download="inform/download"
            :isImg="false"
            @setFile="getFlies"
            :suffix="['pdf', 'doc', 'docx']"
          />
        </el-form-item>
        <div class="clearfix"></div>
        <el-form-item label="图片" prop="name">
          <MultipleUpload
            v-if="dialogFormVisible"
            ref="imglist"
            upload="inform/upload"
            download="inform/download"
            @setFile="getImgs"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button round @click="onClose">取消</el-button>
        <el-button
          v-if="dialogStatus == 'create'"
          type="primary"
          round
          @click="createData"
          >确定</el-button
        >
        <el-button v-else type="primary" round @click="updateData"
          >确定</el-button
        >
      </div>
    </el-dialog>

    <!-- 查看表单 -->
    <el-dialog
      ref="dialog"
      :close-on-click-modal="false"
      title=""
      width="860px"
      top="8vh"
      :visible.sync="dialogCheck"
    >
      <el-tabs v-model="activeCheck">
        <el-tab-pane label="通知详情" name="base">
          <div style="display: flex; justify-content: space-between;">
            <div v-if="srcList.length > 0">
              <el-image
                style="width: 160px; height: 160px"
                :src="srcList[0]"
                fit="cover"
                :preview-src-list="srcList"
              ></el-image>
              <p style="padding: 10px 0 0 0; text-align: center">
                {{ dataForm.notice_title }}（{{ srcList.length }}张）
              </p>
            </div>

            <el-descriptions
              direction="vertical"
              :column="5"
              :style="{ width: srcList.length > 0 ? '640px' : '840px' }"
              border
            >
              <el-descriptions-item label="通知标题">{{
                dataForm.notice_title
              }}</el-descriptions-item>
              <el-descriptions-item label="通知对象">{{
                dataForm.nickname
              }}</el-descriptions-item>
              <el-descriptions-item label="通知附件">
                <el-button
                  type="primary"
                  size="mini"
                  @click="handleDownload"
                  round
                  >下载附件</el-button
                >
              </el-descriptions-item>
              <el-descriptions-item label="通知时间">{{
                dataForm.create_time
              }}</el-descriptions-item>
              <el-descriptions-item label="反馈状态">
                <el-tag type="primary">
                  {{ dataForm.status | statusNotice }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="通知内容">
                {{ dataForm.notice_content }}
              </el-descriptions-item>
              <el-descriptions-item
                label="反馈内容"
                v-if="dataForm.status == 3"
              >
                {{ dataForm.feedback_content }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-tab-pane>
      </el-tabs>

      <div slot="footer" class="dialog-footer">
        <el-button round @click="dialogCheck = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listInform,
  delInform,
  addInform,
  editInform,
  userInform
} from "@/api/notice";
import Hamburg from "@/components/ZtreePart/Hamburger";
import SingleUpload from "@/components/Uploads/single";
import MultipleUpload from "@/components/Uploads/multiple";
import { getToken } from "@/utils/auth";
import { parseTime } from "@/utils";
import store from "@/store";
export default {
  components: {
    Hamburg,
    SingleUpload,
    MultipleUpload
  },
  data() {
    return {
      Height: 0,
      isHeight: false,
      islatlng: false,
      tmpLoading: false,
      activeCheck: "base",
      clientHeight: 0,
      dialogMap: false,
      dictionary: [],
      imgload: false,
      fileList: [],
      imgList: [],
      srcList: [],
      listQuery: {
        page: 1,
        limit: 10
        // keywords: "",
        // stime: parseTime(
        //   new Date().getTime() - 3600 * 1000 * 24 * 7,
        //   "{y}-{m}-{d} 00:00:00"
        // ),
        // etime: parseTime(Date.parse(new Date()))
      },
      textMap: {
        update: "编辑记录",
        create: "添加记录"
      },
      total: 0,
      listLoading: false,
      list: [], // 列表
      userlist: [],
      dataForm: {},
      dialogFormVisible: false,
      dialogCheck: false,
      dialogStatus: "",
      rules: {
        notice_title: [
          { required: true, message: "通知标题不能为空", trigger: "blur" }
        ],
        user_id: [
          { required: true, message: "通知对象不能为空", trigger: "blur" }
        ],
        notice_content: [
          { required: true, message: "通知内容不能为空", trigger: "blur" }
        ],
        feedback: [
          {
            required: true,
            message: "通知内容是否需要反馈不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
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
  created() {
    this.resetForm();
    this.getdict();
    this.getUserList();

    this.$nextTick(() => {
      this.getList();
    });
  },
  mounted() {
    this.clientHeight = document.body.clientHeight - 205;
  },
  methods: {
    getImage(name) {
      return `${
        process.env.VUE_APP_BASE_API
      }inform/download?filename=${name}&token=${getToken()}`;
    },
    handleDownload() {
      let video;
      if (this.dataForm.attachment.length > 0) {
        video = JSON.parse(this.dataForm.attachment);
        window.open(this.getImage(video[0].url));
      }
    },
    getUserList() {
      userInform().then(res => {
        this.userlist = res.data;
      });
    },
    getList() {
      this.listLoading = true;
      this.listQuery.partid = this.$store.state.user.currentsk;
      listInform(this.listQuery)
        .then(res => {
          this.list = res.data.data;
          this.total = res.data.total;
          this.listLoading = false;
          this.HandleHeight();
        })
        .catch(res => {
          this.$messages({
            type: "warning",
            message: res
          });
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        });
    },

    handleCheck(val) {
      this.srcList = [];
      this.dataForm = Object.assign(this.dataForm, val);
      if (this.dataForm.photo && this.dataForm.photo.length > 0) {
        this.imgList = JSON.parse(this.dataForm.photo);
        this.imgList.map(v => {
          this.srcList.push(this.getImage(v.url));
        });
      }
      this.activeCheck = "base";
      this.dialogCheck = true;
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
    // 获取字典
    getdict() {
      store.dispatch("app/setdict").then(dict => {
        this.dictionary = {
          reservoir_class: []
        };

        Object.keys(this.dictionary).map(key => {
          this.dictionary[key] = dict.filter(
            v => v.remark == key
          )[0].config_info;
        });
      });
    },
    resetForm() {
      this.dataForm = {
        id: "",
        notice_title: "",
        user_id: "",
        partid: this.$store.state.user.currentsk,
        notice_content: "",
        feedback: "", //是否需要反馈;0否;1 是
        feedback_content: "",
        photo: [],
        status: 0,
        attachment: []
      };
    },

    getFlies(data) {
      this.dataForm.attachment = data;
    },
    getImgs(data) {
      this.dataForm.photo = data;
    },

    onClose() {
      this.$refs.attachment.clearFiles();
      this.$refs.imglist.clearFiles();
      this.dialogFormVisible = false;
    },

    handleCreate() {
      this.resetForm();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.islatlng = false;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },

    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$confirms(
            "通知发送后将无法修改，请确认信息填写无误！",
            "删除操作",
            {
              confirmsButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
              customClass: "confirmsTop"
            }
          )
            .then(() => {
              addInform(this.dataForm).then(res => {
                this.getList();
                this.onClose();
                this.$messages({
                  type: "success",
                  message: "添加成功"
                });
              });
            })
            .catch(() => {
              this.$messages({
                type: "info",
                message: "已取消"
              });
            });
        }
      });
    },
    handleUpdate(row) {
      this.resetForm();
      this.dataForm = this.assignObj(this.dataForm, row);

      this.dialogStatus = "update";
      this.islatlng = true;
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs.attachment.fileBack(this.dataForm.attachment);
        this.$refs.imglist.fileBack(this.dataForm.photo);
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          editInform(this.dataForm)
            .then(res => {
              this.getList();
              this.onClose();
              this.$messages({
                type: "success",
                message: "修改成功"
              });
            })
            .catch(res => {
              this.$messages({
                type: "warning",
                message: "修改失败"
              });
            });
        }
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
          delInform(data)
            .then(res => {
              this.$messages({
                type: "success",
                message: "删除成功"
              });
              this.getList();
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
  }
};
</script>
<style lang="scss" scoped>
.input-unit {
  width: 220px;
}
</style>
