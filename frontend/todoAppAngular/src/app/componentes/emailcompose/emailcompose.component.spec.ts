import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailcomposeComponent } from './emailcompose.component';

describe('EmailcomposeComponent', () => {
  let component: EmailcomposeComponent;
  let fixture: ComponentFixture<EmailcomposeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailcomposeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailcomposeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
