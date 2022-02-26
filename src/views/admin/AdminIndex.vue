<template>
  <el-container class="box">
    <el-header>
      <div class="left">
        <img src="../../assets/header.png" alt="" />
        <span class="font">小区水电费管理系统</span>
      </div>
      <el-menu
        background-color="#57606f"
        mode="horizontal"
        text-color="#ffffff"
        active-text-color="#ffffff"
      >
        <el-submenu index="2">
          <template slot="title">
            <img
              :src="avatar"
              alt=""
              style="
                width: 40px;
                height: 40px;
                border-radius: 50%;
                overflow: hidden;
              "
            />
            {{ uname }}</template
          >
          <el-menu-item index="2-1" @click="dialogPass = true"
            >修改密码</el-menu-item
          >
          <el-menu-item index="2-2" @click="exit">退出</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-header>
    <el-dialog
      title="修改密码"
      center
      style="width: 50%; margin: auto"
      :visible.sync="dialogPass"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
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
    <el-container>
      <el-aside width="200px">
        <el-menu
          background-color="#57606f"
          text-color="#ffffff"
          active-text-color="#ffd04b"
          style="width: 100%; border-right: none"
        >
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-s-custom"></i>
              管理员管理
            </template>
            <el-menu-item @click="admininformation" index="2-1">
              管理员信息</el-menu-item
            >
            <el-menu-item @click="password" index="2-2">密码重置</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-s-claim"></i>
              <span>水电费管理</span>
            </template>
            <el-menu-item @click="watermanage" index="3-1"
              >水费管理</el-menu-item
            >
            <el-menu-item @click="electricemanage" index="3-2"
              >电费管理</el-menu-item
            >
          </el-submenu>
          <el-submenu index="6">
            <template slot="title">
              <i class="el-icon-message-solid"></i>
              <span>欠费管理</span>
            </template>
            <el-menu-item @click="waterarrear" index="6-1">欠水费</el-menu-item>
            <el-menu-item @click="electricarrear" index="6-2"
              >欠电费</el-menu-item
            >
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-s-data"></i>
              <span>信息统计</span>
            </template>
            <el-menu-item @click="waterecharts" index="5-1"
              >水费统计</el-menu-item
            >
            <el-menu-item @click="electricecharts" index="5-2"
              >电费统计</el-menu-item
            >
          </el-submenu>
          <el-menu-item @click="usermanage" index="1">
            <i class="el-icon-s-operation"></i>
            <span>用户管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view> </router-view>
      </el-main>
    </el-container>
  </el-container>
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
    admininformation() {
      this.$router.push({ name: "admininformation" });
    },
    waterarrear() {
      this.$router.push({ name: "waterarrear" });
    },
    electricarrear() {
      this.$router.push({ name: "electricarrear" });
    },
    waterecharts() {
      this.$router.push({ name: "waterecharts" });
    },
    electricecharts() {
      this.$router.push({ name: "electricecharts" });
    },
    password() {
      this.$router.push({ name: "password" });
    },
    electricemanage() {
      this.$router.push({ name: "electricemanage" });
    },
    watermanage() {
      this.$router.push({ name: "watermanage" });
    },
    usermanage() {
      this.$router.push({ name: "usermanage" });
    },
  },

  components: {},

  mounted() {
    this.inituname();
  },
};
</script>
<style scoped>
a {
  text-decoration: none;
  color: black;
  list-style: none;
}
.box {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
.font {
  font-weight: 530;
  font-size: 21px;
  color: #ffffff;
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
  margin-left: 30px;
}
.el-aside {
  background-color: #57606f;
}
.el-main {
  background-color: #e9eef3;
}
.left {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>