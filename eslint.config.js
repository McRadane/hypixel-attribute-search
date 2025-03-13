import { fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js'
import prettier from 'eslint-config-prettier';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import perfectionistPlugin from 'eslint-plugin-perfectionist';
import promisePlugin from 'eslint-plugin-promise';
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import sonarjsPlugin, { configs as sonarjsConfigs } from 'eslint-plugin-sonarjs';
import webPlugin from 'eslint-plugin-web';
import globals from 'globals'
import path from 'path';
import tseslint , { parser as typescriptParser } from 'typescript-eslint'
import url from 'url';

// eslint-disable-next-line sonarjs/variable-name
const __filename = url.fileURLToPath(import.meta.url);
// eslint-disable-next-line sonarjs/variable-name
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const legacyPlugin = (name, alias = name) => {
  const plugin = compat.plugins(name)[0]?.plugins?.[alias];

  if (!plugin) {
    throw new Error(`Unable to resolve plugin ${name} and/or alias ${alias}`);
  }

  return fixupPluginRules(plugin);
};

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      },
      sourceType: 'module',
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/naming-convention': [
        'warn',
        { format: ['StrictPascalCase'], prefix: ['T'], selector: 'typeParameter' },
        {
          custom: {
            match: true,
            regex: `^([A-Z][a-z0-9]+)+`
          },
          format: ['PascalCase'],
          selector: ['class', 'enum']
        },
        {
          custom: {
            match: true,
            regex: `^([A-Z][a-z0-9]+)+`
          },
          format: ['PascalCase'],
          selector: 'typeAlias'
        },
        {
          format: ['camelCase', 'PascalCase'],
          leadingUnderscore: 'allow',
          selector: ['variable', 'function'],
          types: ['function']
        },
        {
          format: ['PascalCase'],
          prefix: ['I'],
          selector: 'interface'
        },
        {
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
          modifiers: ['destructured'],
          selector: 'variable'
        },
        {
          filter: {
            match: true,
            regex: 'Promise$'
          },
          format: ['camelCase'],
          modifiers: ['global'],
          selector: 'variable'
        },
        {
          format: ['camelCase'],
          modifiers: ['const'],
          selector: 'variable'
        },
        {
          format: ['UPPER_CASE', 'camelCase'],
          modifiers: ['global'],
          selector: 'variable'
        },
        {
          format: ['UPPER_CASE', 'camelCase', 'PascalCase'],
          modifiers: ['exported', 'global'],
          selector: 'variable'
        },
        {
          format: ['UPPER_CASE', 'camelCase'],
          leadingUnderscore: 'require',
          modifiers: ['unused'],
          selector: 'variable'
        },
        {
          format: ['UPPER_CASE'],
          selector: 'enumMember'
        },
        {
          format: ['camelCase'],
          leadingUnderscore: 'allow',
          selector: 'parameter'
        },
        {
          format: ['camelCase'],
          leadingUnderscore: 'require',
          modifiers: ['private'],
          selector: 'memberLike'
        }
      ],
      '@typescript-eslint/no-array-constructor': 'error',
      '@typescript-eslint/no-duplicate-enum-values': 'error',
      '@typescript-eslint/no-empty-object-type': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-extra-non-null-assertion': 'error',
      '@typescript-eslint/no-misused-new': 'error',
      '@typescript-eslint/no-namespace': 'error',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/no-this-alias': 'error',
      '@typescript-eslint/no-unnecessary-type-constraint': 'error',
      '@typescript-eslint/no-unsafe-declaration-merging': 'error',
      '@typescript-eslint/no-unsafe-function-type': 'error',
      '@typescript-eslint/no-unused-expressions': 'error',
      '@typescript-eslint/no-wrapper-object-types': 'error',
      '@typescript-eslint/prefer-as-const': 'error',
      '@typescript-eslint/prefer-namespace-keyword': 'error',
      '@typescript-eslint/triple-slash-reference': 'error',
      'constructor-super': 'off',
      'getter-return': 'off',
      'no-array-constructor': 'off',
      'no-class-assign': 'off',
      'no-console': 'warn',
      'no-const-assign': 'off',
      'no-dupe-args': 'off',
      'no-dupe-class-members': 'off',
      'no-dupe-keys': 'off',
      'no-func-assign': 'off',
      'no-import-assign': 'off',
      'no-new-native-nonconstructor': 'off',
      'no-new-symbol': 'off',
      'no-obj-calls': 'off',
      'no-redeclare': 'off',
      'no-setter-return': 'off',
      'no-this-before-super': 'off',
      'no-undef': 'off',
      'no-unreachable': 'off',
      'no-unsafe-negation': 'off',
      'no-unused-expressions': 'off',
      'no-unused-vars': 'off',
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ]
    },
  },
  prettier,
  { name: 'Web Plugin', plugins: { web: webPlugin }, rules: webPlugin.configs.all.rules },
  ...compat.extends('plugin:import/typescript'),
  { name: 'JSX A11y Plugin', plugins: { 'jsx-a11y': jsxA11yPlugin }, rules: jsxA11yPlugin.configs.recommended.rules },
  {
    name: 'Promise Plugin',
    plugins: { promise: legacyPlugin('eslint-plugin-promise', 'promise') },
    rules: {
      ...promisePlugin.configs.recommended.rules,
      'promise/always-return': 'off'
    }
  },
  {
    name: 'Perfecionist plugin',
    plugins: { perfectionist: perfectionistPlugin },
    rules: {
      ...perfectionistPlugin.configs['recommended-natural'].rules,
      'perfectionist/sort-array-includes': ['warn', { groupKind: 'literals-first' }],
      'perfectionist/sort-classes': [
        'warn',
        {
          groups: ['property', 'static-property', 'private-property', 'constructor', 'static-method', 'method', 'private-method']
        }
      ],
      'perfectionist/sort-enums': 'warn',
      'perfectionist/sort-imports': [
        'warn',
        {
          groups: [['builtin', 'external'], 'internal', 'parent', ['sibling', 'index'], 'style', 'object', 'side-effect'],
          newlinesBetween: 'always'
        }
      ],
      'perfectionist/sort-interfaces': 'warn',
      'perfectionist/sort-jsx-props': [
        'warn',
        {
          customGroups: {
            top: ['id', 'name', 'control']
          },
          groups: ['top', 'multiline', 'unknown', 'shorthand']
        }
      ],
      'perfectionist/sort-map-elements': 'off',
      'perfectionist/sort-modules': 'off',
      'perfectionist/sort-named-exports': 'warn',
      'perfectionist/sort-named-imports': 'warn',
      'perfectionist/sort-object-types': 'warn',
      'perfectionist/sort-objects': 'warn',
      'perfectionist/sort-union-types': 'warn'
    }
  },
  {
    ignores: ['vite.config.ts', '**/*.d.ts'],
    name: 'SonarLint Plugin',
    plugins: { sonarjs: sonarjsPlugin },
    rules: {
      ...sonarjsConfigs.recommended.rules,
      'sonarjs/arguments-usage': 'warn',
      'sonarjs/array-constructor': 'warn',
      'sonarjs/class-prototype': 'warn',
      'sonarjs/comment-regex': 'warn',
      'sonarjs/cyclomatic-complexity': 'warn',
      'sonarjs/declarations-in-global-scope': 'warn',
      'sonarjs/destructuring-assignment-syntax': 'warn',
      'sonarjs/expression-complexity': 'warn',
      'sonarjs/for-in': 'warn',
      'sonarjs/function-name': 'warn',
      'sonarjs/max-union-size': 'warn',
      'sonarjs/nested-control-flow': 'warn',
      'sonarjs/no-built-in-override': 'warn',
      'sonarjs/no-collapsible-if': 'warn',
      'sonarjs/no-duplicate-string': 'warn',
      'sonarjs/no-for-in-iterable': 'warn',
      'sonarjs/no-function-declaration-in-block': 'warn',
      'sonarjs/no-implicit-dependencies': 'warn',
      'sonarjs/no-incorrect-string-concat': 'warn',
      'sonarjs/no-nested-incdec': 'warn',
      'sonarjs/no-nested-switch': 'warn',
      'sonarjs/no-redundant-parentheses': 'warn',
      'sonarjs/no-reference-error': 'warn',
      'sonarjs/no-require-or-define': 'warn',
      'sonarjs/no-return-type-any': 'warn',
      'sonarjs/no-undefined-assignment': 'warn',
      'sonarjs/no-unused-function-argument': 'warn',
      'sonarjs/non-number-in-arithmetic-expression': 'warn',
      'sonarjs/operation-returning-nan': 'warn',
      'sonarjs/prefer-immediate-return': 'warn',
      'sonarjs/prefer-object-literal': 'warn',
      'sonarjs/regular-expr': 'warn',
      'sonarjs/standard-input': 'warn',
      'sonarjs/strings-comparison': 'warn',
      'sonarjs/too-many-break-or-continue-in-loop': 'warn',
      'sonarjs/unicode-aware-regex': 'warn',
      'sonarjs/useless-string-operation': 'warn',
      'sonarjs/values-not-convertible-to-numbers': 'warn',
      'sonarjs/variable-name': 'warn'
    }
  }
)
