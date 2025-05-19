import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage {
  constructor(private router: Router) {}

  // Navega a la pantalla del juego pasando el nivel elegido
  empezarJuego(dificultad: string) {
    this.router.navigate(['/game'], {
      queryParams: { nivel: dificultad }
    });
  }
}
