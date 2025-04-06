const mongoose = require('mongoose');
const Problem = require('../models/Problem');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Sample problems
const problems = [
  {
    title: "Two Sum",
    slug: "two-sum",
    description: `<p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>.</p>
                 <p>You may assume that each input would have exactly one solution, and you may not use the same element twice.</p>
                 <p>You can return the answer in any order.</p>`,
    difficulty: "Easy",
    tags: ["Array", "Hash Table"],
    testCases: [
      {
        input: "4\n2 7 11 15\n9",
        expectedOutput: "0 1",
        isHidden: false
      },
      {
        input: "3\n3 2 4\n6",
        expectedOutput: "1 2",
        isHidden: false
      },
      {
        input: "5\n1 5 8 3 9\n12",
        expectedOutput: "1 4",
        isHidden: true
      }
    ],
    sampleInput: "4\n2 7 11 15\n9",
    sampleOutput: "0 1",
    timeLimit: 1000,
    memoryLimit: 128
  },
  {
    title: "Reverse String",
    slug: "reverse-string",
    description: `<p>Write a function that reverses a string. The input string is given as an array of characters <code>s</code>.</p>
                 <p>You must do this by modifying the input array in-place with O(1) extra memory.</p>`,
    difficulty: "Easy",
    tags: ["String", "Two Pointers"],
    testCases: [
      {
        input: "5\nh e l l o",
        expectedOutput: "o l l e h",
        isHidden: false
      },
      {
        input: "6\nH a n n a h",
        expectedOutput: "h a n n a H",
        isHidden: false
      }
    ],
    sampleInput: "5\nh e l l o",
    sampleOutput: "o l l e h",
    timeLimit: 1000,
    memoryLimit: 128
  },
  {
    title: "Find First and Last Position of Element in Sorted Array",
    slug: "find-first-and-last-position",
    description: `<p>Given an array of integers <code>nums</code> sorted in non-decreasing order, find the starting and ending position of a given <code>target</code> value.</p>
                  <p>If target is not found in the array, return <code>-1 -1</code>.</p>`,
    difficulty: "Medium",
    tags: ["Array", "Binary Search"],
    testCases: [
      {
        input: "6\n5 7 7 8 8 10\n8",
        expectedOutput: "3 4",
        isHidden: false
      },
      {
        input: "6\n5 7 7 8 8 10\n6",
        expectedOutput: "-1 -1",
        isHidden: false
      },
      {
        input: "1\n1\n1",
        expectedOutput: "0 0",
        isHidden: true
      }
    ],
    sampleInput: "6\n5 7 7 8 8 10\n8",
    sampleOutput: "3 4",
    timeLimit: 1000,
    memoryLimit: 128
  },
  {
    title: "Search Insert Position",
    slug: "search-insert-position",
    description: `<p>Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.</p>`,
    difficulty: "Medium",
    tags: ["Array", "Binary Search"],
    testCases: [
      {
        input: "4\n1 3 5 6\n5",
        expectedOutput: "2",
        isHidden: false
      },
      {
        input: "4\n1 3 5 6\n2",
        expectedOutput: "1",
        isHidden: false
      },
      {
        input: "4\n1 3 5 6\n7",
        expectedOutput: "4",
        isHidden: true
      }
    ],
    sampleInput: "4\n1 3 5 6\n5",
    sampleOutput: "2",
    timeLimit: 1000,
    memoryLimit: 128
  },
  {
    title: "Find Peak Element",
    slug: "find-peak-element",
    description: `<p>A peak element is an element that is strictly greater than its neighbors.</p>
                  <p>Given an integer array <code>nums</code>, find a peak element, and return its index. You may imagine that <code>nums[-1] = nums[n] = -∞</code>.</p>`,
    difficulty: "Medium",
    tags: ["Array", "Binary Search"],
    testCases: [
      {
        input: "4\n1 2 3 1",
        expectedOutput: "2",
        isHidden: false
      },
      {
        input: "6\n1 2 1 3 5 6",
        expectedOutput: "5",
        isHidden: false
      },
      {
        input: "1\n1",
        expectedOutput: "0",
        isHidden: true
      }
    ],
    sampleInput: "4\n1 2 3 1",
    sampleOutput: "2",
    timeLimit: 1000,
    memoryLimit: 128
  }
];

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    seedDatabase();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

async function seedDatabase() {
  try {
    await Problem.deleteMany({});
    
    await Problem.insertMany(problems);
    
    console.log(`${problems.length} problems seeded successfully`);
    mongoose.connection.close();
  } catch (err) {
    console.error('Error seeding database:', err);
    mongoose.connection.close();
  }
}