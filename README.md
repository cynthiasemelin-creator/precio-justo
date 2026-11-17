# Precio Justo — calculadora artesanal 🧮

Una **calculadora gratuita, abierta y sin registro** para personas que fabrican y venden productos artesanales. Ayuda a estimar cuánto cobrar considerando materiales, mano de obra, gastos, comisiones y un margen sobre el precio de venta.

## Funcionalidades

- Agregar y quitar materiales, con cantidades y costos unitarios.
- Incluir horas de trabajo, valor por hora, gastos variables y fijos por unidad.
- Calcular el efecto de comisiones y un margen de ganancia sobre el precio final.
- Elegir sigla de moneda (ARS, USD, EUR, etc.). No hace conversiones de divisas.
- Guardar hasta 30 cálculos **solo en este navegador** mediante `localStorage`.
- Descargar un CSV compatible con Excel y otras planillas.
- Sin servidores, registro, cookies analíticas ni envío de datos personales.

## Cómo usarla

**Opción 1: GitHub Pages.** En un repositorio público, abrí **Settings → Pages → Deploy from a branch → main / (root)**. Luego de publicar, GitHub mostrará la URL de tu app.

**Opción 2: local.** Por usar módulos de JavaScript, ejecutá un servidor local en la carpeta del proyecto (por ejemplo, `python -m http.server 8000`) y visitá `http://localhost:8000`.

## Fórmula

```
costo_total = materiales + horas × valor_hora + otros_costos + gastos_fijos_por_unidad
precio = costo_total / (1 - comisión/100 - margen/100)
ganancia = precio - (precio × comisión/100) - costo_total
```

El margen es un porcentaje del **precio de venta**, no un recargo sobre los costos. La suma de comisión y margen debe ser inferior al 100%. Los impuestos solo están incluidos si la persona usuaria los carga expresamente como costos.

## Pruebas

Con Node.js 18 o posterior:

```bash
node --test calculator.test.mjs
```

## Contribuir

Se agradecen correcciones de errores, mejoras de accesibilidad, traducciones y documentación. Abrí un *issue* para sugerir un cambio o enviá un *pull request*. Consultá [CONTRIBUTING.md](CONTRIBUTING.md).

## Privacidad y límites

Los datos permanecen en el navegador y pueden perderse al limpiar su almacenamiento. No hay respaldo en la nube. La herramienta es orientativa: no brinda asesoría impositiva, contable o financiera.

## Licencia

MIT. Consultá [LICENSE](LICENSE).
