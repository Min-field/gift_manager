<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i>
          礼物管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>海报列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-card class="box-card">
      <p class="add-title">添加模板</p>
      <el-row class="add-item">

        <!-- 上传模板图片 -->
        <el-col :span="5">
          <span>上传模板图片</span>
        </el-col>

           <!--模仿图片上传-->
        <input class="file" name="file" type="file" accept="image/png,image/gif,image/jpeg" ref="templateImgSrc" @change="changeFile"/>

      </el-row>

      <el-row>
        <el-col :span="5">
          <span>&nbsp;</span>
        </el-col>
        <el-col :span="5">
          <el-button @click="handleAddition" type="success" class="add-btn">添加</el-button>
        </el-col>
      </el-row>

    </el-card>

    <!-- 数据渲染 -->
    <el-table :data="data" border style="width:100%; margin-top:20px;">
      <el-table-column prop="_id" label="id"></el-table-column>

      <el-table-column label="模板图片">
        <template slot-scope="scope">
          <img :src="scope.row.imageUrl" height="50"/>
        </template>
      </el-table-column>

      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="text" label="文案"></el-table-column>
	  <el-table-column prop="priority" label="优先级" width="60%"></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="editTemplate(scope.$index, scope.row)" style="margin-left:10px;">
            <i class="el-icon-edit"></i>
            修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>


    <!--修改信息 弹框 -->
    <el-dialog title="修改信息" width="70%" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="标题" prop="title" :label-width="formLabelWidth">
          <el-input v-model="form.title" auto-complete="off" :span="5" style="width:250px"></el-input>
        </el-form-item>
        <el-form-item label="文案" prop="text" :label-width="formLabelWidth">
          <el-input v-model="form.text" auto-complete="off" :span="5"></el-input>
        </el-form-item>
        <el-form-item label="新的优先级" prop="priority" :label-width="formLabelWidth">
          <el-select v-model="form.priority" placeholder="请选择" style="width:120px">
            <el-option label="禁用" value="-1"></el-option>
            <el-option label="优先1" value="1"></el-option>
            <el-option label="优先2" value="2"></el-option>
            <el-option label="优先3" value="4"></el-option>
            <el-option label="优先4" value="5"></el-option>
            <el-option label="优先5" value="5"></el-option>
            <el-option label="优先6" value="6"></el-option>
            <el-option label="优先7" value="7"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="新的模板图片" :label-width="formLabelWidth">
           <!--
		    <img src=" " style="width:120px;height:120px"/>
			<el-button class="chooseImgBtn">选择图片</el-button>
		   -->
		    <input class="file" name="file" type="file" accept="image/png,image/gif,image/jpeg" ref="templateNewImg" @change="changeFile"/>
			<p>(若不想更改图片，可以不进行选择)</p>
        </el-form-item>


      </el-form>
      <div class="dialog-footer-center">
        <el-button type="success"  @click="handleUpdation">确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 底部分页 -->
    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        background
        layout="prev, pager, next"
        :current-page="cur_page"
        :total="total_page">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import moment from 'moment';
  import {setNewVal} from '@/assets/utils.js';


  export default {
    data() {
      return {
        getTemplateUrl: '/api/getAllTemplate',
        createTemplateUrl: '/api/createTemplate',
        updateTemplateUrl: '/api/updateTemplate',
        modifyTemplateImageUrl: '/api/modifyTemplateImage',
        data: [],
        // 上传模板图片
        imageUrl: '',

        // 添加模板
        title: '',
        text: '',

        // 下拉框
        Priority: '',

        // 弹出框
        dialogTableVisible: false,
        dialogFormVisible: false,


		// 修改表单显示信息
        form: {
		  _id:'',   // 模板标识
          title: '',
          text: '',
		  imageUrl:'',
		  priority:''
        },

        fileList: [],

        formLabelWidth: '120px',

        // 分页
        pageSize: 50,
        cur_page: 1,
        totalLength: 0,

      }
    },

    mounted() {   // 一上来就渲染数据
      this.getData();
    },
    computed: {
      // 总页数
      total_page() {
        return (this.totalLength / this.pageSize) * 10;
      },
    },
    filters: {
      dateFormat(el) {
        return moment(el).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    methods: {
      // err
      err(content, data) {
        this.$message.info(content);
        console.log(data.msg);
      },
      // info
      info(content) {
        this.$message.info(content);
      },

      // 获取所有数据
      getData() {
        const {pageSize, cur_page} = this;
        const params = {pageSize, cur_page};

        this.$axios.post(this.getTemplateUrl, params).then((data) => {
          // data, totalLenth
          setNewVal(this, data);
		}).catch((data)=> {
			this.err('获取数据失败', data);
			this.data = [];
		});
      },

      // 分页
      handleCurrentChange(val) {
        this.cur_page = val;
        this.getData();
      },
	  changeFile() {


	  },
      // 添加模板信息
    handleAddition() {

      // 模板图片
      var templateImgSrc = this.$refs.templateImgSrc.files[0];

      if( templateImgSrc === undefined ){
        alert('请选择图片')
      }else if( templateImgSrc.size > 2097152 ) {
          alert('图片大于2M，资源过大会导致加载缓慢，请重新选择')
      }else if(!this.title) {
          alert('请填写标题')
      }else {

			//创建form对象
			let param = new FormData()
			param.append('file', templateImgSrc)
			param.append('title', this.title)
			param.append('text', this.text)

			console.log(param.get('file'))  // FormData私有类对象，访问不到，可以通过get判断值是否传进去
			console.log(param.get('title'))
			console.log(param.get('text'))

			 //添加请求头(内部已经设置有)

			this.$axios.post2(this.createTemplateUrl,param)
			.then((response) => {
				  this.info('上传成功')
				  console.log('成功上传',response)
				  // 渲染数据
				  this.getData()
				  // this.$refs.templateImgSrc.files[0] = {};
          // this.$refs.templateImgSrc.files = []
				  this.title=""
				  this.text=""

			}).catch((error)=> {
				this.err('添加数据失败', error);
				console.log('------错误原因----------')
				console.log(error)
			})
		}

      },
		// 弹出编辑界面对应信息
		editTemplate(index, row){
			// 输出行内数据
			console.log('----行内数据------')
			console.log(row)

			// 弹窗
			this.dialogFormVisible = true;
		    // 数据赋值显示
			this.form = row   // _id  title text priority

	    },
		// 修改更新
		 handleUpdation() {
			/*alert(JSON.stringify(params));*/

			let that = this

			const templateId = this.form._id
			const {title,text,priority} = this.form
			const param = {templateId,title,text,priority }
			console.log(param)

			this.$axios.post(this.updateTemplateUrl,param)
			.then((response) => {
					// do something further

					// 更改模板图片
					console.log(this.$refs.templateNewImg.files[0] === undefined)
					var templateNewImg = this.$refs.templateNewImg.files[0]

					// 1. 不需要进行模板图片修改
					if(templateNewImg === undefined ) {
						console.log('修改成功',response)
						that.info('修改成功')
						// 关闭弹窗
						that.dialogFormVisible = false;
						that.getData()
					}
					// 2. 进行模板图片修改
					else {
						let param = new FormData()
						param.append('file', this.$refs.templateNewImg.files[0])
						param.append('templateId', this.form._id)

						 //添加请求头 (已经内置有)

						this.$axios.post2(this.modifyTemplateImageUrl,param)
						.then((response) => {
							console.log('修改成功',response)
							that.dialogFormVisible = false;
							that.info('修改成功')
							// 重新渲染数据
							that.getData()

						}).catch((error)=> {
							this.err('修改数据失败', error);
							console.log('------修改失败原因----------')
							console.log(error)
						})
					}
			}).catch((error)=> {
				 this.err('修改数据失败', error);
			})
	    },

    }
  }
</script>

<style scoped>
  .add-title {
    font-size: 18px;
    /*background-color: pink;*/
    padding-bottom: 6px;
    border-bottom: 1px solid #ccc;

  }

  .add-item {
    vertical-align: middle;
    margin-top: 20px;
  }

  /*上传图片样式*/
  .avatar-uploader {
    border: 2px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 120px;
    height: 120px;
    /* margin:10px 0 10px 50px; */
    /*background-color: pink;*/
  }

  .avatar-uploader:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }

  .avatar {
    width: 120px;
    height: 120px;
    display: inline-block;
  }

  /* 输入框 */
  .handle-input {
    width: 240px;
    margin-top: 0px;
    display: inline-block;
  }

  .text-input {
    width: 900px;
    margin-top: 0;
  }

  .add-btn {
    /* margin: 40px 20px 20px 70px; */
    margin-top: 20px;
  }

  /* 弹框 */
  .chooseImgBtn {
    position: relative;
    top: -50px;
    left: 20px;
  }

  .dialog-footer-center {
    text-align: center;
  }
</style>
