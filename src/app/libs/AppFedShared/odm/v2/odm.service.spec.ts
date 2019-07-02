import { TestBed } from '@angular/core/testing';
import {Injectable, Injector} from "@angular/core";
import {OdmCollectionService2} from './OdmCollectionService2'
import {OdmBackend} from '../OdmBackend'
import {OdmCollectionBackend} from '../OdmCollectionBackend'
import {OdmItemHandle} from './OdmItemHandle'

class SutRamItem {
  constructor(
    public stringFieldInMem: string,
    public numberFieldInMem?: number,
  ) {}
}

class SutDbItem {
  stringFieldInDb: string
  numberFieldInDb: number
}

@Injectable()
class SutOdmService extends OdmCollectionService2<SutRamItem, SutDbItem> {
  constructor(injector: Injector) {
    super(injector, 'SutItem')
  }

  protected convertFromDbFormat(dbItem: SutDbItem): SutRamItem {
    // return Object.assign(new SutRamItem(), dbItem)
    const inMem = new SutRamItem(dbItem.stringFieldInDb)
    inMem.numberFieldInMem = dbItem.numberFieldInDb
    return inMem
  }

}

@Injectable()
class FakeOdmBackend extends OdmBackend {
  constructor(injector: Injector) { super(injector) }

  createCollectionBackend(injector: Injector, className: string): OdmCollectionBackend<any> {
    return new FakeBackendCollection<any>(injector, className, this)
  }
}

class FakeBackendCollection<TInDb> extends OdmCollectionBackend<TInDb> {
  constructor(injector: Injector, className, odmBackend) {
    super(injector, className, odmBackend)
  }

  saveNowToDb(item: TInDb) {
  }

  deleteWithoutConfirmation(itemId: string) {
  }
}

describe('OdmService: ', () => {
  let service: SutOdmService
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SutOdmService, {provide: OdmBackend, useClass: FakeOdmBackend}]
    })
    service = TestBed.get(SutOdmService);
  })

  it('should be created', () => {
    const odmBackend = TestBed.get(OdmBackend);
    console.log('odmBackend', odmBackend)
    expect(service).toBeTruthy();
  });

  describe('reaction to local saves by user: ', () => {
    it('saves new item', () => {
      let sutItemInMem = new SutRamItem('str1')
      let handle = new OdmItemHandle(service, sutItemInMem)
      expect(handle.localSnapshot.data.stringFieldInMem).toBe('str1')

      handle.localSnapshot.patchNow({}) // TODO: save?
      handle.localSnapshot.patchNow({stringField: 'str1_Patched'})
      // service.
    })
  })

  describe('reaction to changes incoming from db: ', () => {
    let newItem = {
      stringField: 'str',
      numberField: 100,
    } as SutItem

    let newItemModified1 = {
      stringField: 'strMod1',
      numberField: 101,
    } as SutItem

    let newItemModified2 = {
      stringField: 'strMod2',
      numberField: 102,
    } as SutItem

    let listener: OdmCollectionBackendListener<OdmItem<SutItem>>

    beforeEach(() => {
      listener = service.odmCollectionBackend.listener
    })

    function testAdded() {
      listener.onAdded('addedId1', newItem)
      debugLog('testAdded -- service.localItems$.lastVal', service.localItems$.lastVal)

      expect(service.localItems$.lastVal).toEqual([null])
    }

    function testModified1() {
      listener.onModified('addedItem1', newItemModified1)
      debugLog('testModified1 -- service.localItems$.lastVal', service.localItems$.lastVal)
      expect(service.localItems$.lastVal).toEqual([null])
    }

    xit('reacts to item added from db', () => {
      testAdded()
    })

    xit('reacts to item modified from db', () => {
      testAdded()
      testModified1();
    })

    xit('reacts to item modified from db second time', () => {
      testAdded()
      testModified1()
      listener.onModified('addedItem1', newItemModified1)
      expect(service.localItems$.lastVal).toEqual([newItemModified1])
    })

  })
});
