<template>
    <div class="sidebar">
        <el-menu :default-active="onRoutes"
                 :default-openeds="openeds"
                 background-color="#324157"
                 text-color="#bfcbd9"
                 active-text-color="#20a0ff"
                 router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index">
                        <template slot="title">
	                        <i :class="item.icon"></i>{{ item.title }}
                        </template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">
	                        <i class="el-icon-caret-right"></i>{{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index">
                        <i :class="item.icon"></i>{{ item.title }}
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    export default {
        data() {
            return {
	            openeds: ["1","2","3"],
                items: [{
                    icon: 'el-icon-menu',
                    index: '1',
                    title: '礼物管理',
                    subs: [{
	                    index: 'gift',
	                    title: '礼物列表'
                    }, {
                        index: 'template',
                        title: '海报模板'
                    }]
                },{
                    icon: 'el-icon-tickets',
                    index: 'user',
                    title: '用户管理',
                },{
                    icon: 'el-icon-view',
                    index: 'order',
                    title: '订单管理',
                }, {
                    icon: 'el-icon-picture',
                    index: 'condition',
                    title: '文案管理',
                }]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        width: 16%;
        left: 0;
        top: 70px;
        bottom: 0;
    }
    .sidebar > ul {
        height: 100%;
    }
</style>
