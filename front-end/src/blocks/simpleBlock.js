import * as Blockly from 'blockly/core';

Blockly.Blocks['anemo_initC3'] = {
  init: function(){
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage("https://cdn-icons-png.flaticon.com/512/1113/1113753.png", 56, 50, "*"))
        .appendField("                       A");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};
Blockly.Blocks['lux_initC3'] = {
  init: function(){
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(
                     "https://media-gru1-2.cdn.whatsapp.net/v/t61.24694-24/127131794_670591546981871_2642319834620533616_n.jpg?ccb=11-4&oh=01_Q5AaIKwt8a3I_PPAnYxlalsYDvpTbWhvDVKtywKVf-3EIGXm&oe=6635195D&_nc_sid=e6ed6c&_nc_cat=107",
                     47,
                     50,
                     "*"))
        .appendField("                       B");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(255,0,0);
  }
};
Blockly.Blocks['Teste_Block'] = {
  init: function(){
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(
                     "https://static.vecteezy.com/system/resources/thumbnails/022/597/262/small/3d-like-love-social-media-png.png",
                     47,
                     50,
                     "*"))
        .appendField("                       C");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(100,0,0);
  }
};