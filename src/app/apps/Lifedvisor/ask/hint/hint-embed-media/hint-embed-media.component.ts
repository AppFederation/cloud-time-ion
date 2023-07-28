import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {LiHint, LiHintImpl} from '../../../shared-with-testcafe/Hint'
import {DomSanitizer} from '@angular/platform-browser'

@Component({
  selector: 'app-hint-embed-media',
  templateUrl: './hint-embed-media.component.html',
  styleUrls: ['./hint-embed-media.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush /* Because of constant reloading of yt embed iframe */,
})
export class HintEmbedMediaComponent implements OnInit {

  @Input() hint!: LiHintImpl

  constructor(
    public sanitizer: DomSanitizer,
  ) { }

  getVideoIframe(url: string) {
    // const videoId = url.split('v=')[1];
    // return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + videoId);
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnInit() {}

}
