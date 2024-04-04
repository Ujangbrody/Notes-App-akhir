// Variabel untuk menyimpan id catatan yang dipilih
let selectedNoteId;

// Definisi kelas NoteElement
class NoteElement extends HTMLElement {
    constructor() {
        super();
        this.addEventListener('click', (event) => {
            const target = event.target;
            if (target.classList.contains('archive-btn')) {
                this.archiveNote();
            } else if (target.classList.contains('unarchive-btn')) {
                this.unarchiveNote();
            }
        });
    }

    // Metode untuk membuka popup edit
    openEditPopup() {
        console.log('Edit popup opened');
    }

    // Metode yang dipanggil ketika elemen terhubung
    connectedCallback() {
        const { id, title, body } = this.dataset;
        this.innerHTML = `
          <div class="note" data-id="${id}">
            <h2>${title}</h2>
            <p>${body}</p>
            <div class="note-actions">
              <button onclick="removeNote('${id}')">delete</button>
              <button class="archive-btn">Archive Note</button>
              <button class="unarchive-btn">Unarchive Note</button>
            </div>
          </div>
        `;
    }

    // Metode untuk mengarsipkan catatan
    async archiveNote() {
        const id = this.dataset.id;
        try {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Auth-Token': '12345',
                },
                body: JSON.stringify({ archived: true }),
            };

            const response = await fetch(`${baseUrl}/notes/${id}/archive`, options);
            const responseJson = await response.json();
            showResponseMessage(responseJson.message);
            getNote();
        } catch (error) {
            showResponseMessage(error);
        }
    }

    // Metode untuk membatalkan pengarsipan catatan
    async unarchiveNote() {
        const id = this.dataset.id;
        try {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Auth-Token': '12345',
                },
                body: JSON.stringify({ archived: false }),
            };

            const response = await fetch(`${baseUrl}/notes/${id}/unarchive`, options);
            const responseJson = await response.json();
            showResponseMessage(responseJson.message);
            getNote();
        } catch (error) {
            showResponseMessage(error);
        }
    }
}
customElements.define("note-element", NoteElement);

// Definisi kelas AppBar
class AppBar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <header style="background-color: #247ba0; color: #fff; padding: 10px; display: flex; align-items: center; border-radius: 20px; border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;">
                <h1 style="margin: 0;">My Notes</h1>
            </header>
        `;
    }
}
customElements.define("app-bar", AppBar);

// Definisi kelas NoteInput
class NoteInput extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="note">
                <textarea id="noteSubject" name="story" rows="2" cols="33" placeholder="Judul"></textarea>
                <textarea id="noteContent" name="story" rows="10" cols="50" placeholder="Isi Note"></textarea>
                <button id="submitNote">Submit</button>
                <select id="archiveOptions">
                    <option value="archive">Archive</option>
                    <option value="non-archive">Non Archive</option>
                </select>
            </div>
        `;

        const submitButton = this.querySelector('#submitNote');
        submitButton.addEventListener('click', () => {
            const noteSubjectInput = this.querySelector('#noteSubject');
            const noteContentInput = this.querySelector('#noteContent');
            insertNote(noteSubjectInput.value, noteContentInput.value);
        });
    }
}
customElements.define("note-input", NoteInput);

// Fungsi untuk menampilkan pesan respons
const showResponseMessage = (message = 'Check your internet connection') => {
    alert(message);
};

// Base URL untuk API catatan
const baseUrl = 'https://notes-api.dicoding.dev/v2';

// Fungsi untuk mendapatkan catatan dari server
const getNote = async () => {
    try {
        const response = await fetch(`${baseUrl}/notes`);
        const responseJson = await response.json();
        if (responseJson.error) {
            showResponseMessage(responseJson.message);
        } else {
            renderNotes(responseJson.data);
        }
    } catch (error) {
        showResponseMessage(error);
    }
};

// Fungsi untuk mendapatkan catatan non-archived dari server
const getNoteNonArchive = async () => {
    try {
        const response = await fetch(`${baseUrl}/notes`);
        const responseJson = await response.json();
        if (responseJson.error) {
            showResponseMessage(responseJson.message);
        } else {
            // Filter catatan yang belum diarsipkan
            const nonArchivedNotes = responseJson.data.filter(note => !note.archived);
            renderNonArchivedNotes(nonArchivedNotes);
        }
    } catch (error) {
        showResponseMessage(error);
    }
};

// Fungsi untuk mendapatkan catatan archived dari server
const getNoteArchive = async () => {
    try {
        const response = await fetch(`${baseUrl}/notes/archived`);
        const responseJson = await response.json();
        if (responseJson.error) {
            showResponseMessage(responseJson.message);
        } else {
            // Filter catatan yang sudah diarsipkan
            const archivedNotes = responseJson.data.filter(note => note.archived);
            renderArchivedNotes(archivedNotes);
        }
    } catch (error) {
        showResponseMessage(error);
    }
};

// Fungsi untuk menambahkan catatan baru
const insertNote = async (title, body) => {
    try {
        const note = {
            title: title,
            body: body
        };

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': '12345',
            },
            body: JSON.stringify(note),
        };

        const response = await fetch(`${baseUrl}/notes`, options);
        const responseJson = await response.json();
        showResponseMessage(responseJson.message);
        getNote();
    } catch (error) {
        showResponseMessage(error);
    }
};

// Fungsi untuk menghapus catatan
const removeNote = async (id) => {
    try {
        const confirmRemove = confirm('Are you sure you want to remove this note?');
        if (confirmRemove) {
            const options = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Auth-Token': '12345',
                },
            };

            const response = await fetch(`${baseUrl}/notes/${id}`, options);
            const responseJson = await response.json();
            showResponseMessage(responseJson.message);
            getNote();
        }
    } catch (error) {
        showResponseMessage(error);
    }
};

// Event listener untuk opsi archiveOptions
const archiveOptions = document.getElementById('archiveOptions');
archiveOptions.addEventListener('change', () => {
    const selectedOption = archiveOptions.value;
    if (selectedOption === 'archive') {
        getNoteArchive();
    } else if (selectedOption === 'non-archive') {
        getNoteNonArchive();
    }
});

// Fungsi untuk merender catatan
const renderNotes = (notes) => {
    const notesContainer = document.getElementById('notesContainer');
    notesContainer.innerHTML = '';

    notes.forEach((note) => {
        const noteElement = document.createElement('note-element');
        noteElement.dataset.id = note.id;
        noteElement.dataset.title = note.title;
        noteElement.dataset.body = note.body;
        notesContainer.appendChild(noteElement);
    });
};


// Fungsi untuk merender catatan yang diarsipkan
const renderArchivedNotes = (notes) => {
    const notesContainer = document.getElementById('notesContainer');
    notesContainer.innerHTML = '';

    notes.forEach((note) => {
        if (note.archived) {
            const noteElement = document.createElement('note-element');
            noteElement.dataset.id = note.id;
            noteElement.dataset.title = note.title;
            noteElement.dataset.body = note.body;
            notesContainer.appendChild(noteElement);
        }
    });
};

// Fungsi untuk merender catatan yang belum diarsipkan
const renderNonArchivedNotes = (notes) => {
    const notesContainer = document.getElementById('notesContainer');
    notesContainer.innerHTML = '';

    notes.forEach((note) => {
        if (!note.archived) {
            const noteElement = document.createElement('note-element');
            noteElement.dataset.id = note.id;
            noteElement.dataset.title = note.title;
            noteElement.dataset.body = note.body;
            notesContainer.appendChild(noteElement);
        }
    });
};


// Panggil fungsi getNoteNonArchive setelah halaman dimuat
window.addEventListener('DOMContentLoaded', () => {
    getNoteNonArchive();
});
