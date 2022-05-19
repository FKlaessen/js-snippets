//fetch api interceptor
const origFetch = window.fetch
fetch = async (...args) => {

    let fetchUrl = ''
    if ('url' in args[0]){
        //Object.defineProperty(args[0],'url', {writable: true, enumerable: true, configurable: true})
        fetchUrl = 'http://localhost:8000/content/'+btoa(args[0]['url']+'?'+args[0]['method']);

    } else {
        fetchUrl = 'http://localhost:8000/anonymize/'+btoa(args[0]);
    }

    //create new request since request object is immutable
    args = Object.assign(args);
    let [resource, config ] = args

    const request = new Request(fetchUrl, config);

    //intercept result if needed
    var result = await origFetch(request)

    //set a tags
    $("a").each(function() {
        if (this.href !== 'http://127.0.0.1:8000/' && !this.href.startsWith('http://')) {
            $(this).attr("href", 'http://localhost:8000/anonymize/'+(btoa(this.href)));
        }
    });

    return result;
}

//ajax interceptor
!function(){
    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {

        url = 'http://localhost:8000/content/'+btoa(url);

        open.apply(this, arguments);
    };
    //set a tags
    $("a").each(function() {
        if (this.href !== 'http://127.0.0.1:8000/' && !this.href.startsWith('http://')) {
            $(this).attr("href", 'http://localhost:8000/content/'+(btoa(this.href)));
        }
    });
}();
