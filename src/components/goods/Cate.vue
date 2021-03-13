<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type='primary' @click="addDialog">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- 表格 -->
            <tree-table class="treetable" :data='cateList' :columns="columns" 
            :selection-type="false" :expand-type="false"
            show-index index-text="#" border>

                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false"
                    style="color: lightgreen"></i>
                    <i class="el-icon-error" v-else style="color:red"></i>
                </template>

                <template slot="sort" slot-scope="scope">
                    <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
                    <el-tag v-else-if="scope.row.cat_level===1">二级</el-tag>
                    <el-tag v-else>三级</el-tag>
                </template>

                <template slot="operation" slot-scope="scope">
                    <el-button type="primary" size="mini">编辑</el-button>
                    <el-button type="danger" size="mini">删除</el-button>
                </template>
            </tree-table>

            <!-- 分页区域 -->
              <div class="block">
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="querInfo.pagenum"
                :page-sizes="[3, 5, 10, 15]"
                :page-size="querInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
                </el-pagination>
            </div>
        </el-card>

        <!-- 添加对话 -->
        <el-dialog
        title="添加分类"
        :visible.sync="addDialogVisible"
        width="50%"
        >
        <el-form :model="addForm" :rules="addRules" ref="addRuleRef" label-width="100px">
        <el-form-item label="活动名称" prop="cat_name">
            <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>

        <el-form-item label="父级分类" >
            <el-cascader
                expand-trigger="hover"
                v-model="selectedValue"
                :options="parentList"
                :props="cascaderProps"
                @change="handleChange"
                clearable
                :change-on-select="true"></el-cascader>
            
        </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
        
        </el-dialog>
        
    </div>    
</template>

<script>
export default {
    data(){
        return{
            querInfo:{
                type:3,
                pagenum:1,
                pagesize:5
            },
            //总数据条数
            total:0,
            // 商品分类列表
            cateList:[],

            columns:[{
                label:'分类名称',
                prop:'cat_name'
            },
            {
                label:'是否有效',
                type:'template',
                template:'isok'
            },
            {
                label:'排序',
                type:'template',
                template:'sort'
            },
            {
                label:'操作',
                type:'template',
                template:'operation'
            }
            ],
            addDialogVisible:false,
            //添加分类的表单数据对象
            addForm:{
                cat_name:'',
                // 父级的分类ID
                cat_pid:0,
                // 添加的等级，默认为一级分类
                cat_level:0

            },
            addRules:{
                cat_name:[
                    {required:true , message:"请输入分类的名称"  ,trigger:'blur'}
                ]
            },
            parentList:[],
            cascaderProps:{
                value:"cat_id",
                label:"cat_name",
                children:"children"
            },
            selectedValue:[]
        }
    },
    created(){
        //获取商品分类数据
        this.getCateList()
    },
    methods:{
        async getCateList(){
            const{data:res} = await this.$http.get(`categories`,{params:this.querInfo})
            if(res.meta.status!==200){
                return this.$message.error('获取商品列表失败')
            }
            this.cateList = res.data.result
            this.total = res.data.total
        },

        handleSizeChange(newSize){
            this.querInfo.pagesize = newSize
            this.getCateList()
        },

        handleCurrentChange(newPage){
            this.querInfo.pagenum = newPage
            this.getCateList()
        },

        addDialog(){
            this.getParentList()
            this.addDialogVisible = true
            
        },

        //获取分类数据列表
        async getParentList(){
            const{data:res} = await this.$http.get(`categories`,{params:{type:2}})
            console.log(res);
            if(res.meta.status!==200){
                return this.$message.error('获取分类数据失败')
            }
            this.parentList = res.data
        },
        handleChange(){
            if(this.selectedValue.length>0){
                this.addForm.cat_pid = this.selectedValue[this.selectedValue.length - 1]
                this.addForm.cat_level = this.selectedValue.length
            // this.addForm.cat_name = 
            }
            else{
                this.addForm.cat_pid = 0
                this.addForm.cat_level = 0
            }
            
        },
        addCate(){
            this.$refs.addRuleRef.validate(async valid =>{
                if(!valid) return 
                const {data:res} = await this.$http.post('categories',this.addForm)
                if(res.meta.status!==201){
                    return this.$message.error('添加分类失败')
                }
                this.$message.success('添加分类成功！')
                this.getCateList()
                this.addDialogVisible = false
            })
            
        }
        
    }
}
</script>

<style lang="less" scoped>
.treetable{
    margin-top: 15px;
}
.el-cascader{
    width:100%
}
</style>