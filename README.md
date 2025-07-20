# smart-web

A modern web application built with React + TypeScript + Vite

This project is a comprehensive web application that includes:
- User management system
- Modern UI components
- TypeScript support
- Vite for fast development

## Technical Stack

- React 18
- TypeScript
- Vite
- Ant Design
- ESLint for code quality

## Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## ESLint Configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```
