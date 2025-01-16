<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-bar">
      <p class="filter-line">
        <span class="title">关键字</span>
        <span>
          <el-input
            v-model.trim="listQuery.keywords"
            v-permission="['map_querylayers:GET']"
            clearable
            placeholder="输入关键词搜索"
            style="width: 150px"
            size="small"
          />
        </span>
      </p>
      <p class="filter-line">
        <span class="title">操作类型</span>
        <el-select
          v-model="listQuery.optype"
          style="width: 120px"
          clearable
          size="small"
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in dictionary.optype"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
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
          class="fr"
          size="mini"
          round
          @click="handleFilter"
          >查找</el-button
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
      >
        <el-table-column
          align="center"
          label="操作时间"
          prop="time"
          width="160"
        />
        <el-table-column
          align="center"
          label="操作人"
          prop="p_username"
          width="150"
        />
        <el-table-column
          align="center"
          label="类型"
          prop="optype"
          width="150"
        />
        <el-table-column
          align="center"
          label="内容"
          prop="content"
          :show-overflow-tooltip="true"
        />
        <!-- <el-table-column
          align="center"
          class-name="small-padding"
          label="操作"
          width="120px"
        >
          <template slot-scope="scope">
            <el-button
              v-permission="['admin_user_log:GET']"
              type="primary"
              size="mini"
              @click="handleUpdate(scope.row)"
              >查看</el-button
            >
          </template>
        </el-table-column> -->
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
</template>
<script>
import { adminlog } from "@/api/query";
import { parseTime } from "@/utils";
import Hamburg from "@/components/ZtreePart/Hamburger";
import { getToken } from "@/utils/auth";
import { mapGetters } from "vuex";
import store from "@/store";
export default {
  name: "",
  components: {
    Hamburg
  },
  data() {
    return {
      Height: 0,
      isHeight: false,
      clientHeight: 0,
      list: [], // 列表
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        optype: "",
        keywords: "",
        stime: parseTime(
          new Date().getTime() - 3600 * 1000 * 24 * 7,
          "{y}-{m}-{d} 00:00:00"
        ),
        etime: parseTime(Date.parse(new Date()))
      },
      dataForm: {},
      dictionary: {},
      dialogFormVisible: false
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
    this.getdict();
  },
  mounted() {
    this.clientHeight = document.body.clientHeight - 205;
  },
  methods: {
    // 获取字典
    getdict() {
      store.dispatch("app/setdict").then(dict => {
        this.dictionary = {
          optype: []
        };

        Object.keys(this.dictionary).map(key => {
          this.dictionary[key] = dict.filter(
            v => v.remark == key
          )[0].config_info;
        });
      });
    },
    sub(n) {
      this.getList();
    },
    getList() {
      this.listLoading = true;
      adminlog(this.listQuery)
        .then(res => {
          this.list = res.data.material_log;
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

    toggleSideBar() {
      this.opened = !this.opened;
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },

    resetForm() {
      this.dataForm = {
        field_name: "",
        model_class: "",
        config_info: "[{name:'名称',value:'值'}]",
        remark: ""
      };
    },

    handleUpdate(row) {
      this.dataForm = Object.assign({}, row);

      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    }
  }
};
</script>
<style lang="scss" scoped></style>
