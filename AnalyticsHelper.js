var helper = {
    attach: function (str, value, separator, unique) {
        var m = 0;

        if (!str) str = '';
        if (unique) {
            var n, arr = this.split(str, separator);
            for (var i = 0; i < arr.length; i++) {
                n = arr[i];
                
                m = m || (unique == 1 ? (n == value) : (n.toLowerCase() == value.toLowerCase()));
            }
        }

        if (!m) str = str ? str + separator + value : value;

        return str;
    },
    cookie: function (name, value, opts) {
        if (typeof value === 'undefined') return this.getCookie(name);
        return this.setCookie(name, value, opts);
    },
    detach: function (str, value, separator) {
        return str.replace(new RegExp("\\" + separator + "?" + value, "gi"), "").replace(new RegExp("^" + "\\" + separator), "");
    },
    deleteCookie: function (key) {
        var cookie = key + "=";
        cookie += "; expires=Thu, 01-Jan-70 00:00:01 GMT";
        cookie += "; domain=" + this.getCookieDomain();
        cookie += "; path=" + '/';
        return (document.cookie = cookie);
    },
    escape: function (str) {
        try {
            return encodeURI(str);
        } catch (err) {
            return escape(str);
        }
    },
    getCookie: function (key) {
        key = ('; ' + key + '=');
        var cookie = ('; ' + document.cookie);
        var index = cookie.indexOf(key);
        var end;
        if (index === -1) return null;
        cookie = cookie.substring(index + key.length);
        end = cookie.indexOf(';');
        return this.unescape(end === -1 ? cookie : cookie.substring(0, end));
    },
    getCookieDomain: function () {
        if (this.getCookieDomain.result)
            return this.getCookieDomain.result;

        var split = location.hostname.split('.');
        var cname = 'teste_dominio_cookie';
        var domain = '';

        do {
            domain = '.' + split.pop() + domain;
            this.cookie(cname, 'ok', {
                domain: domain
            });

            if (this.cookie(cname) === 'ok') {
                this.cookie(cname, '', {
                    domain: domain,
                    exdays: -1
                });
                return (this.getCookieDomain.result = domain);
            }
        } while (split.length > 0);

        return undefined;
    },
    getParameterByName: function (name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
        var results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return this.unescape(results[2].replace(/\+/g, " "));
    },
    getPreviousValue: function (key, value) {
        var r = '';
        if (this.getCookie(key)) r = this.unescape(this.getCookie(key));
        if (value) this.setCookie(this.escape(key), value);
        else this.setCookie(this.escape(key), 'no value');
        return r;
    },
    getTimeParting: function (timezone, hemisphere, _tpDST) {
        var od = new Date('1/1/2000');
        if (od.getDay() !== 6 || od.getMonth() !== 0) {
            return 'Data Not Available';
        } else {
            var H, M, D, U, ds, de, tm;
            var da = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            var d = new Date();
            timezone = timezone ? timezone : 0;
            timezone = parseFloat(timezone);
            if (_tpDST) {
                var dso = _tpDST[d.getFullYear()].split(/,/);
                ds = new Date(dso[0] + "/" + d.getFullYear());
                de = new Date(dso[1] + '/' + d.getFullYear());
                if (hemisphere == "n" && d > ds && d < de) {
                    timezone = timezone + 1;
                } else if (hemisphere == "s" && (d > de || d < ds)) {
                    timezone = timezone + 1;
                }
            }
            d = d.getTime() + (d.getTimezoneOffset() * 60000);
            d = new Date(d + (3600000 * timezone));
            H = d.getHours();
            M = d.getMinutes();
            M = (M < 10) ? '0' + M : M;
            D = d.getDay();
            U = ' AM';
            if (H >= 12) {
                U = ' PM';
                H = H - 12;
            }
            if (H === 0) {
                H = 12;
            }
            D = da[D];
            tm = H + ':' + M + U;
            return (tm + '|' + D);
        }
    },
    sanitize: function (str, separator) {
        if (!str) return '';

        str = str.toLowerCase()
            .replace(/^\s+/, '')
            .replace(/\s+$/, '')
            .replace(/\s+/g, '_')
            .replace(/[áàâãåäæª]/g, 'a')
            .replace(/[éèêëЄ€]/g, 'e')
            .replace(/[íìîï]/g, 'i')
            .replace(/[óòôõöøº]/g, 'o')
            .replace(/[úùûü]/g, 'u')
            .replace(/[ç¢©]/g, 'c')
            .replace(/[^a-z0-9_\-]/g, '_');

        if (separator) {
            return str.replace(/_+/g, separator);
        } else {
            var split = str.split(/_+/g);

            for (var i = 0; i < split.length; i++)
                if (split[i]) split[i] = split[i][0].toUpperCase() + split[i].slice(1);

            return split.join('');
        }
    },
    setCookie: function (name, value, opts) {
        opts = typeof opts === 'number' ? {
            exdays: opts
        } : (opts || {});

        var cookie = name + "=" + this.escape(value);
        var exdate;

        if (opts.exdays) {
            exdate = new Date();
            exdate.setDate(exdate.getDate() + opts.exdays);
            cookie += "; expires=" + exdate.toUTCString();
        }

        cookie += "; domain=" + (opts.domain || this.getCookieDomain());

        cookie += "; path=" + (opts.path || '/');

        return (document.cookie = cookie);
    },
    split: function (str, separator) {
        var i, x = 0,
            a = [];
        while (str) {
            i = str.indexOf(separator);
            i = i > -1 ? i : str.length;
            a[x++] = str.substring(0, i);
            str = str.substring(i + separator.length);
        }
        return a;
    },
    unescape: function (str) {
        try {
            return decodeURI(str);
        } catch (err) {
            return unescape(str);
        }
    }
};