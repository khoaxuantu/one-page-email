import * as mDOM from "./lib/modifyDOM.js";

document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Load emails api
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    console.log(`Call ${mailbox}`)
    console.log(emails);
    const emails_view = document.getElementById('emails-view');
    emails.forEach(email => {
      const newEmail = new mDOM.Email(email);
      const newRow = newEmail.toRow();
      newRow.addEventListener("click", () => {
        load_single_mail(email.id, mailbox);
      });
      // If a mail has been read, change it to gray color
      if (email.read) {
        newRow.style.backgroundColor = "#d8dade";
      }
      emails_view.appendChild(newRow);
    })
  })
}


function load_single_mail(id, mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Clear out emails view
  document.querySelector('#emails-view').innerHTML = "";

  // Load single email api
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
    const email_view = document.getElementById('emails-view');
    email_view.append(mDOM.addDiv(`<b>From:</b> ${email.sender}`));
    email_view.append(mDOM.addDiv(`<b>To:</b> ${email.recipients}`));
    email_view.append(mDOM.addDiv(`<b>Subject:</b> ${email.subject}`));
    email_view.append(mDOM.addDiv(`<b>Timestamp:</b> ${email.timestamp}`));

    const newBtn = document.createElement("button");
    newBtn.className = "btn btn-sm btn-outline-primary";
    newBtn.innerHTML = "Reply";
    email_view.append(newBtn);
    email_view.append(document.createElement("hr"));
    email_view.append(mDOM.addDiv(`${email.body}`));
  })

  // Update the email to read
  if (mailbox === "inbox") {
    fetch(`/emails/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        read: true
      })
    })
  }
}