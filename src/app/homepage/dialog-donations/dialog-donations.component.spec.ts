import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDonationsComponent } from './dialog-donations.component';

describe('DialogDonationsComponent', () => {
  let component: DialogDonationsComponent;
  let fixture: ComponentFixture<DialogDonationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogDonationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogDonationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
