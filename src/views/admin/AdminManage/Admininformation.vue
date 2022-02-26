<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="uname" label="用户名" align="center">
      </el-table-column>
      <el-table-column prop="avatar" label="头像" align="center">
        <template slot-scope="scope">
          <img
            :src="'http://localhost' + scope.row.avatar"
            alt=""
            style="width: 50px; height: 50px"
          />
        </template>
      </el-table-column>
      <el-table-column prop="age" label="年龄" align="center">
      </el-table-column>
      <el-table-column prop="sex" label="性别" align="center">
      </el-table-column>
      <el-table-column prop="phone" label="电话号码" align="center">
      </el-table-column>
      <el-table-column prop="address" label="门牌号" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="info" size="medium" @click="adddata(scope.row)"
            >修改</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="信息修改"
      center
      :visible.sync="dialogFormVisible"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <el-form
        :model="form"
        label-width="70px"
        status-icon
        ref="informationform"
        :rules="rules"
      >
        <el-form-item label="用户名" prop="uname">
          <el-input v-model="form.uname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-input v-model="form.sex" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model.number="form.age" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="头像" prop="avator">
          <el-upload
            class="avatar-uploader"
            action="http://localhost/water-admin/public/index.php/user/login/avatar"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="form.avatar"
              :src="'http://localhost' + form.avatar"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <p>只能上传jpg/png/jpeg文件,且不超过2M</p>
        <el-form-item label="电话号" prop="phone">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="门牌号" prop="address">
          <el-input v-model="form.address" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resect('informationform')">取 消</el-button>
        <el-button
          type="info"
          size="medium"
          @click="information('informationform')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <div id="chartLineBox"></div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "",
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      form: {
        uid: 0,
        uname: "",
        age: undefined,
        sex: "",
        avatar: "",
        phone: "",
        address: "",
      },
      rules: {
        uname: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        age: [
          {
            required: true,
            message: "请输入数字",
            type: "number",
            trigger: "blur",
          },
        ],
        sex: [{ required: true, message: "请输入性别", trigger: "blur" }],
        phone: [{ required: true, message: "请输入电话号", trigger: "blur" }],
        address: [{ required: true, message: "请输入门牌号", trigger: "blur" }],
      },
      option: {
        //提示框
        tooltip: {
          trigger: "axis",
        },
        //下载工具
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
          data: ["年度水费", "年度电费"],
        },
        color: ["#8AE09F", "#FA6F53"],
        xAxis: {
          type: "category",
          boundaryGap: false,
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
          name: "月份",
          nameTextStyle: {
            color: "#000000",
            fontSize: 16,
            padding: [0, 0, 0, 20],
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
        },
        yAxis: {
          name: "费用",
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
            name: "年度水费",
            data: [],
            type: "line", // 类型为折线图
            lineStyle: {
              // 线条样式 => 必须使用normal属性
              normal: {
                color: "#8AE09F",
              },
            },
          },
          {
            name: "年度电费",
            data: [],
            type: "line",
            lineStyle: {
              normal: {
                color: "#FA6F53",
              },
            },
          },
        ],
      },
    };
  },

  methods: {
    initData() {
      axios
        .get("/user/login/readinformation?uid=" + this.form.uid)
        .then((res) => {
          if (res.data.code === 200) {
            this.tableData = res.data.data;
            this.option.series[0].data = res.data.water[0].waters.split(",");
            this.option.series[1].data = res.data.electric[0].electrics.split(
              ","
            );
            this.chartLine = this.$echarts.init(
              document.getElementById("chartLineBox")
            );
            this.chartLine.setOption(this.option);
          } else {
            this.option.series[0].data = [];
            this.option.series[1].data = [];
            this.chartLine = this.$echarts.init(
              document.getElementById("chartLineBox")
            );
            this.chartLine.setOption(this.option);
          }
        });
    },
    resect(formName) {
      this.$refs[formName].resetFields();
      this.dialogFormVisible = false;
    },
    information(formName) {
      this.$refs.informationform.validate((validate) => {
        if (validate) {
          axios.post("/user/login/updateinformation", this.form).then((res) => {
            if (res.data.code === 200) {
              this.$message.success(res.data.msg);
              this.$refs[formName].resetFields();
              this.dialogFormVisible = false;
              this.initData();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        }
      });
    },
    adddata(data) {
      this.form.uid = data.uid;
      this.form.uname = data.uname;
      this.form.age = data.age;
      this.form.avatar = data.avatar;
      this.form.sex = data.sex;
      this.form.address = data.address;
      this.form.phone = data.phone;
      this.dialogFormVisible = true;
    },
    handleAvatarSuccess(res) {
      if (res.code === 200) {
        this.form.avatar = res.imgpath;
      } else {
        this.$message.error(res.msg);
      }
    },
    beforeAvatarUpload(file) {
      console.log(file);
      let { size, type } = file;
      let uploadMaxsize = 2 * 1024 * 1024;
      let uploadType = ["image/jpg", "image/png", "image/jpeg"];
      let sizeFlag = true,
        typeFlag = true;
      sizeFlag = size < uploadMaxsize;
      typeFlag = uploadType.some((ele) => ele == type);
      if (!typeFlag) {
        this.$message.error("上传头像图片只能是jpg,png,jpeg格式!");
      }
      if (!sizeFlag) {
        this.$message.error("上传头像图片大小不能超过2M!");
      }
      return sizeFlag && typeFlag;
    },
  },
  components: {},

  mounted() {
    this.form.uid = sessionStorage.getItem("uid");
    this.initData();
    this.chartLine = this.$echarts.init(
      document.getElementById("chartLineBox")
    );
    this.chartLine.setOption(this.option);
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
#chartLineBox {
  width: 100%;
  height: 490px;
  background: white;
  box-sizing: border-box;
  padding-top: 20px;
  overflow: auto;
}
p {
  margin: 0;
  padding: 0;
  margin-bottom: 10px;
  padding-left: 10%;
  box-sizing: border-box;
  color: rgb(240, 9, 9);
}
.avatar-uploader {
  width: 120px;
  height: 120px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>