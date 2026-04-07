import ResultadoBase from './ResultadoBase.jsx';

export default function ResultadoFar({ data }) {
  if (!data) return null;

  const movimientos = (data.history || []).map((m) => ({
    fecha: m.date || '',
    titulo: m.description || 'Movimiento registrado',
    descripcion: [m.location, m.timezone].filter(Boolean).join(' · ') || 'Ubicación no informada.'
  }));

  const ultimo = movimientos[movimientos.length - 1];

  return (
    <ResultadoBase
      empresa="FAR"
      titulo="Seguimiento internacional"
      subtitulo={data.trackingNumber || 'Historial de movimientos del paquete.'}
      estado={ultimo?.titulo || 'Sin estado informado'}
      movimientos={movimientos}
    />
  );
}