let selectedNoteId;

class NoteElement extends HTMLElement {
    constructor() {
        super();
        this.addEventListener('click', () => this.openEditPopup());
    }

    connectedCallback() {
        const { id, title, body } = this.dataset;
        this.innerHTML = `
          <div class="note" data-id="${id}">
            <h2>${title}</h2>
            <p>${body}</p>
            <div class="note-actions">
              <button onclick="updateNote('${id}')"><i class="fa-solid fa-user-pen"></i></button>
              <button onclick="removeNote('${id}')"><i class="fa-solid fa-trash"></i></button>
            </div>
          </div>
        `;
      }
    }
customElements.define("note-element", NoteElement);

class AppBar extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
      <header style="background-color: #247ba0; color: #fff; padding: 10px; display: flex; align-items: center; border-radius: 20px; 	border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;">
          <img src="./src/img/icon.png" alt="Logo" style="width: 40px; height: 40px; margin-right: 10px;">
          <h1 style="margin: 0;">My Notes</h1>
      </header>
  `;
    }
}
customElements.define("app-bar", AppBar);

window.addEventListener('DOMContentLoaded', () => {
  const storedData = localStorage.getItem('notesData');
  if(storedData) {
    notesData = JSON.parse(storedData);
    renderNotes();
  }
});

class NoteInput extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="note">
        <textarea id="noteSubject" name="story" rows="2" cols="33" placeholder="Judul"></textarea>
        <textarea id="noteContent" name="story" rows="10" cols="50" placeholder="Isi Note"></textarea>
        <button id="submitNote">Submit</button>
      </div>
    `;

    const submitButton = this.querySelector('#submitNote');
    submitButton.addEventListener('click', () => {
      const noteSubjectInput = this.querySelector('#noteSubject');
      const noteContentInput = this.querySelector('#noteContent');

      const newNote = {
        id: `notes-${Date.now()}`,
        title: noteSubjectInput.value,
        body: noteContentInput.value,
        createdAt: new Date().toISOString(),
        archived: false,
      };

      notesData.push(newNote);

      localStorage.setItem('notesData', JSON.stringify(notesData));

      renderNotes();
    });
  }
}
customElements.define("note-input", NoteInput)



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
      renderNotes(responseJson.notes);
    }
  } catch (error) {
    showResponseMessage(error);
  }
};

getNote();

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

const notesData = [
  {
    id: 'notes-jT-jjsyz61J8XKiI',
    title: 'Welcome to Notes, Dimas!',
    body: 'Welcome to Notes! This is your first note. You can archive it, delete it, or create new ones.',
    createdAt: '2022-07-28T10:03:12.594Z',
    archived: false,
  },
  {
    id: 'notes-aB-cdefg12345',
    title: 'Meeting Agenda',
    body: 'Discuss project updates and assign tasks for the upcoming week.',
    createdAt: '2022-08-05T15:30:00.000Z',
    archived: false,
  },
  {
    id: 'notes-XyZ-789012345',
    title: 'Shopping List',
    body: 'Milk, eggs, bread, fruits, and vegetables.',
    createdAt: '2022-08-10T08:45:23.120Z',
    archived: false,
  },
  {
    id: 'notes-1a-2b3c4d5e6f',
    title: 'Personal Goals',
    body: 'Read two books per month, exercise three times a week, learn a new language.',
    createdAt: '2022-08-15T18:12:55.789Z',
    archived: false,
  },
  {
    id: 'notes-LMN-456789',
    title: 'Recipe: Spaghetti Bolognese',
    body: 'Ingredients: ground beef, tomatoes, onions, garlic, pasta. Steps:...',
    createdAt: '2022-08-20T12:30:40.200Z',
    archived: false,
  },
  {
    id: 'notes-QwErTyUiOp',
    title: 'Workout Routine',
    body: 'Monday: Cardio, Tuesday: Upper body, Wednesday: Rest, Thursday: Lower body, Friday: Cardio.',
    createdAt: '2022-08-25T09:15:17.890Z',
    archived: false,
  },
  {
    id: 'notes-abcdef-987654',
    title: 'Book Recommendations',
    body: "1. 'The Alchemist' by Paulo Coelho\n2. '1984' by George Orwell\n3. 'To Kill a Mockingbird' by Harper Lee",
    createdAt: '2022-09-01T14:20:05.321Z',
    archived: false,
  },
  {
    id: 'notes-zyxwv-54321',
    title: 'Daily Reflections',
    body: 'Write down three positive things that happened today and one thing to improve tomorrow.',
    createdAt: '2022-09-07T20:40:30.150Z',
    archived: false,
  },
  {
    id: 'notes-poiuyt-987654',
    title: 'Travel Bucket List',
    body: '1. Paris, France\n2. Kyoto, Japan\n3. Santorini, Greece\n4. New York City, USA',
    createdAt: '2022-09-15T11:55:44.678Z',
    archived: false,
  },
  {
    id: 'notes-asdfgh-123456',
    title: 'Coding Projects',
    body: '1. Build a personal website\n2. Create a mobile app\n3. Contribute to an open-source project',
    createdAt: '2022-09-20T17:10:12.987Z',
    archived: false,
  },
  {
    id: 'notes-5678-abcd-efgh',
    title: 'Project Deadline',
    body: 'Complete project tasks by the deadline on October 1st.',
    createdAt: '2022-09-28T14:00:00.000Z',
    archived: false,
  },
  {
    id: 'notes-9876-wxyz-1234',
    title: 'Health Checkup',
    body: 'Schedule a routine health checkup with the doctor.',
    createdAt: '2022-10-05T09:30:45.600Z',
    archived: false,
  },
  {
    id: 'notes-qwerty-8765-4321',
    title: 'Financial Goals',
    body: '1. Create a monthly budget\n2. Save 20% of income\n3. Invest in a retirement fund.',
    createdAt: '2022-10-12T12:15:30.890Z',
    archived: false,
  },
  {
    id: 'notes-98765-54321-12345',
    title: 'Holiday Plans',
    body: 'Research and plan for the upcoming holiday destination.',
    createdAt: '2022-10-20T16:45:00.000Z',
    archived: false,
  },
  {
    id: 'notes-1234-abcd-5678',
    title: 'Language Learning',
    body: 'Practice Spanish vocabulary for 30 minutes every day.',
    createdAt: '2022-10-28T08:00:20.120Z',
    archived: false,
  },
];
}
// renderNotes();

// const renderAllNotes = (notes) => {
//   const notesContainer = document.getElementById('notesContainer');
//   notesContainer.innerHTML = '';

//   notes.forEach((note) => {
//     notesContainer.innerHTML += `
//     <div class="note" data-id="${id}">
//     <h2>${note.title}</h2>
//     <p>${note.body}</p>
//     <div class="note-actions">
//       <button onclick="updateNote('${note.id}')"><i class="fa-solid fa-user-pen"></i></button>
//       <button onclick="removeNote('${note.id}')"><i class="fa-solid fa-trash"></i></button>
//     </div>
//   </div>
//     `;
//   });
// }




// function renderNotes = (notes) => {
//   const notesContainer = document.getElementById('notesContainer');
//   notesContainer.innerHTML = '';


//   notes.forEach((note) => {
//     const noteElement = document.createElement('note-element');
//     noteElement.dataset.id = note.id;
//     noteElement.dataset.title = note.title;
//     noteElement.dataset.body = note.body;
//     notesContainer.appendChild(noteElement);
//   });
// }

function updateNote(id) {
  const noteIndex = notesData.findIndex(note => note.id === id);
  if (noteIndex !== -1) {
    const newTitle = prompt('Enter new title for the note:');
    const newBody = prompt('Enter new body for the note:');
    if (newTitle !== null && newBody !== null) {
      notesData[noteIndex].title = newTitle;
      notesData[noteIndex].body = newBody;
      localStorage.setItem('notesData', JSON.stringify(notesData));
      renderNotes();
    }
  }
}

function removeNote(id) {
  const confirmRemove = confirm('Are you sure you want to remove this note?');
  if (confirmRemove) {
    notesData = notesData.filter(note => note.id !== id);
    localStorage.setItem('notesData', JSON.stringify(notesData));
    renderNotes();
  }
}
