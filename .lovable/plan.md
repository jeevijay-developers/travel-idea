

## Plan: Move Visa Finder Below Hero & Add Agreement Checkbox

### What will change

1. **Hero Section** -- Remove the 3-field Visa Finder form (destination, current location, purpose) and the "Talk to expert" link from the hero. The hero will revert to showing just the animated headline, subheadline, trust badges, and the visa card carousel.

2. **New standalone "Find My Visa" section** -- Place the existing `VisaFinder` component (already in `src/components/home/VisaFinder.tsx`) on the Home page right below the Hero Section. This component already has 2 fields (Destination + Travel Purpose) -- no "Current Location" field.

3. **Add agreement checkbox** -- Inside the `VisaFinder` component, add a checkbox before the "Find My Visa" button with text: *"I understand that visa charges and document requirements may vary by country."* The "Find My Visa" button will be disabled until the checkbox is checked.

4. **No changes needed to admin panel** -- There is no `current_location` field in the enquiry table or admin UI, so nothing to remove there.

### Technical Details

**Files to modify:**

- **`src/components/home/HeroSection.tsx`**
  - Remove the Visa Finder form block (the glassmorphism card with 3 select fields and the Find My Visa button, lines ~231-322)
  - Remove unused state (`currentLocation`, `destination`, `purpose`, `countries`, `isLoadingCountries`)
  - Remove unused imports (`Select`, `Globe`, `MapPin`, `Briefcase`, `Plane`, `supabase`, country fetch logic)
  - The hero will end after the trust badges, followed by the visa card carousel

- **`src/components/home/VisaFinder.tsx`**
  - Add a `Checkbox` import and an `agreed` state
  - Add a checkbox row with the agreement text between the select fields and the "Find My Visa" button
  - Disable the button when `agreed` is false

- **`src/pages/Home.tsx`**
  - Import `VisaFinder` from `@/components/home`
  - Place `<VisaFinder />` immediately after `<HeroSection />`

