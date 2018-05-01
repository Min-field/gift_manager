<template>
    <div class="login-wrap">
        <div class="ms-title">礼物说留声后台</div>
        <div class="ms-login">
            <!-- form中的表单验证 -->
            <el-form :model="ruleForm" :rules="rules" ref="loginFrom">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username" autofocus></el-input>
                </el-form-item>

                <el-form-item prop="password">
                    <el-input v-model="ruleForm.password" type="password" placeholder="password"
                              @keyup.enter.native="submitForm('loginFrom')">
                    </el-input>
                </el-form-item>

                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('loginFrom')">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
	import md5 from 'js-md5';
    export default {
        data: function(){
            return {
            	loginUrl: '/api/managerLogin',
                ruleForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [ { required: true, message: '请输入用户名', trigger: 'blur' } ],
                    password: [ { required: true, message: '请输入密码', trigger: 'blur' } ]
                }
            }
        },
        methods: {
	        // 登录
	        submitForm(formName) {
		        this.$refs[formName].validate((valid) => {
			        if(!valid){ // 表单判断正确
				        console.log('valid == false');
				        return false;
			        }else{
				        const params = {
					        user: this.ruleForm.username,
					        pass: md5(this.ruleForm.password)
				        };
				        this.$axios.post(this.loginUrl, params).then((data) => {
					        console.log(data.return_code);
					        if(data.result){
						        // 存token和username
						        this.$store.state.token = data.token;
						        localStorage.setItem('token', data.token);
						        localStorage.setItem('username', this.ruleForm.username);

                                var that = this;
                                // 弹窗 跳转
						        this.$message({
							        type: 'success',
							        message: '登录成功',
							        duration: 1200,
							        onClose(){
                                        console.log(this);
								        let targetPath = decodeURIComponent(that.$route.query.targetPath || '/qrlist');
								        that.$router.push({ path: targetPath });
							        }
						        });
					        }else{ this.$message.info('账号或密码错误'); }
				        }).catch((data)=>{
					        this.$message.info('提交失败');
					        console.log(data.msg);
				        });
			        }
		        });
	        }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
	    background: #324157;
    }
    .ms-title{
        position: absolute;
        top:50%;
        width:100%;
        margin-top: -230px;
        text-align: center;
        font-size:30px;
        color: #fff;

    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:300px;
        height:160px;
        margin:-150px 0 0 -190px;
        padding:40px;
        border-radius: 5px;
        background: #fff;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
    }
</style>