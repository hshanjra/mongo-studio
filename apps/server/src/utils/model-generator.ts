import mongoose, { Schema } from 'mongoose';
import fs from 'fs';
import path from 'path';

interface IFieldDefinition {
  type: string;
  required?: boolean;
  unique?: boolean;
  ref?: string;
  default?: any;
  min?: number;
  max?: number;
  enum?: string[];
}

interface IModelDefinition {
  name: string;
  fields: Record<string, IFieldDefinition>;
}

export class ModelGenerator {
  private static getMongooseType(type: string): any {
    const typeMap: Record<string, any> = {
      'string': String,
      'number': Number,
      'boolean': Boolean,
      'date': Date,
      'objectId': Schema.Types.ObjectId,
      'array': Array
    };
    return typeMap[type.toLowerCase()] || String;
  }

  private static generateSchemaField(field: IFieldDefinition): any {
    const schemaField: any = {
      type: this.getMongooseType(field.type)
    };

    if (field.required) schemaField.required = true;
    if (field.unique) schemaField.unique = true;
    if (field.ref) schemaField.ref = field.ref;
    if (field.default !== undefined) schemaField.default = field.default;
    if (field.min !== undefined) schemaField.min = field.min;
    if (field.max !== undefined) schemaField.max = field.max;
    if (field.enum) schemaField.enum = field.enum;

    return schemaField;
  }

  public static generateModelCode(modelDef: IModelDefinition): string {
    const className = modelDef.name;
    const interfaceName = `I${className}`;
    
    let code = `import mongoose, { Schema, Document } from 'mongoose';\n\n`;
    
    // Generate interface
    code += `export interface ${interfaceName} extends Document {\n`;
    Object.entries(modelDef.fields).forEach(([fieldName, field]) => {
      const optional = !field.required ? '?' : '';
      let typeString = 'string';
      
      switch (field.type.toLowerCase()) {
        case 'number': typeString = 'number'; break;
        case 'boolean': typeString = 'boolean'; break;
        case 'date': typeString = 'Date'; break;
        case 'objectid': typeString = 'mongoose.Types.ObjectId'; break;
        case 'array': typeString = 'any[]'; break;
      }
      
      code += `  ${fieldName}${optional}: ${typeString};\n`;
    });
    code += '}\n\n';

    // Generate schema
    code += `const ${className}Schema = new Schema({\n`;
    Object.entries(modelDef.fields).forEach(([fieldName, field]) => {
      code += `  ${fieldName}: ${JSON.stringify(this.generateSchemaField(field), null, 2)},\n`;
    });
    code += '}, {\n  timestamps: true\n});\n\n';

    // Generate and export model
    code += `const ${className}Model = mongoose.model<${interfaceName}>('${className}', ${className}Schema);\n`;
    code += `export default ${className}Model;\n`;

    return code;
  }

  public static async generateModelFile(modelDef: IModelDefinition, outputPath: string): Promise<void> {
    try {
      const code = this.generateModelCode(modelDef);
      const filePath = path.join(outputPath, `${modelDef.name}.model.ts`);
      
      // Ensure directory exists
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Write the file
      fs.writeFileSync(filePath, code);
    } catch (error) {
      throw new Error(`Failed to generate model file: ${error}`);
    }
  }
}
