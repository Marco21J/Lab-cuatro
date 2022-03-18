import { ValidationErrors } from "@angular/forms";

export const getErrorMessage = (errorKey: string, formError: ValidationErrors): string => {
    switch (errorKey) {
        case 'required':
            return 'Este campo es requerido.';
        case 'minlength':
            return `Este campo debe contener al menos ${formError.minlength.requiredLength} caracteres.`;
        case 'maxlength':
            return `Este campo no puede tener más de ${formError.minlength.requiredLength} caracteres.`;
        case 'email':
            return 'Este campo debe contener un formato de correo electrónico válido.';
        default:
            return '';
    }
};