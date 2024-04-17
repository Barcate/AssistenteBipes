import * as Blockly from './blockly/core';

Blockly.JavaScript['simple_addition'] = function(block) {
  var number_num1 = block.getFieldValue('NUM1');
  var number_num2 = block.getFieldValue('NUM2');
  // O código gerado será a soma dos dois números
  var code = `${number_num1} + ${number_num2}`;
  // TODO: Mudar o pedido conforme necessário
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
