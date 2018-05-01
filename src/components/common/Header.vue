<template>
    <div class="header">
        <div class="logo">
	        <span>求礼物后台</span>
        </div>
        <div class="user-info">
            <span>{{username}}</span>
            <span @click="logout">注销</span>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                name: '未登录'
            }
        },
        computed:{
            username(){
                let username = localStorage.getItem('username');
                return username ? username : this.name;
            }
        },
        methods:{
	        logout(){
		        this.$confirm('确定要退出登录吗?', '提示', {
			        confirmButtonText: '确定',
			        cancelButtonText: '取消',
			        type: 'info'
		        }).then(() => {
			        this.$store.commit('logout');
			        this.$router.push('/login');
		        });
	        }
        }
    }
</script>
<style>
    .header{
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        font-size: 22px;
        line-height: 70px;
        color: #fff;
	    background-color: #242f42;
    }
    .header .logo{
        float: left;
	    padding-left: 30px;
        text-align: center;
    }
    .header .logo img{
	    vertical-align: middle;
    }
    .user-info{
        float: right;
        padding-right: 50px;
        font-size: 16px;
        color: #fff;
    }
    .user-info span{
	    margin-right: 30px;
	    cursor: pointer;
    }
</style>
