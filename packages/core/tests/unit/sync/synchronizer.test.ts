import { FileSynchronizer } from '../../../src/sync/synchronizer';
import * as path from 'path';
import * as fs from 'fs';
import mockFs from 'mock-fs';

describe('FileSynchronizer - Ignore Patterns', () => {
    let synchronizer: FileSynchronizer;
    const testDir = '/test/codebase';

    afterEach(() => {
        mockFs.restore();
    });

    describe('shouldIgnore - Hidden Files', () => {
        beforeEach(() => {
            synchronizer = new FileSynchronizer(testDir, []);
        });

        it('should ignore files starting with dot', () => {
            const result = (synchronizer as any).shouldIgnore('.hidden-file.txt', false);
            expect(result).toBe(true);
        });

        it('should ignore directories starting with dot', () => {
            const result = (synchronizer as any).shouldIgnore('.hidden-dir/file.ts', false);
            expect(result).toBe(true);
        });

        it('should ignore nested hidden directories', () => {
            const result = (synchronizer as any).shouldIgnore('src/.hidden/file.ts', false);
            expect(result).toBe(true);
        });

        it('should not ignore normal files', () => {
            const result = (synchronizer as any).shouldIgnore('file.ts', false);
            expect(result).toBe(false);
        });
    });

    describe('shouldIgnore - Directory Patterns', () => {
        beforeEach(() => {
            synchronizer = new FileSynchronizer(testDir, [
                'node_modules/',
                'dist/',
                '.next/',
                'venv/'
            ]);
        });

        it('should ignore exact directory match', () => {
            const result = (synchronizer as any).shouldIgnore('node_modules', true);
            expect(result).toBe(true);
        });

        it('should ignore files inside ignored directory', () => {
            const result = (synchronizer as any).shouldIgnore('node_modules/package/file.js', false);
            expect(result).toBe(true);
        });

        it('should ignore nested directories', () => {
            const result = (synchronizer as any).shouldIgnore('.next/cache/data.json', false);
            expect(result).toBe(true);
        });

        it('should not ignore similar named files', () => {
            const result = (synchronizer as any).shouldIgnore('node_modules.txt', false);
            expect(result).toBe(false);
        });
    });

    describe('shouldIgnore - Path Patterns with Glob', () => {
        beforeEach(() => {
            synchronizer = new FileSynchronizer(testDir, [
                'node_modules/**',
                'dist/**',
                'build/**',
                'src/generated/**'
            ]);
        });

        it('should ignore paths matching glob patterns', () => {
            expect((synchronizer as any).shouldIgnore('node_modules/lib/file.js', false)).toBe(true);
            expect((synchronizer as any).shouldIgnore('dist/bundle/main.js', false)).toBe(true);
            expect((synchronizer as any).shouldIgnore('build/output/app.js', false)).toBe(true);
        });

        it('should ignore specific path patterns', () => {
            const result = (synchronizer as any).shouldIgnore('src/generated/api.ts', false);
            expect(result).toBe(true);
        });

        it('should not ignore non-matching paths', () => {
            const result = (synchronizer as any).shouldIgnore('src/manual/api.ts', false);
            expect(result).toBe(false);
        });
    });

    describe('shouldIgnore - Filename Patterns', () => {
        beforeEach(() => {
            synchronizer = new FileSynchronizer(testDir, [
                '*.log',
                '*.min.js',
                '*.bundle.js',
                '*.pyc',
                '*.class'
            ]);
        });

        it('should ignore files matching extension patterns', () => {
            expect((synchronizer as any).shouldIgnore('app.log', false)).toBe(true);
            expect((synchronizer as any).shouldIgnore('main.min.js', false)).toBe(true);
            expect((synchronizer as any).shouldIgnore('vendor.bundle.js', false)).toBe(true);
        });

        it('should ignore files in nested directories', () => {
            expect((synchronizer as any).shouldIgnore('src/logs/app.log', false)).toBe(true);
            expect((synchronizer as any).shouldIgnore('dist/js/main.min.js', false)).toBe(true);
        });

        it('should not ignore files with different extensions', () => {
            expect((synchronizer as any).shouldIgnore('app.txt', false)).toBe(false);
            expect((synchronizer as any).shouldIgnore('main.js', false)).toBe(false);
        });
    });

    describe('shouldIgnore - Binary and Media Files', () => {
        beforeEach(() => {
            synchronizer = new FileSynchronizer(testDir, [
                '*.exe',
                '*.dll',
                '*.jar',
                '*.jpg',
                '*.png',
                '*.pdf'
            ]);
        });

        it('should ignore binary files', () => {
            expect((synchronizer as any).shouldIgnore('app.exe', false)).toBe(true);
            expect((synchronizer as any).shouldIgnore('library.dll', false)).toBe(true);
            expect((synchronizer as any).shouldIgnore('app.jar', false)).toBe(true);
        });

        it('should ignore media files', () => {
            expect((synchronizer as any).shouldIgnore('photo.jpg', false)).toBe(true);
            expect((synchronizer as any).shouldIgnore('logo.png', false)).toBe(true);
            expect((synchronizer as any).shouldIgnore('document.pdf', false)).toBe(true);
        });
    });

    describe('shouldIgnore - Framework-Specific Patterns', () => {
        beforeEach(() => {
            synchronizer = new FileSynchronizer(testDir, [
                '.next/**',
                '.nuxt/**',
                'venv/**',
                '.venv/**',
                'vendor/**',
                '.gradle/**'
            ]);
        });

        it('should ignore Next.js build directory', () => {
            expect((synchronizer as any).shouldIgnore('.next/cache/data.json', false)).toBe(true);
        });

        it('should ignore Nuxt build directory', () => {
            expect((synchronizer as any).shouldIgnore('.nuxt/dist/server.js', false)).toBe(true);
        });

        it('should ignore Python virtual environments', () => {
            expect((synchronizer as any).shouldIgnore('venv/lib/python3.9/site.py', false)).toBe(true);
            expect((synchronizer as any).shouldIgnore('.venv/bin/activate', false)).toBe(true);
        });

        it('should ignore vendor directories', () => {
            expect((synchronizer as any).shouldIgnore('vendor/bundle/ruby/gem.rb', false)).toBe(true);
        });

        it('should ignore Gradle directories', () => {
            expect((synchronizer as any).shouldIgnore('.gradle/cache/file.bin', false)).toBe(true);
        });
    });

    describe('shouldIgnore - Lock Files', () => {
        beforeEach(() => {
            synchronizer = new FileSynchronizer(testDir, [
                'yarn.lock',
                'Gemfile.lock',
                'poetry.lock',
                'composer.lock',
                'pnpm-lock.yaml',
                'go.sum'
            ]);
        });

        it('should ignore lock files', () => {
            expect((synchronizer as any).shouldIgnore('yarn.lock', false)).toBe(true);
            expect((synchronizer as any).shouldIgnore('Gemfile.lock', false)).toBe(true);
            expect((synchronizer as any).shouldIgnore('poetry.lock', false)).toBe(true);
            expect((synchronizer as any).shouldIgnore('pnpm-lock.yaml', false)).toBe(true);
        });

        it('should ignore lock files in subdirectories', () => {
            expect((synchronizer as any).shouldIgnore('packages/app/yarn.lock', false)).toBe(true);
        });
    });

    describe('shouldIgnore - OS-Specific Files', () => {
        beforeEach(() => {
            synchronizer = new FileSynchronizer(testDir, [
                'Thumbs.db',
                '.DS_Store',
                'desktop.ini',
                '.Spotlight-V100',
                '.Trashes'
            ]);
        });

        it('should ignore Windows OS files', () => {
            expect((synchronizer as any).shouldIgnore('Thumbs.db', false)).toBe(true);
            expect((synchronizer as any).shouldIgnore('desktop.ini', false)).toBe(true);
        });

        it('should ignore macOS files', () => {
            expect((synchronizer as any).shouldIgnore('.DS_Store', false)).toBe(true);
            expect((synchronizer as any).shouldIgnore('.Spotlight-V100', false)).toBe(true);
            expect((synchronizer as any).shouldIgnore('.Trashes', false)).toBe(true);
        });
    });

    describe('shouldIgnore - Testing Output Directories', () => {
        beforeEach(() => {
            synchronizer = new FileSynchronizer(testDir, [
                'coverage/**',
                'htmlcov/**',
                '.coverage',
                'test-results/**',
                'playwright-report/**'
            ]);
        });

        it('should ignore coverage directories', () => {
            expect((synchronizer as any).shouldIgnore('coverage/lcov-report/index.html', false)).toBe(true);
            expect((synchronizer as any).shouldIgnore('htmlcov/index.html', false)).toBe(true);
        });

        it('should ignore coverage data files', () => {
            expect((synchronizer as any).shouldIgnore('.coverage', false)).toBe(true);
        });

        it('should ignore test output directories', () => {
            expect((synchronizer as any).shouldIgnore('test-results/result.json', false)).toBe(true);
            expect((synchronizer as any).shouldIgnore('playwright-report/index.html', false)).toBe(true);
        });
    });

    describe('matchPattern', () => {
        beforeEach(() => {
            synchronizer = new FileSynchronizer(testDir, []);
        });

        // Note: Directory pattern matching is thoroughly tested via shouldIgnore tests
        // The matchPattern method is primarily used internally by shouldIgnore

        it('should match path patterns', () => {
            expect((synchronizer as any).matchPattern('src/generated/api.ts', 'src/generated/**', false)).toBe(true);
        });

        it('should match filename patterns', () => {
            expect((synchronizer as any).matchPattern('path/to/file.log', '*.log', false)).toBe(true);
        });
    });

    describe('simpleGlobMatch', () => {
        beforeEach(() => {
            synchronizer = new FileSynchronizer(testDir, []);
        });

        it('should match exact strings', () => {
            expect((synchronizer as any).simpleGlobMatch('test', 'test')).toBe(true);
            expect((synchronizer as any).simpleGlobMatch('test', 'other')).toBe(false);
        });

        it('should match wildcard patterns', () => {
            expect((synchronizer as any).simpleGlobMatch('test.txt', '*.txt')).toBe(true);
            expect((synchronizer as any).simpleGlobMatch('test.log', '*.txt')).toBe(false);
        });

        it('should match multiple wildcards', () => {
            expect((synchronizer as any).simpleGlobMatch('node_modules/package/file.js', 'node_modules/**')).toBe(true);
        });

        it('should match patterns with wildcards in middle', () => {
            expect((synchronizer as any).simpleGlobMatch('main.bundle.js', '*.bundle.js')).toBe(true);
            expect((synchronizer as any).simpleGlobMatch('vendor.chunk.js', '*.bundle.js')).toBe(false);
        });
    });

    describe('Integration - Multiple Pattern Types', () => {
        beforeEach(() => {
            synchronizer = new FileSynchronizer(testDir, [
                'node_modules/**',
                '*.log',
                'dist/',
                '.env',
                '*.min.js'
            ]);
        });

        it('should correctly apply multiple different pattern types', () => {
            // Glob pattern
            expect((synchronizer as any).shouldIgnore('node_modules/lib/file.js', false)).toBe(true);

            // Extension pattern
            expect((synchronizer as any).shouldIgnore('app.log', false)).toBe(true);

            // Directory pattern
            expect((synchronizer as any).shouldIgnore('dist', true)).toBe(true);

            // Exact file pattern
            expect((synchronizer as any).shouldIgnore('.env', false)).toBe(true);

            // Minified file pattern
            expect((synchronizer as any).shouldIgnore('bundle.min.js', false)).toBe(true);

            // Should not ignore normal files
            expect((synchronizer as any).shouldIgnore('src/app.ts', false)).toBe(false);
        });
    });

    describe('Edge Cases', () => {
        beforeEach(() => {
            synchronizer = new FileSynchronizer(testDir, ['test/**']);
        });

        it('should handle empty paths', () => {
            expect((synchronizer as any).shouldIgnore('', false)).toBe(false);
        });

        it('should handle root path', () => {
            expect((synchronizer as any).shouldIgnore('/', false)).toBe(false);
        });

        it('should handle paths with multiple slashes', () => {
            const result = (synchronizer as any).shouldIgnore('test//file.js', false);
            expect(result).toBe(true);
        });

        it('should handle paths with backslashes (Windows)', () => {
            const result = (synchronizer as any).shouldIgnore('test\\file.js', false);
            expect(result).toBe(true);
        });
    });
});
