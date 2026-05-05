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
  Divider,
  Badge,
  VStack,
  HStack,
} from '@chakra-ui/react';
import type { CalendarConfig } from '../types';
import { getDefaultMonthLengths } from '../utils';

interface CalendarSettingsProps {
  onConfigUpdate: (config: CalendarConfig) => void;
  config: CalendarConfig | null;
}

export default function CalendarSettings({
  onConfigUpdate,
  config,
}: CalendarSettingsProps) {
  const toast = useToast();
  const [formData, setFormData] = useState({
    startDate: config?.startDateUtc.toISOString().split('T')[0] || '2024-01-01',
    fiscalStartMonth: config?.fiscalStartMonth || 1,
    timezone: config?.timezone || 'UTC',
    yearLength: config?.yearLength || 365,
  });

  const [monthLengths, setMonthLengths] = useState<number[]>(
    config?.monthLengths || getDefaultMonthLengths()
  );

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

  const timezones = [
    'UTC',
    'America/New_York',
    'Europe/London',
    'Asia/Tokyo',
    'Australia/Sydney',
    'Asia/Dubai',
    'Africa/Johannesburg',
  ];

  const handleMonthLengthChange = (index: number, value: string) => {
    const newLengths = [...monthLengths];
    newLengths[index] = Math.max(1, Math.min(31, parseInt(value) || 28));
    setMonthLengths(newLengths);
  };

  const handleSubmit = () => {
    // Validate
    const totalDays = monthLengths.reduce((a, b) => a + b, 0);
    if (totalDays !== formData.yearLength) {
      toast({
        title: 'Validation Error',
        description: `Total month days (${totalDays}) must equal year length (${formData.yearLength})`,
        status: 'error',
        duration: 4000,
      });
      return;
    }

    const newConfig: CalendarConfig = {
      id: config?.id || Date.now().toString(),
      startDateUtc: new Date(formData.startDate),
      fiscalStartMonth: formData.fiscalStartMonth,
      timezone: formData.timezone,
      yearLength: formData.yearLength,
      monthLengths,
      isActive: true,
      createdAt: config?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    onConfigUpdate(newConfig);

    toast({
      title: 'Success',
      description: 'Calendar configuration updated successfully',
      status: 'success',
      duration: 3000,
    });
  };

  const handleResetToDefault = () => {
    setMonthLengths(getDefaultMonthLengths());
    const totalDays = getDefaultMonthLengths().reduce((a, b) => a + b, 0);
    setFormData((prev) => ({ ...prev, yearLength: totalDays }));
  };

  return (
    <Stack spacing={6}>
      {/* Basic Settings */}
      <Card bg="white" boxShadow="sm" borderRadius="lg">
        <CardHeader bg="brand.50" borderTopRadius="lg" borderBottom="1px solid" borderColor="gray.200">
          <Heading size="md" color="brand.900">
            Basic Settings
          </Heading>
        </CardHeader>
        <CardBody>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <FormControl>
              <FormLabel fontWeight="600" color="gray.700">
                Calendar Start Date (UTC)
              </FormLabel>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                bg="white"
                borderColor="gray.300"
                _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px rgb(79, 108, 255)' }}
              />
              <Text fontSize="xs" color="gray.500" mt={1}>
                The real-world date that maps to Year 1, Month 1, Day 1
              </Text>
            </FormControl>

            <FormControl>
              <FormLabel fontWeight="600" color="gray.700">
                Fiscal Year Start Month
              </FormLabel>
              <Select
                value={formData.fiscalStartMonth}
                onChange={(e) =>
                  setFormData({ ...formData, fiscalStartMonth: parseInt(e.target.value) })
                }
                bg="white"
                borderColor="gray.300"
              >
                {monthNames.map((name, idx) => (
                  <option key={idx} value={idx + 1}>
                    {name} (Month {idx + 1})
                  </option>
                ))}
              </Select>
              <Text fontSize="xs" color="gray.500" mt={1}>
                When your fiscal/business year starts
              </Text>
            </FormControl>

            <FormControl>
              <FormLabel fontWeight="600" color="gray.700">
                Timezone
              </FormLabel>
              <Select
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                bg="white"
                borderColor="gray.300"
              >
                {timezones.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel fontWeight="600" color="gray.700">
                Total Days in Year
              </FormLabel>
              <Input
                type="number"
                value={formData.yearLength}
                onChange={(e) => setFormData({ ...formData, yearLength: parseInt(e.target.value) })}
                min={1}
                bg="white"
                borderColor="gray.300"
              />
              <Text fontSize="xs" color="gray.500" mt={1}>
                Total days across all months (usually 365 or 366)
              </Text>
            </FormControl>
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Month Lengths */}
      <Card bg="white" boxShadow="sm" borderRadius="lg">
        <CardHeader bg="brand.50" borderTopRadius="lg" borderBottom="1px solid" borderColor="gray.200">
          <HStack justify="space-between">
            <Heading size="md" color="brand.900">
              Month Lengths
            </Heading>
            <HStack>
              <Badge colorScheme="blue" variant="subtle">
                Total: {monthLengths.reduce((a, b) => a + b, 0)} days
              </Badge>
              <Button size="sm" variant="ghost" onClick={handleResetToDefault}>
                Reset to Default
              </Button>
            </HStack>
          </HStack>
        </CardHeader>
        <CardBody>
          <SimpleGrid columns={{ base: 2, md: 4, lg: 6 }} spacing={3}>
            {monthLengths.map((length, idx) => (
              <FormControl key={idx}>
                <FormLabel fontSize="xs" fontWeight="600" color="gray.700">
                  {monthNames[idx]}
                </FormLabel>
                <Input
                  type="number"
                  value={length}
                  onChange={(e) => handleMonthLengthChange(idx, e.target.value)}
                  min={1}
                  max={31}
                  size="sm"
                  bg="white"
                  borderColor="gray.300"
                  textAlign="center"
                />
              </FormControl>
            ))}
          </SimpleGrid>
          <Text fontSize="xs" color="gray.500" mt={4}>
            💡 Adjust individual month lengths. Total must equal {formData.yearLength} days.
          </Text>
        </CardBody>
      </Card>

      {/* Action Buttons */}
      <HStack justify="flex-end" spacing={3}>
        <Button variant="ghost" onClick={() => window.location.reload()}>
          Cancel
        </Button>
        <Button
          colorScheme="brand"
          size="lg"
          px={8}
          onClick={handleSubmit}
          _hover={{ boxShadow: '0 4px 12px rgba(79, 108, 255, 0.3)' }}
        >
          Save Configuration
        </Button>
      </HStack>

      {/* Summary */}
      {config && (
        <Card bg="brand.50" borderLeft="4px solid" borderColor="brand.500">
          <CardBody>
            <Text fontSize="sm" color="brand.900">
              <strong>✓ Configuration Active</strong> • Start Date:{' '}
              {config.startDateUtc.toDateString()} • Fiscal Start: Month {config.fiscalStartMonth} •
              Year Length: {config.yearLength} days
            </Text>
          </CardBody>
        </Card>
      )}
    </Stack>
  );
}
