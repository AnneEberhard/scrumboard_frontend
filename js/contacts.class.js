//for main functions for contacts see contacts.js
//for rendering of the list see render_contact_list.js

/**
 * 
 * This class creates the Contact.
 * @constructor 
 * @param {string} - name - Name of Contact
 * @param {string} - phone - Phone of Contact
 * @param {string} - email - Email of Contact
 * @param {string} - acronym - Acronym of Contact
 *
 */

class Contact {
  user_name;
  phone;
  email;
  acronym;
  color;

  constructor(name, phone, email, acronym) {
    this.user_name = name;
    this.phone = phone;
    this.email = email;
    this.acronym = acronym;
    this.color = this.getRandomColor();
  }

/**
 * 
 * This function returns a random color for the Contact Profile Picture. 
 * @param {}  - no param
 */
  getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
