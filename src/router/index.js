import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter);
const routes = [
  {
    path: '/index',
    name: 'index',
    component: () => import('../views/user/Index.vue'),
    meta: { title: '首页', auth: true },
    redirect: '/index/water',
    children: [
      {
        path: 'water',
        name: 'water',
        component: () => import('../views/user/Water.vue'),
        meta: { title: '水费', auth: true },
      },
      {
        path: 'electric',
        name: 'electric',
        component: () => import('../views/user/Electric.vue'),
        meta: { title: '电费', auth: true },
      },
      {
        path: 'information',
        name: 'information',
        component: () => import('../views/user/Information.vue'),
        meta: { title: '个人信息', auth: true },
      },
    ]
  },
  {
    path: '/',
    name: 'login',
    component: () => import('../views/Login.vue'),
    meta: { title: '登录', auth: false }
  },
  {
    path: '/adminindex',
    name: 'adminindex',
    component: () => import('../views/admin/AdminIndex.vue'),
    redirect: '/adminindex/admininformation',
    meta: { title: '管理首页', auth: true },
    children: [
      {
        path: 'admininformation',
        name: 'admininformation',
        component: () => import('../views/admin/AdminManage/Admininformation.vue'),
        meta: { title: '管理员信息', auth: true },
      },
      {
        path: 'waterecharts',
        name: 'waterecharts',
        component: () => import('../views/admin/EchartsManage/WaterEcharts.vue'),
        meta: { title: '水费统计', auth: true },
      },
      {
        path: 'electricecharts',
        name: 'electricecharts',
        component: () => import('../views/admin/EchartsManage/ElectricEcharts.vue'),
        meta: { title: '电费统计', auth: true },
      },
      {
        path: 'electricemanage',
        name: 'electricemanage',
        component: () => import('../views/admin/CostManage/Electricemanage.vue'),
        meta: { title: '电费管理', auth: true },
      },
      {
        path: 'password',
        name: 'password',
        component: () => import('../views/admin/AdminManage/Password.vue'),
        meta: { title: '密码重置', auth: true },
      },
      {
        path: 'usermanage',
        name: 'usermanage',
        component: () => import('../views/admin/UserManage/Usermanage.vue'),
        meta: { title: '用户管理', auth: true },
      },
      {
        path: 'watermanage',
        name: 'watermanage',
        component: () => import('../views/admin/CostManage/Watermanage.vue'),
        meta: { title: '水费管理', auth: true },
      },
       {
        path: 'waterarrear',
        name: 'waterarrear',
        component: () => import('../views/admin/ArrearManage/WaterArrear.vue'),
        meta: { title: '欠水费', auth: true },
      },
       {
        path: 'electricarrear',
        name: 'electricarrear',
        component: () => import('../views/admin/ArrearManage/ElectricArrear.vue'),
        meta: { title: '欠电费', auth: true },
      },
    ]
  }
]
const router = new VueRouter({
  routes
})
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
router.beforeEach((to, from, next) => {
  let title = to.meta.title || '登录';
  document.title = title;
  if (to.meta.auth) {
    let token = sessionStorage.getItem('token');
    token = token && token.trim();
    if (token) {
      next();
    } else {
      next({ name: 'login' });
    }
  } else {
    next();
  }

})
export default router
