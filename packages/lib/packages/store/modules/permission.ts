import { RouteRecordRaw } from 'vue-router';
import { defineStore } from 'pinia';
import { getRouters } from '../../api/permission';
import Layout from '../../layout/index.vue';
import { ParentView } from 'components'

import { constantRoutes } from '../../hooks/router/default';
import path from 'path-browserify';


export type UserPermissionType = {
  routes: RouteRecordRaw[],
  addRoutes: RouteRecordRaw[],
  sidebarRouters: RouteRecordRaw[]
}

function filterChildren(childrenMap: any) {
  var children: any[] = []
  childrenMap.forEach((el: any, index: any) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView') {
        el.children.forEach((c: any) => {
          c.path = el.path + '/' + c.path
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children))
            return
          }
          children.push(c)
        })
        return
      }
    }
    children = children.concat(el)
  })
  return children
}

// export const loadView = (view: any) => { // 路由懒加载
//   // console.log('view=>', view)

//   let fileNames = ['components', 'dashboard', 'error', 'index', 'redirect']
//   for (let fileName in fileNames) {
//     if (view.indexOf(fileName) == 0) {
//       console.log('加载lib包页面资源:' + view);
//       // return () => import(`../../views/${view}`)
//       //@ts-ignore
//       // return (resolve) => require([`../../views/${view}`], resolve)
//       return () => import(`../../views/${view}.vue`)
//     }
//   }

//   // return (resolve) => import(`../views/${view}.vue`,resolve)
//   // console.log('view=>', view, path)
//   const modules = (import.meta as any).glob('@/views/*/*.vue');
//   // modules[`../views/${route.component}`]
//   //@ts-ignore
//   // console.log('modules=>', modules, 'key=>', `/src/views/${view}.vue`)
//   // return modules[`@/views/${view}.vue`]
//   return modules[`/src/views/${view}.vue`]



//   // console.log(`@/views/${view}.vue`)
//   // return () => import('@/views/'+ view +'.vue');
//   // return () => import('@/views/receive/index.vue');
// }

export const loadView = (view: any) => {
  let fileNames = ['components', 'dashboard', 'error', 'index', 'redirect'];
  for (let fileName in fileNames) {
    if (view.indexOf(fileName) == 0) {
      console.log('加载lib包页面资源:' + view);
      return () => import(`../../views/${view}.vue`);
    }
  }

  const modules = (import.meta as any).glob('../../views/*/*.vue');
  const keys = Object.keys(modules);
  for (const key of keys) {
    const modulePath = path.resolve(modules[key].id);
    if (modulePath.includes(view)) {
      console.log('加载lib包页面资源:' + view);
      return modules[key];
    }
  }

  // Fallback if no matching module found
  console.error('找不到匹配的组件模块: ' + view);
  return null;
}


// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap: any, isRewrite = false) {
  return asyncRouterMap.filter((route: any) => {
    if (isRewrite && route.children) {
      route.children = filterChildren(route.children)
    }
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else if (route.component === 'ParentView') {
        route.component = ParentView
      } else {
        route.component = loadView(route.component)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, isRewrite)
    }
    return true
  })
}

export const usePermissionStore = defineStore('brick-permission', {
  state: (): UserPermissionType => ({
    routes: [],
    addRoutes: [],
    sidebarRouters: []
  }),
  actions: {
    SET_ROUTES(routes: RouteRecordRaw[]) {
      this.addRoutes = routes
      this.routes = constantRoutes.concat(routes)
    },
    SET_SIDEBAR_ROUTERS(routes: RouteRecordRaw[]) {
      this.sidebarRouters = constantRoutes.concat(routes)
    },
    GenerateRoutes() {
      return new Promise<RouteRecordRaw[]>((resolve, reject) => {
        getRouters().then(res => {
          console.log('routers=>', res)
          const sdata = JSON.parse(JSON.stringify(res.data));
          const rdata = JSON.parse(JSON.stringify(res.data));

          const sidebarRoutes = filterAsyncRouter(sdata)
          const rewriteRoutes = filterAsyncRouter(rdata, true) as RouteRecordRaw[]


          //@ts-ignore
          // rewriteRoutes.push({ path: '*', redirect: '/404', hidden: true })

          this.SET_ROUTES(rewriteRoutes);
          this.SET_SIDEBAR_ROUTERS(sidebarRoutes);

          resolve(rewriteRoutes);
        })
      })
    }
  }
})