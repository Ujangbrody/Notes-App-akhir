let selectedNoteId;

class NoteElement extends HTMLElement {
    constructor() {
        super();
        this.addEventListener('click', () => this.openEditPopup());
    }

    openEditPopup() {
        // Definisikan logika untuk membuka popup edit di sini
        console.log('Edit popup opened');
    }

    
    connectedCallback() {
        const { id, title, body } = this.dataset;
        this.innerHTML = `
          <div class="note" data-id="${id}">
            <h2>${title}</h2>
            <p>${body}</p>
            <div class="note-actions">
              <button onclick="updateNote('${id}')"><i class="fa-solid fa-user-pen"></i>update</button>
              <button onclick="removeNote('${id}')"><i class="fa-solid fa-trash"></i>delete</button>
            </div>
          </div>
        `;
    }
}
customElements.define("note-element", NoteElement);

window.removeNote = async (id) => {
  try {
      const confirmDelete = confirm('Are you sure you want to delete this note?');
      if (confirmDelete) {
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
          getNote(); // Ambil data catatan setelah berhasil menghapus catatan
      }
  } catch (error) {
      showResponseMessage(error);
  }
};

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

window.addEventListener('DOMContentLoaded', () => {
    getNote(); // Panggil fungsi getNote() saat halaman dimuat
});

class NoteInput extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="note">
                <textarea id="noteSubject" name="story" rows="2" cols="33" placeholder="Judul"></textarea>
                <textarea id="noteContent" name="story" rows="10" cols="50" placeholder="Isi Note"></textarea>
                <button id="submitNote">Submit</button>
                <button onclick="getNonArchivedNotes()">Get Non-Archived Notes</button>
              <button onclick="getArchivedNotes()">Get Archived Notes</button>
              <button onclick="getSingleNote()">Get Single Note</button>
              <button onclick="archiveNote()">Archive Note</button>
              <button onclick="unarchiveNote()">Unarchive Note</button>
            </div>
            
        `;

        const submitButton = this.querySelector('#submitNote');
        submitButton.addEventListener('click', () => {
            const noteSubjectInput = this.querySelector('#noteSubject');
            const noteContentInput = this.querySelector('#noteContent');

            insertNote(noteSubjectInput.value, noteContentInput.value); // Panggil fungsi insertNote()
        });
    }
}
customElements.define("note-input", NoteInput);

const showResponseMessage = (message = 'Check your internet connection') => {
    alert(message);
};

const baseUrl = 'https://notes-api.dicoding.dev/v2';

const getNote = async () => {
    try {
        const response = await fetch(`${baseUrl}/notes`);
        const responseJson = await response.json();
        console.log(responseJson.data);
        if (responseJson.error) {
            showResponseMessage(responseJson.message);
        } else {
            renderNotes(responseJson.data);
        }
    } catch (error) {
        showResponseMessage(error);
    }
};

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
        getNote(); // Ambil data catatan baru setelah berhasil membuat catatan
    } catch (error) {
        showResponseMessage(error);
    }
};

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
            getNote(); // Ambil data catatan baru setelah berhasil menghapus catatan
        }
    } catch (error) {
        showResponseMessage(error);
    }
};

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

// Membuat catatan baru
const createNote = async (title, body) => {
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
        getNote(); // Ambil data catatan baru setelah berhasil membuat catatan
    } catch (error) {
        showResponseMessage(error);
    }
};

// Mendapatkan catatan non-archived
const getNonArchivedNotes = async () => {
    try {
        const response = await fetch(`${baseUrl}/notes?archived=false`);
        const responseJson = await response.json();
        console.log(responseJson.data);
        if (responseJson.error) {
            showResponseMessage(responseJson.message);
        } else {
            renderNotes(responseJson.data);
        }
    } catch (error) {
        showResponseMessage(error);
    }
};

// Mendapatkan catatan yang diarsipkan
const getArchivedNotes = async () => {
    try {
        const response = await fetch(`${baseUrl}/notes?archived=true`);
        const responseJson = await response.json();
        console.log(responseJson.data);
        if (responseJson.error) {
            showResponseMessage(responseJson.message);
        } else {
            renderNotes(responseJson.data);
        }
    } catch (error) {
        showResponseMessage(error);
    }
};

// Mendapatkan catatan berdasarkan ID
const getSingleNote = async (id) => {
    try {
        const response = await fetch(`${baseUrl}/notes/${id}`);
        const responseJson = await response.json();
        console.log(responseJson.data);
        if (responseJson.error) {
            showResponseMessage(responseJson.message);
        } else {
            // Kembalikan data catatan
            return responseJson.data;
        }
    } catch (error) {
        showResponseMessage(error);
    }
};

// Mengarsipkan catatan
const archiveNote = async (id) => {
    try {
        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': '12345',
            },
            body: JSON.stringify({ archived: true }),
        };

        const response = await fetch(`${baseUrl}/notes/${id}`, options);
        const responseJson = await response.json();
        showResponseMessage(responseJson.message);
        getNote(); // Ambil data catatan setelah berhasil mengarsipkan catatan
    } catch (error) {
        showResponseMessage(error);
    }
};

// Membatalkan pengarsipan catatan
const unarchiveNote = async (id) => {
    try {
        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': '12345',
            },
            body: JSON.stringify({ archived: false }),
        };

        const response = await fetch(`${baseUrl}/notes/${id}`, options);
        const responseJson = await response.json();
        showResponseMessage(responseJson.message);
        getNote(); // Ambil data catatan setelah berhasil membatalkan pengarsipan catatan
    } catch (error) {
        showResponseMessage(error);
    }
};

// Menghapus catatan
window.deleteNote = async (id) => {
    try {
        const confirmDelete = confirm('Are you sure you want to delete this note?');
        if (confirmDelete) {
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
            getNote(); // Ambil data catatan setelah berhasil menghapus catatan
        }
    } catch (error) {
        showResponseMessage(error);
    }
};
