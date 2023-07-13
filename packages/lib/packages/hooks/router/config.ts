import NProgress from 'nprogress';
import "nprogress/nprogress.css";
import { NavigationGuardNext, Router } from 'vue-router'
import { getToken,setToken,getAdminWebUrl,parseOriginUrl } from '@coveyz/utils'
import setting from '../../config';
import { useUserStore, useSettingStore, usePermissionStore } from '../../store';


const getRoutes = async (router: Router, next: NavigationGuardNext, to: any) => {
  const { roles, GetInfo } = useUserStore();
  if (roles.length === 0) {
    const { roles, permissions } = await GetInfo() || {}
    console.log('roles=>', roles)
    const accessRoutes = await usePermissionStore().GenerateRoutes();
    console.log('accessRoutes=>', accessRoutes);
    /** 🍌 动态追加路由 */
    accessRoutes.forEach(route => {
      router.addRoute(route)
    })

    // console.log('curUserRoles=>', roles);
    // console.log('curUserRoles=>', setting);
    let originTo = parseOriginUrl();
    console.log('originTo=>', originTo)
    if (originTo) {
      next({ ...originTo, replace: true });
    }
    else if (permissions.length === 0) {
      console.log("无 permissions 权限", permissions);
      next(false);
    }
    else {
      console.log('xxx=>')
      next({ ...to, replace: true })
    }
  } else {
    next();
  }

}


const routerConfig = {
  enhanceRouter(router: Router) {
    console.log('enhanceRouter=>', router)
    NProgress.configure({ showSpinner: false });

    router.beforeEach(async (to: any, _form, next: NavigationGuardNext) => {
      NProgress.start();
      if (to.query.platform === "subview") {
        setting.platform = 'subview';
      }
      if (to.query.brandMdCode) {
        useSettingStore().changeSetting({
          key: 'brandMdCode',
          value: to.query.brandMdCode
        });
        setting.brandMdCode = to.query.brandMdCode;
      }

      console.log('=============brick-lib=============enhanceRouter:', to.query)
      if (to.query.platform === "subview" && !to.query.brandMdCode) {
        window.location.href = `${window.location.origin}/#/404`
      }

      if (to.query.token) {
        //@ts-ignore
        window.__POWERED_BY_LIB__ = "BRICK";
        setToken(to.query.token)

        if (to.query.form !== 'admin') {
          delete to.query.token
        }
        await getRoutes(router, next, to);
        next()
      } else {
        if (window.location.href.includes("from=admin")) {
          const message = {
            action: "goto",
            path: to.path,
            fullPath: to.fullPath
          };
          let targetOrigin = getAdminWebUrl();
          //@ts-ignore
          window?.top.postMessage(message, targetOrigin);
          console.log("=======>子应用保存刷新逻辑，记录 FROM_URL", location.href);
          window.sessionStorage.setItem("FROM_URL", window.location.href);
          console.log("=======>postMessage", message);
          next(false);
          NProgress.done();
          return;
        }

        if (!getToken()) {
          console.error('未登陆系统');
        } else {
          console.log('>')
          await getRoutes(router, next, to)
          next()
        }
      }
    })

    router.afterEach(() => {
      NProgress.done();
    })


    //@ts-ignore
    window.open = function (open: any) {

    }(window.open)

    return router
  }
}

export default routerConfig