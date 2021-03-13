<template>
    <div>
         <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
             <div id="main" style="width: 600px;height:400px;"></div>
        </el-card>
    </div>
</template>

<script>
import echarts from "echarts"

export default {
    data(){
        return{

        }
    },
    created(){
    },
    // 在dom被渲染完成之后执行的函数
    async mounted(){
        var myChart = echarts.init(document.getElementById('main'));
        const{data:res} =await this.$http.get('reports/type/1')

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(res.data);
    },
    methods:{
    }
}
</script>

<style scoped>

</style>>