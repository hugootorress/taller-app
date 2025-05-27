import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PartService } from '../../../servicios/part/part.service';
import { Part } from '../../../modelos/part.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../sidebar/sidebar.component';

@Component({
  selector: 'app-create-part',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './create-part.component.html',
  styleUrls: ['./create-part.component.css']
})
export class CreatePartComponent {
  part: Part = { id: '', name: '', price: 0, stock: 0, profit_margin: 0 }; 

  constructor(private partService: PartService, private router: Router) {}

  addPart() {
    this.partService.addPart(this.part).subscribe(() => {
      this.router.navigate(['/parts']);
    });
  }
  goBack() {
    this.router.navigate(['/parts']);
  }
}
