import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import logos from '../data/logos.js';
import { getTrackingInfo } from '../services/api.js';
import ResultadoAndreani from './ResultadoAndreani.jsx';
import ResultadoEcommerce from './ResultadoEcommerce.jsx';
import ResultadoNacional from './ResultadoNacional.jsx';
import ResultadoBusPack from './ResultadoBusPack.jsx';
import ResultadoOca from './ResultadoOca.jsx';
import ResultadoFar from './ResultadosFar.jsx';

function normalizeEmpresa(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '')
    .replace(/_/g, '')
    .replace(/-/g, '');
}

function getEmpresaKey(nombre) {
  const normalized = normalizeEmpresa(nombre);

  if (normalized.includes('andreani')) return 'andreani';
  if (normalized.includes('buspack')) return 'buspack';
  if (normalized.includes('oca')) return 'oca';
  if (normalized.includes('ecommerce')) return 'ecommerce';
  if (normalized.includes('nacional') || normalized.includes('ttyt') || normalized.includes('tt')) return 'nacional';
  if (normalized.includes('far')) return 'far';

  return String(nombre || '').toLowerCase();
}

function getEmpresaLabel(nombre) {
  const key = getEmpresaKey(nombre);

  if (key === 'andreani') return 'Andreani';
  if (key === 'buspack') return 'Buspack';
  if (key === 'oca') return 'OCA';
  if (key === 'ecommerce') return 'Paquetería e-commerce';
  if (key === 'nacional') return 'Track & Trace Nacional';
  if (key === 'far') return 'FAR';

  return String(nombre || '');
}

const EMPRESA_FORM_CONFIG = {
  andreani: {
    trackingPlaceholder: 'Ej.: 360002873817871',
    trackingHelp: 'Ingresá el número de seguimiento tal como figura en la etiqueta o comprobante.'
  },
  oca: {
    trackingPlaceholder: 'Ej.: 8170700000000087556',
    trackingHelp: 'Para OCA necesitás completar el CUIT y el documento del cliente.',
    cuitPlaceholder: 'Ej.: 23330162439',
    documentoPlaceholder: 'Ej.: 33016243'
  },
  far: {
    trackingPlaceholder: 'Ej.: MLAR002408702EX',
    trackingHelp: 'Usá el código completo de seguimiento, incluyendo letras y números.'
  },
  nacional: {
    trackingPlaceholder: 'Ej.: CP123456789',
    trackingHelp: 'Las primeras dos letras son necesarias para realizar la consulta.'
  },
  ecommerce: {
    trackingPlaceholder: 'Ej.: 0000300400001E634212503',
    trackingHelp: 'Ingresá el número completo de paquetería e-commerce sin espacios.'
  },
  buspack: {
    trackingPlaceholder: 'Ej.: X-2005-0000035',
    trackingHelp: 'Ingresá el código con este formato: tipo de comprobante, punto de venta y número. Ejemplo: X-2005-0000035.'
  }
};

function getEmpresaFormConfig(empresaKey) {
  return (
    EMPRESA_FORM_CONFIG[empresaKey] || {
      trackingPlaceholder: 'Ej.: 123456789',
      trackingHelp: 'Ingresá el número de seguimiento para consultar el envío.'
    }
  );
}

function renderResultado(empresa, resultado) {
  const empresaKey = getEmpresaKey(empresa);

  if (empresaKey === 'andreani') return <ResultadoAndreani data={resultado} />;
  if (empresaKey === 'nacional') return <ResultadoNacional data={resultado} />;
  if (empresaKey === 'ecommerce') return <ResultadoEcommerce data={resultado} />;
  if (empresaKey === 'buspack') return <ResultadoBusPack data={resultado} />;
  if (empresaKey === 'oca') return <ResultadoOca data={resultado} />;
  if (empresaKey === 'far') return <ResultadoFar data={resultado} />;

  return (
    <div className="result-card">
      <div className="result-body">
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {JSON.stringify(resultado, null, 2)}
        </pre>
      </div>
    </div>
  );
}

function SkeletonResults() {
  return (
    <section className="section-card">
      <div className="section-header">
        <h2 className="section-title">Buscando información del envío</h2>
        <p className="section-description">Esto puede tardar unos segundos.</p>
      </div>

      <div className="skeleton-panel">
        <div className="skeleton-list">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="skeleton-card">
              <div className="skeleton-block skeleton-date" />
              <div>
                <div className="skeleton-block skeleton-line-lg" />
                <div className="skeleton-block skeleton-line-md" />
                <div className="skeleton-block skeleton-line-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [empresa, setEmpresa] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [cuit, setCuit] = useState('');
  const [nroDocumentoCliente, setNroDocumentoCliente] = useState('');
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');
  const [historial, setHistorial] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      const data = localStorage.getItem('historialTrackings');
      if (data) {
        setHistorial(JSON.parse(data));
      }
    } catch {
      setHistorial({});
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('historialTrackings', JSON.stringify(historial));
  }, [historial]);

  const empresaKey = useMemo(() => getEmpresaKey(empresa?.nombre || empresa), [empresa]);
  const empresaLabel = useMemo(() => getEmpresaLabel(empresa?.nombre || empresa), [empresa]);
  const empresaFormConfig = useMemo(() => getEmpresaFormConfig(empresaKey), [empresaKey]);

  const historialEmpresa = useMemo(() => {
    if (!empresaKey) return [];
    return historial[empresaKey] || [];
  }, [empresaKey, historial]);

  const handleDeleteHistoryItem = (currentEmpresaKey, value) => {
    setHistorial((prev) => {
      const lista = prev[currentEmpresaKey] || [];
      const nueva = lista.filter((item) => item !== value);

      return {
        ...prev,
        [currentEmpresaKey]: nueva
      };
    });
  };

  const handleConsulta = async (e) => {
    e.preventDefault();

    if (!empresaKey || !trackingNumber.trim()) {
      return;
    }

    if (empresaKey === 'oca' && (!cuit.trim() || !nroDocumentoCliente.trim())) {
      setError('Para OCA tenés que completar el CUIT y el documento del cliente.');
      setResultado(null);
      return;
    }

    setIsLoading(true);
    setError('');
    setResultado(null);

    try {
      const extraParams =
        empresaKey === 'oca'
          ? {
              cuit: cuit.trim(),
              nroDocumentoCliente: nroDocumentoCliente.trim()
            }
          : {};

      const data = await getTrackingInfo(
        empresaKey,
        trackingNumber.trim(),
        extraParams
      );

      setResultado(data);
      setHistorial((prev) => {
        const previous = prev[empresaKey] || [];
        const nuevaLista = Array.from(new Set([trackingNumber.trim(), ...previous])).slice(0, 5);

        return {
          ...prev,
          [empresaKey]: nuevaLista
        };
      });
    } catch {
      setError('No pudimos encontrar ese envío o hubo un problema al hacer la consulta.');
      setResultado(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeEmpresa = (item) => {
    setEmpresa(item);
    setTrackingNumber('');
    setCuit('');
    setNroDocumentoCliente('');
    setResultado(null);
    setError('');
  };

  const handleSelectHistory = (value) => {
    setTrackingNumber(value);
    setResultado(null);
    setError('');
  };

  return (
    <section className="home">
      <div className="container">
        <section className="hero">
          <div className="hero-card">
            <p className="hero-kicker">Seguimiento de envíos</p>
            <h1 className="hero-title">Consultá el estado de tus paquetes desde una sola plataforma.</h1>
            <p className="hero-text">
              Elegí la empresa, ingresá el número de seguimiento y revisá el estado del envío de forma clara y ordenada.
            </p>
          </div>
        </section>

        <section className="section-card">
          <div className="section-header">
            <h2 className="section-title">Empresas disponibles</h2>
            <p className="section-description">
              Seleccioná una empresa para consultar el estado de tu envío.
            </p>
          </div>

          <div className="logo-grid-wrap">
            <div className="logo-grid">
              {logos.map((item) => {
                const currentKey = getEmpresaKey(item.nombre);
                const isActive = currentKey === empresaKey;

                return (
                  <motion.button
                    key={item.nombre}
                    type="button"
                    className={`logo-card ${isActive ? 'is-active' : ''}`}
                    onClick={() => handleChangeEmpresa(item)}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.985 }}
                  >
                    <div className={`logo-media logo-media--${item.variant || 'default'}`}>
                      <img
                        src={item.src}
                        alt={item.nombre}
                        loading="lazy"
                        className={`logo-image logo-image--${getEmpresaKey(item.nombre)}`}
                      />
                    </div>
                    <p className="logo-name">{getEmpresaLabel(item.nombre)}</p>
                    <p className="logo-helper">{isActive ? 'Empresa seleccionada' : 'Disponible'}</p>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>

        {empresa && (
          <section className="section-card">
            <div className="section-header">
              <h2 className="section-title">Seguimiento en {empresaLabel}</h2>
              <p className="section-description">
                Completá los datos para consultar el envío.
              </p>
            </div>

            <div className="search-panel">
              <form onSubmit={handleConsulta}>
                <div className={`search-grid ${empresaKey === 'oca' ? 'search-grid--oca' : ''}`}>
                  <div className="field-group">
                    <label className="field-label" htmlFor="trackingNumber">
                      Número de seguimiento
                    </label>
                    <input
                      id="trackingNumber"
                      list="historial-trackings"
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="field-input"
                      placeholder={empresaFormConfig.trackingPlaceholder}
                      autoComplete="off"
                      required
                    />
                    <p className="field-help">{empresaFormConfig.trackingHelp}</p>
                    <datalist id="historial-trackings">
                      {historialEmpresa.map((item, index) => (
                        <option value={item} key={`${item}-${index}`} />
                      ))}
                    </datalist>
                  </div>

                  {empresaKey === 'oca' && (
                    <>
                      <div className="field-group">
                        <label className="field-label" htmlFor="cuit">
                          CUIT
                        </label>
                        <input
                          id="cuit"
                          type="text"
                          value={cuit}
                          onChange={(e) => setCuit(e.target.value)}
                          className="field-input"
                          placeholder={empresaFormConfig.cuitPlaceholder}
                          autoComplete="off"
                          required
                        />
                      </div>

                      <div className="field-group">
                        <label className="field-label" htmlFor="nroDocumentoCliente">
                          Documento del cliente
                        </label>
                        <input
                          id="nroDocumentoCliente"
                          type="text"
                          value={nroDocumentoCliente}
                          onChange={(e) => setNroDocumentoCliente(e.target.value)}
                          className="field-input"
                          placeholder={empresaFormConfig.documentoPlaceholder}
                          autoComplete="off"
                          required
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="search-actions">
                  <button
                    type="submit"
                    className="primary-button"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Consultando...' : `Consultar envío en ${empresaLabel}`}
                  </button>
                </div>
              </form>
            </div>

            {error && <div className="feedback feedback--error">{error}</div>}
          </section>
        )}

        {isLoading && <SkeletonResults />}

        {!isLoading && resultado && (
          <section className="section-card">
            <div className="result-shell">{renderResultado(empresa?.nombre || empresa, resultado)}</div>
          </section>
        )}

        {empresa && historialEmpresa.length > 0 && (
          <section className="section-card">
            <div className="history-panel">
              <h2 className="section-title">Consultas recientes</h2>
              <p className="section-description">
                Tocá un número para volver a usarlo.
              </p>

              <div className="history-list">
                {historialEmpresa.map((item, index) => (
                  <div key={`${item}-${index}`} className="history-chip-wrapper">
                    <button
                      type="button"
                      className="history-chip"
                      onClick={() => handleSelectHistory(item)}
                    >
                      {item}
                    </button>

                    <button
                      type="button"
                      className="history-chip-remove"
                      onClick={() => handleDeleteHistoryItem(empresaKey, item)}
                      aria-label={`Eliminar ${item} del historial`}
                      title="Eliminar del historial"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </section>
  );
}