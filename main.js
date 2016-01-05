var inventory = {};
function addInventoryFileButton() {
  options = {
    success: function(files) {
      Papa.parse(files[0].link, {
        download: true,
        header: true,
        complete: function(results) {
          inventory = generateInventory(results.data);
        }
      });
    },
    cancel: function() {
    },
    linkType: "direct",
    multiselect: false,
    extensions: ['.csv']
  };
  var button = Dropbox.createChooseButton(options);
  document.getElementById("inventoryFileContainer").appendChild(button);
}
function addQuoteFileButton() {
  options = {
    success: function(files) {
      Papa.parse(files[0].link, {
        download: true,
        header: true,
        complete: function(results) {
          var dataSet = generateItemList(results.data);
          drawTable(dataSet);
        }
      });
    },
    cancel: function() {
    },
    linkType: "direct",
    multiselect: false,
    extensions: ['.csv']
  };
  var button = Dropbox.createChooseButton(options);
  document.getElementById("quoteFileContainer").appendChild(button);
}
function load() {
  var fileInput = document.getElementById("data");

  Papa.parse(fileInput.files[0], {
    header: true,
    complete: function(results) {
      var dataSet = generateItemList(results.data);
      drawTable(dataSet);
    }
  });
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
