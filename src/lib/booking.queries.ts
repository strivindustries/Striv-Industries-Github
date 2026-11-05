import { queryOptions } from '@tanstack/react-query';
import { getServices, getBusinessHours, getBlockedDates, getBookingSettings } from './booking.functions';
export const servicesQuery = queryOptions({ queryKey: ['services'], queryFn: () => getServices() });
export const hoursQuery = queryOptions({ queryKey: ['business-hours'], queryFn: () => getBusinessHours() });
export const blockedDatesQuery = queryOptions({ queryKey: ['blocked-dates'], queryFn: () => getBlockedDates() });
export const settingsQuery = queryOptions({ queryKey: ['booking-settings'], queryFn: () => getBookingSettings() });