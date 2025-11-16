# Test Suite Documentation

This test suite provides comprehensive coverage for the production readiness updates to the Fern & Fog Creations e-commerce site.

## Test Framework

- **Vitest**: Modern, fast unit test framework for Vite/Next.js projects
- **React Testing Library**: For testing React components
- **jsdom**: Browser environment simulation

## Setup

Install test dependencies:
```bash
pnpm install
```

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test -- --watch

# Run tests with UI
pnpm test:ui

# Generate coverage report
pnpm test:coverage

# Run specific test file
pnpm test app/__tests__/error.test.tsx

# Run tests matching pattern
pnpm test navigation
```

## Test Coverage

### Error Handling
- `app/__tests__/error.test.tsx` - Global error boundary component (12 tests)
- `app/__tests__/not-found.test.tsx` - 404 page component (10 tests)

### SEO
- `app/__tests__/robots.test.ts` - Search engine directives (12 tests)
- `app/__tests__/sitemap.test.ts` - Dynamic sitemap generation (13 tests)

### Analytics
- `components/analytics/__tests__/Analytics.test.tsx` - Google Analytics/GTM integration (9 tests)

### Builder.io Integration
- `lib/builder/__tests__/config.test.ts` - Builder.io configuration (11 tests)
- `lib/builder/__tests__/navigation.test.ts` - Navigation/footer CMS integration (14 tests)

### CMS Blocks
- `components/builder/blocks/__tests__/ProductGridBlock.test.tsx` - Product grid component (15 tests)
- `components/builder/blocks/__tests__/GalleryPreviewBlock.test.tsx` - Gallery preview component (15 tests)

**Total: 111 comprehensive tests**

## Test Structure

Each test file follows this structure:

1. **Imports and Setup**: Mock dependencies and configure test environment
2. **Happy Path Tests**: Verify expected behavior with valid inputs
3. **Edge Cases**: Test boundary conditions and unusual inputs
4. **Error Handling**: Ensure graceful degradation when things go wrong
5. **Integration**: Test component interactions and data flow

## Mocking Strategy

### Next.js Mocks
- `next/navigation` - Router hooks
- `next/image` - Image component
- `next/link` - Link component

### Builder.io Mocks
- `@/lib/builder/resolve-content` - Content fetching
- `@next/third-parties/google` - Analytics components

### Data Source Mocks
- `@/lib/data-source` - Product data fetching

## Key Testing Patterns

### Component Testing
```typescript
import { render, screen } from '@testing-library/react';

it('renders component', () => {
  render(<MyComponent />);
  expect(screen.getByText('Expected Text')).toBeInTheDocument();
});
```

### Async Testing
```typescript
it('fetches data', async () => {
  const result = await fetchData();
  expect(result).toBeDefined();
});
```

### User Interactions
```typescript
import { fireEvent } from '@testing-library/react';

it('handles click', () => {
  render(<Button onClick={mockFn} />);
  fireEvent.click(screen.getByRole('button'));
  expect(mockFn).toHaveBeenCalled();
});
```

### Error Scenarios
```typescript
it('handles errors gracefully', async () => {
  mockFn.mockRejectedValue(new Error('Test error'));
  const result = await functionUnderTest();
  expect(result).toBe(fallbackValue);
});
```

## CI/CD Integration

Add to your CI/CD pipeline:

```yaml
# Example GitHub Actions
- name: Run tests
  run: pnpm test

- name: Generate coverage
  run: pnpm test:coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
```

## Best Practices

1. **Descriptive Test Names**: Use clear, specific test descriptions
2. **Arrange-Act-Assert**: Structure tests in three clear phases
3. **Isolation**: Each test should be independent
4. **Cleanup**: Use `afterEach` for cleanup operations
5. **Avoid Implementation Details**: Test behavior, not implementation
6. **Mock External Dependencies**: Keep tests fast and reliable

## Troubleshooting

### Tests Fail to Import Modules
- Check `vitest.config.ts` path aliases match `tsconfig.json`
- Ensure all dependencies are installed

### Mock Not Working
- Verify mock is defined before importing the module
- Use `vi.resetModules()` to clear module cache between tests

### Async Tests Timeout
- Increase timeout: `it('test', async () => {...}, 10000)`
- Check for unresolved promises

## Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## Future Enhancements

Consider adding:
- E2E tests with Playwright
- Visual regression testing
- Performance testing
- Accessibility testing with axe-core
- Integration tests for complete user flows