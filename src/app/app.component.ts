import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Sonora Angular';
  isSmallScreen = false;
  constructor(private authService: AuthService, private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isSmallScreen = result.matches;
    });
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  logout(): void {
    this.authService.logout();
  }
}
