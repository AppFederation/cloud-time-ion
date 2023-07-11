import { Component, OnInit } from '@angular/core';


export const slogans = [
  `Upgrade Your Life with Lifedvisor`,
  `Be Advised: Your life will get better with Lifedvisor!`,
  `Your Pocket Mentor and Advisor`,
  `Feeling DOWN? UP-grade with Lifedvisor!`,
  `Your Premium Self-Mentoring Tool`,
  `Got life figured out and then something happens and You forget? This app will help You`,
  `Lifedviser. Live Wiser.`,
  `Relevant life advice right when You need it, where You need it.`,
  `Tired of listening to 10-hour self-help audiobooks? We got something much faster for You.`,
  `Get life under control`,
  `What gets measured, gets managed - Peter Drucker`,
  `May I offer some advice?`,
  `Improve life? There is an app for that.`,
  `Better life? There is an app for that.`,
  `Meaning of life? There is an app for that.`,
  `Obvious, given perfect hint-sight.`/*pun on hindsight*/,
  `Life's missing instruction manual`,
  `Get better at life`,
  `Play the self-improvement game and its mini-games!`,
  `It's like what Your parents were trying to teach you, but much broader and more modern :)`,
  `Warning: Side effects might include happiness.`,
  `A treat for high-functioning Nerds :)`,
  `Have You ever thought "If only I could drill it into my head, to not make the same mistake again?" -- well, we got good news for You.`,
  `Practice makes perfect. And repetition is key to practice.`,
  // ==== for LearnDo
  `(for LearnDo) You've got to learn more to earn more.`,
  `MetaLearning: learn how to learn better.`,
  `UltraLearning: apply best ways of learning.`,
  `Work on Yourself at least as hard as on your work.`,
]


@Component({
  selector: 'app-slogan',
  templateUrl: './slogan.component.html',
  styleUrls: ['./slogan.component.scss'],
})
export class SloganComponent implements OnInit {

  slogan ! : string

  sloganIdx = Math.floor(Math.random() * slogans.length)

  constructor() {
    this.setSloganIdx(this.sloganIdx)
  }

  ngOnInit(
  ) {}

  onClick() {
    this.pickNextSlogan()
  }

  private pickNextSlogan() {
    this.setSloganIdx(this.sloganIdx + 1)
  }

  setSloganIdx(sloganIdx: number) {
    this.sloganIdx = sloganIdx
    this.slogan = slogans[this.sloganIdx % slogans.length]
  }
}
