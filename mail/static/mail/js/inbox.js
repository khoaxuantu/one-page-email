import * as mDOM from "./lib/modifyDOM.js";

document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', () => compose_email(false));

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email(isReply) {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  if (!isReply) {
    mDOM.clearCompositionFields();
  }
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
    // console.log(`Call ${mailbox}`)
    // console.log(emails);
    const emails_view = document.getElementById('emails-view');
    emails.forEach(email => {
      const newEmail = new mDOM.Email(email);
      const newRow = newEmail.toRow();
      newRow.addEventListener("click", () => {
        load_single_mail(email.id);
      });
      // If a mail has been read, change it to gray color
      if (email.read) {
        newRow.style.backgroundColor = "#d8dade";
      }
      emails_view.appendChild(newRow);
    })
  })
}


async function load_single_mail(id) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Clear out emails view
  document.querySelector('#emails-view').innerHTML = "";

  // Load single email api
  const fetchAPI = await fetch(`/emails/${id}`)
  const emailData = await fetchAPI.json();
  const email_view = new EmailView(emailData);
  email_view.render();
}

/**
 * Single email page builder
 * 
 * @param email the email data
 * @param view the dom HTMLElement of for email's content
 */
class EmailView
{
  constructor(email) {
    this.email = email;
    this.view = document.getElementById('emails-view');
  }

  render() {
    // Return the order of the page
    this.buildHeader();
    this.buildBtnRow();
    this.buildBody();
    this.updateRead();
  }

  buildHeader() {
    this.view.append(mDOM.addDiv(`<b>From:</b> ${this.email.sender}`)); // From: sender@sender.com
    this.view.append(mDOM.addDiv(`<b>To:</b> ${this.email.recipients}`)); // To: recipients@recipients.com
    this.view.append(mDOM.addDiv(`<b>Subject:</b> ${this.email.subject}`)); // Subject: Email's subject
    this.view.append(mDOM.addDiv(`<b>Timestamp:</b> ${this.email.timestamp}`)); // Timestamp: 
    // console.log(this.email)
  }
  
  buildBtnRow() {
    const buttonRow = mDOM.addDiv();
    buttonRow.className = "d-flex";
    
    const replyBtn = createReplyBtn(this.email);
    buttonRow.append(replyBtn);
    
    // Archive button depends on email's archived status and does not apply to Sent email
    if (!isSentEmail(this.email.sender)) {
      const archiveStatus = !this.email.archived ? "Archive" : "Unarchive";
      const archiveBtn = createArchiveBtn(archiveStatus, this.email);
      buttonRow.append(archiveBtn);
    }

    this.view.append(buttonRow);
  }

  buildBody() {
    this.view.append(document.createElement("hr"));
    this.view.append(mDOM.addDiv(`${this.email.body}`));
  }

  updateRead() {
    if (!this.email.read) {
      fetchRead(this.email.id);
    }
  }

}

function createReplyBtn(email) {
  const replyBtn = new mDOM.Button("Reply", "Reply").create();
  addReplyBtnHandler(replyBtn, email);
  return replyBtn;
}

function addReplyBtnHandler(button, email) {
  button.addEventListener("click", () => {
    compose_email(true);
    document.querySelector('#compose-recipients').value = email.sender;
    document.querySelector('#compose-subject').value = "Reply: " + email.subject;
  })
}

function isSentEmail(sender) {
  const user = document.querySelector("#user-email").textContent;
  return sender === user;
}

function createArchiveBtn(archiveStatus, email) {
  const archiveBtn = new mDOM.Button(archiveStatus, archiveStatus).create();
  addArchiveBtnHandler(archiveBtn, {
    id: email.id,
    archived: email.archived,
  });
  return archiveBtn;
}

function addArchiveBtnHandler(button, props) {
  button.addEventListener("click", () => {
    archiveHandler(props);
  })
}

async function archiveHandler(props) {
  await updateArchive(props);
  load_single_mail(props.id);
}

async function updateArchive(props) {
  await fetch(`/emails/${props.id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: !props.archived
    })
  })
}

// Update the email to read
async function fetchRead(id) {
  await fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: true
    })
  })
}