import { TestBed } from '@angular/core/testing'
import { Type } from '@angular/core'

export function getDep<T>(clazz: Type<T>): T {
  return TestBed.get(clazz)
}
