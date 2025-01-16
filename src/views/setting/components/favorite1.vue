<template>
  <div class="reservoir">
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="problem">
          <div class="problem-title">
            <p class="problem-title-text">现存问题统计</p>
            <p>
              收藏水库：<span class="problem-title-num">{{
                topData.sk_total
              }}</span
              >座&nbsp;&nbsp;&nbsp;
              <!-- 问题水库：<span class="problem-title-num1">2</span>座 -->
            </p>
          </div>

          <div class="problem-content">
            <div class="patrol">
              <p class="p1 p-active">
                <span>{{ topData.data_warning }}</span
                >个
              </p>
              <p class="p2">当前预警</p>
            </div>
            <div class="blank"></div>
            <div class="patrol">
              <p class="p1 p-active">
                <span>{{ topData.yc4 }}</span
                >个
              </p>
              <p class="p2">问题事件</p>
            </div>
            <div class="patrol">
              <p class="p1 p-active">
                <span>{{ topData.xq6 }}</span
                >个
              </p>
              <p class="p2">险情事件</p>
            </div>
            <div class="patrol">
              <p class="p1">
                <span>{{ topData.sj5 }}</span
                >个
              </p>
              <p class="p2">常规事件</p>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="problem">
          <div class="problem-title">
            <p class="problem-title-text">本月运维统计</p>
          </div>

          <div class="problem-content">
            <div class="patrol">
              <p class="p1">
                <span>{{ topData.xc1 }}</span
                >个
              </p>
              <p class="p2">巡视检查</p>
            </div>
            <div class="patrol">
              <p class="p1">
                <span>{{ topData.yh3 }}</span
                >个
              </p>
              <p class="p2">养护维护</p>
            </div>
            <div class="patrol">
              <p class="p1">
                <span>{{ topData.bj2 }}</span
                >个
              </p>
              <p class="p2">水库保洁</p>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <div class="title table-title">
      <span class="dot"></span>常用水库收藏列表
    </div>

    <div class="filter-bar">
      <p class="filter-line">
        <span class="title">水库名称</span>
        <span>
          <el-input
            v-model="listQuery.partname"
            placeholder="请输入"
            clearable
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
          type="primary"
          icon="el-icon-search"
          class="fr button-mr"
          size="mini"
          round
          @click="getList"
          >查找</el-button
        >
      </p>

      <p class="filter-line">
        <el-button
          v-permission="['personal_collection_edit_sk:POST']"
          class="fr button-mr"
          icon="el-icon-edit"
          size="mini"
          round
          type="success"
          @click="handleCreate"
          >管理收藏</el-button
        >
      </p>
    </div>

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
      <el-table-column align="center" label="单位名称" prop="partname" />
      <el-table-column align="center" label="行政区划" prop="parentpartname" />
      <el-table-column
        align="center"
        label="工程规模"
        prop="gc_size"
        :formatter="typeFormat"
      />
      <el-table-column align="center" label="预警数量" prop="data_warning" />
      <el-table-column align="center" label="巡视检查" prop="xc1" />
      <el-table-column align="center" label="养护维护" prop="yh3" />
      <el-table-column align="center" label="水库保洁" prop="bj2" />
      <el-table-column align="center" label="问题事件" prop="yc4" />
      <el-table-column align="center" label="险情事件" prop="xq6" />
      <el-table-column align="center" label="常规事件" prop="sj5" />
      <el-table-column
        align="center"
        class-name="small-padding"
        label="操作"
        width="110px"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['personal_collection_delete:GET']"
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            >移除</el-button
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

    <!-- 新增水库收藏弹窗 -->
    <el-dialog
      ref="dialog"
      :close-on-click-modal="false"
      title="管理收藏"
      width="640px"
      top="10vh"
      :visible.sync="dialogFormVisible"
    >
      <div style="display: flex;justify-content: center;">
        <el-transfer
          :titles="['未选中', '已选中']"
          v-model="skCheck"
          :data="skList"
          :props="{
            key: 'partid',
            label: 'partname'
          }"
        >
        </el-transfer>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关闭</el-button>
        <el-button type="primary" @click="createData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listCollection,
  addCollection,
  topCollection,
  delCollection,
  listCollectionByPart
} from "@/api/user";
import { parseTime } from "@/utils";
import { getToken } from "@/utils/auth";
import store from "@/store";
export default {
  name: "addressBook",
  data() {
    return {
      Height: 0,
      isHeight: false,
      clientHeight: 0,
      list: [], // 列表
      total: 0,
      dictionary: {},
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        keywords: "",
        stime: parseTime(
          new Date().getTime() - 3600 * 1000 * 24 * 7,
          "{y}-{m}-{d} 00:00:00"
        ),
        etime: parseTime(Date.parse(new Date()))
      },
      skList: [],
      skCheck: [],
      dataForm: {},
      dialogFormVisible: false,
      dialog: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "添加"
      },
      rules: {},
      topData: {}
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
    this.getdict();
    this.getList();
    this.getSkList();
    this.getHead();
  },
  mounted() {
    this.clientHeight = document.body.clientHeight - 205;
    this.$refs.dialog.rendered = true;
  },
  methods: {
    sub(n) {
      this.getList();
    },

    getSkList() {
      listCollectionByPart({ islimit: 0 }).then(res => {
        this.skList = res.data.data;
      });
    },
    getHead() {
      topCollection().then(res => {
        this.topData = res.data;
      });
    },
    typeFormat(row) {
      return this.selectDictLabel(this.dictionary.project_scale, row.code);
    },
    // 获取字典
    getdict() {
      store.dispatch("app/setdict").then(dict => {
        this.dictionary = {
          project_scale: []
        };

        Object.keys(this.dictionary).map(key => {
          this.dictionary[key] = dict.filter(
            v => v.remark == key
          )[0].config_info;
        });
      });
    },
    getList() {
      this.listLoading = true;
      listCollection(this.listQuery)
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

    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },

    handleCreate() {
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },

    createData() {
      if (this.skCheck.length < 0) {
        this.$messages({
          type: "info",
          message: "请先选择水库！"
        });
        return;
      }
      addCollection({ partid_list: this.skCheck }).then(res => {
        this.getList();
        this.dialogFormVisible = false;
        this.$messages({
          type: "success",
          message: "添加成功"
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
          delCollection(data)
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
.title {
  display: flex;
  align-items: center;
  height: 24px;
  font-size: 16px;
  .dot {
    width: 4px;
    height: 20px;
    background: #557af2;
    border-radius: 2px;
    margin: 0 8px 0 0;
  }
  .lasttime {
    font-size: 14px;
    color: #c7c7c7;
    margin: 4px 0 0 10px;
  }
  .tips {
    height: 20px;
    line-height: 20px;
    color: #557af2;
    border: 1px solid #557af2;
    padding: 0 8px;
    border-radius: 12px;
    margin: 0 0 0 12px;
    font-size: 12px;
  }
}
.table-title {
  margin: 15px 0;
}
.reservoir {
  .problem {
    margin: 16px 0 0;
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #e9eaf0;
    .problem-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .problem-title-text {
        font-size: 16px;
        font-weight: bold;
      }
      .problem-title-num {
        color: #557af2;
        font-weight: bold;
      }
      .problem-title-num1 {
        color: #d95050;
        font-weight: bold;
      }
    }
    .problem-content {
      display: flex;
      align-items: center;
      padding: 20px 30px 0;
      justify-content: space-between;
      .blank {
        width: 2px;
        height: 90px;
        background: #e9eaf0;
      }
      .patrol {
        .p1 {
          margin: 12px 0 0 -3px;
          border-bottom: 1px solid #557af2;
          text-align: center;
          color: #76777a;
          span {
            font-size: 28px;
            color: #343538;
            font-weight: normal;
          }
        }
        .p2 {
          line-height: 36px;
          border-top: 1px solid #557af2;
          margin: 1px -3px 0 0;
          text-align: center;
          color: #557af2;
        }
        .p-active {
          span {
            color: #d95050;
          }
        }
      }
    }
    .problem-content1 {
      padding: 30px 40px;
    }
  }
}
</style>
