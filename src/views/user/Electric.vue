<template>
  <div>
    <el-table :data="tableData" v-if="tableData.length != 0">
      <el-table-column prop="uname" label="用户名" align="center">
      </el-table-column>
      <el-table-column prop="electric" label="当前电费" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <el-button
          @click="
            form.num = 1;
            dialogFormVisible = true;
          "
          type="info"
          size="medium"
          >缴电费</el-button
        >
      </el-table-column>
    </el-table>
    <p>用户年度电费分析</p>
    <div id="chartLineBox"></div>
    <el-dialog
      title="缴电费"
      center
      style="width: 50%; margin: auto"
      :visible.sync="dialogFormVisible"
    >
      <span style="margin-right: 10px; font-size: 15px">缴费金额 :</span>
      <el-input-number v-model="form.num" :min="1" :step="1"></el-input-number>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="info" size="medium" @click="pay">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      form: {
        uid: 0,
        num: 1,
      },
      option: {
        tooltip: {
          //设置tip提示
          trigger: "axis",
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        legend: {
          //设置区分（哪条线属于什么）
          data: ["当月电费"],
        },
        color: ["#fdcb6e"], //设置区分（每条线是什么颜色，和 legend 一一对应）
        xAxis: {
          //设置x轴
          type: "category",
          boundaryGap: false, //坐标轴两边不留白
          data: [
            "一月",
            "二月",
            "三月",
            "四月",
            "五月",
            "六月",
            "七月",
            "八月",
            "九月",
            "十月",
            "十一月",
            "十二月",
          ],
          name: "月份", //X轴 name
          nameTextStyle: {
            //坐标轴名称的文字样式
            color: "#000000",
            fontSize: 16,
            padding: [0, 0, 0, 20],
          },
          axisLine: {
            //坐标轴轴线相关设置。
            lineStyle: {
              color: "#000000",
              width: 1.5,
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
          name: "电费",
          nameTextStyle: {
            color: "#000000",
            fontSize: 16,
            padding: [0, 0, 10, 0],
          },
          axisLine: {
            lineStyle: {
              color: "#000000",
              width: 1.5,
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
            name: "当月电费",
            data: [],
            type: "line",
            lineStyle: {
              normal: {
                color: "#fdcb6e",
              },
            },
          },
        ],
      },
    };
  },

  methods: {
    pay() {
      axios.post("/user/login/payelectric", this.form).then((res) => {
        if (res.data.code === 200) {
          this.$message.success(res.data.msg);
          this.dialogFormVisible = false;
          this.initData();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    initData() {
      axios.get("/user/login/readelectric?uid=" + this.form.uid).then((res) => {
        if (res.data.code === 200) {
          this.tableData = res.data.data;
          this.option.series[0].data = res.data.data[0].electrics.split(",");
          this.chartLine = this.$echarts.init(
            document.getElementById("chartLineBox")
          );
          this.chartLine.setOption(this.option);
        } else {
          this.option.series[0].data = [];
          this.chartLine = this.$echarts.init(
            document.getElementById("chartLineBox")
          );
          this.chartLine.setOption(this.option);
        }
      });
    },
    close() {
      axios
        .get("/user/login/updateremelectric?uid=" + this.form.uid)
        .then((res) => {
          if (res.data.code === 200) {
            this.$message.success(res.data.msg);
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    msg() {
      this.$notify({
        title: "欠费通知",
        message: "您已拖欠电费，请及时缴费",
        type: "warning",
        position: "top-left",
        duration: 0,
        onClose: this.close,
      });
    },
    initmsg() {
      axios
        .get("/user/login/remandelectric?uid=" + this.form.uid)
        .then((res) => {
          if (res.data.code === 200) {
            if (res.data.data.isremand === 1) {
              this.msg();
            }
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
  },

  components: {},

  mounted() {
    this.form.uid = sessionStorage.getItem("uid");
    this.initData();
    this.initmsg();
  },
};
</script>
<style  scoped>
img {
  display: block;
  width: 440px;
  height: 440px;
  margin: auto;
}
p {
  padding: 15px 0 10px 0;
  margin: 0;
  text-align: center;
  font-size: 16px;
  font-weight: 550;
  background: white;
}
#chartLineBox {
  width: 100%;
  height: 460px;
  background: white;
  box-sizing: border-box;
  padding-top: 10px;
  overflow: auto;
}
</style>