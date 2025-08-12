// Simple password security utilities (no encryption for demo)
export class PasswordSecurity {
  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (password.length < 6) {
      errors.push("Le mot de passe doit contenir au moins 6 caractères")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  static hashPassword(password: string): string {
    // Simple demo hash - just return the password for static accounts
    return password
  }

  static verifyPassword(password: string, hash: string): boolean {
    // Simple demo verification
    return password === hash
  }
}
