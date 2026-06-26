# liangmiQwQ Agent Guide

`liangmiQwQ` is a cli which includes a tui and is named with Liang's handle to show personal information.

This codebase also acts Liang's GitHub profile readme, it includes an introduce.svg and a README file, we should not modify them without any necessary reason.

## Development

This project is based on [Vue TUI](https://github.com/vuejs-ai/vue-tui), we use it to load `.vue` components, and handle testing with Vite+'s test (Vitest).

This project itself is using Vite+, and `@liangmi/vp-config` (`cli` category). It handles library bundling (tsdown) and linting, testing, formatting (Oxlint, Vitest, Oxfmt). Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Rules

Vite+ is used as the project manager. Use `vp install` to install dependencies, use `vp install -D` if the adden dependency can be bundled. Use `vp run` command to run commands in `package.json`. Do not use `pnpm` or `npm` directly.

Run `vp check` (lint and format) after you make changes.

Keep AGENTS.md updated with the project codebase. Consider if there is need to modify AGENTS.md after your changes. Don't store meaningless things like project structure or project status in AGENTS.md.

Keep code functional. Never use classes. Write simple code and make function reusable if possible. Use Unix philosophy to design your code (Every function should only do one thing and should not be too long or complex).

Use existing dependencies and tools. Feel free to add dependencies. Don't reinvent the wheel.

Add `.gitkeep` file when creating new empty directory
