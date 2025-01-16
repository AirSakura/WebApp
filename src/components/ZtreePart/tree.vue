<template>
  <div class="ztreePart" :style="{ height: height + 'px'}">
    <el-card class="box-card">
      <div slot="header" style="text-align: left;position: relative;">
        <span>角色树
          <span v-if="title != ''" style="color: #1a90ff; font-size: 14px">（{{ title }}）</span></span>
        <el-button class="clear" type="text" @click="refresh()">清空</el-button>
      </div>
      <div class="tree-container">
        <el-tree ref="tree" class="tree filter-tree" :data="part" node-key="name" :highlight-current="true"
          :props="defaultProps" default-expand-all @node-click="handleNodeClick">
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span :dataType="data.type">
              <svg-icon :icon-class="data.key" :style="{'marginLeft' : (data.key=='person'? '12px' : 'false')}" />
              <!-- <img :src="data.icon" alt="" width="18" style="position: relative;top: 3px" :class="{'tree-left' : data.key == 'person' ? true : false}"> -->
              <span style="font-size: 14px;">{{ data.name }}</span>
            </span>
          </span>
        </el-tree>
      </div>
    </el-card>
  </div>
</template>

<script>

  import { env_stationlist } from '@/api/resource'
  export default {
    name: 'Tree',
    props: {
      height: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        part: [],
        title: '',
        setting: {
          check: {
            enable: false
          },
          data: {
            simpleData: {
              enable: true,
              idKey: 'id',
              rootPId: 0
            },
            key: {
              name: 'name'
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
      handleNodeClick(treeNode) {
        this.title = treeNode.name
        this.$emit('partid', treeNode)
        this.$emit('partname', treeNode)
      },
      getpart() {
        const data = {
          limit: 1000,
          page: 1
        }
        env_stationlist(data)
          .then(res => {
            this.part = res.data.data
            this.part.forEach((item, index) => {
              item.key = 'stat'
            })
            this.fristnode()
          })
          .catch(res => {
            
            this.part = []
          })
      },
      fristnode() {
        var fristNode = this.part && this.part[0]
        this.title = fristNode.name
        this.$emit('partid', fristNode)
        // console.log(fristNode, '123')
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(fristNode)
        })
      },
      refresh() {
        this.$refs.tree.setCurrentKey(null)
        this.title = ''
        var fristNode = {
          name: ''
        }
        this.$emit('clear', fristNode)
        this.fristnode()
      }
    }
  }
</script>

<style>
  .ztreePart {
    margin-right: 10px;
    height: 100%;
    width: 100%;
  }

  .box-card {
    height: 100%;
    overflow-y: auto;
  }

  .tree .el-tree-node {
    position: relative;
    padding-left: 10px;
  }

  .tree .el-tree-node__children {
    padding-left: 10px;
  }

  .tree .el-tree-node :last-child:before {
    height: 38px;
  }

  .tree .el-tree-node__content {
    padding-left: 5px !important;
    line-height: 26px;
  }

  .tree .el-tree>.el-tree-node:before {
    border-left: none;
  }

  .tree-container .el-tree>.el-tree-node:after {
    border-top: none;
  }

  .tree .el-tree-node__children .el-tree-node:before {
    content: '';
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }

  .tree .el-tree-node:after {
    content: '';
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }

  .tree .el-tree-node__expand-icon.is-leaf {
    display: none;
  }

  .tree .el-tree-node:before {
    border-left: 1px dashed #dddddd;
    bottom: 0px;
    height: 100%;
    top: -26px;
    width: 1px;
  }

  .tree .el-tree-node:after {
    border-top: 1px dashed #dddddd;
    height: 20px;
    top: 12px;
    width: 24px;
  }

  .tree .custom-tree-node {
    padding-left: 0px;
  }

  /* ::-webkit-scrollbar {
  height: 0;
  width: 0;
  color: transparent;
} */
  .tree-left {
    margin-left: 12px;
  }

  .clear {
    position: absolute;
    right: -10px;
    padding: 2px 0px 3px 0;
  }
</style>