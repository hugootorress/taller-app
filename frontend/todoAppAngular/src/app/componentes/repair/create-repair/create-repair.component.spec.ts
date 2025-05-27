import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRepairComponent } from './create-repair.component';

describe('CreateRepairComponent', () => {
  let component: CreateRepairComponent;
  let fixture: ComponentFixture<CreateRepairComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateRepairComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateRepairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
