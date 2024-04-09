import { ICSGenerator } from './core/ICSGenerator.js';
import { TSCLoader } from './tab/TSCLoader.js';

( async () => {

    const results = await new TSCLoader().load();
    console.log( await new ICSGenerator().generate( results ) );

} )();