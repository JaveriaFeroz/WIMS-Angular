import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITRNComponent } from './ITRN.component';

describe('ITRNComponent', () => {
  let component: ITRNComponent;
  let fixture: ComponentFixture<ITRNComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ITRNComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ITRNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
