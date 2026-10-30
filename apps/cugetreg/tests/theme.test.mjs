import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';

test('theme initializes before app content, including when storage is blocked', () => {
  const html = readFileSync(
    new URL('../src/app.html', import.meta.url),
    'utf8',
  );
  const script = html.match(/<script>([\s\S]*?)<\/script>/);
  assert.ok(script);
  assert.ok(html.indexOf('</script>') < html.indexOf('%sveltekit.head%'));

  for (const stored of [
    'dark',
    'light',
    null,
    'invalid',
    new Error('blocked'),
  ]) {
    for (const prefersDark of [false, true]) {
      let dark;
      runInNewContext(script[1], {
        localStorage: {
          getItem(key) {
            assert.equal(key, 'cugetreg:themeOverride');
            if (stored instanceof Error) throw stored;
            return stored;
          },
        },
        window: {
          matchMedia: () => ({ matches: prefersDark }),
        },
        document: {
          documentElement: {
            classList: {
              toggle(name, enabled) {
                assert.equal(name, 'dark');
                dark = enabled;
              },
            },
          },
        },
      });
      assert.equal(
        dark,
        stored === 'dark' ? true : stored === 'light' ? false : prefersDark,
      );
    }
  }
});
