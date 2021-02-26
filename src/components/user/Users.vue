<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card class="box-card">
            <!-- 搜索与添加区域 -->
            <el-row :gutter="20">
                <el-col :span="8">            
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>

            <!-- 用户列表区域 -->
            <el-table :data="userList" border stripe>
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态" >
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="190px">
                    <template>
                        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                         <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>
                        
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加用户 -->
        <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="50%"
        @close="addDialogClosed"
        >
            <!-- 内容主体区域 -->
            <span>添加用户</span>
            <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
export default {
    data(){
        //验证邮箱的规则
        var checkEmail = (rule,value,cb) => {
            const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-]+)+/
            if(regEmail.test(value)){
                return cb()
            }
            cb(new Error('请输入合法的邮箱'))
        }

        //验证手机号的规则
        var checkMobile = (rule,value,cb) => {
            const regMobile = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
            if(regMobile.test(value)){
                return cb()
            }
            cb(new Error('请输入合法的手机号'))
        }
        return{
            //获取列表的参数对象
            queryInfo: {
                query: '',
                //当前的页数
                pagenum: 1,
                //当前每页显示多少数据
                pagesize: 2
            },
            userList: [],
            total : 0,
            // 控制添加用户对话框显示
            dialogVisible: false,
            // 添加用户的表单数据
            addForm: {
                username: '',
                password: '',
                email: '',
                mobile: '',
            },
            // 添加表单的验证规则
            addFormRules: {
                username: [
                    {required: true, message: '请输入用户名',trigger:'blur'},
                    {
                        min:3,
                        man:10,
                        message: '用户名的长度应该在3-10个字符之间',
                        trigger: 'blur'
                    }
                ],
                password: [
                    {required: true, message: '请输入密码',trigger:'blur'},
                    {
                        min:6,
                        man:15,
                        message: '用户名的长度应该在6-15个字符之间',
                        trigger: 'blur'
                    }
                ],
                email: [
                    {required: true, message: '请输入邮箱',trigger:'blur'},
                    {validator: checkEmail, trigger:'blur'}
                ],

                mobile: [
                    {required: true, message: '请输入手机号',trigger:'blur'},
                    {validator: checkMobile, trigger:'blur'}
                ]
            }
        }
    },
    created(){
        this.getUserList()
    },
    methods: {
        async getUserList(){
            const {data: res} = await this.$http.get('users',{params: this.queryInfo})
            if(res.meta.status !== 200) return this.$message.error('获取用户列表失败！')
            this.userList = res.data.users
            this.total = res.data.total
        },

        //监听pagesize改变的事件
        handleSizeChange(newsize){
            this.queryInfo.pagesize=newsize
            this.getUserList()
        },
        //监听页码值改变的事件
        handleCurrentChange(newPage){
            this.queryInfo.pagenum=newPage
            this.getUserList()
        },
        // 监听switch状态的改变
        async userStateChanged(userInfo){
            console.log(userInfo)
            const {data: res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
            if(res.meta.status !== 200){
                userInfo.mg_state = !userInfo.mg_state
                return this.$message.error('更新用户状态失败!')
            }
            this.$message.success('更新用户状态成功！')
        },
        addDialogClosed(){
            this.$refs.addFormRef.resetFields()
        },
        addUser(){
            this.$refs.addFormRef.validate(async valid => {
                if(!valid) return
                //发起添加用户的网络请求
                const{data:res} = await this.$http.post('users',this.addForm)
                if(res.meta.status!==201){
                    this.$message.error('添加用户失败！')
                }
                this.$message.success('添加用户成功！')
                this.dialogVisible = false
            })
        }
    }
}
</script>

<style lang="less" scoped>

</style>