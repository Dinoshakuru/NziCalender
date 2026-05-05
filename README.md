# 📅 Business Calendar Manager

A sophisticated React + TypeScript application for managing custom business calendars that decouple "Calendar Time" from "Real-World Time."

## Features

✨ **Key Capabilities:**
- **Custom Calendar Configuration** - Define your own fiscal years, months, and day structures
- **Event Management** - Create, edit, and delete business events tied to custom dates
- **Calendar Visualization** - Interactive month/year view with event highlighting
- **Date Conversion** - Bidirectional conversion between custom calendar dates and UTC
- **Timezone Support** - Handle global business operations across time zones
- **Production-Ready UI** - Built with Chakra UI v3 for professional appearance

## Tech Stack

- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Chakra UI v3** - Component library with accessibility
- **Vite** - Lightning-fast build tool
- **Emotion** - CSS-in-JS styling

## Project Structure

```
src/
├── App.tsx                 # Main application with routing
├── main.tsx               # React 18 entry point
├── types.ts               # TypeScript interfaces
├── utils.ts               # Calendar conversion utilities
├── components/
│   ├── CalendarSettings.tsx    # Configure fiscal calendar
│   ├── EventsManager.tsx       # CRUD operations for events
│   ├── CalendarView.tsx        # Month/year visualization
│   └── DateConverter.tsx       # Custom ↔ Real date conversion
├── index.html             # HTML template
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
└── vite.config.ts         # Build configuration
```

## Installation

### Prerequisites
- Node.js 16+ and npm/yarn

### Setup

1. **Clone or download this project**
   ```bash
   git clone <repository-url>
   cd business-calendar-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

## Usage Guide

### 1. Configuration Tab
Define your custom calendar:
- **Start Date**: Real-world UTC date mapping to Year 1, Month 1, Day 1
- **Fiscal Year Start**: Which month begins your fiscal year (1-12)
- **Timezone**: Your primary business timezone
- **Year Length**: Total days in your calendar year
- **Month Lengths**: Days in each month (must sum to year length)

Example: Standard Gregorian calendar
- Start: 2024-01-01 (UTC)
- Fiscal Start: January (Month 1)
- Year Length: 365 days
- Month Lengths: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

### 2. Events Tab
Create and manage business events:
- Add new events with custom dates
- Link events to specific Year/Month/Day combinations
- Real-world UTC dates calculated automatically
- Edit or delete events
- Timezone-aware event storage

### 3. Calendar View Tab
Visualize your business calendar:
- Interactive month/year navigation
- Events displayed on calendar grid
- Color-coded event indicators
- Quarter information
- Event list view

### 4. Date Converter Tab
Convert between calendar systems:
- **Custom → Real**: Convert custom calendar dates to UTC timestamps
- **Real → Custom**: Convert UTC dates to your business calendar
- Displays day of week, quarter number, and detailed metadata

## API Reference

### Types

#### CalendarConfig
```typescript
interface CalendarConfig {
  id: string;
  startDateUtc: Date;           // UTC epoch date
  fiscalStartMonth: number;     // 1-12
  timezone: string;             // e.g., "UTC", "America/New_York"
  yearLength: number;           // Total days per year
  monthLengths: number[];       // Array of 12 month lengths
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### BusinessEvent
```typescript
interface BusinessEvent {
  id: string;
  title: string;
  description?: string;
  customYear: number;           // Year in custom calendar
  customMonth: number;          // 1-12
  day: number;                  // 1-31
  realDate: Date;              // Calculated UTC date
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;            // Soft delete support
}
```

### Utility Functions

#### customToRealDate()
Convert custom calendar date to real UTC date.
```typescript
const realDate = customToRealDate(config, year, month, day);
```

#### realToCustomDate()
Convert real UTC date to custom calendar date.
```typescript
const result = realToCustomDate(config, utcDate);
// Returns: { customDate, realDate, dayOfWeek, quarterNumber }
```

#### isValidCustomDate()
Validate a custom date.
```typescript
const valid = isValidCustomDate(config, year, month, day);
```

#### getDaysInMonth()
Get number of days in a custom calendar month.
```typescript
const days = getDaysInMonth(config, year, month);
```

#### formatCustomDate()
Format custom date as readable string.
```typescript
const formatted = formatCustomDate(year, month, day);
// "January 15, Year 1"
```

## Use Cases

### Fiscal Calendar Management
Manage fiscal years that don't align with calendar years:
- F2024 starting March 1, 2024
- 4-5-4 retail calendar (4 weeks, 5 weeks, 4 weeks)
- Academic calendar (Sept-Aug)

### Production Scheduling
Custom manufacturing weeks or shift patterns:
- 10-day work weeks
- Non-standard seasonal schedules

### International Operations
Handle multiple fiscal calendars across regions:
- Each timezone gets its own calendar view
- Automatic UTC synchronization
- Real-time event notifications

### Compliance & Reporting
Financial/audit periods:
- Half-yearly reporting cycles
- Custom compliance windows
- Quarter-end close processes

## Database Schema Integration

To persist data, connect to backend:

```typescript
// Example: POST /api/calendars
const saveConfig = async (config: CalendarConfig) => {
  const response = await fetch('/api/calendars', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config)
  });
  return response.json();
};
```

Reference the schema from the initial specification:
- **CalendarSettings Table**: One config per business context
- **Events Table**: Many-to-one relationship with CalendarSettings
- **Calendar_Exceptions**: Handle edge cases and overrides
- **Calendar_History**: Track configuration changes

## Performance Notes

- **Memoization**: Components use React.memo for events list
- **Lazy Evaluation**: Date calculations performed on-demand
- **Validation**: Client-side validation before API calls
- **Timezone Handling**: Uses standard IANA timezone database

## Accessibility

- ✅ WCAG 2.1 AA compliant (via Chakra UI)
- ✅ Keyboard navigation support
- ✅ Screen reader friendly
- ✅ High contrast color support
- ✅ Form validation with clear error messages

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers (iOS Safari, Chrome Mobile)

## Building for Production

```bash
npm run build
# Outputs to: dist/

npm run preview
# Test production build locally
```

## Troubleshooting

### Configuration Won't Save
- Verify month lengths sum to year length
- Check start date is valid UTC format

### Date Conversion Errors
- Ensure calendar is configured first
- Validate day is within month's range
- Check timezone is IANA standard format

### Month Lengths Don't Match
- Reset to default (Gregorian calendar)
- Verify total equals declared year length

## Advanced Features

### Custom Hooks (Future)
```typescript
const useCustomDate = (config: CalendarConfig) => {
  // Hook for working with custom dates
};
```

### Event Recurrence (Future)
```typescript
interface RecurringEvent extends BusinessEvent {
  recurrenceRule: string;  // iCal format: RRULE:FREQ=MONTHLY;...
}
```

### Notifications (Future)
```typescript
const notifyEventReminder = (event: BusinessEvent, minutesBefore: number) => {
  // Send notification before event
};
```

## Contributing

1. Ensure TypeScript strict mode compliance
2. Test date conversions across edge cases
3. Add tests for utility functions
4. Keep components under 200 lines
5. Document custom logic with comments

## License

MIT License - See LICENSE file

## Support

For issues, feature requests, or questions:
- Open an issue on GitHub
- Check existing documentation
- Review utility function specs

---

**Built with ❤️ for precise business calendar management**
