
const HEADER = [
    'Subject',

    'Start Date',
    // 'Start Time',
    'End Date',
    // 'End Time',

    'All day event',
    'Description',
    'Location',
];

function safeString( s ) {

    s = s.replace( /,/g, '\\,' ).replace( /"/g, '\'' );
    return `"${ s }"`;

}

function dateToDay( d ) {

    return `${ d.getMonth() + 1 }/${ d.getDate() }/${ d.getFullYear() }`;

}

function dateToTime( d ) {

    const hr = d.getHours();
    const ampm = hr >= 12 ? 'pm' : 'am';
    return `${ hr % 12 }:${ d.getMinutes() }:00 ${ ampm }`;

}

function eventToRow( e ) {

    const { subject, description, location, allDay, startTime, endTime } = e;
    const data = [
        safeString( subject ),

        dateToDay( startTime ),
        // dateToTime( startTime ),
        dateToDay( endTime ),
        // dateToTime( endTime ),

        allDay.toString(),
        safeString( description ),
        safeString( location ),
    ];

    return data.join( ',' );

}


export class CSVGenerator {

    generate( events ) {

        const sorted = [ ...events ].sort( ( a, b ) => {

            return a.startTime.getTime() < b.startTime.getTime();

        } );

        const lines = [
            HEADER.join( ',' ),
            ...sorted.map( e => eventToRow( e ) ),
        ];

        return lines.join( '\n' );

    }

}