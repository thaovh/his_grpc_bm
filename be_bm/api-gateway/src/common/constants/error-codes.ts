/**
 * Vietnamese error translations for known error codes.
 */
export const ErrorTranslations: Record<string, string> = {
    // Common errors
    INTERNAL_SERVER_ERROR: 'Lỗi hệ thống, vui lòng thử lại sau',
    NOT_FOUND: 'Không tìm thấy dữ liệu yêu cầu',
    ALREADY_EXISTS: 'Dữ liệu đã tồn tại trong hệ thống',
    INVALID_ARGUMENT: 'Dữ liệu đầu vào không hợp lệ',
    PERMISSION_DENIED: 'Bạn không có quyền thực hiện chức năng này',
    UNAUTHENTICATED: 'Vui lòng đăng nhập để tiếp tục',
    Unauthorized: 'Vui lòng đăng nhập để tiếp tục',
    'Token validation failed': 'Vui lòng đăng nhập để tiếp tục',
    UNAVAILABLE: 'Dịch vụ tạm thời không khả dụng',
    DEADLINE_EXCEEDED: 'Yêu cầu quá hạn xử lý',
    Forbidden: 'Bạn không có quyền thực hiện chức năng này',
    'Invalid credentials': 'Thông tin đăng nhập không hợp lệ',
    'Invalid username or password': 'Tên đăng nhập hoặc mật khẩu không chính xác',
    'An error occurred': 'Đã có lỗi xảy ra, vui lòng thử lại',

    // Authorization errors
    INSUFFICIENT_PERMISSIONS: 'Bạn không có quyền truy cập chức năng này',
    AUTHENTICATION_REQUIRED: 'Vui lòng đăng nhập để tiếp tục',

    // Machine service specific
    MACHINE_NOT_FOUND: 'Không tìm thấy thông tin máy',
    MACHINE_CODE_EXISTS: 'Mã máy đã tồn tại trong hệ thống',
    MACHINE_DOCUMENT_NOT_FOUND: 'Không tìm thấy tài liệu máy',
    MACHINE_TRANSFER_NOT_FOUND: 'Không tìm thấy thông tin bàn giao máy',

    // Inventory service specific
    INVENTORY_ITEM_NOT_FOUND: 'Không tìm thấy vật tư trong kho',
    STOCK_NOT_ENOUGH: 'Số lượng tồn kho không đủ',

    // Master data specific
    DEPARTMENT_NOT_FOUND: 'Không tìm thấy khoa/phòng',
    BRANCH_NOT_FOUND: 'Không tìm thấy chi nhánh/bệnh viện',
    USER_NOT_FOUND: 'Không tìm thấy thông tin nhân viên/người dùng',
    'User not authenticated': 'Vui lòng đăng nhập để tiếp tục',
    'Employee code not found': 'Không tìm thấy mã nhân viên của tài khoản này',
    'No token provided': 'Vui lòng đăng nhập để tiếp tục',
};

/**
 * Get translation for an error code or message.
 * Falls back to the original value if no translation is found.
 */
export function translateError(error: string | any): string {
    if (!error) return ErrorTranslations.INTERNAL_SERVER_ERROR;

    let message = '';
    if (typeof error === 'string') {
        message = error;
    } else if (typeof error === 'object') {
        message = error.message || '';
    }

    if (!message) return ErrorTranslations.INTERNAL_SERVER_ERROR;

    // 1. Try exact match first
    if (ErrorTranslations[message]) {
        return ErrorTranslations[message];
    }

    // 2. Try to find the longest matching code within the message
    let bestMatch: string | null = null;
    let longestLength = 0;

    for (const [code, translation] of Object.entries(ErrorTranslations)) {
        if (message.includes(code) && code.length > longestLength) {
            bestMatch = translation;
            longestLength = code.length;
        }
    }

    if (bestMatch) return bestMatch;

    return message;
}
