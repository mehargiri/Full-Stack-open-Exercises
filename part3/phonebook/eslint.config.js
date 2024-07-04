import pluginJs from "@eslint/js";
import globals from "globals";

export default [
	pluginJs.configs.recommended,
	{ ignores: ["dist/**"] },
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
			ecmaVersion: "latest",
		},
		// plugins: {
		//   '@stylistic/js': stylisticJs,
		// },
		// rules: {
		//   '@stylistic/js/indent': ['error', 2],
		//   '@stylistic/js/linebreak-style': ['error', 'unix'],
		//   '@stylistic/js/quotes': ['error', 'single'],
		//   '@stylistic/js/semi': ['error', 'never'],
		// },
	},
];
