<template>
  <div class="tree-container" :style="{ height: height + 'px' }">
    <div class="title">
      <p class="title-icon"><svg-icon icon-class="list" /></p>
      <p class="title-text">行政区划</p>
    </div>

    <div class="tree-box" :style="{ height: height - 80 + 'px' }">
      <tree
        :setting="partSetting"
        :nodes="part"
        @onClick="getPartItem"
        @onCreated="handlePartCreated"
      />
    </div>
  </div>
</template>

<script>
import { listpart } from "@/api/part";
import tree from "vue-giant-tree";

export default {
  name: "partTree",
  components: {
    tree
  },
  props: {
    height: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      listLoading: false,
      part: [],
      partSetting: {
        check: {
          enable: false
        },
        data: {
          simpleData: {
            enable: true,
            idKey: "partid",
            pIdKey: "parentpart",
            rootPId: 0
          },
          key: {
            name: "partname"
          }
        },
        view: {
          showIcon: true
        },
        callback: {
          //树选择事件
          onClick: this.getPartItem
        }
      },
      partIcon: require("@/assets/images/build.png"),
      skIcon: require("@/assets/images/device.png")
    };
  },
  mounted() {
    this.getPart();
  },
  methods: {
    getPartItem(evt, treeId, treeNode) {
      this.$emit("setPartId", treeNode.partid);
    },
    handlePartCreated(ztreeObj) {
      var nodes = ztreeObj.transformToArray(ztreeObj.getNodes());
      var fristNode = nodes && nodes[0];
      ztreeObj.expandNode(fristNode);

      var exnode = ztreeObj.getNodes();
      let target = null;
      if (exnode && exnode.length > 0) {
        let nodel1 = exnode[0].children;
        if (nodel1 && nodel1.length < 0) {
          target = exnode[0];
          return;
        }
        ztreeObj.expandNode(nodel1[0]);

        let nodel2 = nodel1[0].children;
        if (nodel2 && nodel2.length > 0) {
          target = nodel2[0];

          let nodel3 = nodel2[0].children;
          if (nodel3 && nodel3.length > 0) {
            target = nodel3[0];
          }
        }
      }

      ztreeObj.selectNode(target);
      target && this.partSetting.callback.onClick(null, target.partid, target);
    },
    // 获取行政区划
    getPart() {
      this.listLoading = true;
      listpart({
        page: 1,
        limit: 10000
      })
        .then(res => {
          if (res.data.length > 0) {
            res.data.map(v => {
              v.icon = this.partIcon;
              if (v.children && v.children.length > 0) {
                v.children.map(m => {
                  m.icon = this.partIcon;
                  if (m.children && m.children.length > 0) {
                    m.children.map(k => {
                      k.icon = this.partIcon;
                      if (k.children && k.children.length > 0) {
                        k.children.map(h => {
                          h.icon = this.skIcon;
                        });
                      }
                    });
                  }
                });
              }
            });
          }

          this.part = res.data;
          this.listLoading = false;
        })
        .catch(res => {
          this.$messages({
            type: "warning",
            message: res
          });
          this.part = [];
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
