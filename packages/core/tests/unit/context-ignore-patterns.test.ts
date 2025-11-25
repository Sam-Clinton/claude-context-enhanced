import { Context } from '../../src/context';
import * as path from 'path';

// Mock embedding and vector database
const mockEmbedding = {
    embedText: jest.fn().mockResolvedValue([0.1, 0.2, 0.3]),
    embedTexts: jest.fn().mockResolvedValue([[0.1, 0.2, 0.3]]),
};

const mockVectorDatabase = {
    create: jest.fn(),
    insert: jest.fn(),
    search: jest.fn(),
    delete: jest.fn(),
};

// Helper function to create Context with mocks
const createMockContext = (config: any = {}) => {
    return new Context({
        embedding: mockEmbedding as any,
        vectorDatabase: mockVectorDatabase as any,
        ...config,
    });
};

describe('Context - Ignore Patterns', () => {
    describe('DEFAULT_IGNORE_PATTERNS', () => {
        it('should include common build outputs', () => {
            const context = createMockContext();
            const patterns = (context as any).ignorePatterns;

            expect(patterns).toContain('node_modules/**');
            expect(patterns).toContain('dist/**');
            expect(patterns).toContain('build/**');
            expect(patterns).toContain('out/**');
            expect(patterns).toContain('target/**');
        });

        it('should include package manager dependencies', () => {
            const context = createMockContext();
            const patterns = (context as any).ignorePatterns;

            expect(patterns).toContain('vendor/**');
            expect(patterns).toContain('venv/**');
            expect(patterns).toContain('.venv/**');
            expect(patterns).toContain('Pods/**');
            expect(patterns).toContain('.bundle/**');
            expect(patterns).toContain('.pnpm-store/**');
            expect(patterns).toContain('.yarn/**');
        });

        it('should include frontend framework build outputs', () => {
            const context = createMockContext();
            const patterns = (context as any).ignorePatterns;

            expect(patterns).toContain('.next/**');
            expect(patterns).toContain('.nuxt/**');
            expect(patterns).toContain('.astro/**');
            expect(patterns).toContain('.svelte-kit/**');
            expect(patterns).toContain('.remix/**');
            expect(patterns).toContain('.angular/**');
            expect(patterns).toContain('.expo/**');
        });

        it('should include IDE and editor files', () => {
            const context = createMockContext();
            const patterns = (context as any).ignorePatterns;

            expect(patterns).toContain('.vscode/**');
            expect(patterns).toContain('.idea/**');
            expect(patterns).toContain('*.swp');
            expect(patterns).toContain('*.swo');
            expect(patterns).toContain('*.iml');
            expect(patterns).toContain('.DS_Store');
        });

        it('should include version control directories', () => {
            const context = createMockContext();
            const patterns = (context as any).ignorePatterns;

            expect(patterns).toContain('.git/**');
            expect(patterns).toContain('.svn/**');
            expect(patterns).toContain('.hg/**');
            expect(patterns).toContain('.bzr/**');
        });

        it('should include cache directories', () => {
            const context = createMockContext();
            const patterns = (context as any).ignorePatterns;

            expect(patterns).toContain('.cache/**');
            expect(patterns).toContain('__pycache__/**');
            expect(patterns).toContain('.pytest_cache/**');
        });

        it('should include testing output directories', () => {
            const context = createMockContext();
            const patterns = (context as any).ignorePatterns;

            expect(patterns).toContain('coverage/**');
            expect(patterns).toContain('htmlcov/**');
            expect(patterns).toContain('.coverage');
            expect(patterns).toContain('test-results/**');
            expect(patterns).toContain('playwright-report/**');
            expect(patterns).toContain('cypress/videos/**');
            expect(patterns).toContain('cypress/screenshots/**');
        });

        it('should include binary file patterns', () => {
            const context = createMockContext();
            const patterns = (context as any).ignorePatterns;

            expect(patterns).toContain('*.exe');
            expect(patterns).toContain('*.dll');
            expect(patterns).toContain('*.so');
            expect(patterns).toContain('*.dylib');
            expect(patterns).toContain('*.jar');
            expect(patterns).toContain('*.war');
            expect(patterns).toContain('*.class');
        });

        it('should include media file patterns', () => {
            const context = createMockContext();
            const patterns = (context as any).ignorePatterns;

            expect(patterns).toContain('*.jpg');
            expect(patterns).toContain('*.png');
            expect(patterns).toContain('*.gif');
            expect(patterns).toContain('*.mp4');
            expect(patterns).toContain('*.mp3');
            expect(patterns).toContain('*.pdf');
        });

        it('should include database file patterns', () => {
            const context = createMockContext();
            const patterns = (context as any).ignorePatterns;

            expect(patterns).toContain('*.db');
            expect(patterns).toContain('*.sqlite');
            expect(patterns).toContain('*.sqlite3');
        });

        it('should include archive file patterns', () => {
            const context = createMockContext();
            const patterns = (context as any).ignorePatterns;

            expect(patterns).toContain('*.zip');
            expect(patterns).toContain('*.tar');
            expect(patterns).toContain('*.gz');
            expect(patterns).toContain('*.rar');
            expect(patterns).toContain('*.7z');
        });

        it('should include lock file patterns', () => {
            const context = createMockContext();
            const patterns = (context as any).ignorePatterns;

            expect(patterns).toContain('yarn.lock');
            expect(patterns).toContain('Gemfile.lock');
            expect(patterns).toContain('poetry.lock');
            expect(patterns).toContain('composer.lock');
            expect(patterns).toContain('Pipfile.lock');
            expect(patterns).toContain('pnpm-lock.yaml');
            expect(patterns).toContain('go.sum');
        });

        it('should include OS-specific file patterns', () => {
            const context = createMockContext();
            const patterns = (context as any).ignorePatterns;

            expect(patterns).toContain('Thumbs.db');
            expect(patterns).toContain('desktop.ini');
            expect(patterns).toContain('.Spotlight-V100');
            expect(patterns).toContain('.Trashes');
        });

        it('should include infrastructure/DevOps patterns', () => {
            const context = createMockContext();
            const patterns = (context as any).ignorePatterns;

            expect(patterns).toContain('.terraform/**');
            expect(patterns).toContain('*.tfstate');
            expect(patterns).toContain('*.tfstate.backup');
            expect(patterns).toContain('.dockerignore');
        });

        it('should include documentation build outputs', () => {
            const context = createMockContext();
            const patterns = (context as any).ignorePatterns;

            expect(patterns).toContain('_site/**');
            expect(patterns).toContain('site/**');
            expect(patterns).toContain('book/**');
            expect(patterns).toContain('docs/_build/**');
        });

        it('should include language-specific caches', () => {
            const context = createMockContext();
            const patterns = (context as any).ignorePatterns;

            expect(patterns).toContain('.cargo/**');
            expect(patterns).toContain('.stack-work/**');
            expect(patterns).toContain('_build/**');
            expect(patterns).toContain('.elixir_ls/**');
            expect(patterns).toContain('.dart_tool/**');
            expect(patterns).toContain('zig-cache/**');
            expect(patterns).toContain('zig-out/**');
        });

        it('should include monorepo tool directories', () => {
            const context = createMockContext();
            const patterns = (context as any).ignorePatterns;

            expect(patterns).toContain('.nx/**');
            expect(patterns).toContain('.rush/**');
        });

        it('should include build tool caches', () => {
            const context = createMockContext();
            const patterns = (context as any).ignorePatterns;

            expect(patterns).toContain('.webpack/**');
            expect(patterns).toContain('.vite/**');
            expect(patterns).toContain('.tsbuildinfo');
        });

        it('should include backend/language-specific build outputs', () => {
            const context = createMockContext();
            const patterns = (context as any).ignorePatterns;

            expect(patterns).toContain('.gradle/**');
            expect(patterns).toContain('bin/**');
            expect(patterns).toContain('obj/**');
            expect(patterns).toContain('*.egg-info/**');
        });

        it('should include minified and bundled file patterns', () => {
            const context = createMockContext();
            const patterns = (context as any).ignorePatterns;

            expect(patterns).toContain('*.min.js');
            expect(patterns).toContain('*.min.css');
            expect(patterns).toContain('*.bundle.js');
            expect(patterns).toContain('*.chunk.js');
            expect(patterns).toContain('*.vendor.js');
            expect(patterns).toContain('*.polyfills.js');
            expect(patterns).toContain('*.runtime.js');
            expect(patterns).toContain('*.map');
        });

        it('should include environment and config file patterns', () => {
            const context = createMockContext();
            const patterns = (context as any).ignorePatterns;

            expect(patterns).toContain('.env');
            expect(patterns).toContain('.env.*');
            expect(patterns).toContain('*.local');
        });

        it('should include log and temporary file patterns', () => {
            const context = createMockContext();
            const patterns = (context as any).ignorePatterns;

            expect(patterns).toContain('logs/**');
            expect(patterns).toContain('tmp/**');
            expect(patterns).toContain('temp/**');
            expect(patterns).toContain('*.log');
            expect(patterns).toContain('*.tmp');
            expect(patterns).toContain('*.temp');
        });
    });

    describe('Custom Ignore Patterns', () => {
        it('should allow adding custom ignore patterns', () => {
            const customPatterns = ['custom/**', '*.custom'];
            const context = createMockContext({
                ignorePatterns: customPatterns
            });

            const patterns = (context as any).ignorePatterns;
            expect(patterns).toContain('custom/**');
            expect(patterns).toContain('*.custom');
        });

        it('should merge custom patterns with default patterns', () => {
            const customPatterns = ['custom/**'];
            const context = createMockContext({
                ignorePatterns: customPatterns
            });

            const patterns = (context as any).ignorePatterns;

            // Should have both default and custom patterns
            expect(patterns).toContain('node_modules/**'); // Default
            expect(patterns).toContain('custom/**'); // Custom
        });
    });

    describe('Pattern Coverage', () => {
        it('should have comprehensive coverage for Node.js projects', () => {
            const context = createMockContext();
            const patterns = (context as any).ignorePatterns;

            const nodejsPatterns = [
                'node_modules/**',
                '.next/**',
                '.nuxt/**',
                'dist/**',
                'build/**',
                '*.bundle.js',
                '*.min.js',
                'yarn.lock',
                'pnpm-lock.yaml'
            ];

            nodejsPatterns.forEach(pattern => {
                expect(patterns).toContain(pattern);
            });
        });

        it('should have comprehensive coverage for Python projects', () => {
            const context = createMockContext();
            const patterns = (context as any).ignorePatterns;

            const pythonPatterns = [
                'venv/**',
                '.venv/**',
                'env/**',
                '__pycache__/**',
                '*.pyc',
                '*.egg-info/**',
                'htmlcov/**',
                '.coverage',
                '.pytest_cache/**',
                'poetry.lock',
                'Pipfile.lock'
            ];

            pythonPatterns.forEach(pattern => {
                expect(patterns).toContain(pattern);
            });
        });

        it('should have comprehensive coverage for Java projects', () => {
            const context = createMockContext();
            const patterns = (context as any).ignorePatterns;

            const javaPatterns = [
                'target/**',
                '.gradle/**',
                '*.class',
                '*.jar',
                '*.war',
                'bin/**'
            ];

            javaPatterns.forEach(pattern => {
                expect(patterns).toContain(pattern);
            });
        });

        it('should have comprehensive coverage for .NET projects', () => {
            const context = createMockContext();
            const patterns = (context as any).ignorePatterns;

            const dotnetPatterns = [
                'bin/**',
                'obj/**',
                '*.dll',
                '*.exe'
            ];

            dotnetPatterns.forEach(pattern => {
                expect(patterns).toContain(pattern);
            });
        });

        it('should have comprehensive coverage for Ruby projects', () => {
            const context = createMockContext();
            const patterns = (context as any).ignorePatterns;

            const rubyPatterns = [
                'vendor/**',
                '.bundle/**',
                'Gemfile.lock'
            ];

            rubyPatterns.forEach(pattern => {
                expect(patterns).toContain(pattern);
            });
        });

        it('should have comprehensive coverage for Go projects', () => {
            const context = createMockContext();
            const patterns = (context as any).ignorePatterns;

            const goPatterns = [
                'vendor/**',
                'bin/**',
                'go.sum'
            ];

            goPatterns.forEach(pattern => {
                expect(patterns).toContain(pattern);
            });
        });
    });
});
