import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSelectorColumnComponent } from './dialog-selector-column.component';

describe('DialogSelectorColumnComponent', () => {
  let component: DialogSelectorColumnComponent;
  let fixture: ComponentFixture<DialogSelectorColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogSelectorColumnComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogSelectorColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
