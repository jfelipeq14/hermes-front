import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormUsersComponent } from './form-users.component';

describe('FormUsersComponent', () => {
    let component: FormUsersComponent;
    let fixture: ComponentFixture<FormUsersComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FormUsersComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(FormUsersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
