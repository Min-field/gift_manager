<template>
	<div class="table">
		<!-- Breadcrumb 面包屑 基础用法 crumbs自定义样式main.css-->
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-tickets"></i> 用户管理</el-breadcrumb-item>
				<el-breadcrumb-item>用户列表</el-breadcrumb-item>
			</el-breadcrumb>
		</div>

		<!-- handle-box、 handle-input自定义样式 
			Input 输入框 基础用法
			Button 按钮 基础用法
			select_word与data数据挂钩
		-->
		<div class="handle-box">
			<el-input v-model="select_word" @change="search" placeholder="请输入用户微信昵称" class="handle-input"></el-input>
			<el-button type="primary" @click="handleSearch">搜索</el-button>
		</div>

		<!-- Table 表格:带边框表格 
			slot-scope="scope"代码与data数据挂钩
		-->
		<el-table :data="data" border style="width:100%;">
			<el-table-column label="注册时间">
				<template slot-scope="scope">
					{{scope.row.createDate | dateFormat}}
				</template>
			</el-table-column>

			<el-table-column label="用户头像">
				<template slot-scope="scope">
					<img :src="scope.row.avatarUrl" height="35" />
				</template>
			</el-table-column>

			<el-table-column prop="nickName" label="用户昵称"></el-table-column>

			<el-table-column prop="location" label="注册地点"></el-table-column>
		</el-table>


		<!-- Pagination分页： 带有背景色的分页，current-page当前页面，total是总页面 current-change是分页事件-->
		<div class="pagination">
			<el-pagination
					@current-change ="handleCurrentChange"
					background
					layout="prev, pager, next"
					:current-page="cur_page"
					:total="total_page">
			</el-pagination>
		</div>
	</div>

</template>

<script>
	// 在 Vuejs 项目中使用 JavaScript 库的一个优雅方式是将其代理到 Vue 的原型对象上去. 按照这种方式, 我们引入 Moment 库
	import moment from 'moment';
	// 数据赋值方法
	import {setNewVal} from '@/assets/utils.js';

	export default {
		data() {
			return {
				url: '/api/userAll',
				select_word: '',
				isSearch: false,
				data: [],

				// 分页
				pageSize: 50,
				cur_page: 1,
				totalLength: 0
			}
		},
		mounted() {   // 一上来就渲染数据
			this.getData(); 
		},
		computed: {
			total_page(){ return (this.totalLength / this.pageSize)*10; }
		},
		filters: {
			dateFormat(el){ return moment(el).format('YYYY-MM-DD HH:mm:ss'); }
		},
		methods: {
			// err
			err(content, data){
				this.$message.info(content);
				console.log(data.msg);
			},
			// info
			info(content){ this.$message.info(content); },

			/*获取所有数据*/
			getData(){
				const { pageSize, cur_page, select_word } = this;
				const params = { pageSize, cur_page, select_word };

				this.$axios.post(this.url, params).then((data) => {
					// data, totalLenth
					setNewVal(this, data);
				}).catch((data)=> {
					this.data = [];
					this.err('获取数据失败', data);
				});
			},
			/*分页*/
			handleCurrentChange(val){
				this.cur_page = val;
				this.getData();
			},
			/*开启查询状态*/
			handleSearch(){
				this.isSearch = true;
				this.cur_page = 1;
				this.getData();
			},
			/*查询*/
			search(){
				if(this.isSearch){
					this.cur_page = 1;
					this.getData();
				}
			}
		}
	}
</script>

<style scoped>
	.handle-box{
		margin-bottom: 20px;
	}
	.handle-input{
		width: 300px;
		display: inline-block;
	}
</style>