const modalWrapper = document.querySelector('.modal-wrapper');
// modal add
const addModal = document.querySelector('.add-modal');
const addModalForm = document.querySelector('.add-modal .form');

// modal edit
const editModal = document.querySelector('.edit-modal');
const editModalForm = document.querySelector('.edit-modal .form');

const btnAdd = document.querySelector('.btn-add');

const tableReport = document.querySelector('.table-reports');

let id;

// Create element and render reports
const renderUser = doc => {
    const tr = `
    <tr data-id='${doc.id}'>
      <td>${doc.data().fullname}</td>
      <td>${doc.data().nik}</td>
      <td>${doc.data().phoneNumber}</td>
      <td>${doc.data().ttl}</td>
      <td>${doc.data().uploadTime}</td>
      <td>${doc.data().address}</td>
      <td>${doc.data().category}</td>
      <td>${doc.data().description}</td>
      <td>
        <button class="btn btn-edit">Edit</button>
        <button class="btn btn-delete">Delete</button>
      </td>
    </tr>
  `;
    tableReport.insertAdjacentHTML('beforeend', tr);

    // Click edit report
    const btnEdit = document.querySelector(`[data-id='${doc.id}'] .btn-edit`);
    btnEdit.addEventListener('click', () => {
        editModal.classList.add('modal-show');

        id = doc.id;
        editModalForm.fullname.value = doc.data().fullname;
        editModalForm.nik.value = doc.data().nik;
        editModalForm.phoneNumber.value = doc.data().phoneNumber;
        editModalForm.ttl.value = doc.data().ttl;
        editModalForm.uploadTime.value = doc.data().uploadTime;
        editModalForm.address.value = doc.data().address;
        editModalForm.category.value = doc.data().category;
        editModalForm.description.value = doc.data().description;
    });

    // Click delete report
    const btnDelete = document.querySelector(`[data-id='${doc.id}'] .btn-delete`);
    btnDelete.addEventListener('click', () => {
        db.collection('report').doc(`${doc.id}`).delete().then(() => {
            console.log('Document succesfully deleted!');
        }).catch(err => {
            console.log('Error removing document', err);
        });
    });

}

// Click add report button
btnAdd.addEventListener('click', () => {
    addModal.classList.add('modal-show');

    addModalForm.fullname.value = '';
    addModalForm.nik.value = '';
    addModalForm.phoneNumber.value = '';
    addModalForm.ttl.value = '';
    addModalForm.uploadTime.value = '';
    addModalForm.address.value = '';
    addModalForm.category.value = '';
    addModalForm.description.value = '';
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

// Get all reports
// db.collection('report').get().then(querySnapshot => {
//   querySnapshot.forEach(doc => {
//     renderUser(doc);
//   })
// });

// Real time listener
db.collection('report').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
            renderUser(change.doc);
        }
        if (change.type === 'removed') {
            let tr = document.querySelector(`[data-id='${change.doc.id}']`);
            let tbody = tr.parentElement;
            tableReport.removeChild(tbody);
        }
        if (change.type === 'modified') {
            let tr = document.querySelector(`[data-id='${change.doc.id}']`);
            let tbody = tr.parentElement;
            tableReport.removeChild(tbody);
            renderUser(change.doc);
        }
    })
})

// Click submit in add modal
addModalForm.addEventListener('submit', e => {
    e.preventDefault();
    db.collection('report').add({
        fullname: addModalForm.fullname.value,
        nik: addModalForm.nik.value,
        phoneNumber: addModalForm.phoneNumber.value,
        ttl: addModalForm.ttl.value,
        uploadTime: addModalForm.uploadTime.value,
        address: addModalForm.address.value,
        category: addModalForm.category.value,
        description: addModalForm.description.value,
    });
    modalWrapper.classList.remove('modal-show');
});

// Click submit in edit modal
editModalForm.addEventListener('submit', e => {
    e.preventDefault();
    db.collection('report').doc(id).update({
        fullname: editModalForm.fullname.value,
        nik: editModalForm.nik.value,
        phoneNumber: editModalForm.phoneNumber.value,
        ttl: editModalForm.ttl.value,
        uploadTime: editModalForm.uploadTime.value,
        address: editModalForm.address.value,
        category: editModalForm.category.value,
        description: editModalForm.description.value,


    });
    editModal.classList.remove('modal-show');

});