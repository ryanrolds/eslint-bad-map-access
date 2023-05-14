import {ESLintUtils} from '@typescript-eslint/utils';
import {noBadAccess} from './bad_access';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: '../tsconfig.json',
    tsconfigRootDir: __dirname,
  },
});

ruleTester.run('flag accessing of Map properties', noBadAccess, {
  valid: [
    {
      code: 'const m = new Map(); m.set("foo", 1);',
    },
    {
      code: 'const m = new Map(); const foo = m.get("foo");',
    },
    {
      code: 'const m = new Map(); const foo = m.has("foo");',
    },
    {
      code: 'const m = new Map(); const foo = m.delete("foo");',
    },
    {
      code: 'const m = new Map(); const foo = m.size;',
    },
    {
      code: `
        type Foo = Map<string, number>;; 
        const f = new Foo();
        const size = f.size;
      `,
    },
  ],
  invalid: [
    {
      code: 'const m = new Map(); m["foo"] = 1;',
      errors: [{messageId: 'badAccess'}],
    },
    {
      code: 'const m = new Map(); const foot = m["foo"];',
      errors: [{messageId: 'badAccess'}],
    },
    {
      code: 'const m = new Map(); !!m["foo"];',
      errors: [{messageId: 'badAccess'}],
    },
    {
      code: 'const m = new Map(); delete m["foo"];',
      errors: [{messageId: 'badAccess'}],
    },
    {
      code: 'const m = new Map(); Object.keys(m).length',
      errors: [{messageId: 'badAccess'}],
    },
    {
      code: `
        type Foo = Map<string, number>;
        function bar(foo: Foo): number {
          return foo["foo"];
        }   
      `,
      errors: [{messageId: 'badAccess'}],
    },
  ]
});

ruleTester.run('object and lodash methods', noBadAccess, {
  valid: [
    {
      code: `
        const m = new Map();
        const foo = m.keys();`,
    },
    {
      code: `
        const m = new Map();
        const foo = m.values();`,
    },
    {
      code: `
        const m = new Map();
        const foo = m.entries();`,
    },
    {
      code: `
        const m = new Map();
        const foo = Array.from(m.entries());`,
    },
    {
      code: `
        const m = new Map();
        const foo = Array.from(m.values());`,
    },
    {
      code: `
        const m = new Map();
        const foo = Array.from(m.keys());`,
    },
    {
      code: `
        const m = new Map();
        Array.from(m.entries())
      `,
    },
  ],
  invalid: [
    {
      code: `
        const m = new Map();
        const foo = Object.keys(m);
      `,
      errors: [{messageId: 'badAccess'}],
    },
    {
      code: `
        const m = new Map();
        const foo = Object.values(m);
      `,
      errors: [{messageId: 'badAccess'}],
    },
    {
      code: `
        const m = new Map();
        const foo = Object.entities(m);
      `,
      errors: [{messageId: 'badAccess'}],
    },
    {
      code: `
        const m = new Map();
        const foo = _.keys(m);
      `,
      errors: [{messageId: 'badAccess'}],
    },
    {
      code: `
        const m = new Map();
        const foo = _.values(m);
      `,
      errors: [{messageId: 'badAccess'}],
    },
    {
      code: `
        const m = new Map();
        const foo = _.entities(m);
      `,
      errors: [{messageId: 'badAccess'}],
    },
    {
      code: `
        const m = new Map();
        const foo = Array.from(m);
      `,
      errors: [{messageId: 'badAccess'}],
    },
    {
      code: `
        type Foo = Map<string, number>;
        function bar(foo: Foo): number[] {
          return Object.values(foo);
        }
      `,
      errors: [{messageId: 'badAccess'}],
    },
  ]
});

ruleTester.run('object as Map', noBadAccess, {
  valid: [
    {
      code: `const foo = {} as Record<string, number>;`,
    },
    {
      code: `
        type Foo = Record<string, number>;
        const foo = {} as Foo;
      `,
    },
  ],
  invalid: [
    {
      code: `const foo = {} as Map<string, number>;`,
      errors: [{messageId: 'badAccess'}],
    },
    {
      code: `
        type Foo = Map<string, number>;
        const foo = {} as Foo;
      `,
      errors: [{messageId: 'badAccess'}],
    },
  ]
});
