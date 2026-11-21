import { printValidationResult, validateContentProject } from './lib/validate-content';

const result = validateContentProject();
printValidationResult(result);
process.exit(result.ok ? 0 : 1);
