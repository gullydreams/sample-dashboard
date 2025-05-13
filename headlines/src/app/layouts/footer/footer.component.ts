// src/app/layouts/footer/footer.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <footer class="footer">
      <div class="footer-content">
        <div class="copyright">
          &copy; 2025 Headlines Dashboard. All rights reserved.
        </div>
        <div class="version">
          Version 1.0.0 | <span class="build">Build 20250513</span>
        </div>
        <div class="links">
          <a href="javascript:void(0)" (click)="openAbout()">About</a>
          <a href="javascript:void(0)" (click)="openDocs()">Documentation</a>
          <a href="javascript:void(0)" (click)="openSupport()">Support</a>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: white;
      border-top: 1px solid #e0e0e0;
      padding: 12px 16px;
      color: var(--text-secondary);
      font-size: 12px;
    }
    
    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1400px;
      margin: 0 auto;
    }
    
    .copyright {
      flex: 1;
    }
    
    .version {
      flex: 1;
      text-align: center;
      
      .build {
        color: var(--text-color);
        font-weight: 500;
      }
    }
    
    .links {
      flex: 1;
      text-align: right;
      
      a {
        color: var(--primary-color);
        text-decoration: none;
        margin-left: 16px;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
    
    @media (max-width: 768px) {
      .footer-content {
        flex-direction: column;
        align-items: center;
        gap: 8px;
      }
      
      .copyright, .version, .links {
        flex: none;
        text-align: center;
        width: 100%;
      }
      
      .links {
        margin-top: 8px;
        
        a {
          margin: 0 8px;
        }
      }
    }
  `]
})
export class FooterComponent {
  openAbout(): void {
    console.log('Opening About dialog');
    // Implementation for opening About dialog would go here
  }
  
  openDocs(): void {
    console.log('Opening Documentation');
    // Implementation for opening Documentation would go here
  }
  
  openSupport(): void {
    console.log('Opening Support');
    // Implementation for opening Support would go here
  }
}