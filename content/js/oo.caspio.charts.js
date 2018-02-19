(function(oo, $, undefined) {
    (function(chart) {
        // private parameters..
        var _charts = [],
            _jsonData = [];

        // private methods..
        var getData = function(tblObj) {
                var myRows = { myRows: [] },
                    myHeaders = tblObj.find("th");
                tblObj.find("tr").each(function(i, tr){
                    var obj = {},
                        myDataCells = myHeaders.find('td');
                    myHeaders.each(function(index, th){
                        obj[$(th).text()] = myDataCells.eq(index).text();
                    });
                    myRows.myRows.push(obj);
                });
                oo.log("oo.charts.getData: " + JSON.stringify(myRows));
            },
            getData2 = function(tblObj) {
                var tbl = tblObj.find("tr").get().map(function(row) {
                    return $(row).find('td').get().map(function(cell) {
                        return $(cell).html();
                    });
                });
                oo.log("oo.charts.getData2: " + JSON.stringify(tbl));
            },
            getData3 = function(tblObj) {
                oo.log("oo.charts.getData3: " + tblObj.tableToJSON());
            };

        // public methods..
        chart.init = function() {
            oo.chart.drawVSM();
        };

        chart.drawVSM = function() {
            $("iframe").each(function(){
                myTbl = $(this).contentWindow.document.find("table");
                getData(myTbl);
                getData2(myTbl);
                getData3(myTbl);

            });

        }


    }(oo.chart = oo.chart || {}));
}(window.oo = window.oo || {}, jQuery));
