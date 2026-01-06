import ngrx from "@ngrx/eslint-plugin";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default [
  {
    ignores: ["projects/**/*"]
  },
  {
    plugins: {
      "@ngrx": ngrx
    },

    rules: {
      "@ngrx/good-action-hygiene": "error"
    }
  },
  ...compat
    .extends(
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:@angular-eslint/recommended",
      "plugin:@angular-eslint/template/process-inline-templates",
      "plugin:prettier/recommended"
    )
    .map(config => ({
      ...config,
      files: ["**/*.ts"]
    })),
  {
    files: ["**/*.ts"],

    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase"
        }
      ],

      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case"
        }
      ],

      "@typescript-eslint/no-explicit-any": "off",

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "none"
        }
      ]
    }
  },
  ...compat.extends("plugin:@angular-eslint/template/recommended", "plugin:prettier/recommended").map(config => ({
    ...config,
    files: ["**/*.html"]
  })),
  {
    files: ["**/*.html"],
    rules: {}
  },
  ...compat.extends("plugin:@ngrx/all").map(config => ({
    ...config,
    files: ["**/*.ts"]
  }))
];

