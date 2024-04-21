import { JSDOM } from 'jsdom';
import { CalendarEvent } from '../core/CalendarEvent.js'

function createDateString( date ) {

    const y = date.getFullYear();
    const m = ( date.getMonth() + 1 ).toString().padStart( 2, '0' );
    const d = '01';
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

    let [ startDate, endDate ] = dateEl.textContent.split( '〜' ).map( s => s.trim() );
    endDate = endDate || startDate;

    const title = titleEl.textContent;
    const place = locationEl.textContent.replace( /[\n\r]+/g, ', ' );

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
    res.description += `**Address**\n${ locationEl.textContent.replace( /[\n\r]+/g, '\n' ) }\n\n`;
    res.description += `**Link**\n${ anchor.href }`;
    res.location = place;

    return res;

}

export class TSCLoader {

    async load() {

        const now = new Date();
        const startDate = new Date();
        startDate.setMonth( now.getMonth() - 1 );
        const endDate = new Date();
        endDate.setMonth( now.getMonth() + 3 );

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