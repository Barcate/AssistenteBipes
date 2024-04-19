import * as Blockly from 'blockly/core';

Blockly.Blocks['anemo_initC3'] = {
  init: function(){
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage("https://cdn-icons-png.flaticon.com/512/1113/1113753.png", 56, 50, "*"))
        .appendField("Iniciar Anenômetro");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};
