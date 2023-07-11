const problems = {
  x: {
    text: 'I go to sleep late',
    questions: {
      'Are you preparing stuff to be ready to go to sleep easily, e.g. making your bed?': {},
      'Are you trying to do too much in one day/evening/night?': {},
      'Are you addicted to computer/internet?': {
        /* here reference */
        /* those strong-yes/ strong-no answers can be useful for determining other things, but be careful of privacy / data retention */
      }
    },
    hints: {
      'Visualize the benefits of going to sleep earlier:': {
        /* add your own comments and examples: (e.g. be able to go to beach volleyball more)
        - first as textarea / rich-text; later as separate items which user can rate individually
        * */
      },
      'Visualize disadvantages of going to sleep late:': {

      },
      'Visualize yourself doing it. How, when.': {

      }
    }
  },
  "I don't have enough time": {
    questions: {
      'Are You procrastinating?': {
        questions: {
          "How high is Your motivation level?": {

          }
        }
      },
    }
  },
  "I have trouble staying focused; I get easily distracted": {
    questions: {
      'Motivation_Level': {/* ref */},
      /* "Do You enter Flow state [explain] ?" */
      'Are You procrastinating?': {
        questions: {
          "How high is Your motivation level?": {

          }
        }
      },
    }
  },
  "Life feels pointless": {
    /* distinguish between depression and needing to comtemplate to find something useful */
  },
  "I struggle with self-control": {
    questions: {
      'are you motivated to achieve higher self-control?': {}
    }
  },
  "I don't know what to do in life": {
    questions: {
      "Do You feel low energy?": {}
    },
    hints: {
      'Have You looked at Ikigai?': {},
    }
  },
  "I feel sad": {
    /* have u experienced some negative event recently? */
    /* have u experienced some negative event long ago? ---> getting over, gannysacking, forgiving */
    /* are you currently experiencing something negative? */
  },

  y: {
    text: 'My code is a mess',
    questions: {
      'Are You afraid to make refactors?': {
        questions: {
          'Do You have tests?': {},
        }
      }
    }
  }
}



// Now, this stuff can be asked & replied by ChatGPT - but this app brings it into spaced-repetition, journal and habit tracking, quantified-self.

// + cool diagrams like ikigai, hype cycle, etc., which is smth visual I love & SVG & even animated (if only colors/shining/dotted-lines-flow)
