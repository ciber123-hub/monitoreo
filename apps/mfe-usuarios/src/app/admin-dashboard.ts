import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';
import { UserService } from './services/user.service';
import { User } from './models/user.model';
import Swal from 'sweetalert2';

interface UserRow extends User {
  // Mantiene estructura de tabla interna si es necesario
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ToggleSwitchModule, TooltipModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboard implements OnInit {

  usersList = signal<User[]>([]);
  newUserSearch = '';

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

  onUpdateUserProfile(user: User): void {
    this.usersList.update(list =>
      list.map(u => u.id === user.id ? user : u)
    );
  }

  onToggleUserActive(user: User, activo: boolean): void {
    this.usersList.update(list =>
      list.map(u => u.id === user.id ? { ...u, activo } : u)
    );
  }

  onDeleteUser(user: User): void {
    this.usersList.update(list =>
      list.filter(u => u.id !== user.id)
    );
  }
}