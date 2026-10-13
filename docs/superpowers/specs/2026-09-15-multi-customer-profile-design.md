# Multi-Customer Profile Template Design

## Goal

Convert the single-customer profile form into a practical multi-customer workbook where each customer occupies one row and the dataset can be filtered, sorted, and extended.

## Workbook design

- Keep one primary worksheet and rename it `Customer Database`.
- Place four formula-driven summary metrics above the data table: total customers, active customers, complete profiles, and marketing-consented customers.
- Use a native Excel table with 100 ready-to-use rows. Excel can extend the table when new rows are added.
- Freeze the title and header rows for scrolling.
- Use a dark header row, light body banding, readable column widths, and restrained yellow input cues only where appropriate.

## Customer row fields

Each row will contain: Customer ID, customer type, full name, preferred name, organization, role/title, email, phone, city/region, country, preferred contact channel, preferred language, lifecycle stage, lead source, dates created/updated, product interests, buying frequency, preferred shopping channel, decision factors, products/services owned, last purchase date, average order value, relationship health, goals, pain points, objections, recommended next step, marketing consent, data source/owner, data sensitivity notes, and a calculated profile-completion percentage.

## Controls and formulas

- Add dropdown validation for categorical fields such as customer type, lifecycle stage, contact channel, language, buying frequency, shopping channel, relationship health, lead source, and marketing consent.
- Store dates and order values as typed spreadsheet values with explicit formats.
- Calculate profile completion from required fields and leave the result blank for unused rows.
- Use conditional formatting on completion percentage and summary status cues.
- Include five clearly labeled fictional Cambodian starter records, with Cambodian cities, Khmer/English preferences, +855 phone formats, KHR values, local sectors, and fictional example emails.

## Verification

- Inspect the saved workbook for headers, formulas, and summary ranges.
- Recalculate after authoring and scan for formula errors.
- Change representative input cells in memory to confirm summary metrics and row completion update.
- Render the worksheet to confirm headers, widths, frozen navigation area, and controls are readable.
