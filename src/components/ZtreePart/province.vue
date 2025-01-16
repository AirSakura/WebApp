<template>
  <div class="ztreePart" :style="{ height: height + 'px'}">
    <el-card class="BoxCard">
      <div slot="header" style="text-align: left;position: relative;">
        <span>行政区
          <span
            v-if="title != ''"
            style="color: #4caf50; font-size: 14px"
          >（{{ title }}）</span></span>
        <el-button
          v-if="refreshs"
          style="position: absolute;right: -10px;padding: 2px 0px 3px 0;"
          type="text"
          @click="refresh()"
        >刷新</el-button>
      </div>
      <tree
        :setting="setting"
        :nodes="Province"
        @onClick="getuser"
        @onCreated="handleCreated"
      />
    </el-card>
  </div>
</template>

<script>
import { boundarytree } from '@/api/query'
import { scrollTo } from '@/utils/scroll-to-tree'
import tree from 'vue-giant-tree'
export default {
  name: 'ZtreeWard',
  components: {
    tree
  },
  props: {
    height: {
      type: Number,
      default: 0
    },
    frist: {
      default: true,
      type: Boolean
    },
    refreshs: {
      default: true,
      type: Boolean
    }
  },
  data() {
    return {
      Province: [],
      title: '',
      build_img: require('@/assets/images/build.png'),
      setting: {
        check: {
          enable: false
        },
        data: {
          simpleData: {
            enable: true,
            idKey: 'zonecode',
            pIdKey: 'parentcode',
            rootPId: 0
          },
          key: {
            name: 'zonename'
          }
        },
        view: {
          showIcon: true
        }
      }
    }
  },
  watch: {

  },
  mounted() {
    this.getProvince()
  },
  methods: {
    getProvince() {
      const data = {
        limit: 1000,
        page: 1
      }
      boundarytree(data)
        .then(res => {
          this.Province = res.data
          this.Province.forEach((item, index) => {
            item.icon = this.build_img
            if (item.children) {
              item.children.forEach(v => {
                v.icon = this.build_img
                if (v.children) {
                  v.children.forEach(x => {
                    x.icon = this.build_img
                  })
                }
              })
            }
          })
          scrollTo(0, 800)
        })
        .catch(res => {
          
          this.Province = []
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
          this.title = fristNode.zonename
          this.$emit('ward', fristNode.zonecode)
          this.$emit('wardname', fristNode.zonename)
        }
      }
    },
    getuser(evt, treeId, treeNode) {
      this.title = treeNode.zonename
      this.$emit('ward', treeNode.zonecode)
      this.$emit('wardname', treeNode.zonename)
    },
    refresh() {
      this.title = ''
      this.ztreeObj.cancelSelectedNode()
      this.$emit('ward', '')
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
.BoxCard {
  height: 100%;
  overflow-y: auto;
}

/* ::-webkit-scrollbar {
  height: 0;
  width: 0;
  color: transparent;
} */

</style>
