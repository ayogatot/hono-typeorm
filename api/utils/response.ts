export const response = {
  success: (data: any, message: string, status: number) => {
    return { data, message, status };
  },
  error: (message: string | object, status: number) => {
    return { data: null, message, status };
  },
};

