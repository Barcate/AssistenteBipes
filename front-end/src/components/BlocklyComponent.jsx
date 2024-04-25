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

        blockTypes.forEach(type => {
            if (Blockly.Blocks[type]) {
                const block = workspace.current.newBlock(type);
                block.initSvg();
                block.render();

                if (lastBlock) {
                    
                    if (lastBlock.nextConnection && block.previousConnection) {
                        try {
                            lastBlock.nextConnection.connect(block.previousConnection);
                        } catch (e) {
                            console.error("Failed to connect blocks:", e);
                        }
                    }
                } else {
                    
                    block.moveBy(120, 80);
                }

                lastBlock = block;  
            } else {
                console.error("Block type not defined:", type);
            }
        });
    }

    return <div ref={blocklyDiv} style={{ height: '480px', width: '600px' }} />;
};

export default BlocklyComponent;
