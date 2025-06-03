import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechanicDetailComponent } from './mechanic-detail.component';

describe('MechanicDetailComponent', () => {
  let component: MechanicDetailComponent;
  let fixture: ComponentFixture<MechanicDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MechanicDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MechanicDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
