import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IUser, MenuItem, menuItems } from './header.utils';
import { AuthService } from '../../store/auth.service';
@Component({
  selector: 'aa-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  readonly menuItems: MenuItem[] = menuItems;
  authUser: IUser | null = null;

  private userSubscription: Subscription | null = null; // Initialize with null

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.user$.subscribe((user) => {
      this.authUser = user;
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      // Check if it's not null before unsubscribing
      this.userSubscription.unsubscribe();
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
