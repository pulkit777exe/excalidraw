export const createErrorResponse = (message: string, statusCode: number = 400) => ({
  success: false,
  message,
  statusCode,
  timestamp: new Date().toISOString(),
});

export const createSuccessResponse = (data: any, message?: string) => ({
  success: true,
  message,
  data,
  timestamp: new Date().toISOString(),
});
