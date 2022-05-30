//fetch interceptor
const origFetch = window.fetch
fetch = async (...args) => {

    let fetchUrl = ''
    if ('url' in args[0]){
        //Object.defineProperty(args[0],'url', {writable: true, enumerable: true, configurable: true})
        fetchUrl = 'http://test.example.com/content/'+btoa(args[0]['url']+'?'+args[0]['method']);

    } else {
        fetchUrl = 'http://test.example.com/anonymize/'+btoa(args[0]);
    }

    //create new request since request object is immutable
    args = Object.assign(args);
    let [resource, config ] = args

    const request = new Request(fetchUrl, config);

    //intercept result if needed
    var result = await origFetch(request)

/*    //set a tags
    $("a").each(function() {
        if (this.href !== 'http://127.0.0.1:8000/' && !this.href.startsWith('http://')) {
            $(this).attr("href", 'http://localhost:8000/anonymize/'+(btoa(this.href)));
        }
    });*/

    return result;
}

//ajax interceptor
let oldXHROpen = window.XMLHttpRequest.prototype.open;
window.XMLHttpRequest.prototype.open = function(method, url, async, user, password) {

    var requestUrl = arguments[1].startsWith('http') ? arguments[1] :  $("base").attr("href").val()+arguments[1];
    let requestObject = {
        0: arguments[0],
        1: 'http://test.example.com/content/'+btoa(requestUrl+'?'+arguments[0]),
        2: arguments[2],
        3: arguments[3] ?? null,
        4: arguments[4] ?? null,
    };

    console.log(requestObject);
    this.addEventListener('load', function() {
        console.log('load: ' + this.responseText);
        // Hide loader
    });

    return oldXHROpen.apply(this, requestObject);
}
