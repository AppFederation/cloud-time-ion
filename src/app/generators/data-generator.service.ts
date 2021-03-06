import {Injectable} from '@angular/core'
import {LearnItem} from '../apps/Learn/models/LearnItem'

@Injectable()
export class DataGeneratorService {

  public static generateLearnItemList(count: number): LearnItem[] {
    let learnItemList: LearnItem[] = [];
    for (let i = 0; i < count; i++) {
      let learnItem = new LearnItem();
      learnItem.title = `Task ${i + 1}`;
      learnItemList.push(learnItem);
    }
    return learnItemList;
  }
}
