interface SchemaField {
  type: string;
  required?: boolean;
  ref?: string;
  enum?: string[];
}

interface SchemaDefinition {
  [key: string]: SchemaField;
}

export const generateTypeScript = (modelName: string, schema: SchemaDefinition): string => {
  let typeScript = `interface ${modelName} {\n`;

  for (const [fieldName, field] of Object.entries(schema)) {
    const optional = field.required ? '' : '?';
    let type: string;

    switch (field.type.toLowerCase()) {
      case 'string':
        type = field.enum ? field.enum.map(v => `'${v}'`).join(' | ') : 'string';
        break;
      case 'number':
        type = 'number';
        break;
      case 'boolean':
        type = 'boolean';
        break;
      case 'date':
        type = 'Date';
        break;
      case 'objectid':
        type = field.ref ? field.ref : 'string';
        break;
      default:
        type = 'any';
    }

    typeScript += `  ${fieldName}${optional}: ${type};\n`;
  }

  typeScript += '}\n';
  return typeScript;
};
