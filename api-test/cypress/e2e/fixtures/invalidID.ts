export const invalidIds = {
    empty: '', // Empty string
    nullValue: null, // Null value
    number: 12345, // Number instead of string
    boolean: true, // Boolean instead of string
    specialChars: '@!#$', // Special characters
    tooShort: 'LW2mvX', // Shorter than ObjectId
    tooLong: '1234567890123456789012345678901234567890', // Longer than ObjectId
    malformed: '12345xyz890', // Invalid alphanumeric format
    undefinedValue: undefined, // Undefined
    deletedId: 'LW2mvXoVeD1uIkNb' // Valid format, but assumed already deleted
};
  