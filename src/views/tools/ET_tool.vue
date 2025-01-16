<template>
  <div class="app-container" style="margin-top: 30px">
    <el-row :gutter="10" class="row-con">
      <el-col
        :span="6"
        v-for="(item, index) in list"
        :key="index"
        :offset="index > 0 ? 1 : 1"
        style="margin-bottom: 25px"
      >
        <el-card :body-style="{ padding: '0px' }" class="card">
          <div
            style="display: flex; align-items: center; padding: 10px 0 0 10px"
          >
            <img :src="item.url" class="image" />

            <span style="font-size: 1.3em; font-weight: 800">{{
              item.name
            }}</span>
          </div>
          <div style="padding: 14px">
            <div class="bottom clearfix">
              <el-button
                style="font-size: 1em; font-weight: 500; font-family: KaiTi"
                type="text"
                class="button"
                @click="handleLink(item)"
                >进入工具</el-button
              >
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- <div>
      <span
        ><a href="https://baidu.com" target="_blank" rel="noopener noreferrer"
          >百度</a
        ></span
      >
    </div> -->
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
      list: [
        {
          name: "彭曼公式计算蒸发",
          url: "https://p405.ssl.qhimgs4.com/t018c4a049d1bf2be92.webp",
          link: "/tools/tools/PM",
          status: 0
        },

        {
          name: "降雨数据插值",
          url:
            "https://ts1.cn.mm.bing.net/th/id/R-C.e8a3f2554d065e6bc6ee3a7f2a79f4fb?rik=Ps6MHjJCgLEfnw&riu=http%3a%2f%2fi.weather.com.cn%2fimages%2fyunnan%2ftqyw%2f2020%2f09%2f02%2f1599037305506045959.png&ehk=G7Uimdjd0r7C5dTKRgXAKKXJqNC8v51UsaBlI5VuQLs%3d&risl=&pid=ImgRaw&r=0",
          link: "",
          status: 0
        },
        {
          name: "洪水数据插值",
          url:
            "https://imgconvert.csdnimg.cn/aHR0cHM6Ly91cGxvYWQtaW1hZ2VzLmppYW5zaHUuaW8vdXBsb2FkX2ltYWdlcy8xMzE5NDU3NC1kNTEzNzYzZTZmMWIxYmIwLnBuZw?x-oss-process=image/format,png",
          link: "",
          status: 0
        },

        {
          name: "蒸发数据插值",
          url:
            "https://www.xtbg.ac.cn/xwzx/kydt/201803/W020180329326598445826.jpg",
          link: "name:'datainput', params: { id: this.id }",
          status: 0
        },
        {
          name: "温度数据插值",
          url:
            "https://pic2.zhimg.com/v2-4fe99209f72b0c247e6b04be8c8417ed_b.jpg",
          link: "name:'datainput', params: { id: this.id }",
          status: 0
        },
        {
          name: "计算地形指数",
          url:
            "https://ts1.cn.mm.bing.net/th/id/R-C.373f392d1a9544c5270cf9f7a50181bf?rik=g6rIKqQh0oyGcA&riu=http%3a%2f%2fwww.jl1.cn%2fsystem_dntb1%2fupload%2fimage%2f20190821%2f20190821142844_4286.jpg&ehk=psMRBRVhtolVYzk1ebMDnTF%2bNTNPOLr2sDXQEVboMGs%3d&risl=&pid=ImgRaw&r=0",
          link: "name:'datainput', params: { id: this.id }",
          status: 0
        },
        {
          name: "计算等流时线",
          url:
            "https://img.xkw.com/dksih/QBM/2017/4/6/1659787909947392/1660112539672576/STEM/4fa052cff374432498c16f2429cba60f.png?resizew=436",
          link: "name:'datainput', params: { id: this.id }",
          status: 0
        }
      ]
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

    window.onresize = () => {
      this.myChart && this.myChart.resize();
    };
  },
  methods: {
    handleLink(item) {
      console.log(item);
      if (item.status == 0) {
        this.$router.push({ path: item.link });
      } ////跳内部地址
      // location.href = "https://baidu.com";//跳外部地址
      console.log(item);
      if (item.status == 1) {
        window.open(`${location.origin}/#${item.link}`); ////新页面跳转
      }
      if (item.status == 2) {
        window.open(item.link); ////新页面跳转
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
  //   width: 100px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 20%;
  margin-right: 10px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
.row-con {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
}
.row-con .card {
  min-width: 100%;
  height: 100%;
  margin-right: 20px;
  transition: all 0.5s;
}
</style>
