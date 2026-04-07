import DOMPurify from 'dompurify';

function getStatusTone(estado) {
  return Number(estado) === 1 ? 'success' : 'danger';
}

function normalizeValue(value) {
  if (Array.isArray(value)) return value.join(', ');
  if (value === null || value === undefined || value === '') return 'No disponible';
  return value;
}

function sanitizeBuspackHtml(html) {
  return DOMPurify.sanitize(String(html || ''), {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'link', 'meta'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'style']
  });
}

export default function ResultadoBusPack({ data }) {
  if (!data?.template) {
    return <div className="empty-state">No hay datos para mostrar.</div>;
  }

  const {
    estado,
    mensaje,
    template: {
      nrotarea,
      nroComprobante,
      cantidadPiezas,
      piezas,
      pesoTotal,
      receptor,
      documentoReceptor,
      agenciaDestino,
      contenttemplate
    } = {}
  } = data;

  const campos = [
    ['Número de tarea', nrotarea],
    ['Nro. de comprobante', nroComprobante],
    ['Cantidad de piezas', cantidadPiezas],
    ['Piezas', piezas],
    ['Peso total (kg)', pesoTotal],
    ['Receptor', receptor],
    ['Documento receptor', documentoReceptor],
    ['Agencia destino', agenciaDestino]
  ];

  const sanitizedContent = sanitizeBuspackHtml(contenttemplate);

  return (
    <div className="result-card">
      <div className="result-head">
        <div className="result-title-group">
          <p className="result-eyebrow">Buspack</p>
          <h2 className="result-title">Resultado de la consulta</h2>
          <p className="result-subtitle">
            {mensaje || 'Información recibida correctamente.'}
          </p>
        </div>

        <span className={`status-badge status-badge--${getStatusTone(estado)}`}>
          {Number(estado) === 1 ? 'Consulta válida' : 'Error de consulta'}
        </span>
      </div>

      <div className="result-body">
        <div className="info-grid">
          {campos.map(([label, value]) => (
            <div className="info-box" key={label}>
              <span className="info-label">{label}</span>
              <span className="info-value">{normalizeValue(value)}</span>
            </div>
          ))}
        </div>

        {sanitizedContent ? (
          <div
            className="buspack-html-panel"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        ) : (
          <div className="empty-state">Buspack no devolvió detalle visual.</div>
        )}
      </div>
    </div>
  );
}