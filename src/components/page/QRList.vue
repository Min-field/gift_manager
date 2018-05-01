<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 二维码管理</el-breadcrumb-item>
                <el-breadcrumb-item>二维码列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

	    <transition name="slide-fade">
		    <el-card class="box-card" v-show="isCreating">
			    <el-col class="text item">
				    <p>正在生成二维码 ...</p>
				    <p v-if="finishTime != 0 ">剩余生成时间:  {{finishTime}} 秒</p>
					<p v-if="finishTime == 0">生成成功，正在打包</p>
			    </el-col>
		    </el-card>
	    </transition>

	    <el-card class="box-card">
		    <div slot="header" class="clearfix">
			    <span>数据概览</span>
			    <div style="float: right;">
				    <el-button style="padding: 5px" @click="massShowDialog">批量生成</el-button>
				    <el-button style="padding: 5px" @click="massDownloadShow">批量下载</el-button>
			    </div>
			    <!--批量生成弹窗-->
			    <el-dialog title="批量生成" width="35%" :visible.sync="createVisible">
			    	<el-form :model="createForm" :inline="true" ref="createForm" :rules="createRules">
					    <el-form-item label="生成个数" prop="createNum">
						    <el-input autofocus v-model="createForm.createNum" size="mini"></el-input>
					    </el-form-item>
					    <el-form-item label="生成类型" prop="kind">
						    <el-radio-group v-model="createForm.kind">
							    <el-radio label="小程序二维码"></el-radio>
							    <el-radio label="普通链接二维码"></el-radio>
						    </el-radio-group>
					    </el-form-item>
					    <!-- <p style="margin-top:30px">生成每个图片预计用时{{createTime}}毫秒，生成后可进行批量下载</p> -->
											 
						  <!-- 上传内部二维码图片 -->
						  
						  <p>中心图标
								<form id='videoForm'> 
									<input class="QRCodeIcon" id="QRCodeFile" name="file" type="file" accept="image/png" ref="QRImgFile" @change="changeImgFile"/>
								</form>
						</p>
						  <p style="color:red;font-size:14px">注意：上传的中心图标分辨率大小必须是190×190，圆形透明底png格式图片</p>
				    </el-form>
				    <p slot="footer" class="dialog-footer" >
					    <el-button @click="createFormCancle">取 消</el-button>
					    <el-button type="primary" @click="massProduction('createForm')">确 定</el-button>
				    </p>
			    </el-dialog>

			    <!--批量下载弹窗-->
			    <el-dialog :visible.sync="mass.dialogV">
				    <el-table :data="mass.data" border style="width:100%;">
					    <el-table-column prop="batchId" label="生成批次"></el-table-column>

					    <el-table-column prop="created" label="二维码数量"></el-table-column>

					    <el-table-column label="批次状态">
						    <template slot-scope="scope">
							    <p v-if="scope.row.status">已生成</p>
							    <p v-else>生成中</p>
						    </template>
					    </el-table-column>

					    <el-table-column label="操作">
						    <template slot-scope="scope">
							    <el-button type="text" @click="massDownload(scope.$index,scope.row)">
								    <i class="el-icon-download"></i>
								    下载地址
							    </el-button>
						    </template>
					    </el-table-column>
				    </el-table>
				    <div class="pagination">
					    <el-pagination
							    @current-change ="handleCurrentChange_mass"
							    background
							    layout="prev, pager, next"
							    :current-page="mass.cur_page"
							    :total="massTotal_page">
					    </el-pagination>
				    </div>
			    </el-dialog>

				<!--点击批量下载中的"下载" —— 下载地址弹窗显示 -->
				<el-dialog title="下载地址" :visible.sync="downloadDialogV">
				  <el-form :model="downloadForm">
					<el-form-item label="链接地址" :label-width="downloadForm.formLabelWidth">
					  <el-input v-model="downloadForm.downLink" auto-complete="off" class="link-read" id="inputLink"></el-input>
					</el-form-item>
				  </el-form>
				  <div slot="footer" class="dialog-footer">
					<el-button @click="downloadDialogV = false">取 消</el-button>
					<el-button type="primary" @click="copyLink">复制</el-button>
				  </div>
				</el-dialog>
		    </div>


		    <el-col :span="6" class="text item">
			    <p>正在生成</p>
			    <p>{{creatingCnt}}</p>
		    </el-col>
		    <el-col :span="6" class="text item">
			    <p>当前可下载量</p>
			    <p>{{qrCodeExpCnt}}</p>
		    </el-col>
		    <el-col :span="6" class="text item">
			    <p>累计生成量</p>
			    <p>{{qrCodeCnt}}</p>
		    </el-col>
		    <el-col :span="6" class="text item">
			    <p>已录制</p>
			    <p>{{recordedCnt}}</p>
		    </el-col>

	    </el-card>

	    <el-form :inline="true">
		    <el-form-item label="录音状态:" label-width="80px">
			    <el-select class="handle-select" v-model="select_cate" @change="search" placeholder="筛选状态">
				    <el-option label="全部状态" value="全部状态"></el-option>
				    <el-option label="已录制" value="已录制"></el-option>
				    <el-option label="未录制" value="未录制"></el-option>
			    </el-select>
		    </el-form-item>

		    <el-form-item label="二维码编号:" label-width="120px">
			    <el-input v-model="qrCodeId" @change="search" placeholder="请输入二维码编号"></el-input>
		    </el-form-item>

		    <span style="float:right">
				<el-button @click="handleSearch" type="primary" icon="el-icon-search">查询</el-button>
			</span>
	    </el-form>

        <el-table :data="data" border style="width:100%;">

            <el-table-column prop="qrCodeId" label="QR序号"></el-table-column>

            <el-table-column label="更新时间">
	            <template slot-scope="scope">
		            {{scope.row.update | dateFormat}}
	            </template>
            </el-table-column>

	        <el-table-column prop="userNickName" label="已绑定用户"></el-table-column>

	        <el-table-column label="状态">
		        <template slot-scope="scope">
			        <p class="hasTap" v-if="(scope.row.status == 1)">已录制</p>
			        <p class="notTap" v-else>未录制</p>
		        </template>
	        </el-table-column>

            <el-table-column label="操作" width="235">
                <template slot-scope="scope">
                    <el-button type="text" @click="downloadQR(scope.$index, scope.row)">
	                    <i class="el-icon-download"></i>
	                    下载二维码
                    </el-button>
                    <el-button v-if="(scope.row.status == 1)" type="text" @click="deleteVoice(scope.$index, scope.row)">
	                    <i class="el-icon-delete"></i>
	                    清除内容
                    </el-button>
	                <el-button v-else type="text" disabled>
		                <i class="el-icon-delete"></i>
		                清除内容
	                </el-button>
                </template>
            </el-table-column>

        </el-table>

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

  import moment from 'moment';
	import {setNewVal} from '@/assets/utils.js';
    export default {
        data() {
        	// 生成个数验证
	        let _createNum = (rule, value, callback) => {
		        if (!value) { return callback(new Error('请输入生成个数')); }

		        setTimeout(() => {
			        if (value <= 0 || value > 100000 || value % 1 != 0) {
				        callback(new Error('必须是0-100000之间的整数'));
			        } else { callback(); }
		        }, 500);
	        };
            return {
            	url: '/api/qrCodeAll',
	            overviewUrl: '/api/qrCodeStatus',
	            creatingUrl: '/api/createQRCode',
	            isCreatingUrl: '/api/qrCodeSchedule',
		        deleteUrl: '/api/deleteQRCodeRec',
	            searchQRUlr: '/api/getQRCodeInfo',
	            getMassUrl: '/api/getQRCodeBatch',
				uploadQRCodeIcon:'/api/uploadQRCodeIcon',
				
	            pageSize: 50,         // 一页显示多少
	            cur_page: 1,          // 当前页码
	            isCreating: false,    // 是否正在生成
	            creatingTimer: null,  // 是否正在生成定时器
	            creatingCnt: '',      // 正在生成
	            finishTime: 1,        // 剩余生成时间(默认是是1)
	            createTime: 600,      // 生成每个的时间
	            createForm: {
		            createNum: 1,
		            kind: ''
	            },
	            createRules: {
		            createNum: [ { required: true, validator: _createNum, trigger: 'blur' } ],
		            kind: [ { required: true, message: '请选择类型', trigger: 'change' } ]
	            },
	            createVisible: false,
	            qrCodeExpCnt: '',       // 当前可下载量
	            qrCodeCnt: '',          // 累计生成量
	            recordedCnt: '',        // 已录音制
	            select_cate: '',        // 状态筛选
	            isSearch: false,
	            qrCodeId: '',           // 查询二维码
	            notification: null,     // 当前提示框
	            totalLength: 0,
              data: [],
	            mass: {
		            dialogV: false,
		            data: [],
		            totalLength: 0,
		            pageSize: 10,       // 一页显示多少
		            cur_page: 1         // 当前页码
	            },

              // 下载弹窗
              downloadDialogV: false,
              downloadForm: {
                downLink: '' ,
                formLabelWidth: '100px'
              },

            }
        },
        computed: {
	        // 总页数
	        total_page(){ return (this.totalLength / this.pageSize)*10; },
	        // 弹窗总页数
	        massTotal_page(){ return (this.mass.totalLength / this.mass.pageSize)*10; },
	        // 状态
	        status(){
		        switch(this.select_cate){
			        case '':
			        case '全部状态': { return 2; }
			        case '已录制': { return 1; }
			        case '未录制': { return 0; }
		        }
	        },
	        // 状态
	        create_kind(){
		        switch(this.createForm.kind){
			        case '小程序二维码': { return 0; }
			        case '普通链接二维码': { return 1; }
		        }
	        }
        },
	    mounted(){
        	// 表格数据
		    this.getData();
		    // 所有二维码状态
		    this.getOverviewData();
		    // 刚进页面--是否正在生成
		    this.getIsCreatingData_start();
	    },
	    filters: { dateFormat(el){ return moment(el).format('YYYY-MM-DD HH:mm:ss'); } },
        methods: {
	    	// err
	        err(content, data){
		        this.$message.info(content);
		        console.log(data.msg);
	        },
	        // info
	        info(content){ this.$message.info(content); },

	        // 获取所有数据
            getData(){
            	const { pageSize, cur_page, status, qrCodeId } = this;
	            const params = { pageSize, cur_page, status, qrCodeId };

	            this.$axios.post(this.url, params).then((data) => {
		            // data, totalLenth
		            setNewVal(this, data);
	            }).catch((data)=> {
		            this.data = [];
		            this.err('获取数据失败', data);
	            });
            },
	        // 获取批量下载数据
	        getMassData(){
		        const { pageSize, cur_page } = this.mass;
		        const params = { pageSize, cur_page };

		        this.$axios.post(this.getMassUrl, params).then((data) => {
		        	// data, totalLenth
			        setNewVal(this.mass, data);
		        }).catch((data)=> {
			        this.mass.data = [];
			        this.err('获取数据失败', data);
		        });
	        },
	        // 获取所有二维码状态
	        getOverviewData(){
		        this.$axios.get(this.overviewUrl).then((data) => {
					// creatingCnt, qrCodeExpCnt, qrCodeCnt, recordedCnt
			        setNewVal(this, data);
		        }).catch((data)=> {
			        this.err('获取数据失败', data);
		        });
	        },
	        // 刚进页面--获取是否正在生成
	        getIsCreatingData_start(){
		        this.$axios.get(this.isCreatingUrl).then((data) => {
			        if(!data.creating){
				        this.isCreating = false;
				        this.creatingTimer = clearInterval(this.creatingTimer);
				        console.log('---无项目正在生成---');
			        }else{
				        this.isCreating = true;
				        // 请求二 是否正在生成
				        this.creatingTimer = setInterval( ()=> {
					        this.getIsCreatingData();
					        this.getOverviewData();
			            },1000);
			        }
		        }).catch((data)=> {
			        this.err('获取数据失败', data);
		        });
	        },
	        // 获取是否正在生成
	        getIsCreatingData(){
		        this.$axios.get(this.isCreatingUrl).then((data) => {
			        this.isCreating = true;
			        if(!data.creating){
				        this.isCreating = false;
				        this.creatingTimer = clearInterval(this.creatingTimer);

						let that = this;
				        this.$message({
					        type: 'success',
					        message: '生成成功!',
					        onClose(){ that.getData(); }
				        });
			        }else{
				        console.log('---正在生成项目---');
				        this.finishTime = (data.total - data.created) * this.createTime / 1000;
			        }
		        }).catch((data)=> {
			        this.err('获取数据失败', data);
		        });
	        },
	        // 分页
	        handleCurrentChange(val){
		        this.cur_page = val;
		        this.getData();
	        },
	        // 弹窗分页
	        handleCurrentChange_mass(val){
		        this.mass.cur_page = val;
		        this.getMassData();
	        },
	        // 单个删除
	        deleteVoice(index, row){
		        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
			        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
		        }).then(() => {
			        const params = { 'id': row.qrCodeId };
			        this.$axios.post(this.deleteUrl, params).then(() => {
				        row.status = 0;
				        row.userNickName = '';
				        this.getOverviewData(); // 更新所有二维码状态
				        this.$message.success('删除成功!');
			        }).catch((data)=> {
			        	this.err('删除失败', data);
			        });
		        }).catch(() => {
			        this.info('已取消删除');
		        });
	        },
			// 批量生成弹窗
			massShowDialog() {
				this.createVisible = true
			},	
			changeImgFile() {
				var QRImgFile = this.$refs.QRImgFile.files[0];	
				console.log(QRImgFile)
				
				if(QRImgFile.type != "image/png"){
					alert("请选择png格式图片")													
					document.getElementById('videoForm').reset();   // 表单重置来清空file					
					console.log(this.$refs.QRImgFile.files[0])
				}			
			},	
	        // 批量生成
	       massProduction(formName){
				var  that = this;			
				// 二维码内部图片
				var QRImgFile = this.$refs.QRImgFile.files[0];
						
				if( QRImgFile === undefined ) {
					  // 发送数据生成二维码
					that.$refs[formName].validate((valid) => {
						 console.log('----------成功上传------------')					
			            if (!valid){
							that.$message.info('请填写正确信息');
							return false;
			            }else {													
						    
							// 请求一 是否可以生成
							const params = {
								'total': that.createForm.createNum,
								'kind': that.create_kind								
							};
							that.$axios.post(that.creatingUrl, params).then(() => {
								that.createFormCancle();
								that.isCreating = true;
								
								// 请求二 是否正在生成
								that.creatingTimer = setInterval(() => {
									that.getIsCreatingData();
									that.getOverviewData();
								}, 600);
							}).catch(() => {
								that.info('当前正在生成项目，请稍等');
							});
						}
					});								
				}else {		
				
				    //创建form对象
					let param = new FormData()  
					param.append('file', QRImgFile)				
					console.log(param.get('file'))  // FormData私有类对象，访问不到，可以通过get判断值是否传进去
					
					//添加请求头(内部已经设置有) 					
					this.$axios.post2(this.uploadQRCodeIcon,param)
					.then((response) => {	
						  console.log('成功上传',response)	
						  document.getElementById('videoForm').reset();   // 表单重置来清空file
						 						  
						  console.log(that.$refs.QRImgFile.files[0])
						   
						  // response是返回的数据
						  var imageUrl = response.imageUrl						  
						  console.log(imageUrl)
						  						  
						  // 发送数据生成二维码
						that.$refs[formName].validate((valid) => {										
							if (!valid){
								that.$message.info('请填写正确信息');
								return false;
							}else {																					
								// 请求一 是否可以生成
								const params = {
									'total': that.createForm.createNum,
									'kind': that.create_kind,
									'imageUrl':imageUrl    // 内部图片
								};
								that.$axios.post(that.creatingUrl, params).then(() => {
									that.createFormCancle();
									that.isCreating = true;									
									
									// 请求二 是否正在生成
									that.creatingTimer = setInterval(() => {
										that.getIsCreatingData();
										that.getOverviewData();
									}, 600);
								}).catch(() => {
									that.info('当前正在生成项目，请稍等');
								});
							}
						});
																  
					}).catch((error)=> {
						console.log('------发送图片错误原因----------')
						console.log(error)
					})					
				}								
	        },
	        createFormCancle(){
		        this.createVisible = false;
		        this.createForm.createNum = 1;
		        this.createForm.kind = '';
	        },
	        // 批量下载
	        massDownloadShow(){
	        	this.mass.dialogV = true;
	        	this.getMassData();
	        },
			// 弹出下载链接
	        massDownload(index, row){
				let that = this;
				
	        	if(!row.downloadUrl){
			        this.$message({
				        type: 'info',
				        message: '此批二维码正在生成哦~',
				        duration: 1200,
				        onClose(){ that.mass.dialogV = false; }
			        });
		        }else {
			       /*
				   this.$confirm('需要下载这批二维码吗?', '提示', {
				        confirmButtonText: '确定', cancelButtonText: '取消', type: 'info'
			        }).then(() => {
			            window.open(row.downloadUrl,'_blank');
			        }).catch(() => {
				        this.info('已取消下载');
			        });*/
					
					this.$confirm('需要复制这批二维码的下载链接吗?', '提示', {
						confirmButtonText: '确定', cancelButtonText: '取消', type: 'info'
					}).then(() => {
						// 显示复制链接弹窗	
						that.downloadDialogV = true;
							// 链接赋值
						that.downloadForm.downLink = row.downloadUrl;     
					}).catch(() => {
						this.info('已取消下载');
					})
		        }
	        },
			// 复制链接
			copyLink() {  
			  var Url = document.getElementById("inputLink");   
				  Url.select(); 			 // 选择对象  
				  document.execCommand("Copy"); // 执行浏览器复制命令  				  
				  this.info('复制成功！');				 
			},    
	        // 单个下载
	        downloadQR(index, row){
		        this.$confirm('需要下载该二维码吗?', '提示', {
			        confirmButtonText: '确定', cancelButtonText: '取消', type: 'info'
		        }).then(() => {
			        window.open(row.qrCodeUrl,'_blank');
		        }).catch(() => {
			        this.info('已取消下载');
		        });
            },

	        // 开启查询状态
	        handleSearch(){
		        this.isSearch = true;
		        this.cur_page = 1;
		        this.getData();
	        },
	        // 查询
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
	.handle-select{
	    width: 120px;
	}
	.text{
		font-size: 14px;
	}
	.item{
		float: left;
		margin-bottom: 18px;
		text-align: center;
		font-size: 16px;
		font-weight: 600;
	}
	.item p:first-child{
		color: #20a0ff;
	}
	.item p:last-child{

	}
	.box-card{
		width: 100%;
		margin-bottom: 25px;
	}
	.hasTap{
		width: 25%;
		border-radius: 3px;
		text-align: center;
		color: #fff;
		background-color: #67c23a;
	}
	.notTap{
		width: 25%;
		border-radius: 3px;
		text-align: center;
		color: #fff;
		background-color: #dd6161;
	}
	.slide-fade-enter-active {
		transition: all .3s ease;
	}
	.slide-fade-leave-active {
		transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
	}
	.slide-fade-enter, .slide-fade-leave-to{
		transform: translateX(10px);
		opacity: 0;
	}
	
	.QRCodeIcon {
		margin-left:15px;
	}
</style>
