<template>
  <div>
    <el-table
      :data="tableData"
      v-if="tableData.length != 0"
      border
      style="width: 100%"
    >
      <el-table-column prop="uname" label="用户名" align="center">
      </el-table-column>
      <el-table-column prop="age" label="年龄" align="center">
      </el-table-column>
      <el-table-column prop="sex" label="性别" align="center">
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
      <div slot="footer">
        <el-button @click="resect('informationform')">取 消</el-button>
        <el-button
          type="info"
          size="medium"
          @click="information('informationform')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
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
        phone: "",
        address: "",
        avatar: "",
      },
      rules: {
        uname: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        age: [
          {
            required: true,
            message: "请输入年龄(数字)",
            type: "number",
            trigger: "blur",
          },
        ],
        sex: [{ required: true, message: "请输入性别", trigger: "blur" }],
        phone: [{ required: true, message: "请输入电话号", trigger: "blur" }],
        address: [{ required: true, message: "请输入门牌号", trigger: "blur" }],
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
          } else {
            this.$message.error(res.data.msg);
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
      this.form.sex = data.sex;
      this.form.avatar = data.avatar;
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
  },
};
</script>
<style scoped>
img {
  display: block;
  width: 440px;
  height: 440px;
  margin: auto;
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