// src/schemas/validationSchemas.ts
import * as yup from 'yup';

// CNI Gabonaise: 12 chiffres
const gabonNationalIdRegex = /^[0-9]{12}$/;
const gabonPhoneRegex = /^(\+241|241)?[0-9]{8}$/;

export const personSchema = yup.object({
  firstName: yup
    .string()
    .required('Le prénom est obligatoire')
    .min(2, 'Minimum 2 caractères')
    .max(50, 'Maximum 50 caractères')
    .matches(/^[a-zA-ZÀ-ÿ\s-']+$/, 'Caractères invalides'),
    
  lastName: yup
    .string()
    .required('Le nom est obligatoire')
    .min(2, 'Minimum 2 caractères')
    .max(50, 'Maximum 50 caractères')
    .matches(/^[a-zA-ZÀ-ÿ\s-']+$/, 'Caractères invalides'),
    
  nationalId: yup
    .string()
    .required('La CNI est obligatoire')
    .matches(gabonNationalIdRegex, 'CNI doit contenir exactement 12 chiffres'),
    
  phoneNumber: yup
    .string()
    .required('Le téléphone est obligatoire')
    .matches(gabonPhoneRegex, 'Format téléphone gabonais invalide'),
    
  email: yup
    .string()
    .email('Format email invalide')
    .nullable(),
    
  dateOfBirth: yup
    .date()
    .required('Date de naissance obligatoire')
    .max(new Date(), 'Date ne peut être dans le futur')
    .test('min-age', 'Âge minimum 16 ans', function(value) {
      if (!value) return false;
      const age = new Date().getFullYear() - value.getFullYear();
      return age >= 16;
    }),
    
  gender: yup
    .string()
    .required('Le genre est obligatoire')
    .oneOf(['M', 'F', 'Autre'], 'Genre invalide'),
    
  province: yup
    .string()
    .required('La province est obligatoire')
    .oneOf([
      'Estuaire', 'Haut-Ogooué', 'Moyen-Ogooué', 'Ngounié',
      'Nyanga', 'Ogooué-Ivindo', 'Ogooué-Lolo', 'Ogooué-Maritime', 'Woleu-Ntem'
    ], 'Province invalide'),
    
  city: yup
    .string()
    .required('La ville est obligatoire'),
    
  address: yup
    .string()
    .required('L\'adresse est obligatoire')
    .min(10, 'Adresse trop courte'),

  // Ajout des champs `photo` et `coordinates`
  photo: yup
    .mixed()
    .nullable(),
    
  coordinates: yup
    .object({
      latitude: yup.number().required(),
      longitude: yup.number().required(),
    })
    .nullable(),

  socialPrograms: yup.array().of(yup.string()).nullable().default([]),
  vulnerabilityScore: yup.number().nullable().default(null),
});

export const programSchema = yup.object({
  code: yup
    .string()
    .required('Le code est obligatoire')
    .matches(/^[A-Z0-9_]{3,10}$/, 'Code: 3-10 caractères majuscules/chiffres'),
    
  name: yup
    .string()
    .required('Le nom est obligatoire')
    .min(5, 'Minimum 5 caractères')
    .max(100, 'Maximum 100 caractères'),
    
  totalBudget: yup
    .number()
    .required('Budget total obligatoire')
    .positive('Budget doit être positif')
    .min(1000000, 'Budget minimum 1M FCFA'),
    
  maxBeneficiaries: yup
    .number()
    .required('Nombre maximum de bénéficiaires obligatoire')
    .integer('Doit être un nombre entier')
    .min(1, 'Minimum 1 bénéficiaire'),
    
  description: yup
    .string()
    .nullable()
    .max(500, 'Maximum 500 caractères'),
    
  eligibilityCriteria: yup
    .string()
    .nullable(),
    
  startDate: yup
    .date()
    .required('Date de début obligatoire')
    .min(new Date('2020-01-01'), 'Date de début invalide'),
    
  endDate: yup
    .date()
    .nullable()
    .min(yup.ref('startDate'), 'Date de fin ne peut pas être antérieure à la date de début'),
});