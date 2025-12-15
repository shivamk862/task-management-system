export const successResponse = (res, statusCode, message, data, pagination) => {
    const response = {
        success: true,
        message,
        data,
    };

    if (pagination) {
        response.pagination = pagination;
    }

    res.status(statusCode).json(response);
};

export const errorResponse = (res, statusCode, message, error) => {
    res.status(statusCode).json({
        success: false,
        message,
        error: error?.message || error,
    });
};
