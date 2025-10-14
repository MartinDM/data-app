// This file contains intentional TypeScript errors for testing
// It should NOT be imported or used in the actual application

interface TestInterface {
  name: string;
  age: number;
}

// Error: Type 'string' is not assignable to type 'number'
const testObject: TestInterface = {
  name: 'John',
  age: 'thirty', // This should cause a TypeScript error
};

// Error: Property 'nonExistent' does not exist on type 'TestInterface'
const testProperty = testObject.nonExistent;

// Error: Argument of type 'string' is not assignable to parameter of type 'number'
function addNumbers(a: number, b: number): number {
  return a + b;
}

const result = addNumbers(5, '10'); // This should cause a TypeScript error

// Error: Function lacks ending return statement
function mustReturnNumber(): number {
  const x = 5;
  // Missing return statement
}

export {}; // Make this a module to avoid global scope issues
