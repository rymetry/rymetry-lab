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

  test('renders a filename bar for microCMS div-wrapped code blocks', async () => {
    const result = await processArticleContent(`
      <div data-filename=".github/workflows/ci.yml"><pre><code class="language-yaml">key: value</code></pre></div>
    `);

    expect(result.html).toContain('<figure class="code-block">');
    expect(result.html).toContain(
      '<figcaption class="code-filename">.github/workflows/ci.yml</figcaption>',
    );
    expect(result.html).toContain('language-yaml');
    expect(result.html).not.toContain('data-filename');
  });

  test('renders a filename bar for pre elements with data-filename', async () => {
    const result = await processArticleContent(`
      <pre data-filename="main.ts"><code class="language-ts">const ok = true;</code></pre>
    `);

    expect(result.html).toContain('<figure class="code-block">');
    expect(result.html).toContain('<figcaption class="code-filename">main.ts</figcaption>');
    expect(result.html).not.toContain('data-filename');
  });

  test('escapes markup inside filename labels', async () => {
    const result = await processArticleContent(`
      <div data-filename="&lt;b&gt;evil&lt;/b&gt;.ts"><pre><code>x</code></pre></div>
    `);

    expect(result.html).not.toContain('<b>evil</b>');
    expect(result.html).toContain('&#x3C;b>evil&#x3C;/b>.ts');
  });

  test('leaves plain code blocks without a filename untouched', async () => {
    const result = await processArticleContent(`
      <pre><code class="language-ts">const plain = true;</code></pre>
    `);

    expect(result.html).not.toContain('code-filename');
    expect(result.html).not.toContain('<figure');
  });
});
