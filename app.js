const form = document.querySelector('#calculator');
const materialsEl = document.querySelector('#materials');
const template = document.querySelector('#material-template');
const errorEl = document.querySelector('#error');
const savedEl = document.querySelector('#saved');
const STORAGE_KEY = 'precio-justo:v1';
let lastResult = null;

function addMaterial(name = '', quantity = 1, unitCost = 0) {
  const row = template.content.firstElementChild.cloneNode(true);
  row.querySelector('.material-name').value = name;
  row.querySelector('.material-quantity').value = quantity;
  row.querySelector('.material-cost').value = unitCost;
  row.querySelector('.remove').addEventListener('click', () => row.remove());
  materialsEl.appendChild(row);
}
function numeric(id) {
  const value = document.getElementById(id).value.trim();
  if (!value) throw new Error('Completá todos los campos numéricos.');
  const n = Number(value);
  if (!Number.isFinite(n)) throw new Error('Revisá los valores numéricos.');
  return n;
}
function readInput() {
  const materials = [...materialsEl.querySelectorAll('.material-row')].map(row => {
    const quantity = row.querySelector('.material-quantity').value;
    const unitCost = row.querySelector('.material-cost').value;
    if (!quantity || !unitCost) throw new Error('Completá la cantidad y el costo de cada material.');
    return { name: row.querySelector('.material-name').value.trim(), quantity: Number(quantity), unitCost: Number(unitCost) };
  });
  return {
    product: document.getElementById('product').value.trim() || 'Producto sin nombre',
    currency: document.getElementById('currency').value.trim().toUpperCase() || 'ARS',
    materials,
    hours: numeric('hours'), hourlyRate: numeric('hour-rate'), otherCosts: numeric('other-costs'),
    fixedCosts: numeric('fixed-costs'), feePercent: numeric('fee'), marginPercent: numeric('margin')
  };
}
function money(amount, currency) {
  const codes = {ARS:'ARS',USD:'USD',EUR:'EUR',MXN:'MXN',CLP:'CLP',COP:'COP',PEN:'PEN',UYU:'UYU',BRL:'BRL'};
  const code = codes[currency] || null;
  if (code) return new Intl.NumberFormat('es-AR', { style:'currency', currency:code, maximumFractionDigits:2 }).format(amount);
  return `${new Intl.NumberFormat('es-AR', { maximumFractionDigits:2 }).format(amount)} ${currency}`;
}
function showResult(input, result) {
  document.getElementById('price').textContent = money(result.price, input.currency);
  document.getElementById('explanation').textContent = `Precio mínimo orientativo para cubrir tus costos y obtener un margen del ${input.marginPercent}% después de la comisión del ${input.feePercent}%.`;
  const fields = {'material-total':'materialTotal','labor-total':'laborTotal','overheads':'overheads','base-cost':'baseCost','fee-total':'feeTotal','profit-total':'profitTotal'};
  for (const [id, key] of Object.entries(fields)) document.getElementById(id).textContent = money(result[key], input.currency);
}
function compute() {
  try {
    const input = readInput();
    const result = window.PrecioJusto.calculatePrice(input);
    errorEl.textContent = '';
    lastResult = {input, result};
    showResult(input, result);
    return lastResult;
  } catch (e) {
    errorEl.textContent = e.message;
    lastResult = null;
    document.getElementById('price').textContent = '—';
    return null;
  }
}
function readSaved() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(data) ? data.filter(x => x && x.input && x.result).slice(0, 30) : [];
  } catch { return []; }
}
function renderSaved() {
  savedEl.replaceChildren();
  const entries = readSaved();
  if (!entries.length) { const li = document.createElement('li'); li.className='muted'; li.textContent='Todavía no guardaste ninguno.'; savedEl.appendChild(li); return; }
  for (const entry of entries) {
    const li=document.createElement('li');
    const label=document.createElement('span');
    label.textContent=`${entry.input.product}: ${money(entry.result.price,entry.input.currency)}`;
    const remove=document.createElement('button'); remove.type='button'; remove.textContent='Eliminar';
    remove.addEventListener('click',()=>{ const updated=readSaved().filter(e=>e.id!==entry.id);localStorage.setItem(STORAGE_KEY,JSON.stringify(updated));renderSaved(); });
    li.append(label,remove); savedEl.appendChild(li);
  }
}
function saveCalculation() {
  const entry=compute(); if (!entry) return;
  try {
    const saved=readSaved();
    saved.unshift({id:crypto.randomUUID(), ...entry});
    localStorage.setItem(STORAGE_KEY,JSON.stringify(saved.slice(0,30)));
    renderSaved();
  } catch { errorEl.textContent='No se pudo guardar: el navegador bloquea el almacenamiento local.'; }
}
function csvCell(value) { return `"${String(value).replace(/"/g,'""')}"`; }
function downloadCsv() {
  const entry=compute(); if (!entry) return;
  const {input,result}=entry;
  const rows=[['Concepto','Valor'],['Producto',input.product],['Moneda',input.currency],['Materiales',result.materialTotal],['Mano de obra',result.laborTotal],['Otros + fijos',result.overheads],['Costo total',result.baseCost],['Comisión (%)',input.feePercent],['Margen (%)',input.marginPercent],['Comisión estimada',result.feeTotal],['Ganancia estimada',result.profitTotal],['Precio sugerido',result.price],[],['Material','Cantidad','Costo unitario'],...input.materials.map(m=>[m.name,m.quantity,m.unitCost])];
  const csv='\ufeff'+rows.map(row=>row.map(csvCell).join(',')).join('\r\n');
  const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
  const a=document.createElement('a');a.href=url;a.download='precio-justo-calculo.csv';document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
}
form.addEventListener('submit',e=>{e.preventDefault();compute();});
document.getElementById('add-material').addEventListener('click',()=>addMaterial());
document.getElementById('save').addEventListener('click',saveCalculation);
document.getElementById('download').addEventListener('click',downloadCsv);
addMaterial();renderSaved();
