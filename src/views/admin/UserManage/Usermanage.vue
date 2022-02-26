<template>
  <div>
    <el-form :model="search" :inline="true">
      <el-form-item >
        <el-input placeholder="请输入用户名" v-model="search.uname"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button  type="info" size="medium" @click="searchhotal">查询</el-button>
        <el-button  type="info" size="medium" @click="all">全部</el-button>
      </el-form-item>
        <el-form-item style="margin-left:59%;">
          <el-button 
           type="info" size="medium"
          @click="dialogAdd=true;" 
          icon="el-icon-plus">添加用户</el-button>
      </el-form-item>
    </el-form>
      <el-table
      :data="tableData"
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
        <el-button  type="info" size="medium" @click="adddata(scope.row)"
          >修改</el-button
        >
        <el-button  type="info" size="medium" @click="deleteuser(scope.row.uid)"
          >删除</el-button
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
      :close-on-click-modal='false'  
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
        <el-button  type="info" size="medium" @click="information('informationform')">确 定
        </el-button>
      </div>
    </el-dialog>
     <el-dialog
      title="添加用户"
      center
      :visible.sync="dialogAdd"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal='false'
    >
      <el-form
        :model="addform"
        label-width="70px"
        status-icon
        ref="addrefform"
        :rules="addrules"
      >
        <el-form-item label="用户名" prop="uname">
          <el-input v-model="addform.uname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-input v-model="addform.sex" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model.number="addform.age" autocomplete="off"></el-input>
        </el-form-item>
          <el-form-item label="头像" prop="avator">
          <el-upload
            class="avatar-uploader"
            action="http://localhost/water-admin/public/index.php/user/login/avatar"
            :show-file-list="false"
            :on-success="addAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="addform.avatar"
              :src="'http://localhost' + addform.avatar"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <p>只能上传jpg/png/jpeg文件,且不超过2M</p>
        <el-form-item label="电话号" prop="phone">
          <el-input v-model="addform.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="门牌号" prop="address">
          <el-input v-model="addform.address" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addresect('addrefform')">取 消</el-button>
        <el-button  type="info" size="medium" @click="addinformation('addrefform')">确 定
        </el-button>
      </div>
    </el-dialog>
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
  data() {
    return {
      search: { uname: "" },
      paginate: { limit:6, page: 1 },
      tableData: [],
      total: 0,
      dialogFormVisible: false,
      dialogAdd: false,
      title:"",
      form: {
        uid:0,
        uname: "",
        age: undefined,
        sex: "",
        phone: "",
        avatar:"",
        address: "",
      },
       addform: {
        uname: "",
        age: undefined,
        sex: "",
        phone: "",
        avatar:"",
        address: "",
      },
      rules: {
        uname: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        age: [{required: true, message: '请输入年龄(数字)',type:'number', trigger: 'blur'}],
        sex: [{ required: true, message: "请输入性别", trigger: "blur" }],
        phone: [{ required: true, message: "请输入电话号", trigger: "blur" }],
        address: [{ required: true, message: "请输入门牌号", trigger: "blur" }],
      },
       addrules: {
        uname: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        age: [{required: true, message: '请输入年龄(数字)',type:'number', trigger: 'blur'}],
        sex: [{ required: true, message: "请输入性别", trigger: "blur" }],
        phone: [{ required: true, message: "请输入电话号", trigger: "blur" }],
        address: [{ required: true, message: "请输入门牌号", trigger: "blur" }],
      },
    };
  },
  methods: {
    searchhotal() {
      this.paginate.page = 1;
      this.initData();
    },
    initData() {
      let params = Object.assign({}, this.search, this.paginate);
      axios.get("/admin/index/readinformation", { params }).then((res) => {
        if (res.data.code === 200) {
          console.log(res);
          this.tableData = res.data.data;
          this.total = res.data.total;
        } else if(this.paginate.page !=1) {
            this.paginate.page = this.paginate.page-1;
            this.initData()
        }else{
            this.tableData=[];
        }
      });
    },
    handleCurrentPage(val) {
      this.paginate.page = val;
      this.initData();
    },
    adddata(data){
     this.form.uid=data.uid;
     this.form.uname=data.uname;
     this.form.age=data.age;
     this.form.sex=data.sex;
     this.form.avatar=data.avatar;
     this.form.address=data.address;
     this.form.phone=data.phone;
     this.title="信息修改";
     this.dialogFormVisible = true;
    },
     resect(formName) {
      this.$refs[formName].resetFields();
      this.dialogFormVisible = false;
    },
     addresect(formName) {
      this.addform.avatar="";
      this.$refs[formName].resetFields();
      this.dialogAdd = false;
    },
     information(formName) {
       this.$refs.informationform.validate((validate) => {
            if(validate){
               axios.post('/user/login/updateinformation',this.form).then((res)=>{
                    if(res.data.code===200){
                      this.$message.success(res.data.msg);
                      this.$refs[formName].resetFields();
                       this.dialogFormVisible = false;
                      this.initData();
                    }else{
                      this.$message.error(res.data.msg);
                    }
               })
            }
       
       })
    },
    addinformation(formName) {
       this.$refs.addrefform.validate((validate) => {
            if(validate){
               axios.post('/admin/index/adduser',this.addform).then((res)=>{
                    if(res.data.code===200){
                      this.$message.success(res.data.msg);
                      this.$refs[formName].resetFields();
                      this.dialogAdd = false;
                      this.initData();
                    }else{
                      this.$message.error(res.data.msg);
                    }
               })
            }
       
       })
    },
    all(){
     this.search.uname ='',
     this.initData();
    },
    deleteuser(uid){
        axios.get('/admin/index/deleteuser?uid='+uid).then((res)=>{
             if(res.data.code===200){
                this.$message.success(res.data.msg);
                this.initData();
             }else{
                this.$message.error(res.data.msg);
             }
             
        })
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
      let uploadMaxsize = 2*1024*1024;
      let uploadType = ["image/jpg", "image/png","image/jpeg"];
      let sizeFlag = true,typeFlag = true;
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
    addAvatarSuccess(res){
       if (res.code === 200) {
        this.addform.avatar = res.imgpath;
      } else {
        this.$message.error(res.msg);
      }
    }
  },
  mounted() {
    this.initData();
  },
};
</script>

<style scoped>
.pagin {
  position: absolute;
  bottom:10px;
  margin-left:30%;
}
p{
   margin: 0;
   padding:0;
   margin-bottom: 10px;
   padding-left:10%;
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