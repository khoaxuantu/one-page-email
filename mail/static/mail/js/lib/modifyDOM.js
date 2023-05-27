export function addDiv(content) {
    let newDiv = document.createElement("div");
    if (content !== undefined) {
        newDiv.innerHTML = content;
    }
    return newDiv;
}

export class Button
{
    constructor(content, type) {
        this.content = content;
        this.type = type;

        this.btn = document.createElement("button");
        this.btn.id = this.content;
        this.btn.innerHTML = this.content;
    }

    create() {
        let newBtn;
        switch (this.type) {
            case "Reply":
                newBtn = this.createReply();
                break;

            case "Archive":
                newBtn = this.createArchive();
                break;

            case "Unarchive":
                newBtn = this.createUnarchive();
                break;

            default:
                break;
        }

        return newBtn;
    }

    createReply() {
        this.btn.className = "btn btn-sm btn-outline-primary me-3";
        return this.btn;
    }
    createArchive() {
        this.btn.className = "btn btn-sm btn-primary me-3";
        return this.btn;
    }
    createUnarchive() {
        this.btn.className = "btn btn-sm btn-secondary me-3";
        return this.btn;
    }
}

export class Email
{
    constructor(data) {
        this.data = data;
    }

    addCol(info, className) {
        const newCol = addDiv(info);
        newCol.className = className;
        return newCol;
    }

    toRow() {
        const newRow = addDiv();
        newRow.className = "mail row border border-secondary m-0";
        
        newRow.appendChild(this.addCol(this.data.sender, "col-3 fw-bold"));
        newRow.appendChild(this.addCol(this.data.subject, "col-6"));
        newRow.appendChild(this.addCol(this.data.timestamp, "col-3"));

        return newRow;
    }
}
