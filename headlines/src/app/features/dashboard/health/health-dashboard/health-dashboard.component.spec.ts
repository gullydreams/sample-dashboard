import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HealthFilterBarComponent } from '../../../../shared/components/filters/health-filter-bar/health-filter-bar.component';


describe('HealthFilterBarComponent', () => {
    let component: HealthFilterBarComponent;
    let fixture: ComponentFixture<HealthFilterBarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HealthFilterBarComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HealthFilterBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});