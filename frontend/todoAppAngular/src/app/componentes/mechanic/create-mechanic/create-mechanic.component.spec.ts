import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMechanicComponent } from './create-mechanic.component';

describe('CreateMechanicComponent', () => {
  let component: CreateMechanicComponent;
  let fixture: ComponentFixture<CreateMechanicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateMechanicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateMechanicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
