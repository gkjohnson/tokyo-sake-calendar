import * as ics from 'ics';

function timeToArray( date ) {

    return [ date.getFullYear(), date.getMonth() + 1, date.getDate() ];

}

export class ICSGenerator {

    generate( events ) {

        const icsEvents = events.map( e => {

            return {

                title: e.subject,
                description: e.description,
                location: e.location,
                start: timeToArray( e.startTime ),

            };

        } );

        return new Promise( ( resolve, reject) => {
            
            ics.createEvents( icsEvents, ( err, value ) => {

                if ( err ) {

                    reject( err );

                } else {

                    resolve( value );

                }

            } );

        } );


    }

}