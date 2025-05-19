import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-game',
  standalone: false,
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss']
})
export class GamePage implements OnInit {
  nivel: string = '';
  paresTotales: number = 0;
  imagenes: string[] = [];
  cartas: any[] = [];
  seleccionadas: any[] = [];
  encontrados: number = 0;
  tiempo: number = 0;
  intervalo: any;

  constructor(private route: ActivatedRoute, private supabase: SupabaseService, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.nivel = params['nivel'] || 'facil';
      this.iniciarJuego();
    });
  }

  iniciarJuego() {
  if (this.nivel === 'facil') {
    this.paresTotales = 3;
    this.imagenes = [
      'assets/img/animales/perro.png',
      'assets/img/animales/gato.png',
      'assets/img/animales/pajaro.png'
    ];
  } else if (this.nivel === 'medio') {
    this.paresTotales = 5;
    this.imagenes = [
      'assets/img/herramientas/martillo.png',
      'assets/img/herramientas/destornillador.png',
      'assets/img/herramientas/llave-inglesa.png',
      'assets/img/herramientas/pico.png',
      'assets/img/herramientas/pala.png'
    ];
  } else {
    this.paresTotales = 8;
    this.imagenes = [
      'assets/img/frutas/manzana.png',
      'assets/img/frutas/banana.png',
      'assets/img/frutas/uvas.png',
      'assets/img/frutas/sandia.png',
      'assets/img/frutas/guayaba.png',
      'assets/img/frutas/palta.png',
      'assets/img/frutas/limon.png',
      'assets/img/frutas/anana.png'
    ];
  }

  this.cartas = [...this.imagenes, ...this.imagenes]
    .map(img => ({ imagen: img, visible: false, encontrada: false }))
    .sort(() => Math.random() - 0.5);

  this.tiempo = 0;
  this.intervalo = setInterval(() => this.tiempo++, 1000);
}


  seleccionar(carta: any) {
    if (carta.visible || carta.encontrada || this.seleccionadas.length >= 2) return;

    carta.visible = true;
    this.seleccionadas.push(carta);

    if (this.seleccionadas.length === 2) {
      const [c1, c2] = this.seleccionadas;
      if (c1.imagen === c2.imagen) {
        c1.encontrada = c2.encontrada = true;
        this.encontrados++;
        this.seleccionadas = [];

        if (this.encontrados === this.paresTotales) {
          clearInterval(this.intervalo);
          this.guardarResultado();
        }
      } else {
        setTimeout(() => {
          c1.visible = false;
          c2.visible = false;
          this.seleccionadas = [];
        }, 1000);
      }
    }
  }

  async guardarResultado() {
    const user = await this.supabase.getUsuario();
    const email = user?.email || 'anonimo';

    await this.supabase.insertarResultado({
      email: email,
      dificultad: this.nivel,
      tiempo: this.tiempo,
      fecha: new Date().toISOString()
    });

    alert(`¡Ganaste! Tiempo: ${this.tiempo} segundos`);
    this.router.navigate(['/records'], {
      queryParams: { dificultad: this.nivel }
    });
  }
}
