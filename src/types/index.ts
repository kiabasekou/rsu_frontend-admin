
// Types principaux pour RSU

export interface PersonIdentity {
  id: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  full_name: string;
  birth_date: string;
  gender: 'M' | 'F' | 'O';
  national_id: string;
  phone_number: string;
  city: string;
  province: string;
  is_validated: boolean;
  created_at: string;
}

export interface SocialProgram {
  id: string;
  code: string;
  name: string;
  description: string;
  program_type: string;
  total_budget: number;
  allocated_budget: number;
  budget_remaining: number;
  current_beneficiaries: number;
  max_beneficiaries?: number;
  start_date: string;
  end_date: string;
  status: string;
}

export interface APIResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}