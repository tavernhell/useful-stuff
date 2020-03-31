// Global variable
let listObj = {}
let trToShow = new Array();
let filtersArr = new Array();

// Add or remove tag from filtersArr
function addRemoveFiltersArr(btn) {
  // Get the value of the pressed button
  let tagName = btn.val();
  console.log(tagName);
  
  // Check if filtersArr contains the tag
  let i = filtersArr.indexOf(tagName);
  // Add tag if it's not already there
  if (i === -1) {
    filtersArr.push(tagName);
  }
  // Remove tag if it's already there (remove at i index, 1 time)
  else { 
    filtersArr.splice(i, 1);
  }
  populateTrToShow(filtersArr); // Calls containsAll and hideAllTr, and if needed displayFilteredTr
}

// Check if arr2 contains every element of arr1
function containsAll(arr1, arr2){
  return arr1.every(elem => arr2.includes(elem));
}

// Disable buttons that would produce an empty result
function disableButtons ()  {
  let filtersArrPlus = filtersArr;
  // For every not active button
  $('button:not(.selected)').each(function() {
    let count = 0;
    let btnVal = $(this).val();
    filtersArrPlus.push(btnVal);
    // For every key in listObj
    for (let key in listObj) {
      // Put tags (which is an array) in trObjectTagArray
      let trObjectTagArray = listObj[key].tags;
      // If the processed element's tag array contains every "filter" tag then increase count
      if (containsAll (filtersArrPlus, trObjectTagArray)) {
        count ++;
      }
    }
    if (count === 0) {
      $(this).prop('disabled', true);
    }
    else {
      $(this).prop('disabled', false);
    }
    // Remove the last element added
    filtersArrPlus.pop();
  });
}

// Display filtered Tr
function displayFilteredTr() {
  for (elem of trToShow) {
    elem.css('display','table-row');
  }
}

// EVENT LISTENER: button click inside event listener
function eventListener() {
  $('#tagContainer button').click(function() {
    // Toggle class of clicked button
    $(this).toggleClass('selected');
    addRemoveFiltersArr($(this)); // Calls populateLiToShow
    disableButtons(); // Check if any button needs to be disabled because it would produce no results if combined with current tags in filtersArr
  });
}

// Hide every tr of table's body
function hideAllTr () {
  $('#l4dTable tbody > tr').css('display','none');  
}

// Initialize DataTable
function initDataTable() {
  $('#l4dTable').DataTable(
    {
      // Make the table scrollable after the height is > 400px
      "scrollY": 400,
      
      // Make first column not orderable
      "columnDefs": [
              { "targets": 0, "orderable": false, "width": '1px' },
              
      ],
      // Make the second column (Name) the default one for ordering
      "order": [[ 1, "asc" ]],
      // Remove "show entries" and pagination info
      "paging": false,
      "bInfo" : false
    }
  );
}


// Make an object like: idx: {tags: [tag1, tag2], tr: trElem }
function populateListObj() {
  // For each tr in the table body
  $('#l4dTable tbody > tr').each( function(idx) {
    // Add its tag and the element itself to the object
    listObj[idx] = {
      tags : $(this).attr('data-tags').split(', '), 
      tr : $(this)
    };
  });
}

// Populate the array trToShow with tr elements based on user's chosen tags
function populateTrToShow() {
  // Clear existing elements
  trToShow = [];
  // For every key in listObj
  for (let key in listObj) {
    // Put tags (which is an array) in trObjectTagArray
    let trObjectTagArray = listObj[key].tags;
    // If the processed element's tag array contains every "filter" tag then add the element (the tr itself) to trToShow
    if (containsAll (filtersArr, trObjectTagArray)) {
      trToShow.push(listObj[key].tr)
    }
  }
  hideAllTr(); 
  displayFilteredTr(); // There will always be at least one displayed items thanks to disableButtons()
}

// Style the buttons by adding them classes
function styleButtons() {
  $('#tagContainer button').addClass('btn my-1 my-btn');
}

// Style the cards by adding them classes
function styleCards() {
  $('#tagContainer .card').addClass('bg-secondary h-100');
  $('#tagContainer .card-body').addClass('p-0');
  $('#tagContainer .card').css('border','none');
}


$(document).ready( function() {
  styleButtons();
  styleCards();
  populateListObj()
  eventListener();
  initDataTable();
})
