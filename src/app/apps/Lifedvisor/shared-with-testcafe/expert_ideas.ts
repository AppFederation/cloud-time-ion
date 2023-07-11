/*
 Ideas:
  * focus on things that are a problem on a given day (or yesterday, to solidify it)

  * focus on wishes, e.g. "I wish I had more motivation" vs problems more, to make it less negative/problem-oriented
*/


export const questions = {
  badMood: 'Are you having a bad mood?',
  exercises: 'Are you doing physical exercises regularly?',

}

/** Problems are also wishes, e.g. "I wish I had more time" */
export const x = {
  temptedToPlayGames: {
    problem: 'Tempted to play computer games',
    ifYes: [
      {
        question: 'Do you allocate time/resources for entertainment in a controlled way?',
        subQuestions: [
          /* like a checklist to fulfill the parent question */
        ]
      },
      {
        question: 'Are you delaying and sampling (but not denying) gratification?'
      },
      {
        /* reference to low motivation */
        /* Have you tried "surfing the urge technique? */
      }
    ]
  },
}

export class Questions {

  'example 1' = {}
  'example 2' = {
    testReference: this['example 1']
  }

  'I have trouble going to sleep at the right time' = {
    ifYes: [
      {
        question: 'Do you turn off and put away (hide) your electronics and other temptations, including computer, mobile phones'
      }
    ]
  }

  'I dont sleep well' = {
    ifYes: [
      {
        question: 'Do you have a stable sleep schedule?',
        description: 'A stable sleep schedule can help your organism optimize duration and quality of sleep.'
      }
    ]
  }

  overEating = {
    problem: 'Overeating',
    keywords: 'food eat',
    ifYes: [
      {
        question: 'are you stressed / tense?'
        /* reference here */
        /* 2018-09-14 18:41 question: 'Are you taking conscious effort to relax (body and mind) ?*/
      },
      {
        question: 'are you trying to compensate for something?'
      },
      {
        question: 'Do you have goals to keep your mind away from temptations and distractions?'
        /* here checklist: worthwhile, believable */
      },
      {
        question: 'Are you eating slowly (10minutes?), giving your digestive system time to get to the feeling of fullness and for that feeling to reach the brain?'
      },
      {
        question: 'Are you preparing (on separate dishes) desired portion of food before you start eating, so that you can keep decide beforehand and keep track of how much you have eaten?'
      },
    ],
  }

  dontHaveEnoughTime = {
    question: "I don't have enough time",
    deps: [
      {
        question: 'Are you planning your time?',
        ifNo: [
          {
            question: 'Are you afraid that planning will not give you any advantage?',
            ifYes: [
              {

              }
            ]
          },
          {
            question: 'Are you afraid that the plan will not be fulfilled anyway?',
            ifYes: [
              {
                suggestion: {
                  text: 'Keep in mind, that imperfect planning is most often better than no planning.'
                }
              },
              {
                suggestion: {
                  text: 'Keep in mind, that planning also helps you stay motivated and on the right track.'
                }
              }
            ]
          }
        ],
      },
      {
        question: 'Are you procrastinating?',
        ifYes: [
          {
            question: 'Do you have low motivation?',
            ifYes: [
              {
                /* here a reference to the low motivation */
              }
            ]
          },
          {
            question: 'Are you afraid of failure or doing the task imperfectly?',
            ifYes: [
              {
                suggestion: "Keep in mind that often failing is also a form of progress and learning, which gives you additional information to try next time or try another thing"
              },
              {
                suggestion: "Don't be a pathological perfectionist. Understand that mistakes can always happen to anyone, as we are not omniscient."
              },
            ]
          }
        ]
      },
      'Are you prioritizing?',
    ]
  }

  gettingDistracted = {
    text: 'I am getting distracted',
    questions: [
      {
        text: 'Have you tried ear plugs?'
      },
      {
        text: 'Are your surroundings clear of distracting elements (e.g. unfinished items, things reminding of unwanted memories)?',
        ifNo: [
          {
            text: 'Are you scheduling regular clean-up / re-organization sessions?',
            description: 'The time you invest in the regular clean-ups will pay off.',
          },
          {
            text: 'Have you gone through surrounding items, deciding which ones are relevant and which ones can be removed?',
          },
        ]
      },
      {
        text: 'Have you planned'
      },
    ]
  }

  /** super-general and probably the/a root of many things*/
  'I have trouble accomplishing things' = {
    ifYes: [
      {
        question: 'Are you getting distracted?',
        problem: 'I am getting distracted',
      },
      // do you have goals
      //
    ]
  }

  'I have bad mood' = {
    /* are you making progress? */
    questions: [
      {
        whenAdded: '2018-09-13 21:10',
        question: 'Do you have meaningful and purposeful contact with people?'
      },
    ]

  }

  // 2018-09-14 16:18 ; I feel stuck --> Make a little progress to boost confidence
  // 2018-09-14 16:18 -> are you planning strategically, holistically, taking all relevant aspects into consideration?
}

// Overwhelmed:
// Are you consciously breathing deeply
// (fight or flight)

// 2018-09-15 15:29 state of flow (not too little arousal, not too little) ; "be in the zone" ; for productivity
// 2018-09-18 22:03 mindfulness

// 2018-09-18 22:12 I am confused:
// when having a plan (approach, set of values), stick to it to at least let it blossom, instead of changing between plans
// 2018-09-23 12:27 Trouble getting out of bed?
// 2018-09-23 12:34 -> do you have sun entering the room when trying to wake up? (
// 2018-09-23 12:27 Are you low on dopamine?
// 2018-09-23 12:28 Visualize exciting things, positive outcomes (causes dopamine flow)
// 2018-09-23 12:29 Are you anxious?
// 2018-09-23 12:29 Do you lack confidence?
// 2018-09-23 12:29 Make a little progress to boost confidence
// 2018-09-23 12:30 split the time of a day into chores and pleasant things
// 2018-09-24 13:33 One thing at a time; or one group of things at a time /// also for making bad decisions
// 2018-09-24 14:17 Purposeful goal, up to and including "Life's Mission" ( for me things like Lifedvisor, FlexAgenda, OrYoL)
// 2018-09-24 17:31 Identify which things are really temptations and which ones are sound decisions/investments.


// FEATURES:
// 2018-09-24 17:33 -- users can add own notes and *examples* like OrYoL

//2018-09-24 22:51 -- lacking energy -> energetic music

/* 2018-09-26 10:49 [Are you treating] self-discipline as something fundamental, not just means to an end; to avoid all kinds of problems
    referenced from "have problem going to sleep at the right hour
 */
/* 2018-09-27 14:07 Expect difficulties/complications as normal part of doing tasks; otherwise you will be disappointed and there will be a sharp drop of dopamine levels */

/* 2018-09-28 02:31 I play too much computer games || I eat too much --> have a reward system that does not involve games/food (e.g. sleep, biking, walking, hike, etc.) */

/* 2018-09-29 13:08 Use emotion labelling */
/* 2018-09-29 13:08 (cross-cutting concern) Use reappraisal / reinterpretation of situations
- Examples: doing taxes/invoices is good because it is part of running a company and allows to save money
* */
/* 2018-09-29 15:44 lack motivation: ->
    Make estimations of how much it will take to achieve bigger items; as a form of planning and to increase motivation
    - E.g. I saw that making FlexAgenda, LifeDvisor usable and significant improvements to TopicFriends, would take ~2-4 weeks, assuming 5 hours a day.
    And I could delegate some of it, to speed it up even more (e.g Nekmo)
 */

/* Idea: merge FlexAgenda, LifeDvisor code bases later, to have functionality like threaded comments/bullet-points in LifeDvisor too
  Overarching: OrYoL
 */

/* 2018-10-01 17:07 - Determination */
/* 2018-10-01 16:59 - Confidence --> body language and posture (body posture and movement can affect the mind/mood */
