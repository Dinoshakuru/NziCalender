import { useState } from 'react';
import {
  Box,
  Container,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  ChakraProvider,
  extendTheme,
  CSSReset,
} from '@chakra-ui/react';
import CalendarSettings from './components/CalendarSettings';
import EventsManager from './components/EventsManager';
import CalendarView from './components/CalendarView';
import DateConverter from './components/DateConverter';
import type { CalendarConfig, BusinessEvent } from './types';

// Custom theme with refined aesthetic
const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      50: '#f0f4ff',
      100: '#dde5ff',
      200: '#c8d5ff',
      300: '#a8bfff',
      400: '#7a9aff',
      500: '#4f6cff',
      600: '#3d54d4',
      700: '#2d3fa8',
      800: '#1f2a7a',
      900: '#141a4d',
    },
  },
  fonts: {
    heading: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: '#fafbfc',
        color: '#1a202c',
      },
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
    },
    Input: {
      defaultProps: {
        focusBorderColor: 'brand.500',
      },
    },
  },
});

export default function App() {
  const [calendarConfig, setCalendarConfig] = useState<CalendarConfig | null>(null);
  const [events, setEvents] = useState<BusinessEvent[]>([]);

  const handleConfigUpdate = (config: CalendarConfig) => {
    setCalendarConfig(config);
  };

  const handleAddEvent = (event: BusinessEvent) => {
    setEvents([...events, event]);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter((e) => e.id !== eventId));
  };

  const handleUpdateEvent = (updatedEvent: BusinessEvent) => {
    setEvents(events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)));
  };

  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <Box minH="100vh" bg="#fafbfc" py={8}>
        <Container maxW="6xl">
          {/* Header */}
          <Box mb={12}>
            <Box as="h1" fontSize="3xl" fontWeight="700" color="brand.900" mb={2}>
              📅 Business Calendar Manager
            </Box>
            <Box as="p" fontSize="md" color="gray.600" maxW="2xl">
              Decouple your business calendar from real-world time. Manage custom years, months,
              and fiscal calendars with precision.
            </Box>
          </Box>

          {/* Tabs */}
          <Tabs variant="soft-rounded" colorScheme="brand" isLazy>
            <TabList mb={8} gap={2} p={3} bg="white" borderRadius="lg" boxShadow="sm">
              <Tab fontWeight="600" _selected={{ bg: 'brand.500', color: 'white' }}>
                Configuration
              </Tab>
              <Tab fontWeight="600" _selected={{ bg: 'brand.500', color: 'white' }}>
                Events
              </Tab>
              <Tab fontWeight="600" _selected={{ bg: 'brand.500', color: 'white' }}>
                Calendar View
              </Tab>
              <Tab fontWeight="600" _selected={{ bg: 'brand.500', color: 'white' }}>
                Date Converter
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel p={0}>
                <CalendarSettings onConfigUpdate={handleConfigUpdate} config={calendarConfig} />
              </TabPanel>

              <TabPanel p={0}>
                <EventsManager
                  onAddEvent={handleAddEvent}
                  onDeleteEvent={handleDeleteEvent}
                  onUpdateEvent={handleUpdateEvent}
                  events={events}
                  config={calendarConfig}
                />
              </TabPanel>

              <TabPanel p={0}>
                <CalendarView config={calendarConfig} events={events} />
              </TabPanel>

              <TabPanel p={0}>
                <DateConverter config={calendarConfig} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Container>
      </Box>
    </ChakraProvider>
  );
}
