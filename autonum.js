function textNodesUnder(node) {
    var all = [];
    for (node = node.firstChild; node; node = node.nextSibling) {
        if (node.nodeType == 3) all.push(node);
        else all = all.concat(textNodesUnder(node));
    }
    return all;
}

document.addEventListener('DOMContentLoaded', function () {
    
    const openString = "%(";
    const closeString = "%)";

    let cats = new Map();
    let id_numbers = new Map();

    let mas = textNodesUnder(document.body);
    mas.forEach(e => {
        let doc = e.nodeValue;
        let open_index = 0;
        let close_index = 0;

        while (true) {


            open_index = doc.indexOf(openString, open_index);
            if (open_index == -1) break;

            close_index = doc.indexOf(closeString, open_index + openString.length)
            if (closeString == -1) break;

            let sub_str = doc.substring(open_index + openString.length, close_index);

            let parts = sub_str.split(':');
            if (parts.length != 3 || ((parts[0] == "n" || parts[0] == "l") == false) )
            {
                open_index += openString.length;
                continue;
            }
            if (parts[0] == "n") {
                let type = parts[0];
                let cat = parts[1];
                let id = parts[2];

                if (!cats.has(cat)) {
                    cats.set(cat, 0);
                }

                let new_number = cats.get(cat) + 1;
                cats.set(cat, new_number);
                id_numbers.set(openString + "l" + ":" + cat + ":" + id + closeString, new_number);
                id_numbers.set(openString + "n" + ":" + cat + ":" + id + closeString, new_number);
            }

            open_index = close_index + closeString.length;
        }
    });

    let _i = 0;
    mas.forEach(e => {

        let new_doc = e.nodeValue;

        id_numbers.forEach(function (value, key) {
            new_doc = new_doc.replace(key, value);
        });
        if (new_doc != e.nodeValue)
        {
            e.nodeValue = new_doc;
            _i++;
        }            
    });
    //alert(_i);
});

