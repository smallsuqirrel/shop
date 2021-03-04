<template>
   <div>
      
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
         
        <el-card class="box-card">
            <el-col :span="4">
                <el-button type="primary">添加角色</el-button>
            </el-col>
            <el-table :data="roleList" border stripe>
                <el-table-column width="50px"></el-table-column>
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column  label="角色名称"></el-table-column>
                <el-table-column  label="角色描述"></el-table-column>
                <el-table-column  label="操作">
                    <template >
                        <!-- 修改按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" >编辑</el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                        <!-- 分配角色按钮  -->
                         <el-tooltip class="item" effect="dark" content="分配权限" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div> 
</template>

<script>
export default {
    data(){
        return{
            //所有角色列表
            roleList: []
        }
    },
    created(){
        this.getRolesList()
    },
    
    methods:{
        //获取所有角色的列表
        async getRolesList(){
            const {data:res} = await this.$http.get('roles')
            if(res.meta.status!==200){
                return this.$message.error('获取角色列表失败!')
            }
            this.roleList = res.data
            console.log(res.data);
            console.log(rolesList)
        }
    }
}
</script>

<style lang="less" scoped>

</style>