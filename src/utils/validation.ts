import * as yup from 'yup';
import { NIPValidationService } from '../services/nipValidation';

const cniGabonPattern = /^[0-9]{12}$/;
const phoneGabonPattern = /^(\+241|241)?[0-9]{8}$/;

export const personValidationSchema = yup.object({
  firstName: yup
    .string()
    .required('Le prénom est obligatoire')
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut dépasser 50 caractères'),

  lastName: yup
    .string()
    .required('Le nom est obligatoire')
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut dépasser 50 caractères'),

  nationalId: yup
    .string()
    .required('La CNI est obligatoire')
    .matches(cniGabonPattern, 'Format CNI invalide (12 chiffres requis)'),

  nip: yup
    .string()
    .optional()
    .test('nip-format', 'Format NIP invalide', async function(value) {
      if (!value) return true;
      
      const validation = await NIPValidationService.validateNIPFormat(value);
      if (!validation.isValid) {
        return this.createError({ message: validation.error });
      }
      
      return true;
    }),

  phoneNumber: yup
    .string()
    .required('Le numéro de téléphone est obligatoire')
    .matches(phoneGabonPattern, 'Format téléphone gabonais invalide'),

  email: yup
    .string()
    .optional()
    .email('Format email invalide'),

  dateOfBirth: yup
    .date()
    .required('La date de naissance est obligatoire')
    .max(new Date(), 'La date de naissance ne peut être future')
    .test('adult-age', 'La personne doit être majeure', function(value) {
      if (!value) return true;
      
      const today = new Date();
      let calculatedAge = today.getFullYear() - value.getFullYear();
      const monthDiff = today.getMonth() - value.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < value.getDate())) {
        calculatedAge--;
      }
      
      return calculatedAge >= 18;
    }),

  gender: yup
    .string()
    .required('Le genre est obligatoire')
    .oneOf(['M', 'F'], 'Genre invalide'),

  province: yup
    .string()
    .required('La province est obligatoire'),

  city: yup
    .string()
    .required('La ville est obligatoire'),

  address: yup
    .string()
    .optional(),

  vulnerabilityScore: yup
    .number()
    .optional()
    .nullable()
    .min(0, 'Score de vulnérabilité invalide')
    .max(100, 'Score de vulnérabilité invalide'),

  coordinates: yup
    .object({
      latitude: yup.number().required(),
      longitude: yup.number().required(),
    })
    .optional()
    .nullable(),
});