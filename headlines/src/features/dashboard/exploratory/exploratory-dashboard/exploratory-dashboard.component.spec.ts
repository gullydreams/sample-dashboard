import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploratoryDashboardComponent } from './exploratory-dashboard.component';

describe('ExploratoryDashboardComponent', () => {
  let component: ExploratoryDashboardComponent;
  let fixture: ComponentFixture<ExploratoryDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExploratoryDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExploratoryDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
