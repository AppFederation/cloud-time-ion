import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSignInComponent } from './user-sign-in.component';

describe('UserSignInComponent', () => {
  let component: UserSignInComponent;
  let fixture: ComponentFixture<UserSignInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSignInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
