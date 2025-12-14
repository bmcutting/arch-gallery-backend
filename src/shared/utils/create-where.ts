import {
  Between,
  FindOperator,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
  Raw,
} from 'typeorm';

let rawParamCounter = 0;

export class WhereUtils {
  static range<T>(min?: T, max?: T): FindOperator<T> | undefined {
    if (min != null && max != null) return Between(min, max);
    if (min != null) return MoreThanOrEqual(min);
    if (max != null) return LessThanOrEqual(max);
    return undefined;
  }

  static dateRange(
    minDate?: Date,
    maxDate?: Date,
  ): FindOperator<Date> | undefined {
    if (minDate && !isNaN(minDate.getTime())) minDate.setHours(0, 0, 0, 0);
    if (maxDate && !isNaN(maxDate.getTime())) maxDate.setHours(23, 59, 59, 999);

    return this.range(minDate, maxDate);
  }

  static ilikeUnaccent(value?: string): FindOperator<string> | undefined {
    if (!value) return undefined;

    const normalized = value.toLowerCase().replace(/[^a-z0-9]/gi, '');
    const key = `param_${rawParamCounter++}`;

    return Raw(
      (alias) =>
        `REGEXP_REPLACE(LOWER(unaccent(${alias})), '[^a-z0-9]', '', 'g') ILIKE :${key}`,
      { [key]: `%${normalized}%` },
    );
  }

  static ilikeUnaccentMultiple(
    values?: string[],
  ): FindOperator<string> | undefined {
    if (!values?.length) return undefined;

    const normalizedValues = values.map((v) =>
      v.toLowerCase().replace(/[^a-z0-9]/gi, ''),
    );
    const keyBase = `param_${rawParamCounter++}`;

    return Raw(
      (alias) => {
        const conditions = normalizedValues
          .map(
            (_, i) =>
              `REGEXP_REPLACE(LOWER(unaccent(${alias})), '[^a-z0-9]', '', 'g') ILIKE :${keyBase}_${i}`,
          )
          .join(' OR ');
        return `(${conditions})`;
      },
      normalizedValues.reduce(
        (acc, v, i) => {
          acc[`${keyBase}_${i}`] = `%${v}%`;
          return acc;
        },
        {} as Record<string, string>,
      ),
    );
  }

  static assignIfExists<T>(value?: T): T | undefined {
    return value !== undefined ? value : undefined;
  }

  static addIfDefinedMany<T>(
    obj: T,
    fields: Partial<{ [K in keyof T]: T[K] | undefined }>,
  ): void {
    (Object.keys(fields) as (keyof T)[]).forEach((key) => {
      const value = fields[key];
      if (value !== undefined) obj[key] = value;
    });
  }

  static orCondition<T>(values?: T | T[]): FindOperator<T> | T | undefined {
    if (values === undefined || values === null) return undefined;

    if (Array.isArray(values)) {
      return values.length > 1 ? In(values) : values[0];
    }

    return values;
  }
}
