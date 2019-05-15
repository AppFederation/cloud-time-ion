import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeViewComponent } from './time-view.component';
import {By} from "@angular/platform-browser";

fdescribe('TimeViewComponent', () => {
  let component: TimeViewComponent;
  let fixture: ComponentFixture<TimeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeViewComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  function elemText(selector: string) {
    let debugElement = fixture.debugElement.query(By.css(selector));
    if ( ! debugElement ) {
      return null
    } else {
      return debugElement.nativeElement.textContent.trim()
    }
  }

  function expectElemText(selector: string, expected: string, msg: string) {
    if ( expected === '.') {
      expected = null
    }
    expect(elemText(selector)).toEqual(expected, msg)
  }

  function testTimeImpl(timeMs: number, sExpected: string) {
    const exp = sExpected.split(' ')
    component.timeMs = timeMs
    fixture.detectChanges()
    expectElemText('#hrsVal', exp[0], 'hrs')
    expectElemText('#minsVal', exp[1], 'mins')
    expectElemText('#secsVal', exp[2], 'secs')
  }

  function testTimeMs(timeMs: number, sExpected: string) {
    it(`shows time for ${timeMs} ms`, () => {
      testTimeImpl(timeMs, sExpected)
    })
  }

  function testTime(sInput: string, sExpected: string) {
    it(`shows time for ${sInput}`, () => {
      const t = sInput.split(' ').map(ts => Number.parseInt(ts, 10))
      const timeMs = 1000 * (t[0] * 3600 + t[1] * 60 + t[2])
      testTimeImpl(timeMs, sExpected)
    })
  }

  testTimeMs(1000, '. 00 01')
  testTimeMs(999, '. 00 00')
  testTimeMs(1, '. 00 00')
  testTimeMs(-1, '. 00 00')
  testTimeMs(-999, '. 00 00')
  testTimeMs(1000, '. 00 01')
  testTime('0 0 00', '. 00 00')
  testTime('0 0 01', '. 00 01')
  testTime('0 0 59', '. 00 59')
  testTime('0 1 00', '. 01 00')
  testTime('0 1 01', '. 01 01')
  testTime('0 1 59', '. 01 59')
  testTime('0 59 59', '. 59 59')
  testTime('1 0 0', '1 00 00')
  // Negative:
  testTime('0 0 -1', '. 00 -01')
  testTime('0 -1 00', '. -01 00')
  testTime('-1 0 0', '-1 00 00')
  testTime('-1 0 -1', '-1 00 -01')
  testTime('-1 -1 -1', '-1 -01 -01')
});
