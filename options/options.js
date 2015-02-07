

function populateServers(servers) {
  var select = window.$('#server');
  var options;
  if(select.prop) { options = select.prop('options'); }
  else { options = select.attr('options'); }
  window.$.each(servers, function(key, value) {
    options[options.length] = new Option(value, value);
  });
}

function fillServersList() {
  var dateLastUpdate = new Date(localStorage.serverLastUpdate);
  var checkingDate = new Date();
  checkingDate.setDate(checkingDate.getDate() - 1);

  if (dateLastUpdate >= checkingDate) {
    populateServers(JSON.parse(localStorage.servers));
    return;
  }
  window.$.ajax({
    url:'https://www.kimonolabs.com/api/7qv8xhz8?apikey=OSyC9dRS8dd380hhhRHmN1MYa2yfuzil&kimmodify=1',
    success: function (response) {
      var servers = [];
      window.$.each(response.results.servers, function(key, value) {
        servers[servers.length] = value;
      });
      localStorage.servers = JSON.stringify(servers);
      var dateUpdated = new Date();
      localStorage.serverLastUpdate = dateUpdated.toISOString();
      populateServers(servers);
    },
    error: function (xhr, status) {
      console.log('Error loading servers list: ' + status);
    }
  });
}

// Saves options to localStorage.
function saveOptions() {
  localStorage.server = window.$('#server').val();
  localStorage.email = window.$('#email').val();
  localStorage.password = window.$('#password').val();

  // Update status to let user know options were saved.
  window.$('#status').html('Options Saved.');
  setTimeout(function() {
    window.$('#status').html('');
  }, 1250);
}

// Restores select box state to saved value from localStorage.
function restoreOptions() {
  console.log('Restoring options...');

  fillServersList();

  window.$('#server').val(localStorage.server);
  window.$('#email').val(localStorage.email);
  window.$('#password').val(localStorage.password);
}

window.$(document).ready(restoreOptions);
window.$('#save').click(saveOptions);
