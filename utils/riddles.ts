// Collection of riddles for the RiddleChallenge component

export interface Riddle {
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const riddles: Riddle[] = [
  {
    question: "I'm tall when I'm young, and I'm short when I'm old. What am I?",
    answer: "candle",
    difficulty: 'easy',
  },
  {
    question: "What has to be broken before you can use it?",
    answer: "egg",
    difficulty: 'easy',
  },
  {
    question: "What month of the year has 28 days?",
    answer: "all",
    difficulty: 'medium',
  },
  {
    question: "What is full of holes but still holds water?",
    answer: "sponge",
    difficulty: 'easy',
  },
  {
    question: "What has a head and a tail, but no body?",
    answer: "coin",
    difficulty: 'easy',
  },
  {
    question: "What has many keys but can't open a single lock?",
    answer: "piano",
    difficulty: 'easy',
  },
  {
    question: "What gets wet while drying?",
    answer: "towel",
    difficulty: 'easy',
  },
  {
    question: "What can you break, even if you never pick it up or touch it?",
    answer: "promise",
    difficulty: 'medium',
  },
  {
    question: "What goes up but never comes down?",
    answer: "age",
    difficulty: 'easy',
  },
  {
    question: "I have branches, but no fruit, trunk or leaves. What am I?",
    answer: "bank",
    difficulty: 'medium',
  },
  {
    question: "What can travel all around the world without leaving its corner?",
    answer: "stamp",
    difficulty: 'medium',
  },
  {
    question: "What has 13 hearts, but no other organs?",
    answer: "deck of cards",
    difficulty: 'medium',
  },
  {
    question: "What has a neck but no head?",
    answer: "bottle",
    difficulty: 'easy',
  },
  {
    question: "What building has the most stories?",
    answer: "library",
    difficulty: 'medium',
  },
  {
    question: "What is always in front of you but can't be seen?",
    answer: "future",
    difficulty: 'medium',
  },
  {
    question: "What can you hold in your right hand but not in your left?",
    answer: "left hand",
    difficulty: 'medium',
  },
  {
    question: "What is so fragile that saying its name breaks it?",
    answer: "silence",
    difficulty: 'hard',
  },
  {
    question: "What can fill a room but takes up no space?",
    answer: "light",
    difficulty: 'medium',
  },
  {
    question: "If you drop me I'm sure to crack, but give me a smile and I'll always smile back. What am I?",
    answer: "mirror",
    difficulty: 'medium',
  },
  {
    question: "The more you take, the more you leave behind. What are they?",
    answer: "footsteps",
    difficulty: 'hard',
  },
];

/**
 * Get a random riddle from the collection
 * @param difficulty Optional difficulty level to filter by
 * @returns A random riddle
 */
export function getRandomRiddle(difficulty?: 'easy' | 'medium' | 'hard'): Riddle {
  let filteredRiddles = riddles;
  
  if (difficulty) {
    filteredRiddles = riddles.filter(riddle => riddle.difficulty === difficulty);
    
    // If no riddles match the difficulty, fall back to all riddles
    if (filteredRiddles.length === 0) {
      filteredRiddles = riddles;
    }
  }
  
  const randomIndex = Math.floor(Math.random() * filteredRiddles.length);
  return filteredRiddles[randomIndex];
}

/**
 * Get multiple random riddles from the collection
 * @param count Number of riddles to return
 * @param difficulty Optional difficulty level to filter by
 * @returns An array of random riddles
 */
export function getRandomRiddles(count: number, difficulty?: 'easy' | 'medium' | 'hard'): Riddle[] {
  let filteredRiddles = riddles;
  
  if (difficulty) {
    filteredRiddles = riddles.filter(riddle => riddle.difficulty === difficulty);
    
    // If no riddles match the difficulty, fall back to all riddles
    if (filteredRiddles.length === 0) {
      filteredRiddles = riddles;
    }
  }
  
  // Ensure we don't try to get more riddles than exist
  const actualCount = Math.min(count, filteredRiddles.length);
  
  // Create a copy of the array to avoid modifying the original
  const riddlesCopy = [...filteredRiddles];
  const result: Riddle[] = [];
  
  for (let i = 0; i < actualCount; i++) {
    const randomIndex = Math.floor(Math.random() * riddlesCopy.length);
    result.push(riddlesCopy[randomIndex]);
    // Remove the selected riddle to avoid duplicates
    riddlesCopy.splice(randomIndex, 1);
  }
  
  return result;
}

/**
 * Check if an answer is correct for a given riddle
 * @param riddle The riddle to check
 * @param answer The user's answer
 * @returns True if the answer is correct, false otherwise
 */
export function checkRiddleAnswer(riddle: Riddle, answer: string): boolean {
  // Normalize both strings for comparison: trim whitespace, convert to lowercase
  const normalizedCorrectAnswer = riddle.answer.trim().toLowerCase();
  const normalizedUserAnswer = answer.trim().toLowerCase();
  
  return normalizedUserAnswer === normalizedCorrectAnswer;
}

export default riddles;