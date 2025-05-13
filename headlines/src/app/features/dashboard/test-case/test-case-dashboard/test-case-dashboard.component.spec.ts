import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCaseDashboardComponent } from './test-case-dashboard.component';

describe('TestCaseDashboardComponent', () => {
  let component: TestCaseDashboardComponent;
  let fixture: ComponentFixture<TestCaseDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestCaseDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestCaseDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
