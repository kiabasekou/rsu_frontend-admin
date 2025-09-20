export interface PersonFormData {
  firstName: string;
  lastName: string;
  nationalId: string;
  nip?: string;
  phoneNumber: string;
  email?: string;
  dateOfBirth: Date;
  gender: 'M' | 'F';
  province: string;
  city: string;
  address?: string;
  photo?: File | string | null;
  vulnerabilityScore?: number | null;
  coordinates?: { latitude: number; longitude: number } | null;
}

export interface PersonIdentity extends Omit<PersonFormData, 'photo'> {
  id: number;
  fullName: string;
  isValidated: boolean;
  createdAt: string;
  updatedAt: string;
  photo?: string;
  nipValidationStatus?: {
    isValid: boolean;
    lastChecked: Date;
    source: 'RBPP' | 'LOCAL';
  };
}

export interface SearchFilters {
  query?: string;
  nationalId?: string;
  nip?: string;
  phoneNumber?: string;
  gender?: 'M' | 'F' | '';
  province?: string;
  city?: string;
  ageMin?: number;
  ageMax?: number;
  dateCreatedFrom?: Date | null;
  dateCreatedTo?: Date | null;
  vulnerabilityScoreMin?: number;
  vulnerabilityScoreMax?: number;
  socialPrograms?: string[];
  hasPhoto?: boolean;
  isValidated?: boolean;
  hasNIP?: boolean;
}

export interface APIResponse<T> {
  results: T[];
  count: number;
  next?: string;
  previous?: string;
}

// Props interfaces
export interface PhotoUploadProps {
  onUpload: (file: File | null) => void;
  preview?: string | File | null;
  maxSize?: number;
  allowedTypes?: string[];
}

export interface LocationPickerProps {
  onLocationSelect: (location: { latitude: number; longitude: number }) => void;
  initialLocation?: { latitude: number; longitude: number } | null;
  showMap?: boolean;
  enableGPS?: boolean;
}

export interface VulnerabilityCalculatorProps {
  age?: number | null;
  hasPhoto?: boolean;
  hasPhone?: boolean;
  province?: string;
  city?: string;
  onScoreCalculate: (score: number | null) => void;
}