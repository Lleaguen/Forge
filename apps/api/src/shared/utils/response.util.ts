export class ResponseUtil {
  static success<T>(data: T, message?: string) {
    return {
      success: true,
      data,
      ...(message && { message }),
      timestamp: new Date().toISOString(),
    };
  }

  static error(message: string, statusCode = 400, errors?: any) {
    return {
      success: false,
      message,
      statusCode,
      ...(errors && { errors }),
      timestamp: new Date().toISOString(),
    };
  }

  static paginated<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
    message?: string
  ) {
    return {
      success: true,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
      ...(message && { message }),
      timestamp: new Date().toISOString(),
    };
  }
}