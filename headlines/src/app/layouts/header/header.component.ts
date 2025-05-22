// src/app/layouts/header/header.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
  headerTitle: string = 'Dashboard';

  private routeTitleMap: { [key: string]: string } = {
    '/dashboard/test-case': 'Test Case Dashboard',
    '/dashboard/model': 'Model Dashboard',
    '/dashboard/exploratory': 'Exploratory Dashboard',
    '/dashboard/health': '' // Remove the title for health view
  };

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.updateTitle(this.router.url);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateTitle(event.url);
      });
  }

  private updateTitle(url: string): void {
    this.headerTitle = this.routeTitleMap[url] || 'Dashboard';
  }
}