import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTravelersComponent } from './form-travelers.component';

describe('FormTravelersComponent', () => {
    let component: FormTravelersComponent;
    let fixture: ComponentFixture<FormTravelersComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FormTravelersComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(FormTravelersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
