interface SchemaField {
  type: string;
  required?: boolean;
  ref?: string;
  enum?: string[];
}

interface SchemaDefinition {
  [key: string]: SchemaField;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateSchema = (schema: SchemaDefinition): ValidationResult => {
  const result: ValidationResult = {
    isValid: true,
    errors: []
  };

  const validTypes = ['string', 'number', 'boolean', 'date', 'objectid'];

  for (const [fieldName, field] of Object.entries(schema)) {
    // Validate field name
    if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(fieldName)) {
      result.errors.push(`Invalid field name: ${fieldName}. Field names must start with a letter and contain only letters and numbers.`);
    }

    // Validate type
    if (!field.type || !validTypes.includes(field.type.toLowerCase())) {
      result.errors.push(`Invalid type for field ${fieldName}: ${field.type}. Valid types are: ${validTypes.join(', ')}`);
    }

    // Validate ref (only for ObjectId types)
    if (field.type.toLowerCase() === 'objectid' && field.ref) {
      if (!/^[A-Z][a-zA-Z0-9]*$/.test(field.ref)) {
        result.errors.push(`Invalid ref for field ${fieldName}: ${field.ref}. Ref must be a valid model name.`);
      }
    }

    // Validate enum (only for String types)
    if (field.type.toLowerCase() === 'string' && field.enum) {
      if (!Array.isArray(field.enum) || field.enum.length === 0) {
        result.errors.push(`Invalid enum for field ${fieldName}: enum must be a non-empty array.`);
      }
    }
  }

  result.isValid = result.errors.length === 0;
  return result;
};
