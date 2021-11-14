import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationException } from 'src/exceptions/validation.exception';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    try {
      const obj = plainToClass(metadata.metatype, value);
      const errors = await validate(obj);

      if (errors.length) {
        const message = errors.map((error) => {
          return `${error.property} - ${Object.values(error.constraints).join(
            ', ',
          )}`;
        });
        throw new ValidationException(message);
      }

      return value;
    } catch (e) {
      throw new ValidationException(e);
    }
  }
}
