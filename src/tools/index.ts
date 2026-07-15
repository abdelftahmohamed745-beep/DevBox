import { lazy } from 'react';
import { Tool } from '../types';
import { jsonFormatterMetadata } from './developer/jsonFormatter/Metadata';

// Export individual tools metadata
export const modularToolsMetadata: Tool[] = [
  jsonFormatterMetadata
];

// Lazy-loaded exports for the new modular structure
export const modularToolComponents = {
  'modular-json-formatter': lazy(() => import('./developer/jsonFormatter/Component'))
};

export { jsonFormatterMetadata } from './developer/jsonFormatter/Metadata';
export { runJsonFormatterTests } from './developer/jsonFormatter/Tests';
export { jsonFormatterLogic } from './developer/jsonFormatter/Logic';
export { jsonFormatterConfig } from './developer/jsonFormatter/Configuration';
