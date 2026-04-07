# TrackeAR

Frontend y backend para consultar el seguimiento de envíos de distintas empresas desde una sola interfaz.

## Descripción

TrackeAR centraliza consultas de tracking en una interfaz simple, clara y responsive.  
Permite seleccionar una empresa, ingresar el número de seguimiento y visualizar el estado del envío y su historial cuando la empresa lo devuelve.

## Empresas soportadas

- Andreani
- OCA
- FAR
- Correo Argentino Track & Trace Nacional
- Paquetería e-commerce
- Buspack

## Stack

### Frontend
- Astro
- React
- CSS global propio
- Framer Motion

### Backend
- Node.js
- Express
- Axios
- Cheerio

## Características

- Interfaz unificada para múltiples empresas
- Diseño responsive
- Dark mode
- Historial local por empresa
- Skeleton loader
- Componentes de resultado adaptados por proveedor
- Sanitización del HTML de Buspack
- Backend con validación básica, rate limit y headers de seguridad

## Estructura general

### Frontend
```txt
frontend-trackear/
  public/
    global.css
    logos/
  src/
    components/
    data/
    layouts/
    pages/
    services/
