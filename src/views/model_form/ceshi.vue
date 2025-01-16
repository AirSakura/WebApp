<template>
  <div>
    <div ref="chart" style="width: 600px; height: 400px;"></div>
  </div>
</template>

<script>
import echarts from "echarts";

export default {
  data() {
    return {
      chartData: [
        { name: "A", data: [10, 20, 30, 40, 50] },
        { name: "B", data: [20, 30, 40, 50, 60] },
        { name: "C", data: [30, 40, 50, 60, 70] }
      ]
    };
  },
  mounted() {
    this.renderChart();
  },
  methods: {
    renderChart() {
      const chart = this.$echarts.init(this.$refs.chart);
      const option = {
        legend: {
          data: this.chartData.map(item => item.name)
        },
        xAxis: {
          type: "category",
          data: ["Jan", "Feb", "Mar", "Apr", "May"]
        },
        yAxis: {
          type: "value"
        },
        series: this.chartData.map(item => ({
          name: item.name,
          type: "line",
          data: item.data
        }))
      };
      chart.setOption(option);
    }
  }
};

let option = null;
      this.data.data2.map(item => {
        if (item.name == "面雨量") {
          option = {
            name: "面雨量",
            type: "bar",
            color: "rgb(0,255,0)",
            yAxisIndex: 1,
            emphasis: {
              focus: "series"
            },
            data: item.data
          };
        } else {
          option = {
            name: item.name,
            symbol: "none", //去掉圆点
            type: "line",
            color: "rgb(255,165,0)",
            lineStyle: {
              width: 1.5
            },
            emphasis: {
              focus: "series"
            },
            itemStyle: {
              opacity: 0.3
            },
            data: item.data
          };
        }
      });
</script>
