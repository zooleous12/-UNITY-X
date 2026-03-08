# Lecture Me - Project TODO

## Core Restoration
- [x] Extract and copy existing codebase from archive
- [x] Install all dependencies (including stripe)
- [x] Push database migrations (10 tables verified)
- [x] Fix Stripe initialization to be graceful without key
- [x] Server running successfully with OAuth

## Asset Management
- [x] Upload client/public images to S3 CDN
- [x] Upload marketing images to S3 CDN
- [x] Replace local image references with CDN URLs in code
- [x] Move local media files to webdev-static-assets

## UI Polish & Sauce
- [x] Enhance Home page hero section with animations and visual flair
- [x] Refine purple theme with gradient depth and glass effects
- [x] Add micro-interactions and hover effects throughout
- [ ] Polish Dashboard layout with better cards and stats
- [ ] Enhance navigation with smooth transitions
- [ ] Improve mobile responsiveness
- [ ] Add loading skeletons and empty states

## Testing
- [x] Run existing vitest tests
- [x] Verify all test suites pass (14 files, 78 tests all passing)
- [x] Fix materialProcessing timestamp test race condition
- [x] Fix uploads.delete test with proper AND query
- [x] Fix materialProcessing fileUrl -> originalFileUrl column name
- [x] Create all missing database tables via migration script

## Delivery
- [x] Save checkpoint
- [x] Deliver to user

## Issues Raised
- [x] Fix app name from "Lecture Me Pro" to "Lecture Me"
- [ ] Find lectureme.org domain paperwork in the uploaded archive
- [x] Investigate the 108 users in the database - 82 total: 81 test users from vitest, 1 real user (Charles Kendrick)
- [ ] Set up custom domain lectureme.org

## Bug Fix - React Error #310
- [ ] Fix React error #310 - hook (useState/useMutation) called outside component context on published site
- [ ] Verify app loads without errors after fix
- [ ] Test all major features end-to-end
- [ ] Reproduce React #310 error in production build locally
- [ ] Fix production build crash on authenticated pages
- [ ] Verify production build works end-to-end
