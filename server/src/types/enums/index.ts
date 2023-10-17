export enum ResCodes {
  ERROR,
  VALIDATION_ERROR,
  CREATE_USER,
  LOGIN,
  SEND_RESTORE_PASSWORD_EMAIL,
  RESET_PASSWORD,
  SEND_USER,
  UPDATE_USER,
  DELETE_USER,
  CREATE_CATEGORY,
  GET_CATEGORIES,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
  CREATE_BUDGET_ITEM,
  GET_BUDGET_ITEMS,
  UPDATE_BUDGET_ITEM,
  DELETE_BUDGET_ITEM,
  GENERAL_RESPONSE
}

export enum CategoryType {
  INCOME = 'income',
  EXPENSE = 'expense'
}

export enum QueryFilter {
  ALL,
  YEAR,
  MONTH
}
