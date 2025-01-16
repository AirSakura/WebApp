<template>
  <div class="ztreePart"
       v-loading="listLoading"
       :style="{ height: height + 'px'}">
    <el-card class="card">
      <div slot="header"
           style="position: relative;">
        <span>{{ name }}
          <!-- <span v-if="title != ''"
                class="title">({{ title }})</span> -->
        </span>
        <el-button
          style="position: absolute;right: -10px;padding: 2px 0px 3px 0;"
          type="text"
          @click="refresh()"
        >刷新</el-button>
        <!-- <el-tooltip class="item"
                    effect="dark"
                    content="是否包含下级"
                    placement="bottom"
                    v-if="part.length">
          <el-checkbox v-model="checked"
                       class="check" />
        </el-tooltip> -->
      </div>
      <el-input size="mini"
                placeholder="请输入单位名"
                v-model="filterText"
                clearable
                style="margin-bottom: 5px;"></el-input>
      <el-tree ref="filterTree"
               class="filterTree"
               :props="defaultProps"
               :load="loadNode"
               node-key="partid"
               lazy
               :default-expanded-keys="defaultShowNodes"
               :filter-node-method="filterNode"
               :highlight-current="true"
               :expand-on-click-node="false"
               @node-click="handleNodeClick">
        <span slot-scope="{ node, data }"
              class="custom-tree-node">
          <img :src="build_img"
               alt=""
               width="16"
               style="position: relative;top: 2px;">
          <span style="font-size: 14px;position: relative;bottom: 1px;">{{ data.partname }}</span>
        </span>
      </el-tree>
    </el-card>
  </div>
</template>

<script>
import {
  parttree
} from '@/api/query'
import {
  getpartlazy
} from "@/api/part"
import {
  mapGetters
} from 'vuex'
export default {
  name: 'ZtreePart',
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
  data () {
    return {
      // 处理节点刷新
      maps:new Map(),
      part: [],
      name: '单位树(设备数)',
      listLoading: true,
      filterText: '',
      title: '',
      checked: true,
      defaultShowNodes: [],
      build_img: require('@/assets/images/build.png'),
      defaultProps: {
        children: 'children',
        label: 'partname',
        isLeaf:"flag"
      },
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
    filterText (val) {
      this.$refs.filterTree.filter(val)
    },
    checked: {
      handler (n) {
        this.$emit('sub', n ? 1 : 0)
      }
    },
    // part: {
    //   handler () {
    //     this.part.forEach(item => {
    //       if (item.children) {
    //         item.children.forEach(x => {
    //           this.defaultShowNodes.push(x.partid)
    //         })
    //       }
    //     })
    //   },
    //   deep: true
    // }
  },
  computed: {
    ...mapGetters(['currentPart']),
    current: {
      get () {
        return this.$store.state.map.currentPart
      },
      set (val) {
        // this.$store.dispatch('map/setPart', val)
      }
    }
  },
  mounted () {
    this.getpart()
  },
  methods: {
    // 刷新节点
    refresh(){
        let {node,resolve} = this.maps.get("000");
        node.childNodes = []
            this.loadNode(node,resolve)
    },
    // 懒加载节点
    loadNode(node, resolve){
      let data = []
      if (node.level === 0) {
        this.maps.set("000",{node,resolve})
          getpartlazy().then(res => {
            // 数据处理，根节点为对象。必须封装成数组并拼接字符串
              let obj = res.data
              obj.partname = `${obj.partname}(${obj.device_count})`
              data.push(res.data)
              resolve(data);
              console.log(node)
            })
        }else{
          const {partid} = node.data
            setTimeout(() => {
            getpartlazy({partid:partid}).then(res => {
              data = res.data.children
              data = data.map(item => {
                item.partname = `${item.partname}(${item.device_count})`
                return item
              })
              console.log(res.data)
              resolve(data);
            })
            
          }, 500);
        }
    },
    getpart () {
      this.listLoading = true
      const data = {
        part_type: this.parttype ? this.parttype : null
      }
      parttree(data)
        .then(res => {

          this.part = res.data
          this.handleCreated()
          this.listLoading = false
        })
        .catch(res => {
          this.part = []
          this.listLoading = false
        })
    },
    handleCreated () {
      if (!this.current) {
        var fristNode = this.part && this.part[0]
        this.title = fristNode.partname
        if (fristNode) {
          this.title = fristNode.partname
          // this.$emit('partid', fristNode.partid)
          this.$emit('partname', fristNode.partname)
          this.$nextTick(() => {
            this.$refs.filterTree.setCurrentKey(fristNode)
          })
        }
      } else {
        this.title = this.current.partname
        this.$emit('partid', this.current.partid)
        this.$emit('partname', this.current.partname)
        this.$nextTick(() => {
          this.$refs.filterTree.setCurrentKey(this.current)
        })
      }
    },
    handleNodeClick (treeNode) {
      this.title = treeNode.partname
      this.$store.dispatch('map/setPart', treeNode)
      this.$emit('partid', treeNode.partid,treeNode.part_list)
      this.$emit('partname', treeNode.partname)
      this.$emit('parentpart', treeNode.parentpart)
    },
    filterNode (value, data, node) {
      if (!value) {
        return true
      }
      let level = node.level
      let _array = [] //这里使用数组存储 只是为了存储值。
      this.getReturnNode(node, _array, value)
      let result = false
      _array.forEach(item => {
        result = result || item
      })
      return result
    },
    getReturnNode (node, _array, value) {
      let isPass = node.data && node.data.partname && node.data.partname.indexOf(value) !== -1
      isPass ? _array.push(isPass) : ''
      this.index++

      if (!isPass && node.level != 1 && node.parent) {
        this.getReturnNode(node.parent, _array, value)
      }
    },
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

.card > div {
  text-align: left;
  position: relative;
}

.card .title {
  color: #4caf50;
  display: inline-block;
  font-size: 14px;
  width: 155px;
  position: relative;
  top: 3px;
  overflow: hidden;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  white-space: nowrap;
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
<style>
.filterTree .el-tree .el-icon-caret-right:before {
  font-size: 18px;
}

.filterTree
  .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  color: #000;
  background: #c9e9f7;
}

.filterTree .el-tree-node__content {
  height: 23px;
}

.filterTree .el-icon-caret-right:before {
  font-size: 18px;
}

.filterTree .el-tree-node__content > .el-tree-node__expand-icon {
  padding: 0;
}
</style>
