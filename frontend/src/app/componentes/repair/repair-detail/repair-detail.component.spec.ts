import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairDetailComponent } from './repair-detail.component';

describe('RepairDetailComponent', () => {
  let component: RepairDetailComponent;
  let fixture: ComponentFixture<RepairDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepairDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepairDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
