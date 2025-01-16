<template>
  <div class="ztreePart" :style="{ height: height + 'px'}">
    <el-card class="card">
      <div slot="header" style="position: relative;">
        <span>{{ name }}
          <span v-if="title != ''" class="title">（{{ title }}）</span>
        </span>
        <el-tooltip class="item" effect="dark" content="是否包含下级" placement="bottom">
          <el-checkbox v-model="checked" class="check" />
        </el-tooltip>
      </div>
      <tree :setting="setting" :nodes="part" @onClick="getuser" @onCreated="handleCreated" />
    </el-card>
  </div>
</template>

<script>
import { partlist } from '@/api/query'
import tree from 'vue-giant-tree'
export default {
  name: 'ZtreePart',
  components: {
    tree
  },
  props: {
    height: {
      type: Number,
      default: 0
    },
    parttype: {
      type: String,
      default: ''
    },
    frist: {
      default: true,
      type: Boolean
    }
  },
  data() {
    return {
      part: [],
      name: '单位树',
      title: '',
      checked: true,
      build_img: require('@/assets/images/build.png'),
      setting: {
        check: {
          enable: false
        },
        data: {
          simpleData: {
            enable: true,
            idKey: 'partid',
            pIdKey: 'parentpart',
            rootPId: 0
          },
          key: {
            name: 'partname'
          }
        },
        view: {
          showIcon: true
        }
      }
    }
  },
  watch: {
    checked: {
      handler(n) {
        this.$emit('sub', n ? 1 : 0)
      }
    }
  },
  mounted() {
    this.getpart()
  },
  methods: {
    getpart() {
      const data = {
        part_type:this.parttype ? [this.parttype] : null
      }
      partlist(data)
        .then(res => {
          this.part = res.data
          this.part.forEach((item, index) => {
            item.icon = this.build_img
          })
        })
        .catch(res => {
          this.part = []
        })
    },
    handleCreated(ztreeObj) {
      this.ztreeObj = ztreeObj
      ztreeObj.expandAll(true)
      if (this.frist) {
        var nodes = this.ztreeObj.transformToArray(this.ztreeObj.getNodes())
        var fristNode = nodes && nodes[0]
        if (fristNode) {
          ztreeObj.selectNode(fristNode)
          this.title = fristNode.partname
          this.$emit('partid', fristNode.partid)
          this.$emit('partname', fristNode.partname)
        }
      }
    },
    getuser(evt, treeId, treeNode) {
      this.title = treeNode.partname
      this.$emit('partid', treeNode.partid)
      this.$emit('partname', treeNode.partname)
    },
    refresh() {
      this.title = ''
      this.ztreeObj.cancelSelectedNode()
      this.$emit('partid', '')
      this.$emit('partname', '')
    }
  }
}
</script>

<style scoped>
  .ztreePart {
    margin-right: 10px;
    height: 100%;
    width: 100%;
  }

  .card {
    height: 100%;
    overflow-y: auto;
  }

  .card>div {
    text-align: left;
    position: relative;
  }

  .card .title {
    color: #4caf50;
    font-size: 14px
  }

  .check {
    position: absolute;
    right: -10px;
    padding: 2px 0px 3px 0;
  }

  ::-webkit-scrollbar {
    width: 4px;
    height: 0px;
    background-color: #fff;
  }

  /* ::-webkit-scrollbar {
  height: 0;
  width: 0;
  color: transparent;
} */
</style>
