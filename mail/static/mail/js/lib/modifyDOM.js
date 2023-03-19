export function addDiv(content) {
    let newDiv = document.createElement("div");
    if (content !== undefined) {
        newDiv.innerHTML = content;
    }
    return newDiv;
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
        newRow.className = "row border border-secondary m-0";
        
        newRow.appendChild(this.addCol(this.data.sender, "col-3 fw-bold"));
        newRow.appendChild(this.addCol(this.data.subject, "col-6"));
        newRow.appendChild(this.addCol(this.data.timestamp, "col-3"));

        return newRow;
    }
}
