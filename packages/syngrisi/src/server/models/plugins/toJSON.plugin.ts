/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema, Document } from 'mongoose';

const deleteAtPath = (obj: any, path: string[], index: number) => {
  if (index === path.length - 1) {
    delete obj[path[index]];
    return;
  }
  deleteAtPath(obj[path[index]], path, index + 1);
};

const toJSON = <T extends Document>(schema: Schema<T>) => {
  let transform: ((doc: T, ret: any, options: any) => any) | undefined;

  // Cast schema to the type with options property
  const schemaWithOptions = schema as typeof schema & { options: any };

  if (schemaWithOptions.options.toJSON && schemaWithOptions.options.toJSON.transform) {
    transform = schemaWithOptions.options.toJSON.transform;
  }

  schemaWithOptions.options.toJSON = Object.assign(schemaWithOptions.options.toJSON || {}, {
    transform(doc: T, ret: any, options: any) {
      Object.keys(schema.paths).forEach((path) => {
        if (
          schema.paths[path].options &&
          schema.paths[path].options.private
        ) {
          deleteAtPath(ret, path.split('.'), 0);
        }
      });

      ret.id = ret._id.toString();
      delete ret.__v;
      delete ret.createdAt;
      delete ret.updatedAt;
      if (transform) {
        return transform(doc, ret, options);
      }
      return ret;
    },
  });
};

export default toJSON;
