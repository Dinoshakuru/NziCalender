import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  Stack,
  Text,
  useToast,
  Card,
  CardBody,
  CardHeader,
  Heading,
  HStack,
  Badge,
  VStack,
  Textarea,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import type { CalendarConfig, BusinessEvent } from '../types';
import {
  formatCustomDate,
  formatRealDate,
  customToRealDate,
  isValidCustomDate,
  getDaysInMonth,
} from '../utils';

interface EventsManagerProps {
  onAddEvent: (event: BusinessEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  onUpdateEvent: (event: BusinessEvent) => void;
  events: BusinessEvent[];
  config: CalendarConfig | null;
}

export default function EventsManager({
  onAddEvent,
  onDeleteEvent,
  onUpdateEvent,
  events,
  config,
}: EventsManagerProps) {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    customYear: 1,
    customMonth: 1,
    day: 1,
    timezone: config?.timezone || 'UTC',
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [daysInCurrentMonth, setDaysInCurrentMonth] = useState(28);

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

  const handleMonthChange = (month: string) => {
    const monthNum = parseInt(month);
    setFormData({ ...formData, customMonth: monthNum });

    if (config) {
      const days = getDaysInMonth(config, formData.customYear, monthNum);
      setDaysInCurrentMonth(days);
      if (formData.day > days) {
        setFormData((prev) => ({ ...prev, day: days }));
      }
    }
  };

  const handleYearChange = (year: string) => {
    const yearNum = parseInt(year);
    setFormData({ ...formData, customYear: yearNum });

    if (config) {
      const days = getDaysInMonth(config, yearNum, formData.customMonth);
      setDaysInCurrentMonth(days);
    }
  };

  const handleOpenModal = (event?: BusinessEvent) => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || '',
        customYear: event.customYear,
        customMonth: event.customMonth,
        day: event.day,
        timezone: event.timezone,
      });
      setEditingId(event.id);
    } else {
      setFormData({
        title: '',
        description: '',
        customYear: 1,
        customMonth: 1,
        day: 1,
        timezone: config?.timezone || 'UTC',
      });
      setEditingId(null);
    }
    onOpen();
  };

  const handleSaveEvent = () => {
    if (!config) {
      toast({
        title: 'Error',
        description: 'Calendar configuration not initialized',
        status: 'error',
      });
      return;
    }

    if (!formData.title.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Event title is required',
        status: 'error',
      });
      return;
    }

    if (
      !isValidCustomDate(
        config,
        formData.customYear,
        formData.customMonth,
        formData.day
      )
    ) {
      toast({
        title: 'Validation Error',
        description: 'Invalid date for the selected month',
        status: 'error',
      });
      return;
    }

    try {
      const realDate = customToRealDate(
        config,
        formData.customYear,
        formData.customMonth,
        formData.day
      );

      const existingEvent = events.find((e) => e.id === editingId);
      const event: BusinessEvent = {
        id: editingId || Date.now().toString(),
        title: formData.title,
        description: formData.description || undefined,
        customYear: formData.customYear,
        customMonth: formData.customMonth,
        day: formData.day,
        realDate,
        timezone: formData.timezone,
        createdAt: existingEvent?.createdAt || new Date(),
        updatedAt: new Date(),
      };

      if (editingId) {
        onUpdateEvent(event);
        toast({
          title: 'Success',
          description: 'Event updated successfully',
          status: 'success',
        });
      } else {
        onAddEvent(event);
        toast({
          title: 'Success',
          description: 'Event created successfully',
          status: 'success',
        });
      }

      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save event',
        status: 'error',
      });
    }
  };

  const sortedEvents = [...events].sort(
    (a, b) =>
      a.customYear - b.customYear ||
      a.customMonth - b.customMonth ||
      a.day - b.day
  );

  return (
    <Stack spacing={6}>
      {/* Header */}
      <HStack justify="space-between" align="center">
        <Heading size="md" color="brand.900">
          Business Events
        </Heading>
        <Button colorScheme="brand" onClick={() => handleOpenModal()}>
          + Add Event
        </Button>
      </HStack>

      {/* Events Table */}
      {sortedEvents.length > 0 ? (
        <Card bg="white" boxShadow="sm" borderRadius="lg" overflow="hidden">
          <TableContainer>
            <Table variant="simple" size="sm">
              <Thead bg="brand.50" borderBottom="2px solid" borderColor="gray.200">
                <Tr>
                  <Th color="brand.900" fontWeight="700">
                    Title
                  </Th>
                  <Th color="brand.900" fontWeight="700">
                    Custom Date
                  </Th>
                  <Th color="brand.900" fontWeight="700">
                    Real Date
                  </Th>
                  <Th color="brand.900" fontWeight="700">
                    Timezone
                  </Th>
                  <Th color="brand.900" fontWeight="700">
                    Actions
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {sortedEvents.map((event) => (
                  <Tr key={event.id} _hover={{ bg: 'gray.50' }}>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="600" color="gray.900">
                          {event.title}
                        </Text>
                        {event.description && (
                          <Text fontSize="xs" color="gray.500">
                            {event.description}
                          </Text>
                        )}
                      </VStack>
                    </Td>
                    <Td>
                      <Badge colorScheme="blue" variant="subtle">
                        {formatCustomDate(event.customYear, event.customMonth, event.day)}
                      </Badge>
                    </Td>
                    <Td fontSize="sm" color="gray.600">
                      {formatRealDate(event.realDate)}
                    </Td>
                    <Td fontSize="sm" color="gray.600">
                      {event.timezone}
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <IconButton
                          aria-label="Edit"
                          icon={<EditIcon />}
                          size="sm"
                          variant="ghost"
                          colorScheme="blue"
                          onClick={() => handleOpenModal(event)}
                        />
                        <IconButton
                          aria-label="Delete"
                          icon={<DeleteIcon />}
                          size="sm"
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => {
                            onDeleteEvent(event.id);
                            toast({
                              title: 'Deleted',
                              description: 'Event removed',
                              status: 'success',
                            });
                          }}
                        />
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Card>
      ) : (
        <Card bg="gray.50" borderRadius="lg">
          <CardBody>
            <Text color="gray.500" textAlign="center" py={8}>
              No events yet. Click "Add Event" to create your first event.
            </Text>
          </CardBody>
        </Card>
      )}

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="brand.50" borderBottom="1px solid" borderColor="gray.200">
            {editingId ? '✏️ Edit Event' : '➕ New Event'}
          </ModalHeader>
          <ModalBody py={6}>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel fontWeight="600">Event Title *</FormLabel>
                <Input
                  placeholder="e.g., Q1 Planning Session"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  bg="white"
                  borderColor="gray.300"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="600">Description</FormLabel>
                <Textarea
                  placeholder="Optional description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  bg="white"
                  borderColor="gray.300"
                  minH="100px"
                />
              </FormControl>

              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                <FormControl>
                  <FormLabel fontWeight="600">Year *</FormLabel>
                  <Input
                    type="number"
                    value={formData.customYear}
                    onChange={(e) => handleYearChange(e.target.value)}
                    min={1}
                    bg="white"
                    borderColor="gray.300"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel fontWeight="600">Month *</FormLabel>
                  <Select
                    value={formData.customMonth}
                    onChange={(e) => handleMonthChange(e.target.value)}
                    bg="white"
                    borderColor="gray.300"
                  >
                    {monthNames.map((name, idx) => (
                      <option key={idx} value={idx + 1}>
                        {name}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel fontWeight="600">Day *</FormLabel>
                  <Select
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: parseInt(e.target.value) })}
                    bg="white"
                    borderColor="gray.300"
                  >
                    {Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1).map((day) => (
                      <option key={day} value={day}>
                        Day {day}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </SimpleGrid>

              <FormControl>
                <FormLabel fontWeight="600">Timezone</FormLabel>
                <Select
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  bg="white"
                  borderColor="gray.300"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="Asia/Tokyo">Asia/Tokyo</option>
                  <option value="Australia/Sydney">Australia/Sydney</option>
                </Select>
              </FormControl>
            </Stack>
          </ModalBody>

          <ModalFooter borderTop="1px solid" borderColor="gray.200">
            <HStack spacing={3}>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="brand" onClick={handleSaveEvent}>
                {editingId ? 'Update' : 'Create'} Event
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
}
