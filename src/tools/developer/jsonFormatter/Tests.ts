import { jsonFormatterLogic } from './Logic';

export interface TestResult {
  name: string;
  passed: boolean;
  message?: string;
}

export const runJsonFormatterTests = (): TestResult[] => {
  const results: TestResult[] = [];

  // Test 1: Validation of correct JSON
  try {
    const validRaw = '{"name": "DevBox", "secure": true}';
    const validation = jsonFormatterLogic.validate(validRaw);
    results.push({
      name: 'Validate Correct JSON',
      passed: validation.isValid,
      message: validation.error
    });
  } catch (err: any) {
    results.push({ name: 'Validate Correct JSON', passed: false, message: err.message });
  }

  // Test 2: Validation of incorrect JSON
  try {
    const invalidRaw = '{"name": "DevBox", "secure": ';
    const validation = jsonFormatterLogic.validate(invalidRaw);
    results.push({
      name: 'Validate Incorrect JSON',
      passed: !validation.isValid,
      message: validation.error
    });
  } catch (err: any) {
    results.push({ name: 'Validate Incorrect JSON', passed: false, message: err.message });
  }

  // Test 3: Formatting (Beautification)
  try {
    const input = '{"a":1}';
    const output = jsonFormatterLogic.beautify(input, 2);
    const expected = '{\n  "a": 1\n}';
    results.push({
      name: 'Beautify JSON Formatting',
      passed: output.trim() === expected.trim(),
      message: `Got: ${JSON.stringify(output)}`
    });
  } catch (err: any) {
    results.push({ name: 'Beautify JSON Formatting', passed: false, message: err.message });
  }

  // Test 4: Minification
  try {
    const input = '{\n  "a": 1\n}';
    const output = jsonFormatterLogic.minify(input);
    const expected = '{"a":1}';
    results.push({
      name: 'Minify JSON Space-reduction',
      passed: output === expected,
      message: `Got: ${output}`
    });
  } catch (err: any) {
    results.push({ name: 'Minify JSON Space-reduction', passed: false, message: err.message });
  }

  return results;
};
