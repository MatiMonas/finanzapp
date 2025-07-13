# Changelog

## [0.5.0] - Full Refactor: Bun-Compatible Mocks, Test Isolation, Cleanup, and Modernization

### Added
- Factory-based mocks for all modules, compatible with Bun and supporting test isolation.
- New configuration files: TSOA, ESLint, Husky pre-commit hooks, and environment files.
- `createMockFn` and `testHelpers` utilities for Bun-based testing.
- New controller implementations for budgets, users, and wages.
- Comprehensive documentation covering development, endpoints, setup, and troubleshooting.
- Custom type definitions for Bun and Moment.js.

### Changed
- All test files updated to use mock factories and Bun-compatible helpers.
- Entity builders, directors, repositories, usecases, and validators refactored for type safety, testability, and error handling.
- Main application entry (`src/app.ts`) refactored for clarity and compatibility.
- Type definitions and database models centralized and improved.
- Infrastructure, utilities, and core modules modernized and cleaned up.

### Removed
- All legacy HTTP handler, middleware, and router files for budgets, users, and wages.
- Obsolete infrastructure files and related tests.
- Old utility files and the obsolete `swagger.yaml`.
- Redundant or problematic tests that no longer fit the new architecture.

### Fixed
- Test interference and state leakage by ensuring all mocks are isolated per test.
- Type errors and edge cases in repositories, usecases, and validators.
- Improved error messages and validation logic across all modules.

---

**General Impact:**
- The codebase is now fully compatible with Bun for testing and development.
- All tests are isolated, robust, and pass in parallel.
- The project structure is cleaner, with obsolete code removed and all modules following a consistent, maintainable pattern.
- Type safety and error handling have been significantly improved across all layers.
- Documentation and configuration are up to date and comprehensive. 