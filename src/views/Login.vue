<template>
  <div class="box">
    <h2>小区水电费管理系统</h2>
    <div class="login">
      <div class="left">
        <img src="../assets/5.png" alt="" />
      </div>
      <div class="right">
        <h2>LOGIN</h2>
        <el-form :model="loginform" status-icon ref="loginform" :rules="rules">
          <el-form-item prop="uname" style="margin-top:10px">
            <el-input
              v-model="loginform.uname"
              placeholder="请输入用户名"
              prefix-icon="el-icon-user"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password" style="margin-top:10px">
            <el-input
              v-model="loginform.password"
              placeholder="请输入密码"
              prefix-icon="el-icon-unlock"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item prop="verifycode">
            <div style="display: flex">
              <el-input
                v-model="loginform.verifycode"
                placeholder="验证码"
                @keyup.enter.native="login"
              ></el-input>
              <span  @click="refreshCode"
                ><s-identify :identifyCode="identifyCode"></s-identify
              ></span>
            </div>
          </el-form-item>
          <div class="log" @click="login">登录</div>
          <p>
            还没账号? <span class="add" @click="drawer = true"> 立即注册!</span>
          </p>
        </el-form>
      </div>
    </div>
    <el-dialog
      title="用户注册"
      :visible.sync="drawer"
      width="25%"
      center
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        ref="addpass"
        :model="addform"
        label-width="70px"
        status-icon
        :rules="addrules"
      >
        <el-form-item style="width: 90%" prop="uname" label="用户名">
          <el-input v-model="addform.uname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item style="width: 90%" prop="password" label="密码">
          <el-input v-model="addform.password"  show-password autocomplete="off"></el-input>
        </el-form-item>
         <el-form-item style="width: 90%" prop="aginpassword" label="确认密码">
          <el-input v-model="addform.aginpassword"  show-password autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item style="margin-top: 30px">
          <el-button @click="resetForm('addpass')">取消</el-button>
           <el-button type="primary" @click="adduser('addpass')">注册</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import SIdentify from "../components/identify";
export default {
  name: "",
  data() {
    const validateVerifycode = (rule, value, callback) => {
      const newVal = value.toLowerCase();
      const identifyStr = this.identifyCode.toLowerCase();
      if (newVal === "") {
        callback(new Error("请输入验证码"));
      } else if (newVal !== identifyStr) {
        console.log("validateVerifycode:", value);
        callback(new Error("验证码不正确!"));
      } else {
        callback();
      }
    };
     var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请确认密码"));
      } else if (value !== this.addform.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
     };
    return {
      identifyCodes: "3456789ABCDEFGHGKMNPQRSTUVWXY",
      identifyCode: "",
      drawer: false,
      loginform: {
        uname: "",
        password: "",
        verifycode:''
      },
      addform: {
        uname: "",
        password: "",
        aginpassword:""
      },
      rules: {
        uname: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        verifycode:[{ required: true, trigger: "blur", validator: validateVerifycode }],
      },
      addrules: {
        uname: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        aginpassword: [{ validator: validatePass2, trigger: "blur" }],
      },
    };
  },
  methods: {
    login() {
      this.$refs.loginform.validate((validate) => {
        if (validate) {
          axios
            .post("/user/login/check", this.loginform)
            .then((res) => {
              if (res.data.code === 200) {
                sessionStorage.setItem("token", res.data.token);
                sessionStorage.setItem("uid", res.data.uid);
                sessionStorage.setItem("avatar", res.data.avatar.avatar);
                sessionStorage.setItem("uname", this.loginform.uname);
                if (res.data.isadmin === 1) {
                  this.$router.push("/adminindex");
                } else {
                  this.$router.push("/index");
                }
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
    },
    adduser(formName) {
      this.$refs.addpass.validate((validate) => {
        if (validate) {
          axios.post("/user/login/adduser", this.addform).then((res) => {
            console.log(res);
            if (res.data.code === 200) {
              this.$message.success(res.data.msg);
              this.drawer = false;
              this.$refs[formName].resetFields();
            } else {
              this.$message.error(res.data.msg);
              this.$refs[formName].resetFields();
            }
          });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.drawer = false;
    },
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    refreshCode() {
      this.identifyCode = ""
      this.makeCode(this.identifyCodes, 4)
    },
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length)
        ]
      }
    }
  },

  components: {
    SIdentify,
  },

  mounted() {
      this.identifyCode = ""
      this.makeCode(this.identifyCodes, 4)
  },
};
</script>
<style  scoped>
.login {
  width: 700px;
  height: 360px;
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  top: 0;
  margin: auto;
  top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: rgba(0, 0, 0, 0.2) 0 0 8px;
}
.left {
  width: 400px;
  height: 360px;
  background: #0097e6;
}
.left img {
  width: 100%;
  height: 100%;
}
.right {
  width: 300px;
  height: 360px;
  background: #ffffff;
  box-shadow: 0 0 2px;
  box-sizing: border-box;
  padding: 0 30px 0 30px;
}
.right > h2 {
  margin-top:20px;
  text-align: center;
}
p {
  text-align: center;
  margin-top:18px;
}
.add {
  color: #409eff;
  cursor: pointer;
}
.adduser {
  width: 650px;
  margin: auto;
}
.log {
  width: 100%;
  height: 40px;
  border-radius: 4px;
  background: linear-gradient(135deg, #56c8ff, #6f99fc) no-repeat;
  font-weight: 800;
  text-align: center;
  line-height: 40px;
  margin: auto;
  margin-top:20px;
  cursor: pointer;
  letter-spacing: 3px;
}
.box {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background-image: url("../assets/login.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.box > h2 {
  color: #2f3640;
  font-family: STKaiti;
  font-size: 43px;
  letter-spacing: 2px;
  margin-top: 100px;
  text-align: center;
}
</style>