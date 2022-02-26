<template>
  <div>
    <div id="chartLineBox"></div>
    <div class="pagin">
      <el-pagination
        :current-page.sync="paginate.page"
        :page-size.sync="paginate.limit"
        layout="total,prev, pager, next, jumper"
        :total="total"
        @current-change="handleCurrentPage"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "",
  data() {
    return {
      option: {
        tooltip: {
          trigger: "axis",
        },
        toolbox: {
        show: true,
        feature: {
            mark: {show: true},
            dataView: {show: true, readOnly: false},
            restore: {show: true},
            saveAsImage: {show: true}
        }
    },
        legend: {
          data: ["水费"],
        },
        color: ["#3498db"], //设置区分（每条线是什么颜色，和 legend 一一对应）
        xAxis: {
          //设置x轴
          type: "category",
          boundaryGap: false, //坐标轴两边不留白
          data: [],
          name: "用户", //X轴 name
          nameTextStyle: {
            //坐标轴名称的文字样式
            color: "#000000",
            fontSize: 16,
            padding: [0, 0, 0, 20],
          },
          axisLine: {
            //坐标轴轴线相关设置。
            lineStyle: {
              color: " #000000",
              width:1.5
            },
          },
           axisLabel: {
            textStyle: {
              color: "#000000",
              fontSize: "14",
            },
          },
        },
        yAxis: {
          name: "水费",
          nameTextStyle: {
            color: "#000000",
            fontSize: 16,
            padding: [0, 0, 10, 0],
          },
          axisLine: {
            lineStyle: {
              color: "#000000",
              width:1.5
            },
          },
           axisLabel: {
            textStyle: {
              color: "#000000",
              fontSize: "14",
            },
          },
          type: "value",
        },
        series: [
          {
            name: "水费",
            data: [],
            type: "line",
            lineStyle: {
              normal: {
                color: "#3498db",
              },
            },
          },
        ],
      },
      paginate: {
        limit: 7,
        page: 1,
      },
      total: 0,
    };
  },

  methods: {
    initData() {
      let params = this.paginate;
      axios.get("/admin/index/waterecharts", { params }).then((res) => {
        if (res.data.code === 200) {
          for (var i = 0; i < res.data.data.length; i++) {
            this.option.xAxis.data[i] = res.data.data[i].uname;
            this.option.series[0].data[i] = res.data.data[i].water;
          }
          this.total = res.data.total;
          this.chartLine = this.$echarts.init(
            document.getElementById("chartLineBox")
          );
          this.chartLine.setOption(this.option);
        } else {
          this.option.xAxis.data = [];
          this.option.series[0].data = [];
          this.chartLine = this.$echarts.init(
            document.getElementById("chartLineBox")
          );
          this.chartLine.setOption(this.option);
        }
      });
    },
    handleCurrentPage(val) {
      this.paginate.page = val;
      this.option.xAxis.data = [];
      this.option.series[0].data = [];
      this.initData();
    },
  },

  components: {},

  mounted() {
    this.initData();
  },
};
</script>
<style  scoped>
#chartLineBox {
  width: 100%;
  height: 570px;
  background: white;
  box-sizing: border-box;
  padding-top: 10px;
  overflow: auto;
}
.pagin {
  position: absolute;
  bottom: 20px;
  margin-left: 30%;
}
</style>