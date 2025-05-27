import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  sidebarVisible = true;
  isMobile = false;
  isAdmin = localStorage.getItem('mechanicIsAdmin') === 'true';
  mechanicName = localStorage.getItem('mechanicName') || 'Mecánico';
  mechanicImage = localStorage.getItem('mechanicImage') || 'assets/img/default-avatar.png';

  showOpenButton = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const width = window.innerWidth;
    if (width > 1024) {
      this.sidebarVisible = true;
      this.showOpenButton = false;
    } else {
      this.sidebarVisible = false;
      this.showOpenButton = true;
    }
  }

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
    this.updateShowOpenButton();
  }

  closeSidebar(): void {
    this.sidebarVisible = false;
    this.updateShowOpenButton();
  }

  logout(): void {
    this.authService.logout();
  }

 @HostListener('window:resize', ['$event'])
onResize(event: Event): void {
  const width = (event.target as Window).innerWidth;
  this.isMobile = width <= 1024;
  this.sidebarVisible = !this.isMobile;
  this.showOpenButton = this.isMobile && !this.sidebarVisible;
}

  private updateShowOpenButton(): void {
    const width = window.innerWidth;
    this.showOpenButton = width <= 1024 && !this.sidebarVisible;
  }
}
