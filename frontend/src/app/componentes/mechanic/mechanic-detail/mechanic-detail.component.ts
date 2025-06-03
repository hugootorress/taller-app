import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MechanicService } from '../../../servicios/mechanic/mechanic.service';
import { Mechanic } from '../../../modelos/mechanic.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../sidebar/sidebar.component';

@Component({
  selector: 'app-mechanic-detail',
  standalone: true,
  imports: [ CommonModule, RouterModule, SidebarComponent ],
  templateUrl: './mechanic-detail.component.html',
  styleUrls: ['./mechanic-detail.component.css']
})
export class MechanicDetailComponent implements OnInit {
  selectedMechanic: Mechanic | null = null;
  errorMessage: string = '';

  constructor(
    private mechanicService: MechanicService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadMechanic(parseInt(id, 10));
    }
  }

  loadMechanic(id: number): void {
    this.mechanicService.getMechanic(id).subscribe({
      next: data => {
        this.selectedMechanic = data;
      },
      error: () => {
        this.errorMessage = 'Error al cargar el mecánico';
      }
    });
  }

  onImgError(event: Event) {
  const element = event.target as HTMLImageElement;
  element.src = 'assets/img/default-avatar.png';
}

  goBack(): void {
    this.router.navigate(['/mechanics']);
  }
}
