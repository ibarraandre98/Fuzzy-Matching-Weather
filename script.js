console.log('http://ws1.metcheck.com/ENGINE/v9_0/json.asp?lat=22.7&lon=-99&lid=26460&Fc=No');
// Sore the titles in here
index = [];

function fuzzy_match(text, search) {
    /*
    Text is a title, search is the user's search
    */
    // remove spaces, lower case the search so the search is case insensitive
    var search = search.replace(/\ /g, '').toLowerCase();
    var tokens = [];
    var search_position = 0;

    // Go through each character in the text
    for (var n = 0; n < text.length; n++) {
        var text_char = text[n];
        // if we watch a character in the search, highlight it
        if (search_position < search.length && text_char.toLowerCase() == search[search_position]) {
            text_char = '<b>' + text_char + '</b>';
            search_position += 1;
        }
        tokens.push(text_char);
    }
    // If are characters remaining in the search text, return an empty string to indicate no match
    if (search_position != search.length) {
        return '';
    }
    return tokens.join('');
}

function refresh_search() {
    var search = $('input[name=search]').val();
    var results = [];

    /*
        Create an array of <li> tags containing matched titles
    */
    $.each(index, function(i, title) {
        var result = fuzzy_match(title, search)
        if (result) {
            results.push("<li>" + result + "</li>")
        }
    });

    var results_html = results.join('\n');
    $("ul.results").html(results_html);
}

$(function() {

    $('input[name=search]').keyup(function() {
        /*
        Refresh the search on every keypress in the search input
        */
        refresh_search();
    });

    /*
        Get a list of titles from Reddit's REST interface
    */
    $.getJSON(
        'clima.txt',
        function(result) {
            console.log(result.metcheckData.forecastLocation.forecast);
            index = [];
            result.metcheckData.forecastLocation.forecast.forEach(element => {
                $.each(element, function(i, link) {
                    index.push(link);
                });
                refresh_search();
            });

        });

});