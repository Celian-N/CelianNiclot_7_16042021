import { createToast } from 'mosha-vue-toastify';
import 'mosha-vue-toastify/dist/style.css';

export const showErrorBanner = (message: string) => {
  createToast(
    {
      title: 'Une erreur est survenue',
      description: message,
    },
    {
      showIcon: true,
      type: 'danger', // 'info', 'danger', 'warning', 'success', 'default'
      timeout: 3000,
      showCloseButton: true,
      position: 'bottom-center',
      transition: 'slide',
      hideProgressBar: true,
      swipeClose: true,
      toastBackgroundColor: '#E22A7F',
    }
  );
};

export const showSuccessBanner = (message: string) => {
  createToast(
    {
      title: 'Félicitations',
      description: message,
    },
    {
      showIcon: true,
      type: 'success', // 'info', 'danger', 'warning', 'success', 'default'
      timeout: 3000,
      showCloseButton: true,
      position: 'bottom-center',
      transition: 'slide',
      hideProgressBar: true,
      swipeClose: true,
      toastBackgroundColor: '#2DD385',
    }
  );
};
