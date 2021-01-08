import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();//do not quit understand how this works
    this.authListenerSubs = this.authService
    .getAuthStatusListener() //follow this function if you forget what is happening here
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;//do not quit understand how this works
    });
  }

  onLogout(){
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
