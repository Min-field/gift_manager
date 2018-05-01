<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i>
          用户管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>


    <!-- 数据渲染 -->
    <el-table :data="data" border style="width:100%; margin-top:20px;">
      <el-table-column prop="openId" label="openId"></el-table-column>
      <el-table-column prop="nickname" label="昵称"></el-table-column>
      <el-table-column prop="gender" label="性别"></el-table-column>

      <el-table-column label="模板图片">
        <template slot-scope="scope">
          <img :src="scope.row.avatarUrl" height="50"/>
        </template>
      </el-table-column>
    </el-table>

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
        getUserUrl: '/manage/user/query',


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
      // 获取所有数据
      getData() {
        const {pageSize, cur_page} = this;
        const params = {pageSize, cur_page};
        this.$axios.post(this.getUserUrl, params).then((data) => {
          setNewVal(this, data);
		}).catch((data)=> {
            this.$message.info('获取数组失败')
			this.data = [];
		});
      },

      // 分页
      handleCurrentChange(val) {
        this.cur_page = val;
        this.getData();
      },

    }
  }
</script>

<style scoped>

  .avatar {
    width: 120px;
    height: 120px;
    display: inline-block;
  }

</style>
