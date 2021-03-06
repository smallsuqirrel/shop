<template>
   <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
         
        <el-card class="box-card">
            <el-col :span="4">
                <el-button type="primary" @click="addDialogVisible=true">添加角色</el-button>
            </el-col>
            <el-table :data="rolesList" border stripe>
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        
                        <el-row class="vcenter" :class="['bdbottom' , i1===0 ?'bdtop' : '']" v-for="(item1,i1) in scope.row.children" :key="item1.id" >
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag closable @close="removedRightById(scope.row,item1.id)"> 
                                    {{item1.authName}}
                                    
                                </el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二级和三级权限 -->
                            <el-col :span="19">
                                <!-- 渲染二级权限 -->
                                <el-row class="vcenter" :class="[i2===0 ? '' : 'bdtop']" v-for="(item2,i2) in item1.children" :key="item2.id" >
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="removedRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                            <el-tag v-for="(item3,i3) in item2.children" :key="item3.id" type="warning" closable @close="removedRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
    
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                        <!-- <pre>
                            {{scope.row}}
                        </pre> -->
                    </template>
                </el-table-column>
                 
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column  label="角色名称" prop="roleName"></el-table-column>
                <el-table-column  label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column  label="操作" width="300px">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="editDialog(scope.row.id)">编辑</el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteDialog(scope.row.id)">删除</el-button>
                        <!-- 分配角色按钮  -->
                         <el-tooltip class="item" effect="dark" content="分配权限" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 添加角色 -->
        <el-dialog
        title="添加角色"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed"
        >
            <!-- 内容主体区域 -->
            <el-form ref="addRoleRef" :model="addRoleForm" :rules="addRoleRules"  label-width="100px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addRoleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addRoleForm.roleDesc" ></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑角色 -->
        <el-dialog
        title="编辑角色"
        :visible.sync="editDialogVisible"
        width="1000px"
        @close="editDialogClosed"
        >
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px" class="demo-ruleForm">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="editForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" >
                    <el-input v-model="editForm.roleDesc" ></el-input>
                </el-form-item>
            </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editRoleDialog">确 定</el-button>
        </span>
        </el-dialog>
    </div> 
</template>

<script>
export default {
    data(){
        return{
            rolesList: [],

            //控制添加角色对话框显示
            addDialogVisible: false,
            addRoleForm: {
                roleName:'',
                roleDesc:'',
            },
            addRoleRules: {
                roleName: [{required: true, message: '请输入角色名称',trigger:'blur'}]
            },
            deleteDialogVisible:false,
            editDialogVisible:false,

            editForm: {},
            editFormRules:{
                roleName:[{required: true, message: '请输入角色名称',trigger:'blur'}]
            }
        }
    },
    created(){
        this.getRolesList()
    },
    
    methods:{
        //获取所有角色的列表
        async getRolesList(){
            const {data:res} = await this.$http.get('roles')

            if(res.meta.status !== 200){
                return this.$message.error('获取角色列表失败!')
            }

            this.rolesList = res.data
        },

        //添加角色
        addRole(){
            this.$refs.addRoleRef.validate(async valid => {
                if(!valid) return
                //发起添加角色的请求
                const{data:res} = await this.$http.post('roles',this.addRoleForm)
                if(res.meta.status !== 201) return this.$message.error('添加角色失败！')
                this.$message.success('添加角色成功！')
                this.addDialogVisible=false
                this.getRolesList()
            })
        },
        //编辑角色
        async editDialog(id){
            const{data:res} = await this.$http.get('roles/'+id)
            if(res.meta.status !== 200) return this.$message.error('查询角色信息失败！')
            this.editForm = res.data
            this.editDialogVisible=true
        },
        //删除角色
        async deleteDialog(id){
            const confirmResult =  await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).catch(err =>err)

            if(confirmResult !== 'confirm') {
                return this.$message.info('已取消删除')
            }

            const{data:res}= await this.$http.delete('roles/' + id)
            if(res.meta.status!==200){
                return this.$message.error('删除角色信息失败')
            }

            this.$message.success('删除角色信息成功')
            this.getRolesList()
        },
        //重置添加用户的表单
        addDialogClosed(){
            this.$refs.addRoleRef.resetFields()
        },
        //重置关闭用户的表单
        editDialogClosed(){
            this.$refs.editFormRef.resetFields()
        },
        //提交编辑用户
        editRoleDialog(id){
            this.$refs.editFormRef.validate(async valid=>{
                if(!valid) {
                    return
                }
                console.log(this.editForm);
                const{data:res} = await this.$http.put('roles/' + this.editForm.roleId,{
                    roleName: this.editForm.roleName,
                    roleDesc: this.editForm.roleDesc
                })
                if(res.meta.status!==200){
                    return this.$message.error('更新角色信息失败！')
                }

                this.editDialogVisible = false
                this.getRolesList()
                this.$message.success('更新角色信息成功')
                })
        },
        async removedRightById(role,rightId){
        
            const confirmResult =  await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).catch(err=>err)
            if(confirmResult !== 'confirm') return this.$message.info('取消删除')

            const{data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
            if(res.meta.status !== 200){
                return this.$message.error("删除权限失败")
            }
            // this.getRolesList()
            role.children = res.data
        }
    }
}
</script>

<style lang="less" scoped>
.vcenter{
    display:flex;
    align-items: center;
}
</style>