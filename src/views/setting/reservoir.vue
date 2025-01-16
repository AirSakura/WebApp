<template>
  <div class="app-container">
    <div style="display: flex">
      <div class="flexPart">
        <Treepart ref="sitetree" :height="Height" @partid="HandlePart" />
      </div>
      <div class="flexMain">
        <div class="filter-bar">
          <p class="filter-line">
            <span class="title">单位名称</span>
            <span>
              <el-input
                v-model="listQuery.keywords"
                clearable
                class="filter-item"
                size="small"
                placeholder="请输入单位名称"
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
              v-permission="['admin_part_add:GET']"
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
          >
            <el-table-column align="left" label="单位名称" prop="partname" />
            <el-table-column align="left" label="单位全称" prop="fullname" />
            <el-table-column align="left" label="单位类型" prop="part_type" />
            <el-table-column align="left" label="单位编号" prop="partid" />
            <el-table-column
              align="center"
              label="操作"
              width="320"
              class-name="small-padding"
            >
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  v-permission="[
                    'sk_base_info_add:POST',
                    'sk_feature_add:POST',
                    'sk_structure_add:POST',
                    'sk_release_structure_add:POST',
                    'sk_other_structure_add:POST'
                  ]"
                >
                  <router-link
                    :to="{
                      path: '/setting/reservoir-form',
                      query: { id: scope.row.partid }
                    }"
                    >填写详情
                  </router-link>
                </el-button>

                <el-button
                  v-permission="['admin_part_info:POST']"
                  type="primary"
                  size="mini"
                  @click="handleQuery(scope.row)"
                  >查看</el-button
                >
                <el-button
                  v-permission="['admin_part_edit:GET']"
                  type="primary"
                  size="mini"
                  @click="handleUpdate(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  v-permission="['admin_part_delete:POST']"
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
      </div>
    </div>

    <!-- 表单 -->
    <el-dialog
      ref="dialog"
      class="dialog-form"
      :close-on-click-modal="false"
      :title="textMap[dialogStatus]"
      width="780px"
      top="7vh"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :inline="true"
        :rules="dialogStatus == 'create' ? rules : rules_"
        :model="dataForm"
        status-icon
        label-position="left"
        label-width="110px"
      >
        <el-form-item
          label="所属单位"
          prop="parentpart"
          v-if="dialogStatus == 'create'"
        >
          <TreeSelectPart
            ref="selztree"
            v-model="dataForm.parentpart"
            :multiple="false"
            style="width: 240px"
            @treeValue="treeValue"
          />
        </el-form-item>
        <el-form-item label="水库名称" prop="partname">
          <el-input v-model="dataForm.partname" />
        </el-form-item>
        <el-form-item label="水库全称" prop="fullname">
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

        <el-form-item label="水库域界" prop="boundary">
          <div
            style="width:540px;display:flex; justify-content: space-between;align-items: center;"
          >
            <el-input
              v-model="areaList"
              type="textarea"
              placeholder="geojson数据，如: {'type': 'FeatureCollection','features': []}"
              style="width: 450px;"
              :autosize="{ minRows: 3, maxRows: 8 }"
            />
            <el-button
              type="primary"
              @click="dialogMapArea = true"
              round
              size="mini"
              icon="el-icon-location-information"
              >地图</el-button
            >
          </div>
        </el-form-item>

        <el-form-item
          label="坐标"
          prop="boundary"
          style="display: block;"
        >
          <div
            style="width:540px;display:flex; justify-content: space-between;align-items: center;"
          >
            <el-input
              v-model="dataForm.x"
              style="width: 220px;"
              placeholder="经度"
            />
            <el-input
              v-model="dataForm.y"
              style="width: 220px;"
              placeholder="纬度"
            />
            <el-button
              type="primary"
              @click="dialogMap = true"
              round
              size="mini"
              icon="el-icon-location-information"
              >地图</el-button
            >
          </div>
        </el-form-item>
        <el-form-item label="水库简介" prop="remark">
          <el-input
            v-model="dataForm.remark"
            style="width:540px;"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 8 }"
          />
        </el-form-item>
        <div class="clearfix"></div>
        <el-form-item label="附件">
          <SingleUpload
            v-if="dialogFormVisible"
            ref="attachment"
            upload="sk_base_info/upload"
            download="sk_base_info/download"
            @setFile="getFlies"
          />
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

    <!-- 地图画区域 -->
    <latlng
      ref="skarea"
      :dialog="dialogMapArea"
      action="area"
      @close="closeMap"
      @getLatlng="getArea"
      :islatlng="islatlng"
      :area="dataForm.boundary"
    />
    <!-- 地图打点 -->
    <latlng
      ref="skmarker"
      :dialog="dialogMap"
      @close="closeMap"
      @getLatlng="getLatlng"
      :islatlng="islatlng"
      :location="[dataForm.y, dataForm.x]"
    />
    <!-- 查看 -->
    <el-dialog
      ref="dialog"
      :close-on-click-modal="false"
      title=""
      width="900px"
      top="8vh"
      :visible.sync="dialogCheck"
    >
      <el-descriptions title="" style="width: 660px;">
        <el-descriptions-item label="水库名称">{{
          dataForm.partname
        }}</el-descriptions-item>
        <el-descriptions-item label="水库全称">{{
          dataForm.fullname
        }}</el-descriptions-item>
      </el-descriptions>

      <location
        :showMap="dialogCheck"
        :isArea="true"
        :location="[dataForm.y, dataForm.x]"
        :geoJson="dataForm.boundary"
        :area="dataForm.boundary || []"
      />

      <div slot="footer" class="dialog-footer">
        <el-button round @click="dialogCheck = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listpart,
  addpart,
  editpart,
  delpart,
  infopart,
  listpartbypid
} from "@/api/part";
import Treepart from "@/components/ZtreePart/part.vue";
import Latlng from "@/components/Maps/components/latlng";
import Location from "@/components/Maps/components/location";
import SingleUpload from "@/components/Uploads/single";
import { mapGetters } from "vuex";
import store from "@/store";
import { getToken } from "@/utils/auth";
export default {
  components: {
    Treepart,
    Latlng,
    Location,
    SingleUpload
  },
  data() {
    return {
      Height: 0,
      isHeight: false,
      islatlng: false,
      clientHeight: 0,
      opened: false,
      list: [],
      province: [],
      total: 0,
      listLoading: false,
      areaList: "",
      listQuery: {
        page: 1,
        limit: 10,
        partid: null,
        keywords: undefined,
        sort: "add_time",
        order: "desc",
        part_type: "水库",
        sub_status: 1
      },
      dataForm: {},
      dialogFormVisible: false,
      dialogMap: false,
      dialogMapArea: false,
      dialogCheck: false,
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
    // this.getList();
  },
  methods: {
    onClose() {
      this.$refs.attachment.clearFiles();
      this.dialogFormVisible = false;
    },
    getFlies(data) {
      this.dataForm.attachfiles = data;
    },
    getImage(name) {
      return `${
        process.env.VUE_APP_BASE_API
      }sk_base_info/download?filename=${name}&token=${getToken()}`;
    },
    getArea(v) {
      this.areaList = JSON.stringify(v);
      this.dataForm.boundary = v;
    },
    getLatlng(latlng) {
      this.dataForm.x = Number(latlng[1]);
      this.dataForm.y = Number(latlng[0]);
    },
    closeMap() {
      this.dialogMap = false;
      this.dialogMapArea = false;
    },
    // 根据行政区查询水库信息
    HandlePart(id) {
      this.listQuery.partid = id;
      this.getList();
    },
    // 查
    getList() {
      this.listLoading = true;
      listpartbypid(this.listQuery)
        .then(res => {
          this.list = res.data.data;
          this.total = res.data.total;
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
          tableHeight =
            document.querySelector(".table-container").offsetHeight +
            document.querySelector(".filter-bar").offsetHeight +
            20;
          if (tableHeight > this.clientHeight) {
            this.Height = tableHeight;
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

    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    resetForm() {
      this.areaList = "";
      this.dataForm = {
        partid: "",
        partname: null,
        parentpart: null,
        part_type: "水库",
        fullname: null,
        person: null,
        userpwd: null,
        phone: null,
        boundary: [],
        x: 111.29957199096681,
        y: 30.730137900314173,
        remark: "",
        status: 1,
        order_index: 999,
        attachfiles: []
      };
    },
    handleCreate() {
      this.resetForm();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.islatlng = false;
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

          addpart(this.dataForm).then(res => {
            this.$confirms("是否完善水库信息?", "操作提示", {
              confirmsButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
              customClass: "confirmsTop"
            })
              .then(() => {
                // 需要新增成功后后台返回id
                this.$router.push({
                  path: "/setting/reservoir-form",
                  query: { id: res.data.partid }
                });
              })
              .catch(() => {
                this.getList();
                this.dialogFormVisible = false;
                this.$messages({
                  type: "success",
                  message: "添加成功"
                });
              });
          });
        }
      });
    },
    handleUpdate(row) {
      const id = {
        partid: row.partid
      };
      infopart(id).then(res => {
        var data = res.data.partinfo;
        this.dataForm = this.assignObj(this.dataForm, data);
        this.areaList = this.dataForm.boundary;
        this.dataForm.boundary = eval(this.dataForm.boundary) || [];
        this.dialogStatus = "update";
        this.dialogFormVisible = true;
        this.islatlng = true;
        this.$nextTick(() => {
          this.$refs.attachment.fileBack(this.dataForm.attachfiles);
          this.$refs.selztree && this.$refs.selztree.getpart();
          this.$refs["dataForm"].clearValidate();
        });
      });
    },

    handleQuery(row) {
      infopart({
        partid: row.partid
      }).then(res => {
        this.dataForm = this.assignObj(this.dataForm, res.data.partinfo);
        this.areaList = this.dataForm.boundary;
        this.dataForm.boundary = eval(this.dataForm.boundary) || [];
        this.dialogCheck = true;
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
          delpart(data)
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
.dialog-form {
  /deep/.el-form-item__content {
    width: 240px;
  }
}
</style>
