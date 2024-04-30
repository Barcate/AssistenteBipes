import React, { useEffect, useRef } from 'react';
import * as Blockly from 'blockly/core';
import 'blockly/blocks';
import 'blockly/python';
import '../blocks/simpleBlock';
import '../blocks/simpleBlockGenerator';
import { useBlocklyData } from '../contexto/BlocklyDataContext';

const BlocklyComponent = () => {
    const blocklyDiv = useRef(null);
    const workspace = useRef(null);
    const toolbox = `<xml xmlns="http://www.w3.org/1999/xhtml" style="display: none">
                        <block type="anemo_initC3"></block>
                        <block type="lux_InitC3"></block>
                        <block type="Teste_Block"></block>
                        <!-- Outros blocos -->
                     </xml>`;
    const { blockResponse } = useBlocklyData();

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

        return () => {
            if (workspace.current) {
                workspace.current.dispose();
            }
        };
    }, []);

    useEffect(() => {
        console.log('Received blockResponse:', blockResponse); 
        if (blockResponse && workspace.current) {
            processBlockResponse(blockResponse);
        }
    }, [blockResponse]);

    function processBlockResponse(response) {
        const blockTypes = response.split(" ");
        let lastBlock = null;
        let yPosition = 80;  // Initial y position for blocks

        blockTypes.forEach(type => {
            if (Blockly.Blocks[type]) {
                // Forçar a criação de um novo bloco sem verificar o ID
                const block = workspace.current.newBlock(type);
                block.initSvg();
                block.render();

                if (lastBlock) {
                    // Try to connect this block to the previous one
                    let connection = lastBlock.nextConnection;
                    if (connection && block.previousConnection) {
                        try {
                            connection.connect(block.previousConnection);
                        } catch (e) {
                            console.error("Failed to connect blocks:", e);
                            block.moveBy(120, yPosition);
                            yPosition += 40;
                        }
                    }
                } else {
                    // Position the first block
                    block.moveBy(120, 80);
                }

                lastBlock = block;  
            } else {
                console.error("Block type not defined:", type);
            }
        });

        // Garantir que o workspace seja atualizado
        workspace.current.render();
    }

    return <div ref={blocklyDiv} style={{ height: '480px', width: '600px' }} />;
};

export default BlocklyComponent;
