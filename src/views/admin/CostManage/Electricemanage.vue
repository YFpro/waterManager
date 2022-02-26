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
    </el-form>
    <el-table border  :data="tableData">
      <el-table-column prop="uname" align="center" label="用户名"> </el-table-column>
      <el-table-column prop="electric" align="center" label="电费"> </el-table-column>
      <el-table-column prop="electrics" align="center" label="年度电费"> </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button  type="info" size="medium" @click="adddata(scope.row)">
            修改
          </el-button>
           <el-button  type="info" size="medium" @click="echart(scope.row.electrics)">
            查看
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
     <el-dialog
      title="电费修改"
      style="width: 50%; margin: auto"
      center
      :visible.sync="dialogFormVisible"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal='false'
    >
      <el-form
        :model="form"
        label-width="80px"
        status-icon
        ref="informationform"
        :rules="rules"
      >
        <el-form-item label="电费" prop="electric">
          <el-input v-model.number="form.electric" autocomplete="off"></el-input>
        </el-form-item>
         <el-form-item label="年度电费" prop="electrics">
          <el-input v-model="form.electrics" autocomplete="off"></el-input>
           <p style="padding:0;margin:0;font-size:13px;color:red;">请输入每个月的电费,用逗号隔开</p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resect('informationform')">取 消</el-button>
        <el-button  type="info" size="medium" @click="information('informationform')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :show-close="show"
      :visible.sync="dialogecharts"
      :width="width"
    >
     <div id="main"></div>
    </el-dialog>
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
       form: {
        uid:0,
        electric:0,
        electrics:""
      },
      dialogecharts:true,
      width:'0',
      show:false,
      rules: {
      electric: [{required:true,message:'请输入电费(数字)',type:'number', trigger: 'blur'}],
      electrics: [{ required: true, message: "请输入以往电费", trigger: "blur" }],
      },
      option:{
			title : {
				text: '用户每月电费',
				x:'center'
			},
      legend: {
				orient: 'vertical',
        left:"0",
        y:"15%",
				data: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月',
        '十二月']
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
			tooltip : {
				trigger: 'item',
				formatter: "{a} <br/>{b} : {c} ({d}%)"
			},
      color : [ 'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'purple','#0984e3',
      '#6c5ce7','#e17055','#e84393','#fdcb6e' ],
			series : [
				{
					name: '电费信息',
					type: 'pie',
					radius : '70%',
					center: ['58%', '50%'],
					data:[
						{value:335, name:'一月'},
						{value:310, name:'二月'},
						{value:234, name:'三月'},
						{value:0, name:'四月'},
						{value:1548, name:'五月'},
            {value:1548, name:'六月'},
            {value:1548, name:'七月'},
            {value:1548, name:'八月'},
            {value:1548, name:'九月'},
            {value:1548, name:'十月'},
            {value:1548, name:'十一月'},
            {value:1548, name:'十二月'},
					],
					itemStyle: {
            normal:{
               lable:{
                  show:true,
               }
            },
						emphasis: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					}
          }
        }
      ]
      }
    };
  },
  methods: {
    searchhotal() {
      this.paginate.page = 1;
      this.initData();
    },
    initData() {
      let params = Object.assign({}, this.search, this.paginate);
      axios.get("/admin/index/readelectric", { params }).then((res) => {
        if (res.data.code === 200) {
          this.tableData = res.data.data;
          this.total = res.data.total;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    handleCurrentPage(val) {
      this.paginate.page = val;
      this.initData();
    },
    adddata(data){
     this.form.uid=data.uid;
     this.form.electric=data.electric;
     this.form.electrics=data.electrics;
     this.dialogFormVisible = true;
    },
     resect(formName) {
      this.$refs[formName].resetFields();
      this.dialogFormVisible = false;
    },
    information(formName) {
       this.$refs.informationform.validate((validate) => {
            if(validate){
              this.form.electrics=this.form.electrics.replace(/，/g,',');
               axios.post('/admin/index/updateelectric',this.form).then((res)=>{
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
    all(){
     this.search.uname ='',
     this.initData();
    },
     echart(electrics){
       var electric = electrics.split(',');
       for(var i =0;i<12;i++){
           this.option.series[0].data[i].value=electric[i];
       }
       this.width='50%';
       this.show=true;
       var chartBar = this.$echarts.init(document.getElementById("main"));
       chartBar.setOption(this.option);
       this.dialogecharts=true;
    }
  },
  mounted() {
     this.initData();
     this.dialogecharts=false;
  },
};
</script>

<style scoped>
.pagin {
  position: absolute;
  bottom:20px;
  margin-left:30%;
}
#main{
   width:550px;
   height:450px;
   margin: auto;
}
</style>