export interface SocialProgram {
  id: number;
  code: string;
  name: string;
  program_type: string;
  total_budget: number;
  current_beneficiaries: number;
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  created_at: string;
  updated_at: string;
}

// Réexportez depuis forms.ts
export * from './forms';