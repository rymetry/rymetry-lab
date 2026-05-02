import { describe, expect, test } from 'bun:test';

import { processArticleContent } from './content';

describe('processArticleContent', () => {
  test('sanitizes unsafe HTML while preserving safe article markup', async () => {
    const result = await processArticleContent(`
      <h2 onclick="alert('xss')">Overview</h2>
      <p><strong>Safe</strong> content <a href="javascript:alert('xss')">bad link</a>.</p>
      <img src="https://images.microcms-assets.io/assets/test/example.png" alt="Example" onerror="alert('xss')" />
      <script>alert('xss')</script>
    `);

    expect(result.html).not.toContain('<script');
    expect(result.html).not.toContain('onclick');
    expect(result.html).not.toContain('onerror');
    expect(result.html).not.toContain('javascript:');
    expect(result.html).toContain('<strong>Safe</strong>');
    expect(result.html).toContain(
      'src="https://images.microcms-assets.io/assets/test/example.png"',
    );
    expect(result.toc).toEqual([{ id: 'overview', level: 2, text: 'Overview' }]);
  });

  test('builds a stable h2 and h3 table of contents with unique heading ids', async () => {
    const result = await processArticleContent(`
      <h1>Ignored</h1>
      <h2>Setup</h2>
      <h3>Install CLI</h3>
      <h2>Setup</h2>
      <h4>Ignored nested heading</h4>
    `);

    expect(result.toc).toEqual([
      { id: 'setup', level: 2, text: 'Setup' },
      { id: 'install-cli', level: 3, text: 'Install CLI' },
      { id: 'setup-2', level: 2, text: 'Setup' },
    ]);
    expect(result.html).toContain('<h2 id="setup">Setup</h2>');
    expect(result.html).toContain('<h3 id="install-cli">Install CLI</h3>');
    expect(result.html).toContain('<h2 id="setup-2">Setup</h2>');
  });

  test('adds syntax highlighting markup and line numbers for code blocks', async () => {
    const result = await processArticleContent(`
      <pre><code class="language-ts">const value: string = 'ok';</code></pre>
    `);

    expect(result.html).toContain('language-ts');
    expect(result.html).toContain('code-highlight');
    expect(result.html).toContain('line-number');
    expect(result.html).toContain('const');
  });
});
