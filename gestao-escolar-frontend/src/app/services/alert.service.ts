import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  /**
   * Exibe um alerta de confirmação para exclusão
   */
  confirmDelete(title: string, text: string, confirmButtonText: string = 'Sim, excluir!'): Promise<boolean> {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626', // red-600
      cancelButtonColor: '#6b7280', // gray-500
      confirmButtonText: confirmButtonText,
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      focusCancel: true,
      customClass: {
        popup: 'swal2-popup-custom',
        title: 'swal2-title-custom',
        htmlContainer: 'swal2-content-custom',
        confirmButton: 'swal2-confirm-custom',
        cancelButton: 'swal2-cancel-custom'
      }
    }).then((result) => {
      return result.isConfirmed;
    });
  }

  /**
   * Exibe um alerta de sucesso
   */
  success(title: string, text: string = ''): void {
    Swal.fire({
      title: title,
      text: text,
      icon: 'success',
      confirmButtonColor: '#059669', // emerald-600
      confirmButtonText: 'OK',
      customClass: {
        popup: 'swal2-popup-custom',
        title: 'swal2-title-custom',
        htmlContainer: 'swal2-content-custom',
        confirmButton: 'swal2-confirm-custom'
      }
    });
  }

  /**
   * Exibe um alerta de erro
   */
  error(title: string, text: string = ''): void {
    Swal.fire({
      title: title,
      text: text,
      icon: 'error',
      confirmButtonColor: '#dc2626', // red-600
      confirmButtonText: 'OK',
      customClass: {
        popup: 'swal2-popup-custom',
        title: 'swal2-title-custom',
        htmlContainer: 'swal2-content-custom',
        confirmButton: 'swal2-confirm-custom'
      }
    });
  }

  /**
   * Exibe um alerta de informação
   */
  info(title: string, text: string = ''): void {
    Swal.fire({
      title: title,
      text: text,
      icon: 'info',
      confirmButtonColor: '#2563eb', // blue-600
      confirmButtonText: 'OK',
      customClass: {
        popup: 'swal2-popup-custom',
        title: 'swal2-title-custom',
        htmlContainer: 'swal2-content-custom',
        confirmButton: 'swal2-confirm-custom'
      }
    });
  }

  /**
   * Exibe um alerta de carregamento
   */
  loading(title: string, text: string = ''): void {
    Swal.fire({
      title: title,
      text: text,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
      customClass: {
        popup: 'swal2-popup-custom',
        title: 'swal2-title-custom',
        htmlContainer: 'swal2-content-custom'
      }
    });
  }

  /**
   * Fecha o alerta de carregamento
   */
  closeLoading(): void {
    Swal.close();
  }
}
