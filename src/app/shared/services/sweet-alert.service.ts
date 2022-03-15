import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  constructor() { }

  showLoading(title: string, text: string): void {
    Swal.fire({
      allowOutsideClick: false,
      allowEscapeKey: false,
      title,
      text,
      backdrop: false,
      allowEnterKey: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      }
    });
  }

  hideLoading(): void {
    Swal.close();
  }

  showAlertGeneric(title: string, text: string, icon: SweetAlertIcon): void {
    Swal.fire({
      title,
      text,
      icon,
    });
  }

  async showConfirmDialog(title: string, text: string, icon: SweetAlertIcon, confirmButtonText: string): Promise<SweetAlertResult<any>> {
    const result = await Swal.fire({
      title,
      text,
      icon,
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText
    });
    return result;
  }
}
