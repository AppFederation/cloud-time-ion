import {Injectable} from '@angular/core'
import {LearnItem$} from '../apps/Learn/models/LearnItem$'
import {LearnItem} from '../apps/Learn/models/LearnItem'
import {LearnDoService} from '../apps/Learn/core/learn-do.service'

@Injectable({
  providedIn:'root'
})
export class DataGeneratorService {

  constructor(private learnDoService: LearnDoService) {
  }

  public generateLearnItemList(count: number): LearnItem$[] {
    let learnItemList: LearnItem$[] = [];
    for (let i = 0; i < count; i++) {
      let learnItem = new LearnItem();
      learnItem.title = `Task ${i + 1}`;
      let learnItem$ = new LearnItem$(this.learnDoService, i.toString(), learnItem);

      learnItemList.push(learnItem$);
    }
    return learnItemList;
  }
}
