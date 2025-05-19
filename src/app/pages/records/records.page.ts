import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-records',
  standalone: false,
  templateUrl: './records.page.html',
  styleUrls: ['./records.page.scss']
})
export class RecordsPage implements OnInit {
  resultados: any[] = [];

  constructor(private supabase: SupabaseService) {}

  async ngOnInit() {
    await this.cargarMejoresResultados();
  }

  async cargarMejoresResultados() {
    const { data, error } = await this.supabase
      .getCliente()
      .from('resultados_memoria')
      .select('*')
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
}
