const modalWrapper = document.querySelector('.modal-wrapper');
// modal add
const addModal = document.querySelector('.add-modal');
const addModalForm = document.querySelector('.add-modal .form');

// modal edit
const editModal = document.querySelector('.edit-modal');
const editModalForm = document.querySelector('.edit-modal .form');

const btnAdd = document.querySelector('.btn-add');

const tableUsers = document.querySelector('.table-users');

let id;
const EMAIL_USER = sessionStorage.getItem('EMAIL');

var email_user = EMAIL_USER;
if (email_user != "a@a.com") {
    window.location.replace("./index.html");
} else {
    // Create element and render users
    const renderUser = doc => {
        const tr = `
    <tr data-id='${doc.id}'>
      <td>${doc.data().fullName}</td>
      <td>${doc.data().nik}</td>
      <td>${doc.data().phoneNumber}</td>
      <td>${doc.data().dateOfBirth}</td>
      <td>${doc.data().address}</td>
      <td>${doc.data().username}</td>
      <td>
        <button class="btn btn-edit">Edit</button>
        <button class="btn btn-delete">Delete</button>
      </td>
    </tr>
  `;
        tableUsers.insertAdjacentHTML('beforeend', tr);

        // Click edit user
        const btnEdit = document.querySelector(`[data-id='${doc.id}'] .btn-edit`);
        btnEdit.addEventListener('click', () => {
            editModal.classList.add('modal-show');

            id = doc.id;
            editModalForm.fullName.value = doc.data().fullName;
            editModalForm.nik.value = doc.data().nik;
            editModalForm.phoneNumber.value = doc.data().phoneNumber;
            editModalForm.dateOfBirth.value = doc.data().dateOfBirth;
            editModalForm.address.value = doc.data().address;



        });

        // Click delete user
        const btnDelete = document.querySelector(`[data-id='${doc.id}'] .btn-delete`);
        btnDelete.addEventListener('click', () => {
            db.collection('users').doc(`${doc.id}`).delete().then(() => {
                console.log('Document succesfully deleted!');
            }).catch(err => {
                console.log('Error removing document', err);
            });
        });

    }

    // Click add user button
    btnAdd.addEventListener('click', () => {
        addModal.classList.add('modal-show');

        addModalForm.fullName.value = '';
        addModalForm.nik.value = '';
        addModalForm.phoneNumber.value = '';
        addModalForm.dateOfBirth.value = '';
        addModalForm.address.value = '';
        addModalForm.username.value = '';
    });

    // User click anyware outside the modal
    window.addEventListener('click', e => {
        if (e.target === addModal) {
            addModal.classList.remove('modal-show');
        }
        if (e.target === editModal) {
            editModal.classList.remove('modal-show');
        }
    });

    // Get all users
    // db.collection('users').get().then(querySnapshot => {
    //   querySnapshot.forEach(doc => {
    //     renderUser(doc);
    //   })
    // });

    // Real time listener
    db.collection('users').onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
                renderUser(change.doc);
            }
            if (change.type === 'removed') {
                let tr = document.querySelector(`[data-id='${change.doc.id}']`);
                let tbody = tr.parentElement;
                tableUsers.removeChild(tbody);
            }
            if (change.type === 'modified') {
                let tr = document.querySelector(`[data-id='${change.doc.id}']`);
                let tbody = tr.parentElement;
                tableUsers.removeChild(tbody);
                renderUser(change.doc);
            }
        })
    })

    // Click submit in add modal
    addModalForm.addEventListener('submit', e => {
        e.preventDefault();
        db.collection('users').add({
            fullName: addModalForm.fullName.value,
            nik: addModalForm.nik.value,
            phoneNumber: addModalForm.phoneNumber.value,
            dateOfBirth: addModalForm.dateOfBirth.value,
            address: addModalForm.address.value,
            username: addModalForm.username.value,
        });
        modalWrapper.classList.remove('modal-show');
    });

    // Click submit in edit modal
    editModalForm.addEventListener('submit', e => {
        e.preventDefault();
        db.collection('users').doc(id).update({
            fullName: editModalForm.fullName.value,
            nik: editModalForm.nik.value,
            phoneNumber: editModalForm.phoneNumber.value,
            dateOfBirth: editModalForm.dateOfBirth.value,
            address: editModalForm.address.value,
        });
        editModal.classList.remove('modal-show');

    });
};