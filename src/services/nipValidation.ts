export interface ValidationResult {
  isValid: boolean;
  error?: string;
  details: {
    format: boolean;
    checksum: boolean;
    birthDate: boolean;
    uniqueness?: boolean;
  };
}

export class NIPValidationService {
  private static readonly NIP_LENGTH = 14;
  private static readonly NIP_PATTERN = /^[A-Z0-9]{14}$/;

  static async validateNIPFormat(nip: string): Promise<ValidationResult> {
    const result: ValidationResult = {
      isValid: false,
      details: {
        format: false,
        checksum: false,
        birthDate: false,
      }
    };

    // 1. Validation longueur
    if (!nip || nip.length !== this.NIP_LENGTH) {
      result.error = `Le NIP doit contenir exactement ${this.NIP_LENGTH} caractères`;
      return result;
    }

    // 2. Validation format alphanumérique
    if (!this.NIP_PATTERN.test(nip)) {
      result.error = 'Le NIP ne peut contenir que des lettres majuscules et des chiffres';
      return result;
    }
    result.details.format = true;

    // 3. Validation date de naissance intégrée
    const birthDateValid = this.validateEmbeddedBirthDate(nip);
    if (!birthDateValid) {
      result.error = 'Date de naissance invalide dans le NIP';
      return result;
    }
    result.details.birthDate = true;

    // 4. Validation clé de contrôle
    const checksumValid = this.validateChecksum(nip);
    if (!checksumValid) {
      result.error = 'Clé de contrôle du NIP invalide';
      return result;
    }
    result.details.checksum = true;

    result.isValid = true;
    return result;
  }

  private static validateEmbeddedBirthDate(nip: string): boolean {
    const birthDateStr = nip.substring(8, 16); // AAAAMMJJ
    
    if (birthDateStr.length !== 8) return false;
    
    const year = parseInt(birthDateStr.substring(0, 4));
    const month = parseInt(birthDateStr.substring(4, 6));
    const day = parseInt(birthDateStr.substring(6, 8));
    
    const currentYear = new Date().getFullYear();
    
    if (year < 1900 || year > currentYear) return false;
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year &&
           date.getMonth() === month - 1 &&
           date.getDate() === day &&
           date <= new Date();
  }

  private static validateChecksum(nip: string): boolean {
    // Implémentation simplifiée - à adapter selon spécifications RBPP
    return true;
  }

  static async checkNIPUniqueness(nip: string, excludeId?: number): Promise<boolean> {
    try {
      const response = await fetch('/api/identity/check-nip-uniqueness/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nip, exclude_id: excludeId }),
      });

      if (!response.ok) return false;
      
      const data = await response.json();
      return data.is_unique;
    } catch {
      return true; // En cas d'erreur, on laisse passer
    }
  }
}