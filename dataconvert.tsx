import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Input,
  Select,
  Stack,
  Text,
  VStack,
  HStack,
  Center,
  SimpleGrid,
  Badge,
  useToast,
  Divider,
} from '@chakra-ui/react';
import { ArrowRightIcon } from '@chakra-ui/icons';
import type { CalendarConfig } from '../types';
import {
  customToRealDate,
  realToCustomDate,
  formatCustomDate,
  formatRealDate,
  getDaysInMonth,
  isValidCustomDate,
} from '../utils';

interface DateConverterProps {
  config: CalendarConfig | null;
}

interface ConversionResult {
  customDate: { year: number; month: number; day: number };
  realDate: Date;
  dayOfWeek: string;
  quarterNumber: number;
}

export default function DateConverter({ config }: DateConverterProps) {
  const toast = useToast();
  const [conversionMode, setConversionMode] = useState<'custom-to-real' | 'real-to-custom'>(
    'custom-to-real'
  );

  // Custom to Real
  const [customYear, setCustomYear] = useState(1);
  const [customMonth, setCustomMonth] = useState(1);
  const [customDay, setCustomDay] = useState(1);
  const [daysInMonth, setDaysInMonth] = useState(28);

  // Real to Custom
  const [realDate, setRealDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const [result, setResult] = useState<ConversionResult | null>(null);

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

  // Update days in month when month/year changes
  const updateDaysInMonth = (year: number, month: number) => {
    if (config) {
      const days = getDaysInMonth(config, year, month);
      setDaysInMonth(days);
      if (customDay > days) {
        setCustomDay(days);
      }
    }
  };

  const handleMonthChange = (month: number) => {
    setCustomMonth(month);
    updateDaysInMonth(customYear, month);
  };

  const handleYearChange = (year: number) => {
    setCustomYear(year);
    updateDaysInMonth(year, customMonth);
  };

  const handleConvertCustomToReal = () => {
    if (!config) {
      toast({
        title: 'Error',
        description: 'Calendar configuration not initialized',
        status: 'error',
      });
      return;
    }

    if (!isValidCustomDate(config, customYear, customMonth, customDay)) {
      toast({
        title: 'Invalid Date',
        description: 'The selected date is invalid for this month',
        status: 'error',
      });
      return;
    }

    try {
      const realDateValue = customToRealDate(config, customYear, customMonth, customDay);
      const conversionResult = realToCustomDate(config, realDateValue);

      setResult({
        customDate: { year: customYear, month: customMonth, day: customDay },
        realDate: realDateValue,
        dayOfWeek: conversionResult.dayOfWeek,
        quarterNumber: conversionResult.quarterNumber,
      });
    } catch (error) {
      toast({
        title: 'Conversion Error',
        description: 'Failed to convert date',
        status: 'error',
      });
    }
  };

  const handleConvertRealToCustom = () => {
    if (!config) {
      toast({
        title: 'Error',
        description: 'Calendar configuration not initialized',
        status: 'error',
      });
      return;
    }

    try {
      const realDateValue = new Date(realDate);
      const conversionResult = realToCustomDate(config, realDateValue);

      setResult({
        customDate: conversionResult.customDate,
        realDate: realDateValue,
        dayOfWeek: conversionResult.dayOfWeek,
        quarterNumber: conversionResult.quarterNumber,
      });
    } catch (error) {
      toast({
        title: 'Conversion Error',
        description: 'Failed to convert date',
        status: 'error',
      });
    }
  };

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

  return (
    <Stack spacing={6}>
      {/* Mode Selection */}
      <Card bg="white" boxShadow="sm" borderRadius="lg">
        <CardHeader bg="brand.50" borderBottom="1px solid" borderColor="gray.200">
          <Heading size="md" color="brand.900">
            Conversion Mode
          </Heading>
        </CardHeader>
        <CardBody>
          <HStack spacing={4}>
            <Button
              variant={conversionMode === 'custom-to-real' ? 'solid' : 'outline'}
              colorScheme={conversionMode === 'custom-to-real' ? 'brand' : 'gray'}
              onClick={() => {
                setConversionMode('custom-to-real');
                setResult(null);
              }}
              flex={1}
            >
              Custom → Real Date
            </Button>
            <Button
              variant={conversionMode === 'real-to-custom' ? 'solid' : 'outline'}
              colorScheme={conversionMode === 'real-to-custom' ? 'brand' : 'gray'}
              onClick={() => {
                setConversionMode('real-to-custom');
                setResult(null);
              }}
              flex={1}
            >
              Real Date → Custom
            </Button>
          </HStack>
        </CardBody>
      </Card>

      {/* Input Form */}
      <Card bg="white" boxShadow="sm" borderRadius="lg">
        <CardHeader bg="brand.50" borderBottom="1px solid" borderColor="gray.200">
          <Heading size="md" color="brand.900">
            {conversionMode === 'custom-to-real' ? 'Custom Calendar Date' : 'Real-World Date'}
          </Heading>
        </CardHeader>
        <CardBody>
          {conversionMode === 'custom-to-real' ? (
            <Stack spacing={6}>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                <FormControl>
                  <FormLabel fontWeight="600">Year</FormLabel>
                  <Input
                    type="number"
                    value={customYear}
                    onChange={(e) => handleYearChange(Math.max(1, parseInt(e.target.value) || 1))}
                    min={1}
                    bg="white"
                    borderColor="gray.300"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel fontWeight="600">Month</FormLabel>
                  <Select
                    value={customMonth}
                    onChange={(e) => handleMonthChange(parseInt(e.target.value))}
                    bg="white"
                    borderColor="gray.300"
                  >
                    {monthNames.map((name, idx) => (
                      <option key={idx} value={idx + 1}>
                        {name} ({idx + 1})
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel fontWeight="600">Day</FormLabel>
                  <Select
                    value={customDay}
                    onChange={(e) => setCustomDay(parseInt(e.target.value))}
                    bg="white"
                    borderColor="gray.300"
                  >
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
                      <option key={day} value={day}>
                        Day {day}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </SimpleGrid>

              <Button
                colorScheme="brand"
                size="lg"
                w="full"
                onClick={handleConvertCustomToReal}
                _hover={{ boxShadow: '0 4px 12px rgba(79, 108, 255, 0.3)' }}
              >
                Convert to Real Date
              </Button>
            </Stack>
          ) : (
            <Stack spacing={6}>
              <FormControl>
                <FormLabel fontWeight="600">Real-World Date (UTC)</FormLabel>
                <Input
                  type="date"
                  value={realDate}
                  onChange={(e) => setRealDate(e.target.value)}
                  bg="white"
                  borderColor="gray.300"
                />
              </FormControl>

              <Button
                colorScheme="brand"
                size="lg"
                w="full"
                onClick={handleConvertRealToCustom}
                _hover={{ boxShadow: '0 4px 12px rgba(79, 108, 255, 0.3)' }}
              >
                Convert to Custom Date
              </Button>
            </Stack>
          )}
        </CardBody>
      </Card>

      {/* Result */}
      {result && (
        <Card bg="brand.50" boxShadow="md" borderRadius="lg" borderLeft="4px solid" borderColor="brand.500">
          <CardHeader borderBottom="1px solid" borderColor="brand.200">
            <HStack justify="space-between">
              <Heading size="md" color="brand.900">
                ✓ Conversion Result
              </Heading>
              <Badge colorScheme="green" variant="subtle">
                Success
              </Badge>
            </HStack>
          </CardHeader>
          <CardBody>
            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
              {/* Custom Date Box */}
              <Card bg="white" boxShadow="sm">
                <CardBody>
                  <VStack align="start" spacing={3}>
                    <Text fontSize="sm" fontWeight="600" color="gray.600" textTransform="uppercase">
                      📅 Custom Calendar Date
                    </Text>
                    <VStack align="start" spacing={1} w="full">
                      <Box>
                        <Text fontSize="xs" color="gray.500">Year</Text>
                        <Text fontSize="2xl" fontWeight="700" color="brand.900">
                          {result.customDate.year}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="xs" color="gray.500">Month & Day</Text>
                        <Text fontSize="lg" fontWeight="700" color="brand.900">
                          {monthNames[result.customDate.month - 1]}{' '}
                          {result.customDate.day}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="xs" color="gray.500">Quarter</Text>
                        <Badge colorScheme="purple" variant="subtle">
                          Q{result.quarterNumber}
                        </Badge>
                      </Box>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>

              {/* Real Date Box */}
              <Card bg="white" boxShadow="sm">
                <CardBody>
                  <VStack align="start" spacing={3}>
                    <Text fontSize="sm" fontWeight="600" color="gray.600" textTransform="uppercase">
                      🌍 Real-World Date (UTC)
                    </Text>
                    <VStack align="start" spacing={1} w="full">
                      <Box>
                        <Text fontSize="xs" color="gray.500">Date</Text>
                        <Text fontSize="2xl" fontWeight="700" color="brand.900">
                          {result.realDate.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="xs" color="gray.500">Day of Week</Text>
                        <Text fontSize="lg" fontWeight="700" color="brand.900">
                          {result.dayOfWeek}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="xs" color="gray.500">ISO Format</Text>
                        <Text fontSize="sm" fontFamily="mono" color="gray.600">
                          {formatRealDate(result.realDate)}
                        </Text>
                      </Box>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>
            </Grid>

            <Divider my={4} />

            <VStack align="start" spacing={2} fontSize="sm">
              <Text fontWeight="600" color="brand.900">
                📋 Full Details
              </Text>
              <HStack>
                <Text color="gray.600">Custom Format:</Text>
                <Badge colorScheme="blue" variant="subtle">
                  {formatCustomDate(
                    result.customDate.year,
                    result.customDate.month,
                    result.customDate.day
                  )}
                </Badge>
              </HStack>
              <HStack>
                <Text color="gray.600">Real Format:</Text>
                <Badge colorScheme="green" variant="subtle">
                  {result.realDate.toISOString()}
                </Badge>
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      )}

      {/* Info Card */}
      <Card bg="blue.50" borderLeft="4px solid" borderColor="blue.500">
        <CardBody>
          <VStack align="start" spacing={2}>
            <Text fontWeight="700" color="blue.900">
              💡 How This Works
            </Text>
            <Text fontSize="sm" color="blue.800">
              This converter translates between your custom business calendar (with custom years,
              months, and days) and real-world UTC dates. Use it to:
            </Text>
            <VStack align="start" spacing={1} pl={4}>
              <Text fontSize="sm" color="blue.800">
                • Map custom calendar dates to actual UTC timestamps
              </Text>
              <Text fontSize="sm" color="blue.800">
                • Convert real dates to your business calendar
              </Text>
              <Text fontSize="sm" color="blue.800">
                • Synchronize notifications and reminders
              </Text>
              <Text fontSize="sm" color="blue.800">
                • Generate accurate reports based on fiscal calendars
              </Text>
            </VStack>
          </VStack>
        </CardBody>
      </Card>
    </Stack>
  );
}
