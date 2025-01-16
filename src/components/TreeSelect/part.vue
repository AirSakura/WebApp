<template>
  <treeselect
    v-model="treeValue"
    :multiple="multiple"
    :options="getOptions"
    :normalizer="normalizer"
    :append-to-body="appendToBody"
    :disable-branch-nodes="isChildOnly"
    value-consists-of="BRANCH_PRIORITY"
    :value-format="valueFormat"
    :limit="3"
    :limit-text="count => `...`"
    :max-height="200"
    :z-index="9999"
    :placeholder="placeholder"
    flat
    :auto-load-root-options="true"
    @open="open"
    @close="close"
    @input="inputChange"
  >
    <div slot="value-label" slot-scope="{ node }">
      {{ renderTrueValue(node.label) }}
    </div>
  </treeselect>
</template>

<script>
import Treeselect from "y_treeselect";

import { parttree } from "@/api/query";
export default {
  components: { Treeselect },
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    multiple: {
      type: Boolean,
      default: true
    },
    not_sk: { default: 1 },
    value: { default: null },
    placeholder: {
      type: String,
      default: "请选择单位"
    },
    // 是否挂靠在body上，一般不需要，特殊情况是表格新增行时需要注意加上
    appendToBody: {
      type: Boolean,
      default: true
    },
    isChildOnly: {
      // 是否只能选择或者点击叶子节点
      type: Boolean,
      default: false
    },
    isSupportExternalInput: {
      // 是否支持增加搜索文本作为下拉树值
      type: Boolean,
      default: false
    },
    valueFormat: {
      // 定义返回的值为id还是整个node节点数据
      type: String,
      default: "id" // id和object两种类型
    },
    width: {
      type: String,
      default: "280"
    }
  },
  data: () => ({
    options: [], // 下拉树选项
    partname: "",
    normalizer(node) {
      return {
        id: node.partid,
        label: node.partname,
        children: node.children
      };
    }
  }),
  computed: {
    getOptions() {
      return this.options;
    },
    treeValue: {
      set(val) {
        let temp = val;
        if (val === "" || val === undefined) {
          temp = null;
        }
        this.$emit("change", temp);
      },
      get() {
        // 没有数据时不显示
        if (this.options.length == 0) {
          return null;
        }
        return this.value;
      }
    }
  },
  watch: {
    treeValue(value) {
      this.$emit("treeValue", value);
    }
  },
  created() {},
  mounted() {
    this.addPlaceHolder("_first"); // 首次进来
    this.getpart();
  },
  methods: {
    getpart() {
      parttree({
        not_sk: this.not_sk
      })
        .then(res => {
          this.options = res.data;
          // console.log(res.data)
          this.treeValue = res.data[0].partid;
        })
        .catch(res => {
          this.options = [];
        });
    },
    calleArr(array, id) {
      for (var i in array) {
        var data = array[i];
        if (data.partid == id) {
          this.partname = data.partname;
          return;
        }
        if (data.children) {
          this.calleArr(data.children, id);
        }
      }
    },
    inputChange(val, instanceId) {
      this.$emit("change", val);
      this.calleArr(this.options, val);
      this.$emit("partname", this.partname);
      if (this.multiple) {
        // 只有多选模式下才考虑提示功能
        this.allLabel = val.map(item => {
          let label = "";
          // getNode是我自己查找下拉树的内置方法，呕心沥血才找到的
          label = this.$children[0].getNode(
            this.valueFormat == "object" ? item.id : item
          ).label;
          label = label.replace("(unknown)", "");
          return label;
        });
        const el = this.$el.querySelector(".vue-treeselect__multi-value");
        el.setAttribute("title", this.allLabel.join(" , "));
      } else {
        this.removePlaceHolder();
      }
      this.addPlaceHolder(val);
    },
    // 增加文字提示tooltip
    addPlaceHolder(value) {
      const placeholder = this.$el.querySelector(
        ".vue-treeselect__placeholder"
      );
      const temp = value !== "_first" ? value : this.value;
      if (placeholder && (!temp || !temp.length)) {
        const content = placeholder.innerText;
        placeholder.parentNode.setAttribute("title", content);
      }
    },
    removePlaceHolder() {
      const placeholder = this.$el.querySelector(
        ".vue-treeselect__placeholder"
      );
      if (placeholder) {
        placeholder.parentNode.removeAttribute("title");
      }
    },
    // 增加拖拽下拉功能
    open(instanceId) {
      const dom = document.querySelector(
        `.vue-treeselect[data-instance-id='${instanceId}']`
      );
      let listDom;
      this.$nextTick(() => {
        if (!this.appendToBody) return; //
        listDom = dom.querySelector(".vue-treeselect__menu");
        if (listDom) {
          const startX = listDom.getBoundingClientRect().right;
          const oldWidth = dom.getBoundingClientRect().width; // 原宽度
          // 初始化参数
          dom.style.width = this.width + "px";
          listDom.onmousedown = function(e) {
            // e.stopPropagation();
            const curDom = e.target;
            // 捕捉焦点
            // 设置事件
            document.onmousemove = function(ev) {
              if (ev.clientX - startX > 0) {
                dom.style.width = oldWidth + ev.clientX - startX + "px";
              }
            };
            document.onmouseup = function(ev) {
              ev.stopPropagation();
              document.onmousemove = null;
              document.onmouseup = null;
            };
            // 防止默认事件发生
            e.preventDefault();
          };
        }
      });
    },
    close(v, instanceId) {
      const val = this.$el.querySelector(".vue-treeselect__input").value;

      if (this.isSupportExternalInput) {
        let newVal = val.trim(); // 清除空格
        if (newVal === "") {
          this.$el.querySelector(".vue-treeselect__input").value = "";
          return;
        }
        let value;
        if (this.multiple) {
          const temp = this.value ? this.value : [];
          value = temp.slice();
          if (this.valueFormat == "object") {
            newVal = { id: newVal };
          }
          value.push(newVal); // 清除尾部空格
        } else {
          // 单选
          value = this.valueFormat == "object" ? { id: newVal } : newVal;
          this.$el.querySelector(".vue-treeselect__input").blur(); // 收起下拉
        }
        this.$emit("change", value);
        setTimeout(() => {
          // 清空搜索值
          this.$el.querySelector(".vue-treeselect__input").value = "";
        }, 0);
      }
    },
    // 针对外部输入值时将unknown换成外部
    renderTrueValue(label) {
      if (label.includes("(unknown)")) {
        // 隐藏不匹配时的(unknown)
        return label.replace("(unknown)", "");
      }
      return label;
    }
  }
};
</script>

<style lang="scss">
//只在append-to-body下实现拖拽功能
.vue-treeselect--append-to-body .vue-treeselect__menu {
  cursor: e-resize;
}
</style>
