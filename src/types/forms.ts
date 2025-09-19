export interface PersonFormData {
  firstName: string;
  lastName: string;
  nationalId: string;
  phoneNumber: string;
  email?: string;
  dateOfBirth: Date;
  gender: 'M' | 'F' | 'Autre';
  city: string;
  province: string;
  address: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  photo?: File;
  vulnerabilityScore?: number;
  socialPrograms?: string[];
}

export interface GeographicZone {
  id: string;
  name: string;
  type: 'PROVINCE' | 'DEPARTMENT' | 'CITY' | 'DISTRICT';
  parentId?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface EligibilityCriteria {
  id: string;
  type: 'AGE' | 'INCOME' | 'LOCATION' | 'FAMILY_SIZE' | 'DISABILITY';
  operator: 'GT' | 'LT' | 'EQ' | 'GTE' | 'LTE' | 'IN' | 'NOT_IN';
  value: string | number | string[];
  weight: number;
}

export interface ProgramFormData {
  code: string;
  name: string;
  description: string;
  programType: 'CASH_TRANSFER' | 'FOOD_ASSISTANCE' | 'HEALTH_CARE' | 'EDUCATION';
  totalBudget: number;
  allocatedBudget: number;
  maxBeneficiaries: number;
  eligibilityCriteria: EligibilityCriteria[];
  geographicZones: GeographicZone[];
  startDate: Date;
  endDate: Date;
  status: 'DRAFT' | 'ACTIVE' | 'SUSPENDED' | 'COMPLETED';
}

export interface SearchFilters {
  query?: string;
  nationalId?: string;
  phoneNumber?: string;
  province?: string;
  city?: string;
  ageMin?: number;
  ageMax?: number;
  gender?: string;
  hasPhoto?: boolean;
  isValidated?: boolean;
  socialPrograms?: string[];
  vulnerabilityMin?: number;
  vulnerabilityMax?: number;
  dateCreatedFrom?: Date;
  dateCreatedTo?: Date;
}