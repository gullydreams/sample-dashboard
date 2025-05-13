import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelDashboardComponent } from './model-dashboard.component';

describe('ModelDashboardComponent', () => {
  let component: ModelDashboardComponent;
  let fixture: ComponentFixture<ModelDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
