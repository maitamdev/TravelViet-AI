import { toast as sonnerToast } from 'sonner';
import { CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react';

export const toast = {
    success: (message: string, description?: string) => {
        sonnerToast.success(message, {
            description,
            icon: <CheckCircle2 className="h-5 w-5" />,
      duration: 3000,
        });
    },

    error: (message: string, description?: string) => {
        sonnerToast.error(message, {
            description,
            icon: <XCircle className="h-5 w-5" />,
      duration: 4000,
        });
    },

    warning: (message: string, description?: string) => {
        sonnerToast.warning(message, {
            description,
            icon: <AlertCircle className="h-5 w-5" />,
      duration: 3500,
        });
    },

    info: (message: string, description?: string) => {
        sonnerToast.info(message, {
            description,
            icon: <Info className="h-5 w-5" />,
      duration: 3000,
        });
    },

    promise: <T,>(
        promise: Promise<T>,
        messages: {
            loading: string;
            success: string;
            error: string;
        }
    ) => {
        return sonnerToast.promise(promise, {
            loading: messages.loading,
            success: messages.success,
            error: messages.error,
        });
    },
};

// Vietnamese messages
export const toastMessages = {
    auth: {
        loginSuccess: 'Đăng nhập thành công!',
        loginError: 'Đăng nhập thất bại',
        logoutSuccess: 'Đã đăng xuất',
        registerSuccess: 'Đăng ký thành công!',
        registerError: 'Đăng ký thất bại',
        passwordResetSent: 'Email đặt lại mật khẩu đã được gửi',
        passwordResetError: 'Không thể gửi email đặt lại mật khẩu',
    },
    trip: {
        createSuccess: 'Tạo chuyến đi thành công!',
        createError: 'Không thể tạo chuyến đi',
        updateSuccess: 'Cập nhật chuyến đi thành công!',
        updateError: 'Không thể cập nhật chuyến đi',
        deleteSuccess: 'Xóa chuyến đi thành công!',
        deleteError: 'Không thể xóa chuyến đi',
    },
    general: {
        saveSuccess: 'Lưu thành công!',
        saveError: 'Lưu thất bại',
        copySuccess: 'Đã sao chép vào clipboard',
        networkError: 'Lỗi kết nối mạng',
    },
};
