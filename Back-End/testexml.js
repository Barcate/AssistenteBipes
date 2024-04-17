import fs from "fs";
import xmlbuilder from "xmlbuilder";
function createCustomXML() {
    const xml = xmlbuilder.create('xml', { version: '1.0', encoding: 'UTF-8', standalone: true })
      .att('xmlns', 'https://bipes.net.br')
      .ele('workspace')
        .ele('field', { 'name': 'DEVICE' }, 'ESP32C3basic').up()
        .ele('field', { 'name': 'TIMESTAMP' }, '1712939555052').up()
        .ele('freeboard')
          .dat('')
        .up()
        .ele('databoard')
          .dat('')
        .up()
      .up() // Fecha tag <workspace>
      .ele('block', { 'type': 'project_metadata', 'id': '!nhVF}1T~ZHMWrJ.9{9g', 'deletable': 'false', 'x': '-212', 'y': '-612' })
        .ele('value', { 'name': 'project_author' })
          .ele('shadow', { 'type': 'text', 'id': '[LN5k5(s{lmLEuf!`yI:' })
            .ele('field', { 'name': 'TEXT' }, 'Name').up()
          .up() // Fecha tag <shadow>
        .up() // Fecha tag <value>
        .ele('value', { 'name': 'project_iot_id' })
          .ele('shadow', { 'type': 'math_number', 'id': 'v3lIBo4gE}JT;Q@OqRGN' })
            .ele('field', { 'name': 'NUM' }, '0').up()
          .up() // Fecha tag <shadow>
        .up() // Fecha tag <value>
        .ele('value', { 'name': 'project_description' })
          .ele('shadow', { 'type': 'text', 'id': 'Bn,+{dYCsxlXPX)RFE/5' })
            .ele('field', { 'name': 'TEXT' }, 'Meu projeto').up()
          .up() // Fecha tag <shadow>
        .up() // Fecha tag <value>
      .up() // Fecha tag <block>
      .ele()
      .ele('block', { 'type': 'inicio', 'id': 'inicio', 'deletable': 'false', 'x': '-212', 'y': '-450' }).up()
      .ele('block', { 'type': 'inicio', 'id': 'inicio', 'deletable': 'false', 'x': '-212', 'y': '-450' })
        .ele('next')
          .ele('block', { 'type': 'fim', 'id': 'fim', 'deletable': 'false' })
        .up()
      .up()
    .up() // Fecha tag <block>
    .end({ pretty: true});
  
    // Escrever o XML em um arquivo
    fs.writeFile('customXML.xml', xml, (err) => {
      if (err) {
        console.error('Erro ao escrever o arquivo XML:', err);
      } else {
        console.log('Arquivo XML criado com sucesso!');
      }
    });
  }
  
  // Chamar a função para criar o XML
  createCustomXML();