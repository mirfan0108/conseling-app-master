import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JustStartGuard implements CanActivate {
  
  path: ActivatedRouteSnapshot[];  route: ActivatedRouteSnapshot;
  constructor(private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let user = JSON.parse(localStorage.getItem("_USER"))
    if(localStorage.getItem('starter')){
      return true;
    }
    this.router.navigate(['starter']);
    return false;
  }
}
