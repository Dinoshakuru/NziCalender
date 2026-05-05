import { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  SimpleGrid,
  Stack,
  Text,
  Card,
  CardBody,
  CardHeader,
  Heading,
  HStack,
  VStack,
  Badge,
  Select,
  Center,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import type { CalendarConfig, BusinessEvent } from '../types';
import { getDaysInMonth, formatCustomDate, formatRealDate } from '../utils';

interface CalendarViewProps {
  config: CalendarConfig | null;
  events: BusinessEvent[];
}

export default function CalendarView({ config, events }: CalendarViewProps) {
  const [displayYear, setDisplayYear] = useState(1);
  const [displayMonth, setDisplayMonth] = useState(1);

  if (!config) {
    return (
      <Card bg="white" boxShadow="sm" borderRadius="lg">
        <CardBody>
          <Center py={16}>
            <Text color="gray.500">Configure calendar settings first</Text>
          </Center>
        </CardBody>
      </Card>
    );
  }

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const daysInMonth = getDaysInMonth(config, displayYear, displayMonth);
  const monthEvents = events.filter(
    (e) => e.customYear === displayYear && e.customMonth === displayMonth
  );

  const eventsByDay = new Map<number, BusinessEvent[]>();
  monthEvents.forEach((event) => {
    if (!eventsByDay.has(event.day)) {
      eventsByDay.set(event.day, []);
    }
    eventsByDay.get(event.day)!.push(event);
  });

  const handlePrevMonth = () => {
    if (displayMonth === 1) {
      setDisplayMonth(12);
      setDisplayYear(Math.max(1, displayYear - 1));
    } else {
      setDisplayMonth(displayMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (displayMonth === 12) {
      setDisplayMonth(1);
      setDisplayYear(displayYear + 1);
    } else {
      setDisplayMonth(displayMonth + 1);
    }
  };

  const quarterNumber = Math.ceil(displayMonth / 3);

  return (
    <Stack spacing={6}>
      {/* Header */}
      <Card bg="white" boxShadow="sm" borderRadius="lg">
        <CardHeader bg="brand.50" borderBottom="1px solid" borderColor="gray.200">
          <VStack align="start" spacing={3}>
            <HStack justify="space-between" w="full">
              <VStack align="start" spacing={1}>
                <Heading size="lg" color="brand.900">
                  {monthNames[displayMonth - 1]} {displayYear}
                </Heading>
                <HStack spacing={2}>
                  <Badge colorScheme="blue" variant="subtle">
                    Q{quarterNumber}
                  </Badge>
                  <Badge colorScheme="green" variant="subtle">
                    {daysInMonth} days
                  </Badge>
                  {monthEvents.length > 0 && (
                    <Badge colorScheme="purple" variant="subtle">
                      {monthEvents.length} events
                    </Badge>
                  )}
                </HStack>
              </VStack>

              <HStack spacing={2}>
                <Button
                  leftIcon={<ChevronLeftIcon />}
                  variant="outline"
                  size="sm"
                  onClick={handlePrevMonth}
                >
                  Previous
                </Button>
                <Button
                  rightIcon={<ChevronRightIcon />}
                  variant="outline"
                  size="sm"
                  onClick={handleNextMonth}
                >
                  Next
                </Button>
              </HStack>
            </HStack>

            <HStack spacing={4} w="full">
              <Box flex={1}>
                <Text fontSize="xs" fontWeight="600" color="gray.600" mb={1}>
                  Year
                </Text>
                <Select
                  value={displayYear}
                  onChange={(e) => setDisplayYear(parseInt(e.target.value))}
                  size="sm"
                  w="150px"
                  bg="white"
                  borderColor="gray.300"
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((y) => (
                    <option key={y} value={y}>
                      Year {y}
                    </option>
                  ))}
                </Select>
              </Box>

              <Box flex={1}>
                <Text fontSize="xs" fontWeight="600" color="gray.600" mb={1}>
                  Month
                </Text>
                <Select
                  value={displayMonth}
                  onChange={(e) => setDisplayMonth(parseInt(e.target.value))}
                  size="sm"
                  w="150px"
                  bg="white"
                  borderColor="gray.300"
                >
                  {monthNames.map((name, idx) => (
                    <option key={idx} value={idx + 1}>
                      {name}
                    </option>
                  ))}
                </Select>
              </Box>
            </HStack>
          </VStack>
        </CardHeader>
      </Card>

      {/* Calendar Grid */}
      <Card bg="white" boxShadow="sm" borderRadius="lg" overflow="hidden">
        <CardBody p={0}>
          <SimpleGrid columns={7} spacing={0} borderRadius="lg" overflow="hidden">
            {/* Day Headers */}
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <Box
                key={day}
                bg="brand.50"
                p={3}
                textAlign="center"
                borderBottom="2px solid"
                borderColor="gray.200"
                borderRight="1px solid"
                borderRightColor="gray.200"
                _last={{ borderRight: 'none' }}
              >
                <Text fontWeight="700" fontSize="sm" color="brand.900">
                  {day}
                </Text>
              </Box>
            ))}

            {/* Days */}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const dayEvents = eventsByDay.get(day) || [];
              return (
                <Box
                  key={day}
                  minH="120px"
                  p={2}
                  borderRight="1px solid"
                  borderBottom="1px solid"
                  borderColor="gray.200"
                  _last={{ borderRight: 'none' }}
                  bg={day % 2 === 0 ? 'white' : 'gray.50'}
                  transition="all 0.2s"
                  _hover={{ bg: 'brand.50' }}
                  cursor="pointer"
                >
                  <VStack align="start" spacing={1} h="full">
                    <Text fontWeight="700" fontSize="sm" color="gray.900">
                      {day}
                    </Text>

                    {dayEvents.length > 0 && (
                      <VStack spacing={1} w="full" align="start">
                        {dayEvents.slice(0, 2).map((event) => (
                          <Box
                            key={event.id}
                            w="full"
                            bg="brand.100"
                            p={1}
                            borderRadius="sm"
                            _hover={{ bg: 'brand.200' }}
                            cursor="pointer"
                            title={`${event.title}\n${formatRealDate(event.realDate)}`}
                          >
                            <Text
                              fontSize="xs"
                              fontWeight="600"
                              color="brand.900"
                              noOfLines={1}
                            >
                              {event.title}
                            </Text>
                          </Box>
                        ))}
                        {dayEvents.length > 2 && (
                          <Text fontSize="xs" color="gray.500" fontWeight="600">
                            +{dayEvents.length - 2} more
                          </Text>
                        )}
                      </VStack>
                    )}
                  </VStack>
                </Box>
              );
            })}
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Events List */}
      {monthEvents.length > 0 && (
        <Card bg="white" boxShadow="sm" borderRadius="lg">
          <CardHeader bg="brand.50" borderBottom="1px solid" borderColor="gray.200">
            <Heading size="md" color="brand.900">
              Events This Month ({monthEvents.length})
            </Heading>
          </CardHeader>
          <CardBody>
            <VStack align="start" spacing={3}>
              {monthEvents
                .sort((a, b) => a.day - b.day)
                .map((event) => (
                  <Box
                    key={event.id}
                    w="full"
                    p={3}
                    borderLeft="4px solid"
                    borderColor="brand.500"
                    bg="gray.50"
                    borderRadius="md"
                  >
                    <HStack justify="space-between" mb={1}>
                      <Text fontWeight="700" color="gray.900">
                        {event.title}
                      </Text>
                      <Badge colorScheme="blue" variant="subtle">
                        Day {event.day}
                      </Badge>
                    </HStack>
                    {event.description && (
                      <Text fontSize="sm" color="gray.600" mb={2}>
                        {event.description}
                      </Text>
                    )}
                    <HStack spacing={3} fontSize="xs" color="gray.500">
                      <Text>📅 {formatRealDate(event.realDate)}</Text>
                      <Text>🕐 {event.timezone}</Text>
                    </HStack>
                  </Box>
                ))}
            </VStack>
          </CardBody>
        </Card>
      )}

      {/* Empty State */}
      {monthEvents.length === 0 && (
        <Card bg="gray.50" borderRadius="lg">
          <CardBody>
            <Center py={8}>
              <Text color="gray.500">No events scheduled for this month</Text>
            </Center>
          </CardBody>
        </Card>
      )}
    </Stack>
  );
}
