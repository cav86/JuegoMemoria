import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/services/supabase.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-records',
  standalone: false,
  templateUrl: './records.page.html',
  styleUrls: ['./records.page.scss']
})
export class RecordsPage implements OnInit {
  resultados: any[] = [];
  dificultad: string = '';

  constructor(
    private supabase: SupabaseService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      this.dificultad = params['dificultad'] || '';
      await this.cargarMejoresResultados();
    });
  }

  async cargarMejoresResultados() {
    const { data, error } = await this.supabase
      .getCliente()
      .from('resultados_memoria')
      .select('*')
      .eq('dificultad', this.dificultad)
      .order('tiempo', { ascending: true })
      .limit(5);

    if (error) {
      console.error('Error al cargar resultados:', error.message);
      return;
    }

    this.resultados = data || [];
  }

  obtenerNombre(email: string): string {
    return email.split('@')[0];
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleString();
  }

  volverAInicio() {
    this.router.navigate(['/home']);
  }
}