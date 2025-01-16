<template>
  <div
    class="tree-container"
    :style="{
      height: height + 'px',
      'margin-top': mt + 'px'
    }"
  >
    <div class="title">
      <p class="title-icon"><svg-icon icon-class="list" /></p>
      <p class="title-text">站点设备</p>
    </div>

    <div class="tree-box" :style="{ height: height - 80 + 'px' }">
      <tree
        :setting="setting"
        :nodes="site"
        @onClick="getItem"
        @onCreated="handleCreated"
      />
    </div>
  </div>
</template>

<script>
import { deviceTree } from "@/api/security";
import tree from "vue-giant-tree";

export default {
  name: "siteTree",
  components: {
    tree
  },
  props: {
    height: {
      type: Number,
      default: 0
    },
    mt: {
      type: Number,
      default: 10
    },
    type: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      listLoading: false,
      site: [],
      setting: {
        check: {
          enable: false
        },
        data: {
          simpleData: {
            enable: true,
            idKey: "id",
            pIdKey: "parent",
            rootPId: 0
          },
          key: {
            name: "name"
          }
        },
        view: {
          showIcon: true
        },
        callback: {
          //树选择事件
          onClick: this.getItem
        }
      },
      siteIcon: require("@/assets/images/site.png"),
      sensorIcon: require("@/assets/images/sensor.png")
    };
  },
  methods: {
    // 设备选中
    getItem(evt, treeId, treeNode) {
      console.log(treeNode.status);
      if (treeNode.status == 1) return;
      this.$emit("setSiteId", treeNode.id, treeNode.name, treeNode.sensor_code);
    },
    handleCreated(ztreeObj) {
      this.ztreeObj = ztreeObj;
      var nodes = this.ztreeObj.transformToArray(this.ztreeObj.getNodes());
      var fristNode = nodes && nodes[0];
      ztreeObj.expandNode(fristNode);

      var exnode = ztreeObj.getNodes();
      let target = exnode[0];
      if (exnode && exnode.length > 0) {
        let nodel1 = exnode[0].children;
        if (nodel1 && nodel1.length < 0) {
          target = exnode[0];
          return;
        } else {
          target = nodel1[0];
        }
      }
      ztreeObj.selectNode(target);
      target && this.setting.callback.onClick(null, target.id, target);
    },
    // 站点循环添加图片
    // 获取站点数组图
    getSite(id) {
      this.listLoading = true;
      deviceTree({
        partid: id,
        device_type: this.type
      })
        .then(({ data }) => {
          if (data.length > 0) {
            data.map(v => {
              v.icon = this.siteIcon;
              if (v.children.length > 0) {
                v.children.map(m => {
                  m.icon = this.sensorIcon;
                  delete m.children;
                });
              }
            });
          }
          this.site = data;
          this.listLoading = false;
        })
        .catch(res => {
          this.$messages({
            type: "warning",
            message: res
          });
          this.site = [];
          this.listLoading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.tree-container {
  padding: 20px;
  background: #fff;
  overflow: hidden;
  border-radius: 8px;
  margin-right: 10px;
}
.title {
  display: flex;
  align-items: center;
  color: #fff;
  .title-icon {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: #557af2;
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 8px 0 0;
  }
  .title-text {
    font-size: 16px;
    font-weight: bold;
    color: #000;
  }
}

.tree-box {
  margin: 20px auto 0;
  overflow-y: auto;
}
</style>
