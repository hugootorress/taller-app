import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../../servicios/client/client.service';
import { Client } from '../../../modelos/client.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { SidebarComponent } from '../../sidebar/sidebar.component';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [ CommonModule, RouterModule, SidebarComponent ], 
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.css']
})
export class ClientDetailComponent implements OnInit {
  selectedClient: Client | null = null; 
  errorMessage: string = '';
  
  constructor(
    private clientService: ClientService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadClient(parseInt(id, 10));  
    }
  }

  loadClient(id: number): void {
    this.clientService.getClient(id).subscribe({
      next: data => {
        this.selectedClient = data;
      },
      error: () => {
        this.errorMessage = 'Error al cargar el cliente';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/clients']);  
  }
}


