import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  CanLoad,
  CanDeactivate
} from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { LoginComponent } from '../pages/login/login.component';
import { StorageService } from '../services/storage.service';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad, CanDeactivate<any> {
  constructor(
    private router: Router,
    private st: StorageService
  ) {

  }
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // 权限控制逻辑如 是否登录/拥有访问权限
    console.log('canActivate');
    const user = await this.st.get('user');
    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    console.log(this.router);
    return true;
  }
  async canDeactivate(
    component: LoginComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot) {
    console.log('canDeactivate');
    const user = await this.st.get('user');
    if (nextState.url === '/login' && user) {
      this.router.navigate(['/tabs/overview']);
      return false;
    }
    return true;
  }
  canActivateChild() {
    // 返回false则导航将失败/取消
    // 也可以写入具体的业务逻辑
    console.log('canActivateChild');
    return true;
  }
  canLoad(route: Route) {
    // 是否可以加载路由
    console.log('canload');
    return true;
  }
}
