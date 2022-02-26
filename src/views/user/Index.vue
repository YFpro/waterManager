<template>
  <div>
    <el-container class="box">
      <el-header>
      <div class="left" >
        <img src="../../assets/header.png" alt="" />
        <span>小区水电费管理系统</span>
        </div>
        <el-menu
          class="menu"
          background-color="#57606f"
          mode="horizontal"
          text-color="#ffffff"
          active-text-color="#ffffff"
        >
          <el-submenu index="2">
            <template slot="title">
            <img :src="avatar" alt="" style="width:40px;height:40px; border-radius:50%;
             overflow:hidden;"> {{ uname }}</template>
            <el-menu-item index="2-1" @click="dialogPass = true"
              >修改密码</el-menu-item
            >
            <el-menu-item index="2-2" @click="exit">退出</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-header>
      <el-main>
        <router-view> </router-view>
      </el-main>
      <div class="list">
        <ul>
          <li
            @click="Mywater"
            :class="[index === 1 ? 'active' : '']"
          >
            水
          </li>
          <li @click="Myelectric" :class="[index === 2 ? 'active' : '']">
           电
          </li>
          <li @click="Myform" :class="[index === 3 ? 'active' : '']">
           信息
          </li>
        </ul>
      </div>
    </el-container>
    <el-dialog
      title="修改密码"
      center
      style="width: 50%; margin: auto"
      :visible.sync="dialogPass"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal='false'
    >
      <el-form :model="passform" status-icon ref="passform" :rules="rules">
        <el-form-item prop="oldpass" label="旧密码">
          <el-input
            v-model="passform.oldpass"
            autocomplete="off"
            placeholder="请输入旧密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item prop="newpass" label="新密码">
          <el-input
            v-model="passform.newpass"
            autocomplete="off"
            placeholder="请输入新密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item prop="aginpass" label="确认密码">
          <el-input
            v-model="passform.aginpass"
            autocomplete="off"
            placeholder="请确认密码"
            show-password
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('passform')">取 消</el-button>
        <el-button  type="info" size="medium" @click="updatepass('passform')"
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
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else {
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请确认密码"));
      } else if (value !== this.passform.newpass) {
        callback(new Error("两次输入密码不一致!"));
      } else if (value === this.passform.oldpass) {
        callback(new Error("新密码不可以和原密码相同"));
      } else {
        callback();
      }
    };
    return {
      uname: "",
      avatar:'',
      index:1,
      passform: {
        uid: 0,
        oldpass: "",
        newpass: "",
        aginpass: "",
      },
      dialogPass: false,
      rules: {
        oldpass: [{ required: true, message: "请输入旧密码", trigger: "blur" }],
        newpass: [{ validator: validatePass, trigger: "blur" }],
        aginpass: [{ validator: validatePass2, trigger: "blur" }],
      },
    };
  },

  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogPass = false;
    },
    updatepass(formName) {
      this.$refs.passform.validate((validate) => {
        if (validate) {
          axios
            .post("/user/login/updatepass", this.passform)
            .then((res) => {
              if (res.data.code === 200) {
                this.$refs[formName].resetFields();
                this.dialogPass = false;
                sessionStorage.clear();
                this.$message.success(res.data.msg + ",请重新登录");
                this.$router.push("/");
              } else {
                this.$message.error(res.data.msg);
                this.$refs[formName].resetFields();
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
    },
    inituname() {
      this.passform.uid = sessionStorage.getItem("uid");
      this.uname = sessionStorage.getItem("uname");
      this.avatar ='http://localhost'+sessionStorage.getItem("avatar");
    },
    exit() {
      sessionStorage.clear();
      this.$router.push("/");
    },
    Mywater() {
      this.index = 1;
      this.$router.push({ name: "water" });
    },
    Myelectric() {
      this.index = 2;
      this.$router.push({ name: "electric" });
    },
    Myform() {
      this.index = 3;
      this.$router.push({ name: "information" });
    },
  },
  components: {},

  mounted() {
    this.inituname();
  },
};
</script>
<style  scoped>
.box {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #57606f;
}
img {
  width: 65px;
  height: 65px;
}
.el-main {
  background-color: #e9eef3;
}
span {
  font-weight: 530;
  font-size: 21px;
  color: #ffffff;
}
.left{
   display: flex;
   justify-content: center;
   align-items: center;
}
.list {
  width: 100px;
  height: 80px;
  position: fixed;
  right: 13px;
  bottom: 180px;
  cursor: pointer;
}
ul,
li {
  list-style: none;
}
.list li {
  width: 50px;
  background:#b2bec3;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  border-radius: 10px;
  color: #ffffff;
  font-size:14px;
}
.list li.active {
  background: #57606f;
   font-size:18px;
}
</style>