import { Context } from '../../src/context';
import mockFs from 'mock-fs';
import * as path from 'path';
import * as fs from 'fs';

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

describe('Integration - Indexing with Ignore Patterns', () => {
    afterEach(() => {
        mockFs.restore();
    });

    describe('Node.js Project Indexing', () => {
        beforeEach(() => {
            mockFs({
                '/test/nodejs-project': {
                    'package.json': '{"name": "test-app"}',
                    'src': {
                        'index.ts': 'export const app = "Hello";',
                        'utils.ts': 'export function helper() {}',
                    },
                    'node_modules': {
                        'express': {
                            'index.js': 'module.exports = {}',
                        },
                    },
                    '.next': {
                        'cache': {
                            'data.json': '{}',
                        },
                    },
                    'dist': {
                        'bundle.js': 'console.log("bundled")',
                    },
                    'yarn.lock': 'dependencies...',
                },
            });
        });

        it('should ignore node_modules directory', async () => {
            const context = createMockContext();

            const files = await (context as any).getCodeFiles('/test/nodejs-project');

            const hasNodeModules = files.some((f: string) => f.includes('node_modules'));
            expect(hasNodeModules).toBe(false);
        });

        it('should ignore .next directory', async () => {
            const context = createMockContext();

            const files = await (context as any).getCodeFiles('/test/nodejs-project');

            const hasNext = files.some((f: string) => f.includes('.next'));
            expect(hasNext).toBe(false);
        });

        it('should ignore dist directory', async () => {
            const context = createMockContext();

            const files = await (context as any).getCodeFiles('/test/nodejs-project');

            const hasDist = files.some((f: string) => f.includes('dist'));
            expect(hasDist).toBe(false);
        });

        it('should ignore lock files', async () => {
            const context = createMockContext();

            const files = await (context as any).getCodeFiles('/test/nodejs-project');

            const hasLock = files.some((f: string) => f.includes('yarn.lock'));
            expect(hasLock).toBe(false);
        });

        it('should index source files', async () => {
            const context = createMockContext();

            const files = await (context as any).getCodeFiles('/test/nodejs-project');

            expect(files).toContain(path.join('/test/nodejs-project', 'src', 'index.ts'));
            expect(files).toContain(path.join('/test/nodejs-project', 'src', 'utils.ts'));
        });
    });

    describe('Python Project Indexing', () => {
        beforeEach(() => {
            mockFs({
                '/test/python-project': {
                    'requirements.txt': 'flask==2.0.0',
                    'src': {
                        'main.py': 'def main(): pass',
                        'utils.py': 'def helper(): pass',
                    },
                    'venv': {
                        'lib': {
                            'python3.9': {
                                'site-packages': {
                                    'flask.py': 'flask library',
                                },
                            },
                        },
                    },
                    '__pycache__': {
                        'main.cpython-39.pyc': Buffer.from('compiled'),
                    },
                    'tests': {
                        '__pycache__': {
                            'test_main.cpython-39.pyc': Buffer.from('compiled'),
                        },
                        'test_main.py': 'def test(): pass',
                    },
                    'htmlcov': {
                        'index.html': '<html>Coverage Report</html>',
                    },
                    '.coverage': 'coverage data',
                    'poetry.lock': 'dependencies...',
                },
            });
        });

        it('should ignore venv directory', async () => {
            const context = createMockContext();

            const files = await (context as any).getCodeFiles('/test/python-project');

            const hasVenv = files.some((f: string) => f.includes('venv'));
            expect(hasVenv).toBe(false);
        });

        it('should ignore __pycache__ directories', async () => {
            const context = createMockContext();

            const files = await (context as any).getCodeFiles('/test/python-project');

            const hasPycache = files.some((f: string) => f.includes('__pycache__'));
            expect(hasPycache).toBe(false);
        });

        it('should ignore coverage output', async () => {
            const context = createMockContext();

            const files = await (context as any).getCodeFiles('/test/python-project');

            const hasCov = files.some((f: string) => f.includes('htmlcov') || f.includes('.coverage'));
            expect(hasCov).toBe(false);
        });

        it('should ignore lock files', async () => {
            const context = createMockContext();

            const files = await (context as any).getCodeFiles('/test/python-project');

            const hasLock = files.some((f: string) => f.includes('poetry.lock'));
            expect(hasLock).toBe(false);
        });

        it('should index Python source files', async () => {
            const context = createMockContext();

            const files = await (context as any).getCodeFiles('/test/python-project');

            expect(files).toContain(path.join('/test/python-project', 'src', 'main.py'));
            expect(files).toContain(path.join('/test/python-project', 'src', 'utils.py'));
            expect(files).toContain(path.join('/test/python-project', 'tests', 'test_main.py'));
        });
    });

    describe('Multi-Language Project Indexing', () => {
        beforeEach(() => {
            mockFs({
                '/test/fullstack-project': {
                    'backend': {
                        'src': {
                            'main': {
                                'java': {
                                    'com': {
                                        'example': {
                                            'App.java': 'public class App {}',
                                        },
                                    },
                                },
                            },
                        },
                        'target': {
                            'classes': {
                                'App.class': Buffer.from('compiled'),
                            },
                        },
                        'pom.xml': '<project></project>',
                    },
                    'frontend': {
                        'src': {
                            'App.tsx': 'export const App = () => {};',
                            'index.ts': 'import App from "./App";',
                        },
                        'node_modules': {
                            'react': {
                                'index.js': 'module.exports = React',
                            },
                        },
                        '.next': {
                            'server': {
                                'pages.js': 'pages build',
                            },
                        },
                        'package.json': '{"name": "frontend"}',
                    },
                    'docs': {
                        'README.md': '# Documentation',
                        '_site': {
                            'index.html': '<html>Docs</html>',
                        },
                    },
                    '.git': {
                        'config': '[core]',
                    },
                    '.DS_Store': Buffer.from('Mac OS'),
                },
            });
        });

        it('should ignore all build outputs across languages', async () => {
            const context = createMockContext();

            const files = await (context as any).getCodeFiles('/test/fullstack-project');

            const hasTarget = files.some((f: string) => f.includes('target'));
            const hasNext = files.some((f: string) => f.includes('.next'));
            const hasSite = files.some((f: string) => f.includes('_site'));

            expect(hasTarget).toBe(false);
            expect(hasNext).toBe(false);
            expect(hasSite).toBe(false);
        });

        it('should ignore version control and OS files', async () => {
            const context = createMockContext();

            const files = await (context as any).getCodeFiles('/test/fullstack-project');

            const hasGit = files.some((f: string) => f.includes('.git'));
            const hasDS = files.some((f: string) => f.includes('.DS_Store'));

            expect(hasGit).toBe(false);
            expect(hasDS).toBe(false);
        });

        it('should index source files from all languages', async () => {
            const context = createMockContext();

            const files = await (context as any).getCodeFiles('/test/fullstack-project');

            // Java files
            const hasJava = files.some((f: string) => f.includes('App.java'));
            expect(hasJava).toBe(true);

            // TypeScript files
            const hasTS = files.some((f: string) => f.includes('App.tsx') || f.includes('index.ts'));
            expect(hasTS).toBe(true);

            // Markdown files
            const hasMd = files.some((f: string) => f.includes('README.md'));
            expect(hasMd).toBe(true);
        });
    });

    describe('Binary and Media Files', () => {
        beforeEach(() => {
            mockFs({
                '/test/media-project': {
                    'src': {
                        'index.ts': 'export const app = "Hello";',
                    },
                    'assets': {
                        'logo.png': Buffer.from('PNG'),
                        'video.mp4': Buffer.from('MP4'),
                        'doc.pdf': Buffer.from('PDF'),
                    },
                    'libs': {
                        'library.jar': Buffer.from('JAR'),
                        'native.dll': Buffer.from('DLL'),
                        'app.exe': Buffer.from('EXE'),
                    },
                    'archives': {
                        'backup.zip': Buffer.from('ZIP'),
                        'data.tar.gz': Buffer.from('TAR'),
                    },
                },
            });
        });

        it('should ignore binary files', async () => {
            const context = createMockContext();

            const files = await (context as any).getCodeFiles('/test/media-project');

            const hasBinary = files.some((f: string) =>
                f.includes('.jar') || f.includes('.dll') || f.includes('.exe')
            );
            expect(hasBinary).toBe(false);
        });

        it('should ignore media files', async () => {
            const context = createMockContext();

            const files = await (context as any).getCodeFiles('/test/media-project');

            const hasMedia = files.some((f: string) =>
                f.includes('.png') || f.includes('.mp4') || f.includes('.pdf')
            );
            expect(hasMedia).toBe(false);
        });

        it('should ignore archive files', async () => {
            const context = createMockContext();

            const files = await (context as any).getCodeFiles('/test/media-project');

            const hasArchive = files.some((f: string) =>
                f.includes('.zip') || f.includes('.tar.gz')
            );
            expect(hasArchive).toBe(false);
        });

        it('should only index source code files', async () => {
            const context = createMockContext();

            const files = await (context as any).getCodeFiles('/test/media-project');

            expect(files).toHaveLength(1);
            expect(files[0]).toContain('index.ts');
        });
    });

    describe('Testing Framework Outputs', () => {
        beforeEach(() => {
            mockFs({
                '/test/tested-project': {
                    'src': {
                        'app.ts': 'export const app = "Hello";',
                    },
                    'tests': {
                        'app.test.ts': 'test("app", () => {});',
                    },
                    'coverage': {
                        'lcov-report': {
                            'index.html': '<html>Coverage</html>',
                        },
                    },
                    'test-results': {
                        'results.json': '{"passed": 10}',
                    },
                    'playwright-report': {
                        'index.html': '<html>Report</html>',
                    },
                    'cypress': {
                        'videos': {
                            'test.mp4': Buffer.from('VIDEO'),
                        },
                        'screenshots': {
                            'test.png': Buffer.from('PNG'),
                        },
                        'integration': {
                            'test.cy.ts': 'describe("test", () => {});',
                        },
                    },
                },
            });
        });

        it('should ignore test coverage outputs', async () => {
            const context = createMockContext();

            const files = await (context as any).getCodeFiles('/test/tested-project');

            const hasCoverage = files.some((f: string) => f.includes('coverage'));
            expect(hasCoverage).toBe(false);
        });

        it('should ignore test result outputs', async () => {
            const context = createMockContext();

            const files = await (context as any).getCodeFiles('/test/tested-project');

            const hasResults = files.some((f: string) =>
                f.includes('test-results') || f.includes('playwright-report')
            );
            expect(hasResults).toBe(false);
        });

        it('should ignore Cypress videos and screenshots', async () => {
            const context = createMockContext();

            const files = await (context as any).getCodeFiles('/test/tested-project');

            const hasMedia = files.some((f: string) =>
                f.includes('cypress/videos') || f.includes('cypress/screenshots')
            );
            expect(hasMedia).toBe(false);
        });

        it('should index test source files', async () => {
            const context = createMockContext();

            const files = await (context as any).getCodeFiles('/test/tested-project');

            const hasTests = files.some((f: string) =>
                f.includes('app.test.ts') || f.includes('test.cy.ts')
            );
            expect(hasTests).toBe(true);
        });

        it('should index application source files', async () => {
            const context = createMockContext();

            const files = await (context as any).getCodeFiles('/test/tested-project');

            expect(files).toContain(path.join('/test/tested-project', 'src', 'app.ts'));
        });
    });

    describe('Custom Ignore Patterns', () => {
        beforeEach(() => {
            mockFs({
                '/test/custom-project': {
                    'src': {
                        'app.ts': 'export const app = "Hello";',
                    },
                    'generated': {
                        'api.ts': 'export const api = {};',
                    },
                    'temp': {
                        'cache.ts': 'export const cache = {};',
                    },
                },
            });
        });

        it('should respect custom ignore patterns', async () => {
            const context = createMockContext({
                ignorePatterns: ['generated/**', 'temp/**'],
            });

            const files = await (context as any).getCodeFiles('/test/custom-project');

            const hasGenerated = files.some((f: string) => f.includes('generated'));
            const hasTemp = files.some((f: string) => f.includes('temp'));

            expect(hasGenerated).toBe(false);
            expect(hasTemp).toBe(false);
        });

        it('should index non-ignored files with custom patterns', async () => {
            const context = createMockContext({
                ignorePatterns: ['generated/**'],
            });

            const files = await (context as any).getCodeFiles('/test/custom-project');

            expect(files).toContain(path.join('/test/custom-project', 'src', 'app.ts'));
        });

        it('should merge custom patterns with default patterns', async () => {
            mockFs({
                '/test/merged-project': {
                    'src': {
                        'app.ts': 'export const app = "Hello";',
                    },
                    'node_modules': {
                        'lib': {
                            'index.js': 'module.exports = {}',
                        },
                    },
                    'custom-ignore': {
                        'file.ts': 'export const file = {};',
                    },
                },
            });

            const context = createMockContext({
                ignorePatterns: ['custom-ignore/**'],
            });

            const files = await (context as any).getCodeFiles('/test/merged-project');

            // Should ignore both default (node_modules) and custom (custom-ignore)
            const hasNodeModules = files.some((f: string) => f.includes('node_modules'));
            const hasCustom = files.some((f: string) => f.includes('custom-ignore'));

            expect(hasNodeModules).toBe(false);
            expect(hasCustom).toBe(false);

            // Should index src files
            expect(files).toContain(path.join('/test/merged-project', 'src', 'app.ts'));
        });
    });
});
