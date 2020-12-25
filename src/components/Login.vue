<template>
    <div class="login_container">
        <div class="login_box">
            <!--头像区域-->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!--登录区域-->
            <div>
                <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" class="login_form">
                    <!--用户名-->
                    <el-form-item prop="username">
                        <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
                    </el-form-item>
                    <!--密码-->
                    <el-form-item prop="password">
                        <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password"></el-input>
                    </el-form-item>
                    <!--按钮-->
                    <el-form-item class="btns">
                        <el-button type="primary" @click="login">登录</el-button>
                        <el-button type="info" @click="resetLoginForm">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        
    </div>
</template>

<script>
export default {
    data(){
        return{
            //这是登录表单的数据绑定对象
            loginForm:{
                username: 'admin',
                password: '123456'
            },

            //这是表单的验证规则对象
            loginFormRules:{
                //验证用户名是否合法
                username:[
                    {required: true, message: "请输入用户名" , trigger: "blur"},
                    {min: 3, max: 10,message: "长度在3到10个字符之间", trigger: "blur"}
                ],
                password:[
                    {required: true, message: "请输入密码" , trigger: "blur"}
                ]
            }
        }
    },

    methods: {
        //重置表单
        resetLoginForm(){
            // console.log(this);
            this.$refs.loginFormRef.resetFields();
        },
        //登录验证的前端实现
        login(){
            this.$refs.loginFormRef.validate(async valid => {
                if(!valid) return;
                const {data:res} = await this.$http.post("login", this.loginForm);
                if(res.meta.status !== 200) return this.$message.error('登录失败')
                this.$message.success('登录成功');
                //将token存储到application中的sessionStorage
                //token只应该在网站打开的时候生效
                //项目中除了登录之外的其他API接口，必须在登录之后才能访问
                window.sessionStorage.setItem("token", res.data.token);
                //通过编程式导航跳转页面到home
                this.$router.push("/home");
            })
        }
    }
}
</script>

<style lang="less" scoped>
.login_container{
    background: #2b4b6b;
    height: 100%;
}

.login_box{
    //设置盒子颜色，大小，弧度
    background: #fff;
    width: 450px;
    height: 300px;
    border-radius: 3px;
    
    //将左上角的点置于正中间
    position: absolute;
    left: 50%;
    top: 50%;

    //使盒子参考向上和向左平移50%
    transform: translate(-50%,-50%);

    //css嵌套
    .avatar_box{
        height: 130px;
        width: 130px;
        //边框
        border: 1px solid #eee;
        //圆角
        border-radius: 50% ;
        //内距
        padding: 10px;
        //阴影
        box-shadow: 0 0 10px #ddd;
        //使盒子位于正中间
        position: absolute;
        left: 50%;
        transform: translate(-50%,-50%);
        background-color: #fff;
        img{
            width: 100%;
            height: 100%;
            background-color: #eee;
            border-radius: 50%;
        }
    }
}

.login_form{
    position: absolute;
    //距离底部为0
    bottom: 0;
    //宽度为100%
    width: 100%;
    //左边距20px
    padding: 0 20px;
    box-sizing: border-box;
}

.btns{
    display: flex;
    justify-content: flex-end;
}


</style>