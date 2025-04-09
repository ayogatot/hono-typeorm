import { ILike, In } from "typeorm";

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface WhereClause {
  [key: string]: any;
}

export const defaultPaginationOptions: PaginationOptions = {
  page: 1,
  limit: 10,
  sortBy: "created_at",
  sortOrder: "DESC"
};

export const buildPagination = (total: number, page: number, limit: number) => ({
  total,
  page,
  totalPages: Math.ceil(total / limit),
  hasNextPage: page < Math.ceil(total / limit),
});

export const buildWhereClause = (conditions: WhereClause[]) => {
  if (conditions.length === 0) return {};
  if (conditions.length === 1) return conditions[0];
  return conditions;
};

export const addSearchCondition = (whereClause: WhereClause | WhereClause[], searchFields: string[], searchTerm: string) => {
  if (!searchTerm) return whereClause;

  const searchConditions = searchFields.map(field => ({
    [field]: ILike(`%${searchTerm}%`)
  }));

  if (Array.isArray(whereClause)) {
    return whereClause.map(condition => ({
      ...condition,
      ...searchConditions[0]
    }));
  }

  return {
    ...whereClause,
    ...searchConditions[0]
  };
};

export const addFilterCondition = (whereClause: WhereClause | WhereClause[], field: string, value: any) => {
  if (!value) return whereClause;

  if (Array.isArray(whereClause)) {
    return whereClause.map(condition => ({
      ...condition,
      [field]: value
    }));
  }

  return {
    ...whereClause,
    [field]: value
  };
};

export const addRelationFilter = (whereClause: WhereClause | WhereClause[], relation: string, field: string, value: any) => {
  if (!value) return whereClause;

  if (Array.isArray(whereClause)) {
    return whereClause.map(condition => ({
      ...condition,
      [relation]: { [field]: value }
    }));
  }

  return {
    ...whereClause,
    [relation]: { [field]: value }
  };
}; 