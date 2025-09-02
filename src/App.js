import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const questionDatabase = [
  {
    id: 1,
    type: 'multiple-choice',
    subject: 'math',
    difficulty: 'easy',
    question: 'What is 2 + 2?',
    options: ['3', '4', '5', '6'],
    correctAnswer: '4',
    explanation: 'Adding 2 and 2 gives us 4. This is one of the basic arithmetic operations.',
    hints: ['Think about counting 2 objects and then 2 more', 'What number comes after 3?']
  },
  {
    id: 2,
    type: 'multiple-choice',
    subject: 'science',
    difficulty: 'easy',
    question: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswer: 'Mars',
    explanation: 'Mars is called the Red Planet because of its reddish appearance, which is due to iron oxide (rust) on its surface.',
    hints: ['It\'s the fourth planet from the Sun', 'It has two moons named Phobos and Deimos']
  },
  {
    id: 3,
    type: 'fill-blank',
    subject: 'math',
    difficulty: 'easy',
    question: 'The square root of 25 is ____.',
    correctAnswer: '5',
    explanation: 'The square root of a number is a value that, when multiplied by itself, gives the original number. 5 × 5 = 25.',
    hints: ['Think about what number multiplied by itself equals 25', 'It\'s a single digit number']
  },
  {
    id: 4,
    type: 'fill-blank',
    subject: 'science',
    difficulty: 'medium',
    question: 'The chemical symbol for gold is ____.',
    correctAnswer: 'Au',
    explanation: 'The chemical symbol for gold is Au, derived from the Latin word "aurum" which means gold.',
    hints: ['It comes from the Latin word "aurum"', 'It\'s a two-letter symbol starting with A']
  },
  {
    id: 5,
    type: 'matching',
    subject: 'history',
    difficulty: 'medium',
    question: 'Match the historical figures with their accomplishments:',
    leftColumn: ['George Washington', 'Thomas Edison', 'Marie Curie', 'Leonardo da Vinci'],
    rightColumn: ['First US President', 'Invented the light bulb', 'Pioneered radioactivity research', 'Painted the Mona Lisa'],
    correctMatches: {
      'George Washington': 'First US President',
      'Thomas Edison': 'Invented the light bulb',
      'Marie Curie': 'Pioneered radioactivity research',
      'Leonardo da Vinci': 'Painted the Mona Lisa'
    },
    explanation: 'George Washington was the first US President, Thomas Edison invented the light bulb, Marie Curie pioneered radioactivity research, and Leonardo da Vinci painted the Mona Lisa.',
    hints: ['Think about what each person is most famous for', 'Consider the time period each person lived in']
  },
  {
    id: 6,
    type: 'drag-drop',
    subject: 'geography',
    difficulty: 'medium',
    question: 'Drag the countries to their correct continents:',
    items: ['Brazil', 'Egypt', 'Japan', 'Canada'],
    categories: ['South America', 'Africa', 'Asia', 'North America'],
    correctPairs: {
      'Brazil': 'South America',
      'Egypt': 'Africa',
      'Japan': 'Asia',
      'Canada': 'North America'
    },
    explanation: 'Brazil is in South America, Egypt is in Africa, Japan is in Asia, and Canada is in North America.',
    hints: ['Think about where each country is located on the world map', 'Consider the hemispheres each country is in']
  },
  {
    id: 7,
    type: 'true-false',
    subject: 'science',
    difficulty: 'easy',
    question: 'The Earth is the largest planet in our solar system.',
    correctAnswer: 'false',
    explanation: 'Jupiter is the largest planet in our solar system. The Earth is the fifth largest planet.',
    hints: ['Think about the relative sizes of planets', 'Jupiter is much larger than Earth']
  },
  {
    id: 8,
    type: 'multiple-answer',
    subject: 'math',
    difficulty: 'medium',
    question: 'Which of the following are prime numbers?',
    options: ['2', '4', '5', '9', '11'],
    correctAnswers: ['2', '5', '11'],
    explanation: 'Prime numbers are numbers greater than 1 that have no positive divisors other than 1 and themselves. 2, 5, and 11 are prime numbers. 4 and 9 are not prime (4 is divisible by 2, 9 is divisible by 3).',
    hints: ['A prime number has exactly two distinct divisors: 1 and itself', 'Even numbers greater than 2 are not prime']
  },
  {
    id: 9,
    type: 'multiple-choice',
    subject: 'math',
    difficulty: 'medium',
    question: 'Solve for x: 2x + 5 = 13',
    options: ['4', '5', '6', '7'],
    correctAnswer: '4',
    explanation: 'To solve for x, subtract 5 from both sides and then divide by 2.',
    hints: ['Isolate the variable term', 'Perform inverse operations'],
    stepByStepSolution: [
      { step: 1, description: 'Start with the equation: 2x + 5 = 13' },
      { step: 2, description: 'Subtract 5 from both sides: 2x + 5 - 5 = 13 - 5' },
      { step: 3, description: 'Simplify: 2x = 8' },
      { step: 4, description: 'Divide both sides by 2: 2x/2 = 8/2' },
      { step: 5, description: 'Simplify: x = 4' }
    ]
  },
  {
    id: 10,
    type: 'multiple-choice',
    subject: 'science',
    difficulty: 'medium',
    question: 'What is the chemical formula for water?',
    options: ['H2O', 'CO2', 'NaCl', 'O2'],
    correctAnswer: 'H2O',
    explanation: 'Water is composed of two hydrogen atoms and one oxygen atom.',
    hints: ['Think about the composition of water', 'It has two elements'],
    stepByStepSolution: [
      { step: 1, description: 'Water is a compound made of hydrogen and oxygen' },
      { step: 2, description: 'Hydrogen has a valency of 1' },
      { step: 3, description: 'Oxygen has a valency of 2' },
      { step: 4, description: 'To balance the valencies, we need two hydrogen atoms for each oxygen atom' },
      { step: 5, description: 'Thus, the chemical formula is H₂O' }
    ]
  }
];

const subjectsConfig = {
  math: {
    name: 'Mathematics',
    color: '#4b6cb7',
    icon: '∫',
    gradient: 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)'
  },
  science: {
    name: 'Science',
    color: '#2a9d8f',
    icon: '🔬',
    gradient: 'linear-gradient(135deg, #2a9d8f 0%, #1d4e4a 100%)'
  },
  history: {
    name: 'History',
    color: '#e76f51',
    icon: '📜',
    gradient: 'linear-gradient(135deg, #e76f51 0%, #8c4332 100%)'
  },
  geography: {
    name: 'Geography',
    color: '#f4a261',
    icon: '🌎',
    gradient: 'linear-gradient(135deg, #f4a261 0%, #c67c3f 100%)'
  },
  mixed: {
    name: 'Mixed Subjects',
    color: '#9b5de5',
    icon: '🔀',
    gradient: 'linear-gradient(135deg, #9b5de5 0%, #5a2fa6 100%)'
  }
};

const questionTypes = {
  'multiple-choice': {
    name: 'Multiple Choice',
    icon: '☑️'
  },
  'fill-blank': {
    name: 'Fill in the Blank',
    icon: '📝'
  },
  'matching': {
    name: 'Matching',
    icon: '↔️'
  },
  'drag-drop': {
    name: 'Drag and Drop',
    icon: '↔️'
  },
  'true-false': {
    name: 'True/False',
    icon: '✅❌'
  },
  'multiple-answer': {
    name: 'Multiple Answer',
    icon: '☑️☑️'
  }
};

const XP_CONFIG = {
  BASE_XP: {
    easy: 10,
    medium: 20,
    hard: 30
  },
  STREAK_MULTIPLIER: {
    3: 1.2,
    5: 1.5,
    10: 2.0
  },
  TIME_BONUS: 5, 
  PERFECT_ANSWER_BONUS: 10, 
  SUBJECT_MASTERY: {
    threshold: 1000, 
    bonus: 100 
  },
  LEVELS: [
    { level: 1, xpRequired: 0, title: 'Beginner' },
    { level: 2, xpRequired: 100, title: 'Novice' },
    { level: 3, xpRequired: 300, title: 'Apprentice' },
    { level: 4, xpRequired: 600, title: 'Student' },
    { level: 5, xpRequired: 1000, title: 'Scholar' },
    { level: 6, xpRequired: 1500, title: 'Adept' },
    { level: 7, xpRequired: 2100, title: 'Expert' },
    { level: 8, xpRequired: 2800, title: 'Master' },
    { level: 9, xpRequired: 3600, title: 'Grand Master' },
    { level: 10, xpRequired: 4500, title: 'Legend' }
  ]
};

const LEVEL_CONFIG = {
  LEVELS: [
    { level: 1, xpRequired: 0, title: 'Beginner', badge: '🌱', color: '#9e9e9e' },
    { level: 2, xpRequired: 100, title: 'Novice', badge: '📚', color: '#795548' },
    { level: 3, xpRequired: 300, title: 'Apprentice', badge: '🎓', color: '#607d8b' },
    { level: 4, xpRequired: 600, title: 'Student', badge: '📝', color: '#3f51b5' },
    { level: 5, xpRequired: 1000, title: 'Scholar', badge: '🔍', color: '#2196f3' },
    { level: 6, xpRequired: 1500, title: 'Adept', badge: '💡', color: '#009688' },
    { level: 7, xpRequired: 2100, title: 'Expert', badge: '🌟', color: '#4caf50' },
    { level: 8, xpRequired: 2800, title: 'Master', badge: '🏆', color: '#ff9800' },
    { level: 9, xpRequired: 3600, title: 'Grand Master', badge: '👑', color: '#ff5722' },
    { level: 10, xpRequired: 4500, title: 'Legend', badge: '⚡', color: '#f44336' },
    { level: 11, xpRequired: 5500, title: 'Sage', badge: '🧠', color: '#9c27b0' },
    { level: 12, xpRequired: 6600, title: 'Oracle', badge: '🔮', color: '#673ab7' },
    { level: 13, xpRequired: 7800, title: 'Genius', badge: '💎', color: '#00bcd4' },
    { level: 14, xpRequired: 9100, title: 'Polymath', badge: '🎯', color: '#cddc39' },
    { level: 15, xpRequired: 10500, title: 'Prodigy', badge: '🚀', color: '#ffeb3b' }
  ],
  BADGES: {
    
    mathMaster: { id: 'mathMaster', name: 'Math Whiz', icon: '∫', description: 'Master Mathematics', color: '#4b6cb7' },
    scienceMaster: { id: 'scienceMaster', name: 'Science Wizard', icon: '🔬', description: 'Master Science', color: '#2a9d8f' },
    historyMaster: { id: 'historyMaster', name: 'History Buff', icon: '📜', description: 'Master History', color: '#e76f51' },
    geographyMaster: { id: 'geographyMaster', name: 'Geography Expert', icon: '🌎', description: 'Master Geography', color: '#f4a261' },
    
    
    multipleChoiceExpert: { id: 'multipleChoiceExpert', name: 'Multiple Choice Master', icon: '☑️', description: 'Answer 50 multiple choice questions correctly', color: '#4caf50' },
    fillBlankExpert: { id: 'fillBlankExpert', name: 'Fill-in Expert', icon: '📝', description: 'Answer 30 fill-in questions correctly', color: '#2196f3' },
    matchingExpert: { id: 'matchingExpert', name: 'Matching Master', icon: '↔️', description: 'Answer 20 matching questions correctly', color: '#ff9800' },
    dragDropExpert: { id: 'dragDropExpert', name: 'Drag & Drop Champion', icon: '↔️', description: 'Answer 15 drag & drop questions correctly', color: '#9c27b0' },
    
    
    streak5: { id: 'streak5', name: 'Hot Streak', icon: '🔥', description: 'Answer 5 questions in a row correctly', color: '#ff5722' },
    streak10: { id: 'streak10', name: 'On Fire!', icon: '🔥🔥', description: 'Answer 10 questions in a row correctly', color: '#f44336' },
    speedDemon: { id: 'speedDemon', name: 'Speed Demon', icon: '⚡', description: 'Answer 10 questions with time bonus', color: '#ffeb3b' },
    perfectionist: { id: 'perfectionist', name: 'Perfectionist', icon: '✨', description: 'Get 10 perfect scores', color: '#00bcd4' },
    
    
    level5: { id: 'level5', name: 'Rising Star', icon: '⭐', description: 'Reach Level 5', color: '#ffd700' },
    level10: { id: 'level10', name: 'Learning Legend', icon: '🏆', description: 'Reach Level 10', color: '#c0c0c0' },
    level15: { id: 'level15', name: 'Grand Master', icon: '👑', description: 'Reach Level 15', color: '#ffa500' }
  }
};

const NLP_UTILS = {
  
  SUBJECT_KEYWORDS: {
    math: ['math', 'mathematics', 'calculate', 'equation', 'number', 'algebra', 'geometry', 'calculus', 'add', 'subtract', 'multiply', 'divide'],
    science: ['science', 'scientific', 'physics', 'chemistry', 'biology', 'atom', 'molecule', 'energy', 'force', 'cell', 'organism'],
    history: ['history', 'historical', 'past', 'war', 'king', 'queen', 'president', 'ancient', 'century', 'era', 'period'],
    geography: ['geography', 'geographical', 'country', 'city', 'map', 'continent', 'mountain', 'river', 'ocean', 'capital']
  },
  
  
  TYPE_KEYWORDS: {
    'multiple-choice': ['choose', 'select', 'option', 'which', 'multiple', 'choice'],
    'fill-blank': ['fill', 'blank', 'complete', 'missing', '____'],
    'true-false': ['true', 'false', 'correct', 'incorrect', 'right', 'wrong'],
    'matching': ['match', 'pair', 'connect', 'correspond'],
    'drag-drop': ['drag', 'drop', 'move', 'place']
  },
  
  DIFFICULTY_KEYWORDS: {
    easy: ['easy', 'simple', 'basic', 'fundamental', 'beginner'],
    medium: ['medium', 'moderate', 'average', 'intermediate'],
    hard: ['hard', 'difficult', 'challenging', 'advanced', 'complex']
  },
  
  parseQuestion: (question) => {
    const lowerQuestion = question.toLowerCase();
    const result = {
      subject: 'mixed',
      type: 'multiple-choice', 
      difficulty: 'medium',
      keywords: []
    };
    
    for (const [subject, keywords] of Object.entries(NLP_UTILS.SUBJECT_KEYWORDS)) {
      if (keywords.some(keyword => lowerQuestion.includes(keyword))) {
        result.subject = subject;
        break;
      }
    }
    
    for (const [type, keywords] of Object.entries(NLP_UTILS.TYPE_KEYWORDS)) {
      if (keywords.some(keyword => lowerQuestion.includes(keyword))) {
        result.type = type;
        break;
      }
    }
    
    for (const [difficulty, keywords] of Object.entries(NLP_UTILS.DIFFICULTY_KEYWORDS)) {
      if (keywords.some(keyword => lowerQuestion.includes(keyword))) {
        result.difficulty = difficulty;
        break;
      }
    }
    
    const allKeywords = [
      ...Object.values(NLP_UTILS.SUBJECT_KEYWORDS).flat(),
      ...Object.values(NLP_UTILS.TYPE_KEYWORDS).flat(),
      ...Object.values(NLP_UTILS.DIFFICULTY_KEYWORDS).flat()
    ];
    
    result.keywords = allKeywords.filter(keyword => 
      lowerQuestion.includes(keyword) && keyword.length > 3
    );
    
    return result;
  },
  
  findMatchingQuestion: (parsedIntent) => {
    let bestMatch = null;
    let highestScore = 0;
    
    questionDatabase.forEach(question => {
      let score = 0;
      
      if (question.subject === parsedIntent.subject) {
        score += 3;
      }
      
      if (question.type === parsedIntent.type) {
        score += 2;
      }
      
     
      if (question.difficulty === parsedIntent.difficulty) {
        score += 1;
      }
      
      const questionText = question.question.toLowerCase();
      parsedIntent.keywords.forEach(keyword => {
        if (questionText.includes(keyword)) {
          score += 1;
        }
      });
      
      if (score > highestScore) {
        highestScore = score;
        bestMatch = question;
      }
    });    
   
    if (!bestMatch || highestScore < 2) {
      const randomIndex = Math.floor(Math.random() * questionDatabase.length);
      bestMatch = questionDatabase[randomIndex];
    }
    
    return bestMatch;
  }
};

const INTEREST_CATEGORIES = {
  math: {
    name: 'Mathematics',
    tags: ['algebra', 'geometry', 'calculus', 'statistics', 'arithmetic', 'trigonometry']
  },
  science: {
    name: 'Science',
    tags: ['physics', 'chemistry', 'biology', 'astronomy', 'earth-science', 'environmental']
  },
  history: {
    name: 'History',
    tags: ['ancient', 'medieval', 'modern', 'world-wars', 'american', 'european', 'asian']
  },
  geography: {
    name: 'Geography',
    tags: ['countries', 'capitals', 'landforms', 'climate', 'cultures', 'maps', 'oceans']
  }
};

const DEFAULT_INTEREST_PROFILE = {
  selectedSubjects: ['math', 'science', 'history', 'geography'],
  preferredDifficulty: 'medium',
  interestTags: [],
  learningGoals: [],
  strengthAreas: [],
  weakAreas: [],
  preferredQuestionTypes: ['multiple-choice', 'true-false', 'fill-blank']
};

const PERSONALIZATION_UTILS = {
 
  calculateInterestScore: (question, interestProfile) => {
    let score = 0;
    
    if (interestProfile.selectedSubjects.includes(question.subject)) {
      score += 3;
    }
    
    if (question.difficulty === interestProfile.preferredDifficulty) {
      score += 2;
    }
    
    if (interestProfile.preferredQuestionTypes.includes(question.type)) {
      score += 2;
    }
    
    interestProfile.interestTags.forEach(tag => {
      if (question.question.toLowerCase().includes(tag) ||
          (question.explanation && question.explanation.toLowerCase().includes(tag))) {
        score += 1;
      }
    });
    
    interestProfile.learningGoals.forEach(goal => {
      if (question.question.toLowerCase().includes(goal) ||
          (question.explanation && question.explanation.toLowerCase().includes(goal))) {
        score += 2;
      }
    });
    
    interestProfile.weakAreas.forEach(area => {
      if (question.subject === area || 
          (question.tags && question.tags.includes(area))) {
        score += 3; 
      }
    });
    
    interestProfile.strengthAreas.forEach(area => {
      if (question.subject === area || 
          (question.tags && question.tags.includes(area))) {
        score += 1; 
      }
    });
    
    return score;
  },
 
  getPersonalizedQuestions: (interestProfile, count = 5) => {

    const scoredQuestions = questionDatabase.map(question => ({
      question,
      score: PERSONALIZATION_UTILS.calculateInterestScore(question, interestProfile)
    }));
    
    
    scoredQuestions.sort((a, b) => b.score - a.score);
    
    
    return scoredQuestions.slice(0, count).map(item => item.question);
  },
  
 
  updateProfileBasedOnPerformance: (profile, quizHistory, subjectStats) => {
    const newProfile = { ...profile };
    
    newProfile.weakAreas = Object.entries(subjectStats)
      .filter(([subject, stats]) => stats.answered > 5 && (stats.correct / stats.answered) < 0.5)
      .map(([subject]) => subject);
    
    newProfile.strengthAreas = Object.entries(subjectStats)
      .filter(([subject, stats]) => stats.answered > 5 && (stats.correct / stats.answered) > 0.8)
      .map(([subject]) => subject);

    const totalAnswered = Object.values(subjectStats).reduce((sum, stats) => sum + stats.answered, 0);
    const totalCorrect = Object.values(subjectStats).reduce((sum, stats) => sum + stats.correct, 0);
    const overallAccuracy = totalAnswered > 0 ? totalCorrect / totalAnswered : 0;
    
    if (overallAccuracy > 0.7) {
      newProfile.preferredDifficulty = 'hard';
    } else if (overallAccuracy > 0.4) {
      newProfile.preferredDifficulty = 'medium';
    } else {
      newProfile.preferredDifficulty = 'easy';
    }
    
    return newProfile;
  },
  
  generateLearningPath: (interestProfile, subjectStats) => {
    const path = [];
    const subjects = interestProfile.selectedSubjects;
    
    interestProfile.weakAreas.forEach(subject => {
      if (subjects.includes(subject)) {
        path.push({
          subject,
          priority: 'high',
          description: `Focus on ${INTEREST_CATEGORIES[subject].name} to improve your skills`,
          targetQuestions: 10
        });
      }
    });
    
    subjects.forEach(subject => {
      if (!interestProfile.weakAreas.includes(subject) && 
          !interestProfile.strengthAreas.includes(subject)) {
        path.push({
          subject,
          priority: 'medium',
          description: `Continue practicing ${INTEREST_CATEGORIES[subject].name}`,
          targetQuestions: 5
        });
      }
    });
    
    interestProfile.strengthAreas.forEach(subject => {
      if (subjects.includes(subject)) {
        path.push({
          subject,
          priority: 'low',
          description: `Maintain your strong skills in ${INTEREST_CATEGORIES[subject].name}`,
          targetQuestions: 3
        });
      }
    });
    
    return path;
  }
};

const PROCESS_ANALYSIS_UTILS = {
  
  createStepTracker: () => {
    let steps = [];
    let startTime = null;
    let endTime = null;
    
    return {
      start: () => {
        startTime = new Date();
        steps = [];
      },
      
      addStep: (action, data = {}) => {
        const timestamp = new Date();
        steps.push({
          action,
          data,
          timestamp,
          timeSinceStart: startTime ? timestamp - startTime : 0
        });
      },
      
      end: () => {
        endTime = new Date();
      },
      
      getAnalysis: () => {
        const totalTime = endTime - startTime;
        const stepCount = steps.length;
        
        const stepTypes = steps.reduce((acc, step) => {
          acc[step.action] = (acc[step.action] || 0) + 1;
          return acc;
        }, {});
        
        const timeBetweenSteps = steps.slice(1).map((step, i) => 
          step.timestamp - steps[i].timestamp
        );
        
        const patterns = {
          hesitation: timeBetweenSteps.filter(time => time > 5000).length, 
          quickActions: timeBetweenSteps.filter(time => time < 1000).length, 
          hintUsage: steps.filter(step => step.action === 'hint_used').length,
          answerChanges: steps.filter(step => step.action === 'answer_changed').length
        };
        
        return {
          steps,
          totalTime,
          stepCount,
          stepTypes,
          timeBetweenSteps,
          patterns,
          startTime,
          endTime
        };
      }
    };
  },
  
  generateInsights: (analysis, question, wasCorrect) => {
    const insights = [];
    
    if (analysis.totalTime < 10000) {
      insights.push("You solved this quickly! Great efficiency!");
    } else if (analysis.totalTime > 60000) {
      insights.push("You took your time with this one. Persistence pays off!");
    }
    
    if (analysis.patterns.hintUsage > 0) {
      insights.push("You used hints to guide your thinking - a smart strategy!");
    }
    
    if (analysis.patterns.hesitation > 2) {
      insights.push("You paused several times, showing careful consideration.");
    }
    
    if (analysis.patterns.answerChanges > 0) {
      insights.push("You reconsidered your approach - good reflective thinking!");
    }
   
    if (analysis.stepCount > 5) {
      insights.push("You broke the problem down into multiple steps - excellent approach!");
    }
   
    if (question.subject === 'math') {
      insights.push("For math problems, remember to check your work step by step.");
    } else if (question.subject === 'science') {
      insights.push("Scientific thinking often involves considering multiple factors.");
    }
 
    if (wasCorrect) {
      insights.push("Your methodical approach led to the correct answer!");
    } else {
      insights.push("Even with an incorrect answer, your process shows good thinking habits.");
    }
    
    return insights;
  },

  calculateEfficiencyScore: (analysis, wasCorrect) => {
    let score = 50; 

    const timeScore = Math.max(0, 30 - (analysis.totalTime / 1000) / 10);
    score += timeScore;

    const stepScore = Math.max(0, 20 - (analysis.stepCount * 2));
    score += stepScore;
    
    if (analysis.patterns.hintUsage > 0) {
      score -= analysis.patterns.hintUsage * 5;
    }
    
    if (wasCorrect) {
      score += 40;
    }
    
    return Math.max(0, Math.min(100, Math.round(score)));
  },
  
  compareWithOptimal: (analysis, question) => {
    const optimalSteps = question.optimalSolutionPath || [];
    const userSteps = analysis.steps;
    
    if (optimalSteps.length === 0) return null;
    
    const matches = userSteps.filter((step, i) => {
      if (i >= optimalSteps.length) return false;
      return step.action === optimalSteps[i].action;
    }).length;
    
    const similarity = Math.round((matches / Math.max(optimalSteps.length, userSteps.length)) * 100);
    
    return {
      similarity,
      optimalStepCount: optimalSteps.length,
      userStepCount: userSteps.length,
      matchedSteps: matches
    };
  }
};


questionDatabase.forEach(question => {
  if (question.type === 'multiple-choice' || question.type === 'true-false') {
    question.optimalSolutionPath = [
      { action: 'read_question', description: 'Read and understand the question' },
      { action: 'consider_options', description: 'Review all available options' },
      { action: 'eliminate_incorrect', description: 'Eliminate obviously wrong answers' },
      { action: 'select_answer', description: 'Choose the best answer' },
      { action: 'review', description: 'Quickly review the selection' }
    ];
  } else if (question.type === 'fill-blank') {
    question.optimalSolutionPath = [
      { action: 'read_question', description: 'Read and understand what\'s being asked' },
      { action: 'recall_knowledge', description: 'Recall relevant information' },
      { action: 'formulate_answer', description: 'Formulate the answer mentally' },
      { action: 'input_answer', description: 'Enter the answer' },
      { action: 'review', description: 'Check for accuracy' }
    ];
  } else if (question.type === 'matching' || question.type === 'drag-drop') {
    question.optimalSolutionPath = [
      { action: 'scan_items', description: 'Scan all items to be matched' },
      { action: 'identify_easy_matches', description: 'Identify obvious matches first' },
      { action: 'tackle_hard_matches', description: 'Work on more difficult matches' },
      { action: 'review_all', description: 'Review all matches for consistency' },
      { action: 'finalize', description: 'Finalize all matches' }
    ];
  }
});


const EMOTION_DETECTION = {
  
  EMOTIONS: {
    CONFUSED: {
      name: 'confused',
      emoji: '😕',
      difficultyAdjustment: -1, 
      message: "This seems tricky. Let me simplify it for you.",
      color: '#ff9800'
    },
    FRUSTRATED: {
      name: 'frustrated',
      emoji: '😠',
      difficultyAdjustment: -2, 
      message: "Frustration is part of learning. Let's try an easier approach.",
      color: '#f44336'
    },
    ENGAGED: {
      name: 'engaged',
      emoji: '🤔',
      difficultyAdjustment: 0, 
      message: "You're focused and engaged. Keep going!",
      color: '#4caf50'
    },
    CONFIDENT: {
      name: 'confident',
      emoji: '😊',
      difficultyAdjustment: +1, 
      message: "You're doing great! Let's increase the challenge.",
      color: '#2196f3'
    },
    BORED: {
      name: 'bored',
      emoji: '😴',
      difficultyAdjustment: +2, 
      message: "This seems too easy. Let's kick it up a notch!",
      color: '#9e9e9e'
    }
  },

  detectEmotion: (cues) => {
    let emotionScore = {
      CONFUSED: 0,
      FRUSTRATED: 0,
      ENGAGED: 0,
      CONFIDENT: 0,
      BORED: 0
    };

    if (cues.timeSpent > 30000) { 
      emotionScore.FRUSTRATED += 3;
      emotionScore.CONFUSED += 2;
    } else if (cues.timeSpent < 5000) { 
      emotionScore.CONFIDENT += 2;
      emotionScore.BORED += 1;
    }

    if (cues.hintsUsed > 0) {
      emotionScore.CONFUSED += cues.hintsUsed * 2;
    }

    if (cues.answerChanges > 2) {
      emotionScore.FRUSTRATED += 2;
      emotionScore.CONFUSED += 1;
    }

    if (cues.recentAccuracy < 0.3) {
      emotionScore.FRUSTRATED += 3;
    } else if (cues.recentAccuracy > 0.8) {
      emotionScore.CONFIDENT += 2;
    }

    if (cues.typingSpeed < 20) { 
      emotionScore.CONFUSED += 2;
    } else if (cues.typingSpeed > 100) { 
      emotionScore.CONFIDENT += 1;
    }

    let maxScore = 0;
    let detectedEmotion = 'ENGAGED'; 

    Object.entries(emotionScore).forEach(([emotion, score]) => {
      if (score > maxScore) {
        maxScore = score;
        detectedEmotion = emotion;
      }
    });

    return EMOTION_DETECTION.EMOTIONS[detectedEmotion];
  },

  adjustDifficulty: (currentDifficulty, emotion) => {
    const difficultyLevels = ['easy', 'medium', 'hard'];
    const currentIndex = difficultyLevels.indexOf(currentDifficulty);
    
    let newIndex = currentIndex + emotion.difficultyAdjustment;
    newIndex = Math.max(0, Math.min(newIndex, difficultyLevels.length - 1));
    
    return difficultyLevels[newIndex];
  },

  getEncouragement: (emotion, wasCorrect) => {
    if (wasCorrect) {
      return "Great job! " + emotion.message;
    } else {
      switch (emotion.name) {
        case 'confused':
          return "That was a tough one. " + emotion.message;
        case 'frustrated':
          return "Don't worry! " + emotion.message;
        case 'bored':
          return "Challenge accepted! " + emotion.message;
        default:
          return "Let's try again. " + emotion.message;
      }
    }
  }
};


const FATIGUE_DETECTION = {

  INDICATORS: {
    TIME_STUDIED: { weight: 0.3, threshold: 1800000 }, 
    CONSECUTIVE_WRONG: { weight: 0.25, threshold: 3 },
    ACCURACY_DROP: { weight: 0.2, threshold: 0.3 },
    TYPING_SPEED_DROP: { weight: 0.15, threshold: 0.5 },
    HINT_USAGE_INCREASE: { weight: 0.1, threshold: 2 }
  },

  BREAK_TYPES: {
    SHORT: {
      duration: 300000, 
      suggestions: [
        "Take a short walk",
        "Do some stretches",
        "Get a glass of water",
        "Look away from the screen",
        "Practice deep breathing"
      ],
      message: "Time for a quick break! You've been studying for a while."
    },
    MEDIUM: {
      duration: 600000, 
      suggestions: [
        "Have a healthy snack",
        "Do a quick workout",
        "Meditate for 5 minutes",
        "Listen to some music",
        "Step outside for fresh air"
      ],
      message: "You've been working hard. Take a medium break to recharge."
    },
    LONG: {
      duration: 1800000, 
      suggestions: [
        "Have a proper meal",
        "Take a power nap",
        "Go for a walk outside",
        "Do a complete workout",
        "Engage in a different hobby"
      ],
      message: "You've reached an important milestone. Take a longer break to refresh your mind."
    }
  },

  calculateFatigueScore: (metrics) => {
    let score = 0;
    
    if (metrics.totalStudyTime > FATIGUE_DETECTION.INDICATORS.TIME_STUDIED.threshold) {
      score += FATIGUE_DETECTION.INDICATORS.TIME_STUDIED.weight * 
               (metrics.totalStudyTime / FATIGUE_DETECTION.INDICATORS.TIME_STUDIED.threshold);
    }
    
    if (metrics.consecutiveWrongAnswers >= FATIGUE_DETECTION.INDICATORS.CONSECUTIVE_WRONG.threshold) {
      score += FATIGUE_DETECTION.INDICATORS.CONSECUTIVE_WRONG.weight * 
               (metrics.consecutiveWrongAnswers / FATIGUE_DETECTION.INDICATORS.CONSECUTIVE_WRONG.threshold);
    }
    
    if (metrics.recentAccuracy < metrics.sessionAccuracy - FATIGUE_DETECTION.INDICATORS.ACCURACY_DROP.threshold) {
      score += FATIGUE_DETECTION.INDICATORS.ACCURACY_DROP.weight * 
               ((metrics.sessionAccuracy - metrics.recentAccuracy) / FATIGUE_DETECTION.INDICATORS.ACCURACY_DROP.threshold);
    }
    
    if (metrics.currentTypingSpeed < metrics.averageTypingSpeed * FATIGUE_DETECTION.INDICATORS.TYPING_SPEED_DROP.threshold) {
      score += FATIGUE_DETECTION.INDICATORS.TYPING_SPEED_DROP.weight * 
               ((metrics.averageTypingSpeed - metrics.currentTypingSpeed) / metrics.averageTypingSpeed);
    }
    
    if (metrics.recentHintUsage > metrics.averageHintUsage * FATIGUE_DETECTION.INDICATORS.HINT_USAGE_INCREASE.threshold) {
      score += FATIGUE_DETECTION.INDICATORS.HINT_USAGE_INCREASE.weight * 
               ((metrics.recentHintUsage - metrics.averageHintUsage) / metrics.averageHintUsage);
    }
    
    return Math.min(1, score); 
  },

  determineBreakType: (fatigueScore) => {
    if (fatigueScore > 0.7) return 'LONG';
    if (fatigueScore > 0.4) return 'MEDIUM';
    if (fatigueScore > 0.2) return 'SHORT';
    return null;
  },

  getBreakSuggestion: (breakType) => {
    const breakInfo = FATIGUE_DETECTION.BREAK_TYPES[breakType];
    const randomIndex = Math.floor(Math.random() * breakInfo.suggestions.length);
    return breakInfo.suggestions[randomIndex];
  }
};

const WRITING_EVALUATION = {
  GRAMMAR_RULES: [
    { pattern: /\bi\s+am\b/gi, suggestion: "Use 'I'm' for more natural writing" },
    { pattern: /\b(a|an)\s+[aeiou]/gi, suggestion: "Remember 'an' before vowel sounds" },
    { pattern: /\bthey\s+is\b/gi, suggestion: "Use 'they are' instead of 'they is'" },
    { pattern: /\bme\s+(and|or)\b/gi, suggestion: "Use 'I' instead of 'me' in subject position" },
    { pattern: /\bbetween\s+you\s+and\s+I\b/gi, suggestion: "Use 'me' instead of 'I' after prepositions" }
  ],

  STYLE_SUGGESTIONS: [
    { pattern: /\bvery\s+\w+/gi, suggestion: "Try using a stronger word instead of 'very'" },
    { pattern: /\breally\s+\w+/gi, suggestion: "Consider removing 'really' for more concise writing" },
    { pattern: /\bget\b/gi, suggestion: "Use more specific verbs than 'get'" },
    { pattern: /\bthing\b/gi, suggestion: "Replace 'thing' with a more specific noun" },
    { pattern: /\ba lot\b/gi, suggestion: "Use 'many', 'much', or be more specific" }
  ],

  STRUCTURE_CRITERIA: {
    introduction: { weight: 0.2, description: "Clear introduction of main idea" },
    organization: { weight: 0.3, description: "Logical flow and organization" },
    supporting: { weight: 0.3, description: "Adequate supporting details" },
    conclusion: { weight: 0.2, description: "Effective conclusion" }
  },

  CONTENT_CRITERIA: {
    relevance: { weight: 0.4, description: "Relevance to the question" },
    accuracy: { weight: 0.4, description: "Factual accuracy" },
    completeness: { weight: 0.2, description: "Completeness of response" }
  },

  evaluateWriting: (text, question) => {
    const evaluation = {
      overallScore: 0,
      grammar: { score: 0, issues: [], suggestions: [] },
      style: { score: 0, issues: [], suggestions: [] },
      structure: { score: 0, feedback: {} },
      content: { score: 0, feedback: {} },
      wordCount: text.trim().split(/\s+/).length,
      readibilityScore: 0
    };

    evaluation.grammar = WRITING_EVALUATION.checkGrammar(text);
    
    evaluation.style = WRITING_EVALUATION.analyzeStyle(text);
    
    evaluation.structure = WRITING_EVALUATION.evaluateStructure(text);
   
    evaluation.content = WRITING_EVALUATION.evaluateContent(text, question);

    evaluation.overallScore = Math.round(
      (evaluation.grammar.score * 0.2) +
      (evaluation.style.score * 0.2) +
      (evaluation.structure.score * 0.3) +
      (evaluation.content.score * 0.3)
    );
  
    evaluation.readibilityScore = WRITING_EVALUATION.calculateReadability(text);
    
    return evaluation;
  },

  checkGrammar: (text) => {
    const issues = [];
    const suggestions = [];
    
    WRITING_EVALUATION.GRAMMAR_RULES.forEach(rule => {
      if (rule.pattern.test(text)) {
        suggestions.push(rule.suggestion);
      }
    });
    
    const score = Math.max(0, 100 - (suggestions.length * 10));
    
    return { score, issues, suggestions };
  },

  analyzeStyle: (text) => {
    const issues = [];
    const suggestions = [];
    
    WRITING_EVALUATION.STYLE_SUGGESTIONS.forEach(rule => {
      if (rule.pattern.test(text)) {
        suggestions.push(rule.suggestion);
      }
    });
  
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength = text.length / Math.max(1, sentences.length);
    
    if (avgSentenceLength > 25) {
      suggestions.push("Try varying sentence length for better flow");
    }
    
    const score = Math.max(0, 100 - (suggestions.length * 8));
    
    return { score, issues, suggestions };
  },

  
  evaluateStructure: (text) => {
    const feedback = {};
    let score = 70; 
    
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    
    const hasIntroduction = sentences.length > 0 && 
      sentences[0].length > 10 && 
      !sentences[0].toLowerCase().includes('because');
    
    if (hasIntroduction) {
      feedback.introduction = "Good introductory sentence";
      score += 10;
    } else {
      feedback.introduction = "Consider adding a clear introduction";
    }
    
    const transitionWords = ['however', 'therefore', 'furthermore', 'additionally', 'consequently'];
    const hasTransitions = transitionWords.some(word => text.toLowerCase().includes(word));
    
    if (hasTransitions) {
      feedback.organization = "Good use of transition words";
      score += 10;
    } else {
      feedback.organization = "Try using transition words to improve flow";
    }
    
    const hasConclusion = sentences.length > 1 && 
      sentences[sentences.length - 1].length > 10 &&
      (sentences[sentences.length - 1].toLowerCase().includes('in conclusion') ||
       sentences[sentences.length - 1].toLowerCase().includes('summary'));
    
    if (hasConclusion) {
      feedback.conclusion = "Effective conclusion";
      score += 10;
    } else {
      feedback.conclusion = "Consider adding a concluding sentence";
    }
    
    return { score: Math.min(100, score), feedback };
  },

  evaluateContent: (text, question) => {
    const feedback = {};
    let score = 70; 
    
    const questionKeywords = question.question.toLowerCase().split(/\s+/)
      .filter(word => word.length > 3 && !['what', 'why', 'how', 'the', 'and', 'for'].includes(word));
    
    const relevantKeywords = questionKeywords.filter(keyword => 
      text.toLowerCase().includes(keyword)
    );
    
    const relevanceRatio = relevantKeywords.length / Math.max(1, questionKeywords.length);
    
    if (relevanceRatio > 0.7) {
      feedback.relevance = "Highly relevant to the question";
      score += 15;
    } else if (relevanceRatio > 0.4) {
      feedback.relevance = "Somewhat relevant, could be more focused";
      score += 5;
    } else {
      feedback.relevance = "Try to focus more directly on the question";
    }
    
    const wordCount = text.trim().split(/\s+/).length;
    if (wordCount > 20) {
      feedback.completeness = "Thorough response";
      score += 15;
    } else if (wordCount > 10) {
      feedback.completeness = "Adequate but could be more detailed";
      score += 5;
    } else {
      feedback.completeness = "Consider providing more details";
    }
    
    return { score: Math.min(100, score), feedback };
  },


  calculateReadability: (text) => {
    const words = text.trim().split(/\s+/);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const wordCount = words.length;
    const sentenceCount = Math.max(1, sentences.length);
    
    const avgWordsPerSentence = wordCount / sentenceCount;
    const complexWords = words.filter(word => word.length > 6).length;
    const percentComplex = (complexWords / Math.max(1, wordCount)) * 100;
 
    let score = 100 - (avgWordsPerSentence * 1.5) - (percentComplex * 0.5);
    return Math.max(0, Math.min(100, Math.round(score)));
  },

 
  generateFeedback: (evaluation) => {
    const feedback = [];

    if (evaluation.overallScore >= 85) {
      feedback.push("Excellent writing! Your response is well-structured and clear.");
    } else if (evaluation.overallScore >= 70) {
      feedback.push("Good work! With a few improvements, your writing could be even better.");
    } else {
      feedback.push("Keep practicing! Here are some areas to focus on:");
    }

    if (evaluation.grammar.suggestions.length > 0) {
      feedback.push("Grammar: " + evaluation.grammar.suggestions[0]);
    } else if (evaluation.grammar.score > 90) {
      feedback.push("Grammar: Excellent grammar and spelling!");
    }

    if (evaluation.style.suggestions.length > 0) {
      feedback.push("Style: " + evaluation.style.suggestions[0]);
    } else if (evaluation.style.score > 90) {
      feedback.push("Style: Clear and effective writing style!");
    }

    const structureKeys = Object.keys(evaluation.structure.feedback);
    if (structureKeys.length > 0) {
      feedback.push("Structure: " + evaluation.structure.feedback[structureKeys[0]]);
    }

    const contentKeys = Object.keys(evaluation.content.feedback);
    if (contentKeys.length > 0) {
      feedback.push("Content: " + evaluation.content.feedback[contentKeys[0]]);
    }

    if (evaluation.readibilityScore > 80) {
      feedback.push("Readability: Very easy to read and understand!");
    } else if (evaluation.readibilityScore < 60) {
      feedback.push("Readability: Try simplifying your sentences for better clarity.");
    }
    
    return feedback;
  }
};

const writingQuestions = [
  {
    id: 101,
    type: 'writing',
    subject: 'english',
    difficulty: 'medium',
    question: 'Describe the importance of education in today\'s society.',
    instructions: 'Write a short paragraph (3-5 sentences) explaining why education is important in modern society.',
    evaluationCriteria: {
      minWords: 30,
      maxWords: 100,
      requiredConcepts: ['knowledge', 'opportunities', 'society']
    }
  },
  {
    id: 102,
    type: 'writing',
    subject: 'science',
    difficulty: 'medium',
    question: 'Explain how photosynthesis works in plants.',
    instructions: 'Describe the process of photosynthesis in 4-6 sentences, including the key components involved.',
    evaluationCriteria: {
      minWords: 40,
      maxWords: 120,
      requiredConcepts: ['sunlight', 'carbon dioxide', 'oxygen', 'chlorophyll']
    }
  },
  {
    id: 103,
    type: 'writing',
    subject: 'history',
    difficulty: 'hard',
    question: 'Analyze the causes of World War II.',
    instructions: 'Write a paragraph analyzing the main causes of World War II, considering political, economic, and social factors.',
    evaluationCriteria: {
      minWords: 50,
      maxWords: 150,
      requiredConcepts: ['treaty of versailles', 'fascism', 'appeasement', 'economic crisis']
    }
  }
];

questionDatabase.push(...writingQuestions);

function App() {
  const [currentLevel, setCurrentLevel] = useState('easy');
  const [currentSubject, setCurrentSubject] = useState('math');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [selectedAnswers, setSelectedAnswers] = useState([]); 
  const [matches, setMatches] = useState({}); 
  const [dragItems, setDragItems] = useState([]); 
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizHistory, setQuizHistory] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [timeLimit, setTimeLimit] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [subjectStats, setSubjectStats] = useState({
    math: { answered: 0, correct: 0 },
    science: { answered: 0, correct: 0 },
    history: { answered: 0, correct: 0 },
    geography: { answered: 0, correct: 0 }
  });
  const [questionTypeStats, setQuestionTypeStats] = useState({
    'multiple-choice': { answered: 0, correct: 0 },
    'fill-blank': { answered: 0, correct: 0 },
    'matching': { answered: 0, correct: 0 },
    'drag-drop': { answered: 0, correct: 0 },
    'true-false': { answered: 0, correct: 0 },
    'multiple-answer': { answered: 0, correct: 0 }
  });
  const [showStepByStep, setShowStepByStep] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [levelTitle, setLevelTitle] = useState('Beginner');
  const [xpToNextLevel, setXpToNextLevel] = useState(100);
  const [xpProgress, setXpProgress] = useState(0);
  const [showXpAnimation, setShowXpAnimation] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  const [subjectXp, setSubjectXp] = useState({
    math: 0,
    science: 0,
    history: 0,
    geography: 0
  });
  const [recentXpEvents, setRecentXpEvents] = useState([]);
  const [badges, setBadges] = useState([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [unlockedBadges, setUnlockedBadges] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [interestProfile, setInterestProfile] = useState(DEFAULT_INTEREST_PROFILE);
  const [showInterestProfile, setShowInterestProfile] = useState(false);
  const [learningPath, setLearningPath] = useState([]);
  const [personalizedSuggestions, setPersonalizedSuggestions] = useState([]);
  const [processTracker] = useState(PROCESS_ANALYSIS_UTILS.createStepTracker());
  const [processAnalysis, setProcessAnalysis] = useState(null);
  const [showProcessAnalysis, setShowProcessAnalysis] = useState(false);
  const [solvingSteps, setSolvingSteps] = useState([]);
  const [userEmotion, setUserEmotion] = useState(EMOTION_DETECTION.EMOTIONS.ENGAGED);
  const [emotionCues, setEmotionCues] = useState({
    timeSpent: 0,
    hintsUsed: 0,
    answerChanges: 0,
    recentAccuracy: 0.5,
    typingSpeed: 0
  });
  const [showEmotionFeedback, setShowEmotionFeedback] = useState(false);
  const [emotionDetectionEnabled, setEmotionDetectionEnabled] = useState(false);
  const [webcamAccess, setWebcamAccess] = useState(false);
  const [fatigueMetrics, setFatigueMetrics] = useState({
    totalStudyTime: 0,
    sessionStartTime: null,
    consecutiveWrongAnswers: 0,
    recentAccuracy: 1,
    sessionAccuracy: 1,
    currentTypingSpeed: 0,
    averageTypingSpeed: 40, 
    recentHintUsage: 0,
    averageHintUsage: 0,
    questionCount: 0
  });
  const [fatigueScore, setFatigueScore] = useState(0);
  const [showBreakSuggestion, setShowBreakSuggestion] = useState(false);
  const [currentBreakSuggestion, setCurrentBreakSuggestion] = useState(null);
  const [breakType, setBreakType] = useState(null);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakTimeRemaining, setBreakTimeRemaining] = useState(0);
  const [writingResponse, setWritingResponse] = useState('');
  const [writingEvaluation, setWritingEvaluation] = useState(null);
  const [showWritingEvaluation, setShowWritingEvaluation] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const videoRef = useRef(null);
  const emotionCheckInterval = useRef(null);
  const breakTimerRef = useRef(null);

  useEffect(() => {
    const suggestions = PERSONALIZATION_UTILS.getPersonalizedQuestions(interestProfile, 3);
    setPersonalizedSuggestions(suggestions);
  }, [interestProfile]);

  useEffect(() => {
    if (questionsAnswered > 0 && questionsAnswered % 5 === 0) {
      const updatedProfile = PERSONALIZATION_UTILS.updateProfileBasedOnPerformance(
        interestProfile, quizHistory, subjectStats
      );
      setInterestProfile(updatedProfile);
      
      const newLearningPath = PERSONALIZATION_UTILS.generateLearningPath(updatedProfile, subjectStats);
      setLearningPath(newLearningPath);
    }
  }, [questionsAnswered, quizHistory, subjectStats]);
  
  useEffect(() => {
    generateQuestion(currentLevel, currentSubject);
  }, []);

  useEffect(() => {
    let interval;
    if (timerActive && timeLimit > 0) {
      interval = setInterval(() => {
        setTimeLimit(prev => prev - 1);
      }, 1000);
    } else if (timeLimit === 0 && timerActive) {
      handleTimeUp();
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLimit]);

  useEffect(() => {
    if (currentQuestion && !showExplanation) {
      processTracker.start();
      processTracker.addStep('question_presented', {
        questionId: currentQuestion.id,
        questionType: currentQuestion.type,
        subject: currentQuestion.subject,
        difficulty: currentQuestion.difficulty
      });
      
      setSolvingSteps([{ action: 'started', description: 'Started solving the problem' }]);
    }
  }, [currentQuestion, showExplanation]);

  useEffect(() => {
    const interval = setInterval(() => {
      setEmotionCues(prev => ({
        ...prev,
        timeSpent: prev.timeSpent + 1000 
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (emotionDetectionEnabled) {
      const detectedEmotion = EMOTION_DETECTION.detectEmotion(emotionCues);
      setUserEmotion(detectedEmotion);
    }
  }, [emotionCues, emotionDetectionEnabled]);

  useEffect(() => {
    if (emotionDetectionEnabled && userEmotion.difficultyAdjustment !== 0) {
      const newDifficulty = EMOTION_DETECTION.adjustDifficulty(currentLevel, userEmotion);
      if (newDifficulty !== currentLevel) {
        setCurrentLevel(newDifficulty);
        generateQuestion(newDifficulty, currentSubject);
        setShowEmotionFeedback(true);
        setTimeout(() => setShowEmotionFeedback(false), 3000);
      }
    }
  }, [userEmotion, emotionDetectionEnabled]);

  useEffect(() => {
    setFatigueMetrics(prev => ({
      ...prev,
      sessionStartTime: new Date()
    }));
  }, []);
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isOnBreak) {
        setFatigueMetrics(prev => ({
          ...prev,
          totalStudyTime: prev.totalStudyTime + 60000
        }));
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [isOnBreak]);

  useEffect(() => {
    const newScore = FATIGUE_DETECTION.calculateFatigueScore(fatigueMetrics);
    setFatigueScore(newScore);
    
    if (newScore > 0.2 && !isOnBreak && !showBreakSuggestion) {
      const detectedBreakType = FATIGUE_DETECTION.determineBreakType(newScore);
      if (detectedBreakType) {
        setBreakType(detectedBreakType);
        setCurrentBreakSuggestion(FATIGUE_DETECTION.getBreakSuggestion(detectedBreakType));
        setShowBreakSuggestion(true);
        
        setTimeout(() => {
          setShowBreakSuggestion(false);
        }, 10000);
      }
    }
  }, [fatigueMetrics, isOnBreak]);

  useEffect(() => {
    if (questionsAnswered > 0) {
      const accuracy = correctAnswers / questionsAnswered;
      setFatigueMetrics(prev => ({
        ...prev,
        recentAccuracy: accuracy,
        sessionAccuracy: (prev.sessionAccuracy * prev.questionCount + accuracy) / (prev.questionCount + 1),
        questionCount: prev.questionCount + 1
      }));
    }
  }, [questionsAnswered, correctAnswers]);

  useEffect(() => {
    if (quizHistory.length > 0) {
      const lastResult = quizHistory[quizHistory.length - 1];
      if (!lastResult.isCorrect) {
        setFatigueMetrics(prev => ({
          ...prev,
          consecutiveWrongAnswers: prev.consecutiveWrongAnswers + 1
        }));
      } else {
        setFatigueMetrics(prev => ({
          ...prev,
          consecutiveWrongAnswers: 0
        }));
      }
    }
  }, [quizHistory]);

  
  useEffect(() => {
    if (showHint) {
      setFatigueMetrics(prev => ({
        ...prev,
        recentHintUsage: prev.recentHintUsage + 1,
        averageHintUsage: (prev.averageHintUsage * prev.questionCount + 1) / (prev.questionCount + 1)
      }));
    }
  }, [showHint]);

  useEffect(() => {
    const words = writingResponse.trim().split(/\s+/);
    setWordCount(words.length > 0 && words[0] !== '' ? words.length : 0);
  }, [writingResponse]);

  const generateQuestion = (level, subject) => {
    let filteredQuestions;
    let rndInd;

    
    if (subject === 'personalized') {
      const personalizedQuestions = PERSONALIZATION_UTILS.getPersonalizedQuestions(interestProfile, 10);
      if (personalizedQuestions.length > 0) {
        const randomIndex = Math.floor(Math.random() * personalizedQuestions.length);
        const selectedQuestion = personalizedQuestions[randomIndex];
        setCurrentQuestion(selectedQuestion);
        setCurrentSubject(selectedQuestion.subject);
        setCurrentLevel(selectedQuestion.difficulty);
        
        setSelectedAnswer('');
        setSelectedAnswers([]);
        setMatches({});
        setShowExplanation(false);
        setShowHint(false);
        setTimeLimit(30);
        setTimerActive(true);
        
        if (selectedQuestion.type === 'drag-drop') {
          setDragItems([...selectedQuestion.items].sort(() => Math.random() - 0.5));
        }
        
        return;
      }
    }
    
    if (subject === 'mixed') {
      filteredQuestions = questionDatabase.filter(q => q.difficulty === level);
    } else {
      filteredQuestions = questionDatabase.filter(q => 
        q.difficulty === level && q.subject === subject
      );
    }
    
    if (filteredQuestions.length === 0) {
      const anyDifficultyQuestions = subject === 'mixed' 
        ? questionDatabase 
        : questionDatabase.filter(q => q.subject === subject);
      
      if (anyDifficultyQuestions.length > 0) {
        const randomIndex = Math.floor(Math.random() * anyDifficultyQuestions.length);
        rndInd = randomIndex;
        setCurrentQuestion(anyDifficultyQuestions[randomIndex]);
        setCurrentLevel(anyDifficultyQuestions[randomIndex].difficulty);
      } else {
        const randomIndex = Math.floor(Math.random() * questionDatabase.length);
        rndInd = randomIndex;
        setCurrentQuestion(questionDatabase[randomIndex]);
        setCurrentLevel(questionDatabase[randomIndex].difficulty);
        setCurrentSubject(questionDatabase[randomIndex].subject);
      }
    } else {
      const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
      rndInd = randomIndex;
      setCurrentQuestion(filteredQuestions[randomIndex]);
    }
    
    setSelectedAnswer('');
    setSelectedAnswers([]);
    setMatches({});
    setShowExplanation(false);
    setShowHint(false);
    setTimeLimit(30);
    setTimerActive(true);
    
    if (filteredQuestions[rndInd]?.type === 'drag-drop') {
      setDragItems([...filteredQuestions[rndInd].items].sort(() => Math.random() - 0.5));
    }

    setEmotionCues(prev => ({
      ...prev,
      timeSpent: 0,
      hintsUsed: 0,
      answerChanges: 0,
      typingSpeed: 0
    }))

  };


  useEffect(() => {
    const calculateLevel = () => {
      let currentLevel = 1;
      let currentTitle = 'Beginner';
      let currentBadge = '🌱';
      let currentColor = '#9e9e9e';
      let nextLevelXp = LEVEL_CONFIG.LEVELS[1].xpRequired;
      
      for (let i = LEVEL_CONFIG.LEVELS.length - 1; i >= 0; i--) {
        if (xp >= LEVEL_CONFIG.LEVELS[i].xpRequired) {
          currentLevel = LEVEL_CONFIG.LEVELS[i].level;
          currentTitle = LEVEL_CONFIG.LEVELS[i].title;
          currentBadge = LEVEL_CONFIG.LEVELS[i].badge;
          currentColor = LEVEL_CONFIG.LEVELS[i].color;
          nextLevelXp = i < LEVEL_CONFIG.LEVELS.length - 1 
            ? LEVEL_CONFIG.LEVELS[i + 1].xpRequired 
            : LEVEL_CONFIG.LEVELS[i].xpRequired;
          break;
        }
      }
      
      if (currentLevel > level) {
        setNewLevel({ level: currentLevel, title: currentTitle, badge: currentBadge, color: currentColor });
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 3000);
        
        checkForLevelBadges(currentLevel);
      }
      
      setLevel(currentLevel);
      setLevelTitle(currentTitle);
      setXpToNextLevel(nextLevelXp);
      setXpProgress(((xp - LEVEL_CONFIG.LEVELS[currentLevel - 1].xpRequired) / 
                    (nextLevelXp - LEVEL_CONFIG.LEVELS[currentLevel - 1].xpRequired)) * 100);
    };
    
    calculateLevel();
  }, [xp, level]);

  useEffect(() => {
    if (showChat && chatMessages.length === 0) {
      setChatMessages([
        {
          id: 1,
          type: 'bot',
          content: "Hi! I'm your AI tutor. Ask me any question about math, science, history, or geography!",
          timestamp: new Date()
        }
      ]);
    }
  }, [showChat, chatMessages.length]);

  const handleTimeUp = () => {
    setTimerActive(false);
    setShowExplanation(true);
    setStreak(0);

    awardXp(1, "Time's up effort");
    
    setSubjectStats(prev => ({
      ...prev,
      [currentQuestion.subject]: {
        answered: prev[currentQuestion.subject].answered + 1,
        correct: prev[currentQuestion.subject].correct
      }
    }));
    
    setQuestionTypeStats(prev => ({
      ...prev,
      [currentQuestion.type]: {
        answered: prev[currentQuestion.type].answered + 1,
        correct: prev[currentQuestion.type].correct
      }
    }));
    
    setQuizHistory([...quizHistory, {
      question: currentQuestion.question,
      userAnswer: 'Time Up',
      correctAnswer: getCorrectAnswerForHistory(),
      isCorrect: false,
      timeUp: true,
      subject: currentQuestion.subject,
      type: currentQuestion.type
    }]);
  };

  const getCorrectAnswerForHistory = () => {
    if (!currentQuestion) return '';
    
    switch(currentQuestion.type) {
      case 'multiple-choice':
      case 'true-false':
      case 'fill-blank':
        return currentQuestion.correctAnswer;
      case 'multiple-answer':
        return currentQuestion.correctAnswers.join(', ');
      case 'matching':
        return Object.entries(currentQuestion.correctMatches)
          .map(([key, value]) => `${key} - ${value}`)
          .join('; ');
      case 'drag-drop':
        return Object.entries(currentQuestion.correctPairs)
          .map(([key, value]) => `${key} - ${value}`)
          .join('; ');
      default:
        return '';
    }
  };

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('text/plain', item);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, category) => {
    e.preventDefault();
    const item = e.dataTransfer.getData('text/plain');
    
    setMatches(prev => {
      const newMatches = { ...prev };
      
      if (newMatches[item]) {
        delete newMatches[item];
      }
      
      newMatches[item] = category;
      
      return newMatches;
    });
  };

  const checkAnswer = () => {
    if (!currentQuestion) return false;
    
    switch(currentQuestion.type) {
      case 'multiple-choice':
      case 'true-false':
      case 'fill-blank':
        return selectedAnswer === currentQuestion.correctAnswer;
      case 'multiple-answer':
        if (selectedAnswers.length !== currentQuestion.correctAnswers.length) return false;
        return currentQuestion.correctAnswers.every(answer => selectedAnswers.includes(answer));
      case 'matching':
        if (Object.keys(matches).length !== Object.keys(currentQuestion.correctMatches).length) return false;
        return Object.entries(matches).every(([key, value]) => 
          currentQuestion.correctMatches[key] === value
        );
      case 'drag-drop':
        if (Object.keys(matches).length !== Object.keys(currentQuestion.correctPairs).length) return false;
        return Object.entries(matches).every(([key, value]) => 
          currentQuestion.correctPairs[key] === value
        );
      default:
        return false;
    }
  };

  const handleSubmit = () => {
    if ((currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'true-false') && !selectedAnswer) return;
    if (currentQuestion.type === 'fill-blank' && !selectedAnswer.trim()) return;
    if (currentQuestion.type === 'multiple-answer' && selectedAnswers.length === 0) return;
    if ((currentQuestion.type === 'matching' || currentQuestion.type === 'drag-drop') && 
        Object.keys(matches).length !== Object.keys(currentQuestion.correctMatches || currentQuestion.correctPairs).length) return;
   
     processTracker.addStep('answer_submitted', { 
      selectedAnswer, 
      selectedAnswers,
      matches: Object.keys(matches).length > 0 ? matches : null
    });

    setTimerActive(false);
    const isCorrect = checkAnswer();
    const updatedScore = isCorrect ? score + 1 : score;
    const updatedCorrectAnswers = isCorrect ? correctAnswers + 1 : correctAnswers;
    const newStreak = isCorrect ? streak + 1 : 0;

    if (isCorrect) {
      const xpEarned = calculateXpForAnswer(isCorrect, timeLimit, true);
      if (xpEarned > 0) {
        awardXp(xpEarned, `Correct ${currentQuestion.difficulty} answer`, currentQuestion.subject);
      }
    } else {
      awardXp(2, "Effort points");
    }
    
    if (newStreak > streak && newStreak % 5 === 0) {
      const streakBonus = newStreak * 2;
      awardXp(streakBonus, `${newStreak}-question streak!`);
    }
   
    const newAccuracy = correctAnswers / (questionsAnswered + 1);
    setEmotionCues(prev => ({ 
      ...prev, 
      recentAccuracy: newAccuracy,
      timeSpent: 0, 
      hintsUsed: 0,
      answerChanges: 0
    }));
    
    if (emotionDetectionEnabled) {
      setShowEmotionFeedback(true);
      setTimeout(() => setShowEmotionFeedback(false), 3000);
    }

    setScore(updatedScore);
    setCorrectAnswers(updatedCorrectAnswers);
    setQuestionsAnswered(questionsAnswered + 1);
    setStreak(newStreak);

    setSubjectStats(prev => ({
      ...prev,
      [currentQuestion.subject]: {
        answered: prev[currentQuestion.subject].answered + 1,
        correct: prev[currentQuestion.subject].correct + (isCorrect ? 1 : 0)
      }
    }));
    
    setQuestionTypeStats(prev => ({
      ...prev,
      [currentQuestion.type]: {
        answered: prev[currentQuestion.type].answered + 1,
        correct: prev[currentQuestion.type].correct + (isCorrect ? 1 : 0)
      }
    }));
    
    if (newStreak > maxStreak) {
      setMaxStreak(newStreak);
    }
   
    checkForAchievements(updatedScore, newStreak, questionsAnswered + 1);
    processTracker.end();
    const analysis = processTracker.getAnalysis();
    const efficiencyScore = PROCESS_ANALYSIS_UTILS.calculateEfficiencyScore(analysis, isCorrect);
    const insights = PROCESS_ANALYSIS_UTILS.generateInsights(analysis, currentQuestion, isCorrect);
    const optimalComparison = PROCESS_ANALYSIS_UTILS.compareWithOptimal(analysis, currentQuestion);
    
    setProcessAnalysis({
      ...analysis,
      efficiencyScore,
      insights,
      optimalComparison,
      wasCorrect: isCorrect
    });

    const historyEntry = {
      question: currentQuestion.question,
      userAnswer: getUserAnswerForHistory(),
      correctAnswer: getCorrectAnswerForHistory(),
      isCorrect: isCorrect,
      subject: currentQuestion.subject,
      type: currentQuestion.type,
      processAnalysis: {
        timeSpent: analysis.totalTime,
        steps: analysis.stepCount,
        efficiency: efficiencyScore
      }
    };
    
    setQuizHistory([...quizHistory, historyEntry]);
    
    setShowExplanation(true);
  };

  const getUserAnswerForHistory = () => {
    if (!currentQuestion) return '';
    
    switch(currentQuestion.type) {
      case 'multiple-choice':
      case 'true-false':
      case 'fill-blank':
        return selectedAnswer;
      case 'multiple-answer':
        return selectedAnswers.join(', ');
      case 'matching':
      case 'drag-drop':
        return Object.entries(matches)
          .map(([key, value]) => `${key} - ${value}`)
          .join('; ');
      default:
        return '';
    }
  };

  const checkForAchievements = (newScore, currentStreak, totalAnswered) => {
    const newAchievements = [];
    
    if (newScore >= 5 && !achievements.includes('score_5')) {
      newAchievements.push({ id: 'score_5', name: 'Scholar', description: 'Score 5 points' });
    }
    
    if (newScore >= 10 && !achievements.includes('score_10')) {
      newAchievements.push({ id: 'score_10', name: 'Genius', description: 'Score 10 points' });
    }
    
    if (currentStreak >= 3 && !achievements.includes('streak_3')) {
      newAchievements.push({ id: 'streak_3', name: 'On Fire!', description: 'Answer 3 questions in a row correctly' });
    }
    
    if (currentStreak >= 5 && !achievements.includes('streak_5')) {
      newAchievements.push({ id: 'streak_5', name: 'Unstoppable!', description: 'Answer 5 questions in a row correctly' });
    }
    
    if (totalAnswered >= 10 && !achievements.includes('answered_10')) {
      newAchievements.push({ id: 'answered_10', name: 'Dedicated Learner', description: 'Answer 10 questions' });
    }
    
    if (newAchievements.length > 0) {
      setAchievements([...achievements, ...newAchievements.map(a => a.id)]);
      newAchievements.forEach(achievement => {
        let xpAmount = 0;
        switch(achievement.id) {
          case 'score_5': xpAmount = 25; break;
          case 'score_10': xpAmount = 50; break;
          case 'streak_3': xpAmount = 15; break;
          case 'streak_5': xpAmount = 30; break;
          case 'answered_10': xpAmount = 40; break;
          default: xpAmount = 10;
        }
        awardXp(xpAmount, `Achievement: ${achievement.name}`);
      });
    }
  };

  const handleNextQuestion = () => {
    const accuracy = correctAnswers / questionsAnswered;
    
    let newLevel = currentLevel;
    if (accuracy > 0.7) {
      if (currentLevel === 'easy') newLevel = 'medium';
      else if (currentLevel === 'medium') newLevel = 'hard';
    } else if (accuracy < 0.4) {
      if (currentLevel === 'hard') newLevel = 'medium';
      else if (currentLevel === 'medium') newLevel = 'easy';
    }
    
    setCurrentLevel(newLevel);
    generateQuestion(newLevel, currentSubject);
  };

  const handleChangeSubject = (subject) => {
    setCurrentSubject(subject);
    generateQuestion(currentLevel, subject);
  };

  const handleRestart = () => {
    setCurrentLevel('easy');
    setCurrentSubject('math');
    setScore(0);
    setQuestionsAnswered(0);
    setCorrectAnswers(0);
    setQuizHistory([]);
    setStreak(0);
    setMaxStreak(0);
    setAchievements([]);
    setSubjectStats({
      math: { answered: 0, correct: 0 },
      science: { answered: 0, correct: 0 },
      history: { answered: 0, correct: 0 },
      geography: { answered: 0, correct: 0 }
    });
    setQuestionTypeStats({
      'multiple-choice': { answered: 0, correct: 0 },
      'fill-blank': { answered: 0, correct: 0 },
      'matching': { answered: 0, correct: 0 },
      'drag-drop': { answered: 0, correct: 0 },
      'true-false': { answered: 0, correct: 0 },
      'multiple-answer': { answered: 0, correct: 0 }
    });
    setXp(0);
    setLevel(1);
    setLevelTitle('Beginner');
    setXpToNextLevel(100);
    setXpProgress(0);
    setSubjectXp({
      math: 0,
      science: 0,
      history: 0,
      geography: 0
    });
    setRecentXpEvents([]);
    setBadges([]);
    setUnlockedBadges([]);
    generateQuestion('easy', 'math');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const isSubmitEnabled = () => {
    if (!currentQuestion) return false;
    
    switch(currentQuestion.type) {
      case 'multiple-choice':
      case 'true-false':
        return !!selectedAnswer;
      case 'fill-blank':
        return !!selectedAnswer.trim();
      case 'multiple-answer':
        return selectedAnswers.length > 0;
      case 'matching':
      case 'drag-drop':
        return Object.keys(matches).length === Object.keys(currentQuestion.correctMatches || currentQuestion.correctPairs).length;
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if (currentQuestion && currentQuestion.stepByStepSolution) {
      if (currentStep < currentQuestion.stepByStepSolution.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleStepByStep = () => {
    setShowStepByStep(!showStepByStep);
    setCurrentStep(0);
  };

  const renderStepByStepSolution = () => {
    if (!currentQuestion || !currentQuestion.stepByStepSolution) return null;
    
    const steps = currentQuestion.stepByStepSolution;
    const currentStepData = steps[currentStep];
    
    return (
      <div className="step-by-step-solution">
        <h3>Step-by-Step Solution</h3>
        <div className="step-navigation">
          <button 
            onClick={handlePrevStep}
            disabled={currentStep === 0}
            className="step-nav-btn"
          >
            Previous Step
          </button>
          <span className="step-counter">
            Step {currentStep + 1} of {steps.length}
          </span>
          <button 
            onClick={handleNextStep}
            disabled={currentStep === steps.length - 1}
            className="step-nav-btn"
          >
            Next Step
          </button>
        </div>
        <div className="step-content">
          <div className="step-number">Step {currentStepData.step}</div>
          <div className="step-description">{currentStepData.description}</div>
        </div>
        {currentStep === steps.length - 1 && (
          <div className="solution-complete">
            <p>You've completed the step-by-step solution!</p>
          </div>
        )}
      </div>
    );
  };

  const awardXp = (amount, reason, subject = null) => {
    setXp(prev => prev + amount);
    
    if (subject) {
      setSubjectXp(prev => ({
        ...prev,
        [subject]: prev[subject] + amount
      }));
     
      if (subjectXp[subject] + amount >= XP_CONFIG.SUBJECT_MASTERY.threshold && 
          subjectXp[subject] < XP_CONFIG.SUBJECT_MASTERY.threshold) {
        const masteryBonus = XP_CONFIG.SUBJECT_MASTERY.bonus;
        setXp(prev => prev + masteryBonus);
        addXpEvent(masteryBonus, `Mastery Bonus: ${subjectsConfig[subject].name}`);
      }
    }
    
    setEarnedXp(amount);
    setShowXpAnimation(true);
    setTimeout(() => setShowXpAnimation(false), 2000);

    addXpEvent(amount, reason);
  };

  const addXpEvent = (amount, reason) => {
    const newEvent = {
      id: Date.now(),
      amount,
      reason,
      timestamp: new Date()
    };
    
    setRecentXpEvents(prev => [newEvent, ...prev.slice(0, 4)]);
  };

  const calculateXpForAnswer = (isCorrect, timeLeft, isFirstTry = true) => {
    if (!isCorrect) return 0;
    
    let xpEarned = XP_CONFIG.BASE_XP[currentLevel] || XP_CONFIG.BASE_XP.medium;
   
    Object.entries(XP_CONFIG.STREAK_MULTIPLIER)
      .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
      .forEach(([streakThreshold, multiplier]) => {
        if (streak >= parseInt(streakThreshold)) {
          xpEarned = Math.round(xpEarned * multiplier);
        }
      });
    
    const timeBonus = Math.round((timeLeft / 30) * XP_CONFIG.TIME_BONUS);
    xpEarned += timeBonus;
    
    if (isFirstTry) {
      xpEarned += XP_CONFIG.PERFECT_ANSWER_BONUS;
    }
    
    return xpEarned;
  };

  const XpAnimation = () => {
    if (!showXpAnimation) return null;
    
    return (
      <div className="xp-animation">
        +{earnedXp} XP!
      </div>
    );
  };

  const renderXpProgress = () => {
    return (
      <div className="xp-progress-container">
        <div className="xp-level-info">
          <span className="level-title">Level {level}: {levelTitle}</span>
          <span className="xp-count">{xp} XP</span>
        </div>
        <div className="xp-progress-bar">
          <div 
            className="xp-progress-fill" 
            style={{ width: `${xpProgress}%` }}
          ></div>
        </div>
        <div className="xp-to-next-level">
          {xpToNextLevel - xp} XP to next level
        </div>
      </div>
    );
  };

  const renderSubjectXp = () => {
    return (
      <div className="subject-xp-panel">
        <h3>Subject Mastery</h3>
        {Object.entries(subjectXp).map(([subject, xp]) => (
          <div key={subject} className="subject-xp-item">
            <div className="subject-xp-header">
              <span className="subject-xp-name">
                {subjectsConfig[subject]?.icon} {subjectsConfig[subject]?.name}
              </span>
              <span className="subject-xp-amount">{xp} XP</span>
            </div>
            <div className="subject-xp-bar">
              <div 
                className="subject-xp-fill"
                style={{ 
                  width: `${Math.min(100, (xp / XP_CONFIG.SUBJECT_MASTERY.threshold) * 100)}%`,
                  background: subjectsConfig[subject]?.color || '#4b6cb7'
                }}
              ></div>
            </div>
            <div className="subject-xp-mastery">
              {xp >= XP_CONFIG.SUBJECT_MASTERY.threshold 
                ? 'Mastered!' 
                : `${XP_CONFIG.SUBJECT_MASTERY.threshold - xp} XP to mastery`}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderRecentXpEvents = () => {
    return (
      <div className="recent-xp-events">
        <h3>Recent XP</h3>
        {recentXpEvents.length > 0 ? (
          <ul className="xp-events-list">
            {recentXpEvents.map(event => (
              <li key={event.id} className="xp-event-item">
                <span className="xp-event-amount">+{event.amount} XP</span>
                <span className="xp-event-reason">{event.reason}</span>
                <span className="xp-event-time">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No XP earned yet. Answer questions to earn XP!</p>
        )}
      </div>
    );
  };

  useEffect(() => {
    checkForBadges();
  }, [score, streak, questionsAnswered, subjectStats, questionTypeStats]);

  const checkForLevelBadges = (currentLevel) => {
    const newBadges = [];
    
    if (currentLevel >= 5 && !badges.includes('level5')) {
      newBadges.push(LEVEL_CONFIG.BADGES.level5);
    }
    
    if (currentLevel >= 10 && !badges.includes('level10')) {
      newBadges.push(LEVEL_CONFIG.BADGES.level10);
    }
    
    if (currentLevel >= 15 && !badges.includes('level15')) {
      newBadges.push(LEVEL_CONFIG.BADGES.level15);
    }
    
    if (newBadges.length > 0) {
      awardBadges(newBadges);
    }
  };

  const checkForBadges = () => {
    const newBadges = [];
    
    Object.entries(subjectXp).forEach(([subject, xp]) => {
      if (xp >= XP_CONFIG.SUBJECT_MASTERY.threshold) {
        const badgeId = `${subject}Master`;
        if (!badges.includes(badgeId) && LEVEL_CONFIG.BADGES[badgeId]) {
          newBadges.push(LEVEL_CONFIG.BADGES[badgeId]);
        }
      }
    });
    
    Object.entries(questionTypeStats).forEach(([type, stats]) => {
      if (stats.correct >= 50 && type === 'multiple-choice' && !badges.includes('multipleChoiceExpert')) {
        newBadges.push(LEVEL_CONFIG.BADGES.multipleChoiceExpert);
      }
      if (stats.correct >= 30 && type === 'fill-blank' && !badges.includes('fillBlankExpert')) {
        newBadges.push(LEVEL_CONFIG.BADGES.fillBlankExpert);
      }
      if (stats.correct >= 20 && type === 'matching' && !badges.includes('matchingExpert')) {
        newBadges.push(LEVEL_CONFIG.BADGES.matchingExpert);
      }
      if (stats.correct >= 15 && type === 'drag-drop' && !badges.includes('dragDropExpert')) {
        newBadges.push(LEVEL_CONFIG.BADGES.dragDropExpert);
      }
    });
    
    if (streak >= 5 && !badges.includes('streak5')) {
      newBadges.push(LEVEL_CONFIG.BADGES.streak5);
    }
    if (streak >= 10 && !badges.includes('streak10')) {
      newBadges.push(LEVEL_CONFIG.BADGES.streak10);
    }
    
    if (score >= 20 && !badges.includes('perfectionist')) {
      newBadges.push(LEVEL_CONFIG.BADGES.perfectionist);
    }
    if (questionsAnswered >= 30 && !badges.includes('speedDemon')) {
      newBadges.push(LEVEL_CONFIG.BADGES.speedDemon);
    }
    
    if (newBadges.length > 0) {
      awardBadges(newBadges);
    }
  };

  const awardBadges = (badgesToAward) => {
    const newBadgeIds = badgesToAward.map(badge => badge.id);
    setBadges(prev => [...prev, ...newBadgeIds]);
    setUnlockedBadges(badgesToAward);    
    
    badgesToAward.forEach(badge => {
      awardXp(50, `Badge: ${badge.name}`);
    });
    
    setTimeout(() => setUnlockedBadges([]), 3000);
  };

  const LevelUpAnimation = () => {
    if (!showLevelUp) return null;
    
    return (
      <div className="level-up-animation" style={{ color: newLevel.color }}>
        <div className="level-up-content">
          <div className="level-up-badge">{newLevel.badge}</div>
          <h2>Level Up!</h2>
          <h3>You reached Level {newLevel.level}</h3>
          <p>{newLevel.title}</p>
        </div>
      </div>
    );
  };

  
  const BadgeUnlockedAnimation = () => {
    if (unlockedBadges.length === 0) return null;
    
    return (
      <div className="badge-unlocked-animation">
        <div className="badge-unlocked-content">
          <h2>Badge Unlocked!</h2>
          {unlockedBadges.map(badge => (
            <div key={badge.id} className="unlocked-badge" style={{ borderColor: badge.color }}>
              <div className="badge-icon" style={{ color: badge.color }}>
                {badge.icon}
              </div>
              <div className="badge-info">
                <h3>{badge.name}</h3>
                <p>{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProfileModal = () => {
    if (!showProfile) return null;
    
    return (
      <div className="profile-modal">
        <div className="profile-content">
          <button className="close-profile-btn" onClick={() => setShowProfile(false)}>
            ×
          </button>
          
          <h2>Your Learning Profile</h2>
          
          <div className="profile-header">
            <div className="profile-level" style={{ color: LEVEL_CONFIG.LEVELS[level - 1]?.color }}>
              <span className="level-badge">{LEVEL_CONFIG.LEVELS[level - 1]?.badge}</span>
              <div className="level-info">
                <h3>Level {level}</h3>
                <p>{levelTitle}</p>
              </div>
            </div>
            
            <div className="profile-stats">
              <div className="profile-stat">
                <span className="stat-value">{xp}</span>
                <span className="stat-label">Total XP</span>
              </div>
              <div className="profile-stat">
                <span className="stat-value">{questionsAnswered}</span>
                <span className="stat-label">Questions</span>
              </div>
              <div className="profile-stat">
                <span className="stat-value">{Math.round((correctAnswers / questionsAnswered) * 100) || 0}%</span>
                <span className="stat-label">Accuracy</span>
              </div>
            </div>
          </div>
          
          <div className="profile-badges">
            <h3>Your Badges</h3>
            {badges.length > 0 ? (
              <div className="badges-grid">
                {Object.values(LEVEL_CONFIG.BADGES).map(badge => (
                  <div 
                    key={badge.id} 
                    className={`badge-item ${badges.includes(badge.id) ? 'unlocked' : 'locked'}`}
                    title={badges.includes(badge.id) ? badge.description : 'Locked'}
                  >
                    <div 
                      className="badge-icon" 
                      style={{ 
                        color: badges.includes(badge.id) ? badge.color : '#ccc',
                        backgroundColor: badges.includes(badge.id) ? `${badge.color}20` : '#f5f5f5'
                      }}
                    >
                      {badge.icon}
                    </div>
                    <div className="badge-name">{badge.name}</div>
                    {!badges.includes(badge.id) && <div className="badge-locked">🔒</div>}
                  </div>
                ))}
              </div>
            ) : (
              <p>No badges yet. Keep learning to unlock badges!</p>
            )}
          </div>
          
          <div className="profile-subjects">
            <h3>Subject Mastery</h3>
            {Object.entries(subjectXp).map(([subject, xp]) => (
              <div key={subject} className="subject-mastery">
                <div className="subject-mastery-header">
                  <span className="subject-icon">{subjectsConfig[subject]?.icon}</span>
                  <span className="subject-name">{subjectsConfig[subject]?.name}</span>
                  <span className="mastery-xp">{xp} XP</span>
                </div>
                <div className="mastery-bar">
                  <div 
                    className="mastery-progress"
                    style={{ 
                      width: `${Math.min(100, (xp / XP_CONFIG.SUBJECT_MASTERY.threshold) * 100)}%`,
                      backgroundColor: subjectsConfig[subject]?.color
                    }}
                  ></div>
                </div>
                <div className="mastery-status">
                  {xp >= XP_CONFIG.SUBJECT_MASTERY.threshold 
                    ? 'Mastered!' 
                    : `${Math.round((xp / XP_CONFIG.SUBJECT_MASTERY.threshold) * 100)}% Mastered`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  
  const handleNaturalLanguageQuestion = async (question) => {
    setIsProcessing(true);
   
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: question,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const parsedIntent = NLP_UTILS.parseQuestion(question);
  
    const matchedQuestion = NLP_UTILS.findMatchingQuestion(parsedIntent);
    
    const botMessage = {
      id: Date.now() + 1,
      type: 'bot',
      content: `I found a ${matchedQuestion.difficulty} ${matchedQuestion.subject} question for you!`,
      question: matchedQuestion,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, botMessage]);
    setIsProcessing(false);

    setTimeout(() => {
      setCurrentQuestion(matchedQuestion);
      setCurrentSubject(matchedQuestion.subject);
      setCurrentLevel(matchedQuestion.difficulty);
            
      setSelectedAnswer('');
      setSelectedAnswers([]);
      setMatches({});
      setShowExplanation(false);
      setShowHint(false);
      setTimeLimit(30);
      setTimerActive(true);
      
      
      if (matchedQuestion.type === 'drag-drop') {
        setDragItems([...matchedQuestion.items].sort(() => Math.random() - 0.5));
      }
    }, 500);
  };

  
  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (userInput.trim() === '' || isProcessing) return;
    
    handleNaturalLanguageQuestion(userInput);
    setUserInput('');
  };


  const renderChatInterface = () => {
    if (!showChat) return null;
    
    return (
      <div className="chat-interface">
        <div className="chat-header">
          <h3>AI Tutor Chat</h3>
          <button 
            className="close-chat-btn"
            onClick={() => setShowChat(false)}
          >
            ×
          </button>
        </div>
        
        <div className="chat-messages">
          {chatMessages.map(message => (
            <div 
              key={message.id} 
              className={`chat-message ${message.type}`}
            >
              <div className="message-content">
                {message.content}
                {message.question && (
                  <button 
                    className="view-question-btn"
                    onClick={() => {
                      setCurrentQuestion(message.question);
                      setCurrentSubject(message.question.subject);
                      setCurrentLevel(message.question.difficulty);
                      setShowChat(false);
                    }}
                  >
                    View Question
                  </button>
                )}
              </div>
              <div className="message-time">
                {new Date(message.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="chat-message bot">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <form className="chat-input-form" onSubmit={handleChatSubmit}>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask a question about any subject..."
            disabled={isProcessing}
          />
          <button type="submit" disabled={isProcessing}>
            {isProcessing ? '...' : 'Send'}
          </button>
        </form>
      </div>
    );
  };

  
  const renderSuggestedQuestions = () => {
    const suggestions = [
      "Give me an easy math question",
      "I want a science question about planets",
      "Ask me a history question about presidents",
      "Give me a challenging geography question",
      "Test me with a multiple choice question",
      "I want to practice fill in the blank questions"
    ];
    
    return (
      <div className="suggested-questions">
        <h4>Try asking:</h4>
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className="suggestion-btn"
            onClick={() => handleNaturalLanguageQuestion(suggestion)}
            disabled={isProcessing}
          >
            {suggestion}
          </button>
        ))}
      </div>
    );
  };

  
  const handleInterestChange = (category, value) => {
    setInterestProfile(prev => {
      if (category === 'selectedSubjects') {
        const newSubjects = prev.selectedSubjects.includes(value)
          ? prev.selectedSubjects.filter(subject => subject !== value)
          : [...prev.selectedSubjects, value];
        return { ...prev, selectedSubjects: newSubjects };
      }
      
      if (category === 'interestTags') {
        const newTags = prev.interestTags.includes(value)
          ? prev.interestTags.filter(tag => tag !== value)
          : [...prev.interestTags, value];
        return { ...prev, interestTags: newTags };
      }
      
      if (category === 'preferredQuestionTypes') {
        const newTypes = prev.preferredQuestionTypes.includes(value)
          ? prev.preferredQuestionTypes.filter(type => type !== value)
          : [...prev.preferredQuestionTypes, value];
        return { ...prev, preferredQuestionTypes: newTypes };
      }
      
      return { ...prev, [category]: value };
    });
  };

  
  const renderInterestProfileModal = () => {
    if (!showInterestProfile) return null;
    
    return (
      <div className="interest-profile-modal">
        <div className="interest-profile-content">
          <button 
            className="close-profile-btn" 
            onClick={() => setShowInterestProfile(false)}
          >
            ×
          </button>
          
          <h2>Your Learning Preferences</h2>
          
          <div className="profile-section">
            <h3>Subjects</h3>
            <div className="interests-grid">
              {Object.entries(INTEREST_CATEGORIES).map(([key, category]) => (
                <div 
                  key={key}
                  className={`interest-item ${interestProfile.selectedSubjects.includes(key) ? 'selected' : ''}`}
                  onClick={() => handleInterestChange('selectedSubjects', key)}
                >
                  <span className="interest-icon">{subjectsConfig[key]?.icon}</span>
                  <span className="interest-name">{category.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="profile-section">
            <h3>Preferred Difficulty</h3>
            <div className="difficulty-selector">
              {['easy', 'medium', 'hard'].map(difficulty => (
                <button
                  key={difficulty}
                  className={`difficulty-btn ${interestProfile.preferredDifficulty === difficulty ? 'active' : ''}`}
                  onClick={() => handleInterestChange('preferredDifficulty', difficulty)}
                >
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="profile-section">
            <h3>Question Types</h3>
            <div className="question-types-selector">
              {Object.entries(questionTypes).map(([key, type]) => (
                <div
                  key={key}
                  className={`question-type-item ${interestProfile.preferredQuestionTypes.includes(key) ? 'selected' : ''}`}
                  onClick={() => handleInterestChange('preferredQuestionTypes', key)}
                >
                  <span className="type-icon">{type.icon}</span>
                  <span className="type-name">{type.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="profile-section">
            <h3>Your Interests</h3>
            <div className="tags-input">
              <input
                type="text"
                placeholder="Add interests (e.g., space, animals, ancient history)"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    handleInterestChange('interestTags', e.target.value.trim().toLowerCase());
                    e.target.value = '';
                  }
                }}
              />
              <small>Press Enter to add interests</small>
            </div>
            <div className="tags-list">
              {interestProfile.interestTags.map(tag => (
                <span key={tag} className="tag">
                  {tag}
                  <button onClick={() => handleInterestChange('interestTags', tag)}>×</button>
                </span>
              ))}
            </div>
          </div>
          
          <button 
            className="save-profile-btn"
            onClick={() => setShowInterestProfile(false)}
          >
            Save Preferences
          </button>
        </div>
      </div>
    );
  };

  
  const renderLearningPath = () => {
    if (learningPath.length === 0) return null;
    
    return (
      <div className="learning-path-panel">
        <h3>Your Learning Path</h3>
        <div className="path-items">
          {learningPath.map((item, index) => (
            <div key={index} className={`path-item ${item.priority}`}>
              <div className="path-item-header">
                <span className="subject-icon">{subjectsConfig[item.subject]?.icon}</span>
                <span className="path-priority">{item.priority}</span>
              </div>
              <div className="path-item-content">
                <p>{item.description}</p>
                <small>{item.targetQuestions} questions recommended</small>
              </div>
              <button 
                className="path-action-btn"
                onClick={() => generateQuestion('personalized', item.subject)}
              >
                Start
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };


  const renderPersonalizedSuggestions = () => {
    if (personalizedSuggestions.length === 0) return null;
    
    return (
      <div className="personalized-suggestions">
        <h3>Recommended For You</h3>
        {personalizedSuggestions.map((question, index) => (
          <div 
            key={index} 
            className="suggestion-item"
            onClick={() => {
              setCurrentQuestion(question);
              setCurrentSubject(question.subject);
              setCurrentLevel(question.difficulty);
              setShowExplanation(false);
              setShowHint(false);
              setTimeLimit(30);
              setTimerActive(true);
            }}
          >
            <div className="suggestion-header">
              <span className="subject-icon">{subjectsConfig[question.subject]?.icon}</span>
              <span className="question-type">{questionTypes[question.type]?.icon}</span>
              <span className="difficulty">{question.difficulty}</span>
            </div>
            <p className="suggestion-text">{question.question}</p>
          </div>
        ))}
        <button 
          className="personalized-mode-btn"
          onClick={() => generateQuestion('personalized', 'personalized')}
        >
          🎯 Personalized Learning Mode
        </button>
      </div>
    );
  };

  
  const handleAnswerSelect = (answer) => {
    processTracker.addStep('answer_selected', { answer });
    setSolvingSteps(prev => [...prev, { 
      action: 'selected_answer', 
      description: `Selected answer: ${answer}` 
    }]);
    setEmotionCues(prev => ({ ...prev, answerChanges: prev.answerChanges + 1 }));
    setSelectedAnswer(answer);
  };

  const handleMultipleAnswerSelect = (answer) => {
    processTracker.addStep('answer_toggled', { answer, selected: !selectedAnswers.includes(answer) });
    setSolvingSteps(prev => [...prev, { 
      action: 'toggled_answer', 
      description: `${selectedAnswers.includes(answer) ? 'Deselected' : 'Selected'} answer: ${answer}` 
    }]);
    
    setSelectedAnswers(prev => {
      if (prev.includes(answer)) {
        return prev.filter(a => a !== answer);
      } else {
        return [...prev, answer];
      }
    });
  };

  
  const handleMatchSelect = (leftItem, rightItem) => {
    processTracker.addStep('match_made', { leftItem, rightItem });
    setSolvingSteps(prev => [...prev, { 
      action: 'made_match', 
      description: `Matched ${leftItem} with ${rightItem}` 
    }]);
    
    setMatches(prev => {
      const newMatches = { ...prev };
      
      Object.keys(newMatches).forEach(key => {
        if (newMatches[key] === rightItem) {
          delete newMatches[key];
        }
      });
        
      if (leftItem) {
        newMatches[leftItem] = rightItem;
      }
      
      return newMatches;
    });
  };

  
  const handleShowHint = () => {
    processTracker.addStep('hint_used', { hint: currentQuestion.hints[0] });
    setSolvingSteps(prev => [...prev, { 
      action: 'used_hint', 
      description: 'Used a hint to help solve the problem' 
    }]);
    setEmotionCues(prev => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }));
    setShowHint(true);
  };

  
  const renderProcessAnalysisModal = () => {
    if (!showProcessAnalysis || !processAnalysis) return null;
    
    return (
      <div className="process-analysis-modal">
        <div className="process-analysis-content">
          <button 
            className="close-analysis-btn" 
            onClick={() => setShowProcessAnalysis(false)}
          >
            ×
          </button>
          
          <h2>Problem-Solving Analysis</h2>
          
          <div className="analysis-summary">
            <div className="efficiency-score">
              <div className="score-circle">
                <span className="score-value">{processAnalysis.efficiencyScore}</span>
                <span className="score-label">Efficiency</span>
              </div>
            </div>
            
            <div className="summary-stats">
              <div className="stat">
                <span className="stat-value">{Math.round(processAnalysis.totalTime / 1000)}s</span>
                <span className="stat-label">Time Spent</span>
              </div>
              <div className="stat">
                <span className="stat-value">{processAnalysis.stepCount}</span>
                <span className="stat-label">Steps Taken</span>
              </div>
              <div className="stat">
                <span className="stat-value">{processAnalysis.patterns.hintUsage}</span>
                <span className="stat-label">Hints Used</span>
              </div>
            </div>
          </div>
          
          {processAnalysis.optimalComparison && (
            <div className="optimal-comparison">
              <h3>Comparison with Optimal Approach</h3>
              <div className="comparison-stats">
                <div className="comparison-stat">
                  <span className="stat-value">{processAnalysis.optimalComparison.similarity}%</span>
                  <span className="stat-label">Similarity to Optimal</span>
                </div>
                <div className="comparison-stat">
                  <span className="stat-value">{processAnalysis.optimalComparison.userStepCount}</span>
                  <span className="stat-label">Your Steps</span>
                </div>
                <div className="comparison-stat">
                  <span className="stat-value">{processAnalysis.optimalComparison.optimalStepCount}</span>
                  <span className="stat-label">Optimal Steps</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="process-insights">
            <h3>Insights</h3>
            <ul>
              {processAnalysis.insights.map((insight, index) => (
                <li key={index}>{insight}</li>
              ))}
            </ul>
          </div>
          
          <div className="detailed-steps">
            <h3>Your Problem-Solving Steps</h3>
            <div className="steps-timeline">
              {processAnalysis.steps.map((step, index) => (
                <div key={index} className="step-item">
                  <div className="step-time">
                    +{Math.round(step.timeSinceStart / 1000)}s
                  </div>
                  <div className="step-content">
                    <div className="step-action">{step.action.replace(/_/g, ' ')}</div>
                    {step.data && Object.keys(step.data).length > 0 && (
                      <div className="step-data">
                        {Object.entries(step.data).map(([key, value]) => (
                          <span key={key} className="data-item">
                            {key}: {typeof value === 'object' ? JSON.stringify(value) : value}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="analysis-actions">
            <button className="analysis-btn" onClick={() => setShowProcessAnalysis(false)}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  
  const renderSolvingStepsPanel = () => {
    if (showExplanation || !currentQuestion) return null;
    
    return (
      <div className="solving-steps-panel">
        <h3>Your Solving Process</h3>
        <div className="steps-list">
          {solvingSteps.map((step, index) => (
            <div key={index} className="solving-step">
              <div className="step-indicator"></div>
              <div className="step-description">{step.description}</div>
            </div>
          ))}
        </div>
        {solvingSteps.length > 1 && (
          <button 
            className="view-analysis-btn"
            onClick={() => setShowProcessAnalysis(true)}
          >
            View Analysis
          </button>
        )}
      </div>
    );
  };

  
  const initWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 320, height: 240 } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setWebcamAccess(true);
      startEmotionDetection();
    } catch (error) {
      console.error("Error accessing webcam:", error);
      setWebcamAccess(false);
    }
  };

  const startEmotionDetection = () => {
    setEmotionDetectionEnabled(true);
    emotionCheckInterval.current = setInterval(() => { 
      simulateFacialExpressionAnalysis();
    }, 5000);
  };

  
  const stopEmotionDetection = () => {
    setEmotionDetectionEnabled(false);
    if (emotionCheckInterval.current) {
      clearInterval(emotionCheckInterval.current);
    }
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setWebcamAccess(false);
  };

  
  const simulateFacialExpressionAnalysis = () => {
    
    const randomFactor = Math.random();
    if (randomFactor < 0.1) {
      setEmotionCues(prev => ({ ...prev, timeSpent: prev.timeSpent + 10000 }));
    }
  };

  
  const trackTypingSpeed = (startTime, textLength) => {
    const timeElapsed = new Date() - startTime;
    const charactersPerMinute = (textLength / timeElapsed) * 60000;
    setEmotionCues(prev => ({ ...prev, typingSpeed: charactersPerMinute }));
  };

  
  const EmotionFeedback = () => {
    if (!showEmotionFeedback || !emotionDetectionEnabled) return null;
    
    return (
      <div 
        className="emotion-feedback"
        style={{ backgroundColor: `${userEmotion.color}20`, borderColor: userEmotion.color }}
      >
        <span className="emotion-emoji">{userEmotion.emoji}</span>
        <span className="emotion-message">
          {EMOTION_DETECTION.getEncouragement(userEmotion, checkAnswer())}
        </span>
      </div>
    );
  };

  
  const EmotionDetectionSettings = () => {
    return (
      <div className="emotion-settings">
        <h3>Emotion-Aware Learning</h3>
        <p>Allow the system to adjust difficulty based on your engagement level</p>
        
        <div className="emotion-toggle">
          <label>
            <input
              type="checkbox"
              checked={emotionDetectionEnabled}
              onChange={(e) => {
                if (e.target.checked) {
                  initWebcam();
                } else {
                  stopEmotionDetection();
                }
              }}
            />
            Enable Emotion Detection
          </label>
        </div>
        
        {emotionDetectionEnabled && (
          <div className="webcam-feed">
            <video 
              ref={videoRef} 
              autoPlay 
              muted 
              width="160" 
              height="120"
              style={{ display: webcamAccess ? 'block' : 'none' }}
            />
            {!webcamAccess && (
              <div className="webcam-placeholder">
                Camera access required for emotion detection
              </div>
            )}
          </div>
        )}
        
        <div className="current-emotion">
          <h4>Current Detection:</h4>
          <div 
            className="emotion-indicator"
            style={{ color: userEmotion.color }}
          >
            <span className="emotion-icon">{userEmotion.emoji}</span>
            <span className="emotion-name">{userEmotion.name}</span>
          </div>
        </div>
      </div>
    );
  };

  
  const renderSettingsPanel = () => {
    if (!showSettings) return null;
    
    return (
      <div className="settings-panel">
        <h3>Settings</h3>
        
        <EmotionDetectionSettings />
        
        <div className="setting-item">
          <label>Subject:</label>
          <select 
            value={currentSubject} 
            onChange={(e) => handleChangeSubject(e.target.value)}
          >
            {Object.entries(subjectsConfig).map(([key, config]) => (
              <option key={key} value={key}>
                {config.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="setting-item">
          <label>Initial Difficulty:</label>
          <select 
            value={currentLevel} 
            onChange={(e) => setCurrentLevel(e.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        
        <div className="setting-item">
          <label>Time per Question:</label>
          <select 
            value={timeLimit} 
            onChange={(e) => setTimeLimit(parseInt(e.target.value))}
          >
            <option value="15">15 seconds</option>
            <option value="30">30 seconds</option>
            <option value="45">45 seconds</option>
            <option value="60">60 seconds</option>
          </select>
        </div>
        
        <button className="close-btn" onClick={toggleSettings}>
          Close
        </button>
      </div>
    );
  };

  
  const startBreak = (breakType) => {
    setIsOnBreak(true);
    setShowBreakSuggestion(false);
    
    const breakDuration = FATIGUE_DETECTION.BREAK_TYPES[breakType].duration;
    setBreakTimeRemaining(breakDuration / 1000);
    
    breakTimerRef.current = setInterval(() => {
      setBreakTimeRemaining(prev => {
        if (prev <= 1) {
          endBreak();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  
  const endBreak = () => {
    setIsOnBreak(false);
    if (breakTimerRef.current) {
      clearInterval(breakTimerRef.current);
    }
    
    
    setFatigueMetrics(prev => ({
      ...prev,
      consecutiveWrongAnswers: 0,
      recentHintUsage: 0
    }));
  };

  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  
  const BreakSuggestion = () => {
    if (!showBreakSuggestion || isOnBreak) return null;
    
    return (
      <div className="break-suggestion">
        <div className="break-suggestion-content">
          <h3>🔄 Time for a Break!</h3>
          <p>{FATIGUE_DETECTION.BREAK_TYPES[breakType].message}</p>
          <p className="suggestion-text">Suggested: {currentBreakSuggestion}</p>
          <div className="break-actions">
            <button 
              className="break-btn accept"
              onClick={() => startBreak(breakType)}
            >
              Start {breakType.toLowerCase()} break
            </button>
            <button 
              className="break-btn dismiss"
              onClick={() => setShowBreakSuggestion(false)}
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    );
  };

  
  const BreakTimer = () => {
    if (!isOnBreak) return null;
    
    return (
      <div className="break-timer">
        <div className="break-timer-content">
          <h3>🌿 Break Time</h3>
          <div className="timer-display">{formatTime(breakTimeRemaining)}</div>
          <p>You're on a {breakType.toLowerCase()} break</p>
          <p className="break-suggestion">{currentBreakSuggestion}</p>
          <button 
            className="end-break-btn"
            onClick={endBreak}
          >
            End Break Early
          </button>
        </div>
      </div>
    );
  };

  
  const FatigueStatusPanel = () => {
    return (
      <div className="fatigue-status-panel">
        <h3>Learning Wellness</h3>
        
        <div className="fatigue-meter">
          <div className="meter-header">
            <span>Fatigue Level</span>
            <span>{Math.round(fatigueScore * 100)}%</span>
          </div>
          <div className="meter-bar">
            <div 
              className="meter-fill"
              style={{ width: `${fatigueScore * 100}%` }}
            ></div>
          </div>
          <div className="meter-labels">
            <span>Fresh</span>
            <span>Engaged</span>
            <span>Tired</span>
            <span>Fatigued</span>
          </div>
        </div>
        
        <div className="wellness-stats">
          <div className="wellness-stat">
            <span className="stat-label">Study Time</span>
            <span className="stat-value">
              {Math.round(fatigueMetrics.totalStudyTime / 60000)}m
            </span>
          </div>
          <div className="wellness-stat">
            <span className="stat-label">Questions</span>
            <span className="stat-value">{fatigueMetrics.questionCount}</span>
          </div>
          <div className="wellness-stat">
            <span className="stat-label">Accuracy</span>
            <span className="stat-value">
              {Math.round(fatigueMetrics.sessionAccuracy * 100)}%
            </span>
          </div>
        </div>
        
        <div className="wellness-tips">
          <h4>Wellness Tips</h4>
          <ul>
            <li>Take regular breaks every 25-30 minutes</li>
            <li>Stay hydrated while studying</li>
            <li>Practice the 20-20-20 rule for screen time</li>
            <li>Maintain good posture</li>
          </ul>
        </div>
        
        <button 
          className="manual-break-btn"
          onClick={() => {
            setBreakType('SHORT');
            setCurrentBreakSuggestion(FATIGUE_DETECTION.getBreakSuggestion('SHORT'));
            startBreak('SHORT');
          }}
        >
          🏖️ Take a Break
        </button>
      </div>
    );
  };

  
  const handleWritingSubmit = () => {
    if (writingResponse.trim().length < 10) {
      alert('Please write a more detailed response before submitting.');
      return;
    }

    const evaluation = WRITING_EVALUATION.evaluateWriting(writingResponse, currentQuestion);
    setWritingEvaluation(evaluation);
    setShowWritingEvaluation(true);
    
    
    const xpEarned = Math.round(evaluation.overallScore / 10);
    awardXp(xpEarned, `Writing evaluation: ${evaluation.overallScore}%`);
    
    
    setQuizHistory([...quizHistory, {
      question: currentQuestion.question,
      userAnswer: writingResponse.substring(0, 100) + '...',
      evaluation: evaluation,
      isCorrect: evaluation.overallScore >= 70,
      subject: currentQuestion.subject,
      type: currentQuestion.type
    }]);
  };

  
  const renderWritingQuestion = () => {
    if (!currentQuestion || currentQuestion.type !== 'writing') return null;

    return (
      <div className="writing-container">
        <div className="writing-instructions">
          <h4>Instructions:</h4>
          <p>{currentQuestion.instructions}</p>
          {currentQuestion.evaluationCriteria && (
            <div className="evaluation-criteria">
              <p><strong>Word count:</strong> {currentQuestion.evaluationCriteria.minWords} - {currentQuestion.evaluationCriteria.maxWords} words</p>
              <p><strong>Include:</strong> {currentQuestion.evaluationCriteria.requiredConcepts.join(', ')}</p>
            </div>
          )}
        </div>

        <div className="writing-area">
          <textarea
            value={writingResponse}
            onChange={(e) => setWritingResponse(e.target.value)}
            placeholder="Type your response here..."
            rows="6"
            disabled={showWritingEvaluation}
          />
          <div className="writing-stats">
            <span className="word-count">{wordCount} words</span>
            {currentQuestion.evaluationCriteria && (
              <span className={`word-limit ${wordCount > currentQuestion.evaluationCriteria.maxWords ? 'over-limit' : ''}`}>
                {Math.max(0, currentQuestion.evaluationCriteria.maxWords - wordCount)} words remaining
              </span>
            )}
          </div>
        </div>

        <div className="writing-actions">
          {!showWritingEvaluation ? (
            <button 
              className="submit-writing-btn"
              onClick={handleWritingSubmit}
              disabled={wordCount < (currentQuestion.evaluationCriteria?.minWords || 10)}
            >
              Evaluate Writing
            </button>
          ) : (
            <button 
              className="next-question-btn"
              onClick={handleNextQuestion}
            >
              Next Question
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderWritingEvaluation = () => {
    if (!showWritingEvaluation || !writingEvaluation) return null;

    return (
      <div className="writing-evaluation">
        <h3>Writing Evaluation</h3>
        
        <div className="evaluation-summary">
          <div className="overall-score">
            <div className="score-circle">
              <span className="score-value">{writingEvaluation.overallScore}%</span>
              <span className="score-label">Overall Score</span>
            </div>
          </div>
          
          <div className="detailed-scores">
            <div className="score-item">
              <span className="score-category">Grammar</span>
              <span className="score-value">{writingEvaluation.grammar.score}%</span>
            </div>
            <div className="score-item">
              <span className="score-category">Style</span>
              <span className="score-value">{writingEvaluation.style.score}%</span>
            </div>
            <div className="score-item">
              <span className="score-category">Structure</span>
              <span className="score-value">{writingEvaluation.structure.score}%</span>
            </div>
            <div className="score-item">
              <span className="score-category">Content</span>
              <span className="score-value">{writingEvaluation.content.score}%</span>
            </div>
          </div>
        </div>

        <div className="feedback-section">
          <h4>Feedback & Suggestions</h4>
          <ul className="feedback-list">
            {WRITING_EVALUATION.generateFeedback(writingEvaluation).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="additional-metrics">
          <div className="metric">
            <span className="metric-label">Word Count</span>
            <span className="metric-value">{writingEvaluation.wordCount}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Readability</span>
            <span className="metric-value">{writingEvaluation.readibilityScore}%</span>
          </div>
        </div>
      </div>
    );
  };

  
const renderQuestionByType = () => {
  if (!currentQuestion) return null;
  
  switch(currentQuestion.type) {
    case 'multiple-choice':
      return (
        <div className="options-container">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={`option-btn ${selectedAnswer === option ? 'selected' : ''} ${showExplanation ? (option === currentQuestion.correctAnswer ? 'correct' : (selectedAnswer === option ? 'incorrect' : '')) : ''}`}
              onClick={() => handleAnswerSelect(option)}
              disabled={showExplanation}
            >
              {option}
            </button>
          ))}
        </div>
      );
    
    case 'fill-blank':
      return (
        <div className="fill-blank-container">
          <input
            type="text"
            value={selectedAnswer}
            onChange={(e) => {
              setSelectedAnswer(e.target.value);
              const startTime = e.timeStamp;
              setTimeout(() => {
                trackTypingSpeed(startTime, e.target.value.length);
              }, 1000);
            }}
            disabled={showExplanation}
            className="fill-blank-input"
            placeholder="Type your answer here"
          />
          {showExplanation && (
            <div className="correct-answer-display">
              Correct answer: {currentQuestion.correctAnswer}
            </div>
          )}
        </div>
      );
    
    case 'true-false':
      return (
        <div className="options-container true-false-container">
          <button
            className={`option-btn ${selectedAnswer === 'true' ? 'selected' : ''} ${showExplanation ? ('true' === currentQuestion.correctAnswer ? 'correct' : (selectedAnswer === 'true' ? 'incorrect' : '')) : ''}`}
            onClick={() => handleAnswerSelect('true')}
            disabled={showExplanation}
          >
            True
          </button>
          <button
            className={`option-btn ${selectedAnswer === 'false' ? 'selected' : ''} ${showExplanation ? ('false' === currentQuestion.correctAnswer ? 'correct' : (selectedAnswer === 'false' ? 'incorrect' : '')) : ''}`}
            onClick={() => handleAnswerSelect('false')}
            disabled={showExplanation}
          >
            False
          </button>
        </div>
      );
    
    case 'multiple-answer':
      return (
        <div className="options-container multiple-answer-container">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={`option-btn ${selectedAnswers.includes(option) ? 'selected' : ''} ${showExplanation ? (currentQuestion.correctAnswers.includes(option) ? 'correct' : (selectedAnswers.includes(option) ? 'incorrect' : '')) : ''}`}
              onClick={() => handleMultipleAnswerSelect(option)}
              disabled={showExplanation}
            >
              {option}
              {selectedAnswers.includes(option) && <span className="checkmark">✓</span>}
            </button>
          ))}
        </div>
      );
    
    case 'matching':
      return (
        <div className="matching-container">
          <div className="matching-columns">
            <div className="matching-left">
              <h4>Items</h4>
              {currentQuestion.leftColumn.map(item => (
                <div key={item} className="matching-item">
                  {item}
                </div>
              ))}
            </div>
            <div className="matching-right">
              <h4>Matches</h4>
              {currentQuestion.rightColumn.map(item => (
                <div 
                  key={item} 
                  className={`matching-item ${matches[currentQuestion.leftColumn.find(left => matches[left] === item)] ? 'matched' : ''} ${showExplanation ? (currentQuestion.correctMatches[currentQuestion.leftColumn.find(left => currentQuestion.correctMatches[left] === item)] === item ? 'correct-match' : 'incorrect-match') : ''}`}
                  onClick={() => {
                    const leftItem = currentQuestion.leftColumn.find(left => matches[left] === item);
                    handleMatchSelect(leftItem || null, leftItem ? null : item);
                  }}
                >
                  {item}
                  {matches[currentQuestion.leftColumn.find(left => matches[left] === item)] && (
                    <span className="match-indicator">← {currentQuestion.leftColumn.find(left => matches[left] === item)}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          {showExplanation && (
            <div className="matching-explanation">
              {Object.entries(currentQuestion.correctMatches).map(([left, right]) => (
                <div key={left} className="correct-match-pair">
                  {left} → {right}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    
    case 'drag-drop':
      return (
        <div className="drag-drop-container">
          <div className="drag-items">
            <h4>Drag items to correct categories:</h4>
            <div className="drag-source">
              {dragItems.map(item => (
                <div
                  key={item}
                  className="drag-item"
                  draggable={!showExplanation}
                  onDragStart={(e) => handleDragStart(e, item)}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="drop-targets">
            {currentQuestion.categories.map(category => (
              <div
                key={category}
                className="drop-zone"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, category)}
              >
                <h4>{category}</h4>
                {Object.entries(matches)
                  .filter(([_, cat]) => cat === category)
                  .map(([item, _]) => (
                    <div key={item} className="dropped-item">
                      {item}
                    </div>
                  ))}
              </div>
            ))}
          </div>
          {showExplanation && (
            <div className="drag-drop-explanation">
              {Object.entries(currentQuestion.correctPairs).map(([item, category]) => (
                <div key={item} className="correct-pair">
                  {item} → {category}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    
    case 'writing':
      return null;
    
    default:
      return (
        <div className="error-message">
          <p>Unknown question type. Please try another question.</p>
          <button onClick={handleNextQuestion}>Next Question</button>
        </div>
      );
  }
};

  
  const renderQuestion = () => {
    if (!currentQuestion) return null;
    
    switch(currentQuestion.type) {
      case 'multiple-choice':
        return (
          <div className="options-container">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className={`option-btn ${selectedAnswer === option ? 'selected' : ''} ${showExplanation ? (option === currentQuestion.correctAnswer ? 'correct' : (selectedAnswer === option ? 'incorrect' : '')) : ''}`}
                onClick={() => handleAnswerSelect(option)}
                disabled={showExplanation}
              >
                {option}
              </button>
            ))}
          </div>
        );
      
      case 'fill-blank':
        return (
          <div className="fill-blank-container">
            <input
              type="text"
              value={selectedAnswer}
              onChange={(e) => setSelectedAnswer(e.target.value)}
              disabled={showExplanation}
              className="fill-blank-input"
              placeholder="Type your answer here"
            />
            {showExplanation && (
              <div className="correct-answer-display">
                Correct answer: {currentQuestion.correctAnswer}
              </div>
            )}
          </div>
        );
      
      case 'true-false':
        return (
          <div className="options-container true-false-container">
            <button
              className={`option-btn ${selectedAnswer === 'true' ? 'selected' : ''} ${showExplanation ? ('true' === currentQuestion.correctAnswer ? 'correct' : (selectedAnswer === 'true' ? 'incorrect' : '')) : ''}`}
              onClick={() => handleAnswerSelect('true')}
              disabled={showExplanation}
            >
              True
            </button>
            <button
              className={`option-btn ${selectedAnswer === 'false' ? 'selected' : ''} ${showExplanation ? ('false' === currentQuestion.correctAnswer ? 'correct' : (selectedAnswer === 'false' ? 'incorrect' : '')) : ''}`}
              onClick={() => handleAnswerSelect('false')}
              disabled={showExplanation}
            >
              False
            </button>
          </div>
        );
      
      case 'multiple-answer':
        return (
          <div className="options-container multiple-answer-container">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className={`option-btn ${selectedAnswers.includes(option) ? 'selected' : ''} ${showExplanation ? (currentQuestion.correctAnswers.includes(option) ? 'correct' : (selectedAnswers.includes(option) ? 'incorrect' : '')) : ''}`}
                onClick={() => handleMultipleAnswerSelect(option)}
                disabled={showExplanation}
              >
                {option}
                {selectedAnswers.includes(option) && <span className="checkmark">✓</span>}
              </button>
            ))}
          </div>
        );
      
      case 'matching':
        return (
          <div className="matching-container">
            <div className="matching-columns">
              <div className="matching-left">
                <h4>Items</h4>
                {currentQuestion.leftColumn.map(item => (
                  <div key={item} className="matching-item">
                    {item}
                  </div>
                ))}
              </div>
              <div className="matching-right">
                <h4>Matches</h4>
                {currentQuestion.rightColumn.map(item => (
                  <div 
                    key={item} 
                    className={`matching-item ${matches[currentQuestion.leftColumn.find(left => matches[left] === item)] ? 'matched' : ''} ${showExplanation ? (currentQuestion.correctMatches[currentQuestion.leftColumn.find(left => currentQuestion.correctMatches[left] === item)] === item ? 'correct-match' : 'incorrect-match') : ''}`}
                    onClick={() => {
                      const leftItem = currentQuestion.leftColumn.find(left => matches[left] === item);
                      handleMatchSelect(leftItem || null, leftItem ? null : item);
                    }}
                  >
                    {item}
                    {matches[currentQuestion.leftColumn.find(left => matches[left] === item)] && (
                      <span className="match-indicator">← {currentQuestion.leftColumn.find(left => matches[left] === item)}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {showExplanation && (
              <div className="matching-explanation">
                {Object.entries(currentQuestion.correctMatches).map(([left, right]) => (
                  <div key={left} className="correct-match-pair">
                    {left} → {right}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      case 'drag-drop':
        return (
          <div className="drag-drop-container">
            <div className="drag-items">
              <h4>Drag items to correct categories:</h4>
              <div className="drag-source">
                {dragItems.map(item => (
                  <div
                    key={item}
                    className="drag-item"
                    draggable={!showExplanation}
                    onDragStart={(e) => handleDragStart(e, item)}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="drop-targets">
              {currentQuestion.categories.map(category => (
                <div
                  key={category}
                  className="drop-zone"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, category)}
                >
                  <h4>{category}</h4>
                  {Object.entries(matches)
                    .filter(([_, cat]) => cat === category)
                    .map(([item, _]) => (
                      <div key={item} className="dropped-item">
                        {item}
                      </div>
                    ))}
                </div>
              ))}
            </div>
            {showExplanation && (
              <div className="drag-drop-explanation">
                {Object.entries(currentQuestion.correctPairs).map(([item, category]) => (
                  <div key={item} className="correct-pair">
                    {item} → {category}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
        case 'writing':
        return (
          <>
            <h2 className="question-text">{currentQuestion.question}</h2>
            {renderWritingQuestion()}
            {renderWritingEvaluation()}
          </>
        );
      
      default:
        return (
          <>
            <h2 className="question-text">{currentQuestion.question}</h2>
            {renderQuestionByType()}
          </>
        );
    }
  };

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      <header className="app-header" style={{ background: subjectsConfig[currentSubject]?.gradient || subjectsConfig.math.gradient }}>
        <div className="header-top">
          <h1 style={{ marginLeft : 200}}>Personal AI Tutor</h1>
          <div className="header-xp">
            {renderXpProgress()}
          </div>
          <div className="header-controls">
            <button 
              className={`icon-btn ${emotionDetectionEnabled ? 'active' : ''}`}
              onClick={() => setShowSettings(true)}
              title="Emotion Settings"
            >
              {emotionDetectionEnabled ? userEmotion.emoji : '😊'}
            </button>
            <button 
              className={`icon-btn ${fatigueScore > 0.5 ? 'high-fatigue' : ''}`}
              onClick={() => setShowSettings(true)}
              title="Wellness Settings"
            >
              {fatigueScore > 0.7 ? '😴' : fatigueScore > 0.4 ? '😕' : '😊'}
            </button>
            <button 
              className={`icon-btn ${showChat ? 'active' : ''}`}
              onClick={() => setShowChat(!showChat)}
              title="Ask a Question"
            >
              💬
            </button>
            <button 
              className="icon-btn"
              onClick={() => setShowInterestProfile(true)}
              title="Learning Preferences"
            >
              ⚙️
            </button>
            <button className="icon-btn" onClick={() => setShowProfile(true)} title="View Profile">
              👤
            </button>
            <button className="icon-btn" onClick={toggleSettings} title="Settings">
              ⚙️
            </button>
            <button className="icon-btn" onClick={toggleDarkMode} title="Toggle Dark Mode">
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
        <p>Adaptive learning for your educational journey</p>
      </header>

      {renderChatInterface()}

      <LevelUpAnimation />
      
      <BadgeUnlockedAnimation />
      
      {renderProfileModal()}

      {renderInterestProfileModal()}

      {renderProcessAnalysisModal()}

      <EmotionFeedback />
      
      {renderSettingsPanel()}

      <BreakSuggestion />

      <BreakTimer />

      {showSettings && (
        <div className="settings-panel">
          <h3>Settings</h3>
          <div className="setting-item">
            <label>Subject:</label>
            <select 
              value={currentSubject} 
              onChange={(e) => handleChangeSubject(e.target.value)}
            >
              {Object.entries(subjectsConfig).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.name}
                </option>
              ))}
            </select>
          </div>
          <div className="setting-item">
            <label>Initial Difficulty:</label>
            <select 
              value={currentLevel} 
              onChange={(e) => setCurrentLevel(e.target.value)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div className="setting-item">
            <label>Time per Question:</label>
            <select 
              value={timeLimit} 
              onChange={(e) => setTimeLimit(parseInt(e.target.value))}
            >
              <option value="15">15 seconds</option>
              <option value="30">30 seconds</option>
              <option value="45">45 seconds</option>
              <option value="60">60 seconds</option>
            </select>
          </div>
          <button className="close-btn" onClick={toggleSettings}>
            Close
          </button>
        </div>
      )}

      <div className="main-container">
        <div className="quiz-container">
          <div className="subject-header">
            <span className="subject-icon">{subjectsConfig[currentSubject]?.icon || '?'}</span>
            <span className="subject-name">{subjectsConfig[currentSubject]?.name || 'Unknown'}</span>
            <span className="question-type-icon">
              {currentQuestion && questionTypes[currentQuestion.type]?.icon}
            </span>
            <span className="subject-difficulty">{currentLevel}</span>
          </div>

          <div className="stats-panel">
            <div className="stat">
              <span className="stat-label">Level:</span>
              <span className="stat-value">{currentLevel}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Score:</span>
              <span className="stat-value">{score}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Streak:</span>
              <span className="stat-value">{streak}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Accuracy:</span>
              <span className="stat-value">
                {questionsAnswered > 0 
                  ? `${Math.round((correctAnswers / questionsAnswered) * 100)}%` 
                  : '0%'}
              </span>
            </div>
          </div>

          <XpAnimation />

          <div className="timer-container">
            <div className="timer">
              Time: {timeLimit}s
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(timeLimit / 30) * 100}%` }}
              ></div>
            </div>
          </div>

          {currentQuestion ? (
            <div className="question-panel">
              <h2 className="question-text">{currentQuestion.question}</h2>
              
              {renderQuestion()}

              <div className="action-buttons">
                {!showExplanation && (
                  <>
                    <button 
                      className="hint-btn"
                      onClick={handleShowHint}
                      disabled={showHint}
                    >
                      {showHint ? 'Hint Shown' : '💡 Get Hint'}
                    </button>
                    <button 
                      className="submit-btn"
                      onClick={handleSubmit}
                      disabled={!isSubmitEnabled()}
                    >
                      Submit Answer
                    </button>
                  </>
                )}
              </div>

              {showHint && !showExplanation && (
                <div className="hint-panel">
                  <h4>Hint:</h4>
                  <p>{currentQuestion.hints[0]}</p>
                </div>
              )}

               {showExplanation && (
        <div className="explanation-panel">
          <div className={`result-feedback ${checkAnswer() ? 'correct' : 'incorrect'}`}>
            {checkAnswer() 
              ? 'Correct! Well done!' 
              : timeLimit === 0 
                ? 'Time Up!' 
                : 'Incorrect. Try to understand the explanation below.'}
          </div>
          <div className="explanation">
            <h3>Explanation:</h3>
            <p>{currentQuestion.explanation}</p>
          </div>
          
          {currentQuestion.stepByStepSolution && (
            <div className="step-by-step-section">
              <button 
                className={`step-by-step-toggle ${showStepByStep ? 'active' : ''}`}
                onClick={toggleStepByStep}
              >
                {showStepByStep ? 'Hide Step-by-Step Solution' : 'Show Step-by-Step Solution'}
              </button>
              
              {showStepByStep && renderStepByStepSolution()}
            </div>
          )}
          
          <button className="next-btn" onClick={handleNextQuestion}>
            Next Question
          </button>
         </div>
        )}
            </div>
          ) : (
            <p>Loading question...</p>
          )}
        </div>

        <div className="side-panels">
          <div className="subject-selector-panel">
            <h3>Subjects</h3>
            <div className="subject-buttons">
              {Object.entries(subjectsConfig).map(([key, config]) => (
                <button
                  key={key}
                  className={`subject-btn ${currentSubject === key ? 'active' : ''}`}
                  onClick={() => handleChangeSubject(key)}
                  style={{ 
                    background: currentSubject === key ? config.color : 'var(--card-bg)',
                    color: currentSubject === key ? 'white' : 'var(--text-dark)'
                  }}
                >
                  <span className="subject-btn-icon">{config.icon}</span>
                  <span className="subject-btn-name">{config.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="question-type-stats-panel">
            <h3>Question Type Performance</h3>
            {Object.entries(questionTypeStats).map(([type, stats]) => (
              stats.answered > 0 && (
                <div key={type} className="question-type-stat">
                  <div className="question-type-stat-header">
                    <span className="question-type-stat-name">{questionTypes[type]?.name}</span>
                    <span className="question-type-stat-accuracy">
                      {Math.round((stats.correct / stats.answered) * 100)}%
                    </span>
                  </div>
                  <div className="question-type-stat-bar">
                    <div 
                      className="question-type-stat-fill"
                      style={{ 
                        width: `${(stats.correct / stats.answered) * 100}%`,
                        background: subjectsConfig[currentSubject]?.color || '#4b6cb7'
                      }}
                    ></div>
                  </div>
                  <div className="question-type-stat-details">
                    {stats.correct}/{stats.answered} correct
                  </div>
                </div>
              )
            ))}
            {Object.values(questionTypeStats).every(stats => stats.answered === 0) && (
              <p>No question type data yet. Answer some questions to see your performance.</p>
            )}
          </div>

          <div className="history-panel">
            <h3>Recent Questions</h3>
            {quizHistory.length > 0 ? (
              <ul className="history-list">
                {quizHistory.slice(-5).map((item, index) => (
                  <li key={index} className={`history-item ${item.isCorrect ? 'correct' : 'incorrect'} ${item.timeUp ? 'time-up' : ''}`}>
                    <div className="history-subject-type">
                      <span className="history-subject" style={{ color: subjectsConfig[item.subject]?.color || '#4b6cb7' }}>
                        {subjectsConfig[item.subject]?.icon} {subjectsConfig[item.subject]?.name}
                      </span>
                      <span className="history-type">
                        {questionTypes[item.type]?.icon} {questionTypes[item.type]?.name}
                      </span>
                    </div>
                    <div className="history-question">{item.question}</div>
                    <div className="history-answer">Your answer: {item.userAnswer}</div>
                    {!item.isCorrect && !item.timeUp && (
                      <div className="history-correct-answer">Correct answer: {item.correctAnswer}</div>
                    )}
                    {item.timeUp && (
                      <div className="time-up-label">Time Up!</div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No questions answered yet.</p>
            )}
          </div>

          {!showChat && (
            <div className="suggested-questions-panel">
              <h3>Ask Anything</h3>
              <p>Use natural language to ask for questions on any topic</p>
              <button 
                className="ask-question-btn"
                onClick={() => setShowChat(true)}
              >
                💬 Ask a Question
              </button>
              {renderSuggestedQuestions()}
            </div>
          )}
          {renderSubjectXp()}
          
          {renderPersonalizedSuggestions()}
          
          {renderLearningPath()}

          {renderSolvingStepsPanel()}

          <FatigueStatusPanel />

          <div className="badges-preview-panel">
            <h3>Recent Badges</h3>
            {badges.length > 0 ? (
              <div className="badges-preview">
                {badges.slice(-3).map(badgeId => {
                  const badge = Object.values(LEVEL_CONFIG.BADGES).find(b => b.id === badgeId);
                  return badge ? (
                    <div key={badge.id} className="preview-badge" style={{ borderColor: badge.color }}>
                      <div className="preview-badge-icon" style={{ color: badge.color }}>
                        {badge.icon}
                      </div>
                      <div className="preview-badge-name">{badge.name}</div>
                    </div>
                  ) : null;
                })}
              </div>
            ) : (
              <p>No badges yet. Answer questions to earn badges!</p>
            )}
            <button 
              className="view-all-badges-btn"
              onClick={() => setShowProfile(true)}
            >
              View All Badges
            </button>
          </div>

          {emotionDetectionEnabled && (
            <div className="emotion-status-panel">
              <h3>How You're Feeling</h3>
              <div 
                className="emotion-display"
                style={{ borderColor: userEmotion.color }}
              >
                <div className="emotion-icon-large">{userEmotion.emoji}</div>
                <div className="emotion-name">{userEmotion.name}</div>
                <div className="emotion-description">{userEmotion.message}</div>
              </div>
              
              <div className="emotion-cues">
                <h4>Engagement Cues:</h4>
                <div className="cue-item">
                  <span>Time spent: </span>
                  <span>{Math.round(emotionCues.timeSpent / 1000)}s</span>
                </div>
                <div className="cue-item">
                  <span>Hints used: </span>
                  <span>{emotionCues.hintsUsed}</span>
                </div>
                <div className="cue-item">
                  <span>Answer changes: </span>
                  <span>{emotionCues.answerChanges}</span>
                </div>
              </div>
            </div>
          )}
          
          {renderRecentXpEvents()}
        </div>
      </div>

      <div className="footer-controls">
        <button className="restart-btn" onClick={handleRestart}>
          Restart Quiz
        </button>
      </div>
    </div>
  );
}

export default App;