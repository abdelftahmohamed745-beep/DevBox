import React from 'react';
import { devToolsComponents } from './DevTools';
import { designToolsComponents } from './DesignTools';
import { imageToolsComponents } from './ImageTools';
import { textToolsComponents } from './TextTools';
import { pdfToolsComponents } from './PdfTools';
import { colorToolsComponents } from './ColorTools';
import { converterToolsComponents } from './ConverterTools';
import { generatorToolsComponents } from './GeneratorTools';
import { securityToolsComponents } from './SecurityTools';
import { seoToolsComponents } from './SeoTools';
import { utilityToolsComponents } from './UtilityTools';
import { 
  JsonFormatter, JsonMinifier, CssFormatter, JavaScriptFormatter,
  SqlFormatter, RandomStringGen, SvgOptimizer, BinaryConverter 
} from './NewDevTools';

export const allToolComponents: Record<string, () => React.JSX.Element> = {
  ...devToolsComponents,
  ...designToolsComponents,
  ...imageToolsComponents,
  ...textToolsComponents,
  ...pdfToolsComponents,
  ...colorToolsComponents,
  ...converterToolsComponents,
  ...generatorToolsComponents,
  ...securityToolsComponents,
  ...seoToolsComponents,
  ...utilityToolsComponents,
  'json-formatter': JsonFormatter,
  'json-minifier': JsonMinifier,
  'css-formatter': CssFormatter,
  'javascript-formatter': JavaScriptFormatter,
  'sql-formatter': SqlFormatter,
  'random-string-gen': RandomStringGen,
  'svg-optimizer': SvgOptimizer,
  'binary-converter': BinaryConverter,
};
