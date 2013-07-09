
/**
 * @file
 * @author  Bryan Hazelbaker <bryan.hazelbaker@gmail.com>
 * @version 0.8.3
 *
 * @copyright Copyright (c) 2013 Bryan Hazelbaker <bryan.hazelbaker@gmail.com>
 * Released under the MIT license. Read the entire license located in the
 * project root or at http://opensource.org/licenses/mit-license.php
 * 
 * @brief Instantiate the ae object and poll astro empires server for updates.
 *
 * @details Register callbacks on the ae object. These callbacks forward the
 * events to the popup.js which may display information based on the event.
 */

// Dont let the script run if the login information has not been provided.
if (!localStorage['server'] || !localStorage['email'] || !localStorage['password']) {
    throw "Extension not configured yet!";
}

var ae = new AstroEmpires.AE(localStorage['server'], localStorage['email'], localStorage['password']);

/**
 * Return a reference to the popup window object.
 *
 * @return object|bool
 *   The window object if it exists (open), false otherwise.
 */
function getPopup() {
    var popup = false,
        popups = chrome.extension.getViews({type: "popup"});
    if (popups.length > 0) {
        popup = popups[0];
    }
    return popup;
}

// Fetch information every 10 seconds.
jQuery('document').ready(function ($) {
    // Populate values from local storage.
    ae.getData();
    // Poll for updates.
    setInterval(function () {
        ae.getData();
        printValues(ae);
    }, 30000);
});

function printValues(ae) {
    if (popup = getPopup()) {
        popup.printValues(ae);
    }
}

/**
 * Send OS a notification when we received new guild messages.
 */
function printMessage(data, messageType, ae) {
    var msg = data.message.message;
    // Remove any blockquotes.
    msg = msg.replace(/<blockquote>.*<\/blockquote>/gi, '');
    // Remove all html codes.
    msg = msg.replace(/<(?:.|\n)*?>/gm, '');
    // Convert special characters.
    msg = msg.replace(/&#39;/, '\'');
    window.webkitNotifications.createNotification('images/ae-icon-48.png', 'Guild: ' + data.message.playerName, msg).show();
}
ae.msgs.guild.subscribe('msg_add_pre', printMessage);

/**
 * Updating the popup with what we are currently doing.
 */
function printStatus(data, messageType, ae) {
    if (popup = getPopup()) {
        popup.printStatus(data, messageType, ae);
    }
}
ae.subscribe('ajax', printStatus);
