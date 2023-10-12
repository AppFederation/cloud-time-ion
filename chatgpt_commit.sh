#!/bin/bash

# Package update
git add 'package.json'
git commit -m 'ChatGPTCommit: Added @rx-angular/import-graph-visualizer to package.json'

# Update learn-do.service.ts for imports and method signature
git add 'src/app/apps/Learn/core/learn-do.service.ts'
git commit -m 'ChatGPTCommit: Updated imports and method signature in learn-do.service.ts'

# Refactor sidesDefs.ts to use nullish coalescing
git add 'src/app/apps/Learn/core/sidesDefs.ts'
git commit -m 'ChatGPTCommit: Refactored sidesDefs.ts to use nullish coalescing'

# Update LearnItem model with a new property and a TODO
git add 'src/app/apps/Learn/models/LearnItem.ts'
git commit -m 'ChatGPTCommit: Added hideAncestorsInQuiz property and a TODO in LearnItem model'

# Update quiz-item-details.component.html to conditionally show breadcrumbs
git add 'src/app/apps/Learn/quiz/quiz-item-details/quiz-item-details.component.html'
git commit -m 'ChatGPTCommit: Conditionally display breadcrumbs based on hideAncestorsInQuiz in quiz-item-details'

# Update max value in quiz-diligence-level.component.html
git add 'src/app/apps/Learn/quiz/quiz-options/quiz-diligence-level/quiz-diligence-level.component.html'
git commit -m 'ChatGPTCommit: Updated max value in quiz-diligence-level.component'

# Adjust self rating in quiz-intervals.component.ts
git add 'src/app/apps/Learn/quiz/quiz-options/quiz-intervals/quiz-intervals.component.ts'
git commit -m 'ChatGPTCommit: Adjusted self rating in quiz-intervals.component'

# Update button label and add icon in show-answer-and-rate.component.html
git add 'src/app/apps/Learn/quiz/show-answer-and-rate/show-answer-and-rate.component.html'
git commit -m 'ChatGPTCommit: Updated button label and added forward icon in show-answer-and-rate component'
