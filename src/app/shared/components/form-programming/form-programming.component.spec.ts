import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormProgrammingComponent } from './form-programming.component';

describe('FormProgrammingComponent', () => {
  let component: FormProgrammingComponent;
  let fixture: ComponentFixture<FormProgrammingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormProgrammingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormProgrammingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
