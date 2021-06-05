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
      <td>${doc.data().FullName}</td>
      <td>${doc.data().NIK}</td>
      <td>${doc.data().PhoneNumber}</td>
      <td>${doc.data().DateOfBirth}</td>
      <td>${doc.data().Address}</td>
      <td>${doc.data().Username}</td>
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
            editModalForm.FullName.value = doc.data().FullName;
            editModalForm.NIK.value = doc.data().NIK;
            editModalForm.PhoneNumber.value = doc.data().PhoneNumber;
            editModalForm.DateOfBirth.value = doc.data().DateOfBirth;
            editModalForm.Address.value = doc.data().Address;



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

        addModalForm.FullName.value = '';
        addModalForm.NIK.value = '';
        addModalForm.PhoneNumber.value = '';
        addModalForm.DateOfBirth.value = '';
        addModalForm.Address.value = '';
        addModalForm.Username.value = '';
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
            FullName: addModalForm.FullName.value,
            NIK: addModalForm.NIK.value,
            PhoneNumber: addModalForm.PhoneNumber.value,
            DateOfBirth: addModalForm.DateOfBirth.value,
            Address: addModalForm.Address.value,
            Username: addModalForm.Username.value,
        });
        modalWrapper.classList.remove('modal-show');
    });

    // Click submit in edit modal
    editModalForm.addEventListener('submit', e => {
        e.preventDefault();
        db.collection('users').doc(id).update({
            FullName: editModalForm.FullName.value,
            NIK: editModalForm.NIK.value,
            PhoneNumber: editModalForm.PhoneNumber.value,
            DateOfBirth: editModalForm.DateOfBirth.value,
            Address: editModalForm.Address.value,
        });
        editModal.classList.remove('modal-show');

    });
};