import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
    js.configs.recommended,
    ...compat.extends(),
    prettier,

    {
        ignores: ["node_modules/**", ".prisma/**", "dist/**", "build/**", ".next/**", "coverage/**"],
    },

    {
        plugins: {
            import: importPlugin,
            "simple-import-sort": simpleImportSort,
        },

        settings: {
            "import/resolver": {
                typescript: {
                    alwaysTryTypes: true,
                    project: "./tsconfig.json",
                },
                node: {
                    extensions: [".js", ".ts"],
                },
            },
        },

        rules: {
            "simple-import-sort/imports": [
                "error",
                {
                    groups: [
                        ["^@?\\w"], // Packages
                        ["^@HM/(.*)$"], // Custom absolute imports
                        ["^\\.\\.(?!/?$)", "^\\.\\./?$"], // Parent imports
                        ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"], // Relative imports
                        ["^\\u0000"], // Side effect imports
                    ],
                },
            ],
            "simple-import-sort/exports": "error",

            "no-restricted-imports": [
                "error",
                {
                    patterns: ["../*", "./../*"], // Avoid relative deep imports
                },
            ],

            "no-console": "off", // Allow console logs for debugging
            "no-debugger": "error",

            "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],

            "import/no-unresolved": "error",
        },
    },
];
