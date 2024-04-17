import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversorXmlXlsxComponent } from './conversor-xml-xlsx.component';

describe('ConversorXmlXlsxComponent', () => {
  let component: ConversorXmlXlsxComponent;
  let fixture: ComponentFixture<ConversorXmlXlsxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConversorXmlXlsxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConversorXmlXlsxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
