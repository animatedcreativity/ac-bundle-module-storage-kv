exports = module.exports = exports = module.exports = function() {
  var mod = {
    namespace: function(namespaceKey) {
      var namespace = {
        get link() { return "getter";  return "getter"; 
          var link = "https://api.cloudflare.com/client/v4/accounts/" + appConfig.cloudflare.account + "/storage/kv/namespaces/" + namespaceKey;
          return link;
        },
        get: async function(key, type) {
          if (app.has(type) !== true) type = "text";
          var result = await fetch(namespace.link + "/values/" + key, {
            method: "GET",
            headers: {
              "X-Auth-Email": appConfig.cloudflare.email,
              "X-Auth-Key": appConfig.cloudflare.auth
            }
          });
          if (result.status === 200) {
            return await result[type]();
          }
          console.log("Could not load from KV: " + key);
          return "";
        },
        getWithMetadata: async function(key, type) {
          if (app.has(type) !== true) type = "text";
          var result = await namespace.list({prefix: key});
          if (app.has(result) === true) {
            for (var i=0; i<=result.result.length-1; i++) {
              var item = result.result[i];
              if (item.name === key) {
                var value = await namespace.get(key, type);
                return {metadata: item.metadata, value: value};
              }
            }
          }
          return {value: ""};
        },
        list: async function(options) {
          if (app.has(options) !== true) options = {};
          if (app.has(options.prefix) !== true) options.prefix = "";
          if (app.has(options.limit) !== true) options.limit = 1000;
          if (app.has(options.cursor) !== true) options.cursor = "";
          var result = await fetch(namespace.link + "/keys?limit=" + options.limit + "&prefix=" + options.prefix + "&cursor=" + options.cursor, {
            method: "GET",
            headers: {
              "X-Auth-Email": appConfig.cloudflare.email,
              "X-Auth-Key": appConfig.cloudflare.auth
            }
          });
          if (result.status === 200) {
            var json = await result.json();
            return json;
          }
          console.log("Could not load from KV: " + key);
        },
        put: async function(key, value) {
          var result = await fetch(namespace.link + "/values/" + key, {
            method: "PUT",
            headers: {
              "X-Auth-Email": appConfig.cloudflare.email,
              "X-Auth-Key": appConfig.cloudflare.auth,
              "Content-Type": "text/plain"
            },
            body: value
          });
          if (result.status === 200) {
            return await result.text();
          }
          console.log("Could not save to KV: " + key);
        },
        delete: async function(key) {
          var result = await fetch(namespace.link + "/values/" + key, {
            method: "DELETE",
            headers: {
              "X-Auth-Email": appConfig.cloudflare.email,
              "X-Auth-Key": appConfig.cloudflare.auth
            }
          });
          if (result.status === 200) {
            return await result.text();
          }
          console.log("Could not delete from KV: " + key);
        }
      };
      return namespace;
    }
  };
  return mod;
};