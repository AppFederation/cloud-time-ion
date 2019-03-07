import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandsOverlayComponent } from './commands-overlay.component';

describe('CommandsOverlayComponent', () => {
  let component: CommandsOverlayComponent;
  let fixture: ComponentFixture<CommandsOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommandsOverlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommandsOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
