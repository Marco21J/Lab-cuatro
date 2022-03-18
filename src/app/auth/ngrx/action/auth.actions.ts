import { createAction, props } from '@ngrx/store';
import { ILoginResponse } from '../../models/interfaces/login-response.interface';

export const setUser = createAction(
    '[Auth] Set User',
    props<{ usuario: ILoginResponse }>()
);

export const unsetUser = createAction(
    '[Auth] Unset User',
);