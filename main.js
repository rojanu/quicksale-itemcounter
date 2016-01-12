var inventoryFile = 'Inventory_03-01-2016.csv';
var inventory = {};
function readInventory(itemListFile, itemResults, callback) {
  jQuery.ajax({
    type:    "GET",
    url:     inventoryFile,
    success: function(text) {
      Papa.parse(text, {
        header: true,
        complete: function(results) {
          jQuery('#inventoryFile').text(inventoryFile);
          inventory = generateInventory(results.data);
          callback(itemListFile, itemResults);
        }
      });
    },
    error:   function() {
      // An error occurred
    }
  });
}

function invokeItemList(itemListFile, results) {
  jQuery('#quoteFile').text(itemListFile);
  var dataSet = generateItemList(results.data);
  drawTable(dataSet);
}
function readItemList(itemListFile) {
  Papa.parse(itemListFile, {
    download: true,
    header: true,
    complete: function(results) {
      readInventory(itemListFile, results, invokeItemList);
    }
  });
}
function addQuoteFileButton() {
  options = {
    success: function(files) {
      readItemList(files[0].link);
    },
    cancel: function() {
    },
    linkType: "direct",
    multiselect: false,
    extensions: ['.csv']
  };
  var button = Dropbox.createChooseButton(options);
  document.getElementById("quoteFileButton").appendChild(button);
}

function generateInventory(data) {
  var inventory = {};

  for (var i = 0; i < data.length; i++) {
    var item = data[i];
    inventory[item.Id] = {};
    inventory[item.Id] = item.Categories;
  }

  return inventory;
}

function generateItemList(data) {
  var itemList = {};
  for (var i = 0; i < data.length; i++) {
    var item = data[i];
    var quantity = parseInt(item.Qty);
    var id = item["Item ID"];

    if (!(inventory[id] in itemList)) {
      itemList[inventory[id]] = {};
    }

    if (itemList[inventory[id]][id]) {
      itemList[inventory[id]][id].quantity += quantity;
    } else {
      itemList[inventory[id]][id] = {};
      itemList[inventory[id]][id].id = id;
      itemList[inventory[id]][id].quantity = quantity;
      itemList[inventory[id]][id].name = item["Item Name"];
    }
  }
  return itemList;
}

function drawTable(data) {
  var itemTable = $("#itemTable").find('tbody');
  itemTable.find("tr").remove();
  jQuery.each(data, function(category, items) {
    jQuery.each(items, function(key, item) {
      var row = $('<tr/>', {id: 'row' + item.id, class: 'unloadedItem'});
      row.append($('<td/>').html(category));
      row.append($('<td/>').html(item.id));
      row.append($('<td/>').html(item.name));
      row.append($('<td/>').html(item.quantity));
      var itemLoadedCheck = $('<input />', {type: 'checkbox', id: 'loaded' + item.id}).change(function() {
        document.getElementById('row' + item.id).className = !this.checked ? 'unloadedItem' : 'loadedItem';
      });
      row.append($("<td/>").append(itemLoadedCheck));
      itemTable.append(row);
    });
  });
}
