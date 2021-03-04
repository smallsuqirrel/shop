<template>

    <el-container class="home-container">
        <!-- 头部区域 -->
        <el-header>
            <div>
                <img src="../assets/a.png" alt="">
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <!-- 页面主体区域 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="IsCollapse ? '64px' : '200px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                 <el-menu
                background-color="#333744"
                text-color="#fff"
                active-text-color="#409eff"
                :unique-opened= "true"
                :collapse= "IsCollapse"
                :collapse-transition= "false"
                :router= "true"
                :default-active="activePath">
                    <!-- 一级菜单 -->
                    <el-submenu :index="item.id + ' '" v-for="item in menuList" :key="item.id">
                        <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span>{{item.authName}}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/' + subItem.path)">
                            <i class="el-icon-menu"></i>
                            <span slot="title">{{subItem.authName}}</span>
                        </el-menu-item>
                    </el-submenu>
                
                    
                </el-menu>
            </el-aside>
            <!-- 右侧主体内容 -->
            <el-main>
                <!-- 路由占位符 -->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>

</template>

<script>
export default {
    data(){
        return{
            //左侧菜单栏数据
            menuList: [],
            IsCollapse: false,
            //被激活的连接地址
            activePath: ''
        }
    },
    created() {
        this.getMenuList()
        this.activePath = window.sessionStorage.getItem('activePath')
    },
    methods: {
        logout(){
            window.sessionStorage.clear();
            this.$router.push("/login");
        },

        //获取左侧菜单栏
        async getMenuList() {
            const {data: res} = await this.$http.get('menus')
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.menuList = res.data
        },
        toggleCollapse(){
            this.IsCollapse = !this.IsCollapse
        },
        //保存链接的激活状态
        saveNavState(activePath){
            window.sessionStorage.setItem('activePath', activePath)
            this.activePath = activePath
        }
    }
}
</script>

<style lang="less" scoped>
.el-header{
    background-color: #373D41;
    display: flex;
    justify-content: space-between;
    padding-left: 0px;
    align-items: center;
    color: #fff;
    font-size: 20px;
    > div {
        display: flex;
        align-items: center;
        > span{
            margin-left: 15px;
        }
    }
}

.el-aside{
    background-color: #333744;
    .el-menu {
        border-right: none;
    }
}

.el-main{
    background-color: #eaedf1;
}

.home-container{
    height:100%;
}

.toggle-button{
    font-size:10px;
    background-color: #4A5064;
    line-height:24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>