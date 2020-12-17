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
      learnItem.title = this.generateLines(50);
      let learnItem$ = new LearnItem$(this.learnDoService, i.toString(), learnItem);

      learnItemList.push(learnItem$);
    }
    return learnItemList;
  }

  private generateLines(maxLineCount: number): string {
    let result = "";

    for (let i = 0; i < Math.ceil(Math.random() * maxLineCount); i++) {
      result = result.concat(this.generateRandomStringWithNewLineAtTheEnd());
    }

    return result;
  }

  private generateRandomStringWithNewLineAtTheEnd() {
    return Math.random().toString(36).substring(2).concat("<br>");
  }
}
