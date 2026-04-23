import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

interface User {
  id: string;
  usuario: string;
  perfil: 'Soporte' | 'Admin' | 'Usuario';
  activo: boolean;
  fechaAgregado: Date;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboard implements OnInit {

  usersList = signal<User[]>([]);
  newUserSearch = '';

  ngOnInit(): void {
    this.usersList.set([
      { id: '1', usuario: 'rlopez', perfil: 'Soporte', activo: false, fechaAgregado: new Date() },
      { id: '2', usuario: 'ovazquez', perfil: 'Admin', activo: true, fechaAgregado: new Date() },
      { id: '3', usuario: 'rcruz', perfil: 'Soporte', activo: true, fechaAgregado: new Date() }
    ]);
  }

  onAddUser(): void {
    const user = this.newUserSearch.trim();
    if (!user) return;

    this.usersList.update(list => [
      ...list,
      {
        id: Date.now().toString(),
        usuario: user,
        perfil: 'Usuario',
        activo: true,
        fechaAgregado: new Date()
      }
    ]);

    this.newUserSearch = '';
  }

  onUpdateUserProfile(user: User): void {
    this.usersList.update(list =>
      list.map(u => u.id === user.id ? user : u)
    );
  }

  onDeleteUser(user: User): void {
    this.usersList.update(list =>
      list.filter(u => u.id !== user.id)
    );
  }
}