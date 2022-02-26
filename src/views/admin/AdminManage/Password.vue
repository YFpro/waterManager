<template>
  <div>
    <el-form :model="search" :inline="true">
      <el-form-item >
        <el-input placeholder="请输入用户名" v-model="search.uname"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button     type="info" size="medium" @click="searchhotal">查询</el-button>
         <el-button    type="info" size="medium" @click="all">全部</el-button>
      </el-form-item>
    </el-form>
    <el-table border  
    :data="tableData"
    >
      <el-table-column prop="uid" label="ID" align="center"> </el-table-column>
      <el-table-column prop="uname" align="center" label="用户名"> </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button    type="info" size="medium" @click="respass(scope.row.uid)">
            重置密码
          </el-button>
        </template>
      </el-table-column>
    </el-table>
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
      paginate: { limit:7, page: 1 },
      tableData: [],
      total: 0,
      dialogFormVisible: false,
    };
  },
  methods: {
    searchhotal() {
      this.paginate.page = 1;
      this.initData();
    },
    initData() {
      let params = Object.assign({}, this.search, this.paginate);
      axios.get("/admin/index/initresetpass", { params }).then((res) => {
        if (res.data.code === 200) {
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
    respass(uid){
       axios.get("/admin/index/resetpassword?uid="+uid).then((res) => {
        if (res.data.code === 200) {
          this.$message.success(res.data.msg);
          this.initData();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
     all(){
     this.search.uname ='',
     this.initData();
    },
  },
  mounted() {
    this.initData();
  },
};
</script>

<style scoped>
.pagin {
  position: absolute;
  bottom:20px;
  margin-left:30%;
}
</style>