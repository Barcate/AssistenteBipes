import React, { useEffect, useRef } from 'react';
import * as Blockly from 'blockly/core';
import 'blockly/blocks';
import './blocks/simplesBlock';
import './blocks/simplesBlockGenerator';

const BlocklyComponent = () => {
    const blocklyDiv = useRef(null);
    const workspace = useRef(null);
    const toolbox = `<xml xmlns="http://www.w3.org/1999/xhtml" style="display: none"><block type="simple_addition"></block><!-- Outros blocos --></xml>`;

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
            workspace.current.dispose();
        };
    }, []);

    return <div ref={blocklyDiv} style={{ height: '480px', width: '600px' }} />;
};

export default BlocklyComponent;
