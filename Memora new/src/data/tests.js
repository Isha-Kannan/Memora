export const MMSE_QUESTIONS = [
  {
    id: 'm1',
    title: 'Orientation',
    instruction: 'What is the year, season, date, day, and month?',
    type: 'text',
    placeholder: 'e.g., 2024, Spring, 15th, Monday, May',
    points: 5,
    matchKeywords: [] // Manual review or any answer grants points for demo
  },
  {
    id: 'm2',
    title: 'Immediate Recall',
    instruction: 'Remember these words: Apple, Chair, River. Now type them below.',
    type: 'text',
    placeholder: 'Type the 3 words here',
    points: 3,
    matchKeywords: ['apple', 'chair', 'river']
  },
  {
    id: 'm3',
    title: 'Attention',
    instruction: 'Repeat these numbers exactly as shown: 4, 8, 2',
    type: 'number',
    placeholder: 'e.g., 482',
    points: 1,
    correctAnswer: '482'
  },
  {
    id: 'm4',
    title: 'Backward Numbers',
    instruction: 'Repeat these numbers BACKWARDS: 6, 3, 9',
    type: 'number',
    placeholder: 'e.g., 936',
    points: 1,
    correctAnswer: '936'
  },
  {
    id: 'm5',
    title: 'Counting',
    instruction: 'Count backward from 20 to 10 (comma separated)',
    type: 'text',
    placeholder: '20, 19, 18...',
    points: 2,
    correctAnswer: '20,19,18,17,16,15,14,13,12,11,10'
  },
  {
    id: 'm6',
    title: 'Naming (Object 1)',
    instruction: 'What is the object that tells time?',
    type: 'multiple-choice',
    options: ['Clock', 'Watch', 'Bracelet'],
    points: 1,
    correctAnswer: 'Watch'
  },
  {
    id: 'm7',
    title: 'Naming (Object 2)',
    instruction: 'What is the object used to write with ink?',
    type: 'multiple-choice',
    options: ['Pen', 'Pencil', 'Knife'],
    points: 1,
    correctAnswer: 'Pen'
  },
  {
    id: 'm8',
    title: 'Language Repetition',
    instruction: 'Repeat exactly: "No ifs, ands, or buts"',
    type: 'text',
    placeholder: 'Type the sentence',
    points: 1,
    correctAnswer: 'No ifs, ands, or buts'
  },
  {
    id: 'm9',
    title: 'Sentence Repetition',
    instruction: 'Repeat exactly: "The sky is blue and the grass is green"',
    type: 'text',
    placeholder: 'Type the sentence',
    points: 1,
    correctAnswer: 'The sky is blue and the grass is green'
  },
  {
    id: 'm10',
    title: 'Comprehension',
    instruction: 'Take a piece of paper in your right hand, fold it in half, and put it on the floor.',
    type: 'button-validate',
    options: ['I have completed these steps'],
    points: 3
  },
  {
    id: 'm11',
    title: 'Reading',
    instruction: 'Read this and do what it says: "Close your eyes"',
    type: 'button-validate',
    options: ['Done'],
    points: 1
  },
  {
    id: 'm12',
    title: 'Writing',
    instruction: 'Write any complete sentence of your choice.',
    type: 'text',
    placeholder: 'Your sentence...',
    points: 1
  },
  {
    id: 'm13',
    title: 'Drawing',
    instruction: 'Draw a square intersecting another square.',
    type: 'canvas',
    points: 1
  }
];

export const MOCA_QUESTIONS = [
  {
    id: 'mo1',
    title: 'Clock Drawing',
    instruction: 'Draw a clock, put in all the numbers, and set the time to 11:10.',
    type: 'canvas',
    points: 3
  },
  {
    id: 'mo2',
    title: 'Trail Making',
    instruction: 'Click the sequence in alternating order: 1 → A → 2 → B → 3',
    type: 'sequence-click',
    sequence: ['1', 'A', '2', 'B', '3'],
    points: 1
  },
  {
    id: 'mo3',
    title: 'Animal Naming',
    instruction: 'Identify this animal (Image of a majestic grassland feline with a mane)',
    type: 'multiple-choice',
    options: ['Lion', 'Camel', 'Elephant'],
    points: 1,
    correctAnswer: 'Lion'
  },
  {
    id: 'mo4',
    title: 'Memory Recall',
    instruction: 'Recall the 5 words provided earlier (Face, Velvet, Church, Daisy, Red). Type them separated by spaces.',
    type: 'text',
    placeholder: 'e.g. face velvet...',
    points: 5,
    matchKeywords: ['face', 'velvet', 'church', 'daisy', 'red']
  },
  {
    id: 'mo5',
    title: 'Attention (Forward)',
    instruction: 'Repeat the numbers exactly: 2, 1, 8, 5, 4',
    type: 'number',
    placeholder: '21854',
    points: 1,
    correctAnswer: '21854'
  },
  {
    id: 'mo6',
    title: 'Attention (Backward)',
    instruction: 'Repeat the numbers BACKWARDS: 7, 4, 2',
    type: 'number',
    placeholder: '247',
    points: 1,
    correctAnswer: '247'
  },
  {
    id: 'mo7',
    title: 'Letter Tap',
    instruction: 'Tap the letter "A" every time it appears in this sequence: F B A C M N A A J K L B A F A K',
    type: 'multiple-choice',
    // We'll treat this as a checkbox or just multiple choice for demo
    options: ['I tapped all 5 "A"s correctly', 'I missed some'],
    points: 1,
    correctAnswer: 'I tapped all 5 "A"s correctly'
  },
  {
    id: 'mo8',
    title: 'Verbal Fluency',
    instruction: 'Name as many words as you can that begin with "F" in 60 seconds.',
    type: 'textarea',
    placeholder: 'Fish, Fox, Fan...',
    points: 1 // Point given for > N words, simplify for now
  },
  {
    id: 'mo9',
    title: 'Abstraction',
    instruction: 'How are a bicycle and a train alike?',
    type: 'multiple-choice',
    options: ['Both are vehicles', 'Both fly', 'Both are animals'],
    points: 2,
    correctAnswer: 'Both are vehicles'
  }
];
