import React, { useEffect, useRef } from 'react';
import * as Blockly from 'blockly/core';
import 'blockly/blocks';
import 'blockly/python';
import '../blocks/simpleBlock';
import '../blocks/simpleBlockGenerator';

const BlocklyComponent = () => {
    const blocklyDiv = useRef(null);
    const workspace = useRef(null);
    const toolbox = `<xml xmlns="http://www.w3.org/1999/xhtml" style="display: none"><block type="anemo_initC3"></block><!-- Outros blocos --></xml>`;

    useEffect(() => {
        workspace.current = Blockly.inject(blocklyDiv.current, {
            toolbox: toolbox,
            move: {
                scrollbars: true,
                drag: true,
                wheel: true
            },
            zoom: {
                controls: true,
                wheel: true,
                startScale: 1.0,
                maxScale: 3,
                minScale: 0.3,
                scaleSpeed: 1.2
            }
        });

        // Adicionando o bloco ao workspace
        addBlockToWorkspace('anemo_initC3', 120, 80);  // Chame esta função com o tipo do bloco e a posição inicial

        return () => {
            workspace.current.dispose();
        };
    }, []);

    // Função para adicionar um bloco ao workspace
    function addBlockToWorkspace(type, x, y) {
        const block = workspace.current.newBlock(type);
        block.initSvg();
        block.render();
        block.moveBy(x, y); 
    }

    return <div ref={blocklyDiv} style={{ height: '480px', width: '600px' }} />;
};

export default BlocklyComponent;
