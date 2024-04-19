import * as Blockly from 'blockly/core';
import 'blockly/python';
if (typeof Blockly.Python !== 'undefined') {

  Blockly.Python['anemo_initC3'] = function(block) {
    Blockly.Python.definitions_["import_time"] = "import time";
    Blockly.Python.definitions_["import_sleep"] = "from time import sleep";
    Blockly.Python.definitions_["import_urequests"] = "import urequests";
    Blockly.Python.definitions_["import_machine"] = "import machine, ntptime, utime";
    Blockly.Python.definitions_["import_softi2c_pin"] = "from machine import Pin, SoftI2C, deepsleep, SPI";

    // Substitua ${esp32c3scl} e ${esp32c3sda} com os valores de pinos reais se necessário
    const esp32c3scl = 22; // Exemplo: SCL pin number
    const esp32c3sda = 21; // Exemplo: SDA pin number

    Blockly.Python.definitions_["import_i2c_pin_init_A"] = `i2cA=SoftI2C(scl=Pin(${esp32c3scl}), sda=Pin(${esp32c3sda}), freq=8000)`;
    Blockly.Python.definitions_["reflexao_init_A"] = 'print("I2C Scan:", i2cA.scan())';
    Blockly.Python.definitions_["gc_enable"] = "gc.enable()";

    var code = 
      `try:\n` +
      `  raw_velocidade = i2cA.readfrom(34, 1)\n` +
      `  velocidade = (ord(raw_velocidade)/10)\n` +
      `  print("Velocidade vento: " + str(velocidade) + "m/s")\n` +
      `  if(not offline):\n` +
      `    try:\n` +
      `      url="http://pete-dev.ddns.net/easymqtt/publish.php?session={}".format(easymqtt_session) + "&topic=Vento&value={}".format(velocidade)\n` +
      `      ures=urequests.get(url)\n` +
      `      ures.close()\n` +
      `      gc.collect()\n` +
      `      wdt.feed()\n` +
      `    except:\n` +
      `      print("Erro: Problema com a internet ou falta um bloco de sessão")\n` +
      `except:\n` +
      `  print("Anemômetro não identificado")\n`;

    return code;
  };
} else {
  console.error('Blockly.Python is not defined!');
}
