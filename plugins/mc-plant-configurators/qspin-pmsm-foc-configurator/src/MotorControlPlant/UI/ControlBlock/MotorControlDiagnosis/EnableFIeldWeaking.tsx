import { useEffect, useState } from 'react';
import { DialogCommonInitilizeCode } from '../../CustomPopUp/CustomPopUp';
import {
  InputNumberDefault,
  useBooleanSymbol,
  useFloatSymbol
} from '@mplab_harmony/harmony-plugin-client-lib';
import MultipleUIComponentsWithLabel from '../../../Tools/MultipleUIComponentsWithLabel';

let fieldWeakeningSymbols = [
  'MCPMSMFOC_ENABLE_FW',
  'MCPMSMFOC_FW_MAX_NEGATIVE_ID',
  'MCPMSMFOC_FW_TUNING_PARAMETER',
  'MCPMSMFOC_ENABLE_MTPA',
  'MCPMSMFOC_MTPA_TUNING_PARAMETER'
];
const EnableFIeldWeaking = (props: { componentId: string; showToast: (arg0: any) => void }) => {
  const boole = useBooleanSymbol({
    componentId: props.componentId,
    symbolId: 'MCPMSMFOC_ENABLE_FW'
  });

  DialogCommonInitilizeCode(props.showToast, props.componentId, fieldWeakeningSymbols);
  return (
    <div>
      <div>
        <span style={{ fontWeight: 'bold' }}>Field Weakening And MTPA </span> <br></br>
        <br></br>
        <MultipleUIComponentsWithLabel
          componentId={props.componentId}
          symbolsArray={fieldWeakeningSymbols}
        />
      </div>
    </div>
  );
};
export default EnableFIeldWeaking;