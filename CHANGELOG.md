# Changelog

All notable changes to TravelViet AI will be documented in this file.

## [2.0.0] - 2026-03-16

### Added
- Complete ExplorePage with search, regions, and top destinations
- ResetPasswordPage for password recovery flow
- 15+ new UI components (Pagination, RatingStars, UserAvatar, SearchInput, TagInput, FileUpload, DateRangePicker, Stepper, Timeline, TextAreaWithCounter, Chip, ConfirmButton, InfoCard)
- 10+ new custom hooks (useWindowSize, useCountdown, useCopyToClipboard, usePageTitle, useScrollPosition, usePrevious, useInterval, useFetch, useFormState)
- 30+ new utility modules covering:
  - String, number, array, URL, date utilities
  - Vietnamese destination, cuisine, holiday, weather data
  - Accessibility helpers and ARIA labels
  - SEO meta tags management
  - Animation variants library
  - Error handling with AppError class
  - Event tracking and analytics
  - Notification system
  - Rate limiting and memoization
  - Map clustering and distance calculations
  - CSV export for trip data
  - Social media sharing
  - Feature detection
  - Performance monitoring
  - Keyboard shortcut manager
  - Design system tokens
  - Data migration system
  - Markdown parsing utilities
- 50+ unit test files with comprehensive coverage
- API pagination and sorting type definitions
- Itinerary template presets
- Emergency contacts and safety information
- Province coordinate data for map features

### Fixed
- ChatPage duplicate imports causing build failure
- App.tsx route syntax errors for privacy/terms/about pages
- ExplorePage missing component body

### Changed
- Updated ARCHITECTURE.md with complete project structure
- Enhanced .env.example with GROQ_API_KEY configuration
- Improved budget utilities with health scoring
- Enhanced search utilities with relevance scoring
- Extended date utilities with calendar week generator
- Extended validation with trip/comment/profile schemas
- Extended format utilities with duration and percentage

## [1.0.0] - 2026-02-06

### Added
- Initial release with AI-powered trip planning
- Supabase backend with 16 database tables
- Authentication with email/password
- AI chat with Groq API streaming
- Community sharing and itinerary discovery
- Budget tracking and cost management
- Interactive maps with Leaflet
