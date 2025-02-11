import { Schema } from "mongoose";

interface SchemaField {
  type: string;
  required?: boolean;
  ref?: string;
  enum?: string[];
}

interface SchemaDefinition {
  [key: string]: SchemaField;
}

const VALID_TYPES = [
  "string",
  "number",
  "boolean",
  "date",
  "objectid",
  "array",
];

const getMongooseType = (fieldType: string): any => {
  switch (fieldType.toLowerCase()) {
    case 'string': return String;
    case 'number': return Number;
    case 'boolean': return Boolean;
    case 'date': return Date;
    case 'objectid': return Schema.Types.ObjectId;
    case 'array': return Array;
    default: return String;
  }
};

const getTypeScriptType = (fieldType: string): string => {
  switch (fieldType.toLowerCase()) {
    case 'string': return 'string';
    case 'number': return 'number';
    case 'boolean': return 'boolean';
    case 'date': return 'Date';
    case 'objectid': return 'mongoose.Types.ObjectId';
    case 'array': return 'any[]';
    default: return 'any';
  }
};

export const generateMongooseSchema = (
  schema: SchemaDefinition
): Record<string, any> => {
  const mongooseSchema: Record<string, any> = {};

  for (const [fieldName, field] of Object.entries(schema)) {
    if (!field.type) {
      throw new Error(
        `Field '${fieldName}' is missing required 'type' property`
      );
    }

    if (typeof field.type !== "string") {
      throw new Error(`Field '${fieldName}' type must be a string`);
    }

    const fieldType = field.type.toLowerCase();
    if (!VALID_TYPES.includes(fieldType)) {
      throw new Error(
        `Field '${fieldName}' has invalid type '${field.type}'. Valid types are: ${VALID_TYPES.join(", ")}`
      );
    }

    const schemaField: Record<string, any> = {
      type: getMongooseType(fieldType)
    };

    if (field.required) {
      schemaField.required = true;
    }

    if (field.ref) {
      schemaField.ref = field.ref;
    }

    if (field.enum) {
      schemaField.enum = field.enum;
    }

    mongooseSchema[fieldName] = schemaField;
  }

  return mongooseSchema;
};

export const generateTypeScript = async (name: string, schema: SchemaDefinition): Promise<string> => {
  const mongooseSchema = generateMongooseSchema(schema);

  // Generate interface
  let code = `import mongoose, { Schema, Document } from 'mongoose';\n\n`;
  
  // Generate interface
  code += `export interface I${name} extends Document {\n`;
  for (const [fieldName, field] of Object.entries(schema)) {
    const tsType = getTypeScriptType(field.type);
    const optional = field.required ? '' : '?';
    code += `  ${fieldName}${optional}: ${tsType};\n`;
  }
  code += `  createdAt: Date;\n`;
  code += `  updatedAt: Date;\n`;
  code += `}\n\n`;

  // Generate schema with raw object instead of JSON string
  code += `const ${name}Schema = new Schema({\n`;
  for (const [fieldName, field] of Object.entries(mongooseSchema)) {
    code += `  ${fieldName}: {\n`;
    for (const [key, value] of Object.entries(field)) {
      if (typeof value === 'function') {
        code += `    ${key}: ${value.name},\n`;
      } else {
        code += `    ${key}: ${JSON.stringify(value)},\n`;
      }
    }
    code += `  },\n`;
  }
  code += `}, {\n  timestamps: true\n});\n\n`;

  // Add schema methods if needed
  if (schema.password) {
    code += `${name}Schema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  // Add password comparison logic here if needed
  return true;
};\n\n`;
  }

  // Generate model
  code += `const ${name}Model = mongoose.model<I${name}>('${name}', ${name}Schema);\n`;
  code += `export default ${name}Model;\n`;

  return code;
};
