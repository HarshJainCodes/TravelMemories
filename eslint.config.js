import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import pluginVitest from '@vitest/eslint-plugin';
import pluginCypress from 'eslint-plugin-cypress/flat';
import skipFormatting, {
	files,
	languageOptions,
} from '@vue/eslint-config-prettier/skip-formatting';
import vue from 'eslint-plugin-vue';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';

export default [
	{
		name: 'app/files-to-lint',
		files: ['**/*.{js,mjs,jsx,vue}'],
	},

	{
		name: 'app/files-to-ignore',
		ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
	},

	js.configs.recommended,
	...pluginVue.configs['flat/essential'],

	{
		...pluginVitest.configs.recommended,
		files: ['src/**/__tests__/*'],
	},

	{
		...pluginCypress.configs.recommended,
		files: [
			'cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}',
			'cypress/support/**/*.{js,ts,jsx,tsx}',
		],
	},
	skipFormatting,
	{
		files: ['**/*.ts', '**/*.vue'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
			},
		},
		rules: {
			//   ...vue.configs['vue3-recommended'].rules,
			// ...tseslint.configs.recommended.rules,
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'vue/multi-word-component-names': 'off',
			'no-console': 'error',
			indent: ['error', 4],
		},
	},
	prettier,
];
