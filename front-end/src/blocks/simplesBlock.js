import * as Blockly from './blockly/core';

// Define o bloco
Blockly.Blocks['simple_addition'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("add")
        .appendField(new Blockly.FieldNumber(0), "NUM1")
        .appendField("to")
        .appendField(new Blockly.FieldNumber(0), "NUM2");
    this.setOutput(true, 'Number');
    this.setColour(160);
    this.setTooltip("Adds two numbers");
    this.setHelpUrl("");
  }
};
