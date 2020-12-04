import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationTemplateComponent } from './confirmation-template.component';

describe('ConfirmationTemplateComponent', () => {
  let component: ConfirmationTemplateComponent;
  let fixture: ComponentFixture<ConfirmationTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmationTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
