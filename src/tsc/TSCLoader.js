import { JSDOM } from 'jsdom';
import { CalendarEvent } from '../core/CalendarEvent.js'

function createDateString( date ) {

    const y = date.getFullYear();
    const m = date.getMonth().toString().padStart( 2, '0' );
    const d = date.getDay().toString().padStart( 2, '0' );
    return `${ y }-${ m }-${ d }`;

}

function parseStringToDate( str ) {

    const dateStrings = str.match( /(\d{4})[^\d]+(\d{1,2})[^\d]+(\d{1,2})/ );
    dateStrings.pop();

    const [ year, month, day ] = dateStrings.map( d => parseInt( d ) );
    return new Date( year, month, day );

}

function elementToEvent( el ) {
    
    const dateEl = el.querySelector( '.bl_media_date' );
    const titleEl = el.querySelector( '.bl_media_ttl' );
    const locationEl = el.querySelector( '.bl_media_area' );

    let [ startDate, endDate ] = dateEl.innerHTML.split( '〜' );
    endDate = endDate || startDate;

    const title = titleEl.innerText;
    const place = locationEl.innerHTML.replace( /[\n\r]+/g, ', ' );

    const res = new CalendarEvent();
    res.subject = title + ' Sake Event';
    res.startTime = parseStringToDate( startDate );
    res.endTime = parseStringToDate( endDate );
    res.allDay = true;

    res.description = `**Description**\nRuns from ${ startDate } to ${ endDate }'\n\n`;
    res.description += `**Address**\n${ place }\n\n`;
    res.location = place;

    return res;

}

export class TSCLoader {

    async load() {

        const monthTime = 31 * 24 * 60 * 60 * 1e3;
        const now = Date.now();
        const startDate = new Date( now - monthTime );
        const endDate = new Date( now + 2 * monthTime );

        const search_year = startDate.getFullYear().toString();
        const date_from = createDateString( startDate );
        const date_to = createDateString( endDate );

        console.log( search_year, date_from, date_to );

        return fetch( 'https://tokyo-sake-calendar.com/event', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `search_year=${ search_year }&date_from=${ date_from }&date_to=${ date_to }`
        } )
        .then( res => res.text() )
        .then( text => {

            const dom = new JSDOM( text );
            console.log( dom.window.document
                .querySelectorAll( '.bl_media_body' ).length )
            return [ ...dom.window.document
                .querySelectorAll( '.bl_media_body' ) ]
                .map( el => elementToEvent( el ) );

        } );

    }

}