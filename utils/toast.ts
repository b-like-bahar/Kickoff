import { toast as sonnerToast } from "sonner";

type ToastType = "success" | "error" | "warning" | "info";
type Props = {
  type: ToastType;
  message: string;
  description?: string;
};

export const toast = ({ type, message, description }: Props) => {
  const toastOptions = {
    description,
    cancel: {
      label: "Dismiss",
      onClick: () => {
        sonnerToast.dismiss();
      },
    },
  };
  switch (type) {
    case "success":
      return sonnerToast.success(message, toastOptions);
    case "error":
      return sonnerToast.error(message, toastOptions);
    case "warning":
      return sonnerToast.warning(message, toastOptions);
    case "info":
    default:
      return sonnerToast.info(message, toastOptions);
  }
};
