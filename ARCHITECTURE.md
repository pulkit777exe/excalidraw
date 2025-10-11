# EscaliDraw Monorepo Architecture

This repository implements a monorepo architecture similar to the Dub repository, utilizing shared packages for consistent design and development experience.

## 🏗️ Architecture Overview

The monorepo is structured using **Turborepo** and **pnpm workspaces** with the following key packages:

### 📦 Core Packages

#### `@repo/tailwind-config`
Centralized Tailwind CSS configuration with:
- **Semantic color system** with CSS variables for light/dark mode
- **Custom animations** (scale-in, fade-in, slide animations)
- **Typography configuration** with custom fonts
- **Plugin ecosystem** (forms, typography, radix)

#### `@repo/ui`
Comprehensive UI component library with:
- **Reusable components** built with Tailwind CSS
- **TypeScript support** with proper interfaces
- **Variant-based design** system
- **Composition patterns** for complex components

#### `@repo/store`
State management using Zustand with:
- **Auth store** for user authentication
- **Canvas store** for drawing state
- **Room store** for collaborative features
- **UI store** for application state

## 🎨 Design System

### Color System
The design system uses semantic color names that automatically adapt to light/dark themes:

```typescript
// Background colors
bg-default, bg-emphasis, bg-subtle, bg-muted, bg-inverted

// Border colors  
border-default, border-emphasis, border-subtle, border-muted

// Content colors
content-default, content-emphasis, content-subtle, content-muted, content-inverted

// Status colors
bg-info, bg-success, bg-attention, bg-error
content-info, content-success, content-attention, content-error
```

### Component Variants
Components support multiple variants for different use cases:

```typescript
// Button variants
<Button variant="primary">Primary Action</Button>
<Button variant="outline">Secondary Action</Button>
<Button variant="ghost">Subtle Action</Button>

// Card variants
<Card variant="glass" hover>Glass morphism effect</Card>
<Card variant="gradient">Gradient background</Card>
```

## 🧩 Available Components

### Form Components
- **Button** - Multiple variants (primary, secondary, outline, ghost, destructive, success)
- **Input** - Form inputs with labels, icons, and error states
- **Select** - Dropdown select with custom styling
- **Switch** - Toggle switches with labels and descriptions

### Layout Components
- **Card** - Container with header, content, and footer
- **Modal** - Accessible modals with animations
- **Layout** - Structural layout components
- **Section** - Page sections with containers and headers
- **Background** - Background patterns and effects

### Interactive Components
- **Toolbar** - Complex toolbar with groups, buttons, and color pickers
- **Avatar** - User avatars with status indicators
- **Badge** - Status badges and labels
- **Tooltip** - Hover tooltips with positioning
- **Separator** - Visual separators

### Utility Components
- **FeatureCard** - Feature showcase cards
- **LoadingSpinner** - Loading indicators

## 🚀 Usage Examples

### Basic Component Usage
```typescript
import { Button, Card, Input } from '@repo/ui';

function MyComponent() {
  return (
    <Card variant="glass" hover>
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
        <CardDescription>Enter your details below</CardDescription>
      </CardHeader>
      <CardContent>
        <Input 
          label="Email" 
          type="email" 
          placeholder="Enter your email"
        />
        <Button variant="primary" className="mt-4">
          Submit
        </Button>
      </CardContent>
    </Card>
  );
}
```

### Complex Layout
```typescript
import { Layout, Section, Background } from '@repo/ui';

function App() {
  return (
    <Background variant="gradient" pattern="dots">
      <Layout variant="centered">
        <Section variant="hero">
          <SectionContainer>
            <SectionHeader>
              <SectionTitle>Welcome to EscaliDraw</SectionTitle>
              <SectionDescription>
                Collaborative drawing made simple
              </SectionDescription>
            </SectionHeader>
            {/* Content */}
          </SectionContainer>
        </Section>
      </Layout>
    </Background>
  );
}
```

## 🔧 Development Workflow

### Adding New Components
1. Create component in `packages/ui/src/`
2. Export from `packages/ui/src/index.ts`
3. Use semantic color system
4. Add TypeScript interfaces
5. Test in applications

### Updating Design System
1. Modify `packages/tailwind-config/tailwind.config.ts`
2. Update semantic color variables
3. Test across all applications
4. Update component variants if needed

### Building and Testing
```bash
# Install dependencies
pnpm install

# Type checking
pnpm run check-types

# Linting
pnpm run lint

# Development
pnpm run dev

# Build
pnpm run build
```

## 📁 Project Structure

```
escalidraw/
├── apps/
│   ├── web/                 # Next.js web application
│   ├── backend-http/        # HTTP API server
│   └── backend-ws/          # WebSocket server
├── packages/
│   ├── ui/                  # UI component library
│   ├── tailwind-config/     # Shared Tailwind config
│   ├── store/               # State management
│   ├── db/                  # Database package
│   └── typescript-config/   # Shared TypeScript config
├── pnpm-workspace.yaml      # Workspace configuration
├── turbo.json              # Turborepo configuration
└── package.json            # Root package.json
```

## 🎯 Benefits

### Design Consistency
- All components use the same color system and spacing
- Centralized configuration prevents design drift
- Semantic naming ensures consistent theming

### Developer Experience
- One-line imports: `import { Button, Card } from '@repo/ui'`
- Full TypeScript support with IntelliSense
- Hot reloading for immediate feedback
- Tree shaking for optimal bundle size

### Maintainability
- Single source of truth for design tokens
- Easy updates across all applications
- Version control for all design changes
- Isolated component testing

### Performance
- Shared dependencies reduce bundle size
- Turborepo handles build caching
- Optimized builds with tree shaking

## 🔄 Migration from Existing Code

The architecture is already implemented and being used in:
- `apps/web/app/page.tsx` - Home page with feature cards
- `apps/web/app/canvas/[canvasId]/page.tsx` - Canvas page with toolbar

All components are imported from `@repo/ui` and use the shared design system.

## 🧪 Testing Components

A test file `test-components.tsx` is available to verify all components work correctly. This can be used for:
- Visual regression testing
- Component behavior verification
- Design system validation

## 📚 Next Steps

1. **Add more components** as needed (dropdowns, date pickers, etc.)
2. **Enhance animations** with more sophisticated transitions
3. **Add dark mode** toggle functionality
4. **Create component documentation** with Storybook
5. **Add unit tests** for components
6. **Implement accessibility** improvements

This architecture provides a solid foundation for scalable, maintainable, and consistent UI development across the entire EscaliDraw application.
