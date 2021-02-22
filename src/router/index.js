import Vue from 'vue'
import Router from 'vue-router'
//添加了login页面
import Login from '../components/Login.vue'
//home页面
import Home from '../components/home.vue'
Vue.use(Router)

import Welcome from '../components/Welcome.vue'

const router = new Router({
  routes: [
    //这段代码是打开页面直接跳转到某个页面
    {path:'/',redirect:'/Login'}, 
    //添加login页面
    {path: '/login', component: Login},
    {
      path: '/home', 
      component: Home,
      redirect: '/welcome',
      children: [{path:'/welcome', component: Welcome}
    ]}
  ]
})

//挂载路由守卫
router.beforeEach((to,from,next)=>{
  //to 将要访问的路径  from 从哪里来 
  //next放行函数  next()表示放行 next('/login')  强制跳转至login页面

  if(to.path === '/login') return next()
  //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()
})

export default router