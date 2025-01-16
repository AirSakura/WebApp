<template>
  <div class="ztreePart" :style="{ height: height + 'px'}">
    <el-card class="box-card">
      <div slot="header" style="text-align: left;position: relative;">
        <span>角色树
          <span v-if="title != ''" style="color: #4caf50; font-size: 14px">（{{ title }}）</span></span>
        <el-button style="position: absolute;right: -10px;padding: 2px 0px 3px 0;" type="text" @click="refresh()">刷新
        </el-button>
      </div>
      <tree :setting="setting" :nodes="part" @onClick="getuser" @onCreated="handleCreated" />
    </el-card>
  </div>
</template>

<script>
  import { getrole } from '@/api/role'
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
      }
    },
    data() {
      return {
        part: [],
        title: '',
        build_img: require('@/assets/images/build.png'),
        setting: {
          check: {
            enable: false
          },
          data: {
            simpleData: {
              enable: true,
              idKey: 'roleid',
              pIdKey: 'roleparentid',
              rootPId: 0
            },
            key: {
              name: 'rolename'
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
      this.getpart()
    },
    methods: {
      getpart() {
        const data = {
          limit: 1000,
          page: 1
        }
        getrole(data)
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

        var nodes = this.ztreeObj.transformToArray(this.ztreeObj.getNodes())
        var fristNode = nodes && nodes[0]
        if (fristNode) {
          ztreeObj.selectNode(fristNode)
          this.title = fristNode.rolename
          this.$emit('partid', fristNode.partid)
        }
      },
      getuser(evt, treeId, treeNode) {
        this.title = treeNode.rolename
        this.$emit('partid', treeNode.partid)
      },
      refresh() {
        this.title = ''
        this.ztreeObj.cancelSelectedNode()
        this.$emit('partid', '')
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

  .box-card {
    height: 100%;
    overflow-y: auto;
  }

  /* ::-webkit-scrollbar {
  height: 0;
  width: 0;
  color: transparent;
} */
</style>