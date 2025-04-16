import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPaymentsComponent } from './form-payments.component';

describe('FormPaymentsComponent', () => {
  let component: FormPaymentsComponent;
  let fixture: ComponentFixture<FormPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormPaymentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
