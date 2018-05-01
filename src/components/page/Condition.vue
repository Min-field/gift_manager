<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="el-icon-menu"></i>
            条件设置
            </el-breadcrumb-item>
        </el-breadcrumb>

        <div class="collapse">
            <el-collapse>
                <el-collapse-item v-for="(item, index) in items">
                    <template slot="title">
                        小于{{item.minPrice}}
                        <el-button type="danger" icon="el-icon-delete" circle v-on:click.stop="removeCondition(index)"></el-button>
                    </template>
                    <div>
                        <div>打赏  {{item.donatePrice1}} , 回报    {{item.donateReward1}}   </div>
                        <div>打赏  {{item.donatePrice2}} , 回报    {{item.donateReward2}}   </div>
                        <div>打赏  {{item.donatePrice3}} , 回报    {{item.donateReward3}}   </div>
                    </div>

                </el-collapse-item>
            </el-collapse>
        </div>

        <div class="section">
            <el-form label-position="left">
                <el-form-item label="满足前置" label-width="100px">
                    <el-input placeholder="请输入内容" v-model="donatePrice1">
                        <template slot="prepend">少于</template>
                    </el-input>
                </el-form-item>

                <el-form-item label="条件1"  label-width="100px">
                    <el-input placeholder="请输入内容" v-model="donatePrice1">
                        <template slot="prepend">打赏</template>
                    </el-input>

                    <el-input placeholder="请输入内容" v-model="donateReward1">
                        <template slot="prepend">回报</template>
                    </el-input>
                </el-form-item>

                <el-form-item label="条件2" label-width="100px">
                    <el-input placeholder="请输入内容" v-model="donatePrice2">
                        <template slot="prepend">打赏</template>
                    </el-input>

                    <el-input placeholder="请输入内容" v-model="donateReward2">
                        <template slot="prepend">回报</template>
                    </el-input>
                </el-form-item>

                <el-form-item label="条件3" label-width="100px">
                    <el-input placeholder="请输入内容" v-model="donatePrice3">
                        <template slot="prepend">打赏</template>
                    </el-input>

                    <el-input placeholder="请输入内容" v-model="donateReward3">
                        <template slot="prepend">回报</template>
                    </el-input>
                </el-form-item>
            </el-form>
        </div>
    </div>

</template>

<script>
export default {
    data() {
        return {
            items: [{
                minPrice: 200,
                donatePrice1: 1000,
                donateReward1: "给你发一张自拍",
                donatePrice2: 2000,
                donateReward2: "给你唱一首歌",
                donatePrice3: 5000,
                donateReward3: "陪你看一场电影"
            }, {
                minPrice: 300,
                donatePrice1: 1000,
                donateReward1: "给你发一张自拍",
                donatePrice2: 2000,
                donateReward2: "给你唱一首歌",
                donatePrice3: 5000,
                donateReward3: "陪你看一场电影"
            }]
        }
    },
    methods: {
        removeCondition(test) {
            console.log(test)
            console.log('xxx');
        }
    }
}
</script>

<style scoped>
    .collapse {
        margin-top: 30px;
    }
    .el-input {
        width: 40%;
        margin-right: 30px;
    }
    .section {
        margin-top: 30px;
    }
</style>


