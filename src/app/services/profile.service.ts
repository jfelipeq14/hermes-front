import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserModel } from '../models';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  private url = environment.SERVER_URL + 'users/';

  /**
   * Obtiene los datos del usuario actual desde el backend
   */
  getCurrentUser(): Observable<UserModel> {
    // Obtener el ID del usuario desde el servicio de autenticación
    const currentUser = this.authService.currentUserSubject.getValue();
    const userId = currentUser?.id;

    if (!userId) {
      throw new Error('Usuario no autenticado');
    }

    return this.http.get<UserModel>(`${this.url}${userId}`);
  }

  /**
   * Actualiza los datos del perfil de usuario
   */
  updateProfile(user: UserModel): Observable<UserModel> {
    // Asegurar que se envía el objeto correcto para update
    const updateUserDto: UserModel = {
      ...user,
      // Convertir dateBirth a Date si es una cadena
      dateBirth:
        typeof user.dateBirth === 'string'
          ? new Date(user.dateBirth)
          : user.dateBirth,
    };

    return this.http.patch<UserModel>(`${this.url}${user.id}`, updateUserDto);
  }
}
