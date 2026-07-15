import React from 'react';
import { modularToolComponents } from '../../tools';

// Dynamic lazy loaders for grouped category components
const lazyDev = (key: string) => React.lazy(() => import('./DevTools').then(m => ({ default: m.devToolsComponents[key] })));
const lazyDesign = (key: string) => React.lazy(() => import('./DesignTools').then(m => ({ default: m.designToolsComponents[key] })));
const lazyImage = (key: string) => React.lazy(() => import('./ImageTools').then(m => ({ default: m.imageToolsComponents[key] })));
const lazyText = (key: string) => React.lazy(() => import('./TextTools').then(m => ({ default: m.textToolsComponents[key] })));
const lazyPdf = (key: string) => React.lazy(() => import('./PdfTools').then(m => ({ default: m.pdfToolsComponents[key] })));
const lazyColor = (key: string) => React.lazy(() => import('./ColorTools').then(m => ({ default: m.colorToolsComponents[key] })));
const lazyConverter = (key: string) => React.lazy(() => import('./ConverterTools').then(m => ({ default: m.converterToolsComponents[key] })));
const lazyGenerator = (key: string) => React.lazy(() => import('./GeneratorTools').then(m => ({ default: m.generatorToolsComponents[key] })));
const lazySecurity = (key: string) => React.lazy(() => import('./SecurityTools').then(m => ({ default: m.securityToolsComponents[key] })));
const lazySeo = (key: string) => React.lazy(() => import('./SeoTools').then(m => ({ default: m.seoToolsComponents[key] })));
const lazyUtility = (key: string) => React.lazy(() => import('./UtilityTools').then(m => ({ default: m.utilityToolsComponents[key] })));

// Dynamic lazy loaders for newly batched tools / collections
const lazyNewDev = (exportName: string) => React.lazy(() => import('./NewDevTools').then(m => ({ default: m[exportName] })));
const lazyNewDev30 = (exportName: string) => React.lazy(() => import('./NewDevTools30').then(m => ({ default: m[exportName] })));
const lazyAdvanced = (exportName: string) => React.lazy(() => import('./AdvancedToolsCollection').then(m => ({ default: m[exportName] })));
const lazyNewToolsBatch = (exportName: string) => React.lazy(() => import('./NewToolsBatch').then(m => ({ default: m[exportName] })));

// Core heavy components
const LazyVideoStudio = React.lazy(() => import('./VideoStudio').then(m => ({ default: m.VideoStudio })));
const LazyQualityEnhancer = React.lazy(() => import('./QualityEnhancer').then(m => ({ default: m.QualityEnhancer })));

export const allToolComponents: Record<string, React.ComponentType<any>> = {
  // Category standard tools
  'uuid-gen': lazyDev('uuid-gen'),
  'base64-codec': lazyDev('base64-codec'),
  'url-codec': lazyDev('url-codec'),
  'json-validator': lazyDev('json-validator'),
  'regex-tester': lazyDev('regex-tester'),
  'html-entities': lazyDev('html-entities'),
  'jwt-decoder': lazyDev('jwt-decoder'),
  'key-detector': lazyDev('key-detector'),
  'html-beautifier': lazyDev('html-beautifier'),

  // Design tools category
  'shadow-generator': lazyDesign('shadow-generator'),
  'border-radius': lazyDesign('border-radius'),
  'gradient-generator': lazyDesign('gradient-generator'),
  'cubic-bezier': lazyDesign('cubic-bezier'),
  'aspect-ratio': lazyDesign('aspect-ratio'),
  'color-palette': lazyDesign('color-palette'),
  'font-pairing': lazyDesign('font-pairing'),
  'css-cursor': lazyDesign('css-cursor'),
  'css-triangle': lazyDesign('css-triangle'),

  // Image tools category
  'image-compressor': lazyImage('image-compressor'),
  'image-resizer': lazyImage('image-resizer'),
  'image-converter': lazyImage('image-converter'),
  'image-cropper': lazyImage('image-cropper'),
  'image-filters': lazyImage('image-filters'),
  'exif-reader': lazyImage('exif-reader'),
  'color-picker': lazyImage('color-picker'),
  'image-splitter': lazyImage('image-splitter'),
  'qr-scanner': lazyImage('qr-scanner'),

  // Text tools category
  'word-counter': lazyText('word-counter'),
  'case-converter': lazyText('case-converter'),
  'markdown-preview': lazyText('markdown-preview'),
  'lorem-ipsum': lazyText('lorem-ipsum'),
  'text-diff': lazyText('text-diff'),
  'string-escaper': lazyText('string-escaper'),
  'text-analyzer-basic': lazyText('text-analyzer-basic'),
  'slug-generator': lazyText('slug-generator'),
  'obfuscator': lazyText('obfuscator'),

  // Pdf tools category
  'pdf-viewer': lazyPdf('pdf-viewer'),
  'pdf-merger': lazyPdf('pdf-merger'),
  'pdf-splitter': lazyPdf('pdf-splitter'),
  'pdf-to-img': lazyPdf('pdf-to-img'),
  'img-to-pdf-basic': lazyPdf('img-to-pdf-basic'),
  'pdf-encrypt': lazyPdf('pdf-encrypt'),
  'pdf-decrypt': lazyPdf('pdf-decrypt'),
  'pdf-compress-basic': lazyPdf('pdf-compress-basic'),
  'pdf-metadata': lazyPdf('pdf-metadata'),

  // Color tools category
  'color-converter': lazyColor('color-converter'),
  'color-contrast': lazyColor('color-contrast'),
  'color-mixer-basic': lazyColor('color-mixer-basic'),
  'color-blindness': lazyColor('color-blindness'),
  'color-extractor': lazyColor('color-extractor'),
  'color-palette-gen': lazyColor('color-palette-gen'),
  'color-shades': lazyColor('color-shades'),
  'color-wheel': lazyColor('color-wheel'),
  'color-names': lazyColor('color-names'),

  // Converter tools category
  'unit-converter': lazyConverter('unit-converter'),
  'epoch-converter-basic': lazyConverter('epoch-converter-basic'),
  'csv-to-json': lazyConverter('csv-to-json'),
  'json-to-csv-basic': lazyConverter('json-to-csv-basic'),
  'xml-to-json-basic': lazyConverter('xml-to-json-basic'),
  'json-to-xml-basic': lazyConverter('json-to-xml-basic'),
  'base64-to-file': lazyConverter('base64-to-file'),
  'file-to-base64': lazyConverter('file-to-base64'),
  'hex-to-rgb': lazyConverter('hex-to-rgb'),

  // Generator tools category
  'password-gen': lazyGenerator('password-gen'),
  'qr-generator': lazyGenerator('qr-generator'),
  'barcode-generator': lazyGenerator('barcode-generator'),
  'uuid-v4': lazyGenerator('uuid-v4'),
  'placeholder-img': lazyGenerator('placeholder-img'),
  'user-signature': lazyGenerator('user-signature'),
  'hash-generator': lazyGenerator('hash-generator'),
  'random-number': lazyGenerator('random-number'),
  'fake-data': lazyGenerator('fake-data'),

  // Security tools category
  'hash-verifier': lazySecurity('hash-verifier'),
  'password-strength': lazySecurity('password-strength'),
  'symmetric-encryption': lazySecurity('symmetric-encryption'),
  'asymmetric-keys': lazySecurity('asymmetric-keys'),
  'jwt-encoder-basic': lazySecurity('jwt-encoder-basic'),
  'url-sandbox': lazySecurity('url-sandbox'),
  'xss-filter': lazySecurity('xss-filter'),
  'passphrase-generator': lazySecurity('passphrase-generator'),
  'file-checksum': lazySecurity('file-checksum'),

  // Seo tools category
  'meta-tags': lazySeo('meta-tags'),
  'sitemap-generator': lazySeo('sitemap-generator'),
  'robots-txt': lazySeo('robots-txt'),
  'redirect-checker': lazySeo('redirect-checker'),
  'broken-links': lazySeo('broken-links'),
  'seo-slug': lazySeo('seo-slug'),
  'keyword-density': lazySeo('keyword-density'),
  'mobile-friendly': lazySeo('mobile-friendly'),
  'schema-markup': lazySeo('schema-markup'),

  // Utility tools category
  'calculator': lazyUtility('calculator'),
  'stopwatch': lazyUtility('stopwatch'),
  'timezone-converter': lazyUtility('timezone-converter'),
  'percentage-calculator': lazyUtility('percentage-calculator'),
  'markdown-editor': lazyUtility('markdown-editor'),
  'regex-cheat': lazyUtility('regex-cheat'),
  'json-compare': lazyUtility('json-compare'),
  'string-utilities': lazyUtility('string-utilities'),
  'ascii-table': lazyUtility('ascii-table'),

  // Media
  'video-studio': LazyVideoStudio,
  'media-quality-enhancer': LazyQualityEnhancer,

  // NewDevTools
  'json-formatter': lazyNewDev('JsonFormatter'),
  'json-minifier': lazyNewDev('JsonMinifier'),
  'css-formatter': lazyNewDev('CssFormatter'),
  'javascript-formatter': lazyNewDev('JavaScriptFormatter'),
  'sql-formatter': lazyNewDev('SqlFormatter'),
  'random-string-gen': lazyNewDev('RandomStringGen'),
  'svg-optimizer': lazyNewDev('SvgOptimizer'),
  'binary-converter': lazyNewDev('BinaryConverter'),

  // NewDevTools30
  'html-minifier': lazyNewDev30('HtmlMinifier'),
  'yaml-to-json': lazyNewDev30('YamlToJson'),
  'json-to-yaml': lazyNewDev30('JsonToYaml'),
  'toml-to-json': lazyNewDev30('TomlToJson'),
  'toml-generator': lazyNewDev30('TomlGenerator'),
  'base32-codec': lazyNewDev30('Base32Codec'),
  'rot13-codec': lazyNewDev30('Rot13Codec'),
  'hex-codec': lazyNewDev30('HexCodec'),
  'unicode-inspector': lazyNewDev30('UnicodeInspector'),
  'user-agent-parser': lazyNewDev30('UserAgentParser'),
  'url-parser': lazyNewDev30('UrlParser'),
  'html-xss-sanitizer': lazyNewDev30('HtmlXssSanitizer'),
  'device-info': lazyNewDev30('DeviceInfo'),
  'html-to-markdown': lazyNewDev30('HtmlToMarkdown'),
  'morse-converter': lazyNewDev30('MorseConverter'),
  'css-clip-path': lazyNewDev30('CssClipPath'),
  'cron-generator': lazyNewDev30('CronGenerator'),
  'color-palette-extractor': lazyNewDev30('ColorPaletteExtractor'),
  'port-scanner-simulator': lazyNewDev30('PortScannerSimulator'),
  'text-shuffler': lazyNewDev30('TextShuffler'),
  'decimal-binary': lazyNewDev30('DecimalBinary'),
  'regex-cheatsheet': lazyNewDev30('RegexCheatsheet'),
  'css-transform': lazyNewDev30('CssTransform'),
  'svg-to-jsx': lazyNewDev30('SvgToJsx'),
  'json-schema-gen': lazyNewDev30('JsonSchemaGen'),
  'js-obfuscator': lazyNewDev30('JsObfuscator'),
  'sql-minify': lazyNewDev30('SqlMinify'),
  'git-commands': lazyNewDev30('GitCommands'),
  'css-flexbox': lazyNewDev30('CssFlexbox'),
  'text-sorter': lazyNewDev30('TextSorter'),
  'curl-to-fetch': lazyNewDev30('CurlToFetch'),

  // AdvancedToolsCollection
  'jwt-debugger': lazyAdvanced('JwtDebugger'),
  'cron-parser': lazyAdvanced('CronParser'),
  'markdown-table-generator': lazyAdvanced('MarkdownTableGenerator'),
  'json-to-ts': lazyAdvanced('JsonToTs'),
  'glassmorphism-gen': lazyAdvanced('GlassmorphismGen'),
  'json-to-csv': lazyAdvanced('JsonToCsv'),
  'seo-slug-extractor': lazyAdvanced('SeoSlugExtractor'),
  'aspect-ratio-calc': lazyAdvanced('AspectRatioCalc'),
  'password-entropy': lazyAdvanced('PasswordEntropy'),
  'color-contrast-checker': lazyAdvanced('ColorContrastChecker'),
  'cidr-calc': lazyAdvanced('CidrCalc'),
  'docker-compose': lazyAdvanced('DockerCompose'),
  'sql-mock-gen': lazyAdvanced('SqlMockGen'),

  // NewToolsBatch
  'xml-formatter': lazyNewToolsBatch('XmlFormatter'),
  'xml-validator': lazyNewToolsBatch('XmlValidator'),
  'xml-to-json': lazyNewToolsBatch('XmlToJson'),
  'json-to-xml': lazyNewToolsBatch('JsonToXml'),
  'yaml-formatter': lazyNewToolsBatch('YamlFormatter'),
  'yaml-validator': lazyNewToolsBatch('YamlValidator'),
  'csv-to-json-batch': lazyNewToolsBatch('CsvToJsonBatch'),
  'sql-formatter-advanced': lazyNewToolsBatch('SqlFormatterAdvanced'),
  'regex-builder': lazyNewToolsBatch('RegexBuilder'),
  'url-parser-advanced': lazyNewToolsBatch('UrlParserAdvanced'),
  'base64-image': lazyNewToolsBatch('Base64Image'),
  'binary-to-text': lazyNewToolsBatch('BinaryToText'),
  'git-ignore-gen': lazyNewToolsBatch('GitIgnoreGen'),
  'readme-generator': lazyNewToolsBatch('ReadmeGenerator'),
  'license-generator': lazyNewToolsBatch('LicenseGenerator'),
  'json-minify-advanced': lazyNewToolsBatch('JsonMinifyAdvanced'),
  'html-formatter-beautifier': lazyNewToolsBatch('HtmlFormatterBeautifier'),
  'text-analyzer': lazyNewToolsBatch('TextAnalyzer'),
  'text-cleaner': lazyNewToolsBatch('TextCleaner'),
  'text-case-invert': lazyNewToolsBatch('TextCaseInvert'),
  'text-slugify': lazyNewToolsBatch('TextSlugify'),
  'line-sorter': lazyNewToolsBatch('LineSorter'),
  'text-duplicate-remover': lazyNewToolsBatch('TextDuplicateRemover'),
  'binary-text-converter': lazyNewToolsBatch('BinaryTextConverter'),
  'morse-code': lazyNewToolsBatch('MorseCode'),
  'anagram-solver': lazyNewToolsBatch('AnagramSolver'),
  'word-scrambler': lazyNewToolsBatch('WordScrambler'),
  'leet-speak': lazyNewToolsBatch('LeetSpeak'),
  'text-reverser': lazyNewToolsBatch('TextReverser'),
  'markdown-to-html': lazyNewToolsBatch('MarkdownToHtml'),
  'html-to-text': lazyNewToolsBatch('HtmlToText'),
  'img-color-picker': lazyNewToolsBatch('ImgColorPicker'),
  'img-meta-reader': lazyNewToolsBatch('ImgMetaReader'),
  'img-contrast-adjust': lazyNewToolsBatch('ImgContrastAdjust'),
  'img-grayscale': lazyNewToolsBatch('ImgGrayscale'),
  'img-blur-filter': lazyNewToolsBatch('ImgBlurFilter'),
  'img-watermarker': lazyNewToolsBatch('ImgWatermarker'),
  'img-base64-encode': lazyNewToolsBatch('ImgBase64Encode'),
  'img-placeholder-gen': lazyNewToolsBatch('ImgPlaceholderGen'),
  'svg-pattern-gen': lazyNewToolsBatch('SvgPatternGen'),
  'favicon-converter': lazyNewToolsBatch('FaviconConverter'),
  'pdf-text-extract': lazyNewToolsBatch('PdfTextExtract'),
  'pdf-image-extract': lazyNewToolsBatch('PdfImageExtract'),
  'pdf-merge': lazyNewToolsBatch('PdfMerge'),
  'pdf-split': lazyNewToolsBatch('PdfSplit'),
  'pdf-compress': lazyNewToolsBatch('PdfCompress'),
  'pdf-metadata-viewer': lazyNewToolsBatch('PdfMetadataViewer'),
  'image-to-pdf': lazyNewToolsBatch('ImageToPdf'),
  'pdf-page-numberer': lazyNewToolsBatch('PdfPageNumberer'),
  'sha256-hasher': lazyNewToolsBatch('Sha256Hasher'),
  'sha512-hasher': lazyNewToolsBatch('Sha512Hasher'),
  'md5-hasher': lazyNewToolsBatch('Md5Hasher'),
  'sha1-hasher': lazyNewToolsBatch('Sha1Hasher'),
  'aes-encryption': lazyNewToolsBatch('AesEncryption'),
  'bcrypt-generator': lazyNewToolsBatch('BcryptGenerator'),
  'password-generator-pro': lazyNewToolsBatch('PasswordGeneratorPro'),
  'uuid-v4-gen': lazyNewToolsBatch('UuidV4Gen'),
  'jwt-generator-tool': lazyNewToolsBatch('JwtGeneratorTool'),
  'secure-key-gen': lazyNewToolsBatch('SecureKeyGen'),
  'unit-converter-pro': lazyNewToolsBatch('UnitConverterPro'),
  'epoch-converter': lazyNewToolsBatch('EpochConverter'),
  'cidr-calculator-pro': lazyNewToolsBatch('CidrCalculatorPro'),
  'cron-editor': lazyNewToolsBatch('CronEditor'),
  'color-mixer': lazyNewToolsBatch('ColorMixer'),
  'lorem-ipsum-pro': lazyNewToolsBatch('LoremIpsumPro'),
  'diff-checker-pro': lazyNewToolsBatch('DiffCheckerPro'),
  'dns-lookup-simulator': lazyNewToolsBatch('DnsLookupSimulator'),

  // 33 Media Production Tools (routed directly to VideoStudio with props)
  'video-cutter': () => React.createElement(LazyVideoStudio, { initialTab: 'quick-tools', initialQuickTool: 'cutter' }),
  'video-trimmer': () => React.createElement(LazyVideoStudio, { initialTab: 'quick-tools', initialQuickTool: 'trimmer' }),
  'video-splitter': () => React.createElement(LazyVideoStudio, { initialTab: 'quick-tools', initialQuickTool: 'splitter' }),
  'video-merger': () => React.createElement(LazyVideoStudio, { initialTab: 'timeline', initialQuickTool: 'merger' }),
  'video-compressor': () => React.createElement(LazyVideoStudio, { initialTab: 'quick-tools', initialQuickTool: 'compressor' }),
  'video-converter': () => React.createElement(LazyVideoStudio, { initialTab: 'quick-tools', initialQuickTool: 'converter' }),
  'video-cropper': () => React.createElement(LazyVideoStudio, { initialTab: 'quick-tools', initialQuickTool: 'cropper' }),
  'video-resizer': () => React.createElement(LazyVideoStudio, { initialTab: 'quick-tools', initialQuickTool: 'resizer' }),
  'video-rotator': () => React.createElement(LazyVideoStudio, { initialTab: 'quick-tools', initialQuickTool: 'rotator' }),
  'video-speed-controller': () => React.createElement(LazyVideoStudio, { initialTab: 'quick-tools', initialQuickTool: 'speed' }),
  'frame-extractor': () => React.createElement(LazyVideoStudio, { initialTab: 'quick-tools', initialQuickTool: 'frame-extract' }),
  'thumbnail-generator': () => React.createElement(LazyVideoStudio, { initialTab: 'quick-tools', initialQuickTool: 'thumbnail' }),
  'gif-creator': () => React.createElement(LazyVideoStudio, { initialTab: 'quick-tools', initialQuickTool: 'gif' }),
  'video-metadata-viewer': () => React.createElement(LazyVideoStudio, { initialTab: 'quick-tools', initialQuickTool: 'metadata' }),
  'video-metadata-remover': () => React.createElement(LazyVideoStudio, { initialTab: 'quick-tools', initialQuickTool: 'metadata-remove' }),
  'aspect-ratio-converter': () => React.createElement(LazyVideoStudio, { initialTab: 'timeline', initialQuickTool: 'aspect-ratio' }),
  'subtitle-editor': () => React.createElement(LazyVideoStudio, { initialTab: 'audio-subs', initialQuickTool: 'subtitles' }),
  'srt-vtt-converter': () => React.createElement(LazyVideoStudio, { initialTab: 'audio-subs', initialQuickTool: 'subtitle-format' }),
  'audio-cutter': () => React.createElement(LazyVideoStudio, { initialTab: 'quick-tools', initialQuickTool: 'audio-cut' }),
  'audio-merger': () => React.createElement(LazyVideoStudio, { initialTab: 'timeline', initialQuickTool: 'audio-merge' }),
  'audio-converter': () => React.createElement(LazyVideoStudio, { initialTab: 'quick-tools', initialQuickTool: 'audio-convert' }),
  'audio-compressor': () => React.createElement(LazyVideoStudio, { initialTab: 'quick-tools', initialQuickTool: 'audio-compress' }),
  'audio-extractor': () => React.createElement(LazyVideoStudio, { initialTab: 'audio-subs', initialQuickTool: 'audio-extract' }),
  'volume-normalizer': () => React.createElement(LazyVideoStudio, { initialTab: 'audio-subs', initialQuickTool: 'volume' }),
  'audio-waveform-viewer': () => React.createElement(LazyVideoStudio, { initialTab: 'audio-subs', initialQuickTool: 'waveform' }),
  'audio-metadata-tools': () => React.createElement(LazyVideoStudio, { initialTab: 'audio-subs', initialQuickTool: 'audio-meta' }),
  'video-format-presets': () => React.createElement(LazyVideoStudio, { initialTab: 'quick-tools', initialQuickTool: 'presets' }),
  'social-media-video-resize': () => React.createElement(LazyVideoStudio, { initialTab: 'quick-tools', initialQuickTool: 'social' }),
  'caption-tools': () => React.createElement(LazyVideoStudio, { initialTab: 'audio-subs', initialQuickTool: 'captioning' }),
  'text-overlay-tools': () => React.createElement(LazyVideoStudio, { initialTab: 'overlays', initialQuickTool: 'text' }),
  'watermark-tools': () => React.createElement(LazyVideoStudio, { initialTab: 'overlays', initialQuickTool: 'watermark' }),
  'basic-video-effects': () => React.createElement(LazyVideoStudio, { initialTab: 'timeline', initialQuickTool: 'effects' }),
  'timeline-utilities': () => React.createElement(LazyVideoStudio, { initialTab: 'timeline', initialQuickTool: 'utils' }),

  // Load new modular tools from their registry
  ...modularToolComponents
};
