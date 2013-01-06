var report = (function () {
    var report = {};
    var table = document.createElement('table');

    var cell = function (content) {
        var td = document.createElement('td');
        td.appendChild(document.createTextNode(content));
        return td;
    };

    var row = function (type, name, error) {
        var tr;
        tr = document.createElement('tr');
        tr.className = type;
        tr.appendChild(cell(type));
        tr.appendChild(cell(name));
        table.appendChild(tr);

        if (error) {
            tr = document.createElement('tr');
            tr.className = 'message ' + type;
            tr.appendChild(cell(''));
            tr.appendChild(cell(error.stack || error.stacktrace || error.message));
            table.appendChild(tr);
        }

        if (!table.parentNode || table.parentNode.nodeName === '#document-fragment') {
            document.body.appendChild(table);
        }
    };

    report.module = function (name) {
        var th = document.createElement('th');
        th.setAttribute('colspan', 2);
        th.appendChild(document.createTextNode(name));

        var tr = document.createElement('tr');
        tr.className = 'module';
        tr.appendChild(th);
        table.appendChild(tr);
    };

    report.ok = function (name) {
        row('ok', name);
    };

    report.fail = function (name, err) {
        row('fail', name, err);
    };

    report.error = function (name, err) {
        row('error', name, err);
    };

    return report;
}());
