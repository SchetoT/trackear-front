import ResultadoBase from './ResultadoBase.jsx';

export default function ResultadoAndreani({ data }) {
  if (!data) return null;

  const movimientos = (data.movimientos || []).map((m) => ({
    fecha: m.fecha || '',
    titulo: m.estado || data.estado || 'Movimiento registrado',
    descripcion: m.evento || 'Sin detalle disponible.'
  }));

  return (
    <ResultadoBase
      empresa="Andreani"
      titulo="Estado del envío"
      subtitulo={data.fechaEntrega || 'Historial completo reportado por la empresa.'}
      estado={data.estado || 'Sin estado informado'}
      movimientos={movimientos}
    />
  );
}