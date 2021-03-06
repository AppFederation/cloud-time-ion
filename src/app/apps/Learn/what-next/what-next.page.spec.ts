import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WhatNextPage } from './what-next.page';

describe('WhatNextPage', () => {
  let component: WhatNextPage;
  let fixture: ComponentFixture<WhatNextPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhatNextPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WhatNextPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
