<template>
  <div class="app-container" style="margin-top: 30px">
    <main id="pjax-container">
      <div class="container">
        <el-card
          class="box-card"
          style="
            width: 100%;
            height: 200px;
            text-align: start;
            margin-bottom: 45px;
          "
        >
          <h1>在线潜在蒸发计算</h1>
          <el-row>
            <el-col :span="8" align="center">
              <div
                style="
                  margin-top: 15px;
                  margin-bottom: 5px;
                  display: flex;
                  width: 380px;
                  justify-content: space-between;
                "
              >
                <el-button type="primary" icon="el-icon-download"
                  >下载模板</el-button
                >
                <span>
                  <el-upload>
                    <el-button type="primary" icon="el-icon-upload"
                      >批量导入</el-button
                    >
                  </el-upload>
                </span>
                <el-button type="primary" icon="el-icon-s-claim"
                  >保存数据</el-button
                >
              </div>
            </el-col>
          </el-row>
        </el-card>
      </div>
      <el-card
        style="border: solid #409eff; width: 1000px; height: 100%; margin: auto"
      >
        <div class="tool-desc-entry headable">
          <h2 id="工具简介">
            <a href="#工具简介" class="anchor"><span></span></a>工具简介
          </h2>
          <p class="text">
            1998年联合国粮农组织（FAO）推荐的计算潜在蒸散量的标准公式是在综合考虑热量平衡、空气动力学阻抗和冠层表面阻抗的前提下，一种适用于非饱和下垫面的潜在蒸散量计算公式。FAO定义参考作物蒸散量:参考植物高度为0.12m，冠层阻抗为70m/s，反射率为0.23，近似于地表开阔，水分充足，高度一致，生长旺盛且完全覆盖的草被冠层的蒸散量。70m/s的冠层阻抗大约为一周灌溉一次的中度干燥的土壤表层的阻力，该公式是统一标准的计算方法，FAO定义该法为计算蒸散发的首选方法:
          </p>
          <p><img class="math-block" src="@/assets/tool_img/pm1.png" /></p>
          <p>式中：</p>
          <p class="text">
            Ep 参考蒸散量reference evapotranspiration [mm⋅day<sup>-1</sup>]；
          </p>
          <p class="text">
            Rn 陆地表面净辐射net radiation at the crop surface
            [MJ⋅m<sup>-2</sup>⋅day<sup>-1</sup>]；
          </p>
          <p class="text">
            G 土壤热通量密度soil heat flux density
            [MJ⋅m<sup>-2</sup>⋅day<sup>-1</sup>]；
          </p>
          <p class="text">T 日平均温度mean daily air temperature [°C]；</p>
          <p class="text">
            U<sub>2</sub> 2米高日平均风速wind speed at 2m height
            [m⋅s<sup>-1</sup>]；
          </p>
          <p class="text">es 饱和水汽压saturation vapour pressure [kPa]；</p>
          <p class="text">ea 实际水汽压actualvapour pressure [kPa]；</p>
          <p class="text">
            ∆ 水汽压曲线斜率slope vapour pressure curve [kPa⋅°C<sup>-1</sup>]；
          </p>
          <p class="text">
            γ 干湿表常数psychrometric constant [kPa⋅°C<sup>-1</sup>]。
          </p>

          <p>如下图所示：</p>
          <figure class="image">
            <img
              src="https://cdn.tool.dute.me/assets/images/tools/2021/07/20/%E5%B9%B4%E9%BE%84%E8%AE%A1%E7%AE%97%E7%BB%93%E6%9E%9C.png"
              alt="年龄计算结果"
              width="732"
              height="368"
            />
            <figcaption>年龄计算结果</figcaption>
          </figure>
          <p>如果觉得这款计算年龄的小工具有用，请分享给你的朋友。</p>
        </div>
      </el-card>

      <!-- <div class="outerBox" ref="outerDom" @scroll="getScrollTop">
        <div v-for="item in 100" :key="item">页面内容{{ item }}</div>
        <div class="scrollBox" v-show="isShow" @click="goBack">⬆️</div>
      </div> -->

      <footer class="tool-footer">
        <div class="row">
          <el-button
            style="font-size: 1em; font-weight: 500; font-family: KaiTi"
            type="text"
            class="button"
            @click="handleLink(item)"
            >返回工具箱</el-button
          >
          <div class="col-xs text-right">
            <a
              href="#top"
              class="btn btn-primary"
              style="bottom: 10px; right: 10px"
              >⬆️</a
            >
          </div>
        </div>
      </footer>

      <h2>分享工具</h2>
      <span id="tool-url">{{ moment_url }}</span
      ><button
        type="button"
        class="btn btn-copy"
        data-clipboard-target="#tool-url"
      >
        复制
      </button>
    </main>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import store from "@/store";
import * as echarts from "echarts";
export default {
  name: "test",
  data() {
    return {
      list: [],
      moment_url: window.location.href
    };
  },
  computed: {
    headers() {
      return {
        token: getToken()
      };
    }
  },
  mounted() {
    this.clientHeight = document.body.clientHeight - 205;

    window.onresize = () => {};
  },
  methods: {
    handleLink(item) {
      this.$router.push({ path: "/tools/tools/ET_tool" });
    },
    // 返回顶部事件
    goBack() {
      let that = this; // 防止this指向问题
      // 防止频繁点击，故返回顶部后设置scrollTrigger为初始值
      if (that.scrollTrigger) {
        return;
      }
      // 获取当前距离顶部的距离
      let scrollTop = this.scrollTop;
      console.log(scrollTop);
      let steep = scrollTop / 2000;
      let timer = setInterval(() => {
        that.scrollTrigger = true;
        // 滚动的速度逐渐变快，第一次走2000/1，然后减去已走的距离，下一次用剩下的距离再减去步进值，步进值也是不断变化，这样速度会越来越快
        scrollTop -= steep;
        // 步进值不改变的话会匀速缓慢上滑，不断增加步进值上滑的距离增加，视觉效果速度变快
        steep += 20;
        if (scrollTop <= 0) {
          clearInterval(timer);
          that.scrollTrigger = false;
        }
        that.$refs.outerDom.scrollTop = scrollTop;
      }, 30);
    },
    // 监听滚动条
    getScrollTop(e) {
      let that = this; // 防止this指向问题
      // 设备一屏的高度
      let clientHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      let scrollTop = e.srcElement.scrollTop;
      this.scrollTop = scrollTop;
      // 判断距离顶部多少显示回到顶部图标
      if (scrollTop > clientHeight) {
        that.isShow = true;
      } else {
        that.isShow = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.math-block {
  display: block;
  margin: 1em auto;
  width: 40%;
}
.text {
  text-indent: 2em;
  font-family: Times New Roman;
  font-size: 16px;
  color: #000;
  //   word-spacing: 20px;//空格设置为20px
  letter-spacing: 1px; //字体间距
}
// .body {
//   font-family: "Times New Roman", "宋体";, "宋体", KaiTi
// }
</style>
