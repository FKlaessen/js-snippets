//fetch interceptor
const origFetch = window.fetch
fetch = async (...args) => {
    let [resource, config] = args
    var apiHeaders = new Headers({});

    if (config === undefined) {
        config = args[0];
        resource = args[0].url
    }

    //set headers
    //if length < 1 object was received -> iterate
    if (Object.keys(config.headers).length < 1) {
        for (var head of config.headers.entries()) {
            apiHeaders[head[0]] = head[1];
        }
    } else {
        apiHeaders = config.headers;
    }

    if (config.method === 'POST') {
        apiHeaders['X-CSRF-TOKEN'] = token;
    }

    //serialize request options
    var serialized = {
        method: config.method,
        headers: apiHeaders,
        mode: config.mode,
        credentials: config.credentials,
        cache: config.cache,
        redirect: config.redirect,
        referrer: config.referrer,
        body: config.body
    };

    //add body to request if method is not get or head
    if (args.method !== 'GET' && args.method !== 'HEAD') {
        if (args.body !== undefined) {
            serialized.body = Object.assign(request.body, {
                _token: token
            })
        } else {
            serialized.body = {_token: token}
        }
    }

    //route to api
    resource = 'http://test.example.com:8000/sw/' + btoa(resource);

    var result = await origFetch(resource, serialized)

    return result;
}

//ajax interceptor
let oldXHROpen = window.XMLHttpRequest.prototype.open;
window.XMLHttpRequest.prototype.open = function(method, url, async, user, password) {

    var requestUrl = arguments[1].startsWith('http') ? arguments[1] :  $("base").attr("href").val()+arguments[1];
    url = 'http://test.example.com:8000/content/'+btoa(requestUrl);

    //apply arguments to original function
    oldXHROpen.apply(this, arguments);
}

//ajax send interceptor
let oldXHRSend = window.XMLHttpRequest.prototype.send;
window.XMLHttpRequest.prototype.send = function (body)
{

    //add csrf token to request
    body = Object.assign(body, {
        _token: token
    })
    body = JSON.stringify(body);

    oldXHRSend.apply(this, arguments);
}
