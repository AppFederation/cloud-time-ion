// tslint:disable:max-line-length no-string-literal

// Hints, problems, questions, wishes

// Every HINT is also a WISH

// Ideas:
/* 2018-10-02 22:08 Use */

// Later when I have editing in web browser, I can use like grammarly and thesaurus to improve my writing.

// Idea: can have referral programs with products helping in given category, e.g. language learning

// Marketing: put in https://alternativeto.net/
// keywords: coaching, life coaching

/* Idea:  2019-11-19: Hints/problems could be contextual, e.g. morning, evening, weekend, etc. And appear at the right moment.

  2019-12-25 TODO: !!! contexts (e.g. "Context: Time: after waking up", "Context: before sitting down to work"), habits, order of hints 1. 2. 3. ...
  - to avoid overwhelm (what should I really do now) - get the right advice in the right context and the right order
  - distinguish between "at given time" context from "to improve X" - e.g. "after getting up from bed", vs "to improve getting up from bed" (which could involve activities e.g. in the evening before)
 */

/* 2019-12-25 Self-rating would be really important for actual accountability and force myself to really evaluate current state and what are weakest/strongest points */

/* First person or second person writing? ("I visualize" or "[You should] visualize)
- https://www.psychologytoday.com/us/blog/the-novel-perspective/201506/fooling-your-ego
 - - Tricking the Censoring Ego
* */
/**
 * Root tree structure:
 * - "How to live -> Have a great life" - root wish/hint
 * - - general principles (will be linked to from other places?) - for both feeling good about your life and feeling good in the moment
 * - - feeling good about your life
 * - - - achievements / success
 * - - - good relationships with Other people
 * - - feeling good in the moment
 * - - - good mood ... self-esteem ( from my virtuous circle graph )
 * - - - runner's high (endorphins)
 * - - - happiness is making progress on a worthwhile goal
 * - - - get into a state of flow
 * - - - guilt-free entertainment
 * - - - spend quality time with people whom You like and trust
 */

import {
  hint,
  hintBridge,
  problem,
  question,
  wish,
} from './Hint';
import { HintSource } from './HintSource';
import { sources } from './sources_data';


const IN_GENERAL = `In general`;

export class Questions {

  'Relax and do not stress' = problem({
    ifYes: [
      hint({ text: `While relaxing, say to Yourself "everything will be fine (one way or another)", instead of "I don't care about anything"`,
        comments: `If You are using "I don't care about anything", You would diminish Your motivation`
      }),
    ]
  })

  'Low-information diet' = hint()

  'Make everyday real life more enjoyable' = hint({
    subTitle: `(so as to avoid escapism and low mood)`,
    searchTerms: [`annoyed`, `annoying`, `pissed off`, `uncomfortable`],
    ifYes: [
      hint(`Invest in your infrastructure`),
      hint(`Invest the time to make your surroundings clean, neat and functional`),
      hint({ text: `Invest the time to finish nagging loose ends, instead of trying to escape from them`,
        subTitle: `(can swiss-cheese them if too overwhelming)`,
        ifYes: [
          hint({ text: `Find motivation to invest in fix nagging loose ends`,
            subTitle: `(even though we think sometimes we should ignore them as fixing them seems like not being a productive activity)`,
            ifYes: [
              hint({ text: `Think how nagging loose ends are slowing you down in the long run, like a handbrake.`,
                comments: `Like a persistent overhead. They cause annoyance, anxiety, drain energy.`,
              }),
            ]
          }),
        ]
      }),
    ]
  })

  'Travel' = wish({
    ifYes: [
      hint(`Use hanging toiletry organizers and wardrobe organizers`),
      hint(`Use transparent bags/cases to more quickly find things in your bag`),
      hint({ text: `Use 4-wheel rolling bag`,
        benefits: [
          `more maneuverable in tight situations like security checkpoints, food places; saving time and frustration and risk of causing accident`,
          `less strain on the back while walking with it`,
        ]
      })
    ]
  })

  'Learning and remembering things' = wish({
    subTitle: `(studying)`,
    searchTerms: [`study`, `student`, `examination`, `prepare for exam`],
    ifYes: [
      hint(`Use spaced repetition`),
      hint(`"Put it in front of the door" technique`),
      hint(`Prepare all materials You need, before You study, to not get distracted`),
      hint({title: `Overcome procrastination for studying`,
        ifYes: [
          hint({title: `Just "study a little bit"`,
            subTitle: `You might get hooked`
          })
        ]
      })
    ]
  })

  'Learning languages' = wish({
    ifYes: [
      hint(`Listen to Audiobooks in given language`), /* Idea: referral program with audible */
      hint(`Watch movies in given language with subtitles in given/native language`),
    ]
  })

  'Being healthy at office job/computer work' = wish({
    ifYes: [
      hint(`Use standing desk (alternate between different positions)`),
      hint({ text: `Make breaks and micro-breaks`,
        ifYes: [
          hint(`Use an app that reminds about breaks`),
        ]
      }),
      hint({ text: `Relax and do not stress while working`,
        ifYes: [
          this['Relax and do not stress']
        ]
      }),
    ]
  })

  'Use Ikigai' = hint()

  'Success / achievement' = wish({
    ifYes: [
      hint(`Dont confuse activity with achievement`),
      hint({ text: `Define what success means for You`,
        ifYes: [
          hint(`Acknowledge certain limitations`),
          hint(`You cannot be a successful sumo wrestler and ski jumper at the same time.`),
          this['Use Ikigai'],
        ]
      })
    ]
  })


  'Utilize and build virtuous circles (and avoid VICIOUS circles, no X -> no Y -> etc)' = hint({
    comments: `motivation/dopamine -> discipline/perseverance -> progress -> self esteem, excitement, confidence -> more motivation`
  })

  /* cross-cutting concern? But can describe in general too */
  'Progress' = hint({
    problemText: 'Feel stuck (no progress)',
    ifYes: [
      this['Utilize and build virtuous circles (and avoid VICIOUS circles, no X -> no Y -> etc)'],
      hint({title: 'Determine where Your bottleneck(s) are.',
        subTitle: `Is it time, money, skills, maybe motivation? Determine which ones are the biggest limiting factors, and keep improving it to get to the next level.`
      }),
    ],
    text: 'Make a little progress to boost confidence',
  })

  'Confidence' = hint({
    /* text inferred from field name for now */
    ifYes: [
      this['Utilize and build virtuous circles (and avoid VICIOUS circles, no X -> no Y -> etc)'],
      this.Progress,
      hint({
        title: 'Have a confident body language and posture',
        subTitle: `(body posture and movement can affect the mind/mood)`,
      }),
      hint({title: `"Fake it till You make it"`,
        subTitle: `(otherwise You can end up with a chicken&egg problem). But be careful to not end up unethical.`,
      }),
    ]
  })

  'Mood' /* TODO unite with happy/unhappy */ = hint({
    ifYes: [
      hint('Smile (part of body language) and it will affect mood'),
      hint(`In life, have a bias towards optimism and excitement (while still steering away from problems) - it creates a kind of positive mood shield "bubble".`),
    ]
  })

  'Self-Esteem' = hint({
    when: '2018-10-02 22:09',
    ifYes: [
      this['Utilize and build virtuous circles (and avoid VICIOUS circles, no X -> no Y -> etc)'],
      hint({
        text: 'Make sure to not make too long breaks between working (and progress, even if small progress) on mayor goals and using major skills, to keep self-esteem up',
        example: '2018-10-02 22:10 working on TopicFriends/LifeDvisor'
      }),
      hint({
        when: '2018-10-03 22:41',
        text: 'Play a game competing against yourself (previous attempts), it will raise your feeling of status. Whereas competing against others can have negative consequences in the form of a threat of lowering their status.',
        source: '"Your Brain At Work" audiobook'
      }),
      hint({
        when: '2019-07-26, 14:55',
        text: 'Recall what I have achieved so far. Natural languages, Programming. Money earned. Earning capability. Persuasion/recruitment skills. TopicFriends. Well-read.'
      }),
      hint({
        when: '2019-07-26, 15:01',
        text: 'Think what I\'m going to achieve when I continue on the right path (on which I mostly am). Freedom of space and time. Satisfaction, self-esteem.',
      }),
    ]
  })

  'Motivation' = hint({
    titleSuffix: IN_GENERAL,
    searchTerms: [`Why bother feeling`, `unmotivated`, `motivate more`, `motivated`, `motivating`, `futility feeling`,  `feeling futile`],
    // negative/problem version for text search: "I don't feel like ..."
    // symptoms:
    // es: no tengo ganas; pereza
    // pl: nie chce mi się
    byLang: {
      es: 'pereza; no tengo ganas',
    },
    ifYes: [
      hint({title: `Build and maintain momentum to stay motivated`,
        ifYes: [
          hint(`Try to not make more than 1-2 days break from making progress on Your major projects`)
        ]
      }),
      hint(`Think of close-by believable milestones but have a bigger context/vision to expand to, for excitement`),
      hint({title: `Sampling of future bigger pleasures.`,
        subTitle: `for balance between productivity and fun`,
      }),
      hint({title: `Overcome doubts via thinking`}),
      hint(`Create positive associations with the things You would like be motivated towards.`),
      hint(`As Confucius said: "Choose a job you love, and you will never have to work a day in your life."`),
      hint('#Visualise the benefits, the desired state'),
      hint('Why should I be motivated to do what I think I should do? Because it is just *superior* to all other options.'),
      /* FIXME: 'Fun/dopamine' */
      hint({ text: 'Distinguish between "Have to" and "Want to" (locus of control)',
        example: `including company invoices; I don't have to do this, but I want to do this, to optimize my finances.`
      }),
      this['Utilize and build virtuous circles (and avoid VICIOUS circles, no X -> no Y -> etc)'],
      /* hope/belief */
      hint({ text: 'Reach a critical mass (proof-of-concept), to legitimize the project in your own mind, and to be able to show others',
        when: '2018-10-02 22:13'
      }),
      this['Self-Esteem'],
      hint('For better motivation (more "toward" state and less "away" state), focus on the desired outcomes of tasks, not problems/effort/uncertainty. According to "Your Brain at work": probably do not focus of undesired outcomes of not doing tasks.'),
      hint('Do not "try" to "replace" actual living with writing down notes about living, like e.g. here. Treat the notes just as supplements and optimizations. They can can cause a kind of inner heaviness (e.g. worrying too much about doing everything right). However writing down notes about balance of fun, watching out for dangerous perfectionism, can help keep a proper balance.'),
      hint('Keep in mind, that the anticipation of something happening can be as powerful and pleasurable/dopamine-inducing (or even more) as the actual experience. And much cheaper to achieve. However requires a degree of belief in it, which might require some preparation/sampling.'),
      hint('When motivation comes, for a more "fragile-motivation" task, make sure to not waste it. E.g. for programming own apps. Put other things aside for a while to ride the wave of the more valuable motivation. Write down the other pending tasks, to clear my mind of them.'),
      hint('Do not suppress things which I am aching to do, and are '),
      hint('Do not try to do (or get motivated for) too many things at the time. I get motivation for one thing, then if it makes any sense, do it. Otherwise it is jumping between tasks and diluting/depleting the motivation. Do not feel *guilty* of not doing some-other-task, while doing current task.' +
        'Even if the other task\'s priority might seem slightly higher, the importance of riding the wave of motivation and finishing the task at hand, is important. Unless the other task is really urgent.'),
      hint({title: 'Avoid self-oppression',
        ifYes: [
          hint({title: `Take into account, that we have natural instincts, physiological and emotional needs.`,
            subTitle: `So keep them in balance with the rest of life`}),
        ]
      }),
      hint(`It's good to ask "why?" to increase motivation - why I should I be motivated towards something. But not as many times as to reach origin of life or the universe or even meaning of life (can risk triggering existential void)`),
      hint({
        text: 'Recall earlier times when You did big progress, eg when You were younger and more hungry. How did You reach here? Now repeat that spirit with all the more resources and wisdom that You have.',
        ifYes: [
          hint({
            text: 'Recall what things were connected to the earlier times of progress; e.g. music, sports, certain inspiring movies/documentaries',
            examples: [
              'Machine Head, etc. from 2011 just before CollabNet',
              'Chess, beer, counterstrike with Mariusz',
              'Excitement with new car Ford Galaxy',
            ]
          }),
        ]
      }),
      hint(`Find motivation by being strong for others for whom You are wishing well.`),
      hint(`Have exciting goals.`),
      hint({title: `Harness Your personality`,
        ifYes: [
          hint({title: `If You are obsessive, harness and direct Your obsessiveness to get more and better results.`,
            subTitle: `(as opposed to obsessing about useless/unimportant things)`,
          })
        ]
      })
    ]
  })

  'Motivation for projects' = hint({
    ifYes: [
      hint({
        text: 'Use stretch goals to improve motivation',
        sources: [
          new HintSource('https://charlesduhigg.com/books/smarter-faster-better/'),
        ]
      })
    ]
  })

  'Discipline' = hint({
    titleSuffix: IN_GENERAL,
    // negative/problem version for text search: "I don't feel like ..."
    ifYes: [
      hint(`Visualise the positive/negative consequences of doing / not doing the things You should do.`),
      hint(`Have a long time perspective`),
      hint({ text: `*Delaying* and *Dosage* of gratification, instead of *denying* of gratification`,
        comments: `Distinguish between "No" and "Yes/Maybe but later". A "No" is negative/inhibitive thought which can lower Your dopamine level.`}),
      this['Utilize and build virtuous circles (and avoid VICIOUS circles, no X -> no Y -> etc)'],
      this['Motivation'] /* Does discipline require motivation ? */,
      hint(`In order to have discipline, You need motivation`) /* example of inclusion / connector hint/text */,
      hint({ text: `Motivation for discipline and benefits of it`,
        ifYes: [ /* maybe move this to `benefits: ` field; benefits are also like reverse dependencies; but I probably need to write custom texts anyway */
          hint({ text: `(Misconception) You will get benefits of discipline immediately (not only after years) in the form of #endorphins, increased #self-esteem, reduction of #worry, increase in order and reduction of chaos`,
            source: 'Brian Tracy - The Miracle of Self-Discipline',
          }),
          hint({ text: `(Misconception) In the big picture, discipline does not reduce your #freedom, but rather increases it by giving you more time/energy/resources to do what you really want to do`}),
        ]
      })
    ]
  })

  'Write down things (e.g. lists, email draft) to free your mind from nagging thoughts' = hint({})

  'Get better organized (in general)' = wish({
    searchTerms: ['personal organization organisation', 'organising myself']
  })

  'Focus' = hint({
    text: 'Focus and avoiding distractions (in general)',
    searchTerms: [`focusing`, `distraction`, `distracted`],
    ifYes: [
      hint({title: `Get better organised, to reduce distractions`,
        ifYes: [
          this['Get better organized (in general)']
        ]
      }),
      hint(`Archive old things/e-mails/notes which You no longer need right now, but which might distract You (by dragging Your mind away into some far-away old topic)`),
      hint({ text: `Increase signal-to-noise ratio.`}),
      hint({ text: `Use time tracker to stay focused and see how much time is being spent on each activity.`}),
      hint({ title: `When switching activity, mark the place where You are.`,
        subTitle: `To minimize time (time-consuming linear search) needed to get back on track. E.g. via selecting text or putting a bookmark.`,
      }),
      hint({ text: `When entering a potentially very distracting website (e.g. twitter or LinkedIn)`,
        subTitle: `raise your guard, buckle up and prepare to deflect distractions and temptations`,
        /* "The discipline of focus" */
      }),
      hint({ text: `Focus on zone of influence, instead of zone of preoccupation`,
        sources: [
          sources['The 7 Habits of Highly Effective People'],
        ]
      }),
      this['Low-information diet'],
      hint({ text: `Work from a list to have a clear track to run on and to avoid distractions.`,
        ifYes: [
          hint(`Have the list always open and visible (e.g. on a separate monitor or under a shortcut key).`),
        ]
      }),
      hint(`Use ear-plugs`),
      hint(`Consider noise-cancelling or noise-isolating headphones`),
      hint(`Get into the state of Flow, to get less prone to distractions`),
      hint({ text: `Minimize context switching. Write things down instead of acting on them immediately.`,
        comments: `Example: write ideas in source code of another project, instead of acting on them immediately.`
      }),
      hint('In order to focus on one thing, we have to cut out other things (positive #Sacrifice)'),
      hint({
        text: 'Focus is a #skill like any other, therefore requires practice, repetition'
      }),
      hint({ /* inclusion / connector / explanation */
        text: `We focus better when we have good motivation. It's easier to discard other lesser value temptations, when we see high value (thus we are motivated) in what we are doing right now.`,
        ifYes: [
          this.Motivation,
        ]
      }),
      hint({
        text: '#Invest in removing distracting elements from your surroundings',
        ifYes: [
          hint('Close unneeded browser tabs and/or open a separate window for the task at hand'),
          hint({ text: `Block distracting unrelated elements in web pages; e.g. amazon, stackoverflow, YouTube suggestions`,
            ifYes: [
              hint({title: `Use extensions like DF Tube (Distraction Free for YouTube™)`,
                subTitle: `https://chrome.google.com/webstore/detail/df-tube-distraction-free/mjdepdfccjgcndkmemponafgioodelna`,
              })
            ]
          }),
          hint({ text: `Clear search/browsing history and close tabs to not get distracted by previous activities. Store the stuff you might need later, in bookmarks / notes.`}),
        ]
      }),
      hint({
        text: 'Do little tasks quickly, to free the mind from distracting nagging thoughts'
      }),
      this['Write down things (e.g. lists, email draft) to free your mind from nagging thoughts'],
      hint({title: 'Have separate e-mail/IM accounts for various purposes',
        subTitle: 'Consider innotopic.consulting@gmail.com or consulting@innotopic.com, apps.feedback@innotopic.com, apps.development@innotopic.com, innotopic.apps@gmail.com, even better: app-name-here.users@innotopic.com, etc., to not get distracted in one area while working in another.' +
          'Also topicfriends@gmail.com; also keep in mind delegating (or giving access to) stuff to other people, e.g. assistant, another developer '
      }),
      hint('Disable notifications (sound; and perhaps even on-screen notifications) in all communication media except those used for dealing with urgent things (e.g. phone)'),
      hint({
        title: `Allocate big blocks of uninterrupted time for tasks which require deeper focus`,
        ifYes: [
          hint(`If necessary, go to your family/coworkers/flatmates and ask them if they need anything and tell them that You are going to have a big block of focused time now.`),
          hint({
            title: `Prepare your work area before starting a big chunk of uninterrupted time`,
            ifYes: [
              hint({title: `Prepare water in a non-spill bottle`,
                subTitle: `(or even multiple bottles)`,
              }),
            ]
          })
        ]
      }),
      hint({title: `But avoid over-focusing / tunnel vision`,
        subTitle: `It can prevent You from seeing relevant related information. It can decrease motivation.`
      }),
    ]
  })

  'Go to sleep at the right time' = hint({
    ifYes: [
      hint({ text: 'Build a #habit of going to sleep at the right time'
      }),
      hint({ text: 'Do you turn off and put away (hide) your electronics and other temptations, including computer, mobile phones. ' +
          `Can keep Your laptop in another room`,
      }),
      hint({ text: 'Tomorrow is a day, too (jutro też jest dzień)'
      }),
      hint({ text: 'Setup a timer to limit activities right before going to sleep.'
      }),
      hint({ text: 'Think about (and visualize) the benefits of going to sleep at the right time,',
        subTitle: `including being well-rested and the #consecuences of not having enough sleep (harder to control cravings, impaired thinking and memory), leading to bad life quality, bad emotions, frustration, sickness.`,
      }),
    ]
  })

  'Have good sleep' = hint({
    searchTerms: [`sleep`, `sleeping`, `bad sleep`],
    ifYes: [
      hint(`Build good sleep habits`),
      hint({
        text: 'Improve falling asleep',
        ifYes: [
          this['Write down things (e.g. lists, email draft) to free your mind from nagging thoughts'],
          hint({ text: `Avoid light shortly before going asleep; especially bright/blue light.`,
            ifYes: [
              hint(`Use dark/night mode in operating system and apps.`),
              hint(`Can set dark background for desktop, home screen, lock screen, to avoid being over-stimulated and distracted`),
              hint(`Use screen/blue filter apps, like flux`),
            ]
          }),
          hint(`Avoid too energetic music in the evening.`),
          hint(`Avoid caffeine in the evening.`),
        ]
      }),
      this['Go to sleep at the right time'],
    ]
  })


  /* cross-cutting concern? */
  'Good decisions' = hint({
    ifYes: [
      hint({
        text: 'cost-benefit',
        ifYes: [
          hint('Consider the following "resources" for cost/benefit: health, time, money, emotion(own/others), energy, focus, reputation'
            // , .... TODO from my papelito
          ),
        ]
      }),
      hint({
        text: 'Compare cost (real cost) by the difference to alternatives (no absolute cost) or to "default/current" state',
        example: 'e.g. something costs 100 EUR a month but if I don\'t pay this, I have to pay 70 EUR/month anyway,' +
          'so the real cost is 30 EUR, not 100EUR (making the decision easier); and the benefit is e.g. saved time/emotion or other resources.',
      }),
      hint({
        title: `Think of higher more general principles`,
        subTitle: `They could help You in making a specific decision`,
      }),
      hint({
        text: 'Consider the alternatives',
        ifYes: [
          hint('Look also at the consequences of inaction or not making the decision'),
        ]
      }),
      hint({
        text: 'Use Pareto Principle',
        subTitle: `The so-called 80/20 rule`,
      }),
      hint({
        text: 'Visualize consequences (financial, emotional, physical, productivity, etc)'
      }),
      this['Have good sleep'],
      hint({title: 'When trapped into thinking "either-or", think of ways of being able to realize all the options, or combinations of them',
        examples: [
          'Build a business AND be able to travel -> lifestyle business / passive income.'
        ]
      }),
      hint('Sleep over it'),
      hint('Visualize consequences of various decisions'),
      hint('Watch out for priming effects'),
      hint('Watch out for cognitive biases; TODO: you are not so smart audiobook'),
    ]
  })

  'Decide what I want to be in life' = hint({
    subTitle: `I can't be a sumo wrestler and ski jumper at the same time`,
    ifYes: [
      hint({
        text: 'Choose if I want to still be free and explore or settle down. BUT building a solid base and income can make it easier to travel.'
      })
    ]
  })

  'Energetic music' = hint({})

  'Choosing/Assessing Products' = hint({
    ifYes: [
      hint({
        text: 'Don\'t compare to some imaginary perfect ideal, but rather to other products that You have encountered',
        examples: [
          'Wireless headphones. Probably PowerBeats Pro best ever, even though not perfect',
        ]
      }),
    ]
  })

  // 'Choices' -> 'Be a satisficer, not a maximiser"

  'Getting up from sleep/bed' = hint({
    ifYes: [
      this['Energetic music'],
      hint({ text: `Treat getting up as something You *want* to do, as opposed to *have-to* do.`}),
      hint({ when: '2018-10-06 23:04',
        text: '(?) Have done something exciting the previous day/afternoon/evening, to have the dopamine effect spill to the next morning.',
        // E.g. in my case it was alcohol/games etc.
        comments: 'Could be something like a nice TED or progress on an attractive non-vague, non-vaguely-needed task',
        example: 'Kurzweil, TED (psychology/tech/science), Interviews, commencement addresses with Jobs, '
      }),
      hint({ text: 'Have a strong light source',
        comments: 'Could be natural sunlight or wake-up light or wake-up clock with light.'
      }),
      hint({
        text: 'Start the day with something fun/energizing and with get-up/bootstrap routine',
        subTitle: `don\'t try to start with some unattractive/difficult tasks (unless they are urgent enough to get going)`,
        comments: 'Then, plan the day; which could be motivating too, to see how much I can achieve.'
        /* TODO: lots of practical examples */
      }),
    ]
  })

  /* same as motivation/dopamine ? */
  '[Low] Energy' = hint({
    searchTerms: [`Feeling down`, `tired`],
    ifYes: [
      hint({title: `Keep in mind that there might be an underlying mental/physical/medical/environmental cause to this low energy`,
        subTitle: `e.g. blood sugar, problems with breathing/sleep. So observe and get checked if necessary. But be careful to not fall into hypochondria.`
      }),
      hint({
        text: 'Do physical activity to increase blood oxygenation and feeling of control',
        ifYes: [
          hint({title: 'You can use cleaning (e.g. vacuuming, house cleaning) as a good way to get physical activity',
            subTitle: `... while at the same improving the surroundings`
          }),
        ]
      }),
      this['Have good sleep'],
      this['Energetic music'],
    ]
  })

  // 2019-01-13 1:12 finished reading ~here

  'Prioritizing' = hint({
    titleSuffix: IN_GENERAL,
    searchTerms: [`prioritize`, `prioritise`, `prioritising`, `set priorities`, `what to do first`, `priority`],
    /* cross-cutting concern */
    ifYes: [
      hint(`Prioritize according to goals and values`),
      hint('Prioritize prioritizing itself'),
      hint(`Figure out what the biggest bottleneck is, and prioritize it, to unblock`),
      hint(`Use the N-minute rule`),
      hint({ text: 'Early spend the most time&energy designing things that will affect the most other things and the things that will be hardest to change.',
        comments: `Things that are easy to change later, should be left out crude, to free up energy and focus on the more important things. Exception: things that are very salient and annoying while being easy to change, thus reducing motivation and confidence in the efforts.`
      }),
      hint(`Can Prioritize things which help You use the product yourself.`),
      hint(`Can Prioritize things which help You show Your work to others`),
      hint(`Can Prioritize things which will help you build/rekindle motivation`),
      hint({title: `Prioritise according to ROI (Return on investment).`,
        subTitle: `For that You need to do a quick #estimation.`,
      }),
      hint('Prioritize things which can shed better light (provide understanding/information) on subsequent tasks (reconnaissance)'),
      hint('Then Prioritize things which involve making decisions which can affect further priorities'),
      hint('Can prioritize things with external dependencies, because of uncertainty of how much they will take'),
      hint({
        text: 'Can prioritize things which need external people / resources',
        comments: `(because their availability might come and go) - e.g. making appointments`
      }),
      hint({title: 'Can prioritize the part (thus need to split tasks) of tasks, where things are written down, to not forget them and to stop nagging thoughts.',
        subTitle: `The other part of the task can be done later when time permits.`,
      }),
      hint({title: 'Can prioritize starting things, which can happen in parallel without much intervention while they are happening',
        examples: [
          'laundry'
        ]
      }),
      hint({title: 'Can prioritize things which are quick to do',
        subTitle: `Often in the mind one item is one item, no matter if it takes 1 minute or 1 hour. So doing a number of small items can quickly reduce noise in the mind`,
        warnings: [ `but be careful of doing too many "fun and easy" things`] /* similar to exceptions*/,
      }),
      hint('Can prioritize things in such a way to group related things together, to utilize/discover relationships between them and facilitate INSIGHTS which might sprout from the relationships.'),
      hint('Specify non-goals, posteriorities, not just priorities.'),
      hint('MoSCoW'),
      hint('ABCDE method'),
    ]
  })

  'Planning (in general)' = hint({
    searchTerms: [`plan`, `make a plan`],
    title: `Planning`,
    titleSuffix: IN_GENERAL,
    ifYes: [
      this['Prioritizing'],
      hint(`Write down the plan`),
      hint(`Don't be afraid of writing the things You want to do. Even though it might be overwhelming, but it will keep You at the right track and will help You visualise the outcomes / dream.`),
      hint({
        text: `Try to estimate duration and cost.`,
        comments: `If the estimation turns out not accurate - don't worry - treat it as a learning experience and re-estimate. An imperfect estimation is better than no estimation. Estimating also forces us to think about various considerations.`
      }),
      hint(`Plan in multiple stages, with stepping stones, milestones, checkpoints and decision points (if-then-else-...) to make your plan more flexible and adaptable.`),
      hint(`Periodically revise and adjust your plan.`),
      hint(`The plan is to set a general direction, but it will have to be adjusted along the way. Which is still better than no plan at all (like ship without a rudder heading in a random direction).`),
      hint(`Can use time-boxing as an alternative to estimates`),
      hint(`Estimating: Some tasks should have an extra amount of time allocated to them, even if a minimalistic version of the task could be completed much faster; to ensure quality and coherence.`),
      hint(`Can estimate optimistic (minimum) times as well, for extra motivation (like OrYoL's min time column)`),
    ]
  })

  'Planning a day' = hint({
    searchTerms: [`plan my day`],
    ifYes: [
      this['Planning (in general)']
    ]
  })

  'Planning a life' = hint({
    ifYes: [
      this['Planning (in general)'],
    ]
  })

  'Effectiveness' = hint({
    subTitle: `Doing the right things and doing them efficiently`,
    ifYes: [
      hint({
        title: `Efficiency / optimizations`,
        ifYes: [
          hint({
            text: 'Look for, and utilize, little accidental or semi-accidental coincidences, patterns; it can even double effectiveness; even though it might feel like "cheating".'
          }),
          hint({
            title: `Batch related activities`,
            subTitle: `to decrease overhead and context switching and to increase efficiency`
          }),
          hint({
            title: `Don't be afraid to use quick little hacks, quick workarounds to improve pressing things quickly.`,
            subTitle: `"Duct Tape". As opposed to keeping suffering some deficiency or planning a big expensive and/or time-consuming fix someday-maybe. We can always come back later and improve it if needed.`,
            exceptions: [
              `Avoid hacks when You see that more and things are depending on the quirks of the hack. It will be much more difficult to fix those things later. Don't build more and more things on shaky foundations.`,
            ]
          }),
        ],
      }),
      hint({
        title: `Choosing which things to do`,
        subTitle: `TODO: Planning, prioritization, values, ikigai, decisions, etc`
      })
    ]
  })

  'Productivity' = hint({
    titleSuffix: IN_GENERAL,
    searchTerms: [`be more productive`, `do more things quicker`, `get more done`],
    ifYes: [
      /* group into:
        - motivation for productivity
        - having more time in which You can be productive
        - using the time better
      */
      hint(/* top-level grouping */ { title: `Motivation for productivity`,
        ifYes: [
          this.Motivation,
          hint({
            title: `Get out of your own way`,
            subTitle: `Stay calm and let Your subconscious mind do its best job, as opposed to being anxious about results. You can only directly control the actions/effort, not the result itself.`,
          }),
          hint({
            title: `Get a sense of urgency`,
            subTitle: `Time is passing. The only way to deal with this is to use the time better.`,
            ifYes: [
              hint({
                title: `Use time-tracker with estimation/time-boxing and time-left/overtime notification.`,
                subTitle: `It will help You stay on track and keep in touch with reality.`,
              }),
              hint({
                title: `Know when things are good enough.` /* for search keywords: excessive self-criticism */,
                ifYes: [
                  hint({
                    title: `Ask Yourself: would You buy this product? Would people buy this product? Would they like it already? Probably.`,
                    subTitle: `So let's move to the next item (we can always come back later given extra time/feedback/ideas)...`,
                  }),
                  hint({
                    title: `Ask Yourself: if You saw (without looking too much into tiny details) this thing done by someone else, would You like it?`,
                    subTitle: `Most often we get too self-critical when looking at our own work.`,
                  }),
                ],
              }),
            ],
          }),
          hint({ title: `Productivity is really the only non-random way to do things` }),
          hint({
            title: `Competitiveness`,
            subTitle: `I want to do it better! Competition is a foundation of a strong system. It lifts everyone up.`,
            ifYes: [
              hint({ title: `Overcome objections (conscious or unconscious) to competitiveness` /* this could be a field `objections` or Question/Answer item class */,
                ifYes: [
                  hint({ title: `Objection: Isn't competing bad/aggressive/brutal ?`,
                    subTitle: `As long as we don't do anything unethical, competition is actually good. Friendly competition is possible.`
                  }),
                  hint({ title: `Objection: Isn't cooperating better than competing?`,
                    subTitle: `One does not exclude the other.`
                  }),
                ],
              }),
            ]
          }),
          hint({ title: `Visualise the benefits of productivity`,
            subTitle: `You are going to feel better, stronger, a better person. There will be useful outcomes. You can help others.`
          })
        ],
      }),
      this.Confidence,
      this.Focus,
      this.Discipline,
      // this['Energy'],
      this['Good decisions'],
      this['Effectiveness'],
      hint({/* top-level grouping */  text: 'Have more time ... - create more usable time',
        ifYes: [
          hint(`Delegate work to other people / companies / services, to have more time for doing your own work`),
          this['Planning (in general)'],
          hint(`Eliminate or reduce activities which have little value.`),
          hintBridge({
            title: `Optimize sleep to have more time`,
            ifYes: [
              this['Have good sleep'],
            ],
          }),
        ],
      }),
      hint({/* top-level grouping */ title: 'Use the available time better',
        subTitle: `efficiency, focus, organisation, tools, skills, etc.`,
        ifYes: [
          hintBridge({
            title: `Optimize sleep to use your time better`,
            ifYes: [
              this['Have good sleep'],
            ],
          }),
          hint({title: `Get better at doing things`,
            searchTerms: [`execute tasks better`, `get more skilled`],
            titleSuffix: IN_GENERAL,
            ifYes: [
              this['Learning and remembering things'],
              hint(`Do Katas to practice given skill`),
              hint({
                title: 'Delegate',
                ifYes: [
                  hint(`Spend enough time assigning/coordinating/checking work of other people, knowing it will pay off, whereas neglecting it will have negative consequences in morale/quality/quantity of work.`),
                  hint(`Be careful to not over-delegate.`)
                ]
              }),
              hint({
                title: `Reach a state of Flow`,
                ifYes: [
                  hint({ title: `Maintain the right level of arousal.`,
                    subTitle: `Not too high, not too low.`
                  }),
                  hint({ title: `Pick tasks that are the right difficulty level`,
                    subTitle: `They should be exciting. Too high difficulty, and they will be overwhelming. Too low difficulty and they will be boring.`
                  })
                ]
              }),
              hint(`Sustained relaxed focus`),
              hint(`Avoid mental blocks`),
              hint(`Work from a list`),
              hint({ title: `Use the best tool for the job.`}),
            ],
          }),
          this['Planning (in general)'],
          hint({ title: `Let focus on results (ends) guide You, instead of dwelling on means or problems.`}),
        ]
      }),
      hint(`Clarity`),
    ]
  })

  'Solving problems' = hint({
    searchTerms: [`solve problems`, `dealing with problems`, `i have a problem`, `troubleshooting`, `troubleshoot`, `problem with`],
    ifYes: [
      hint({title: `Look for different types of [what appears to be] the same problem`,
        subTitle: `Sometimes they look similar but have very different causes and require very different solutions. Don't lump them together.`
      }),
      hint(`Thinking is a skill too`),
      hint('Use lateral thinking'),
      hint(`Take time to think!`),
      hint(`Thinking on paper`),
      hint({title: `Explain your problem to someone (or something, like a Rubber Duck Technique)`,
        subTitle: `By explaining it, You will understand it better and You will get new ideas and insights and sometimes even the solution pops right in your mind`,
      }),
      hint('Try to see the problem in a broader context (think holistically), avoid tunnel vision; perhaps the real/root problems are somewhere else and/or I\'m using incorrect reference point in judging the situation'),
      hint('Look for root-causes (root cause analysis); use the N-whys technique.'),
      hint('Watch out for false assumptions which make you miss the actual cause of the problem'),
      hint({title: `Do You think You are the only person that has this problem?`,
        subTitle: `There is a big chance many other people had the same or similar problem (but sometimes our ego makes us think that we are the only person, special, who has this problem).`,
        textBody: `So search online, ask other people, etc, and the solution (or hints) might be right at hand.`,
      })
    ]
  })


  'Software Development' = hint({
    ifYes: [
      hint({
        title: `Software design`,
        ifYes: [
          this['Prioritizing'],
        ],
      }),
      problem({
        title: `Programming when having trouble thinking/focusing (e.g. sleepy / not had enough sleep / hangover / distractions / mental fog etc)`,
        comments: `(Example of something that is on intersection of multiple aspects; this could be taken from search keywords).`,
        ifYes: [
          hint(`Focus on things that improve confidence, e.g. writing tests or working in areas with good test coverage, to not introduce more bugs.`),
          hint(`Make sure changes are committed, to not make a mess.`),
        ]
      }),
      hint({
        title: `Debugging`,
        ifYes: [
          this['Solving problems']
        ]
      }),

      hint({ text: `Assess quality / popularity of given project/library/program`,
        ifYes: [
          hint(`Use https://bestofjs.org/projects/testcafe`),
          hint(`Use StackShare`),
        ]
      }),
      hint({
        text: 'Be faster at programming',
        ifYes: [
          hint({
            title: `Get faster at navigating to the desired place`,
            ifYes: [
              hint('Use IDE/editor navigation history; back/forward'),
              hint('Use keyboard shortcut to get to matching brace (^M)'),
              hint({
                title: `Instead of manually navigating to places (time & energy consuming), use search functions`,
                subTitle: `Global find, navigate to class/file/symbol`,
              })
            ]
          }),
        ]
      }),
    ]
  })


  'Dealing with other people' = hint({
    ifYes: [
      hint({
        text: 'Watch out for triggering other people\'s "status threat"',
        when: '2018-10-06 22:46',
      }),
      hint({
        text: 'Allocate effort on bonding and team-building between people, before diving into work (work which might trigger tensions between people)',
        example: 'play games together; example: odkrywanki; '
      }),
      hint({
        title: `Seek to understand before being understood`,
      }),
      hint({
        title: `Listen before wanting to be listened to.`,
      }),
      hint({
        text: `Be a good listener`,
        ifYes: [
          hint(`Avoid interrupting`),
        ]
      }),
      hint({
        title: `Balance between being nice to other people and challenging them`,
        subTitle: `Radical candor, Ruinous empathy, obnoxious aggression, manipulative insincerity`
      }),
      hint({
        title: `Praise in public, criticise in private`,
      })
    ]
  })

  'Meeting People' = hint({
    ifYes: [
      this['Dealing with other people'],
    ]
  })

  'Making presentations' = hint({
    ifYes: [

    ]
  })

  'Changing/improving yourself (neuroplasticity?)' = hint({
    ifYes: [
      hint({
        text: 'Changing/improving yourself requires attention (mindfulness?) ',
        source: '"Your Brain At Work" audiobook'
      }),
    ]
  })

  'Guilt-free entertainment (fun)' = hint({
    ifYes: [
      hint(`allocate time for entertainment`),
      hint(`first do dinner before desert`),
      hint(`try przyjemne z pożytecznym so that You dont feel guilty`),
      hint(`do not sacrifice other things to do entertainment`),
      hint(`Maintain a list of fun-yet-useful activities You can do` /* e.g. my list-tree of such activities in OrYoL 2020-04-03, 05:59*/),
    ],
  })

  'Managing gratification' = hint({
    ifYes: [
      hint('Take gratification from little things. E.g. nicely executing tasks (good effort but don not rely on good outcomes, which are often not under our control) or everyday things'),
      hint('Take gratification from self-improvement'),
      hint('Take gratification from contemplation, getting insights, understanding things better'),
      hint('Take gratification from having freedom, free will, existing in the world and being able to observe, explore and contemplate it.'),
      hint('Take gratification from finishing tasks and making improvements'),
      hint('Take gratification from learning new things and strengthening previous knowledge'),
      hint('Take gratification from being/becoming well-organized, ready, prepared, clean'),
      hint(`Managing your dopamine levels/"calibration"`),
      this['Guilt-free entertainment (fun)'],
    ]
  })

  /** Things that apply everywhere (will probably have the app display that everywhere later) */
  'General' = hint({

    /*
    * Stuff that probably applies to everything:
    * - habits
    * - solve problems
    * - thinking
    * - discipline -> motivation
    * - effectiveness -> efficiency
    * - decisions
    * - optimizations
    * */
    ifYes: [
      hint({
        text: 'Build good *habits*/routines and eliminate/modify bad habits. Habits let you do things better while making them automatic, thus reducing energy/focus consumption',
        ifYes: [
          hint('For motivation about working on habits: treat habits (which can feel boring sometimes) as BUILDING BLOCKS to build bigger and more exciting things'),
          hint(`Don't worry about having "too many" habits. Once they settle as entrenched habits, They become automatic and thus don't require effort.`),
        ]
      }),
      hint({title: `Remember, that most things in life are experiments.`,
        subTitle: `So, do not assume immediate success. Make educated guesses, try things out, observe, take note, analyze, improve, repeat. Patience. Accept possibility of failure, but don't worry about it too much. Enjoy the process of of the experiments, observations, gradual improvements, discoveries.`
      }),
      hint('Ask myself: have I bee in a similar situation before? What were the causes? What were the outcomes?'),
      hint({ text: `Patience` }),
      hint({ text: `Law of Cause and Effect (Sowing and Reaping)` }),
      hint(`Emotional Hygiene (TODO: put under feel good / mood)`),
      hint(`Persistence`),
      hint(`Law of indirect effort`),
    ]
  })

  'Build Momentum' = hint({
    ifYes: [
      hint('Fake it till you make it.'),
      hint('Use duct-tape/hacks if necessary to get unstuck from chicken&egg problems, etc.'),
    ]
  })

  'Use stepping stones' = hint()

  'Feeling Overwhelmed' = hint({
    searchTerms: [`overwhelm`, `overwhelm`, `too much to do`],
    ifYes: [
      this['Prioritizing'],
      // Choosing / satisficer not maximizer
      this['Build Momentum'],
      hint('Split things into smaller parts. Tackle one thing at a time. Swiss cheesing'),
      hint('Move things into buckets/inbox/todo (GTD)'),
      this['Use stepping stones'],
      hint({ text: `First apply quicker/cheaper workarounds`,
        comments: `Even if it costs money to apply the temporary workaround. \n` +
          `It will pay off in reduced overwhelm, reduced stress, steady progress without creating circular dependencies. \n` +
          `And You should not feel like You are *cheating* by taking a simplified route. It's an optimization.`,
        examples: [
          `Buying a protective case for Galaxy Note 9 instead of going and spending extra time and money on new phone while already having a big backlog`,
        ]
      }),
    ]
  })


  'Resolve internal conflict' = hint({
    ifYes: [
      hint('Stop and reflect on Your values, based on past experiences and future plans/dreams, Ikigai.'),
      this['Use stepping stones'],
    ]
  })

  'Feeling Good | Feeling Bad (root?)' = hint({
    ifYes: [
      hint(`Internal locus of control`),
      hint({
        text: 'Happiness',
        ifYes: [
          hint('Progressive realization of a worthy goal'),
          hint(`Just solving problems and trying to stay safe and comfortable, won't make a great life or great happiness. Need to work towards worthy transcendent goals.`),
          hint('Remember that happiness cannot be a direct goal. Instead, it is a byproduct.'),
          hint(`Avoid Negativity, as it can spill into other areas. As for example "the weather is bad".`),
          hint(`Finishing tasks and projects (or just making a progress on them) can make You happy`),
          hint(`Improving Your surroundings/situation can make You happy.`),
        ]
      }),
      hint('Optimism (is the glass half-empty... TODO: reinterpretation, :when life gives You lemons)'),
      hint({
        text: 'Peace of mind'
      }),
      hint({
        text: 'Guilt free (part of peace of mind?) - dealing with feeling guilt',
        ifYes: [
          hint(`Doing good while doing well`),
        ]
      }),
      hint({
        text: 'Happiness is a choice',
        source: 'The ~100yr old guy interviewed, His greatest regret was about ... realising happiness is a choice',
      }),
      hint({
        text: 'Remember that wanting something else than is currently (as opposed to working toward changing stuff), leads to unhappiness',
      }),
      hint({
        text: 'To motivate to be more happy, remember, the Happiness Advantage',
        source: 'Happiness Advantage book',
      }),
    ]
  })

  Selling = hint({
    ifYes: [
      hint('With best salesmen it is not even apparent that they are selling'),
    ]
  })

  'Be a keen observer, which might help. But that does not mean to be a judgemental observer.' = hint()
  'Remember that it is as if we have two brains, two beings within us. The old brain: food, fighting, sex, limbic system... The new brain: higher values and cognition, relationships. So keep them both satisfied. Or dissatisfied equally? Their unifying goals are perhaps WTP, reproduction?' = hint()

  Regret = hint({
    // guilt
    ifYes: [
      hint(`Leave it behind. Take it as lessons learned, don\'t torture yourself`),
    ]
  })

  Cravings = problem({
    text: `Dealing with cravings / urges / temptations / addictions`,
    searchTerms: [`addicted`, `hooked on`, `crave`, `tempted`],
    titleSuffix: IN_GENERAL,
    ifYes: [
      hint(`Surfing the urge`),
      this['Managing gratification'],
      hint(`Realise that You can take pleasure from just sitting down / lying down and relaxing and calming and thinking / reflecting / visualising / dreaming without the need of binging on cravings`),
      hint(/* duplicate? */`Just relax and enjoy just being (as opposed to the tension created by the urge)`),
      hint(`Satisfy other instincts / cravings, e.g. creativity, hobbies, learning things`),
    ]
  })

  // Worry:
  // Frustrated
  // -> Reach a state of flow
  Frustrations = hint({
    title: `Dealing with frustrations / anger`,
    ifYes: [
      hint(`A person is as big as the things that can make the person angry/frustrated`),
    ]
  })
  //
  'Cravings for computer games' = hint({
    searchTerms: [`i crave want to play games tempted temptation`],
    ifYes: [
      this.Cravings,
      hint({ text: `Playing games in controlled way`,
        ifYes: [
          hint(`Do not start at too late hour, risking losing good sleep`),
          hint(`Consider playing one game and get really good at it to get a feeling of satisfaction which will help You at ending a given playing session`),
          hint({
            text: `Play/practice against computer opponents or play predefined missions`,
            comments: `From time to time You can play with human opponents, just to satisfy the craving and as a reality check of how good you are`,
            benefits: [
              `not get constantly defeated (which can cause You to want to play longer), by people who play much more than You`,
              `maximize quick feedback`,
              `have a better measurement of your skill improvement`,
              `be able to hone particular elements/skills of the game without risking wasting a match`,
              `avoid negative influence from addictive/toxic gamers`,
              `minimize time spent waiting for match to start, minimizing frustration, improving satisfaction`,
              `reduce dependence on good internet connection; minimizing frustration, improving satisfaction`,
              `Can choose whichever map and settings and number of opponents you like.`
            ]
          }),
        ]
      }),
      hint({title: 'Play the game that is life.',
        subTitle: `But prefer to play against previous versions of yourself, and/or against obstacles, over "playing against other players"'`}),
      hint({title: 'There are game-like aspects and tasks in all activities.',
        subTitle: `Use it to Your advantage to gradually replace your vices.`,
      }),
      hint(`Learn new things for excitement. The Excitement is double: 1. new things; 2. feeling like becoming a more skilled resourceful person. And don't be afraid to spend money & time on the new activities - as You would have spent money and time on your vices anyway, right?`),
      this['Make everyday real life more enjoyable'],
      hint(`Hide your gaming devices to stop them from tempting/distracting and to introduce a barrier of time/effort.`),
      hint(`Think how playing games is really an infinite chase down an infinite rabbit hole that is also a tar pit trap and fly paper of fake dopamine.`),
    ]

  })
  'Cravings for alcohol' = hint({
    searchTerms: [`crave beer`],
    ifYes: [
      this.Cravings,
      this['Make everyday real life more enjoyable'],
      hint('Get "drunk"/high on visions of what You can achieve and on striving towards it'),
    ]
  })

  'Bored / Boredom' = hint({
    searchTerms: [`burnout`, `burn-out`, `burn out`],
    ifYes: [
      hint({
        text: `Excitement`,
        ifYes: [
          hint({ text: 'Strive to expand your person; learn new skills, improve your conditions, meet new people. Examples: learning new language. Find new music, new artists, new albums, even new genres.',
            ifYes: [
              hint({ text: `Don't limit your thinking to your current job/industry. Think how after reaching a certain level, you can pivot/synergize onto other fields`,
                examples: [
                  `Elon Musk: Tesla, Solar City`,
                  `Steve Jobs: Mac -> iPhone, ...`,
                ]
              }),
            ]
          }),
          hint(`Re-kindle excitement for the thing that You are supposed to be doing right now.`),
          hint(`Re-kindle / revive things that were exciting to You in the past, e.g. old music / activities / games / friends / projects`),
          hint(`Have a bias towards excitement.`),
          hint(`Keep in mind hype cycle`),
        ]
      }),
    ]
  })

  'Feel bad' = hint({
    ifYes: [
      this['Guilt-free entertainment (fun)'],
      hint(`Progress on a worthwhile goal`),
    ]
  })

  'Annoyed / Irritable' = hint({
    searchTerms: [`feeling annoyed`, `things are is annoying`, 'irritated', 'irritating', 'irritates'],
    ifYes: [
      hint(`Avoid excessive caffeine, to not get too irritable`),
      hintBridge({
        title: `Optimize sleep to get less irritable`,
        ifYes: [
          this['Have good sleep'],
        ],
      }),
    ]
    /* Find something enjoyable where You can have internal locus of control; fitting ikigai; guilt-free entertainment */
  })

  'Acting stupid' = hint({
    searchTerms: [`wanna be smarter more clever, intelligent`],
    ifYes: [
      hint({title: `Breathing well`,
        ifYes: [
          hint({ title: `Make sure there isn't air trapped in the digestive system (e.g. esophagus)`,
            textBody: `Do exercises that bend legs towards the stomach.`,
          }),
        ]
      }),
      hint(`Avoid sugar spikes`),
      hint(`Exercise for highly oxygenated blood`),
    ]
  })

  'Overcome fear of failure' = hint({
    searchTerms: [`Worrying about failing`],
    ifYes: [
      hint(`Even if You fail, the journey makes You stronger, more resourceful and ready to try another time or pivot to something else.`),
      hint(`Failure is not so probable really, since You have been gathering skills, resources, contacts and personal qualities for a long time, ready to put them to good use.`),
      hint(`Realise, that You control the probability of success`),
      hint(`Get busy working towards ensuring success and preventing failure`),
      hint(`You have done similar things before, with success`),
    ],
  })


  'Build own business' = hint({
    searchTerms: [`my own company`],
    ifYes: [
      hint({ title: `Think like a business person!`,
        subTitle: `It requires as certain reprogramming of mindset. Need to get rid of habits of thought and action related to being an employee.`,
        ifYes: [
          hint({ title: `Watch / listen to interviews with business people.`,
            subTitle: `What made them succeed, what did they overcome.`,
          }),
        ],
      }),
      hint({ title: `Determination!`,
        subTitle: `Without determination You will not go far - you will get stuck in a kind of middle-zone limbo.`,
      }),
      hint(`Get feedback from trusted people, early and often`),
      hint({text: `Decide what kind of business You want - big / VC-funded / lifestyle / bootstrapped`,
        ifYes: [
          hint(`Decide how many hours per week/day/mont You would like to spend working: 1. in the initial growth period; 2. as a target`),
          hint(`Decide if You would like to hire employees/freelancers and how many; depends on your introversion/extroversion level and how much You like/dislike dealing with people`),
        ]
      }),
      hint(`Remember, that You might need/want to pivot`),
      this['Productivity'],
      this['Being healthy at office job/computer work'],
      hint({ text: `Maintain motivation for building a business`  /* progress, momentum */,
        ifYes: [
          hint({ text: `Overcome fears of making Your own business`,
            ifYes: [
              hint(`Remember that beginnings are often humble and crummy and with failure`),
            ]
          }),
          hint({ title: `Put your "entrepreneur hat and glasses" on`,
            textBody: `Think, act, and see the world as an entrepreneur. You might want the same things as other people, like peace, prosperity, health, but you might see it different about how they should be achieved. Inspired by "Zero to One" audiobook.`
          }),
          this.Motivation,
          hint({ text: `Building a business is one of superior outcomes in life and becoming a better person in the process.` }),
          hint({ text: `Think of all the great connections You can make while developing the business.`}),
          hint({ text: `Remove / get done with nagging loose ends which create a conflict between working on the business or working/worrying about them`}),
          hint({ text: `Weave in some nice visual improvements/changes to rekindle motivation for the project via the limbic system.`}),
          hint({text: `Weave in attractive/exciting aspects, like using new tools and learning things along the way. But prefer relatively low-hanging less-risky things, to not jeopardize the business`,
            examples: [
              `Elm (learning about the language is ok, to use as inspiration; but using the language is too far fetched)`,
              `TypeScript 3.7.1-rc in Ionic too far-fetched; but maybe strictNullChecks is ok`,
            ]
          }),
          hint({ text: `Imagine thousands/millions of people using your product or service and getting value out of it and paying you.`
          }),
        ],
      }),
      hint({
        title: `Overcome fear of success.`,
      }),
      /* Fear of wasting time / failing: remember there will be activities that You like and are proud of; e.g. programming, designing apps */
      hint({title: `Don't worry as much about chasing the latest and greatest technologies`,
        subTitle: `... because You will hardly release anything. Focus on value for users and, building working prototypes, and on releaseable version.`,
      }),
      hint(`At first, skip certain details that can be defined later.`),
      hint({title: `Release / publish your product`,
        ifYes: [
          this['Overcome fear of failure'],
        ]
      }),
    ]
  })

  'Avoid over-eating / binge eating' = hint({
    ifYes: [
      hint('Avoid thinking stressful thoughts while eating'),
      hint(`Eat slowly to let the brain register that it has had enough food. Allocate e.g. 10 minutes for the eating process.`),
      hint(`Pre-prepare portions of given size, to draw a line.`),
    ]
  })

  'Reduce calories consumption' = hint({
    ifYes: [
      this['Avoid over-eating / binge eating'],
      hint('Drink water while at the computer, instead of juice'),
    ]

  })

  'Deal with food #cravings / overeating / snacking' = problem({
    ifYes: [
      this.Cravings,
      this['Avoid over-eating / binge eating'],
      hint(`Brush teeth to signal that eating is over and reduce temptation.`),
      hint(`#Visualise #Consequences: - being fat (bad self esteem, not attractive to opposite sex), impaired thinking from sugar spikes, spending a lot of money, spending too much time on the toilet.`),
      hint(`Sleep well to reduce craving for food`),
      hint(`Avoid alcohol`),
      hint(`Get occupied with something else`),
      hint(`Eat healthy snacks, like carrots, non-fried nuts`),
    ]
  })

  'Worry / anxiety' = problem({
    searchTerms: ['worried', `worrying too much`, `anxious`],
    ifYes: [
      hint(`Purposeful action is a way to cure worry. Just the act of taking action pushes out worry thought.` +
        `And results of these actions have big probability of reducing/eliminating the worry situation.`),
      this['Low-information diet'],
      hint(`«I'm an old man and have known many troubles - most of which never happened.»`),
    ]
  })

  'Health / Sick' = problem({
    ifYes: [
      hint(`Drink a lot of water`),
      hint({ text: `Exercise / Sports`,
        ifYes: [
          hint({ text: `Don't have time / energy / money for exercises / sports / gymnasium`,
            ifYes: [
              hint(`Consider home exercises, like vertical push-ups, lifting water bottles`),
              hint(`Consider using exercise equipment in public spaces`),
              hint(`Consider fast walking.`),
              hint(`Consider walking up-hill / up stairs`),
            ]
          }),
        ]
      }),
      hintBridge({ text: `Having good sleep prevents making poor decisions related to health`,
        benefits: [
          `reduces overeating`,
        ],
        ifYes: [
          this['Have good sleep'],
        ]
      })
    ]
  })

  'Get more freedom' = problem({
    ifYes: [
      hint({text: `[linker] Discipline (a bit counter-intuitively) gives You more freedom, by allowing You to deal more effectively with things that You have to do, leaving You more time / energy to do things which You really want to do, while making you better at those things as well`,
        ifYes: [
          this['Discipline'],
        ]
      }),
      this['Build own business'],
    ]
  })

  'Dealing with, solving, problems' = problem({
    titleSuffix: IN_GENERAL,
    ifYes: [
      hint(`Accept or overcome`),
      hint({ text: `You might or might not be responsible for the problem occurring but You are responsible on how you handle it`,
        comments: `"The problem... is not the problem. The problem is our approach to the problem"`,
      })
    ]
  })

  'Being / feeling out of control' = problem({
    ifYes: [
      hint(`Mindfulness (meditation) to increase self-control and prevent "headless chicken autopilot mode"`),
      this['Discipline'],
      hint(`TODO: unbalanced`),
    ]
  })

  'Procrastination' = problem({
    searchTerms: [`procrastinating`, `procrastinate`, `lazy`, `laziness`, `don't feel like doing anything`, `avoiding`, `can't get myself to do it`],
    /*  search keywords: 'nie chce mi się, no tengo ganas;' */
    ifYes: [
      hint({title: `Get EXCITED for what you want to do!`,
        subTitle: `and procrastination will disappear!`
      }),
      hint({ title: `Estimate the real cost of time and money, and you might find it's actually quite low.`,
        subTitle: `To have a more a rational view than the "emotional cost that is causing the procrastination".`}),
      this['Motivation'],
      hint(`Consider and visualise the positive and negative consequences of doing and not doing the thing You should do. Focus on the positive, to keep dopamine level up.`),
      hint({ title: `Overcoming procrastination for a given activity, could be a task on its own.`, subTitle: `So feel free to allocate&spend time, energy, money on it ` }),
      hint({ title: `It's okay to ask why`, subTitle: `But don't ask "why" too many times`}),
      hint({ title: `<b>Trick yourself into starting the activity</b>, by starting and "doing it just for a few minutes"`,
        subTitle: `Often You will get hooked and will continue doing the activity to get to completion.`}),
      hint(`Think "I will get this done, and I will never have to deal with this again (ever or for certain period)`),
      hint(`Think of the experience and self-esteem gained`),
    ]
  })

  'Organising things (e.g. at home)' = problem({
    ifYes: [
      hint(`First split the day-to-day things that you will really need in the coming days, from the someday-maybe / undecided / unordered things.`),
      hint({ text: `Put related things together`,
        benefits: [
          `See how much space a given category of things really takes.`,
          `Detect duplicates or redundancies / excess`,
          `Make it easier to find things, via close "psychological distance"`,
          `Make it easier to analyze if we really have everything we need; to take an inventory of what we have.`,
          `General feeling of order`,
        ]
      })
    ]
  })

  'Negotiating contracts' = problem({
    ifYes: [
      hint({ text: `Negotiate remote work`,
        ifYes: [
          hint(`Use any of your situation for arguing for remote work (can be partial at first) : health, family situation, experience, life values`),
          hint(`First negotiate / ask for a bit of remote work, e.g. for specific periods or certain number of days per week/month, later to be expanded once confidence grows.`),
        ]
      }),
      hint(`Check, and try to put a time limit on, non-compete / non-solicitation clauses.`),
      hint({ text: `If the client/employer is not giving a quick decision or is complaining about "too expensive", to "help them make the decision", give a deadline with sub-deadlines, surpassing which would result in You getting out of the talks completely.`
        /* If any of those things fail to happen, I might be out completely to free my time and focus:
          - some concrete info from You&Ana by Sunday afternoon
          - some concrete progress mid-Monday
          - final decision, first 50% transfer confirmation by end of Monday */
      })
    ]
  })

  'Start the day well' = hint({
    ifYes: [
      this['Getting up from sleep/bed'],
      hint({ text: `Build a good routine at the start of the day`,
        ifYes: [
          hint(`Wash your face and even neck with cold water to awaken fully.`),
          hint({title: `Do exercises at the beginning of the day`,
            subTitle: `to get oxygenated blood and feeling of control and momentum`
          }),
          hint({ text: `Plan the day`,
            ifYes: [
              this['Planning a day'],
            ]
          }),
        ]
      }),
    ]
  })

  'Self-improvement and personal transformation (become better)' = problem({
    searchTerms: [`growth`, `grow as a person`],
    subTitle: `Positive personal change. Changing for the better.`,
    ifYes: [
      hint({
        title: `We are what we most think about`,
        subTitle: `So take care to control Your thoughts`,
        ifYes: [
          hint({
            title: `Control your surroundings to maximize desired thoughts and minimize undesired thoughts`,
            subTitle: `Keep your thoughts focused on the right things`,
            ifYes: [
              hint({

              }),
            ]
          })
        ]
      }),
      hint(`Step out of your comfort zone.`),
      hint(`Mindfulness`),
      hint(`Allocate and spend time on self-improvement`),
      hint({
        title: `Maintain a journal / diary`,
        ifYes: [
          hint({
            title: `Consider writing the journal in third-person`,
            sources: [
              new HintSource(`https://www.psychologytoday.com/us/blog/the-novel-perspective/201506/fooling-your-ego`),
            ]
          })
        ],
      }),
      hint(`When you get an idea or epiphany, take a moment to acknowledge it, reflect on it, internalize it, let it sink in.`),
      hint(`Cultivate Your Epiphanies`),
      hint(`Actively look for positive/negative patterns that occur in Your life, Your behaviour.`),
      hint({ title: `When You are becoming better than average, don't be afraid of becoming a bit different from most people.`,
        subTitle: `Don't be afraid to be a bit in your own (positive) bubble.`
      }),
      hint(`Work on Yourself at least as hard as on your work.`),
      hint({
        title: `Acknowledge that some outcomes in life are better than others`,
      }),
    ]
  })

  'Dealing with jealousy / envy' = problem({
    ifYes: [
      hint(`Either decide to not want the given thing, or say to yourself that one day you will obtain the given thing / quality / situation (in which case the envy is motivating). Instead of hating the person. (special case of accept or overcome)`),
    ]
  })

  'How to not get bored at home (Coronavirus quarantine)' = wish({} /* TODO */)

  /* Root */
  'Have a great life (root)' = problem({
    subTitle: `Live a great life. Live a great way`,
    ifYes: [
      hint({
        text: `Balance`
      })
    ]
  })

  'Excessive Perfectionism' = problem({
    ifYes: [
      hint(`Done is better than perfect`),
      hint(`Think how many products are making money while not being perfect`),
      hint(`You can improve it after launch.`),
      hint(`If users find a bug, it's not the end of the world; it happens`),
      hint(`Users might not have as much attention to detail as You. They might ignore or not notice a given shortcoming.`),
    ]
  })

  'Impostor Syndrome' = problem({
    ifYes: [
      hint(`Remember that the more we know, the more we know we don't know`),
      hint({title: `People are paying You money and then praise Your useful work?`,
        subTitle: `Means You are doing a good job in the market, and You are not an impostor. While of course You (and anyone) can always still get better, which is natural.`
      }),
    ]
  })

  // coasting
  // chaos
  // negotiation
  // persuasion

  /* CoViOb 2 policies vs Lifedvisor:
    - Coviob 2:
    . - has more personal epiphanies, etc. + timestamps for context (although somewhat repetitive and chaotic)
    - Lifedvisor:
    . - has more generic things and in process of productizing and organizing it
    . - works on mobile
   */


  'Get Rich' = wish({
    searchTerms: ['improve financials finances financially', 'get out of poverty', 'not being poor', 'get more money', 'become wealthy', `wealth`, `poor`, `poverty` ],
    ifYes: [
      hint({
        title: `Determine what rich means for You`,
        subTitle: `Try to be more specific. And it's not only about money.`
      }),
      hint({title: `Earn more money`,
        ifYes: [
          hint(`You can *learn* more to *earn* more`),
        ]
      }),
    ]
  })

  'How to live' /* root? */ = wish({
    ifYes: [
      question({
        title: `What to do in life?`,
        searchTerms: [`Decide What should I do with my life`],
        ifYes: [
          this['Use Ikigai'],
        ]
      })
    ]
  })

  'Craving / temptation to watch movies / documentaries' = wish({
    ifYes: [
        hint(`Create Your own interesting movie - your life story`),
    ]
  })

  'Making better videos' = wish({
    ifYes: [
      hint({
        title: `Keep in mind that the front (selfie) might have lower resolution and might not have auto-focus`,
      }),
    ]
  })

  'Computer slow / overheating' = wish({
    ifYes: [
      hint({
        title: `Check Browser's task manager for CPU/memory usage`,
        subTitle: `Chrome: Window → Task Manager`
      }),
    ]
  })

  'Life meaning / purpose' = wish()

  'Feeling good in the moment' = wish({
    ifYes: [
      hint(`Get “runner's high” (endorphins)`)
      /* guilt free entertainment */
    ]
  })

  'Feeling blocked (stuck)' = wish({
    searchTerms: [`problem`, `no way out`],
    ifYes: [
      hint(`Watch out for learned helplessness`)
    ]
  })

  'Dealing with allergies' = wish({
    ifYes: [
      hint(`Wash the area around your eyes, including eye lashes and eyebrows, to reduce allergens getting into the eyes, and reduce eye itching`)
    ]
  })

  'Mood swings / neuroticism' = problem({
    ifYes: [
      hint(`emotional hygiene (TODO de-duplicate)`)
    ]
  })

  'I keep slipping back / making the same mistakes / losing habits' = problem({
    ifYes: [
      hint(`Use spaced repetition system to learn and entrench and (wpoić)` /* FIXME reword */),
      /* to prevent it from being boring, use different visual themes */
    ]
  })

}

