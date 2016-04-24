var inventoryFile = 'Inventory_24-04-2016.csv';
function readInventory(itemResults) {
  jQuery.ajax({
    type: "GET",
    url: inventoryFile,
    success: function(text) {
      Papa.parse(text, {
        header: true,
        complete: function(results) {
          jQuery('#inventoryFile').text(inventoryFile.substr(inventoryFile.lastIndexOf("/") + 1));
          inventory = generateInventory(results.data);
          drawTable(generateItemList(itemResults, inventory));
        }
      });
    },
    error: function() {
      // An error occurred
    }
  });
}

function readItemList(itemListFile) {
  Papa.parse(itemListFile, {
    download: true,
    header: true,
    complete: function(results) {
      jQuery('#quoteFile').text(decodeURIComponent(
        itemListFile.substr(itemListFile.lastIndexOf("/") + 1)));
      readInventory(results.data);
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

function generateItemList(data, inventory) {
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
  var allItems = $("#allItems");
  allItems.empty();
  jQuery.each(data, function(category, items) {
    var categoryTable = $('<table/>', {id: category + 'Table', class: 'categoryTable'});
    categoryTable.append($('<caption/>').html(category));
    var headerRow = $('<tr/>', {id: 'headerRow'});
    headerRow.append($('<th/>').html('Id'));
    headerRow.append($('<th/>').html('Name'));
    headerRow.append($('<th/>').html('Quantity'));
    headerRow.append($('<th/>').html('Loaded'));
    categoryTable.append(headerRow);

    jQuery.each(items, function(key, item) {
      var row = $('<tr/>', {id: 'row' + item.id, class: 'unloadedItem'});
      row.append($('<td/>').html(item.id));
      row.append($('<td/>').html(item.name));
      row.append($('<td/>').html(item.quantity));
      var itemLoadedCheck = $('<input />',
        {type: 'checkbox', id: 'loaded' + item.id}).change(function() {
                                                             document.getElementById('row'
                                                                                     + item.id).className =
                                                               !this.checked ? 'unloadedItem'
                                                                 : 'loadedItem';
                                                           });
      row.append($("<td/>").append(itemLoadedCheck));
      categoryTable.append(row);
    });
    allItems.append(categoryTable);
  });
}
