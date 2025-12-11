import {
    Like,
    In,
    Not,
    IsNull,
    MoreThan,
    MoreThanOrEqual,
    LessThan,
    LessThanOrEqual,
    Between,
} from 'typeorm';

/**
 * Parses a Mongo-like 'where' object and converts it to TypeORM FindOptions architecture.
 * Supports $or, $like, $in, $not, $gt, $gte, $lt, $lte, $between.
 */
export function parseWhere(where: any): any {
    if (!where || typeof where !== 'object') {
        return where;
    }

    // Handle top-level $or: {"$or": [{...}, {...}]}
    if (where['$or'] && Array.isArray(where['$or'])) {
        return where['$or'].map((cond: any) => parseWhere(cond));
    }

    const result: any = {};

    for (const [key, value] of Object.entries(where)) {
        if (value === null) {
            result[key] = IsNull();
        } else if (typeof value === 'object' && !Array.isArray(value)) {
            const val = value as any;

            // Handle operators
            if ('$like' in val) {
                result[key] = Like(val['$like']);
            } else if ('$in' in val && Array.isArray(val['$in'])) {
                result[key] = In(val['$in']);
            } else if ('$not' in val) {
                result[key] = Not(parseWhere({ [key]: val['$not'] })[key]);
            } else if ('$gt' in val) {
                result[key] = MoreThan(val['$gt']);
            } else if ('$gte' in val) {
                result[key] = MoreThanOrEqual(val['$gte']);
            } else if ('$lt' in val) {
                result[key] = LessThan(val['$lt']);
            } else if ('$lte' in val) {
                result[key] = LessThanOrEqual(val['$lte']);
            } else if ('$between' in val && Array.isArray(val['$between']) && val['$between'].length === 2) {
                result[key] = Between(val['$between'][0], val['$between'][1]);
            } else {
                // Nested object (potential relation or structured property)
                result[key] = parseWhere(value);
            }
        } else {
            result[key] = value;
        }
    }

    return result;
}
