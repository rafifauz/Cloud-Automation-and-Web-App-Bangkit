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
      <td>${doc.data().category}</td>
      <td>${doc.data().content}</td>
      <td><a href="${doc.data().imgContent}">URL</a></td>
      <td>${doc.data().location}</td>
      <td>${doc.data().timeUpload}</td>
      <td>${doc.data().userID}</td>
      <td>${doc.data().like}</td>
      <td>
        <button class="btn btn-edit">Edit</button>
        <button class="btn btn-delete">Delete</button>
      </td>
    </tr>
  `;
    tableReport.insertAdjacentHTML('beforeend', tr);

    // Click edit story
    const btnEdit = document.querySelector(`[data-id='${doc.id}'] .btn-edit`);
    btnEdit.addEventListener('click', () => {
        editModal.classList.add('modal-show');

        id = doc.id;
        editModalForm.category.value = doc.data().category;
        editModalForm.content.value = doc.data().content;
        editModalForm.imgContent.value = doc.data().imgContent;
        editModalForm.location.value = doc.data().location;
        editModalForm.timeUpload.value = doc.data().timeUpload;
        editModalForm.userID.value = doc.data().userID;
        editModalForm.like.value = doc.data().like;
    });

    // Click delete story
    const btnDelete = document.querySelector(`[data-id='${doc.id}'] .btn-delete`);
    btnDelete.addEventListener('click', () => {
        db.collection('story').doc(`${doc.id}`).delete().then(() => {
            console.log('Document succesfully deleted!');
        }).catch(err => {
            console.log('Error removing document', err);
        });
    });

}

// Click add story button
btnAdd.addEventListener('click', () => {
    addModal.classList.add('modal-show');

    addModalForm.category.value = '';
    addModalForm.content.value = '';
    addModalForm.imgContent.value = '';
    addModalForm.location.value = '';
    addModalForm.timeUpload.value = '';
    addModalForm.userID.value = '';
    addModalForm.like.value = '';
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
// db.collection('story').get().then(querySnapshot => {
//   querySnapshot.forEach(doc => {
//     renderUser(doc);
//   })
// });

// Real time listener
db.collection('story').onSnapshot(snapshot => {
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
    db.collection('story').add({
        category: addModalForm.category.value,
        content: addModalForm.content.value,
        imgContent: addModalForm.imgContent.value,
        location: addModalForm.location.value,
        timeUpload: addModalForm.timeUpload.value,
        userID: addModalForm.userID.value,
        like: addModalForm.like.value,
    });
    modalWrapper.classList.remove('modal-show');
});

// Click submit in edit modal
editModalForm.addEventListener('submit', e => {
    e.preventDefault();
    db.collection('story').doc(id).update({
        category: editModalForm.category.value,
        content: editModalForm.content.value,
        imgContent: editModalForm.imgContent.value,
        location: editModalForm.location.value,
        timeUpload: editModalForm.timeUpload.value,
        userID: editModalForm.userID.value,
        like: editModalForm.like.value,
    });
    editModal.classList.remove('modal-show');

});