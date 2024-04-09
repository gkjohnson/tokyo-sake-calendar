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
    dateStrings.shift();

    const [ year, month, day ] = dateStrings.map( d => parseInt( d ) );
    return new Date( year, month - 1, day );

}

function elementToEvent( el ) {
    
    const dateEl = el.querySelector( '.bl_media_date' );
    const titleEl = el.querySelector( '.bl_media_ttl' );
    const locationEl = el.querySelector( '.bl_media_area' );
    const anchor = el.querySelector( 'a' );

    let [ startDate, endDate ] = dateEl.innerHTML.split( '〜' ).map( s => s.trim() );
    endDate = endDate || startDate;

    const title = titleEl.innerHTML;
    const place = locationEl.innerHTML.replace( /[\n\r]+/g, ', ' );

    let description = '';
    if ( endDate === startDate ) {

        description = `On ${ startDate }`;

    } else {

        description = `Runs from ${ startDate } to ${ endDate }`;

    }

    const res = new CalendarEvent();
    res.subject = title + ' Sake Event';
    res.startTime = parseStringToDate( startDate );
    res.endTime = parseStringToDate( endDate );
    res.allDay = true;

    res.description = `**Description**\n${ description }\n\n`;
    res.description += `**Address**\n${ place }\n\n`;
    res.description += `**Link**\n${ anchor.href }`;
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
            return [ ...dom.window.document
                .querySelectorAll( '.bl_event_item' ) ]
                .map( el => elementToEvent( el ) );

        } );

    }

}