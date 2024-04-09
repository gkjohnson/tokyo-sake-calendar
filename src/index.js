import { ICSGenerator } from './core/ICSGenerator.js';
import { TSCLoader } from './tsc/TSCLoader.js';

( async () => {

    const results = await new TSCLoader().load();
    console.log( await new ICSGenerator().generate( results ) );

} )();