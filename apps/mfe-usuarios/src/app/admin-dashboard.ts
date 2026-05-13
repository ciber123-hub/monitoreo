import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { UserService } from './services/user.service';
import { User } from './models/user.model';
import Swal from 'sweetalert2';

interface UserRow extends User {
  // Mantiene estructura de tabla interna si es necesario
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ToggleSwitchModule, TooltipModule, TableModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboard implements OnInit {

  usersList = signal<User[]>([]);
  newUserSearch = '';

  newUserForm = {
    email: '',
    name: '',
    roles: 'ADMIN',
    groups: 'GRUPO1'
  };

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.usersList.set(users);
      },
      error: (error) => {
        console.error('Error cargando usuarios', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los usuarios. Intente nuevamente más tarde.'
        });
      }
    });
  }

  onAddUser(): void {
    const user = this.newUserSearch.trim();
    if (!user) return;

    this.usersList.update(list => [
      ...list,
      {
        id: Date.now(),
        usuario: user,
        perfil: 'Usuario',
        activo: true,
        email: '',
        azureOid: '',
        roles: [],
        groups: []
      }
    ]);

    this.newUserSearch = '';
  }

  onCreateUser(): void {
    const request = {
      azureOid: '1',
      email: this.newUserForm.email.trim(),
      name: this.newUserForm.name.trim(),
      active: 1,
      roles: [this.newUserForm.roles.trim()],
      groups: [this.newUserForm.groups.trim()]
    };

    if (!request.name || !request.email) {
      Swal.fire({
        icon: 'warning',
        title: 'Datos incompletos',
        text: 'Por favor completa nombre y correo.'
      });
      return;
    }

    this.userService.createUser(request).subscribe({
      next: (user) => {
        this.usersList.update((list) => [...list, user]);
        this.newUserForm = {
          email: '',
          name: '',
          roles: 'ADMIN',
          groups: 'GRUPO1'
        };
        Swal.fire({
          icon: 'success',
          title: 'Usuario creado',
          text: 'El usuario fue registrado correctamente.'
        });
      },
      error: (error) => {
        console.error('Error creando usuario', error);
        const backendMessage = error?.error?.message || error?.message || 'No se pudo crear el usuario. Intenta de nuevo más tarde.';
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: backendMessage
        });
      }
    });
  }

  onUpdateUserProfile(user: User, newPerfil: User['perfil']): void {
    const oldPerfil = user.perfil;
    const updatedUser: User = {
      ...user,
      perfil: newPerfil,
      roles: [newPerfil === 'Admin' ? 'ADMIN' : newPerfil === 'Soporte' ? 'SUPPORT' : 'USUARIO']
    };

    this.userService.updateUser(user.id, {
      email: updatedUser.email,
      name: updatedUser.usuario,
      active: updatedUser.activo ? 1 : 0,
      roles: updatedUser.roles,
      groups: updatedUser.groups
    }).subscribe({
      next: (savedUser) => {
        this.usersList.update(list =>
          list.map(u => u.id === savedUser.id ? savedUser : u)
        );
      },
      error: (error) => {
        console.error('Error actualizando usuario', error);
        this.usersList.update(list =>
          list.map(u =>
            u.id === user.id ? { ...u, perfil: oldPerfil } : u
          )
        );
        const backendMessage = error?.error?.message || error?.message || 'No se pudo actualizar el usuario.';
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: backendMessage
        });
      }
    });
  }

  onToggleUserActive(user: User, activo: boolean): void {
    const oldActivo = user.activo;
    const updatedUser: User = {
      ...user,
      activo
    };

    this.userService.updateUser(user.id, {
      email: updatedUser.email,
      name: updatedUser.usuario,
      active: updatedUser.activo ? 1 : 0,
      roles: updatedUser.roles,
      groups: updatedUser.groups
    }).subscribe({
      next: (savedUser) => {
        this.usersList.update(list =>
          list.map(u => u.id === savedUser.id ? savedUser : u)
        );
      },
      error: (error) => {
        console.error('Error actualizando estado del usuario', error);
        this.usersList.update(list =>
          list.map(u =>
            u.id === user.id ? { ...u, activo: oldActivo } : u
          )
        );
        const backendMessage = error?.error?.message || error?.message || 'No se pudo actualizar el estado del usuario.';
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: backendMessage
        });
      }
    });
  }

  onDeleteUser(user: User): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres eliminar al usuario "${user.usuario}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(user.id).subscribe({
          next: () => {
            this.usersList.update(list =>
              list.filter(u => u.id !== user.id)
            );
            Swal.fire({
              icon: 'success',
              title: 'Usuario eliminado',
              text: 'El usuario fue eliminado correctamente.'
            });
          },
          error: (error) => {
            console.error('Error eliminando usuario', error);
            const backendMessage = error?.error?.message || error?.message || 'No se pudo eliminar el usuario.';
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: backendMessage
            });
          }
        });
      }
    });
  }
}