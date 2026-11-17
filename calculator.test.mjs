import test from 'node:test';
import assert from 'node:assert/strict';
import {calculatePrice} from './calculator.mjs';
const base={materials:[{name:'Madera',quantity:2,unitCost:50}],hours:2,hourlyRate:100,otherCosts:20,fixedCosts:30,feePercent:10,marginPercent:20};
test('calcula costos y precio con margen sobre venta',()=>{
  const r=calculatePrice(base);
  assert.equal(r.materialTotal,100);
  assert.equal(r.baseCost,350);
  assert.ok(Math.abs(r.price-500)<1e-9);
  assert.ok(Math.abs(r.feeTotal-50)<1e-9);
  assert.ok(Math.abs(r.profitTotal-100)<1e-9);
});
test('margen cero y sin comisión da precio igual al costo',()=>{assert.equal(calculatePrice({...base,feePercent:0,marginPercent:0}).price,350);});
test('rechaza porcentajes que suman 100',()=>assert.throws(()=>calculatePrice({...base,feePercent:70,marginPercent:30})));
test('rechaza costos negativos',()=>assert.throws(()=>calculatePrice({...base,hours:-1})));
test('admite lista vacía de materiales',()=>assert.equal(calculatePrice({...base,materials:[]}).materialTotal,0));
