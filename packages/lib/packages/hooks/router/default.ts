import { RouteRecordRaw } from 'vue-router';
import Layout from '../../layout/index.vue';
import { Dashboard } from '@coveyz/components';

const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        component: Dashboard,
        name: '首页',
        meta: { title: '首页', icon: 'dashboard', noCache: true, affix: true }
      }
    ]
  }
]

export {
  constantRoutes
}