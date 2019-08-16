import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatusGuard implements  CanActivate {
  path: ActivatedRouteSnapshot[];  route: ActivatedRouteSnapshot;
  constructor(private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let user = JSON.parse(localStorage.getItem("_USER"))
    console.log(user)
    if (user.status == 9) {
      return true;
    }
    if(user.status == 1) {
      this.router.navigate(['modify-profile'], {queryParams: { next: state.url }});
      return false
    }
    if(user.status == 2) {
      this.router.navigate(['modify-form'], {queryParams: { next: state.url }});
      return false
    } 
    if(user.status == 3) {
      this.router.navigate(['modify-profile'], {queryParams: { next: state.url }});
      return false
    } 
    if(user.status == 0 || user.status == 8) {
      this.router.navigate(['waiting-status'], {queryParams: { next: state.url }});
      return false
    } 
    
    this.router.navigate(['login'], {queryParams: { next: state.url }});
    return false;
  }
  
}
