import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  path: ActivatedRouteSnapshot[];  route: ActivatedRouteSnapshot;
  constructor(private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let user = JSON.parse(localStorage.getItem("_USER"))
    if (localStorage.getItem("_USER") && user._ID && user.role == 0) {
      return true;
    }
    if(localStorage.getItem("_USER") && user._ID && user.role != 0) {
      localStorage.clear()
      this.router.navigate(['login'], {queryParams: { next: state.url }});
      return false;
    }
    // if(user.status == 1) {
    //   this.router.navigate(['profile-modify'], {queryParams: { next: state.url }});
    //   return false
    // }
    // if(user.status == 2) {
    //   this.router.navigate(['complaint-modify'], {queryParams: { next: state.url }});
    //   return false
    // } 
    // if(user.status == 0) {
    //   this.router.navigate(['status-account'], {queryParams: { next: state.url }});
    //   return false
    // } 
    
    this.router.navigate(['login'], {queryParams: { next: state.url }});
    return false;
  }
}
