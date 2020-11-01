import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MerriamWebsterDictService {

  constructor() { }

  doIt(searchText: string) {
    let xhr2 = new XMLHttpRequest();
    xhr2.open('GET', 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/'+ searchText + '?key=fad1fb47-7677-4fbe-ac1f-79cc29eea9a4')
    xhr2.onload = function() {
      let json = JSON.parse(xhr2.response)
      console.log(`dict`, json)
      // let text = json[0].def[0].sseq[0][1].dt[1]
      // sseq 0 0 1 0 1
      const jsonWithText = json[0].def[0].sseq[0][0][1][0][1]
      let text = JSON.stringify(jsonWithText.sense.dt[0][1])
      console.log(`jsonWithText`, jsonWithText)
      alert(`Loaded: ${text} ------ ${xhr2.status} ${xhr2.response}`);
    };
    xhr2.send()
  }
}
