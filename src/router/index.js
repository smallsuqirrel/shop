import Vue from 'vue'
import Router from 'vue-router'
//添加了login页面
import Login from '../components/Login.vue'
Vue.use(Router)

export default new Router({
  routes: [
    //这段代码是打开页面直接跳转到某个页面
    {path:'/',redirect:'/Login'}, 
    //添加login页面
    {path: '/login', component: Login}
  ]
})
