# shadcn + pnpm Monorepo Demo

This repository demonstrates how to use [shadcn/ui](https://ui.shadcn.com/) in a monorepo setup managed by [pnpm](https://pnpm.io/).

## Project Structure

```
.
├── apps/
│   └── web/           # Next.js app using shadcn/ui
├── packages/
│   ├── ui/            # Shared UI components (shadcn/ui-based)
│   ├── typescript-config/  # Shared TypeScript configs
│   └── eslint-config/      # Shared ESLint configs
├── package.json       # Monorepo root
├── pnpm-workspace.yaml
└── turbo.json         # TurboRepo config (optional)
```

## Features

- **Monorepo** managed with pnpm workspaces
- **Next.js** app in `apps/web`
- **Shared UI** components in `packages/ui` using shadcn/ui
- **Reusable configs** for TypeScript and ESLint

## Getting Started

1. **Install dependencies**

```sh
pnpm install
```

2. **Run the Next.js app**

```sh
pnpm --filter web dev
```

3. **Develop shared UI**

- Edit components in `packages/ui/src/components/`
- Import them in your app: `import { Button } from '@your-scope/ui'`

4. **Add a shadcn/ui component to your app**

To add a new component from shadcn/ui to your app, navigate to your app directory (e.g., `apps/web`) and run the `add` command:

```sh
cd apps/web
pnpm dlx shadcn@latest add <component>
```

Replace `<component>` with the name of the component you want to add (e.g., `button`).

The component will be placed in the appropriate directory (e.g., `packages/ui/src/components/`).

## Using shadcn/ui

- The `ui` package is set up with shadcn/ui components (see `packages/ui/src/components/`).
- You can customize or extend these components as needed.
- Styles are managed with PostCSS and Tailwind (see `postcss.config.mjs` and `globals.css`).

## Monorepo Tips

- Use `pnpm` workspace commands to run scripts across packages.
- Share code and configs via the `packages/` directory.
- Use TurboRepo (`turbo.json`) for advanced task orchestration (optional).

## Useful Commands

- Install a dependency in a specific package:

```sh
pnpm add <package> --filter <package-name>
```

- Run lint across all packages:

```sh
pnpm lint
```

- Build all packages:

```sh
pnpm build
```

- [shadcn/ui Documentation](https://ui.shadcn.com/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Next.js](https://nextjs.org/)
- [TurboRepo](https://turbo.build/)

---

This demo is a starting point for building scalable, maintainable monorepos with shadcn/ui and pnpm.
